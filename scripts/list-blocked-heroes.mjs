#!/usr/bin/env node
/**
 * SPA 「출판 품질 개선 중」 hero 목록 — requiresReaudit / wireframeReplace
 * Usage: node scripts/list-blocked-heroes.mjs [--json]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(
  readFileSync(join(root, 'scripts', 'image-review-registry.json'), 'utf8'),
);
const imagesJs = readFileSync(join(root, 'js', 'technology', 'images.js'), 'utf8');

const jsonOut = process.argv.includes('--json');
const assetIds = new Set(
  [...imagesJs.matchAll(/'IMG-\d{3}'/g), ...imagesJs.matchAll(/"IMG-\d{3}"/g)].map((m) =>
    m[0].slice(1, -1),
  ),
);

function nodeHeroes() {
  const dictPath = join(root, 'js', 'technology', 'dictionary.js');
  const src = readFileSync(dictPath, 'utf8');
  const out = [];
  const re = /'([^']+)':\s*\{[^}]*?imageId:\s*'(IMG-\d{3})'/gs;
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({ nodeId: m[1], imageId: m[2] });
  }
  return out;
}

const heroes = nodeHeroes();
const blocked = [];

for (const [id, reg] of Object.entries(registry)) {
  if (!reg?.hero) continue;
  const gate = reg.requiresReaudit === true || reg.wireframeReplace === true;
  if (!gate) continue;
  const nodes = heroes.filter((h) => h.imageId === id);
  blocked.push({
    imageId: id,
    title: reg.title || id,
    requiresReaudit: reg.requiresReaudit === true,
    wireframeReplace: reg.wireframeReplace === true,
    productionMethod: reg.productionMethod,
    hasWebp: assetIds.has(id),
    nodeIds: nodes.map((n) => n.nodeId),
  });
}

blocked.sort((a, b) => a.imageId.localeCompare(b.imageId));

if (jsonOut) {
  console.log(JSON.stringify({ count: blocked.length, heroes: blocked }, null, 2));
  process.exit(0);
}

console.log(`\n차단 hero ${blocked.length}건 (requiresReaudit / wireframeReplace)\n`);
console.log('ID      WebP  nodeId');
console.log('─'.repeat(72));
for (const h of blocked) {
  const nodes = h.nodeIds.length ? h.nodeIds.join(', ') : '(dictionary hero 미매핑)';
  console.log(`${h.imageId}  ${h.hasWebp ? 'Y' : 'N'}   ${nodes}`);
}
console.log(`\nW1 P0: IMG-002 · IMG-096 · IMG-004`);
console.log(`등록: npm run rework:done -- --id IMG-002 --input assets/.../file.webp --reviewer "검수자"\n`);
