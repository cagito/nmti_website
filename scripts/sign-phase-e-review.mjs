/**
 * Phase E — 출판 검수 PASS (094·095·102). ai-reviewed PNG + redline v2 필수.
 * Usage: node scripts/sign-phase-e-review.mjs [--dry-run] [--id IMG-094] [--ai-reviewed]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { clearWireframeReplace } from './lib/wireframe-gate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const ALL_IDS = ['IMG-094', 'IMG-095', 'IMG-102'];

const dryRun = process.argv.includes('--dry-run');
const aiReviewed = process.argv.includes('--ai-reviewed');
const idArg = process.argv.find((a, i) => process.argv[i - 1] === '--id');
const ids = idArg ? [idArg] : ALL_IDS;
const today = new Date().toISOString().slice(0, 10);
const reviewer = 'Human-Reviewer';
const noteSuffix = aiReviewed
  ? 'Phase E W11 — ai-reviewed redline v2 PASS · docs/116'
  : 'Phase E W11 — Pillow 출판 검수 PASS · docs/116';

let signed = 0;
for (const id of ids) {
  const reg = registry[id];
  if (!reg) {
    console.error('Missing', id);
    process.exit(1);
  }
  if (dryRun) {
    console.log(`[dry-run] ${id} → requiresReaudit false · visualReview PASS`);
    continue;
  }
  reg.reviewGrade = 'PASS';
  reg.status = 'reviewed';
  reg.requiresReaudit = false;
  clearWireframeReplace(reg);
  reg.prohibitedVerified = true;
  reg.prohibitedVerifiedDate = today;
  reg.prohibitedVerifiedNote = noteSuffix;
  reg.reviewDate = today;
  reg.reviewer = reviewer;
  if (aiReviewed) {
    reg.productionMethod = 'ai-reviewed';
    reg.productionMethodTarget = 'ai-reviewed';
  }
  const base = (reg.notes || '').replace(/redline v2 미검수\.?\s*/g, '').trim();
  reg.notes = base ? `${base} · ${noteSuffix}` : noteSuffix;
  reg.visualReview = {
    grade: 'PASS',
    reviewer,
    date: today,
    notes: aiReviewed ? 'Phase E ai-reviewed publication gate' : 'Phase E publication gate (legacy)',
  };
  signed++;
  console.log(`signed ${id}`);
}

if (dryRun) {
  console.log(`dry-run: would sign ${ids.length} figure(s)`);
  process.exit(0);
}

atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Signed PASS for ${signed} Phase E figure(s)`);
