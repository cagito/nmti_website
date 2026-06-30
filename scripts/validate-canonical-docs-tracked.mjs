/**
 * DOC-CANON-01 — CANONICAL_DOC_INDEX Tier A·B files must be Git-tracked.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INDEX = join(ROOT, 'docs', 'CANONICAL_DOC_INDEX.md');
const STRICT = process.argv.includes('--strict');

if (!existsSync(INDEX)) {
  console.error('CANONICAL_DOC_INDEX.md missing');
  process.exit(STRICT ? 1 : 0);
}

const text = readFileSync(INDEX, 'utf8');
const paths = new Set();
for (const m of text.matchAll(/\]\(\.\/([^)]+\.md)\)/g)) {
  paths.add(`docs/${m[1].split('#')[0]}`);
}

/** @type {string[]} */
const missing = [];
/** @type {string[]} */
const untracked = [];

for (const rel of paths) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) {
    missing.push(rel);
    continue;
  }
  try {
    const out = execSync(`git ls-files -- "${rel.replace(/\\/g, '/')}"`, {
      cwd: ROOT,
      encoding: 'utf8'
    }).trim();
    if (!out) untracked.push(rel);
  } catch {
    untracked.push(rel);
  }
}

if (missing.length || untracked.length) {
  console.error('validate-canonical-docs: FAIL');
  missing.forEach((p) => console.error(`  MISSING: ${p}`));
  untracked.forEach((p) => console.error(`  NOT GIT-TRACKED: ${p}`));
  process.exit(STRICT ? 1 : 0);
}

console.log(`validate-canonical-docs: OK (${paths.size} canonical paths)`);
