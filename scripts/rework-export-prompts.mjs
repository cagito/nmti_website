/**
 * 69종 복붙 프롬프트를 exports/rework-prompts/ 에 일괄 저장
 * Usage: node scripts/rework-export-prompts.mjs [--phase A] [--no-p0]
 */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT, PHASES } from './lib/rework-phases.mjs';
import { allReworkIds } from './lib/rework-phases.mjs';
import { loadP0Prefix, loadPromptBody, resolvePromptSource } from './lib/rework-prompt-index.mjs';
import { readFileSync } from 'fs';

const outDir = join(REWORK_ROOT, 'exports', 'rework-prompts');
const noP0 = process.argv.includes('--no-p0');
const phaseArg = (() => {
  const i = process.argv.indexOf('--phase');
  return i >= 0 ? process.argv[i + 1]?.toUpperCase() : null;
})();

const registry = JSON.parse(
  readFileSync(join(REWORK_ROOT, 'scripts', 'image-review-registry.json'), 'utf8'),
);

let ids = allReworkIds();
if (phaseArg) {
  const p = PHASES.find((x) => x.phase === phaseArg);
  if (!p) {
    console.error(`Unknown phase: ${phaseArg}`);
    process.exit(1);
  }
  ids = p.ids;
}

mkdirSync(outDir, { recursive: true });

let ok = 0;
let fail = 0;

for (const id of ids) {
  const title = registry[id]?.title || '';
  const src = resolvePromptSource(id);
  const { body } = loadPromptBody(id);
  if (!body) {
    console.error(`SKIP ${id}: no body`);
    fail++;
    continue;
  }
  const parts = [];
  if (!noP0) {
    const p0 = loadP0Prefix(title);
    if (p0) parts.push(p0);
  }
  parts.push(body);
  const header = `# ${id} — ${title}\n# source: ${src?.file || ''}\n\n`;
  const path = join(outDir, `${id}.txt`);
  writeFileSync(path, header + parts.join('\n\n---\n\n') + '\n', 'utf8');
  ok++;
}

const indexPath = join(outDir, '_INDEX.txt');
writeFileSync(
  indexPath,
  ids.map((id) => `${id}\t${registry[id]?.title || ''}`).join('\n') + '\n',
  'utf8',
);

console.log(`export: ${ok} written, ${fail} failed → ${outDir}`);
process.exit(fail ? 1 : 0);
