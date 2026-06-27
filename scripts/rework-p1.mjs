/**
 * P1 Pillow 와이어프레임 36종 진행 현황 ([122] Phase P1-A/B/C)
 * Usage: npm run rework:p1
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  REWORK_ROOT,
  P1_A_IDS,
  P1_B_IDS,
  P1_C_IDS,
  P1_WIREFRAME_IDS,
} from './lib/rework-phases.mjs';
import { hasSourcePng } from './lib/rework-source.mjs';

const registry = JSON.parse(
  readFileSync(join(REWORK_ROOT, 'scripts', 'image-review-registry.json'), 'utf8'),
);

function summarize(label, ids) {
  let gated = 0;
  let source = 0;
  let reaudit = 0;
  let pillow = 0;

  console.log(`\n${label} (${ids.length}종)\n`);
  console.log('id        gated  source  reaudit  pillow  title');
  console.log('─'.repeat(88));

  for (const id of ids) {
    const r = registry[id] || {};
    const isGated = r.wireframeReplace === true;
    if (isGated) gated++;
    const src = hasSourcePng(id);
    if (src.ok) source++;
    if (r.requiresReaudit) reaudit++;
    if (r.productionMethod === 'pillow') pillow++;
    console.log(
      [
        id,
        isGated ? 'yes' : 'no ',
        src.ok ? 'OK' : '—',
        r.requiresReaudit ? 'yes' : 'no ',
        r.productionMethod === 'pillow' ? 'yes' : 'no ',
        (r.title || '').slice(0, 26),
      ].join('  '),
    );
  }

  console.log('─'.repeat(88));
  console.log(
    `SPA 차단 ${gated}/${ids.length} · source ${source}/${ids.length} · reaudit ${reaudit}/${ids.length} · pillow ${pillow}/${ids.length}`,
  );
  return { gated, source, reaudit, pillow, total: ids.length };
}

console.log('\nP1 Pillow 와이어프레임 — docs/122 §4 P1-A/B/C\n');

const a = summarize('P1-A 플랫폼·전원·로거', P1_A_IDS);
const b = summarize('P1-B 그래프·경보', P1_B_IDS);
const c = summarize('P1-C 교량 103~110', P1_C_IDS);

const gated = a.gated + b.gated + c.gated;
const source = a.source + b.source + c.source;
const reaudit = a.reaudit + b.reaudit + c.reaudit;

console.log('\nP1 Exit (와이어프레임)');
console.log(`  SPA 차단(wireframeReplace): ${gated}/${P1_WIREFRAME_IDS.length}`);
console.log(`  source PNG: ${source}/${P1_WIREFRAME_IDS.length}`);
console.log(`  requiresReaudit (P2 연계): ${reaudit}/${P1_WIREFRAME_IDS.length}`);

if (gated === 0 && source === P1_WIREFRAME_IDS.length) {
  console.log('\n✓ P1 Pillow v2 렌더·게이트 해제 완료');
  console.log('  다음: P2 W1 — npm run rework:next -- 3 (002·096·004 ai-reviewed)');
  console.log('  일상 검증: npm run verify:content\n');
} else {
  console.log('\n미완: wireframeReplace 해제 또는 PNG 재렌더 필요');
  console.log('  render:graph · render:power · render:bridge-daegu · docs/122\n');
}
