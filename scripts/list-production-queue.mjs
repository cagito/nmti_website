#!/usr/bin/env node
/**
 * 전체 이미지 제작 큐 — requiresReaudit 우선순위 (W1→W11)
 * Usage: node scripts/list-production-queue.mjs [--json] [--hero-only]
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PHASES, REDLINE_CANONICAL } from './lib/rework-phases.mjs';
import { getQuickstart } from './lib/rework-quickstarts.mjs';
import { hasSourceAsset } from './lib/rework-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(
  readFileSync(join(root, 'scripts', 'image-review-registry.json'), 'utf8'),
);
const dictSrc = readFileSync(join(root, 'js', 'technology', 'dictionary.js'), 'utf8');
const heroOnly = process.argv.includes('--hero-only');
const jsonOut = process.argv.includes('--json');

const nodeByImage = new Map();
const re = /'([^']+)':\s*\{[^}]*?imageId:\s*'(IMG-\d{3})'/gs;
let m;
while ((m = re.exec(dictSrc)) !== null) {
  const list = nodeByImage.get(m[2]) || [];
  list.push(m[1]);
  nodeByImage.set(m[2], list);
}

const seen = new Set();
const queue = [];

function push(id, week, phase) {
  if (seen.has(id)) return;
  seen.add(id);
  const reg = registry[id];
  if (!reg || reg.requiresReaudit !== true) return;
  if (heroOnly && !reg.hero) return;
  const src = hasSourceAsset(id);
  queue.push({
    priority: queue.length + 1,
    week,
    phase,
    id,
    title: reg.title || '',
    hero: !!reg.hero,
    hasSource: src.ok,
    nodes: nodeByImage.get(id) || [],
    redline: REDLINE_CANONICAL[id] || null,
    quickstart: getQuickstart(id),
  });
}

for (const p of PHASES) {
  for (const id of p.ids) push(id, p.week, p.phase);
}

for (const [id, reg] of Object.entries(registry)) {
  if (reg.requiresReaudit === true) push(id, '—', '—');
}

if (jsonOut) {
  console.log(JSON.stringify({ count: queue.length, queue }, null, 2));
  process.exit(0);
}

console.log(`\n이미지 제작 큐 — reaudit ${queue.length}건${heroOnly ? ' (hero만)' : ''}\n`);
console.log('#   week   id       hero  src  node / title');
console.log('─'.repeat(88));
for (const q of queue) {
  const nodes = q.nodes.length ? q.nodes[0] : '(—)';
  const src = q.hasSource ? 'Y' : 'N';
  const hero = q.hero ? 'Y' : 'n';
  console.log(
    `${String(q.priority).padStart(2)}  ${q.week.padEnd(5)}  ${q.id}  ${hero}    ${src}   ${nodes}`,
  );
}
console.log(`\nW1: npm run rework:w1-pack`);
console.log(`W2: npm run rework:phase-pack -- --phase AA --pending-only`);
console.log(`등록: npm run rework:done -- --id IMG-### --input assets/.../file.webp --reviewer "검수자"\n`);
