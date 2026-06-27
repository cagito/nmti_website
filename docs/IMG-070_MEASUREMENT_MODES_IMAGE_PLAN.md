# 계측 방식(5단계) 전용 이미지 제작 계획

**작성:** 2026-06-25  
**대상:** `instruments/modes/*` — 수동·자동·원격 자동·스마트·AI 계측  
**참고:** `docs/IMG-047_POWER_SYSTEM_PLAN.md` · `docs/IMG-045_DATALOGGER_CR1000X_PLAN.md` · KCS 수동계측 빈도 표

---

## 1. 배경 — 왜 새 이미지가 필요한가

### 1.1 현행 Figure 매핑 (문제)

| 노드 | 현재 hero / principle | 문제 |
|------|------------------------|------|
| `instruments/modes/manual` | **IMG-045** (데이터로거 구성도) | **계측 방식**이 아니라 **장비** Figure. 리드아웃·현장 방문·수기 기록 미표현 |
| `instruments/modes/automatic` | **IMG-045** (동일) | 수동과 **중복**. 현장 자동 수집·스케줄·로컬 저장 강조 부족 |
| `instruments/modes/remote-automatic` | IMG-048 + IMG-058, data: IMG-056 | 통신·플랫폼 일반 Figure. 「원격」과 「자동」 **구분**이 약함 |
| `instruments/modes/smart` | IMG-058 + IMG-054~057 (4종) | 부속 Figure는 있으나 **스마트 계측 1장 요약** hero 없음 |
| `instruments/modes/ai` | IMG-059 + IMG-060 | 관리기준·데이터품질 Figure. **AI/ML 분석 계층** 전용 Figure 없음 |

**핵심:** IMG-045~060은 「시스템·장비·대시보드」 범주이고, **계측 방식의 정의·단계 차이**를 설명하는 전용 Figure가 없다.

### 1.2 KCS·기술자료 관점 (용어 정렬)

| 방식 | KCS·실무 정의 (요지) |
|------|----------------------|
| **수동 계측** | 계측 담당자 현장 방문, 리드아웃·수준·광파 등으로 측정·기록. **계측 빈도 표의 기준** |
| **자동 계측** | 데이터로거가 설정 주기로 현장 수집·저장. 구간 특성에 따라 수동에서 **전환 가능** |
| **원격 자동계측** | 자동 수집 + 통신·서버·웹/모바일 모니터링·경보 (원격계측시스템) |
| **스마트 계측** | 원격 + 통합 대시보드·단계별 경보·자동 보고·이벤트 로그·운영 프로세스 |
| **AI 계측** | 스마트 플랫폼 위 **학습·예측·이상탐지** 보조 (법정 관리기준 **대체 아님**) |

**계층 관계 (하위 ⊂ 상위):**

```text
수동 계측
  └─ 자동 계측        (+ 데이터로거·주기 수집)
       └─ 원격 자동계측 (+ 통신·서버·원격 모니터링)
            └─ 스마트 계측 (+ 플랫폼·경보·보고 자동화)
                 └─ AI 계측 (+ ML·예측·이상탐지, HITL)
```

---

## 2. 목표

1. **계측 방식 5종 각 1장** — 해당 방식만 설명하는 **전용 hero Figure** (IMG-070~074)
2. **선택 1장** — 5단계 계층·역할 비교 **통합 Figure** (IMG-075)
3. 기존 IMG-048·054~060은 **보조 삽화**로 유지·역할 재정의 (폐기 아님)
4. IMG-045는 `sensors/datalogger`·`instruments/datalogger/static` 전용 — **modes에서 제거**

### 2.1 (선택) 메뉴 보강

전원·데이터로거와 동일 패턴으로 추후 검토:

```text
instruments/modes
  ├── instruments/modes/overview   ← IMG-075 (선택)
  ├── manual … ai (기존 5종)
```

본 계획은 **이미지 우선**; overview 노드는 Phase 2에서 추가 가능.

---

## 3. 신규 Figure ID 할당

마스터 리스트 다음 번호 **IMG-070 ~ IMG-075**.

