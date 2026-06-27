# Phase E — 운영모드 출판 검수 체크리스트 (W11 · P0 필수)

**상위:** [123 P0](./123-P0-와이어프레임-14종-실행-체크리스트.md) · [124 제작자](./124-P0-IMG-094-운영모드-3종-제작자-퀵스타트.md) · [115 복붙](./115-Phase-E-복붙-프롬프트-정본.md)

> **2026-06-26:** [122](./122-Pillow-와이어프레임-Figure-출판품질-통합-수정계획.md) — Pillow 유지 **폐지** · **ai-reviewed** PNG 교체 필수

---

## E-1 운영모드 hero (3건)

| ID | nodeId | 복붙 | redline | 조치 | 서명 |
|----|--------|------|---------|------|------|
| **094** | `modes/normal-mode` | [115 §1](./115-Phase-E-복붙-프롬프트-정본.md) | v2 | **ai-reviewed** PNG | ☐ |
| **095** | `modes/realtime-mode` | [115 §2](./115-Phase-E-복붙-프롬프트-정본.md) | v2 | 동일 | ☐ |
| **102** | `modes/alarm-status` | [115 §3](./115-Phase-E-복붙-프롬프트-정본.md) | v2 | 동일 | ☐ |

### 출판 게이트 (공통)

- 뇌·홀로그램·SF 경고창 **없음**
- 블록 다이어그램·타임라인·로거→서버 토폴로지 **명확**
- [31 V1~V3](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) — Pillow 와이어프레임 수준 **FAIL**
- ≠ IMG-070~075 hero 대체

---

## 완료 후

```bash
npm run sign:phase-e -- --ai-reviewed
npm run rework:p0
npm run audit:figure-production
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | 122 P0 — ai-reviewed 필수 · Pillow 유지 삭제 |
| 2026-06-26 | W11 Phase E 3종 |
