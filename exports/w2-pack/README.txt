# W2 Phase AA — 외부 제작 패키지

대상 (10건): IMG-016 · IMG-017 · IMG-018 · IMG-020 · IMG-021 · IMG-025 · IMG-027 · IMG-037 · IMG-038 · IMG-039
방식: AI/CAD → WebP 또는 PNG ≥1920×1080 (에이전트·Pillow·SVG 금지)

## 폴더

- prompts/   — 복붙 프롬프트 (P0 포함)
- redlines/  — 육안 검수 redline

## Figure별

### IMG-016 — 원호활동면 계측 해석도

- 퀵스타트: docs/103-W2-Phase-AA-REGENERATE-퀵스타트.md
- redline: redlines/IMG-016_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-016.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-016_원호활동면-계측-해석도_원호파괴지중경사계프로파일.webp

```powershell
npm run rework:preflight -- --id IMG-016
npm run rework:done -- --id IMG-016 --input assets/images/technology/source/IMG-016_원호활동면-계측-해석도_원호파괴지중경사계프로파일.webp --reviewer "검수자"
```

### IMG-017 — 평면활동면 계측 해석도

- 퀵스타트: docs/103-W2-Phase-AA-REGENERATE-퀵스타트.md
- redline: redlines/IMG-017_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-017.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-017_평면활동면-계측-해석도_암반사면평면파괴.webp

```powershell
npm run rework:preflight -- --id IMG-017
npm run rework:done -- --id IMG-017 --input assets/images/technology/source/IMG-017_평면활동면-계측-해석도_암반사면평면파괴.webp --reviewer "검수자"
```

### IMG-018 — 강우-지하수위-변위 상관도

- 퀵스타트: docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md
- redline: redlines/IMG-018_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-018.txt
- source: 있음
- 저장: assets/images/technology/source/IMG-018_external.webp

```powershell
npm run rework:preflight -- --id IMG-018
npm run rework:done -- --id IMG-018 --input assets/images/technology/source/IMG-018_external.webp --reviewer "검수자"
```

### IMG-020 — 압밀 침하 계측 개념도

- 퀵스타트: docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md
- redline: redlines/IMG-020_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-020.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-020_압밀-침하-계측-개념도_시간침하간극수압소산.webp

```powershell
npm run rework:preflight -- --id IMG-020
npm run rework:done -- --id IMG-020 --input assets/images/technology/source/IMG-020_압밀-침하-계측-개념도_시간침하간극수압소산.webp --reviewer "검수자"
```

### IMG-021 — 측방유동 계측도

- 퀵스타트: docs/103-W2-Phase-AA-REGENERATE-퀵스타트.md
- redline: redlines/IMG-021_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-021.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-021_측방유동-계측도_연약층측방변위경사계.webp

```powershell
npm run rework:preflight -- --id IMG-021
npm run rework:done -- --id IMG-021 --input assets/images/technology/source/IMG-021_측방유동-계측도_연약층측방변위경사계.webp --reviewer "검수자"
```

### IMG-025 — 지중경사계 시스템 구성도

- 퀵스타트: docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md
- redline: redlines/IMG-025_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-025.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-025_지중경사계-시스템-구성도_ProbeCableReadoutCasing.webp

```powershell
npm run rework:preflight -- --id IMG-025
npm run rework:done -- --id IMG-025 --input assets/images/technology/source/IMG-025_지중경사계-시스템-구성도_ProbeCableReadoutCasing.webp --reviewer "검수자"
```

### IMG-027 — 지중경사계 설치 단면도

- 퀵스타트: docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md
- redline: redlines/IMG-027_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-027.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-027_지중경사계-설치-단면도_보링그라우트안정층활동면.webp

```powershell
npm run rework:preflight -- --id IMG-027
npm run rework:done -- --id IMG-027 --input assets/images/technology/source/IMG-027_지중경사계-설치-단면도_보링그라우트안정층활동면.webp --reviewer "검수자"
```

### IMG-037 — 균열계 설치 개념도

- 퀵스타트: docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md
- redline: redlines/IMG-037_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-037.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-037_균열계-설치-개념도_균열양측앵커변위측정.webp

```powershell
npm run rework:preflight -- --id IMG-037
npm run rework:done -- --id IMG-037 --input assets/images/technology/source/IMG-037_균열계-설치-개념도_균열양측앵커변위측정.webp --reviewer "검수자"
```

### IMG-038 — 구조물 경사계 설치도

- 퀵스타트: docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md
- redline: redlines/IMG-038_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-038.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-038_구조물-경사계-설치도_벽체교각표면.webp

```powershell
npm run rework:preflight -- --id IMG-038
npm run rework:done -- --id IMG-038 --input assets/images/technology/source/IMG-038_구조물-경사계-설치도_벽체교각표면.webp --reviewer "검수자"
```

### IMG-039 — 신축계 설치 개념도

- 퀵스타트: docs/103-W2-Phase-AA-REGENERATE-퀵스타트.md
- redline: redlines/IMG-039_redline_v2_외부PNG.md
- 프롬프트: prompts/IMG-039.txt
- source: 없음 — 신규 제작 필요
- 저장: assets/images/technology/source/IMG-039_신축계-설치-개념도_이음부조인트상대변위.webp

```powershell
npm run rework:preflight -- --id IMG-039
npm run rework:done -- --id IMG-039 --input assets/images/technology/source/IMG-039_신축계-설치-개념도_이음부조인트상대변위.webp --reviewer "검수자"
```

## Phase 서명

```powershell
npm run sign:phase-aa
npm run sync:images
npm run build:content
npm run verify:content
```
