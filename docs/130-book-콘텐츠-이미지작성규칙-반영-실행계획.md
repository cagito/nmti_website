# book 콘텐츠 → 이미지 작성 규칙 반영 실행계획

**수립:** 2026-06-27  
**목표:** `book/` PDF·추출 텍스트에서 도출한 **설치·배치·표현 제약**을 Figure 작성 규칙 체계에 **체계적으로 흡수**한다.  
**선행:** [128 디자인 원칙 통합](./128-디자인-원칙-문서-통합-반영-실행계획.md) · [image-knowledge/README](./image-knowledge/README.md) · [40 출처표기](./40-KCS-KDS-출처-표기-통합-계획.md)  
**성공 사례:** [127 DISP-ATS-01](./127-변위계측-자동광파기-남용방지-및-와이어식-우선-표준.md) · [129 SLO-WIRE-01](./129-사면-옹벽-와이어식-변위계-배면사면-표준.md)

---

## 1. Executive Summary

현재 저장소는 **book → image-knowledge(20주제) → Figure** 1차 파이프라인을 갖추었으나, **INSTRUMENTATION §3.x(36절)** · **ImageWorks prompts(102종)** · **검수 DP/DIS(51·63)** 와의 **양방향 정합**이 불완전하다.

본 계획은 book 내용을 **「실행 규칙」** 으로 변환하는 5단계 워크플로와 **갭 매트릭스·자동화·CI** 를 정의한다.

| 현재 | 목표 |
|------|------|
| PDF 색인 자동 (`catalog:book-pdf`) | + **조항→규칙** 추출 템플릿 |
| image-knowledge 20주제 (13절 템플릿) | + **누락 12주제** · INSTR §3 **역링크** |
| citation registry → 프롬프트 §근거 | + **§5·§6 금지/필수** 프롬프트 동기화 |
| 수동 정책 승격 (127·129) | + **승격 체크리스트** 표준화 |

---

## 2. book 입력 소스 분류

`book/` 은 Figure **근거로 허용**되는 유일한 외부 문서 집합이다 ([00-공통 §5](./image-knowledge/00-공통-이미지-작성-원칙.md)).

| 등급 | 유형 | 대표 파일 | Figure 반영 방식 |
|------|------|-----------|------------------|
| **A** | KDS/KCS 시방 | `KDS 11 10 15`, `KCS 11 10 15`, `KDS 27 50 10`, `KCS 24 99 05`, `KCS 54 20 25` | **일반 원칙** · registry A/B 조항 |
| **B** | 장비·설치 매뉴 | `guide-to-instrumentation.pdf`, `부록2. 계측기 사양 및 설치상세도.pdf` | §3 설치 형상 · BORE-GL 등 |
| **C** | 연구·설계 보고 | `도시철도_…수동_및_자동계측기_…보고서.pdf` | **선택·경제성** — hero 일반화 금지 |
| **D** | 계측계획·유지관리 도면 | `03 계측계획도면.pdf`, `2. 유지관리계측 도면.pdf` | 배치·범례 참고 — **현장 사례** 라벨 |
| **E** | 준공·사례 보고 | 대구통합·금강2교·광암교 등 | callout·inset만 — **hero 금지** |
| **F** | 교육·제안 | 지명원 PDF, 제안설명회 | 용어·흐름 참고만 — **설치 규칙 근거 불가** |

**신뢰도 우선순위 (충돌 시):** A > B > D > C > E > F · 설계도서·계측관리계획서 > 본 저장소 해설.

---

## 3. 출력 문서 계층 (book → 규칙)

```text
book/PDF + _extract/*.txt
        │
        ▼  Phase 1·2 (추출·합성)
docs/image-knowledge/NN-주제.md   ← Agent 실행 규칙 (13절 고정)
        │
        ▼  Phase 3 (승격)
docs/12x-정책표준.md              ← 한 줄 정책 + 표 (127·129 패턴)
docs/INSTRUMENTATION §3.x         ← 설치·라벨·금지 요약 + image-knowledge 링크
docs/51·63 DP/DIS                 ← 검수 항목 1~3개
        │
        ▼  Phase 4 (하향)
ImageWorks prompts/redlines       ← §5·§6 → 복붙 블록
.cursor/rules/*.mdc · AGENTS.md
scripts/image-review-registry.json
        │
        ▼  Phase 5
npm run validate:* · audit:* · verify:local
```

