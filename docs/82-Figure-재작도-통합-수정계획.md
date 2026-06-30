# Figure 재작도 통합 수정 계획

**수립:** 2026-06-26  
**범위:** 기술자료 IMG-### 중 **육안·redline 미검수** 또는 **REGENERATE** 판정 Figure  
**상위:** [31-출판품질-통합수정계획](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) · [66-ZIP105](./66-ZIP105-문서-정합-수정-보고.md) §7~8 · [38-픽셀감사판정표](./38-AI-프롬프트-hero-픽셀-감사-판정표.md)  
**제작 금지:** 에이전트·Pillow FT-A/B · SVG — [16](./16-기술자료-이미지-에이전트-SVG-생성-금지.md) · `figure-production-policy.json`

> **한 줄:** 문서·redline·복붙 프롬프트는 **준비 완료** — 남은 일은 **인간 검수 AI/CAD PNG** 제작·등록·redline 서명.

---

## 0. 현황

| 구분 | 건수 | 상태 |
|------|------|------|
| 전체 Figure | 110 | registry · images.js 동기 |
| **P0 필수 재작도** | 3 | redline v5/v3/v2 · 복붙 블록 ✅ |
| **P1 재작도 권장** | 9 | redline v2/v3 · 프롬프트 v3 ✅ |
| **P2 장기 재작도** | ~25 | docs/38 REGENERATE · 프롬프트 v2 |
| **선택(육안·FT-C)** | 4 | 전면 재작도 아님 |
| **유지(재작도 제외)** | ~69 | v2 PASS · 외부 PNG 검수 완료 |

**CI 정책:** Phase **A** `patch:registry-phase-a` · **AA·AB** 20건 `requiresReaudit` — PNG+서명 전 `audit:images:strict` **FAIL 예상**. Phase **AC·AD·D·E**는 각 `patch:registry-phase-*` 후 동일.

**제작자 허브:** [108 마스터](./108-PNG-재작도-제작자-마스터-인덱스.md) · [89 작업순서](./89-PNG-재작도-통합-작업순서.md) · **문서 Exit:** [111](./111-PNG-재작도-문서준비-Exit-보고.md)

---

## 1. 목표 · Exit

| # | Exit | 검증 |
|---|------|------|
| E1 | P0 3건 PNG redline **PASS** 서명 | [002 v5](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-002_redline_v5_외부PNG.md) · [096 v4](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-096_redline_v4_외부PNG.md) · [004 v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-004_redline_v2_외부PNG.md) |
| E2 | P1 9건 동일 | §3.2 · §3.3 표 |
| E3 | `productionMethod: ai-reviewed` · `visualReview` 갱신 | `image-review-registry.json` |
| E4 | `npm run verify:local` · `audit:images:strict` PASS | 배포 전 |
| E5 | P2는 스프린트별 Exit — Phase 6~8 로드맵 | 본 문서 §5 |

---

## 2. 공통 워크플로

| 단계 | 작업 | 산출물 |
|------|------|--------|
| **A** | 정본 doc **§복붙 블록** 또는 ImageWorks `prompts/` + `redlines/` | AI/CAD 입력 |
| **B** | 생성 → **redline 육안** (하나라도 FAIL → 폐기·재생성) | PNG ≥1920×1080 |
| **C** | `assets/images/technology/source/IMG-###_*.png` | source |
| **D** | `npm run register:figure` (method `ai-reviewed`) | registry |
| **E** | webp · `npm run build:images` · redline **서명** | images.js |
| **F** | `npm run verify:local` | CI |

**복붙 블록 정본:** [66 §8](./66-ZIP105-문서-정합-수정-보고.md)

---

## 3. Phase별 실행

### 3.1 Phase A — P0 필수 (3건 · 2~3주)

**정책:** **부분 수정·inpaint 금지** · 전면 재작성만.

| 순위 | ID | 제목 | nodeId | 복붙 블록 | redline | 핵심 검수 |
|------|-----|------|--------|-----------|---------|-----------|
| 1 | **002** | 흙막이 계측 설치 대표 단면도 | `earth-retaining-wall` | [52 §12](./52-IMG-002-전면재작성-프롬프트-정본.md) | [v5](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-002_redline_v5_외부PNG.md) | SOE-INST-01 · SETTLE · 앵커 LC 두부 · 11종 |
| 2 | **096** | 주변지반 계측 설치 대표 단면도 | `surrounding-ground` | [57 §8.1](./57-IMG-096-가시설-주변지반-계측-표현-표준.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-096_redline_v3_외부PNG.md) | MIX 금지 · ② 측점/핀 · H=굴착깊이 |
| 3 | **004** | 어스앵커 하중계 설치 개념도 | `anchor` | [54 §15](./54-IMG-004-어스앵커-하중계-설치-표현-표준.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-004_redline_v2_외부PNG.md) | ANC-AXIS · T/P 분리 |

