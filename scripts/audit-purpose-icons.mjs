#!/usr/bin/env node
import { inferPurposeIcon } from '../js/technology/purpose-icons.js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'content-data');
const titles = new Set();
for (const f of readdirSync(dir).filter((x) => x.endsWith('.mjs'))) {
  const s = readFileSync(join(dir, f), 'utf8');
  for (const m of s.matchAll(/title:\s*'([^']+)'/g)) titles.add(m[1]);
}

const byIcon = new Map();
let dot = 0;
for (const t of titles) {
  const icon = inferPurposeIcon(t);
  if (icon === 'dot') dot += 1;
  if (!byIcon.has(icon)) byIcon.set(icon, []);
  byIcon.get(icon).push(t);
}

console.log('Purpose titles:', titles.size);
console.log('Fallback dot:', dot, `(${((dot / titles.size) * 100).toFixed(1)}%)`);
console.log('Distinct icons:', byIcon.size);
if (dot) {
  console.log('\nDot fallback titles:');
  byIcon.get('dot').sort((a, b) => a.localeCompare(b, 'ko')).forEach((t) => console.log(' -', t));
}
