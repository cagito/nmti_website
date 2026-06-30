# GNSS·book PDF 연동 및 검증 가이드

**최종 갱신:** 2026-06-25  
**대상:** `book/GNSS.pdf` ↔ 기술자료 웹 · 이미지 canonical · 로컬/운영 자동 검증

---

## 1. 한눈에 보기

| 항목 | 값 |
|------|-----|
| PDF | [book/GNSS.pdf](../book/GNSS.pdf) |
| 기술자료 노드 | `sensors/gnss` |
| 대표 Figure | **IMG-043** (`render-p1-blockers.py` · `lib/gnss_draw.py`) |
| SPA URL | `/homepage/technology/#sensors/gnss` |
| SEO URL | `/homepage/technology/sensors/gnss/` |
| PDF 공개 URL | `https://www.nmti.co.kr/homepage/book/GNSS.pdf` |
| 자동 감사 | `npm run audit:book` → **0건** |
| 운영 검증 | `verify:production` → **15/15** (GNSS SEO + GNSS PDF + 내공변위 + **LTE M2M**) |

---

## 2. GNSS.pdf ↔ 웹 정합성

### 2.1 PDF에서 반영한 핵심 개념

| PDF 개념 | 웹 반영 위치 |
|----------|--------------|
| 기준국 · 이동국 | `scripts/content-data/sensors.mjs` 개요·원리 |
| RTK · 차분 GNSS | 개요·원리·FAQ |
| LTE M2M · 무선 · 중앙 서버 | 개요·원리 · **LTE M2M 모뎀** ([13](./13-LTE-M2M-용어-및-Figure-개편-계획.md)) |
| 3D 변위 (ΔX·ΔY·ΔZ) | 개요·IMG-043 caption |
| GPS vs GNSS | FAQ |

### 2.2 콘텐츠·링크

| 경로 | PDF 링크 |
|------|----------|
| `scripts/content-data/sensors.mjs` | 개요 HTML `<a href="/homepage/book/GNSS.pdf">` |
| 동일 | `detailLink`: `{ href, label: 'GNSS 계측 시스템 구성 참고(PDF)' }` |
| SPA 렌더 | `js/technology/content-loader.js` — `detailLink`는 **`.pdf`일 때 새 탭** |
| SEO 정적 | `scripts/generate-technology-seo-pages.mjs` — CTA에 PDF 링크 (새 탭) |

콘텐츠 수정 후:

```bash
node scripts/build-content-data.mjs
npm run build:seo
```

### 2.3 이미지 (IMG-043)

| 문서 | 용도 |
|------|------|
| [07_GNSS_이미지_가이드.md](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/07_GNSS_이미지_가이드.md) | PDF p.2~5 → Figure 필수·금지 |
| [INSTRUMENTATION_DRAWING_RULES.md §3.13](./INSTRUMENTATION_DRAWING_RULES.md) | 기준국 부동·이동국 2점+·RTK·3D 변위 |
| [book/HWP_INDEX.md](../book/HWP_INDEX.md) | PDF ↔ `sensors/gnss` · IMG-043 |

재생성:

```bash
npm run render:p1          # IMG-043 포함 (또는 --id 043)
python scripts/convert-technology-webp.py
npm run build:images
```

### 2.4 자동 감사 (`audit:book`)

`scripts/audit_book_pdf.py`가 GNSS.pdf 텍스트와 다음을 대조한다.

- 키워드: 기준국, 이동국, RTK, GNSS, GPS → `sensors/gnss` 본문
- `/homepage/book/GNSS.pdf` 링크 존재
- IMG-043 hero (`dictionary` / `content-data`)

```bash
npm run audit:book
```

book 현장 도면 3단계 QA: [book-plan-stage3-prep.md](./book-plan-stage3-prep.md) — GNSS.pdf ↔ IMG-043 · `npm run audit:img043`

---

## 3. 이미지 canonical PNG (중복 방지)

동일 `IMG-###`에 PNG가 여러 개 있으면 `images.js`가 **잘못된 파일**을 가리킬 수 있다. (예: 구버전 `흙막이굴착…` vs canonical `굴착단면…`)

### 3.1 단일 진실 원천

| 파일 | 역할 |
|------|------|
| [scripts/canonical-image-webp.json](../scripts/canonical-image-webp.json) | render 스크립트 기준 **공식 파일명** (IMG-001~088 일부) |
| [scripts/generate-image-assets.mjs](../scripts/generate-image-assets.mjs) | canonical 우선 → `source/` 일치 → 최신 mtime |
| [scripts/validate-image-master.mjs](../scripts/validate-image-master.mjs) | ID당 PNG **1개** · canonical 파일 **존재** 검사 |

### 3.2 PNG 추가·교체 절차

1. `assets/images/technology/source/`에 원본 저장 (선택)
2. canonical 파일명으로 `assets/images/technology/`에 배치
3. 구버전 중복 PNG **삭제** (같은 ID 접두사)
4. `canonical-image-webp.json`에 파일명 등록 (render 산출물이면 이미 있음)
5. `python scripts/convert-technology-webp.py`
6. `npm run build:images`
7. `npm run verify:local`

### 3.3 2026-06-25 정리 예

| ID | 유지 (canonical) | 삭제 (구버전) |
|----|------------------|---------------|
| IMG-001 | `…_굴착단면계측항목.png` | `…_흙막이굴착현장계측항목.png` |
| IMG-003 | `…_띠장접합부축압축.png` | `…_Strut중간부단부하중계.png` |

---

