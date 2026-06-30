# DOCS 계측이론 정합성 수정 계획

**수립:** 2026-06-29  
**범위:** `docs/` · `docs/image-knowledge/` · ImageWorks prompts · `image-review-registry.json`  
**원칙:** 계측 = 특정 공학적 질문에 대한 **측정 항목·기기·위치·방향·해석** 정합

---

## 1. 최상위 원칙

```text
계측은 장비 나열이 아니다.
무엇을 / 왜 / 어디에 / 어떤 방향·물리량 / 어떻게 해석 — 5항 일치.
```

## 2. 이번 스프린트 (2026-06-29)

| # | 주제 | 정본 | 산출 |
|---|------|------|------|
| 1 | IMG-103 GNSS 처짐 | [148](./148-IMG-103-교량-상부구조-GNSS-처짐-표현-표준.md) | [151](./151-IMG-103-GNSS-처짐계-정본-충돌-정리.md) |
| 2 | IMG-103 vs 104 분리 | INSTR §3.23.4A·B · [68](./68-교량-처짐-계측-표현-표준.md) | image-knowledge 14·IMG-103 |
| 3 | DISP-ATS vs GNSS | [127 §2.2](./127-변위계측-자동광파기-남용방지-및-와이어식-우선-표준.md) | — |
| 4 | IMG-024 filter tip·침윤선 | [152](./152-IMG-024-댐-피에조-침윤선-정합성-수정계획.md) | docs/32·39·INSTR §3.25 |
| 5 | 건설중 계측 용어 | [153](./153-계측문서-용어-정본-건설중-계측.md) | **완료** — content-data · SEO · index.html |
| 6 | 정본 인덱스 | [CANONICAL_DOC_INDEX](./CANONICAL_DOC_INDEX.md) | — |
| 7 | 링크 검증 | `npm run validate:doc-links` | **완료** — `verify:local` 게이트 포함 |
| 8 | IMG-008 캡션·audit | P1~P11 v10 | **완료** — master list · images.js · audit-img008 |
| 9 | master-caption 동기화 | `npm run sync:master-captions` | **완료** — 19건 · audit:image-doc warn 0 |

**다음:** [158 프로그램 종료](./158-계측이론-정합성-프로그램-종료.md) — Phase E~H **완료** (2026-06-29)

## 3. 검증

```bash
npm run verify:local          # PASS (2026-06-29, doc-links 포함)
npm run sync:master-captions  # images.js → master list
```

## 4. 금지 (재발 방지)

- IMG-103: 1/4·3/4 GNSS · 하부 와이어 hero  
- filter tip 고도 = 침윤선  
- 대외 문서 「건설기간 계측」 (slug `construction-phase` 제외)
