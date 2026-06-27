# PNG 재작도 — 통합 작업순서 (32건)

**정본:** [82-통합 수정계획](./82-Figure-재작도-통합-수정계획.md)  
**워크플로:** 복붙 → AI/CAD → redline 육안 → `source/` → `register:figure` → `build:images` → 서명 → `verify:local`

> **우선:** Phase A(002) → Phase AA REGENERATE(016) → 나머지 주차별.  
> **CI:** Phase AA·AB 20건 `requiresReaudit` — 완료 전 `audit:images:strict` FAIL 예상.

---

## W1 — Phase A P0 (최우선 3건)

**복붙 허브:** [docs/92](./92-Phase-A-복붙-프롬프트-정본.md) · **제작자:** [108 마스터](./108-PNG-재작도-제작자-마스터-인덱스.md) · **문서 Exit:** [111](./111-PNG-재작도-문서준비-Exit-보고.md)

| # | ID | 복붙 | 체크리스트 |
|---|-----|------|------------|
| 1 | **002** | [92 §1](./92-Phase-A-복붙-프롬프트-정본.md) → [52 §12](./52-IMG-002-전면재작성-프롬프트-정본.md) · [96 퀵스타트](./96-W1-IMG-002-PNG-제작자-퀵스타트.md) | [83](./83-Phase-A-P0-재작도-실행-체크리스트.md) · **[102 허브](./102-W1-Phase-A-PNG-제작자-통합-허브.md)** |
| 2 | **096** | [92 §2](./92-Phase-A-복붙-프롬프트-정본.md) → [57 §8.1](./57-IMG-096-가시설-주변지반-계측-표현-표준.md) · [100 퀵스타트](./100-W1-IMG-096-PNG-제작자-퀵스타트.md) | [83](./83-Phase-A-P0-재작도-실행-체크리스트.md) |
| 3 | **004** | [92 §3](./92-Phase-A-복붙-프롬프트-정본.md) → [54 §15](./54-IMG-004-어스앵커-하중계-설치-표현-표준.md) · [101 퀵스타트](./101-W1-IMG-004-PNG-제작자-퀵스타트.md) | [83](./83-Phase-A-P0-재작도-실행-체크리스트.md) |

완료 3건 후: `npm run sign:phase-a`

---

## W2 — Phase AA REGENERATE (4건)

