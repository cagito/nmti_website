# Book 현장 도면 — 3단계 수동 검수 체크리스트

**갱신:** 2026-06-29  
**선행:** 1·2단계 자동 PASS — [book-plan-review-2026-06](./book-plan-review-2026-06.md)  
**워크시트:** [book-plan-stage3-prep](./book-plan-stage3-prep.md)  
**Rule gate:** `npm run audit:book-stage3` → [book-stage3-rule-gate-report](./book-stage3-rule-gate-report.md)

---

## 1. 검수 순서

1. **Rule gate** — `npm run audit:book-stage3` (registry · WebP · redline)
2. **픽셀·범례** — 아래 §2 항목 (PDF 도면 ↔ hero Figure)
3. **기록** — [159-book-3단계-실행기록](./159-book-3단계-실행기록.md) 또는 stage3-prep 하단

## 2. 픽셀·범례 체크 (공통)

| # | 항목 | PASS | FAIL |
|---|------|------|------|
| P1 | PDF **범례 기호** = 웹 Figure **동일 계기 종류** | ☐ | 혼동(예: IPI↔MPBX) |
| P2 | **측점 번호·배치** = 현장 도면과 **논리 일치** (번호 1:1 불필요) | ☐ | 설치 위치 반대 |
| P3 | **측정 방향·화살표** = 계기 물리량 | ☐ | |
| P4 | **현장 사례** 라벨 — hero를 특정 현장명으로 고정하지 않음 | ☐ | |
| P5 | 스캔 PDF — 텍스트 추출 불가 시 **육안 전체** | ☐ | |

## 3. 우선 PDF ↔ Figure

| PDF | Figure | 노드 |
|-----|--------|------|
| 대구 본문 | IMG-035·036·045 | load-cell · strain · datalogger |
| 대구 부록 | IMG-036·043 | strain · gnss |
| 대구 준공도면 | IMG-036 | strain |
| 유지관리 도면 | IMG-008·031·040·045 | convergence · piezo · disp · logger |
| 그랑르피에드 | IMG-027·030·032·036 | IPI · WLM · settlement · strain |
| GNSS.pdf | IMG-043·032 | gnss · settlement |

## 4. GNSS.pdf 추가 (book/09)

| # | PDF 개념 | IMG-043 대조 |
|---|----------|--------------|
| G1 | 기준국 · 이동국 | ☐ |
| G2 | RTK · 서버·무선 | ☐ |
| G3 | ΔX·ΔY·ΔZ (3D) | ☐ |
| G4 | 침하계(032) ≠ GNSS 처짐 혼동 | ☐ |

**자동:** `npm run audit:book` · `npm run audit:img043` · `npm run audit:img032`
