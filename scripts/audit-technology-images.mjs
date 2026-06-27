/**
 * 기술자료 이미지 운영 반영 검수.
 * Usage: npm run audit:images
 *        node scripts/audit-technology-images.mjs [--strict] [--rework-pending-ok]
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const P1_REAUDIT = process.argv.includes('--p1-reaudit');
const REWORK_PENDING_OK = process.argv.includes('--rework-pending-ok');
const APPROVED = new Set(['PASS', 'MINOR_FIX']);
const LOG_PATH = join(ROOT, 'docs', 'IMAGE_REVIEW_LOG.md');
const REGISTRY_PATH = join(ROOT, 'scripts', 'image-review-registry.json');
const PRIORITY_PATH = join(ROOT, 'scripts', 'image-review-priority.json');

const log = readFileSync(LOG_PATH, 'utf8');
const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
const priority = JSON.parse(readFileSync(PRIORITY_PATH, 'utf8'));
const PRIORITY_IDS = new Set([...(priority.P0 || []), ...priority.P1, ...priority.P2, ...priority.P3]);
const imagesJs = readFileSync(join(ROOT, 'js', 'technology', 'images.js'), 'utf8');
const dictionary = readFileSync(join(ROOT, 'js', 'technology', 'dictionary.js'), 'utf8');

const imageIdsInJs = [...imagesJs.matchAll(/'((IMG-\d{3}))':/g)].map((m) => m[1]);
const dictImageIds = [...dictionary.matchAll(/imageId:\s*'(IMG-\d{3})'/g)].map((m) => m[1]);
const dictSet = new Set(dictImageIds);

let errors = 0;
let warnings = 0;

function fail(msg) {
  console.error('FAIL', msg);
  errors++;
}
function warn(msg) {
  console.warn('WARN', msg);
  warnings++;
}
function ok(msg) {
  console.log('OK  ', msg);
}

// 1–5: per-image metadata in images.js (parse exported objects via registry + spot check)
for (const id of imageIdsInJs) {
  const reg = registry[id];
  const block = imagesJs.split(`'${id}':`)[1]?.split(/\n  '/)[0] || '';

  if (!reg) {
    fail(`${id}: image-review-registry.json에 없음`);
    continue;
  }

  for (const field of ['alt', 'caption', 'status', 'reviewGrade', 'reviewDoc']) {
    if (!block.includes(field + ':')) fail(`${id}: images.js에 ${field} 없음`);
  }

  if (!reg.alt && !block.includes('alt:')) fail(`${id}: alt 누락`);
  if (!reg.caption && !block.match(/caption:/)) fail(`${id}: caption 누락`);

  if (!['pending', 'source', 'reviewed', 'rejected'].includes(reg.status)) {
    fail(`${id}: 잘못된 status "${reg.status}"`);
  }

  if (reg.status === 'reviewed' && !reg.reviewGrade) {
    fail(`${id}: reviewed인데 reviewGrade 없음`);
  }

  if (!reg.reviewDoc?.includes('IMAGE_REVIEW_LOG')) {
    fail(`${id}: reviewDoc가 IMAGE_REVIEW_LOG를 가리키지 않음`);
  }

  const anchorOk = log.includes(`id="${id}"`) || log.includes(`### ${id} `);
  if (!anchorOk) {
    fail(`${id}: IMAGE_REVIEW_LOG.md에 앵커 없음 (id="${id}")`);
  }

  if (reg.status === 'rejected' && dictSet.has(id)) {
    fail(`${id}: rejected 이미지가 dictionary에서 참조됨`);
  }

  if (dictSet.has(id)) {
    if (reg.status !== 'reviewed') {
      fail(`${id}: dictionary 참조 — status가 reviewed가 아님 (${reg.status})`);
    } else if (!APPROVED.has(reg.reviewGrade)) {
      fail(`${id}: dictionary 참조 — reviewGrade ${reg.reviewGrade} (운영 불가)`);
    }
  }

  if (reg.requiresReaudit && reg.reviewGrade === 'PASS') {
    const msg = `${id}: requiresReaudit — INSTRUMENTATION_DRAWING_RULES 재검수 필요`;
    if (REWORK_PENDING_OK) warn(msg);
    else if (STRICT || P1_REAUDIT) fail(msg);
    else warn(msg);
  }

  if (PRIORITY_IDS.has(id)) {
    if (!Array.isArray(reg.prohibitedErrors) || reg.prohibitedErrors.length === 0) {
      const msg = `${id}: P1/P2/P3 우선순위 — prohibitedErrors 비어 있음`;
      if (STRICT) fail(msg);
      else warn(msg);
    }
  }

  if (reg.alt && reg.alt.length < 20) {
    warn(`${id}: alt가 짧음 (일반적 설명 가능성)`);
  }

  // AUTO-01 — 자동계측 Figure caption/alt에 manual-only hero 표현 금지
  const AUTO01_IDS = ['IMG-025', 'IMG-030', 'IMG-031'];
  const MANUAL_ONLY = /리드아웃|readout|sounder|수동\s*프로브|manual\s*probe|현장\s*판독/i;
  const AUTO_CHAIN = /비교|inset|AUTO|IPI|로거|logger|datalogger|well\s*cap|junction|vented|submersible|필터/i;

  if (AUTO01_IDS.includes(id) && reg.reviewGrade === 'PASS') {
    const assetLine = imagesJs.match(new RegExp(`'${id}':\\s*\\{[^}]+\\}`, 's'));
    const blob = (assetLine?.[0] || '') + (reg.notes || '');
    if (MANUAL_ONLY.test(blob) && !AUTO_CHAIN.test(blob)) {
      const msg = `${id}: AUTO-01 — caption/notes에 수동 probe·리드아웃 hero 표현, logger chain 누락`;
      if (STRICT) fail(msg);
      else warn(msg);
    }
  }
}

// 6–8: dictionary ↔ images.js
for (const id of dictSet) {
  const reg = registry[id];
  if (!imageIdsInJs.includes(id)) {
    if (reg?.status === 'pending') {
      warn(`${id}: dictionary 참조 — PNG·images.js 없음 (히어로 차단됨, 예상)`);
    } else {
      fail(`dictionary imageId ${id}가 images.js에 없음`);
    }
  } else if (reg?.status === 'pending') {
    fail(`${id}: PNG·검수 대기인데 images.js에 포함됨`);
  }
}

// rejected folder scan
const rejectedDir = join(ROOT, 'assets', 'images', 'technology', 'rejected');
if (existsSync(rejectedDir)) {
  for (const f of readdirSync(rejectedDir)) {
    const m = f.match(/^(IMG-\d{3})/);
    if (m && dictSet.has(m[1])) fail(`${m[1]}: rejected 폴더에 있으나 dictionary 참조`);
  }
}

// Registry entries without canonical WebP (except pending)
const imgDir = join(ROOT, 'assets', 'images', 'technology');
const webpIds = new Set(
  readdirSync(imgDir)
    .filter((f) => /^IMG-\d{3}_/.test(f) && f.endsWith('.webp'))
    .map((f) => f.match(/^(IMG-\d{3})/)[1])
);
for (const [id, reg] of Object.entries(registry)) {
  if (reg.status === 'rejected' && webpIds.has(id)) {
    fail(`${id}: rejected인데 technology/ 루트에 PNG·WebP 잔존`);
  }
  if (reg.status === 'reviewed' && !webpIds.has(id)) {
    fail(`${id}: reviewed인데 canonical WebP 없음`);
  }
}

console.log('---');
if (REWORK_PENDING_OK) {
  console.log('rework-pending-ok: requiresReaudit → WARN (배포 전 verify:local 필수)');
}
console.log(`images.js: ${imageIdsInJs.length}, dictionary refs: ${dictSet.size}, errors: ${errors}, warnings: ${warnings}`);

if (errors) process.exit(1);
if (STRICT && warnings && !REWORK_PENDING_OK) process.exit(1);
ok('audit-technology-images');
process.exit(0);
