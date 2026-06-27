# 어스앵커 하중계 — ANC-CLOCK 시계방향 사선 정본

**등록:** 2026-06-22  
**분야:** 흙막이·가시설 계측 — `fields/retaining-excavation`  
**상위 규칙:** [54-IMG-004 §4 ANC-AXIS](./54-IMG-004-어스앵커-하중계-설치-표현-표준.md) · [INSTRUMENTATION §3.2](./INSTRUMENTATION_DRAWING_RULES.md)  
**연계:** [82-상부지보·앵커축](./82-흙막이-상부지보·앵커축-엄격-수정-요구.md) · [52-IMG-002](./52-IMG-002-전면재작성-프롬프트-정본.md)

> **한 줄:** 강연선(PC strand)이 **7시 방향(← 배면)** 이면, 하중계 장축도 **1시~7시 사선**이다. **수평(3시~9시) 하중계 = 버팀보 LC 오류 = REGENERATE.**

---

## 1. ANC-CLOCK 규칙 (필수)

### 1.1 시계방향 기준 (단면도 관례)

좌→우 = `배면 지반 | 벽체 | 굴착측` 일 때, 시계는 **벽체·앵커 두부를 중심**으로 읽는다.

```text
           12시 (수직↑)
      9시           3시 (굴착측→)
           6시 (수직↓)

강연선·PC strand 정착 방향 = 7시 (좌하 · ← 배면 지반)
하중계 장축(도넛형 LC 중심축) = 1시 ~ 7시 사선 (앵커 축과 동일)
```

| 요소 | 시계방향 | 공학 의미 |
|------|----------|-----------|
| **강연선·PC strand** | **7시** (← 배면·안정 지반) | tie-back **정착** 방향 |
| **하중계 장축** | **1시 ~ 7시** (사선) | 앵커 축과 **동축** — **압축 반력 P** 방향 |
| **버팀보 하중계** | **3시 ~ 9시** (수평) | **앵커 LC에 적용 금지** |

### 1.2 영문 원문 (Strict Engineering — 보존)

> If the anchor strand is oriented toward **7 o'clock** (into the backfill / stable ground), the load cell must be oriented on the **diagonal from 1 o'clock to 7 o'clock** — **coaxial with the anchor axis**.  
> The load cell is **NOT horizontal** (not 3 o'clock–9 o'clock like a strut load cell).

### 1.3 프롬프트 붙여넣기 (모든 앵커 LC Figure 맨 위)

```text
[ANC-CLOCK — docs/83 필수]
강연선(PC strand)이 7시 방향(배면·안정 지반)이면 하중계 장축은 1시~7시 사선이다.
하중계는 수평(3시~9시)이 아니다. 버팀보 하중계처럼 그리면 전체 폐기.
반력판·도넛형 하중계·웨지헤드·강연선은 동일 사선 축(ANC-AXIS) 위에 배치한다.
```

---

## 2. 금지·올바른 표현

| 금지 (REGENERATE) | 올바른 표현 |
|-------------------|-------------|
| 하중계가 **수평** (3시~9시) | 하중계 **1시~7시 사선** |
| 강연선은 **사선**인데 LC만 **수평** | LC·헤드·강연선 **동일 사선** |
| 앵커 두부를 **버팀보 LC**와 동일 구도 | 앵커 = **사선 ANC-AXIS** · 버팀보 = **수평** (IMG-003) |
| 강연선 **3시(굴착측)** 방향 | 강연선 **7시(배면)** 방향 |

---

## 3. 영향 Figure 목록 (추출 정본)

> 자동 목록: `npm run list:anc-clock-figures` → [scripts/list-anc-clock-figures.mjs](../scripts/list-anc-clock-figures.mjs)

### 3.1 직접 영향 — 앵커 LC·강연선이 그려지는 PNG (재작도·육안 검수 필수)

