/**
 * IMG-008 tunnel convergence — forbidden 360° closure / ACE / P8 patterns.
 * Usage: node scripts/audit-img008-convergence.mjs
 */
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const issues = [];

function add(msg) {
  issues.push(msg);
}

function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf8');
}

const CANONICAL_WEBP = 'IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.webp';
const imgDir = join(ROOT, 'assets/images/technology');

if (!existsSync(join(imgDir, CANONICAL_WEBP))) {
  add(`missing canonical WebP: ${CANONICAL_WEBP}`);
}

for (const f of readdirSync(imgDir)) {
  if (f.startsWith('IMG-008_') && (f.includes('ACE') || f.includes('진동현식'))) {
    add(`legacy asset must be removed: ${f}`);
  }
}

const seoPath = 'technology/fields/tunnel/convergence/index.html';
const seo = existsSync(join(ROOT, seoPath)) ? read(seoPath) : '';
const content = read('js/technology/content-data.js');

const corpus = seo + '\n' + content;

const forbidden = [
  ['ACE-TCS', '제3자 제품명'],
  ['P8', '8지점 폐합 측점'],
  ['P1~P8', '8지점 표기'],
  ['P1–P8', '8지점 표기'],
  ['360°', '360도 폐합'],
  ['360도', '360도 폐합'],
  ['진동현식', '금지 용어'],
  ['P1~P5만', '5점만으로 전단면 대표'],
];

for (const [term, reason] of forbidden) {
  if (corpus.includes(term)) add(`forbidden "${term}" in SEO/content-data (${reason})`);
}

// "ACE" alone — only flag ACE-TCS / ACE as product (already covered); skip bare ACE in unrelated words

const required = [
  ['P1~P11', '11점 전단면 내공변위계'],
  ['대표 측선', '수평·수직·대각 측선'],
  ['노반', '하부 노반 표기'],
  ['미계측', '노반 미계측'],
  ['건축한계', 'Clearance Envelope'],
  ['기준 측정선', '초기 형상 기준'],
  ['측선', '측점 간 내공변위'],
];

for (const [term, reason] of required) {
  if (!corpus.includes(term)) add(`missing "${term}" in SEO/content-data (${reason})`);
}

if (!seo.includes('상부아치내공변위') && !seo.includes(CANONICAL_WEBP)) {
  add('SEO hero must reference canonical IMG-008 filename');
}

if (issues.length) {
  console.log('audit-img008: FAIL', issues.length);
  issues.forEach((i) => console.log(' -', i));
  process.exit(1);
}
console.log('audit-img008: OK (IMG-008 P1~P11 full section, no 360°/ACE/P8)');
