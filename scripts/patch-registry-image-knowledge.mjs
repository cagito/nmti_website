/**
 * Set imageKnowledgeTopic on registry entries from img-image-knowledge-map.json.
 * Usage: node scripts/patch-registry-image-knowledge.mjs [--dry-run]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const DRY = process.argv.includes('--dry-run');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');
const mapPath = join(root, 'scripts', 'img-image-knowledge-map.json');

function topicFromEntry(entry) {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry.topic === 'string') return entry.topic;
  return null;
}

function applyPatch() {
  const { map } = JSON.parse(readFileSync(mapPath, 'utf8'));
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

  let patched = 0;
  let missing = 0;

  for (const [imgId, entry] of Object.entries(map)) {
    const topic = topicFromEntry(entry);
    if (!topic) continue;
    const reg = registry[imgId];
    if (!reg) {
      console.warn('WARN: registry missing', imgId, '(map only)');
      missing += 1;
      continue;
    }
    if (reg.imageKnowledgeTopic !== topic) {
      reg.imageKnowledgeTopic = topic;
      patched += 1;
      console.log('topic', imgId, '→', topic);
    }
  }

  if (DRY) {
    console.log(`patch-registry-image-knowledge: dry-run would patch ${patched} (${missing} map-only)`);
    return;
  }

  atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
  console.log(`patch-registry-image-knowledge: patched ${patched} (${missing} map-only)`);
}

runLocked('registry', 'patch-registry-image-knowledge', applyPatch);
