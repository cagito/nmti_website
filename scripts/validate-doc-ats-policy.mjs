/**
 * DOC-CANON-02 Phase G3 — Figure 표준 md에서 ATS-deny 맥락의 ATS 필수 문구 탐지.
 * 정본: docs/210 §8 G3 · docs/206 ATS-SUB-01
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STRICT = process.argv.includes('--strict');

/** @type {{ path: string, label: string }[]} */
const DENY_FIGURE_DOCS = [
  { path: 'docs/56-IMG-005-주변건물-균열경사-표현-표준.md', label: 'IMG-005' },
  { path: 'docs/45-교각-경사-변위-계측-표현-표준.md', label: 'IMG-012' },
  { path: 'docs/47-교량-기초-침하-계측-표현-표준.md', label: 'IMG-013' },
  { path: 'docs/129-사면-옹벽-와이어식-변위계-배면사면-표준.md', label: 'IMG-090' }
];

/** @type {RegExp[]} */
const REQUIRE_PATTERNS = [
  /자동\s*광파기[^.\n]{0,50}(필수|반드시|포함|hero|표시)/i,
  /\bATS\b[^.\n]{0,30}(필수|반드시|포함|hero)/i,
  /Total\s+Station[^.\n]{0,30}(필수|반드시|포함|hero)/i
];

/** @param {string} line */
function isDenyOrNegativeContext(line) {
  return /금지|하지\s*않|폐기|ATS-SUB-01|없음|제외|NOT\b|금지\)|\*\*금지/i.test(line);
}

/** @param {string} text */
function inDenySection(text, lineIndex) {
  const lines = text.split('\n');
  let section = '';
  for (let i = 0; i <= lineIndex; i++) {
    if (/^##\s+/.test(lines[i])) section = lines[i];
  }
  return /금지|ATS-SUB|Negative|과거/i.test(section);
}

/** @type {string[]} */
const errors = [];

for (const { path: rel, label } of DENY_FIGURE_DOCS) {
  const full = join(ROOT, rel);
  if (!existsSync(full)) {
    errors.push(`${label}: missing ${rel}`);
    continue;
  }
  const text = readFileSync(full, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (isDenyOrNegativeContext(line) || inDenySection(text, i)) return;
    for (const re of REQUIRE_PATTERNS) {
      if (re.test(line)) {
        errors.push(`${label} ${rel}:${i + 1} — ATS required phrasing in deny-figure doc: ${line.trim().slice(0, 100)}`);
        break;
      }
    }
  });
}

if (errors.length) {
  console.error(`validate-doc-ats-policy: FAIL — ${errors.length}`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(STRICT ? 1 : 0);
}

console.log(`validate-doc-ats-policy: OK (${DENY_FIGURE_DOCS.length} deny-figure standards)`);
