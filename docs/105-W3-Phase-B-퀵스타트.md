# W3 — Phase B P1 퀵스타트 (024·089·090·091)

**상위:** [89 W3](./89-PNG-재작도-통합-작업순서.md) · [88 체크리스트](./88-Phase-B-P1-재작도-실행-체크리스트.md)  
**정책:** Pillow Sprint0 PNG **교체** · `ai-reviewed` · 완료 후 `npm run sign:phase-b`

---

## Figure별

| # | ID | 복붙 | redline | canonical (요약) |
|---|-----|------|---------|------------------|
| 1 | **024** | [39 §12](./39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-024_redline_v2_외부PNG.md) | `IMG-024_댐-안전관리-계측-체계도_필댐6항목데이터흐름.png` |
| 2 | **089** | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-089_사면_지표경사_계측_개념도.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-089_redline_v2_외부PNG.md) | `IMG-089_사면-지표경사-계측-개념도_*.png` |
| 3 | **090** | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-090_사면_구조물_변위_계측_개념도.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-090_redline_v2_외부PNG.md) | `IMG-090_사면-구조물-변위-계측-개념도_*.png` |
| 4 | **091** | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-091_다점지중변위계_MPBX_설치_개념도.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-091_redline_v2_외부PNG.md) | `IMG-091_다점지중변위계-MPBX-설치-개념도_*.png` |

---

## Top 실패 패턴

| ID | 핵심 |
|----|------|
| 024 | 필댐/석괴댐 · 침윤선=피에조 filter · 로거 함체(P0-3) |
| 089 | **지표경사계** 표면형 — ≠ 센서형 IPI |
| 090 | ATS 기준·타깃 분리 · ≠ GNSS(043) |
| 091 | MPBX ≠ IPI ≠ 신축계(039) |

> **024:** Phase B(39 §12)와 Phase AC(93 §4) 병행 검수 — **누수=하류 배수** (AC DAM-LEAK-01)

---

## 등록·서명 (예: 024)

```powershell
npm run register:figure -- --id IMG-024 `
  --input assets/images/technology/source/IMG-024_댐-안전관리-계측-체계도_필댐6항목데이터흐름.png `
  --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-b -- --id IMG-024
```

4건 완료: `npm run sign:phase-b` · `verify:local`

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W3 Phase B 4종 퀵스타트 |
