/**
 * Inject image-knowledge §13 checklist into canonical redlines.
 * Usage: node scripts/sync-redline-image-knowledge.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { REDLINE_CANONICAL, REDLINES_DIR } from './lib/rework-phases.mjs';
import {
  REDLINE_IK_START,
  REDLINE_IK_END,
  IK_ROOT,
  topicForImgId,
  extractSection13Checklist,
  escapeRe,
} from './lib/image-knowledge-map.mjs';

function buildBlock(topicFile, items) {
  const rel = `../../../docs/image-knowledge/${topicFile}`;
  const label = topicFile.replace(/\.md$/, '').replace(/^\d+-/, '');
  const lines = [
    REDLINE_IK_START,
    '## image-knowledge §13 (book 실행 규칙)',
    '',
    `> **정본:** [\`${label}\`](${rel}) · \`npm run sync:redline-image-knowledge\``,
    '',
    '**육안 검수 — image-knowledge §13과 1:1:**',
    '',
  ];
  for (const item of items) {
    lines.push(`- [ ] ${item}`);
  }
  lines.push(REDLINE_IK_END);
  return lines.join('\n');
}

function injectBlock(body, block) {
  const re = new RegExp(
    `${escapeRe(REDLINE_IK_START)}[\\s\\S]*?${escapeRe(REDLINE_IK_END)}`,
    'm'
  );
  if (re.test(body)) return body.replace(re, block);

  const signMatch = body.match(/\r?\n## 서명\r?\n/);
  if (signMatch && signMatch.index != null) {
    return body.slice(0, signMatch.index) + '\n\n' + block + '\n' + body.slice(signMatch.index);
  }
  return body.trimEnd() + '\n\n' + block + '\n';
}

let updated = 0;
let skipped = 0;
let missingTopic = 0;

for (const [imgId, redlineFile] of Object.entries(REDLINE_CANONICAL)) {
  const topicFile = topicForImgId(imgId);
  if (!topicFile) {
    missingTopic += 1;
    console.warn('skip', imgId, '(no map topic)');
    continue;
  }
  const topicPath = join(IK_ROOT, topicFile);
  if (!existsSync(topicPath)) {
    console.warn('skip', imgId, '(missing topic file)', topicFile);
    skipped += 1;
    continue;
  }

  const redlinePath = join(REDLINES_DIR, redlineFile);
  if (!existsSync(redlinePath)) {
    console.warn('skip', imgId, '(missing redline)', redlineFile);
    skipped += 1;
    continue;
  }

  const items = extractSection13Checklist(readFileSync(topicPath, 'utf8'));
  if (!items.length) {
    console.warn('skip', imgId, '(empty §13)', topicFile);
    skipped += 1;
    continue;
  }

  const block = buildBlock(topicFile, items);
  const body = readFileSync(redlinePath, 'utf8');
  const next = injectBlock(body, block);
  if (next !== body) {
    writeFileSync(redlinePath, next, 'utf8');
    updated += 1;
    console.log('redline §13', imgId, '←', topicFile, `(${items.length})`);
  } else skipped += 1;
}

console.log(
  `sync-redline-image-knowledge: updated ${updated}, skipped ${skipped}, no-map ${missingTopic}`
);
