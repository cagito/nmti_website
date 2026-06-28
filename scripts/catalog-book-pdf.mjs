/**
 * Catalog all PDFs under book/ → docs/image-knowledge/_manifest.json + source-index.md
 * Usage: node scripts/catalog-book-pdf.mjs
 */
import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BOOK = join(ROOT, 'book');
const OUT_DIR = join(ROOT, 'docs', 'image-knowledge');
const MANIFEST = join(OUT_DIR, '_manifest.json');
const SOURCE_INDEX = join(OUT_DIR, 'source-index.md');

const GIT_EXCLUDED = new Set(['book/사내저수지 원격계측경보 발령기준.pdf']);

const DOC_TYPE_RULES = [
  { pattern: /^KDS |^KCS /, docType: '시방서', trust: 'high', fields: ['지반', '터널', '구조물'] },
  { pattern: /^GNSS\.pdf$/i, docType: '기술 설명자료', trust: 'medium', fields: ['계측 시스템'] },
  { pattern: /^guide-to-instrumentation\.pdf$/i, docType: '장비 매뉴얼', trust: 'medium', fields: ['장비 설치', '지반', '수문/지하수'] },
  { pattern: /계측계획|계측 도면|준공도면|유지관리계측/, docType: '계측 계획서', trust: 'high', fields: ['구조물', '터널', '흙막이'] },
  { pattern: /준공보고서|보고서/, docType: '보고서', trust: 'medium', fields: ['구조물', '계측 시스템'] },
  { pattern: /제안설명회|지명원/, docType: '교육자료', trust: 'low', fields: ['계측 시스템'] },
  { pattern: /설치완료|사양 및 설치/, docType: '설치도', trust: 'high', fields: ['장비 설치'] },
  { pattern: /원격계측|자동화계측/, docType: '보고서', trust: 'medium', fields: ['계측 시스템', '경보/관리'] }
];

function walkPdfs(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkPdfs(full, acc);
    else if (/\.pdf$/i.test(name)) acc.push(full);
  }
  return acc;
}

function classify(fileName) {
  for (const r of DOC_TYPE_RULES) {
    if (r.pattern.test(fileName)) {
      return { docType: r.docType, trust: r.trust, fields: [...r.fields] };
    }
  }
  return { docType: '기타', trust: 'medium', fields: ['기타'] };
}

function duplicateOf(fileName) {
  if (/ copy\.pdf$/i.test(fileName)) {
    return fileName.replace(/ copy\.pdf$/i, '.pdf');
  }
  return null;
}

function titleGuess(fileName) {
  return fileName.replace(/\.pdf$/i, '');
}

function extractBatch(absPaths) {
  const py = join(ROOT, 'scripts', 'lib', 'catalog-book-pdf-extract.py');
  const proc = spawnSync('python', [py], {
    cwd: ROOT,
    input: JSON.stringify(absPaths),
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024
  });
  if (proc.status !== 0) {
    console.error(proc.stderr || proc.stdout);
    throw new Error('catalog-book-pdf-extract.py failed');
  }
  return JSON.parse(proc.stdout);
}

function buildSourceIndex(manifest) {
  const lines = [
    '# PDF 출처 색인',
    '',
    `> 자동 생성: \`npm run catalog:book-pdf\` · ${new Date().toISOString().slice(0, 10)}`,
    '> 주제별 상세 규칙은 `01-*.md` … 참고. 이 표는 PDF 메타·키워드 색인이다.',
    '',
    '## PDF 메타데이터 요약',
    '',
    '| 파일 | 문서 유형 | 분야 | 페이지 | 신뢰도 | 비고 |',
    '|------|-----------|------|-------:|--------|------|'
  ];

  for (const m of manifest.pdfs) {
    const note = [
      m.duplicateOf ? `중복→\`${m.duplicateOf}\`` : '',
      m.gitExcluded ? 'Git 제외(대용량)' : '',
      m.readError ? `읽기오류: ${m.readError}` : '',
      m.sparseTextPages?.length ? `도면위주 ${m.sparseTextPages.length}p` : ''
    ].filter(Boolean).join(' · ') || '—';
    lines.push(
      `| \`${m.fileName}\` | ${m.docType} | ${m.fields.join(', ')} | ${m.pageCount} | ${m.trustTier} | ${note} |`
    );
  }

  lines.push(
    '',
    '## 주제 ↔ PDF 참조 (자동 키워드)',
    '',
    '| 주제 | PDF 파일 | 페이지 | 참고 내용 | 신뢰도 | 비고 |',
    '|------|----------|-------:|-----------|--------|------|'
  );

  const topicRows = [];
  for (const m of manifest.pdfs) {
    if (m.duplicateOf || m.gitExcluded) continue;
    for (const topic of m.topics || []) {
      const pages = (m.figureHintPages || []).slice(0, 5).join(', ') || '—';
      topicRows.push({ topic, m, pages });
    }
  }
  topicRows.sort((a, b) => a.topic.localeCompare(b.topic, 'ko'));
  for (const { topic, m, pages } of topicRows) {
    lines.push(
      `| ${topic} | \`${m.fileName}\` | ${pages} | 키워드: ${(m.keywords || []).slice(0, 6).join(', ') || '—'} | ${m.trustTier} | 자동 추출 |`
    );
  }

  if (!topicRows.length) {
    lines.push('| — | — | — | — | — | — |');
  }

  return lines.join('\n') + '\n';
}

mkdirSync(OUT_DIR, { recursive: true });

const allAbs = walkPdfs(BOOK).sort();
const canonical = allAbs.filter((p) => !/ copy\.pdf$/i.test(p));
const extracted = extractBatch(canonical);

const pdfs = canonical.map((abs, i) => {
  const rel = relative(ROOT, abs).replace(/\\/g, '/');
  const fileName = rel.split('/').pop();
  const meta = classify(fileName);
  const dup = duplicateOf(fileName);
  const ex = extracted[i] || {};
  return {
    fileName,
    relativePath: rel,
    titleGuess: titleGuess(fileName),
    docType: meta.docType,
    fields: meta.fields,
    trustTier: meta.trust,
    sizeBytes: statSync(abs).size,
    duplicateOf: dup,
    gitExcluded: GIT_EXCLUDED.has(rel),
    pageCount: ex.pageCount ?? 0,
    extractedChars: ex.extractedChars ?? 0,
    readError: ex.readError ?? null,
    keywords: ex.keywords ?? [],
    topics: ex.topics ?? [],
    sparseTextPages: ex.sparseTextPages ?? [],
    figureHintPages: ex.figureHintPages ?? [],
    figurePages: []
  };
});

const manifest = {
  generatedAt: new Date().toISOString(),
  bookRoot: 'book/',
  pdfCount: pdfs.length,
  pdfs
};

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
writeFileSync(SOURCE_INDEX, buildSourceIndex(manifest), 'utf8');

console.log(`Wrote ${relative(ROOT, MANIFEST)} (${pdfs.length} PDFs)`);
console.log(`Wrote ${relative(ROOT, SOURCE_INDEX)}`);
