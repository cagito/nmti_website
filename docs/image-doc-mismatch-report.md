# 이미지 ↔ 문서 불일치 추출 보고서

> 생성: `node scripts/audit-image-doc-mismatch.mjs` · 2026-06-30

| 심각도 | 건수 |
|--------|------|
| **mismatch** (명확 불일치) | 0 |
| **review** (PASS vs 문서 C·금지요소) | 0 |
| **warn** | 2 |
| **info** | 1 |

---

## 마스터-caption

### WARN · `IMG-015`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 사면 계측 전체 개념도 — IPI·침하계·지하수위·간극수압(주) · (선택) 광학망…
- images: 사면 계측 전체 개념도 — IPI·침하계·지하수위·간극수압(주) · 프리즘(선택)…

## 본문-hero

### WARN · `sensors/deflection-gauge`

개요에 IMG-103 언급 — hero는 IMG-104
- IMG-103
- IMG-104

## 히어로 공용

### INFO · `IMG-064`

3개 노드 공용: fields/harbor, fields/harbor/quay-wall, fields/harbor/surrounding-ground
