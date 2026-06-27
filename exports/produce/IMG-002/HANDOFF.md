# IMG-002 — 흙막이 계측 설치 대표 단면도

## 상태

- phase: W1 / A
- hero: Y
- requiresReaudit: false
- source 자산: 없음 — 신규 제작 필요
- 퀵스타트: docs/96-W1-IMG-002-PNG-제작자-퀵스타트.md

## 제작 규칙

- **금지:** Cursor/Pillow/SVG FT-A 단면 Figure
- **허용:** 외부 AI/CAD + redline 육안 PASS
- **해상도:** hero ≥ 1920×1080
- **FAIL = 폐기·재생성** (부분 수정 금지)

## 파일 (이 폴더)

- `prompt.txt` — AI/CAD에 붙여넣기
- `IMG-002_redline_v5_외부PNG.md` — 검수 redline

## 저장 경로

```
assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.webp
```

## 등록 (redline PASS 후)

```powershell
cd X:\website\homepage
npm run rework:preflight -- --id IMG-002
npm run rework:done -- --id IMG-002 --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.webp --reviewer "검수자"
```

Phase 서명: `npm run sign:phase-a -- --id IMG-002` (또는 phase 일괄)
