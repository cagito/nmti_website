#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'docs', 'document-corpus-manifest.json');
const WRITE = process.argv.includes('--write');
const CHECK = process.argv.includes('--check');

const INCLUDE_EXT = new Set([
  '.md', '.markdown', '.pdf', '.hwp', '.hwpx', '.txt', '.json', '.mjs', '.js', '.py', '.csv'
]);

const EXCLUDE_DIRS = new Set([
  '.git', 'node_modules', 'dist', 'logs', '.git-sync-backup'
]);

const EXCLUDE_PREFIXES = [
  'assets/images/',
  'assets/images\\',
  'backup/',
  'backup\\'
];

const INCLUDE_ROOTS = [
  'AGENTS.md',
  'README.md',
  'docs',
  'book',
  'ImageWorks',
  'scripts/content-data',
  'scripts/image-review-registry.json',
  'scripts/figure-production-policy.json'
];

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

function shouldSkip(relPath) {
  if (!relPath) return false;
  if (EXCLUDE_PREFIXES.some((prefix) => relPath.startsWith(prefix))) return true;
  return false;
}

function isIncludedRoot(relPath) {
  return INCLUDE_ROOTS.some((root) => relPath === root || relPath.startsWith(`${root}/`));
}

function sha256(file) {
  const h = createHash('sha256');
  h.update(readFileSync(file));
  return h.digest('hex');
}

function walk(absDir, rows) {
  const items = readdirSync(absDir, { withFileTypes: true });
  for (const item of items) {
    const abs = path.join(absDir, item.name);
    const rp = rel(abs);
    if (item.isDirectory()) {
      if (EXCLUDE_DIRS.has(item.name)) continue;
      if (shouldSkip(`${rp}/`)) continue;
      walk(abs, rows);
      continue;
    }
    if (!item.isFile()) continue;
    if (shouldSkip(rp)) continue;
    if (!isIncludedRoot(rp)) continue;
    const ext = path.extname(item.name).toLowerCase();
    if (!INCLUDE_EXT.has(ext)) continue;
    const st = statSync(abs);
    rows.push({
      path: rp,
      ext: ext.slice(1) || 'none',
      sizeBytes: st.size,
      sha256: sha256(abs)
    });
  }
}

function buildManifest() {
  const files = [];
  walk(ROOT, files);
  files.sort((a, b) => a.path.localeCompare(b.path));
  const byExt = {};
  const byRoot = {};
  for (const f of files) {
    byExt[f.ext] = (byExt[f.ext] || 0) + 1;
    const root = f.path.split('/')[0];
    byRoot[root] = (byRoot[root] || 0) + 1;
  }
  return {
    schema: 'nmti.image-document-corpus.v1',
    generatedAt: new Date().toISOString(),
    policy: 'docs/219-문서전체-이미지작성-반영-정책.md',
    includeRoots: INCLUDE_ROOTS,
    excluded: [...EXCLUDE_DIRS, ...EXCLUDE_PREFIXES],
    counts: {
      files: files.length,
      byExt,
      byRoot
    },
    files
  };
}

const manifest = buildManifest();
const text = `${JSON.stringify(manifest, null, 2)}\n`;

if (WRITE) {
  writeFileSync(OUT, text, 'utf8');
  console.log(`wrote ${path.relative(ROOT, OUT)} (${manifest.counts.files} files)`);
} else if (CHECK) {
  if (!existsSync(OUT)) {
    console.error('missing docs/document-corpus-manifest.json; run with --write');
    process.exit(1);
  }
  const current = JSON.parse(readFileSync(OUT, 'utf8'));
  const normalize = (x) => JSON.stringify({ ...x, generatedAt: 'IGNORED' });
  if (normalize(current) !== normalize(manifest)) {
    console.error('document corpus manifest is stale; run node scripts/catalog-image-document-corpus.mjs --write');
    process.exit(1);
  }
  console.log(`document corpus manifest OK (${manifest.counts.files} files)`);
} else {
  process.stdout.write(text);
}
