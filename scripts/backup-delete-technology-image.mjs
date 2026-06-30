#!/usr/bin/env node
/**
 * Delete technology figure files with automatic backup to assets/images/technology/backup/
 *
 * Usage:
 *   node scripts/backup-delete-technology-image.mjs path/to/IMG-001_foo.webp ...
 *   node scripts/backup-delete-technology-image.mjs --reason "manual cleanup" --dry-run ...
 */
import { resolve } from 'path';
import {
  backupAndDeleteTechnologyImage,
  isUnderTechnologyImages,
  TECH_IMG_DIR,
} from './lib/technology-image-backup.mjs';

function usage(code = 1) {
  console.error(`Usage: node scripts/backup-delete-technology-image.mjs [--dry-run] [--reason TEXT] <file...>

Files must be under: ${TECH_IMG_DIR}
Backups go to:       ${TECH_IMG_DIR}/backup/`);
  process.exit(code);
}

const args = process.argv.slice(2);
let dryRun = false;
let reason = 'manual-delete';
const files = [];

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--dry-run') dryRun = true;
  else if (a === '--reason') reason = args[++i] || reason;
  else if (a === '--help' || a === '-h') usage(0);
  else files.push(a);
}

if (!files.length) usage();

let ok = 0;
for (const f of files) {
  const abs = resolve(f);
  if (!isUnderTechnologyImages(abs)) {
    console.error('SKIP (outside technology/):', f);
    continue;
  }
  backupAndDeleteTechnologyImage(abs, { reason, dryRun });
  ok++;
}

console.log(`backup-delete-technology-image: ${ok} file(s)${dryRun ? ' (dry-run)' : ''}`);
