# Phase AD — IMG별 오류 분석 및 재작업 계획

**상위:** [96-Phase AD](./96-외부-ZIP-신규-심각오류-10종-Phase-AD-수정계획.md)  
**프롬프트:** [97-복붙](./97-Phase-AD-복붙-프롬프트-정본.md) · [IMAGE_REGENERATION_PROMPTS §Phase AD](./IMAGE_REGENERATION_PROMPTS.md)

---

## §1 IMG-047 — 태양광 전원 시스템 구성도

**판정:** MAJOR_FIX · ZIP-AUD-41 · SOLAR-SIZE-01  
**nodeId:** `instruments/power/solar-power`  
**파일:** `IMG-047_태양광-전원-시스템-구성도_*.png`

**신규 오류:** 패널→충전→배터리→로거 **직렬만** — 부하·자율운전일·LVD·SPD·접지 구분 없음.

**exit criteria:**

- [ ] 부하: 센서 여자 · 로거 · 모뎀 · 히터/팬 **분리**
- [ ] Ah · DoD · **자율운전일** · 일사량 산정 주석
- [ ] LVD · 과충·과방 · 퓨즈 · SPD
- [ ] 접지: 함체 · SPD · 패널프레임 · 로거 **구분**
- [ ] 「무정전 보장」 암시 **없음**

---

## §2 IMG-048 — LTE M2M 통신 구성도

**판정:** MAJOR_FIX · ZIP-AUD-42 · LTE-BUF-01  
**nodeId:** `instruments/communication/lte-remote`

**신규 오류:** 직렬 흐름만 — **버퍼·재전송·APN·ACK** 없음.

**exit criteria:**

- [ ] 로거 **로컬 저장** · 두절 시 재전송 화살표
- [ ] APN/VPN · 방화벽 · 서버 API · **ACK**
- [ ] 웹/모바일 = **클라이언트** (로거 직접 제어 X)
- [ ] RSSI · 지연 · 누락 패킷 모니터링
- [ ] 모뎀이 **경보 판정** 하지 않음

---

## §3 IMG-049 — 변위 그래프 예시

**판정:** MAJOR_FIX · ZIP-AUD-43 · DISP-GRAPH-01  
**nodeId:** `fields/retaining-excavation` · `data/graph`

**신규 오류:** 단일 ±기준선 — **방향·기준점·속도·회전** 없음.

**exit criteria:**

- [ ] 전방/후방 **현장 축** · **상대변위**
- [ ] 기준점 안정성 표시
- [ ] 누적변위 + **변위속도** 검토
- [ ] 관리기준 = **예시·현장별**
- [ ] 회전·기초이동 **주석**

---

## §4 IMG-050 — 침하 그래프 예시

**판정:** **REGENERATE** · ZIP-AUD-44 · GRAPH-PRED-01  
**nodeId:** `fields/retaining-excavation`

**신규 오류:** 측정값 **선형 외삽 = 예측침하** — 압밀 해석 무시.

**exit criteria:**

- [ ] 제목: **침하-시간 계측 및 예측 개념도**
- [ ] 측정 vs 예측 **시각 분리** · 예측 = **해석법 적용**
- [ ] 성토·방치·추가성토·프리로딩 해제 **마커**
- [ ] 잔류침하 · 최종침하 · 압밀도
- [ ] BM = **영향권 밖** · 침하판≠기준점

---

## §5 IMG-051 — 간극수압 소산 그래프

**판정:** MAJOR_FIX · ZIP-AUD-45 · PIEZO-DISS-01  
**nodeId:** `sensors/piezometer`

**신규 오류:** 성토마다 **동일한 이상화 u 곡선** — Δu·심도별·배수 없음.

**exit criteria:**

- [ ] Y축: **Δu** 또는 **u** 명확
- [ ] 초기 정수압 vs 과잉간극수압
- [ ] 성토 단계 **시점** · 심도별 곡선 가능 주석
- [ ] 배수재·배수거리 주석
- [ ] 소산만으로 **압밀 완료 단정 X**

---

## §6 IMG-052 — 하중 변화 그래프

**판정:** **REGENERATE** · ZIP-AUD-46 · LOAD-STAGE-01  
**nodeId:** `sensors/load-cell`

**신규 오류:** 모든 단계 **동일 수평 기준선** — 설계축력·급감 없음.

**exit criteria:**

- [ ] 단별 **설계축력/관리기준** 분리
- [ ] 프리로드 시점 · 굴착/설치/해체 구분
- [ ] **급감** 위험 표시 · 온도 주석
- [ ] 설계대비율 · 변화율 검토
- [ ] 전 단계 **단일 기준선 X**

---

## §7 IMG-053 — 진동 계측 그래프

**판정:** MAJOR_FIX · ZIP-AUD-47 · VIB-GRAPH-01  
**nodeId:** `sensors/vibration-meter`

**신규 오류:** 이벤트 번호·시간 **혼합** · PPV 단일 점만.

**exit criteria:**

- [ ] X축 **하나로 통일** (시간 또는 이벤트)
- [ ] PPV = 최대성분 vs **합성** 명시
- [ ] X/Y/Z 성분 · 우세주파수
- [ ] 이벤트 시간 · 진동원 · 위치
- [ ] mm/s vs m/s² **혼동 X**

---

## §8 IMG-054 — 경보 단계 프로세스

**판정:** **REGENERATE** · ZIP-AUD-48 · ALARM-FLOW-01  
**nodeId:** `instruments/modes/alarm-status`

**신규 오류:** 정상→위험→조치 **선형만** — QC·결측·해제 없음.

**exit criteria:**

- [ ] **데이터 품질검증** 선행
- [ ] 센서이상·통신두절·결측 **별도 상태**
- [ ] 초과 = 누적·속도·**지속시간**
- [ ] 현장확인 · 관련센서 비교 · **해제조건**
- [ ] 위험 → 조치완료 **자동 X**

---

## §9 IMG-055 — 모바일 경보 알림 화면

**판정:** MAJOR_FIX · ZIP-AUD-49 · MOB-ALARM-01  
**nodeId:** `instruments/modes/alarm-status`

**신규 오류:** 초과값·색상만 — **상태·지속·추세·이력** 부족.

**exit criteria:**

- [ ] 센서·통신·배터리 **상태**
- [ ] 지속시간 · 변화율 · 관련센서
- [ ] 현장·공구·위치·번호·단위
- [ ] 확인/조치 → **로그** (담당·시간)
- [ ] 조치 유형 구분 · 해제조건

---

## §10 IMG-056 — 웹 대시보드 구성도

**판정:** **REGENERATE** · ZIP-AUD-50 · DASH-STATE-01  
**nodeId:** `instruments/modes/smart`

**신규 오류:** 형식 배치 — **단위·시간·기준·상태 불일치**.

**exit criteria:**

- [ ] 지도 = 평면/현장도 기반 위치
- [ ] 목록: 항목·단위·상태·**최근 수신**
- [ ] 그래프: 단위·시간범위·초기치·**관리기준**
- [ ] 이벤트: 센서/통신/조치 **구분**
- [ ] 지도·목록·로그 **상태색 일관**
- [ ] 결측·두절·저전압·이상 **별도**

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase AD IMG별 10종 exit criteria |
