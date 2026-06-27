# 외부 ZIP 전수검수 — 신규 심각 오류 10종 (Phase AD) 및 수정계획

**수립:** 2026-06-26  
**근거:** 외부 공학 검수 **5차 묶음** — 기존 **60종**(감사 25·28·30 + Phase Z + AA + AB + AC)과 **비중복**  
**성격:** **계측 시스템 운영** · **그래프 해석** · **경보 로직** · **대시보드 표현** — 「예쁜 UI」보다 **초기치·단위·기준·상태·결측·조치 이력**  
**상위:** [92-Phase AC](./92-외부-ZIP-신규-심각오류-10종-Phase-AC-수정계획.md) · [IMAGE_REGENERATION_PROMPTS §Phase AD](./IMAGE_REGENERATION_PROMPTS.md)

> **한 줄:** 계측값을 운영 판단으로 바꾸는 **중간 검증 절차**가 빠진 10 Figure — **4종 전면 재작성 · 6종 중대 수정**.

---

## 0. Executive summary

| 구분 | 내용 |
|------|------|
| 검수 묶음 | ZIP 207종 중 **5차 선별 10종** (`IMG-047`~`056`, 앞선 60종과 비중복) |
| 신규 심각 오류 | **10건** (`ZIP-AUD-41` ~ `ZIP-AUD-50`) |
| **REGENERATE** | IMG-050 · 052 · 054 · 056 |
| **MAJOR_FIX** | IMG-047 · 048 · 049 · 051 · 053 · 055 |
| 핵심 위험 Top 3 | **050** (침하 단순 외삽) · **052** (단계 무관 수평 기준선) · **054** (선형 색상 경보만) |
| registry | `npm run patch:registry-phase-ad` → `requiresReaudit: true` |
| 프롬프트 | [97-복붙 정본](./97-Phase-AD-복붙-프롬프트-정본.md) · [11-그래프·운영 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/11_그래프_운영_대시보드_이미지_가이드.md) |
| 실행 | [98-체크리스트](./98-Phase-AD-재작도-실행-체크리스트.md) · IMG별 [99](./99-Phase-AD-IMG별-오류분석-및-재작업-계획.md) |

### 선행 감사와의 관계 (중복 아님)

| ID | 선행 지적 | Phase AD (본 묶음) |
|----|-----------|-------------------|
| IMG-045 | AB — 센서별 신호 형식 | **047** — 전원 **부하·자율운전일·LVD·SPD** |
| IMG-048 | — | **048** — LTE **버퍼·APN·ACK·방화벽** (직렬 흐름만이 아님) |
| IMG-020 | AA — 압밀 과단순 | **050** — **예측 침하 = 해석법**, 선형 외삽 금지 |
| IMG-035 | AB — 하중계 설치 | **052** — **단계별 설계축력** 그래프 |
| IMG-059 | AC — 관리기준 항목별 | **054** — **경보 프로세스** QC·결측·해제조건 |
| IMG-041 | Z — PPV 단위 | **053** — **3축·주파수·시간축 통일** |
| IMG-056 | 058 hub 보조 | **056** — **상태색·단위·이벤트 연계** |

**공통 원칙 OPS-VERIFY-01:** Figure·그래프·UI에서 **계측값 → 운영 판단** 사이에 **데이터 품질검증·센서/통신 상태·결측·지속시간·현장확인**을 반드시 표기. [TECHNICAL §0.0e](./TECHNICAL_IMAGE_STANDARD.md)

---

## 1. 신규 심각 오류 10종 (기준표)

| # | 감사 ID | 파일 | 신규 심각 오류 | 수정 방향 | 판정 |
|---|---------|------|----------------|-----------|------|
| 1 | ZIP-AUD-41 | IMG-047 | 태양광 = **패널→충전→배터리→로거** 직렬만 — 부하·일사·자율운전일·LVD·SPD 없음 | 부하 분리 · Ah/DoD · LVD · 접지 · **SOLAR-SIZE-01** | MAJOR_FIX |
| 2 | ZIP-AUD-42 | IMG-048 | LTE = **센서→로거→LTE→서버** 직렬 — APN/VPN·버퍼·재전송·ACK 없음 | 로컬 저장 · 두절 버퍼 · **LTE-BUF-01** | MAJOR_FIX |
| 3 | ZIP-AUD-43 | IMG-049 | 옹벽 변위 **단일 ±기준선** — 방향·회전·속도·기준점 안정성 없음 | 전/후방 축 · 상대변위 · **DISP-GRAPH-01** | MAJOR_FIX |
| 4 | ZIP-AUD-44 | IMG-050 | 측정값 **단순 외삽 = 예측 침하** — 압밀·성토단계·잔류침하 무시 | 해석법 적용 · 성토 마커 · **GRAPH-PRED-01** | **REGENERATE** |
| 5 | ZIP-AUD-45 | IMG-051 | 성토마다 **이상화된 u 상승·소산** — Δu·심도별·배수조건 없음 | 초기 정수압 · Δu · 심도별 · **PIEZO-DISS-01** | MAJOR_FIX |
| 6 | ZIP-AUD-46 | IMG-052 | 버팀보 **동일 수평 기준선** — 단계별 설계축력·프리로드·급감 없음 | 단계별 기준 · 설계대비율 · **LOAD-STAGE-01** | **REGENERATE** |
| 7 | ZIP-AUD-47 | IMG-053 | PPV — **이벤트 번호·시간 혼합** · 3축·주파수 없음 | 축 통일 · 최대성분/합성 · **VIB-GRAPH-01** | MAJOR_FIX |
| 8 | ZIP-AUD-48 | IMG-054 | **정상→위험→조치** 선형만 — QC·결측·해제·현장확인 없음 | QC 선행 · 상태 분리 · **ALARM-FLOW-01** | **REGENERATE** |
| 9 | ZIP-AUD-49 | IMG-055 | **기준 초과 알림만** — 통신·지속·추세·조치이력 부족 | 상태 카드 · 확인/조치 로그 · **MOB-ALARM-01** | MAJOR_FIX |
| 10 | ZIP-AUD-50 | IMG-056 | 지도·목록·그래프 **형식 배치** — 단위·시간·기준선·상태 불일치 | 상태색 일관 · 이벤트 연계 · **DASH-STATE-01** | **REGENERATE** |

