# 외부 ZIP 전수검수 — 신규 심각 오류 10종 (Phase AA) 및 수정계획

**수립:** 2026-06-26  
**근거:** 외부 공학 검수 2차 묶음 — 기존 **30종**(감사 25·28·30 + Phase Z ZIP-AUD-01~10)과 **비중복**  
**성격:** `지중경사계 해석` · `사면 해석` · `시스템 구성` · `센서 상세도` — **「해석 결과를 계측값처럼 단정」** 오류 집중  
**상위:** [25-오류식별](./25-NMTI-계측-이미지-도면-오류-식별-및-수정계획-보고서.md) · [77-Phase Z](./77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md) · [IMAGE_REGENERATION_PROMPTS §Phase AA](./IMAGE_REGENERATION_PROMPTS.md)

> **한 줄:** 사면·해석·센서 Figure에서 **추정·상관·가능성**이어야 할 내용을 **확정·인과·절대값**으로 그린 10 Figure — **4종 전면 재작성 · 6종 중대 수정**.

---

## 0. Executive summary

| 구분 | 내용 |
|------|------|
| 검수 묶음 | ZIP 207종 중 **2차 선별 10종** (앞선 30종과 비중복) |
| 신규 심각 오류 | **10건** (`ZIP-AUD-11` ~ `ZIP-AUD-20`) |
| **REGENERATE** (전면 재작성) | IMG-016 · 017 · 021 · 039 |
| **MAJOR_FIX** (중대 부분 수정) | IMG-018 · 020 · 025 · 027 · 037 · 038 |
| 핵심 위험 Top 3 | **016** (최대변위 심도=활동면) · **017** (무한사면식↔프로파일 직결) · **039** (신축계·이음계·균열계 혼동) |
| registry 조치 | `patch:registry-phase-aa` → `requiresReaudit: true` · 재작업 완료 전 **PASS 유지 금지** |
| 프롬프트 정본 | [IMAGE_REGENERATION_PROMPTS §Phase AA](./IMAGE_REGENERATION_PROMPTS.md) |

### Phase Z와의 관계 (중복 아님)

| ID | Phase Z | Phase AA (본 묶음) |
|----|---------|-------------------|
| IMG-015 | hero — **확정 활동면·3~5m** (완료) | — |
| IMG-016 | — | **해석도** — 최대변위 심도 = 원호활동면 **1:1 단정** |
| IMG-025 | — | 시스템 구성 — 누적변위를 **절대변위**처럼 표시 |
| IMG-027 | 설치 단면 (IPI·Base) PASS | **그라우트·베이스 고정** 개념 모호 |

---

## 1. 신규 심각 오류 10종 (기준표)

