/**
 * 재작도 Figure 복붙 프롬프트 출력 (AI/CAD용)
 * Usage:
 *   node scripts/rework-prompt.mjs --id IMG-002
 *   node scripts/rework-prompt.mjs          # rework:next 1순위
 *   node scripts/rework-prompt.mjs --id IMG-002 --out prompt.txt
 *   node scripts/rework-prompt.mjs --id IMG-002 --no-p0
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { readFileSync } from 'fs';
import { REWORK_ROOT, PHASES } from './lib/rework-phases.mjs';
import { loadP0Prefix, loadPromptBody, resolvePromptSource } from './lib/rework-prompt-index.mjs';

const registry = JSON.parse(
  readFileSync(join(REWORK_ROOT, 'scripts', 'image-review-registry.json'), 'utf8'),
);

const args = process.argv.slice(2);
const idArg = (() => {
  const i = args.indexOf('--id');
  if (i >= 0) return args[i + 1];
  const bare = args.find((a) => /^IMG-\d{3}$/.test(a));
  return bare || null;
})();
const noP0 = args.includes('--no-p0');
const outIdx = args.indexOf('--out');
const outPath = outIdx >= 0 ? args[outIdx + 1] : null;

function firstPendingId() {
  for (const p of PHASES) {
    for (const id of p.ids) {
      const reg = registry[id];
      if (!reg) continue;
      const needs =
        reg.requiresReaudit === true ||
        reg.prohibitedVerified !== true ||
        reg.visualReview?.grade !== 'PASS';
      if (needs) return id;
    }
  }
  return null;
}

const id = idArg || firstPendingId();
if (!id) {
  console.error('재작도 대기 Figure 없음 — rework:status 확인');
  process.exit(1);
}

const reg = registry[id];
const title = reg?.title || '';
const src = resolvePromptSource(id);

if (!src) {
  console.error(`프롬프트 소스 없음: ${id} — docs/108 · ImageWorks prompts 확인`);
  process.exit(1);
}

const { body } = loadPromptBody(id);
if (!body) {
  console.error(`복붙 블록 추출 실패: ${id} — ${src.file}`);
  process.exit(1);
}

const parts = [];
if (!noP0) {
  const p0 = loadP0Prefix(title);
  if (p0) parts.push(p0);
}
parts.push(body);

const output = parts.join('\n\n---\n\n');
const header = `# ${id} — ${title}\n# source: ${src.file}${src.heading ? ` · ${src.heading}` : ''}\n\n`;

if (outPath) {
  writeFileSync(outPath, header + output, 'utf8');
  console.log(`Wrote ${outPath} (${output.length} chars)`);
} else {
  process.stdout.write(header + output + '\n');
}
