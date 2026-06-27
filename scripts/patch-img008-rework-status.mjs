import fs from 'node:fs';

const REGISTRY_PATH = 'scripts/image-review-registry.json';
const FULL_WEBP = 'assets/images/technology/IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.webp';
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
  webp: FULL_WEBP,
  canonicalImage: FULL_WEBP,
  notes: [
    '출판 재검수: docs/125 + docs/126 기준.',
    '기준: 터널 전단면 내공변위계.',
    '전단면 대표 측점과 대표 측선을 반영한다.',
    '운영 이미지는 풀네임 WebP 기준: ' + FULL_WEBP
  ].join(' '),
  visualReview: {
    grade: 'REGENERATE',
    reviewer: 'publication-recheck',
    date: '2026-06-27',
    checklist: 'docs/126 IMG008-F1~F8',
    notes: '전단면 내공변위계 기준으로 재검수 필요.'
  },
  reworkPlan: 'docs/125-IMG-008-터널-내공변위-출판부적합-재검수-구현계획.md',
  designRedline: 'docs/126-IMG-008-터널-내공변위-디자인-redline-및-생성프롬프트.md'
};

fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
console.log('Patched IMG-008 status for full-section convergence');
