/**
 * 재작도 redline 서명 (phase 자동 선택)
 * Usage:
 *   npm run rework:sign -- --id IMG-002
 *   npm run rework:sign -- --phase A        # 해당 phase 일괄 (sign:phase-a 등)
 *   npm run rework:sign -- --id IMG-002 --dry-run
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { PHASES } from './lib/rework-phases.mjs';
import { hasSourceAsset, hasReworkAsset } from './lib/rework-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

const idArg = (() => {
  const i = process.argv.indexOf('--id');
  if (i >= 0) return process.argv[i + 1]?.toUpperCase();
  return process.argv.find((a) => /^IMG-\d{3}$/i.test(a))?.toUpperCase() || null;
})();
const phaseArg = (() => {
  const i = process.argv.indexOf('--phase');
  if (i >= 0) return process.argv[i + 1]?.toUpperCase();
  const bare = process.argv.slice(2).find((a) => !a.startsWith('-'));
  const codes = new Set(PHASES.map((p) => p.phase));
  if (bare && codes.has(bare.toUpperCase())) return bare.toUpperCase();
  return null;
})();
const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

function assertSignable(ids) {
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  const blocked = [];

  for (const id of ids) {
    const reg = registry[id];
    if (!reg) {
      blocked.push({ id, reason: 'registry 없음' });
      continue;
    }
    if (
      !force &&
      reg.requiresReaudit === false &&
      reg.reviewGrade === 'PASS' &&
      reg.status === 'reviewed'
    ) {
      blocked.push({ id, reason: '이미 서명됨 (requiresReaudit false)' });
      continue;
    }
    if (reg.requiresReaudit === true) {
      const { ok, path } = hasSourceAsset(id);
      if (!ok) {
        blocked.push({
          id,
          reason: `재검수 대기 — source/ WebP·PNG·register 선행 (${path || 'canonical 미정'})`,
        });
      }
      continue;
    }
    const { ok, path } = hasReworkAsset(id);
    if (!ok) {
      blocked.push({ id, reason: `자산 없음 (${path || 'canonical 미정'})` });
    }
  }

  if (blocked.length && !force) {
    console.error('서명 거부:');
    for (const b of blocked) console.error(`  ${b.id}: ${b.reason}`);
    console.error('\n강제: --force · 등록: npm run rework:register -- --id IMG-###');
    process.exit(1);
  }
  if (blocked.length && force) {
    console.warn('WARN --force: 검증 우회 후 서명');
  }
}

function runNpm(script, extraArgs = []) {
  const args = ['run', script, '--', ...extraArgs];
  const r = spawnSync('npm', args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (idArg) {
  const phase = PHASES.find((p) => p.ids.includes(idArg));
  if (!phase) {
    console.error(`${idArg} not in rework W1~W11`);
    process.exit(1);
  }
  console.log(`rework:sign ${idArg} → ${phase.sign}`);
  assertSignable([idArg]);
  if (dryRun) {
    console.log(`[dry-run] npm run ${phase.sign} -- --id ${idArg}`);
    process.exit(0);
  }
  runNpm(phase.sign, ['--id', idArg]);
  console.log(`\n다음: npm run verify:content`);
  process.exit(0);
}

if (phaseArg) {
  const phase = PHASES.find((p) => p.phase === phaseArg);
  if (!phase) {
    console.error(`Unknown phase: ${phaseArg}`);
    process.exit(1);
  }
  console.log(`rework:sign Phase ${phase.phase} (${phase.ids.length}건) → ${phase.sign}`);
  assertSignable(phase.ids);
  if (dryRun) {
    console.log(`[dry-run] npm run ${phase.sign}`);
    process.exit(0);
  }
  runNpm(phase.sign);
  console.log(`\n다음: npm run verify:content`);
  process.exit(0);
}

console.error('Usage: rework:sign -- --id IMG-### | --phase A|AA|...');
process.exit(1);
