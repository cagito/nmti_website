# W10 — Phase D 퀵스타트 (011·034·041·043·064·084·070~077·092·093·097)

**상위:** [89 W10](./89-PNG-재작도-통합-작업순서.md) · [113 체크리스트](./113-Phase-D-재작도-실행-체크리스트.md) · [112 복붙](./112-Phase-D-복붙-프롬프트-정본.md)

> **P2 장기** — docs/38 `REGENERATE` 잔여 중 W1~W9 **미포함** 14종 · `sign:phase-d`

---

## 사전

```bash
npm run patch:registry-phase-d
```

---

## 스프린트 권장 순서

### Sprint D-1 — 분야 hero (4)

| ID | 복붙 | redline | 게이트 |
|----|------|---------|--------|
| **064** | [112 §2](./112-Phase-D-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-064_redline_v2_외부PNG.md) | HAR-01 |
| **084** | [112 §3](./112-Phase-D-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-084_redline_v2_외부PNG.md) | EPC·crest |
| **097** | [112 §4](./112-Phase-D-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-097_redline_v2_외부PNG.md) | ≠041 |
| **011** | [112 §1](./112-Phase-D-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-011_redline_v2_외부PNG.md) | BRI-01 (선택) |

### Sprint D-2 — 센서 (3)

034 · 041 · 043 — [112 §5~7](./112-Phase-D-복붙-프롬프트-정본.md)

### Sprint D-3 — modes·DAQ (5)

070 · 071 · 075 · 076 · 077 — [112 §8~12](./112-Phase-D-복붙-프롬프트-정본.md) · FT-C 이전

### Sprint D-4 — 말뚝·환경 (2)

092 · 093 — [112 §13~14](./112-Phase-D-복붙-프롬프트-정본.md) · **P0 지표면**

---

## redline v2

| ID | redline |
|----|---------|
| 011 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-011_redline_v2_외부PNG.md) |
| 034 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-034_redline_v2_외부PNG.md) |
| 041 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-041_redline_v2_외부PNG.md) |
| 043 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-043_redline_v2_외부PNG.md) |
| 064 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-064_redline_v2_외부PNG.md) |
| 084 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-084_redline_v2_외부PNG.md) |
| 070~077 | `IMG-070` … `IMG-077_redline_v2_외부PNG.md` |
| 092 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-092_redline_v2_외부PNG.md) |
| 093 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-093_redline_v2_외부PNG.md) |
| 097 | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-097_redline_v2_외부PNG.md) |

---

## 등록·서명

```powershell
npm run register:figure -- --id IMG-064 --input assets/images/technology/source/IMG-064_*.png `
  --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-d -- --id IMG-064
```

14건 완료: `npm run sign:phase-d` · `verify:local`

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W10 Phase D 14종 퀵스타트 · patch/sign |
