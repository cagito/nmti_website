# 외부 ZIP 전수검수 — 신규 심각 오류 10종 (Phase AB) 및 수정계획

**수립:** 2026-06-26  
**근거:** 외부 공학 검수 **3차 묶음** — 기존 **40종**(감사 25·28·30 + Phase Z + Phase AA)과 **비중복**  
**성격:** `지중경사계 축·원리·해석` · `지하수위 관측공` · `하중계` · `LVDT` · `광파기` · `기상` · `로거·게이트웨이`  
**상위:** [81-Phase AA](./81-외부-ZIP-신규-심각오류-10종-Phase-AA-수정계획.md) · [IMAGE_REGENERATION_PROMPTS §Phase AB](./IMAGE_REGENERATION_PROMPTS.md)

> **한 줄:** 축 방향·초기 프로파일·관측공 대수층·신호 형식·장비 역할 경계가 빠진 10 Figure — **3종 전면 재작성 · 7종 중대 수정**.

---

## 0. Executive summary

| 구분 | 내용 |
|------|------|
| 검수 묶음 | ZIP 207종 중 **3차 선별 10종** (앞선 40종과 비중복) |
| 신규 심각 오류 | **10건** (`ZIP-AUD-21` ~ `ZIP-AUD-30`) |
| **REGENERATE** | IMG-028 · 029 · 045 |
| **MAJOR_FIX** | IMG-026 · 030 · 035 · 040 · 042 · 044 · 046 |
| 핵심 위험 Top 3 | **028** (θ 적분=변위 단순화) · **029** (최대심도=활동면) · **045/046** (로거·게이트웨이 역할 혼동) |
| registry | `npm run patch:registry-phase-ab` → `requiresReaudit: true` |
| 프롬프트 | [IMAGE_REGENERATION_PROMPTS §Phase AB](./IMAGE_REGENERATION_PROMPTS.md) |

### Phase AA·Z와의 관계

| ID | 선행 감사 | Phase AB (본 묶음) |
|----|-----------|-------------------|
| IMG-025·027 | AA — 누적/그라우트 | — |
| IMG-028·029 | — | **측정 원리·데이터 해석** (초기치·왕복·활동면 추정) |
| IMG-030 | — | **관측공 개방 혼합** vs 필터·차수 |
| IMG-045 | Phase Z 미포함 | **센서별 신호 형식** 분리 |
| IMG-042 | — | **기준망·후시점** (GNSS 아님) |

---

## 1. 신규 심각 오류 10종 (기준표)

| # | 감사 ID | 파일 | 신규 오류 | 수정 방향 | 판정 |
|---|---------|------|-----------|-----------|------|
| 1 | ZIP-AUD-21 | IMG-026 | A/B축이 **화면 좌표** — 현장 방향 미연결 | 굴착·활동·변위 방향 · 홈 정렬 절차 · **AXIS-01** | MAJOR_FIX |
| 2 | ZIP-AUD-22 | IMG-028 | θ **단순 적분** = 누적변위 | 초기 프로파일 · 왕복 · 기준 심도 · 누적오차 · **IPI-MEAS-01** | **REGENERATE** |
| 3 | ZIP-AUD-23 | IMG-029 | 최대 누적변위 깊이 = **활동면** | 집중 구간 vs 추정 구간 · **INTERP-01** | **REGENERATE** |
| 4 | ZIP-AUD-24 | IMG-030 | 관측공 **전 구간 개방** 수위 혼합 | 필터·차수·스크린 · **WELL-01** | MAJOR_FIX |
| 5 | ZIP-AUD-25 | IMG-035 | 하중 전달·편심·프리로드·온도 **누락** | 축 일치 · 반력 순서 · **LOAD-02** | MAJOR_FIX |
| 6 | ZIP-AUD-26 | IMG-040 | LVDT 기준점·축·stroke·브라켓 **누락** | 안정 BM · 측정축 · **LVDT-01** | MAJOR_FIX |
| 7 | ZIP-AUD-27 | IMG-042 | 시준선만 — **기준망·후시점·기상보정** 누락 | 기준/타깃 프리즘 · **ATS-NET-01** | MAJOR_FIX |
| 8 | ZIP-AUD-28 | IMG-044 | 기상계 **임의 설치** · 상관=인과 | 이격·높이 · 보조자료 · **WX-SITE-01** | MAJOR_FIX |
| 9 | ZIP-AUD-29 | IMG-045 | 모든 센서 **동일 입력** | 신호 형식·여자·채널 · **LOGGER-SIG-01** | **REGENERATE** |
| 10 | ZIP-AUD-30 | IMG-046 | 로거 = 게이트웨이 **역할 혼동** | 수집 vs 중계 · **GW-ROLE-01** | MAJOR_FIX |

