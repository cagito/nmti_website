# KCS/KDS 출처 표기 통합 계획

**작성:** 2026-06-26  
**목적:** 기술자료·내부 문서 전반에 **검증 가능한 KCS/KDS 근거**를 일관되게 표시하여, 열람자·발주처·검토자에게 **공신력·방어 가능성(defensibility)** 을 확보한다.  
**상위 규칙:** [book/KDS-KCS_용어기준.md](../book/KDS-KCS_용어기준.md) · [TERMINOLOGY.md](./TERMINOLOGY.md) · [book-web-consistency-audit.md](./book-web-consistency-audit.md)

> **한 줄:** 용어 준수(현재) + **조항·표 단위 출처(신규)** + **페이지·문서 하단 근거 블록** + **자동 검증 게이트**.

---

## 1. 배경·문제 정의

### 1.1 현황

| 영역 | KCS/KDS 언급 | 구조화 출처 | 방어 수준 |
|------|-------------|------------|----------|
| `book/KDS-KCS_용어기준.md` | ✅ 마스터 | PDF 경로만 | 높음(용어) |
| `scripts/content-data/` (113노드) | 일부 인라인 `(KDS 4.1.5)` 등 | ❌ `sources` 필드 없음 | 중·저 |
| `docs/*` 기술 가이드 (~40종) | 산발적 | ❌ 통일 섹션 없음 | 중 |
| `INSTRUMENTATION_DRAWING_RULES.md` | §3.x 위주 | 조항 링크 없음 | 중 |
| `ImageWorks/prompts/` | 소수 | ❌ | 저 |
| SEO 정적 페이지 | 거의 없음 | ❌ | 저 |

- `validate-terminology.mjs`는 **금지 표현**만 검사 — **출처 누락·과장 인용**은 미검증.
- `book/_kds_kcs_term_extract.json`에 5종 PDF 텍스트가 있으나 **노드·문서와 매핑되지 않음**.

### 1.2 목표 (성공 기준)

1. **웹 기술자료 113노드** — KCS/KDS 근거가 있는 페이지는 **「근거 기준」블록**에 최소 1개 이상의 **검증된 인용** 표시.
2. **내부 기술 문서** — KDS/KCS를 근거로 삼는 주장마다 **§/표 번호** 또는 **「참고·일반 관행」** 구분 표기.
3. **자동 검증** — `npm run verify:local`에 **출처 커버리지·과장 인용** 감사 추가 (초기 warn → 점진 strict).
4. **법적·기술 방어** — 「필수」「KDS에 따라」 등 **강한 표현은 PDF 추출 근거와 1:1 대응**; 없으면 「설계도서·발주처 기준」「일반 엔지니어링 관행」으로 격하.

---

## 2. 적용 범위

### 2.1 포함 (P0~P2)

| 계층 | 경로 | 노드/문서 수(대략) |
|------|------|-------------------|
| **A. 웹 본문** | `scripts/content-data/*.mjs` → `content-data.js` | 113 SPA 노드 |
| **B. SEO** | `technology/**/index.html` (빌드 산출) | 104 페이지 |
| **C. 센서 랜딩** | `sensors/**/` | 소수 |
| **D. 핵심 내부 표준** | `INSTRUMENTATION_*`, `TECHNICAL_IMAGE_STANDARD`, `24-가이드`, `36-프롬프트` | ~10 |
| **E. 감사·계획 문서** | `28·30·book-web-consistency`, IMG-0xx 계획서 | ~25 |
| **F. ImageWorks** | `prompts/`, `03_IMAGE_MASTER_LIST.json` | 102 Figure |

### 2.2 제외·약화

| 대상 | 처리 |
|------|------|
| `01·02·03` 기획·디자인·지명원 | 회사 소개 — KCS/KDS 불필요 |
| `DEPLOYMENT-IIS.md` | 인프라 |
| 순수 이미지 redline·픽셀 감사 | Figure 기술 오류 ID만; KCS 조항은 INSTRUMENTATION 경유 |
| `book/` 현장 준공 PDF | **별도** 교차검증(`audit:book`) — 본 계획 §7 참고 |

