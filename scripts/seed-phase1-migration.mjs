/**
 * Mark Phase 1 P1 heroes as pending-external migration (doc 31 Phase 1).
 * Preserves migrationStatus=completed after register-external-figure.
 *
 * Usage: node scripts/seed-phase1-migration.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8, readJsonSafe } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const phase1Path = join(ROOT, 'scripts', 'phase1-p1-heroes.json');
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');

const phase1 = JSON.parse(readFileSync(phase1Path, 'utf8'));
const registry = readJsonSafe(registryPath, {});

let marked = 0;
let skipped = 0;

for (const hero of phase1.heroes) {
  const id = hero.id;
  const reg = registry[id];
  if (!reg) {
    console.warn(`skip ${id}: not in registry`);
    continue;
  }
  if (reg.migrationStatus === 'completed') {
    skipped++;
    continue;
  }
  if (reg.productionMethod === 'ai-reviewed' || reg.productionMethod === 'cad') {
    reg.migrationStatus = 'completed';
    skipped++;
    continue;
  }
  reg.migrationStatus = 'pending-external';
  reg.migrationPhase = reg.migrationPhase ?? 'P1';
  marked++;
}

atomicWriteUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`seed-phase1-migration: ${marked} pending-external, ${skipped} skipped (completed/already external)`);