**원칙:** PDF 원문은 **색인·인용**만. Figure Agent가 읽는 문장은 **image-knowledge §3~§11** 에만 둔다.

---

## 4. 5단계 파이프라인

### Phase 1 — 색인·추출 (주 1회 / PDF 추가 시)

| ID | 작업 | 명령·산출 |
|----|------|-----------|
| P1-1 | PDF 메타·키워드 색인 | `npm run catalog:book-pdf` → `source-index.md`, `_manifest.json` |
| P1-2 | KDS/KCS 조항 추출 | `book/_kds_kcs_term_extract.json` · HWP `npm run extract:hwp-terms` |
| P1-3 | 계획도면 ↔ SPA 노드 | `npm run crosscheck:book-plans` → `book-site-plan-crosscheck.md` |
| P1-4 | **갭 시트** 갱신 | §6 매트릭스 — `INSTR §3` / `image-knowledge` / `IMG-###` / book § |

**산출물:** `docs/image-knowledge/_gap-matrix.md` (신규, P1-4에서 자동+수동 유지)

### Phase 2 — 규칙 합성 (주제당 1회)

각 주제 파일은 **13절 템플릿** (`validate-image-knowledge.mjs` 정본)을 따른다.

| 절 | book에서 가져올 내용 |
|----|---------------------|
| §1 Figure 목적 | KDS §4.1.x **한 계측 목적** |
| §3 표현 가능 | 시방·매뉴얼 **설치 허용 구간** |
| §4 미표현 | 시공 불가·Figure 혼동 구간 |
| §5·§6 필수/금지 | 조항·도면에서 반복되는 **오류 패턴** |
| §12 PDF 근거 | `book/` 경로·페이지·신뢰도 |
| §13 체크리스트 | redline Q-* 와 1:1 |

**작업 순서:** `source-index` 해당 행 → PDF § 읽기 → §3~§6 초안 → 인간 1pass → `validate:image-knowledge:strict`

### Phase 3 — 상위 표준 승격 (정책·교차분야)

book에서 **2개 이상 Figure** 또는 **P0/P1 위반**이 반복되면 [128 Phase B](./128-디자인-원칙-문서-통합-반영-실행계획.md) 실행:

1. `docs/12x-*.md` — 정책 ID (예: `WX-SITE-01`, `GW-ROLE-01`)
2. `INSTRUMENTATION` 해당 §3.x — 5~15줄 + `> image-knowledge: docs/image-knowledge/NN-…`
3. `51` DP/DIS 또는 `63` — 검수 1~3항
4. `AGENTS.md` + `.cursor/rules/` — 에이전트 강제

### Phase 4 — Figure·프롬프트 하향

| 우선 | 대상 | book 반영 작업 |
|------|------|----------------|
| F1 | **hero** · category 개요 | callout = KDS §4.1 해당 항목만 |
| F2 | **REGENERATE** · redline FAIL | image-knowledge §5·§6 → prompt vN |
| F3 | **FT-C** (그래프·경보·시스템) | book 경보·QC PDF → 050~055·054 |
| F4 | registry `notes` | `book §…` · 정책 ID 기록 |

**프롬프트 동기화 (신규):**

```bash
npm run sync:prompt-citations    # §근거 기준 (기존)
# Phase 4 확장 (계획):
npm run sync:prompt-image-rules  # image-knowledge §5·§6 → prompts 블록 (미구현)
```

### Phase 5 — 검증·잠금

```bash
npm run validate:image-knowledge:strict
npm run validate:terminology
npm run validate:citations
npm run audit:images:strict
npm run verify:local          # 배포 전
```

**추가 게이트 (계획):**

| 게이트 | 검사 내용 |
|--------|-----------|
| `crosscheck:book-plans` | book 도면 키워드 ↔ nodeId·IMG hero |
| `audit:book` | book PDF 무결성 |
| **book-rules-coverage** (신규) | INSTR §3.x → image-knowledge 링크 100% |