**Exit A:** E1 · [102 W1 허브](./102-W1-Phase-A-PNG-제작자-통합-허브.md) · [92 Phase A](./92-Phase-A-복붙-프롬프트-정본.md) · hero 3노드 SPA 확인

---

### 3.2 Phase B — P1 재작도 권장 (4건 · 2주)

Pillow/Sprint0 PNG — 새 redline **픽셀 미검수**.

| ID | 제목 | nodeId | 복붙/redline | 핵심 |
|----|------|--------|--------------|------|
| **024** | 댐 안전관리 계측 체계도 | `dam` | [39 §12](./39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md) · [v2 redline](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-024_redline_v2_외부PNG.md) | DAM-01~07 · 6항목 · 7단 흐름 |
| **089** | 사면 지표경사 | `slope/surface-tilt` | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-089_사면_지표경사_계측_개념도.md) · [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-089_redline_v2_외부PNG.md) | SLO-TILT · ≠IPI |
| **090** | 사면 구조물 변위 | `slope/structural-displacement` | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-090_사면_구조물_변위_계측_개념도.md) · [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-090_redline_v2_외부PNG.md) | ATS 부동점 · 프리즘 |
| **091** | MPBX | `borehole-extensometer` | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-091_다점지중변위계_MPBX_설치_개념도.md) · [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-091_redline_v2_외부PNG.md) | MPX-01~03 |

**Exit B:** [88 Phase B](./88-Phase-B-P1-재작도-실행-체크리스트.md)

---

### 3.3 Phase C — P1 ZIP Phase Z (5건 · 2주)

registry `REGENERATE` — [77-ZIP](./77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md)

| ID | 제목 | redline v2/v9 | 선행 doc |
|----|------|---------------|----------|
| **008** | 터널 전단면 내공변위 | [v9](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-008_redline_v9_외부PNG.md) · [v8](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-008_redline_v8_외부PNG.md) | [20](./20-IMG-008-터널-내공변위-오류분석-및-재작업-계획.md) |
| **015** | 사면 계측 전체 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-015_redline_v2_외부PNG.md) | §3.12 |
| **032** | 침하판·침하계 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-032_redline_v2_외부PNG.md) | SETTLE-01 |
| **078** | 록볼트 축력 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-078_redline_v2_외부PNG.md) | [21](./21-IMG-078-009-록볼트-축력-오류분석-및-재작업-계획.md) |
| **080** | 강지보 응력 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-080_redline_v2_외부PNG.md) | §3.11.3 |

**실행 체크리스트:** [84 Phase C](./84-Phase-C-ZIP-재작도-실행-체크리스트.md)

---

### 3.3b Phase AA — ZIP 2차 해석·센서 (10건 · 2~3주)

[81-Phase AA](./81-외부-ZIP-신규-심각오류-10종-Phase-AA-수정계획.md) · `requiresReaudit: true` — PNG 완료 전 strict CI **FAIL 예상**

| 구분 | ID | redline v2 | 복붙 |
|------|-----|------------|------|
| **REGENERATE** | 016 · 017 · 021 · 039 | ImageWorks `redlines/IMG-###_redline_v2_외부PNG.md` | [IMAGE_REGENERATION_PROMPTS §AA](./IMAGE_REGENERATION_PROMPTS.md) |
| **MAJOR_FIX** | 018 · 020 · 025 · 027 · 037 · 038 | 동일 | 동일 |

**실행 체크리스트:** [85 Phase AA](./85-Phase-AA-재작도-실행-체크리스트.md) · 완료 후 `npm run sign:phase-aa`

---

### 3.3c Phase AB — ZIP 3차 (10건 · 2~3주)

[84-Phase AB](./84-외부-ZIP-신규-심각오류-10종-Phase-AB-수정계획.md) · `requiresReaudit: true`

| 구분 | ID | 복붙 |
|------|-----|------|
| **REGENERATE** | 028 · 029 · 045 | [91](./91-Phase-AB-복붙-프롬프트-정본.md) |
| **MAJOR_FIX** | 026 · 030 · 035 · 040 · 042 · 044 · 046 | [91](./91-Phase-AB-복붙-프롬프트-정본.md) |