---

## 3. 기준서 정본·인용 체계

### 3.1 기준서 레지스트리 (정본)

| ID | 문서 | 개정 | 역할 | PDF |
|----|------|------|------|-----|
| `KDS-11-10-15` | KDS 11 10 15 지반계측 | 2025.12 | **설계·항목·관리 용어** (최상위) | `book/KDS 11 10 15 지반계측(25.12).pdf` |
| `KCS-11-10-15` | KCS 11 10 15 시공 중 지반계측 | 2025.12 | **시공·빈도·자동화·계측책임** | `book/KCS 11 10 15 시공 중 지반계측_(25. 12. 24).pdf` |
| `KDS-27-50-10` | KDS 27 50 10 터널 계측 | 2023.09 | 터널 §4.1.5 등 | `book/KDS 27 50 10 터널 계측(23.09).pdf` |
| `KCS-24-99-05` | KCS 24 99 05 교량계측시설 | 2023.09 | 교량 계측항목·시공 | `book/KCS 24 99 05 교량계측시설(23.09).pdf` |
| `KCS-54-20-25` | KCS 54 20 25 댐 계측설비 | 2018.08 | 댐·제방 계측 | `book/KCS 54 20 25 댐 계측설비(18.08).pdf` |

> 건축공사: KCS 11 10 15 내 **§3.9** 및 건축 시방 인용 — 별도 PDF 없으면 `KCS-11-10-15` 조항으로 통일.

### 3.2 인용 등급 (defense taxonomy)

| 등급 | 라벨 | 사용 조건 | UI/문서 표기 예 |
|------|------|----------|----------------|
| **A** | 직접 근거 | PDF 추출·조항 확인됨 | `KDS 11 10 15:2025 §4.1.5` |
| **B** | 시공·운영 근거 | KCS 조항·표 확인 | `KCS 11 10 15:2025 표 3.5-1` |
| **C** | 분야 참고 | 타 분야 KDS/KCS (터널·교량·댐) | `KCS 54 20 25 §3.2 (참고)` |
| **D** | 설계·발주 우선 | 기준 일반론 + 현장 특수 | `설계도서·계측관리계획서·발주처 기준` |
| **E** | 일반 관행 | 기준에 명시 없는 실무 설명 | `일반 엔지니어링 관행 (기준 외 보조 설명)` |

**금지:** 등급 A·B 없이 「KDS에 따라 필수」「법정 의무」 단독 표현.

### 3.3 표기 형식 (통일)

**웹·본문 인라인 (짧음):**

```text
(KDS 11 10 15:2025 §4.1.5)
```

**페이지 하단 「근거 기준」블록 (권장 풀폼):**

```text
근거 기준
· KDS 11 10 15:2025 「지반계측」§4.1.5 터널 계측 항목 — 국가건설기준센터(KCSC)
· KCS 11 10 15:2025 「시공 중 지반계측」표 3.5-1 계측 빈도 — 국가건설기준센터(KCSC)
※ 구체적 관리기준·허용값은 설계도서 및 계측관리계획서를 우선 적용합니다.
```

**내부 markdown 문서:**

```markdown
## 근거 및 출처
| 주장 | 등급 | 인용 |
|------|------|------|
| 터널 8항목 | A | KDS 11 10 15 §4.1.5 / KDS 27 50 10 |
```

---

## 4. 데이터·구현 아키텍처

### 4.1 신규 산출물

| 파일 | 역할 |
|------|------|
| `book/kds-kcs-citation-registry.json` | **노드·분야·센서 → 기준 ID·조항·등급** 마스터 |
| `scripts/validate-citations.mjs` | 레지스트리 ↔ content-data ↔ 본문 대조 |
| `scripts/content-data/_citation-snippet.mjs` | 하단 HTML 스니펫 생성 헬퍼 |
| `css` — `.tech-sources` | 근거 블록 스타일 (학술·보고서 톤) |

