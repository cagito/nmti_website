# Phase D — P2 장기 재작도 실행 체크리스트 (W10)

**상위:** [82 §3.4](./82-Figure-재작도-통합-수정계획.md) · [89 작업순서](./89-PNG-재작도-통합-작업순서.md)  
**복붙:** [112](./112-Phase-D-복붙-프롬프트-정본.md) · **퀵스타트:** [114](./114-W10-Phase-D-퀵스타트.md)  
**CI:** `npm run patch:registry-phase-d` 후 `requiresReaudit: true` 14건

---

## D-0 사전

```bash
npm run patch:registry-phase-d   # 미적용 시
```

---

## D-1 분야 hero (4건)

| ID | nodeId | 복붙 | redline | PNG | 서명 |
|----|--------|------|---------|-----|------|
| **011** | `fields/bridge` | [112 §1](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **064** | `fields/harbor` | [112 §2](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **084** | `fields/harbor/caisson` | [112 §3](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **097** | `fields/tunnel/blast-vibration` | [112 §4](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |

---

## D-2 센서 (3건)

| ID | nodeId | 복붙 | redline | PNG | 서명 |
|----|--------|------|---------|-----|------|
| **034** | `sensors/earth-pressure-cell` | [112 §5](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **041** | `sensors/vibration-meter` | [112 §6](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **043** | `sensors/gnss` | [112 §7](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |

---

## D-3 instruments·운영 (5건 · FT-C→ai-reviewed)

| ID | nodeId | 복붙 | redline | PNG | 서명 |
|----|--------|------|---------|-----|------|
| **070** | `instruments/modes/manual` | [112 §8](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **071** | `instruments/modes/automatic` | [112 §9](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **075** | `instruments/modes/overview` | [112 §10](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **076** | `instruments/datalogger/dynamic` | [112 §11](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **077** | `instruments/datalogger/mux` | [112 §12](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |

---

## D-4 기초·환경 (2건)

| ID | nodeId | 복붙 | redline | PNG | 서명 |
|----|--------|------|---------|-----|------|
| **092** | `fields/foundation-pile` | [112 §13](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |
| **093** | `fields/environmental-impact` | [112 §14](./112-Phase-D-복붙-프롬프트-정본.md) | v2 | ☐ | ☐ |

---

## 완료 후

```bash
npm run sign:phase-d
npm run audit:images:strict
npm run verify:local
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | W10 Phase D 14종 체크리스트 |