| ID | 파일 (technology/) | nodeId / 역할 | ANC-CLOCK 검수 |
|----|-------------------|---------------|----------------|
| **IMG-004** | `IMG-004_어스앵커-하중계-설치-개념도_앵커두부정착구.png` · `IMG-004.webp` | `fields/retaining-excavation/anchor` **히어로** | **정본 Figure** — LC 1시~7시 |
| **IMG-002** | `IMG-002_흙막이-계측-설치-대표-단면도.png` · `IMG-002.webp` | `earth-retaining-wall` **히어로** | ⑥ 앵커 LC + **Anchor Head Detail** = IMG-004와 **동일 사선** |
| **IMG-035** | `IMG-035_하중계-설치-개념도_버팀보앵커하중전달.png` · `IMG-035.webp` | `sensors/load-cell` 개요 | **앵커 패널**만 1시~7시 · 버팀보 패널은 수평 유지 |

### 3.2 간접 영향 — 앵커·지보가 배경에 나올 수 있는 Figure (표시 시 ANC-CLOCK 준수)

| ID | 파일 | nodeId | 비고 |
|----|------|--------|------|
| **IMG-001** | `IMG-001_가시설-계측-전체-개념도_*.png` | `retaining-excavation` 분야 | 앵커/LC 표기 시 사선 |
| **IMG-005** | `IMG-005_주변건물-*.png` | `adjacent-building` | SOE 배경에 앵커 있으면 7시 |
| **IMG-096** | `IMG-096_주변지반-*.png` | `surrounding-ground` | 굴착 영향권 단면 |

### 3.3 대조 Figure (수평 LC가 **올바른** 경우 — 혼동 금지)

| ID | 파일 | 규칙 |
|----|------|------|
| **IMG-003** | `IMG-003_버팀보-하중계-*.png` | 버팀보 LC = **수평(3시~9시)** — 앵커에 **복사 금지** |

### 3.4 앵커 LC 혼동 **금지** (참고)

| ID | 사유 |
|----|------|
| IMG-105 · IMG-106 | 교량 **케이블장력** — 어스앵커 LC 아님 |
| IMG-004 (rejected legacy) | IMG-085 등 폐기 Figure |

### 3.5 콘텐츠·SEO 교차 참조 (PNG 자체는 위 ID)

| 위치 | 참조 Figure |
|------|-------------|
| `earth-retaining-wall` 갤러리 | IMG-002, IMG-004, IMG-062, IMG-003, IMG-005 |
| `anchor` 리프 | IMG-004 히어로 |
| `sensors/load-cell` | IMG-035, IMG-004, IMG-003 |

---

## 4. 검수 체크리스트 (ANC-CLOCK 4항)

- [ ] 강연선·PC strand = **7시(← 배면)** — **3시(굴착측) 아님**
- [ ] 하중계 장축 = **1시~7시 사선** — **수평 아님**
- [ ] 반력판 ⊥ 축 · LC·헤드·강연선 **동축**
- [ ] 버팀보 LC(IMG-003)와 **구도 혼동 없음**

---

## 5. 문서 반영 위치 (전체)

| 문서 | 반영 |
|------|------|
| [54 §4.2](./54-IMG-004-어스앵커-하중계-설치-표현-표준.md) | ANC-CLOCK 상세 |
| [51 §2.6.1 ANC-11](./51-계측-도면-검수-공통-원칙.md) | 절대 규칙 |
| [INSTRUMENTATION §3.2](./INSTRUMENTATION_DRAWING_RULES.md) | 사선 축 요약 |
| [52](./52-IMG-002-전면재작성-프롬프트-정본.md) · [82](./82-흙막이-상부지보·앵커축-엄격-수정-요구.md) · [19](./19-IMG-002-흙막이-계측-대표-단면도-오류분석-및-재작업-계획.md) | ⑥ 앵커 |
| [26](./26-IMG-004-어스앵커-하중계-오류분석-및-재작업-계획.md) | 오류 분석 |
| [14](./14-흙막이-굴착-계측-개념도-AI-생성-가이드라인.md) · [36](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) | AI 블록 |
| [IMAGE_AUDIT §2.5c·2.5d](./IMAGE_AUDIT_CHECKLIST.md) | 검수 |
| [IMG-004 prompt](../ImageWorks/.../IMG-004_어스앵커_하중계_설치_개념도.md) · [IMG-002 prompt](../ImageWorks/.../IMG-002_흙막이_벽체_계측_배치도.md) | 강제 지시문 |
| [AGENTS.md](../AGENTS.md) | 에이전트 규칙 |

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-22 | ANC-CLOCK(1시~7시 LC · 7시 강연선) 정본 · 영향 Figure 3+3+1 추출 |
