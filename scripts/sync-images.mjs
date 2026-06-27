/**
 * WebP-only SPA sync — registry/seed 없이 images.js만 갱신
 * Usage: npm run sync:images
 */
import { spawnSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'assets', 'images', 'technology');
const imagesJs = join(root, 'js', 'technology', 'images.js');

function runNode(script, extra = []) {
  const r = spawnSync('node', [script, ...extra], { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('\n── sync:images (WebP → images.js) ──\n');
const webpCount = readdirSync(imgDir).filter((f) => f.endsWith('.webp')).length;
const pngRoot = readdirSync(imgDir).filter((f) => f.endsWith('.png')).length;
console.log(`technology/: ${webpCount} webp · ${pngRoot} png\n`);

runNode('scripts/generate-image-assets.mjs', ['--no-lock']);

const js = readFileSync(imagesJs, 'utf8');
const entries = (js.match(/'IMG-\d{3}':/g) || []).length;
let broken = 0;
for (const m of js.matchAll(/webp:\s*'([^']+)'/g)) {
  if (!existsSync(join(root, m[1]))) broken++;
}
if (!entries || broken) {
  console.error(`FAIL: entries=${entries} broken=${broken}`);
  process.exit(1);
}
console.log(`\n✓ images.js ${entries} entries · broken 0\n`);
