/**
 * Validate internal markdown links in docs/ and ImageWorks resolve to existing files.
 * Usage: node scripts/validate-doc-links.mjs [--strict]
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');

const SCAN_ROOTS = [
  join(ROOT, 'docs'),
  join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1')
];

const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;
const SKIP_SCHEMES = /^(https?:|mailto:|#)/i;

function walkMd(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules') continue;
      walkMd(p, out);
    } else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

function resolveLink(fromFile, raw) {
  let target = raw.trim();
  if (!target || SKIP_SCHEMES.test(target)) return null;
  target = target.split('#')[0].split('?')[0].trim();
  if (!target) return null;
  try {
    target = decodeURIComponent(target);
  } catch {
    /* keep */
  }
  if (target.startsWith('/')) return join(ROOT, target.replace(/^\//, ''));
  if (target.startsWith('book/')) return join(ROOT, target);
  const fromNorm = fromFile.replace(/\\/g, '/');
  if (fromNorm.includes('/ImageWorks/')) {
    const docsMatch = target.match(/^(?:\.\.\/)+docs\/(.+)$/);
    if (docsMatch) {
      const tail = docsMatch[1].replace(/078·009/g, '078-009');
      return join(ROOT, 'docs', tail);
    }
    if (target === './05-간극수압계-설치-개념.md') {
      return join(ROOT, 'docs/image-knowledge/05-간극수압계-설치-개념.md');
    }
    const upNum = target.match(/^\.\.\/(\d{2,3}-.+\.md)$/);
    if (upNum) return join(ROOT, 'docs', upNum[1]);
    const dotNum = target.match(/^\.\/(\d{2,3}-.+\.md)$/);
    if (dotNum) return join(ROOT, 'docs', dotNum[1]);
    if (/^\.\/(TECHNICAL_|IMAGE_|INSTRUMENTATION)/.test(target)) {
      return join(ROOT, 'docs', target.slice(2));
    }
  }
  return resolve(dirname(fromFile), target);
}

let errors = 0;
let checked = 0;

for (const root of SCAN_ROOTS) {
  for (const file of walkMd(root)) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(LINK_RE)) {
      const href = m[2];
      const resolved = resolveLink(file, href);
      if (!resolved) continue;
      checked += 1;
      if (!existsSync(resolved)) {
        const rel = file.slice(ROOT.length + 1).replace(/\\/g, '/');
        console.error(`BROKEN: ${rel} → (${href})`);
        errors += 1;
      }
    }
  }
}

if (errors) {
  console.error(`validate-doc-links: FAIL — ${errors} broken / ${checked} internal links`);
  process.exit(STRICT ? 1 : 0);
}
console.log(`validate-doc-links: OK — ${checked} internal links (docs + ImageWorks)`);
