# Phase A — P0 Figure 재작도 실행 체크리스트

**상위:** [82-통합 수정계획](./82-Figure-재작도-통합-수정계획.md) §3.1 · [92 복붙 정본](./92-Phase-A-복붙-프롬프트-정본.md) · **[102 W1 허브](./102-W1-Phase-A-PNG-제작자-통합-허브.md)**  
**정책:** **전면 재작성만** · Pillow·SVG·inpaint **금지**  
**Exit:** 3건 redline 서명 · `register:figure` · `npm run sign:phase-a` · `verify:local`

---

## 진행 표

| 순위 | ID | redline | 복붙 블록 | PNG | redline 서명 | registry | verify |
|------|-----|---------|-----------|-----|--------------|----------|--------|
| 1 | **002** | [v5](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-002_redline_v5_외부PNG.md) | [96](./96-W1-IMG-002-PNG-제작자-퀵스타트.md) → [52 §12](./52-IMG-002-전면재작성-프롬프트-정본.md) | ☐ | ☐ | ☐ | ☐ |
| 2 | **096** | [v4](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-096_redline_v4_외부PNG.md) | [100](./100-W1-IMG-096-PNG-제작자-퀵스타트.md) → [57 §8.1](./57-IMG-096-가시설-주변지반-계측-표현-표준.md) | ☐ | ☐ | ☐ | ☐ |
| 3 | **004** | [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-004_redline_v2_외부PNG.md) | [101](./101-W1-IMG-004-PNG-제작자-퀵스타트.md) → [54 §15](./54-IMG-004-어스앵커-하중계-설치-표현-표준.md) | ☐ | ☐ | ☐ | ☐ |

---

## Figure별 Exit (하나라도 □ → 재생성)

### IMG-002

- [ ] 앵커 LC = 굴착측 두부 (A1)
- [ ] SOE-INST-01: IPI·지하수위·간극수압 = 배면 천공 (S1~S3)
- [ ] ⑦ 지표침하 측점/핀 ≠ 「지표침하계」 (A4)
- [ ] SETTLE-PLATE-01: 자동 침하계 시 다져진 토사 (P1)
- [ ] 범례 ⑪ 로거 = [계측 시스템] 분리
- [ ] 1920×1080 · 한글 라벨

**등록 예시:**

```bash
npm run register:figure -- --id IMG-002 --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.png --method ai-reviewed --reviewer "검수자" --visual-grade PASS
npm run build:images
npm run sign:phase-a -- --id IMG-002
npm run verify:local
```

상세: [96-W1 퀵스타트](./96-W1-IMG-002-PNG-제작자-퀵스타트.md)

---

### IMG-096

- [ ] 슬립면·옹벽 MIX 없음
- [ ] H = 굴착깊이 · 1H~2H = 검토 범위 예시
- [ ] ② 지표침하 **측점/핀** · 로거 직결 X
- [ ] SOE-INST-01: ①③④ 배면 천공
- [ ] redline v3 전항 PASS

---

### IMG-004

- [ ] ANC-AXIS: 사선 동축 두부
- [ ] T / P 분리 (≠ P=T)
- [ ] LC = 반력판–헤드 사이 · 지중 금지
- [ ] 서버·모바일 흐름도 없음
- [ ] redline v2 전항 PASS

---

## 완료 후 registry notes (템플릿)

| ID | notes 예시 |
|----|------------|
| 002 | v5 ai-reviewed PASS — redline v5 서명 YYYY-MM-DD |
| 096 | v3 ai-reviewed PASS — SETTLE·MIX·SOE-INST redline v3 |
| 004 | v3 ai-reviewed PASS — ANC-AXIS redline v2 |

**일괄 서명:** `npm run sign:phase-a` (또는 `--id IMG-002`)

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase A 실행 체크리스트 — 002·096·004 |
