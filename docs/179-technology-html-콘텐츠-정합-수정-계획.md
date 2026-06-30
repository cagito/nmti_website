# technology HTML 콘텐츠 정합 수정 계획 (179)

**수립:** 2026-06-30  
**근거:** 외부 HTML 감사 (`technology_html_wrong_content_audit`) · [59 MOD-01](./59-계측-운영-모드-구조-환경-AI-표현-표준.md) · [68 BRI-DEF](./68-교량-처짐-계측-표현-표준.md) · [148 IMG-103](./148-IMG-103-교량-상부구조-GNSS-처짐-표현-표준.md) · [book/KDS-KCS_용어기준.md](../book/KDS-KCS_용어기준.md)

> **한 줄:** SEO HTML 126개는 `scripts/content-data/*.mjs` 정본에서 생성된다. **nodeId·URL은 유지**하고, 본문·분류·필수 문구를 KDS/KCS + repo 표준에 맞게 전면 정렬한다.

---

## 0. 작업 경로 (단일 정본)

```text
scripts/content-data/*.mjs
  → node scripts/build-content-data.mjs   → js/technology/content-data.js
  → node scripts/generate-technology-seo-pages.mjs → technology/**/index.html
  → npm run validate:terminology · validate:citations · verify:local
```

**직접 `technology/**/*.html` 수동 편집 금지** — 재빌드 시 덮어씀.

| 레이어 | 파일 |
|--------|------|
| 계측 방식 | `scripts/content-data/instruments.mjs` |
| 교량·사면·댐 | `leaves-part2.mjs` · `leaves-part3.mjs` · `categories.mjs` |
| 센서 | `sensors.mjs` |
| 메뉴·라벨 | `js/technology/dictionary.js` (label만, **nodeId 변경 금지**) |
| Figure 매핑 | `sectionImages` · `image-review-registry.json` |

---

## 1. 용어·분류 정본 (전 Phase 공통)

### 1.1 3층 구조 (KDS/KCS vs NMTI)

**금지 (P0):** `수동 → 자동 → 원격 → 스마트 → AI` 를 KCS **계측방식 등급·진화 단계**처럼 단독 표기.

**정본 블록** — 모든 `instruments/modes/*` 상단에 공통 삽입:

```text
[데이터 수집방법 — KDS/KCS]
  수동계측 / 반자동계측 / 자동계측

[데이터 전송방법]
  유선 / 무선 / 유·무선 병행

[NMTI 운영 확장 계층 — 법정 계측방식 분류 아님]
  원격 자동계측 / 스마트 계측 / AI 보조 분석

[운영 모드 — 런타임]
  normal-mode / realtime-mode / alarm-status
```

**근거:** [59 §1 MOD-01](./59-계측-운영-모드-구조-환경-AI-표현-표준.md) · KCS 24 99 05 계측 빈도·자동계측 전환.

### 1.2 자동계측 정의 (교체 문구)

```text
자동계측은 센서 데이터를 설정 주기로 자동 수집·저장하고,
필요 시 유선·무선 통신을 통해 서버로 전송하여
표출·경보·보고 체계와 연계하는 운용방식이다.
```

로컬 로거만 강조하는 문장은 **「로컬 자동 수집」** 소절로 격하.

### 1.3 금지·필수 문구 레지스트리

`scripts/data/content-forbidden-phrases.json` (신규) + `scripts/validate-content-phrases.mjs` (신규):

| id | 금지 패턴 | 대체 |
|----|-----------|------|
| MOD-01 | `수동→자동→원격→스마트→AI` 단독 등급 | §1.1 3층 블록 |
| MOD-02 | `AI 계측 방식` (KCS식) | `AI 보조 분석` |
| SLO-01 | `활동면 확정` · `최대변위 심도=활동면` | `활동면 추정 후보` |
| BRI-01 | bridge/deflection 본문에 LVDT·와이어 hero 혼합 | GNSS(103) 전용 |
| BRI-02 | `1/4 span` (IMG-103 노드) | `경간 중앙 1점` |
| DAM-01 | filter tip = 침윤선 | §4.4 블록 |
| DAM-02 | 침하 그래프 방향 미명시 | §4.4 블록 |

CI: `npm run validate:content-phrases` → `verify:local`에 편입 (Phase 5).

---

## 2. Phase A — P0 계측방식·운영모드 (7노드) ✅

**상태:** 2026-06-30 완료 · `validate:content-phrases` MOD-01~02 PASS

**목표:** KCS 계측방식과 NMTI 운영 계층 혼동 제거.

