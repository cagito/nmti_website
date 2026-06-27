/**
 * Phase Z — 외부 ZIP 신규 심각 10종 registry 플래그
 * Usage: node scripts/patch-registry-phase-z.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

runLocked('registry', 'patch-registry-phase-z', () => {
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const PATCHES = {
  'IMG-008': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-01',
    note: '외부 ZIP — 라이닝 연속 센서 튜브 표현. REGENERATE. docs/77 Phase Z-1a',
    prohibited: ['라이닝 연속 센서 튜브형 내공변위', 'Kit가 전체 변형 프로파일 자동 산정']
  },
  'IMG-009': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-02',
    note: '외부 ZIP — 숏크리트 응력계 공중 부유. MAJOR_FIX. docs/77 Phase Z-2a',
    prohibited: ['숏크리트·변형률계 공중 부유 아이콘']
  },
  'IMG-015': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-03',
    note: '외부 ZIP — 확정 원호 활동면·3~5m 고정값. REGENERATE. docs/77 Phase Z-1b',
    prohibited: ['확정 원호 활동면', '활동면 아래 3~5m 일반값']
  },
  'IMG-032': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-04',
    note: '외부 ZIP — 연장봉 상단=기준점. REGENERATE. docs/77 Phase Z-1c',
    prohibited: ['연장봉 상단을 기준점으로 표기', '측정점·안정 기준점 미분리']
  },
  'IMG-034': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-05',
    note: '외부 ZIP — 성토 하중·수평 토압 혼재. MAJOR_FIX. docs/77 Phase Z-2b',
    prohibited: ['성토 하중=토압계 측정값', 'q·σh 미분리']
  },
  'IMG-041': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-06',
    note: '외부 ZIP — 가속도·진동속도 단위 혼재. MAJOR_FIX. docs/77 Phase Z-2c',
    prohibited: ['가속도(m/s² 또는 mm/s) 혼합 표기']
  },
  'IMG-043': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-07',
    note: '외부 ZIP — 기준국→이동국 시준 점선. MAJOR_FIX. docs/77 Phase Z-2d',
    prohibited: ['GNSS 기준국이 이동국 직접 시준', '광파 시준선 유사 점선']
  },
  'IMG-060': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-08',
    note: '외부 ZIP — 이상치 자동 제거·보간 흐름. MAJOR_FIX. docs/77 Phase Z-2e',
    prohibited: ['수집 직후 이상치 자동 삭제·보간', '원본 미보존 QC 흐름']
  },
  'IMG-078': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-09',
    note: '외부 ZIP — 두부 하중계=전체 축력. REGENERATE. docs/77 Phase Z-1d',
    prohibited: ['두부 하중=P 전체 록볼트 축력', '축력분포·변형률계 미구분']
  },
  'IMG-080': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-10',
    note: '외부 ZIP — 플랜지 1점 SG=전체 응력. REGENERATE. docs/77 Phase Z-1e',
    prohibited: ['플랜지 일부 변형률만으로 전체 응력 대표', '내외측·다점 계측 미표시']
  }
};

for (const [id, patch] of Object.entries(PATCHES)) {
  const reg = registry[id];
  if (!reg) {
    console.error('Missing', id);
    process.exit(1);
  }
  reg.requiresReaudit = true;
  reg.auditPriority = patch.auditPriority;
  reg.notes = patch.note;
  reg.zipAuditId = patch.zipAud;
  reg.prohibitedErrors = [...new Set([...(reg.prohibitedErrors || []), ...patch.prohibited])];
  reg.prohibitedVerified = false;
  delete reg.prohibitedVerifiedDate;
  delete reg.prohibitedVerifiedNote;
}

atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log('Patched', Object.keys(PATCHES).length, 'registry entries for Phase Z');
});
