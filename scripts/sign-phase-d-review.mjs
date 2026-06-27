/**
 * Phase D — clear requiresReaudit after PNG + redline v2 PASS (W10 · 14종).
 * Usage: node scripts/sign-phase-d-review.mjs [--dry-run] [--id IMG-064]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { clearWireframeReplace } from './lib/wireframe-gate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const ALL_IDS = [
  'IMG-011',
  'IMG-064',
  'IMG-084',
  'IMG-097',
  'IMG-034',
  'IMG-041',
  'IMG-043',
  'IMG-070',
  'IMG-071',
  'IMG-075',
  'IMG-076',
  'IMG-077',
  'IMG-092',
  'IMG-093',
];

const FT_A = new Set([
  'IMG-011',
  'IMG-064',
  'IMG-084',
  'IMG-097',
  'IMG-034',
  'IMG-041',
  'IMG-043',
  'IMG-092',
  'IMG-093',
]);

const dryRun = process.argv.includes('--dry-run');
const idArg = (() => {
  const i = process.argv.indexOf('--id');
  if (i >= 0) return process.argv[i + 1]?.toUpperCase();
  return process.argv.find((a) => /^IMG-\d{3}$/i.test(a))?.toUpperCase() || null;
})();
const ids = idArg ? [idArg] : ALL_IDS;
const today = new Date().toISOString().slice(0, 10);
const reviewer = 'Human-Reviewer';
const noteSuffix = 'Phase D W10 — redline v2 PASS · docs/113';

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
  if (FT_A.has(id)) {
    reg.productionMethod = 'ai-reviewed';
    reg.productionMethodTarget = 'ai-reviewed';
  }
  const base = (reg.notes || '').replace(/redline v2 미검수\.?\s*/g, '').trim();
  reg.notes = base ? `${base} · ${noteSuffix}` : noteSuffix;
  reg.visualReview = {
    grade: 'PASS',
    reviewer,
    date: today,
    notes: 'Phase D FT-A/B ai-reviewed redline v2',
  };
  clearWireframeReplace(reg);
  signed++;
  console.log(`signed ${id}`);
}

if (dryRun) {
  console.log(`dry-run: would sign ${ids.length} figure(s)`);
  process.exit(0);
}

atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Signed PASS for ${signed} Phase D figure(s)`);
