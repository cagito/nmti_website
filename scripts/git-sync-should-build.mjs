#!/usr/bin/env node
/**
 * Exit 0 if last git-sync run touched paths that warrant build:images.
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { anyPathNeedsBuild } from './lib/git-sync-utils.mjs';

const LAST_RUN_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', '.git-sync-last-run.json');

if (!existsSync(LAST_RUN_PATH)) {
  process.exit(1);
}

try {
  const data = JSON.parse(readFileSync(LAST_RUN_PATH, 'utf8'));
  if (data.shouldBuild === true) process.exit(0);
  if (anyPathNeedsBuild(data.changedPaths || [])) process.exit(0);
  process.exit(1);
} catch {
  process.exit(1);
}
