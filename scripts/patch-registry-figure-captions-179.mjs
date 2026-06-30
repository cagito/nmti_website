#!/usr/bin/env node
/**
 * Apply 179 §9 caption/alt/title to image-review-registry.json
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REG_PATH = join(ROOT, 'scripts', 'image-review-registry.json');
const SPEC_PATH = join(ROOT, 'scripts', 'data', 'figure-caption-179.json');

runLocked('registry', '179 figure captions', () => {
  const registry = JSON.parse(readFileSync(REG_PATH, 'utf8'));
  const { figures } = JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
  const stamp = new Date().toISOString().slice(0, 10);
  let n = 0;

  for (const [id, spec] of Object.entries(figures)) {
    const reg = registry[id];
    if (!reg) {
      console.warn(`skip missing ${id}`);
      continue;
    }
    for (const field of ['title', 'alt', 'caption']) {
      if (spec[field]) reg[field] = spec[field];
    }
    const tag = `179 §9 caption sync ${stamp}`;
    reg.notes = reg.notes ? `${reg.notes} · ${tag}` : tag;
    if (id === 'IMG-075') {
      reg.notes += ' · pixel 5단계 ladder REGENERATE 권장(캡션만 정합)';
    }
    n++;
  }

  atomicWriteUtf8(REG_PATH, JSON.stringify(registry, null, 2) + '\n');
  console.log(`patched ${n} figure caption(s) in registry`);
});
