#!/usr/bin/env node
/**
 * Newest-wins git sync: local ↔ origin by per-file timestamp.
 * - No git reset --hard, no stash.
 * - Ambiguous tie → skip (keep both sides unchanged for that file).
 * - Push failure while ahead → remote wins blocked for that cycle.
 * - Strong mode (default): no FTP mtime · uncommitted → never take-remote · ±2min ambiguous → skip
 *
 * Usage:
 *   node scripts/git-sync-newest.mjs [--dry-run] [--no-commit] [--no-push] [--branch main] [--root PATH]
 *   [--aggressive] [--force-remote]   (opt-out / override strong defaults)
 *
 * Env: GIT_SYNC_BRANCH, GIT_SYNC_AUTO_COMMIT, GIT_SYNC_AUTO_PUSH, GIT_SYNC_DRY_RUN, GIT_SYNC_BACKUP
 *      GIT_SYNC_CONSERVATIVE (default 1), GIT_SYNC_AMBIGUITY_SEC (default 120), GIT_SYNC_TRUST_MTIME
 *      GIT_SYNC_FORCE_REMOTE (default 0)
 */
import { spawnSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { anyPathNeedsBuild } from './lib/git-sync-utils.mjs';
import { resolveNewestAction, STRONG_SYNC_DEFAULTS } from './lib/git-sync-resolve.mjs';
import { findCrossSessionBlock } from './lib/workspace-lock.mjs';

const SCRIPT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const argv = process.argv.slice(2);
const aggressive = argv.includes('--aggressive') || process.env.GIT_SYNC_AGGRESSIVE === '1';
const flags = {
  dryRun: argv.includes('--dry-run') || process.env.GIT_SYNC_DRY_RUN === '1',
  autoCommit:
    !argv.includes('--no-commit') && process.env.GIT_SYNC_AUTO_COMMIT !== '0',
  autoPush: !argv.includes('--no-push') && process.env.GIT_SYNC_AUTO_PUSH !== '0',
  backup: process.env.GIT_SYNC_BACKUP !== '0' && STRONG_SYNC_DEFAULTS.backup,
  conservative:
    !aggressive &&
    process.env.GIT_SYNC_CONSERVATIVE !== '0' &&
    STRONG_SYNC_DEFAULTS.conservative,
  ambiguityWindowSec: Number(process.env.GIT_SYNC_AMBIGUITY_SEC) || STRONG_SYNC_DEFAULTS.ambiguityWindowSec,
  trustMtime: process.env.GIT_SYNC_TRUST_MTIME === '1' || STRONG_SYNC_DEFAULTS.trustMtime,
  forceRemote: argv.includes('--force-remote') || process.env.GIT_SYNC_FORCE_REMOTE === '1',
};

const branchIdx = argv.indexOf('--branch');
const rootIdx = argv.indexOf('--root');
const BRANCH =
  (branchIdx >= 0 ? argv[branchIdx + 1] : null) ||
  process.env.GIT_SYNC_BRANCH ||
  process.env.BRANCH ||
  'main';

const ROOT =
  (rootIdx >= 0 ? argv[rootIdx + 1] : null) || process.env.GIT_SYNC_ROOT || SCRIPT_ROOT;

const REMOTE_REF = `origin/${BRANCH}`;
const LOG_DIR = join(ROOT, 'logs', 'git-sync');
const BACKUP_ROOT = join(ROOT, '.git-sync-backup');
const LAST_RUN_PATH = join(ROOT, '.git-sync-last-run.json');

/** @type {string[]} */
const logLines = [];

function log(msg) {
  const line = `[git-sync] ${msg}`;
  console.log(line);
  logLines.push(line);
}

function git(args, { trim = true, allowFail = false } = {}) {
  const r = spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0 && !allowFail) {
    const err = (r.stderr || r.stdout || '').trim();
    throw new Error(`git ${args.join(' ')} failed (${r.status}): ${err}`);
  }
  return trim ? (r.stdout ?? '').trim() : (r.stdout ?? '');
}

function gitOk(args) {
  return spawnSync('git', args, { cwd: ROOT }).status === 0;
}

function gitInProgress() {
  if (git(['diff', '--name-only', '--diff-filter=U'], { allowFail: true })) {
    return 'unmerged files';
  }
  if (gitOk(['rev-parse', '-q', '--verify', 'MERGE_HEAD'])) return 'merge in progress';
  if (gitOk(['rev-parse', '-q', '--verify', 'REBASE_HEAD'])) return 'rebase in progress';
  if (gitOk(['rev-parse', '-q', '--verify', 'CHERRY_PICK_HEAD'])) return 'cherry-pick in progress';
  return null;
}

