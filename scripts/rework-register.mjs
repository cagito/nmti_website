/**
 * 재작도 PNG/WebP 등록 (preflight → register:figure → sync:images)
 * Usage:
 *   npm run rework:register -- --id IMG-002 --input path/to.png --reviewer "이름"
 *   npm run rework:register -- --id IMG-002 --input path/to.webp --reviewer "이름" --dry-run
 */
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { PHASES } from './lib/rework-phases.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const out = { dryRun: false, visualGrade: 'PASS', method: 'ai-reviewed' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
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

function run(cmd, args) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const args = parseArgs(process.argv);
if (!args.id || !args.input || !args.reviewer) {
  console.error(
    'Usage: rework:register -- --id IMG-### --input <png|webp> --reviewer "이름" [--visual-grade PASS] [--notes "..."] [--dry-run]',
  );
  process.exit(1);
}

if (!existsSync(args.input)) {
  console.error('Input file not found:', args.input);
  process.exit(1);
}

const phase = PHASES.find((p) => p.ids.includes(args.id));
if (!phase) {
  console.warn(`WARN: ${args.id} is outside rework W1~W11 list`);
}

console.log(`\n── rework:register ${args.id} ──\n`);

run('node', ['scripts/rework-preflight.mjs', '--id', args.id, '--input', args.input]);

const regArgs = [
  'scripts/register-external-figure.mjs',
  '--id',
  args.id,
  '--input',
  args.input,
  '--method',
  args.method,
  '--reviewer',
  args.reviewer,
  '--visual-grade',
  args.visualGrade,
];
if (args.notes) regArgs.push('--notes', args.notes);
if (args.dryRun) regArgs.push('--dry-run');

run('node', regArgs);

if (args.dryRun) {
  console.log('[dry-run] skip sync:images');
  process.exit(0);
}

run('npm', ['run', 'sync:images']);
run('npm', ['run', 'build:content']);

console.log(`\n✓ ${args.id} registered — redline 육안 PASS 후 서명:\n`);
if (phase) {
  console.log(`  npm run ${phase.sign} -- --id ${args.id}`);
} else {
  console.log('  (해당 phase sign:phase-* 확인)');
}
console.log('  npm run verify:content\n');
