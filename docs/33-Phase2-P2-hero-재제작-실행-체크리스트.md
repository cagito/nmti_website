# Phase 2 — P2 hero·터널·교량 외부 PNG 재제작 실행 체크리스트

**Master:** [31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) §Phase 2  
**대상 목록:** `scripts/phase2-p2-heroes.json` (12종)  
**시작일:** 2026-06-26 · **완료일:** 2026-06-26 ✅

---

## 워크플로 (Figure 1장)

Phase 1과 동일 — [32-Phase1](./32-Phase1-P1-hero-재제작-실행-체크리스트.md) §워크플로 참조.

**추가 P0:** P0-3 데이터로거 **함체** · 단면 Figure는 P0-1·P0-2 ([TECHNICAL §0.0](./TECHNICAL_IMAGE_STANDARD.md))

---

## 진행 현황 (우선순위 순)

| ID | FT | migrationStatus | redline | 외부 PNG | visualReview | 비고 |
|----|-----|-----------------|---------|----------|--------------|------|
| IMG-004 | FT-A | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-004_redline_v1_외부PNG.md) | ✅ | ✅ | doc 26 |
| IMG-005 | FT-A | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-005_redline_v1_외부PNG.md) | ✅ | ✅ | doc 15 |
| IMG-078 | FT-B | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-078_redline_v1_외부PNG.md) | ✅ | ✅ | doc 21 |
| IMG-079 | FT-B | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-079_redline_v1_외부PNG.md) | ✅ | ✅ | doc 22 |
| IMG-097 | FT-B | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-097_redline_v1_외부PNG.md) | ✅ | ✅ | doc 23 |
| IMG-038 | FT-A | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-038_redline_v1_외부PNG.md) | ✅ | ✅ | 구조물경사계 |
| IMG-042 | FT-B | completed | [batch](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-042-043-085-086_redline_v1_외부PNG.md) | ✅ | ✅ | AMTS |
| IMG-043 | FT-B | completed | [batch](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-042-043-085-086_redline_v1_외부PNG.md) | ✅ | ✅ | GNSS |
| IMG-061 | FT-A | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-061_redline_v1_외부PNG.md) | ✅ | ✅ | 천단침하 |
| IMG-063 | FT-A | completed | [v1](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-063_redline_v1_외부PNG.md) | ✅ | ✅ | 막장 선행변위 |
| IMG-085 | FT-B | completed | [batch](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-042-043-085-086_redline_v1_외부PNG.md) | ✅ | ✅ | 교량 종횡변위 |
| IMG-086 | FT-B | completed | [batch](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-042-043-085-086_redline_v1_외부PNG.md) | ✅ | ✅ | 교량 진동 |

**진행:** **12/12 완료** ✅ (2026-06-26)

---

## Exit 조건 (Phase 2)

- [x] 위 12종 전부 `migrationStatus: completed`
- [x] 전부 `productionMethod: ai-reviewed` 또는 `cad`
- [x] 전부 `visualReview.grade` = PASS 또는 MINOR_FIX
- [x] `reviewer` ≠ 「일괄 마이그레이션」
- [x] P2 subset registry 검증 12/12 · `audit:images:strict` OK

---

## 이전 / 다음

- **Phase 1:** [32](./32-Phase1-P1-hero-재제작-실행-체크리스트.md) — **11/11 완료** ✅
- **Phase 3:** [31 §Phase 3](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) ← **현재**
