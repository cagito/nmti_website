# IMG-043 — GNSS 변위 계측 개념도 (v5 ai-reviewed)

> **판정:** **v5 PASS (ai-reviewed)** — Pillow R1 sprint · book/GNSS.pdf · ZIP-AUD-07

> **AI (docs/36):** [§4.5⑧](../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · Prefix §2.1


<!-- image-knowledge-links:v1 -->
> **image-knowledge:** [00-공통](../../../docs/image-knowledge/00-공통-이미지-작성-원칙.md) · [GNSS-변위-계측](../../../docs/image-knowledge/07-GNSS-변위-계측.md)
<!-- /image-knowledge-links:v1 -->

> **필수 참고:** [book/GNSS.pdf](../../../book/GNSS.pdf) · [07_GNSS_이미지_가이드.md](../07_GNSS_이미지_가이드.md)  
> 규칙: [INSTRUMENTATION_DRAWING_RULES.md](../../../docs/INSTRUMENTATION_DRAWING_RULES.md) §3.13

## 메타

| 항목 | 값 |
|------|-----|
| ID | IMG-043 |
| 제목 | GNSS 변위 계측 개념도 |
| 용도 | `sensors/gnss` hero |
| PDF | `book/GNSS.pdf` p.2 시스템 구성 · p.3 RTK/다중위성 · p.5 원격 모니터링 |

## 이미지 목적

GNSS **기준국·이동국·안테나·중앙 서버·무선 통신**과 **3D 변위** 원리를 한 장에 표현.  
`book/GNSS.pdf`의 스마트 메가포트 침하관리 시스템 도식을 **NMTI 중립 CAD 스타일**로 재해석 (제조사 로고·모델명·가격 금지).

## PDF 반영 필수 요소

| # | 요소 | 규칙 |
|---|------|------|
| 1 | **기준국** | 변형 영향권 **밖** 안정 지반·암반, 고정 GNSS 안테나 |
| 2 | **이동국** | 계측 대상(사면·댐 크레스트·교량 등) **2점 이상** — #1, #2, #3 |
| 3 | **GNSS 안테나** | 기준국·각 이동국에 명확히 (광파기·프리즘 X) |
| 4 | **RTK/차분** | **보정정보 통신** (위성 신호와 구분 — 시준 점선 금지) 또는 "차분 GNSS" |
| 5 | **무선 통신** | LTE/무선 화살표 → **중앙 서버**(데이터 수집·분석) |
| 6 | **3D 변위** | 이동국에서 ΔX·ΔY·ΔZ (또는 동·북·수직) 벡터 |
| 7 | **전원**(선택) | 태양광·배터리 — 원격 무인 계측 표현 |
| 8 | **위성**(도식) | GPS/GLONASS/BeiDou 등 궤도 또는 신호선 — 과도한 사실 렌더 금지 |

## 구도

- **좌 65%:** 단면 또는 3D 개략도 — 사면/댐/교량 중 **하나** + 기준국(부동) + 이동국 측점
- **우 35%:** 블록 다이어그램 — 안테나 → 수신기 → 무선 → 중앙 서버 (PDF p.2 유사)
- 16:9, 1920×1080, 흰 배경, `00_STYLE_GUIDE.md`

## 금지

- 기준국을 계측 대상 위에 배치
- EGE·EGM-200·제조사 로고·가격·연락처
- 자동광파기·프리즘·CCTV·스마트폰
- 사람·실사 현장·3D 네온
- 기준국 없는 단일 안테나만

## Negative Prompt

total station, prism, laser scanner, smartphone GPS, manufacturer logo, product photo, EGE, EGM-200, price, cartoon, human, neon 3D, brain, real place names

## 최종 생성 프롬프트 (v2 — docs/36 §4.5⑧)

**Prefix:** docs/36 §2.1 · **nodeId:** `sensors/gnss` · **실패:** docs/36 §5

GNSS base station antenna on stable monument and rover antenna on monitoring point. Radio link, coordinate displacement vectors. See book/GNSS.pdf style. Korean: 기준국, 이동국. No brain, white schematic.

## 최종 생성 프롬프트 (v2 — docs/36 §4.5⑧)

**Prefix:** docs/36 §2.1 · **nodeId:** `sensors/gnss` · **실패:** docs/36 §5

GNSS base station antenna on stable monument and rover antenna on monitoring point. Radio link, coordinate displacement vectors. See book/GNSS.pdf style. Korean: 기준국, 이동국. No brain, white schematic.

<!-- citation-sync:v1 -->
## 근거 기준

> **노드:** `sensors/gnss` · 레지스트리: `book/kds-kcs-citation-registry.json`

- **KDS 11 10 15:2025**「지반계측」 표 4.1-1 — 계측기 분류·용도 (국가건설기준센터(KCSC))
- **KCS 11 10 15:2025**「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 (국가건설기준센터(KCSC))

※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.
<!-- /citation-sync:v1 -->

<!-- image-rules-sync:v1 -->
## 실행 규칙

> **book/image-knowledge:** `docs/image-knowledge/07-GNSS-변위-계측.md` · §5·§6

**반드시 그릴 요소:**
- **기준국** + **이동국 ≥2** + **GNSS 안테나** 각각.
- **중앙 서버** 블록.
- **무선 통신** 화살표(안테나/수신기 → 서버).
- **3D 변위** 벡터(ΔX·ΔY·ΔZ 또는 동·북·수직).
- **위성** 간단 도식(선택).
- **태양광** (원격 계측 표현, 선택).
- 라벨: `기준국`, `이동국`, `GNSS 안테나`, `중앙 서버`, `3D 변위`.

**절대 금지:**
- EGE·EGM-200·NavStar·GMS800·**가격·연락처** (p.3–4).
- **무선침하계** 를 GNSS **동의어**로 — p.2 혼재 설명이나 **Figure는 GNSS 안테나** 중심.
- **AI 분석·앱 화면** hero (p.5).
- **KCS ±1.0 mm** 를 **모든 GNSS** 에 단정(p.4 표 각주 — **특정 제품** 맥락).
<!-- /image-rules-sync:v1 -->

## Phase Z (ZIP-AUD-07)

- 위성 → 기준국 · 위성 → 이동국
- 기준국→이동국 = **보정정보 통신** (광파 시준선 금지)
- 결과: **ΔE·ΔN·ΔU**
