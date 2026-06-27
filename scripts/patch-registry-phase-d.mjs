/**
 * Phase D — P2 장기 FT-A/B 이전 14종 registry 플래그 (W10)
 * Usage: node scripts/patch-registry-phase-d.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');

const PATCHES = {
  'IMG-011': {
    auditPriority: 'P2',
    phaseD: 'D-1',
    note: 'Phase D — 교량 hero FT-A/B ai-reviewed 이전. BRI-01 · docs/112 §1 · Pillow v2 PASS 유지 중',
    prohibited: [
      '흙막이·버팀보·굴착 공동 단면',
      '처짐을 침하량·침하판으로 표현',
      '진동현식 라벨',
    ],
  },
  'IMG-064': {
    auditPriority: 'P2',
    phaseD: 'D-1',
    note: 'Phase D — 항만 hero FT-A/B. HAR-01 · docs/112 §2 · §4.9②',
    prohibited: [
      '푸른 바다·갈매기 풍경화',
      '가시설 굴착 맥락 혼입',
      '좌=매립|우=바다 횡단 단면 누락',
    ],
  },
  'IMG-084': {
    auditPriority: 'P2',
    phaseD: 'D-1',
    note: 'Phase D — 케이슨 hero FT-A/B. crest 경사·배면 EPC · docs/112 §3',
    prohibited: [
      'crest 경사계 누락',
      '배면 토압계 감지면 누락',
      '측방 변위 벡터 생략',
    ],
  },
  'IMG-097': {
    auditPriority: 'P2',
    phaseD: 'D-1',
    note: 'Phase D — 발파진동 hero FT-A/B. IMG-041(교량) 재사용 금지 · docs/112 §4',
    prohibited: [
      '교량·교각 단면',
      '뇌·로봇 아이콘',
      '발파원·영향권·PPV 측점 미분리',
    ],
  },
  'IMG-034': {
    auditPriority: 'P2',
    phaseD: 'D-2',
    note: 'Phase D — 토압계 MAJOR_FIX FT-A/B. EPC-01 · docs/112 §5',
    prohibited: [
      '성토 하중=토압계 측정값',
      '감지면·법선 압력 화살표 누락',
      '배면 되메움·밀착 조건 생략',
    ],
  },
  'IMG-041': {
    auditPriority: 'P2',
    phaseD: 'D-2',
    note: 'Phase D — 진동계 MAJOR_FIX FT-A/B. VIB-UNIT-01 · docs/112 §6',
    prohibited: [
      '가속도와 PPV 단위 혼재',
      '구조물·지반 진동계 설치 맥락 미구분',
      'blast-vibration hero로 사용',
    ],
  },
  'IMG-043': {
    auditPriority: 'P2',
    phaseD: 'D-2',
    note: 'Phase D — GNSS MAJOR_FIX FT-A/B. GNSS-RTK-01 · book/GNSS.pdf · docs/112 §7',
    prohibited: [
      '기준국→이동국 직선 시준',
      '제조사 로고·EGM 복사',
      'ΔEΔNΔU 변위 벡터 누락',
    ],
  },
  'IMG-070': {
    auditPriority: 'P2',
    phaseD: 'D-3',
    note: 'Phase D — 수동계측 FT-C→ai-reviewed. AUTO-01 수동 hero 허용 · docs/112 §8',
    prohibited: [
      '데이터로거·클라우드 hero',
      '자동 전송 흐름',
      '사람 얼굴',
    ],
  },
  'IMG-071': {
    auditPriority: 'P2',
    phaseD: 'D-3',
    note: 'Phase D — 자동계측 FT-C→ai-reviewed. docs/112 §9',
    prohibited: [
      '수동 리드아웃만',
      '뇌·로봇 아이콘',
      '로거 함체 미표시',
    ],
  },
  'IMG-075': {
    auditPriority: 'P2',
    phaseD: 'D-3',
    note: 'Phase D — 계측방식 5단계 FT-C→ai-reviewed. docs/112 §10',
    prohibited: [
      '단일 직렬 흐름만',
      '뇌·사이버 배경',
    ],
  },
  'IMG-076': {
    auditPriority: 'P2',
    phaseD: 'D-3',
    note: 'Phase D — 동적 DAQ FT-C→ai-reviewed. docs/112 §11',
    prohibited: [
      '정적 로거와 동일 표현',
      '샘플링·트리거 개념 생략',
    ],
  },
  'IMG-077': {
    auditPriority: 'P2',
    phaseD: 'D-3',
    note: 'Phase D — MUX FT-C→ai-reviewed. docs/112 §12',
    prohibited: [
      '채널 스캔·다중화 개념 생략',
      '단일 센서 직결만',
    ],
  },
  'IMG-092': {
    auditPriority: 'P2',
    phaseD: 'D-4',
    note: 'Phase D — 말뚝 축력·변형률 FT-A 단면. PILE-01 · docs/112 §13',
    prohibited: [
      '지상 기둥만·선단 암반 누락',
      '교량 기초침하(013) 혼동',
      '지표면 아래 지층만',
    ],
  },
  'IMG-093': {
    auditPriority: 'P2',
    phaseD: 'D-4',
    note: 'Phase D — 환경 소음·분진 FT-A. ENV-01 · docs/112 §14',
    prohibited: [
      '대기 그래프만·현장 계측주 생략',
      '로거 함체 미표시',
      '민원 경계·펜스 맥락 누락',
    ],
  },
};

runLocked('registry', 'patch-registry-phase-d', () => {
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

  for (const [id, patch] of Object.entries(PATCHES)) {
    const reg = registry[id];
    if (!reg) {
      console.error('Missing', id);
      process.exit(1);
    }
    reg.requiresReaudit = true;
    reg.auditPriority = patch.auditPriority;
    reg.phaseD = patch.phaseD;
    reg.notes = patch.note;
    reg.prohibitedErrors = [...new Set([...(reg.prohibitedErrors || []), ...patch.prohibited])];
    reg.prohibitedVerified = false;
    delete reg.prohibitedVerifiedDate;
    delete reg.prohibitedVerifiedNote;
  }

  atomicWriteUtf8(registryPath, JSON.stringify(registry, null, 2) + '\n');
  console.log('Patched', Object.keys(PATCHES).length, 'registry entries for Phase D');
});
