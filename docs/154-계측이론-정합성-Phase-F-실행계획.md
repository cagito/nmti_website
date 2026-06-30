# 계측이론 정합성 Phase F — 실행 계획

**수립:** 2026-06-29  
**선행:** [150-DOCS-계측이론](./150-DOCS-계측이론-정합성-수정계획.md) **완료** · `verify:local` PASS

---

## 1. 목표

image-knowledge·registry·SEO·gap-matrix를 **정본 문서(148·14-교량-처짐·153)** 와 일치시키고, gap-matrix `🔲` 잔여를 순차 해소한다.

## 2. 이번 배치 (2026-06-29)

| # | 작업 | 산출 |
|---|------|------|
| F1 | IMG-103/104 image-knowledge map | `img-image-knowledge-map.json` → `14-교량-처짐-계측.md` |
| F2 | IMG-111 map | `IMG-111-터널-건설중-계측-개념도.md` |
| F3 | SEO 재빌드 | `npm run build:seo` — hero alt·caption 동기화 |
| F4 | gap-matrix 갱신 | `npm run build:gap-matrix` |
| F5 | 운영 문서 | [10](./10-최종-완료-및-운영-가이드.md) 상태 갱신 | ✅ |
| F6 | IMG-112 stub + prompt | `IMG-112-철도-건설중-계측-개념도.md` · sync | ✅ |
| F7 | prompt batch sync | IMG-103/104 등 links+rules | ✅ |
| F8 | IMG-113 stub + prompt | `IMG-113-댐-건설중-계측-개념도.md` | ✅ |
| F9 | IMG-100 stub + prompt v5 | `IMG-100-건축공사-계측-전체-개념도.md` · DISP-ATS-01 | ✅ |
| F10 | IMG-111 stub v2 + prompt | §5·§6 · topic rules (≠01-터널 only) | ✅ |

## 3. gap-matrix 🔲 잔여 (우선순위)

| IMG | 조치 | 상태 |
|-----|------|------|
| IMG-111/112/113 | 건설중 stub + map | ✅ |
| IMG-103/104 | 14-교량-처짐 + prompt sync | ✅ |
| IMG-100 | stub + prompt v5 · 17-건축 중복 정리 | ✅ |

**Phase F 종료:** gap-matrix 건축·교량·건설중 hero 매핑 **전부 ✅** (2026-06-29)

## 4. 검증

```bash
npm run patch:registry-image-knowledge
npm run validate:registry-image-knowledge:strict
npm run build:seo && npm run validate:heroes
npm run verify:local
npm run verify:deploy
# FTP 후
npm run verify:production
```

## 5. 금지 (재발)

- IMG-103 registry topic = `14-교량-계측시스템` only (시스템 ≠ 처짐 hero)  
- SEO hero alt가 master `purpose` 구문에 고정 (images.js 정본 우선)  
- gap-matrix 수동 편집 without `build:gap-matrix`
