/**
 * dictionary imageId ↔ SPA 콘텐츠 히어로 ↔ SEO 정적 페이지 일치 검증.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getAllContentNodeIds, getNode, nodePathSeo } from '../js/technology/dictionary.js';
import { getContentForNode } from '../js/technology/content-data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SKIP = new Set(['sensors/inclinometer', 'intro']);

let failed = 0;

for (const id of getAllContentNodeIds()) {
  const node = getNode(id);
  const imageId = node?.imageId;
  if (!imageId || SKIP.has(id)) continue;

  const content = getContentForNode(id);
  const hero = content?.heroImage;
  if (hero && !hero.placeholder) {
    const src = String(hero.fallback || hero.src || '');
    if (!src.includes(imageId)) {
      failed++;
      console.log('FAIL SPA', id, 'expected', imageId, 'got', src || '(empty)');
    }
  }

  const rel = nodePathSeo(id).replace(/^\//, '') + 'index.html';
  const path = join(root, rel);
  if (!existsSync(path)) continue;

  const html = readFileSync(path, 'utf8');
  if (hero && !hero.placeholder && !html.includes(imageId)) {
    failed++;
    console.log('FAIL SEO', id, 'expected', imageId, 'in', rel);
  }
}

if (failed) {
  console.error(`validate-heroes: ${failed} mismatch(es)`);
  process.exit(1);
}
console.log('validate-heroes: OK (SPA + SEO)');
