/**
 * Sync 03_IMAGE_MASTER_LIST.json captions from js/technology/images.js (operational truth).
 * Usage: node scripts/sync-master-captions.mjs [--dry-run]
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');
const masterPath = join(
  ROOT,
  'ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/03_IMAGE_MASTER_LIST.json'
);
const imagesPath = join(ROOT, 'js/technology/images.js');

const master = JSON.parse(readFileSync(masterPath, 'utf8'));
const imagesText = readFileSync(imagesPath, 'utf8');

const caps = new Map();
const blockRe = /'(IMG-\d{3})':\s*\{([\s\S]*?)\n  \}/g;
let b;
while ((b = blockRe.exec(imagesText))) {
  const id = b[1];
  const cm = b[2].match(/caption:\s*'((?:\\'|[^'])*)'/);
  if (cm) caps.set(id, cm[1].replace(/\\'/g, "'"));
}

let n = 0;
for (const item of master) {
  const c = caps.get(item.id);
  if (!c || item.caption === c) continue;
  console.log(`${item.id}: sync caption`);
  if (!DRY) item.caption = c;
  n += 1;
}

if (!DRY && n) {
  writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`);
}
console.log(DRY ? `Would sync ${n} captions` : `Synced ${n} captions`);