**체크리스트:** [90](./90-Phase-AB-재작도-실행-체크리스트.md) · [89 통합 작업순서](./89-PNG-재작도-통합-작업순서.md)

---

### 3.3d Phase AC — ZIP 4차 (10건 · 계측 원리·해석)

[92-Phase AC](./92-외부-ZIP-신규-심각오류-10종-Phase-AC-수정계획.md) · `npm run patch:registry-phase-ac`

| 구분 | ID | 복붙 |
|------|-----|------|
| **REGENERATE (P0 우선 4)** | 024 · 033 · 081 · 059 | [93](./93-Phase-AC-복붙-프롬프트-정본.md) |
| **REGENERATE** | 007 · 019 · 023 · 079 | [93](./93-Phase-AC-복붙-프롬프트-정본.md) |
| **MAJOR_FIX** | 031 · 036 | [93](./93-Phase-AC-복붙-프롬프트-정본.md) |

**체크리스트:** [94](./94-Phase-AC-재작도-실행-체크리스트.md) · **퀵스타트:** [109](./109-W8-Phase-AC-퀵스타트.md) · IMG별 exit: [95](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md) · **실행계획:** [96](./96-Phase-AC-통합-수정-실행계획.md) · redline v2 `ImageWorks/.../redlines/IMG-###_redline_v2_외부PNG.md` (024·079 AC 보조: `_AC.md`)

---

### 3.3e Phase AD — ZIP 5차 (10건 · 운영·그래프·UI)

[96-Phase AD](./96-외부-ZIP-신규-심각오류-10종-Phase-AD-수정계획.md) · `npm run patch:registry-phase-ad`

| 구분 | ID | 복붙 |
|------|-----|------|
| **REGENERATE (P0)** | 050 · 052 · 054 · 056 | [97](./97-Phase-AD-복붙-프롬프트-정본.md) |
| **MAJOR_FIX (P1)** | 047 · 048 · 049 · 051 · 053 · 055 | [97](./97-Phase-AD-복붙-프롬프트-정본.md) |

**체크리스트:** [98](./98-Phase-AD-재작도-실행-체크리스트.md) · **퀵스타트:** [110](./110-W9-Phase-AD-퀵스타트.md) · IMG별 exit: [99](./99-Phase-AD-IMG별-오류분석-및-재작업-계획.md)

---

### 3.4 Phase D — P2 장기 (스프린트 6~8 · ~25건)

**판정:** [38 §1~3](./38-AI-프롬프트-hero-픽셀-감사-판정표.md) `REGENERATE`

#### D-1 분야 hero (7)

| ID | nodeId | §36 |
|----|--------|-----|
| 007 | `tunnel` | §4.1 |
| 011 | `bridge` | §4.6 · [76-IMG-011](./76-IMG-011-교량-전체-개념도-v2-수정계획.md) |
| 023 | `railway` | §4.9③ |
| 064 | `harbor` · `quay-wall` | §4.9② |
| 084 | `harbor/caisson` | §4.9② |
| 097 | `tunnel/blast-vibration` | §4.1 |

#### D-2 센서 (11)

030, 033, 034, 037, 039, 040, 041, 042, 043, 044 — §4.5 · 개별 `prompts/IMG-###`

#### D-3 instruments·운영 (5)

070, 071, 075, 076, 077 — §4.8 · FT-C 혼재 주의

#### D-4 기초·환경 (2)

092, 093 — Sprint0 Pillow · §4.11

**D Exit:** 스프린트마다 5~8건 · `38` KEEP 전환 · `IMAGE_REVIEW_LOG` 갱신

**체크리스트:** [113](./113-Phase-D-재작도-실행-체크리스트.md) · **퀵스타트:** [114](./114-W10-Phase-D-퀵스타트.md) · **복붙:** [112](./112-Phase-D-복붙-프롬프트-정본.md) · `sign:phase-d` · W1~W9 **미포함** 14종

---

### 3.5 Phase E — 선택 (재작도 최소)

| ID | 조치 | 비고 |
|----|------|------|
| 011 | 육안 BRI-01 · caption 정리 | [W10 Phase D](./114-W10-Phase-D-퀵스타트.md)와 병행 |
| 094, 095, 102 | FT-C Pillow 유지 또는 출판 검수 | [117 W11](./117-W11-Phase-E-퀵스타트.md) · `sign:phase-e` |

