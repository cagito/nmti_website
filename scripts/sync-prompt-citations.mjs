#!/usr/bin/env node
/**
 * Inject ## 근거 기준 into ImageWorks prompts (Phase 3).
 * Run: node scripts/sync-prompt-citations.mjs
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { resolveSourcesForNode } from './lib/resolve-citations.mjs';
import {
  formatSourcesBlock,
  injectCitationBlock,
  CITATION_SYNC_START
} from './lib/format-citation-md.mjs';
import { resolveNodeForImg } from './lib/img-node-map.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PKG = join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1');
const MASTER = join(PKG, '03_IMAGE_MASTER_LIST.json');

const master = JSON.parse(readFileSync(MASTER, 'utf8'));
if (!Array.isArray(master) || !master.length) {
  console.error('sync-prompt-citations: master list empty or invalid — aborting write');
  process.exit(1);
}
let updated = 0;
let skipped = 0;
let missing = 0;

/** @type {Map<string, { category?: string, prompt_file: string }>} */
const byImg = new Map(master.map((e) => [e.id, e]));

const promptDir = join(PKG, 'prompts');
for (const name of readdirSync(promptDir)) {
  if (!name.endsWith('.md')) continue;
  const m = name.match(/^(IMG-\d+)_/);
  if (!m) continue;
  const imgId = m[1];
  const rel = `prompts/${name}`;
  if (!byImg.has(imgId)) {
    byImg.set(imgId, { prompt_file: rel });
  }
}

for (const [imgId, entry] of byImg) {
  const rel = entry.prompt_file;
  if (!rel) continue;
  const target = join(PKG, ...rel.split('/'));
  if (!existsSync(target)) {
    missing += 1;
    console.warn('Missing prompt:', rel);
    continue;
  }

  const nodeId = resolveNodeForImg(imgId, entry.category);
  if (master.find((e) => e.id === imgId)) {
    const row = master.find((e) => e.id === imgId);
    row.standard_ref_node = nodeId;
  }

  const { sources } = resolveSourcesForNode(nodeId);
  const block = formatSourcesBlock(sources, { nodeId });
  const body = readFileSync(target, 'utf8');
  if (!body.trim()) {
    console.warn('SKIP empty prompt (no overwrite):', rel);
    missing += 1;
    continue;
  }
  const next = injectCitationBlock(body, block);
  if (!next.trim()) {
    console.error('ABORT would empty prompt:', rel);
    process.exit(1);
  }
  if (next === body && body.includes(CITATION_SYNC_START)) {
    skipped += 1;
    continue;
  }
  writeFileSync(target, next, 'utf8');
  updated += 1;
}

atomicWriteUtf8(MASTER, JSON.stringify(master, null, 2) + '\n');
console.log(`Updated ${MASTER} with standard_ref_node`);

console.log(`sync-prompt-citations: updated ${updated}, skipped ${skipped}, missing ${missing}`);
