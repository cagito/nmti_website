# IMG-035 — 하중계 설치 개념도

## 상태

- phase: W5-7 / AB
- hero: Y
- requiresReaudit: true
- source 자산: 없음 — 신규 제작 필요
- 퀵스타트: docs/107-W5-Phase-AB-REGENERATE-퀵스타트.md

## 제작 규칙

- **금지:** Cursor/Pillow/SVG FT-A 단면 Figure
- **허용:** 외부 AI/CAD + redline 육안 PASS
- **해상도:** hero ≥ 1920×1080
- **FAIL = 폐기·재생성** (부분 수정 금지)

## 파일 (이 폴더)

- `prompt.txt` — AI/CAD에 붙여넣기
- `IMG-035_redline_v2_외부PNG.md` — 검수 redline

## 저장 경로

```
assets/images/technology/source/IMG-035_하중계-설치-개념도_버팀보앵커하중전달.webp
```

## 등록 (redline PASS 후)

```powershell
cd X:\website\homepage
npm run rework:preflight -- --id IMG-035
npm run rework:done -- --id IMG-035 --input assets/images/technology/source/IMG-035_하중계-설치-개념도_버팀보앵커하중전달.webp --reviewer "검수자"
```

Phase 서명: `npm run sign:phase-ab -- --id IMG-035` (또는 phase 일괄)
