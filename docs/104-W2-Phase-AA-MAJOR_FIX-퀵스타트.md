# W2 — Phase AA MAJOR_FIX 퀵스타트 (018·020·025·027·037·038)

**상위:** [89 W2](./89-PNG-재작도-통합-작업순서.md) · [85 체크리스트](./85-Phase-AA-재작도-실행-체크리스트.md)  
**선행:** [103 REGENERATE 4종](./103-W2-Phase-AA-REGENERATE-퀵스타트.md) 완료 권장 (동일 ZIP 묶음)

> MAJOR_FIX — 의심 시 **전면 재작성** · Pillow·SVG 금지 · 완료 후 `npm run sign:phase-aa`

---

## Figure별

| ID | 복붙 | redline | ImageWorks |
|----|------|---------|------------|
| **018** | [87 §1](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-018_redline_v2_외부PNG.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-018_강우-지하수위-변위_상관도.md) |
| **020** | [87 §2](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-020_redline_v2_외부PNG.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-020_압밀_침하_계측_개념도.md) |
| **025** | [87 §3](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-025_redline_v2_외부PNG.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-025_지중경사계_시스템_구성도.md) |
| **027** | [87 §4](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-027_redline_v2_외부PNG.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-027_지중경사계_설치_단면도.md) |
| **037** | [87 §5](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-037_redline_v2_외부PNG.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-037_균열계_설치_개념도.md) |
| **038** | [87 §6](./87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-038_redline_v2_외부PNG.md) | [v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-038_구조물_경사계_설치도.md) |

---

## Top 실패 패턴

| ID | 핵심 |
|----|------|
| 018 | 상관 분석 — 인과 확정 금지 · 시간지연 현장별 |
| 020 | SETTLE-01 — BM 영향권 밖 · 간극수압≠침하 |
| 025 | IPI ≠ 수동 프로브 hero · 디지털 통신 |
| 027 | Base 안정층 · 그라우트 — **Pillow 재렌더 금지** |
| 037 | 균열폭 Δ · ≠ 변위계 · ≠ 신축계 |
| 038 | 구조물경사계 = 부재 부착 · ≠ IPI |

---

## 등록·서명

```powershell
npm run register:figure -- --id IMG-027 --input assets/images/technology/source/IMG-027_*.png `
  --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
```

**10건(016~039 전체) 완료 후:** `npm run sign:phase-aa` · `audit:images:strict`

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W2 AA MAJOR_FIX 6종 퀵스타트 |
