/**
 * Apply Phase 5·6 registry notes (idempotent). Run after seed if needed.
 * Usage: node scripts/patch-registry-phase5-6.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8, readJsonSafe } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(ROOT, 'scripts', 'image-review-registry.json');

runLocked('registry', 'patch-registry-phase5-6', () => {
const reg = readJsonSafe(path, null);
if (!reg || !Object.keys(reg).length) {
  console.error('registry empty — run seed-image-review-registry.mjs first');
  process.exit(1);
}

const PATCH = {
  'IMG-001': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 6 formal — Pillow v8·doc 19 Q0',
    notes: 'Phase 6 Q0: C0 지표면·1F·출입구 · C1~C4 INSTRUMENTATION §3.1 · render-p1 v8.',
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: 'EXC-05·§3.1.1 — 좌→우 단면·프리즘 측점·구조물경사계 표면 부착',
  },
  'IMG-002': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 6 formal — v7 PNG·doc 19 Q1~Q7',
    notes: 'PNG canonical v7 · 11종·②③ 이형·앵커 두부·토압 방향. legacySvgSource 수정 금지 (doc 16).',
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: 'EXC-01~05·§3.1.1 — doc 19 Q1~Q7 육안 0건',
  },
  'IMG-004': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 6 formal — Pillow v3·doc 26 EXC-01',
    notes: 'v3: 굴착측 두부 조립(지지링·반력판–LC–헤드)·T/P 분리·정착장 내부 금지.',
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: 'EXC-01·§3.2 — anchor_head_draw 5-panel',
  },
  'IMG-005': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 6 formal — v3·doc 15 BLD Q0',
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: 'BLD-01~04·§3.18 — 구조물경사계 외벽·프리즘 분리·C0 지표면',
  },
  'IMG-025': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 5 Pillow v2 — AUTO-01 IPI·datalogger chain',
    auditPriority: 'P1',
    prohibitedErrors: [
      '지중경사계를 침하계처럼 표현',
      '「지중경사계」단독 Figure 라벨 — 센서형 다단식 전칭 필수',
      '케이싱 4홈·프로브 휠 누락',
      '안정층 근입 없이 중단',
      '수평변위를 수직 침하로 표현',
      '수동 probe·리드아웃을 hero로 표현 (AUTO-01)',
    ],
    notes: 'Phase 5 v2: IPI 다점·4홈 casing·안정층 Base·자동 로거 체인. 수동 프로브는 비교 inset만.',
    prohibitedVerified: true,
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: '§3.3·AUTO-01 — IPI hero · manual inset only',
  },
  'IMG-027': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 5 Pillow v2 — doc 17 C1~C5',
    prohibitedErrors: [
      'P1: 수평변위← — 활동면·슬라이딩→ 역학 모순',
      'P2: Base 얕은 관입 — 절대 고정단 1~3 m+ (권장 3~5 m+) 미달',
      '활동면·변위 집중 심도 미표시',
      '안정층 근입 누락',
      '수평변위를 수직 침하로 표현',
      '센서형 다단식 미표현',
      '「지중경사계」단독 Figure 라벨 — 센서형 다단식 전칭 필수',
    ],
    notes: 'Phase 5 v2: → 화살표·Base 4m 근입·보링·그라우트·센서형 다단식.',
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: '§3.3.1·doc 17 — 활동면→·안정층 근입·다점 센서',
  },
  'IMG-030': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 5 Pillow v2 — well cap·screen·seal·logger',
    prohibitedErrors: [
      '벽체 부착 센서로 표현',
      '토압계·간극수압계와 혼동',
      '수위선 없이 센서만 표시',
      '방수보호함만 표시 (well cap·screen·seal 누락)',
    ],
    notes: 'Phase 5 v2: well cap·screen·filter pack·bentonite seal·submersible logger.',
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: '§3.4·§3.24·AUTO-01',
  },
  'IMG-031': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 5 Pillow v2 — filter·seal·junction·logger',
    prohibitedErrors: [
      '지하수위 관측공 전체 개방으로 표현',
      '수위선만 표시하고 필터·차수 누락',
      '벽체 표면 센서로 표현',
      'G.W.L 라벨로 간극수압 오인',
    ],
    notes: 'Phase 5 v2: filter zone·grout seals·junction box·logger. ≠ 개방 관.',
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: '§3.5·§3.24 — sealed piezometer',
  },
  'IMG-034': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 5 Pillow v2 — sensing face·배면→벽체',
    notes: 'Phase 5 v2: backfill burial·감지면→벽체·토압 화살표.',
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: '§3.6 — EPC sensing face toward structure',
  },
  'IMG-035': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 5 Pillow v2 — STR-01 strut vs anchor LC',
    prohibitedErrors: [
      '버팀보 정중앙 하중계',
      '축방향과 무관한 설치',
      '옆면 장식처럼 배치',
      'strut LC와 anchor LC 혼동',
    ],
    notes: 'Phase 5 v2: ① 띠장-버팀보 접합부 축압축 ② 앵커 두부 LC.',
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: '§3.2·§3.7·STR-01',
  },
  'IMG-062': {
    reviewDate: '2026-06-22',
    reviewer: 'Phase 5 Pillow v2 — EXC-03 ②③ 이형',
    auditPriority: 'P2',
    prohibitedErrors: [
      '지하수위계를 벽체 표면에 부착',
      '②③ 동형 관 표현 (관측공=간극수압 혼동)',
      '수위선 없이 센서만 표시',
      '굴착 바닥에만 센서 표시',
    ],
    notes: 'Phase 5 v2: ① 관측공 개방 수면 vs ② 밀폐 필터·접속함·로거. IMG-002 ②③ 연계.',
    prohibitedVerified: true,
    prohibitedVerifiedDate: '2026-06-22',
    prohibitedVerifiedNote: '§3.4·§3.5·EXC-03 E2',
  },
};

for (const [id, patch] of Object.entries(PATCH)) {
  if (!reg[id]) {
    console.warn('skip missing', id);
    continue;
  }
  Object.assign(reg[id], patch);
  if (patch.prohibitedVerified !== false) {
    reg[id].prohibitedVerified = true;
  }
}

atomicWriteUtf8(path, JSON.stringify(reg, null, 2) + '\n');
console.log('Patched', Object.keys(PATCH).length, 'registry entries');
});
