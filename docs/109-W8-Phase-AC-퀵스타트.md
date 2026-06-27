# W8 — Phase AC 퀵스타트 (007·019·023·024·031·033·036·059·079·081)

**상위:** [89 W8](./89-PNG-재작도-통합-작업순서.md) · [94 체크리스트](./94-Phase-AC-재작도-실행-체크리스트.md) · [96 AC 계획](./96-Phase-AC-통합-수정-실행계획.md)

> **MEAS-PRIN-01** — 기준점·측점·측선·해석 단계 분리 · Pillow FT-A/B 금지(해당 Figure) · `sign:phase-ac`

---

## 사전

```bash
npm run patch:registry-phase-ac   # requiresReaudit: true (미적용 시)
```

---

## 우선순위

### P0 즉시 (4건)

| ID | 복붙 | 핵심 |
|----|------|------|
| **024** | [93 §4](./93-Phase-AC-복붙-프롬프트-정본.md) + [39 §12](./39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md) | DAM-LEAK-01 — 누수=하류 배수 |
| **033** | [93 §6](./93-Phase-AC-복붙-프롬프트-정본.md) | MAG-RING-01 |
| **081** | [93 §9](./93-Phase-AC-복붙-프롬프트-정본.md) | COL-SHRINK-01 |
| **059** | [93 §10](./93-Phase-AC-복붙-프롬프트-정본.md) | THRESH-01 |

### REGENERATE (4건)

007 · 019 · 023 · 079 — [93 §1·§2·§3·§8](./93-Phase-AC-복붙-프롬프트-정본.md)

### MAJOR_FIX (2건)

031 · 036 — [93 §5·§7](./93-Phase-AC-복붙-프롬프트-정본.md)

상세 exit: [95 IMG별](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md)

---

## redline v2 (외부 PNG 검수)

| ID | redline | 비고 |
|----|---------|------|
| 007 | [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-007_redline_v2_외부PNG.md) | |
| 019 | [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-019_redline_v2_외부PNG.md) | |
| 023 | [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-023_redline_v2_외부PNG.md) | |
| 024 | [redline v2 AC](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-024_redline_v2_외부PNG_AC.md) | Phase B [024 v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-024_redline_v2_외부PNG.md) 병행 |
| 031 | [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-031_redline_v2_외부PNG.md) | |
| 033 | [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-033_redline_v2_외부PNG.md) | |
| 036 | [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-036_redline_v2_외부PNG.md) | |
| 059 | [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-059_redline_v2_외부PNG.md) | |
| 079 | [redline v2 AC](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-079_redline_v2_외부PNG_AC.md) | SHOT-LOC-01 |
| 081 | [redline v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-081_redline_v2_외부PNG.md) | |

---

## 등록·서명

```powershell
npm run register:figure -- --id IMG-033 --input assets/images/technology/source/IMG-033_*.png `
  --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-ac -- --id IMG-033
```

10건 완료: `npm run sign:phase-ac` · `audit:images:strict` · `verify:local`

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W8 Phase AC 10종 퀵스타트 |
| 2026-06-26 | redline v2 10종 링크 · 024·079 AC 보조 |
