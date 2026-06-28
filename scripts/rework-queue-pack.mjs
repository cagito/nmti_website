#!/usr/bin/env node
/**
 * reaudit 전체 제작 패키지 — 우선순위 큐 + 프롬프트·redline
 * Usage: node scripts/rework-queue-pack.mjs [--hero-only] [--limit 10]
 */
import { mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { REWORK_ROOT, REDLINE_CANONICAL, REDLINE_SUPPLEMENT } from './lib/rework-phases.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const heroOnly = process.argv.includes('--hero-only');
const limitArg = (() => {
  const i = process.argv.indexOf('--limit');
  if (i >= 0) return parseInt(process.argv[i + 1], 10);
  const bare = process.argv.slice(2).find((a) => /^\d+$/.test(a));
  return bare ? parseInt(bare, 10) : null;
})();

const r = spawnSync(
  'node',
  ['scripts/list-production-queue.mjs', '--json', ...(heroOnly ? ['--hero-only'] : [])],
  { cwd: root, encoding: 'utf8', shell: false },
);
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}

const { queue } = JSON.parse(r.stdout);
const items = limitArg ? queue.slice(0, limitArg) : queue;

const outDir = join(REWORK_ROOT, 'exports', 'production-queue');
const redlineOut = join(outDir, 'redlines');
const promptOut = join(outDir, 'prompts');
mkdirSync(redlineOut, { recursive: true });
mkdirSync(promptOut, { recursive: true });

const canonical = JSON.parse(
  readFileSync(join(root, 'scripts', 'canonical-image-webp.json'), 'utf8'),
);

const lines = [
  '# 이미지 제작 마스터 큐',
  '',
  `reaudit ${items.length}건 · hero-only=${heroOnly}`,
  '',
  '| # | week | ID | hero | source |',
  '|---|------|-----|------|--------|',
];

for (const q of items) {
  const pr = spawnSync('node', ['scripts/rework-prompt.mjs', '--id', q.id, '--out', join(promptOut, `${q.id}.txt`)], {
    cwd: root,
    stdio: 'pipe',
  });

  for (const rl of [REDLINE_CANONICAL[q.id], REDLINE_SUPPLEMENT[q.id]].filter(Boolean)) {
    const rlSrc = join(
      REWORK_ROOT,
      'ImageWorks',
      'NMTI_Engineering_Image_Prompt_Package_v1',
      'redlines',
      rl,
    );
    if (existsSync(rlSrc)) copyFileSync(rlSrc, join(redlineOut, rl));
  }

  const png = canonical[q.id] || `${q.id}_external.png`;
  const webp = png.replace(/\.png$/i, '.webp');
  lines.push(`| ${q.priority} | ${q.week} | ${q.id} | ${q.hero ? 'Y' : 'n'} | ${q.hasSource ? 'Y' : 'N'} |`);
  lines.push('');
  lines.push(`### ${q.priority}. ${q.id} — ${q.title}`);
  lines.push(`- prompts/${q.id}.txt · redline: ${q.redline || '—'}`);
  lines.push(`- 저장: assets/images/technology/source/${webp}`);
  lines.push(`- \`npm run rework:done -- --id ${q.id} --input assets/images/technology/source/${webp} --reviewer "검수자"\``);
  lines.push('');
}

writeFileSync(join(outDir, 'README.txt'), lines.join('\n'), 'utf8');
writeFileSync(join(outDir, 'queue.json'), JSON.stringify(items, null, 2) + '\n', 'utf8');

console.log(`\n✓ production-queue → ${outDir} (${items.length}건)`);
console.log('  prompts/  redlines/  README.txt  queue.json\n');
