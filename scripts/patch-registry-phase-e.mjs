/**
 * Phase E — 운영모드 FT-C 출판 검수 3종 (선택 · W11)
 * Usage: node scripts/patch-registry-phase-e.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

const PATCHES = {
  'IMG-094': {
    auditPriority: 'P3',
    phaseE: 'E-1',
    note: 'Phase E — 상시 모드 출판 검수. MODE-NORM-01 · ai-reviewed 필수 · docs/115 §1',
    prohibited: [
      '시계·달력 아이콘만',
      '뇌·홀로그램·사이버 매트릭스',
      '토목 단면 hero',
    ],
  },
  'IMG-095': {
    auditPriority: 'P3',
    phaseE: 'E-1',
    note: 'Phase E — 실시간·이벤트 모드 출판 검수. MODE-RT-01 · docs/115 §2',
    prohibited: [
      '번개·폭발 CG',
      '뇌·로봇',
      '상시 모드 flat trend만',
    ],
  },
  'IMG-102': {
    auditPriority: 'P3',
    phaseE: 'E-1',
    note: 'Phase E — 경보·알림 상태 출판 검수. ALARM-UI-01 · ≠ SF 경고창 · docs/115 §3',
    prohibited: [
      'SF 영화식 경고 팝업',
      '네온·홀로그램',
      '뇌·추상 빨간 알림 아트',
    ],
  },
};

runLocked('registry', 'patch-registry-phase-e', () => {
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

  for (const [id, patch] of Object.entries(PATCHES)) {
    const reg = registry[id];
    if (!reg) {
      console.error('Missing', id);
      process.exit(1);
    }
    reg.requiresReaudit = true;
    reg.auditPriority = patch.auditPriority;
    reg.phaseE = patch.phaseE;
    reg.notes = patch.note;
    reg.prohibitedErrors = [...new Set([...(reg.prohibitedErrors || []), ...patch.prohibited])];
    reg.prohibitedVerified = false;
    delete reg.prohibitedVerifiedDate;
    delete reg.prohibitedVerifiedNote;
  }

  atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
  console.log('Patched', Object.keys(PATCHES).length, 'registry entries for Phase E (optional W11)');
});
