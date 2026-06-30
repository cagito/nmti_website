/**
 * Figure prompt CANONICAL_STATUS vs registry reviewGrade consistency.
 * DOC-CANON-01 · docs/208
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REGISTRY = join(ROOT, 'scripts', 'image-review-registry.json');
const PROMPTS = join(
  ROOT,
  'ImageWorks',
  'NMTI_Engineering_Image_Prompt_Package_v1',
  'prompts'
);
const STRICT = process.argv.includes('--strict');

/** @type {Record<string, { reviewGrade?: string; requiresReaudit?: boolean }>} */
const registry = JSON.parse(readFileSync(REGISTRY, 'utf8'));

const WATCH = [
  { id: 'IMG-002', prompt: 'IMG-002_흙막이_벽체_계측_배치도.md' },
  { id: 'IMG-004', prompt: 'IMG-004_어스앵커_하중계_설치_개념도.md' },
  { id: 'IMG-001', prompt: 'IMG-001_가시설_계측_전체_개념도.md' },
  { id: 'IMG-005', prompt: 'IMG-005_주변건물_균열_경사_계측도.md' },
  { id: 'IMG-012', prompt: 'IMG-012_교각_변위_경사_계측도.md' },
  { id: 'IMG-013', prompt: 'IMG-013_교량_기초_침하_계측도.md' },
  { id: 'IMG-015', prompt: 'IMG-015_사면_계측_전체_개념도.md' },
  { id: 'IMG-016', prompt: 'IMG-016_원호활동면_계측_해석도.md' },
  { id: 'IMG-090', prompt: 'IMG-090_사면_구조물_변위_계측_개념도.md' },
  { id: 'IMG-096', prompt: 'IMG-096_주변지반_계측_설치_대표_단면도.md' }
];

/** @type {string[]} */
const errors = [];

for (const { id, prompt } of WATCH) {
  const reg = registry[id];
  const path = join(PROMPTS, prompt);
  if (!reg) {
    errors.push(`${id}: missing registry entry`);
    continue;
  }
  if (!existsSync(path)) {
    errors.push(`${id}: prompt missing ${prompt}`);
    continue;
  }
  const text = readFileSync(path, 'utf8');
  if (!text.includes('CANONICAL_STATUS')) {
    errors.push(`${id}: prompt lacks CANONICAL_STATUS block`);
  }
  if (reg.reviewGrade === 'PASS' && /판정:\s*\*\*REGENERATE/i.test(text)) {
    errors.push(`${id}: prompt has active REGENERATE but registry PASS`);
  }
  if (reg.reviewGrade === 'PASS' && reg.requiresReaudit === true) {
    errors.push(`${id}: registry PASS but requiresReaudit=true`);
  }
  const statusMatch = text.match(/현재 판정\*\*\s*\|\s*PASS/i);
  if (reg.reviewGrade === 'PASS' && !statusMatch) {
    errors.push(`${id}: CANONICAL_STATUS missing PASS row`);
  }
}

if (errors.length) {
  console.error(`validate-figure-status: FAIL — ${errors.length}`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(STRICT ? 1 : 0);
}

console.log(`validate-figure-status: OK (${WATCH.length} figures)`);
