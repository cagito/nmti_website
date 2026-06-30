# ATS-SUB-01 Figure 재작도 큐 (Phase 3)

**등록:** 2026-06-30  
**상위:** [206 ATS-SUB-01](./206-자동광파기-지하공사-전용-표현-통합-적용-계획.md)

## P1 — 지상 분야 ATS 픽셀 제거

| IMG | 노드 | 조치 | 상태 |
|-----|------|------|------|
| **005** | `adjacent-building` | 프리즘·균열·경사만 — ATS 본체·복합 라벨 삭제 | ⏳ REGENERATE |
| **012** | `bridge/pier` | 경사계·GNSS — ATS 삭제 | ⏳ REGENERATE |
| **013** | `bridge/foundation-settlement` | 침하계·측점·GNSS — ATS caption 삭제 | ⏳ REGENERATE |

## P2

| IMG | 조치 | 상태 |
|-----|------|------|
| **015** | 사면 개념도 ATS 패널 삭제 | ⏳ |
| **001** | callout ATS 감사 | ⏳ |
| **090** | 와이어·프리즘만 | ⏳ |

## 유지

IMG-042 · 010 · 061 · 103

## 실행

```bash
npm run lock:acquire -- full --task "ATS-SUB-01 P1 Figure"
# redline → GenerateImage/Pillow → register-external-figure.mjs
npm run lock:release -- full
```
