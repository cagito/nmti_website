/**
 * 재작도 redline 파일 존재 검증 (W1~W11 · 69종)
 * Usage: node scripts/validate-rework-redlines.mjs [--strict]
 */
import { existsSync } from 'fs';
import { join } from 'path';
import {
  REDLINES_DIR,
  REDLINE_CANONICAL,
  REDLINE_SUPPLEMENT,
  allReworkIds,
} from './lib/rework-phases.mjs';

const strict = process.argv.includes('--strict');
const missing = [];
const ok = [];

for (const id of allReworkIds()) {
  const canon = REDLINE_CANONICAL[id];
  if (!canon) {
    missing.push({ id, file: '(no mapping)', reason: 'REDLINE_CANONICAL' });
    continue;
  }
  const path = join(REDLINES_DIR, canon);
  if (!existsSync(path)) {
    missing.push({ id, file: canon, reason: 'missing' });
    continue;
  }
  ok.push(id);
  const sup = REDLINE_SUPPLEMENT[id];
  if (sup) {
    const supPath = join(REDLINES_DIR, sup);
    if (!existsSync(supPath)) {
      missing.push({ id, file: sup, reason: 'supplement missing' });
    }
  }
}

console.log(`rework redlines: ${ok.length}/${allReworkIds().length} canonical OK`);
if (missing.length) {
  for (const m of missing) {
    console.error(`MISSING ${m.id}: ${m.file} (${m.reason})`);
  }
  if (strict) process.exit(1);
} else {
  console.log('PASS — all canonical redlines present');
}
