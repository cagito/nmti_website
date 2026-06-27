# W1 Phase A — 외부 제작 패키지

대상 (3건): IMG-002 · IMG-096 · IMG-004
방식: AI/CAD → WebP 또는 PNG ≥1920×1080 (에이전트·Pillow·SVG 금지)

## 폴더

- prompts/   — 복붙 프롬프트 (P0 포함)
- redlines/  — 육안 검수 redline

## Figure별

### IMG-002 — 흙막이 계측 설치 대표 단면도

- 퀵스타트: docs/96-W1-IMG-002-PNG-제작자-퀵스타트.md
- redline: redlines/IMG-002_redline_v5_외부PNG.md
- 프롬프트: prompts/IMG-002.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.webp

```powershell
npm run rework:preflight -- --id IMG-002
npm run rework:done -- --id IMG-002 --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.webp --reviewer "검수자"
```

### IMG-096 — 가시설 주변지반 계측 설치 대표 단면도

- 퀵스타트: docs/100-W1-IMG-096-PNG-제작자-퀵스타트.md
- redline: redlines/IMG-096_redline_v4_외부PNG.md
- 프롬프트: prompts/IMG-096.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-096_주변지반-계측-설치-대표-단면도_굴착영향권복합.webp

```powershell
npm run rework:preflight -- --id IMG-096
npm run rework:done -- --id IMG-096 --input assets/images/technology/source/IMG-096_주변지반-계측-설치-대표-단면도_굴착영향권복합.webp --reviewer "검수자"
```

### IMG-004 — 어스앵커 하중계 설치 개념도

- 퀵스타트: docs/101-W1-IMG-004-PNG-제작자-퀵스타트.md
- redline: redlines/IMG-004_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-004.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-004_어스앵커-하중계-설치-개념도_앵커두부정착구.webp

```powershell
npm run rework:preflight -- --id IMG-004
npm run rework:done -- --id IMG-004 --input assets/images/technology/source/IMG-004_어스앵커-하중계-설치-개념도_앵커두부정착구.webp --reviewer "검수자"
```

## Phase 서명

```powershell
npm run sign:phase-a
npm run sync:images
npm run build:content
npm run verify:content
```
