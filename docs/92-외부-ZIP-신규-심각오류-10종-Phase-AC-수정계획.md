# 외부 ZIP 전수검수 — 신규 심각 오류 10종 (Phase AC) 및 수정계획

**수립:** 2026-06-22  
**근거:** 외부 공학 검수 **4차 묶음** — 기존 **50종**(감사 25·28·30 + Phase Z + AA + AB)과 **비중복**  
**성격:** **계측 원리·측정 기준·센서 해석 로직** 오류 — 「설치 위치」보다 **한 단계 깊은** 개념 붕괴  
**상위:** [84-Phase AB](./84-외부-ZIP-신규-심각오류-10종-Phase-AB-수정계획.md) · [IMAGE_REGENERATION_PROMPTS §Phase AC](./IMAGE_REGENERATION_PROMPTS.md)

> **한 줄:** 여러 계측을 한 단면에 넣었으나 **기준점·측점·측선·해석 단계**가 분리되지 않은 10 Figure — **8종 전면 재작성 · 2종 중대 수정**.

---

## 0. Executive summary

| 구분 | 내용 |
|------|------|
| 검수 묶음 | ZIP 207종 중 **4차 선별 10종** (앞선 50종과 비중복) |
| 신규 심각 오류 | **10건** (`ZIP-AUD-31` ~ `ZIP-AUD-40`) |
| **REGENERATE** | IMG-007 · 019 · 023 · 024 · 033 · 059 · 079 · 081 |
| **MAJOR_FIX** | IMG-031 · 036 |
| 핵심 위험 Top 4 | **024** (누수=제체 내부 센서) · **033** (자석링 원리 오해) · **081** (RF=절대 기준 축소) · **059** (관리기준 일반화) |
| registry | `npm run patch:registry-phase-ac` → `requiresReaudit: true` |
| 프롬프트 | [93-복붙 정본](./93-Phase-AC-복붙-프롬프트-정본.md) · [IMAGE_REGENERATION_PROMPTS §Phase AC](./IMAGE_REGENERATION_PROMPTS.md) |
| 실행 | [94-체크리스트](./94-Phase-AC-재작도-실행-체크리스트.md) · **[96-통합 실행계획](./96-Phase-AC-통합-수정-실행계획.md)** |

### 선행 감사와의 관계 (중복 아님)

| ID | 선행 지적 | Phase AC (본 묶음) |
|----|-----------|-------------------|
| IMG-007 | — | 터널 **전체** — 측점·측선·기준점 **미분리** |
| IMG-008 | Z — 내공 연속 튜브 | 007은 **개념도** — 천단·내공·지중·록볼트 **혼재** |
| IMG-009 | Z — 숏크리트 부유 | **079** — 국부 응력 vs **지반압 전체** 혼동 |
| IMG-024 | 32·39 — DAM-01~03 그래프·침윤 | **누수량=제체 내부 센서** (배수계통 계측) |
| IMG-030 | AB — 관측공 개방 | **031** — piezo **필터·차수** 불명 (standpipe 혼동) |
| IMG-019 | — | 성토 단계·압밀·측방유동 **판단 기준** 없음 |

**공통 원칙 MEAS-PRIN-01:** Figure에서 **계측 항목별** 기준점·측점·측선·단위·해석 단계를 **분리** 표기 — 하나의 센서가 **전체 거동을 대표**하는 것처럼 그리지 않는다. [TECHNICAL §0.0d](./TECHNICAL_IMAGE_STANDARD.md)

---

## 1. 신규 심각 오류 10종 (기준표)

| # | 감사 ID | 파일 | 신규 심각 오류 | 수정 방향 | 판정 |
|---|---------|------|----------------|-----------|------|
| 1 | ZIP-AUD-31 | IMG-007 | 지중변위·록볼트·내공·천단을 한 단면에 넣었으나 **기준점·측점·측선 미분리** | 항목별 측정 대상·방향·단위 분리 · TUN-MEAS-01 | **REGENERATE** |
| 2 | ZIP-AUD-32 | IMG-019 | 성토·piezo·측방 **개념/흐름** — **실제 설치 배치도 아님** | 계측관리계획서 2D 배치 · **SOFT-LAYOUT-01** · [109](./109-IMG-019-연약지반-성토부-계측기-설치-배치도-표현-표준.md) | **REGENERATE** |
| 3 | ZIP-AUD-33 | IMG-023 | 레일·노반·진동·지반 변위 **혼합** — 궤도틀림·노반침하·구조물 변위 미구분 | 궤도/도상/노반/지반 분리 · RAIL-MEAS-01 | **REGENERATE** |
| 4 | ZIP-AUD-34 | IMG-024 | 누수·침투를 **제체 내부 센서**처럼 표현 | 누수량=드레인·집수정·위어·유량계 · DAM-LEAK-01 | **REGENERATE** |
| 5 | ZIP-AUD-35 | IMG-031 | 필터·그라우트·차수 불명 — **관측공 수위계**처럼 보임 | 필터·차수·특정 심도 piezo · EXC-03 | MAJOR_FIX |
| 6 | ZIP-AUD-36 | IMG-033 | 자석링·기준관·프로브 **역할 모호** | 링=지층 동행 · 프로브=탐지 · MAG-RING-01 | **REGENERATE** |
| 7 | ZIP-AUD-37 | IMG-036 | 변형률→**즉시 응력 판정**처럼 단순화 | 부착방향·온도보정·중립축·E·게이지 위치 · STRAIN-01 | MAJOR_FIX |
| 8 | ZIP-AUD-38 | IMG-079 | 숏크리트계=**지반압 전체 평가** | 국부 응력·변형 · 지보재별 분리 · SHOT-LOC-01 | **REGENERATE** |
| 9 | ZIP-AUD-39 | IMG-081 | RF층=**모든 층 축소 직접 산정** | 탄성·크리프·건조수축·시공단계 · COL-SHRINK-01 | **REGENERATE** |
| 10 | ZIP-AUD-40 | IMG-059 | 센서별 관리기준 **단일 표·로직** | 항목별 방향·속도·누적·단계 · THRESH-01 | **REGENERATE** |

