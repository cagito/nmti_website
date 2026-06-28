<!-- redline-scaffold:v1 -->
# IMG-021 redline — 측방유동 계측도 (외부 PNG)

> **image-knowledge:** [`지하굴착-흙막이-계측-단면`](../../../docs/image-knowledge/03-지하굴착-흙막이-계측-단면.md)
> **prompt:** `prompts/IMG-021_측방유동_계측도.md` · **scaffold:** `npm run scaffold:redline-stubs`

## 0. 레이아웃

- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨
- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS

## 1. 강제 지시문 (image-knowledge §5·§6)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | 「지표면」 · 현재 굴착면(또는 굴착심도 주석). | ☐ | |
| Q2 | 흙막이 벽체 (유형은 일반화: 연속벽 / 말뚝+판 등 `현장 조건`). | ☐ | |
| Q3 | 배면 지반 + 굴착측 공동. | ☐ | |
| Q4 | 지중경사계 천공(배면, 0.5 m 이격 콜아웃). | ☐ | |
| Q5 | 지하수위계·간극수압계 — 별도 관측공 표현(동일 긴 우물 금지). | ☐ | |
| Q6 | PDF 근거 없이 「배면 지반 | 벽체 | 굴착측」 3영역 강제 분할을 KDS/KCS 인용처럼 표기(다른 repo 규칙과 혼동 … (금지) | ☐ | |
| Q7 | G.W.L = 간극수압 단일 수위선. (금지) | ☐ | |
| Q8 | 앵커 LC 수평 배치(축 비수직). (금지) | ☐ | |

<!-- /redline-scaffold:v1 -->

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`지하굴착-흙막이-계측-단면`](../../../docs/image-knowledge/03-지하굴착-흙막이-계측-단면.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] Figure 목적이 **흙막이 계측 배치** 하나로 고정(또는 하중계 등 단일 목적 분리)되었는가?
- [ ] KCS 3.10.3.1의 **설치 위치** 규칙과 모순되지 않는가?
- [ ] 지하수위·간극수압·G.W.L 혼동이 없는가?
- [ ] 앵커·버팀보 LC가 **굴착측 두부**인가?
- [ ] PDF에 없는 3분할·브랜드·장비명을 넣지 않았는가?
- [ ] 굴착심도·지표면이 표시되었는가?
- [ ] WebP 출력·SVG/PNG 운영본 금지를 지시했는가?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | |
| 일자 | |
| 등급 | PASS / REGENERATE |
