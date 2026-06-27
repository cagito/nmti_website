# PNG 재작도 프로그램 — 운영 Handoff (W1~W11)

**일자:** 2026-06-26  
**상태:** 문서·redline·`sign:phase-*` **구현 Exit** — PNG 제작·등록은 **제작자 작업**  
**진입점:** [108 마스터](./108-PNG-재작도-제작자-마스터-인덱스.md) · [111 Exit](./111-PNG-재작도-문서준비-Exit-보고.md)

---

## 1. 한 줄

에이전트·Pillow FT-A/B **금지** — 인간/AI PNG → `source/` → `rework:done` (또는 `register` → `sign`) → `verify:local`.

---

## 2. 제작자 명령

```bash
# 사전 점검 (제작 시작 전)
npm run rework:check

# W1 사전 (3건 reaudit 플래그)
npm run patch:registry-phase-a

# 진행 현황
npm run rework:handoff
npm run rework:status -- --pending
npm run rework:ready          # source PNG 있으나 미서명

# 다음 작업
npm run rework:next
npm run rework:next -- --count 3
npm run rework:w1

# 프롬프트
npm run rework:prompt -- --id IMG-002
npm run rework:export-prompts

# W1 P0 예시 (PNG·redline PASS 후)
npm run rework:preflight -- --id IMG-002 --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.png
npm run rework:done -- --id IMG-002 \
  --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.png \
  --reviewer "검수자"
npm run verify:content
```

**canonical 파일명:** [118](./118-PNG-canonical-파일명-W1-W11-정본.md)

---

## 3. Phase · patch · sign

| 주차 | patch (선택) | sign | Figure 수 |
|------|--------------|------|-----------|
| W1 A | `patch:registry-phase-a` | `sign:phase-a` | 3 |
| W2 AA | `patch:registry-phase-aa` | `sign:phase-aa` | 10 |
| W3 B | — | `sign:phase-b` | 4 |
| W4 C | — | `sign:phase-c` | 5 |
| W5~7 AB | `patch:registry-phase-ab` | `sign:phase-ab` | 10 |
| W8 AC | `patch:registry-phase-ac` | `sign:phase-ac` | 10 |
| W9 AD | `patch:registry-phase-ad` | `sign:phase-ad` | 10 |
| W10 D | `patch:registry-phase-d` | `sign:phase-d` | 14 |
| W11 E | `patch:registry-phase-e` (선택) | `sign:phase-e` | 3 |

`patch:*` 실행 전 `audit:images:strict` PASS 유지. patch 후 **FAIL 예상** — PNG+서명 후 복구.

---

## 4. 우선순위

1. **W1** IMG-002 → 096 → 004 — [102 허브](./102-W1-Phase-A-PNG-제작자-통합-허브.md)  
2. W2 REGENERATE 016·017·021·039 — [103](./103-W2-Phase-AA-REGENERATE-퀵스타트.md)  
3. [89](./89-PNG-재작도-통합-작업순서.md) 주차 순

---

## 5. 에이전트 금지 (재확인)

- FT-A/B Figure: SVG · Pillow `render-*` · `*_draw.py`  
- `website/web.config` (상위) 수정  
- `reviewGrade` 미달 PNG 운영 반영

---

## 6. 완료 정의 (프로그램 Exit)

| 게이트 | 조건 |
|--------|------|
| Figure | 69건 `rework:status` signed 또는 Pillow 유지(W11) 출판 PASS |
| CI | **`verify:local`** (배포) · 재작도 중 **`verify:content`** (reaudit WARN 허용) |
| 문서 | `IMAGE_REVIEW_LOG` · registry notes |

### 검증 명령 구분

| 명령 | 용도 |
|------|------|
| `npm run verify:content` | 콘텐츠·용어·SEO — **requiresReaudit WARN** (재작도 중 일상) |
| `npm run verify:local` | **배포 게이트** — reaudit 0건 필수 |
| `npm run rework:next` | 다음 PNG 작업 Figure |
| `npm run rework:prompt` | Figure 복붙 프롬프트 출력 (P0 + 정본 블록) |
| `npm run rework:preflight` | 등록 전 PNG·redline·canonical 검증 |
| `npm run rework:register` | preflight + register:figure + build:images |
| `npm run rework:sign` | redline 서명 (`--id` 또는 `--phase A`) |
| `npm run rework:patch-status` | patch:registry-phase-* 적용 여부 |
| `npm run rework:export-prompts` | 69종 프롬프트 → `exports/rework-prompts/` |
| `npm run rework:handoff` | 제작자 1화면 요약 |
| `npm run rework:w1` | W1 3건 순서 |
| `npm run rework:phase` | Phase 단위 목록 (`--phase A`) |

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W1~W11 Handoff · `rework:status` |
| 2026-06-26 | 제작자 CLI — prompt · phase · export · handoff · patch-status · **preflight** |
