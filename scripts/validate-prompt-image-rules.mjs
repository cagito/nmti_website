/**
 * Mapped IMG prompts must include image-rules-sync when topic has §5·§6.
 * Usage: node scripts/validate-prompt-image-rules.mjs [--strict]
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const RULES_SYNC_START = '<!-- image-rules-sync:v1 -->';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');
const PKG = join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1');
const IK = join(ROOT, 'docs', 'image-knowledge');
const MAP = JSON.parse(readFileSync(join(ROOT, 'scripts', 'img-image-knowledge-map.json'), 'utf8'));
const MASTER = JSON.parse(readFileSync(join(PKG, '03_IMAGE_MASTER_LIST.json'), 'utf8'));

function topicFromEntry(entry) {
  if (typeof entry === 'string') return entry;
  return entry?.topic || null;
}

function hasSectionBullets(topicFile, sectionNum) {
  const path = join(IK, topicFile);
  if (!existsSync(path)) return false;
  const text = readFileSync(path, 'utf8');
  const re = new RegExp(
    `## ${sectionNum}\\. [^\r\n]+\r?\n\r?\n([\\s\\S]*?)(?=\r?\n## |$)`
  );
  const m = text.match(re);
  if (!m) return false;
  return m[1].split(/\r?\n/).some((l) => l.trim().startsWith('- '));
}

function topicRequiresRules(topicFile) {
  return hasSectionBullets(topicFile, 5) || hasSectionBullets(topicFile, 6);
}

const missing = [];
let checked = 0;
let ok = 0;
let noRulesNeeded = 0;

for (const [imgId, mapEntry] of Object.entries(MAP.map)) {
  const topicFile = topicFromEntry(mapEntry);
  if (!topicFile || !topicRequiresRules(topicFile)) {
    noRulesNeeded += 1;
    continue;
  }
  const entry = MASTER.find((e) => e.id === imgId);
  const rel = entry?.prompt_file;
  if (!rel) continue;
  const target = join(PKG, ...rel.split('/'));
  if (!existsSync(target)) {
    missing.push({ imgId, topicFile, reason: 'prompt file missing' });
    continue;
  }
  checked += 1;
  const body = readFileSync(target, 'utf8');
  if (!body.includes(RULES_SYNC_START)) {
    missing.push({ imgId, topicFile, reason: 'no image-rules-sync block' });
  } else {
    ok += 1;
  }
}

console.log(
  `validate-prompt-image-rules: ${ok}/${checked} with §5·§6 rules block (${noRulesNeeded} topics without §5·§6 requirement)`
);

if (missing.length) {
  for (const m of missing) {
    console.error(`MISSING ${m.imgId} (${m.topicFile}): ${m.reason}`);
  }
  if (strict) process.exit(1);
} else {
  console.log('OK   validate-prompt-image-rules');
}
