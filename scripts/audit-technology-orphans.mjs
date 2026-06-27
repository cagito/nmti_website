#!/usr/bin/env node
/** List technology image files not referenced by images.js */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgRoot = join(ROOT, 'assets', 'images', 'technology');
const imagesJs = readFileSync(join(ROOT, 'js', 'technology', 'images.js'), 'utf8');
const used = new Set(
  [...imagesJs.matchAll(/assets\/images\/technology\/[^'"]+/g)].map((m) => m[0])
);

const SKIP_DIRS = new Set(['rejected', 'reviewed', 'source']);

function walk(dir, relPrefix) {
  const orphans = [];
  if (!existsSync(dir)) return orphans;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) && !relPrefix) continue;
    const abs = join(dir, name);
    const rel = relPrefix + name;
    if (statSync(abs).isDirectory()) {
      orphans.push(...walk(abs, rel + '/'));
    } else if (name === '.gitkeep') {
      continue;
    } else {
      const key = 'assets/images/technology/' + rel;
      if (!used.has(key)) orphans.push(key);
    }
  }
  return orphans;
}

const orphans = walk(imgRoot, '');
console.log('Referenced paths in images.js:', used.size);
console.log('Orphan files:', orphans.length);
orphans.forEach((p) => console.log(' ', p));
