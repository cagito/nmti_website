#!/usr/bin/env node
/**
 * Phase별 외부 제작 패키지 — 프롬프트·redline·등록 명령
 * Usage:
 *   node scripts/rework-phase-pack.mjs --phase A
 *   node scripts/rework-phase-pack.mjs --phase AA --pending-only
 */
import { mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { REWORK_ROOT, REDLINE_CANONICAL, REDLINE_SUPPLEMENT, PHASES } from './lib/rework-phases.mjs';
import { getQuickstart } from './lib/rework-quickstarts.mjs';
import { hasSourceAsset } from './lib/rework-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const phaseArg = (() => {
  const i = process.argv.indexOf('--phase');
  if (i >= 0) return process.argv[i + 1]?.toUpperCase();
  const codes = new Set(PHASES.map((p) => p.phase));
  return process.argv.slice(2).find((a) => codes.has(a.toUpperCase()))?.toUpperCase() || null;
})();
const pendingOnly = process.argv.includes('--pending-only');

if (!phaseArg) {
  console.error('Usage: rework:phase-pack -- --phase A|AA|B|C|AB|AC|AD|D|E [--pending-only]');
  process.exit(1);
}

const phase = PHASES.find((p) => p.phase === phaseArg);
if (!phase) {
  console.error(`Unknown phase: ${phaseArg}`);
  process.exit(1);
}

const registry = JSON.parse(
  readFileSync(join(root, 'scripts', 'image-review-registry.json'), 'utf8'),
);
const canonical = JSON.parse(
  readFileSync(join(root, 'scripts', 'canonical-image-png.json'), 'utf8'),
);

let ids = phase.ids;
if (pendingOnly) {
  ids = ids.filter((id) => registry[id]?.requiresReaudit === true);
  if (!ids.length) {
    console.log(`Phase ${phaseArg}: reaudit 대기 없음`);
    process.exit(0);
  }
}

const folder = phase.week.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
const outDir = join(REWORK_ROOT, 'exports', `${folder}-pack`);
const redlineOut = join(outDir, 'redlines');
const promptOut = join(outDir, 'prompts');
mkdirSync(redlineOut, { recursive: true });
mkdirSync(promptOut, { recursive: true });

for (const id of ids) {
  const r = spawnSync('node', ['scripts/rework-prompt.mjs', '--id', id, '--out', join(promptOut, `${id}.txt`)], {
    cwd: root,
    stdio: 'pipe',
    shell: false,
  });
  if (r.status !== 0) {
    console.error(`WARN ${id}: prompt export failed`);
  }

  for (const rl of [REDLINE_CANONICAL[id], REDLINE_SUPPLEMENT[id]].filter(Boolean)) {
    const rlSrc = join(
      REWORK_ROOT,
      'ImageWorks',
      'NMTI_Engineering_Image_Prompt_Package_v1',
      'redlines',
      rl,
    );
    if (existsSync(rlSrc)) copyFileSync(rlSrc, join(redlineOut, rl));
  }
}

const lines = [
  `# ${phase.week} Phase ${phase.phase} — 외부 제작 패키지`,
  '',
  `대상 (${ids.length}건): ${ids.join(' · ')}`,
  '방식: AI/CAD → WebP 또는 PNG ≥1920×1080 (에이전트·Pillow·SVG 금지)',
  '',
  '## 폴더',
  '',
  '- prompts/   — 복붙 프롬프트 (P0 포함)',
  '- redlines/  — 육안 검수 redline',
  '',
  '## Figure별',
  '',
];

for (const id of ids) {
  const png = canonical[id] || `${id}_external.png`;
  const webp = png.replace(/\.png$/i, '.webp');
  const title = registry[id]?.title || id;
  const src = hasSourceAsset(id);
  const rl = REDLINE_CANONICAL[id];

  lines.push(`### ${id} — ${title}`);
  lines.push('');
  lines.push(`- 퀵스타트: ${getQuickstart(id)}`);
  lines.push(`- redline: redlines/${rl || '—'}`);
  lines.push(`- 프롬프트: prompts/${id}.txt`);
  lines.push(`- source: ${src.ok ? '있음' : '없음 — 신규 제작 필요'}`);
  lines.push(`- 저장: assets/images/technology/source/${webp}`);
  lines.push('');
  lines.push('```powershell');
  lines.push(`npm run rework:preflight -- --id ${id}`);
  lines.push(
    `npm run rework:done -- --id ${id} --input assets/images/technology/source/${webp} --reviewer "검수자"`,
  );
  lines.push('```');
  lines.push('');
}

if (phase.sign) {
  lines.push('## Phase 서명');
  lines.push('');
  lines.push('```powershell');
  lines.push(`npm run ${phase.sign}`);
  lines.push('npm run sync:images');
  lines.push('npm run build:content');
  lines.push('npm run verify:content');
  lines.push('```');
  lines.push('');
}

writeFileSync(join(outDir, 'README.txt'), lines.join('\n'), 'utf8');

console.log(`\n✓ ${phase.week} pack → ${outDir} (${ids.length}건)`);
for (const id of ids) console.log(`  ${id}  prompts/${id}.txt`);
