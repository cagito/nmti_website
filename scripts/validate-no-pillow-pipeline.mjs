#!/usr/bin/env node
/**
 * CI gate: Pillow figure pipeline must not exist in repo.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function fail(msg) {
  errors.push(msg);
}

const scriptsDir = join(ROOT, 'scripts');
const libDir = join(scriptsDir, 'lib');

for (const name of readdirSync(scriptsDir)) {
  if (/^render-.+\.py$/i.test(name)) fail(`scripts/${name} exists — delete Pillow render script`);
}

if (existsSync(libDir)) {
  for (const name of readdirSync(libDir)) {
    if (/_draw\.py$/i.test(name)) fail(`scripts/lib/${name} exists — delete Pillow draw module`);
    if (name === 'render_guard.py') fail('scripts/lib/render_guard.py exists — removed with Pillow');
  }
}

for (const rel of [
  'scripts/rework-pillow.mjs',
  'scripts/rework-pillow-hero-pack.mjs',
  'scripts/patch-registry-pillow-wireframe.mjs',
  'scripts/list-pillow-heroes.mjs',
  'scripts/batch-register-pillow.mjs',
  'scripts/patch-registry-interim-expose.mjs'
]) {
  if (existsSync(join(ROOT, rel))) fail(`${rel} exists`);
}

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
for (const [key, val] of Object.entries(pkg.scripts || {})) {
  if (typeof val !== 'string') continue;
  if (/render-.+\.py/.test(val) || /--force-legacy-pillow/.test(val)) {
    fail(`package.json script "${key}" references Pillow render: ${val}`);
  }
  if (/rework-pillow|list-pillow|pillow-wireframe|interim-pillow/.test(key)) {
    fail(`package.json script "${key}" is a removed Pillow script`);
  }
}

const registry = JSON.parse(readFileSync(join(ROOT, 'scripts', 'image-review-registry.json'), 'utf8'));
for (const [id, reg] of Object.entries(registry)) {
  if (reg.productionMethod === 'pillow' || reg.productionMethodTarget === 'pillow') {
    fail(`${id}: registry still has productionMethod pillow`);
  }
  if (reg.renderScript) fail(`${id}: registry renderScript ${reg.renderScript}`);
}

const policy = JSON.parse(readFileSync(join(ROOT, 'scripts', 'figure-production-policy.json'), 'utf8'));
if (policy.methods?.pillow) fail('figure-production-policy.methods.pillow still defined');
for (const [id, fig] of Object.entries(policy.figures || {})) {
  if (fig.currentMethod === 'pillow' || fig.targetMethod === 'pillow') {
    fail(`${id}: policy still has pillow method`);
  }
  if (fig.renderScript) fail(`${id}: policy renderScript ${fig.renderScript}`);
}

if (errors.length) {
  console.error('validate-no-pillow-pipeline FAIL');
  errors.forEach((e) => console.error(' -', e));
  process.exit(1);
}

console.log('OK   validate-no-pillow-pipeline');
