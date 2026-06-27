# Phase AD — ZIP 5차 재작도 실행 체크리스트

**상위:** [96-Phase AD](./96-외부-ZIP-신규-심각오류-10종-Phase-AD-수정계획.md) · [89 작업순서](./89-PNG-재작도-통합-작업순서.md)  
**복붙:** [97](./97-Phase-AD-복붙-프롬프트-정본.md) · **IMG별 exit:** [99](./99-Phase-AD-IMG별-오류분석-및-재작업-계획.md)

---

## 0. 사전

- [ ] `npm run patch:registry-phase-ad` — 10종 `requiresReaudit: true`
- [ ] [11-그래프·운영 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/11_그래프_운영_대시보드_이미지_가이드.md) 숙지
- [ ] TECHNICAL §0.0e · OPS-VERIFY-01

---

## 1. P0 — REGENERATE (4종)

| □ | ID | 산출 PNG | redline v2 | 금지 0건 |
|---|-----|----------|------------|----------|
| □ | IMG-050 | `assets/images/technology/source/` | `redlines/IMG-050_redline_v2_외부PNG.md` | GRAPH-PRED-01 |
| □ | IMG-052 | 동일 | `IMG-052_redline_v2_외부PNG.md` | LOAD-STAGE-01 |
| □ | IMG-054 | 동일 | `IMG-054_redline_v2_외부PNG.md` | ALARM-FLOW-01 |
| □ | IMG-056 | 동일 | `IMG-056_redline_v2_외부PNG.md` | DASH-STATE-01 |

---

## 2. P1 — MAJOR_FIX (6종)

| □ | ID | 방법 | 표준 |
|---|-----|------|------|
| □ | IMG-047 | `render-power-figures.py` v+1 또는 AI | SOLAR-SIZE-01 |
| □ | IMG-048 | 블록 다이어그램 | LTE-BUF-01 |
| □ | IMG-049 | 그래프 AI/Pillow | DISP-GRAPH-01 |
| □ | IMG-051 | 그래프 AI/Pillow | PIEZO-DISS-01 |
| □ | IMG-053 | 그래프 AI/Pillow | VIB-GRAPH-01 |
| □ | IMG-055 | 모바일 UI mockup | MOB-ALARM-01 |

---

## 3. 빌드·서명

```bash
python scripts/convert-technology-webp.py   # PNG 교체 후
node scripts/generate-image-assets.mjs
npm run audit:images:strict
npm run sign:phase-ad
npm run verify:production
```

- [ ] `prohibitedVerified: true` 10종
- [ ] `reviewGrade: PASS` · `requiresReaudit: false`
- [ ] ImageWorks `prompts/IMG-###` §Phase AD 반영
- [ ] `03_IMAGE_MASTER_LIST.json` caption 갱신

---

## 4. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | Phase AD 실행 체크리스트 |
| 2026-06-26 | redline v2 10종 · sign:phase-ad · [110 퀵스타트](./110-W9-Phase-AD-퀵스타트.md) |
