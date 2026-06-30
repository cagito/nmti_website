/**
 * Book 3단계 — unique hero Figure 개념 게이트 (registry · WebP · redline · prompt rules).
 * Specialized: IMG-008 · IMG-032 · IMG-043 — 전용 audit 별도.
 *
 * Usage: node scripts/audit-book-stage3-heroes.mjs [--strict]
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { IMAGE_ASSETS } from '../js/technology/images.js';
import { REDLINE_CANONICAL, REDLINES_DIR } from './lib/rework-phases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1');
const strict = process.argv.includes('--strict');
const PASS_GRADES = new Set(['PASS', 'MINOR_FIX']);
const RULES_SYNC = '<!-- image-rules-sync:v1 -->';
const SPECIALIZED = {
  'IMG-008': 'audit:img008',
  'IMG-032': 'audit:img032',
  'IMG-043': 'audit:img043',
};

function loadReport() {
  const p = join(ROOT, 'docs/book-stage3-rule-gate-report.json');
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8'));
}

function promptPath(imgId) {
  const master = JSON.parse(readFileSync(join(PKG, '03_IMAGE_MASTER_LIST.json'), 'utf8'));
  const entry = master.find((e) => e.id === imgId);
  if (!entry?.prompt_file) return null;
  return join(PKG, ...entry.prompt_file.split('/'));
}

function checkHero(imgId, registry) {
  const issues = [];
  const reg = registry[imgId];
  const asset = IMAGE_ASSETS[imgId];

  if (!reg) issues.push('registry 없음');
  else if (!PASS_GRADES.has(reg.reviewGrade) || reg.status !== 'reviewed') {
    issues.push(`registry ${reg.reviewGrade}/${reg.status}`);
  }

  if (!asset?.webp) issues.push('images.js webp 없음');
  else if (!existsSync(join(ROOT, asset.webp))) issues.push(`WebP 미존재`);

  const rl = REDLINE_CANONICAL[imgId];
  if (!rl) issues.push('REDLINE_CANONICAL 없음');
  else if (!existsSync(join(REDLINES_DIR, rl))) issues.push(`redline 없음: ${rl}`);

  const pp = promptPath(imgId);
  if (!pp || !existsSync(pp)) {
    issues.push('prompt 없음');
  } else {
    const body = readFileSync(pp, 'utf8');
    if (!body.includes(RULES_SYNC) && !body.includes('image-knowledge-links:v1')) {
      issues.push('prompt rules/links 블록 없음');
    }
  }

  return issues;
}

const report = loadReport();
if (!report) {
  console.error('run audit:book-stage3 first');
  process.exit(strict ? 1 : 0);
}

const registry = JSON.parse(readFileSync(join(ROOT, 'scripts/image-review-registry.json'), 'utf8'));
const unique = [...new Set(report.rows.map((r) => r.img).filter((id) => id && id.startsWith('IMG-')))].sort();

const rows = [];
let fail = 0;

for (const imgId of unique) {
  const issues = checkHero(imgId, registry);
  const gate = issues.length ? 'FAIL' : 'CONCEPT_PASS';
  if (issues.length) fail += 1;
  rows.push({
    img: imgId,
    gate,
    specialized: SPECIALIZED[imgId] || '—',
    issues,
  });
}

const md = [
  '# Book 3단계 — hero 개념 게이트',
  '',
  `> 생성: \`npm run audit:book-stage3-heroes\` · ${new Date().toISOString().slice(0, 10)}`,
  '',
  '| IMG | Concept | 전용 audit |',
  '|-----|---------|------------|',
  ...rows.map(
    (r) =>
      `| ${r.img} | **${r.gate}** | ${r.specialized}${r.issues.length ? ` (${r.issues.join('; ')})` : ''} |`
  ),
  '',
  `**요약:** ${rows.filter((r) => r.gate === 'CONCEPT_PASS').length}/${rows.length} CONCEPT_PASS`,
  '',
  '수동 측점: [book-stage3-status](./book-stage3-status.md)',
  '',
];

writeFileSync(join(ROOT, 'docs/book-stage3-hero-concept-report.md'), md.join('\n'), 'utf8');
writeFileSync(
  join(ROOT, 'docs/book-stage3-hero-concept-report.json'),
  JSON.stringify({ generated: new Date().toISOString(), rows, fail }, null, 2) + '\n',
  'utf8'
);

console.log(`audit-book-stage3-heroes: ${rows.length} unique heroes, ${fail} FAIL`);
if (fail) {
  for (const r of rows.filter((x) => x.gate === 'FAIL')) {
    console.error(`FAIL ${r.img}: ${r.issues.join(', ')}`);
  }
  if (strict) process.exit(1);
} else {
  console.log('OK   audit-book-stage3-heroes');
}
