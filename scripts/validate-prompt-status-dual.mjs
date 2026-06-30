/**
 * DOC-CANON-03 P3.5 — CANONICAL_STATUS PASS vs body REGENERATE conflict.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PROMPTS = join(
  ROOT,
  'ImageWorks',
  'NMTI_Engineering_Image_Prompt_Package_v1',
  'prompts'
);
const STRICT = process.argv.includes('--strict');

/** @param {string} text */
function bodyOutsideCanonical(text) {
  const start = text.indexOf('CANONICAL_STATUS');
  if (start === -1) return text;
  const afterBlock = text.indexOf('\n<!--', start);
  const end = afterBlock === -1 ? text.indexOf('\n## ', start) : afterBlock;
  if (end === -1) return text.slice(start + 80);
  return text.slice(0, start) + text.slice(end);
}

/** @type {string[]} */
const errors = [];

if (!existsSync(PROMPTS)) {
  console.error('validate-prompt-status-dual: prompts dir missing');
  process.exit(STRICT ? 1 : 0);
}

for (const file of readdirSync(PROMPTS).filter((f) => f.endsWith('.md'))) {
  const path = join(PROMPTS, file);
  const text = readFileSync(path, 'utf8');
  if (!text.includes('CANONICAL_STATUS')) continue;
  if (!/현재 판정\*\*\s*\|\s*PASS/i.test(text)) continue;

  const body = bodyOutsideCanonical(text);
  if (/판정:\s*\*\*REGENERATE\*\*/i.test(body)) {
    errors.push(`${file}: CANONICAL_STATUS PASS but body has active **판정:** REGENERATE`);
  }
  if (/\*\*판정:\*\*\s*\*\*REGENERATE\*\*/i.test(body)) {
    errors.push(`${file}: CANONICAL_STATUS PASS but body has **판정:** **REGENERATE**`);
  }
}

if (errors.length) {
  console.error(`validate-prompt-status-dual: FAIL — ${errors.length}`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(STRICT ? 1 : 0);
}

const withCanonical = readdirSync(PROMPTS).filter((f) => {
  const t = readFileSync(join(PROMPTS, f), 'utf8');
  return f.endsWith('.md') && t.includes('CANONICAL_STATUS') && /현재 판정\*\*\s*\|\s*PASS/i.test(t);
}).length;

console.log(`validate-prompt-status-dual: OK (${withCanonical} PASS prompts checked)`);
