# Agent / 개발자 가이드 (homepage)

이 저장소(`homepage/`) 작업 시 **반드시** 아래를 따릅니다.

**최종 상태·운영:** [docs/10-최종-완료-및-운영-가이드.md](./docs/10-최종-완료-및-운영-가이드.md) (115노드 · SEO 114 · 마스터 102 · PNG 102 · verify:local PASS)

### 다중 Cursor 동시 작업 (LOCK-01)

> **2창 이상** 동시 구동 시 [98-충돌방지](./docs/98-다중-Cursor-동시작업-충돌방지.md) · `.cursor/rules/multi-cursor-coordination.mdc`

- 쓰기 전: `npm run lock:status` — **held** 이면 해당 scope 작업 **중단**
- **자동:** `.cursor/hooks.json` · `atomicWriteUtf8` · `runLocked` 패치 스크립트
- registry 패치: `npm run lock:acquire -- registry --task "..."` → 작업 → `npm run lock:release -- registry`
- Figure 등록: `register:figure` 가 **full** 잠금 자동 적용 (`--no-lock` 은 CI 전용)
- 창 구분: `$env:CURSOR_LOCK_OWNER = "cursor-A"` (PowerShell, 창마다 다르게)

## 용어 기준 (KDS/KCS — 콘텐츠 최상위 규칙)

- 모든 기술 문구·이미지 라벨·SEO·autolink는 **[book/KDS-KCS_용어기준.md](./book/KDS-KCS_용어기준.md)** 를 따른다.
- KDS 11 10 15:2025, KCS 11 10 15:2025에 없는 용어를 신규 정의하지 않는다.
- 콘텐츠 수정 후: `node scripts/validate-terminology.mjs` → `node scripts/validate-citations.mjs` → `node scripts/build-content-data.mjs`
- 기술자료 각 페이지 **「근거 기준」** 블록: [40-출처표기계획](./40-KCS-KDS-출처-표기-통합-계획.md) · `book/kds-kcs-citation-registry.json`
- ImageWorks 프롬프트 §근거 기준: `npm run sync:prompt-citations`
- 상세: [docs/TERMINOLOGY.md](./docs/TERMINOLOGY.md)

### P0 최상위 — Figure 그리기 (모든 단면·AI·CAD 선행)

> **다른 규칙보다 우선.** [TECHNICAL §0.0](./docs/TECHNICAL_IMAGE_STANDARD.md) · [27-지표면-원칙](./docs/27-지표면-건물-안착-원칙.md) · **[51 §0~§2](./docs/51-계측-도면-검수-공통-원칙.md)**

- **P0** (폐기): One 목적 · 3분할 · SOE · 앵커 LC·축 · G.W.L≠piezo · SETTLE 혼동 · VIEW-01 · 센서≠로거 — [66](./docs/66-ZIP105-문서-정합-수정-보고.md)
- **P1** (전면 수정): **P0-1** 출입문·1층 = 지표면 — **건물 포함 Figure만** → **C0**
- **P1:** **P0-2** 센서형 다단식 지중경사계·지하수위계 — 케이싱·관측공 **GL 연속** → **C0d**
- **P1:** **P0-3** 데이터로거 = **함체(인클로저)** — 빈 박스·접속함만 금지; **CR1000X=예시(P2)** → **C0e** · [06 로거](./ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md)
- **P0-4** **One Figure = One 계측 목적** — 목적·분야 혼합 **금지** (FIG-01)
- **P0-5** 가시설 **3분할:** `배면 지반 | 벽체 | 굴착측` — 굴착 공동은 **굴착측만** (FIG-02)
- **P0-6** **띠장·버팀보·앵커 두부** = **굴착측 벽면만** — 배면 지반·정착장 내부 **금지** (SOE-ABS)
- 지층은 **지표면 아래만** · 단면 **「지표면」** 명시
- **BORE-GL-01:** IPI·지하수위 = **GL 천공** · **천공 개구부·well cap 지표면 가시** — [111](./docs/111-지중경사계-지하수위계-지표면-천공-가시-표준.md)

