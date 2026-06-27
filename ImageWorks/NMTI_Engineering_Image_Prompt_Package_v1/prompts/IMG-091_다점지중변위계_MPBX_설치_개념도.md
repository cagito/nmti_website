# IMG-091 — 다점지중변위계 (MPBX) 설치 개념도

> **정본:** [docs/36 §4.5⑨](../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · [redline v2](../redlines/IMG-091_redline_v2_외부PNG.md) · [INSTRUMENTATION §3.29](../../docs/INSTRUMENTATION_DRAWING_RULES.md) · MPX-01~03  
> **Pillow·에이전트 SVG 금지** — 인간 CAD 또는 AI+§36+**인간 검수** → PNG ≥1920×1080

## 메타

| 항목 | 값 |
|------|-----|
| ID | IMG-091 |
| 제목 | 다점지중변위계 (MPBX) 설치 개념도 |
| nodeId | `sensors/borehole-extensometer` |
| 용도 | 암반·대절토 보링 내 다점 상대변위 측정 |

---

## 강제 지시문 (프롬프트 맨 위 — 필수)

```text
이 그림의 계측 목적은 단 하나다: 다점지중변위계(MPBX)로 보링 내 깊이별 상대 변위를 측정한다.
단일 천공에 길이가 다른 3개 이상 강봉과 깊이별 기계식 앵커를 그린다.
공두부 head block에 rod별 변위계(LVDT)를 배치한다.
센서형 다단식 지중경사계(4홈 casing·프로브 휠)를 그리지 않는다.
교량 신축계(039) 이음부 변위계를 그리지 않는다.
보링은 지표면(GL)에서 연속하고 well cap을 표시한다.
틀릴 것 같으면 그리지 말고 별도 그림으로 분리한다.
```

---

## 이미지 목적

**다점지중변위계(MPBX)** — 단일 천공 내 **깊이별 앵커** 고정 **강봉** → 공두부 **LVDT**로 암반·지반 상대 이격 측정.

## 필수 포함

- 단일 **보링 cutaway** (암반 또는 토사층)
- **3개 이상** measuring rods — 길이 상이 · **기계식 앵커** at depth
- **Head block** — rod별 디지털 변위계
- 깊이별 상대 변위 화살표
- 지표면 · **well cap**

## 금지 (치명)

- **지중경사계** — 4홈 casing · probe wheels
- **신축계(039)** — 교량 이음부
- 단일 막대만 (다점 앵커 없음)
- 3D·뇌·실사 암반 질감

## Negative Prompt

inclinometer, casing keyways, probe wheels, bridge expansion joint, settlement pin only, single rod only, brain, 3D rock texture, cartoon

---

## 최종 생성 프롬프트 (v3)

**Prefix:** docs/36 §1.0 P0 + §2.1 · **nodeId:** `sensors/borehole-extensometer`

```text
[강제 지시문 — 위 블록 전체]

Borehole cutaway — multi-point borehole extensometer (MPBX) in fractured rock or deep cut slope soil. Ground surface (GL) with well cap; borehole continuous from GL.

Single borehole: three or more steel measuring rods of different lengths, each fixed to mechanical anchor at different depths. Head block at surface with digital displacement transducer per rod. Relative displacement arrows between anchor depths.

Korean label: 다점지중변위계. NOT inclinometer casing with keyways or probe wheels. NOT bridge expansion joint meter.

2D technical documentation style, white background, 1920x1080. No brain, no 3D rock photo texture.
```

<!-- citation-sync:v1 -->
## 근거 기준

> **노드:** `sensors/borehole-extensometer` · 레지스트리: `book/kds-kcs-citation-registry.json`

- **KDS 11 10 15:2025**「지반계측」 표 4.1-1 — 계측기 분류·용도 (국가건설기준센터(KCSC))
- **KCS 11 10 15:2025**「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 (국가건설기준센터(KCSC))

※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.
<!-- /citation-sync:v1 -->
