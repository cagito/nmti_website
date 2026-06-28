# Cursor 작업 지시서

이 폴더는 NMTI 홈페이지 "건설계측 기술자료" 페이지에 사용할 이미지 제작 패키지입니다.

## 사용 방법
0. **그림·글 작성 전 필독:** [28-공학감사 §1](../../docs/28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) · [INSTRUMENTATION §3](../../docs/INSTRUMENTATION_DRAWING_RULES.md)
0a. 용어·라벨은 `book/KDS-KCS_용어기준.md`를 먼저 확인한다.
0b. **지중경사계 Figure** — 라벨·범례는 반드시 **`센서형 다단식 지중경사계`** ([09 표준](./09_지중경사계_센서형-다단식_표현_표준.md)) · **GL 천공·개구부 가시** ([111 BORE-GL-01](../../docs/111-지중경사계-지하수위계-지표면-천공-가시-표준.md))
0b2. **지하수위계 Figure** — **GL에서 천공** · **well cap 지표면 가시** (BORE-GL-01 · [111](../../docs/111-지중경사계-지하수위계-지표면-천공-가시-표준.md))
0c. **굴착 단면·인접건물** — [27-지표면-원칙](../../docs/27-지표면-건물-안착-원칙.md) C0 · [14 §2](../../docs/14-흙막이-굴착-계측-개념도-AI-생성-가이드라인.md)
0d. **교량 분야** — INSTRUMENTATION §3.23 · BRI-01 금지 (굴착 템플릿 재사용 금지)
0e. **★ AI 이미지 생성 (모든 Figure)** — [36-AI 가이드](../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) §2.2 System Prompt(세션 1회) + **§2.1 Prefix**(매회) + §4 EN 블록. **워크플로 §7** · 실패 시 §5 · 부분 오류 §5.1 · **배치 생성 시 §6.1 QA 4항**
1. `01_IMAGE_MASTER_LIST.csv`를 열어 전체 이미지 목록을 확인한다.
2. `prompts/` 폴더에서 각 이미지 ID에 해당하는 프롬프트 파일을 연다.
3. 각 파일의 `최종 생성 프롬프트`를 이미지 생성 AI에 입력한다.
4. 생성 결과물은 아래 규칙으로 저장한다.

## 저장 규칙
- 웹 배포: `assets/images/technology/IMG-###_설명-slug.png`
- 예: `IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.png`
- 원본 보관: `assets/images/technology/source/` (동일 파일명)
- WebP 변환: `python scripts/convert-technology-webp.py` → `assets/images/technology/IMG-###.webp`
## 이미지 (우선순위)

1. **⛔ 에이전트 SVG Figure 금지** — [16-에이전트-SVG-생성-금지.md](../../docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md) · `render-svg-figures` · `*_svg.py` **사용하지 않음**
1a. **흙막이·가시설 단면** — §14 `[조건/제약사항]` + **인간/검수 AI → PNG**
2. 레거시 산업용 로거 Figure: `npm run render:p3` · `npm run render:power` — [06 데이터로거 가이드](./06_데이터로거_CR1000X_이미지_가이드.md)
- `node scripts/generate-image-assets.mjs` 실행 시 `js/technology/images.js` 자동 갱신 (webp 있으면 primary)

## ALT 텍스트 규칙
ALT = CSV의 Title + " - " + Purpose (`generate-image-assets.mjs`가 생성)

## 페이지 연결 규칙
- 분야별 이미지는 TreeView 분야별·하위 항목 설명에 배치 (`js/technology/dictionary.js` → `imageId`)
- 센서별 이미지는 각 센서 상세 페이지의 `개요`, `측정 원리`, `설치 방법`, `데이터 해석` 섹션에 배치
- 시스템 이미지는 플랫폼/원격계측/경보/보고서 섹션에 배치

### 데이터로거 (CR1000X 유형) — 필수 참고
- **소형 측정·제어 로거** 외형 통일. 접속함·「DATA LOGGER」 세로 박스 금지.
- 상세: [06_데이터로거_CR1000X_이미지_가이드.md](./06_데이터로거_CR1000X_이미지_가이드.md)
- 표준 Figure: **IMG-045** (`sensors/datalogger`) — v2 PASS · `python scripts/render-datalogger-figures.py --id 045`

