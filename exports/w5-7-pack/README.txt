# W5-7 Phase AB — 외부 제작 패키지

대상 (6건): IMG-026 · IMG-028 · IMG-030 · IMG-035 · IMG-040 · IMG-042
방식: AI/CAD → WebP 또는 PNG ≥1920×1080 (에이전트·Pillow·SVG 금지)

## 폴더

- prompts/   — 복붙 프롬프트 (P0 포함)
- redlines/  — 육안 검수 redline

## Figure별

### IMG-026 — 지중경사계 케이싱 단면도

- 퀵스타트: docs/107-W5-Phase-AB-REGENERATE-퀵스타트.md
- redline: redlines/IMG-026_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-026.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-026_지중경사계-케이싱-단면도_GuideGroove4방향ProbeWheel.webp

```powershell
npm run rework:preflight -- --id IMG-026
npm run rework:done -- --id IMG-026 --input assets/images/technology/source/IMG-026_지중경사계-케이싱-단면도_GuideGroove4방향ProbeWheel.webp --reviewer "검수자"
```

### IMG-028 — 지중경사계 측정 원리도

- 퀵스타트: docs/107-W5-Phase-AB-REGENERATE-퀵스타트.md
- redline: redlines/IMG-028_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-028.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-028_지중경사계-측정-원리도_기울기누적변위계산.webp

```powershell
npm run rework:preflight -- --id IMG-028
npm run rework:done -- --id IMG-028 --input assets/images/technology/source/IMG-028_지중경사계-측정-원리도_기울기누적변위계산.webp --reviewer "검수자"
```

### IMG-030 — 지하수위계 설치 개념도

- 퀵스타트: docs/107-W5-Phase-AB-REGENERATE-퀵스타트.md
- redline: redlines/IMG-030_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-030.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-030_지하수위계-설치-개념도_관측공수위센서케이블보호함.webp

```powershell
npm run rework:preflight -- --id IMG-030
npm run rework:done -- --id IMG-030 --input assets/images/technology/source/IMG-030_지하수위계-설치-개념도_관측공수위센서케이블보호함.webp --reviewer "검수자"
```

### IMG-035 — 하중계 설치 개념도

- 퀵스타트: docs/107-W5-Phase-AB-REGENERATE-퀵스타트.md
- redline: redlines/IMG-035_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-035.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-035_하중계-설치-개념도_버팀보앵커하중전달.webp

```powershell
npm run rework:preflight -- --id IMG-035
npm run rework:done -- --id IMG-035 --input assets/images/technology/source/IMG-035_하중계-설치-개념도_버팀보앵커하중전달.webp --reviewer "검수자"
```

### IMG-040 — 변위계 설치 개념도

- 퀵스타트: docs/107-W5-Phase-AB-REGENERATE-퀵스타트.md
- redline: redlines/IMG-040_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-040.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-040_변위계-설치-개념도_기준점대상점변위측정.webp

```powershell
npm run rework:preflight -- --id IMG-040
npm run rework:done -- --id IMG-040 --input assets/images/technology/source/IMG-040_변위계-설치-개념도_기준점대상점변위측정.webp --reviewer "검수자"
```

### IMG-042 — 자동광파기 계측 개념도

- 퀵스타트: docs/107-W5-Phase-AB-REGENERATE-퀵스타트.md
- redline: redlines/IMG-042_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-042.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-042_자동광파기-계측-개념도_TotalStation프리즘좌표변위.webp

```powershell
npm run rework:preflight -- --id IMG-042
npm run rework:done -- --id IMG-042 --input assets/images/technology/source/IMG-042_자동광파기-계측-개념도_TotalStation프리즘좌표변위.webp --reviewer "검수자"
```

## Phase 서명

```powershell
npm run sign:phase-ab
npm run sync:images
npm run build:content
npm run verify:content
```
