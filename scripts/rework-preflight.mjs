/**
 * PNG/WebP 등록 전 검증 (해상도·canonical·redline·프롬프트 소스)
 * Usage: node scripts/rework-preflight.mjs --id IMG-002
 *        node scripts/rework-preflight.mjs --id IMG-002 --input path/to.png|webp
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createRequire } from 'module';
import {
  REWORK_ROOT,
  REDLINE_CANONICAL,
  REDLINE_SUPPLEMENT,
  REDLINES_DIR,
  PHASES,
} from './lib/rework-phases.mjs';
import { getQuickstart } from './lib/rework-quickstarts.mjs';
import { loadPromptBody, resolvePromptSource } from './lib/rework-prompt-index.mjs';

const require = createRequire(import.meta.url);
let sizeOf;
try {
  sizeOf = require('image-size');
} catch {
  sizeOf = null;
}

const HERO_MIN_W = 1920;
const HERO_MIN_H = 1080;

const idArg = (() => {
  const i = process.argv.indexOf('--id');
  if (i >= 0) return process.argv[i + 1]?.toUpperCase();
  return process.argv.find((a) => /^IMG-\d{3}$/i.test(a))?.toUpperCase() || null;
})();
const inputArg = (() => {
  const i = process.argv.indexOf('--input');
  return i >= 0 ? process.argv[i + 1] : null;
})();

if (!idArg) {
  console.error('Usage: rework:preflight -- --id IMG-### [--input path/to.png]');
  process.exit(1);
}

const id = idArg;
const registryPath = join(REWORK_ROOT, 'scripts', 'image-review-registry.json');
const canonicalPath = join(REWORK_ROOT, 'scripts', 'canonical-image-webp.json');
const policyPath = join(REWORK_ROOT, 'scripts', 'figure-production-policy.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const canonical = JSON.parse(readFileSync(canonicalPath, 'utf8'));
const policy = JSON.parse(readFileSync(policyPath, 'utf8'));

const reg = registry[id];
const fig = policy.figures?.[id];
const phase = PHASES.find((p) => p.ids.includes(id));
const canonName = canonical[id];
const sourcePath = canonName
  ? (() => {
      const base = join(REWORK_ROOT, 'assets', 'images', 'technology', 'source');
      const webp = join(base, canonName.replace(/\.png$/i, '.webp'));
      const png = join(base, canonName);
      if (existsSync(webp)) return webp;
      if (existsSync(png)) return png;
      return png;
    })()
  : null;
const inputPath = inputArg || sourcePath;

const errors = [];
const warns = [];
const ok = [];

if (!reg) errors.push('registry에 없음');
if (!fig) errors.push('figure-production-policy에 없음');
if (!phase) warns.push('rework W1~W11 목록 밖 ID');

if (!canonName) errors.push('canonical-image-webp.json에 파일명 없음');
else ok.push(`canonical: ${canonName}`);

const rl = REDLINE_CANONICAL[id];
if (!rl) errors.push('redline 정본 매핑 없음');
else {
  const rlPath = join(REDLINES_DIR, rl);
  if (!existsSync(rlPath)) errors.push(`redline 파일 없음: ${rl}`);
  else ok.push(`redline: ${rl}`);
  const sup = REDLINE_SUPPLEMENT[id];
  if (sup) {
    const supPath = join(REDLINES_DIR, sup);
    if (!existsSync(supPath)) warns.push(`보조 redline 없음: ${sup}`);
    else ok.push(`redline 보조: ${sup}`);
  }
}

const promptSrc = resolvePromptSource(id);
const { body } = loadPromptBody(id);
if (!body) errors.push('복붙 프롬프트 블록 추출 실패');
else ok.push(`prompt: ${promptSrc?.file || '—'}`);

if (!inputPath) warns.push('입력 자산 경로 미지정');
else if (!existsSync(inputPath)) {
  warns.push(`자산 없음: ${inputPath.replace(REWORK_ROOT + '/', '')}`);
} else {
  ok.push(`input: ${inputPath.replace(REWORK_ROOT + '/', '')}`);
  if (sizeOf) {
    const dim = sizeOf(inputPath);
    const isHero = fig?.hero ?? reg?.hero;
    ok.push(`크기: ${dim.width}×${dim.height}`);
    if (isHero && (dim.width < HERO_MIN_W || dim.height < HERO_MIN_H)) {
      errors.push(`hero 해상도 부족: ${dim.width}×${dim.height} < ${HERO_MIN_W}×${HERO_MIN_H}`);
    }
  } else {
    warns.push('image-size 미설치 — 해상도 검증 생략');
  }
}

console.log(`\n── ${id} preflight · ${reg?.title || ''}\n`);

for (const line of ok) console.log(`  OK   ${line}`);
for (const line of warns) console.log(`  WARN ${line}`);
for (const line of errors) console.log(`  FAIL ${line}`);

if (errors.length) {
  console.log('\n등록 불가 — 오류 수정 후 재실행');
  process.exit(1);
}

console.log(`\n퀵스타트: ${getQuickstart(id)}`);
if (phase) {
  console.log(`서명: npm run ${phase.sign} -- --id ${id}`);
}
if (inputPath && existsSync(inputPath)) {
  const rel = inputPath.replace(/\\/g, '/').replace(REWORK_ROOT + '/', '').replace(/^.*?(assets\/)/, 'assets/');
  console.log(`\n다음:\n  npm run rework:done -- --id ${id} --input ${rel} --reviewer "검수자"`);
} else if (canonName) {
  console.log(`\n다음: WebP/PNG → assets/images/technology/source/${canonName.replace(/\.png$/i, '.webp')} (또는 ${canonName})`);
  console.log(`  npm run rework:canonical -- --id ${id}`);
  console.log(`  npm run rework:preflight -- --id ${id}  (저장 후 재검증)`);
}

console.log('');
process.exit(warns.length ? 0 : 0);