**체크리스트:** [116](./116-Phase-E-재작도-실행-체크리스트.md) · **복붙:** [115](./115-Phase-E-복붙-프롬프트-정본.md)

---

## 4. 역할 · 일정 (권장)

| 주차 | Phase | 담당 | 산출 |
|------|-------|------|------|
| W1 | A-1 | 검수자+AI | IMG-002 PNG v1 |
| W2 | A-2~3 | 검수자+AI | IMG-096 · 004 |
| W3 | B | 검수자+AI | 024 · 089~091 |
| W4 | C | 검수자+AI | 008 · 015 · 032 · 078 · 080 |
| W5~8 | D | 스프린트별 5~8건 | 38 REGENERATE 잔여 |

---

## 5. 재작도 제외 (유지)

다음은 **당장 재작도 목록에서 제외** — 변경 시 본 계획 §6 이력에 기록.

- **교량 v2 PASS:** 012, 013, 103~110 · [73](./73-대구통합계측-준공보고서-구현-완료-보고.md)
- **터널:** 061 v2 PASS · 009 · 079
- **가시설:** 001 · 005 v4
- **FT-C 블록:** 045, 046~048, 058, 072~074, 094~095(선택)
- **센서 KEEP:** 025~028, 031, 035~036, 038

---

## 6. 리스크 · 완화

| 리스크 | 완화 |
|--------|------|
| 부분 수정으로 동일 오류 재발 | P0 **전면 재작성** · redline FAIL=폐기 |
| Pillow/SVG 우회 | `audit:figure-production:strict` · CI |
| SETTLE·SOE 혼동 | 복붙 블록 §1.0 P0 선행 |
| `requiresReaudit`로 CI 붕괴 | PNG 교체 후에만 서명·notes 갱신 |
| FTP 후 404 | `verify:production` 13건 |

---

## 7. 체크리스트 (Figure 1건 완료 시)

- [ ] redline 전항 PASS · 검수자·일자 서명
- [ ] PNG ≥1920×1080 · `source/` 보관
- [ ] `npm run register:figure` · `build:images`
- [ ] registry `notes` — 「미검수」 문구 제거
- [ ] `verify:local` PASS
- [ ] (배포 후) `verify:production`

---

## 8. 관련 파일

| 유형 | 경로 |
|------|------|
| 재작도 대기 표 | [66 §7](./66-ZIP105-문서-정합-수정-보고.md) |
| 복붙·워크플로 | [66 §8](./66-ZIP105-문서-정합-수정-보고.md) |
| 판정표 | [38](./38-AI-프롬프트-hero-픽셀-감사-판정표.md) |
| 정책 | `scripts/figure-production-policy.json` |
| 등록 | `scripts/register-external-figure.mjs` |
| AGENTS | [AGENTS.md](../AGENTS.md) Figure 절 |

---

## 9. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | 최초 수립 — P0~P2 통합 · Phase A~E · Exit·일정 |
| 2026-06-26 | Phase C redline v2/v9 · [83 Phase A](./83-Phase-A-P0-재작도-실행-체크리스트.md) · [84 Phase C](./84-Phase-C-ZIP-재작도-실행-체크리스트.md) |
| 2026-06-26 | Phase AA redline v2 10종 · [85](./85-Phase-AA-재작도-실행-체크리스트.md) |
| 2026-06-26 | [86](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · [87](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) · ImageWorks prompt v3 10종 |
| 2026-06-22 | **Phase AC** ZIP 4차 10종 — [92](./92-외부-ZIP-신규-심각오류-10종-Phase-AC-수정계획.md) · [96 실행계획](./96-Phase-AC-통합-수정-실행계획.md) · MEAS-PRIN-01 |
| 2026-06-26 | [88 Phase B](./88-Phase-B-P1-재작도-실행-체크리스트.md) · [89 작업순서](./89-PNG-재작도-통합-작업순서.md) · [90·91 Phase AB](./90-Phase-AB-재작도-실행-체크리스트.md) redline v2 |
| 2026-06-26 | [92 Phase A 복붙](./92-Phase-A-복붙-프롬프트-정본.md) · redline v5 §3.5 ANC-CLOCK · `sign:phase-a` |
| 2026-06-26 | **Phase AB** ZIP 3차 10종 — [84](./84-외부-ZIP-신규-심각오류-10종-Phase-AB-수정계획.md) |
