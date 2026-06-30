# 배포 Exit — verify:production 28/28 (2026-06-30)

**게이트:** `npm run verify:production` exit 0 · **28/28 OK**

---

## 1. 배포 경로

작업 트리 `x:\website\homepage` = RaiDrive FTP 마운트 → SEO·콘텐츠 수정이 운영에 직접 반영.

별도 FTP 업로드 없이 주변지반 SEO 수정 후 운영 검증 통과.

---

## 2. 운영 검증 (2026-06-30)

```bash
npm run verify:production   # 28/28 OK
```

| 이전 FAIL | 수정 | 결과 |
|-----------|------|------|
| 흙막이 주변지반 SEO | IMG-032 제거 | OK |
| 항만 주변지반 SEO | IMG-032 → 030·031 | OK |

전체 28건: 홈 · inclinometer · SPA · SEO 13 · GNSS PDF · Phase5 4 · BRI 8 · 기타

---

## 3. 연계 게이트

| 게이트 | 상태 |
|--------|------|
| `verify:local` | PASS (2026-06-30) |
| `verify:deploy` | PASS |
| `verify:production` | **28/28** |
| `audit:images:strict` | 0 errors |
| `audit:image-doc` | mismatch 0 · review 0 |

---

## 4. 잔여 (비차단·선택)

- WebP 워터마크 후처리 — `watermark:figures`는 PNG 전용; WebP-only 운영 중
- `audit:book` 지중경사계 이중 콘텐츠 canonical (구조/운영 1건)
- git commit/push — 사용자 요청 시

---

## 5. 연계

- [197 P1 DOC_FIX](./197-P1-DOC_FIX-마스터동기화-및-배포준비.md)
- [196 재작도 큐 Exit](./196-재작도-큐-Exit-및-verify-local.md)
- [10 운영 가이드](./10-최종-완료-및-운영-가이드.md)
