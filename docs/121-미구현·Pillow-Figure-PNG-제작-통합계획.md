# 미구현·Pillow Figure — PNG 제작 통합 계획

**수립:** 2026-06-26  
**상태:** 제작자 실행 대기 (`source/` PNG **0건**)  
**정본 연계:** [122 허접 Figure 수정계획](./122-Pillow-와이어프레임-Figure-출판품질-통합-수정계획.md) · [120 미구현 통합](./120-미구현-통합-구현계획.md) · [108 마스터](./108-PNG-재작도-제작자-마스터-인덱스.md) · [119 Handoff](./119-PNG-재작도-프로그램-운영-Handoff.md) · [89 작업순서](./89-PNG-재작도-통합-작업순서.md)

> **한 줄:** 사이트에는 WebP **109/109**가 노출 중이나, **배포 게이트**는 **43건 재작도 PNG**가 막고 있다. FT-A/B는 **Pillow·에이전트 SVG 전면 금지** — ImageWorks 프롬프트 + redline + **인간 검수 AI/CAD PNG**만 허용.

---

## 0. 현황 스냅샷 (2026-06-26)

| 구분 | 건수 | 설명 |
|------|------|------|
| 활성 Figure (registry) | 110 | IMG-085 `DELETE` (IMG-110 대체) |
| 운영 WebP | 109/109 | 파일 누락 없음 — **「미구현」≠ 파일 없음** |
| 재작도 프로그램 대상 | **69** | W1~W11 `rework-phases.mjs` |
| `requiresReaudit` (배포 차단) | **43** | 구 PNG 유지·신규 PNG+서명 필요 |
| 프로그램 내 서명 완료 | **25** | `reaudit` 해제 + `visualReview` PASS + `prohibitedVerified` |
| `source/` canonical PNG | **0** | 제작자 산출물 미등록 |
| registry `productionMethod: pillow` | **44** | FT-C 다수 · 재작도 대상 24건 포함 |
| policy `pillow → ai-reviewed` 목표 | **13** | FT-C 업그레이드 권장 |
| FT-A/B 현행 pillow | **0** | 표시는 ai-reviewed · **구 산출은 Python 이력** |

**배포 게이트:** `npm run verify:local` — reaudit **0** 필수  
**재작도 중 일상:** `npm run verify:content` — reaudit WARN 허용

---

## 1. 「미구현」의 세 가지 의미

혼동을 막기 위해 용어를 분리한다.

| 유형 | 의미 | 대응 | 에이전트 |
|------|------|------|----------|
| **A. 재작도 대기** | WebP는 있으나 `requiresReaudit: true` — 외부 감사·ZIP 오류로 **교체 필수** | W1~W9 우선 · `rework:done` | PNG 생성 **불가** |
| **B. Pillow 잔존** | registry `productionMethod: pillow` 또는 `render-*.py` 이력 — **출판·정책상 교체 권장** | W3~W11 · FT-C는 유지 선택 가능 | Pillow 재실행 **금지** |
| **C. 최초 ai-reviewed** | registry PASS이나 실제는 Sprint0 Pillow·1-shot — **품질 미달 hero** | W3 B(089~091) · W10 D(092·093·064·084) | 프롬프트·redline만 |

**별도 완료:** IMG-061 천단침하 — v2 PASS (`docs/50`) · 재작도 프로그램 **미포함**

**코드·콘텐츠 미구현** (PNG와 무관): **없음** — Track T·H·H2 ✅

---

## 2. Python(Pillow) Figure — 정책·분류

### 2.1 절대 규칙

| Tier | 허용 제작 | 금지 |
|------|-----------|------|
| **FT-A** 단면·설치 CAD | `cad` · `ai-reviewed` | Pillow · agent-svg · one-shot-ai |
| **FT-B** 복합 개념도 | `cad` · `ai-reviewed` | 동일 |
| **FT-C** 블록·흐름·UI | `pillow` **유지 가능** · `ai-reviewed` 권장 | agent-svg |

- `scripts/lib/*_draw.py` · `render-*.py` **FT-A/B 재실행 금지** (`.cursor/rules/no-pillow-section-figures.mdc`)
- 정본: `scripts/figure-production-policy.json` · `npm run audit:figure-production`

