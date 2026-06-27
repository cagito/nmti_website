# Phase A — P0 복붙 프롬프트 정본 (002·096·004)

**상위:** [83 실행 체크리스트](./83-Phase-A-P0-재작도-실행-체크리스트.md) · [89 작업순서](./89-PNG-재작도-통합-작업순서.md) W1  
**정책:** **전면 재작성만** · Pillow·SVG·inpaint **금지** · PNG ≥1920×1080

> 본 문서는 **복붙 위치 인덱스**입니다. 전문 블록은 각 정본 doc §에 있습니다 — **중복 편집 금지**.

---

## 공통 워크플로 (Figure 1건)

| 단계 | 작업 |
|------|------|
| 1 | 아래 **복붙 정본** 전체 복사 → AI/CAD |
| 2 | PNG 생성 → [redline] 육안 (FAIL = 폐기·재생성) |
| 3 | `assets/images/technology/source/IMG-###_*.png` |
| 4 | `npm run register:figure -- --id IMG-### --input ... --method ai-reviewed --reviewer "이름" --visual-grade PASS` |
| 5 | `npm run build:images` · redline **서명** |
| 6 | Phase A 3건 완료 후 `npm run sign:phase-a` |

**Prefix (모든 Figure):** [docs/36 §1.0 P0](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) 선행 권장.

---

## §1 IMG-002 — 흙막이 계측 설치 대표 단면도

| 항목 | 경로 |
|------|------|
| **복붙 (한 번에)** | [52 §12](./52-IMG-002-전면재작성-프롬프트-정본.md) · [96 퀵스타트](./96-W1-IMG-002-PNG-제작자-퀵스타트.md) |
| ImageWorks | [prompt v5](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-002_흙막이_벽체_계측_배치도.md) |
| redline | [v5](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-002_redline_v5_외부PNG.md) |
| 추가 게이트 | [82 상부지보·앵커축](./82-흙막이-상부지보·앵커축-엄격-수정-요구.md) · [83 ANC-CLOCK](./83-어스앵커-하중계-ANC-CLOCK-정본.md) |
| nodeId | `fields/retaining-excavation/earth-retaining-wall` |

**Top 3 검수:** 앵커 LC 굴착측 두부 · SOE-INST-01 배면 천공 · ⑦ 침하핀 ≠ 지표침하계

---

## §2 IMG-096 — 주변지반 계측 설치 대표 단면도

| 항목 | 경로 |
|------|------|
| **복붙** | [57 §8.1](./57-IMG-096-가시설-주변지반-계측-표현-표준.md) · [100 퀵스타트](./100-W1-IMG-096-PNG-제작자-퀵스타트.md) |
| redline | [v4](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-096_redline_v4_외부PNG.md) |
| nodeId | `fields/retaining-excavation/surrounding-ground` |

**Top 3:** MIX·슬립면 금지 · H=굴착깊이 · ② 측점/핀(로거 X)

---

## §3 IMG-004 — 어스앵커 하중계 설치 개념도

| 항목 | 경로 |
|------|------|
| **복붙** | [54 §15](./54-IMG-004-어스앵커-하중계-설치-표현-표준.md) · [101 퀵스타트](./101-W1-IMG-004-PNG-제작자-퀵스타트.md) |
| ImageWorks | [prompt v3](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-004_어스앵커_하중계_설치_개념도.md) |
| redline | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-004_redline_v2_외부PNG.md) |
| nodeId | `fields/retaining-excavation/anchor` |

**Top 3:** ANC-AXIS 사선 동축 · T/P 분리 · LC 지중 금지

---

## 등록 명령 (예시)

```bash
npm run register:figure -- --id IMG-002 --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.png --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run register:figure -- --id IMG-096 --input assets/images/technology/source/IMG-096_*.png --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run register:figure -- --id IMG-004 --input assets/images/technology/source/IMG-004_*.png --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-a
npm run verify:local
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase A 복붙 인덱스 — 002·096·004 · sign:phase-a 연동 |
| 2026-06-26 | register:figure 필수 인자(--reviewer·--visual-grade) · 96 퀵스타트 링크 |
| 2026-06-26 | 100·101 퀵스타트 · 102 W1 허브 |
