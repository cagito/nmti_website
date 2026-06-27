/**
 * Pillow FT-C 임시 SPA 노출 — requiresReaudit 해제 (webp 이미 있음)
 * FT-A/B hero(002·096·004 등)는 유지 — ai-reviewed 재작도 필요
 * Usage: node scripts/patch-registry-interim-expose.mjs [--dry-run]
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');
const imgDir = join(root, 'assets', 'images', 'technology');
const dryRun = process.argv.includes('--dry-run');

const webpIds = new Set(
  readdirSync(imgDir)
    .filter((f) => f.endsWith('.webp'))
    .map((f) => f.match(/^(IMG-\d{3})/)?.[1])
    .filter(Boolean),
);

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const note = `interim SPA expose (pillow webp) · ${today}`;

/** FT-A/B hero — 재작도 전 노출 금지 */
const KEEP_REAUDIT = new Set([
  'IMG-002',
  'IMG-004',
  'IMG-007',
  'IMG-008',
  'IMG-015',
  'IMG-024',
  'IMG-025',
  'IMG-027',
  'IMG-096',
  'IMG-061',
]);

let cleared = 0;
const kept = [];

for (const [id, reg] of Object.entries(registry)) {
  if (!reg.requiresReaudit) continue;
  if (KEEP_REAUDIT.has(id)) {
    kept.push(id);
    continue;
  }
  if (reg.productionMethod !== 'pillow') {
    kept.push(id);
    continue;
  }
  if (!webpIds.has(id)) {
    kept.push(id);
    continue;
  }
  if (dryRun) {
    console.log('[dry-run] clear reaudit', id, reg.title?.slice(0, 30));
    cleared++;
    continue;
  }
  reg.requiresReaudit = false;
  reg.interimExposedDate = today;
  reg.notes = (reg.notes || '') + ` · ${note}`;
  cleared++;
  console.log('cleared', id);
}

if (dryRun) {
  console.log(`\ndry-run: would clear ${cleared}, keep ${kept.length}`);
  process.exit(0);
}

atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`\nCleared requiresReaudit: ${cleared} pillow · kept: ${kept.length}`);
console.log('Kept (FT-A/B hero):', kept.filter((id) => KEEP_REAUDIT.has(id)).join(', ') || '—');
console.log('Next: npm run sync:images && npm run build:content\n');
