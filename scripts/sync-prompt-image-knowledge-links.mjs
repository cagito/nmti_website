/**
 * Inject image-knowledge header links into ImageWorks prompts.
 * Usage: node scripts/sync-prompt-image-knowledge-links.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1');
const MAP = JSON.parse(
  readFileSync(join(ROOT, 'scripts', 'img-image-knowledge-map.json'), 'utf8')
);

export const LINKS_START = '<!-- image-knowledge-links:v1 -->';
export const LINKS_END = '<!-- /image-knowledge-links:v1 -->';

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function topicLabel(filename) {
  return filename.replace(/\.md$/, '').replace(/^\d+-/, '');
}

function buildLinkBlock(topicFile, extras = []) {
  const common = '00-공통-이미지-작성-원칙.md';
  const files = [
    common,
    topicFile,
    ...extras.filter((f) => f && f !== topicFile && f !== common)
  ];
  const parts = [...new Set(files)].map((f) => {
    const label = f === common ? '00-공통' : topicLabel(f);
    return `[${label}](../../../docs/image-knowledge/${f})`;
  });
  return `${LINKS_START}\n> **image-knowledge:** ${parts.join(' · ')}\n${LINKS_END}`;
}

function injectLinkBlock(body, block) {
  const re = new RegExp(
    `${escapeRe(LINKS_START)}[\\s\\S]*?${escapeRe(LINKS_END)}`,
    'm'
  );
  if (re.test(body)) return body.replace(re, block);

  const legacyRe = /^> \*\*image-knowledge:\*\*[^\n]*\n/m;
  if (legacyRe.test(body)) {
    return body.replace(legacyRe, block + '\n\n');
  }

  const titleMatch = body.match(/^# .+\n/m);
  if (titleMatch) {
    const insertAt = titleMatch.index + titleMatch[0].length;
    return body.slice(0, insertAt) + '\n' + block + '\n' + body.slice(insertAt);
  }
  return block + '\n\n' + body;
}

const master = JSON.parse(readFileSync(join(PKG, '03_IMAGE_MASTER_LIST.json'), 'utf8'));
let updated = 0;
let skipped = 0;

for (const [imgId, entry] of Object.entries(MAP.map)) {
  const topicFile = typeof entry === 'string' ? entry : entry.topic;
  const extras = typeof entry === 'object' && entry.also ? entry.also : [];
  if (!topicFile || !existsSync(join(ROOT, 'docs', 'image-knowledge', topicFile))) {
    skipped += 1;
    continue;
  }

  const masterEntry = master.find((e) => e.id === imgId);
  const rel = masterEntry?.prompt_file;
  if (!rel) continue;
  const target = join(PKG, ...rel.split('/'));
  if (!existsSync(target)) continue;

  const block = buildLinkBlock(topicFile, extras);
  const body = readFileSync(target, 'utf8');
  const next = injectLinkBlock(body, block);
  if (next !== body) {
    writeFileSync(target, next, 'utf8');
    updated += 1;
    console.log('links', imgId, '←', topicFile);
  } else skipped += 1;
}

console.log(`sync-prompt-image-knowledge-links: updated ${updated}, skipped ${skipped}`);
