#!/usr/bin/env node
/** @deprecated use rework-phase-pack.mjs --phase A */
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const r = spawnSync('node', ['scripts/rework-phase-pack.mjs', '--phase', 'A'], {
  cwd: root,
  stdio: 'inherit',
  shell: false,
});
process.exit(r.status ?? 1);
