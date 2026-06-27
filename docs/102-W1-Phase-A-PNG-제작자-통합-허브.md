# W1 — Phase A P0 PNG 제작자 통합 허브 (002·096·004)

**상위:** [89 작업순서](./89-PNG-재작도-통합-작업순서.md) W1 · [83 실행 체크리스트](./83-Phase-A-P0-재작도-실행-체크리스트.md) · [92 복붙 인덱스](./92-Phase-A-복붙-프롬프트-정본.md)

> **정책:** 전면 재작성만 · Pillow·SVG·inpaint 금지 · PNG ≥1920×1080  
> **Exit:** 3건 등록 + redline 서명 + `npm run sign:phase-a` + `verify:local`

---

## 작업 순서

| # | ID | 퀵스타트 | 복붙 정본 | redline |
|---|-----|----------|-----------|---------|
| 1 | **002** | [96](./96-W1-IMG-002-PNG-제작자-퀵스타트.md) | [52 §12](./52-IMG-002-전면재작성-프롬프트-정본.md) | [v5](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-002_redline_v5_외부PNG.md) |
| 2 | **096** | [100](./100-W1-IMG-096-PNG-제작자-퀵스타트.md) | [57 §8.1](./57-IMG-096-가시설-주변지반-계측-표현-표준.md) | [v4](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-096_redline_v4_외부PNG.md) |
| 3 | **004** | [101](./101-W1-IMG-004-PNG-제작자-퀵스타트.md) | [54 §15](./54-IMG-004-어스앵커-하중계-설치-표현-표준.md) | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-004_redline_v2_외부PNG.md) |

---

## 공통 워크플로 (Figure 1건)

1. 퀵스타트 또는 **`npm run rework:prompt -- --id IMG-###`** → AI/CAD에 붙여넣기  
2. PNG 생성 → **redline** 육안 (FAIL = 폐기)  
3. `assets/images/technology/source/` 에 [canonical 파일명](./118-PNG-canonical-파일명-W1-W11-정본.md)으로 저장  
4. `register:figure` (`--reviewer` · `--visual-grade PASS` 필수)  
5. `npm run build:images`  
6. 개별: `npm run sign:phase-a -- --id IMG-###`  
7. **3건 완료 후:** `npm run sign:phase-a` · `npm run verify:local`

---

## 일괄 서명 (3건 PNG·redline 완료 후)

```powershell
npm run sign:phase-a
npm run verify:local
```

---

## W1 완료 후

→ [89 W2](./89-PNG-재작도-통합-작업순서.md) Phase AA REGENERATE (016·017·021·039)  
→ [103 W2](./103-W2-Phase-AA-REGENERATE-퀵스타트.md) · [108 마스터](./108-PNG-재작도-제작자-마스터-인덱스.md)

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase A W1 통합 허브 — 002·096·004 퀵스타트 연결 |
