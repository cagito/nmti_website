# book/ HWP 카탈로그

**생성:** 2026-06-25 · `node scripts/catalog-book-hwp.mjs`

| 파일 | 크기(KB) | 연결 기술자료 노드 |
|------|----------|-------------------|
| KCS 11 10 15 시공 중 지반계측_(25. 12. 24).hwp | 382 | `fields/retaining-excavation`, `sensors/inclinometer` |
| KCS 24 99 05 교량계측시설(23.09).hwp | 145 | `fields/bridge`, `fields/bridge/vibration` |
| KCS 54 20 25 댐 계측설비(18.08).hwp | 265 | `fields/dam`, `fields/dam/river-levee` |
| KDS 11 10 15 지반계측(25.12).hwp | 752 | `fields/retaining-excavation`, `sensors/inclinometer` |
| KDS 27 50 10 터널 계측(23.09).hwp | 192 | `fields/tunnel`, `fields/tunnel/blast-vibration` |

## PDF (참고 원본)

| 파일 | 연결 기술자료 노드 |
|------|-------------------|
| GNSS.pdf | `sensors/gnss` · IMG-043 |

## 후속

- 용어 추출: `npm run extract:hwp-terms` → [HWP_TERMS.md](./HWP_TERMS.md)
- PDF 감사: `npm run audit:book`
- 도면 키워드: `npm run crosscheck:book-plans`
