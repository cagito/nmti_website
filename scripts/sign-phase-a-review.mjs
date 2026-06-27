/**
 * Phase A — mark PNG+redline PASS for 002·096·004 (no requiresReaudit).
 * Usage: node scripts/sign-phase-a-review.mjs [--dry-run] [--id IMG-002]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { clearWireframeReplace } from './lib/wireframe-gate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const ALL_IDS = ['IMG-002', 'IMG-096', 'IMG-004'];
const VERSION = { 'IMG-002': 'v5', 'IMG-096': 'v4', 'IMG-004': 'v2' };

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
  reg.prohibitedVerifiedNote = `Phase A ${ver} ai-reviewed — redline 서명`;
  reg.reviewDate = today;
  reg.reviewer = reviewer;
  reg.productionMethod = 'ai-reviewed';
  reg.productionMethodTarget = 'ai-reviewed';
  reg.notes = `${ver} ai-reviewed PASS — redline ${ver} 서명 ${today} · docs/92`;
  reg.visualReview = {
    grade: 'PASS',
    reviewer,
    date: today,
    notes: `Phase A ${ver} redline 서명`,
  };
  signed++;
  console.log(`signed ${id}`);
}

if (dryRun) {
  console.log(`dry-run: would sign ${ids.length} figure(s)`);
  process.exit(0);
}

atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Signed PASS for ${signed} Phase A figure(s)`);
