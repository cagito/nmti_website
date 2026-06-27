# W5 — Phase AB REGENERATE 퀵스타트 (028·029·045)

**상위:** [89 W5](./89-PNG-재작도-통합-작업순서.md) · [90 체크리스트](./90-Phase-AB-재작도-실행-체크리스트.md)  
**MAJOR_FIX 7건:** [91 §4~§10](./91-Phase-AB-복붙-프롬프트-정본.md) · ImageWorks v3

> Pillow·SVG 금지 · METHOD-01 라벨 · 10건 완료 후 `npm run sign:phase-ab`

---

## REGENERATE (우선 3건)

| ID | 복붙 | redline | ImageWorks |
|----|------|---------|------------|
| **028** | [91 §1](./91-Phase-AB-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-028_redline_v2_외부PNG.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-028_지중경사계_측정_원리도.md) |
| **029** | [91 §2](./91-Phase-AB-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-029_redline_v2_외부PNG.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-029_지중경사계_데이터_해석도.md) |
| **045** | [91 §3](./91-Phase-AB-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-045_redline_v2_외부PNG.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-045_데이터로거_구성도.md) |

### 핵심

- **028:** IPI-MEAS-01 — 초기 프로파일 · θ적분≠누적
- **029:** INTERP-01 — 최대변위 깊이 ≠ 활동면
- **045:** LOGGER-SIG-01 · P0-3 함체 · 진동현식/VW 라벨 금지

---

## MAJOR_FIX (이어서 7건)

026 · 030 · 035 · 040 · 042 · 044 · 046 — [91 §4~§10](./91-Phase-AB-복붙-프롬프트-정본.md)

---

## 등록·서명

```powershell
npm run register:figure -- --id IMG-045 --input assets/images/technology/source/IMG-045_*.png `
  --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-ab -- --id IMG-045
```

10건 완료: `npm run sign:phase-ab` · `audit:images:strict`

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W5 AB REGENERATE 3종 + MAJOR_FIX 안내 |
