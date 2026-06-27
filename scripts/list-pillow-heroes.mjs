#!/usr/bin/env node
/**
 * Pillow hero — ai-reviewed 교체 대상 (노출 중·품질 낮음)
 * Usage: node scripts/list-pillow-heroes.mjs [--json]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { REDLINE_CANONICAL } from './lib/rework-phases.mjs';
import { getQuickstart } from './lib/rework-quickstarts.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(
  readFileSync(join(root, 'scripts', 'image-review-registry.json'), 'utf8'),
);
const dictSrc = readFileSync(join(root, 'js', 'technology', 'dictionary.js'), 'utf8');
const jsonOut = process.argv.includes('--json');

const nodeByImage = new Map();
const re = /'([^']+)':\s*\{[^}]*?imageId:\s*'(IMG-\d{3})'/gs;
let m;
while ((m = re.exec(dictSrc)) !== null) {
  const list = nodeByImage.get(m[2]) || [];
  list.push(m[1]);
  nodeByImage.set(m[2], list);
}

const heroes = [];
for (const [id, reg] of Object.entries(registry)) {
  if (reg.status === 'rejected') continue;
  if (!reg.hero || reg.productionMethod !== 'pillow') continue;
  heroes.push({
    id,
    title: reg.title || '',
    tier: reg.figureTier || '—',
    nodes: nodeByImage.get(id) || [],
    redline: REDLINE_CANONICAL[id] || null,
    quickstart: getQuickstart(id),
  });
}
heroes.sort((a, b) => a.id.localeCompare(b.id));

if (jsonOut) {
  console.log(JSON.stringify({ count: heroes.length, heroes }, null, 2));
  process.exit(0);
}

console.log(`\nPillow hero ${heroes.length}건 — ai-reviewed 교체 권장 (현재 webp 노출 중)\n`);
console.log('ID      tier   node / title');
console.log('─'.repeat(72));
for (const h of heroes) {
  const node = h.nodes[0] || '(—)';
  console.log(`${h.id}  ${(h.tier || '—').padEnd(5)}  ${node}`);
}
console.log('\n패키지: npm run rework:pillow-hero-pack');
console.log('등록: npm run rework:done -- --id IMG-### --input assets/.../file.webp --reviewer "검수자"\n');
