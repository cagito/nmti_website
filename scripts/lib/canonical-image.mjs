import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const WEBP_CANONICAL = 'canonical-image-webp.json';
const LEGACY_PNG_CANONICAL = 'canonical-image-png.json';

/** @returns {Record<string, string>} */
export function loadCanonicalMap(scriptsDir) {
  const webpPath = join(scriptsDir, WEBP_CANONICAL);
  if (existsSync(webpPath)) {
    return JSON.parse(readFileSync(webpPath, 'utf8'));
  }
  const legacyPath = join(scriptsDir, LEGACY_PNG_CANONICAL);
  if (existsSync(legacyPath)) {
    const raw = JSON.parse(readFileSync(legacyPath, 'utf8'));
    return Object.fromEntries(
      Object.entries(raw).map(([id, name]) => [id, pngNameToWebp(name)]),
    );
  }
  return {};
}

/** @param {string | undefined} name */
export function pngNameToWebp(name) {
  if (!name) return '';
  return /\.webp$/i.test(name) ? name : name.replace(/\.png$/i, '.webp');
}

/** @param {string} id @param {Record<string, string>} canonical */
export function canonicalWebpName(id, canonical) {
  const entry = canonical[id];
  return entry ? pngNameToWebp(entry) : `${id}.webp`;
}
