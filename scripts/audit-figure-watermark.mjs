#!/usr/bin/env node
/** Audit WATERMARK-01 — manifest coverage for Figure PNGs. */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MANIFEST = join(ROOT, 'scripts', 'watermark-manifest.json');
const DIRS = [
  join(ROOT, 'assets', 'images', 'technology'),
  join(ROOT, 'assets', 'images', 'technology', 'reviewed')
];
const PNG_RE = /^IMG-\d{3}_.+\.png$/i;

function collectPngs() {
  const seen = new Set();
  const out = [];
  for (const dir of DIRS) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!PNG_RE.test(name)) continue;
      const rel = 'assets/images/technology' + (dir.endsWith('reviewed') ? '/reviewed' : '') + '/' + name;
      const key = rel.replace('/reviewed/', '/reviewed/');
      const norm = dir.endsWith('reviewed') ? `assets/images/technology/reviewed/${name}` : `assets/images/technology/${name}`;
      if (seen.has(norm)) continue;
      seen.add(norm);
      out.push(norm);
    }
  }
  return out.sort();
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
const pngs = collectPngs();
const missing = pngs.filter(function (rel) {
  const e = manifest[rel];
  return !e || !e.watermarked;
});

if (missing.length) {
  console.error('audit-figure-watermark: FAIL —', missing.length, 'unstamped');
  missing.slice(0, 20).forEach(function (m) {
    console.error('  -', m);
  });
  if (missing.length > 20) console.error('  ... and', missing.length - 20, 'more');
  process.exit(1);
}

console.log('audit-figure-watermark: OK', pngs.length, 'PNG entries in manifest');
process.exit(0);
