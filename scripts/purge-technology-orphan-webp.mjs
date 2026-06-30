#!/usr/bin/env node
/**
 * Delete WebP under assets/images/technology not referenced in images.js / registry / canonical map.
 * Usage: node scripts/purge-technology-orphan-webp.mjs [--dry-run]
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadCanonicalMap } from './lib/canonical-image.mjs';
import { backupAndDeleteTechnologyImage } from './lib/technology-image-backup.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgRoot = join(ROOT, 'assets', 'images', 'technology');
const DRY = process.argv.includes('--dry-run');

const imagesJs = readFileSync(join(ROOT, 'js', 'technology', 'images.js'), 'utf8');
const registry = readFileSync(join(ROOT, 'scripts', 'image-review-registry.json'), 'utf8');
const canonical = loadCanonicalMap(join(ROOT, 'scripts'));

const usedPaths = new Set();
for (const m of imagesJs.matchAll(/assets\/images\/technology\/[^\s'"]+/g)) {
  usedPaths.add(m[0].replace(/\\/g, '/'));
}
for (const m of registry.matchAll(/assets\/images\/technology\/[^\s'"]+/g)) {
  usedPaths.add(m[0].replace(/\\/g, '/'));
}
for (const v of Object.values(canonical)) {
  usedPaths.add(`assets/images/technology/${v}`);
}

function walk(dir, relPrefix, out) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'backup') continue;
    const abs = join(dir, name);
    const rel = relPrefix ? `${relPrefix}/${name}` : name;
    if (statSync(abs).isDirectory()) walk(abs, rel, out);
    else if (name.endsWith('.webp')) out.push({ abs, rel: rel.replace(/\\/g, '/') });
  }
}

const all = [];
walk(imgRoot, '', all);

const toDelete = [];
for (const { abs, rel } of all) {
  const key = `assets/images/technology/${rel}`;
  if (usedPaths.has(key)) continue;
  toDelete.push(key);
  if (!DRY) backupAndDeleteTechnologyImage(abs, { reason: 'orphan-webp', dryRun: false });
}

toDelete.sort();
console.log(`purge-technology-orphan-webp: ${DRY ? 'dry-run ' : ''}delete ${toDelete.length} (keep ${usedPaths.size} referenced)`);
for (const p of toDelete) console.log(' ', p);
