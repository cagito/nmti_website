import { acquireLock, releaseLock, WorkspaceLockError } from './workspace-lock.mjs';

/**
 * Wrap CLI main() with workspace lock. Pass --no-lock to skip (CI only).
 * @param {string} scope
 * @param {string} task
 * @param {() => void} main
 */
export function runLocked(scope, task, main) {
  const noLock = process.argv.includes('--no-lock');
  let meta;
  if (!noLock) {
    try {
      meta = acquireLock(scope, { task });
    } catch (err) {
      if (err instanceof WorkspaceLockError) {
        console.error(err.message);
        process.exit(3);
      }
      throw err;
    }
  }
  try {
    main();
  } finally {
    if (meta) {
      try {
        releaseLock(scope, { owner: meta.owner });
      } catch {
        /* exit race */
      }
    }
  }
}