---

## 2. 우선순위

### 전면 재작성 (P0)

```text
IMG-050 침하 그래프 예시
IMG-052 하중 변화 그래프
IMG-054 경보 단계 프로세스
IMG-056 웹 대시보드 구성도
```

### 중대 부분 수정 (P1)

```text
IMG-047 태양광 전원 시스템 구성도
IMG-048 LTE M2M 통신 구성도
IMG-049 변위 그래프 예시
IMG-051 간극수압 소산 그래프
IMG-053 진동 계측 그래프
IMG-055 모바일 경보 알림 화면
```

---

## 3. Phase 실행 계획

### Phase AD-1 — REGENERATE 4종 (P0)

| 순위 | ID | nodeId | 산출 |
|------|-----|--------|------|
| AD-1a | IMG-050 | `fields/retaining-excavation` · `data/graph` | AI/Pillow · [97 §4](./97-Phase-AD-복붙-프롬프트-정본.md) · GRAPH-PRED-01 |
| AD-1b | IMG-052 | `sensors/load-cell` · `data/graph` | AI/Pillow · [97 §6](./97-Phase-AD-복붙-프롬프트-정본.md) · LOAD-STAGE-01 |
| AD-1c | IMG-054 | `instruments/modes/alarm-status` | 블록/AI · [97 §8](./97-Phase-AD-복붙-프롬프트-정본.md) · ALARM-FLOW-01 |
| AD-1d | IMG-056 | `instruments/modes/smart` | UI mockup · [97 §10](./97-Phase-AD-복붙-프롬프트-정본.md) · DASH-STATE-01 |

### Phase AD-2 — MAJOR_FIX 6종 (P1)

| ID | nodeId | 렌더·참고 |
|----|--------|-----------|
| IMG-047 | `instruments/power/solar-power` | [07 전원 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/07_전원_이미지_가이드.md) · `render-power-figures.py` |
| IMG-048 | `instruments/communication/lte-remote` | 블록 다이어그램 · LTE-BUF-01 |
| IMG-049 | `fields/retaining-excavation` | 그래프 Figure · DISP-GRAPH-01 |
| IMG-051 | `sensors/piezometer` | 그래프 · PIEZO-DISS-01 |
| IMG-053 | `sensors/vibration-meter` | 그래프 · VIB-GRAPH-01 |
| IMG-055 | `instruments/modes/alarm-status` | 모바일 UI mockup · MOB-ALARM-01 |

**Exit:** redline 0 · `prohibitedVerified: true` · `audit:images:strict`

### Phase AD-3 — 문서·registry

- [x] 본 문서 · [97](./97-Phase-AD-복붙-프롬프트-정본.md) · [98](./98-Phase-AD-재작도-실행-체크리스트.md) · [99](./99-Phase-AD-IMG별-오류분석-및-재작업-계획.md)
- [x] [11-그래프·운영 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/11_그래프_운영_대시보드_이미지_가이드.md) · TECHNICAL §0.0e
- [x] `patch:registry-phase-ad`
- [ ] PNG 교체 · redline v2 · `npm run sign:phase-ad` (추가 예정)
- [ ] `audit:images:strict` · `verify:production`

---

## 4. nodeId 매핑

| ID | nodeId | Figure 유형 |
|----|--------|-------------|
| IMG-047 | `instruments/power/solar-power` | 시스템 블록 |
| IMG-048 | `instruments/communication/lte-remote` | 시스템 블록 |
| IMG-049~053 | `data/graph` · 분야별 센서 노드 | **그래프** |
| IMG-054~055 | `instruments/modes/alarm-status` | 프로세스 · 모바일 UI |
| IMG-056 | `instruments/modes/smart` | 웹 대시보드 |

---

## 5. 연계

| 문서 | 용도 |
|------|------|
| [TECHNICAL §0.0e](./TECHNICAL_IMAGE_STANDARD.md) | ZIP-AUD-41~50 · OPS-VERIFY-01 |
| [65-유형 분리](./65-계측-Figure-유형-분리-레이아웃-표준.md) | 원리·설치·**그래프·UI** 분리 |
| [59-운영 모드](./59-계측-운영-모드-구조-환경-AI-표현-표준.md) | 054·055·056 |
| [82-재작도 통합](./82-Figure-재작도-통합-수정계획.md) | Phase AD 로드맵 |
| [IMG-047 전원 계획](./IMG-047_POWER_SYSTEM_PLAN.md) | 047 상세 |

---

## 6. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase AD 5차 묶음 — 운영·그래프·경보·대시보드 10종 |
