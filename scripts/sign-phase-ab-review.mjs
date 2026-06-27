/**
 * Phase AB — clear requiresReaudit after PNG + redline v2 PASS.
 * Usage: node scripts/sign-phase-ab-review.mjs [--dry-run] [--id IMG-028]
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
  'IMG-026',
  'IMG-028',
  'IMG-029',
  'IMG-030',
  'IMG-035',
  'IMG-040',
  'IMG-042',
  'IMG-044',
  'IMG-045',
  'IMG-046',
];

const dryRun = process.argv.includes('--dry-run');
const idArg = process.argv.find((a, i) => process.argv[i - 1] === '--id');
const ids = idArg ? [idArg] : ALL_IDS;
const today = new Date().toISOString().slice(0, 10);
const reviewer = 'Human-Reviewer';
const noteSuffix = 'Phase AB redline v2 PASS — docs/90';

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
  reg.prohibitedVerifiedNote = 'Phase AB ZIP-AUD-21~30 — redline v2';
  reg.reviewDate = today;
  reg.reviewer = reviewer;
  if (id === 'IMG-045' || id === 'IMG-046') {
    reg.productionMethod = id === 'IMG-045' ? 'ai-reviewed' : reg.productionMethod ?? 'pillow';
    reg.productionMethodTarget = reg.productionMethod;
  } else {
    reg.productionMethod = 'ai-reviewed';
    reg.productionMethodTarget = 'ai-reviewed';
  }
  const base = (reg.notes || '').replace(/redline v2 미검수\.?\s*/g, '').trim();
  reg.notes = base ? `${base} · ${noteSuffix}` : noteSuffix;
  reg.visualReview = {
    grade: 'PASS',
    reviewer,
    date: today,
    notes: 'Phase AB AXIS/IPI/WELL/LOGGER/GW redline v2',
  };
  signed++;
  console.log(`signed ${id}`);
}

if (dryRun) {
  console.log(`dry-run: would sign ${ids.length} figure(s)`);
  process.exit(0);
}

atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Signed PASS for ${signed} Phase AB figure(s)`);
