# W11 — Phase E 퀵스타트 (094·095·102 · P0 필수)

**상위:** [123 P0](./123-P0-와이어프레임-14종-실행-체크리스트.md) · [124 제작자](./124-P0-IMG-094-운영모드-3종-제작자-퀵스타트.md) · [116 체크리스트](./116-Phase-E-재작도-실행-체크리스트.md) · [115 복붙](./115-Phase-E-복붙-프롬프트-정본.md)

> **2026-06-26 정책:** [122](./122-Pillow-와이어프레임-Figure-출판품질-통합-수정계획.md) — Pillow **유지 폐지** · **ai-reviewed PNG 필수**

---

## 사전

```bash
npm run rework:p0
npm run rework:prompt -- --id IMG-094
```

---

## Figure

| ID | 복붙 | redline | canonical PNG |
|----|------|---------|---------------|
| **094** | [115 §1](./115-Phase-E-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-094_redline_v2_외부PNG.md) | `IMG-094_상시-계측-모드-흐름도_등간격트리거stabletrend.png` |
| **095** | [115 §2](./115-Phase-E-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-095_redline_v2_외부PNG.md) | `IMG-095_실시간-이벤트-계측-모드-토폴로지_고속샘플링impulse.png` |
| **102** | [115 §3](./115-Phase-E-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-102_redline_v2_외부PNG.md) | `IMG-102_경보-알림-상태-제어-흐름도_threshold경광SMS.png` |

---

## ai-reviewed 교체 (필수)

```powershell
npm run rework:done -- --id IMG-094 `
  --input assets/images/technology/source/IMG-094_상시-계측-모드-흐름도_등간격트리거stabletrend.png `
  --reviewer "검수자"
# 095·102 동일
npm run sign:phase-e -- --ai-reviewed
```

상세: [124](./124-P0-IMG-094-운영모드-3종-제작자-퀵스타트.md)

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | 122 연계 — Pillow 유지 제거 · ai-reviewed 필수 |
| 2026-06-26 | W11 Phase E 선택 3종 |
