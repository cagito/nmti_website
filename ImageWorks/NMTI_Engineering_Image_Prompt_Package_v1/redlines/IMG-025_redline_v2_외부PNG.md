<!-- redline-scaffold:v1 -->
# IMG-025 redline — 지중경사계 시스템 구성도 (외부 PNG)

> **image-knowledge:** [`지중경사계-관측공-설치`](../../../docs/image-knowledge/02-지중경사계-관측공-설치.md)
> **prompt:** `prompts/IMG-025_지중경사계_시스템_구성도.md` · **scaffold:** `npm run scaffold:redline-stubs`

## 0. 레이아웃

- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨
- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS

## 1. 강제 지시문 (image-knowledge §5·§6)

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| Q1 | 지표면 선과 명시 라벨 `지표면`. | ☐ | |
| Q2 | 천공 단면과 inclinometer casing(내부 groove 표현 가능). | ☐ | |
| Q3 | 안정 지반 구간(하단 고정·기준 구간). | ☐ | |
| Q4 | 예상 이동 방향 화살표 또는 groove 정렬 설명. | ☐ | |
| Q5 | Bentonite-cement grout 채움 구간. | ☐ | |
| Q6 | 지하수위계·간극수압계를 동일 관측공에 무라벨 혼합(G.W.L ≠ piezo). (금지) | ☐ | |
| Q7 | 센서형 다단식 IPI 노드 체인을 본 casing 설치도에 전부 전개(제품 혼동 — IPI 상세는 별도 주제, PDF 본 문서는… (금지) | ☐ | |
| Q8 | 데이터로거 함체를 천공 내부에 배치. (금지) | ☐ | |

<!-- /redline-scaffold:v1 -->

<!-- image-knowledge-redline:v1 -->
## image-knowledge §13 (book 실행 규칙)

> **정본:** [`지중경사계-관측공-설치`](../../../docs/image-knowledge/02-지중경사계-관측공-설치.md) · `npm run sync:redline-image-knowledge`

**육안 검수 — image-knowledge §13과 1:1:**

- [ ] Figure 목적이 **casing 관측공 설치** 하나로 고정되었는가?
- [ ] 지표면·천공 개구부·상부 보호가 표현되었는가?
- [ ] 안정 지반 하단 관입과 이동 방향 정렬이 있는가?
- [ ] 노반·통행 공간 내부 설치가 없는가?
- [ ] PDF에 없는 브랜드·공법을 추가하지 않았는가?
- [ ] 지하수위계·간극수압·로거와 혼동되지 않는가?
- [ ] 상부 누름만으로 고정한 부력 표현을 쓰지 않았는가?
- [ ] 최종 출력은 WebP인가?
- [ ] SVG, PNG 운영본, 축약 파일명을 만들지 않도록 지시했는가?
<!-- /image-knowledge-redline:v1 -->

## 서명

| 항목 | 값 |
|------|-----|
| 검수자 | |
| 일자 | |
| 등급 | PASS / REGENERATE |
