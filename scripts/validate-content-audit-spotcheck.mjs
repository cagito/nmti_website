#!/usr/bin/env node
/**
 * 179 부록 A — generated SEO HTML spot-check.
 * Usage: node scripts/validate-content-audit-spotcheck.mjs
 * Prerequisite: npm run build:seo
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'scripts', 'data', 'content-audit-spotcheck.json');

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
let failed = 0;
let passed = 0;

for (const page of config.pages) {
  const abs = join(ROOT, page.html.replace(/\//g, '\\'));
  const alt = join(ROOT, page.html);
  const path = existsSync(abs) ? abs : existsSync(alt) ? alt : null;

  if (!path) {
    console.error(`FAIL [missing] ${page.nodeId}: ${page.html} — run build:seo`);
    failed++;
    continue;
  }

  const text = readFileSync(path, 'utf8');
  let pageOk = true;

  for (const pattern of config.globalForbidden ?? []) {
    if (text.includes(pattern)) {
      console.error(`FAIL [global] ${page.nodeId}: forbidden "${pattern}"`);
      pageOk = false;
      failed++;
    }
  }

  for (const pattern of page.forbidden ?? []) {
    if (text.includes(pattern)) {
      console.error(`FAIL [${page.nodeId}] forbidden "${pattern}"`);
      pageOk = false;
      failed++;
    }
  }

  for (const needle of page.required ?? []) {
    if (!text.includes(needle)) {
      console.error(`FAIL [${page.nodeId}] missing required "${needle}"`);
      pageOk = false;
      failed++;
    }
  }

  if (pageOk) {
    passed++;
    console.log(`OK  ${page.nodeId}`);
  }
}

if (failed) {
  console.error(`validate-content-audit-spotcheck: ${passed}/${config.pages.length} OK, ${failed} issue(s)`);
  process.exit(1);
}

console.log(`validate-content-audit-spotcheck: ${passed}/${config.pages.length} OK`);
