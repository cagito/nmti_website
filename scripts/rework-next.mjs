/**
 * 다음 재작도 Figure 가이드 (우선순위: W1→W11 · requiresReaudit 우선)
 * Usage: node scripts/rework-next.mjs [--count 3] [--json]
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT, REDLINE_CANONICAL, PHASES } from './lib/rework-phases.mjs';
import { getQuickstart } from './lib/rework-quickstarts.mjs';

const registryPath = join(REWORK_ROOT, 'scripts', 'image-review-registry.json');
const canonicalPath = join(REWORK_ROOT, 'scripts', 'canonical-image-png.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const canonical = JSON.parse(readFileSync(canonicalPath, 'utf8'));

const countArg = (() => {
  const i = process.argv.indexOf('--count');
  if (i >= 0) return Math.max(1, parseInt(process.argv[i + 1], 10) || 1);
  const pos = process.argv.find((a, idx) => idx >= 2 && /^\d+$/.test(a));
  return pos ? Math.max(1, parseInt(pos, 10)) : 1;
})();
const asJson = process.argv.includes('--json');

const queue = [];
for (const p of PHASES) {
  for (const id of p.ids) {
    const reg = registry[id];
    if (!reg) continue;
    const needs =
      reg.requiresReaudit === true ||
      reg.prohibitedVerified !== true ||
      reg.visualReview?.grade !== 'PASS';
    if (!needs) continue;
    const pngName = canonical[id] || `${id}_*.png`;
    const webpName = pngName.replace(/\.png$/i, '.webp');
    const redline = REDLINE_CANONICAL[id];
    const redlinePath = redline
      ? `ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/${redline}`
      : null;
    queue.push({
      priority: queue.length,
      week: p.week,
      phase: p.phase,
      id,
      title: reg.title || '',
      png: pngName,
      webp: webpName,
      sourcePath: `assets/images/technology/source/${webpName.replace('*', '')}`,
      redline: redlinePath,
      quickstart: getQuickstart(id),
      patch: p.patch ? `npm run ${p.patch}` : null,
      register:
        pngName.includes('*')
          ? `npm run register:figure -- --id ${id} --input assets/images/technology/source/${id}_*.png --method ai-reviewed --reviewer "검수자" --visual-grade PASS`
          : `npm run register:figure -- --id ${id} --input assets/images/technology/source/${pngName} --method ai-reviewed --reviewer "검수자" --visual-grade PASS`,
      sign: `npm run ${p.sign} -- --id ${id}`,
      requiresReaudit: reg.requiresReaudit === true,
    });
  }
}

const next = queue.slice(0, countArg);

if (asJson) {
  console.log(JSON.stringify(next, null, 2));
  process.exit(0);
}

if (!next.length) {
  console.log('재작도 대기 Figure 없음 — rework:status 확인');
  process.exit(0);
}

console.log(`다음 재작도 Figure (상위 ${next.length} / 대기 ${queue.length}건)\n`);

for (const item of next) {
  console.log(`── ${item.id} · ${item.week} Phase ${item.phase} · ${item.title}`);
  console.log(`   퀵스타트: ${item.quickstart}`);
  if (item.redline) console.log(`   redline:  ${item.redline}`);
  console.log(`   PNG/WebP: ${item.png}  (WebP: ${item.webp})`);
  if (item.patch && item.requiresReaudit) {
    console.log(`   사전:     ${item.patch}  (미적용 시)`);
  }
  console.log(`   1) npm run rework:prompt -- --id ${item.id}  (또는 퀵스타트 doc)`);
  console.log(`   2) AI/CAD → source/ 저장 (${item.webp} 권장)`);
  console.log(`   3) npm run rework:preflight -- --id ${item.id}`);
  const regInput = item.png.includes('*')
    ? `assets/images/technology/source/${item.id}_*.webp`
    : `assets/images/technology/source/${item.webp}`;
  console.log(
    `   4) npm run rework:done -- --id ${item.id} --input ${regInput} --reviewer "검수자"`,
  );
  console.log(`   (분리: rework:register → rework:sign)`);
  console.log('');
}

console.log('전체: npm run rework:status -- --pending · npm run rework:prompt · docs/119');
