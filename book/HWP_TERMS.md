# HWP·PDF 용어 추출·웹 노드 대조

> `npm run extract:hwp-terms`

| HWP | 6건 |
| 매칭 노드 | 25종 |
| dictionary 누락 | 0건 |
| _kds_kcs_term_extract 용어 | 19종 |

## KDS/KCS PDF 추출 용어 → 웹 노드
- **가시설** → `fields/retaining-excavation`
- **간극수압계** → `sensors/piezometer`
- **강지보** → `fields/tunnel/steel-support`
- **계측책임자** → `intro`
- **내공변위** → `fields/tunnel/convergence`
- **데이터로거** → `sensors/datalogger`
- **로드셀** → `fields/retaining-excavation/anchor`
- **록볼트** → `fields/tunnel/rockbolt`
- **막장전방** → `fields/tunnel/face-advance`
- **발파진동** → `fields/tunnel/blast-vibration`
- **변위계** → `sensors/displacement-transducer`
- **변형률계** → `sensors/strain-gauge`
- **숏크리트** → `fields/tunnel/shotcrete`
- **지중경사계** → `sensors/inclinometer`
- **지하수위계** → `sensors/water-level-meter`
- **천단침하** → `fields/tunnel/crown-settlement`
- **침하계** → `sensors/settlement-gauge`
- **하중계** → `sensors/load-cell`
- **흙막이** → `fields/retaining-excavation`

## `GNSS.pdf`
- 파일 매핑: `sensors/gnss`
- **GNSS** → `sensors/gnss`
- **GPS** → `sensors/gnss`
- **RTK** → `sensors/gnss`
- **침하계** → `sensors/settlement-gauge`

## `KCS 11 10 15 시공 중 지반계측_(25. 12. 24).hwp`
- PDF: `KCS 11 10 15 시공 중 지반계측_(25. 12. 24).pdf` (72645자)
- 파일 매핑: `fields/retaining-excavation`, `sensors/inclinometer`
- **GNSS** → `sensors/gnss`
- **GPS** → `sensors/gnss`
- **가시설** → `fields/retaining-excavation`
- **간극수압계** → `sensors/piezometer`
- **계측책임자** → `intro`
- **내공변위** → `fields/tunnel/convergence`
- **댐계측** → `fields/dam`
- **록볼트** → `fields/tunnel/rockbolt`
- **막장전방** → `fields/tunnel/face-advance`
- **발파진동** → `fields/tunnel/blast-vibration`
- **버팀보** → `fields/retaining-excavation/strut`
- **변위계** → `sensors/displacement-transducer`
- **변형률계** → `sensors/strain-gauge`
- **숏크리트** → `fields/tunnel/shotcrete`
- **어스앵커** → `fields/retaining-excavation/anchor`
- **제방** → `fields/dam`
- **지중경사계** → `sensors/inclinometer`
- **지하수위계** → `sensors/water-level-meter`
- **진동계** → `sensors/vibration-meter`
- **천단침하** → `fields/tunnel/crown-settlement`
- **침하계** → `sensors/settlement-gauge`
- **하중계** → `sensors/load-cell`
- **하천제방** → `fields/dam/river-levee`
- **흙막이** → `fields/retaining-excavation`

## `KCS 24 99 05 교량계측시설(23.09).hwp`
- PDF: `KCS 24 99 05 교량계측시설(23.09).pdf` (11269자)
- 파일 매핑: `fields/bridge`
- **교량계측** → `fields/bridge`

## `KCS 54 20 25 댐 계측설비(18.08).hwp`
- PDF: `KCS 54 20 25 댐 계측설비(18.08).pdf` (16703자)
- 파일 매핑: `fields/dam`, `fields/dam/river-levee`
- **간극수압계** → `sensors/piezometer`
- **댐계측** → `fields/dam`
- **변위계** → `sensors/displacement-transducer`
- **변형률계** → `sensors/strain-gauge`
- **지하수위계** → `sensors/water-level-meter`
- **침하계** → `sensors/settlement-gauge`

## `KDS 11 10 15 지반계측(25.12).hwp`
- PDF: `KDS 11 10 15 지반계측(25.12).pdf` (43567자)
- 파일 매핑: `fields/retaining-excavation`, `intro`
- **GPS** → `sensors/gnss`
- **가시설** → `fields/retaining-excavation`
- **간극수압계** → `sensors/piezometer`
- **강지보** → `fields/tunnel/steel-support`
- **계측책임자** → `intro`
- **내공변위** → `fields/tunnel/convergence`
- **데이터로거** → `sensors/datalogger`
- **로드셀** → `fields/retaining-excavation/anchor`
- **록볼트** → `fields/tunnel/rockbolt`
- **막장전방** → `fields/tunnel/face-advance`
- **발파진동** → `fields/tunnel/blast-vibration`
- **변위계** → `sensors/displacement-transducer`
- **숏크리트** → `fields/tunnel/shotcrete`
- **제방** → `fields/dam`
- **지중경사계** → `sensors/inclinometer`
- **지하수위계** → `sensors/water-level-meter`
- **천단침하** → `fields/tunnel/crown-settlement`
- **침하계** → `sensors/settlement-gauge`
- **하천제방** → `fields/dam/river-levee`
- **흙막이** → `fields/retaining-excavation`

## `KDS 27 50 10 터널 계측(23.09).hwp`
- PDF: `KDS 27 50 10 터널 계측(23.09).pdf` (10141자)
- 파일 매핑: `fields/tunnel`, `fields/tunnel/blast-vibration`
- **내공변위** → `fields/tunnel/convergence`
- **록볼트** → `fields/tunnel/rockbolt`
- **발파진동** → `fields/tunnel/blast-vibration`
- **숏크리트** → `fields/tunnel/shotcrete`
- **천단침하** → `fields/tunnel/crown-settlement`
- **터널 계측** → `fields/tunnel`

## 한계

- HWP BodyText 전문은 별도 디코더 필요
- PDF 페어가 있는 KDS/KCS는 pypdf 본문 키워드 매칭
- PDF 단독: `GNSS.pdf` → `sensors/gnss`

JSON: [book-hwp-terms-audit.json](../docs/book-hwp-terms-audit.json)
