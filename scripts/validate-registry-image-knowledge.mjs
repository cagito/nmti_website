/**
 * Validate imageKnowledgeTopic on registry ↔ img-image-knowledge-map.json.
 * Usage: node scripts/validate-registry-image-knowledge.mjs [--strict]
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');
const mapPath = join(ROOT, 'scripts', 'img-image-knowledge-map.json');
const ikDir = join(ROOT, 'docs', 'image-knowledge');

const { map } = JSON.parse(readFileSync(mapPath, 'utf8'));
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

function topicFromEntry(entry) {
  if (typeof entry === 'string') return entry;
  return entry?.topic || null;
}

let errors = 0;
let ok = 0;

for (const [imgId, entry] of Object.entries(map)) {
  const topic = topicFromEntry(entry);
  if (!topic) {
    console.error(`INVALID map entry ${imgId}`);
    errors += 1;
    continue;
  }
  if (!existsSync(join(ikDir, topic))) {
    console.error(`MISSING topic file ${topic} (map ${imgId})`);
    errors += 1;
    continue;
  }
  const reg = registry[imgId];
  if (!reg) {
    if (STRICT) {
      console.error(`MISSING registry ${imgId} (in map)`);
      errors += 1;
    }
    continue;
  }
  if (reg.imageKnowledgeTopic !== topic) {
    console.error(`MISMATCH ${imgId}: registry=${reg.imageKnowledgeTopic || '—'} map=${topic}`);
    errors += 1;
    continue;
  }
  ok += 1;
}

for (const [imgId, reg] of Object.entries(registry)) {
  const topic = reg.imageKnowledgeTopic;
  if (!topic) continue;
  if (!existsSync(join(ikDir, topic))) {
    console.error(`ORPHAN topic file ${imgId}: ${topic}`);
    errors += 1;
  }
  const mapped = topicFromEntry(map[imgId]);
  if (mapped && mapped !== topic) {
    console.error(`ORPHAN registry topic ${imgId}: ${topic} (map=${mapped})`);
    errors += 1;
  }
}

if (STRICT) {
  for (const [imgId, reg] of Object.entries(registry)) {
    if (reg.hero && !reg.imageKnowledgeTopic && map[imgId]) {
      console.error(`HERO missing imageKnowledgeTopic: ${imgId}`);
      errors += 1;
    }
  }
}

if (errors) {
  console.error(`validate-registry-image-knowledge: FAIL (${errors} issues, ${ok} ok)`);
  process.exit(1);
}
console.log(`validate-registry-image-knowledge: OK (${ok} mapped entries)`);
