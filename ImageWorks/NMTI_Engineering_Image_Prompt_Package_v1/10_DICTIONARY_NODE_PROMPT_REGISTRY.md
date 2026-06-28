# dictionary.js 노드 — hero·프롬프트 레지스트리

**용도:** `js/technology/dictionary.js` 각 노드의 hero Figure(IMG-###)와 AI 프롬프트 출처를 한눈에 조회  
**정본 가이드:** [../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md](../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) — §4.9 대형인프라 · §4.5⑨ MPBX · §6.1 배치 QA  
**판정표:** [38 hero 판정](../../docs/38-AI-프롬프트-hero-픽셀-감사-판정표.md) · **마스터 97종** · PNG pending: 089·090·091

> AI에 입력 시: **docs/36 §2 Cursor 템플릿** + 본 표의 `프롬프트` 열 + `00_STYLE_GUIDE.md` Negative Prompt

---

## 사용법

1. `nodeId`로 행을 찾는다.
2. [36-AI 가이드 §2](../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) Cursor 템플릿에 `[ID]` = hero, `[nodeId]` = nodeId.
3. §4에 상세 EN 프롬프트가 있으면 **System/Context**에 추가.
4. 흙막이·인접건물 단면은 [14 §2](../../docs/14-흙막이-굴착-계측-개념도-AI-생성-가이드라인.md) 블록 **필수**.

---

## fields — 가시설·굴착

| nodeId | hero | 프롬프트 / 계획 | 36 § |
|--------|------|-----------------|------|
| `fields/retaining-excavation` | IMG-001 | `prompts/IMG-001_*.md` | §4.1 |
| `fields/retaining-excavation/earth-retaining-wall` | IMG-002 | `IMG-002` · [19](../../docs/19-IMG-002-흙막이-계측-대표-단면도-오류분석-및-재작업-계획.md) | §4.1① |
| `fields/retaining-excavation/strut` | IMG-003 | `IMG-003` | §4.1② |
| `fields/retaining-excavation/anchor` | IMG-004 | [26](../../docs/26-IMG-004-어스앵커-하중계-오류분석-및-재작업-계획.md) | §4.1③ |
| `fields/retaining-excavation/adjacent-building` | IMG-005 | [15](../../docs/15-IMG-005-주변건물-균열경사-오류분석-및-재작업-계획.md) | §4.1⑤ |
| `fields/retaining-excavation/surrounding-ground` | IMG-096 | [57](../../docs/57-IMG-096-가시설-주변지반-계측-표현-표준.md) · [110 v4](../../docs/110-IMG-096-옹벽삭제-가시설-주변지반-재작업-계획.md) · [18](../../docs/18-주변지반-계측-설치-단면도-수정-계획.md) | §4.1④ |

## fields — 터널

| nodeId | hero | 프롬프트 / 계획 | 36 § |
|--------|------|-----------------|------|
| `fields/tunnel` | IMG-007 | `IMG-007` | §4.2 |
| `fields/tunnel/crown-settlement` | IMG-061 | 천단침하 · 외부 수준점 | §4.2① |
| `fields/tunnel/convergence` | IMG-008 | [20](../../docs/20-IMG-008-터널-내공변위-오류분석-및-재작업-계획.md) | §4.2① |
| `fields/tunnel/surface-subsidence` | IMG-010 | `IMG-010` | §4.2③ |
| `fields/tunnel/ground-displacement` | IMG-025 | 지중경사계 맥락 | §4.2③ |
| `fields/tunnel/ground-displacement` | IMG-025 | 지중경사계 맥락 | §4.5① |
| `fields/tunnel/face-advance` | IMG-063 | `IMG-063` | — |
| `fields/tunnel/rockbolt` | IMG-078 | [21](../../docs/21-IMG-078·009-록볼트-축력-오류분석-및-재작업-계획.md) | §4.2④ |
| `fields/tunnel/shotcrete` | IMG-079 | [22](../../docs/22-IMG-079-숏크리트-응력-변형-오류분석-및-재작업-계획.md) | §4.2⑤ |
| `fields/tunnel/blast-vibration` | IMG-097 | [23](../../docs/23-IMG-097-터널-발파진동-영향권-오류분석-및-재작업-계획.md) | §4.2② |
| `fields/tunnel/steel-support` | IMG-080 | `IMG-080` | — |

## fields — 교량

| nodeId | hero | 프롬프트 / 계획 | 36 § |
|--------|------|-----------------|------|
| `fields/bridge` | IMG-011 | INSTRUMENTATION §3.23 · BRI-01 | §4.6 |
| `fields/bridge/pier` | IMG-012 | `IMG-012` v2 | §4.6 |
| `fields/bridge/abutment` | IMG-038 | 경사계 맥락 | §4.6 |
| `fields/bridge/foundation-settlement` | IMG-013 | `IMG-013` v2 | §4.6 |
| `fields/bridge/expansion-joint` | IMG-014 | `IMG-014` | — |
| `fields/bridge/vibration` | IMG-086 | `IMG-086` | — |
| `fields/bridge/temperature` | IMG-088 | `IMG-088` | — |
| `fields/bridge/seismic` | IMG-087 | `IMG-087` | — |
| `fields/bridge/deck-displacement` | IMG-085 | `IMG-085` | — |

## fields — 사면·연약지반·기타

| nodeId | hero | 프롬프트 / 계획 | 36 § |
|--------|------|-----------------|------|
| `fields/slope` | IMG-015 | §3.12 | §4.3 |
| `fields/slope/slip-surface` | IMG-016 | 활동면 | §4.3① |
| `fields/slope/surface-tilt` | IMG-089 | 지표경사계 · pad | §4.3② |
| `fields/slope/structural-displacement` | IMG-090 | 옹벽·**와이어식 변위계** · (보조) ATS | §4.3③ · [127](../../docs/127-변위계측-자동광파기-남용방지-및-와이어식-우선-표준.md) |
| `fields/slope/rainfall` | IMG-018 | `IMG-018` | — |
| `fields/soft-ground` | IMG-019 | `IMG-019` v2 | §4.7 |
| `fields/soft-ground/settlement` | IMG-020 | `IMG-020` | §4.7 |
| `fields/soft-ground/lateral-flow` | IMG-021 | `IMG-021` | §4.7 |
| `fields/soft-ground/pore-pressure` | (부모 019) | `sensors/piezometer` IMG-031 | §4.7 |
| `fields/structural-safety` | IMG-022 | **≠ building(100)** | §4.10② |
| `fields/structural-safety/crack` | IMG-022 · 037 | 균열 상세 | §4.10② |
| `fields/railway` | IMG-023 | `IMG-023` v2 | §4.9③ · §4.10① |
| `fields/railway/track-displacement` | IMG-023 | 궤도 틀림 · rail tiltmeter | §4.10① |
| `fields/railway/track-settlement` | IMG-023 | 노반 침하계 | §4.10① |
| `fields/railway/adjacent-construction` | IMG-023 | 인접공사 | §4.9③ |
| `fields/dam` | IMG-024 | [32 댐](../../docs/32-IMG-024-댐-계측-개념도-오류분석-및-재작업-계획.md) · §4.9① | §4.9① |
| `fields/dam/displacement` · `leakage` | IMG-024 | seepage = `leakage` | §4.9① |
| `fields/dam/temperature` | IMG-088 | `IMG-088` | — |
| `fields/dam/seismic` | IMG-087 | `IMG-087` | — |
| `fields/dam/strain` | IMG-083 | `IMG-083` | — |
| `fields/dam/tilt` | IMG-033 | `IMG-033` | — |
| `fields/dam/river-levee` | IMG-024 | 제방 = 댐 hero 공유 | — |

## fields — 항만·건축

| nodeId | hero | 프롬프트 / 계획 | 36 § |
|--------|------|-----------------|------|
| `fields/harbor` | IMG-064 | `IMG-064` v2 | §4.9② |
| `fields/harbor/quay-wall` | IMG-064 | 안벽 개요 | §4.9② |
| `fields/harbor/caisson` | IMG-084 | 케이슨 상세 | §4.9② |
| `fields/harbor/structure` | IMG-084 | `IMG-084` v2 | §4.9② |
| `fields/harbor/surrounding-ground` | IMG-064 | `IMG-064` | §4.9② |
| `fields/harbor/tide-groundwater` | IMG-098 | [33](../../docs/33-항만-호안-조위지하수-오류분석-및-재작업-계획.md) HAR-01~04 | — |
| `fields/building` | IMG-100 | [35](../../docs/35-건축공사-계측-이미지-전수-수정-보고.md) BLD-H-01 | §4.4① |
| `fields/building/deflection` | IMG-099 | [34](../../docs/34-건축-구조물-처짐-오류분석-및-재작업-계획.md) DEF-01~04 | §4.4② · §4.10② |
| `fields/building/column-shortening` | IMG-081 | `IMG-081` | — |
| `fields/building/crack` | IMG-037 | `IMG-037` | §4.4④ · §4.10② |
| `fields/building/adjacent-building` | IMG-101 | BLD-ADJ-01 · **≠ IMG-005** | §4.4③ | §4.4③ |
| `fields/building/stress-strain` | IMG-082 | `IMG-082` | — |
| `fields/foundation-pile` | IMG-092 | **PNG pending** · PILE-01~03 | §4.11① · §2.4 |
| `fields/foundation-pile/cast-in-place-pile` | IMG-092 | CIP cage · sister-bar | §4.11① |
| `fields/foundation-pile/precast-pile` | IMG-092 | PHC · pilot 맥락 | §4.11① |
| `fields/environmental-impact` | IMG-093 | **PNG pending** · ENV-01~03 | §4.11② |
| `fields/environmental-impact/noise-level` | IMG-093 | dB · mic | §4.11② |
| `fields/environmental-impact/dust-concentration` | IMG-093 | PM inlet | §4.11② |

## sensors — 계측기

| nodeId | hero | 프롬프트 / 계획 | 36 § |
|--------|------|-----------------|------|
| `sensors/inclinometer` | IMG-025 | [09 표준](./09_지중경사계_센서형-다단식_표현_표준.md) | §4.5① |
| `sensors/water-level-meter` | IMG-030 | open standpipe | §4.5⑧ |
| `sensors/piezometer` | IMG-031 | filter tip | §4.5② |
| `sensors/settlement-gauge` | IMG-032 | `IMG-032` v2 | §4.5⑦ |
| `sensors/layer-settlement-gauge` | IMG-033 | 다점 침하 | §4.5⑦ |
| `sensors/earth-pressure-cell` | IMG-034 | 벽면 토압 | §4.5⑧ |
| `sensors/load-cell` | IMG-035 | `IMG-035` | §4.5⑤ |
| `sensors/strain-gauge` | IMG-036 | `IMG-036` v2 | §4.5④ |
| `sensors/crack-meter` | IMG-037 | `IMG-037` | §4.5③ |
| `sensors/tilt-meter` | IMG-038 | `IMG-038` v2 · **≠ 지중경사계** | §4.5⑥ |
| `sensors/joint-meter` | IMG-039 | 신축이음 | §4.5⑧ |
| `sensors/borehole-extensometer` | IMG-091 | MPBX · `sensor/extensometer` | §4.5⑨ |
| `sensors/displacement-transducer` | IMG-040 | LVDT | §4.5⑧ |
| `sensors/vibration-meter` | IMG-041 | `IMG-041` | §4.5⑧ |
| `sensors/automated-total-station` | IMG-042 | `IMG-042` | §4.5⑧ |
| `sensors/gnss` | IMG-043 | [07 GNSS](./07_GNSS_이미지_가이드.md) | §4.5⑧ |
| `sensors/weather-station` | IMG-044 | `IMG-044` | §4.5⑧ |
| `sensors/datalogger` | IMG-045 | [06 CR1000X](./06_데이터로거_CR1000X_이미지_가이드.md) | — |
| `sensors/remote-monitoring-system` | IMG-058 | `IMG-058` v2 · **INSTRUMENT_SUBGROUPS E2E** | §4.13 |

### `INSTRUMENT_SUBGROUPS` (dictionary.js hub — 트리 폴더, sitemap 제외)

| subgroup id | 역할 | E2E Figure 블록 (IMG-058) | 대표 leaf hero |
|-------------|------|---------------------------|----------------|
| `instruments/sensors` | 센서 그룹 | 좌측 sensor symbols | §4.5 |
| `instruments/datalogger` | 로거 그룹 | logger enclosure | IMG-045 |
| `instruments/power` | 전원 그룹 | solar → battery | IMG-047 |
| `instruments/communication` | 통신 그룹 | LTE-M/LoRa modem | IMG-048 |
| `instruments/modes` | 계측 방식·운영 | server → dashboard | IMG-075 |

## instruments — 시스템

| nodeId | hero | 프롬프트 / 계획 | 36 § |
|--------|------|-----------------|------|
| `instruments/datalogger/static` | IMG-045 | [06](./06_데이터로거_CR1000X_이미지_가이드.md) | §4.8① |
| `instruments/datalogger/dynamic` | IMG-076 | `IMG-076` | §4.8① |
| `instruments/datalogger/multiplexer` | IMG-077 | `IMG-077` | §4.8① |
| `instruments/communication/iot-gateway` | IMG-046 | `IMG-046` v2 | §4.8② |
| `instruments/communication/lte-remote` | IMG-048 | [13 LTE](../../docs/13-LTE-M2M-용어-및-Figure-개편-계획.md) | §4.8② |
| `instruments/power/solar-power` | IMG-047 | `IMG-047` v2 | §4.8③ |
| `instruments/power/overview` | IMG-065 | `IMG-065` | §4.8③ |
| `instruments/power/ac-mains` | IMG-066 | `IMG-066` | §4.8③ |
| `instruments/power/avr` | IMG-067 | `IMG-067` | §4.8③ |
| `instruments/power/wind-power` | IMG-068 | `IMG-068` | §4.8③ |
| `instruments/power/battery` | IMG-069 | `IMG-069` | §4.8③ |
| `instruments/modes/manual` | IMG-070 | `IMG-070` | §4.8② |
| `instruments/modes/automatic` | IMG-071 | `IMG-071` | §4.8② |
| `instruments/modes/remote-automatic` | IMG-072 | `IMG-072` v2 | §4.8② |
| `instruments/modes/overview` | IMG-075 | `IMG-075` | §4.8② |
| `instruments/modes/smart` | IMG-073 | **뇌·추상 네트워크 금지** | §4.8② |
| `instruments/modes/ai` | IMG-074 | `IMG-074` v2 · **뇌 금지** | §4.8② |
| `instruments/modes/normal-mode` | IMG-094 | **PNG pending** · OPM-N | §4.12① |
| `instruments/modes/realtime-mode` | IMG-095 | **PNG pending** · OPM-R | §4.12② |
| `instruments/modes/alarm-status` | IMG-102 | **PNG pending** · OPM-A | §4.12③ |

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-22 | 최초 — dictionary.js hero 전수 매핑 · docs/36 연계 |
| 2026-06-22 | 주변지반·터널침하·교량·연약지반 §4.1④~§4.7 · pore-pressure 노드 |
| 2026-06-22 | §4.1⑤ 주변건물 · §4.8 instruments/* · §2.1 Prefix · building/adjacent |
| 2026-06-22 | §4.5 sensors/* 전수 · §2.2 System Prompt · §7 워크플로 |
| 2026-06-22 | §4.9 dam/harbor/railway · §4.5⑨ MPBX · quay-wall/caisson · 089~091 |
| 2026-06-22 | §4.13 INSTRUMENT_SUBGROUPS E2E(058) · §9 Wrap-up |
| 2026-06-22 | §4.12 운영 모드(094·095·102) · §2.5 Master Prompt Package |
| 2026-06-22 | §4.11 기초·말뚝(092) · 환경·민원(093) · §2.4 Soil Layering Rule |
| 2026-06-22 | §4.10 철도 리프·건축/구조물 · §5.2 Troubleshooting · nodeId 별칭 표 |
