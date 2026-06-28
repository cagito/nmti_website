/**
 * 재작도 Figure canonical source 경로 출력
 * Usage: npm run rework:canonical -- --id IMG-002
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT } from './lib/rework-phases.mjs';

const id = (() => {
  const i = process.argv.indexOf('--id');
  if (i >= 0) return process.argv[i + 1]?.toUpperCase();
  return process.argv.find((a) => /^IMG-\d{3}$/i.test(a))?.toUpperCase() || null;
})();

if (!id) {
  console.error('Usage: rework:canonical -- --id IMG-###');
  process.exit(1);
}

const canonicalPath = join(REWORK_ROOT, 'scripts', 'canonical-image-webp.json');
const canonical = JSON.parse(readFileSync(canonicalPath, 'utf8'));
const name = canonical[id];

if (!name) {
  console.error(`${id}: canonical-image-webp.json에 없음`);
  process.exit(1);
}

const rel = `assets/images/technology/source/${name}`;
console.log(rel);
console.log(`# PNG 저장 후: npm run rework:done -- --id ${id} --input ${rel} --reviewer "검수자"`);
