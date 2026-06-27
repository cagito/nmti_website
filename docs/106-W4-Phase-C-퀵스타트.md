# W4 — Phase C ZIP 퀵스타트 (008·015·032·078·080)

**상위:** [89 W4](./89-PNG-재작도-통합-작업순서.md) · [84 체크리스트](./84-Phase-C-ZIP-재작도-실행-체크리스트.md)  
**정책:** 전면 재작성 · Pillow·SVG **금지** · 완료 후 `npm run sign:phase-c`

---

## Figure별

| # | ID | redline | 복붙/정본 |
|---|-----|---------|-----------|
| 1 | **008** | [v9](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-008_redline_v9_외부PNG.md) + [v8](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-008_redline_v8_외부PNG.md) | [20](./20-IMG-008-터널-내공변위-오류분석-및-재작업-계획.md) · prompt v8+ |
| 2 | **015** | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-015_redline_v2_외부PNG.md) | INSTRUMENTATION §3.12 |
| 3 | **032** | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-032_redline_v2_외부PNG.md) | SETTLE-01 · [42](./42-지표침하핀-지표침하계-구분-및-자동계측-정책.md) |
| 4 | **078** | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-078_redline_v2_외부PNG.md) | [21](./21-IMG-078-009-록볼트-축력-오류분석-및-재작업-계획.md) |
| 5 | **080** | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-080_redline_v2_외부PNG.md) | INSTRUMENTATION §3.11.3 |

---

## Top 실패 패턴

| ID | 핵심 |
|----|------|
| 008 | **T1** P1~P5 이산 측점 — 연속 센서 튜브 1본 금지 |
| 015 | 활동면 = 추정·잠포 — 「3~5m」 일반화 금지 |
| 032 | BM ≠ 침하판 상단 · SETTLE-01 |
| 078 | 헤드 LC = 반력·지압 ≠ 축력 전체 |
| 080 | 1점 SG = 국부 응력 |

---

## 등록·서명

```powershell
npm run register:figure -- --id IMG-008 `
  --input assets/images/technology/source/IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.png `
  --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-c -- --id IMG-008
```

5건 완료: `npm run sign:phase-c`

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W4 Phase C ZIP 5종 퀵스타트 |
