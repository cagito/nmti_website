#!/usr/bin/env node
/**
 * Cursor sessionStart — inject current lock status for multi-window awareness.
 */
import { readFileSync } from 'fs';
import { listLocks, formatLockStatusTable } from '../../scripts/lib/workspace-lock.mjs';

try {
  readFileSync(0, 'utf8');
} catch {
  /* ignore */
}

const locks = listLocks();
const held = locks.filter((l) => l.status === 'held');

if (!held.length) {
  console.log(
    JSON.stringify({
      additional_context:
        'LOCK-01: workspace locks 모두 FREE. registry/이미지/빌드 쓰기 전 다른 Cursor 창이 있으면 `npm run lock:status` 권장. 정본: docs/98',
    })
  );
  process.exit(0);
}

console.log(
  JSON.stringify({
    additional_context: `LOCK-01 — 다른 세션 잠금 활성:\n${formatLockStatusTable(locks)}\n쓰기 전 npm run lock:status · 정본 docs/98`,
  })
);
