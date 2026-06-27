# 전원 체계 확장 및 IMG-047 태양광 전원 재작성 계획

**작성:** 2026-06-25  
**요청:** 태양광 전원 Figure 재작성 + 전원 메뉴에 AVR·상시 전원·풍력 발전·배터리 추가  
**참고 패턴:** `instruments/datalogger` 하위 4분할(개요·정적·동적·MUX) · `docs/IMG-045_DATALOGGER_CR1000X_PLAN.md`

---

## 1. 배경

### 1.1 현행 IMG-047 불합격 사유

| 항목 | 현황 | 문제 |
|------|------|------|
| 파일 | `IMG-047_태양광-전원-시스템-구성도_패널컨트롤러배터리로거.png` | |
| 생성 | `scripts/render-datalogger-figures.py` → `render_047()` | Pillow 1차 합성 |
| 구도 | 태양광=**기울어진 평행사변형**, 직선 4블록 나열 | 패널이 도형 아이콘 수준, 실제 모듈·랙·케이블 없음 |
| 데이터로거 | `draw_legacy_datalogger_front` (번호 격자 LCD형) | CR1000X 유형(`draw_cr1000x_front`)과 불일치 |
| 배선 | 단방향 화살표 4개 | 퓨즈·접지·DC 버스·부하 분기·방전 보호 미표현 |
| 부하 박스 | 로거와 **겹침** | 가독성·매뉴얼 Figure 품질 미달 |
| 레지스트리 | `reviewGrade: PASS` (마이그레이션) | 실제 품질과 불일치 → **재감사·REGENERATE** 필요 |

**한 줄 정의:** 「무인 계측 함체의 DC 전원 단선도」여야 하며, 「색 블록 4개 + 레거시 로거」가 아니다.

### 1.2 메뉴·콘텐츠 격차

현재 `instruments/power` 하위는 **태양광 전원 1종**뿐이다.

```text
instruments/power
  └── instruments/power/solar-power   ← 유일
```

현장 자동계측 전원은 태양광만으로 설명되지 않는다. 관리동 **AC 상시 전원**, **AVR** 안정화, **배터리** 백업, 일부 무인 구간 **풍력** 보조가 병행된다.

---

## 2. 목표 메뉴 구조

데이터 로거 확장과 동일 패턴으로 **개요 + 5개 전원 유형**을 둔다.

```text
instruments/power (그룹 — 콘텐츠 페이지 없음)
  ├── instruments/power/overview          전원 개요 (신규)
  ├── instruments/power/solar-power       태양광 전원 (기존 — IMG-047 재작성)
  ├── instruments/power/ac-mains          상시 전원 (신규)
  ├── instruments/power/avr               AVR (신규)
  ├── instruments/power/wind-power        풍력 발전 (신규)
  └── instruments/power/battery           배터리 (신규)
```

| 노드 ID | 라벨 | 대표 Figure | 연계 노드 |
|---------|------|-------------|-----------|
| `instruments/power/overview` | 전원 개요 | IMG-065 (신규, 통합 블록도) | 전원 하위 전체 |
| `instruments/power/solar-power` | 태양광 전원 | **IMG-047** (재작성) | 자동계측·태양광 |
| `instruments/power/ac-mains` | 상시 전원 | IMG-066 | 관리동·터널 구간 AC |
| `instruments/power/avr` | AVR | IMG-067 | AC 입력 안정화 |
| `instruments/power/wind-power` | 풍력 발전 | IMG-068 | 하이브리드 무인 현장 |
| `instruments/power/battery` | 배터리 | IMG-069 | 모든 DC 백업 |

**이미지 ID 할당:** 마스터 리스트 다음 번호 **IMG-065~069** (5종). IMG-047은 기존 ID 유지·PNG 교체만.

---

## 3. IMG-047 재작성 — 합격 Figure 사양

### 3.1 구도 (16:9, 1920×1080)

```text
[상단 15%] 제목: 태양광 전원 시스템 구성도
[중앙 70%] 좌→우 전원 흐름 (단선도)
  태양광 패널(랙·기울기 15~30°) → PV 케이블 → 충전제어기(MPPT/PWM)
  → 배터리(12V, AGM/리튬) → 퓨즈·DC 분배 → 데이터로거(CR1000X 유형) + 통신 + 센서 Excitation
[하단 15%] 범례: + / − / GND / 12V DC
[우측 콜아웃] 설계 포인트 3줄 (일사량·Ah·방전 깊이)
```

### 3.2 필수 포함 요소

