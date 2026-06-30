# 이미지 ↔ 문서 불일치 추출 보고서

> 생성: `node scripts/audit-image-doc-mismatch.mjs` · 2026-06-30

| 심각도 | 건수 |
|--------|------|
| **mismatch** (명확 불일치) | 0 |
| **review** (PASS vs 문서 C·금지요소) | 0 |
| **warn** | 11 |
| **info** | 1 |

---

## 마스터-caption

### WARN · `IMG-016`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 원호활동면 계측 해석도 — 원호파괴와 센서형 다단식 지중경사계 변위 프로파일 관계…
- images: 원호활동면 — IPI 프로파일·활동면 추정 후보 (단독 확정 금지)…

### WARN · `IMG-070`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 수동 계측 — 현장 방문·휴대 장비·측정일지…
- images: KCS 수동계측 — 현장 방문·휴대 장비·교차 검증…

### WARN · `IMG-071`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 자동 계측 — 로거·주기 수집·현장 저장…
- images: KCS 자동계측 — 수집·저장·(선택) 전송·표출 연계…

### WARN · `IMG-072`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 원격 자동계측 — LTE·서버·웹·경보…
- images: NMTI 운영 확장 — LTE·서버·원격 모니터링 (KCS 분류 아님)…

### WARN · `IMG-073`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 스마트 계측 — 운영 플랫폼·단계별 경보…
- images: NMTI 운영 확장 — 플랫폼·단계별 경보 (KCS 분류 아님)…

### WARN · `IMG-074`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: AI 계측 — 분석 엔진·검토·보조 의사결정…
- images: AI 보조 분석 — HITL·법정기준 보조 (≠ KCS 계측방식)…

## 마스터-title

### WARN · `IMG-074`

마스터 title "AI 계측 개념도" ≠ images.js "AI 보조 분석 개념도"

## 마스터-caption

### WARN · `IMG-075`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 계측 방식 5단계 — 하위 포함·능력 누적…
- images: 계측 방식 — KCS 수집·전송·NMTI 확장·런타임 (MOD-01)…

## 마스터-title

### WARN · `IMG-075`

마스터 title "계측 방식 5단계 계층도" ≠ images.js "계측 방식 3층 분류도"

## 마스터-caption

### WARN · `IMG-104`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 처짐계 — LVDT·와이어 (≠침하판)…
- images: 처짐계 설치 — LVDT·와이어 접촉식 δ (≠ GNSS hero·≠침하계)…

## 본문-hero

### WARN · `sensors/deflection-gauge`

개요에 IMG-103 언급 — hero는 IMG-104
- IMG-103
- IMG-104

## 히어로 공용

### INFO · `IMG-064`

3개 노드 공용: fields/harbor, fields/harbor/quay-wall, fields/harbor/surrounding-ground
