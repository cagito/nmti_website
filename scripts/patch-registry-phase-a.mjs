/**
 * Phase A — W1 P0 registry 플래그 (002·096·004)
 * Usage: node scripts/patch-registry-phase-a.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

const PATCHES = {
  'IMG-002': {
    auditPriority: 'P0',
    note: 'Phase A W1 — 흙막이 대표 단면 v5 redline 미검수. REGENERATE. docs/52 §12 · ANC-CLOCK',
    prohibited: [
      '앵커 LC ≠ 굴착측 두부',
      'IPI·지하수위·간극수압 배면 천공 위반',
      '⑦ 지표침하 측점에 지표침하계 라벨',
      '진동현식 라벨',
    ],
  },
  'IMG-096': {
    auditPriority: 'P0',
    note: 'Phase A W1 — 가시설 주변지반 v4 REGENERATE. MIX·옹벽삭제 · docs/57 · docs/110',
    prohibited: [
      '옹벽·옹벽 기초·옹벽 토압',
      'Sand Mat·침하판 중심(019 혼동)',
      '지표침하핀에 지표침하계 라벨',
      '잠재 슬립면 원호',
    ],
  },
  'IMG-004': {
    auditPriority: 'P0',
    note: 'Phase A W1 — 어스앵커 하중계 v2 redline 미검수. REGENERATE. docs/54 §15',
    prohibited: [
      '하중계 지반·정착장 내부',
      '자유장 중간 하중계',
      '앵커 시계 3시/9시 오류',
    ],
  },
};

runLocked('registry', 'patch-registry-phase-a', () => {
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

  for (const [id, patch] of Object.entries(PATCHES)) {
    const reg = registry[id];
    if (!reg) {
      console.error('Missing', id);
      process.exit(1);
    }
    reg.requiresReaudit = true;
    reg.auditPriority = patch.auditPriority;
    reg.notes = patch.note;
    reg.prohibitedErrors = [...new Set([...(reg.prohibitedErrors || []), ...patch.prohibited])];
    reg.prohibitedVerified = false;
    delete reg.prohibitedVerifiedDate;
    delete reg.prohibitedVerifiedNote;
  }

  atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
  console.log('Patched', Object.keys(PATCHES).length, 'registry entries for Phase A (W1 P0)');
});
