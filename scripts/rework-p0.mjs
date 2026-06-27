/**
 * P0 와이어프레임 14종 진행 현황 ([122] Phase P0)
 * Usage: npm run rework:p0
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  REWORK_ROOT,
  P0_WIREFRAME_IDS,
  REDLINE_CANONICAL,
  REDLINES_DIR,
  PHASES,
} from './lib/rework-phases.mjs';
import { hasSourcePng, hasReworkPng } from './lib/rework-source.mjs';
import { existsSync } from 'fs';

const registry = JSON.parse(
  readFileSync(join(REWORK_ROOT, 'scripts', 'image-review-registry.json'), 'utf8'),
);

function phaseFor(id) {
  return PHASES.find((p) => p.ids.includes(id));
}

console.log('\nP0 와이어프레임 Figure (14종) — docs/122 · docs/123\n');
console.log('id        method     pillow  gated  redline  source  title');
console.log('─'.repeat(92));

let pillowCount = 0;
let readyCount = 0;
let gatedCount = 0;

for (const id of P0_WIREFRAME_IDS) {
  const r = registry[id] || {};
  const method = r.productionMethod || '?';
  const isPillow = method === 'pillow';
  if (isPillow) pillowCount++;
  const gated = r.wireframeReplace === true;
  if (gated) gatedCount++;
  const rl = REDLINE_CANONICAL[id];
  const rlOk = rl && existsSync(join(REDLINES_DIR, rl));
  const src = hasSourcePng(id);
  const anyPng = hasReworkPng(id);
  if (src.ok) readyCount++;
  const title = (r.title || '').slice(0, 24);
  console.log(
    [
      id,
      method.padEnd(10),
      isPillow ? 'yes' : 'no ',
      gated ? 'yes' : 'no ',
      rlOk ? 'OK' : 'MISS',
      src.ok ? 'OK' : anyPng.ok ? 'tech' : '—',
      title,
    ].join('  '),
  );
}

console.log('─'.repeat(92));
console.log(`pillow 잔존: ${pillowCount}/14 · SPA 차단(gated): ${gatedCount}/14 · source PNG: ${readyCount}/14`);
console.log('\n다음: docs/124 (094·095·102) · npm run rework:prompt -- --id IMG-094');
console.log('Exit: 14건 ai-reviewed + visualReview PASS → pillow 0 (P0)\n');
