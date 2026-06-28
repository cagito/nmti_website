# 이미지 ↔ 문서 불일치 추출 보고서

> 생성: `node scripts/audit-image-doc-mismatch.mjs` · 2026-06-27

| 심각도 | 건수 |
|--------|------|
| **mismatch** (명확 불일치) | 0 |
| **review** (PASS vs 문서 C·금지요소) | 1 |
| **warn** | 8 |
| **info** | 1 |

---

## 조건부 PASS

### REVIEW · `IMG-006`

PASS이나 금지 오류 3종 등록 — PNG가 실제로 회피했는지 육안·체크리스트 확인 필요
- 버팀보 정중앙 하중계
- IMG-002와 동일 대표 단면도 역할 중복
- 뇌·홍보 UI

## 마스터-caption

### WARN · `IMG-015`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 사면 계측 전체 개념도 — 활동면·센서형 다단식 지중경사계(기반암 근입)·G.W.L·간극수압·프리즘·부동점 자동광파기…
- images: 사면 계측 전체 개념도 — IPI·침하계·지하수위·간극수압(주) · (선택) 광학망…

### WARN · `IMG-024`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 댐 안전관리 계측 체계도 — 필댐 6항목·침윤선·누수·데이터 흐름…
- images: 댐 안전관리 계측 체계 — 필댐 6항목·7단계 데이터 흐름 (v3)…

### WARN · `IMG-079`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 숏크리트 — 변형률계 매립·응력 발현…
- images: 숏크리트 응력·변형 — 매립 SG·응력계 (v3 AI)…

### WARN · `IMG-090`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 사면 구조물 변위 — 프리즘·ATS·부동점…
- images: 사면 구조물 변위 계측 — 배면 사면 와이어식 변위계 · 옹벽 프리즘 · ΔX/ΔY…

### WARN · `IMG-096`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 주변지반 — 센서형 다단식 지중경사계·침하·간극수압·지하수위 4종 동시 배치·H·2H…
- images: 가시설 주변지반 — IPI·침하핀·간극수압·지하수위 4종 · H=굴착깊이 (v4)…

### WARN · `IMG-100`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 건축공사 계측 — KCS 3.9 5항목 통합 개념도…
- images: 건축공사 계측 전체 개념도 — LVDT·변형률·균열·경사·하중 (KCS 3.9)…

### WARN · `IMG-101`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 건축공사 주변건물 — 신축·인접 균열·경사·ATS…
- images: 건축공사 주변건물 계측 — 균열·경사·와이어식 변위(주)…

### WARN · `IMG-103`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 교량 처짐 — δ·처짐계·L/600 예시…
- images: 교량 처짐 δ — 거더 하부 처짐계·와이어/LVDT (DISP-ATS-01)…

## 히어로 공용

### INFO · `IMG-064`

3개 노드 공용: fields/harbor, fields/harbor/quay-wall, fields/harbor/surrounding-ground
