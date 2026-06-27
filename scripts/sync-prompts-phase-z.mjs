/**
 * ImageWorks prompts — Phase Z v+1 동기화 (10종).
 * Usage: node scripts/sync-prompts-phase-z.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROMPT_DIR = join(
  ROOT,
  'ImageWorks',
  'NMTI_Engineering_Image_Prompt_Package_v1',
  'prompts'
);

const BANNER = `> **Phase Z (2026-06-26):** [docs/77](../../../docs/77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md) · Pillow \`render-phase-z.py\` · **PASS**`;

const PATCHES = {
  'IMG-008_터널_전단면_내공변위_측정시스템.md': {
    insertAfter: '# IMG-008',
    replace: [
      [
        '> **📋 v8 외부 PNG (Phase 1):**',
        `> **📋 Phase Z v9 (Pillow):** 측점 P1~P5 · 측선 · 기준 측정선 — **연속 센서 튜브/Kit 금지**\n> **📋 v8 외부 PNG (아카이브):**`,
      ],
      [
        '**Pillow 재렌더 금지**',
        '**Pillow:** `npm run render:phase-z -- --id 008`',
      ],
      [
        'Kit를 아치 라이닝에 연속 설치',
        '측점 P1~P5(프리즘·타깃)와 측점 간 측선·기준 측정선으로 초기/현재 형상 비교',
      ],
      [
        'Kit 간 **Extension Tube** 체인',
        '**내공변위 측선** (측점 간 거리·좌표 변화)',
      ],
      [
        'Extension Tube, 데이터로거',
        '기준 측정선, 자동광파기, 데이터로거',
      ],
      [
        '| 2026-06-26 | v8 — Phase 1',
        '| 2026-06-26 | **v9 Phase Z** — 측점·측선·ATS · ZIP-AUD-01 · Pillow PASS\n| 2026-06-26 | v8 — Phase 1',
      ],
    ],
    append: `\n## Phase Z 금지 (ZIP-AUD-01)\n\n- 라이닝 연속 센서 튜브 · Kit 전체 프로파일 자동 산정\n- Extension Tube 체인을 내공변위 대표 표현으로 사용\n\n## Phase Z 필수\n\n- P1~P5 측점 · 측선 · 기준 측정선 · 초기/현재 형상\n- 자동광파기·프리즘 또는 테이프 익스텐소미터 (선택)\n- 노반 Open · 건축한계 · 천단침하 구분\n`,
  },
  'IMG-015_사면_계측_전체_개념도.md': {
    insertAfter: '# IMG-015',
    replace: [
      ['사면 활동면(원호파괴선)', '**잠재 활동면(추정)** · 원호파괴선(점선·확정 금지)'],
      ['**활동면(원호파괴선)** 점선', '**잠재 활동면(추정)** 점선'],
      ['3~5m', '설계·지반조사 결과'],
    ],
    append: `\n## Phase Z (ZIP-AUD-03)\n\n- 활동면 **확정 금지** — 「잠재 활동면(추정)」\n- 근입 깊이: **설계·지반조사 결과에 따라 결정** (고정 m 금지)\n- 강우·G.W.L·u = 보조 계측\n`,
  },
  'IMG-032_침하판_침하계_설치_개념도.md': {
    insertAfter: '# IMG-032',
    replace: [
      ['침하계, 침하량, 성토, 기준점', '침하판, 연장봉, 보호관, **측정점**, **안정 기준점(BM)**, 성토'],
    ],
    append: `\n## Phase Z (ZIP-AUD-04)\n\n- 연장봉 상단 = **측정점** (침하판과 함께 이동)\n- **안정 기준점** = 영향권 밖 별도 설치\n- 침하량 = BM 대비 측정점 표고 변화\n- ✗ 연장봉 상단을 「기준점」으로 표기\n`,
  },
  'IMG-034_토압계_설치_개념도.md': {
    insertAfter: '# IMG-034',
    append: `\n## Phase Z (ZIP-AUD-05)\n\n- **상재하중 q** (연직) vs **수평토압 σh** 분리\n- 성토 하중 ≠ 토압계 측정값\n`,
  },
  'IMG-041_진동계_설치_개념도.md': {
    insertAfter: '# IMG-041',
    append: `\n## Phase Z (ZIP-AUD-06)\n\n- 가속도계: **m/s², gal, g**\n- PPV·진동속도: **mm/s** (별도 축·그래프)\n- ✗ 「가속도(m/s² 또는 mm/s)」\n`,
  },
  'IMG-043_GNSS_변위_계측_개념도.md': {
    insertAfter: '# IMG-043',
    replace: [
      ['기준국 ↔ 이동국 점선·캡션 "RTK"', '**보정정보 통신** (위성 신호와 구분 — 시준 점선 금지)'],
    ],
    append: `\n## Phase Z (ZIP-AUD-07)\n\n- 위성 → 기준국 · 위성 → 이동국\n- 기준국→이동국 = **보정정보 통신** (광파 시준선 금지)\n- 결과: **ΔE·ΔN·ΔU**\n`,
  },
  'IMG-060_데이터_품질관리_흐름도.md': {
    insertAfter: '# IMG-060',
    append: `\n## Phase Z (ZIP-AUD-08)\n\n1. 원본 데이터 저장 (불변)\n2. QC 검증 → 플래그: 정상·결측·이상 의심·센서 점검 필요\n3. 이상치 **삭제 금지** — QC 플래그\n4. 보정 데이터 **별도 저장** · 승인 후 드리프트 보정\n5. 보고: 원본·보정·사유\n`,
  },
  'IMG-078_록볼트_축력_계측_개념도.md': {
    insertAfter: '# IMG-078',
    append: `\n## Phase Z (ZIP-AUD-09)\n\n- 두부 하중계 = **록볼트 두부 하중(반력)** ≠ 전체 축력분포\n- **변형률계 부착 록볼트**로 분포 추정\n- 자유장 · 정착장 · 부착구간 구분\n- ✗ P = T 단순화\n`,
  },
  'IMG-080_강지보_응력_계측_개념도.md': {
    insertAfter: '# IMG-080',
    append: `\n## Phase Z (ZIP-AUD-10)\n\n- 천단·어깨·측벽 · 플랜지/웹 · 내외측 대칭\n- 2점/4점 변형률 → 축력·휨 분리 해석\n- ✗ 플랜지 1점 SG = 전체 응력\n`,
  },
  'IMG-009_록볼트_축력_숏크리트_응력_계측도.md': {
    insertAfter: '# IMG-009',
    append: `\n## Phase Z (ZIP-AUD-02)\n\n- 숏크리트 SG: **내부 매립·표면 부착** — 공중 부유 금지\n- 록볼트 LC: 두부 또는 계측용 록볼트\n- 부재별 SG 구분 (숏크리트·록볼트·강지보)\n`,
  },
};

for (const [file, patch] of Object.entries(PATCHES)) {
  const path = join(PROMPT_DIR, file);
  if (!existsSync(path)) {
    console.error('Missing', file);
    process.exit(1);
  }
  let text = readFileSync(path, 'utf8');
  if (!text.includes('Phase Z (2026-06-26)')) {
    const lines = text.split('\n');
    const idx = lines.findIndex((l) => l.startsWith(patch.insertAfter));
    if (idx >= 0) {
      lines.splice(idx + 1, 0, '', BANNER);
      text = lines.join('\n');
    }
  }
  for (const [from, to] of patch.replace || []) {
    if (text.includes(from)) text = text.replace(from, to);
  }
  if (patch.append && !text.includes(patch.append.trim().slice(0, 40))) {
    text = text.trimEnd() + patch.append;
  }
  atomicWriteUtf8(path, text.endsWith('\n') ? text : text + '\n');
  console.log('Synced', file);
}

console.log('sync-prompts-phase-z: OK');
