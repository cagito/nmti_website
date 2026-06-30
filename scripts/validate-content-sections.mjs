#!/usr/bin/env node
/**
 * 5섹션 통일 — 모든 콘텐츠 노드가 본문 1~5섹션을 갖는지 검증
 */
import { getAllContentNodeIds } from '../js/technology/dictionary.js';
import { getContentForNode } from '../js/technology/content-data.js';
import { missingUnifiedSections, UNIFIED_KEYS } from '../js/technology/unified-sections.mjs';

const errors = [];
let ok = 0;

function check(id, content) {
  if (!content?.sections) {
    errors.push(`${id}: no sections`);
    return;
  }
  const missing = missingUnifiedSections(content);
  if (missing.length) {
    errors.push(`${id}: missing ${missing.length}/5 (${missing.join(', ')})`);
  } else {
    ok++;
  }
}

for (const id of getAllContentNodeIds()) {
  check(id, getContentForNode(id));
}

check('intro', getContentForNode('intro'));

console.log(
  `validate-content-sections: ${ok}/${getAllContentNodeIds().length + 1} nodes with ${UNIFIED_KEYS.length}/5 sections`
);
if (errors.length) {
  for (const e of errors) console.error(' ', e);
  process.exit(1);
}
