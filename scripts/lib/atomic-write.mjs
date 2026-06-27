/** Atomic UTF-8 write for network/FTP paths (avoid empty-file races). */
import { writeFileSync, renameSync, readFileSync, existsSync } from 'fs';
import { assertWriteAllowed } from './workspace-lock.mjs';

export function atomicWriteUtf8(path, content) {
  assertWriteAllowed(path);
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, content, 'utf8');
  renameSync(tmp, path);
}

export function readJsonSafe(path, fallback = {}) {
  if (!existsSync(path)) return fallback;
  const raw = readFileSync(path, 'utf8');
  if (!raw.trim()) return fallback;
  return JSON.parse(raw);
}
