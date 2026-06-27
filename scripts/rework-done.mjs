/**
 * 재작도 완료 — register + sign (PNG·redline 검수 후)
 * Usage:
 *   npm run rework:done -- --id IMG-002 --input path/to.png --reviewer "이름"
 *   npm run rework:done -- --id IMG-002 --input path/to.png --reviewer "이름" --dry-run
 */
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const out = { dryRun: false, visualGrade: 'PASS', method: 'ai-reviewed', skipSign: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--skip-sign') out.skipSign = true;
    else if (a === '--id') out.id = argv[++i]?.toUpperCase();
    else if (a === '--input') out.input = argv[++i];
    else if (a === '--reviewer') out.reviewer = argv[++i];
    else if (a === '--visual-grade') out.visualGrade = argv[++i];
    else if (a === '--notes') out.notes = argv[++i];
    else if (a === '--method') out.method = argv[++i];
    else if (/^IMG-\d{3}$/i.test(a)) out.id = a.toUpperCase();
  }
  return out;
}

function runNode(script, extra) {
  const r = spawnSync('node', [script, ...extra], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const args = parseArgs(process.argv);
if (!args.id || !args.input || !args.reviewer) {
  console.error(
    'Usage: rework:done -- --id IMG-### --input <png> --reviewer "이름" [--dry-run] [--skip-sign]',
  );
  process.exit(1);
}

console.log(`\n── rework:done ${args.id} ──\n`);

const regArgs = [
  '--id',
  args.id,
  '--input',
  args.input,
  '--reviewer',
  args.reviewer,
  '--visual-grade',
  args.visualGrade,
  '--method',
  args.method,
];
if (args.notes) regArgs.push('--notes', args.notes);
if (args.dryRun) regArgs.push('--dry-run');

runNode('scripts/rework-register.mjs', regArgs);

if (args.skipSign) {
  console.log('[skip-sign] register만 완료');
  process.exit(0);
}

const signArgs = ['--id', args.id];
if (args.dryRun) signArgs.push('--dry-run');

runNode('scripts/rework-sign.mjs', signArgs);

if (!args.dryRun) {
  console.log(`\n✓ ${args.id} register + sign 완료`);
  console.log('  npm run verify:content\n');
}