| # | 감사 ID | 파일 | 신규 오류 | 왜 문제인가 | 수정 방향 | 판정 |
|---|---------|------|-----------|-------------|-----------|------|
| 1 | ZIP-AUD-11 | IMG-016 | 변위 최대심도 = 원호활동면 **1:1 단정** | 활동면은 추정 대상; 프로파일만으로 확정 불가 | 추정·잠재 활동면 · 다자료 병행 · **INTERP-01** | **REGENERATE** |
| 2 | ZIP-AUD-12 | IMG-017 | 무한사면식 ↔ 지중경사계 프로파일 **직접 연결** | 안정해석식 ≠ 계측 산정식 | 검토식·추정 평면활동면 분리 | **REGENERATE** |
| 3 | ZIP-AUD-13 | IMG-018 | 상관관계를 **원인-결과 확정** 메커니즘 | 강우·수위·변위는 지연·지층·배수에 따라 상이 | 상관 **분석** · 가설 · 대체 원인 | MAJOR_FIX |
| 4 | ZIP-AUD-14 | IMG-020 | 침하판·기준점 관계 불명확 · 압밀 단순화 | SETTLE-01·압밀 단계 혼동 | 측정점 vs BM · 1차압밀·즉시침하 구분 | MAJOR_FIX |
| 5 | ZIP-AUD-15 | IMG-021 | 측방유동 판단 기준 **과도 단순** | 어깨·TOE 역할·연약층 근입 미흡 | 3소 목적 분리 · 변위속도·성토단계 연계 | **REGENERATE** |
| 6 | ZIP-AUD-16 | IMG-025 | 누적변위를 **절대변위**처럼 표시 | 다단식 = 구간 상대변위 누적 | 기준 심도 대비 **상대변위** · 로거≠센서 | MAJOR_FIX |
| 7 | ZIP-AUD-17 | IMG-027 | 그라우트 내·외부 모호 · 베이스 **과신** | 케이싱-지반 결합·기준 심도 불명 | 외주 그라우트 · Base=기준 심도(비절대고정) | MAJOR_FIX |
| 8 | ZIP-AUD-18 | IMG-037 | 균열폭만 · **전단·단차·회전** 누락 | 균열계 = 폭 변화 한정 | 측정 한계·별도 계측 명시 | MAJOR_FIX |
| 9 | ZIP-AUD-19 | IMG-038 | 브라켓·유격 무시 · 경사=구조물 경사 | 국부 경사 · 설치면·영점 중요 | 강체 브라켓 · 국부 경사 · 영점 | MAJOR_FIX |
| 10 | ZIP-AUD-20 | IMG-039 | 신축계·LVDT·균열계·신축이음계 **혼합** | 센서 클래스 경계 붕괴 (CLS-01) | 상대변위 ΔL · 용도별 분리 | **REGENERATE** |

**공통 원칙 INTERP-01:** Figure·라벨·그래프에서 **해석·추정·상관**은 `추정` · `검토` · `가능` · `상관`으로 표기 — **확정·단정·인과** 금지. [TECHNICAL §0.0c](./TECHNICAL_IMAGE_STANDARD.md)

---

## 2. 우선순위

### 전면 재작성 (P0)

```text
IMG-016 원호활동면 계측 해석도
IMG-017 평면활동면 계측 해석도
IMG-021 측방유동 계측도
IMG-039 신축계 설치 개념도
```

### 중대 부분 수정 (P1)

```text
IMG-018 강우-지하수위-변위 상관도
IMG-020 압밀 침하 계측 개념도
IMG-025 센서형 다단식 지중경사계 시스템 구성도
IMG-027 센서형 다단식 지중경사계 설치 단면도
IMG-037 균열계 설치 개념도
IMG-038 구조물 경사계 설치도
```

---

## 3. Phase 실행 계획

### Phase AA-1 — REGENERATE 4종 (P0)

| 순위 | ID | nodeId | 산출 | 표준 |
|------|-----|--------|------|------|
| AA-1a | IMG-016 | `fields/slope` (해석 Figure) | AI+§86 · [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-016_redline_v2_외부PNG.md) | INSTRUMENTATION §3.12 · **INTERP-01** |
| AA-1b | IMG-017 | `fields/slope` | AI+§86 | §3.12 · 평면활동면 ≠ 프로파일 확정 |
| AA-1c | IMG-021 | `fields/soft-ground` | AI+§86 | 연약지반 측방유동 |
| AA-1d | IMG-039 | `sensors/joint-meter` | AI+§86 | CLS-01 · ≠ 신축이음계 |

**Exit:** redline 0건 · `prohibitedVerified: true` · `reviewGrade: PASS`

### Phase AA-2 — MAJOR_FIX 6종 (P1)

| 순위 | ID | nodeId | 작업 |
|------|-----|--------|------|
| AA-2a | IMG-018 | `fields/slope` | 상관 분석 · 지연시간 · 대체 원인 |
| AA-2b | IMG-020 | `fields/soft-ground` | 침하판·BM · 압밀 단계 그래프 |
| AA-2c | IMG-025 | `sensors/inclinometer` | `inclinometer_system_draw.py` — 상대변위 그래프 |
| AA-2d | IMG-027 | `sensors/inclinometer` | `inclinometer_ground_draw.py` — 그라우트·Base |
| AA-2e | IMG-037 | `sensors/crack-meter` | `render-p2` crack — 측정 한계 주석 |
| AA-2f | IMG-038 | `sensors/tilt-meter` | `render-p2` tilt — 브라켓·국부 경사 |

