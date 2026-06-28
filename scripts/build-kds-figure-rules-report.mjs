/**
 * Build docs/image-knowledge/_kds-figure-rules-candidates.md from extract JSON.
 * Usage: node scripts/build-kds-figure-rules-report.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXTRACT = join(ROOT, 'book', '_kds_figure_rules_extract.json');
const IK = join(ROOT, 'docs', 'image-knowledge');
const OUT = join(IK, '_kds-figure-rules-candidates.md');

function extractMustBullets(topicText) {
  const re = /## 5\. 반드시 그릴 요소\r?\n\r?\n([\s\S]*?)(?=\r?\n## |$)/;
  const m = topicText.match(re);
  if (!m) return [];
  return m[1]
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.replace(/^- /, ''));
}

function normalize(s) {
  return s.replace(/\*\*/g, '').replace(/\s+/g, '').slice(0, 40);
}

if (!existsSync(EXTRACT)) {
  console.error('Missing', EXTRACT, '— run: npm run extract:kds-figure-rules');
  process.exit(1);
}

const data = JSON.parse(readFileSync(EXTRACT, 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const lines = [
  '# KDS/KCS → image-knowledge 후보 규칙',
  '',
  `> 자동 생성: \`npm run build:kds-figure-rules-report\` · extract ${data.generatedAt?.slice(0, 10) || today}`,
  '> **인간 검수 전용** — PDF 후보 bullet을 image-knowledge §5·§6에 **수동 반영**한다.',
  '> 정본: [130-book-콘텐츠-이미지작성규칙-반영-실행계획](../130-book-콘텐츠-이미지작성규칙-반영-실행계획.md)',
  '',
];

if (data.warnings?.length) {
  lines.push('## 경고', '', ...data.warnings.map((w) => `- ${w}`), '');
}

lines.push(
  '## 요약',
  '',
  '| docId | cite | image-knowledge | excerpt | bullets | §5已有 |',
  '|-------|------|-----------------|--------:|--------:|--------|'
);

const detailSections = [];

for (const src of data.sources || []) {
  for (const sec of src.sections || []) {
    const topicPath = join(IK, sec.imageKnowledgeTopic);
    let existing = 0;
    if (existsSync(topicPath)) {
      const must = extractMustBullets(readFileSync(topicPath, 'utf8'));
      const norms = new Set(must.map(normalize));
      existing = (sec.candidateBullets || []).filter((b) =>
        [...norms].some((n) => normalize(b.text).includes(n) || n.includes(normalize(b.text)))
      ).length;
    }
    lines.push(
      `| ${src.docId} | ${sec.cite} | \`${sec.imageKnowledgeTopic}\` | ${sec.excerptChars || 0} | ${(sec.candidateBullets || []).length} | ${existing} |`
    );

    if (!(sec.candidateBullets || []).length && (sec.excerptChars || 0) < 80) continue;

    detailSections.push(
      `### ${src.docId} ${sec.cite} → \`${sec.imageKnowledgeTopic}\``,
      '',
      `- PDF: \`${src.pdfFile}\` · pages ${(sec.pageHints || []).join(', ') || '—'}`,
      `- instruments: ${(sec.instrumentMentions || []).join(' · ') || '—'}`,
      ''
    );
    if (sec.excerptPreview) {
      detailSections.push('> excerpt (400 chars)', '>', ...sec.excerptPreview.split('\n').map((l) => `> ${l}`), '');
    }
    detailSections.push('**candidate bullets (review):**', '');
    for (const b of sec.candidateBullets || []) {
      detailSections.push(`- [ ] \`${b.kind}\` ${b.text}`);
    }
    detailSections.push('');
  }
}

lines.push('', '## 상세 (human review)', '', ...detailSections);

lines.push(
  '## 갱신',
  '',
  '```bash',
  'npm run extract:kds-figure-rules',
  'npm run build:kds-figure-rules-report',
  'npm run validate:kds-figure-rules',
  '```',
  ''
);

writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log('Wrote', OUT);
