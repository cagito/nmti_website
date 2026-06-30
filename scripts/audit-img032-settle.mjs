/**
 * IMG-032 침하판·침하계 — SETTLE-01 · book stage 3 (GNSS.pdf 침하계).
 * Usage: node scripts/audit-img032-settle.mjs
 */
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { REDLINE_CANONICAL, REDLINES_DIR } from './lib/rework-phases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const issues = [];

function add(msg) {
  issues.push(msg);
}

function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf8');
}

const CANONICAL_WEBP = 'IMG-032_침하판-침하계-설치-개념도_성토하부연장봉보호관.webp';

if (!existsSync(join(ROOT, 'assets/images/technology', CANONICAL_WEBP))) {
  add(`missing canonical WebP: ${CANONICAL_WEBP}`);
}

const reg = JSON.parse(read('scripts/image-review-registry.json'))['IMG-032'];
if (!reg || reg.reviewGrade !== 'PASS' || reg.status !== 'reviewed') {
  add('IMG-032 registry must be reviewed PASS');
} else {
  for (const kw of ['침하판', '연장봉', '보호관', 'SETTLE', '측정점']) {
    const hay = `${reg.notes || ''} ${reg.reviewDoc || ''}`;
    if (!hay.includes(kw) && kw !== 'SETTLE') add(`registry missing ${kw}`);
    if (kw === 'SETTLE' && !hay.includes('SETTLE') && !reg.notes?.includes('기준점')) {
      add('registry missing SETTLE-01 / 기준점 note');
    }
  }
}

const rl = REDLINE_CANONICAL['IMG-032'];
if (!rl || !rl.includes('v6')) add('REDLINE_CANONICAL must be v6');
else if (!existsSync(join(REDLINES_DIR, rl))) add(`redline missing: ${rl}`);

const prompt = read(
  'ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-032_침하판_침하계_설치_개념도.md'
);

for (const term of ['침하판', '연장봉', '보호관', '지표침하계', '측정점', '기준점', 'SETTLE-01']) {
  if (!prompt.includes(term)) add(`prompt missing "${term}"`);
}

if (!/침하핀.*금지|침하핀\(T자\)|침하핀.*없음/.test(prompt)) {
  add('prompt must forbid settlement pin confusion');
}

const content = read('js/technology/content-data.js');
const seoPath = join(ROOT, 'technology/sensors/settlement-gauge/index.html');
const corpus = content + (existsSync(seoPath) ? read('technology/sensors/settlement-gauge/index.html') : '');

if (!corpus.includes('IMG-032') && !corpus.includes(CANONICAL_WEBP)) {
  add('sensors/settlement-gauge hero must reference IMG-032');
}

if (reg?.reviewDoc && !reg.reviewDoc.includes('170-IMG-032')) {
  add('registry reviewDoc should link docs/170');
}

if (issues.length) {
  console.log('audit-img032: FAIL', issues.length);
  issues.forEach((i) => console.log(' -', i));
  process.exit(1);
}
console.log('audit-img032: OK (SETTLE-01 · 침하판·연장봉·보호관 · v6)');
