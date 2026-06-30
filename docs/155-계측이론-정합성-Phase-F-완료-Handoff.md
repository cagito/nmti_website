# 계측이론 정합성 Phase F — 완료 Handoff

**완료:** 2026-06-29  
**선행:** [150](./150-DOCS-계측이론-정합성-수정계획.md) · [154](./154-계측이론-정합성-Phase-F-실행계획.md)

---

## 1. 산출 요약

| 영역 | 결과 |
|------|------|
| IMG-103 GNSS | [148](./148-IMG-103-교량-상부구조-GNSS-처짐-표현-표준.md) 정본 · 120 deprecated |
| IMG-024 침윤선 | [152](./152-IMG-024-댐-피에조-침윤선-정합성-수정계획.md) filter tip ≠ 침윤선 |
| 건설중 용어 | [153](./153-계측문서-용어-정본-건설중-계측.md) · slug `construction-phase` |
| 건설중 hero stub | IMG-111 · 112 · 113 + IMG-100 건축 |
| gap-matrix | **🔲 0** — mapped prompts 전부 ✅ |
| doc-links | `validate:doc-links:strict` PASS |
| 로컬 게이트 | `verify:local` PASS |

---

## 2. 정본 인덱스

[CANONICAL_DOC_INDEX.md](./CANONICAL_DOC_INDEX.md) — Agent·검수 시 **정본 열** 우선.

---

## 3. 배포 체크리스트

```bash
# 로컬 (FTP 전)
npm run verify:local
npm run verify:deploy

# FTP 동기화 (git-sync / 수동)
# … homepage 전체 또는 technology·docs·ImageWorks 변경분

# 운영 확인
npm run verify:production   # 28/28 목표
```

**주의:** 상위 `website/web.config` **수정 금지** — [DEPLOYMENT-IIS](./DEPLOYMENT-IIS.md)

---

## 4. 잔여·선택 (Phase G)

| 항목 | 우선순위 | 비고 |
|------|----------|------|
| FTP 반영 | P0 | Phase F 문서·프롬프트·registry |
| IMG-024 v3 픽셀 재검수 | P2 | registry PASS · redline 권장 |
| IMG-091 MPBX v2 | P2 | 재작도 권장 |
| `01-터널` §5·§6 중복 bullet | P3 | kds-promoted 중복 — 별도 정리 |
| Figure rework PNG | 별도 | [119 Handoff](./119-PNG-재작도-프로그램-운영-Handoff.md) |
| Phase G | [156](./156-계측이론-정합성-Phase-G-실행계획.md) | kds bullet dedupe · prompt sync |

---

## 5. 검증 명령 (일상)

```bash
npm run validate:doc-links:strict
npm run build:gap-matrix
npm run sync:master-captions    # master ↔ images.js
node scripts/validate-terminology.mjs
npm run verify:local
```
