/**
 * Phase AD — 외부 ZIP 5차 묶음 10종 registry 플래그 (IMG-047~056)
 * Usage: node scripts/patch-registry-phase-ad.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

runLocked('registry', 'patch-registry-phase-ad', () => {
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const PATCHES = {
  'IMG-047': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-41',
    note: '외부 ZIP 5차 — 태양광 부하·자율운전일·LVD·SPD 누락. MAJOR_FIX. docs/96 Phase AD-2',
    prohibited: [
      '패널→충전→배터리→로거 직렬만',
      '부하 산정 없이 12V 배터리만',
      '무정전 장기 운전 보장 암시',
      '접지 단일 배터리만',
    ],
  },
  'IMG-048': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-42',
    note: '외부 ZIP 5차 — LTE 직렬 흐름만. MAJOR_FIX. docs/96 Phase AD-2',
    prohibited: [
      '센서→로거→LTE→서버 직렬만',
      '로컬 저장·재전송 없음',
      'APN·VPN·ACK·방화벽 누락',
      'LTE 모뎀이 경보 판정',
    ],
  },
  'IMG-049': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-43',
    note: '외부 ZIP 5차 — 변위 단일 ±기준선. MAJOR_FIX. docs/96 Phase AD-2',
    prohibited: [
      '단일 ±기준선을 보편 기준처럼',
      '단일 변위계로 옹벽 전체 안정 판정',
      '기준점 안정성·변위속도 누락',
    ],
  },
  'IMG-050': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-44',
    note: '외부 ZIP 5차 — 침하 단순 외삽=예측. REGENERATE. docs/96 Phase AD-1a',
    prohibited: [
      '측정값 선형 외삽=최종침하',
      '침하판·연장봉을 기준점처럼',
      '압밀 해석법 없이 예측선',
      '성토단계·잔류침하 누락',
    ],
  },
  'IMG-051': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-45',
    note: '외부 ZIP 5차 — 간극수압 이상화 소산. MAJOR_FIX. docs/96 Phase AD-2',
    prohibited: [
      '모든 성토단계 동일 u 패턴',
      'Δu·초기 정수압 미구분',
      '소산만으로 압밀 완료 단정',
    ],
  },
  'IMG-052': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-46',
    note: '외부 ZIP 5차 — 하중 동일 수평 기준선. REGENERATE. docs/96 Phase AD-1b',
    prohibited: [
      '전 단계 동일 수평 기준선',
      '단계별 설계축력 미표시',
      '하중 급감=안전 암시',
      '프리로드·온도 영향 누락',
    ],
  },
  'IMG-053': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-47',
    note: '외부 ZIP 5차 — PPV 이벤트·시간 혼합. MAJOR_FIX. docs/96 Phase AD-2',
    prohibited: [
      '이벤트 번호와 시간축 혼합',
      'PPV 단일 점만',
      '3축·주파수·지속시간 누락',
      '가속도·속도 단위 혼동',
    ],
  },
  'IMG-054': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-48',
    note: '외부 ZIP 5차 — 경보 선형 색상만. REGENERATE. docs/96 Phase AD-1c',
    prohibited: [
      '정상→위험→조치 선형만',
      '데이터 품질검증 선행 없음',
      '결측·센서이상=초과 혼동',
      '위험→조치완료 자동',
    ],
  },
  'IMG-055': {
    auditPriority: 'P1',
    zipAud: 'ZIP-AUD-49',
    note: '외부 ZIP 5차 — 모바일 초과 알림만. MAJOR_FIX. docs/96 Phase AD-2',
    prohibited: [
      '색상 알림만으로 조치 가능 암시',
      '통신·센서 상태 누락',
      '조치 이력·해제조건 없음',
    ],
  },
  'IMG-056': {
    auditPriority: 'P0',
    zipAud: 'ZIP-AUD-50',
    note: '외부 ZIP 5차 — 대시보드 형식만. REGENERATE. docs/96 Phase AD-1d',
    prohibited: [
      '전 센서 초록 점',
      '그래프 단위·시간축 없음',
      '지도·목록·이벤트 상태 불일치',
      '결측·통신두절 미표시',
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
console.log('Patched', Object.keys(PATCHES).length, 'registry entries for Phase AD');
});
