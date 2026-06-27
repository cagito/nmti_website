/**
 * Pillow 와이어프레임 현황 — docs/122 P0+P1
 * Usage: npm run rework:pillow
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT, P0_WIREFRAME_IDS } from './lib/rework-phases.mjs';
import { hasSourcePng } from './lib/rework-source.mjs';

const registry = JSON.parse(
  readFileSync(join(REWORK_ROOT, 'scripts', 'image-review-registry.json'), 'utf8'),
);

const pillow = Object.entries(registry)
  .filter(([, r]) => r.status !== 'rejected' && r.productionMethod === 'pillow')
  .map(([id]) => id)
  .sort();

let gated = 0;
let sourceOk = 0;
let p0 = 0;

console.log('\nPillow Figure — docs/122 P0+P1\n');
console.log('id        gated  source  P0  title');
console.log('─'.repeat(72));

for (const id of pillow) {
  const r = registry[id] || {};
  const isGated = r.wireframeReplace === true;
  if (isGated) gated++;
  const src = hasSourcePng(id);
  if (src.ok) sourceOk++;
  const isP0 = P0_WIREFRAME_IDS.includes(id);
  if (isP0) p0++;
  console.log(
    [
      id,
      isGated ? 'yes' : 'no ',
      src.ok ? 'OK' : '—',
      isP0 ? '●' : ' ',
      (r.title || '').slice(0, 28),
    ].join('  '),
  );
}

console.log('─'.repeat(72));
console.log(
  `pillow ${pillow.length}건 · gated ${gated}/${pillow.length} · source ${sourceOk}/${pillow.length} · P0 ${p0}`,
);
if (gated === 0) {
  console.log('\n✓ wireframeReplace 0 — P1 SPA 게이트 해제 완료');
  console.log('  P1 상세: npm run rework:p1 · P2 W1: npm run rework:next -- 3');
} else {
  console.log('\n패치: npm run patch:registry-pillow-wireframe · 교체: rework:done');
}
console.log('');
