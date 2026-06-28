<!-- redline-scaffold:v1 -->
# IMG-045 redline — 데이터로거 구성도 (외부 PNG)

> **image-knowledge:** [`데이터로거-계측시스템-구성`](../../../docs/image-knowledge/08-데이터로거-계측시스템-구성.md)
> **prompt:** `prompts/IMG-045_데이터로거_구성도.md` · **scaffold:** `npm run scaffold:redline-stubs`

## 0. 레이아웃

- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨
- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS

## 1. 강제 지시문 (image-knowledge §5·§6)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | 데이터로거 함체 — 회색 직사각 인클로저, LCD·전면 단자 블록(IMG-045). | ☐ | |
| Q2 | 센서 입력 화살표/케이블 ≥2종 — 신호 형식 구분(브리지·4–20mA·디지털 등, 동형 1선 금지). | ☐ | |
| Q3 | 전원 — 12V·배터리 또는 보호함 내 전원 블록. | ☐ | |
| Q4 | 통신 — 유선(RS·이더넷) 또는 무선 → 원격 PC/서버 블록. | ☐ | |
| Q5 | 저장 — 메모리·SD 또는 「자료 저장」 블록. | ☐ | |
| Q6 | Campbell·CR1000X·Gantner·e.bloxx 인쇄. (금지) | ☐ | |
| Q7 | 빈 접속함·범례 박스만. (금지) | ☐ | |
| Q8 | 서버·PC 본체 를 Figure 중앙 hero(로거가 주 피사체). (금지) | ☐ | |

<!-- /redline-scaffold:v1 -->

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`데이터로거-계측시스템-구성`](../../../docs/image-knowledge/08-데이터로거-계측시스템-구성.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] **데이터로거 함체**(LCD·단자)가 중앙 hero?
- [ ] **센서 입력·전원·통신·저장** 4류 표현?
- [ ] 신호 형식 **2종 이상** 구분?
- [ ] **브랜드·CR1000X·서버랙 hero** 없음?
- [ ] **센서·로거·서버** 역할 혼동 없음?
- [ ] WebP·SVG 금지?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | |
| 일자 | |
| 등급 | PASS / REGENERATE |
