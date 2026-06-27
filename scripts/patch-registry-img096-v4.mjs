/**
 * IMG-096 v4 — 옹벽 삭제 · SOE-SURR-01 registry 플래그
 * Usage: node scripts/patch-registry-img096-v4.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

const ADD_PROHIBITED = [
  '옹벽·옹벽 기초·옹벽 배면 토압 (SOE-SURR-01)',
  'Sand Mat·침하판 중심 성토부 연상 (MIX-019)',
  '데이터 흐름도·서버·모바일·알람 UI',
  '굴착측과 배면 G.W.L 동일 연속 표시',
];

runLocked('registry', 'patch-registry-img096-v4', () => {
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  const entry = registry['IMG-096'];
  if (!entry) throw new Error('IMG-096 not found');

  entry.requiresReaudit = true;
  entry.prohibitedVerified = false;
  entry.prohibitedVerifiedDate = null;
  entry.prohibitedVerifiedNote = null;
  entry.auditPriority = 'P0';
  entry.notes =
    'v4 SOE-SURR-01 — 옹벽·Sand Mat 삭제. docs/57·110·redline v4. PNG 재작성 전 requiresReaudit.';

  const existing = new Set(entry.prohibitedErrors || []);
  for (const p of ADD_PROHIBITED) existing.add(p);
  entry.prohibitedErrors = [...existing];

  if (entry.visualReview) {
    entry.visualReview.notes = 'v4 기준 미검수 — 옹벽·성토 혼입 제거 후 재작도';
  }

  atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
  console.log('IMG-096 → requiresReaudit: true (v4 SOE-SURR-01)');
});