### 2.2 Pillow 산출물 분류 (44건)

#### (1) 재작도 필수 — pillow + `requiresReaudit` (24건)

외부 ZIP·감사 오류. **ai-reviewed PNG**로 교체 후 서명.

| Phase | ID |
|-------|-----|
| W2 AA | 018 |
| W5~7 AB | 029 · 044 · 045 · 046 |
| W8 AC | 059 |
| W9 AD | 047 · 048 · 049 · 050 · 051 · 052 · 053 · 054 · 055 · 056 |

#### (2) Pillow 유지 — reaudit 없음 (20건)

출판 게이트 PASS. **W11에서 선택적 ai-reviewed 전환**만 검토.

| 그룹 | ID | 비고 |
|------|-----|------|
| 로거·통신 UI | 006 · 058 · 065~069 · 072~074 | FT-C 블록 |
| 운영 모드 | 070 · 071 · 075 · 076 · 077 | `render-modes-figures.py` |
| 신규 콘텐츠 블록 | 103~110 | strain-stress 등 leaf 보조 |
| W11 선택 | 094 · 095 · 102 | hero — **ai-reviewed 권장** |

#### (3) Python 이력·표시 ai-reviewed — 실질 교체 대상 (45건+)

registry는 `ai-reviewed`이나 `renderScript`가 남아 있거나 Sprint0 Pillow 출신. **재작도 69건 전체**가 이 범주에 해당.

대표 `renderScript` 매핑:

| 스크립트 | 대표 ID | Tier |
|----------|---------|------|
| `render-retaining-audit-fixes.py` | 002 · 004 | FT-A |
| `render-inclinometer-ground.py` | 027 · 096 | FT-A |
| `render-p1-blockers.py` | 001 · 015 · 043 | FT-A/B |
| `render-img008-tunnel-convergence.py` | 008 | FT-B |
| `render-phase5-sensors.py` | 025 · 030 · 031 · 034 · 035 | FT-A/B |
| `render-sprint0-figures.py` | 089 · 090 · 091 · 092 · 094 · 095 · 102 | FT-A/C |
| `render-p3-platform.py` | 045 · 048 · 056 · 058 | FT-C |
| `render-dam-audit-fixes.py` | 024 | FT-A |
| `render-field-heroes.py` | 080 · 081 · 084 | FT-B |

---

## 3. 제작 방식 결정표

| 조건 | 제작 방식 | 검수 |
|------|-----------|------|
| FT-A/B 단면·설치·복합 | **AI + redline** 또는 **CAD** | INSTRUMENTATION · P0(지표면·로거) · IMAGE_AUDIT §5.1 |
| FT-C 블록·흐름 (유지) | Pillow **재렌더 금지** — 현행 WebP 유지 또는 ai-reviewed 전환 | visualReview V1·V4 |
| hero + 외부 감사 REGENERATE | **ai-reviewed 필수** | redline v2+ · 퀵스타트 |
| MPBX·GNSS·지중경사계 | 전용 ImageWorks 가이드 | CLS-01 · AUTO-01 |

**공통 산출 규격**

- PNG ≥ **1920×1080**
- 경로: `assets/images/technology/source/<canonical>.png` → `rework:done` → WebP 자동 변환
- 파일명: [118 canonical](./118-PNG-canonical-파일명-W1-W11-정본.md) · `npm run rework:canonical -- --id IMG-###`

---

## 4. 주차별 PNG 제작 일정 (권장)

### 4.1 개요

