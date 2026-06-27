# IMG-091 redline v2 — 다점지중변위계 MPBX (외부 PNG)

**대상:** `sensors/borehole-extensometer` hero · FT-A  
**정본:** [docs/36 §4.5⑨](../../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · [INSTRUMENTATION §3.29](../../../docs/INSTRUMENTATION_DRAWING_RULES.md) · MPX-01~03  
**프롬프트:** [IMG-091](../prompts/IMG-091_다점지중변위계_MPBX_설치_개념도.md) v3  
**선행:** [sprint0](./IMG-089-093_sprint0_redline_v1_외부PNG.md)

---

## P0 — MPBX 정체성 (MPX-01~03)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| M1 | **단일 보링** cutaway (암반·대절토) | ☐ | 평면 나열 |
| M2 | **3점 이상** measuring rods — **길이 상이** | ☐ | 단일 막대 |
| M3 | 각 rod **기계식 앵커** at depth | ☐ | 앵커 없음 |
| M4 | **Head block** — rod별 LVDT/변위계 | ☐ | head 없음 |
| M5 | **≠ 센서형 다단식 지중경사계** (4홈·휠) | ☐ | IPI 혼동 |
| M6 | **≠ 신축계(039)** — 교량 이음부 gap | ☐ | bridge EJ |

## P1 — 측정·케이블

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| D1 | 깊이별 **상대 변위** 화살표 | ☐ | 수평만·미표기 |
| D2 | rod = **인장** 축 방향 변위 (앵커 기준) | ☐ | 침하핀형 |
| C1 | (선택) head → **현장 계측함** — P0-3 | ☐ | 서버 흐름 |

## P0-2 — 관로 (해당 시)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| G1 | 보링 **지표면(GL)에서 연속** | ☐ | 중간에서만 시작 |
| G2 | 지표 **well cap** 표기 | ☐ | 끊김 |

## 해상도·금지

- [ ] ≥ 1920×1080 · 2D CAD · **한글 라벨** `다점지중변위계`
- [ ] 3D 암반 질감·뇌 **없음**
- [ ] Pillow·SVG **금지** (재작도)

## 서명

| 항목 | 값 |
|------|------|
| 검수자 | |
| 일자 | |
| 등급 | PASS / REGENERATE |
