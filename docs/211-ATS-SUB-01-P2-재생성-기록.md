# ATS-SUB-01 P2 — Figure·문서 재생성 기록 (015·090·001)

**일자:** 2026-06-30  
**상위:** [207 P2 큐](./207-ATS-SUB-01-Figure-재작도-큐.md) · [206 ATS-SUB-01](./206-자동광파기-지하공사-전용-표현-통합-적용-계획.md) · [210 DOC-CANON-02 Phase C](./210-문서간-충돌-잔여-수정계획-DOC-CANON-02.md)

## 목적

사면·가시설 개요 Figure에서 **ATS inset·시준선** 픽셀·프롬프트 제거. 지상 분야 ATS-SUB-01 완결.

| IMG | 노드 | vN | 조치 |
|-----|------|-----|------|
| **015** | `fields/slope` | **v5** | 우측 ATS inset·시준선 삭제 · IPI·수위·침하·간극수압·프리즘(선택)만 |
| **090** | `slope/structural-displacement` | **v6** | 와이어(배면)·프리즘(옹벽)만 — ATS inset 삭제 |
| **001** | `retaining-excavation` | **v8 유지** | G-16 ATS 금지 · callout 감사 — **픽셀 재작도 없음** |

## 산출물

- `IMG-015_사면-계측-전체-개념도_활동면지중경사계지하수위계.webp`
- `IMG-090_사면-구조물-변위-계측-개념도_배면사면와이어식변위계.webp`

`reviewGrade`: PASS · `productionMethod`: ai-reviewed

## 문서 동기화

- prompts 015 v5 · 090 v6 · 001 CANONICAL_STATUS+G-16
- `image-knowledge/13` · `02_CURSOR` · `10_DICTIONARY`
- `validate-figure-status` WATCH: 001·015·090 추가

## Exit

207 P2 ✅ · ATS-SUB-01 지상 Figure 큐 **완료**
