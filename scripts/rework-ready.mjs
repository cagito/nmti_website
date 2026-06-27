/**
 * source/ PNG 있으나 아직 서명 대기(requiresReaudit) Figure 목록
 * Usage: node scripts/rework-ready.mjs [--json]
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT, PHASES } from './lib/rework-phases.mjs';
import { hasSourcePng } from './lib/rework-source.mjs';

const registryPath = join(REWORK_ROOT, 'scripts', 'image-review-registry.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const asJson = process.argv.includes('--json');

const ready = [];
for (const p of PHASES) {
  for (const id of p.ids) {
    const reg = registry[id];
    if (!reg || reg.requiresReaudit !== true) continue;
    const { ok, path } = hasSourcePng(id);
    if (!ok) continue;
    ready.push({
      id,
      phase: p.phase,
      week: p.week,
      title: reg.title || '',
      source: path,
      register: `npm run rework:register -- --id ${id} --input ${path.replace(/\\/g, '/')} --reviewer "검수자"`,
      sign: `npm run rework:sign -- --id ${id}`,
      done: `npm run rework:done -- --id ${id} --input ${path.replace(/\\/g, '/')} --reviewer "검수자"`,
    });
  }
}

if (asJson) {
  console.log(JSON.stringify(ready, null, 2));
  process.exit(0);
}

if (!ready.length) {
  console.log('서명 대기(source PNG 있음): 0건');
  console.log('다음: npm run rework:next · PNG → source/ 후 rework:ready 재확인');
  process.exit(0);
}

console.log(`서명 대기(source PNG 있음): ${ready.length}건\n`);
for (const r of ready) {
  console.log(`── ${r.id} · W${r.week} Phase ${r.phase} · ${r.title}`);
  console.log(`   ${r.source}`);
  console.log(`   ${r.done}`);
  console.log('');
}