### 흙막이 계측 (IMG-001·002) — 필수 참고
- **대표 단면도.** 좌→우: `[좌] 인접건물 | 배면(연속 토사) | 벽체·띠장 | [우] 굴착측(유일한 공동)` + **11종** 계측기(데이터로거 포함). 하단 원격계측 흐름도 금지.
- **치명 금지:** 건물 아래 굴착 공동, 옥상 광파기 본체, 「자동광파기 측정(프리즘)」, 경사계 지반 속
- 공통: [INSTRUMENTATION_DRAWING_RULES.md](../../docs/INSTRUMENTATION_DRAWING_RULES.md) §3.1
- 상세: [05_흙막이_계측_이미지_가이드.md](./05_흙막이_계측_이미지_가이드.md) · [docs/04-흙막이-계측-구현.md](../../docs/04-흙막이-계측-구현.md)
- 참고 원본: `assets/images/technology/source/reference-retaining/ref-*.png`
- 프롬프트: IMG-001 **v3**, IMG-002 **v7**
- 연결: `fields/retaining-excavation` (001 hero), `fields/retaining-excavation/earth-retaining-wall` (002 hero)
- 분할: IMG-003(버팀보), IMG-004(앵커), IMG-005(인접건물), IMG-062(지하수위·간극수압)
- 현재: **PASS** — `npm run render:p1` (Pillow v8, 2026-06-25)

### 터널 내공변위 (IMG-008) — 필수 참고
- **내공변위 전용.** 천단침하와 합치지 않는다.
- **🚨 치명:** 하부(도로·철도)까지 360° 원형 폐합 금지 — **상부 아치(U자형)만**. 미충족 시 **외부 배포 금지**.
- **ACE 등 제3자 제품명 금지.**
- 렌더: `python scripts/render-img008-tunnel-convergence.py`
- **P1 blocker 일괄:** `npm run render:p1` → IMG-001·002·015·043 (Pillow)
- 상세·슬로건·체크리스트: [04_터널_내공변위_이미지_가이드.md](./04_터널_내공변위_이미지_가이드.md) §치명 오류
- 상세: [04_터널_내공변위_이미지_가이드.md](./04_터널_내공변위_이미지_가이드.md)
- 연결 노드: `fields/tunnel/convergence`
- 천단침하(`fields/tunnel/crown-settlement`) → **IMG-061** (`prompts/IMG-061_천단침하계_외부_수준점_계측_개념도.md`)

### GNSS (IMG-043) — 필수 참고
- **1순위 참고 원본:** [book/GNSS.pdf](../../book/GNSS.pdf)
- **가이드:** [07_GNSS_이미지_가이드.md](./07_GNSS_이미지_가이드.md) · INSTRUMENTATION §3.13
- **구성:** 기준국(부동) · 이동국 #1~n · GNSS 안테나 · RTK · 무선 → 중앙 서버 · 3D 변위
- **금지:** 광파기·프리즘·제조사 로고·브로슈어 복사
- 프롬프트: `prompts/IMG-043_GNSS_변위_계측_개념도.md` **v2**
- 연결: `sensors/gnss` hero
- 현재: **PASS** — `npm run render:p1` (Pillow, book/GNSS.pdf 기준)

### 항만·호안 (IMG-064·084·098) — 필수 참고

- **안벽·케이슨 단면 (§4.9②):** 좌→우: `[좌] 배면 매립 토사 | 케이슨·안벽 | [우] 바닷물·조위(H.W.L/L.W.L)` — 푸른 바다·갈매기 **금지**
- **케이슨 상세:** crest **구조물경사계** · 배면 **토압계** · **→ 측방 변위** 벡터
- **조위·지하수 (098):** hero = `fields/harbor/tide-groundwater` — **≠ IMG-030**(육상) · [33 계획](../../docs/33-항만-호안-조위지하수-오류분석-및-재작업-계획.md)
- 프롬프트: `IMG-064` · `IMG-084` · `IMG-098` v2
- 연결 노드: `fields/harbor` · `quay-wall`(064) · `caisson`/`structure`(084) · `tide-groundwater`(098)

### 댐·저수지 (IMG-024) — 필수 참고 (§4.9①)

