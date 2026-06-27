/**
 * Mark Phase 4 FT-C figures as pending-visual (doc 31 Phase 4).
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8, readJsonSafe } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const phase4Path = join(ROOT, 'scripts', 'phase4-p4-figures.json');
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');

const phase4 = JSON.parse(readFileSync(phase4Path, 'utf8'));
const registry = readJsonSafe(registryPath, {});

const ids = new Set();
for (const g of Object.values(phase4.groups)) {
  for (const id of g.ids) ids.add(id);
}

let marked = 0;
let skipped = 0;

for (const id of ids) {
  const reg = registry[id];
  if (!reg) {
    console.warn(`skip ${id}: not in registry`);
    continue;
  }
  if (reg.visualReview?.grade === 'PASS' && reg.migrationPhase === 'P4') {
    skipped++;
    continue;
  }
  if (reg.visualReview?.grade === 'PASS' && reg.reviewer !== '일괄 마이그레이션') {
    reg.migrationPhase = 'P4';
    reg.migrationStatus = reg.migrationStatus ?? 'completed';
    skipped++;
    continue;
  }
  reg.migrationStatus = 'pending-visual';
  reg.migrationPhase = 'P4';
  marked++;
}

atomicWriteUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`seed-phase4-migration: ${marked} pending-visual, ${skipped} skipped`);
