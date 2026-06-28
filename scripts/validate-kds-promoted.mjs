/**
 * Validate kds-figure-rules-approved.json ↔ image-knowledge topics.
 * Usage: node scripts/validate-kds-promoted.mjs [--strict]
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { KDS_PROMOTED_START } from './lib/kds-promoted-markers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPROVED = join(ROOT, 'scripts', 'kds-figure-rules-approved.json');
const IK = join(ROOT, 'docs', 'image-knowledge');
const STRICT = process.argv.includes('--strict');

function normalize(s) {
  return s.replace(/\*\*/g, '').replace(/\s+/g, '').toLowerCase();
}

const { promotions } = JSON.parse(readFileSync(APPROVED, 'utf8'));
let errors = 0;
let ok = 0;

for (const p of promotions) {
  const path = join(IK, p.topic);
  if (!existsSync(path)) {
    console.error(`MISSING_TOPIC ${p.topic}`);
    errors += 1;
    continue;
  }
  const body = readFileSync(path, 'utf8');
  if (!body.includes(KDS_PROMOTED_START)) {
    console.error(`NO_PROMOTED_BLOCK ${p.topic} — run patch:image-knowledge-from-kds`);
    errors += 1;
    continue;
  }
  const norm = normalize(p.text);
  const bodyNorm = normalize(body);
  if (!bodyNorm.includes(norm.slice(0, Math.min(40, norm.length)))) {
    console.error(`MISSING_BULLET ${p.topic}: ${p.text.slice(0, 50)}…`);
    errors += 1;
    continue;
  }
  ok += 1;
}

if (errors) {
  console.error(`validate-kds-promoted: FAIL (${errors} issues, ${ok} ok)`);
  process.exit(STRICT ? 1 : 0);
}
console.log(`validate-kds-promoted: OK (${ok}/${promotions.length})`);
