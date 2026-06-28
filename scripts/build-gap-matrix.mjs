/**
 * Build docs/image-knowledge/_gap-matrix.md from instr map + img map + master list.
 * Usage: node scripts/build-gap-matrix.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { REDLINE_CANONICAL, REDLINES_DIR } from './lib/rework-phases.mjs';
import { REDLINE_IK_START } from './lib/image-knowledge-map.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'image-knowledge', '_gap-matrix.md');
const INSTR_MAP = JSON.parse(
  readFileSync(join(ROOT, 'scripts', 'instr-image-knowledge-map.json'), 'utf8')
);
const IMG_MAP = JSON.parse(
  readFileSync(join(ROOT, 'scripts', 'img-image-knowledge-map.json'), 'utf8')
);
const MASTER = JSON.parse(
  readFileSync(
    join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1', '03_IMAGE_MASTER_LIST.json'),
    'utf8'
  )
);
const REGISTRY = JSON.parse(
  readFileSync(join(ROOT, 'scripts', 'image-review-registry.json'), 'utf8')
);

function topicFromEntry(entry) {
  if (typeof entry === 'string') return entry;
  return entry?.topic || null;
}

const planned = new Set(INSTR_MAP.plannedTopics || []);
const today = new Date().toISOString().slice(0, 10);

function status(file) {
  const p = join(ROOT, 'docs', 'image-knowledge', file);
  if (!existsSync(p)) return '❌ 없음';
  if (planned.has(file)) return '🟡 초안';
  return '✅';
}

const lines = [
  '# image-knowledge 갭 매트릭스',
  '',
  `> 자동 생성: \`npm run build:gap-matrix\` · ${today}`,
  '> 정본: [130-book-콘텐츠-이미지작성규칙-반영-실행계획](../130-book-콘텐츠-이미지작성규칙-반영-실행계획.md)',
  '',
  '## INSTRUMENTATION §3.x ↔ image-knowledge',
  '',
  '| INSTR § | image-knowledge | 상태 |',
  '|---------|-----------------|------|'
];

for (const [sec, file] of Object.entries(INSTR_MAP.sections).sort((a, b) =>
  a[0].localeCompare(b[0], undefined, { numeric: true })
)) {
  lines.push(`| ${sec} | \`${file}\` | ${status(file)} |`);
}

lines.push(
  '',
  '## IMG-### ↔ image-knowledge',
  '',
  '| IMG | topic | prompt 링크 | §5·§6 | registry |',
  '|-----|-------|-------------|--------|----------|'
);

for (const [imgId, mapEntry] of Object.entries(IMG_MAP.map).sort()) {
  const file = topicFromEntry(mapEntry);
  const entry = MASTER.find((e) => e.id === imgId);
  const prompt = entry?.prompt_file || '—';
  const promptPath = prompt !== '—' ? join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1', prompt) : null;
  let hasRules = false;
  let hasLinks = false;
  if (promptPath && existsSync(promptPath)) {
    const body = readFileSync(promptPath, 'utf8');
    hasRules = body.includes('image-rules-sync:v1');
    hasLinks = body.includes('image-knowledge-links:v1');
  }
  const regTopic = REGISTRY[imgId]?.imageKnowledgeTopic;
  const regOk = regTopic === file ? '✅' : regTopic ? '⚠️' : '🔲';
  lines.push(
    `| ${imgId} | \`${file}\` | ${hasLinks ? '✅' : '🔲'} | ${hasRules ? '✅' : '🔲'} | ${regOk} |`
  );
}

lines.push('', '## registry imageKnowledgeTopic (hero)', '', '| IMG | registry topic | hero |', '|-----|----------------|------|');
for (const [imgId, reg] of Object.entries(REGISTRY).sort()) {
  if (!reg.hero && !reg.imageKnowledgeTopic) continue;
  const mapped = topicFromEntry(IMG_MAP.map[imgId]);
  const topic = reg.imageKnowledgeTopic || '—';
  const flag = mapped && topic === mapped ? '✅' : mapped ? '⚠️' : topic !== '—' ? '?' : '🔲';
  if (reg.hero || reg.imageKnowledgeTopic) {
    lines.push(`| ${imgId} | \`${topic}\` | ${reg.hero ? 'hero' : '—'} | ${flag} |`);
  }
}

lines.push(
  '',
  '## redline ↔ image-knowledge §13 (rework canonical)',
  '',
  '| IMG | redline | §13 block |',
  '|-----|---------|-----------|'
);
for (const [imgId, redlineFile] of Object.entries(REDLINE_CANONICAL).sort()) {
  const redlinePath = join(REDLINES_DIR, redlineFile);
  let hasBlock = false;
  if (existsSync(redlinePath)) {
    hasBlock = readFileSync(redlinePath, 'utf8').includes(REDLINE_IK_START);
  }
  lines.push(`| ${imgId} | \`${redlineFile}\` | ${hasBlock ? '✅' : '🔲'} |`);
}

lines.push(
  '',
  '## 갱신',
  '',
  '```bash',
  'npm run build:gap-matrix',
  'npm run patch:instr-image-knowledge',
  'npm run patch:registry-image-knowledge',
  'npm run sync:prompt-image-knowledge-links',
  'npm run sync:prompt-image-rules',
  'npm run sync:redline-image-knowledge',
  'npm run extract:kds-figure-rules',
  'npm run patch:image-knowledge-from-kds',
  'npm run scaffold:redline-stubs',
  'npm run sync:prompt-image-rules',
  'npm run validate:book-rules-coverage',
  'npm run list:redline-stubs',
  '```',
  ''
);

writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log('Wrote', OUT);