| Sprint | 주차 | Phase | 건수 | reaudit | 목표 | 예상 공수 |
|--------|------|-------|------|---------|------|-----------|
| **S1** | W1 | A | 3 | 3 | hero 흙막이·주변지반·앵커 | **1주** |
| **S2** | W2 | AA | 10 | 10 | 사면·지하수 ZIP REGENERATE | 2주 |
| **S3** | W3 | B | 4 | 1* | 댐 hero + 사면 hero 3건 **최초 ai-reviewed** | 1.5주 |
| **S4** | W4 | C | 5 | 0† | 터널·사면 ZIP — 서명·정합 | 1주 |
| **S5** | W5~7 | AB | 10 | 10 | 터널·변위·플랫폼 MAJOR | 2~3주 |
| **S6** | W8 | AC | 10 | 10 | 터널·댐·철도·숏크리트 ZIP 4차 | 3~4주 |
| **S7** | W9 | AD | 10 | 10 | 전원·경보·그래프 Pillow→ai | 2주 |
| **S8** | W10 | D | 14 | 0‡ | 항만·기초·환경 hero + 운영 블록 | 2~3주 |
| **S9** | W11 | E | 3 | 0 | 094·095·102 Pillow **또는** ai | 0.5주 |

\* 089·090·091은 reaudit 플래그 없음 — **출판 품질·redline v2** 기준으로 신규 PNG  
† Phase C: ZIP 교체 완료분 — PNG 재확인·서명 위주  
‡ W10: `patch:registry-phase-d` 선행 시 14건 reaudit 전환 가능 — [120 §2.2](./120-미구현-통합-구현계획.md)

**전체:** 약 **11~14주** (제작자 1인·주 5~7 Figure 가정)

### 4.2 S1 — 최우선 P0 (즉시 착수)

| 순서 | ID | 노드·역할 | redline | 퀵스타트 | 핵심 금지 |
|------|-----|-----------|---------|----------|-----------|
| 1 | **IMG-002** | `earth-retaining-wall` hero | v5 | [96](./96-W1-IMG-002-PNG-제작자-퀵스타트.md) | ANC-CLOCK · 침하핀≠지표침하계 · ②③ 이형 |
| 2 | **IMG-096** | `surrounding-ground` hero | v4 | [100](./100-W1-IMG-096-PNG-제작자-퀵스타트.md) | 옹벽·Sand Mat 삭제 · SETTLE-01 |
| 3 | **IMG-004** | `anchor` installation | v2 | [101](./101-W1-IMG-004-PNG-제작자-퀵스타트.md) | LC=굴착측 두부 · 사선 동축 |

**Exit:** `npm run rework:sign -- --phase A` → reaudit 3건 해제 → hero 3페이지 육안

### 4.3 Hero 우선 (reaudit 14건)

재작도 중 **사이트 첫 화면** 영향이 큰 ID:

`002` · `004` · `024` · `025` · `027` · `030` · `031` · `035` · `038` · `042` · `045` · `048` · `079` · `096`

→ S1~S2·S5·S6에서 앞당김 유지.

### 4.4 W3 — 「미구현 hero」집중 (089~091)

| ID | 노드 | 현황 | 작업 |
|----|------|------|------|
| 089 | `slope/surface-tilt` | Sprint0 Pillow · notes「redline v2 미검수」 | FT-A ai-reviewed 신규 |
| 090 | `slope/structure-displacement` | 동일 | 동일 |
| 091 | `sensors/borehole-extensometer` | MPBX ≠ 지중경사계 | [36 §4.5⑨](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) |
| 024 | `fields/dam` hero | reaudit · ZIP 4차 | [39](./39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md) |

### 4.5 W10 — 대형 인프라·신규 leaf hero

| ID | 노드 | 비고 |
|----|------|------|
| 064 | `harbor` hero | 항만 개념도 REGENERATE |
| 084 | `caisson` | 케이슨 |
| 092 | `foundation-pile` | 기초말뚝 |
| 093 | `environmental-impact` | 환경 |
| 097 | `blast-vibration` | 발파진동 (PASS v1 — 품질 재확인) |

### 4.6 W11 — Pillow 유지 vs 전환 (결정 필요)

| ID | 노드 | 옵션 A | 옵션 B |
|----|------|--------|--------|
| 094 | `structural-safety` | Pillow 유지 + `sign:phase-e` | ai-reviewed 블록 다이어그램 |
| 095 | (환경 운영) | 동일 | 동일 |
| 102 | `alarm-status` | 동일 | 경보 흐름 ai-reviewed 권장 |

**권장:** hidden·운영 모드 hero 3건은 **ai-reviewed**로 통일 — 계측관리계획서 삽입 품질 일관성.

---

## 5. 제작자 워크플로 (반복)

