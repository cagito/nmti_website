/**
 * Phase 7.3 manifest·파일 존재 검증.
 * Usage: npm run verify:hero-screenshots
 */
import { readFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs', 'qa-screenshots');
const MANIFEST = join(OUT_DIR, 'manifest.json');
const EXPECTED = 12; // bridge 9 + retaining 3

let failed = 0;

function fail(msg) {
  console.log('FAIL', msg);
  failed++;
}

if (!existsSync(MANIFEST)) {
  fail('manifest.json missing — run: npm run capture:hero-screenshots');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const entries = manifest.entries || [];

if (entries.length !== EXPECTED) {
  fail(`expected ${EXPECTED} entries, got ${entries.length}`);
}

for (const e of entries) {
  const rel = e.file;
  if (!rel) {
    fail(`${e.nodeId}: no file in manifest`);
    continue;
  }
  const path = join(OUT_DIR, rel);
  if (!existsSync(path)) {
    fail(`${e.nodeId}: missing ${rel}`);
    continue;
  }
  if (statSync(path).size < 100) {
    fail(`${e.nodeId}: file too small ${rel}`);
    continue;
  }
  if (e.screenshot && !rel.endsWith('.png')) {
    fail(`${e.nodeId}: screenshot flag but not png`);
  }
  if (!e.imageId) {
    fail(`${e.nodeId}: imageId missing`);
  }
  console.log('OK  ', e.nodeId, e.imageId, e.method);
}

const ageDays = (Date.now() - Date.parse(manifest.generated)) / 86400000;
if (ageDays > 90) {
  fail(`manifest older than 90 days (${manifest.generated})`);
}

console.log('---');
console.log(
  `verify-hero-screenshots: ${entries.length} entries, screenshots ${manifest.screenshots || 0}`
);

process.exit(failed ? 1 : 0);
