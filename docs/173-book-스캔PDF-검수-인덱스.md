# Book 스캔 PDF — 3단계 육안 검수 인덱스

**갱신:** 2026-06-29  
**기준:** `crosscheck:book-plans` · 추출 문자 **< 50** (스캔·이미지 위주)  
**체크리스트:** [book-plan-manual-review-checklist](./book-plan-manual-review-checklist.md) §2 P5

---

## 1. 스캔 PDF 목록 (6건)

| PDF | 페이지 | 추출 문자 | 검수 |
|-----|--------|-----------|------|
| `스마트계측기(추가분) 설치·운영 용역_제안설명회.pdf` | 53 | 1 | **EXCLUDED** (130 §2-F · hero 근거 불가) |
| `03 계측계획도면.pdf` | 5 | 1 | ☐ PIXEL_PENDING |
| `도담영천 터널 계측 도면2.pdf` | 1 | 0 | ☐ PIXEL_PENDING |
| `도담영천 토공 계측 도면.pdf` | 1 | 0 | ☐ PIXEL_PENDING |
| `붙임3. 유지관리계측도면(도영9).pdf` | 5 | 1 | ☐ PIXEL_PENDING |
| `추가첨부2. 유지관리계측 도면(도담_영천6공구).pdf` | 1 | 0 | ☐ PIXEL_PENDING |

> **참고:** `book-plan-review`의 「스캔 9건」은 전체 site-plan PDF 중 키워드 미추출 건을 포함한 수치. 본 인덱스는 **chars < 50** 정본.

## 2. 텍스트 추출 가능 PDF (우선 6종)

[book-plan-stage3-prep](./book-plan-stage3-prep.md) — rule gate ✅ · 측점 번호 수동.

## 3. 자동 게이트

```bash
npm run audit:book-stage3:strict
npm run audit:book-scan-pdfs
npm run audit:img032
npm run audit:img043
```

## 4. 기록

[book-stage3-status](./book-stage3-status.md) · [176 Phase L](./176-book-3단계-Phase-L-종료.md)
