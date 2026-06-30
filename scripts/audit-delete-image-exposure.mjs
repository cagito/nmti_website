#!/usr/bin/env node
/**
 * Fail when a registry image with reviewGrade DELETE is exposed through runtime files.
 * Scope intentionally excludes docs/ImageWorks so legacy prompts and audit records can remain archived.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const deleteIds = Object.values(registry)
  .filter((entry) => entry.reviewGrade === 'DELETE' || entry.status === 'rejected')
  .map((entry) => entry.id)
  .sort();

const SCAN_DIRS = ['js', 'technology', 'sensors'];
const EXTENSIONS = new Set(['.js', '.mjs', '.html', '.json']);
const ALLOWED_FILES = new Set([
  'scripts/image-review-registry.json',
  'scripts/audit-delete-image-exposure.mjs'
]);

function extname(name) {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot) : '';
}

function walk(absDir, relDir, files) {
  if (!existsSync(absDir)) return;
  for (const name of readdirSync(absDir)) {
    const abs = join(absDir, name);
    const rel = relDir ? relDir + '/' + name : name;
    const st = statSync(abs);
    if (st.isDirectory()) {
      walk(abs, rel, files);
    } else if (EXTENSIONS.has(extname(name)) && !ALLOWED_FILES.has(rel)) {
      files.push({ abs, rel });
    }
  }
}

const files = [];
for (const dir of SCAN_DIRS) walk(join(ROOT, dir), dir, files);

const failures = [];
for (const { abs, rel } of files) {
  const text = readFileSync(abs, 'utf8');
  for (const id of deleteIds) {
    if (text.includes(id)) failures.push({ rel, id });
  }
}

if (failures.length) {
  console.error('DELETE/rejected image IDs are exposed in runtime files:');
  for (const f of failures) console.error(`- ${f.id}: ${f.rel}`);
  process.exit(1);
}

console.log(`OK delete-image exposure audit: ${deleteIds.length} deleted/rejected IDs checked`);
