#!/usr/bin/env node
/**
 * 179 §9 — registry caption/alt vs figure-caption-179.json
 * Usage: node scripts/validate-figure-captions-179.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REG_PATH = join(ROOT, 'scripts', 'image-review-registry.json');
const SPEC_PATH = join(ROOT, 'scripts', 'data', 'figure-caption-179.json');

const registry = JSON.parse(readFileSync(REG_PATH, 'utf8'));
const { figures } = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
let failed = 0;

for (const [id, spec] of Object.entries(figures)) {
  const reg = registry[id];
  if (!reg) {
    console.error(`FAIL missing registry entry: ${id}`);
    failed++;
    continue;
  }
  for (const field of ['title', 'alt', 'caption']) {
    if (spec[field] && reg[field] !== spec[field]) {
      console.error(`FAIL [${id}] ${field}: expected "${spec[field]}" got "${reg[field] ?? ''}"`);
      failed++;
    }
  }
  for (const bad of spec.forbiddenInCaption ?? []) {
    const cap = `${reg.caption ?? ''}${reg.alt ?? ''}${reg.title ?? ''}`;
    if (cap.includes(bad)) {
      console.error(`FAIL [${id}] forbidden in caption/alt/title: "${bad}"`);
      failed++;
    }
  }
}

if (failed) {
  console.error(`validate-figure-captions-179: ${failed} issue(s) — run patch:registry-figure-captions-179`);
  process.exit(1);
}

console.log(`validate-figure-captions-179: OK (${Object.keys(figures).length} figures)`);
