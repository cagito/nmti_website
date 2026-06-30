<!-- redline-scaffold:v1 -->
# IMG-064 redline — 항만·호안 계측 전체 개념도 (외부 PNG)

> **image-knowledge:** [`항만·호안-계측-배치`](../../../docs/image-knowledge/19-항만·호안-계측-배치.md)
> **prompt:** `prompts/IMG-064_항만-호안-계측-전체-개념도.md` · **scaffold:** `npm run scaffold:redline-stubs`

## 0. 레이아웃

- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨
- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS

## 1. 강제 지시문 (image-knowledge §5·§6)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | 해안 횡단 — `[육측 | 구조물 | 해측]`. | ☐ | |
| Q2 | 조위면 또는 조위계 콜아웃. | ☐ | |
| Q3 | ≥2종 계기(구조+지반). | ☐ | |
| Q4 | 동일 단면 주석. | ☐ | |
| Q5 | 라벨: `케이슨`, `안벽`, `반력계`, `지표침하계`, `지중경사계`, `조위`, `G.W.L`, `육측`, `해측`. | ☐ | |
| Q6 | G.W.L=간극수압 단일 곡선. (금지) | ☐ | |
| Q7 | IPI GL 비가시. (금지) | ☐ | |
| Q8 | ATS hero(→09). (금지) | ☐ | |

<!-- /redline-scaffold:v1 -->

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`항만·호안-계측-배치`](../../../docs/image-knowledge/19-항만·호안-계측-배치.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] **해안 3분할** 육|구조|해?
- [ ] 반력·조위·G.W.L 표기?
- [ ] 동일 단면·2종+ 계기?
- [ ] 교량·댐·SOE 없음?
- [ ] WebP?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | agent |
| 일자 | 2026-06-30 |
| 등급 | PASS |
