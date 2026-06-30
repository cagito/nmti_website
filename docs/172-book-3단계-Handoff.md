# Book 3단계 — Handoff (Phase I)

**완료:** 2026-06-29  
**선행:** [159 실행기록](./159-book-3단계-실행기록.md) · [158 계측이론 종료](./158-계측이론-정합성-프로그램-종료.md)

---

## 1. 자동 게이트 (CI)

| 명령 | 역할 |
|------|------|
| `audit:book-stage3:strict` | 우선 PDF 6종 × hero rule gate (17항) |
| `audit:img032` | SETTLE-01 · IMG-032 v6 (GNSS.pdf 침하계) |
| `audit:img043` | GNSS.pdf ↔ IMG-043 개념 정합 |
| `audit:book` | book PDF ↔ 웹 본문·링크 |
| `crosscheck:book-plans` | 1·2단계 키워드·본문 |

`verify:local` · `verify:content`에 **stage3 + img043** 포함.

## 2. 개념 픽셀 (에이전트)

| IMG | 판정 | 근거 |
|-----|------|------|
| IMG-032 v6 | **PASS** | [170](./170-IMG-032-v6-재생성-기록.md) · SETTLE-01 |
| IMG-043 v5 | **CONCEPT_PASS** | [161](./161-IMG-043-v5-재생성-기록.md) · `audit:img043` |

## 3. 인간 잔여

| 항목 | 문서 |
|------|------|
| PDF **측점 번호** 1:1 | [book-plan-stage3-prep](./book-plan-stage3-prep.md) |
| 스캔 PDF 6건 전체 육안 | [173 스캔 인덱스](./173-book-스캔PDF-검수-인덱스.md) §2 P5 |
| GNSS.pdf p.2 블록도 **범례 기호** | checklist §4 G1~G4 |

## 4. 검증

```bash
npm run audit:book-stage3:strict
npm run audit:img032
npm run audit:img043
npm run verify:local
```
