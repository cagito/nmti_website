# Phase 4 — FT-C 출판 검수 체크리스트

**Master:** [31 §Phase 4](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md)  
**대상:** `scripts/phase4-p4-figures.json` (36종 FT-C)  
**완료:** 2026-06-26

---

## 작업

| # | 작업 | 상태 |
|---|------|------|
| 4.1 | FT-C **visualReview PASS** · `npm run sign:phase4` | ✅ |
| 4.2 | `composite_*` — ai-reviewed FT-A/B 패치 금지 (`enforce_composite_policy`) | ✅ |
| 4.3 | 그래프·블록 unknown → `productionMethod: pillow` | ✅ |
| 4.4 | 품질 미달 → `ai-reviewed` 승격 (선택) | — |

---

## 그룹 (36종)

| 그룹 | ID | 상태 |
|------|-----|------|
| pillow-core | 006·045·047·048·056·058·065–077 | ✅ |
| graph-block | 018·029·044·046·049–055·057·059·060 | ✅ |
| modes-done | 094·095·102 | ✅ |

**진행:** **36/36** ✅

---

## Exit

- [x] FT-C 전종 `visualReview.grade: PASS`
- [x] FT-C `productionMethod` ≠ unknown
- [x] FT-C `일괄 마이그레이션` reviewer **0건**

**다음:** [31 §Phase 5](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) CI strict · render 잠금

**이전:** [34-Phase3](./34-Phase3-FT-A-B-잔여-재제작-체크리스트.md) **38/38** ✅
