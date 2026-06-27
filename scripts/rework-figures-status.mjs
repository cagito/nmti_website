/**
 * PNG 재작도 프로그램 진행 현황 (W1~W11).
 * Usage: node scripts/rework-figures-status.mjs [--phase A|AA|...] [--pending] [--json]
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  REWORK_ROOT,
  REDLINE_CANONICAL,
  PHASES,
} from './lib/rework-phases.mjs';
import { hasSourcePng as checkSourcePng } from './lib/rework-source.mjs';

const registryPath = join(REWORK_ROOT, 'scripts', 'image-review-registry.json');

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const phaseFilter = (() => {
  const i = process.argv.indexOf('--phase');
  return i >= 0 ? process.argv[i + 1]?.toUpperCase() : null;
})();
const pendingOnly = process.argv.includes('--pending');
const asJson = process.argv.includes('--json');

function hasSourcePng(id) {
  return checkSourcePng(id).ok;
}

function rowStatus(reg, id) {
  const reaudit = reg?.requiresReaudit === true;
  const vr = reg?.visualReview?.grade;
  const signed = !reaudit && vr === 'PASS' && reg?.prohibitedVerified === true;
  const src = hasSourcePng(id);
  let state = 'pending';
  if (signed) state = 'signed';
  else if (src) state = 'source';
  else if (reaudit) state = 'reaudit';
  return { reaudit, vr, signed, src, state, method: reg?.productionMethod ?? '—' };
}

const rows = [];
for (const p of PHASES) {
  if (phaseFilter && p.phase !== phaseFilter) continue;
  for (const id of p.ids) {
    const reg = registry[id];
    const st = rowStatus(reg, id);
    if (pendingOnly && st.signed) continue;
    const rl = REDLINE_CANONICAL[id]?.replace(/_redline.*/, '').replace('IMG-', 'v') ?? '—';
    rows.push({
      week: p.week,
      phase: p.phase,
      id,
      redline: REDLINE_CANONICAL[id]?.match(/redline_(v\d+)/)?.[1] ?? '—',
      state: st.state,
      requiresReaudit: st.reaudit,
      productionMethod: st.method,
      sourcePng: st.src,
      visualReview: st.vr ?? '—',
      patch: p.patch,
      sign: `npm run ${p.sign}`,
    });
  }
}

if (asJson) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const counts = { signed: 0, source: 0, reaudit: 0, pending: 0 };
for (const r of rows) counts[r.state] = (counts[r.state] || 0) + 1;

console.log('PNG 재작도 현황 (W1~W11)\n');
console.log('week  phase  id        rl   state    reaudit  method       source  visual');
console.log('─'.repeat(76));
for (const r of rows) {
  console.log(
    [
      r.week.padEnd(5),
      r.phase.padEnd(5),
      r.id.padEnd(9),
      r.redline.padEnd(4),
      r.state.padEnd(8),
      String(r.requiresReaudit).padEnd(8),
      String(r.productionMethod).slice(0, 12).padEnd(12),
      String(r.sourcePng).padEnd(7),
      r.visualReview,
    ].join('  '),
  );
}
console.log('─'.repeat(76));
console.log(
  `total ${rows.length} · signed ${counts.signed || 0} · source ${counts.source || 0} · reaudit ${counts.reaudit || 0} · pending ${counts.pending || 0}`,
);
console.log(
  '\n명령: rework:handoff · rework:next · rework:prompt · rework:phase · docs/119',
);
