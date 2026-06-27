# book 현장 계측도면 ↔ 웹 교차 검증

> 자동 생성: `python scripts/crosscheck_book_site_plans.py`

현장 준공·유지관리·계획 도면 PDF에서 **계측 키워드**를 추출하고, 기술자료 SPA 노드·이미지와의 **1차 매핑**을 기록한다.
도면 Figure 번호·측점 좌표의 픽셀 단위 대조는 후속 수동 검수가 필요하다.

## 요약

| 항목 | 값 |
|------|-----|
| 대상 PDF | 21건 |
| 웹 Figure (IMG) | 112종 |

## PDF별 키워드 매칭

### `01. 지표면 계측기 설치완료보고서.pdf` (83p)
- **GNSS** → `sensors/gnss`
- **GPS** → `sensors/gnss`
- **침하계** → `sensors/settlement-gauge`

### `03 계측계획도면.pdf` (5p)
- 추출 키워드 없음 (스캔 PDF·이미지 위주 가능)

### `1-150120_대구통합계측 준공보고서-본문.pdf` (144p)
- **데이터로거** → `sensors/datalogger`
- **변형률계** → `sensors/strain-gauge`
- **하중계** → `sensors/load-cell`

### `2-150120_대구통합계측 준공보고서-부록.pdf` (297p)
- **GPS** → `sensors/gnss`
- **변형률계** → `sensors/strain-gauge`

### `2. 유지관리계측 도면.pdf` (23p)
- **간극수압계** → `sensors/piezometer`
- **내공변위** → `fields/tunnel/convergence`
- **데이터로거** → `sensors/datalogger`
- **변위계** → `sensors/displacement-transducer`

### `3-150120_대구통합계측 준공도면.pdf` (18p)
- **변형률계** → `sensors/strain-gauge`

### `[붙임] 1.새만금 방조제 유지관리 계측시스템 점검 보고서.pdf` (49p)
- **간극수압계** → `sensors/piezometer`
- **데이터로거** → `sensors/datalogger`
- **지중경사계** → `sensors/inclinometer`
- **지하수위계** → `sensors/water-level-meter`
- **침하계** → `sensors/settlement-gauge`

### `A3도면-설치및시공, 계측결과.pdf` (4p)
- 추출 키워드 없음 (스캔 PDF·이미지 위주 가능)

### `GNSS.pdf` (6p)
- **GNSS** → `sensors/gnss`
- **GPS** → `sensors/gnss`
- **침하계** → `sensors/settlement-gauge`

### `계측계획도면.pdf` (8p)
- 추출 키워드 없음 (스캔 PDF·이미지 위주 가능)

### `광암교 계측계획서-수정-2.pdf` (67p)
- **GPS** → `sensors/gnss`
- **구조물경사계** → `sensors/tilt-meter`
- **데이터로거** → `sensors/datalogger`

### `도담영천 터널 계측 도면2.pdf` (1p)
- 추출 키워드 없음 (스캔 PDF·이미지 위주 가능)

### `도담영천 토공 계측 도면.pdf` (1p)
- 추출 키워드 없음 (스캔 PDF·이미지 위주 가능)

### `부록2. 계측기 사양 및 설치상세도.pdf` (23p)
- **데이터로거** → `sensors/datalogger`

### `붙임3. 유지관리계측도면(도영9).pdf` (5p)
- 추출 키워드 없음 (스캔 PDF·이미지 위주 가능)

### `사내저수지 원격계측경보 발령기준.pdf` (186p)
- **변위계** → `sensors/displacement-transducer`

### `스마트계측기(추가분) 설치·운영 용역_제안설명회.pdf` (53p)
- 추출 키워드 없음 (스캔 PDF·이미지 위주 가능)

### `영광 원격계측경보시스템 구축사업 (1).pdf` (211p)
- **변위계** → `sensors/displacement-transducer`

### `추가첨부2. 유지관리계측 도면(도담_영천6공구).pdf` (1p)
- 추출 키워드 없음 (스캔 PDF·이미지 위주 가능)

### `통합 자동화계측관리 및 모니터링 구축 사례집 공개용.pdf` (161p)
- **GNSS** → `sensors/gnss`
- **GPS** → `sensors/gnss`
- **간극수압계** → `sensors/piezometer`
- **구조물경사계** → `sensors/tilt-meter`
- **균열계** → `sensors/crack-meter`
- **내공변위** → `fields/tunnel/convergence`
- **데이터로거** → `sensors/datalogger`
- **변위계** → `sensors/displacement-transducer`
- **변형률계** → `sensors/strain-gauge`
- **지중경사계** → `sensors/inclinometer`
- **지하수위계** → `sensors/water-level-meter`
- **진동계** → `sensors/vibration-meter`
- **침하계** → `sensors/settlement-gauge`
- **하중계** → `sensors/load-cell`
- **흙막이** → `fields/retaining-excavation/earth-retaining-wall`

### `페이지 원본 2. 계측도면_그랑르피에드.pdf` (1p)
- **변형률계** → `sensors/strain-gauge`
- **지중경사계** → `sensors/inclinometer`
- **지하수위계** → `sensors/water-level-meter`
- **침하계** → `sensors/settlement-gauge`

## 후속 수동 검수 (권장)

1. 대표 1~2건(예: 대구통합, 도담영천) 선정
2. 도면 범례 센서 기호 ↔ `js/technology/images.js` IMG 배치도 대조
3. 불일치 시 [image-audit.md](./image-audit.md) 형식으로 기록

JSON: [book-site-plan-crosscheck.json](./book-site-plan-crosscheck.json)