---

## 2. 우선순위

### 즉시 전면 재작성 (P0)

```text
IMG-024 댐 계측 — 누수=배수계통 (DAM-LEAK-01)
IMG-033 층별침하계 — 자석링 원리 (MAG-RING-01)
IMG-081 기둥 축소량 — 시공·재령·크리프 (COL-SHRINK-01)
IMG-059 관리기준 설정 — 항목별 기준 (THRESH-01)
```

### 전면 재작성 (P0~P1)

```text
IMG-007 터널 계측 전체 개념도
IMG-019 연약지반 계측 전체 개념도
IMG-023 철도 노반 계측 개념도
IMG-079 숏크리트 응력·변형 계측 개념도
```

### 중대 부분 수정 (P1)

```text
IMG-031 간극수압계 설치도
IMG-036 변형률계 설치 개념도
```

### 다음 검수 후보 (본 10종보다 상대적 경도 낮음)

```text
IMG-037 균열계 설치 개념도
IMG-038 구조물 경사계 설치도
IMG-039 신축계 설치 개념도
```

---

## 3. Phase 실행 계획

### Phase AC-1 — REGENERATE 8종

| 순위 | ID | nodeId | 표준·계획 |
|------|-----|--------|-----------|
| AC-1a | IMG-024 | `fields/dam` | [32](./32-IMG-024-댐-계측-개념도-오류분석-및-재작업-계획.md) · [39](./39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md) · DAM-LEAK-01 |
| AC-1b | IMG-033 | `sensors/settlement-gauge` | [95 §6](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md) · MAG-RING-01 |
| AC-1c | IMG-081 | `fields/building` | [95 §9](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md) · COL-SHRINK-01 |
| AC-1d | IMG-059 | `instruments/modes` 등 | [95 §10](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md) · THRESH-01 |
| AC-1e | IMG-007 | `fields/tunnel` | [95 §1](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md) · TUN-MEAS-01 |
| AC-1f | IMG-019 | `fields/soft-ground` | [95 §2](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md) · [109 설치배치](./109-IMG-019-연약지반-성토부-계측기-설치-배치도-표현-표준.md) · SOFT-LAYOUT-01 |
| AC-1g | IMG-023 | `fields/railway` | [95 §3](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md) · RAIL-MEAS-01 |
| AC-1h | IMG-079 | `fields/tunnel/shotcrete` | [22](./22-IMG-079-숏크리트-응력-변형-오류분석-및-재작업-계획.md) · SHOT-LOC-01 |

### Phase AC-2 — MAJOR_FIX 2종

| ID | nodeId | 작업 |
|----|--------|------|
| IMG-031 | `sensors/piezometer` | 필터·차수·WELL 대조 |
| IMG-036 | `sensors/strain-gauge` | STRAIN-01 라벨·온도보정 |

**Exit:** `reviewGrade: PASS` · `requiresReaudit: false` · `npm run audit:images:strict`

---

## 4. 연계 문서

| 문서 | 역할 |
|------|------|
| [93-복붙 프롬프트](./93-Phase-AC-복붙-프롬프트-정본.md) | AI·CAD 복붙 정본 |
| [94-실행 체크리스트](./94-Phase-AC-재작도-실행-체크리스트.md) | PNG·서명 |
| [95-IMG별 계획](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md) | 10종 exit criteria |
| [96-통합 실행계획](./96-Phase-AC-통합-수정-실행계획.md) | **4스프린트·의존성·마일스톤** |
| [82-재작도 통합](./82-Figure-재작도-통합-수정계획.md) | Phase AC 로드맵 |

---

## 5. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-22 | Phase AC 4차 묶음 10종 — 계측 원리·해석 로직 중심 |