| 요소 | 표현 |
|------|------|
| 태양광 패널 | 직사각 모듈 **다수** (2×2 이상), 알루미늄 랙, 남향 기울기 |
| 충전제어기 | 소형 금속/플라스틱 박스, PV/BAT/LOAD 단자 라벨 |
| 배터리 | 12V 밀폐형(AGM) 또는 LiFePO₄ 블록, **+−** 극성 |
| 보호 | 퓨즈·역극성·과방전 차단(제어기 LOAD 출력) |
| 데이터로거 | `draw_cr1000x_front` — 배선판형 |
| 부하 | 로거·LTE 모뎀·센서 전원 — **분기선**, 로거와 겹치지 않게 |
| 함체 | (선택) IP65 계측 함체 실루엣 — 패널은 외부, 전자부는 내부 |

### 3.3 금지

- 기울어진 단일 평행사변형만 있는 「태양광」
- 레거시 로거 격자 전면
- 브랜드·모델명(Victron, Morningstar 등) 인쇄
- 220V AC 혼입 (태양광 전용 Figure — AC는 IMG-066/067)
- 사람·실제 현장명·과도한 3D

### 3.4 구현 경로

| 우선순위 | 경로 | 파일 |
|----------|------|------|
| **A (1차)** | Pillow 전용 드로잉 | `scripts/lib/power_draw.py` 신규 + `render_047()` 교체 |
| B (품질 보완) | AI 생성 | `prompts/IMG-047` v2 |
| C | 복합 | Pillow 베이스 + AI 배경 정리 |

**Pillow 수정 즉시 항목 (`render_047`):**

- `draw_legacy_datalogger_front` → `draw_cr1000x_front`
- 태양광: `draw_solar_array()` — 모듈 그리드 + 랙
- 부하 박스와 로거 **분리 배치**
- MPPT/PWM, 과방전 보호 콜아웃

---

## 4. 신규 Figure 개요 (IMG-065~069)

### IMG-065 — 현장 계측 전원 통합 구성도 (overview hero)

**목적:** 5가지 전원이 한 현장에서 어떻게 조합되는지 1장 요약.

```text
[무인 구간]  태양광 + 풍력 → 충전제어 → 배터리 → DC 부하(로거)
[관리동/AC]  상시 전원 220V → AVR → UPS/정류 → 배터리 병행 또는 DC 직供
화살표로 「주 전원」「백업」「보조」 구분 (점선=선택)
```

### IMG-066 — 상시 전원 (AC 인입)

**목적:** 관리동·터널 전기실·임시 배전반에서 220V/380V 인입 → 계측 함체.

- 배전반·차단기·접지·Surge protector
- AC→DC 스위칭 전원(12V/24V) 또는 UPS 입력
- KCS 현장: AC 가능 구간 병용이 안정성↑ (기존 FAQ와 일치)

### IMG-067 — AVR (자동 전압 조정기)

**목적:** 불안정 AC(발전기·약전압)를 정격 전압으로 안정화 후 민감 부하에 공급.

- 입력 변동(±20~30%) → AVR → 220V±1~3% 출력
- 계측 로거·통신 전단 또는 함체 입력
- (선택) AVR + 절연변압기 2단 — 지반 루프·노이즈 억제

### IMG-068 — 풍력 발전 (소형 터빈)

**목적:** 태양광 보완(야간·우천·동절기) 하이브리드.

- 소형 HAWT/VAWT + 충전제어기 + 공용 배터리
- 통신 기지국·사면 무인 계측과 유사 토폴로지
- 풍속 자원 부족 시 태양광 단독 대비 **선택** 요소임을 캡션 명시

### IMG-069 — 배터리·축전지

**목적:** DC 백업의 중심 — 용량 산정·방전 깊이·온도.

- AGM·Gel·LiFePO₄ 비교 표 (Figure 내 소형)
- Ah·DoD·자가방전·동절기 히팅
- 원격 모니터링: 전압·SOC·충전 상태

---

## 5. 콘텐츠 초안 (웹 본문용)

> 출처: 원격 계측·통신 기지국 하이브리드 전원 관행, 지반/지질 탐사 현장 전원 보호 가이드, MPPT 충전제어기 제조사 기술 자료, CEDRO 하이브리드 풍력·태양광 가이드라인 등을 토목 계측 맥락으로 재구성. 브랜드명은 본문에서 **대표 사례**로만 언급, Figure에는 인쇄 금지.

### 5.1 `instruments/power/overview` — 전원 개요

- **정의:** 데이터로거·통신·센서에 **안정 DC(주로 12V/24V)** 를 공급하는 현장 전원 체계.
- **분류:** 상시 AC · AVR · 태양광 · 풍력 · 배터리 — 상호 **병행·백업** 관계.
- **설계 흐름:** 부하 전류 산정 → 주 전원 선정 → 배터리 Ah·DoD → 충전원(태양광 Wp·풍력 W) → 보호·접지·원격 전압 감시.
- **KCS 연계:** 무인 자동계측 구간은 전원 단절=데이터 결측 → 전원 KPI(전압 하한·SOC)를 원격계측과 연동.

