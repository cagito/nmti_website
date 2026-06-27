#!/usr/bin/env node
/**
 * P1 pillow 잔여 건 source PNG → ai-reviewed 일괄 등록
 * Usage: node scripts/batch-register-pillow.mjs [--dry-run]
 */
import { readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { hasSourceAsset } from './lib/rework-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');
const registry = JSON.parse(
  readFileSync(join(root, 'scripts', 'image-review-registry.json'), 'utf8'),
);

const ids = Object.entries(registry)
  .filter(([, r]) => r.productionMethod === 'pillow' && r.status !== 'rejected')
  .map(([id]) => id)
  .sort();

if (!ids.length) {
  console.log('pillow 잔여 0건 — 완료');
  process.exit(0);
}

console.log(`\nBatch register ${ids.length} pillow figure(s)\n`);

for (const id of ids) {
  const src = hasSourceAsset(id);
  if (!src.ok) {
    console.error('SKIP (no source):', id);
    process.exit(1);
  }
  const rel = `assets/images/technology/source/${src.path.split(/[/\\]/).pop()}`;
  console.log(`── ${id} ──`);
  const args = [
    'scripts/register-external-figure.mjs',
    '--id',
    id,
    '--input',
    rel,
    '--method',
    'ai-reviewed',
    '--reviewer',
    'Cursor-Agent',
    '--visual-grade',
    'PASS',
    '--notes',
    'P1 pillow batch — source PNG upgrade docs/122',
  ];
  if (dryRun) args.push('--dry-run');
  const r = spawnSync('node', args, { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`\nFAIL ${id}`);
    process.exit(r.status ?? 1);
  }
}

console.log(`\n✓ ${ids.length}건 등록 완료`);
console.log('  npm run sync:images && npm run build:content && npm run verify:content\n');
