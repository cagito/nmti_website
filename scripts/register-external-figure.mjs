#!/usr/bin/env node
/**
 * Register externally produced WebP (CAD / AI-reviewed) for an IMG-### figure.
 *
 * Usage:
 *   node scripts/register-external-figure.mjs --id IMG-008 --input path/to.webp \
 *     --method ai-reviewed --reviewer "홍길동" \
 *     --visual-grade PASS [--tech-grade PASS] [--notes "..."] [--dry-run]
 *
 * Steps: validate → copy WebP to technology/ + source/ → update registry & policy → images.js
 */
import { readFileSync, existsSync, readdirSync, copyFileSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { createRequire } from 'module';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';
import { clearWireframeReplace } from './lib/wireframe-gate.mjs';
import { loadCanonicalMap, canonicalWebpName } from './lib/canonical-image.mjs';
import { backupTechnologyImage } from './lib/technology-image-backup.mjs';

const require = createRequire(import.meta.url);
let sizeOf;
try {
  sizeOf = require('image-size');
} catch {
  sizeOf = null;
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPTS_DIR = join(ROOT, 'scripts');
const IMG_DIR = join(ROOT, 'assets', 'images', 'technology');
const SOURCE_DIR = join(IMG_DIR, 'source');
const POLICY_PATH = join(ROOT, 'scripts', 'figure-production-policy.json');
const REGISTRY_PATH = join(ROOT, 'scripts', 'image-review-registry.json');
const APPROVED = new Set(['PASS', 'MINOR_FIX']);
const HERO_MIN_W = 1920;
const HERO_MIN_H = 1080;

function usage(exit = 1) {
  console.error(`Usage: node scripts/register-external-figure.mjs --id IMG-### --input <webp> \\
  --method ai-reviewed|cad --reviewer <name> --visual-grade PASS|MINOR_FIX \\
  [--tech-grade PASS|MINOR_FIX] [--notes "..."] [--dry-run]`);
  process.exit(exit);
}

function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--id') out.id = argv[++i];
    else if (a === '--input' || a === '--from') out.input = argv[++i];
    else if (a === '--method') out.method = argv[++i];
    else if (a === '--reviewer') out.reviewer = argv[++i];
    else if (a === '--visual-grade') out.visualGrade = argv[++i];
    else if (a === '--tech-grade') out.techGrade = argv[++i];
    else if (a === '--notes') out.notes = argv[++i];
    else if (a === '--no-lock') out.noLock = true;
    else if (a === '--help' || a === '-h') usage(0);
    else {
      console.error('Unknown arg:', a);
      usage();
    }
  }
  return out;
}

function resolveTargetFilename(id, canonical, ext) {
  if (ext !== '.webp') return null;
  if (canonical[id]) return canonicalWebpName(id, canonical);
  const prefix = `${id}_`;
  const hits = readdirSync(IMG_DIR).filter(
    (f) => f.startsWith(prefix) && f.toLowerCase().endsWith('.webp'),
  );
  if (hits.length === 1) return hits[0];
  if (hits.length > 1) return hits.sort()[0];
  return `${id}_external.webp`;
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) {
    console.error(`FAILED: ${cmd} ${args.join(' ')}`);
    process.exit(r.status ?? 1);
  }
}

const args = parseArgs(process.argv);
if (!args.id || !args.input || !args.method || !args.reviewer || !args.visualGrade) usage();

const id = args.id.toUpperCase();
if (!/^IMG-\d{3}$/.test(id)) {
  console.error('Invalid --id:', id);
  process.exit(1);
}

if (!APPROVED.has(args.visualGrade)) {
  console.error('--visual-grade must be PASS or MINOR_FIX');
  process.exit(1);
}
if (args.techGrade && !APPROVED.has(args.techGrade)) {
  console.error('--tech-grade must be PASS or MINOR_FIX');
  process.exit(1);
}

