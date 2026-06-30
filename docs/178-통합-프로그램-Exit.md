# Book · 계측이론 — 통합 프로그램 Exit

**일자:** 2026-06-29

---

## 완료 프로그램

| 트랙 | Exit 문서 | 검증 |
|------|-----------|------|
| 계측이론 Phase E~H | [158](./158-계측이론-정합성-프로그램-종료.md) | `rework:status` 69/69 |
| Book 3단계 자동 | [177](./177-book-3단계-Phase-M-hero-개념-종료.md) | stage3 · heroes · scan |
| Book 130 prompt | [175](./175-book-130-Phase-K-배포-Handoff.md) | `validate:prompt-image-rules` 113/113 |
| 배포 | [175](./175-book-130-Phase-K-배포-Handoff.md) | `verify:local` · `verify:production` |
| FIG-PROD | [213](./213-이미지-제작-실행계획.md) · [219](./219-문서-충돌-정리-완료-보고.md) | `rework:next` 0 · WATCH 20 · Tier Q 보류 |
| DOC-CANON | [210](./210-문서간-충돌-잔여-수정계획-DOC-CANON-02.md) · [212](./212-문서-정본-복구-상태값-충돌-반영계획.md) | G1~G3 validators · `test:validators` |

## CI book 게이트 (`verify:local`)

```bash
npm run verify:quick          # 일상 — FIG·DOC-CANON·이미지 (book PDF 제외)
npm run crosscheck:book-plans
npm run audit:book
npm run audit:book-stage3:strict
npm run audit:book-stage3-heroes:strict
npm run audit:book-scan-pdfs
npm run audit:img008 && npm run audit:img032 && npm run audit:img043
```

## 수동 잔여 (Exit 차단 아님)

[book-stage3-status](./book-stage3-status.md) — 측점·스캔 픽셀

## 다음 (운영)

1. FTP/git-sync 반영 → `npm run verify:production` (**30/30** 목표)
2. 인간 검수 완료 시 [book-stage3-status](./book-stage3-status.md) 체크
3. git commit (로컬 변경분 — 사용자 요청 시)