---

## 2. 우선순위

### 전면 재작성 (P0)

```text
IMG-028 지중경사계 측정 원리도
IMG-029 지중경사계 데이터 해석도
IMG-045 데이터로거 구성도
```

### 중대 부분 수정 (P1)

```text
IMG-026 지중경사계 케이싱 단면도
IMG-030 지하수위계 설치 개념도
IMG-035 하중계 설치 개념도
IMG-040 LVDT 변위계 설치 개념도
IMG-042 자동광파기 계측 개념도
IMG-044 기상계측기 구성도
IMG-046 IoT 게이트웨이 구성도
```

---

## 3. Phase 실행 계획

### Phase AB-1 — REGENERATE 3종 (P0)

| 순위 | ID | nodeId | 산출 |
|------|-----|--------|------|
| AB-1a | IMG-028 | `sensors/inclinometer` | AI+§91 · [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-028_redline_v2_외부PNG.md) | IPI-MEAS-01 |
| AB-1b | IMG-029 | `sensors/inclinometer` | AI+§91 | INTERP-01 |
| AB-1c | IMG-045 | `instruments/datalogger/static` | AI+§91 · [06 로거 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md) | LOGGER-SIG-01 |

### Phase AB-2 — MAJOR_FIX 7종 (P1)

| ID | nodeId | 렌더·참고 |
|----|--------|-----------|
| IMG-026 | `sensors/inclinometer` | 케이싱 단면 — AXIS-01 |
| IMG-030 | `sensors/water-level-meter` | `water_pore_pressure_draw.py` v+1 |
| IMG-035 | `sensors/load-cell` | `load_cell_overview_draw.py` v+1 |
| IMG-040 | `sensors/displacement-transducer` | `render-p2-sensors.py` |
| IMG-042 | `sensors/automated-total-station` | AI/CAD |
| IMG-044 | `sensors/weather-station` | 블록 다이어그램 |
| IMG-046 | `instruments/communication/iot-gateway` | 블록 다이어그램 |

**Exit:** redline 0 · `prohibitedVerified: true` · `audit:images:strict`

### Phase AB-3 — 문서·registry

- [x] 본 문서 · IMAGE_REGENERATION_PROMPTS §AB
- [x] `patch:registry-phase-ab`
- [x] redline v2 10종 · [90 실행](./90-Phase-AB-재작도-실행-체크리스트.md) · [91 복붙](./91-Phase-AB-복붙-프롬프트-정본.md)
- [ ] PNG 교체 · `register:figure` · `npm run sign:phase-ab`
- [ ] `audit:images:strict` · `verify:production`

---

## 4. nodeId 매핑

| ID | nodeId |
|----|--------|
| IMG-026~029 | `sensors/inclinometer` |
| IMG-030 | `sensors/water-level-meter` |
| IMG-035 | `sensors/load-cell` |
| IMG-040 | `sensors/displacement-transducer` |
| IMG-042 | `sensors/automated-total-station` |
| IMG-044 | `sensors/weather-station` |
| IMG-045 | `instruments/datalogger/static` |
| IMG-046 | `instruments/communication/iot-gateway` |

---

## 5. 연계

| 문서 | 용도 |
|------|------|
| [TECHNICAL §0.0d](./TECHNICAL_IMAGE_STANDARD.md) | ZIP-AUD-21~30 · AXIS·IPI·WELL·LOGGER·GW |
| [82-재작도 통합](./82-Figure-재작도-통합-수정계획.md) | 인간 PNG 워크플로 |
| [INSTRUMENTATION §3.3·3.24](./INSTRUMENTATION_DRAWING_RULES.md) | 지중경사계 · 로거 |
