# P1 DOC_FIX — 마스터 동기화 · 배포 준비 (2026-06-30)

**범위:** `audit:image-doc` WARN 14건 → **0 caption/title WARN**  
**게이트:** `verify:deploy` PASS

---

## 1. P1 레지스트리 현황

`auditPriority: P1` **28종** — 전부 `reviewGrade: PASS` · `requiresReaudit: false`

픽셀 재생성 큐 없음. 잔여는 **DOC_FIX**(마스터·캡션) · **육안 review**(082) · 의도적 본문 교차참조.

---

## 2. DOC_FIX — 마스터 리스트 동기화

`npm run sync:master-captions` (caption + title, images.js = 운영 정본)

| ID | 항목 |
|----|------|
| IMG-011·016·019·096·104 | caption vN 정합 |
| IMG-070~075 | KCS/NMTI 운영모드 caption·title |
| IMG-074 | title → AI 보조 분석 개념도 |
| IMG-075 | title → 계측 방식 3층 분류도 |

**스크립트:** `scripts/sync-master-captions.mjs` — title 동기화 추가 (2026-06-30)

---

## 3. `audit:image-doc` 잔여 (비차단)

| 심각도 | 항목 | 조치 |
|--------|------|------|
| REVIEW | IMG-082 | ~~v5 PASS · 금지 3종~~ → `prohibitedVerified` ✅ |
| WARN | sensors/deflection-gauge | **의도적** — 개요에 IMG-103(GNSS 처짐) 교차참조, hero=IMG-104 |
| INFO | IMG-064 | 3노드 공용 hero (항만 개요) |

`mismatch`: **0**

---

## 4. 배포 검증

```bash
npm run verify:deploy        # ✅ PASS (2026-06-30)
npm run verify:production    # ✅ 28/28 (2026-06-30) — [198](./198-배포-Exit-및-verify-production.md)
```

### 6. verify:production 차단 수정 (2026-06-30)

| 페이지 | 원인 | 조치 |
|--------|------|------|
| `retaining-excavation/surrounding-ground` | installation에 IMG-032(침하판) — SEO `mustNot` 위반 | IMG-032 제거 · 096·027·030·031 유지 |
| `harbor/surrounding-ground` | 동일 | IMG-032 → 030·031(간극수압·지하수위) |

`build:content` · `build:seo` 재생성 완료 · 로컬 SEO에 IMG-032 **없음**

### 7. IMG-082 review 해소

`prohibitedVerified: true` · 금지 3종 회피 확인 기록

---

## 5. 연계

- [196 재작도 큐 Exit](./196-재작도-큐-Exit-및-verify-local.md)
- [180 §5 P1](./180-technology-이미지-전수-재검수-수정계획.md)
