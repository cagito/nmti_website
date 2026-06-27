# W2 — Phase AA REGENERATE 퀵스타트 (016·017·021·039)

**상위:** [89 W2](./89-PNG-재작도-통합-작업순서.md) · [85 체크리스트](./85-Phase-AA-재작도-실행-체크리스트.md)  
**선행:** W1 Phase A(002·096·004) 완료 권장 · **INTERP-01** 필수

> Pillow·SVG 금지 · PNG ≥1920×1080 · 완료 후 `npm run sign:phase-aa`

---

## §0 공통 (4종 맨 앞)

→ [86 §0 INTERP-01](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) 전체 복사

---

## Figure별

| # | ID | 복붙 | redline | ImageWorks |
|---|-----|------|---------|------------|
| 1 | **016** | [86 §1](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-016_redline_v2_외부PNG.md) | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-016_원호활동면_계측_해석도.md) |
| 2 | **017** | [86 §2](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-017_redline_v2_외부PNG.md) | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-017_평면활동면_계측_해석도.md) |
| 3 | **021** | [86 §3](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-021_redline_v2_외부PNG.md) | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-021_측방유동_계측도.md) |
| 4 | **039** | [86 §4](./86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-039_redline_v2_외부PNG.md) | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-039_신축계_설치_개념도.md) |

---

## Top 실패 패턴 (요약)

| ID | 핵심 |
|----|------|
| 016 | 최대변위 깊이 ≠ 활동면 · 「추정 원호활동면」 |
| 017 | 무한사면식 = 안정성 검토식 · IPI 3소 목적 분리 |
| 021 | 중앙·어깨·TOE IPI 목적 분리 · 측방유동 ≠ 균일 밀림 |
| 039 | ΔL 상대변위 · ≠ 신축이음계(039 CLS-01) |

---

## 등록·서명 (예시)

```powershell
npm run register:figure -- --id IMG-016 --input assets/images/technology/source/IMG-016_*.png `
  --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-aa -- --id IMG-016
```

4건 완료 후 MAJOR_FIX 6건 → [104](./104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md) · 10건 일괄 `npm run sign:phase-aa`

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W2 AA REGENERATE 4종 퀵스타트 |
