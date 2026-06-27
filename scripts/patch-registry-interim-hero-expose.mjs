/**
 * Hero 임시 SPA 노출 — webp 있으면 requiresReaudit 해제
 * (기존 webp 그대로 표시 · ai-reviewed 재작도는 별도 W1~W8 큐)
 * Usage: npm run expose:interim-heroes [-- --dry-run]
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');
const imgDir = join(root, 'assets', 'images', 'technology');
const dryRun = process.argv.includes('--dry-run');

runLocked('registry', 'interim-hero-expose', () => {
  if (!existsSync(imgDir)) {
    console.error('Missing:', imgDir);
    process.exit(1);
  }

  const webpIds = new Set(
    readdirSync(imgDir)
      .filter((f) => f.endsWith('.webp'))
      .map((f) => f.match(/^(IMG-\d{3})/)?.[1])
      .filter(Boolean),
  );

  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  const note = `interim hero expose (existing webp) · ${today} · ai-reviewed 재작도 예정`;

  let cleared = 0;
  const skipped = [];

  for (const [id, reg] of Object.entries(registry)) {
    if (!reg?.hero || !reg.requiresReaudit) continue;
    if (reg.wireframeReplace) {
      skipped.push({ id, reason: 'wireframeReplace' });
      continue;
    }
    if (!webpIds.has(id)) {
      skipped.push({ id, reason: 'no webp' });
      continue;
    }
    if (dryRun) {
      console.log('[dry-run] clear hero reaudit', id, (reg.title || '').slice(0, 36));
      cleared++;
      continue;
    }
    reg.requiresReaudit = false;
    reg.interimHeroExposedDate = today;
    if (!reg.notes?.includes('interim hero expose')) {
      reg.notes = `${reg.notes || ''} · ${note}`.trim();
    }
    cleared++;
    console.log('cleared', id);
  }

  if (dryRun) {
    console.log(`\ndry-run: would clear ${cleared} hero · skip ${skipped.length}`);
    if (skipped.length) {
      skipped.forEach((s) => console.log('  skip', s.id, s.reason));
    }
    return;
  }

  atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
  console.log(`\nCleared requiresReaudit: ${cleared} hero`);
  if (skipped.length) {
    console.log('Skipped:', skipped.map((s) => `${s.id}(${s.reason})`).join(', ') || '—');
  }
  console.log('Next: npm run sync:images && npm run build:content && npm run list:blocked-heroes\n');
});