### 4.2 content-data 스키마 확장

```javascript
// scripts/content-data/categories.mjs 예시
'fields/tunnel': {
  // ...기존 sections...
  standardSources: [
    { grade: 'A', doc: 'KDS-11-10-15', cite: '§4.1.5', label: '터널 계측 항목' },
    { grade: 'B', doc: 'KCS-11-10-15', cite: '표 3.5-1', label: '계측 빈도' },
    { grade: 'C', doc: 'KDS-27-50-10', cite: '§4.1.5', label: '터널 계측 (참고)' }
  ],
  sourceDisclaimer: true  // 발주처·설계 우선 문구 자동 삽입
}
```

`build-content-data.mjs`가 `standardSources` → `sections.sources` HTML + JSON-LD `citation` (선택) 생성.

### 4.3 UI 배치

```
[Hero · 개요 · 원리 · 설치 · 데이터 · 관리기준 · FAQ]
────────────────────────────────────────────────────
📋 근거 기준
  · KDS … §…
  · KCS … 표 …
  ※ 설계도서·계측관리계획서 우선
```

- **분야 루트·리프·센서** 모두 동일 컴포넌트 — `technology` SPA 렌더러 1곳 수정.
- 인쇄·PDF 제안서용: `print` CSS에서 근거 블록 **항상 표시**.

### 4.4 SEO·신뢰 신호

- 정적 `index.html` `<footer>` 또는 article 끝에 동일 근거 블록 (빌드 시 주입).
- `JSON-LD` `TechArticle` + `citation` / `isBasedOn` (과도한 스키마 남용 금지 — **실제 인용과 일치**만).

---

## 5. 노드별 기준 매핑 (초안)

### 5.1 분야 (`fields/*`)

| nodeId | Primary (A/B) | Secondary (C) | 비고 |
|--------|---------------|---------------|------|
| `retaining-excavation` | KDS §4.1.1 표, KCS 시공 | — | 가시설·굴착 |
| `tunnel` | KDS §4.1.5, KCS 표 3.5-1 | KDS 27 50 10 | 8 리프 각 §매핑 |
| `bridge` | KCS 24 99 05 | KDS 11 10 15 일반 | 온도·지진·종횡변위 리프 |
| `slope` | KDS §4.1.2~3 | KCS 11 10 15 | |
| `soft-ground` | KDS §4.1.4 | KCS 11 10 15 | |
| `structural-safety` | KDS §4.1.6 | — | |
| `railway` | KDS §4.1.7 | KCS 11 10 15 | |
| `dam` | KCS 54 20 25 | KDS 11 10 15 | 누수=유량 |
| `harbor` | KDS §4.1.8 | KCS 11 10 15 | |
| `building` | KCS 11 10 15 §3.9 | — | 처짐·축소·주변 |
| `foundation-pile` | KDS §4.1.9 | 현장 시험 | D 등급 병기 |
| `environmental-impact` | KDS 선택·민원 | D | 진동·소음 |

### 5.2 센서·시스템 (`sensors/*`, `instruments/*`)

- 센서별: KDS **표 4.1-1** 계측기 대응 + 해당 **분야 조항**.
- `instruments/measurement-modes`: KCS **수동·자동·빈도** (§3, 표).
- `instruments/datalogger`, `communication`, `power`: KCS **장비·온도·알람** (3.2.x) + 등급 D 병기.

### 5.3 문서·Figure

| 문서 유형 | 출처 섹션 위치 |
|----------|---------------|
| `INSTRUMENTATION §3.x` | 각 절 말미 `### 근거` |
| `docs/24-가이드` | §1 전역 + 분야별 부록 |
| `docs/36` | nodeId 표에 `cite` 열 추가 |
| `ImageWorks/prompts` | §「근거 기준」3~5줄 |
| IMG 계획서 (`32·39` 등) | 상단 메타표에 `근거` 행 |

