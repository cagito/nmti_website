# Agent / 개발자 가이드 (homepage)

이 저장소(`homepage/`) 작업 시 **반드시** 아래를 따릅니다.

**최종 상태·운영:** [docs/10-최종-완료-및-운영-가이드.md](./docs/10-최종-완료-및-운영-가이드.md) · [178 통합 Exit](./docs/178-통합-프로그램-Exit.md) (126노드 · WebP 112 · `verify:local` PASS)

### DOC-CANON-01 — Git 추적 정본

> Figure·프롬프트 **판정 근거**는 [CANONICAL_DOC_INDEX](./docs/CANONICAL_DOC_INDEX.md) Tier A·B 문서만 사용. FTP 전용·미추적 docs는 판정 금지. [208 DOC-CANON-01](./docs/208-문서-정본-충돌-반경계획-DOC-CANON-01.md) (C1~C5 ✅) · [212 DOC-CANON-03](./docs/212-문서-정본-복구-상태값-충돌-반영계획.md) (정본 복구·상태값) · [210 DOC-CANON-02](./docs/210-문서간-충돌-잔여-수정계획-DOC-CANON-02.md) (ATS·sync)

### 다중 Cursor 동시 작업 (LOCK-01)

> **2창 이상** 동시 구동 시 [98-충돌방지](./docs/98-다중-Cursor-동시작업-충돌방지.md) · `.cursor/rules/multi-cursor-coordination.mdc`

- 쓰기 전: `npm run lock:status` — **held** 이면 해당 scope 작업 **중단**
- **자동:** `.cursor/hooks.json` · `atomicWriteUtf8` · `runLocked` 패치 스크립트
- registry 패치: `npm run lock:acquire -- registry --task "..."` → 작업 → `npm run lock:release -- registry`
- Figure 등록: `register:figure` 가 **full** 잠금 자동 적용 (`--no-lock` 은 CI 전용)
- 창 구분: `$env:CURSOR_LOCK_OWNER = "cursor-A"` (PowerShell, 창마다 다르게)

### git-sync (newest-wins — 로컬 ↔ GitHub)

> **정본:** `git-sync.bat` · `scripts/git-sync-newest.mjs`

- **목적:** 추적 파일마다 **로컬·origin/main 중 더 최신** 쪽을 선택 → 필요 시 auto commit/push.
- **금지:** `git reset --hard` · `git stash` (과거 `_patch_sync*.py` 패치 **사용 금지**).
- **실행:** `git-sync.bat` (60초 루프) · `npm run sync:git` · 판정만 `npm run sync:git:dry`
- **환경:** `GIT_SYNC_AUTO_COMMIT=1` · `GIT_SYNC_AUTO_PUSH=1` · `RUN_BUILD=auto` (이미지/registry 변경 시만 `build:images`)
- **보호 (Strong mode, 기본):** 미커밋 변경 → **절대 take-remote 안 함** · 커밋 시각 차 **2분 이내 → skip** · **FTP mtime 미사용**(커밋 시각+미커밋만) · push 실패+ahead → 원격 덮기 차단 · merge도 차단 · remote 덮기 전 `.git-sync-backup/` 일괄 백업 · LOCK held → exit 3
- **위험 opt-in:** `GIT_SYNC_AGGRESSIVE=1` 또는 `--aggressive` · `GIT_SYNC_FORCE_REMOTE=1`(미커밋도 원격 허용)
- **로그:** `logs/git-sync/` · 마지막 결과 `.git-sync-last-run.json`
- merge/rebase 진행 중 → sync 중단(exit 2) — `git rebase --abort` 또는 `--continue` 후 재시도
- **테스트:** `npm run test:git-sync`

## 용어 기준 (KDS/KCS — 콘텐츠 최상위 규칙)

- 모든 기술 문구·이미지 라벨·SEO·autolink는 **[book/KDS-KCS_용어기준.md](./book/KDS-KCS_용어기준.md)** 를 따른다.
- KDS 11 10 15:2025, KCS 11 10 15:2025에 없는 용어를 신규 정의하지 않는다.
- 콘텐츠 수정 후: `node scripts/validate-terminology.mjs` → `node scripts/validate-citations.mjs` → `node scripts/build-content-data.mjs`
- 기술자료 각 페이지 **「근거 기준」** 블록: [40-출처표기계획](./40-KCS-KDS-출처-표기-통합-계획.md) · `book/kds-kcs-citation-registry.json`
- ImageWorks 프롬프트 §근거 기준: `npm run sync:prompt-citations`
- 상세: [docs/TERMINOLOGY.md](./docs/TERMINOLOGY.md)

