/**
 * FTP 배포용 파일 목록 생성 (운영 웹 자산만).
 * Usage: node scripts/list-deploy-manifest.mjs [--write]
 */
import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const writeOut = process.argv.includes('--write');

const DEPLOY_DIRS = [
  'assets',
  'css',
  'js',
  'sensors',
  'technology'
];

const DEPLOY_FILES = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'web.config'
];

/** Public book PDFs (referenced from web content). */
const DEPLOY_BOOK_PDFS = ['book/GNSS.pdf'];

const SKIP_PREFIXES = [
  'assets/images/technology/source/',
  'assets/images/technology/rejected/',
  'book/',
  'docs/',
  'ImageWorks/',
  'scripts/',
  'node_modules/'
];

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function isDeployable(rel) {
  if (SKIP_PREFIXES.some((p) => rel.startsWith(p))) return false;
  if (rel.endsWith('.md') || rel.endsWith('.mjs') || rel.endsWith('.py')) return false;
  return true;
}

function gitChanged() {
  try {
    const out = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
    return out
      .split('\n')
      .filter(Boolean)
      .map((line) => line.slice(3).trim().replace(/\\/g, '/'))
      .filter((p) => !p.startsWith('..') && isDeployable(p));
  } catch {
    return [];
  }
}

const paths = new Set(DEPLOY_FILES.filter((f) => existsSync(join(ROOT, f))));
for (const pdf of DEPLOY_BOOK_PDFS) {
  if (existsSync(join(ROOT, pdf))) paths.add(pdf);
}
for (const dir of DEPLOY_DIRS) {
  for (const abs of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, abs).replace(/\\/g, '/');
    if (isDeployable(rel)) paths.add(rel);
  }
}
for (const p of gitChanged()) {
  if (existsSync(join(ROOT, p))) paths.add(p);
}

const sorted = [...paths].sort();
const header = [
  '# NMTI homepage FTP deploy manifest (production only)',
  `# Generated: ${new Date().toISOString().slice(0, 10)}`,
  `# Files: ${sorted.length}`,
  '# Upload: homepage/ → server /homepage/',
  '# Parent (outside homepage/): website/robots.txt, website/sitemap.xml',
  ''
].join('\n');

const text = header + sorted.join('\n') + '\n';

if (writeOut) {
  writeFileSync(join(ROOT, 'docs/deploy-manifest.txt'), text, 'utf8');
  console.log('Wrote docs/deploy-manifest.txt (' + sorted.length + ' paths)');
} else {
  console.log(text);
}
