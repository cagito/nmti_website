<!-- redline-scaffold:v1 -->
# IMG-040 redline — 변위계 설치 개념도 (외부 PNG)

> **image-knowledge:** [`변위·광학계측-표현-기준`](../../../docs/image-knowledge/09-변위·광학계측-표현-기준.md)
> **prompt:** `prompts/IMG-040_변위계_설치_개념도.md` · **scaffold:** `npm run scaffold:redline-stubs`

## 0. 레이아웃

- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨
- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS

## 1. 강제 지시문 (image-knowledge §5·§6)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | 목적 1종 변위 수단만 hero: 와이어/LVDT 또는 광학망 또는 침하계. | ☐ | |
| Q2 | 센서형: 고정부·이동부 · 변위 방향 화살표 · 앵커·브래킷. | ☐ | |
| Q3 | 광학형(042): 기준점 · 시준선 · 프리즘 측점 · 광파기(삼각대) · ΔX·ΔY. | ☐ | |
| Q4 | 터널 수동 맥락(부조): 천단핀·내공핀 + 타겟 + 광파기 — 「수동 측량」 콜아웃. | ☐ | |
| Q5 | 라벨: `변위계`, `와이어식 변위계`, `LVDT`, `프리즘`, `기준점`, `광파기`, `자동광파기`(042만). | ☐ | |
| Q6 | ATS 를 처짐·신축·받침·사면 일반 hero. (금지) | ☐ | |
| Q7 | 프리즘 없이 광파기만 · 시준선 없이 절대좌표 단정. (금지) | ☐ | |
| Q8 | 침하핀 을 지표침하계(센서) 와 동일. (금지) | ☐ | |

<!-- /redline-scaffold:v1 -->

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`변위·광학계측-표현-기준`](../../../docs/image-knowledge/09-변위·광학계측-표현-기준.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] Figure 목적이 **센서 변위** 또는 **광학망** 하나로 고정?
- [ ] ATS가 **042·광학 목적**이 아닌데 hero 아님?
- [ ] 프리즘·기준점·시준(광학 시) 또는 고정·이동점(센서 시) 포함?
- [ ] 로거 직결·침하핀 혼동 없음?
- [ ] 브랜드 프리즘·모델명 제거?
- [ ] WebP?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | |
| 일자 | |
| 등급 | PASS / REGENERATE |