---

## 6. 실행 Phase

### Phase 0 — 기반 (1~2일)

| # | 작업 | 산출 |
|---|------|------|
| 0.1 | `kds-kcs-citation-registry.json` 초안 — 113노드 + 10분야 + 16센서 | JSON |
| 0.2 | `KDS-KCS_용어기준.md` §5 **인용 등급·형식** 추가 | book |
| 0.3 | `docs/40` 본 문서 ↔ `37` 실행계획 cross-link | docs |
| 0.4 | `analyze_kds_kcs_terms.py` → 조항 인덱스 확장 (§/표 오프셋) | JSON 보강 |

**Exit:** 레지스트리 100% 노드 ID 커버 (조항은 TBD 허용).

### Phase 1 — 웹 본문 (3~5일)

| # | 작업 | 우선순위 |
|---|------|----------|
| 1.1 | `categories.mjs` 10분야 — `standardSources` + 하단 문구 | P0 |
| 1.2 | `leaves-part1~3.mjs` 리프 — 분야별 § 위임 또는 직접 인용 | P0 |
| 1.3 | `sensors.mjs`, `instruments.mjs` | P1 |
| 1.4 | `build-content-data.mjs` + SPA 렌더 **근거 블록** | P0 |
| 1.5 | `build:seo` 정적 페이지 주입 | P1 |
| 1.6 | `intro` 노드 — 전역 면책 + 상위 KDS/KCS 2종 | P0 |

**Exit:** P0 분야·터널·댐·건축 페이지에서 근거 블록 visible · `build:content` PASS.

### Phase 2 — 내부 기술 문서 (2~3일)

| # | 작업 |
|---|------|
| 2.1 | `INSTRUMENTATION_DRAWING_RULES.md` — §3.x마다 `근거` 소절 |
| 2.2 | `TECHNICAL_IMAGE_STANDARD`, `24-가이드`, `36-프롬프트` |
| 2.3 | `28·30` 감사 보고서 — 인용 표 정비 |
| 2.4 | `AGENTS.md` — 출처 작성 규칙 1절 추가 |

### Phase 3 — Figure·프롬프트 (2일, Phase 1 병행 가능)

| # | 작업 |
|---|------|
| 3.1 | `03_IMAGE_MASTER_LIST.json` — `standard_ref` 필드 |
| 3.2 | FT-A hero 10종 프롬프트 상단 `Sources:` 블록 |
| 3.3 | `IMAGE_REVIEW_LOG` — 금지오류 옆 `cite` 열 (선택) |

### Phase 4 — 검증·게이트 (1~2일)

| # | 작업 |
|---|------|
| 4.1 | `scripts/validate-citations.mjs` 구현 |
| 4.2 | 규칙: (1) 매핑된 노드 `standardSources` 비어 있으면 WARN (2) 본문 `KDS`/`KCS` 인라인 있으나 레지스트리 없으면 ERROR (3) 「필수」+ 등급 A 없으면 ERROR |
| 4.3 | `package.json` — `validate:citations` → `verify:local` 체인 |
| 4.4 | `docs/citation-coverage-report.md` 자동 생성 |

**Exit:** `verify:local` PASS · citation WARN → 0 (strict 모드는 Phase 4 후 2주 유예).

### Phase 5 — 운영·갱신 (지속)

| # | 작업 |
|---|------|
| 5.1 | KDS/KCS 개정 시: PDF 교체 → `analyze_kds_kcs_terms.py` → 레지스트리 diff |
| 5.2 | 신규 노드 추가 시: `standardSources` **필수** (PR 체크리스트) |
| 5.3 | `audit:book` — 웹 인용 vs 준공보고서 교차 (기존 파이프 유지) |

---

## 7. 방어 가능성(defensibility) 원칙

