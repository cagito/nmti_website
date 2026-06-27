/**
 * Phase AC — 외부 ZIP 4차 묶음 10종 registry 플래그
 * Usage: node scripts/patch-registry-phase-ac.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

const PATCHES = {
  'IMG-007': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-31',
    note: '외부 ZIP 4차 — 터널 계측 기준점·측점·측선 미분리. REGENERATE. docs/92 Phase AC-1e',
    prohibited: [
      '천단침하와 내공변위 동일 측선',
      '지중변위계를 록볼트처럼 표현',
      '단일 센서가 터널 전체 거동 대표',
      '숏크리트·강지보 응력계 동일 센서 표현',
    ],
  },
  'IMG-019': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-32',
    note: '외부 ZIP 4차 — 설치 배치도 아닌 개념/흐름. REGENERATE. docs/109 SOFT-LAYOUT-01',
    prohibited: [
      '흐름도·인포그래픽 주형·센서 아이콘 나열',
      '데이터 로거·서버·모바일 UI',
      '지표침하핀·판에 지표침하계 라벨',
      '간극수압계를 지하수위계처럼 긴 관측공',
      '지중경사계 과얕·지중경사계 단독 라벨',
      '토압계 감지면 누락',
    ],
  },
  'IMG-023': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-33',
    note: '외부 ZIP 4차 — 궤도틀림·노반침하·진동 혼합. REGENERATE. docs/92 Phase AC-1g',
    prohibited: [
      '레일 변위와 노반침하 동일 센서',
      '진동 단위와 침하 단위 혼재',
      '철도 계측 단일 로거 흐름도 단순화',
    ],
  },
  'IMG-024': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-34',
    note: '외부 ZIP 4차 — 누수=제체 내부 센서. REGENERATE. docs/92 Phase AC-1a DAM-LEAK-01',
    prohibited: [
      '누수계를 제체 내부 박힌 센서처럼 표현',
      '간극수압계가 누수량 직접 측정',
      '침투선을 실측값처럼 단정',
    ],
  },
  'IMG-031': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-35',
    note: '외부 ZIP 4차 — piezo 필터·차수 불명·standpipe 혼동. MAJOR_FIX. docs/92 Phase AC-2',
    prohibited: [
      '간극수압계를 단순 수위계처럼 표현',
      '필터구간 전체 관 길이',
      '그라우트가 센서 감지부 차단',
    ],
  },
  'IMG-033': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-36',
    note: '외부 ZIP 4차 — 자석링·기준관·프로브 역할 모호. REGENERATE. docs/92 Phase AC-1b',
    prohibited: [
      '자석링을 로거 직결 전기센서처럼 표현',
      '기준관이 지반과 함께 침하',
      '층별침하 막대그래프만·기준 위치 생략',
    ],
  },
  'IMG-036': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-37',
    note: '외부 ZIP 4차 — 변형률=즉시 응력 판정. MAJOR_FIX. docs/92 Phase AC-2',
    prohibited: [
      '변형률 수치=구조 안전판정',
      '게이지 방향 미표시',
      '온도보정·E·중립축 생략',
    ],
  },
  'IMG-059': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-40',
    note: '외부 ZIP 4차 — 관리기준 단일 표 일반화. REGENERATE. docs/92 Phase AC-1d',
    prohibited: [
      '모든 센서 동일 정상/주의/경고 로직',
      '출처 없는 관리기준 수치',
      '기준 초과=구조물 위험 단정',
    ],
  },
  'IMG-079': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-38',
    note: '외부 ZIP 4차 — 숏크리트=지반압 전체 평가. REGENERATE. docs/92 Phase AC-1h',
    prohibited: [
      '숏크리트 응력계로 터널 전체 안정성 평가',
      '숏크리트 응력계=토압계',
      '지반압 화살표와 센서 1:1 연결',
    ],
  },
  'IMG-081': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-39',
    note: '외부 ZIP 4차 — RF=모든 층 축소 직접 산정. REGENERATE. docs/92 Phase AC-1c',
    prohibited: [
      '수직 로드 하나가 모든 층 축소 직접 측정',
      'RF층을 절대 기준점',
      '크리프·건조수축·탄성축소 단순화',
    ],
  },
};

runLocked('registry', 'patch-registry-phase-ac', () => {
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
    reg.zipAuditId = patch.zipAud;
    reg.prohibitedErrors = [...new Set([...(reg.prohibitedErrors || []), ...patch.prohibited])];
    reg.prohibitedVerified = false;
    delete reg.prohibitedVerifiedDate;
    delete reg.prohibitedVerifiedNote;
  }

  atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
  console.log('Patched', Object.keys(PATCHES).length, 'registry entries for Phase AC');
});
