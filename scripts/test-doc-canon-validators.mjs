#!/usr/bin/env node
/** Smoke tests for DOC-CANON Phase G validators (exit 0 on current repo). */
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/** @type {{ name: string, script: string }[]} */
const VALIDATORS = [
  { name: 'prompt-rules-consistency', script: 'validate-prompt-rules-consistency.mjs' },
  { name: 'doc-ats-policy', script: 'validate-doc-ats-policy.mjs' },
  { name: 'figure-status', script: 'validate-figure-status-consistency.mjs' },
  { name: 'prompt-status-dual', script: 'validate-prompt-status-dual.mjs' },
  { name: 'archive-banner', script: 'validate-archive-banner.mjs' }
];

let failed = 0;

for (const { name, script } of VALIDATORS) {
  const r = spawnSync(process.execPath, [join(__dirname, script), '--strict'], {
    cwd: ROOT,
    encoding: 'utf8'
  });
  if (r.status !== 0) {
    failed++;
    console.error(`FAIL ${name} (exit ${r.status})`);
    if (r.stderr) console.error(r.stderr.slice(0, 500));
    if (r.stdout) console.error(r.stdout.slice(0, 500));
  } else {
    console.log(`OK   ${name}`);
  }
}

if (failed) {
  console.error(`\ntest-doc-canon-validators: ${VALIDATORS.length - failed}/${VALIDATORS.length} passed`);
  process.exit(1);
}

console.log(`\ntest-doc-canon-validators: ${VALIDATORS.length}/${VALIDATORS.length} passed`);