---

## 5. 갭 매트릭스 (2026-06-27 기준)

### 5.1 image-knowledge ✅ (27주제)

01~20 기존 + **21·22·25·26·27·28·29** (130 Week 0). 갭: [_gap-matrix.md](./image-knowledge/_gap-matrix.md)

### 5.2 image-knowledge ❌ (신규 작성 후보)

| 우선 | 주제 파일 (안) | book 근거 | INSTR § | 대표 IMG |
|------|----------------|-----------|---------|----------|
| P0 | `21-토압계-설치-표현.md` | KDS 표 4.1-1 · guide §9 | 3.6 | 034 |
| P0 | `22-균열·변형률-계측-표현.md` | KDS §4.1.9 · §4.2 | 3.9·3.14 | 037·036 |
| P1 | `23-신축·변위계-구조부재.md` | KCS 24 99 05 · 52 | 3.23.3 | 039·014 |
| P1 | `24-진동·소음-계측-표현.md` | KDS §4.1.11 · KCS §3.9 | 3.17·3.32 | 041·097 |
| P1 | `25-MPBX·지중변위-표현.md` | KDS §4.1.6 · guide | 3.13 | 091 |
| P1 | `26-기상·환경-보조계측.md` | KDS §4.2.3 · 도시철도 | 3.31 | 044·093 |
| P2 | `27-연약지반·압밀-계측.md` | KDS §4.1.3~4 | 3.8·3.29 | 019~021 |
| P2 | `28-경보·그래프·대시보드-표현.md` | KCS §3.2.4 · 사례집 | 3.35·3.36 | 049~055·056 |
| P2 | `29-통신·게이트웨이-역할.md` | KCS §3.1.2 | 3.15·3.17 | 046·048 |

### 5.3 INSTRUMENTATION ↔ image-knowledge 역링크

**현황:** INSTRUMENTATION §3.x **42절** 역링크 ✅ (`npm run patch:instr-image-knowledge` · `validate:instr-image-knowledge`)

### 5.4 프롬프트 ↔ image-knowledge

| 상태 | 개수(대략) | 조치 |
|------|------------|------|
| §근거 기준 (citation-sync) | 102 prompts | 유지 · `validate:citations` |
| §5·§6 실행 블록 | ~40% only | Phase 4 `sync:prompt-image-rules` |
| redline ↔ image-knowledge §13 | 부분 | redline Q → §13 체크리스트 복사 |

---

## 6. 주제별 반영 로드맵 (2026 Q3~Q4)

| 스프린트 | book 소스 | image-knowledge | INSTR / docs | Figure 묶음 |
|----------|-----------|-----------------|--------------|---------------|
| **W1** | KDS §4.1.2·도시철도 §3.3 | 13 보강 · **129** SLO-WIRE | §3.30 | 089·090·015 |
| **W2** | KDS §4.2.1.3 · 도시철도 표 2.5 | 09 보강 | §3.10 · **127** | 040·042·049 |
| **W3** | KCS §3.10.3 · guide anchor | 06 보강 | §3.2 | 003·004·035 |
| **W4** | KCS §3.2 · 부록2 함체 | 08 보강 | §3.24 · P0-3 | 045·065·076 |
| **W5** | KCS §3.1.2·§3.2.4 | **29** 신규 | §3.15·3.36 | 046·048·058 |
| **W6** | KDS §4.2.3 · INTERP | **26** 신규 | §3.31 | 044·018·062 |
| **W7** | KCS §3.2.4 · 경보 사례 | **28** 신규 | §3.35 | 050~055·054 |
| **W8** | KDS 표 4.1-1 잔여 | **21·22** 신규 | §3.6·3.9 | 034·037·036 |
| **W9** | KDS §4.1.8·§4.1.3 | 19·15 보강 | §3.25·3.26 | 024·064·098 |
| **W10** | `18-계측계획` + 03 PDF | 18 보강 | §3.1.0 | 001·002·096 |

**병행:** [122 P1](./122-Pillow-와이어프레임-Figure-출판품질-통합-수정계획.md) FT-C 재작도 — book 규칙 반영 후 redline 갱신.