### 지중경사계 Figure 라벨

- **제목·범례·ALT:** `센서형 다단식 지중경사계` (전칭)
- **본도 지시선:** `지중경사계` 또는 `IPI` 허용
- 표현: 케이싱 + **다점 센서 노드** + Base = 영향 심도/활동면 **하부 안정층**(설계·계획서) · **임의 m 일반화 금지** · [09](./ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/09_지중경사계_센서형-다단식_표현_표준.md) · [51 §5](./docs/51-계측-도면-검수-공통-원칙.md)

### 계측 도면 검수 공통 (FIG · SOE · REJECT)

> [51-계측-도면-검수-공통-원칙](./docs/51-계측-도면-검수-공통-원칙.md) · `.cursor/rules/p0-figure-purpose-soe.mdc`

- **P0-4~6** = 위 P0 블록과 동일 — **DP-01~20 · DIS-01~20** · **INST** · **REJECT R-01~R-23** · [59](./docs/59-계측-운영-모드-구조-환경-AI-표현-표준.md) · [51](./docs/51-계측-도면-검수-공통-원칙.md)

### 센서 클래스·자동계측 (P1 — 재발 방지)

- **FIG-DP:** **DP-01~80 · DIS-01~80** — [51](./docs/51-계측-도면-검수-공통-원칙.md) · [59](./docs/59-계측-운영-모드-구조-환경-AI-표현-표준.md) · [60](./docs/60-계측-절차-구조-항만-건축-표현-표준.md) · [61](./docs/61-계측-Figure-단순화-분리-표준.md) · [62](./docs/62-계측-도면-구성-라벨-범례-검수-표준.md) · [63](./docs/63-계측-도면-표현-정확성-표준.md) · [65](./docs/65-계측-Figure-유형-분리-레이아웃-표준.md) · **REJECT R-01~R-83** · Figure **재작성 전 문서 정본**

- **CLS-01:** 지중경사계 ≠ 구조물경사계 · 지하수위계 ≠ 간극수압계 · 균열계 ≠ 변위계 · AMTS ≠ 프리즘 · **MPBX(091) ≠ 지중경사계 ≠ 신축계(039)** — [28 §2](./docs/28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) · [36 §4.5⑨](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md)
- **AUTO-01:** manual probe/sounder **hero 금지** · well cap·junction box는 **자동형 허용** — [TECHNICAL §0.4](./docs/TECHNICAL_IMAGE_STANDARD.md) · [INSTRUMENTATION §3.24](./docs/INSTRUMENTATION_DRAWING_RULES.md)
- **SETTLE-01:** **지표침하핀**(측량 표식) ≠ **지표침하계**(센서) ≠ **프리즘/ATS 측점** — [42](./docs/42-지표침하핀-지표침하계-구분-및-자동계측-정책.md) · [74 메뉴·링크 계획](./docs/74-지표침하계-메뉴·본문링크-추가계획.md) · [66](./docs/66-ZIP105-문서-정합-수정-보고.md)
- **WATERMARK-01:** 큰 Figure·hero **우하단 NMTI 로고 합성** + 우클릭·드래그 억제 — [76 계획](./docs/76-이미지-워터마크-보호-통합-계획.md) · [77 완료](./docs/77-이미지-워터마크-보호-구현-완료-보고.md)
- **METHOD-01:** Figure 라벨에 **진동현식·VW·특정 측정 방식** **금지** — 계측기 **종류명**만
- **BRI-EJ-13:** **신축이음계 = 와이어식** 필수 — [52](./docs/52-교량-신축이음계-계측-표현-표준.md)
- **SOE-INST / SETTLE-PLATE:** 배면 이격·CIP 내부 매설 금지 · 침하판 주변 토사 — [67](./docs/67-스마트건설계측-Design원칙-및-Figure수정가이드.md)
- **BRI-PIER:** 교각 **경사·상대·절대·기초침하** 분리 — IMG-012 [45](./docs/45-교각-경사-변위-계측-표현-표준.md) · **v2 PASS** [46](./docs/46-IMG-012-교각-변위-경사-수정계획.md) ✅
- **BRI-FND:** 교량 기초 **침하 측점·지표침하계·ATS** 분리 — IMG-013 [47](./docs/47-교량-기초-침하-계측-표현-표준.md) · **v2 PASS** [48](./docs/48-IMG-013-교량-기초-침하-수정계획.md) ✅
- **BRI-EJ:** 교량 **신축이음량·신축이음계** — IMG-014 [52](./docs/52-교량-신축이음계-계측-표현-표준.md) · **v2 PASS** [53](./docs/53-IMG-014-신축이음계-수정계획.md) ✅ · `deck-displacement`(종·횡변위) **노드 삭제**
- **BRI-DEF/CT/STR/WND/BRG:** 교량 확장 5종 hero — IMG-103·105·107·109·110 **PASS** [64](./docs/64-교량-확장-Figure-5종-통합-구현계획.md) · [73 구현완료](./docs/73-대구통합계측-준공보고서-구현-완료-보고.md) · [68](./docs/68-교량-처짐-계측-표현-표준.md)~[72](./docs/72-교량-받침부-변위-계측-표현-표준.md) · **상위 노출** [78](./docs/78-교량-계측-케이블장력-노출·연계-보강-계획.md) · [79 완료](./docs/79-교량-케이블장력-노출-보강-구현-완료-보고.md)
- **IMG-011:** 교량 **전체 개념도 v2** — 10종 callout · `fields/bridge` hero [74](./docs/76-IMG-011-교량-전체-개념도-v2-수정계획.md) · `npm run render:bridge-overview` ✅
- **외부 공학 검증 대조·Phase 5~8:** [docs/30-외부공학검증대조](./docs/30-NMTI-건설계측-기술자료-외부공학검증-대조-및-수정계획.md)

