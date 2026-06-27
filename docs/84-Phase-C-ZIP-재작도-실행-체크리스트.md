# Phase C — ZIP Phase Z 재작도 실행 체크리스트

**상위:** [82-통합 수정계획](./82-Figure-재작도-통합-수정계획.md) §3.3 · [77-ZIP](./77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md)  
**정책:** **전면 재작성** · Pillow FT-A/B · SVG **금지** · `productionMethod: ai-reviewed`  
**Exit:** 5건 redline 서명 · `register:figure` · `verify:local`

---

## 진행 표

| 순위 | ID | redline | 프롬프트/복붙 | PNG | redline 서명 | registry | verify |
|------|-----|---------|---------------|-----|--------------|----------|--------|
| 1 | **008** | [v9](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-008_redline_v9_외부PNG.md) · [v8](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-008_redline_v8_외부PNG.md) | [20](./20-IMG-008-터널-내공변위-오류분석-및-재작업-계획.md) · prompt v8+ | ☐ | ☐ | ☐ | ☐ |
| 2 | **015** | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-015_redline_v2_외부PNG.md) | INSTRUMENTATION §3.12 · [IMAGE_REGEN §Z](./IMAGE_REGENERATION_PROMPTS.md) | ☐ | ☐ | ☐ | ☐ |
| 3 | **032** | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-032_redline_v2_외부PNG.md) | SETTLE-01 · [42](./42-지표침하핀-지표침하계-구분-및-자동계측-정책.md) | ☐ | ☐ | ☐ | ☐ |
| 4 | **078** | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-078_redline_v2_외부PNG.md) | [21](./21-IMG-078-009-록볼트-축력-오류분석-및-재작업-계획.md) | ☐ | ☐ | ☐ | ☐ |
| 5 | **080** | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-080_redline_v2_외부PNG.md) | INSTRUMENTATION §3.11.3 | ☐ | ☐ | ☐ | ☐ |

---

## Figure별 Exit (하나라도 □ → 재생성)

### IMG-008 (Z-1a · v9 게이트)

- [ ] **T1** 내공변위 = 이산 측점 P1~P5 — **연속 센서 튜브 1본 금지**
- [ ] **T2** Kit ≠ 전체 변형 프로파일 자동 산정 장치
- [ ] **T3** ΔX·ΔY 또는 테이프 익스텐소미터 **구간** 측정
- [ ] v8 교차: P1~P5 상부 아치만 · Envelope 외측 · 우측 패널 채움
- [ ] ≠ 천단침하(061) · ≠ 지표침하(010)

### IMG-015 (Z-1b)

- [ ] 활동면 = **추정·잠재** — 확정 원호·고정 심도 금지
- [ ] IPI 근입 = **현장 설계** — 「3~5m」 일반 기준 문구 금지
- [ ] 사면 hero 6항목·데이터로거 P0-3

### IMG-032 (Z-1c · SETTLE-01)

- [ ] 침하판·연장봉 상단 ≠ **BM(기준점)**
- [ ] BM = 성토 영향권 밖 안정지반
- [ ] 지표침하계(센서) vs 침하판·핀 역할 분리

### IMG-078 (Z-1d)

- [ ] 헤드 LC = **반력·지압** — ≠ 축력 전체
- [ ] 축력 = 정착구~자유단 구간 합력 개념
- [ ] ≠ 숏크리트(079) hero

### IMG-080 (Z-1e)

- [ ] 1점 SG = **국부 응력** — ≠ 부재 전체 응력
- [ ] 게이지 위치·방향·영점 주석
- [ ] 데이터로거 = 함체(P0-3)

---

## 등록 예시

```bash
npm run register:figure -- --id IMG-008 --input assets/images/technology/source/IMG-008_*.png --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-c -- --id IMG-008
npm run verify:local
```

5건 완료: `npm run sign:phase-c`

---

## 완료 후 registry notes (템플릿)

| ID | notes 예시 |
|----|------------|
| 008 | v9 ai-reviewed PASS — Z-1a 연속튜브 금지 redline v9 서명 YYYY-MM-DD |
| 015 | v2 ai-reviewed PASS — 추정 활동면 redline v2 |
| 032 | v2 ai-reviewed PASS — SETTLE BM 분리 redline v2 |
| 078 | v2 ai-reviewed PASS — 헤드 LC≠축력 redline v2 |
| 080 | v2 ai-reviewed PASS — 1점 SG 국부 redline v2 |

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase C 실행 체크리스트 — 008·015·032·078·080 |