| ID | 제목 | 노드 (hero) | 우선순위 |
|----|------|-------------|----------|
| **IMG-070** | 수동 계측 개념도 | `instruments/modes/manual` · principle | **P0** |
| **IMG-071** | 자동 계측 개념도 | `instruments/modes/automatic` · principle | **P0** |
| **IMG-072** | 원격 자동계측 개념도 | `instruments/modes/remote-automatic` · principle | **P0** |
| **IMG-073** | 스마트 계측 개념도 | `instruments/modes/smart` · principle | **P1** |
| **IMG-074** | AI 계측 개념도 | `instruments/modes/ai` · principle | **P1** |
| **IMG-075** | 계측 방식 5단계 계층도 | (선택) `modes/overview` · intro | **P2** |

---

## 4. Figure별 상세 사양

### 4.1 IMG-070 — 수동 계측

**한 줄:** 현장 방문 → 휴대 장비 측정 → 수기·전자 기록 (로거·서버 **없음**).

| 구분 | 내용 |
|------|------|
| **구도** | 좌: 계측 대상(지중경사계 맨홀·기준점) / 중: 리드아웃기·수준기·광파기 실루엣 / 우: 현장 기록(측정일지·엑셀) |
| **필수** | 「현장 방문」「측정 주기(KCS)」「A·B축·초기치」 콜아웃 |
| **흐름** | 센서 → 리드아웃/수준/광파 → **현장 기록** (화살표 3단) |
| **금지** | 데이터로거 hero, 클라우드, 웹 대시보드, **사람 얼굴·손** |
| **KCS 연계** | 캡션: 「수동계측 빈도 표 기준; 위험 시 빈도 상향」 |

### 4.2 IMG-071 — 자동 계측

**한 줄:** 센서 → 데이터로거(CR1000X 유형) → **현장 저장** · 주기 스캔 (통신 **선택·점선**).

| 구분 | 내용 |
|------|------|
| **구도** | 좌: 다종 센서 / 중앙: CR1000X 로거 + SD·스케줄 아이콘 / 우: 시계열 버퍼(로컬) |
| **필수** | 「수집 주기」「필터·경보(현장)」「전원(태양광)」 |
| **수동 대비** | 콜아웃: 「측정자 방문 없이 연속 수집」 |
| **금지** | 서버·웹 UI 주 피사체, IMG-045와 **동일 구도 복제** |
| **차별** | 070=휴대장비·기록 / 071=고정 로거·스케줄 |

### 4.3 IMG-072 — 원격 자동계측

**한 줄:** 071 + **통신(LTE/게이트웨이) + 서버 + 웹/모바일** (현장 없이 확인).

| 구분 | 내용 |
|------|------|
| **구도** | 2박스: [현장] 센서·로거·LTE | [원격] 서버·DB·웹·모바일·SMS |
| **필수** | 「원격 모니터링」「경보 전송」「가용성」 |
| **기존 관계** | IMG-048(LTE 흐름)·IMG-058(아키텍처) **보조** — 072는 **modes 전용 요약** (중복 최소화: 072=방식 정의, 058=플랫폼 상세) |
| **금지** | 대시보드 UI 화려 재현(056 수준), 홍보형 지도 |

### 4.4 IMG-073 — 스마트 계측

**한 줄:** 원격 자동 + **운영 계층**(기준·단계 경보·보고·이벤트 로그).

| 구분 | 내용 |
|------|------|
| **구도** | 하단: 072와 동일 데이터 파이프라인(간략) / 상단: 「플랫폼」박스 — 기준치·4단계 경보·보고서·담당자 알림 |
| **필수** | 정상(绿)·주의·경고·위험 **색 단계** (IMG-054와 일치) |
| **보조 Figure** | principle=**IMG-073**(신규), criteria→054, data→056·057·055 (현행 유지) |
| **금지** | AI·뇌·신경망 그림, 「스마트」 마케팅 카피 |

### 4.5 IMG-074 — AI 계측

**한 줄:** 스마트 플랫폼 데이터 → **모델·이상탐지·예측** → **HITL(사람 검토)** → 의사결정 보조.

