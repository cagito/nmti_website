<!-- redline-scaffold:v1 -->
# IMG-011 redline — 교량 계측 전체 개념도 (외부 PNG)

> **image-knowledge:** [`교량-계측시스템-설치`](../../../docs/image-knowledge/14-교량-계측시스템-설치.md)
> **prompt:** `prompts/IMG-011_교량_계측_전체_개념도.md` · **scaffold:** `npm run scaffold:redline-stubs`

## 0. 레이아웃

- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨
- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS

## 1. 강제 지시문 (image-knowledge §5·§6)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | 교량 실루엣(간략) + 센서 ≥1 (설계 항목 표기). | ☐ | |
| Q2 | 데이터로거/수집 + 통신 + 원격 서버(08 연계). | ☐ | |
| Q3 | 「설계도서 위치」 각주. | ☐ | |
| Q4 | (선택) 알람·관리한계 블록. | ☐ | |
| Q5 | 라벨: `센서`, `데이터로거`, `원격 계측`, `관리한계`, `교량`(맥락). | ☐ | |
| Q6 | KCS에 없는 센서 종류 invent. (금지) | ☐ | |
| Q7 | ATS·GNSS 를 교량 기본 hero(목적 불일치 시). (금지) | ☐ | |
| Q8 | 처짐·신축·받침 물리 설치 상세를 본 PDF만 근거로 단정. (금지) | ☐ | |

<!-- /redline-scaffold:v1 -->

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`교량-계측시스템-설치`](../../../docs/image-knowledge/14-교량-계측시스템-설치.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] **특수교량·설계도서** 맥락?
- [ ] 센서+로거+원격 **흐름**?
- [ ] 처짐 단면과 **목적 분리**?
- [ ] 브랜드·임의 센서 없음?
- [ ] WebP?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | |
| 일자 | |
| 등급 | PASS / REGENERATE |
