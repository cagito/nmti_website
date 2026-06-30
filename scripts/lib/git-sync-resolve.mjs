/**
 * Pure newest-wins resolution (testable without git).
 *
 * Strongest defaults (conservative=true):
 * - Uncommitted local changes → never take-remote
 * - Timestamp gap ≤ ambiguityWindowSec → skip (no overwrite)
 * - blockRemoteWins → skip remote wins
 *
 * @param {{
 *   localTs: number;
 *   remoteTs: number;
 *   localHash: string | null;
 *   headHash: string | null;
 *   remoteHash: string | null;
 *   localExists: boolean;
 *   remoteExists: boolean;
 *   blockRemoteWins?: boolean;
 *   hasUncommittedChanges?: boolean;
 *   conservative?: boolean;
 *   ambiguityWindowSec?: number;
 *   forceRemote?: boolean;
 * }} input
 * @returns {'keep-local' | 'take-remote' | 'skip-same' | 'skip-tie' | 'skip-ambiguous' | 'skip-blocked' | 'skip-uncommitted' | null}
 */
export function resolveNewestAction(input) {
  const {
    localTs,
    remoteTs,
    localHash,
    headHash,
    remoteHash,
    localExists,
    remoteExists,
    blockRemoteWins = false,
    hasUncommittedChanges = false,
    conservative = true,
    ambiguityWindowSec = 120,
    forceRemote = false,
  } = input;

  const effectiveLocal = localHash ?? headHash;
  if (effectiveLocal && remoteHash && effectiveLocal === remoteHash) {
    return 'skip-same';
  }

  // Strongest: working tree edits always beat remote (unless --force-remote)
  if (hasUncommittedChanges && !forceRemote) {
    if (localExists || effectiveLocal) return 'keep-local';
    return 'skip-uncommitted';
  }

  if (localExists && !remoteExists) return 'keep-local';
  if (!localExists && remoteExists) {
    if (blockRemoteWins) return 'skip-blocked';
    return 'take-remote';
  }
  if (!localExists && !remoteExists) return null;

  const gap = Math.abs(localTs - remoteTs);

  if (conservative && gap <= ambiguityWindowSec) {
    if (localTs === remoteTs) return 'skip-tie';
    return 'skip-ambiguous';
  }

  if (localTs > remoteTs) return 'keep-local';
  if (remoteTs > localTs) {
    if (blockRemoteWins) return 'skip-blocked';
    return 'take-remote';
  }
  return 'skip-tie';
}

/** Default policy for production (RaiDrive-safe). */
export const STRONG_SYNC_DEFAULTS = {
  conservative: true,
  ambiguityWindowSec: 120,
  trustMtime: false,
  backup: true,
};