const inputExt = basename(args.input).match(/\.webp$/i)?.[0]?.toLowerCase();
if (!inputExt) {
  console.error('Input must be .webp (technology is WebP-only):', args.input);
  process.exit(1);
}

if (!existsSync(args.input)) {
  console.error('Input file not found:', args.input);
  process.exit(1);
}

const policy = JSON.parse(readFileSync(POLICY_PATH, 'utf8'));
const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
const canonical = loadCanonicalMap(SCRIPTS_DIR);

const fig = policy.figures[id];
const reg = registry[id];
if (!fig) {
  console.error(`${id} not in figure-production-policy.json`);
  process.exit(1);
}
if (!reg) {
  console.error(`${id} not in image-review-registry.json`);
  process.exit(1);
}

const tier = fig.tier;
const allowed = policy.tiers[tier]?.allowedMethods ?? [];
if (!allowed.includes(args.method)) {
  console.error(`${args.method} not allowed for ${tier} (allowed: ${allowed.join(', ')})`);
  process.exit(1);
}

if (sizeOf) {
  const dim = sizeOf(args.input);
  const isHero = fig.hero ?? reg.hero;
  if (isHero && (dim.width < HERO_MIN_W || dim.height < HERO_MIN_H)) {
    console.error(`Hero ${dim.width}×${dim.height} < ${HERO_MIN_W}×${HERO_MIN_H}`);
    process.exit(1);
  }
  console.log(`Input: ${dim.width}×${dim.height} (webp)`);
}

const targetName = resolveTargetFilename(id, canonical, inputExt);
const destAsset = join(IMG_DIR, targetName);
const destSource = join(SOURCE_DIR, targetName);

console.log(`Register ${id} → ${targetName}`);
console.log(`  method: ${args.method}`);
console.log(`  visual: ${args.visualGrade} (${args.reviewer})`);

if (args.dryRun) {
  console.log('[dry-run] would copy', args.input, '→', destAsset);
  console.log('[dry-run] would update registry & policy');
  process.exit(0);
}

function registerMain() {
mkdirSync(SOURCE_DIR, { recursive: true });
if (existsSync(destAsset)) backupTechnologyImage(destAsset, { reason: 'register-replace' });
if (existsSync(destSource)) backupTechnologyImage(destSource, { reason: 'register-replace' });
copyFileSync(args.input, destAsset);
copyFileSync(args.input, destSource);

const today = new Date().toISOString().slice(0, 10);

reg.productionMethod = args.method;
reg.productionMethodTarget = args.method;
reg.migrationStatus = 'completed';
reg.migrationCompletedDate = today;
if (args.techGrade) {
  reg.reviewGrade = args.techGrade;
  reg.reviewer = args.reviewer;
  reg.reviewDate = today;
  reg.status = 'reviewed';
}
reg.visualReview = {
  grade: args.visualGrade,
  reviewer: args.reviewer,
  date: today,
  notes: args.notes ?? `외부 WebP 등록 (${args.method})`,
  gates: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7'],
};
if (args.method !== 'pillow') clearWireframeReplace(reg);

fig.currentMethod = args.method;
policy.figures[id] = fig;

atomicWriteUtf8(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`);
atomicWriteUtf8(POLICY_PATH, `${JSON.stringify(policy, null, 2)}\n`);

if (!canonical[id]) {
  canonical[id] = targetName;
  atomicWriteUtf8(
    join(SCRIPTS_DIR, 'canonical-image-webp.json'),
    `${JSON.stringify(canonical, null, 2)}\n`,
  );
}

console.log('Running generate-image-assets.mjs …');
run('node', ['scripts/generate-image-assets.mjs', '--no-lock']);

console.log('Running generate-image-review-log.mjs …');
run('node', ['scripts/generate-image-review-log.mjs']);

console.log(`✓ ${id} registered (${basename(destAsset)})`);
console.log('Next: npm run sync:images && npm run build:content');
}

if (args.noLock) {
  registerMain();
} else {
  runLocked('full', `register-external-figure ${id}`, registerMain);
}