1. **인용은 PDF에서 확인한 조항만** — `_kds_kcs_term_extract.json` 또는 수동 검증 로그에 `verifiedDate` 기록.
2. **선택 항목 vs 필수** — KDS 「선택」은 웹에서도 「선택·발주처 요건」으로 표기 (터널 발파진동·소음 등).
3. **관리기준 수치** — 기준서에 없는 mm·%는 「예시」「설계예상변위」로 격하; Figure 그래프 축은 INSTRUMENTATION 감사 ID 유지.
4. **상위 우선순위 문구** — 모든 분야 페이지 하단:  
   `※ 본 자료는 기준서 해설이며, 설계도서·계측관리계획서·발주처 지침이 상위 적용됩니다.`
5. **KCSC 출처** — 첫 인용 시 「국가건설기준센터(KCSC, www.kcsc.re.kr)」 1회 명시.
6. **과거 준공 사례** — `book/` 현장 PDF 인용 시 「현장 사례·준공보고서」등급 **F** 별도 — KCS/KDS와 혼동 금지.

---

## 8. 리스크·완화

| 리스크 | 완화 |
|--------|------|
| 조항 번호 오기 | PDF 2인 교차 확인 + extract 스크립트 스팬 검색 |
| 기준 개정 불일치 | 문서 헤더 `:2025` / `:2023` 버전 고정 |
| UI 과밀 | 본문 인라인 최소화 · 하단 블록 집약 |
| SEO 키워드 스터핑 | 인용은 사람 가독용 · JSON-LD는 1~3건 |
| 레거시 인라인 `(KDS 4.1.5)` 혼재 | Phase 1에서 일괄 풀폼 치환 스크립트 |

---

## 9. 검증·완료 체크리스트

```bash
node scripts/validate-terminology.mjs      # 기존 용어
node scripts/validate-citations.mjs        # 신규 출처
node scripts/build-content-data.mjs
npm run build:seo
npm run verify:local
```

| 항목 | 목표 |
|------|------|
| 노드 `standardSources` 커버리지 | 100% (등급 D·E 허용) |
| P0 분야 10 + intro | 근거 블록 UI 표시 |
| INSTRUMENTATION §3 | 80%+ `근거` 소절 |
| orphan 인라인 KDS/KCS | 0건 |
| 「필수」 무근거 | 0건 |

---

## 10. 일정 요약

| Phase | 기간 | 누적 |
|-------|------|------|
| 0 기반 | 1~2일 | D2 |
| 1 웹 | 3~5일 | D7 |
| 2 내부 문서 | 2~3일 | D10 |
| 3 Figure | 2일 | D10 (병행) |
| 4 검증 | 1~2일 | D12 |

**권장 착수:** Phase 0.1 레지스트리 + Phase 1.4 UI (가시 효과) 동시 진행.

---

## 11. 관련 문서

| 문서 | 관계 |
|------|------|
| [KDS-KCS_용어기준.md](../book/KDS-KCS_용어기준.md) | 용어 정본 → 본 계획은 **조항 출처** 확장 |
| [book-web-consistency-audit.md](./book-web-consistency-audit.md) | 항목 누락 감사 — 출처 계획과 상호 보완 |
| [37-AI-프롬프트-가이드-반영-실행-계획.md](./37-AI-프롬프트-가이드-반영-실행-계획.md) | Sprint 일정에 Phase 1~2 슬롯 삽입 |
| [05-기술자료-수정-배포-검증.md](./05-기술자료-수정-배포-검증.md) | 배포 전 verify 체크리스트 갱신 |

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | 초안 — 범위·등급·Phase·스키마·113노드 매핑 |
| 2026-06-26 | **Phase 0~1·4 구현** — `kds-kcs-citation-registry.json`, `resolve-citations.mjs`, 웹 113노드 근거 블록, `validate:citations`, SEO 주입 |
| 2026-06-26 | **Phase 2~3 구현** — INSTRUMENTATION §0·부록 A, docs/24·36, `sync-prompt-citations` 102종 |
