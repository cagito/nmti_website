/**
 * Merge figure-production-policy.json → image-review-registry.json
 * Usage: node scripts/seed-figure-production-registry.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8, readJsonSafe } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const policyPath = join(ROOT, 'scripts', 'figure-production-policy.json');
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');

const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
const registry = readJsonSafe(registryPath, {});

let updated = 0;

for (const [id, fig] of Object.entries(policy.figures)) {
  if (!registry[id]) {
    console.warn(`skip ${id}: not in registry`);
    continue;
  }

  const reg = registry[id];

  reg.figureTier = fig.tier;
  if (reg.migrationStatus !== 'completed') {
    reg.productionMethod = fig.currentMethod;
  }
  reg.productionMethodTarget = fig.targetMethod;
  reg.migrationPhase = fig.migrationPhase;
  if (fig.hero != null) reg.hero = fig.hero;
  if (fig.renderScript) reg.renderScript = fig.renderScript;
  // migrationStatus·migrationCompletedDate — register-external-figure / seed-phase1-migration 유지

  updated++;
}

atomicWriteUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`seed-figure-production-registry: ${updated} entries updated → ${registryPath}`);
