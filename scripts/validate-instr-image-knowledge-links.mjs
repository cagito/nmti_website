/**
 * Validate INSTRUMENTATION ## 3.x has image-knowledge execution-rule links.
 * Usage: node scripts/validate-instr-image-knowledge-links.mjs [--strict]
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INSTR = join(ROOT, 'docs', 'INSTRUMENTATION_DRAWING_RULES.md');
const MAP_PATH = join(ROOT, 'scripts', 'instr-image-knowledge-map.json');
const STRICT = process.argv.includes('--strict');

const { sections } = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
const body = readFileSync(INSTR, 'utf8');
const MARKER = '> **실행 규칙 (book/image-knowledge):**';

const SECTION_RE = /^## (3\.[\d.a-z]+ .+)$/gm;
let errors = 0;
let ok = 0;

for (const m of body.matchAll(SECTION_RE)) {
  const fullLine = m[0];
  const idMatch = fullLine.match(/^## (3\.[\d.a-z]+) /);
  if (!idMatch) continue;
  const id = idMatch[1];
  const start = m.index;
  const next = body.slice(start + 1).search(/^## /m);
  const chunk = next >= 0 ? body.slice(start, start + 1 + next) : body.slice(start);

  if (!chunk.includes(MARKER)) {
    console.error(`MISSING link: ## ${id}`);
    errors += 1;
    continue;
  }

  const file = sections[id];
  if (file && !existsSync(join(ROOT, 'docs', 'image-knowledge', file))) {
    console.error(`MISSING file for ## ${id}: ${file}`);
    errors += 1;
    continue;
  }
  ok += 1;
}

if (errors) {
  console.error(`validate-instr-image-knowledge-links: FAIL (${errors} issues, ${ok} ok)`);
  process.exit(STRICT ? 1 : 0);
}
console.log(`validate-instr-image-knowledge-links: OK (${ok} sections)`);
