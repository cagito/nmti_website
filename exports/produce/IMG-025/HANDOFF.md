# IMG-025 — 지중경사계 시스템 구성도

## 상태

- phase: W2 / AA
- hero: Y
- requiresReaudit: true
- source 자산: 없음 — 신규 제작 필요
- 퀵스타트: docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md

## 제작 규칙

- **금지:** Cursor/Pillow/SVG FT-A 단면 Figure
- **허용:** 외부 AI/CAD + redline 육안 PASS
- **해상도:** hero ≥ 1920×1080
- **FAIL = 폐기·재생성** (부분 수정 금지)

## 파일 (이 폴더)

- `prompt.txt` — AI/CAD에 붙여넣기
- `IMG-025_redline_v2_외부PNG.md` — 검수 redline

## 저장 경로

```
assets/images/technology/source/IMG-025_지중경사계-시스템-구성도_ProbeCableReadoutCasing.webp
```

## 등록 (redline PASS 후)

```powershell
cd X:\website\homepage
npm run rework:preflight -- --id IMG-025
npm run rework:done -- --id IMG-025 --input assets/images/technology/source/IMG-025_지중경사계-시스템-구성도_ProbeCableReadoutCasing.webp --reviewer "검수자"
```

Phase 서명: `npm run sign:phase-aa -- --id IMG-025` (또는 phase 일괄)
