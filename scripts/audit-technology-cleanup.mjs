#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(ROOT, 'assets', 'images', 'technology');
const reg = JSON.parse(readFileSync(join(ROOT, 'scripts', 'image-review-registry.json'), 'utf8'));
const imagesJs = readFileSync(join(ROOT, 'js', 'technology', 'images.js'), 'utf8');
const dict = readFileSync(join(ROOT, 'js', 'technology', 'dictionary.js'), 'utf8');

function rootFiles() {
  return readdirSync(imgDir).filter((f) => !statSync(join(imgDir, f)).isDirectory());
}

const rejected = Object.entries(reg)
  .filter(([, v]) => v.status === 'rejected')
  .map(([k]) => k);

console.log('=== Rejected registry ===');
for (const id of rejected) {
  const onDisk = rootFiles().filter((f) => f.startsWith(id));
  console.log(id, {
    onDisk,
    inImagesJs: imagesJs.includes("'" + id + "'"),
    inDict: dict.includes('imageId: \'' + id + '\'') || dict.includes('"' + id + '"')
  });
}

console.log('\n=== Subdirs ===');
for (const name of readdirSync(imgDir)) {
  const abs = join(imgDir, name);
  if (!statSync(abs).isDirectory()) continue;
  const files = readdirSync(abs);
  console.log(name + '/', files.length, 'files', files.slice(0, 5));
}
