/**
 * Multi-Cursor / multi-agent workspace lock (file-based, scope-separated).
 * docs/98-다중-Cursor-동시작업-충돌방지.md
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { hostname } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scopesForPath } from './guarded-paths.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LOCK_DIR = join(ROOT, '.cursor', 'locks');

/** @type {Map<string, string>} */
const heldByProcess = new Map();

export const LOCK_SCOPES = {
  registry: 'image-review-registry · canonical-image-webp · policy JSON',
  images: 'assets/images/technology WebP/source',
  build: 'images.js · content-data · sitemap generators',
  full: 'registry + images + build (단일 쓰기 세션)',
};

export class WorkspaceLockError extends Error {
  constructor(message, { scope, holder } = {}) {
    super(message);
    this.name = 'WorkspaceLockError';
    this.scope = scope;
    this.holder = holder;
  }
}

function lockPath(scope) {
  return join(LOCK_DIR, `${scope}.lock`);
}

function defaultOwner() {
  if (process.env.CURSOR_LOCK_OWNER) return process.env.CURSOR_LOCK_OWNER;
  if (process.env.CURSOR_AGENT_ID) return process.env.CURSOR_AGENT_ID;
  return `${hostname()}-pid${process.pid}`;
}

function expandScopes(scope) {
  if (scope === 'full') return ['registry', 'images', 'build'];
  return [scope];
}

function readLock(scope) {
  const path = lockPath(scope);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return { scope, owner: '?', pid: 0, corrupted: true };
  }
}

function isExpired(lock) {
  if (!lock?.expiresAt) return true;
  return Date.parse(lock.expiresAt) < Date.now();
}

