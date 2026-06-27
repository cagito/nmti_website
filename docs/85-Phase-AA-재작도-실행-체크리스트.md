# Phase AA — ZIP 2차 해석·센서 오류 재작도 실행 체크리스트

**상위:** [81-Phase AA](./81-외부-ZIP-신규-심각오류-10종-Phase-AA-수정계획.md) · [82 §3.3b](./82-Figure-재작도-통합-수정계획.md)  
**정본 프롬프트:** [86 REGENERATE](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · [87 MAJOR_FIX](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) · ImageWorks `prompts/` v3  
**CI:** 10건 `requiresReaudit: true` — PNG·redline 완료 전 **`audit:images:strict` FAIL 예상** (의도적)

---

## AA-1 REGENERATE (P0 · 4건)

| 순위 | ID | nodeId | redline | 복붙 블록 | PNG | 서명 | strict 해소 |
|------|-----|--------|---------|-----------|-----|------|-------------|
| 1 | **016** | `fields/slope` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-016_redline_v2_외부PNG.md) | [86 §1](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ | ☐ |
| 2 | **017** | `fields/slope` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-017_redline_v2_외부PNG.md) | [86 §2](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ | ☐ |
| 3 | **021** | `fields/soft-ground` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-021_redline_v2_외부PNG.md) | [86 §3](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ | ☐ |
| 4 | **039** | `sensors/joint-meter` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-039_redline_v2_외부PNG.md) | [86 §4](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ | ☐ |

### 공통 — INTERP-01

- [ ] 해석·추정·상관 = `추정` · `검토` · `가능` · `상관`
- [ ] **확정·단정·인과** 표현 금지 ([TECHNICAL §0.0c](./TECHNICAL_IMAGE_STANDARD.md))

---

## AA-2 MAJOR_FIX (P1 · 6건)

| ID | nodeId | redline | 복붙 | PNG | 서명 |
|----|--------|---------|------|-----|------|
| **018** | `fields/slope` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-018_redline_v2_외부PNG.md) | [87 §1](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ |
| **020** | `fields/soft-ground` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-020_redline_v2_외부PNG.md) | [87 §2](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ |
| **025** | `sensors/inclinometer` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-025_redline_v2_외부PNG.md) | [87 §3](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ |
| **027** | `sensors/inclinometer` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-027_redline_v2_외부PNG.md) | [87 §4](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ |
| **037** | `sensors/crack-meter` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-037_redline_v2_외부PNG.md) | [87 §5](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ |
| **038** | `sensors/tilt-meter` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-038_redline_v2_외부PNG.md) | [87 §6](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) · prompt v3 | ☐ | ☐ |

> **027 주의:** 설치 단면 PASS(v2)와 **별도** — 그라우트·Base 개념 MAJOR_FIX. Pillow `inclinometer_ground_draw.py` **재렌더 금지** — AI/CAD만.

---

## Figure별 핵심 Exit

### IMG-016 (ZIP-AUD-11)

- [ ] 「추정 원호활동면」·「잠재 활동면」
- [ ] 최대변위 심도 ≠ 활동면 위치
- [ ] 다자료 병행(지질·수위·균열·현장관찰) 표기
- [ ] 원호파괴 = **안정해석 모식도** — 계측 확정 단면 아님

### IMG-017 (ZIP-AUD-12)

- [ ] 무한사면식 = **안정성 검토식** — ≠ 계측 산정식
- [ ] 「추정 평면활동면」
- [ ] IPI 3소 목적 분리(후방·교차·안정)

### IMG-021 (ZIP-AUD-15)

- [ ] 중앙·어깨·TOE IPI **목적 분리**
- [ ] 측방유동 ≠ 균일 좌우 밀림
- [ ] 연약층 → 견고 지지층 **근입** 표시

### IMG-039 (ZIP-AUD-20 · CLS-01)

- [ ] ΔL 상대변위 — 고정측·이동측 브라켓
- [ ] ≠ 신축이음계 · ≠ 균열계 · ≠ LVDT 혼합 범례
- [ ] 신축이음계 = 교량 사례 **별도 패널**

---

## 완료 후 일괄 조치

```bash
# 10건 PNG 등록 후
npm run build:images
npm run sign:phase-aa   # requiresReaudit 해제·notes 갱신
npm run audit:images:strict
npm run verify:local
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase AA 실행 체크리스트 — REGENERATE 4 + MAJOR_FIX 6 · redline v2 |
