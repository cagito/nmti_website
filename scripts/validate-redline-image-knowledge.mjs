/**
 * Validate redline ↔ image-knowledge §13 alignment (canonical rework redlines).
 * Usage: node scripts/validate-redline-image-knowledge.mjs [--strict]
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { REDLINE_CANONICAL, REDLINES_DIR } from './lib/rework-phases.mjs';
import {
  REDLINE_IK_START,
  REDLINE_IK_END,
  IK_ROOT,
  topicForImgId,
  extractSection13Checklist,
  normalizeChecklistItem,
  escapeRe,
} from './lib/image-knowledge-map.mjs';

const STRICT = process.argv.includes('--strict');
let errors = 0;
let ok = 0;
let noMap = 0;

function extractRedlineBlock(body) {
  const re = new RegExp(
    `${escapeRe(REDLINE_IK_START)}([\\s\\S]*?)${escapeRe(REDLINE_IK_END)}`,
    'm'
  );
  const m = body.match(re);
  return m ? m[1] : null;
}

for (const [imgId, redlineFile] of Object.entries(REDLINE_CANONICAL)) {
  const topicFile = topicForImgId(imgId);
  if (!topicFile) {
    noMap += 1;
    if (STRICT) {
      console.error(`NO_MAP ${imgId}: redline ${redlineFile}`);
      errors += 1;
    }
    continue;
  }

  const topicPath = join(IK_ROOT, topicFile);
  const redlinePath = join(REDLINES_DIR, redlineFile);
  if (!existsSync(topicPath) || !existsSync(redlinePath)) {
    if (STRICT) {
      console.error(`MISSING_FILE ${imgId}`);
      errors += 1;
    }
    continue;
  }

  const topicItems = extractSection13Checklist(readFileSync(topicPath, 'utf8'));
  const redlineBody = readFileSync(redlinePath, 'utf8');
  const block = extractRedlineBlock(redlineBody);

  if (!block) {
    console.error(`NO_BLOCK ${imgId}: run sync:redline-image-knowledge`);
    errors += 1;
    continue;
  }

  if (!block.includes(topicFile)) {
    console.error(`TOPIC_LINK ${imgId}: block missing ${topicFile}`);
    errors += 1;
  }

  const blockNorm = normalizeChecklistItem(block);
  let missingItems = 0;
  for (const item of topicItems) {
    const norm = normalizeChecklistItem(item);
    if (!norm || blockNorm.includes(norm)) continue;
    console.error(`ITEM ${imgId}: missing §13 «${item.slice(0, 48)}…»`);
    missingItems += 1;
    errors += 1;
  }

  if (!missingItems && block) ok += 1;
}

console.log(
  `validate-redline-image-knowledge: ${ok} ok, ${noMap} no-map, ${errors} issues`
);

if (errors && STRICT) process.exit(1);
if (!errors) console.log('PASS');