**Exit:** `audit:images:strict` · ImageWorks prompt v+1

### Phase AA-3 — 문서·registry·검증

- [x] 본 문서 · [IMAGE_REGENERATION_PROMPTS §AA](./IMAGE_REGENERATION_PROMPTS.md)
- [x] `npm run patch:registry-phase-aa`
- [x] redline v2 10종 · [85 실행 체크리스트](./85-Phase-AA-재작도-실행-체크리스트.md)
- [ ] PNG/WebP 교체 → `register:figure` → `build:images`
- [ ] redline 서명 · `npm run sign:phase-aa` (작업 완료 후)
- [ ] `audit:images:strict` · `verify:production`

---

## 4. nodeId·hero 매핑

| ID | nodeId | 비고 |
|----|--------|------|
| IMG-016 | `fields/slope` | leaves-part3 원호활동면 |
| IMG-017 | `fields/slope` | 평면활동면 해석 |
| IMG-018 | `fields/slope` | 강우·수위·변위 |
| IMG-020 | `fields/soft-ground` | 압밀 침하 |
| IMG-021 | `fields/soft-ground` | 측방유동 |
| IMG-025 | `sensors/inclinometer` | hero 시스템 구성 |
| IMG-027 | `sensors/inclinometer` | 설치 단면 |
| IMG-037 | `sensors/crack-meter` | |
| IMG-038 | `sensors/tilt-meter` | |
| IMG-039 | `sensors/joint-meter` | |

---

## 5. 금지 요약 (INTERP-01 + ZIP-AUD-11~20)

| 금지 | 대상 |
|------|------|
| 최대변위 심도 = 활동면 위치 | 016 · 017 |
| 무한사면 안정식 = 실측 활동면 확정 | 017 |
| 강우→변위 **단일 인과** 화살표 | 018 |
| 침하판 상단 = 기준점 | 020 |
| 연약층 **균일 좌우 밀림** | 021 |
| 누적변위 = 절대좌표 변위 | 025 |
| 케이싱 내부 전체 그라우트 · Base 절대고정 | 027 |
| 균열계 = 3D 거동 전체 | 037 |
| 1점 경사 = 구조물 전체 기울기 | 038 |
| 신축계 = 신축이음계 = LVDT = 균열계 | 039 |

---

## 6. 연계

| 문서 | 용도 |
|------|------|
| [IMAGE_REGENERATION_PROMPTS §AA](./IMAGE_REGENERATION_PROMPTS.md) | **전체 수정 프롬프트** |
| [TECHNICAL §0.0c](./TECHNICAL_IMAGE_STANDARD.md) | ZIP-AUD-11~20 · INTERP-01 |
| [INSTRUMENTATION §3.3·3.12·3.18](./INSTRUMENTATION_DRAWING_RULES.md) | 지중경사계 · 사면 · 균열계 |
| [28 §4](./28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) | 감사 ID 보조 표 |
| [81-Phase AA](./81-외부-ZIP-신규-심각오류-10종-Phase-AA-수정계획.md) | ZIP-AUD-11~20 · INTERP-01 |
| [84-Phase AB](./84-외부-ZIP-신규-심각오류-10종-Phase-AB-수정계획.md) | ZIP-AUD-21~30 · AXIS·IPI·WELL·LOGGER |
| [29-Master Plan](./29-NMTI-기술자료-이미지-공학-감사-수정계획.md) | Phase AA·AB |
| [78-2차 스캔](./78-ZIP-207-2차-전수검수-보고서.md) | 메타 휴리스틱 (완료) |
