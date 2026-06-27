# Phase D — AI 복붙 프롬프트 정본 (W10 · 14종)

**상위:** [82 §3.4](./82-Figure-재작도-통합-수정계획.md) · [113 실행](./113-Phase-D-재작도-실행-체크리스트.md) · [38 판정표](./38-AI-프롬프트-hero-픽셀-감사-판정표.md)  
**원칙:** docs/36 **§2.1 Prefix** 선행 · Pillow FT-A/B **재렌더 금지** · `ai-reviewed` PNG ≥1920×1080

> W1~W9에 **미포함** 14종만. 007·023·030 등은 [93 AC](./93-Phase-AC-복붙-프롬프트-정본.md) · W2~W9 참조.

---

## §1 IMG-011 — 교량 계측 전체 (BRI-01 · 선택 FT-A/B)

**노드:** `fields/bridge` · **현행:** Pillow v2 PASS — [76](./76-IMG-011-교량-전체-개념도-v2-수정계획.md)  
**프롬프트:** `ImageWorks/.../prompts/IMG-011_교량_계측_전체_개념도.md`

```text
교량 계측 전체 개념도 — 상부구조·교각·교대·기초 10종 callout.

필수: ①변형률 ②온도 ③가속도 ④처짐(δ, ≠침하) ⑤신축이음 ⑥케이블장력 ⑦풍향풍속 ⑧무응력 ⑨구조물경사 ⑩기초침하·광파.
우측: 10종 요약 · 정적/동적 구분 · 「≠ 흙막이·굴착 단면 (BRI-01)」.

금지: 흙막이·버팀보·굴착 공동 · 처짐=침하판 · 진동현식 · 어스앵커 로드셀.

1920x1080, Korean bridge instrumentation overview, white background, no excavation context.
```

---

## §2 IMG-064 — 항만·호안 (HAR-01 · §4.9②)

**노드:** `fields/harbor` · `quay-wall` · **프롬프트:** `IMG-064_항만-호안-계측-전체-개념도.md`

```text
항만·호안 계측 횡단 단면도.

좌=육측(뒤채움·매립) | 중=케이슨/안벽 | 우=해측(사석·조위선).
필수: 변위계·구조물경사계·반력계(하부 모서리)·육측 지표침하·센서형 다단식 지중경사계(육측·해측)·지하수위계·간극수압계·조위계·데이터로거(육측 보호함 내 함체).

금지: 푸른 바다 풍경 · 갈매기 · 가시설 굴착 맥락 · 교량/댐 단면 혼입.

1920x1080, Korean harbor cross-section schematic, white background.
```

---

## §3 IMG-084 — 케이슨·항만구조물 (§4.9②)

**노드:** `fields/harbor/caisson` · **프롬프트:** `IMG-084_항만구조물_변위_계측_개념도.md`

```text
케이슨(또는 중력식 안벽) 변위 계측 단면도.

필수: crest 구조물경사계 · 배면 토압계(EPC, 감지면·σh 화살표) · 측방 변위 벡터 · 육측·해측 지반 구분 · 지표면 명시.

금지: 풍경화 · 토압=상재하중 q 혼동 · 배면 EPC 생략.

1920x1080, Korean caisson monitoring cross-section.
```

---

## §4 IMG-097 — 터널 발파진동·영향권

**노드:** `fields/tunnel/blast-vibration` · [23](./23-IMG-097-터널-발파진동-영향권-오류분석-및-재작업-계획.md)

```text
터널 발파진동·영향권 계측 개념도.

종단: 지표·터널·막장(발파)·암반 · 영향권 점선 · 진동계 4(지표·구조·경계·기준) · 3축(터널축·횡·수직) · 동적 DAQ · PPV 파형 inset.

금지: 교량·교각(IMG-041 재사용) · 뇌·로봇 · 발파 화려 연출.

1920x1080, Korean tunnel blast PPV schematic, white background.
```

---

## §5 IMG-034 — 토압계 (EPC-01 · MAJOR_FIX)

→ [IMAGE_REGENERATION §IMG-034](./IMAGE_REGENERATION_PROMPTS.md) · `IMG-034_토압계_설치_개념도.md`

```text
토압계 설치 개념도 수정.

상재하중 q(연직) ≠ 수평토압 σh. 토압계 감지면=배면 지반→벽체 법선 압력. 되메움·밀착 조건 표시.

금지: 성토 하중이 곧 토압계 측정값처럼 표현.

1920x1080, earth pressure cell cross-section, Korean labels.
```

---

## §6 IMG-041 — 진동계 (VIB-UNIT-01 · MAJOR_FIX)

→ [IMAGE_REGENERATION §IMG-041](./IMAGE_REGENERATION_PROMPTS.md)

```text
진동계 설치 개념도 — 구조물 vs 지반 분리.

가속도계: m/s²·gal·g. PPV/진동속도: mm/s 별도. 그래프 축 단일 항목. 설치 바닥·고정·측정축 구분.

금지: 가속도(m/s² 또는 mm/s) 혼재 · blast-vibration hero 사용.

1920x1080, vibration meter installation schematic.
```