- **댐 삼각 단면:** 좌=**상류 만수위** · 우=**하류** · **Plumb line(역추)** · 기초 **간극수압계** · 침윤선=filter tip 수두
- **금지:** 평화로운 강 풍경 · 개방 관측공을 piezo로 표현(DAM-03) · 침하 그래프 Y축 역전(DAM-01)
- 프롬프트: `prompts/IMG-024_댐_계측_개념도.md` v2 · [32 계획](../../docs/32-IMG-024-댐-계측-개념도-오류분석-및-재작업-계획.md)
- 연결: `fields/dam` · `displacement` · `leakage`(= seepage)

### 철도 (IMG-023) — 필수 참고 (§4.9③)

- **노반·궤도 단면** — 침하·진동·ATS · **≠ 교량(011)** · **≠ 가시설**
- 프롬프트: `prompts/IMG-023_철도_노반_계측_개념도.md` v2
- 연결: `fields/railway`

### 다점지중변위계 MPBX (IMG-091) — 필수 참고 (§4.5⑨)

- **보링 cutaway** — 길이 다른 **강봉+앵커** · head **LVDT**
- **금지:** 지중경사계 casing·바퀴 · 신축계(039) 교량 이음
- 프롬프트: `prompts/IMG-091_다점지중변위계_MPBX_설치_개념도.md` · **PNG pending**
- 연결: `sensors/borehole-extensometer` · alias `sensor/extensometer`

### 사면 리프 (IMG-089·090) — PNG pending

- **089** `fields/slope/surface-tilt` — 지표 **pad** tiltmeter · θ · **≠ 지중경사계**
- **090** `fields/slope/structural-displacement` — 옹벽 **와이어식 변위계 주** · (선택) ATS inset · [127 DISP-ATS-01](../../docs/127-변위계측-자동광파기-남용방지-및-와이어식-우선-표준.md)
- docs/36 §4.3②③ · §5.1 Feedback Loop

### 철도 리프 (IMG-023 · §4.10①)

- **track-displacement / track-settlement:** 2레일+침목+道床 **축단면** · rail web tiltmeter · 노반 침하계
- **금지:** KTX·역 · 3D 홍보 · 교량(011) · 가시설

### 건축·구조물 (§4.10②)

- **building/deflection (099):** RC 보 span **δ** · wire/LVDT — DEF-01~04
- **building/crack (037):** crack gauge **균열 수직 교차**
- **structural-safety (022):** 개요 — **≠ building(100)**
- **별칭:** `building-structure` → `structural-safety` · `slab-deflection` → `deflection`

### 기초·말뚝 (IMG-092 · §4.11①) — PNG pending

- **지중 수직 단면** — 토층 관통 → bedrock · rebar cage · sister-bar strain gauge
- **§2.4 Soil Layering Rule** 프롬프트 말미 필수
- **금지:** 지상 기둥만 · bridge foundation-settlement(013) 혼동
- 프롬프트: `prompts/IMG-092_말뚝_축력_변형률_지중_단면도.md`
- 연결: `fields/foundation-pile/*`

### 환경·민원 (IMG-093 · §4.11②) — PNG pending

- **펜스 ↔ 민가** 레이아웃 · mic + dust inlet + **visible logger**
- **금지:** 대기 그래프만 · city marketing · tunnel PPV(097)
- 프롬프트: `prompts/IMG-093_환경_소음_분진_경계_계측주.md`
- 연결: `fields/environmental-impact/*`

### INSTRUMENT_SUBGROUPS E2E (IMG-058 · §4.13)

> **dictionary.js** 5 subgroup hub — sitemap **폴더 전용** · hero = `sensors/remote-monitoring-system`  
> 좌→右: sensors → logger(+solar) → modem → server/dashboard · **뇌·홀로그램 금지**

### 운영 모드·상태 (IMG-094·095·102 · §4.12) — PNG pending

> **≠ 070~075** 계측 방식 hero — 본 절은 **런타임 운영 상태**  
> **§2.5 Master Prompt Package** 필수 · **뇌·홀로그램·SF 경고창 금지**

- **094** `normal-mode` — 타임라인·등간격 트리거·stable trend
- **095** `realtime-mode` — Trigger Event·dense sampling·impulse 파형
- **102** `alarm-status` — 3 threshold·Action 돌파→경광·SMS

### 터널 지보 (IMG-078·079) — PASS (Pillow)

