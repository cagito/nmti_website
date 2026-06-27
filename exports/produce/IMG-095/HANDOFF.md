# IMG-095 — 실시간·이벤트 계측 모드 토폴로지

## 상태

- phase: W11 / E
- hero: Y
- requiresReaudit: false
- source 자산: 있음 — 등록 가능
- 퀵스타트: docs/124-P0-IMG-094-운영모드-3종-제작자-퀵스타트.md

## 제작 규칙

- **금지:** Cursor/Pillow/SVG FT-A 단면 Figure
- **허용:** 외부 AI/CAD + redline 육안 PASS
- **해상도:** hero ≥ 1920×1080
- **FAIL = 폐기·재생성** (부분 수정 금지)

## 파일 (이 폴더)

- `prompt.txt` — AI/CAD에 붙여넣기
- `IMG-095_redline_v2_외부PNG.md` — 검수 redline

## 저장 경로

```
assets/images/technology/source/IMG-095_실시간-이벤트-계측-모드-토폴로지_고속샘플링impulse.webp
```

## 등록 (redline PASS 후)

```powershell
cd X:\website\homepage
npm run rework:preflight -- --id IMG-095
npm run rework:done -- --id IMG-095 --input assets/images/technology/source/IMG-095_실시간-이벤트-계측-모드-토폴로지_고속샘플링impulse.webp --reviewer "검수자"
```

Phase 서명: `npm run sign:phase-e -- --id IMG-095` (또는 phase 일괄)
