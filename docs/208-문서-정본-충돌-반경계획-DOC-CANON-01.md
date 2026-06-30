# 문서 정본 충돌 반경계획 (DOC-CANON-01)

**수립:** 2026-06-30  
**입력:** Git `cagito/nmti_website` 심각 충돌 5건 감사  
**목표:** 에이전트가 **단일 판정**으로 Figure·프롬프트·registry를 따를 수 있게 정본 계층 복구  
**등급:** **P0 운영** — broken link 수준이 아니라 **판정 근거 소실**

---

## 0. 근본 원인 (로컬 vs GitHub 불일치)

| 계층 | 로컬 (RaiDrive/FTP) | Git `origin/main` |
|------|---------------------|-------------------|
| `docs/180` · `181` · `153` · `187` … | **파일 존재** | **404** (미추적) |
| `docs/19` · `26` | 존재·**추적 중** (구형) | 존재 — **REGENERATE 문구 잔존** |
| `docs/image-knowledge/**` | 존재 | **추적** (`.gitignore` 예외) |
| ImageWorks `prompts/` | PASS v6~v8 통일됨 | 브랜치·시점에 따라 구형 가능 |

**핵심:** `.gitignore` 가 `/docs/*` 를 제외하고 `!docs/image-knowledge/**` 만 허용한다.

```gitignore
/docs/*
/docs/.*
!docs/image-knowledge/
!docs/image-knowledge/**
```

