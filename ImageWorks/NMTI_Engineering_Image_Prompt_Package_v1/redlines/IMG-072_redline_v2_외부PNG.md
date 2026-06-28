<!-- redline-scaffold:v1 -->
# IMG-072 redline — 원격 자동계측 개념도 (외부 PNG)

> **image-knowledge:** [`통신·게이트웨이-역할`](../../../docs/image-knowledge/29-통신·게이트웨이-역할.md)
> **prompt:** `prompts/IMG-072_원격_자동계측_개념도.md` · **scaffold:** `npm run scaffold:redline-stubs`

## 0. 레이아웃

- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨
- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS

## 1. 강제 지시문 (image-knowledge §5·§6)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | 순서 화살표: 계측 센서 → 데이터로거 → IoT 게이트웨이 → 서버. | ☐ | |
| Q2 | 로거: 「수집·저장·1차 변환」 · 함체 실루엣(P0-3). | ☐ | |
| Q3 | GW: 「중계·변환·재전송」 · 버퍼 (로컬 저장과 구분). | ☐ | |
| Q4 | 시간 동기 · GW ≠ 판정 callout. | ☐ | |
| Q5 | (048) LTE · (058) 전원·통신·모드 계층. | ☐ | |
| Q6 | 뇌·AI 회로 · 사이버펑크 구름. (금지) | ☐ | |
| Q7 | 빈 접속함 = 로거. (금지) | ☐ | |
| Q8 | 게이트웨이 = 데이터로거 라벨. (금지) | ☐ | |

<!-- /redline-scaffold:v1 -->

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`통신·게이트웨이-역할`](../../../docs/image-knowledge/29-통신·게이트웨이-역할.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] **센서→로거→GW→서버** 순서?
- [ ] **로컬 저장 vs GW 버퍼** 구분?
- [ ] **GW ≠ 관리기준 판정**?
- [ ] **시간 동기** 표시?
- [ ] **뇌·구름·브랜드** 없음?
- [ ] WebP only?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | |
| 일자 | |
| 등급 | PASS / REGENERATE |
