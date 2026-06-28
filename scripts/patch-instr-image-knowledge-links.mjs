/**
 * Inject image-knowledge execution-rule links into INSTRUMENTATION ## 3.x sections.
 * Usage: node scripts/patch-instr-image-knowledge-links.mjs [--dry-run]
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INSTR = join(ROOT, 'docs', 'INSTRUMENTATION_DRAWING_RULES.md');
const MAP_PATH = join(ROOT, 'scripts', 'instr-image-knowledge-map.json');
const DRY = process.argv.includes('--dry-run');

const { sections, plannedTopics = [] } = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
const MARKER = '> **실행 규칙 (book/image-knowledge):**';

function linkLine(sectionId, file) {
  const rel = `./image-knowledge/${file}`;
  const planned = plannedTopics.includes(file);
  const exists = existsSync(join(ROOT, 'docs', 'image-knowledge', file));
  if (!exists) {
    return `${MARKER} [\`${file}\`](${rel}) — **파일 없음 · 작성 예정**`;
  }
  const suffix = planned ? ' *(초안·작성 예정)*' : '';
  return `${MARKER} [\`${file}\`](${rel})${suffix}`;
}

/** Match ## 3.x section headers (full line, not ###) */
const SECTION_RE = /^## (3\.[\d.a-z]+ .+)$/gm;

let body = readFileSync(INSTR, 'utf8');
body = body.replace(
  /^> \*\*실행 규칙 \(book\/image-knowledge\):\*\*[^\n]*\n\n/gm,
  ''
);

let patched = 0;
let missing = 0;

body = body.replace(SECTION_RE, (fullLine, _rest) => {
  const idMatch = fullLine.match(/^## (3\.[\d.a-z]+) /);
  if (!idMatch) return fullLine;
  const id = idMatch[1];
  const file = sections[id];
  if (!file) {
    missing += 1;
    return `${fullLine}\n\n${MARKER} \`00-공통-이미지-작성-원칙.md\` — **§${id} 매핑 없음 · 작성 예정**\n\n`;
  }
  patched += 1;
  return `${fullLine}\n\n${linkLine(id, file)}\n\n`;
});

if (DRY) {
  console.log(`dry-run: would patch ${patched} sections, unmapped ${missing}`);
} else {
  writeFileSync(INSTR, body, 'utf8');
  console.log(`patched ${patched} INSTR sections, unmapped ${missing}`);
}
