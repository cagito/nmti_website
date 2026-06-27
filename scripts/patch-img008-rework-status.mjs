import fs from 'node:fs';

const REGISTRY_PATH = 'scripts/image-review-registry.json';
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

if (!registry['IMG-008']) {
  throw new Error('IMG-008 not found in image-review-registry.json');
}

registry['IMG-008'] = {
  ...registry['IMG-008'],
  status: 'reviewed',
  reviewGrade: 'REGENERATE',
  requiresReaudit: true,
  reviewer: 'publication-recheck',
  reviewDate: '2026-06-27',
  notes: [
    '출판 부적합 재검수: docs/125 + docs/126 기준.',
    '건축한계 내부 미계측, P1~P5 상부 아치 개방 체인, Envelope 침범 금지.',
    '신규 PNG/WebP 확정 전까지 출판 PASS로 간주하지 않음.'
  ].join(' '),
  visualReview: {
    grade: 'REGENERATE',
    reviewer: 'publication-recheck',
    date: '2026-06-27',
    checklist: 'docs/126 IMG008-V1~V8',
    notes: '디자인/출판 게이트 재검수 필요: P1~P5, Envelope 외측, 노반 미계측, 200% 라벨 선명도.'
  },
  reworkPlan: 'docs/125-IMG-008-터널-내공변위-출판부적합-재검수-구현계획.md',
  designRedline: 'docs/126-IMG-008-터널-내공변위-디자인-redline-및-생성프롬프트.md'
};

fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
console.log('Patched IMG-008 as REGENERATE / requiresReaudit=true');
