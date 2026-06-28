/**
 * Validate docs/image-knowledge topic files (13-section template).
 * Usage: node scripts/validate-image-knowledge.mjs [--strict]
 */
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'docs', 'image-knowledge');
const STRICT = process.argv.includes('--strict');

const REQUIRED_SECTIONS = [
  '## 1. Figure 목적',
  '## 2. 기술 대상',
  '## 3. 설치 또는 표현 가능 구간',
  '## 4. 설치 제한 구간 / 미표현 구간',
  '## 5. 반드시 그릴 요소',
  '## 6. 절대 그리면 안 되는 요소',
  '## 7. 적합한 Figure 유형',
  '## 8. 추천 이미지 구성',
  '## 9. 라벨 용어',
  '## 10. 오해하기 쉬운 표현',
  '## 11. Cursor Agent 도면 지시',
  '## 12. 참고 PDF 근거',
  '## 13. 이미지 생성 전 체크리스트'
];

const CORE_FILES = [
  '00-공통-이미지-작성-원칙.md',
  'source-index.md',
  'README.md'
];

let errors = 0;

for (const f of CORE_FILES) {
  const p = join(DIR, f);
  if (!existsSync(p)) {
    console.error(`MISSING core: ${f}`);
    errors++;
  }
}

const topics = readdirSync(DIR)
  .filter((f) => /^\d{2}-.+\.md$/.test(f) && f !== '00-공통-이미지-작성-원칙.md')
  .sort();

if (!topics.length) {
  console.error('MISSING: at least one NN-주제.md topic file');
  errors++;
}

for (const f of topics) {
  const text = readFileSync(join(DIR, f), 'utf8');
  for (const sec of REQUIRED_SECTIONS) {
    if (!text.includes(sec)) {
      console.error(`${f}: missing section ${sec}`);
      errors++;
    }
  }
  if (!text.includes('book/')) {
    console.error(`${f}: no book/ PDF citation in §12`);
    errors++;
  }
  if (!text.includes('- [ ]')) {
    console.error(`${f}: §13 checklist items missing`);
    errors++;
  }
}

if (errors) {
  console.error(`validate-image-knowledge: FAIL (${errors} issues)`);
  process.exit(STRICT ? 1 : 0);
}

console.log(`validate-image-knowledge: OK (${topics.length} topic files)`);
