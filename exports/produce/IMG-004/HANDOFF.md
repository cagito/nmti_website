# IMG-004 — 어스앵커 하중계 설치 개념도

## 상태

- phase: W1 / A
- hero: Y
- requiresReaudit: false
- source 자산: 없음 — 신규 제작 필요
- 퀵스타트: docs/101-W1-IMG-004-PNG-제작자-퀵스타트.md

## 제작 규칙

- **금지:** Cursor/Pillow/SVG FT-A 단면 Figure
- **허용:** 외부 AI/CAD + redline 육안 PASS
- **해상도:** hero ≥ 1920×1080
- **FAIL = 폐기·재생성** (부분 수정 금지)

## 파일 (이 폴더)

- `prompt.txt` — AI/CAD에 붙여넣기
- `IMG-004_redline_v2_외부PNG.md` — 검수 redline

## 저장 경로

```
assets/images/technology/source/IMG-004_어스앵커-하중계-설치-개념도_앵커두부정착구.webp
```

## 등록 (redline PASS 후)

```powershell
cd X:\website\homepage
npm run rework:preflight -- --id IMG-004
npm run rework:done -- --id IMG-004 --input assets/images/technology/source/IMG-004_어스앵커-하중계-설치-개념도_앵커두부정착구.webp --reviewer "검수자"
```

Phase 서명: `npm run sign:phase-a -- --id IMG-004` (또는 phase 일괄)