function isPidAlive(pid) {
  if (pid === 0) return true; // session lock (lock:acquire CLI — release 명시까지 유지)
  if (!pid || pid < 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function canSteal(lock, { force }) {
  if (force) return true;
  if (!lock) return true;
  if (lock.corrupted) return true;
  if (isExpired(lock)) return true;
  if (!isPidAlive(lock.pid)) return true;
  return false;
}

function writeLock(scope, payload) {
  mkdirSync(LOCK_DIR, { recursive: true });
  const path = lockPath(scope);
  try {
    writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' });
  } catch (err) {
    if (err?.code === 'EEXIST') {
      const holder = readLock(scope);
      throw new WorkspaceLockError(
        `Lock busy: scope="${scope}" held by ${holder?.owner} (pid ${holder?.pid}, task: ${holder?.task || '—'})`,
        { scope, holder }
      );
    }
    throw err;
  }
  heldByProcess.set(scope, payload.owner);
}

/**
 * @param {string} scope
 * @param {{ task?: string, owner?: string, ttlMinutes?: number, force?: boolean }} [opts]
 */
export function acquireLock(scope, opts = {}) {
  const {
    task = 'unspecified',
    owner = defaultOwner(),
    ttlMinutes = 120,
    force = false,
    sessionLock = false,
  } = opts;

  for (const s of expandScopes(scope)) {
    const existing = readLock(s);
    if (existing && !canSteal(existing, { force })) {
      if (existing.owner === owner && existing.pid === process.pid) {
        heldByProcess.set(s, owner);
        continue;
      }
      if (existing.owner === owner && existing.sessionLock) {
        heldByProcess.set(s, owner);
        continue;
      }
      throw new WorkspaceLockError(
        `Cannot acquire "${s}": held by ${existing.owner} (pid ${existing.pid}, task: ${existing.task || '—'}). Run: npm run lock:status`,
        { scope: s, holder: existing }
      );
    }
    if (existing && canSteal(existing, { force })) {
      try {
        unlinkSync(lockPath(s));
      } catch {
        /* ignore */
      }
    }

    const acquiredAt = new Date();
    const expiresAt = new Date(acquiredAt.getTime() + ttlMinutes * 60_000);
    writeLock(s, {
      scope: s,
      owner,
      pid: sessionLock ? 0 : process.pid,
      sessionLock,
      hostname: hostname(),
      task,
      acquiredAt: acquiredAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ttlMinutes,
    });
  }

  return { owner, scopes: expandScopes(scope) };
}

/**
 * @param {string} scope
 * @param {{ owner?: string, force?: boolean }} [opts]
 */
export function releaseLock(scope, opts = {}) {
  const { owner = defaultOwner(), force = false } = opts;
  for (const s of expandScopes(scope)) {
    const path = lockPath(s);
    if (!existsSync(path)) continue;
    const existing = readLock(s);
    if (
      !force &&
      existing &&
      existing.owner !== owner &&
      existing.pid !== process.pid &&
      !heldByProcess.has(s)
    ) {
      throw new WorkspaceLockError(
        `Cannot release "${s}": owned by ${existing.owner}, not ${owner}. Use --force if stale.`,
        { scope: s, holder: existing }
      );
    }
    unlinkSync(path);
    heldByProcess.delete(s);
  }
}

export function listLocks() {
  mkdirSync(LOCK_DIR, { recursive: true });
  const scopes = Object.keys(LOCK_SCOPES);
  return scopes.map((scope) => {
    const lock = readLock(scope);
    if (!lock) return { scope, status: 'free' };
    const stale = isExpired(lock) || !isPidAlive(lock.pid);
    return {
      scope,
      status: stale ? 'stale' : 'held',
      ...lock,
    };
  });
}

/**
 * @param {string} scope
 * @param {{ task?: string, owner?: string, ttlMinutes?: number, force?: boolean }} opts
 * @param {() => void | Promise<void>} fn
 */
export async function withWorkspaceLock(scope, opts, fn) {
  const meta = acquireLock(scope, opts);
  try {
    await fn();
  } finally {
    try {
      releaseLock(scope, { owner: meta.owner });
    } catch {
      /* process exit cleanup */
    }
  }
}

export function formatLockStatusTable(locks) {
  const lines = ['Scope      Status  Owner                    Task'];
  for (const row of locks) {
    if (row.status === 'free') {
      lines.push(`${row.scope.padEnd(10)} FREE    —                        —`);
      continue;
    }
    lines.push(
      `${row.scope.padEnd(10)} ${row.status.toUpperCase().padEnd(7)} ${String(row.owner || '').slice(0, 24).padEnd(24)} ${String(row.task || '').slice(0, 40)}`
    );
  }
  return lines.join('\n');
}

function expandScopesForCheck(scopes) {
  const out = new Set();
  for (const s of scopes) {
    for (const x of expandScopes(s)) out.add(x);
  }
  return [...out];
}

/**
 * Another live session holds this scope (not this process / owner).
 * @param {string} scope
 * @returns {object | null}
 */
export function getBlockingHolder(scope) {
  const lock = readLock(scope);
  if (!lock) return null;
  if (isExpired(lock)) return null;
  if (!isPidAlive(lock.pid)) return null;
  const owner = defaultOwner();
  if (lock.pid === process.pid && lock.pid !== 0) return null;
  if (lock.owner === owner && lock.sessionLock) return null;
  if (heldByProcess.has(scope)) return null;
  return lock;
}

/**
 * @param {string} scope
 * @returns {object | null}
 */
export function getBlockingHolderExpanded(scope) {
  for (const s of expandScopes(scope)) {
    const holder = getBlockingHolder(s);
    if (holder) return { scope: s, ...holder };
  }
  return null;
}

/**
 * Block writes when another Cursor session holds the lock.
 * @param {string} filePath
 */
export function assertWriteAllowed(filePath) {
  if (process.env.CURSOR_LOCK_BYPASS === '1') return;
  if (process.argv.includes('--no-lock')) return;

  const scopes = scopesForPath(filePath);
  for (const scope of scopes) {
    const holder = getBlockingHolder(scope);
    if (holder) {
      throw new WorkspaceLockError(
        `Write blocked: "${scope}" locked by ${holder.owner} (pid ${holder.pid}, task: ${holder.task || '—'}). npm run lock:status`,
        { scope, holder }
      );
    }
  }
}

/**
 * @param {string[]} scopes
 * @returns {{ scope: string, holder: object } | null}
 */
export function findCrossSessionBlock(scopes) {
  for (const scope of expandScopesForCheck(scopes)) {
    const holder = getBlockingHolder(scope);
    if (holder) return { scope, holder };
  }
  return null;
}