function branchCounts() {
  const out = git(['rev-list', '--left-right', '--count', `HEAD...${REMOTE_REF}`]);
  const [ahead, behind] = out.split(/\s+/).map(Number);
  return { ahead, behind };
}

function isDirty() {
  return git(['status', '--porcelain']).length > 0;
}

function collectCandidatePaths() {
  const sets = [
    git(['diff', '--name-only', 'HEAD', REMOTE_REF], { allowFail: true }),
    git(['diff', '--name-only', 'HEAD'], { allowFail: true }),
    git(['diff', '--name-only', '--cached', 'HEAD'], { allowFail: true }),
  ];
  const paths = new Set();
  for (const block of sets) {
    for (const line of block.split('\n')) {
      const p = line.trim();
      if (p) paths.add(p.replace(/\\/g, '/'));
    }
  }
  return [...paths].sort();
}

function lastCommitTime(ref, path) {
  const out = git(['log', '-1', '--format=%ct', ref, '--', path], {
    allowFail: true,
  });
  if (!out) return 0;
  const n = Number(out);
  return Number.isFinite(n) ? n : 0;
}

function refHasPath(ref, path) {
  return gitOk(['cat-file', '-e', `${ref}:${path}`]);
}

function workingTreePath(path) {
  return join(ROOT, ...path.split('/'));
}

function localTimestamp(path) {
  let ts = lastCommitTime('HEAD', path);
  if (flags.trustMtime) {
    const abs = workingTreePath(path);
    if (existsSync(abs)) {
      try {
        ts = Math.max(ts, Math.floor(statSync(abs).mtimeMs / 1000));
      } catch {
        /* ignore */
      }
    }
  }
  if (hasUncommittedChanges(path)) {
    ts = Math.max(ts, Math.floor(Date.now() / 1000));
  }
  return ts;
}

function hasUncommittedChanges(path) {
  const wtDiff = git(['diff', '--name-only', 'HEAD', '--', path], { allowFail: true });
  const stagedDiff = git(['diff', '--name-only', '--cached', 'HEAD', '--', path], {
    allowFail: true,
  });
  return Boolean(wtDiff || stagedDiff);
}

function remoteTimestamp(path) {
  if (!refHasPath(REMOTE_REF, path)) return 0;
  return lastCommitTime(REMOTE_REF, path);
}

function blobHash(ref, path) {
  if (!refHasPath(ref, path)) return null;
  return git(['rev-parse', `${ref}:${path}`], { allowFail: true }) || null;
}

function workingTreeHash(path) {
  if (!existsSync(workingTreePath(path))) return null;
  try {
    return git(['hash-object', path]);
  } catch {
    return null;
  }
}

function backupFile(path) {
  if (!flags.backup) return null;
  const abs = workingTreePath(path);
  if (!existsSync(abs)) return null;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = join(BACKUP_ROOT, stamp, path);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(abs, dest);
  return relative(ROOT, dest);
}

function writeLastRun(payload) {
  atomicWriteUtf8(LAST_RUN_PATH, JSON.stringify(payload, null, 2) + '\n');
}

function appendLogFile() {
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 10);
    writeFileSync(join(LOG_DIR, `${stamp}.log`), logLines.join('\n') + '\n', {
      encoding: 'utf8',
      flag: 'a',
    });
  } catch {
    /* non-fatal */
  }
}