| 구분 | 내용 |
|------|------|
| **구도** | 좌: 다채널 시계열 입력 / 중: 「분석 엔진」(블록: 이상탐지·예측·품질) / 우: 검토·경보·보고 (사람 실루엣 없이 「검토」박스) |
| **필수** | 「보조 의사결정」「KDS·KCS 기준 대체 아님」「HITL」 |
| **보조** | principle=**IMG-074**, data→060 (품질 파이프라인) |
| **금지** | 생물학적 뇌, robot, cyberpunk, 과장된 정확도 수치 |

### 4.6 IMG-075 — 계측 방식 5단계 계층도 (선택)

**한 줄:** 5층 계단/피라미드 — 각 층에 방식명 + **추가되는 능력 1줄**.

```text
        [ AI 계측 ]           ← 예측·이상탐지
      [ 스마트 계측 ]         ← 경보·보고·플랫폼
    [ 원격 자동계측 ]         ← 통신·원격 모니터링
  [ 자동 계측 ]             ← 로거·주기 수집
[ 수동 계측 ]               ← 현장 방문·KCS 기준
```

- 좌측: 각 층 대표 아이콘 1개 (장비 실루엣 수준)
- 우측: 「포함 관계」 화살표 (하위 방식이 상위에 포함)

---

## 5. 기존 Figure 역할 재정의

| 기존 ID | 현재 | 변경 후 역할 |
|---------|------|----------------|
| IMG-045 | manual·automatic hero | **modes에서 해제** → datalogger 전용만 |
| IMG-048 | remote principle | remote **보조** (통신 상세) |
| IMG-058 | remote·smart principle | `remote-monitoring-system` hero + smart **보조** |
| IMG-054~057 | smart 하위 | smart **criteria·data** 전용 (유지) |
| IMG-059~060 | ai principle·data | ai **보조** (기준·품질); hero는 IMG-074 |

**웹 `sectionImages` 변경 예정 (구현 Phase):**

```javascript
// manual
sectionImages: { principle: 'IMG-070' }

// automatic
sectionImages: { principle: 'IMG-071' }

// remote-automatic
sectionImages: {
  principle: 'IMG-072',
  data: 'IMG-056'   // 또는 048 유지
}

// smart — principle만 073으로 교체
sectionImages: {
  principle: 'IMG-073',
  criteria: { id: 'IMG-054', ... },
  data: [ IMG-056, IMG-057, IMG-055 ]
}

// ai
sectionImages: {
  principle: 'IMG-074',
  data: { id: 'IMG-060', ... }
}
```

---

## 6. 구현 경로

### 6.1 Pillow 1차 (권장)

| ID | 스크립트 | 비고 |
|----|----------|------|
| 070~075 | `scripts/render-measurement-mode-figures.py` (신규) | |
| 공통 | `scripts/lib/mode_draw.py` (신규) | `power_draw.py`·`datalogger_draw.py` 패턴 |
| 로거 | `draw_cr1000x_front` 재사용 | 071·072만 |

**Pillow 1차로 충분한 것:** 070, 071, 075 (단순 흐름·계층)  
**AI 보완 검토:** 073(플랫폼 UI 암시), 074(분석 블록)

### 6.2 AI 생성 (2차)

`ImageWorks/.../prompts/IMG-070_*.md` ~ `IMG-075_*.md`  
`00_STYLE_GUIDE.md` §계측 방식 (신규 절) 추가:

- 사람·뇌·대시보드 스크린샷 금지
- CAD·블록·화살표 중심
- 5단계 **용어·색상** 통일 (경보=Green/Orange/Red)

### 6.3 검수

- `docs/IMAGE_AUDIT_CHECKLIST.md` §4.12 계측 방식 (신규)
- `docs/INSTRUMENTATION_DRAWING_RULES.md` §3.16 (신규)
- `npm run audit:images` · `validate-image-master`

---

## 7. 작업 단계

### Phase 0 — 문서 (0.5일)

| # | 산출물 |
|---|--------|
| 0.1 | 본 계획서 ✅ |
| 0.2 | `08_계측방식_이미지_가이드.md` (ImageWorks) | ✅ |
| 0.3 | `00_STYLE_GUIDE.md` §계측 방식 | ✅ |
| 0.4 | `01_IMAGE_MASTER_LIST.csv` · `03_*.json` IMG-070~075 | ✅ |
| 0.5 | 프롬프트 6종 초안 | ✅ |

### Phase 1 — P0 Figure (1일)

