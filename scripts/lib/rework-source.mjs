/**
 * 재작도 Figure 자산 존재 확인 (source/ 또는 technology/ — WebP only)
 */
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT } from './rework-phases.mjs';
import { loadCanonicalMap, canonicalWebpName } from './canonical-image.mjs';

const sourceDir = join(REWORK_ROOT, 'assets', 'images', 'technology', 'source');
const techDir = join(REWORK_ROOT, 'assets', 'images', 'technology');
const scriptsDir = join(REWORK_ROOT, 'scripts');

function findByPrefix(files, id) {
  const prefix = `${id}_`;
  return files.find((f) => f.startsWith(prefix) && f.endsWith('.webp')) ?? null;
}

export function hasSourceAsset(id) {
  const canonical = loadCanonicalMap(scriptsDir);
  const canon = canonicalWebpName(id, canonical);
  const sourceFiles = existsSync(sourceDir) ? readdirSync(sourceDir) : [];

  if (canon && sourceFiles.includes(canon)) {
    return { ok: true, path: join(sourceDir, canon) };
  }

  const fromSource = findByPrefix(sourceFiles, id);
  if (fromSource) return { ok: true, path: join(sourceDir, fromSource) };

  return { ok: false, path: canon ? join(sourceDir, canon) : null };
}

export function hasReworkAsset(id) {
  const fromSource = hasSourceAsset(id);
  if (fromSource.ok) return fromSource;

  const canonical = loadCanonicalMap(scriptsDir);
  const canon = canonicalWebpName(id, canonical);
  if (canon && existsSync(join(techDir, canon))) {
    return { ok: true, path: join(techDir, canon) };
  }

  if (!existsSync(techDir)) return { ok: false, path: null };
  const techFiles = readdirSync(techDir);
  const fromTech = findByPrefix(techFiles, id);
  if (fromTech) return { ok: true, path: join(techDir, fromTech) };

  return { ok: false, path: canon ? join(sourceDir, canon) : null };
}

/** @deprecated use hasSourceAsset */
export function hasSourcePng(id) {
  return hasSourceAsset(id);
}

/** @deprecated use hasReworkAsset */
export function hasReworkPng(id) {
  return hasReworkAsset(id);
}
