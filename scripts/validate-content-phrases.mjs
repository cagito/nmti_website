#!/usr/bin/env node
/**
 * Scan content-data sources for forbidden phrases (179 Phase F).
 * Usage: node scripts/validate-content-phrases.mjs
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = join(ROOT, 'scripts', 'content-data');
const RULES_PATH = join(ROOT, 'scripts', 'data', 'content-forbidden-phrases.json');

const rules = JSON.parse(readFileSync(RULES_PATH, 'utf8'));
let failed = 0;

function collectMjsFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) out.push(...collectMjsFiles(abs));
    else if (name.endsWith('.mjs')) out.push(abs);
  }
  return out;
}

function nodeBlock(text, nodeId) {
  const key = `'${nodeId}': {`;
  const idx = text.indexOf(key);
  if (idx < 0) return null;
  return text.slice(idx, idx + 12000);
}

function fieldSlice(block, field) {
  const re = new RegExp(`\\b${field}:\\s*`);
  const m = block.match(re);
  if (!m) return '';
  const start = m.index + m[0].length;
  const tail = block.slice(start);
  if (tail.startsWith("'") || tail.startsWith('"')) {
    const q = tail[0];
    let i = 1;
    while (i < tail.length) {
      if (tail[i] === '\\') {
        i += 2;
        continue;
      }
      if (tail[i] === q) return tail.slice(1, i);
      i++;
    }
  }
  const next = tail.search(/\n\s{4}\w+:/);
  return next >= 0 ? tail.slice(0, next) : tail.slice(0, 2000);
}

const files = collectMjsFiles(CONTENT_DIR);
const corpus = files.map((f) => ({
  rel: relative(ROOT, f).replace(/\\/g, '/'),
  text: readFileSync(f, 'utf8'),
}));

for (const rule of rules.forbidden) {
  for (const { rel, text } of corpus) {
    if (rule.files && !rule.files.some((f) => rel.includes(f))) continue;
    if (text.includes(rule.pattern)) {
      console.error(`FAIL [${rule.id}] ${rel}: "${rule.pattern}" — ${rule.message}`);
      failed++;
    }
  }
}

for (const [nodeId, nodeRules] of Object.entries(rules.forbiddenInNode ?? {})) {
  for (const { rel, text } of corpus) {
    const block = nodeBlock(text, nodeId);
    if (!block || !rel.includes('leaves-part')) continue;
    for (const rule of nodeRules) {
      for (const field of rule.fields ?? ['all']) {
        const slice = field === 'all' ? block : fieldSlice(block, field);
        if (!slice) continue;
        for (const pattern of rule.patterns) {
          if (slice.includes(pattern)) {
            console.error(
              `FAIL [${rule.id}] ${rel} ${nodeId}.${field}: "${pattern}" — ${rule.message}`
            );
            failed++;
          }
        }
      }
    }
  }
}

const allText = corpus.map((c) => c.text).join('\n');

for (const [nodeId, needles] of Object.entries(rules.requiredInNode ?? {})) {
  const block =
    corpus
      .map((c) => nodeBlock(c.text, nodeId))
      .filter(Boolean)
      .sort((a, b) => b.length - a.length)[0] ?? null;
  if (!block) {
    console.error(`FAIL required node missing: ${nodeId}`);
    failed++;
    continue;
  }
  for (const needle of needles) {
    if (!block.includes(needle)) {
      console.error(`FAIL required [${nodeId}]: missing "${needle}"`);
      failed++;
    }
  }
}

if (failed) {
  console.error(`validate-content-phrases: ${failed} issue(s)`);
  process.exit(1);
}

console.log('validate-content-phrases: OK');
