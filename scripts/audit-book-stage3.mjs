/**
 * Book 3단계 — Figure rule gate (registry · WebP · redline) for priority PDFs.
 * Pixel·측점 번호 대조는 수동 — docs/book-plan-manual-review-checklist.md
 *
 * Usage: node scripts/audit-book-stage3.mjs [--strict]
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { IMAGE_ASSETS } from '../js/technology/images.js';
import { REDLINE_CANONICAL, REDLINES_DIR } from './lib/rework-phases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');

const PRIORITY_PDFS = [
  '1-150120_대구통합계측 준공보고서-본문.pdf',
  '2-150120_대구통합계측 준공보고서-부록.pdf',
  '3-150120_대구통합계측 준공도면.pdf',
  '2. 유지관리계측 도면.pdf',
  '페이지 원본 2. 계측도면_그랑르피에드.pdf',
  'GNSS.pdf',
];

const PASS_GRADES = new Set(['PASS', 'MINOR_FIX']);

function loadNodeHeroes() {
  const text = readFileSync(join(ROOT, 'js/technology/dictionary.js'), 'utf8');
  const heroes = {};
  const re = /'((?:fields|sensors|instruments)\/[^']+)':\s*\{[^}]*?imageId:\s*'(IMG-\d{3})'/gs;
  for (const m of text.matchAll(re)) {
    heroes[m[1]] = m[2];
  }
  return heroes;
}

function loadCrosscheck() {
  return JSON.parse(readFileSync(join(ROOT, 'docs/book-site-plan-crosscheck.json'), 'utf8'));
}

function loadRegistry() {
  return JSON.parse(readFileSync(join(ROOT, 'scripts/image-review-registry.json'), 'utf8'));
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
  else if (!existsSync(join(ROOT, asset.webp))) issues.push(`WebP 미존재: ${asset.webp}`);

  const rl = REDLINE_CANONICAL[imgId];
  if (!rl) issues.push('REDLINE_CANONICAL 없음');
  else if (!existsSync(join(REDLINES_DIR, rl))) issues.push(`redline 없음: ${rl}`);

  return issues;
}

const heroes = loadNodeHeroes();
const crosscheck = loadCrosscheck();
const registry = loadRegistry();
const byFile = Object.fromEntries(crosscheck.pdfs.map((p) => [p.file, p]));

const rows = [];
let fail = 0;

for (const pdf of PRIORITY_PDFS) {
  const row = byFile[pdf];
  if (!row) {
    rows.push({ pdf, keyword: '—', node: '—', img: '—', gate: 'FAIL', issues: ['crosscheck JSON 없음'] });
    fail++;
    continue;
  }
  if (!row.keywords || Object.keys(row.keywords).length === 0) {
    rows.push({
      pdf,
      keyword: '(스캔)',
      node: '—',
      img: '—',
      gate: 'PIXEL_ONLY',
      issues: ['키워드 추출 없음 — 픽셀만 수동'],
    });
    continue;
  }
  for (const [kw, node] of Object.entries(row.keywords)) {
    const img = heroes[node] || '—';
    if (img === '—') {
      rows.push({ pdf, keyword: kw, node, img, gate: 'FAIL', issues: ['hero imageId 없음'] });
      fail++;
      continue;
    }
    const issues = checkHero(img, registry);
    const gate = issues.length ? 'FAIL' : 'RULE_PASS';
    if (issues.length) fail++;
    rows.push({ pdf, keyword: kw, node, img, gate, issues });
  }
}

const md = [
  '# Book 3단계 — Figure rule gate 보고서',
  '',
  `> 생성: \`npm run audit:book-stage3\` · ${new Date().toISOString().slice(0, 10)}`,
  '> **RULE_PASS** = registry PASS · WebP · redline 정본. **픽셀·측점**은 [수동 체크리스트](./book-plan-manual-review-checklist.md).',
  '',
  '| PDF | 키워드 | 노드 | IMG | Rule gate |',
  '|-----|--------|------|-----|-----------|',
  ...rows.map((r) => {
    const note = r.issues.length ? r.issues.join('; ') : '—';
    return `| \`${r.pdf}\` | ${r.keyword} | \`${r.node}\` | ${r.img} | **${r.gate}** ${note !== '—' ? `(${note})` : ''} |`;
  }),
  '',
  `**요약:** ${rows.filter((r) => r.gate === 'RULE_PASS').length} RULE_PASS · ${rows.filter((r) => r.gate === 'PIXEL_ONLY').length} PIXEL_ONLY · ${fail} FAIL`,
  '',
  '실행 기록: [159-book-3단계-실행기록](./159-book-3단계-실행기록.md)',
  '',
];

writeFileSync(join(ROOT, 'docs/book-stage3-rule-gate-report.md'), md.join('\n'), 'utf8');
writeFileSync(
  join(ROOT, 'docs/book-stage3-rule-gate-report.json'),
  JSON.stringify({ generated: new Date().toISOString(), rows, fail }, null, 2) + '\n',
  'utf8'
);

console.log(`book-stage3 rule gate: ${rows.length} items, ${fail} FAIL`);
if (fail) {
  for (const r of rows.filter((x) => x.gate === 'FAIL')) {
    console.error(`FAIL ${r.pdf} ${r.keyword} ${r.img}: ${r.issues.join(', ')}`);
  }
  if (strict) process.exit(1);
} else {
  console.log('OK   audit-book-stage3 (rule gate)');
}
