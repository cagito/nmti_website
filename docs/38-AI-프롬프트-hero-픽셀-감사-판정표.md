# Hero Figure 픽셀 감사 판정표 (Phase 2)

**수립:** 2026-06-22  
**정본 프롬프트:** [36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md)  
**실행 계획:** [37-반영 실행 계획](./37-AI-프롬프트-가이드-반영-실행-계획.md) Phase 2  
**검수 근거:** `scripts/image-review-registry.json` · `docs/IMAGE_REVIEW_LOG.md` · docs/36 §6

> **판정 코드:** `KEEP` = 현 PNG 유지 · `REGENERATE` = docs/36 EN + Cursor FT-A/B 재생성 · `PILLOW_OK` = Pillow 감사 통과, 외부 이전은 장기(31)

---

## 1. 분야 hero (~20)

| IMG | nodeId | 판정 | reviewGrade | productionMethod | 비고 |
|-----|--------|------|-------------|------------------|------|
| 001 | `fields/retaining-excavation` | **KEEP** | PASS | pillow | C0~C4 · pending-external FT-A |
| 002 | `fields/retaining-excavation/earth-retaining-wall` | **KEEP** | PASS | pillow | v7 · 11종 단면 |
| 004 | `fields/retaining-excavation/anchor` | **KEEP** | PASS | pillow | EXC-01 |
| 005 | `fields/retaining-excavation/adjacent-building` | **KEEP** | PASS | pillow | v3 · ≠ IMG-101 |
| 007 | `fields/tunnel` | **REGENERATE** | PASS* | unknown | 프롬프트 v2 반영 완료 · FT-A/B 이전 권장 |
| 008 | `fields/tunnel/convergence` | **KEEP** | PASS | pillow | 상부 아치만 |
| 010 | `fields/tunnel/surface-subsidence` | **KEEP** | PASS | pillow | 침하 트러프 |
| 011 | `fields/bridge` | **REGENERATE** | PASS* | unknown | BRI-01 재확인 후 Cursor |
| 012 | `fields/bridge/pier` | **KEEP** | PASS | — | v2 프롬프트 |
| 013 | `fields/bridge/foundation-settlement` | **KEEP** | PASS | — | v2 프롬프트 |
| 015 | `fields/slope` | **REGENERATE** | PASS* | unknown | ATS 부동점 외부 |
| 016 | `fields/slope/slip-surface` | **KEEP** | PASS | — | 활동면 |
| 019 | `fields/soft-ground` | **KEEP** | PASS | — | v2 프롬프트 |
| 096 | `fields/retaining-excavation/surrounding-ground` | **PILLOW_OK** | PASS | pillow | C1 샌드위치 수정 |
| 097 | `fields/tunnel/blast-vibration` | **REGENERATE** | PASS* | unknown | PPV 파형·뇌 금지 재확인 |
| 078 | `fields/tunnel/rockbolt` | **KEEP** | PASS | pillow | §4.2④ 방사형 · doc 21 |
| 079 | `fields/tunnel/shotcrete` | **KEEP** | PASS | pillow | §4.2⑤ 라이닝 매립 · doc 22 |
| 089 | `fields/slope/surface-tilt` | **REGENERATE** | (신규) | — | PNG 미등록 · §4.3② |
| 090 | `fields/slope/structural-displacement` | **REGENERATE** | (신규) | — | PNG 미등록 · §4.3③ |
| 023 | `fields/railway` | **REGENERATE** | PASS* | unknown | §4.9③ · v2 프롬프트 · FT-A/B 권장 |
| 024 | `fields/dam` | **REGENERATE** | PASS* | unknown | §4.9① · DAM-01~03 · doc 32 |
| 064 | `fields/harbor` · `quay-wall` | **REGENERATE** | PASS* | unknown | §4.9② · 풍경화 금지 재확인 |
| 084 | `fields/harbor/caisson` · `structure` | **REGENERATE** | PASS* | unknown | §4.9② · crest tilt · 배면 EPC |
| 098 | `fields/harbor/tide-groundwater` | **PILLOW_OK** | PASS | pillow | HAR-01~04 |
| 099 | `fields/building/deflection` | **PILLOW_OK** | PASS | pillow | DEF-01~04 |
| 100 | `fields/building` | **PILLOW_OK** | PASS | pillow | BLD-H-01 |
| 101 | `fields/building/adjacent-building` | **PILLOW_OK** | PASS | pillow | BLD-ADJ-01 |

\* registry `reviewGrade: PASS`이나 `productionMethod: unknown` — **doc 36 §6 육안 재확인** 후 FT-A/B 이전

---

## 2. 센서 hero (P2)

| IMG | nodeId | 판정 | 비고 |
|-----|--------|------|------|
| 025~028 | `sensors/inclinometer` | **KEEP** | 09 표준 전칭 · 프롬프트 v2 |
| 030 | `sensors/water-level-meter` | **REGENERATE** | ≠ piezometer 구분 |
| 031 | `sensors/piezometer` | **KEEP** | filter tip · v2 |
| 032 | `sensors/settlement-gauge` | **KEEP** | v2 기존 |
| 033 | `sensors/layer-settlement-gauge` | **REGENERATE** | 다점 링 체인 |
| 034 | `sensors/earth-pressure-cell` | **REGENERATE** | 법선 압력 화살표 |
| 035~038 | strain/load/tilt | **KEEP** | v2 기존 |
| 037 | `sensors/crack-meter` | **REGENERATE** | 균열 수직 교차 |
| 039~044 | joint/LVDT/vib/ATS/GNSS/weather | **REGENERATE** | unknown 다수 · v2 프롬프트 준비됨 |
| 091 | `sensors/borehole-extensometer` | **REGENERATE** | (신규) | PNG 미등록 · §4.5⑨ MPBX |

---

## 3. instruments hero

| IMG | nodeId | 판정 | 비고 |
|-----|--------|------|------|
| 045 | `instruments/datalogger/static` | **KEEP** | v2 · 뇌 금지 |
| 046~048 | comm/power/LTE | **KEEP** | v2 기존 |
| 070~071 | manual/automatic | **REGENERATE** | v2 반영 · 픽셀 미확인 |
| 072~074 | remote/smart/ai | **KEEP** | 074 뇌 금지 필수 |
| 075~077 | overview/dynamic/MUX | **REGENERATE** | v2 반영 · 픽셀 미확인 |

---

## 4. 다음 작업 (Phase 3)

**우선순위 (PNG 없음 → v2 hero 재생성):**

| 순위 | IMG | nodeId | § |
|------|-----|--------|---|
| 1 | 089·090·091 | slope 리프 · MPBX | §4.3②③ · §4.5⑨ |
| 2 | 023·024 | railway · dam | §4.9①③ |
| 3 | 064·084 | harbor · caisson | §4.9② |
| 4 | 030~044 등 | sensors | §4.5 · [38 §2](./38-AI-프롬프트-hero-픽셀-감사-판정표.md) |

**워크플로:** docs/36 §2.2 → §2.1 → §4 EN → **§6.1 QA** → Cursor → `register:figure` → `npm run verify:local`

1. `REGENERATE` 행: 위 워크플로
2. `KEEP`/`PILLOW_OK`: [31](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) FT-A 이전은 별도 스프린트
3. 신규/재생성 후: `IMAGE_REVIEW_LOG` · registry 갱신

**자동 동기:** `npm run sync:prompt-v2` — `scripts/data/prompt-v2-registry*.json`
