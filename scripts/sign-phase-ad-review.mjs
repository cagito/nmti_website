/**
 * Phase AD — clear requiresReaudit after PNG + redline v2 PASS (ZIP 5차 10종).
 * Usage: node scripts/sign-phase-ad-review.mjs [--dry-run] [--id IMG-050]
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
  'IMG-047',
  'IMG-048',
  'IMG-049',
  'IMG-050',
  'IMG-051',
  'IMG-052',
  'IMG-053',
  'IMG-054',
  'IMG-055',
  'IMG-056',
];

const REGEN = new Set(['IMG-050', 'IMG-052', 'IMG-054', 'IMG-056']);

const dryRun = process.argv.includes('--dry-run');
const idArg = process.argv.find((a, i) => process.argv[i - 1] === '--id');
const ids = idArg ? [idArg] : ALL_IDS;
const today = new Date().toISOString().slice(0, 10);
const reviewer = 'Human-Reviewer';
const noteSuffix = 'Phase AD ZIP-AUD-41~50 — redline v2 PASS · docs/98';

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
  if (REGEN.has(id)) {
    reg.productionMethod = 'ai-reviewed';
    reg.productionMethodTarget = 'ai-reviewed';
  }
  const base = (reg.notes || '').replace(/redline v2 미검수\.?\s*/g, '').trim();
  reg.notes = base ? `${base} · ${noteSuffix}` : noteSuffix;
  reg.visualReview = {
    grade: 'PASS',
    reviewer,
    date: today,
    notes: 'Phase AD OPS-VERIFY-01 redline v2',
  };
  signed++;
  console.log(`signed ${id}`);
}

if (dryRun) {
  console.log(`dry-run: would sign ${ids.length} figure(s)`);
  process.exit(0);
}

atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Signed PASS for ${signed} Phase AD figure(s)`);
