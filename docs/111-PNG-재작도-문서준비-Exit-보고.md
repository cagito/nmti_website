# PNG 재작도 — 문서 준비 Exit 보고 (W1~W11)

**일자:** 2026-06-26  
**상위:** [82 통합 수정계획](./82-Figure-재작도-통합-수정계획.md) · [89 작업순서](./89-PNG-재작도-통합-작업순서.md) · [108 마스터 인덱스](./108-PNG-재작도-제작자-마스터-인덱스.md)

> **범위:** 복붙 프롬프트 · redline · 체크리스트 · 퀵스타트 · `sign:phase-*` · **제작자 CLI** (`rework:*`). **PNG 생성·등록은 미완.**

> **에이전트·스크립트 구현 Exit** (2026-06-26) — 남은 작업 = **제작자 PNG**만. `npm run rework:handoff`

### 제작자 CLI (구현 완료)

| 명령 | 용도 |
|------|------|
| `npm run rework:handoff` | 1화면 Handoff |
| `npm run rework:check` | redline·프롬프트·patch·handoff 사전 점검 |
| `npm run rework:next` | 다음 Figure + register/sign |
| `npm run rework:ready` | source PNG·서명 대기 목록 |
| `npm run rework:prompt` | 복붙 프롬프트 출력 |
| `npm run rework:phase` | Phase 단위 목록 (`--phase A`) |
| `npm run rework:export-prompts` | `exports/rework-prompts/*.txt` |
| `npm run rework:preflight` | 등록 전 PNG·redline 검증 |
| `npm run rework:register` | PNG 등록 (preflight + build:images) |
| `npm run rework:sign` | redline 서명 (`--id` / `--phase` · 가드) |
| `npm run rework:done` | register + sign 일괄 |
| `npm run rework:patch-status` | patch 적용 여부 |
| `npm run rework:status` | 진행표 (`--pending`) |
| `npm run verify:content` | 재작도 중 CI (reaudit WARN) |

---

## Exit 요약

| Phase | Figure 수 | 문서 | redline | sign 스크립트 | PNG |
|-------|-----------|------|---------|---------------|-----|
| **A** W1 | 3 | ✅ | v5(002)·v2(096·004) | `sign:phase-a` | ☐ |
| **AA** W2 | 10 | ✅ | v2 10종 | `sign:phase-aa` | ☐ |
| **B** W3 | 4 | ✅ | v2 | `sign:phase-b` | ☐ |
| **C** W4 | 5 | ✅ | v2 | `sign:phase-c` | ☐ |
| **AB** W5~7 | 10 | ✅ | v2 10종 | `sign:phase-ab` | ☐ |
| **AC** W8 | 10 | ✅ | **v2 10종 완료** | `sign:phase-ac` | ☐ |
| **AD** W9 | 10 | ✅ | **v2 10종 완료** | `sign:phase-ad` | ☐ |
| **D** W10 | 14 | ✅ | **v2 14종 완료** | `sign:phase-d` | ☐ |
| **E** W11 | 3 | ✅ | **v2 3종** (선택) | `sign:phase-e` | ☐ Pillow 유지 가능 |

**합계:** 69 Figure — W1~W11 문서·redline·서명 경로 준비 완료. **PNG 재등록은 W1 P0(002)부터.**

---

## CI·레지스트리

- **AA·AB (20건):** `requiresReaudit: true` — `npm run audit:images:strict` **FAIL 예상** (의도)
- **AC·AD:** `patch:registry-phase-ac` · `patch:registry-phase-ad` 적용 후 동일
- **Phase D:** `patch:registry-phase-d` — W10 14종 (선택 실행)
- **Phase E:** `patch:registry-phase-e` — W11 3종 (**선택** · Pillow 유지 가능)
- **Phase A:** PASS 유지 · redline **미검수** — PNG 교체 시 `sign:phase-a` 필수

---

## 제작자 다음 단계 (우선순위)

### 1. W1 P0 — IMG-002

1. [102 W1 허브](./102-W1-Phase-A-PNG-제작자-통합-허브.md)
2. `npm run rework:prompt -- --id IMG-002` (또는 [52 §12](./52-IMG-002-전면재작성-프롬프트-정본.md))
3. redline v5 검수 → `source/` PNG
4. `register:figure` → `sign:phase-a -- --id IMG-002`

### 2. W1 — IMG-096 · IMG-004

동일 허브 · [57](./57-IMG-096-가시설-주변지반-계측-표현-표준.md) · [54](./54-IMG-004-어스앵커-하중계-설치-표현-표준.md)

### 3. W2~W11 — 주차별 퀵스타트

[108 마스터](./108-PNG-재작도-제작자-마스터-인덱스.md) · [118 canonical](./118-PNG-canonical-파일명-W1-W11-정본.md)

---

## 특이 사항

| 항목 | 내용 |
|------|------|
| **IMG-024** | Phase B redline + Phase AC `_AC` 보조 (DAM-LEAK-01) |
| **IMG-079** | Phase C redline + Phase AC `_AC` (SHOT-LOC-01) |
| **Phase D** | W10 14종 — [114](./114-W10-Phase-D-퀵스타트.md) |
| **Phase E** | W11 선택 3종 — [117](./117-W11-Phase-E-퀵스타트.md) |

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W1~W9 문서 준비 Exit · AC redline 6종 잔여 완료 |
| 2026-06-26 | W10 Phase D 14종 · patch/sign · 112~114 |
| 2026-06-26 | W11 Phase E · 115~118 · sign:phase-e |
| 2026-06-26 | 제작자 CLI Exit — rework:prompt/phase/export/handoff · verify:content |