| nodeId | 파일 | 작업 |
|--------|------|------|
| `instruments/modes/overview` | `instruments.mjs` | tagline·overview·principle·data 표 전면 교체. IMG-075 캡션에 「운영 계층」 명시 |
| `instruments/modes/automatic` | 동일 | §1.2 자동계측 정의. 로거=필수 구성 **중 하나**로 격하 |
| `instruments/modes/remote-automatic` | 동일 | 「전송·서버」 계층 강조, KCS 자동계측 **포함** 관계 |
| `instruments/modes/smart` | 동일 | 「KCS 공식 계측방식 아님」 박스. 경보·보고 **운영** |
| `instruments/modes/ai` | 동일 | 「계측방식」→「AI 보조 분석」. HITL·법정기준 비대체 강조 |
| `instruments/modes/realtime-mode` | 동일 | 「모든 이벤트=수십~수백 Hz」 삭제 → **이벤트 유형별 rate 표** (발파/급변/명령). normal 대비 **운영 모드** |
| `instruments/modes/manual` | 동일 | KCS 수동계측 빈도 기준 유지, 5단계 화살표 **미포함** 확인 |

**선행 Figure 검수:** IMG-070~075 · 094~095 — 본문과 캡션 정합 ([59](./59-계측-운영-모드-구조-환경-AI-표현-표준.md)).

**완료 기준:**
- overview `data.rows`에 「KCS 수집」「전송」「NMTI 확장」 3그룹
- `validate:content-phrases` MOD-01~02 PASS
- `npm run build:seo` 후 7 URL spot-check

**예상:** 1~2일

---

## 3. Phase B — P0/P1 교량 처짐·GNSS 분리 ✅

**상태:** 2026-06-30 완료 · BRI-01·02 node validator PASS

**문제:** `fields/bridge/deflection` = **IMG-103 GNSS hero** ([148](./148-IMG-103-교량-상부구조-GNSS-처짐-표현-표준.md)) 인데 본문이 일반 처짐계 혼합.

**원칙:** **nodeId·URL 유지** — `fields/bridge/deflection` 내용을 **GNSS 처짐 전용**으로 한정.

| 대상 | 변경 |
|------|------|
| `leaves-part2.mjs` → `fields/bridge/deflection` | overview/principle/installation에서 LVDT·와이어·1/4 span **삭제**. DEF-GNSS-01~06·ΔZ→δ·기준국 영향권 밖 |
| `sensors.mjs` → `sensors/deflection-gauge` | LVDT·와이어·LVDT·광파 **일반 접촉식 처짐** 확장. GNSS와 **역할 분리** 표 추가 |
| `categories.mjs` → `fields/bridge` | purpose·installation에 **부재 위치×물리량×센서** 표 (§5). 센서 나열 → 매핑 표 |
| `dictionary.js` | label 유지 「처짐」. tagline/SEO description만 GNSS+일반 링크 구분 (선택) |

**필수 설치 문구 (deflection 노드):**

```text
경간 = 교각 중심선 ↔ 교각 중심선
GNSS 이동국 = 경간 중앙 상부 1개
처짐량 δ = 수직변위 ΔZ
1/4·3/4 경간 이동국 금지
하부 와이어식 처짐계 금지 (상세 → 처짐계 센서 페이지)
```

**완료 기준:** BRI-01·BRI-02 forbidden PASS · IMG-103 hero와 본문 1:1 · IMG-104는 deflection-gauge만

**예상:** 1일

---

## 4. Phase C — P0 사면 활동면 ✅

**상태:** 2026-06-30 완료 · SLO-01 PASS

| nodeId | 파일 | 작업 |
|--------|------|------|
| `fields/slope/slip-surface` | `leaves-part3.mjs` | overview·purpose·principle·data·faq **「추정·후보」** 톤. 금지어 SLO-01 |

**교체 overview 핵심:**

```text
지중경사계(IPI) 프로파일의 전단변형 집중 구간은 활동면 추정 후보일 뿐이다.
활동면은 지질·지하수위·간극수압·균열·침하·지표변위·현장관찰을 종합해 추정한다.
```

**constructionPhases:** 「설계 가정 검증」→「추정 정교화」.

**완료 기준:** SLO-01 PASS · IMG-016/017 캡션과 일치

**예상:** 0.5일

---

## 5. Phase D — P1 댐·제방 재발 방지 ✅ (핵심 4노드)

**상태:** 2026-06-30 완료 · hub + pore-pressure/settlement/leakage

| nodeId | 추가 블록 |
|--------|-----------|
| `fields/dam` (`categories.mjs`) | filter tip / piezometric head / 침윤선 3줄 정의 |
| `fields/dam/pore-pressure` | filter tip = 간극수압 측정 지점 · G.W.L ≠ piezo |
| `fields/dam/settlement` | 침하량 증가=관리단계 상향 · **그래프 축 방향** 주의 |
| `fields/dam/leakage` | 하류 배수층·집수부·측수로 · 점센서 박힘 금지 |

**공통 `criteria` 블록 (dam 4노드):** DAM-01·DAM-02 필수 문구.

**완료 기준:** forbidden DAM-* PASS · [image-knowledge 댐](../docs/image-knowledge/) 교차 링크

