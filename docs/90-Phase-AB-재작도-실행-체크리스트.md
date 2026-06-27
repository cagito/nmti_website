# Phase AB — ZIP 3차 재작도 실행 체크리스트

**상위:** [84-Phase AB](./84-외부-ZIP-신규-심각오류-10종-Phase-AB-수정계획.md) · [89 작업순서](./89-PNG-재작도-통합-작업순서.md)  
**복붙:** [91](./91-Phase-AB-복붙-프롬프트-정본.md)  
**CI:** `requiresReaudit: true` 10건 — 완료 전 strict FAIL 예상

---

## AB-1 REGENERATE (3건)

| ID | nodeId | redline | 복붙 | PNG | 서명 |
|----|--------|---------|------|-----|------|
| **028** | `sensors/inclinometer` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-028_redline_v2_외부PNG.md) | [91 §1](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-028_지중경사계_측정_원리도.md) | ☐ | ☐ |
| **029** | `sensors/inclinometer` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-029_redline_v2_외부PNG.md) | [91 §2](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-029_지중경사계_데이터_해석도.md) | ☐ | ☐ |
| **045** | `instruments/datalogger/static` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-045_redline_v2_외부PNG.md) | [91 §3](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-045_데이터로거_구성도.md) | ☐ | ☐ |

### 핵심

- **028:** IPI-MEAS-01 — 초기 프로파일 · 왕복 · θ적분≠누적 단정
- **029:** INTERP-01 — 최대변위 깊이 ≠ 활동면
- **045:** LOGGER-SIG-01 — 센서별 신호 형식 분리 · METHOD-01 라벨

---

## AB-2 MAJOR_FIX (7건)

| ID | nodeId | redline | 복붙 | PNG | 서명 |
|----|--------|---------|------|-----|------|
| **026** | `sensors/inclinometer` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-026_redline_v2_외부PNG.md) | [91 §4](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-026_지중경사계_케이싱_단면도.md) | ☐ | ☐ |
| **030** | `sensors/water-level-meter` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-030_redline_v2_외부PNG.md) | [91 §5](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-030_지하수위계_설치_개념도.md) | ☐ | ☐ |
| **035** | `sensors/load-cell` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-035_redline_v2_외부PNG.md) | [91 §6](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-035_하중계_설치_개념도.md) | ☐ | ☐ |
| **040** | `sensors/displacement-transducer` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-040_redline_v2_외부PNG.md) | [91 §7](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-040_변위계_설치_개념도.md) | ☐ | ☐ |
| **042** | `sensors/automated-total-station` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-042_redline_v2_외부PNG.md) | [91 §8](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-042_자동광파기_계측_개념도.md) | ☐ | ☐ |
| **044** | `sensors/weather-station` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-044_redline_v2_외부PNG.md) | [91 §9](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-044_기상계측기_구성도.md) | ☐ | ☐ |
| **046** | `instruments/communication/iot-gateway` | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-046_redline_v2_외부PNG.md) | [91 §10](./91-Phase-AB-복붙-프롬프트-정본.md) · [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-046_IoT_게이트웨이_구성도.md) | ☐ | ☐ |

> **045·046:** FT-C Pillow 유지 불가 — REGENERATE/MAJOR_FIX는 **ai-reviewed** PNG.

---

## 완료 후

```bash
npm run sign:phase-ab
npm run audit:images:strict
npm run verify:local
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase AB 실행 체크리스트 — 10종 |
| 2026-06-26 | ImageWorks prompt **v3** 10건 — docs/91 연동 |
