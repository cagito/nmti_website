/**
 * ImageWorks 마스터리스트 ↔ 프롬프트 파일 일치 검증.
 * Usage: node scripts/validate-image-master.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1');
const master = JSON.parse(readFileSync(join(pkg, '03_IMAGE_MASTER_LIST.json'), 'utf8'));
const imgDir = join(ROOT, 'assets', 'images', 'technology');
const canonicalPath = join(ROOT, 'scripts', 'canonical-image-png.json');
const canonicalPng = existsSync(canonicalPath)
  ? JSON.parse(readFileSync(canonicalPath, 'utf8'))
  : {};

function canonicalWebpName(id) {
  const canonical = canonicalPng[id];
  return canonical ? canonical.replace(/\.png$/i, '.webp') : `${id}.webp`;
}

const webpFiles = readdirSync(imgDir).filter((f) => /^IMG-\d{3}_/.test(f) && f.endsWith('.webp'));
const byId = new Map();
for (const file of webpFiles) {
  const id = file.match(/^(IMG-\d{3})/)[1];
  if (!byId.has(id)) byId.set(id, []);
  byId.get(id).push(file);
}

const webpIds = new Set(byId.keys());

let failed = 0;
for (const [id, files] of byId) {
  if (files.length <= 1) continue;
  const canonical = canonicalWebpName(id);
  if (canonical && files.includes(canonical)) {
    const extras = files.filter((f) => f !== canonical);
    console.error('DUPLICATE WebP (remove extras):', id, extras.join(', '));
    failed++;
  } else {
    console.error('DUPLICATE WebP (no canonical):', id, files.join(', '));
    failed++;
  }
}
for (const [id, canonical] of Object.entries(canonicalPng)) {
  const webp = canonical.replace(/\.png$/i, '.webp');
  if (!existsSync(join(imgDir, webp))) {
    console.error('MISSING canonical WebP:', id, webp);
    failed++;
  }
}
for (const item of master) {
  const promptPath = join(pkg, item.prompt_file);
  if (!existsSync(promptPath)) {
    console.error('MISSING prompt:', item.id, item.prompt_file);
    failed++;
  }
  if (!webpIds.has(item.id)) {
    console.log('WebP pending:', item.id, item.title);
  } else {
    const shortWebp = join(imgDir, item.id + '.webp');
    if (existsSync(shortWebp)) {
      console.error('LEGACY short WebP remains:', item.id);
      failed++;
    }
  }
}

const masterIds = new Set(master.map((m) => m.id));
for (const id of webpIds) {
  if (!masterIds.has(id)) {
    console.error('WebP not in master:', id);
    failed++;
  }
}

if (failed) {
  console.error('validate-image-master: FAIL', failed);
  process.exit(1);
}
console.log('validate-image-master: OK', master.length, 'entries,', webpIds.size, 'WebP on disk');
