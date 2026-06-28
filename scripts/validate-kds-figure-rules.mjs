/**
 * Validate KDS figure-rules extract coverage.
 * Usage: node scripts/validate-kds-figure-rules.mjs [--strict]
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXTRACT = join(ROOT, 'book', '_kds_figure_rules_extract.json');
const MAP = JSON.parse(
  readFileSync(join(ROOT, 'scripts', 'kds-section-image-knowledge-map.json'), 'utf8')
);
const IK = join(ROOT, 'docs', 'image-knowledge');
const STRICT = process.argv.includes('--strict');

if (!existsSync(EXTRACT)) {
  console.error('MISSING extract — run npm run extract:kds-figure-rules');
  process.exit(STRICT ? 1 : 0);
}

const data = JSON.parse(readFileSync(EXTRACT, 'utf8'));
let errors = 0;
let ok = 0;

const byDoc = new Map((data.sources || []).map((s) => [s.docId, s]));

for (const [docId, cfg] of Object.entries(MAP.documents)) {
  const src = byDoc.get(docId);
  if (!src) {
    console.error(`MISSING_SOURCE ${docId}`);
    errors += 1;
    continue;
  }
  for (const [sectionKey, topicFile] of Object.entries(cfg.sections)) {
    if (!existsSync(join(IK, topicFile))) {
      console.error(`MISSING_TOPIC ${topicFile} (${docId} ${sectionKey})`);
      errors += 1;
      continue;
    }
    const sec = src.sections.find((s) => s.sectionKey === sectionKey);
    if (!sec) {
      console.error(`MISSING_SECTION ${docId} ${sectionKey}`);
      errors += 1;
      continue;
    }
    if ((sec.excerptChars || 0) < 50 && !(sec.candidateBullets || []).length) {
      console.error(`SPARSE ${docId} ${sectionKey} excerpt=${sec.excerptChars || 0}`);
      errors += 1;
      continue;
    }
    ok += 1;
  }
}

if (data.warnings?.length && STRICT) {
  for (const w of data.warnings) {
    console.error(`WARN ${w}`);
    errors += 1;
  }
}

if (errors) {
  console.error(`validate-kds-figure-rules: FAIL (${errors} issues, ${ok} ok)`);
  process.exit(STRICT ? 1 : 0);
}
console.log(`validate-kds-figure-rules: OK (${ok} sections)`);
