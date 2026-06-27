# IMG-079 — 숏크리트 응력·변형 계측 개념도

## 상태

- phase: W8 / AC
- hero: Y
- requiresReaudit: true
- source 자산: 없음 — 신규 제작 필요
- 퀵스타트: docs/109-W8-Phase-AC-퀵스타트.md

## 제작 규칙

- **금지:** Cursor/Pillow/SVG FT-A 단면 Figure
- **허용:** 외부 AI/CAD + redline 육안 PASS
- **해상도:** hero ≥ 1920×1080
- **FAIL = 폐기·재생성** (부분 수정 금지)

## 파일 (이 폴더)

- `prompt.txt` — AI/CAD에 붙여넣기
- `IMG-079_redline_v2_외부PNG_AC.md` — 검수 redline

## 저장 경로

```
assets/images/technology/source/IMG-079_숏크리트-응력-변형-계측-개념도_변형률계매립.webp
```

## 등록 (redline PASS 후)

```powershell
cd X:\website\homepage
npm run rework:preflight -- --id IMG-079
npm run rework:done -- --id IMG-079 --input assets/images/technology/source/IMG-079_숏크리트-응력-변형-계측-개념도_변형률계매립.webp --reviewer "검수자"
```

Phase 서명: `npm run sign:phase-ac -- --id IMG-079` (또는 phase 일괄)