→ FTP에만 있는 정본 문서는 **GitHub·Cloud Agent·다른 클론에서 404**가 된다.  
→ `validate-doc-links` 는 **로컬 docs/** 만 검사하므로 **CI 통과 ≠ 원격 정본 존재**이다.

**DOC-CANON-01 한 줄:**

```text
에이전트 정본 문서는 Git에 추적되거나, 참조가 추적 문서로 치환되어야 한다.
로컬 FTP 전용 docs는 판정 근거로 쓰이면 안 된다.
```

---

## 1. 충돌 요약·판정

| ID | 충돌 | 로컬 현황 (2026-06-30) | GitHub 위험 | 조치 유형 |
|----|------|-------------------------|-------------|-----------|
| **C1** | `docs/180` · `181` 정본 404 | 로컬 **있음** · git **미추적** | **BLOCKER** | gitignore + 커밋 |
| **C2** | `IMG-016` PASS/REGENERATE | prompt **PASS v6** 통일 · registry PASS | 구형 zip 시트 잔존 가능 | 상태 블록 표준화 |
| **C3** | `IMG-096` PASS/REGENERATE | prompt **PASS v6** · 하단 REGENERATE v4 **삭제됨** | 동일 | 동기화·검증 |
| **C4** | `docs/19` · `26` vs prompt PASS | **19·26 상단 REGENERATE** · prompt **PASS v8** | 에이전트 회귀 재작도 | 역사 문서화 |
| **C5** | `docs/153` 404 + `건설기간` 잔존 | **153 로컬 있음** · **125 §3.1 건설기간** · prompt 파일명 legacy | SEO·용어 혼선 | 153 커밋 + 125·검증 |

---

## 2. 실행 Phase

### Phase 0 — Git 추적 정책 (선행 · 0.5일)

**목표:** 정본 docs가 `cagito/nmti_website`에 올라가게 한다.

| # | 작업 | 산출 |
|---|------|------|
| 0.1 | `.gitignore` 개정 — **에이전트 정본 화이트리스트** 추가 | 패치 |
| 0.2 | `git add -f` 또는 `!docs/NNN-*.md` 규칙으로 **180~208·153·28·51·127·206** 등 추적 | 커밋 |
| 0.3 | `docs/CANONICAL_DOC_INDEX.md` 신규 — 번호·역할·Git 추적 여부 표 | 색인 |
| 0.4 | `AGENTS.md` §「정본은 Git 추적 docs만」한 줄 | 에이전트 잠금 |

**권장 `.gitignore` 패턴 (초안):**

```gitignore
/docs/*
/docs/.*
!docs/image-knowledge/
!docs/image-knowledge/**
# DOC-CANON-01: 에이전트·Figure 판정 정본 (번호대 화이트리스트)
!docs/[0-9]*.md
!docs/TERMINOLOGY.md
!docs/TECHNICAL_IMAGE_STANDARD.md
!docs/INSTRUMENTATION_DRAWING_RULES.md
!docs/IMAGE_*.md
!docs/DEPLOYMENT*.md
!docs/AGENTS*.md
```

> 대안: `docs/canonical/` 하위로 180·181·153만 이동 후 전체 추적 — 링크 일괄 치환 필요.

**Exit:** `git ls-files docs/180*` · `docs/181*` · `docs/153*` **non-empty** · GitHub raw URL 200

---

### Phase 1 — C1: `docs/180` · `181` 정본 복구 (Phase 0 직후 · 1일)

| # | 작업 |
|---|------|
| 1.1 | [180](./180-technology-이미지-전수-재검수-수정계획.md) · [181](./181-이미지별-계측오류-금지조건-정본.md) · [182](./182-분야별-계측이미지-PASS-기준.md) 커밋 |
| 1.2 | `docs/28` · `IMAGE_AUDIT_CHECKLIST` · `INSTRUMENTATION` · `AGENTS.md` 에서 180/181 링크 **상대경로 검증** |
| 1.3 | `scripts/image-review-registry.json` `reviewDoc` 필드 — 180/181 경로가 **실제 파일명**과 일치하는지 스크립트 점검 |
| 1.4 | ImageWorks `prompts/IMG-002·004·016·024·035·096` 상단 `zip 112 WebP 재검수` 링크 유지·확인 |

**역할 고정:**

| 문서 | 역할 |
|------|------|
| **180** | 112 WebP 전수 재검수 **마스터 계획** · S0/P0/P1 판정표 |
| **181** | IMG별 **금지조건·§0~7** 정본 (앵커 `#img-###`) |
| **182** | 분야별 PASS 5게이트 |

**Exit:** 원격에서 180·181 열람 가능 · broken link 0

---

### Phase 2 — C2·C3: Figure 문서 **단일 상태** 프로토콜 (1일)

**문제:** 동일 prompt에 `PASS`와 `REGENERATE`가 공존하면 에이전트가 **재작도 vs 유지**를 선택 불가.

**표준 — prompt 최상단 15줄 (`CANONICAL_STATUS` 블록):**

```markdown
> **CANONICAL_STATUS (에이전트 최우선)**
> | 항목 | 값 |
> |------|-----|
> | **현재 판정** | PASS (vN ai-reviewed) |
> | **registry** | reviewGrade=PASS · requiresReaudit=false |
> | **과거** | REGENERATE (ZIP-AUD-11) → **resolved 2026-06-30** · [187](./187-…md) |
> | **재작도 금지** | 본 문서 REGENERATE 문구는 **역사** — 무시 |
```

| IMG | 확정 현재 상태 (로컬 2026-06-30) | 작업 |
|-----|--------------------------------|------|
| **016** | PASS v6 · [187](./187-IMG-016-v6-재생성-기록.md) | 메타표·하단에 REGENERATE 잔여 시 **「변경 이력」**으로 이동 |
| **096** | PASS v6 · [192](./192-IMG-096-v6-재생성-기록.md) | `상태: REGENERATE v4` **삭제** (로컬 완료) · redline v3 `superseded` 유지 |

**동기화 체크리스트 (Figure당):**

```text
□ ImageWorks/prompts/IMG-### — CANONICAL_STATUS
□ image-review-registry.json — reviewGrade · requiresReaudit · reviewDoc
□ docs/IMAGE_REVIEW_LOG.md §IMG-###
□ docs/18N-IMG-###-vN-재생성-기록.md (있으면)
□ redline 최신본 — superseded 표기만, REGENERATE 지시 없음
```

**신규 스크립트:** `scripts/validate-figure-status-consistency.mjs`

- prompt `CANONICAL_STATUS` vs registry `reviewGrade` 불일치 → **FAIL**
- prompt 본문 `판정: REGENERATE` + registry PASS → **FAIL**

**Exit:** 016·096 검증 0 errors · Phase 0 후 187·192도 Git 추적

---

### Phase 3 — C4: 구형 오류분석 `docs/19` · `26` (0.5일)

**문제:** Git에 추적되는 구형 문서가 **현재 지시처럼** REGENERATE를 말함.

| 문서 | 현재 (Git) | 최신 정본 |
|------|------------|-----------|
| [19](./19-IMG-002-흙막이-계측-대표-단면도-오류분석-및-재작업-계획.md) | 상단 **REGENERATE v5** | prompt **PASS v8** · [199](./199-IMG-002-v8-재생성-기록.md) |
| [26](./26-IMG-004-어스앵커-하중계-오류분석-및-재작업-계획.md) | **REGENERATE** · registry 되돌리라 | prompt **PASS v8** · [188](./188-IMG-004-v8-재생성-기록.md) |

**수정 템플릿 (각 문서 상단):**

```markdown
> **⚠️ 역사 문서 (ARCHIVE)** — 현재 판정은 본 문서가 아니다.
> **현재 정본:** ImageWorks `prompts/IMG-00N_*.md` · `reviewDoc` · [199/188 재생성 기록]
> **현재 상태:** PASS v8 · prohibitedErrors 유지 · **재작도 금지**
```

| # | 작업 |
|---|------|
| 3.1 | docs/19·26 상단 ARCHIVE 배너 + 현재 상태 표 |
| 3.2 | 본문 `판정: REGENERATE` → `### 과거 판정 (2026-06-26)` 소제목 하위로 이동 |
| 3.3 | `AGENTS.md` IMG-002·004 항목 — 정본을 **52·54·83·prompt** 로 명시, 19·26은 **참고(역사)** |

**Exit:** 에이전트가 19·26만 읽고 REGENERATE 실행하는 경로 차단

---

### Phase 4 — C5: `건설중` 정본 + `건설기간` 잔존 (1일)

| # | 작업 |
|---|------|
| 4.1 | [153](./153-계측문서-용어-정본-건설중-계측.md) **Git 추적** (Phase 0) |
| 4.2 | [125](./125-건설기간-계측-SEO-구현-완료-보고.md) §3.1·§5.1 표 — `건설기간` → **`건설중`** (slug `construction-phase` 주석 유지) |
| 4.3 | `validate-terminology.mjs` 규칙 추가 — `scripts/content-data` · `dictionary.js` · SEO generator 출력에서 **대외 `건설기간 계측` FAIL** (`docs/153` §2) |
| 4.4 | `IMG-111·112·113` — 파일명 `건설기간_` **legacy** 유지, prompt 상단에 `legacy filename · 본문·라벨=건설중` 고정 (이미 111 본문 지시와 정합) |
| 4.5 | `dictionary.js` — `건설기간` autolink alias는 **호환 리다이렉트**로 유지하되 신규 문서 작성 금지 |

**Exit:** `validate-terminology` PASS · 125 내부 표 일치 · 153 원격 200

---

### Phase 5 — CI·에이전트 방어 (1일)

| # | 스크립트 | 내용 |
|---|----------|------|
| 5.1 | `validate-doc-links.mjs` **확장** | 스캔: `docs/` + `ImageWorks/**/*.md` + `scripts/image-review-registry.json` `reviewDoc` |
| 5.2 | `validate-canonical-docs-tracked.mjs` **신규** | `CANONICAL_DOC_INDEX` 화이트리스트 파일이 `git ls-files`에 있는지 |
| 5.3 | `validate-figure-status-consistency.mjs` **신규** | Phase 2 |
| 5.4 | `verify:local` 편입 | `validate:canonical-docs` · `validate:figure-status` (Phase 0~4 완료 후) |

---

## 3. 우선순위·일정

| 순위 | Phase | 충돌 | 예상 | 선행 |
|:--:|-------|------|------|------|
| **1** | **0** | C1·C5 근본 (gitignore) | 0.5일 | — |
| **2** | **1** | C1 180/181 배포 | 1일 | 0 |
| **3** | **2** | C2·C3 016·096 | 1일 | 0 (187·192는 0 필요) |
| **4** | **3** | C4 19·26 | 0.5일 | — |
| **5** | **4** | C5 건설중 | 1일 | 0 (153) |
| **6** | **5** | CI | 1일 | 1~4 |

**병행 가능:** Phase 3 (19·26) ↔ Phase 2 (prompt 표준) · Phase 4.2 (125) ↔ Phase 0

---

## 4. Exit 게이트 (프로그램 Exit)

| 게이트 | 기준 |
|--------|------|
| **Git** | `docs/180` · `181` · `153` · `187` · `192` · `199` · `188` — `origin/main`에서 raw 200 |
| **링크** | `validate-doc-links:strict` — docs + ImageWorks 0 broken |
| **상태** | `validate-figure-status` — 002·004·016·096 0 conflict |
| **용어** | `validate-terminology` — 대외 `건설기간 계측` 0 (content-data·SEO) |
| **운영** | `verify:local` · `verify:production` 유지 |

---

## 5. 에이전트 읽기 순서 (충돌 해소 후)

```text
1. CANONICAL_STATUS (prompt 최상단) 또는 registry reviewGrade
2. docs/181 §IMG-### (금지·설치·PASS 조건)
3. docs/52·54·57… (Figure 전용 표준)
4. ImageWorks prompt §강제 지시문
5. docs/180 (전수 큐·우선순위만 — 개별 PASS는 181·registry가 이김)
6. docs/19·26·… (ARCHIVE — 역사만, 판정 금지)
```

---

## 6. 리스크

| 리스크 | 대응 |
|--------|------|
| `!docs/[0-9]*.md` 로 281개 전부 Git 팽창 | 번호대·CANONICAL_INDEX로 **필수만** un-ignore |
| FTP·Git 양방향 sync 충돌 | `git-sync` 전 `lock:status` · 정본 docs는 **한 창에서만** 커밋 |
| 180 §P0 표와 registry PASS 불일치 | 180은 **계획** · 실제 PASS는 registry+187/192 — 180에 「완료 시 registry 갱신」각주 |
| Cloud Agent가 구형 브랜치 clone | `main` 배포 후 Agent에 **commit SHA** 고정 지시 |

---

## 7. 즉시 다음 액션 (승인 시)

1. **`.gitignore` Phase 0.1** 패치 + `docs/CANONICAL_DOC_INDEX.md`  
2. **`git add -f`** 180·181·153·187·192·199·188·208 + push `cagito/nmti_website`  
3. **docs/19·26** ARCHIVE 배너  
4. **`validate-doc-links`** ImageWorks 확장 스캐폴드  
5. **IMG-016·096** `CANONICAL_STATUS` 블록 추가 (전 Figure 템플릿)

---

## 8. 연계

- [98 다중 Cursor 충돌방지](./98-다중-Cursor-동시작업-충돌방지.md)
- [206 ATS-SUB-01](./206-자동광파기-지하공사-전용-표현-통합-적용-계획.md)
- [10 운영 가이드](./10-최종-완료-및-운영-가이드.md)
- [IMAGE_REVIEW_LOG](./IMAGE_REVIEW_LOG.md)