### Figure 출판 품질·제작 방식 (FT-A/B — P0)

- **FT-A/B**(단면·복합 개념도): Pillow `render-*.py`·`*_draw.py` **재렌더 금지** — `cad` / `ai-reviewed` PNG만
- **FT-C**(블록·흐름): Pillow 허용 · 출판 게이트 [IMAGE_AUDIT_CHECKLIST §5.1](./docs/IMAGE_AUDIT_CHECKLIST.md)
- **PASS** = 기술 게이트 + **`visualReview`** 출판 게이트
- 정본: [31-출판품질-통합수정계획](./docs/31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) · `scripts/figure-production-policy.json` · `npm run audit:figure-production`
- **Phase 1:** [32-P1 hero 체크리스트](./docs/32-Phase1-P1-hero-재제작-실행-체크리스트.md) · **11/11 완료** ✅ (2026-06-26)
- **Phase 2:** [33-P2 hero 체크리스트](./docs/33-Phase2-P2-hero-재제작-실행-체크리스트.md) · **12/12 완료** ✅ (2026-06-26)
- **Phase 3:** [34-FT-A/B 잔여](./docs/34-Phase3-FT-A-B-잔여-재제작-체크리스트.md) · **38/38 완료** ✅ (2026-06-26)
- **Phase 4:** [35-FT-C 출판검수](./docs/35-Phase4-FT-C-출판검수-체크리스트.md) · **36/36 완료** ✅ (2026-06-26)
- **Phase 5:** [36-CI 잠금](./docs/36-Phase5-CI-잠금-체크리스트.md) · **Program Exit** ✅ · `verify:local` · `verify:production` 24/24 (2026-06-26)
- **Figure 재작도 (PNG):** [108](./docs/108-PNG-재작도-제작자-마스터-인덱스.md) · [119 Handoff](./docs/119-PNG-재작도-프로그램-운영-Handoff.md) · `rework:check` · `rework:handoff` · `rework:done` · W1: `patch:registry-phase-a` → `sign:phase-a`
- **P0 와이어프레임 14종:** [122](./docs/122-Pillow-와이어프레임-Figure-출판품질-통합-수정계획.md) · [123 체크리스트](./docs/123-P0-와이어프레임-14종-실행-체크리스트.md) · `wireframeReplace` + `requiresReaudit` → SPA·SEO hero **placeholder** · `npm run rework:p0` · `rework:pillow` · `rework:done` 후 자동 해제

