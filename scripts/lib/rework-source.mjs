/**
 * 재작도 Figure 자산 존재 확인 (source/ 또는 technology/ — WebP·PNG)
 */
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT } from './rework-phases.mjs';

const sourceDir = join(REWORK_ROOT, 'assets', 'images', 'technology', 'source');
const techDir = join(REWORK_ROOT, 'assets', 'images', 'technology');
const canonicalPath = join(REWORK_ROOT, 'scripts', 'canonical-image-png.json');

let canonicalCache = null;

function loadCanonical() {
  if (!canonicalCache) {
    canonicalCache = JSON.parse(readFileSync(canonicalPath, 'utf8'));
  }
  return canonicalCache;
}

function listDir(dir, ext) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(ext));
}

function namesForCanon(canon) {
  if (!canon) return [];
  const names = [canon];
  if (/\.png$/i.test(canon)) names.push(canon.replace(/\.png$/i, '.webp'));
  if (/\.webp$/i.test(canon)) names.push(canon.replace(/\.webp$/i, '.png'));
  return [...new Set(names)];
}

function findByPrefix(files, id) {
  const prefix = `${id}_`;
  for (const ext of ['.webp', '.png']) {
    const hit = files.find((f) => f.startsWith(prefix) && f.endsWith(ext));
    if (hit) return hit;
  }
  return null;
}

export function hasSourceAsset(id) {
  const canonical = loadCanonical();
  const canon = canonical[id];
  const sourceFiles = existsSync(sourceDir) ? readdirSync(sourceDir) : [];

  for (const name of namesForCanon(canon)) {
    if (sourceFiles.includes(name)) {
      return { ok: true, path: join(sourceDir, name) };
    }
  }

  const fromSource = findByPrefix(sourceFiles, id);
  if (fromSource) return { ok: true, path: join(sourceDir, fromSource) };

  return { ok: false, path: canon ? join(sourceDir, namesForCanon(canon)[0]) : null };
}

export function hasReworkAsset(id) {
  const fromSource = hasSourceAsset(id);
  if (fromSource.ok) return fromSource;

  const canonical = loadCanonical();
  const canon = canonical[id];
  for (const name of namesForCanon(canon)) {
    const techPath = join(techDir, name);
    if (existsSync(techPath)) return { ok: true, path: techPath };
  }

  if (!existsSync(techDir)) return { ok: false, path: null };
  const techFiles = readdirSync(techDir);
  const fromTech = findByPrefix(techFiles, id);
  if (fromTech) return { ok: true, path: join(techDir, fromTech) };

  return { ok: false, path: canon ? join(sourceDir, namesForCanon(canon)[0]) : null };
}

/** @deprecated use hasSourceAsset */
export function hasSourcePng(id) {
  return hasSourceAsset(id);
}

/** @deprecated use hasReworkAsset */
export function hasReworkPng(id) {
  return hasReworkAsset(id);
}
