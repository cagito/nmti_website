/**
 * DOC-CANON-01 Tier C — ARCHIVE docs must have top banner (판정 금지).
 * docs/208 §2.3 · docs/210 Phase F TIER-C
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INDEX = join(ROOT, 'docs', 'CANONICAL_DOC_INDEX.md');
const STRICT = process.argv.includes('--strict');
const HEAD_LINES = 50;

/** @returns {string[]} */
function tierCPaths(indexText) {
  const tierC = indexText.match(/## Tier C[\s\S]*?(?=\n## |\n*$)/);
  if (!tierC) return [];
  const paths = [];
  for (const line of tierC[0].split('\n')) {
    const m = line.match(/^\|\s*\[[^\]]*\]\(\.\/([^)]+\.md)\)/);
    if (m) paths.push(`docs/${m[1].split('#')[0]}`);
  }
  return [...new Set(paths)];
}

/** @param {string} head */
function hasArchiveBanner(head) {
  return (
    /역사 문서\s*\(ARCHIVE\)/.test(head) &&
    /현재 판정은 본 문서가 아니다/.test(head) &&
    (/재작도 금지/.test(head) || /reviewGrade=PASS/.test(head))
  );
}

/** Active REGENERATE in header (not strikethrough / not under 과거 판정 section). */
/** @param {string} head */
function hasActiveRegenerateInHeader(head) {
  const lines = head.split('\n');
  let inPastSection = false;
  for (const line of lines) {
    if (/^###\s+과거 판정/.test(line)) inPastSection = true;
    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) inPastSection = false;
    if (inPastSection) continue;
    if (/판정:\s*\*\*REGENERATE\*\*/i.test(line) && !/~~/.test(line)) return true;
    if (/\*\*판정:\*\*\s*REGENERATE/i.test(line) && !/~~/.test(line)) return true;
  }
  return false;
}

if (!existsSync(INDEX)) {
  console.error('validate-archive-banner: CANONICAL_DOC_INDEX.md missing');
  process.exit(STRICT ? 1 : 0);
}

const indexText = readFileSync(INDEX, 'utf8');
const archives = tierCPaths(indexText);

/** @type {string[]} */
const errors = [];

if (!archives.length) {
  errors.push('Tier C: no archive paths in CANONICAL_DOC_INDEX');
}

for (const rel of archives) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) {
    errors.push(`${rel}: missing`);
    continue;
  }
  const text = readFileSync(abs, 'utf8');
  const head = text.split('\n').slice(0, HEAD_LINES).join('\n');
  if (!hasArchiveBanner(head)) {
    errors.push(`${rel}: missing ARCHIVE banner (first ${HEAD_LINES} lines)`);
  }
  if (hasActiveRegenerateInHeader(head)) {
    errors.push(`${rel}: active REGENERATE in header — move under ### 과거 판정`);
  }
}

if (errors.length) {
  console.error(`validate-archive-banner: FAIL — ${errors.length}`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(STRICT ? 1 : 0);
}

console.log(`validate-archive-banner: OK (${archives.length} Tier C docs)`);