---

## 7. 자동화 로드맵

| 단계 | 스크립트 (상태) | 기능 |
|------|-----------------|------|
| ✅ | `catalog-book-pdf.mjs` | PDF manifest · source-index |
| ✅ | `validate-image-knowledge.mjs` | 13절 구조 · book/ 인용 |
| ✅ | `sync-prompt-citations.mjs` | registry → prompt §근거 |
| ✅ | `sync-instrumentation-citations.mjs` | registry → INSTR ### 근거 |
| ✅ | `crosscheck_book_site_plans.py` | 도면 키워드 ↔ node |
| 🔲 | `build-gap-matrix.mjs` | INSTR §3 ↔ image-knowledge ↔ IMG |
| ✅ | `sync-prompt-image-rules.mjs` | §5·§6 → ImageWorks `## 실행 규칙` |
| ✅ | `validate-instr-image-knowledge-links.mjs` | §3 역링크 누락 CI |
| ✅ | `patch-instr-image-knowledge-links.mjs` | INSTR §3 역링크 주입 |
| 🔲 | `extract-kds-figure-rules.py` | A등급 PDF §4.1 → 후보 bullet (human review) |
| ✅ | `build-gap-matrix.mjs` | `_gap-matrix.md` 생성 |

---

## 8. 역할·산출물

| 역할 | 산출 |
|------|------|
| **book 큐레이션** | PDF 추가 · `_gap-matrix` · source-index |
| **규칙 작성** | image-knowledge NN · INSTR §3 요약 |
| **정책** | docs/12x · 51 DP · AGENTS |
| **Figure** | prompt/redline vN → PNG → registry |
| **CI** | validate · audit · verify:local |

---

## 9. 완료 기준 (Exit)

1. **커버리지:** INSTRUMENTATION §3.1~3.36 **100%** image-knowledge 링크 (작성 예정 포함 명시)
2. **신규 주제:** §5.2 P0·P1 **9파일** 초안 + `validate:image-knowledge:strict` PASS
3. **정책:** book 유래 **교차 Figure** 정책 3건 이상 127·129 패턴 문서화
4. **프롬프트:** hero·REGENERATE **30종** — image-knowledge §5·§6 블록 포함
5. **CI:** `verify:local` · `book-rules-coverage` (구현 후) PASS
6. **충돌 0:** `book/` 외 PDF를 image-knowledge §12에 인용하지 않음

---

## 10. 즉시 착수 (Week 0)

- [x] `docs/image-knowledge/_gap-matrix.md` 초안 생성 (`build-gap-matrix`)
- [x] INSTRUMENTATION §3.x **image-knowledge 역링크** (`patch:instr-image-knowledge`)
- [x] `00-공통 §7` 링크 정정 — 변위 주제는 `09-변위·광학…` (08=로거)
- [x] W5: **29-통신·게이트웨이** + `sync:prompt-image-rules` (046·048·058)
- [x] W6: **26-기상·환경** + INTERP (044·018)
- [x] 초안 주제 **21·22·25·27·28** (130 §5.2)
- [x] [128](./128-디자인-원칙-문서-통합-반영-실행계획.md) §4 · 본 문서 §6 스프린트 링크

---

## 11. 참고

| 문서 | 역할 |
|------|------|
| [image-knowledge/00-공통](./image-knowledge/00-공통-이미지-작성-원칙.md) | Agent 공통 |
| [INSTRUMENTATION](./INSTRUMENTATION_DRAWING_RULES.md) | §3 장비 규칙 |
| [51 검수 공통](./51-계측-도면-검수-공통-원칙.md) | DP/DIS/REJECT |
| [36 AI 프롬프트](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) | §1.0·§4 |
| [book/kds-kcs-citation-registry.json](../book/kds-kcs-citation-registry.json) | A/B 조항 |
| [book/instrumentation-section-cites.json](../book/instrumentation-section-cites.json) | §3.x ↔ KDS/KCS |

**갱신:** PDF·정책 추가 시 본 문서 §5·§6 표와 [128 §4](./128-디자인-원칙-문서-통합-반영-실행계획.md) 동시 갱신.
