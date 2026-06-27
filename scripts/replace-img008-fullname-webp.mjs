import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const CANONICAL_WEBP = 'assets/images/technology/IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.webp';
const REGISTRY_PATH = 'scripts/image-review-registry.json';

function usage() {
  console.log(`Usage:
  node scripts/replace-img008-fullname-webp.mjs <source-webp> [--build]

Example:
  node scripts/replace-img008-fullname-webp.mjs C:\\Users\\USER\\Downloads\\new-img008.webp --build

This script:
  1. validates source file is WebP
  2. copies it to ${CANONICAL_WEBP}
  3. patches IMG-008 registry status to REGENERATE / requiresReaudit=true
  4. optionally runs npm run build:images
`);
}

const args = process.argv.slice(2);
if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
  usage();
  process.exit(args.length < 1 ? 1 : 0);
}

const source = args[0];
const shouldBuild = args.includes('--build');

if (!fs.existsSync(source)) {
  throw new Error(`Source file not found: ${source}`);
}

const data = fs.readFileSync(source);
if (data.length < 12) {
  throw new Error('Source file is too small to be a valid WebP file');
}

const riff = data.subarray(0, 4).toString('ascii');
const webp = data.subarray(8, 12).toString('ascii');
if (riff !== 'RIFF' || webp !== 'WEBP') {
  throw new Error('Source file is not a valid WebP file (RIFF/WEBP signature mismatch)');
}

fs.mkdirSync(path.dirname(CANONICAL_WEBP), { recursive: true });
fs.copyFileSync(source, CANONICAL_WEBP);
console.log(`Copied WebP -> ${CANONICAL_WEBP}`);

if (fs.existsSync(REGISTRY_PATH)) {
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
    webp: CANONICAL_WEBP,
    canonicalImage: CANONICAL_WEBP,
    notes: [
      '출판 재검수: docs/125 + docs/126 기준.',
      '기준: 터널 전단면 내공변위계.',
      '전단면 대표 측점과 대표 측선을 반영한다.',
      `운영 이미지는 풀네임 WebP 기준: ${CANONICAL_WEBP}`
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
  console.log('Patched IMG-008 registry status');
} else {
  console.warn(`Skipped registry patch: ${REGISTRY_PATH} not found`);
}

if (shouldBuild) {
  console.log('Running npm run build:images ...');
  execFileSync('npm', ['run', 'build:images'], { stdio: 'inherit', shell: process.platform === 'win32' });
}

console.log('\nNext commands:');
console.log(`  git add ${CANONICAL_WEBP} ${REGISTRY_PATH} js/technology/images.js docs/IMAGE_REVIEW_LOG.md`);
console.log('  git commit -m "Replace IMG-008 full-section convergence WebP"');
console.log('  git push origin main');