## ⛔ 최우선: 에이전트·코드 SVG Figure 생성 금지

> **기술자료 Figure(IMG-###)를 SVG로 그리지 않는다.** 에이전트·`render-svg-figures.py`·`*_svg.py` **전면 금지**.  
> 상세: [docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md](./docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md)

| 금지 | 대안 |
|------|------|
| Python/에이전트 SVG XML 작성 | 인간 CAD·Illustrator 또는 AI+§14 프롬프트 → **PNG** |
| `render-svg-figures.py` | PNG → `convert-technology-webp.py` → `generate-image-assets.mjs` |
| 「SVG v1」「SVG canonical」 신규 작업 | INSTRUMENTATION + IMAGE_AUDIT_CHECKLIST 검수 |

**허용:** `index.html` UI `<symbol>` SVG만 (기술 Figure 아님).

---

## ⛔ 최우선: 최상위 web.config 수정 금지

| 경로 | 조작 |
|------|------|
| `website/web.config` (homepage **상위**) | **절대 수정·커밋 금지** |
| `homepage/web.config` | MIME·defaultDocument 등 homepage 전용만 |
| `homepage/technology/web.config` | **두지 않음** (rewrite 사용 안 함) |

상세: [docs/DEPLOYMENT-IIS.md](./docs/DEPLOYMENT-IIS.md)

## 기술자료 SPA 라우팅

- **앱 내 이동:** 해시 URL — `nodePath()` (`/homepage/technology/#fields/bridge`)
- **SEO·사이트맵·canonical:** 경로 URL — `nodePathSeo()` (`/homepage/technology/fields/bridge/`)
- 정적 `technology/**/index.html`은 `generate-technology-seo-pages.mjs`로 생성 (IIS rewrite 불필요)
- 라우터: `js/technology/router.js`

## 기술자료 메뉴·TREE 규칙

정본: `js/technology/dictionary.js` · [41](./docs/41-건설계측-기술자료-메뉴구조-수정계획.md) · [42 메뉴](./docs/42-건설계측-메뉴구조-구현-완료-보고.md) · **[44 통합](./docs/44-건설계측-메뉴·템플릿-통합-구현계획.md)**

| 규칙 | 내용 |
|------|------|
| **nodeId·URL** | `#fields/tunnel`, `#sensors/piezometer` 등 **변경 금지** — SEO·인용 레지스트리·Figure 매핑 유지 |
| **label** | TREE·`CATEGORY_LABELS`·`build-content-data.mjs`(getNode) 단일 정본 — `LABELS` 중복 맵 **사용 금지** |
| **상위 3그룹** | 구조물·공종별 / 계측센서별 / 계측 시스템 |
| **메뉴** | 구조물·공종별 **12분야** 전부 노출 (2026-06-26) — `hidden` 사용 시에만 비노출 |
| **breadcrumb** | `getBreadcrumb()` — 루트 **건설 계측 기술 자료** |
| **재빌드** | label·TREE 변경 후 `npm run build:content` · `npm run build:seo` · `npm run verify:local` |

## 콘텐츠·이미지 빌드

```bash
node scripts/validate-terminology.mjs   # KDS/KCS 용어 검증 (콘텐츠 수정 후)
npm run build:images                  # 레지스트리 → IMAGE_REVIEW_LOG → images.js
npm run audit:images                  # 운영 반영 전 필수 — 미승인 이미지 차단 검증
node scripts/build-content-data.mjs
node scripts/generate-technology-seo-pages.mjs
node scripts/generate-sitemap-technology.mjs
```

- **canonical PNG:** `scripts/canonical-image-png.json` — 동일 IMG-ID 중복 시 공식 파일명 우선 (`generate-image-assets.mjs`). 교체 후 `validate-image-master.mjs` · 상세 [docs/09-GNSS-book-PDF-및-검증-가이드.md](./docs/09-GNSS-book-PDF-및-검증-가이드.md) §3
- **통합 검증:** `npm run verify:local` (배포 전) · `npm run verify:content` (재작도 중) · `npm run rework:prompt` (Figure 복붙) · `npm run verify:deploy` · `npm run verify:production` (**13건**, FTP 후)

### ⛔ 기술자료 이미지 (필독 — 생성·수정 전)

**SVG Figure 생성 금지:** [16-에이전트-SVG-생성-금지.md](./docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md) · `.cursor/rules/no-agent-svg-figures.mdc` — `render-svg-figures` · `*_svg.py` **실행·작성하지 않음**.

기술자료 이미지를 생성하거나 수정하기 전 **반드시** 다음 문서를 먼저 확인한다.

- [docs/TECHNICAL_IMAGE_STANDARD.md](./docs/TECHNICAL_IMAGE_STANDARD.md)
- [docs/77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md](./docs/77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md) — **★ ZIP 207 — 신규 심각 10종 · Phase Z**
- [docs/81-외부-ZIP-신규-심각오류-10종-Phase-AA-수정계획.md](./docs/81-외부-ZIP-신규-심각오류-10종-Phase-AA-수정계획.md) — **★ ZIP 2차 — INTERP-01**
- [docs/84-외부-ZIP-신규-심각오류-10종-Phase-AB-수정계획.md](./docs/84-외부-ZIP-신규-심각오류-10종-Phase-AB-수정계획.md) — **★ ZIP 3차 — AXIS·IPI·WELL·LOGGER·GW**
- [docs/25-NMTI-계측-이미지-도면-오류-식별-및-수정계획-보고서.md](./docs/25-NMTI-계측-이미지-도면-오류-식별-및-수정계획-보고서.md) — **★ 외부 감사·Phase 수정계획·§2 기준표**
- [docs/29-NMTI-기술자료-이미지-공학-감사-수정계획.md](./docs/29-NMTI-기술자료-이미지-공학-감사-수정계획.md) — **★ Master Plan — Phase 0~7·Z 실행·Exit**
- [docs/30-NMTI-건설계측-기술자료-외부공학검증-대조-및-수정계획.md](./docs/30-NMTI-건설계측-기술자료-외부공학검증-대조-및-수정계획.md) — **★ 외부 공학검증 ↔ 저장소 대조 · Phase 5~8 · AUTO·CLS**
- [docs/28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md](./docs/28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) — **★ 공학 감사 정본 — 그림·글 작성 시 §1 필독**
- [docs/24-토목-계측-개념도-및-구성도-작성-가이드라인.md](./docs/24-토목-계측-개념도-및-구성도-작성-가이드라인.md) — **보고서·지침서·Figure 통합 표준 (지반·계측기·데이터 흐름)**
- [docs/INSTRUMENTATION_DRAWING_RULES.md](./docs/INSTRUMENTATION_DRAWING_RULES.md)
- [docs/14-흙막이-굴착-계측-개념도-AI-생성-가이드라인.md](./docs/14-흙막이-굴착-계측-개념도-AI-생성-가이드라인.md) — **흙막이·가시설 단면 AI [조건/제약사항]**
- [docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) — **★ AI System/Context — §4.1~§4.13 · §2.5 Master Package · §9 Wrap-up · §6.1 배치 QA**
- [docs/37-AI-프롬프트-가이드-반영-실행-계획.md](./docs/37-AI-프롬프트-가이드-반영-실행-계획.md) — Phase 0~5 실행·[38 판정표](./docs/38-AI-프롬프트-hero-픽셀-감사-판정표.md)
- [docs/IMAGE_AUDIT_CHECKLIST.md](./docs/IMAGE_AUDIT_CHECKLIST.md)
- [docs/IMAGE_REVIEW_LOG.md](./docs/IMAGE_REVIEW_LOG.md)

`reviewGrade`가 **PASS** 또는 **MINOR_FIX**가 아니거나 `status`가 **reviewed**가 아닌 이미지는 `resolveImage()`가 **null**을 반환하여 운영 페이지에 노출되지 않는다. 계측기 설치 위치·측정 방향·힘 전달 경로가 실제와 다르면 이미지를 폐기하고 다시 생성한다.

- 콘텐츠 소스: `scripts/content-data/*.mjs` → `build-content-data.mjs`로 `content-data.js` 생성
- 이미지 메타: `scripts/image-review-registry.json` + `assets/images/technology/` → `generate-image-assets.mjs`
- 이미지 검수·등급: `docs/image-audit.md` (레거시 Phase) · **신규 표준 위 4문서**
- **IMG-001** = **가시설 계측 전체 개념도** (`retaining-excavation` hero). **3영역** `[배면 지반]| [벽체]| [굴착측]` 선행 · **G-01~G-15** — [51 §2.4](./docs/51-계측-도면-검수-공통-원칙.md) · [INSTRUMENTATION §3.1.0](./docs/INSTRUMENTATION_DRAWING_RULES.md) · `prompts/IMG-001_*.md` v4
- **IMG-002** = 흙막이 계측 설치 대표 단면도 (`earth-retaining-wall` hero). **REGENERATE v5 전면 재작성** — **부분 수정 금지** · [52 정본](./docs/52-IMG-002-전면재작성-프롬프트-정본.md) · [83 ANC-CLOCK](./docs/83-어스앵커-하중계-ANC-CLOCK-정본.md) · [51 §2.5](./docs/51-계측-도면-검수-공통-원칙.md) · 앵커 LC=두부·**1~7시 사선**·침하핀≠지표침하계·②③ 이형 · Pillow **차단**
- **IMG-004** = 어스앵커 하중계 설치 개념도 (`retaining-excavation/anchor`). **REGENERATE** — [54 정본](./docs/54-IMG-004-어스앵커-하중계-설치-표현-표준.md) · [83 ANC-CLOCK](./docs/83-어스앵커-하중계-ANC-CLOCK-정본.md) · LC=굴착측 두부·반력판–헤드 사이·**사선 동축(1~7시, NOT 수평)** · T/P 분리 · 버팀보 LC 혼동 금지
- **IMG-005** = 주변건물 균열·경사 (`adjacent-building`). **VIEW-01** 단면/입면 무라벨 혼합 금지 · [56 정본](./docs/56-IMG-005-주변건물-균열경사-표현-표준.md) · 띠장 굴착측만 · ATS 밖·프리즘만 · **지표침하 측점=건물–흙막이 사이 배면 지표**
- **IMG-027** = 지중경사계 설치 단면도 (**센서별**). **PASS v2** — [17](./docs/17-IMG-027-지중경사계-설치단면도-오류분석-및-재작업-계획.md)
- **주변지반 hero** = **IMG-096** — **REGENERATE v4** · [57](./docs/57-IMG-096-가시설-주변지반-계측-표현-표준.md) · [110](./docs/110-IMG-096-옹벽삭제-가시설-주변지반-재작업-계획.md) · **옹벽·Sand Mat 삭제** · SOE-SURR-01
- **IMG-062** = 지하수위·간극수압 (`earth-retaining-wall` principle·data).
- **IMG-045** = 데이터로거 구성도 (`sensors/datalogger` hero). **레거시 산업용** — `npm run render:p3` PASS — [06 가이드](./ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md)
- **IMG-008** = 터널 전단면 내공변위 (`fields/tunnel/convergence`). **PASS Phase Z** — P1~P5 측점·측선·기준 측정선 · [77-Phase Z](./docs/77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md) · `render-phase-z.py`
- **IMG-061** = 천단침하 (`fields/tunnel/crown-settlement`). **TUN-CROWN** [49](./docs/49-터널-천단침하-계측-표현-표준.md) · **v2 PASS** [50](./docs/50-IMG-061-천단침하-수정계획.md) ✅. 내공변위(IMG-008)·지표침하(IMG-010)와 구분.
- **IMG-078** = 록볼트 축력 hero. **PASS (v2)** — [21-IMG-078·009](docs/21-IMG-078-009-록볼트-축력-오류분석-및-재작업-계획.md)
- **IMG-009** = 지보재 경량 배치. **PASS (v2)** — hero **078/079 분리**
- **IMG-079** = 숏크리트 hero. **PASS (v2)** — [22-IMG-079](docs/22-IMG-079-숏크리트-응력-변형-오류분석-및-재작업-계획.md)
- **blast-vibration hero** = **IMG-097 PASS (v1)** — [23-IMG-097](docs/23-IMG-097-터널-발파진동-영향권-오류분석-및-재작업-계획.md) · 041=vibration-meter only
- **IMG-063** = 막장전방 선행변위 (`fields/tunnel/face-advance`). 히어로 전용 — IMG-007 참고용.
- **IMG-043** = GNSS 변위 계측 (`sensors/gnss` hero). **PASS** — `book/GNSS.pdf`·[07_GNSS_이미지_가이드](./ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/07_GNSS_이미지_가이드.md) · [INSTRUMENTATION §3.13](./docs/INSTRUMENTATION_DRAWING_RULES.md)
- **IMG-015** = 사면 계측 전체 개념도 (`fields/slope` hero). **PASS** — [INSTRUMENTATION §3.12](./docs/INSTRUMENTATION_DRAWING_RULES.md)
- **IMG-089·090** = 사면 지표경사·구조물변위 — Sprint0 Pillow PASS · **v2 redline 미검수** · [36 §4.3②③](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · 재작도 권장
- **IMG-024** = 댐 hero — v3 프롬프트 · **redline v2** · Pillow PASS · **픽셀 미검수** · [39](./docs/39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md) · [36 §4.9①](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · 재작도 권장
- **IMG-064·084** = 항만·케이슨 — v2 · **REGENERATE** 권장 · [36 §4.9②](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · 노드 `quay-wall`/`caisson`
- **IMG-023** = 철도 hero — v2 · [36 §4.9③](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md)
- **IMG-091** = 다점지중변위계 MPBX (`sensors/borehole-extensometer`) — Sprint0 Pillow PASS · **v2 redline 미검수** · [36 §4.5⑨](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · 재작도 권장
- **IMG-058** = `INSTRUMENT_SUBGROUPS` E2E hub (`sensors/remote-monitoring-system`) — §4.13 · sensors→logger→power→comm→modes · **뇌 금지**
- **IMG-092~095·102** = 기초·환경·운영모드 — **PNG pending** · [37 Phase 6](./docs/37-AI-프롬프트-가이드-반영-실행-계획.md)
- 이미지·용어 가이드:
  - `ImageWorks/.../04_터널_내공변위_이미지_가이드.md`
  - `ImageWorks/.../05_흙막이_계측_이미지_가이드.md`
  - `ImageWorks/.../06_데이터로거_CR1000X_이미지_가이드.md`
  - `ImageWorks/.../07_GNSS_이미지_가이드.md` (**참고 원본:** `book/GNSS.pdf`)
  - `docs/04-흙막이-계측-구현.md`

## 배포 후 확인

1. `npm run verify:deploy` → `npm run verify:production` **13/13**
2. [docs/10-최종-완료-및-운영-가이드.md](./docs/10-최종-완료-및-운영-가이드.md) · [docs/09-GNSS-book-PDF-및-검증-가이드.md](./docs/09-GNSS-book-PDF-및-검증-가이드.md)
3. `https://www.nmti.co.kr/homepage/` — 메인 200
4. `https://www.nmti.co.kr/homepage/technology/` — 기술자료 200
5. 사이트 전체 500 → **최상위 `web.config` 변경 여부** 먼저 확인
