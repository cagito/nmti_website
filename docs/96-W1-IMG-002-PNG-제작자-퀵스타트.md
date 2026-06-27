# W1-1 — IMG-002 PNG 제작자 퀵스타트

**대상:** 인간 CAD · 외부 AI 이미지 생성 (에이전트·Pillow·SVG **금지**)  
**상위:** [89 작업순서](./89-PNG-재작도-통합-작업순서.md) W1 · [83 체크리스트](./83-Phase-A-P0-재작도-실행-체크리스트.md) · [102 통합 허브](./102-W1-Phase-A-PNG-제작자-통합-허브.md)

---

## 1. 복사할 프롬프트 (한 번에)

→ **[docs/52 §12](./52-IMG-002-전면재작성-프롬프트-정본.md)** 또는 `npm run rework:prompt -- --id IMG-002`  
(또는 [92 §1](./92-Phase-A-복붙-프롬프트-정본.md) 링크 동일)

**선행 권장:** [docs/36 §1.0 P0](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md)

---

## 2. 생성 후 육안 검수

| 문서 | 용도 |
|------|------|
| [redline v5](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-002_redline_v5_외부PNG.md) | 전항 PASS — **§3.5 ANC-CLOCK** 포함 |
| [52 §9](./52-IMG-002-전면재작성-프롬프트-정본.md) | 검수 10항 |
| [82 상부지보·앵커축](./82-흙막이-상부지보·앵커축-엄격-수정-요구.md) | 강연선·하중계 시계 |

**FAIL = 폐기·재생성** (부분 수정·inpaint 금지)

---

## 3. 파일 저장

| 항목 | 값 |
|------|-----|
| 최소 해상도 | **1920×1080** |
| canonical 파일명 | `IMG-002_흙막이-계측-설치-대표-단면도.png` |
| source 경로 | `assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.png` |

---

## 4. 등록·서명 (PowerShell 예시)

```powershell
cd x:\website\homepage

npm run register:figure -- --id IMG-002 `
  --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.png `
  --method ai-reviewed `
  --reviewer "검수자이름" `
  --visual-grade PASS `
  --notes "v5 ai-reviewed — redline v5 PASS"

npm run build:images
npm run sign:phase-a -- --id IMG-002
npm run verify:local
```

096·004 완료 후: `npm run sign:phase-a` (인자 없이 3건 일괄)

---

## 5. Top 3 실패 패턴 (재발 방지)

1. **앵커 LC** — 굴착측 두부(반력판–앵커헤드)만 · 지중·정착장 금지  
2. **SOE-INST-01** — IPI·지하수위·간극수압 = **배면 천공** (벽체/CIP 내부 금지)  
3. **⑦ 침하** — `지표침하 측점`/`침하핀` only · `지표침하계` 라벨 금지

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W1-1 IMG-002 제작자 퀵스타트 — 52§12 · register 전체 인자 |
