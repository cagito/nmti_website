/**
 * 69종 rework Figure — 복붙 프롬프트 소스 해석 검증
 * Usage: node scripts/validate-rework-prompts.mjs [--strict]
 */
import { allReworkIds } from './lib/rework-phases.mjs';
import { loadPromptBody } from './lib/rework-prompt-index.mjs';

const strict = process.argv.includes('--strict');
const ids = allReworkIds();
const missing = [];

for (const id of ids) {
  const { body, src } = loadPromptBody(id);
  if (!body) missing.push({ id, file: src?.file || '(none)' });
}

if (missing.length) {
  console.error(`rework prompts: ${ids.length - missing.length}/${ids.length} OK`);
  for (const m of missing) {
    console.error(`FAIL ${m.id}: no block — ${m.file}`);
  }
  process.exit(strict ? 1 : 0);
}

console.log(`rework prompts: ${ids.length}/${ids.length} OK`);
process.exit(0);
