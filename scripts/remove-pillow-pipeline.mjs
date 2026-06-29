#!/usr/bin/env node
/**
 * One-shot: strip Pillow from registry + figure-production-policy.
 * Pillow render pipeline removed 2026-06-29 — ai-reviewed / cad only.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runLocked } from './lib/run-locked.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_PATH = join(ROOT, 'scripts', 'image-review-registry.json');
const POLICY_PATH = join(ROOT, 'scripts', 'figure-production-policy.json');
const NOTE = 'Pillow pipeline removed 2026-06-29 — use ai-reviewed or cad only.';

function stripPillow(obj, stats) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item) => stripPillow(item, stats));
    return;
  }
  for (const [key, val] of Object.entries(obj)) {
    if (key === 'renderScript' && typeof val === 'string' && val.startsWith('render-')) {
      delete obj[key];
      stats.renderScripts++;
      continue;
    }
    if (
      (key === 'productionMethod' || key === 'productionMethodTarget' || key === 'currentMethod' || key === 'targetMethod') &&
      val === 'pillow'
    ) {
      obj[key] = 'ai-reviewed';
      stats.methodFields++;
      if (key === 'productionMethod' || key === 'currentMethod') {
        const n = obj.notes;
        obj.notes = n ? `${n} | ${NOTE}` : NOTE;
      }
      continue;
    }
    if (typeof val === 'object') stripPillow(val, stats);
  }
}

runLocked('registry', 'remove-pillow-pipeline', () => {
  const stats = { methodFields: 0, renderScripts: 0 };

  const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
  stripPillow(registry, stats);
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n', 'utf8');

  const policy = JSON.parse(readFileSync(POLICY_PATH, 'utf8'));
  if (policy.methods?.pillow) {
    delete policy.methods.pillow;
    stats.deletedMethodDef = true;
  }
  for (const tier of Object.values(policy.tiers || {})) {
    if (Array.isArray(tier.allowedMethods)) {
      tier.allowedMethods = tier.allowedMethods.filter((m) => m !== 'pillow');
    }
    if (Array.isArray(tier.forbiddenMethods) && !tier.forbiddenMethods.includes('pillow')) {
      tier.forbiddenMethods.push('pillow');
    }
  }
  stripPillow(policy.figures, stats);
  policy.description =
    (policy.description || '') + ' Pillow production removed 2026-06-29 — ai-reviewed / cad only.';
  writeFileSync(POLICY_PATH, JSON.stringify(policy, null, 2) + '\n', 'utf8');

  console.log('remove-pillow-pipeline:', stats);
});
