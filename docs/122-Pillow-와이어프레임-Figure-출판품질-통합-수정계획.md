# Pillow·와이어프레임 Figure — 출판품질 통합 수정계획

**수립:** 2026-06-26  
**상태:** **제작자 실행 대기** — 운영 WebP 109/109 노출 중 · **시각 품질 미달 76건** 교체  
**트리거:** IMG-094(상시 계측 모드) 등 **PPT 와이어프레임 수준** Figure 현장·육안 불합격

**정본 연계:** [31 출판품질](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) · [121 Pillow PNG](./121-미구현·Pillow-Figure-PNG-제작-통합계획.md) · [82 재작도](./82-Figure-재작도-통합-수정계획.md) · [120 미구현](./120-미구현-통합-구현계획.md) · [59 운영모드 표준](./59-계측-운영-모드-구조-환경-AI-표현-표준.md) · [IMAGE_AUDIT §5.1](./IMAGE_AUDIT_CHECKLIST.md)

> **한 줄:** `scripts/lib/*_draw.py`·`render-sprint0-figures.py` 등 **Python Pillow**로 그린 Figure는 계측관리계획서·기술자료 **삽입 품질에 미달**한다. **전면 ai-reviewed PNG(또는 FT-A/B는 CAD)** 로 교체한다. **Pillow 재렌더·에이전트 SVG 금지.**

---

## 0. 문제 정의

### 0.1 대표 사례 — IMG-094

| 항목 | 내용 |
|------|------|
| ID | **IMG-094** · 상시 계측 모드 흐름도 |
| 노드 | `instruments/modes/normal-mode` |
| 산출 | `scripts/lib/sprint0_draw.py` → `render_img094()` |
| registry | `productionMethod: pillow` |
| 증상 | 둥근 사각형·레거시 로거 아이콘·단순 산점도·과다 여백 — **「허접한 스케치」** 수준 |

동일 파이프라인: `render-sprint0-figures.py`(089~095·102) · `render-modes-figures.py`(070~075) · `render-p3-platform.py` · `render-power-figures.py` · `render-bridge-daegu-figures.py`(103~110).

### 0.2 「허접」 판정 기준 (출판 게이트)

[31 §3](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) · [IMAGE_AUDIT §5.1](./IMAGE_AUDIT_CHECKLIST.md) — **하나라도 FAIL → 교체**

| 코드 | 질문 | Pillow 전형 실패 |
|------|------|------------------|
| **V1** | 200% 확대 시 라벨·선명도 | 계단·번짐·저해상 텍스트 |
| **V2** | 보고서 1페이지 폭 삽입 시 가독성 | 빈 박스·아이콘만 |
| **V3** | 전문가가 「임시 도면」으로 인식하지 않는가 | **PPT 와이어프레임** 인상 |
| **V4** | `figureTier` ↔ 제작 방식 일치 | FT-A/B + pillow 이력 |
| **V5** | 기술 메시지(흐름·측정축·기준) 전달 | 시계·빈 그래프만 |
| **V6** | 워터마크·UI 크롬 과다 | 모달 X 버튼 등 스크린샷 흔적 |
| **V7** | INSTRUMENTATION·노드 표준과 정합 | DP-11~20 · OPM-01~03 위반 |

### 0.3 범위 요약

| 구분 | 건수 | 설명 |
|------|------|------|
| **P0** Sprint0·모드 동일 스타일 | **14** | 094 계열 — **최우선** |
| **P1** registry `pillow` 잔존 | **44** | P0 11건 포함(중복) |
| **P2** FT-A/B Python 와이어프레임 (`requiresReaudit`) | **27** | 단면·설치도 PPT 수준 |
| **고유 교체 대상** | **≈76** | P1 ∪ P2 (085 rejected 제외) |
| **재작도 프로그램** | **69** | W1~W11 — P2 대부분 포함 |
| **의도적 제외** | **1** | IMG-085 → IMG-110 대체 |

---

## 1. 목표 · Exit

