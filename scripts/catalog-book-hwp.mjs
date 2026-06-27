/**
 * Catalog book/ HWP files and map to technology nodes.
 * Usage: node scripts/catalog-book-hwp.mjs
 */
import { readdirSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BOOK = join(ROOT, 'book');

const MAP = [
  { pattern: /KCS 11 10 15|지반계측/i, nodes: ['fields/retaining-excavation', 'sensors/inclinometer'] },
  { pattern: /KDS 11 10 15/i, nodes: ['fields/retaining-excavation', 'intro'] },
  { pattern: /KDS 27 50 10|터널 계측/i, nodes: ['fields/tunnel', 'fields/tunnel/blast-vibration'] },
  { pattern: /KCS 24 99 05|교량계측/i, nodes: ['fields/bridge', 'fields/bridge/vibration'] },
  { pattern: /KCS 54 20 25|댐 계측/i, nodes: ['fields/dam', 'fields/dam/river-levee'] }
];

const files = readdirSync(BOOK).filter((f) => /\.hwp$/i.test(f));
const lines = [
  '# book/ HWP 카탈로그',
  '',
  `**생성:** ${new Date().toISOString().slice(0, 10)} · \`node scripts/catalog-book-hwp.mjs\``,
  '',
  '| 파일 | 크기(KB) | 연결 기술자료 노드 |',
  '|------|----------|-------------------|'
];

for (const f of files.sort()) {
  const kb = Math.round(statSync(join(BOOK, f)).size / 1024);
  const entry = MAP.find((m) => m.pattern.test(f));
  const nodes = entry ? entry.nodes.map((n) => `\`${n}\``).join(', ') : '—';
  lines.push(`| ${f} | ${kb} | ${nodes} |`);
}

lines.push('', '## PDF (참고 원본)', '', '| 파일 | 연결 기술자료 노드 |', '|------|-------------------|', '| GNSS.pdf | `sensors/gnss` · IMG-043 |', '', '## 후속', '', '- 용어 추출: `npm run extract:hwp-terms` → [HWP_TERMS.md](./HWP_TERMS.md)', '- PDF 감사: `npm run audit:book`', '- 도면 키워드: `npm run crosscheck:book-plans`');

writeFileSync(join(BOOK, 'HWP_INDEX.md'), lines.join('\n') + '\n', 'utf8');
console.log('Wrote book/HWP_INDEX.md', files.length, 'HWP files');
