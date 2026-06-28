#!/usr/bin/env node
/**
 * Pillow hero 8종 — prompt + redline 일괄 패키지
 * Usage: npm run rework:pillow-hero-pack
 */
import { mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { REWORK_ROOT, REDLINE_CANONICAL, REDLINE_SUPPLEMENT } from './lib/rework-phases.mjs';
import { getQuickstart } from './lib/rework-quickstarts.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(
  readFileSync(join(root, 'scripts', 'image-review-registry.json'), 'utf8'),
);
const canonical = JSON.parse(
  readFileSync(join(root, 'scripts/canonical-image-webp.json'), 'utf8'),
);

const PILLOW_HERO_IDS = Object.entries(registry)
  .filter(([, r]) => r.hero && r.productionMethod === 'pillow' && r.status !== 'rejected')
  .map(([id]) => id)
  .sort();

const outDir = join(REWORK_ROOT, 'exports', 'pillow-hero-pack');
const promptOut = join(outDir, 'prompts');
const redlineOut = join(outDir, 'redlines');
mkdirSync(promptOut, { recursive: true });
mkdirSync(redlineOut, { recursive: true });

const lines = [
  '# Pillow hero — ai-reviewed 교체 패키지',
  '',
  `대상 ${PILLOW_HERO_IDS.length}건 · FT-C 블록도 · Python/Pillow 재렌더 금지`,
  '',
  '| ID | title |',
  '|---|------|',
];

for (const id of PILLOW_HERO_IDS) {
  const reg = registry[id];
  lines.push(`| ${id} | ${reg.title || ''} |`);

  spawnSync('node', ['scripts/rework-prompt.mjs', '--id', id, '--out', join(promptOut, `${id}.txt`)], {
    cwd: root,
    stdio: 'pipe',
  });

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

  const png = canonical[id] || `${id}_external.png`;
  const webp = png.replace(/\.png$/i, '.webp');
  lines.push('');
  lines.push(`### ${id}`);
  lines.push(`- prompts/${id}.txt · redline: ${REDLINE_CANONICAL[id] || '—'}`);
  lines.push(`- 퀵스타트: ${getQuickstart(id)}`);
  lines.push(`- 저장: assets/images/technology/source/${webp}`);
  lines.push(
    `- \`npm run rework:done -- --id ${id} --input assets/images/technology/source/${webp} --reviewer "검수자"\``,
  );
  lines.push('');
}

writeFileSync(join(outDir, 'README.txt'), lines.join('\n'), 'utf8');
console.log(`\n✓ pillow-hero-pack → exports/pillow-hero-pack (${PILLOW_HERO_IDS.length}건)`);
console.log('  ' + PILLOW_HERO_IDS.join(' · '));
console.log('');
