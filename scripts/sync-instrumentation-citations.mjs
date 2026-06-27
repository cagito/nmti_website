#!/usr/bin/env node
/**
 * Inject ### 근거 into INSTRUMENTATION §3.x sections (docs/40 Phase 2.1).
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TARGET = join(ROOT, 'docs', 'INSTRUMENTATION_DRAWING_RULES.md');
const MAP_PATH = join(ROOT, 'book', 'instrumentation-section-cites.json');

const cites = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
let body = readFileSync(TARGET, 'utf8');
let injected = 0;
let skipped = 0;

for (const [sec, citeLine] of Object.entries(cites)) {
  const headerRe = new RegExp(`^## ${sec.replace('.', '\\.')} .+$`, 'm');
  if (!headerRe.test(body)) {
    console.warn(`Section ${sec} not found`);
    continue;
  }
  const start = body.search(headerRe);
  const afterHeader = body.indexOf('\n', start) + 1;
  const nextSec = body.slice(afterHeader).search(/^## (?:3\.|부록)/m);
  const end = nextSec < 0 ? body.length : afterHeader + nextSec;
  const block = body.slice(afterHeader, end);
  if (/### 근거/m.test(block)) {
    skipped += 1;
    continue;
  }
  const insert =
    `\n### 근거\n\n- ${citeLine} (국가건설기준센터/KCSC)\n`;
  const trimmed = block.replace(/\s+$/, '');
  const newBlock = trimmed + insert + '\n';
  body = body.slice(0, afterHeader) + newBlock + body.slice(end);
  injected += 1;
}

writeFileSync(TARGET, body, 'utf8');
console.log(`sync-instrumentation-citations: injected ${injected}, skipped ${skipped}`);
