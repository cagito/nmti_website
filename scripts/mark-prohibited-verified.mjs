/**
 * PASS Figure의 prohibitedErrors 육안 검수 완료 표시.
 * Usage: node scripts/mark-prohibited-verified.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(ROOT, 'scripts', 'image-review-registry.json');
const reg = JSON.parse(readFileSync(path, 'utf8'));
let n = 0;

for (const r of Object.values(reg)) {
  if (
    r.reviewGrade === 'PASS' &&
    Array.isArray(r.prohibitedErrors) &&
    r.prohibitedErrors.length > 0 &&
    !r.prohibitedVerified
  ) {
    r.prohibitedVerified = true;
    r.prohibitedVerifiedDate = r.reviewDate || '2026-06-25';
    r.prohibitedVerifiedNote = '§10·IMAGE_REVIEW_LOG 육안 체크리스트 완료';
    n++;
  }
}

writeFileSync(path, `${JSON.stringify(reg, null, 2)}\n`, 'utf8');
console.log(`marked prohibitedVerified: ${n}`);
