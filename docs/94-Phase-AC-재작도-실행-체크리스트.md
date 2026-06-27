# Phase AC — ZIP 4차 재작도 실행 체크리스트

**상위:** [92-Phase AC](./92-외부-ZIP-신규-심각오류-10종-Phase-AC-수정계획.md) · [89 작업순서](./89-PNG-재작도-통합-작업순서.md)  
**복붙:** [93](./93-Phase-AC-복붙-프롬프트-정본.md) · [95 IMG별](./95-Phase-AC-IMG별-오류분석-및-재작업-계획.md) · **redline:** `ImageWorks/.../redlines/IMG-###_redline_v2_외부PNG.md` (024·079: `_AC.md`) · **퀵스타트:** [109](./109-W8-Phase-AC-퀵스타트.md)  
**CI:** `npm run patch:registry-phase-ac` 후 `requiresReaudit: true` 10건

---

## AC-0 즉시 P0 (4건)

| ID | nodeId | 복붙 | PNG | 서명 |
|----|--------|------|-----|------|
| **024** | `fields/dam` | [93 §4](./93-Phase-AC-복붙-프롬프트-정본.md) | ☐ | ☐ |
| **033** | `sensors/settlement-gauge` | [93 §6](./93-Phase-AC-복붙-프롬프트-정본.md) | ☐ | ☐ |
| **081** | `fields/building` | [93 §9](./93-Phase-AC-복붙-프롬프트-정본.md) | ☐ | ☐ |
| **059** | `instruments/modes` | [93 §10](./93-Phase-AC-복붙-프롬프트-정본.md) | ☐ | ☐ |

### 핵심

- **024:** DAM-LEAK-01 — 누수=하류 배수계통 · 제체 내부 센서 금지
- **033:** MAG-RING-01 — 자석링·기준관·프로브 역할 분리
- **081:** COL-SHRINK-01 — RF≠절대 기준 · 크리프·건조수축
- **059:** THRESH-01 — 항목별 기준 · 단일 표 일반화 금지

---

## AC-1 REGENERATE (4건 추가)

| ID | nodeId | 복붙 | PNG | 서명 |
|----|--------|------|-----|------|
| **007** | `fields/tunnel` | [93 §1](./93-Phase-AC-복붙-프롬프트-정본.md) | ☐ | ☐ |
| **019** | `fields/soft-ground` | [109 §0](./109-IMG-019-연약지반-성토부-계측기-설치-배치도-표현-표준.md) · [93 §2](./93-Phase-AC-복붙-프롬프트-정본.md) · redline v3 | ☐ | ☐ |
| **023** | `fields/railway` | [93 §3](./93-Phase-AC-복붙-프롬프트-정본.md) | ☐ | ☐ |
| **079** | `fields/tunnel/shotcrete` | [93 §8](./93-Phase-AC-복붙-프롬프트-정본.md) | ☐ | ☐ |

---

## AC-2 MAJOR_FIX (2건)

| ID | nodeId | 복붙 | PNG | 서명 |
|----|--------|------|-----|------|
| **031** | `sensors/piezometer` | [93 §5](./93-Phase-AC-복붙-프롬프트-정본.md) | ☐ | ☐ |
| **036** | `sensors/strain-gauge` | [93 §7](./93-Phase-AC-복붙-프롬프트-정본.md) | ☐ | ☐ |

---

## 완료 후

```bash
npm run patch:registry-phase-ac
# 재작도 완료 후:
npm run sign:phase-ac
npm run audit:images:strict
npm run verify:local
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-22 | Phase AC 실행 체크리스트 — 10종 |
| 2026-06-26 | redline v2 · 109 퀵스타트 링크 |
