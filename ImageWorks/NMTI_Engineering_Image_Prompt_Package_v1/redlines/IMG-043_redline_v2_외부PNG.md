<!-- redline-scaffold:v1 -->
# IMG-043 redline — GNSS 변위 계측 개념도 (외부 PNG)

> **image-knowledge:** [`GNSS-변위-계측`](../../../docs/image-knowledge/07-GNSS-변위-계측.md)
> **prompt:** `prompts/IMG-043_GNSS_변위_계측_개념도.md` · **scaffold:** `npm run scaffold:redline-stubs`

## 0. 레이아웃

- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨
- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS

## 1. 강제 지시문 (image-knowledge §5·§6)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | 기준국 + 이동국 ≥2 + GNSS 안테나 각각. | ☐ | |
| Q2 | 중앙 서버 블록. | ☐ | |
| Q3 | 무선 통신 화살표(안테나/수신기 → 서버). | ☐ | |
| Q4 | 3D 변위 벡터(ΔX·ΔY·ΔZ 또는 동·북·수직). | ☐ | |
| Q5 | 위성 간단 도식(선택). | ☐ | |
| Q6 | EGE·EGM-200·NavStar·GMS800·가격·연락처 (p.3–4). (금지) | ☐ | |
| Q7 | 무선침하계 를 GNSS 동의어로 — p.2 혼재 설명이나 Figure는 GNSS 안테나 중심. (금지) | ☐ | |
| Q8 | AI 분석·앱 화면 hero (p.5). (금지) | ☐ | |

<!-- /redline-scaffold:v1 -->

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`GNSS-변위-계측`](../../../docs/image-knowledge/07-GNSS-변위-계측.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] **기준국+이동국+서버+3D 변위** 포함?
- [ ] **제조사·모델·가격·앱 UI** 제거?
- [ ] **프리즘·광파기** 없음?
- [ ] 기준국이 **안정 외부**?
- [ ] WebP·SVG 금지?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | |
| 일자 | |
| 등급 | PASS / REGENERATE |
