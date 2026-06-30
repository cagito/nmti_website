# 문서간 충돌 잔여 수정계획 (DOC-CANON-02)

**수립:** 2026-06-30  
**입력:** DOC-CANON-01 완료 후 잔여 충돌 감사 · ATS-SUB-01 P1 픽셀 완료(005·012·013)  
**상위:** [208 DOC-CANON-01](./208-문서-정본-충돌-반경계획-DOC-CANON-01.md) · [206 ATS-SUB-01](./206-자동광파기-지하공사-전용-표현-통합-적용-계획.md) · [207 ATS Figure 큐](./207-ATS-SUB-01-Figure-재작도-큐.md)  
**목표:** `verify:local` 통과 **이후에도** 남은 **정본·프롬프트·자동동기화** 불일치를 제거해, 에이전트가 단일 지시로 Figure·문서를 따르게 한다.

---

## 0. DOC-CANON-01 대비 현황

| 구분 | ID | 내용 | 상태 |
|------|-----|------|------|
| 해소 | C1~C5 | Git 추적 · PASS/REGENERATE · 19·26 ARCHIVE · 건설중 | ✅ CI |
| **잔여 P0** | **ATS-56** | `docs/56` ATS 개념 아이콘 vs 206·prompt v5·registry | ✅ Phase A (2026-06-30) |
| **잔여 P1** | **SYNC-005** | IMG-005 `image-rules-sync` ← 건축공사(17) · 지표침하계 필수 vs 본문 금지 | ✅ map→31 · sync |
| **잔여 P1** | **ATS-P2** | 015·001·090 프롬프트·레지스트리 `(선택) ATS` | ⏳ |
| **잔여 P2** | **CANON-EXT** | `CANONICAL_STATUS`·validator 4종만 감시 | ✅ 7종 (005·012·013 추가) |
| **잔여 P2** | **DOC-NUM** | `docs/131`×3 · `docs/153`×2 번호 중복 | ⏳ |
| **잔여 P3** | **MISC** | 180 vs registry · deflection-gauge 103/104 · IMG-085 · book 사진 | ⏳ |

**DOC-CANON-02 한 줄:**

```text
픽셀·registry가 PASS여도, Figure 전용 표준(docs/56 등)·자동 sync 블록·구형 프롬프트가 신정책(206)과 어긋나면 문서를 먼저 맞춘다.
```

---

## 1. 판정 우선순위 (변경 없음 · 208 §5)

```text
1. registry reviewGrade + prompt CANONICAL_STATUS
2. docs/181 §IMG-###
3. docs/206 ATS-SUB-01 (127 강화) — 지상 Figure ATS 전면 금지
4. Figure 전용 표준 (52·54·56·57…) — 206과 충돌 시 206·본 계획 Phase A로 56 등 개정
5. image-knowledge / image-rules-sync — Figure 전용 표준 다음, 단 sync가 ③④와 충돌 시 sync 수정
6. docs/180 (큐만)
7. Tier C (19·26) — 역사
```

---

## 2. Phase A — ATS 정본 정합 (P0 · 1일)

**목표:** IMG-005가 인용하는 **P0 정본 `docs/56`** 이 206·209·registry v5와 일치.

| # | 작업 | 파일 | 산출 |
|---|------|------|------|
| A1 | §0 한 줄 — `(선택) ATS` 삭제 → **「ATS·시준선 금지(206)」** | `docs/56-IMG-005-…md` | §0·§1·§2 일관 |
| A2 | §1 강제 지시문 L29–30 **삭제** — 개념 아이콘·시준선 문단 전체 | 동일 | ATS 0건 |
| A3 | §2 표 — 「자동광파기 개념 아이콘」행 **제외**로 이동 | 동일 | 포함/제외 표 정합 |
| A4 | §3 이하 ATS·시준선 잔여 grep → 삭제 또는 「과거(ATS-SUB-01 이전)」각주 | 동일 | 0 match |
| A5 | [AGENTS.md](../AGENTS.md) IMG-005 — **「ATS 밖·프리즘만」→「ATS 없음 · 프리즘·경사·균열」** | AGENTS | |
| A6 | [131-기술자료-이미지-디자인-가이드](./131-기술자료-이미지-디자인-가이드.md) IMG-005 절 — 56 동기화 | 131 | |
| A7 | [image-knowledge/09](./image-knowledge/09-변위·광학계측-표현-기준.md) §8 — **「좌 굴착/교량 맥락」ATS 예시 삭제** · 042·지하만 | 09 | |
| A8 | [127](./127-변위계측-자동광파기-남용방지-및-와이어식-우선-표준.md) §2·§4 — 206 §1 표 **ATS-SUB-01 병합** ([128](./128-디자인-원칙-문서-통합-반영-실행계획.md) Phase B) | 127 | |
| A9 | [209](./209-ATS-SUB-01-P1-재생성-기록.md) §후속 — **완료 체크** | 209 | |

**검증 (수동):**

```bash
rg -n "자동광파기|시준선|Total Station" docs/56-IMG-005*.md
# → 0건 (206 인용·금지 설명 제외)
```