| # | ID | 복붙 | 체크리스트 |
|---|-----|------|------------|
| 4 | **016** | [86 §1](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · [103](./103-W2-Phase-AA-REGENERATE-퀵스타트.md) | [85](./85-Phase-AA-재작도-실행-체크리스트.md) |
| 5 | **017** | [86 §2](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · [103](./103-W2-Phase-AA-REGENERATE-퀵스타트.md) | [85](./85-Phase-AA-재작도-실행-체크리스트.md) |
| 6 | **021** | [86 §3](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · [103](./103-W2-Phase-AA-REGENERATE-퀵스타트.md) | [85](./85-Phase-AA-재작도-실행-체크리스트.md) |
| 7 | **039** | [86 §4](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · [103](./103-W2-Phase-AA-REGENERATE-퀵스타트.md) | [85](./85-Phase-AA-재작도-실행-체크리스트.md) |

완료 4건 후: `npm run sign:phase-aa -- --id IMG-016` (개별) 또는 일괄 `npm run sign:phase-aa`

---

## W3 — Phase B (4건)

| # | ID | 복붙 | 체크리스트 |
|---|-----|------|------------|
| 8 | **024** | [39 §12](./39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md) · [105](./105-W3-Phase-B-퀵스타트.md) | [88](./88-Phase-B-P1-재작도-실행-체크리스트.md) |
| 9 | **089** | [105](./105-W3-Phase-B-퀵스타트.md) · prompt v3 | [88](./88-Phase-B-P1-재작도-실행-체크리스트.md) |
| 10 | **090** | [105](./105-W3-Phase-B-퀵스타트.md) · prompt v3 | [88](./88-Phase-B-P1-재작도-실행-체크리스트.md) |
| 11 | **091** | [105](./105-W3-Phase-B-퀵스타트.md) · prompt v3 | [88](./88-Phase-B-P1-재작도-실행-체크리스트.md) |

---

## W4 — Phase C ZIP (5건)

| # | ID | redline | 체크리스트 |
|---|-----|---------|------------|
| 12 | **008** | v9+v8 · [106](./106-W4-Phase-C-퀵스타트.md) | [84](./84-Phase-C-ZIP-재작도-실행-체크리스트.md) |
| 13 | **015** | v2 · [106](./106-W4-Phase-C-퀵스타트.md) | [84](./84-Phase-C-ZIP-재작도-실행-체크리스트.md) |
| 14 | **032** | v2 · [106](./106-W4-Phase-C-퀵스타트.md) | [84](./84-Phase-C-ZIP-재작도-실행-체크리스트.md) |
| 15 | **078** | v2 · [106](./106-W4-Phase-C-퀵스타트.md) | [84](./84-Phase-C-ZIP-재작도-실행-체크리스트.md) |
| 16 | **080** | v2 · [106](./106-W4-Phase-C-퀵스타트.md) | [84](./84-Phase-C-ZIP-재작도-실행-체크리스트.md) |

---

## W5 — Phase AB REGENERATE (3건)

| # | ID | 복붙 | 체크리스트 |
|---|-----|------|------------|
| 17 | **028** | [91 §1](./91-Phase-AB-복붙-프롬프트-정본.md) · [107](./107-W5-Phase-AB-REGENERATE-퀵스타트.md) | [90](./90-Phase-AB-재작도-실행-체크리스트.md) |
| 18 | **029** | [91 §2](./91-Phase-AB-복붙-프롬프트-정본.md) · [107](./107-W5-Phase-AB-REGENERATE-퀵스타트.md) | [90](./90-Phase-AB-재작도-실행-체크리스트.md) |
| 19 | **045** | [91 §3](./91-Phase-AB-복붙-프롬프트-정본.md) · [107](./107-W5-Phase-AB-REGENERATE-퀵스타트.md) | [90](./90-Phase-AB-재작도-실행-체크리스트.md) |

---

## W6~7 — Phase AA MAJOR_FIX (6건) + AB MAJOR_FIX (7건)

| Phase | ID | 복붙 |
|-------|-----|------|
| AA | 018·020·025·027·037·038 | [87](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) |
| AB | 026·030·035·040·042·044·046 | [91](./91-Phase-AB-복붙-프롬프트-정본.md) §4~§10 |

체크리스트: [85](./85-Phase-AA-재작도-실행-체크리스트.md) · [90](./90-Phase-AB-재작도-실행-체크리스트.md)

Phase AA 10건 완료: `npm run sign:phase-aa` · Phase AB 10건: `npm run sign:phase-ab`

---

## W8 — Phase AC (10건 · ZIP 4차 · ~4주)

**실행계획:** [96 AC](./96-Phase-AC-통합-수정-실행계획.md) · **퀵스타트:** [109](./109-W8-Phase-AC-퀵스타트.md) · **복붙:** [93](./93-Phase-AC-복붙-프롬프트-정본.md)

### W8-1 P0 즉시 (W1)

| # | ID | 복붙 | 체크리스트 |
|---|-----|------|------------|
| 33 | **024** | [93 §4](./93-Phase-AC-복붙-프롬프트-정본.md) + [39 §12](./39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md) | [94 AC-0](./94-Phase-AC-재작도-실행-체크리스트.md) |
| 34 | **033** | [93 §6](./93-Phase-AC-복붙-프롬프트-정본.md) | [94](./94-Phase-AC-재작도-실행-체크리스트.md) |
| 35 | **081** | [93 §9](./93-Phase-AC-복붙-프롬프트-정본.md) | [94](./94-Phase-AC-재작도-실행-체크리스트.md) |
| 36 | **059** | [93 §10](./93-Phase-AC-복붙-프롬프트-정본.md) | [94](./94-Phase-AC-재작도-실행-체크리스트.md) |

### W8-2 개념도 (W2)

| # | ID | 복붙 |
|---|-----|------|
| 37 | **007** | [93 §1](./93-Phase-AC-복붙-프롬프트-정본.md) |
| 38 | **079** | [93 §8](./93-Phase-AC-복붙-프롬프트-정본.md) |
| 39 | **019** | [93 §2](./93-Phase-AC-복붙-프롬프트-정본.md) |
| 40 | **023** | [93 §3](./93-Phase-AC-복붙-프롬프트-정본.md) |

### W8-3 MAJOR_FIX (W3)

| # | ID | 복붙 |
|---|-----|------|
| 41 | **031** | [93 §5](./93-Phase-AC-복붙-프롬프트-정본.md) |
| 42 | **036** | [93 §7](./93-Phase-AC-복붙-프롬프트-정본.md) |

완료 10건 후: `npm run sign:phase-ac` · `audit:images:strict` · `verify:local`

---

## W9 — Phase AD (10건 · ZIP 5차 · 운영·그래프·UI)

**계획:** [96-AD](./96-외부-ZIP-신규-심각오류-10종-Phase-AD-수정계획.md) · **퀵스타트:** [110](./110-W9-Phase-AD-퀵스타트.md) · **복붙:** [97](./97-Phase-AD-복붙-프롬프트-정본.md)

| 구분 | ID |
|------|-----|
| REGENERATE | 050 · 052 · 054 · 056 |
| MAJOR_FIX | 047 · 048 · 049 · 051 · 053 · 055 |

완료 10건 후: `npm run patch:registry-phase-ad` (사전) · `npm run sign:phase-ad` · `verify:production`

---

## W10 — Phase D P2 (14건 · W1~W9 미포함)

**퀵스타트:** [114](./114-W10-Phase-D-퀵스타트.md) · **복붙:** [112](./112-Phase-D-복붙-프롬프트-정본.md) · **체크리스트:** [113](./113-Phase-D-재작도-실행-체크리스트.md)

| 스프린트 | ID | 비고 |
|----------|-----|------|
| D-1 hero | 011 · 064 · 084 · 097 | BRI-01 · HAR-01 · ≠041 |
| D-2 sensor | 034 · 041 · 043 | EPC · VIB · GNSS |
| D-3 modes | 070 · 071 · 075 · 076 · 077 | FT-C→ai-reviewed |
| D-4 기초·환경 | 092 · 093 | PILE-01 · ENV-01 |

사전: `npm run patch:registry-phase-d` · 완료: `npm run sign:phase-d`

---

## W11 — Phase E 선택 (3건)

**퀵스타트:** [117](./117-W11-Phase-E-퀵스타트.md) · **복붙:** [115](./115-Phase-E-복붙-프롬프트-정본.md)

| ID | 조치 |
|----|------|
| 094 · 095 · 102 | Pillow 유지 + redline **또는** ai-reviewed 교체 |

선택: `npm run patch:registry-phase-e` · `npm run sign:phase-e` (교체 시 `--ai-reviewed`)

---

## 공통 등록 명령

```bash
npm run register:figure -- --id IMG-### --input assets/images/technology/source/IMG-###_*.png --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run verify:local
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | 32건 통합 작업순서 — Phase A~AB |
| 2026-06-26 | W2~W8 퀵스타트(104~108) · sign:phase-c/ac · register 필수 인자 |
| 2026-06-26 | W9 Phase AD · redline 047~056 · sign:phase-ad · [110](./110-W9-Phase-AD-퀵스타트.md) |
| 2026-06-26 | W10 Phase D 14종 · [114](./114-W10-Phase-D-퀵스타트.md) · sign:phase-d |
| 2026-06-22 | **W8 Phase AC** 10건 — [96](./96-Phase-AC-통합-수정-실행계획.md) |
