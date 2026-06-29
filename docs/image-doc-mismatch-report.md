# 이미지 ↔ 문서 불일치 추출 보고서

> 생성: `node scripts/audit-image-doc-mismatch.mjs` · 2026-06-29

| 심각도 | 건수 |
|--------|------|
| **mismatch** (명확 불일치) | 0 |
| **review** (PASS vs 문서 C·금지요소) | 0 |
| **warn** | 12 |
| **info** | 1 |

---

## 마스터-caption

### WARN · `IMG-006`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 굴착 단계별 계측 흐름도 — 단계별 굴착·계측·판정·누적 변위 예시…
- images: 굴착 단계별 계측 흐름도 v3 — 4단계·IPI·G.W.L·어스앵커 LC(③④)…

### WARN · `IMG-011`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 교량 계측 전체 개념도 — 상부구조·교각·교대·기초, 10종 계측(⑥ 케이블장력계·④ 처짐계 등)…
- images: 교량 계측 전체 개념도 v3 — 사장교·상부구조→받침→교각/교대→기초, 10종 계측…

### WARN · `IMG-015`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 사면 계측 전체 개념도 — 활동면·센서형 다단식 지중경사계(기반암 근입)·G.W.L·간극수압·프리즘·부동점 자동광파기…
- images: 사면 계측 전체 개념도 — IPI·침하계·지하수위·간극수압(주) · (선택) 광학망…

### WARN · `IMG-019`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 연약지반 성토부 계측기 설치 배치도 — 지표침하·IPI·piezo·G.W.L·토압…
- images: 연약지반 성토부 계측기 설치 배치도 v3 — IPI·piezo tip·지중침하·지하수위·토압…

### WARN · `IMG-024`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 댐 안전관리 계측 체계도 — 필댐 6항목·침윤선·누수·데이터 흐름…
- images: 댐 안전관리 계측 체계 — 필댐 6항목·7단계 데이터 흐름 (v4)…

### WARN · `IMG-029`

03_IMAGE_MASTER_LIST caption ≠ images.js caption
- master: 센서형 다단식 지중경사계 데이터 해석도 — Incremental/Cumulative 변위 그래프와 활동면…
- images: 센서형 다단식 지중경사계 데이터 해석도 — 변위 집중·활동면 추정 분리…

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
- master: 교량 GNSS 처짐 — 경간 상부 ΔZ·처짐량 δ (v3)…
- images: 교량 GNSS 처짐 — 경간 상부 ΔZ·처짐량 δ (v3, 와이어식 hero 아님)…

## 히어로 공용

### INFO · `IMG-064`

3개 노드 공용: fields/harbor, fields/harbor/quay-wall, fields/harbor/surrounding-ground
