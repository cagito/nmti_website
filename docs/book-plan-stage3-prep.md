# 3단계 도면 검수 — 수동 대조 워크시트

> 자동 생성: `npm run crosscheck:book-plans`
> 1·2단계 PASS 후, 아래 **픽셀·범례·측점**만 사람이 확인한다.

| PDF | 유형 | 대조 Figure |
|-----|------|-------------|
| `1-150120_대구통합계측 준공보고서-본문.pdf` | 텍스트 추출 가능 (144p) | IMG-035, IMG-036, IMG-045 |
| `2-150120_대구통합계측 준공보고서-부록.pdf` | 텍스트 추출 가능 (297p) | IMG-036, IMG-043 |
| `3-150120_대구통합계측 준공도면.pdf` | 텍스트 추출 가능 (18p) | IMG-036 |
| `2. 유지관리계측 도면.pdf` | 텍스트 추출 가능 (23p) | IMG-008, IMG-031, IMG-040, IMG-045 |
| `페이지 원본 2. 계측도면_그랑르피에드.pdf` | 텍스트 추출 가능 (1p) | IMG-027, IMG-030, IMG-032, IMG-036 |
| `GNSS.pdf` | 텍스트 추출 가능 (6p) | IMG-032, IMG-043 |

## PDF별 수동 체크

### `1-150120_대구통합계측 준공보고서-본문.pdf`
- 추출 문자: 62071 · 페이지: 144
- [ ] **데이터로거** → `sensors/datalogger` · 대조 **IMG-045** · 범례 기호·측점 번호 일치
- [ ] **변형률계** → `sensors/strain-gauge` · 대조 **IMG-036** · 범례 기호·측점 번호 일치
- [ ] **하중계** → `sensors/load-cell` · 대조 **IMG-035** · 범례 기호·측점 번호 일치

### `2-150120_대구통합계측 준공보고서-부록.pdf`
- 추출 문자: 117557 · 페이지: 297
- [ ] **GPS** → `sensors/gnss` · 대조 **IMG-043** · 범례 기호·측점 번호 일치
- [ ] **변형률계** → `sensors/strain-gauge` · 대조 **IMG-036** · 범례 기호·측점 번호 일치

### `3-150120_대구통합계측 준공도면.pdf`
- 추출 문자: 890 · 페이지: 18
- [ ] **변형률계** → `sensors/strain-gauge` · 대조 **IMG-036** · 범례 기호·측점 번호 일치

### `2. 유지관리계측 도면.pdf`
- 추출 문자: 1322 · 페이지: 23
- [ ] **간극수압계** → `sensors/piezometer` · 대조 **IMG-031** · 범례 기호·측점 번호 일치
- [ ] **내공변위** → `fields/tunnel/convergence` · 대조 **IMG-008** · 범례 기호·측점 번호 일치
- [ ] **데이터로거** → `sensors/datalogger` · 대조 **IMG-045** · 범례 기호·측점 번호 일치
- [ ] **변위계** → `sensors/displacement-transducer` · 대조 **IMG-040** · 범례 기호·측점 번호 일치

### `페이지 원본 2. 계측도면_그랑르피에드.pdf`
- 추출 문자: 11015 · 페이지: 1
- [ ] **변형률계** → `sensors/strain-gauge` · 대조 **IMG-036** · 범례 기호·측점 번호 일치
- [ ] **지중경사계** → `sensors/inclinometer` · 대조 **IMG-027** · 범례 기호·측점 번호 일치
- [ ] **지하수위계** → `sensors/water-level-meter` · 대조 **IMG-030** · 범례 기호·측점 번호 일치
- [ ] **침하계** → `sensors/settlement-gauge` · 대조 **IMG-032** · 범례 기호·측점 번호 일치

### `GNSS.pdf`
- 추출 문자: 2930 · 페이지: 6
- **1·2단계:** 키워드·본문·IMG-043·PDF 링크 — ✅ 자동 PASS ([book-plan-review-2026-06.md](./book-plan-review-2026-06.md))
- [ ] **3단계(수동): GNSS** → `sensors/gnss` · 대조 **IMG-043** · 범례·측점·블록도 픽셀 대조
- [ ] **3단계(수동): GPS** → `sensors/gnss` · 대조 **IMG-043** · 범례·측점·블록도 픽셀 대조
- [ ] **3단계(수동): 침하계** → `sensors/settlement-gauge` · 대조 **IMG-032** · 범례·측점·블록도 픽셀 대조

완료 시: 체크 결과를 본 파일 하단 또는 `docs/book-plan-review-YYYY-MM.md`에 기록.

자동 1·2단계: [book-plan-review-2026-06.md](./book-plan-review-2026-06.md)
