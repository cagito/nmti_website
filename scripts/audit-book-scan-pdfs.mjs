/**
 * Book 스캔 PDF — 파일 존재·등급 분류 (픽셀은 수동).
 * Usage: node scripts/audit-book-scan-pdfs.mjs [--strict]
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BOOK = join(ROOT, 'book');
const strict = process.argv.includes('--strict');
const SCAN_THRESHOLD = 50;

/** 130 §2 등급 F — 설치 규칙 근거 불가 */
const EXCLUDED = new Set([
  '스마트계측기(추가분) 설치·운영 용역_제안설명회.pdf',
]);

const crosscheck = JSON.parse(
  readFileSync(join(ROOT, 'docs/book-site-plan-crosscheck.json'), 'utf8')
);

const rows = [];
let fail = 0;

for (const row of crosscheck.pdfs) {
  if (row.chars >= SCAN_THRESHOLD) continue;
  const path = join(BOOK, row.file);
  const exists = existsSync(path);
  let status = 'PIXEL_PENDING';
  let note = '육안 검수 — [173](./173-book-스캔PDF-검수-인덱스.md)';
  if (EXCLUDED.has(row.file)) {
    status = 'EXCLUDED';
    note = '130 §2-F 교육·제안 — hero 근거 불가';
  } else if (!exists) {
    status = 'MISSING';
    note = 'book/ 파일 없음';
    fail += 1;
  }
  rows.push({
    file: row.file,
    pages: row.pages,
    chars: row.chars,
    status,
    note,
  });
}

const md = [
  '# Book 스캔 PDF — audit 보고서',
  '',
  `> 생성: \`npm run audit:book-scan-pdfs\` · ${new Date().toISOString().slice(0, 10)}`,
  `> 기준: 추출 문자 < ${SCAN_THRESHOLD}`,
  '',
  '| PDF | 페이지 | chars | 상태 | 비고 |',
  '|-----|--------|-------|------|------|',
  ...rows.map(
    (r) => `| \`${r.file}\` | ${r.pages} | ${r.chars} | **${r.status}** | ${r.note} |`
  ),
  '',
  `**요약:** ${rows.filter((r) => r.status === 'PIXEL_PENDING').length} PIXEL_PENDING · ` +
    `${rows.filter((r) => r.status === 'EXCLUDED').length} EXCLUDED · ${fail} MISSING`,
  '',
  '수동 기록: [book-stage3-status](./book-stage3-status.md)',
  '',
];

writeFileSync(join(ROOT, 'docs/book-scan-pdf-audit-report.md'), md.join('\n'), 'utf8');
writeFileSync(
  join(ROOT, 'docs/book-scan-pdf-audit-report.json'),
  JSON.stringify({ generated: new Date().toISOString(), rows, fail }, null, 2) + '\n',
  'utf8'
);

console.log(`audit-book-scan-pdfs: ${rows.length} scan PDFs, ${fail} MISSING`);
if (fail) {
  for (const r of rows.filter((x) => x.status === 'MISSING')) {
    console.error(`MISSING ${r.file}`);
  }
  if (strict) process.exit(1);
} else {
  console.log('OK   audit-book-scan-pdfs');
}