```powershell
# 0. 사전 점검
npm run rework:check
npm run rework:handoff

# 1. 작업 선정
npm run rework:next
# 또는
npm run rework:w1
npm run rework:prompt -- --id IMG-002

# 2. 외부 AI/CAD 제작 (에이전트·Pillow 금지)
#    - ImageWorks prompts/IMG-###_*.md
#    - redline 체크리스트 전항 PASS
#    - docs/36 §1.0 P0 블록 선행

# 3. 등록
npm run rework:canonical -- --id IMG-002
npm run rework:preflight -- --id IMG-002 --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.png
npm run rework:done -- --id IMG-002 `
  --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.png `
  --reviewer "검수자"

# 4. 검증
npm run verify:content          # 일상
npm run build:images
npm run audit:images:rework     # reaudit 추적

# 5. Phase 완료
npm run rework:sign -- --phase A
npm run verify:local            # 배포 전 — reaudit 0
```

**일괄 프롬프트:** `npm run rework:export-prompts` → `exports/rework-prompts/`

---

## 6. Figure별 체크리스트 (제작 시)

모든 FT-A/B PNG는 다음을 **제작 전** 확인:

1. [docs/36 §1.0 P0](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) — 지표면·수직관로·데이터로거 함체  
2. [INSTRUMENTATION_DRAWING_RULES](./INSTRUMENTATION_DRAWING_RULES.md) — 센서 클래스·라벨 전칭  
3. [IMAGE_AUDIT_CHECKLIST](./IMAGE_AUDIT_CHECKLIST.md) — 기술·출판 게이트  
4. Figure 전용 redline — `ImageWorks/.../redlines/IMG-###_redline_v*_외부PNG.md`  
5. `prohibitedErrors` registry 항목 — 재발 0건  

**금지 재확인:** 에이전트 GenerateImage · Cursor 내 PNG · `render-*.py` 재실행

---

## 7. 완료 정의 (Exit)

| 게이트 | 조건 |
|--------|------|
| 재작도 프로그램 | 69건 중 서명 완료 **69** (`rework:handoff` pending 0) |
| Registry | `requiresReaudit` **0** |
| CI | `npm run verify:local` **PASS** |
| 운영 | `npm run verify:production` 28/28 유지 |
| 문서 | `IMAGE_REVIEW_LOG` · registry `notes` 동기화 |

**중간 마일스톤**

| 마일스톤 | 조건 | 효과 |
|----------|------|------|
| M1 | W1 Phase A | reaudit 43→40 · 흙막이 3 hero 교체 |
| M2 | W2+W3 | reaudit ~29 · 사면·댐 hero |
| M3 | W8+W9 | reaudit ~9 · ZIP 4~5차 클리어 |
| M4 | W10+W11 | 프로그램 Exit · 배포 가능 |

---

## 8. 역할 분담

| 역할 | 담당 | 산출물 |
|------|------|--------|
| **제작자** | 인간 엔지니어·CAD·외부 AI | PNG · redline 서명 |
| **검수자** | 기술·출판 QA | `reviewer` · visualReview PASS |
| **에이전트** | 코드·문서·CLI | 프롬프트 export · registry · **PNG 생성 불가** |
| **배포** | 운영 | FTP 후 `verify:production` |

---

## 9. 관련 문서 인덱스

| 문서 | 용도 |
|------|------|
| [108](./108-PNG-재작도-제작자-마스터-인덱스.md) | 주차별 퀵스타트 |
| [89](./89-PNG-재작도-통합-작업순서.md) | 32건+ 상세 순서 |
| [118](./118-PNG-canonical-파일명-W1-W11-정본.md) | source 파일명 |
| [82](./82-Figure-재작도-통합-수정계획.md) | 감사 근거·Phase 역사 |
| [31](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) | FT tier 정책 |
| [38](./38-AI-프롬프트-hero-픽셀-감사-판정표.md) | REGENERATE 판정 |
| [120](./120-미구현-통합-구현계획.md) | 코드 트랙 vs Figure 트랙 |

---

## 10. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | 초판 — 미구현 3유형 · Pillow 44건 분류 · W1~W11 일정 · hero·Exit 정의 |