---

## §7 IMG-043 — GNSS (GNSS-RTK-01 · MAJOR_FIX)

→ [07 GNSS 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/07_GNSS_이미지_가이드.md) · `book/GNSS.pdf`

```text
GNSS 변위 계측 — 기준국(부동)·이동국·위성·보정정보 통신·ΔEΔNΔU.

금지: 기준국→이동국 직선 시준(ATS처럼) · 제조사 로고 · EGM 복사.

1920x1080, GNSS RTK topology diagram, Korean labels.
```

---

## §8 IMG-070 — 수동 계측 (§4.8②)

**노드:** `instruments/modes/manual` · FT-C Pillow → **ai-reviewed** 권장

```text
수동 계측 흐름: 현장 방문 → 리드아웃/수준/광파 → 현장 기록.

필수: 센서형 다단식 지중경사계 측점·리드아웃기·수준기·측정일지.
금지: 데이터로거 hero · 클라우드 · 사람 얼굴 · 뇌.

1920x1080, manual monitoring workflow, simple flowchart.
```

---

## §9 IMG-071 — 자동 계측 (§4.8②)

**노드:** `instruments/modes/automatic`

```text
자동 계측: 센서 → 데이터로거 함체 → 저장·(선택) 원격 전송.

필수: 로거=회색 직사각 함체(LCD·단자) · 센서 케이블 수렴.
금지: 수동 리드아웃만 · 뇌·로봇.

1920x1080, automatic monitoring block diagram.
```

---

## §9a IMG-072 — 원격 자동계측 (§4.8②)

**노드:** `instruments/modes/remote-automatic` · redline [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-072_redline_v2_외부PNG.md)

```text
원격 자동계측: 현장 데이터로거 함체 → LTE M2M(또는 유선) → 중앙 서버 → 웹·경보 모니터링.

필수: 통신 구간·서버·대시보드 블록 분리.
금지: 로거만 · 뇌·홀로그램.

1920x1080, remote automatic monitoring topology.
```

---

## §9b IMG-073 — 스마트 계측 (§4.8②)

**노드:** `instruments/modes/smart` · redline [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-073_redline_v2_외부PNG.md)

```text
스마트 계측: 다중 현장 수집 → 관리기준 비교 → 단계별 경보 → 보고·이벤트 로그.

금지: 예쁜 UI 스크린샷만 · 뇌·로봇.

1920x1080, smart monitoring workflow block diagram.
```

---

## §9c IMG-074 — AI 계측 (§4.8②)

**노드:** `instruments/modes/ai` · redline [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-074_redline_v2_외부PNG.md)

```text
AI 계측: 시계열 → 이상탐지·예측 → 인간 확인(HITL) · AI는 보조 도구.

금지: 뇌·홀로그램·AI=최종 판단자.

1920x1080, AI-assisted monitoring with human-in-the-loop.
```

---

## §10 IMG-075 — 계측 방식 5단계 (§4.8)

**노드:** `instruments/modes/overview`

```text
계측 방식 계층: 수동 → 자동 → 원격자동 → (스마트/AI는 별도 노드) · 각 단계 역할·데이터 흐름 구분.

금지: 단일 직렬만 · 뇌·사이버 배경.

1920x1080, 5-tier measurement modes hierarchy.
```

---

## §11 IMG-076 — 동적 DAQ (§4.8)

**노드:** `instruments/datalogger/dynamic`

```text
동적 데이터로거: 고속 샘플링·트리거·버퍼·센서(가속도·진동) 연결.

금지: 정적 CR1000X와 동일 블록만 · 샘플링 개념 생략.

1920x1080, dynamic DAQ wiring schematic.
```

---

## §12 IMG-077 — MUX (§4.8)

**노드:** `instruments/datalogger/mux`

```text
멀티플렉서: 다채널 스캔·로거·센서 다수·채널 번호.

금지: 단일 센서 직결만.

1920x1080, MUX channel scan diagram.
```

---

## §13 IMG-092 — 말뚝 축력·변형률 (PILE-01 · §4.11①)

**노드:** `fields/foundation-pile` · **프롬프트:** `IMG-092_말뚝_축력_변형률_지중_단면도.md`

```text
말뚝 지중 수직 단면: 철근 cage · sister-bar 변형률계 · 선단 암반 · 지표면 · 지층(토사·풍화암·연암).

금지: 지상 기둥만 · 교량 기초침하(013) 혼동 · 선단 bearing 생략.

1920x1080, pile strain gauge cross-section, P0 지표면 아래만.
```

---

## §14 IMG-093 — 환경 소음·분진 (ENV-01 · §4.11②)

**노드:** `fields/environmental-impact` · **프롬프트:** `IMG-093_환경_소음_분진_경계_계측주.md`

```text
공사장 펜스 ↔ 민가 경계 — 소음·분진 계측주: 마이크·분진 흡입구·데이터로거 함체·방향 표기.

금지: 대기 그래프만 · 로거 빈 박스 · 경계 맥락 생략.

1920x1080, environmental monitoring station schematic.
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W10 Phase D 14종 복붙 정본 |
