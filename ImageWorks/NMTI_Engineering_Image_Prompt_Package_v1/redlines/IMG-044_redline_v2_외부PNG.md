<!-- redline-scaffold:v1 -->
# IMG-044 redline — 기상계측기 구성도 (외부 PNG)

> **image-knowledge:** [`기상·환경-보조계측`](../../../docs/image-knowledge/26-기상·환경-보조계측.md)
> **prompt:** `prompts/IMG-044_기상계측기_구성도.md` · **scaffold:** `npm run scaffold:redline-stubs`

## 0. 레이아웃

- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨
- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS

## 1. 강제 지시문 (image-knowledge §5·§6)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | 기상계측기 제목 · 강우·풍속·온습·기압 중 Figure 목적에 해당 항목. | ☐ | |
| Q2 | 장애물 이격 또는 설치 높이 — 점선·callout(예시). | ☐ | |
| Q3 | 보조 자료 · 인과 단정 금지 (018·044 공통). | ☐ | |
| Q4 | (018) 지체(예시) 점선 · 관리기준(예시) — 보편 기준 아님. | ☐ | |
| Q5 | 기상 = 변위 원인 확정 라벨. (금지) | ☐ | |
| Q6 | 고정 지연시간 모든 현장 공통값. (금지) | ☐ | |
| Q7 | 브랜드 기상대 · 실제 노선·공구명. (금지) | ☐ | |

<!-- /redline-scaffold:v1 -->

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`기상·환경-보조계측`](../../../docs/image-knowledge/26-기상·환경-보조계측.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] **보조 자료** · **인과 단정 금지** callout?
- [ ] 강우 **수평** · 풍속 **높이·차폐** 표시?
- [ ] **018** 지체 **예시** · 고정 lag 없음?
- [ ] **브랜드·노선명** 없음?
- [ ] **변위 hero** 를 기상으로 대체하지 않음?
- [ ] WebP · book/ 외 근거 없음?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | |
| 일자 | |
| 등급 | PASS / REGENERATE |