### 5.2 `instruments/power/solar-power` — 태양광 (기존 확장)

| 항목 | 내용 |
|------|------|
| 구성 | PV 모듈 · MPPT/PWM 충전제어기 · 배터리 · DC 분배 |
| 설계 | 일사량·흐림·동절기 가정, Wp = (일일 Wh ÷ PEAK SUN h) ÷ 효율 |
| 운영 | 패널 오염·그늘·낙뢰·접지, 충전제어기 LOAD 과방전 차단 |
| 진단 | 원격: 배터리 전압·PV 전압·충전 전류 (로거 아날로그 채널 또는 통신) |

### 5.3 `instruments/power/ac-mains` — 상시 전원

| 항목 | 내용 |
|------|------|
| 정의 | 관리동·터널 구간·건설 임시 **AC 220V/380V** 인입 전원 |
| 구성 | 배전반·차단기·누전차단·Surge · AC-DC 전원공급장치(12V) · (선택) UPS |
| 적용 | AC 인프라가 있는 굴착 현장, 상시 통신·로거 가동 |
| 유의 | 현장 발전기·약전압망은 **AVR·UPS** 후단 연결 권장 |

### 5.4 `instruments/power/avr` — AVR

| 항목 | 내용 |
|------|------|
| 정의 | **Automatic Voltage Regulator** — 입력 전압 변동 시 출력 전압을 정격(220V) 근처로 자동 유지 |
| 원리 | 서보·탭체인저 또는 고체소자(SCR) 방식; 출력 정밀도 통상 **±1~3%** |
| 적용 | 디젤 발전기·약전압 배전·굴착 현장 임시 전력 → 계측 함체·통신 장비 입력 |
| 병행 | 고정밀 계측: AVR → 절연변압기 → UPS 3단 (지질·지반 탐사 현장 관행) |
| 원격 | (고급) Modbus·SNMP 전압 이력 — 스마트 계측 플랫폼 연동 |

### 5.5 `instruments/power/wind-power` — 풍력 발전

| 항목 | 내용 |
|------|------|
| 정의 | 소형 풍력터빈(통상 **수 kW 이하**)으로 DC 충전 보조 |
| 하이브리드 | 태양광(주간) + 풍력(야간·우천) → **공용 배터리** — 통신 기지국·무인 계측과 동일 아키텍처 |
| 선정 | 지역 **풍속·난류** 조사 필수; 부족 시 경제성·구조물 부담 대비 효과 낮음 |
| 구성 | 터빈 · 풍력충전제어기 · 견고 마스트 · 배터리 · (선택) 디젤 백업 |
| 계측 현장 | 사면·해안 무인 구간, 겨울철 일조 부족 시 보조 |

### 5.6 `instruments/power/battery` — 배터리

| 항목 | 내용 |
|------|------|
| 역할 | 전원 변동 버퍼·야간·흐림·통신 피크 전류 보상 |
| 종류 | 납축 AGM/Gel(일반) · LiFePO₄(고온·사이클·경량) |
| 설계 | 용량(Ah) = (자립 일수 × 일일 소비 Ah) ÷ 허용 DoD; 동절기 **용량 여유 1.3~1.5** |
| 보호 | 과충전·과방전·역극성·저온 충전 제한(리튬 BMS) |
| 운영 | 정기 전압 점검·교체 주기·함체 환기·온도 |

---

## 6. 코드·문서 변경 목록

### Phase 0 — 계획·검수 (본 문서)

| # | 산출물 | 상태 |
|---|--------|------|
| 0.1 | 본 계획서 | ✅ |
| 0.2 | `07_전원_이미지_가이드.md` (ImageWorks) | ✅ |
| 0.3 | `00_STYLE_GUIDE.md` §전원 체계 | ✅ |
| 0.4 | `INSTRUMENTATION_DRAWING_RULES.md` §3.15 | ✅ |
| 0.5 | `IMAGE_AUDIT_CHECKLIST.md` §4.11 | ✅ |
| 0.6 | `01_IMAGE_MASTER_LIST.csv` IMG-065~069 행 | ✅ |
| 0.7 | IMG-047 레지스트리 PASS | ✅ |

### Phase 1 — IMG-047 재작성 (P0)

| # | 작업 |
|---|------|
| 1.1 | `scripts/lib/power_draw.py` — `draw_solar_array`, `draw_charge_controller`, `draw_battery_12v` |
| 1.2 | `render_047()` 전면 교체 + CR1000X 로거 |
| 1.3 | `prompts/IMG-047` v2 (구도·금지·필수 요소) |
| 1.4 | PNG·source·WebP·`images.js` |
| 1.5 | `npm run audit:images` — IMG-047 PASS 확인 |

