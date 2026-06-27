/**
 * patch:registry-phase-* 적용 여부 요약
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT, PHASES } from './lib/rework-phases.mjs';

const registry = JSON.parse(
  readFileSync(join(REWORK_ROOT, 'scripts', 'image-review-registry.json'), 'utf8'),
);

console.log('patch:registry-phase-* 현황\n');
console.log('phase  patch                    reaudit/total');
console.log('─'.repeat(52));

for (const p of PHASES) {
  if (!p.patch) continue;
  let ra = 0;
  for (const id of p.ids) {
    if (registry[id]?.requiresReaudit === true) ra++;
  }
  const mark = ra === p.ids.length ? 'OK' : ra === 0 ? 'cleared' : 'partial';
  console.log(
    `${p.phase.padEnd(5)}  ${p.patch.padEnd(24)}  ${ra}/${p.ids.length}  ${mark}`,
  );
}

console.log('\n적용: npm run patch:registry-phase-a (등) · 해제: PNG+sign:phase-*');
