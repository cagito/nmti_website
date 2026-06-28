#!/usr/bin/env node
/**
 * List canonical redlines missing pixel-gate body (§13-only stubs).
 * Usage: node scripts/list-redline-stubs.mjs [--json]
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { REDLINE_CANONICAL, REDLINES_DIR } from './lib/rework-phases.mjs';
import { REDLINE_IK_START } from './lib/image-knowledge-map.mjs';

const jsonOut = process.argv.includes('--json');
const MIN_BODY = 2000;
const stubs = [];

for (const [imgId, file] of Object.entries(REDLINE_CANONICAL)) {
  const path = join(REDLINES_DIR, file);
  const raw = readFileSync(path, 'utf8');
  const withoutSync = raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/## image-knowledge §13[\s\S]*$/m, '')
    .trim();
  const hasPixelGate = /##\s*[01]\./.test(withoutSync) || /##\s*0\./.test(raw);
  const chars = withoutSync.length;
  if (!hasPixelGate || chars < MIN_BODY) {
    stubs.push({ imgId, file, chars, hasPixelGate, hasIkBlock: raw.includes(REDLINE_IK_START) });
  }
}

stubs.sort((a, b) => a.chars - b.chars);

if (jsonOut) {
  console.log(JSON.stringify(stubs, null, 2));
} else {
  console.log(`redline stubs: ${stubs.length}/${Object.keys(REDLINE_CANONICAL).length} (body<${MIN_BODY} or no §0/§1)`);
  for (const s of stubs) {
    console.log(
      `${s.imgId}  ${s.chars}ch  pixelGate=${s.hasPixelGate ? 'Y' : 'N'}  §13=${s.hasIkBlock ? 'Y' : 'N'}  ${s.file}`
    );
  }
}