**예상:** 1일

---

## 6. Phase E — P1 교량 허브·센서 보강 ✅

**상태:** 2026-06-30 완료 · bridge 매핑 표 · deflection-gauge GNSS vs 접촉식 표

| nodeId | 작업 |
|--------|------|
| `fields/bridge` | **부재×위치×물리량×센서** 표 (교각/교대/거더/케이블/받침/기초). 10종 나열 → 매핑 |
| `sensors/deflection-gauge` | GNSS vs 접촉식 **비교 표** · mid-span vs 경간 중앙 GNSS 구분 |

**표 골격 (bridge/index):**

| 부재 | 위치 | 물리량 | 대표 센서 | nodeId |
|------|------|--------|-----------|--------|
| 거더 | 경간 중앙 상부 | 처짐 δ(ΔZ) | GNSS | bridge/deflection |
| 거더 | 하부·기준대 | 처짐 δ | 와이어·LVDT | deflection-gauge |
| … | … | … | … | … |

**예상:** 0.5~1일

---

## 7. Phase F — 검증·출판 ✅ (CI 편입)

1. `scripts/validate-content-phrases.mjs` — forbidden·required 스캔 ✅
2. `scripts/validate-content-audit-spotcheck.mjs` — 부록 A SEO HTML 14페이지 ✅
3. `verify:local` · `verify:content`에 위 2종 편입 ✅
2. `npm run validate:terminology` · `validate:citations`
3. `npm run build:content` · `build:seo` · `sitemap`
4. `npm run verify:local`
5. 감사 14 URL **수동 spot-check** 체크리스트 (부록 A)

**AGENTS.md** §git-sync 아래 「콘텐츠 수정 후 빌드」와 링크.

---

## 8. 우선순위·일정 요약

| Phase | P | 노드 수 | 일정 | 선행 |
|-------|---|---------|------|------|
| **A** | P0 | 7 | 1~2d | — |
| **B** | P0/P1 | 3~4 | 1d | A (용어 블록) |
| **C** | P0 | 1 | 0.5d | — |
| **D** | P1 | 5 | 1d | — |
| **E** | P1 | 2 | 1d | B |
| **F** | — | — | 0.5d | A~E |

**총:** 약 **5~6일** (Figure 재검수 병행 시 +2d)

---

## 9. Figure·프롬프트 연계 ✅ (2026-06-30)

| Figure | 연계 Phase | 조치 | 상태 |
|--------|------------|------|------|
| IMG-075 | A | 3층 분류 캡션·프롬프트 v3 · `requiresReaudit` 없음(캡션 정합) | ✅ 캡션 · pixel REGENERATE 권장 |
| IMG-071~074 | A | registry caption · content `sectionImages` | ✅ |
| IMG-103/104 | B | GNSS vs LVDT caption | ✅ |
| IMG-016/017 | C | 「추정 후보」 캡션 | ✅ |
| IMG-024 | D | DAM prohibitedErrors 유지 | ✅ (기존 v4) |

`npm run patch:registry-figure-captions-179` · `validate:figure-captions-179` · `sync:images` · `build:content` · `build:seo`

---

## 10. 위험·제약

| 항목 | 대응 |
|------|------|
| **nodeId 변경** | 금지 — SEO·인용·Figure 매핑 유지 |
| **docs/* gitignore** | `179` 등 계획 문서는 추적 중 — 실행 보고는 `docs/` 또는 PR 설명 |
| **다중 Cursor** | `content-data` 편집 시 `lock:acquire -- build` |
| **RaiDrive** | 로컬 편집 → commit → push 후 SEO 재생성 |

---

## 부록 A — 감사 URL spot-check (14) ✅

`npm run validate:content-audit` — `scripts/data/content-audit-spotcheck.json` · SEO HTML 14페이지 자동 검증

- [x] `instruments/modes/overview`
- [x] `instruments/modes/automatic`
- [x] `instruments/modes/manual`
- [x] `instruments/modes/ai`
- [x] `instruments/modes/smart`
- [x] `instruments/modes/realtime-mode`
- [x] `fields/bridge/deflection`
- [x] `fields/slope/slip-surface`
- [x] `fields/dam` · `settlement` · `leakage` · `pore-pressure`
- [x] `fields/bridge`
- [x] `sensors/deflection-gauge`

---

## 부록 B — 즉시 교체 diff 요약 (Phase A overview)

| 필드 | 현재 (오류) | 목표 |
|------|-------------|------|
| tagline | `수동→자동→… 5단계 계층` | `수집·전송·운영 확장·런타임 모드` |
| principle | 5단계 화살표 | §1.1 3층 + normal/realtime/alarm |
| data.rows | 5단계 단일 표 | 3그룹 표 + 운영 모드 링크 |

---

**Exit:** `validate:content-phrases` · `validate:content-audit` PASS · Phase A~E · `build:all` · `verify:local`
