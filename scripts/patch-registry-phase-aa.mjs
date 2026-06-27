/**
 * Phase AA — 외부 ZIP 신규 심각 10종 (2차 묶음) registry 플래그
 * Usage: node scripts/patch-registry-phase-aa.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

runLocked('registry', 'patch-registry-phase-aa', () => {
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const PATCHES = {
  'IMG-016': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-11',
    note: '외부 ZIP 2차 — 최대변위 심도=활동면 1:1 단정. REGENERATE. docs/81 Phase AA-1a',
    prohibited: [
      '최대 변위 깊이 = 활동면 위치',
      '지중경사계 단독으로 원호활동면 확정',
      '추정선과 실측선 동일 의미',
    ],
  },
  'IMG-017': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-12',
    note: '외부 ZIP 2차 — 무한사면식↔프로파일 직결. REGENERATE. docs/81 Phase AA-1b',
    prohibited: [
      '무한사면 안정식으로 활동면 확정',
      '변위 최대지점 = 평면활동면 단정',
      '간극수압 U 단순 상향 화살표만',
    ],
  },
  'IMG-018': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-13',
    note: '외부 ZIP 2차 — 상관=인과 확정. MAJOR_FIX. docs/81 Phase AA-2a',
    prohibited: [
      '강우→지하수위→변위 단일 인과 확정',
      '고정 시간지연 일반값',
      '상관관계를 원인 확정으로 표기',
    ],
  },
  'IMG-020': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-14',
    note: '외부 ZIP 2차 — 침하판·기준점·압밀 단순화. MAJOR_FIX. docs/81 Phase AA-2b',
    prohibited: [
      '기준점을 성토 영향권 안에 배치',
      '침하판 상단을 기준점으로 표기',
      '간극수압계가 침하량 직접 측정',
    ],
  },
  'IMG-021': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-15',
    note: '외부 ZIP 2차 — 측방유동 판단 과도 단순. REGENERATE. docs/81 Phase AA-1c',
    prohibited: [
      '연약층 전체 균일 좌우 밀림',
      '침하계로 측방유동 측정',
      '지중경사계 안정층 근입 생략',
    ],
  },
  'IMG-025': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-16',
    note: '외부 ZIP 2차 — 누적변위=절대변위. MAJOR_FIX. docs/81 Phase AA-2c',
    prohibited: [
      '누적변위를 절대좌표 변위처럼 표현',
      '하부 기준점 무조건 고정 가정',
      '데이터로거를 센서 노드처럼 표현',
    ],
  },
  'IMG-027': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-17',
    note: '외부 ZIP 2차 — 그라우트·베이스 과신. MAJOR_FIX. docs/81 Phase AA-2d',
    prohibited: [
      '케이싱 내부 센서 구간을 그라우트로 막음',
      '베이스 절대고정=절대변위 산정',
      '안정층 근입 3~5m 일반 기준',
    ],
  },
  'IMG-037': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-18',
    note: '외부 ZIP 2차 — 균열폭만·전단단차회전 누락. MAJOR_FIX. docs/81 Phase AA-2e',
    prohibited: [
      '균열계로 3D 거동 전체 측정',
      '균열폭 변화=균열 길이 증가 동일 표기',
      '전단·단차·회전을 균열계로 대체',
    ],
  },
  'IMG-038': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-19',
    note: '외부 ZIP 2차 — 브라켓 무시·구조물 경사 단정. MAJOR_FIX. docs/81 Phase AA-2f',
    prohibited: [
      '유연 브라켓 위 센서 = 구조물 전체 경사',
      '브라켓 처짐을 기준면으로 표현',
      '1점 경사로 전체 기울기 단정',
    ],
  },
  'IMG-039': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-20',
    note: '외부 ZIP 2차 — 신축계·이음계·LVDT·균열계 혼합. REGENERATE. docs/81 Phase AA-1d',
    prohibited: [
      '신축계=신축이음계 동일 센서',
      'LVDT·균열계·신축계 동일 범례',
      '신축계로 수평·수직 전방위 동시 측정',
    ],
  },
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
console.log('Patched', Object.keys(PATCHES).length, 'registry entries for Phase AA');
});