function tryPush() {
  if (!flags.autoPush) {
    log('push skipped (AUTO_PUSH=0)');
    return { ok: false, skipped: true };
  }
  if (flags.dryRun) {
    log(`dry-run: would push origin ${BRANCH}`);
    return { ok: true, skipped: true };
  }
  try {
    git(['push', 'origin', `HEAD:${BRANCH}`]);
    log('push OK');
    return { ok: true };
  } catch (e) {
    log(`push FAILED: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

function tryPullFfOnly() {
  if (flags.dryRun) {
    log(`dry-run: would pull --ff-only origin ${BRANCH}`);
    return;
  }
  git(['pull', '--ff-only', 'origin', BRANCH]);
  log('pull --ff-only OK');
}

function tryMergeRemote() {
  if (flags.dryRun) {
    log(`dry-run: would merge ${REMOTE_REF} after newest-wins`);
    return false;
  }
  try {
    git([
      'merge',
      REMOTE_REF,
      '-m',
      `git-sync: merge ${REMOTE_REF} after newest-wins (${new Date().toISOString()})`,
      '--no-edit',
    ]);
    log('merge remote OK');
    return true;
  } catch (e) {
    log(`WARN: merge ${REMOTE_REF} failed — resolve manually: ${e.message}`);
    return false;
  }
}

/**
 * @returns {{ action: string, path: string, localTs: number, remoteTs: number, backup?: string } | null}
 */
function resolveFile(path, { blockRemoteWins }) {
  const localHash = workingTreeHash(path);
  const headHash = blobHash('HEAD', path);
  const remoteHash = blobHash(REMOTE_REF, path);
  const localTs = localTimestamp(path);
  const remoteTs = remoteTimestamp(path);
  const localExists = existsSync(workingTreePath(path)) || !!headHash;
  const remoteExists = !!remoteHash;
  const uncommitted = hasUncommittedChanges(path);

  const decision = resolveNewestAction({
    localTs,
    remoteTs,
    localHash,
    headHash,
    remoteHash,
    localExists,
    remoteExists,
    blockRemoteWins,
    hasUncommittedChanges: uncommitted,
    conservative: flags.conservative,
    ambiguityWindowSec: flags.ambiguityWindowSec,
    forceRemote: flags.forceRemote,
  });

  if (decision === 'skip-same' || decision === null) return null;
  if (decision === 'skip-tie') {
    log(`SKIP ${path}: tie localTs=remoteTs=${localTs} — conservative no-overwrite`);
    return null;
  }
  if (decision === 'skip-ambiguous') {
    log(
      `SKIP ${path}: ambiguous gap=${Math.abs(localTs - remoteTs)}s ≤ ${flags.ambiguityWindowSec}s — no overwrite`
    );
    return null;
  }
  if (decision === 'skip-blocked') {
    log(
      `SKIP ${path}: remote wins blocked (localTs=${localTs} remoteTs=${remoteTs} exists=${localExists}/${remoteExists})`
    );
    return null;
  }
  if (decision === 'skip-uncommitted') {
    log(`SKIP ${path}: uncommitted local, no local blob — manual review`);
    return null;
  }

  return {
    action: decision,
    path,
    localTs,
    remoteTs,
    uncommitted,
  };
}

function applyAction(item) {
  const { action, path } = item;
  if (action === 'keep-local') {
    if (flags.dryRun) {
      log(`dry-run: keep local ${path}`);
      return;
    }
    git(['add', '--', path]);
    log(`keep local ${path}`);
    return;
  }
  if (action === 'take-remote') {
    if (flags.dryRun) {
      log(`dry-run: take remote ${path}`);
      return;
    }
    if (!item.backup) {
      const bak = backupFile(path);
      if (bak) item.backup = bak;
    }
    git(['checkout', REMOTE_REF, '--', path]);
    log(`take remote ${path}${item.backup ? ` (backup ${item.backup})` : ''}`);
  }
}

function autoCommit() {
  if (!flags.autoCommit) {
    log('commit skipped (AUTO_COMMIT=0)');
    return false;
  }
  const staged = git(['diff', '--name-only', '--cached'], { allowFail: true });
  if (!staged) return false;

  const msg = `git-sync: newest-wins auto-sync (${new Date().toISOString()})`;
  if (flags.dryRun) {
    log(`dry-run: would commit — ${msg}`);
    return true;
  }
  git(['commit', '-m', msg]);
  log('commit OK');
  return true;
}

function finish(payload) {
  writeLastRun(payload);
  appendLogFile();
}

function main() {
  log(
    `start root=${ROOT} branch=${BRANCH} dryRun=${flags.dryRun} conservative=${flags.conservative} ambiguitySec=${flags.ambiguityWindowSec} trustMtime=${flags.trustMtime}`
  );

  const inProg = gitInProgress();
  if (inProg) {
    log(`ABORT: git operation in progress (${inProg}) — resolve manually`);
    process.exit(2);
  }

  if (ROOT === SCRIPT_ROOT) {
    const block = findCrossSessionBlock(['full', 'registry', 'build', 'images']);
    if (block) {
      log(
        `ABORT: workspace lock held scope=${block.scope} owner=${block.holder.owner} task=${block.holder.task || '—'}`
      );
      process.exit(3);
    }
  }

  git(['fetch', 'origin', BRANCH]);

  if (!gitOk(['rev-parse', '--verify', REMOTE_REF])) {
    log(`ABORT: ${REMOTE_REF} not found after fetch`);
    process.exit(1);
  }

  const { ahead, behind } = branchCounts();
  const dirty = isDirty();
  log(`state ahead=${ahead} behind=${behind} dirty=${dirty}`);

  /** @type {string[]} */
  const changedPaths = [];
  let pullPerformed = false;
  let pushPerformed = false;
  let pushBlocked = false;
  let mergePerformed = false;

  if (!dirty && ahead === 0 && behind > 0) {
    tryPullFfOnly();
    pullPerformed = true;
    const pulled = git(['diff', '--name-only', 'ORIG_HEAD', 'HEAD'], { allowFail: true })
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    changedPaths.push(...pulled);
    finish({
      ts: new Date().toISOString(),
      ahead,
      behind,
      dirty,
      pullPerformed,
      pushPerformed,
      changedPaths,
      shouldBuild: anyPathNeedsBuild(pulled),
    });
    log('done (ff-only pull)');
    return;
  }

  if (!dirty && ahead > 0 && behind === 0) {
    const pr = tryPush();
    pushPerformed = !pr.skipped && pr.ok;
    if (!pr.ok && !pr.skipped) pushBlocked = true;
    finish({
      ts: new Date().toISOString(),
      ahead,
      behind,
      dirty,
      pullPerformed,
      pushPerformed,
      pushBlocked,
      changedPaths,
      shouldBuild: false,
    });
    log(`done (push-only ok=${pr.ok})`);
    return;
  }

  if (!dirty && ahead === 0 && behind === 0) {
    finish({
      ts: new Date().toISOString(),
      ahead,
      behind,
      dirty,
      changedPaths: [],
      shouldBuild: false,
    });
    log('done (already up to date)');
    return;
  }

  const diverged = ahead > 0 && behind > 0;

  if (ahead > 0 && flags.autoPush && !diverged) {
    const pr = tryPush();
    pushPerformed = !pr.skipped && pr.ok;
    if (!pr.ok && !pr.skipped) {
      pushBlocked = true;
      log('push blocked — remote-wins disabled this cycle');
    } else if (pr.ok) {
      git(['fetch', 'origin', BRANCH]);
    }
  }

  let { ahead: aheadNow, behind: behindNow } = branchCounts();
  const blockRemoteWins = pushBlocked || (aheadNow > 0 && !pushPerformed && !diverged);

  const paths = collectCandidatePaths();
  log(`candidate paths: ${paths.length}`);

  /** @type {NonNullable<ReturnType<typeof resolveFile>>[]} */
  const actions = [];
  for (const path of paths) {
    const item = resolveFile(path, { blockRemoteWins });
    if (item) actions.push(item);
  }

  const takeRemote = actions.filter((a) => a.action === 'take-remote');
  if (takeRemote.length && flags.backup && !flags.dryRun) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    for (const item of takeRemote) {
      const abs = workingTreePath(item.path);
      if (!existsSync(abs)) continue;
      const dest = join(BACKUP_ROOT, stamp, item.path);
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(abs, dest);
      item.backup = relative(ROOT, dest);
    }
    log(`pre-batch backup: ${takeRemote.length} file(s) → .git-sync-backup/${stamp}/`);
  }

  for (const item of actions) {
    applyAction(item);
    changedPaths.push(item.path);
  }

  const committed = autoCommit();

  if ((diverged || behindNow > 0) && !pushBlocked && !blockRemoteWins) {
    mergePerformed = tryMergeRemote();
    if (mergePerformed) {
      git(['fetch', 'origin', BRANCH]);
    }
  } else if ((diverged || behindNow > 0) && (pushBlocked || blockRemoteWins)) {
    log('SKIP merge: push blocked — manual merge after push succeeds');
  }

  const { ahead: ahead2, behind: behind2 } = branchCounts();
  if (flags.autoPush && (committed || mergePerformed || (ahead2 > 0 && !pushPerformed))) {
    const pr = tryPush();
    pushPerformed = pushPerformed || (!pr.skipped && pr.ok);
    if (!pr.ok && !pr.skipped) pushBlocked = true;
  }

  if (behind2 > 0 && ahead2 === 0 && !isDirty() && !flags.dryRun) {
    try {
      tryPullFfOnly();
      pullPerformed = true;
    } catch (e) {
      log(`WARN: post-sync ff-only pull failed: ${e.message}`);
    }
  }

  finish({
    ts: new Date().toISOString(),
    ahead: ahead2,
    behind: behind2,
    dirty: isDirty(),
    pullPerformed,
    pushPerformed,
    pushBlocked,
    mergePerformed,
    diverged,
    changedPaths,
    shouldBuild: anyPathNeedsBuild(changedPaths),
    policy: {
      conservative: flags.conservative,
      ambiguityWindowSec: flags.ambiguityWindowSec,
      trustMtime: flags.trustMtime,
      forceRemote: flags.forceRemote,
    },
    actions: actions.map((a) => ({
      path: a.path,
      action: a.action,
      localTs: a.localTs,
      remoteTs: a.remoteTs,
      uncommitted: a.uncommitted,
      backup: a.backup,
    })),
  });
  log(
    `done changed=${changedPaths.length} pull=${pullPerformed} push=${pushPerformed} merge=${mergePerformed}`
  );
}

try {
  main();
} catch (e) {
  log(`ERROR: ${e.message}`);
  appendLogFile();
  process.exit(1);
}