### book/ PDF 이미지 작성 기준서 (`docs/image-knowledge/`)

> Figure·도면·설치 개념도 작업 전 **`book/` PDF 근거** 실행 규칙. PDF 요약이 아니라 잘못 그리지 않게 막는 제약 문서.

1. [00-공통-이미지-작성-원칙.md](./docs/image-knowledge/00-공통-이미지-작성-원칙.md)
2. 해당 주제 `docs/image-knowledge/NN-*.md`
3. [source-index.md](./docs/image-knowledge/source-index.md)
4. ImageWorks prompt / redline · registry

```bash
npm run catalog:book-pdf           # PDF manifest·색인 갱신
npm run build:gap-matrix
npm run patch:instr-image-knowledge
npm run patch:registry-image-knowledge
npm run sync:prompt-image-knowledge-links
npm run sync:prompt-image-rules
npm run sync:redline-image-knowledge
npm run extract:kds-figure-rules
npm run patch:image-knowledge-from-kds
npm run scaffold:redline-stubs
npm run validate:book-rules-coverage
npm run validate:image-knowledge
npm run validate:instr-image-knowledge
```

- **`book/` 외 자료를 image-knowledge 근거로 쓰지 않는다** (라벨만 `book/KDS-KCS_용어기준.md` 허용).
- **통합 계획:** [130 book→이미지규칙](./docs/130-book-콘텐츠-이미지작성규칙-반영-실행계획.md) · INSTR §3 ↔ image-knowledge 역링크 · prompts `## 실행 규칙`
- 기존 P0 검수([51](./docs/51-계측-도면-검수-공통-원칙.md), [TECHNICAL](./docs/TECHNICAL_IMAGE_STANDARD.md))와 **병행** — 충돌 시 작업 중단.

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
- **DISP-ATS-01:** 변위·처짐·신축 **기본 = 와이어식 변위계·LVDT·침하계·내공변위계** — **ATS는 IMG-042·지하공사(터널·깊은굴착) 맥락만** · 지상 분야 ATS 금지 — [127](./docs/127-변위계측-자동광파기-남용방지-및-와이어식-우선-표준.md) · **[206 ATS-SUB-01](./docs/206-자동광파기-지하공사-전용-표현-통합-적용-계획.md)** · [09 image-knowledge](./docs/image-knowledge/09-변위·광학계측-표현-기준.md) · [128 통합계획](./docs/128-디자인-원칙-문서-통합-반영-실행계획.md)
- **SLO-WIRE-01:** **와이어식 변위계 = 배면 사면** — **옹벽 전면·벽체 부착 금지** · 옹벽 = **프리즘(측점)** · **ATS 없음** — [129](./docs/129-사면-옹벽-와이어식-변위계-배면사면-표준.md) · **IMG-090 v6** · [211](./docs/211-ATS-SUB-01-P2-재생성-기록.md)
- **WATERMARK-01:** **생성 시** NMTI 로고·워터마크 **금지** — `source/` 무로고 → **`watermark-figures.bat`** · `npm run watermark:figures` **일괄 후처리** + 우클릭·드래그 억제 — [183 정본](./docs/183-이미지-생성-워터마크-금지-정본.md) · [76](./docs/76-이미지-워터마크-보호-통합-계획.md) · [77](./docs/77-이미지-워터마크-보호-구현-완료-보고.md)
- **METHOD-01:** Figure 라벨에 **진동현식·VW·특정 측정 방식** **금지** — 계측기 **종류명**만
- **BRI-EJ-13:** **신축이음계 = 와이어식** 필수 — [52](./docs/52-교량-신축이음계-계측-표현-표준.md)
- **SOE-INST / SETTLE-PLATE:** 배면 이격·CIP 내부 매설 금지 · 침하판 주변 토사 — [67](./docs/67-스마트건설계측-Design원칙-및-Figure수정가이드.md)
- **BRI-PIER:** 교각 **경사·상대·절대·기초침하** 분리 — IMG-012 [45](./docs/45-교각-경사-변위-계측-표현-표준.md) · **v2 PASS** [46](./docs/46-IMG-012-교각-변위-경사-수정계획.md) ✅
- **BRI-FND:** 교량 기초 **침하 측점·지표침하계·ATS** 분리 — IMG-013 [47](./docs/47-교량-기초-침하-계측-표현-표준.md) · **v2 PASS** [48](./docs/48-IMG-013-교량-기초-침하-수정계획.md) ✅
- **BRI-EJ:** 교량 **신축이음량·신축이음계** — IMG-014 [52](./docs/52-교량-신축이음계-계측-표현-표준.md) · **v2 PASS** [53](./docs/53-IMG-014-신축이음계-수정계획.md) ✅ · `deck-displacement`(종·횡변위) **노드 삭제**
- **BRI-DEF/CT/STR/WND/BRG:** 교량 확장 5종 hero — IMG-103·105·107·109·110 **PASS** [64](./docs/64-교량-확장-Figure-5종-통합-구현계획.md) · [73 구현완료](./docs/73-대구통합계측-준공보고서-구현-완료-보고.md) · [68](./docs/68-교량-처짐-계측-표현-표준.md)~[72](./docs/72-교량-받침부-변위-계측-표현-표준.md) · **상위 노출** [78](./docs/78-교량-계측-케이블장력-노출·연계-보강-계획.md) · [79 완료](./docs/79-교량-케이블장력-노출-보강-구현-완료-보고.md)
- **IMG-103:** 교량 상부구조 **GNSS 처짐 PASS** — 경간 중앙 상부 ΔZ→δ · [148](./docs/148-IMG-103-교량-상부구조-GNSS-처짐-표현-표준.md) · 와이어식 hero **아님** (IMG-104 별도) · deprecated [120](./docs/120-IMG-103-교량-GNSS-처짐-v3-표현-표준.md)
- **IMG-011:** 교량 **전체 개념도 v5 PASS** (S0-B 2026-06-30) — 사장교 10종 · [116](./docs/116-IMG-011-교량-계측-전체-개념도-v3-표현-표준.md) · [185](./docs/185-IMG-024-011-최우선-재작도-실행계획.md) · BRI-OV-01~10
- **외부 공학 검증 대조·Phase 5~8:** [docs/30-외부공학검증대조](./docs/30-NMTI-건설계측-기술자료-외부공학검증-대조-및-수정계획.md)

