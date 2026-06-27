# W9 — Phase AD 퀵스타트 (047~056 · 운영·그래프·UI)

**상위:** [96-Phase AD](./96-외부-ZIP-신규-심각오류-10종-Phase-AD-수정계획.md) · [98 체크리스트](./98-Phase-AD-재작도-실행-체크리스트.md)  
**복붙:** [97](./97-Phase-AD-복붙-프롬프트-정본.md) · exit [99](./99-Phase-AD-IMG별-오류분석-및-재작업-계획.md)  
**가이드:** [11 그래프·운영](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/11_그래프_운영_대시보드_이미지_가이드.md) · **OPS-VERIFY-01**

> FT-C 그래프·UI — Pillow `render:power` 등 **허용** Figure는 [98 §2](./98-Phase-AD-재작도-실행-체크리스트.md) 참고 · `sign:phase-ad`

---

## 사전

```bash
npm run patch:registry-phase-ad
```

---

## P0 REGENERATE (4건)

| ID | 복붙 | redline | 표준 |
|----|------|---------|------|
| **050** | [97 §4](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-050_redline_v2_외부PNG.md) | GRAPH-PRED-01 |
| **052** | [97 §6](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-052_redline_v2_외부PNG.md) | LOAD-STAGE-01 |
| **054** | [97 §8](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-054_redline_v2_외부PNG.md) | ALARM-FLOW-01 |
| **056** | [97 §10](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-056_redline_v2_외부PNG.md) | DASH-STATE-01 |

## P1 MAJOR_FIX (6건)

| ID | 복붙 | redline |
|----|------|---------|
| **047** | [97 §1](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-047_redline_v2_외부PNG.md) |
| **048** | [97 §2](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-048_redline_v2_외부PNG.md) |
| **049** | [97 §3](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-049_redline_v2_외부PNG.md) |
| **051** | [97 §5](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-051_redline_v2_외부PNG.md) |
| **053** | [97 §7](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-053_redline_v2_외부PNG.md) |
| **055** | [97 §9](./97-Phase-AD-복붙-프롬프트-정본.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-055_redline_v2_외부PNG.md) |

---

## 등록·서명

```powershell
npm run register:figure -- --id IMG-050 --input assets/images/technology/source/IMG-050_*.png `
  --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-ad -- --id IMG-050
```

10건 완료: `npm run sign:phase-ad` · `verify:production`

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W9 Phase AD 10종 퀵스타트 · redline v2 |