**Exit A:** `docs/56`·AGENTS·09·127이 206과 모순 없음 · IMG-005 prompt가 `P0 정본: docs/56` 인용 시 ATS 재도입 경로 없음.

---

## 3. Phase B — image-rules-sync 오염 제거 (P1 · 1일)

**근본 원인:** `scripts/img-image-knowledge-map.json` — `"IMG-005": "17-건축공사-계측-배치.md"`  
→ `sync-prompt-image-rules` 가 **굴착 인접건물** prompt에 **건축공사 일반 §5·§9(지표침하계)** 를 주입.

| # | 작업 | 산출 |
|---|------|------|
| B1 | **신규** `docs/image-knowledge/31-인접건물-굴착-계측-배치.md` — 목적=건물↔흙막이 · VIEW-01 · **지표침하 측점** · ATS 금지 · [56](./56-IMG-005-주변건물-균열경사-표현-표준.md) §5·§6 요약 | 주제 정본 |
| B2 | `img-image-knowledge-map.json` — `IMG-005` → `31-인접건물-굴착-계측-배치.md` | 매핑 |
| B3 | `npm run sync:prompt-image-rules` — IMG-005 `image-rules-sync` 재생성 | prompt |
| B4 | IMG-005 prompt — `image-knowledge-links` 에 18 추가 · 17은 **참고(건축 본체)** 로 격하 | prompt |
| B5 | **선택:** `sync-prompt-image-rules.mjs` — `FIGURE_RULES_OVERRIDE.json` (IMG-ID → topic 또는 skip) 스키마 도입 · 재발 방지 | 스크립트 |

**Exit B:** IMG-005 prompt `image-rules-sync` 에 **`지표침하계` 필수 라벨 없음** · `지표침하 측점`·ATS 금지 명시.

---

## 4. Phase C — ATS-SUB-01 P2 (P1 · 2~3일)

**상위:** [207 §P2](./207-ATS-SUB-01-Figure-재작도-큐.md) · Phase A 완료 후 프롬프트 정본 선행.

| IMG | 노드 | 문서 작업 | 픽셀 |
|-----|------|-----------|------|
| **015** | `fields/slope` | prompt §7–8 **(선택) ATS inset·시준선 삭제** · redline | ATS 패널 제거 |
| **001** | `retaining-excavation` | callout ATS 감사 · [51 §2.4](./51-계측-도면-검수-공통-원칙.md) | 필요 시 vN |
| **090** | `slope/structural-displacement` | prompt · redline v4 · `02_CURSOR_WORK_INSTRUCTION` · `10_DICTIONARY` — **와이어·프리즘만** | REGENERATE |

| # | 작업 |
|---|------|
| C1 | 위 3종 redline `ATS-SUB-01` 체크리스트 행 |
| C2 | `npm run lock:acquire -- full` → 생성 → `register:figure` |
| C3 | `docs/211-ATS-SUB-01-P2-재생성-기록.md` (또는 207 표 갱신) |
| C4 | `validate:ats-scope:strict` · `audit:images:strict` |

**Exit C:** 207 P2 전부 ✅ · 지상 분야 prompt grep `자동광파기` = 042 노드·지하 허용 맥락만.

---

## 5. Phase D — CANONICAL_STATUS 확대 (P2 · 1~2일)

**문제:** `validate-figure-status` 감시 = **002·004·016·096** 만 → 005·012·013 PASS 후 prompt·redline 회귀 미탐지.

| # | 작업 |
|---|------|
| D1 | `scripts/validate-figure-status-consistency.mjs` — **WATCH** 에 005·012·013·024·035·096·011 등 [180](./180-technology-이미지-전수-재검수-수정계획.md) S0 완료 ID 추가 (우선 8~12종) |
| D2 | 해당 prompt 상단 **CANONICAL_STATUS** 블록 템플릿 ([208 §2](./208-문서-정본-충돌-반경계획-DOC-CANON-01.md)) 일괄 삽입 |
| D3 | redline `판정: REGENERATE` + registry PASS → **FAIL** (기존 로직 확대) |
| D4 | `verify:local` — `validate:figure-status:strict` 유지 |

**Exit D:** WATCH 목록 0 errors · S0 완료 Figure는 prompt 최상단 PASS 명시.

---

## 6. Phase E — 문서 번호·색인 (P2 · 0.5일)

| 충돌 | 조치 |
|------|------|
| **131×3** | [CANONICAL_DOC_INDEX](./CANONICAL_DOC_INDEX.md) §「131 역할 구분」표 추가 — P0 공통 / 디자인가이드 / 재검수 체크포인트 |
| **153×2** | `153-IMG-109-…` → **`154-IMG-109-…` 리네임** (또는 153은 용어만·109는 45번대로 이관) · 링크 일괄 치환 · `validate:doc-links` |
| **180 vs registry** | 180 상단 각주: **「완료 판정 = registry · 개별 18x 기록」** · S0 표 주기적 ✅ 갱신 (수동) |

**Exit E:** `validate:doc-links:strict` 0 broken · 131·153 링크 혼동 제거.

