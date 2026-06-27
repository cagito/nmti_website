# Phase 5 — CI 잠금·운영 체크리스트

**Master:** [31 §Phase 5](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md)  
**완료:** 2026-06-26

---

## 작업

| # | 작업 | 상태 |
|---|------|------|
| 5.0 | Sprint0 FT-A/B **089–093** → `ai-reviewed` | ✅ |
| 5.1 | `verify:local` → `audit:figure-production:strict` | ✅ |
| 5.2 | FT-A/B Pillow render 가드 (`render_guard.py`) | ✅ (Phase 0~) |
| 5.3 | `composite_*` ai-reviewed 패치 금지 | ✅ (Phase 4) |
| 5.4 | `audit:figure-production:strict` **0 errors** | ✅ |
| 5.5 | `일괄 마이그레이션` reviewer 0건 | ✅ |

**Redline:** [IMG-089-093 sprint0](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-089-093_sprint0_redline_v1_외부PNG.md)

---

## Exit (Program E1–E4)

- [x] FT-A/B **pillow 0건**
- [x] `npm run audit:figure-production:strict` 통과
- [x] `verify:local`에 strict 포함
- [ ] FTP 후 `verify:production` 13/13 (배포 시)

**운영 확인 (2026-06-26):** `npm run verify:production` **24/24** ✅

**이전:** [35-Phase4](./35-Phase4-FT-C-출판검수-체크리스트.md) **36/36** ✅
