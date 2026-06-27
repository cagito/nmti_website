#!/usr/bin/env node
/**
 * CLI: acquire / release / status workspace locks (multi-Cursor coordination)
 *
 * Usage:
 *   node scripts/workspace-lock.mjs status
 *   node scripts/workspace-lock.mjs acquire registry --task "Phase AC IMG-024"
 *   node scripts/workspace-lock.mjs release registry
 *   node scripts/workspace-lock.mjs release registry --force
 */
import {
  acquireLock,
  releaseLock,
  listLocks,
  formatLockStatusTable,
  LOCK_SCOPES,
  WorkspaceLockError,
} from './lib/workspace-lock.mjs';

function parseArgs(argv) {
  const [cmd, scope, ...rest] = argv;
  const opts = { task: 'manual', force: false, ttlMinutes: 120, owner: undefined };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--task' && rest[i + 1]) opts.task = rest[++i];
    else if (rest[i] === '--owner' && rest[i + 1]) opts.owner = rest[++i];
    else if (rest[i] === '--ttl' && rest[i + 1]) opts.ttlMinutes = Number(rest[++i]);
    else if (rest[i] === '--force') opts.force = true;
  }
  return { cmd, scope, opts };
}

const { cmd, scope, opts } = parseArgs(process.argv.slice(2));

try {
  if (cmd === 'status' || !cmd) {
    const locks = listLocks();
    console.log('Workspace locks — docs/98\n');
    console.log(formatLockStatusTable(locks));
    console.log('\nScopes:');
    for (const [k, v] of Object.entries(LOCK_SCOPES)) {
      console.log(`  ${k}: ${v}`);
    }
    const busy = locks.some((l) => l.status === 'held');
    process.exit(busy ? 2 : 0);
  }

  if (cmd === 'acquire') {
    if (!scope) {
      console.error('Usage: workspace-lock.mjs acquire <registry|images|build|full> --task "..."');
      process.exit(1);
    }
    const meta = acquireLock(scope, { ...opts, sessionLock: true });
    console.log(`Acquired: ${meta.scopes.join(', ')} as ${meta.owner}`);
    console.log(`Task: ${opts.task}`);
    console.log('Release: npm run lock:release --', scope.split(' ')[0] === 'full' ? 'full' : scope);
    process.exit(0);
  }

  if (cmd === 'release') {
    if (!scope) {
      console.error('Usage: workspace-lock.mjs release <scope> [--force]');
      process.exit(1);
    }
    releaseLock(scope, opts);
    console.log(`Released: ${scope}`);
    process.exit(0);
  }

  if (cmd === 'release-all') {
    for (const s of Object.keys(LOCK_SCOPES)) {
      try {
        releaseLock(s, { force: true });
      } catch {
        /* ignore */
      }
    }
    console.log('All locks released (--force)');
    process.exit(0);
  }

  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
} catch (err) {
  if (err instanceof WorkspaceLockError) {
    console.error(err.message);
    if (err.holder) {
      console.error(
        `  holder: ${err.holder.owner} · pid ${err.holder.pid} · since ${err.holder.acquiredAt}`
      );
    }
    console.error('Hint: npm run lock:status · other Cursor window must release first.');
    process.exit(3);
  }
  throw err;
}
