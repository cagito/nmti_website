/**
 * Phase AB — 외부 ZIP 3차 묶음 10종 registry 플래그
 * Usage: node scripts/patch-registry-phase-ab.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

runLocked('registry', 'patch-registry-phase-ab', () => {
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const PATCHES = {
  'IMG-026': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-21',
    note: '외부 ZIP 3차 — A/B축 현장 방향 미연결. MAJOR_FIX. docs/84 Phase AB-2',
    prohibited: [
      'A축/B축을 화면 좌표처럼 표현',
      '굴착·활동방향과 무관한 축 방향',
      '축 방향 설정 오류 경고 누락',
    ],
  },
  'IMG-028': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-22',
    note: '외부 ZIP 3차 — θ 단순 적분=누적변위. REGENERATE. docs/84 Phase AB-1a',
    prohibited: [
      '초기 프로파일 없이 변위 산정',
      '현재 기울기 θ만으로 곧바로 누적변위',
      '하부 기준점 항상 고정 단정',
      '왕복 측정·누적오차 미표시',
    ],
  },
  'IMG-029': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-23',
    note: '외부 ZIP 3차 — 최대 누적변위 깊이=활동면. REGENERATE. docs/84 Phase AB-1b',
    prohibited: [
      '최대 누적변위 깊이 = 활동면',
      '단일 그래프로 활동면 확정',
      '최대변위 심도와 활동면 동일 의미',
    ],
  },
  'IMG-030': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-24',
    note: '외부 ZIP 3차 — 관측공 전 구간 개방 혼합. MAJOR_FIX. docs/84 Phase AB-2',
    prohibited: [
      '관측공 전체 개방으로 지층 수위 혼합',
      '지하수위계=간극수압계 동일 개념',
      '필터·차수 구간 미구분',
    ],
  },
  'IMG-035': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-25',
    note: '외부 ZIP 3차 — 하중 전달·편심·프리로드 누락. MAJOR_FIX. docs/84 Phase AB-2',
    prohibited: [
      '하중계만으로 지보재 안전 직접 판정',
      '편심 없이 순수 축력만',
      '초기치·온도·프리로드 미표시',
    ],
  },
  'IMG-040': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-26',
    note: '외부 ZIP 3차 — LVDT 기준점·축·stroke 누락. MAJOR_FIX. docs/84 Phase AB-2',
    prohibited: [
      '기준점 항상 완전 고정 가정',
      '측정축 무관 부착',
      'stroke·브라켓 유격 미표시',
    ],
  },
  'IMG-042': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-27',
    note: '외부 ZIP 3차 — 기준망·후시점·기상보정 누락. MAJOR_FIX. docs/84 Phase AB-2',
    prohibited: [
      '기준 프리즘 없이 대상만',
      'ATS 한 대가 절대변위 자동 확정',
      '후시점·기상보정 누락',
    ],
  },
  'IMG-044': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-28',
    note: '외부 ZIP 3차 — 기상계 임의 설치·상관=인과. MAJOR_FIX. docs/84 Phase AB-2',
    prohibited: [
      '장애물 무시 임의 설치',
      '기상-변위 상관을 인과 단정',
      '설치 높이·이격 미표시',
    ],
  },
  'IMG-045': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-29',
    note: '외부 ZIP 3차 — 모든 센서 동일 입력. REGENERATE. docs/84 Phase AB-1c',
    prohibited: [
      '모든 센서 동일 아날로그 입력',
      '로거가 센서 종류 자동 처리',
      '신호 형식·여자전원 미구분',
    ],
  },
  'IMG-046': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-30',
    note: '외부 ZIP 3차 — 로거=게이트웨이 혼동. MAJOR_FIX. docs/84 Phase AB-2',
    prohibited: [
      '게이트웨이=데이터로거 동일 장치',
      '게이트웨이가 이상판정·관리기준 판정',
      '로거 저장 vs GW 버퍼 미구분',
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
console.log('Patched', Object.keys(PATCHES).length, 'registry entries for Phase AB');
});
