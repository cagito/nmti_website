/**
 * Backup assets/images/technology files before delete or overwrite.
 * Dest: assets/images/technology/backup/{relative-dir}/{name}.{timestamp}{ext}
 */
import { copyFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { dirname, join, relative, resolve, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const TECH_IMG_DIR = join(ROOT, 'assets', 'images', 'technology');

function timestampLocal() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

/** @returns {boolean} */
export function isUnderTechnologyImages(absPath) {
  const abs = resolve(absPath);
  const techRoot = resolve(TECH_IMG_DIR);
  const rel = relative(techRoot, abs);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

/**
 * Copy file into technology/backup/ preserving subpath (source/, reviewed/, etc.).
 * @returns {string | null} backup absolute path
 */
export function backupTechnologyImage(absPath, { reason = '', dryRun = false } = {}) {
  if (!existsSync(absPath)) return null;

  const abs = resolve(absPath);
  const techRoot = resolve(TECH_IMG_DIR);
  if (!isUnderTechnologyImages(abs)) {
    throw new Error(`Not under assets/images/technology: ${absPath}`);
  }

  const rel = relative(techRoot, abs).replace(/\\/g, '/');
  if (rel.startsWith('backup/')) return null;

  const slash = rel.lastIndexOf('/');
  const dirPart = slash >= 0 ? rel.slice(0, slash) : '';
  const file = slash >= 0 ? rel.slice(slash + 1) : rel;
  const dot = file.lastIndexOf('.');
  const stem = dot >= 0 ? file.slice(0, dot) : file;
  const ext = dot >= 0 ? file.slice(dot) : '';
  const backedName = `${stem}.${timestampLocal()}${ext}`;
  const dest = dirPart
    ? join(techRoot, 'backup', dirPart, backedName)
    : join(techRoot, 'backup', backedName);

  if (dryRun) {
    console.log(
      `[dry-run] backup ${rel} → backup/${dirPart ? dirPart + '/' : ''}${backedName}${reason ? ` (${reason})` : ''}`,
    );
    return dest;
  }

  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(abs, dest);
  const relDest = relative(techRoot, dest).replace(/\\/g, '/');
  console.log(`Backed up: ${rel} → ${relDest}${reason ? ` (${reason})` : ''}`);
  return dest;
}

/** Backup then delete. @returns {string | null} backup path */
export function backupAndDeleteTechnologyImage(absPath, opts = {}) {
  const dest = backupTechnologyImage(absPath, opts);
  if (opts.dryRun) {
    if (existsSync(absPath)) {
      const rel = relative(TECH_IMG_DIR, resolve(absPath)).replace(/\\/g, '/');
      console.log(`[dry-run] delete ${rel}`);
    }
    return dest;
  }
  if (existsSync(absPath)) unlinkSync(absPath);
  return dest;
}
