/**
 * Paths that must not be written concurrently across Cursor sessions.
 * docs/98-다중-Cursor-동시작업-충돌방지.md
 */
import { normalize } from 'path';

/** @typedef {{ scope: string, test: (normalizedPosix: string) => boolean }} GuardRule */

/** @type {GuardRule[]} */
export const GUARD_RULES = [
  {
    scope: 'registry',
    test: (p) =>
      /(^|\/)scripts\/image-review-registry\.json$/.test(p) ||
      /(^|\/)scripts\/canonical-image-png\.json$/.test(p) ||
      /(^|\/)scripts\/figure-production-policy\.json$/.test(p),
  },
  {
    scope: 'build',
    test: (p) =>
      /(^|\/)js\/technology\/images\.js$/.test(p) ||
      /(^|\/)js\/technology\/content-data\.js$/.test(p),
  },
  {
    scope: 'images',
    test: (p) => /(^|\/)assets\/images\/technology\//.test(p),
  },
];

/**
 * @param {string} filePath
 * @returns {string[]}
 */
export function scopesForPath(filePath) {
  const p = normalize(filePath).replace(/\\/g, '/');
  const scopes = [];
  for (const rule of GUARD_RULES) {
    if (rule.test(p)) scopes.push(rule.scope);
  }
  return scopes;
}

/**
 * @param {string} command
 * @returns {string[]}
 */
export function scopesForShellCommand(command) {
  const scopes = new Set();
  const c = command.toLowerCase();

  if (
    /patch-registry|seed-image-review|sign-phase-|mark-prohibited|register-external-figure|register:figure/.test(
      c
    )
  ) {
    scopes.add('registry');
  }
  if (/generate-image-assets|build:images|build-content-data|build:content/.test(c)) {
    scopes.add('build');
  }
  if (/convert-technology-webp|assets\/images\/technology|register:figure/.test(c)) {
    scopes.add('images');
  }
  if (/verify:local|build:all|npm run build\b/.test(c)) {
    scopes.add('full');
  }

  return [...scopes];
}
