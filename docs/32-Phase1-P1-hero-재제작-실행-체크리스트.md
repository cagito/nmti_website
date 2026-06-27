# Phase 1 — P1 hero 외부 PNG 재제작 실행 체크리스트

**Master:** [31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) §Phase 1  
**대상 목록:** `scripts/phase1-p1-heroes.json` (11종)  
**시작일:** 2026-06-26 · **완료일:** 2026-06-26 ✅

---

## 워크플로 (Figure 1장)

1. ImageWorks 프롬프트 v2+ · INSTRUMENTATION 해당 §
2. **redline** 작성·검수자 승인 (`ImageWorks/.../redlines/` — 필요 시 신규)
3. AI/CAD PNG ≥1920×1080
4. 기술 게이트 + 출판 게이트 ([IMAGE_AUDIT_CHECKLIST](./IMAGE_AUDIT_CHECKLIST.md) §5.1 V1~V7)
5. 등록:

```bash
node scripts/register-external-figure.mjs \
  --id IMG-008 \
  --input path/to/IMG-008_....png \
  --method ai-reviewed \
  --reviewer "검수자명" \
  --visual-grade PASS \
  --tech-grade PASS \
  --notes "redline v8 승인"
```

6. 검증: `npm run audit:figure-production` · `npm run audit:images:strict`

**금지:** Pillow `render-*.py` (FT-A/B 차단) · 에이전트 SVG · redline 없는 1-shot AI

---

## 진행 현황

| ID | FT | migrationStatus | redline | 외부 PNG | visualReview | 비고 |
|----|-----|-----------------|---------|----------|--------------|------|
| IMG-008 | FT-B | completed | [v8](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-008_redline_v8_외부PNG.md) | ✅ | ✅ | **완료** 2026-06-26 · ai-reviewed |
| IMG-001 | FT-A | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-001_redline_v1_외부PNG.md) | ✅ | ✅ | **완료** 2026-06-26 |
| IMG-002 | FT-A | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-002_redline_v1_외부PNG.md) | ✅ | ✅ | **완료** 2026-06-26 · ai-reviewed |
| IMG-015 | FT-A | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-015_redline_v1_외부PNG.md) | ✅ | ✅ | **완료** 2026-06-26 |
| IMG-025 | FT-B | completed | ☐ | ✅ | ✅ | **완료** 2026-06-26 |
| IMG-027 | FT-A | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-027_redline_v1_외부PNG.md) | ✅ | ✅ | **완료** 2026-06-26 |
| IMG-030 | FT-A | completed | ☐ | ✅ | ✅ | **완료** 2026-06-26 |
| IMG-031 | FT-A | completed | ☐ | ✅ | ✅ | **완료** 2026-06-26 · EXC-03 · ai-reviewed |
| IMG-034 | FT-A | completed | ☐ | ✅ | ✅ | **완료** 2026-06-26 · 토압계 · ai-reviewed |
| IMG-062 | FT-A | completed | ☐ | ✅ | ✅ | **완료** 2026-06-26 · 002 ②③ 이형 · ai-reviewed |
| IMG-096 | FT-A | completed | ☐ | ✅ | ✅ | **완료** 2026-06-26 · doc 18 · ai-reviewed |

**진행:** **11/11 완료** (2026-06-26)

상태 범례: ☐ 미완 · ✅ 완료

---

## 인프라 (Phase 1)

| 도구 | 경로 |
|------|------|
| P1 목록 | `scripts/phase1-p1-heroes.json` |
| migration 표시 | `node scripts/seed-phase1-migration.mjs` |
| PNG 등록 | `node scripts/register-external-figure.mjs` |
| Pillow 차단 | `scripts/lib/render_guard.py` |
| 정책 감사 | `npm run audit:figure-production` |

---

## Exit 조건 (Phase 1)

- [x] 위 11종 전부 `migrationStatus: completed`
- [x] 전부 `productionMethod: ai-reviewed` 또는 `cad`
- [x] 전부 `visualReview.grade` = PASS 또는 MINOR_FIX
- [x] `reviewer` ≠ 「일괄 마이그레이션」
- [x] P1 subset registry 검증 11/11 (2026-06-26) · `audit:images:strict` OK

> **P0-3(데이터로거 함체)** 신규 규칙 — Phase 1 PNG는 **육안 재검수** 권장 ([TECHNICAL §0.0](./TECHNICAL_IMAGE_STANDARD.md) · [06 로거](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md))

---

## 다음 (Phase 2)

[31](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) §Phase 2 — IMG-004·005·038·078·079·097 등
