#!/usr/bin/env node
/**
 * Sync ImageWorks prompt files with docs/36 v2 block (Phase 1).
 * Usage: node scripts/sync-imageworks-prompt-v2.mjs [--id 031] [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROMPTS_DIR = path.join(
  ROOT,
  'ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts'
);
const REGISTRY_PATH = path.join(__dirname, 'data/prompt-v2-registry.json');
const REGISTRY_EXT_PATH = path.join(__dirname, 'data/prompt-v2-registry-ext.json');

function loadRegistry() {
  const base = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  if (fs.existsSync(REGISTRY_EXT_PATH)) {
    Object.assign(base, JSON.parse(fs.readFileSync(REGISTRY_EXT_PATH, 'utf8')));
  }
  return base;
}

const DOC36 = '../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md';

function parseArgs() {
  const args = process.argv.slice(2);
  let id = null;
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) id = args[++i].padStart(3, '0');
    if (args[i] === '--dry-run') dryRun = true;
  }
  return { id, dryRun };
}

function findPromptFile(imgId) {
  const prefix = `IMG-${imgId}_`;
  const files = fs.readdirSync(PROMPTS_DIR).filter((f) => f.startsWith(prefix) && f.endsWith('.md'));
  if (files.length === 0) return null;
  return path.join(PROMPTS_DIR, files[0]);
}

function buildV2Block(entry) {
  const { nodeId, section, en } = entry;
  return `## 최종 생성 프롬프트 (v2 — docs/36 §${section})

**Prefix:** docs/36 §2.1 · **nodeId:** \`${nodeId}\` · **실패:** docs/36 §5

${en}
`;
}

const HEADER_MARKER = '> **AI (docs/36):**';

function ensureHeader(content, section) {
  if (content.includes('docs/36')) return content;
  const lines = content.split('\n');
  const insertAt = lines[0]?.startsWith('#') ? 1 : 0;
  const header = `${HEADER_MARKER} [§${section}](${DOC36}) · Prefix §2.1`;
  lines.splice(insertAt, 0, '', header, '');
  return lines.join('\n');
}

function replaceFinalPrompt(content, v2Block) {
  const sectionRe =
    /^## (?:\d+\. )?최종 생성 프롬프트(?: \(v2[^)]*\))?[^\n]*\n[\s\S]*?(?=^## |\Z)/gm;
  const stripped = content.replace(sectionRe, '').trimEnd();
  return stripped + '\n\n' + v2Block.trimEnd() + '\n';
}

function syncOne(imgId, entry, dryRun) {
  const filePath = findPromptFile(imgId);
  if (!filePath) {
    return { imgId, status: 'skip', reason: 'no prompt file' };
  }
  let content = fs.readFileSync(filePath, 'utf8');
  content = ensureHeader(content, entry.section);
  const v2Block = buildV2Block(entry);
  const updated = replaceFinalPrompt(content, v2Block);
  if (updated.length < content.length * 0.25 && content.length > 80) {
    return { imgId, status: 'error', reason: 'replace would truncate file', file: path.basename(filePath) };
  }
  if (updated === content) {
    return { imgId, status: 'unchanged', file: path.basename(filePath) };
  }
  if (!dryRun) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
  return { imgId, status: dryRun ? 'would-update' : 'updated', file: path.basename(filePath) };
}

function main() {
  const { id, dryRun } = parseArgs();
  const registry = loadRegistry();
  const ids = id ? [id] : Object.keys(registry);
  const results = ids.map((key) => {
    const imgId = key.padStart(3, '0');
    const entry = registry[key] || registry[imgId];
    if (!entry) return { imgId, status: 'skip', reason: 'not in registry' };
    return syncOne(imgId, entry, dryRun);
  });
  const updated = results.filter((r) => r.status === 'updated' || r.status === 'would-update');
  const skipped = results.filter((r) => r.status === 'skip');
  console.log(JSON.stringify({ dryRun, updated: updated.length, skipped: skipped.length, results }, null, 2));
}

main();