| # | Exit | 검증 |
|---|------|------|
| E1 | P0 14건 `productionMethod: ai-reviewed` · `visualReview PASS` | redline v2+ · 육안 |
| E2 | registry `productionMethod: pillow` **0건** (또는 정책 예외 문서화 0건) | `audit:figure-production:strict` |
| E3 | `requiresReaudit` **0** | `npm run verify:local` |
| E4 | hero·운영모드·플랫폼 노출 Figure 육안 합격 | 현장 시연·`capture:hero-screenshots` |
| E5 | Pillow `render-*.py` **미실행** 잠금 유지 | `render_guard` exit 2 |

---

## 2. 절대 규칙

| 금지 | 대안 |
|------|------|
| Pillow `*_draw.py` **재렌더·덮어쓰기** | ai-reviewed PNG · 인간 CAD |
| 에이전트·`render-svg-figures` SVG | 동일 |
| redline·육안 검수 없는 1-shot GenerateImage | ImageWorks 프롬프트 + redline |
| 부분 inpaint로 P0 단면 «고치기» | **전면 재작성** ([82 §3.1](./82-Figure-재작도-통합-수정계획.md)) |

**허용:** FT-C도 **최종 목표는 ai-reviewed** — Pillow 유지는 본 계획에서 **폐지**한다 ([121 §2.2②](./121-미구현·Pillow-Figure-PNG-제작-통합계획.md) 정책 변경).

---

## 3. 목표 시각 품질 (교체 후)

### 3.1 FT-C 블록·흐름 (094·070~102·045·058 등)

