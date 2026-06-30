/**
 * IMG-043 GNSS — book/GNSS.pdf concept alignment (ZIP-AUD-07 · 07 guide).
 * PDF 키워드는 `npm run audit:book` · book 3단계 rule gate 보완.
 * Usage: node scripts/audit-img043-gnss.mjs
 */
import { existsSync, readFileSync } from 'fs';
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

const CANONICAL_WEBP = 'IMG-043_GNSS-변위-계측-개념도_기준국이동국서버연결.webp';

if (!existsSync(join(ROOT, 'assets/images/technology', CANONICAL_WEBP))) {
  add(`missing canonical WebP: ${CANONICAL_WEBP}`);
}

const reg = JSON.parse(read('scripts/image-review-registry.json'))['IMG-043'];
if (!reg || reg.reviewGrade !== 'PASS' || reg.status !== 'reviewed') {
  add('IMG-043 registry must be reviewed PASS');
} else {
  const note = reg.notes || '';
  for (const kw of ['기준국', '이동국', 'RTK', '서버']) {
    if (!note.includes(kw) && !(kw === '서버' && note.includes('LTE'))) {
      if (kw === '서버' && !note.includes('서버') && !note.includes('LTE→')) {
        add(`registry notes missing ${kw}`);
      } else if (kw !== '서버' && !note.includes(kw)) {
        add(`registry notes missing ${kw}`);
      }
    }
  }
}

const prompt = read(
  'ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-043_GNSS_변위_계측_개념도.md'
);

for (const term of ['기준국', '이동국', 'RTK', '중앙 서버', '3D 변위', 'GNSS.pdf']) {
  if (!prompt.includes(term)) add(`prompt missing "${term}"`);
}

if (!/프리즘\s*X|프리즘·/.test(prompt)) {
  add('prompt must forbid prism (광파 혼동)');
}

const content = read('js/technology/content-data.js');
const seoPath = join(ROOT, 'technology/sensors/gnss/index.html');
const corpus = content + (existsSync(seoPath) ? read('technology/sensors/gnss/index.html') : '');

if (!corpus.includes('/homepage/book/GNSS.pdf')) {
  add('sensors/gnss missing GNSS.pdf public link');
}

const guide = read('ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/07_GNSS_이미지_가이드.md');
if (!guide.includes('IMG-043')) add('07_GNSS guide must reference IMG-043');

if (reg?.reviewDoc && !/161-IMG-043|216-IMG-043/.test(reg.reviewDoc)) {
  add('registry reviewDoc should link docs/161 or docs/216 (GNSS 재생성 기록)');
}

if (issues.length) {
  console.log('audit-img043: FAIL', issues.length);
  issues.forEach((i) => console.log(' -', i));
  process.exit(1);
}
console.log('audit-img043: OK (GNSS · 기준국·이동국·RTK · IMG-043 v6)');