- **078** 록볼트 — 암반 **방사형** · VW 축력계 · [21 계획](../../docs/21-IMG-078·009-록볼트-축력-오류분석-및-재작업-계획.md)
- **079** 숏크리트 — 응력계 **라이닝 내부 매립** · [22 계획](../../docs/22-IMG-079-숏크리트-응력-변형-오류분석-및-재작업-계획.md)

### 사면 계측 (IMG-015) — 필수 참고 (v2 재생성)
- **횡단 개념도.** 좌: 사면·지층·활동면 | 우: **부동점 자동광파기**(사면 밖) + 시준선 → 사면 **프리즘**
- **치명 금지:** 사면 꼭대기 광파기, 경사계 Base 활동면만 통과, 간극수압 G.W.L 위, 변위 화살표 지그재그
- 공통 원칙: [INSTRUMENTATION_DRAWING_RULES.md](../../docs/INSTRUMENTATION_DRAWING_RULES.md) §공통·§3.12
- 프롬프트: `prompts/IMG-015_사면_계측_전체_개념도.md` **v2**
- 연결 노드: `fields/slope` (category hero)
- 현재 등급: **PASS** — `npm run render:p1` (2026-06-25)

- 막장전방(`fields/tunnel/face-advance`) → **IMG-063** (`prompts/IMG-063_막장전방_선행변위_계측_개념도.md`)

## 현황 (2026-06-22)

| 항목 | 값 |
|------|-----|
| 마스터 ID | IMG-001 ~ IMG-102 (**102종** 등록 · `03_IMAGE_MASTER_LIST.json`) |
| 배포 PNG | **94종** on disk |
| PNG pending | **089**~**095** · **102** (프롬프트 v2 준비됨) |
| dictionary 노드 | **113** (`npm run build:content`) |
| 프롬프트 v2 | `npm run sync:prompt-v2` · registry + registry-ext |
| 정본 가이드 | [docs/36 §4.9·§6.1](../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · [10_REGISTRY](./10_DICTIONARY_NODE_PROMPT_REGISTRY.md) |
| hero 판정 | [docs/38 REGENERATE/KEEP](../../docs/38-AI-프롬프트-hero-픽셀-감사-판정표.md) |

## 검수 기준
- 실제 위치명, 실제 노선명, 실제 공구명 포함 여부 확인
- 한글 라벨 가독성 확인
- 사람/캐릭터/뇌 그림 포함 여부 확인
- 과도한 AI풍 또는 3D 렌더링 여부 확인
- 계측 센서 위치와 측정 방향이 기술적으로 말이 되는지 확인
- **부동점·활동면:** 기준 장비(광파기 등)는 변형권 밖, 측점만 거동 대상에 부착 — [INSTRUMENTATION_DRAWING_RULES.md](../../docs/INSTRUMENTATION_DRAWING_RULES.md) 공통 표
- **흙막이(IMG-001·002):** 배면 연속 토사·굴착=우측만·프리즘·경사계 표면 부착 — §3.1·체크리스트 §4.1
- **사면(IMG-015):** §3.12 — PASS (render:p1)
- **GNSS(IMG-043):** `book/GNSS.pdf` · §3.13 — PASS (render:p1)
- **흙막이 계측(IMG-002):** 좌→우 `인접건물|배면|벽체|굴착측` 대표 단면도, 11종 계측기 (05 가이드·`docs/04-흙막이-계측-구현.md`)
- **터널 내공변위:** 테이프식 2점 측정·천단침하계·중앙 부유 센서 여부 확인 (04 가이드 체크리스트)
- **용어:** KDS/KCS 용어기준 위반 라벨 없음 (`node scripts/validate-terminology.mjs`)
- **배치 생성:** 출력 1장마다 docs/36 **§6.1** — (1) 좌우 배치 (2) 센서 부착 (3) 네거티브 (4) 라인 아트
- **오류 교정:** docs/36 **§5.2** — 부유 센서 · 토사/굴착 경계 · SF/뇌

## 배포·IIS (홈페이지 공통 — 필수)

- **최상위 `website/web.config`는 절대 수정하지 않는다.** (`homepage` 상위 폴더)
- SPA·기술자료 딥링크는 **해시 URL**만 사용한다. 최상위 rewrite 금지.
- 상세: `homepage/docs/DEPLOYMENT-IIS.md`
