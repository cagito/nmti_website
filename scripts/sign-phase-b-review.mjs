/**
 * Phase B — mark PNG+redline PASS for 024·089·090·091.
 * Usage: node scripts/sign-phase-b-review.mjs [--dry-run] [--id IMG-024]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { clearWireframeReplace } from './lib/wireframe-gate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const ALL_IDS = ['IMG-024', 'IMG-089', 'IMG-090', 'IMG-091'];
const VERSION = { 'IMG-024': 'v3', 'IMG-089': 'v3', 'IMG-090': 'v3', 'IMG-091': 'v3' };

const dryRun = process.argv.includes('--dry-run');
const idArg = process.argv.find((a, i) => process.argv[i - 1] === '--id');
const ids = idArg ? [idArg] : ALL_IDS;
const today = new Date().toISOString().slice(0, 10);
const reviewer = 'Human-Reviewer';

let signed = 0;
for (const id of ids) {
  const reg = registry[id];
  if (!reg) {
    console.error('Missing', id);
    process.exit(1);
  }
  if (dryRun) {
    console.log(`[dry-run] ${id} → ai-reviewed PASS · notes 갱신`);
    continue;
  }
  const ver = VERSION[id];
  reg.reviewGrade = 'PASS';
  reg.status = 'reviewed';
  reg.requiresReaudit = false;
  clearWireframeReplace(reg);
  reg.prohibitedVerified = true;
  reg.prohibitedVerifiedDate = today;
  reg.prohibitedVerifiedNote = `Phase B ${ver} ai-reviewed — redline 서명`;
  reg.reviewDate = today;
  reg.reviewer = reviewer;
  reg.productionMethod = 'ai-reviewed';
  reg.productionMethodTarget = 'ai-reviewed';
  reg.notes = `${ver} ai-reviewed PASS — redline v2 서명 ${today} · docs/88`;
  reg.visualReview = {
    grade: 'PASS',
    reviewer,
    date: today,
    notes: `Phase B ${ver} redline 서명`,
  };
  signed++;
  console.log(`signed ${id}`);
}

if (dryRun) {
  console.log(`dry-run: would sign ${ids.length} figure(s)`);
  process.exit(0);
}

atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Signed PASS for ${signed} Phase B figure(s)`);
