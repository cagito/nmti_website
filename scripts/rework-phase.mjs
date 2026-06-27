/**
 * Phase 단위 재작도 작업 목록
 * Usage: node scripts/rework-phase.mjs --phase A
 *        node scripts/rework-phase.mjs --week W1
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT, REDLINE_CANONICAL, PHASES } from './lib/rework-phases.mjs';
import { getQuickstart } from './lib/rework-quickstarts.mjs';
import { hasSourcePng } from './lib/rework-source.mjs';

const registry = JSON.parse(
  readFileSync(join(REWORK_ROOT, 'scripts', 'image-review-registry.json'), 'utf8'),
);
const canonical = JSON.parse(
  readFileSync(join(REWORK_ROOT, 'scripts', 'canonical-image-png.json'), 'utf8'),
);

const phaseArg = (() => {
  const i = process.argv.indexOf('--phase');
  if (i >= 0) return process.argv[i + 1]?.toUpperCase();
  const bare = process.argv.slice(2).find((a) => !a.startsWith('-'));
  const codes = new Set(PHASES.map((p) => p.phase));
  if (bare && codes.has(bare.toUpperCase())) return bare.toUpperCase();
  return null;
})();
const weekArg = (() => {
  const i = process.argv.indexOf('--week');
  if (i >= 0) return process.argv[i + 1]?.toUpperCase();
  const bare = process.argv.slice(2).find((a) => !a.startsWith('-'));
  if (bare && /^W\d/.test(bare.toUpperCase())) return bare.toUpperCase();
  return null;
})();

let phases = PHASES;
if (phaseArg) {
  phases = PHASES.filter((p) => p.phase === phaseArg);
  if (!phases.length) {
    console.error(`Unknown phase: ${phaseArg}`);
    process.exit(1);
  }
} else if (weekArg) {
  phases = PHASES.filter((p) => p.week.toUpperCase() === weekArg);
  if (!phases.length) {
    console.error(`Unknown week: ${weekArg}`);
    process.exit(1);
  }
} else {
  console.error('Usage: rework:phase -- --phase A|AA|B|C|AB|AC|AD|D|E');
  console.error('       rework:phase -- --week W1|W2|...');
  process.exit(1);
}

for (const p of phases) {
  console.log(`\n══ ${p.week} Phase ${p.phase} (${p.ids.length}건) ══`);
  if (p.patch) console.log(`사전: npm run ${p.patch}`);
  console.log(`일괄 서명: npm run ${p.sign}\n`);

  for (const id of p.ids) {
    const reg = registry[id];
    const png = canonical[id] || `${id}_*.png`;
    const reaudit = reg?.requiresReaudit === true;
    const signed = !reaudit && reg?.visualReview?.grade === 'PASS' && reg?.prohibitedVerified;
    const src = hasSourcePng(id).ok;
    const state = signed ? 'signed' : src ? 'ready' : reaudit ? 'reaudit' : 'pending';
    const rl = REDLINE_CANONICAL[id];

    console.log(`── ${id} [${state}] · ${reg?.title || ''}`);
    console.log(`   퀵스타트: ${getQuickstart(id)}`);
    if (rl) console.log(`   redline:  ImageWorks/.../redlines/${rl}`);
    console.log(`   prompt:   npm run rework:prompt -- --id ${id}`);
    const regPath = `assets/images/technology/source/${png}`;
    console.log(
      `   done:     npm run rework:done -- --id ${id} --input ${regPath} --reviewer "검수자"`,
    );
    if (!signed) console.log(`   sign:     npm run ${p.sign} -- --id ${id}`);
  }
}

console.log('\n현황: npm run rework:status -- --phase', phases[0].phase);