## 4. 사면 계측 IMG-015 (참고)

현장 심의 지침(ATS 부동점·경사계 근입·간극수압·변위 화살표)은 다음에 일반화되어 있다.

| 문서 | § |
|------|---|
| [INSTRUMENTATION_DRAWING_RULES.md](./INSTRUMENTATION_DRAWING_RULES.md) | §3.12 + 공통「부동점·활동면」표 |
| [prompts/IMG-015](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-015_사면_계측_전체_개념도.md) | v2 치명 오류 C1~C5 |
| `scripts/lib/slope_draw.py` | Pillow 렌더 |

---

## 5. 검증 명령

### 5.1 로컬 통합 (`verify:local`)

```bash
npm run verify:local
```

| 단계 | 스크립트 | 확인 내용 |
|------|----------|-----------|
| 1 | `audit:images:strict` | PASS/MINOR_FIX만 노출 · registry · LOG |
| 2 | `validate-image-master.mjs` | 88 PNG · **중복 없음** · canonical 존재 |
| 3 | `validate:heroes` | SPA·SEO 히어로 imageId |
| 4 | `validate:terminology` | KDS/KCS 금지어 |
| 5 | `crosscheck:book-plans` | book PDF 키워드 1차 매핑 |
| 6 | `audit:book` | PDF ↔ 웹 (GNSS 포함) |
| 7 | `audit:image-doc` | Figure·문서·hero 불일치 |

부가:

```bash
npm run extract:hwp-terms    # → book/HWP_TERMS.md
npm run catalog:book-hwp     # → book/HWP_INDEX.md
npm run build:all            # content · SEO 99 · sitemap
npm run verify:deploy        # GNSS·IMG-043·manifest 등 배포 산출물
```

### 5.2 배포 산출물 (`verify:deploy`)

FTP 업로드 **전** 로컬 파일·링크 존재 확인:

```bash
npm run verify:deploy
node scripts/list-deploy-manifest.mjs --write
```

| 확인 | 내용 |
|------|------|
| `book/GNSS.pdf` | PDF 파일 존재 |
| IMG-043 | PNG·WebP |
| `content-data.js` | `sensors/gnss` · PDF `detailLink` |
| SEO·SPA | PDF 새 탭 · `app.js?v>=11` |
| manifest | `docs/deploy-manifest.txt`에 `book/GNSS.pdf` |

### 5.3 운영 (`verify:production`) — 15건

FTP 반영 후:

```bash
npm run verify:production
```

| # | 이름 | URL |
|---|------|-----|
| 1 | 홈 12분야 | `/homepage/` |
| 2 | 지중경사계 정적 | `/homepage/sensors/inclinometer/` |
| 3 | 기술자료 SPA 셸 | `/homepage/technology/` |
| 4 | SEO 누수 | `…/fields/dam/leakage/` |
| 5 | 막장전방 SEO | `…/fields/tunnel/face-advance/` |
| 6 | 강지보 SEO | `…/fields/tunnel/steel-support/` |
| 7 | 하천제방 SEO | `…/fields/dam/river-levee/` |
| 8 | 발파진동 SEO | `…/fields/tunnel/blast-vibration/` |
| 9 | 항만·호안 IMG-064 | `…/fields/harbor/` |
| 10 | 흙막이 주변지반 | `…/surrounding-ground/` (retaining) |
| 11 | 항만 주변지반 | `…/surrounding-ground/` (harbor) |
| 12 | **GNSS PDF** | `/homepage/book/GNSS.pdf` (Content-Type PDF) |
| 13 | **GNSS SEO** | `…/sensors/gnss/` (IMG-043 · PDF 링크) |
| 14 | **내공변위 SEO** | `…/fields/tunnel/convergence/` ([11-터널-내공변위-IMG008](./11-터널-내공변위-IMG008-기술검증-및-개선계획.md)) |
| 15 | **LTE M2M SEO** | `…/instruments/communication/lte-remote/` ([13-LTE-M2M](./13-LTE-M2M-용어-및-Figure-개편-계획.md)) |

---

## 6. GNSS 배포 체크리스트

로컬 자동 확인:

```bash
npm run verify:deploy
node scripts/list-deploy-manifest.mjs --write   # book/GNSS.pdf 포함
```

수동(FTP):

- [ ] `homepage/` manifest 업로드 (330 paths + `book/GNSS.pdf`)
- [ ] `npm run verify:production` → **15/15**

---

## 7. 관련 문서

| 문서 | 용도 |
|------|------|
| [10-최종-완료-및-운영-가이드.md](./10-최종-완료-및-운영-가이드.md) | **★ 최종 요약·운영** |
| [05-기술자료-수정-배포-검증.md](./05-기술자료-수정-배포-검증.md) | Phase별 변경 이력 |
| [07-미구현-백로그.md](./07-미구현-백로그.md) | 잔여 QA·blocker |
| [AGENTS.md](../AGENTS.md) | 에이전트·빌드 진입점 |
| [book-web-consistency-audit.md](./book-web-consistency-audit.md) | KDS/book 정합성 |

---

## 8. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-25 | GNSS 콘텐츠·IMG-043·`audit:book` GNSS 체크 |
| 2026-06-25 | `canonical-image-webp.json` · 중복 WebP 검증·정리 |
| 2026-06-25 | `verify:deploy` · manifest `book/GNSS.pdf` |
| 2026-06-25 | **최종 문서** [10-최종-완료-및-운영-가이드.md](./10-최종-완료-및-운영-가이드.md) |