### Phase 2 — 메뉴·콘텐츠 (P1)

| # | 파일 |
|---|------|
| 2.1 | `js/technology/dictionary.js` — TREE·NODES·KEYWORD_MAP |
| 2.2 | `scripts/content-data/instruments.mjs` — overview + 4 신규 섹션, solar 확장 |
| 2.3 | `scripts/build-content-data.mjs` — LABELS·intro 문구 |
| 2.4 | `js/technology/tree-icons.js` |
| 2.5 | `build:content` → `generate-technology-seo-pages` → `validate:terminology` |

### Phase 3 — 신규 Figure (P2, 순차)

| ID | Pillow 함수 | 프롬프트 |
|----|-------------|----------|
| IMG-065 | `render_065()` 통합 | `IMG-065_현장_계측_전원_통합_구성도.md` |
| IMG-066 | `render_066()` | `IMG-066_상시_전원_AC_인입.md` |
| IMG-067 | `render_067()` | `IMG-067_AVR_자동전압조정기.md` |
| IMG-068 | `render_068()` | `IMG-068_풍력_하이브리드_전원.md` |
| IMG-069 | `render_069()` | `IMG-069_배터리_축전_시스템.md` |

### Phase 4 — 연계 수정 (P3)

- `instruments/modes/automatic` · `sensors/datalogger` — 전원 하위 링크 문구 ✅
- `instruments/power/solar-power` FAQ — 배터리·AVR 전용 페이지 분리 ✅
- `docs/image-audit.md` · `IMAGE_REGENERATION_PROMPTS.md` 갱신 — 부분 (전원 섹션 ✅)
- SEO 페이지 +9 — sitemap **107 URL** ✅

---

## 7. 우선순위·일정 (권장)

| 단계 | 기간 | 산출 |
|------|------|------|
| **P0** | 0.5일 | IMG-047 Pillow 재작성 + 육안 합격 |
| **P1** | 0.5일 | 메뉴 6종 + 웹 콘텐츠 (Figure 없이 텍스트·IMG-047만) |
| **P2** | 1~2일 | IMG-065~069 Pillow 1차 + 프롬프트 |
| **P3** | 0.5일 | 감사·SEO·용어 검증·백로그 정리 |

**권장 착수 순서:** P0(태양광 그림) → P1(메뉴·본문) → P2(나머지 Figure).

---

## 8. 검수 체크리스트 (IMG-047 재작성 후)

- [x] 태양광 = 직사각 모듈 그리드 (단일 평행사변형 아님)
- [x] 데이터로거 = **범용 산업용** 배선판 (`draw_legacy_datalogger_front` — CR1000X 실사 금지)
- [x] 충전제어기·배터리·퓨즈·12V 라벨 존재
- [x] 부하 분기가 로거와 겹치지 않음
- [x] AC·220V·AVR·풍력이 **이 Figure에 없음** (태양광 DC 전용)
- [x] 브랜드·현장명 없음
- [x] `audit:images` PASS · WebP 동기화

---

## 9. 참고 자료 (조사 요약)

| 주제 | 요지 | URL (참고) |
|------|------|------------|
| 태양광 충전제어 | MPPT/PWM, 과충전·과방전 보호, LOAD 출력 | [Solara charge controllers](https://solara.de/en/charge-controller-remote-meter/) |
| 원격 계측 전원 | 12V·PV 입력·MPPT·배터리 진단 | [QuakeLogic QL-NanoSUM](https://products.quakelogic.net/product/ql-nanosum-ip68/) |
| AVR | ±1~3% 출력, 불안정 입력 보정 | [Sollatek AVR3LS](https://www.sollatek.com/) |
| 현장 전원 3단 | 발전 → 안정화/절연 → UPS | [Geotech field power guide](https://geotechcn.net/service/field-ups-power-protection-guide-for-geological-exploration/) |
| 풍력+태양광 하이브리드 | 배터리 버퍼, 야간·우천 보완 | [CEDRO hybrid PV/micro-wind PDF](https://www.cedro-undp.org/Library/Assets/Gallery/Publications/Hybrid%20Solar%20PV,%20Micro-Wind%20With%20Storage.pdf) |
| 통신 기지국 하이브리드 | 4G 모니터링, 풍력+PV+배터리 | [PVMARS telecom hybrid](https://www.pvmars.com/how-to-make-wind-solar-hybrid-systems-for-telecom-stations/) |

---

## 10. 다음 액션 (승인 후)

1. **P0 착수:** `power_draw.py` + `render_047()` 재작성 및 PNG 배포  
2. **P1 병행:** dictionary·instruments.mjs 메뉴 6종 반영  
3. 본 계획서 승인 시 `07_전원_이미지_가이드.md` 및 IMG-047 프롬프트 v2 작성