---

## 7. Phase F — 저우선 정리 (P3 · 병행)

| ID | 작업 | 담당 |
|----|------|------|
| **MISC-103** | `sensors/deflection-gauge` 본문 IMG-103 → **104** 또는 hero 교체 — [image-doc-mismatch](./image-doc-mismatch-report.md) | content-data |
| **MISC-085** | IMG-085 WebP 등록 또는 hero placeholder 정책 | registry |
| **BOOK-EJ** | `book/신축이음계 설치사진1~4.png` — [image-knowledge/23](./image-knowledge/23-신축·변위계-구조부재.md) **참고 사진 인덱스** · IMG-014·039 prompt 근거 링크 (gitignore 유지) | image-knowledge |
| **TIER-C** | docs/19·26 — 본문 첫 50줄 외 **「과거 판정」** 접기 또는 `validate-archive-banner.mjs` (배너 없으면 FAIL) | docs |

---

## 8. Phase G — CI 방어 강화 (P2 · 1일 · Phase A·B 후)

| # | 스크립트 | 내용 |
|---|----------|------|
| G1 | `validate-prompt-rules-consistency.mjs` **신규** | Figure 전용 표준(56·54…) 금지어가 동일 IMG `image-rules-sync` **필수**에 있으면 FAIL |
| G2 | `validate-ats-scope.mjs` **확장** | ImageWorks `prompts/IMG-005·012·013·015·090·101` — `자동광파기` 허용 패턴 외 FAIL |
| G3 | `validate-doc-ats-policy.mjs` **신규(선택)** | `docs/56`·Figure 표준 md — DENY 노드 맥락에서 ATS **필수** 문구 탐지 |
| G4 | `verify:local` 편입 | G1·G2 strict (G3는 경고 후 strict) |

---

## 9. 우선순위·일정

| 순위 | Phase | 충돌 ID | 예상 | 선행 |
|:--:|-------|---------|------|------|
| **1** | **A** | ATS-56 | 1일 | — |
| **2** | **B** | SYNC-005 | 1일 | A1~A4 (56 정본) |
| **3** | **C** | ATS-P2 | 2~3일 | A (프롬프트 정본) |
| **4** | **D** | CANON-EXT | 1~2일 | — |
| **5** | **E** | DOC-NUM | 0.5일 | — |
| **6** | **G** | CI | 1일 | A·B |
| **7** | **F** | MISC | 병행 | — |

**병행 가능:** D ↔ A · F ↔ 전 Phase · E ↔ D

---

## 10. 프로그램 Exit (DOC-CANON-02)

| 게이트 | 기준 |
|--------|------|
| **ATS-56** | `docs/56`·AGENTS·09·127 — 206 모순 0 |
| **SYNC-005** | IMG-005 `image-rules-sync` — 지표침하계 필수 없음 · map→topic 18 |
| **ATS-P2** | 207 P2 ✅ · `validate:ats-scope:strict` |
| **CANON-EXT** | WATCH ≥8 · `validate:figure-status:strict` 0 |
| **DOC-NUM** | 153 중복 해소 · CANONICAL_INDEX 131 표 |
| **운영** | `verify:local` · `verify:production` 유지 |

---

## 11. 리스크

| 리스크 | 대응 |
|--------|------|
| `sync:prompt-image-rules` 재실행 시 005 재오염 | map 18 고정 + G1 validator |
| 56 개정 후 구형 redline v2 | redline `superseded` · prompt가 v5·56 개정일 명시 |
| 153 리네임 링크 대량 깨짐 | `validate:doc-links` 선행 · 한 커밋에 치환+검증 |
| multi-Cursor registry 충돌 | Phase C·D 전 `npm run lock:status` · [98](./98-다중-Cursor-동시작업-충돌방지.md) |

---

## 12. 즉시 다음 액션 (승인 시)

1. **Phase A** — `docs/56` §0·§1·§2 ATS 삭제 (픽셀 재작도 **불필요** — v5 유지)  
2. **Phase B** — `image-knowledge/18` 신규 + map 변경 + `sync:prompt-image-rules`  
3. IMG-005 prompt — **CANONICAL_STATUS** + ATS-SUB-01 블록 통합 (Phase D 선행 1건)  
4. **Phase C** — 207 P2 착수 (015 → 090 → 001)  
5. `CANONICAL_DOC_INDEX` · `AGENTS.md` — 본 계획(210) 링크

---

## 13. 연계

- [208 DOC-CANON-01](./208-문서-정본-충돌-반경계획-DOC-CANON-01.md) — C1~C5 완료
- [209 ATS P1 기록](./209-ATS-SUB-01-P1-재생성-기록.md)
- [206 ATS-SUB-01](./206-자동광파기-지하공사-전용-표현-통합-적용-계획.md)
- [207 Figure 큐](./207-ATS-SUB-01-Figure-재작도-큐.md)
- [128 디자인 원칙 통합](./128-디자인-원칙-문서-통합-반영-실행계획.md)
- [CANONICAL_DOC_INDEX](./CANONICAL_DOC_INDEX.md)