### Figure 출판 품질·제작 방식 (FT-A/B — P0)

- **FT-A/B**(단면·복합 개념도): 에이전트 **GenerateImage** · Pillow `render-*.py` · SVG→WebP **허용** — P0·redline 선행 · WebP 등록
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

## 에이전트 Figure 생성 (허용)

> **Cursor 에이전트가 IMG-### Figure를 생성·등록할 수 있다.** P0·WebP-only·registry 잠금은 유지.  
> 상세: [docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md](./docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md) · `.cursor/rules/agent-figure-generation.mdc`

| 방식 | 용도 |
|------|------|
| **GenerateImage** | AI 래스터 (프롬프트 + §36 §1.0) |
| **Pillow** `render-*.py` | FT-A/B/C · FT-A/B는 `--force-legacy-pillow` 필요 시 |
| **SVG → WebP** | `render-svg-figures.py` · `*_svg.py` |
| **등록** | `npm run register:figure -- --input …webp` → `sync:images` |

**허용:** `index.html` UI `<symbol>` SVG (기술 Figure와 별도).

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
npm run validate:content-phrases        # 179 forbidden/required (content-data/*.mjs)
node scripts/build-content-data.mjs
node scripts/generate-technology-seo-pages.mjs
npm run validate:content-audit          # 179 부록 A — SEO HTML 14페이지 spot-check
npm run validate:figure-captions-179    # 179 §9 — registry caption/alt 정본
node scripts/generate-sitemap-technology.mjs
npm run build:images                  # 레지스트리 → IMAGE_REVIEW_LOG → images.js
npm run audit:images                  # 운영 반영 전 필수 — 미승인 이미지 차단 검증
```

- **canonical WebP:** `scripts/canonical-image-webp.json` — 동일 IMG-ID 중복 시 공식 파일명 우선 (`generate-image-assets.mjs`). 교체 후 `validate-image-master.mjs` · 상세 [docs/09-GNSS-book-PDF-및-검증-가이드.md](./docs/09-GNSS-book-PDF-및-검증-가이드.md) §3
- **WebP-only:** `assets/images/technology/` 전체 PNG **금지** · `python scripts/purge-technology-png.py` · [TECHNICAL §3](./docs/TECHNICAL_IMAGE_STANDARD.md)
- **삭제 백업:** `technology/` Figure 삭제·교체 전 **`assets/images/technology/backup/`** 에 타임스탬프 복사 — `npm run delete:tech-image` · `.cursor/rules/technology-image-backup.mdc`
- **콘텐츠 정합 (179):** [179-technology-html-콘텐츠-정합-수정-계획.md](./docs/179-technology-html-콘텐츠-정합-수정-계획.md) · `validate:content-phrases` · `validate:content-audit` · `verify:local`에 편입

### ⛔ 기술자료 이미지 (필독 — 생성·수정 전)

**에이전트 Figure:** [16-에이전트-생성-가이드.md](./docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md) · `.cursor/rules/agent-figure-generation.mdc`

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
- **IMG-002** = 흙막이 계측 설치 대표 단면도 (`earth-retaining-wall` hero). **PASS v6** — [52](./docs/52-IMG-002-전면재작성-프롬프트-정본.md) · ANC-CLOCK · SOE-INST-01 · 11종 범례
- **IMG-035** = 하중계 설치 개념도 (`sensors/load-cell` hero). **PASS v4** (2026-06-30) — [191](./docs/191-IMG-035-v4-재생성-기록.md) · STR-01 · 버팀보 접합부 LC ≠ 앵커 ANC-CLOCK
- **IMG-004** = 어스앵커 하중계 설치 개념도 (`retaining-excavation/anchor`). **PASS v8** (2026-06-30) — [188](./docs/188-IMG-004-v8-재생성-기록.md) · [54](./docs/54-IMG-004-어스앵커-하중계-설치-표현-표준.md) · [83 ANC-CLOCK](./docs/83-어스앵커-하중계-ANC-CLOCK-정본.md) · LC=굴착측 두부·반력판–헤드 사이·**사선 동축(1~7시, NOT 수평)** · T/P 분리
- **IMG-005** = 주변건물 균열·경사 (`adjacent-building`). **PASS v5** (2026-06-30) — [56 정본](./docs/56-IMG-005-주변건물-균열경사-표현-표준.md) · [209](./docs/209-ATS-SUB-01-P1-재생성-기록.md) · VIEW-01 · **ATS·시준선 없음** · 프리즘·경사·균열 · **지표침하 측점=건물–흙막이 사이 배면 지표**
- **IMG-027** = 지중경사계 설치 단면도 (**센서별**). **PASS v2** — [17](./docs/17-IMG-027-지중경사계-설치단면도-오류분석-및-재작업-계획.md)
- **주변지반 hero** = **IMG-096** — **PASS v6** (2026-06-30) — [192](./docs/192-IMG-096-v6-재생성-기록.md) · [57](./docs/57-IMG-096-가시설-주변지반-계측-표현-표준.md) · SOE-SURR-01 · 4종만 · 옹벽·Sand Mat 금지
- **IMG-062** = 지하수위·간극수압 (`earth-retaining-wall` principle·data).
- **IMG-045** = 데이터로거 구성도 (`sensors/datalogger` hero). **레거시 산업용** — `npm run render:p3` PASS — [06 가이드](./ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md)
- **IMG-008** = 터널 전단면 내공변위 (`fields/tunnel/convergence`). **PASS v10 (2026-06-27)** — **P1~P11** 내공변위계·대표 측선 · [126 redline](./docs/126-IMG-008-터널-내공변위-디자인-redline-및-생성프롬프트.md) · ai-reviewed WebP
- **IMG-061** = 천단침하 (`fields/tunnel/crown-settlement`). **TUN-CROWN** [49](./docs/49-터널-천단침하-계측-표현-표준.md) · **v2 PASS** [50](./docs/50-IMG-061-천단침하-수정계획.md) ✅. 내공변위(IMG-008)·지표침하(IMG-010)와 구분.
- **IMG-078** = 록볼트 축력 hero. **PASS (v2)** — [21-IMG-078·009](docs/21-IMG-078-009-록볼트-축력-오류분석-및-재작업-계획.md)
- **IMG-009** = 지보재 경량 배치. **PASS (v2)** — hero **078/079 분리**
- **IMG-079** = 숏크리트 hero. **PASS (v2)** — [22-IMG-079](docs/22-IMG-079-숏크리트-응력-변형-오류분석-및-재작업-계획.md)
- **blast-vibration hero** = **IMG-097 PASS (v1)** — [23-IMG-097](docs/23-IMG-097-터널-발파진동-영향권-오류분석-및-재작업-계획.md) · 041=vibration-meter only
- **IMG-063** = 막장전방 선행변위 (`fields/tunnel/face-advance`). 히어로 전용 — IMG-007 참고용.
- **IMG-043** = GNSS 변위 계측 (`sensors/gnss` hero). **PASS** — `book/GNSS.pdf`·[07_GNSS_이미지_가이드](./ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/07_GNSS_이미지_가이드.md) · [INSTRUMENTATION §3.13](./docs/INSTRUMENTATION_DRAWING_RULES.md)
- **IMG-015** = 사면 계측 전체 개념도 (`fields/slope` hero). **PASS v5** (2026-06-30) — ATS inset 제거 · [211](./docs/211-ATS-SUB-01-P2-재생성-기록.md) · [INSTRUMENTATION §3.12](./docs/INSTRUMENTATION_DRAWING_RULES.md)
- **IMG-016** = 원호활동면 계측 해석도 (`fields/slope/slip-surface`). **PASS v6** (2026-06-30) — [187](./docs/187-IMG-016-v6-재생성-기록.md) · INTERP-01 · **추정 원호활동면**만 · 최대변위≠활동면 · IPI 단독 확정 금지
- **IMG-089·090** = 사면 지표경사·구조물변위 — **090 = SLO-WIRE-01** (와이어=배면 사면 · 옹벽=프리즘) · [129](./docs/129-사면-옹벽-와이어식-변위계-배면사면-표준.md) · [36 §4.3②③](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md)
- **IMG-024** = 댐 hero — **S0-A v5 ai-reviewed PASS** (2026-06-30) · DAM-01~07·LEAK · [185](./docs/185-IMG-024-011-최우선-재작도-실행계획.md) · [32](./docs/32-IMG-024-댐-계측-개념도-오류분석-및-재작업-계획.md) · [39](./docs/39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md)
- **IMG-064** = 항만·호안 계측 전체 개념도 (`fields/harbor` hero). **PASS v7** (2026-06-30) — [190](./docs/190-IMG-064-v7-재생성-기록.md) · HAR-Q01~03 · 육측\|케이슨\|해측
- **IMG-084** = 항만 구조물 변위 — **PASS v6** (2026-06-30) · HAR-STR-01 · 노드 `quay-wall`/`caisson` · [36 §4.9②](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md)
- **IMG-023** = 철도 hero — v2 · [36 §4.9③](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md)
- **IMG-091** = 다점지중변위계 MPBX (`sensors/borehole-extensometer`) — **PASS v4** ai-reviewed · MPX-01~03 · [36 §4.5⑨](./docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md)
- **IMG-058** = `INSTRUMENT_SUBGROUPS` E2E hub (`sensors/remote-monitoring-system`) — §4.13 · sensors→logger→power→comm→modes · **뇌 금지**
- **IMG-092~095·102** = 기초·환경·운영모드 — **PASS** ai-reviewed (W10·W11) · [123](./docs/123-P0-와이어프레임-14종-실행-체크리스트.md)
- **IMG-085** = `DELETE` — IMG-110 받침부 변위로 대체 · **신규 WebP 금지** · [213 FIG-PROD-01](./docs/213-이미지-제작-실행계획.md)
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