| # | 작업 |
|---|------|
| 1.1 | `mode_draw.py` + `render-measurement-mode-figures.py` |
| 1.2 | IMG-070·071·072 PNG·WebP·registry PASS |
| 1.3 | `instruments.mjs` sectionImages 교체 |
| 1.4 | `dictionary.js` imageId · `build:content` |

### Phase 2 — P1 Figure (1일)

| # | 작업 |
|---|------|
| 2.1 | IMG-073·074 Pillow + (필요 시) AI 보완 |
| 2.2 | smart·ai sectionImages 반영 |
| 2.3 | IMG-054~060 프롬프트에 「보조 Figure」 명시 |

### Phase 3 — P2 통합·개요 (0.5일)

| # | 작업 |
|---|------|
| 3.1 | IMG-075 계층도 |
| 3.2 | `instruments/modes/overview` 노드 | ✅ |
| 3.3 | intro·계측 방식 문구 갱신 | ✅ |

### Phase 4 — 기존 Figure 정리 (0.5일)

| # | 작업 |
|---|------|
| 4.1 | IMG-058 아키텍처 단순화 여부 재검토 (`image-audit.md` P2) |
| 4.2 | IMG-056 대시보드 「매뉴얼 wireframe」 톤 통일 |
| 4.3 | `IMAGE_REGENERATION_PROMPTS.md` 계측 방식 섹션 |

---

## 8. 검수 체크리스트 (공통)

- [x] Figure 제목이 **계측 방식명**과 일치
- [x] 하위 방식 Figure에 상위 전용 요소 없음 (수동에 서버 없음 등)
- [x] 상위 방식 Figure에 하위 **포함** 관계 표시 (072에 로거·072에 AI 없음)
- [x] 범용 산업용 로거 (071·072) — legacy 격자형·CR1000X 실사 금지
- [x] 사람·얼굴·뇌·실제 앱 스크린샷 없음
- [x] KCS 「수동계측 기준·자동 전환」 캡션 1줄 (070·071)
- [x] AI Figure에 「법정 기준 대체 아님」 (074)
- [x] `audit:images` 0 error

---

## 9. 우선순위·일정 요약

| 단계 | 기간 | 산출 |
|------|------|------|
| Phase 0 | 0.5일 | 가이드·마스터·프롬프트 |
| Phase 1 (P0) | 1일 | IMG-070~072 + manual/automatic/remote 본문 연동 |
| Phase 2 (P1) | 1일 | IMG-073~074 + smart/ai 연동 |
| Phase 3 (P2) | 0.5일 | IMG-075 + overview (선택) |
| **합계** | **~3일** | 6 Figure · 5 노드 hero 교체 |

**권장 착수:** Phase 0 → **IMG-070(수동)** → **IMG-071(자동)** — 현재 IMG-045 중복이 가장 심각한 구간.

---

## 10. 다음 액션 (승인 후)

1. `08_계측방식_이미지_가이드.md` 작성  
2. Phase 1 Pillow 구현 (`render-measurement-mode-figures.py`)  
3. `instruments/modes/manual`·`automatic`에서 IMG-045 제거 → IMG-070·071 배포

---

## 부록 A — 노드별 콘텐츠·이미지 매트릭스 (목표 상태)

| 노드 | hero (principle) | 보조 (data/criteria) |
|------|------------------|----------------------|
| manual | IMG-070 | — |
| automatic | IMG-071 | IMG-047 (전원, installation 링크용 선택) |
| remote-automatic | IMG-072 | IMG-048, IMG-056 |
| smart | IMG-073 | IMG-054, 055, 056, 057 |
| ai | IMG-074 | IMG-060 |
| (overview) | IMG-075 | — |

## 부록 B — 070 vs 071 vs 072 한눈에

| 구분 | 수동 | 자동 | 원격 자동 |
|------|------|------|-----------|
| 현장 방문 | **필수** | 불필요 | 불필요 |
| 데이터로거 | 없음 | **필수** | 필수 |
| 통신 | 없음 | 선택 | **필수** |
| 서버·웹 | 없음 | 없음 | **필수** |
| 대표 장비 | 리드아웃·수준·광파 | CR1000X 로거 | + LTE·게이트웨이 |
