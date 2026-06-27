# W3 Phase B — 외부 제작 패키지

대상 (1건): IMG-024
방식: AI/CAD → WebP 또는 PNG ≥1920×1080 (에이전트·Pillow·SVG 금지)

## 폴더

- prompts/   — 복붙 프롬프트 (P0 포함)
- redlines/  — 육안 검수 redline

## Figure별

### IMG-024 — 댐 안전관리 계측 체계도

- 퀵스타트: docs/105-W3-Phase-B-퀵스타트.md
- redline: redlines/IMG-024_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-024.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-024_댐-안전관리-계측-체계도_필댐6항목데이터흐름.webp

```powershell
npm run rework:preflight -- --id IMG-024
npm run rework:done -- --id IMG-024 --input assets/images/technology/source/IMG-024_댐-안전관리-계측-체계도_필댐6항목데이터흐름.webp --reviewer "검수자"
```

## Phase 서명

```powershell
npm run sign:phase-b
npm run sync:images
npm run build:content
npm run verify:content
```
