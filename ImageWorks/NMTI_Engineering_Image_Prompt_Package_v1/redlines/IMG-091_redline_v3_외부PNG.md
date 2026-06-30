# IMG-091 redline v3 — 다점지중변위계 (MPBX)

**대상:** `sensors/borehole-extensometer` hero · FT-A  
**정본:** [docs/146](../../../docs/146-IMG-091-MPBX-설치-개념도-표현-표준.md) · [25-MPBX](../../../docs/image-knowledge/25-MPBX·지중변위-표현.md)  
**프롬프트:** [IMG-091](../prompts/IMG-091_다점지중변위계_MPBX_설치_개념도.md) v4

---

## P0 — MPBX 형상 (MPX-01~03 · BORE-GL-01)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | **GL** · **well cap** · 천공축 가시 | ☐ | cap 누락 |
| Q2 | **≥2~3 anchor** · **rod** · **head block** | ☐ | 단일 강봉 |
| Q3 | **축방향** 변위 화살표(Teal) | ☐ | 수평만 |
| Q4 | 라벨: `다점지중변위계`, `앵커`, `로드`, `헤드`, `지표면` | ☐ | 지중경사계 |
| Q5 | **4홈 IPI casing** · 프로브 휠 (MPX-01) | ☐ | IPI 실루엣 |
| Q6 | **신축이음·039** (MPX-02) | ☐ | 교량 이음 |
| Q7 | 터널 **내공·천단** | ☐ | 터널 단면 hero |

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`MPBX·지중변위-표현`](../../../docs/image-knowledge/25-MPBX·지중변위-표현.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] **IPI casing·프로브** 없음?
- [ ] **≥2 anchor**·**rod·head**?
- [ ] **GL·well cap** 가시?
- [ ] **039·신축** 없음?
- [ ] WebP only?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | agent |
| 일자 | 2026-06-29 |
| 등급 | PASS |