- **출판용 기술 도면** — 선 굵기·계층·여백 균일 · 1920×1080 이상
- **데이터로거** = [06 로거 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md) 함체 실루엣 — 레거시 랙 아이콘 금지
- **금지:** 뇌·홀로그램·SF 매트릭스 · 시계만 · 빈 「클라우드 DB」 박스만
- **표준:** [59 DP-11~20](./59-계측-운영-모드-구조-환경-AI-표현-표준.md) · [36 §4.12](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · [115 Phase E](./115-Phase-E-복붙-프롬프트-정본.md)

### 3.2 FT-A/B 단면·설치

- **CAD·계측관리계획서** 삽입 수준 — 지층·센서·GL·로거 [P0 블록](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · [INSTRUMENTATION](./INSTRUMENTATION_DRAWING_RULES.md)
- redline **전면 재작성** — ZIP 감사 항목 통과

---

## 4. Phase별 실행

### Phase P0 — Sprint0·모드 동일 스타일 (14건 · 1~2주)

**우선순위 최상.** 사용자 신고·메뉴 공개(`smart`/`ai`/`normal-mode`) 직결.

| 순서 | ID | 제목 | 노드(hero) | 프롬프트·redline |
|------|-----|------|------------|------------------|
| 1 | **094** | 상시 계측 모드 흐름도 | `instruments/modes/normal-mode` | [115 §1](./115-Phase-E-복붙-프롬프트-정본.md) · redline v2 |
| 2 | **095** | 실시간·이벤트 모드 | `instruments/modes/realtime-mode` | [115 §2](./115-Phase-E-복붙-프롬프트-정본.md) |
| 3 | **102** | 경보·알림 상태 | `instruments/modes/alarm-status` | [115 §3](./115-Phase-E-복붙-프롬프트-정본.md) |
| 4 | 070 | 수동 계측 | `instruments/modes/manual` | [36 §4.11](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) |
| 5 | 071 | 자동 계측 | `instruments/modes/automatic` | 동일 |
| 6 | 072 | 원격 자동계측 | `instruments/modes/remote-automatic` | 동일 |
| 7 | 073 | 스마트 계측 | `instruments/modes/smart` | 동일 · SD-01~08 |
| 8 | 074 | AI 계측 | `instruments/modes/ai` | 동일 · **뇌 금지** |
| 9 | 075 | 5단계 계층도 | `instruments/modes/overview` | MOD-01 등급화 금지 |
| 10 | 089 | 사면 지표경사 | `fields/slope/surface-tilt` | [36 §4.3②](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · SLO-TILT |
| 11 | 090 | 사면 구조물 변위 | `fields/slope/structural-displacement` | §4.3③ |
| 12 | 091 | MPBX | `sensors/borehole-extensometer` | §4.5⑨ · CLS-01 |
| 13 | 092 | 말뚝 축력·변형률 | `fields/foundation-pile` | §4.9 · Phase D |
| 14 | 093 | 환경 소음·분진 | `fields/environmental-impact` | §4.10 · DP-19 |

**Exit:** `npm run rework:sign -- --phase E` (094·095·102) + P0 나머지 개별 `rework:done` · registry `pillow` → `ai-reviewed`

```powershell
npm run rework:prompt -- --id IMG-094
# PNG ≥1920×1080 → source/
npm run rework:done -- --id IMG-094 --input assets/images/technology/source/<canonical>.png --reviewer "검수자"
```

---

### Phase P1 — Pillow FT-C 잔여 (44건 중 P0 제외 30건 · 3~4주)

#### P1-A 플랫폼·전원·로거 (14)

| ID | 제목 | hero | 상태 | 비고 |
|----|------|------|------|------|
| 006 | 굴착 단계별 계측 흐름도 | | **✅ 2026-06-27** | 4단계·루프·그래프 v3 |
| **045** | 데이터로거 구성도 | ● | **✅ 2026-06-27** | [06 로거](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md) |
| 047 | 태양광 전원 | | **✅ 2026-06-27** | SOLAR-SIZE-01 v3 |
| **048** | LTE M2M | ● | **✅ 2026-06-27** | [13 LTE](./13-LTE-M2M-용어-및-Figure-개편-계획.md) |
| 056 | 웹 대시보드 | | **✅ 2026-06-27** | DASH-STATE-01 v3 |
| **058** | 통합 플랫폼 | ● | **✅ 2026-06-27** | E2E hub |
| 060 | 데이터 품질관리 | | **✅ 2026-06-27** | Phase Z QC v3 |
| 065~069 | 전원 통합·AC·AVR·풍력·배터리 | | **✅ 066~069 2026-06-27** | 065 기존 · 066~069 v3 |
| 076 | 동적 데이터로거 | | **✅ 2026-06-27** | DAQ v3 |
| 077 | MUX | | **✅ 2026-06-27** | MOD-06 v3 |

#### P1-B 그래프·경보 블록 (14)

~~018 ✅~~ · ~~029 ✅~~ · ~~044 ✅~~ · ~~046 ✅~~ · ~~049 ✅~~ · ~~050 ✅~~ · ~~051 ✅~~ · ~~052 ✅~~ · ~~053 ✅~~ · ~~054 ✅~~ · ~~055 ✅~~ · ~~057 ✅~~ · ~~059 ✅ 2026-06-27~~

→ W2 AA(018) · W5~7 AB(029·044~046) · W9 AD(047~056·059)와 **병행** ([121 §2.2①](./121-미구현·Pillow-Figure-PNG-제작-통합계획.md))

#### P1-C 교량 대구 gap (8)

103 · 104 · 105 · 106 · 107 · 108 · 109 · 110

→ [64 교량 확장](./64-교량-확장-Figure-5종-통합-구현계획.md) · BRI 표준 · **CAD급 단면** 목표

**Exit:** `productionMethod: pillow` **0건** · `audit:figure-production:strict` PASS

---

### Phase P2 — FT-A/B 와이어프레임 (`requiresReaudit` 27건 · 8~10주)

[82](./82-Figure-재작도-통합-수정계획.md) · [108 마스터](./108-PNG-재작도-제작자-마스터-인덱스.md) **W1~W9** 일정 그대로 따름.

| Sprint | Phase | ID |
|--------|-------|-----|
| **S1 W1** | A | **002 · 096 · 004** |
| S2 W2 | AA | 016 · 017 · 021 · 039 + 018·020·025·027·037·038 |
| S3~S4 | B·C | 024 · 089~091(→P0) · 008·015·032·078·080 |
| S5~S7 | AB·AC·AD | 025~035·036·040·042 · 007·019·023 · 047~056·059 |
| 잔여 | — | 026 · 028 · 030 · 031 · 033 · 079 · 081 |

**대표 hero:** 002(흙막이) · 096(주변지반) · 024(댐) · 027(지중경사계) · 025(지중경사계 시스템)

**Exit:** `requiresReaudit: 0` · `npm run verify:local` PASS

---

### Phase P3 — 정책·CI 잠금 (1주)

| # | 작업 |
|---|------|
| 3.1 | `figure-production-policy.json` — pillow Figure 전부 `targetMethod: ai-reviewed` |
| 3.2 | `patch:registry-phase-*` 최종 — `prohibitedVerified` · `visualReview` |
| 3.3 | `npm run audit:figure-production:strict` · `verify:local` · FTP 후 `verify:production` |
| 3.4 | AGENTS.md · [10 운영](./10-최종-완료-및-운영-가이드.md) Exit 갱신 |

---

## 5. 공통 워크플로 (Figure 1건)

```text
1. npm run rework:prompt -- --id IMG-###
2. docs/36 §1.0 P0 블록 + 노드 표준 + redline 체크리스트 육안
3. 외부 AI(CAD) 생성 → PNG ≥1920×1080
4. assets/images/technology/source/<canonical>.png
5. npm run rework:preflight -- --id IMG-###
6. npm run rework:done -- --id IMG-### --input ... --reviewer "실명"
7. npm run build:images && npm run verify:content
```

Phase 완료: `npm run rework:sign -- --phase A|AA|…|E`

**일괄 프롬프트:** `npm run rework:export-prompts` → `exports/rework-prompts/`

---

## 6. 권장 일정 (제작자 1인)

| 주차 | Phase | 건수 | 누적 Exit |
|------|-------|------|-----------|
| 1~2 | **P0** | 14 | 운영모드·신규 3분야 hero 시각 합격 |
| 3~4 | **P1-A** | 14 | 로거·플랫폼·전원 |
| 5~6 | **P1-B** | 14 | 그래프·경보 |
| 7~8 | **P1-C** | 8 | 교량 103~110 |
| 9~18 | **P2** | 27 | reaudit 0 · verify:local |
| 19 | **P3** | — | CI 잠금 |

**전체:** 약 **19주** (주 4~5 Figure) — P0·W1 병행 시 **16주** 단축 가능

---

## 7. 체크리스트 (제작자)

### P0 즉시 (이번 주)

→ **실행표:** [123 P0 체크리스트](./123-P0-와이어프레임-14종-실행-체크리스트.md) · `npm run rework:p0`

- [ ] IMG-094 redline v2 대조 · 신규 PNG — [124 퀵스타트](./124-P0-IMG-094-운영모드-3종-제작자-퀵스타트.md)
- [ ] IMG-095 · 102 동일
- [ ] 070~075 modes — [59](./59-계측-운영-모드-구조-환경-AI-표현-표준.md) MOD-01~06
- [ ] `sign:phase-e` 또는 개별 `rework:done` 14건
- [ ] SPA `#instruments/modes/normal-mode` 육안 확인

### 프로그램 Exit

- [ ] pillow **0건**
- [ ] reaudit **0건**
- [ ] `verify:local` PASS
- [ ] `verify:production` 홈·기술자료 200

---

## 8. 연계 문서

| 문서 | 역할 |
|------|------|
| **122 본 문서** | **허접 Figure 전수·Phase P0~P3** |
| [121](./121-미구현·Pillow-Figure-PNG-제작-통합계획.md) | Pillow 분류·W1~W11 |
| [82](./82-Figure-재작도-통합-수정계획.md) | redline·Phase A~E |
| [115](./115-Phase-E-복붙-프롬프트-정본.md) | 094·095·102 복붙 |
| [116](./116-Phase-E-재작도-실행-체크리스트.md) | W11 실행표 |
| [59](./59-계측-운영-모드-구조-환경-AI-표현-표준.md) | 운영모드 공학 표준 |
| [31](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) | V1~V7 출판 게이트 |

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | 초판 — IMG-094 트리거 · P0 14건 · Pillow 44 · reaudit 27 · 일정·Exit |
