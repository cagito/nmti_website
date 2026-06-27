/**
 * Mark Phase 3 FT-A/B figures as pending-external migration (doc 31 Phase 3).
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8, readJsonSafe } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const phase3Path = join(ROOT, 'scripts', 'phase3-p3-figures.json');
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');

const phase3 = JSON.parse(readFileSync(phase3Path, 'utf8'));
const registry = readJsonSafe(registryPath, {});

let marked = 0;
let skipped = 0;

for (const fig of phase3.figures) {
  const id = fig.id;
  const reg = registry[id];
  if (!reg) {
    console.warn(`skip ${id}: not in registry`);
    continue;
  }
  if (reg.migrationStatus === 'completed' && (reg.productionMethod === 'ai-reviewed' || reg.productionMethod === 'cad')) {
    skipped++;
    continue;
  }
  if (reg.productionMethod === 'ai-reviewed' || reg.productionMethod === 'cad') {
    reg.migrationStatus = 'completed';
    reg.migrationPhase = 'P3';
    skipped++;
    continue;
  }
  reg.migrationStatus = 'pending-external';
  reg.migrationPhase = 'P3';
  marked++;
}

atomicWriteUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`seed-phase3-migration: ${marked} pending-external, ${skipped} skipped`);
