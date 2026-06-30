/**
 * DOC-CANON-02 Phase G1 — Figure 표준 금지어 ↔ image-rules-sync 필수 오염 방지.
 * 정본: docs/210 §8 G1 · SYNC-005
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
const CONFIG = join(__dirname, 'prompt-rules-consistency.json');
const STRICT = process.argv.includes('--strict');

const RULES_START = '<!-- image-rules-sync:v1 -->';
const RULES_END = '<!-- /image-rules-sync:v1 -->';

/** @param {string} block @param {string} header */
function extractSection(block, header) {
  const re = new RegExp(
    `\\*\\*${header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\*\\*([\\s\\S]*?)(?=\\*\\*[^*]+:\\*\\*|<!--|$)`,
    'i'
  );
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

/** @param {string} text */
function rulesBlock(text) {
  const s = text.indexOf(RULES_START);
  const e = text.indexOf(RULES_END);
  if (s === -1 || e === -1) return '';
  return text.slice(s, e);
}

/** @param {string} section @param {string[]} terms */
function findForbidden(section, terms) {
  /** @type {string[]} */
  const hits = [];
  for (const term of terms) {
    if (section.includes(term)) hits.push(term);
  }
  return hits;
}

/** @type {{ rules: Record<string, { forbiddenInRequired?: string[], requiredInDeny?: string[], standard?: string }> }} */
const { rules } = JSON.parse(readFileSync(CONFIG, 'utf8'));

/** @type {string[]} */
const errors = [];

for (const file of readdirSync(PROMPTS).filter((f) => f.endsWith('.md'))) {
  const imgMatch = file.match(/^(IMG-\d{3})_/);
  if (!imgMatch) continue;
  const imgId = imgMatch[1];
  const rule = rules[imgId];
  if (!rule) continue;

  const path = join(PROMPTS, file);
  const text = readFileSync(path, 'utf8');
  const block = rulesBlock(text);
  if (!block) {
    errors.push(`${imgId}: missing image-rules-sync block (${file})`);
    continue;
  }

  const required = extractSection(block, '반드시 그릴 요소');
  if (rule.forbiddenInRequired?.length) {
    const hits = findForbidden(required, rule.forbiddenInRequired);
    if (hits.length) {
      errors.push(
        `${imgId}: forbidden in **반드시 그릴** — ${hits.join(', ')} (${rule.standard || 'standard'})`
      );
    }
  }

  const deny = extractSection(block, '절대 금지');
  if (rule.requiredInDeny?.length) {
    const found = rule.requiredInDeny.some((term) => deny.includes(term));
    if (!found) {
      errors.push(
        `${imgId}: **절대 금지** must mention one of: ${rule.requiredInDeny.join(', ')} (${file})`
      );
    }
  }
}

if (errors.length) {
  console.error(`validate-prompt-rules-consistency: FAIL — ${errors.length}`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(STRICT ? 1 : 0);
}

const count = Object.keys(rules).length;
console.log(`validate-prompt-rules-consistency: OK (${count} IMG rules checked)`);
