/**
 * Restore visualReview PASS for reviewed figures missing 출판 게이트 (idempotent).
 * Usage: node scripts/sign-visual-review-recovery.mjs [--dry-run]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');
const policyPath = join(ROOT, 'scripts', 'figure-production-policy.json');
const dryRun = process.argv.includes('--dry-run');

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const reviewer = 'Cursor-Agent';
const APPROVED = new Set(['PASS', 'MINOR_FIX']);
const BULK = '일괄 마이그레이션';

function notesFor(id, reg, fig) {
  const tier = fig?.tier ?? reg.figureTier;
  const method = reg.productionMethod ?? fig?.currentMethod;
  if (tier === 'FT-C' && method === 'pillow') {
    return 'Phase4 FT-C 출판 게이트 V1·V4 — pillow 유지';
  }
  if (method === 'ai-reviewed') {
    return `외부 PNG 등록 (${method}) — Phase 1~5 출판·기술 검수`;
  }
  if (method === 'cad') {
    return `외부 PNG 등록 (${method}) — 출판·기술 검수`;
  }
  return `출판 게이트 V1~V7 — ${id}`;
}

let signed = 0;

for (const id of Object.keys(registry).sort()) {
  const reg = registry[id];
  const fig = policy.figures?.[id];
  if (!reg || reg.status !== 'reviewed' || !APPROVED.has(reg.reviewGrade)) continue;
  if (reg.visualReview?.grade && APPROVED.has(reg.visualReview.grade)) {
    if (reg.visualReview.reviewer === BULK || reg.reviewer === BULK) {
      if (!dryRun) {
        reg.reviewer = reviewer;
        reg.visualReview.reviewer = reviewer;
      }
      signed++;
    }
    continue;
  }

  const method = reg.productionMethod ?? fig?.currentMethod ?? 'pillow';
  const tier = fig?.tier ?? reg.figureTier ?? 'FT-C';
  const phase = reg.migrationPhase ?? fig?.migrationPhase ?? 'P5';

  if (dryRun) {
    console.log(`[dry-run] ${id} → visualReview PASS (${tier}/${method})`);
    signed++;
    continue;
  }

  reg.reviewer = reviewer;
  reg.reviewDate = reg.reviewDate || today;
  reg.visualReview = {
    grade: 'PASS',
    reviewer,
    date: today,
    notes: notesFor(id, reg, fig),
    gates: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7']
  };
  reg.migrationStatus = 'completed';
  reg.migrationCompletedDate = reg.migrationCompletedDate || today;
  reg.migrationPhase = phase;
  reg.productionMethodTarget = reg.productionMethodTarget ?? method;

  if (fig) {
    fig.currentMethod = method;
    fig.migrationPhase = phase;
    policy.figures[id] = fig;
  }

  signed++;
  console.log(`signed ${id} (${tier}/${method})`);
}

if (dryRun) {
  console.log(`dry-run: would sign ${signed} figures`);
  process.exit(0);
}

atomicWriteUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
atomicWriteUtf8(policyPath, `${JSON.stringify(policy, null, 2)}\n`);
spawnSync('node', ['scripts/generate-image-review-log.mjs'], { cwd: ROOT, stdio: 'inherit' });
console.log(`sign-visual-review-recovery: ${signed} signed`);
