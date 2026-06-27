# Phase B — P1 재작도 권장 실행 체크리스트

**상위:** [82-통합 수정계획](./82-Figure-재작도-통합-수정계획.md) §3.2  
**정책:** Pillow Sprint0 PNG **교체** · `productionMethod: ai-reviewed`  
**Exit:** 4건 redline 서명 · `register:figure` · `verify:local`

---

## 진행 표

| 순위 | ID | nodeId | redline | 복붙 블록 | PNG | 서명 | registry |
|------|-----|--------|---------|-----------|-----|------|----------|
| 1 | **024** | `dam` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-024_redline_v2_외부PNG.md) | [39 §12](./39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md) · prompt v3 | ☐ | ☐ | ☐ |
| 2 | **089** | `slope/surface-tilt` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-089_redline_v2_외부PNG.md) | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-089_사면_지표경사_계측_개념도.md) | ☐ | ☐ | ☐ |
| 3 | **090** | `slope/structural-displacement` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-090_redline_v2_외부PNG.md) | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-090_사면_구조물_변위_계측_개념도.md) | ☐ | ☐ | ☐ |
| 4 | **091** | `borehole-extensometer` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-091_redline_v2_외부PNG.md) | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-091_다점지중변위계_MPBX_설치_개념도.md) | ☐ | ☐ | ☐ |

---

## Figure별 Exit

### IMG-024 (DAM-01~07)

- [ ] 필댐/석괴댐만 — 중력식·Plumb hero 금지
- [ ] 해석 침윤선 = 피에조 filter tip (점선 파랑)
- [ ] 우측 **6항목** 카드 + 하단 **7단** 데이터 흐름
- [ ] 침하 그래프: 아래(음수) = 위험 ↑ (DAM-01)
- [ ] 로거 = 함체(P0-3)

### IMG-089 (SLO-TILT)

- [ ] 지표경사계 = **표면형** — ≠ 센서형 다단식 IPI
- [ ] 사면 face 설치 · 국부 경사
- [ ] redline v2 전항

### IMG-090

- [ ] ATS **기준 프리즘** + 타깃 분리
- [ ] ≠ GNSS hero(043) 혼동
- [ ] redline v2 전항

### IMG-091 (MPX-01~03)

- [ ] MPBX ≠ 지중경사계 ≠ 신축계(039)
- [ ] 앵커·참조점·다점 변위축
- [ ] redline v2 전항

---

## 등록 예시

```bash
npm run register:figure -- --id IMG-024 --input assets/images/technology/source/IMG-024_*.png --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-b -- --id IMG-024
npm run verify:local
```

4건 완료 후: `npm run sign:phase-b`

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase B 실행 체크리스트 — 024·089~091 |
| 2026-06-26 | sign:phase-b · register 필수 인자 반영 |
