# 현장 도면 수동 검수 체크리스트

> 자동 1·2단계: `npm run crosscheck:book-plans` → [book-plan-review-2026-06.md](./book-plan-review-2026-06.md)  
> **3단계** 픽셀·Figure·측점 대조만 아래 체크리스트로 수행한다.

## 대표 선정 (권장)

| PDF | 우선 검수 노드 |
|-----|----------------|
| `GNSS.pdf` | `sensors/gnss`, `sensors/settlement-gauge` |
| `3-150120_대구통합계측 준공도면.pdf` | `sensors/strain-gauge`, `fields/bridge` |
| `2. 유지관리계측 도면.pdf` | `fields/tunnel/convergence`, `sensors/piezometer` |
| `페이지 원본 2. 계측도면_그랑르피에드.pdf` | `sensors/inclinometer`, `sensors/settlement-gauge` |

## 검수 항목 (도면 1건당)

- [ ] 범례 센서 기호 ↔ 웹 IMG 배치도 일치 (`js/technology/images.js`)
- [ ] 측점 번호·깊이 ↔ 본문 `installation` 절차
- [ ] 터널 단면: 내공변위 = 상부 아치만 (invert·노반 미계측)
- [ ] 흙막이: 좌→우 인접건물|배면|벽체|굴착측
- [ ] 불일치 시 [image-audit.md](./image-audit.md) 형식으로 기록

## 완료 기준

도면 1~2건 PASS 기록 후 본 체크리스트를 저장소에 `docs/book-plan-review-YYYY-MM.md`로 추가.
