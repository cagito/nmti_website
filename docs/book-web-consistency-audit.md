# book PDF ↔ 웹 전체 정합성 감사

> 작성: 2026-06-25  
> 범위: `book/` 기준서·지명원 PDF, `index.html`, 기술자료 SPA(`js/technology/`, `scripts/content-data/`), SEO 정적 페이지  
> 용어 기준: [book/KDS-KCS_용어기준.md](../book/KDS-KCS_용어기준.md)  
> 기계 판독 결과: [book-consistency-audit.json](./book-consistency-audit.json)  
> 재실행: `python scripts/audit_book_pdf.py`

---

## 1. 목적

`book/`에 보관된 **KDS/KCS 설계·시공 기준**과 **지명원(회사소개)** PDF를 기준으로, 홈페이지·기술자료 전체가 **용어·항목·회사정보** 측면에서 일치하는지 점검하고, 수정 작업의 백로그로 고정한다.

| 구분 | 대조 대상 |
|------|-----------|
| 기준서 | KDS 11 10 15, KCS 11 10 15, KDS 27 50 10, KCS 24 99 05, KCS 54 20 25 |
| 회사자료 | `25년 12월 지명원-(주)신계측기술정보.pdf`, `241226 지명원_신계측기술정보.pdf` |
| 웹 | `index.html`, `technology/**`, `sensors/inclinometer/`, `sitemap.xml` |

**본 감사 범위 외:** `book/` 내 현장 계측도면 PDF(대구통합, 도담영천, 그랑르피에드 등) — §12 부록 참고.

---

## 2. 감사 방법

1. `book/` PDF 텍스트 추출 (`pypdf`)
2. `js/technology/dictionary.js` 트리·`content-data.js` 본문과 KDS/KCS 필수 계측항목 대조
3. 지명원 PDF ↔ `index.html` 회사정보·사업분야·인증 대조
4. `node scripts/validate-terminology.mjs` 통과 여부와 **검사 범위** 별도 기록
5. 자동 요약: `scripts/audit_book_pdf.py` → `docs/book-consistency-audit.json`

---

## 3. 요약 (2026-06-25 갱신)

| 우선순위 | 상태 | 요약 |
|----------|------|------|
| **P0** | ✅ 완료 | 용어·주소·JSON-LD — 로컬·운영 반영 |
| **P1** | ✅ 완료 | 터널 3항목, 검증 범위, `tree.js` — 로컬·운영 반영 |
| **P2** | ✅ 완료 | 항만·호안, 교량·댐 KCS, 보일러플레이트, 지명원, IMG-040 |
| **P3** | ✅ 완료 | 5종 PDF 용어 추출, 기준서 참조, 현장 도면 1차 교차검증 |
| **잔여** | 0건 | 지중경사계: SPA 요약 + `/sensors/inclinometer/` canonical (의도적 분리) |

자동 감사: `python scripts/audit_book_pdf.py` → **이슈 0건** ([book-consistency-audit.json](./book-consistency-audit.json)).

---

## 4. KDS/KCS — 구조·항목 누락

### 4.1 터널 계측 (`fields/tunnel/*`) vs KDS 4.1.5

**2026-06-25 반영:** 아래 3항목 전용 리프·콘텐츠 추가 완료.

| KDS 항목 | slug | 상태 |
|----------|------|------|
| **지표 및 지중침하** | `fields/tunnel/surface-subsidence` | ✅ |
| **막장전방 선행변위** | `fields/tunnel/face-advance` | ✅ |
| **강지보 응력** | `fields/tunnel/steel-support` | ✅ |

**터널 하위 메뉴(8):** 지표·지중침하, 천단침하, 내공변위, 지중변위, 막장전방 선행변위, 록볼트 축력, 숏크리트, 강지보 응력.

**slug 예외 (유지):** `fields/tunnel/convergence` → 화면 라벨 **내공변위**.

**선택 항목:** 지반수평변위·시설물경사·발파진동·소음 — ✅ `fields/tunnel/blast-vibration` 리프·키워드 cross-link (2026-06-25).

### 4.2 KDS/KCS 적용 범위 — 분야

| 분야 | 웹 (2026-06-25) |
|------|-----------------|
| **항만·호안** | ✅ `fields/harbor/` (+ 리프 3) |
| **건축공사** | ✅ `fields/building/` (+ 리프 5, KCS 3.9) |
| 하천제방 | 댐·제방에 일부 흡수 |
| 발파진동 유발 | 진동계 문단 산재 |

### 4.3 교량 (`KCS 24 99 05`)

✅ 온도·지진·종·횡변위 리프 추가 (`temperature`, `seismic`, `deck-displacement`).

### 4.4 댐·제방 (`KCS 54 20 25`)

✅ 온도·지진·변형률·기울기 리프 추가. 유량은 `fields/dam/leakage`(누수)에서 다룸.

### 4.5 기준서 참조 체계

✅ `KDS-KCS_용어기준.md`에 KDS 27 50 10·KCS 24 99 05·KCS 54 20 25 반영.  
✅ `analyze_kds_kcs_terms.py` 5종 PDF → `book/_kds_kcs_term_extract.json` 갱신.

---

## 5. KDS/KCS — 용어 정합성

### 5.1 검증 범위 (2026-06-25)

`validate-terminology.mjs` 스캔: `scripts/content-data/`, `js/technology/`, `ImageWorks/`, **`index.html`**, **`sensors/`**, **`technology/**/index.html`**.

**수정 완료:** inclinometer 동일시 문구, `내공변위` 띄어쓰기, IMG-040 LVDT 파일명, 침하 표 `안정화`.

### 5.2 병기·문맥 보완

| 항목 | 내용 |
|------|------|
| 어스앵커 | KDS 표4.1-1: 앵커 장력 = **로드셀** — 어스앵커 페이지 로드셀 병기 부족 |
| 록볼트 메뉴 | 트리 「록볼트」 vs KDS 「록볼트 **축력**」 |
| KCS 용어 | **계측책임자** (KCS 1.3) 기술자료 본문 거의 미사용 |

---

## 6. 지명원 PDF ↔ `index.html`

### 6.1 회사정보 불일치

| 항목 | 지명원 (2025.12) | 홈페이지 | 상태 |
|------|------------------|----------|------|
| 본사 주소 | 가산디지털1로 84, **4층 403호** | JSON-LD·푸터·연락처 통일 | ✅ (로컬) |
| 회사 연혁 | 2004·2015·2020·2023·2025 | About 태그 반영 | ✅ |
| 중소기업 확인 | 2023.04 | 인증 그리드 카드 | ✅ |
| 엔지니어링 | **2025.02 토질·지질** | E-09 + 시기·분야 표기 | ✅ |
| 특허 | 제10-2199043호 (2020.12) | 동일 번호 ✅ | ✅ |
| 대표·연락처·지사 | 황인섭, 02-865-2188~9, 복용동로 43 | 일치 | ✅ |

### 6.2 수행분야 vs 홈 사업분야

**지명원에 있으나 홈·기술자료에서 약함:**

- ~~피로계측 (지명원 §2.4.5)~~ → ✅ 재하시험·내하력 카드 반영 (2026-06-25)
- ~~상품용역(센서 수입·판매·제작)~~ → ✅ 건설계측 사업분야 반영 (2026-06-25)
- 2025년 계약 실적 표 (홈 미게재 — 의도적 생략 가능)

**홈에 반영됨:** 건설계측, 자동화, 지반조사, 재하시험·내하력, 케이블 장력, 토목설계·비탈면, Face Mapping, 인접건물 조사 등.

---

## 7. 콘텐츠·운영 품질

### 7.1 보일러플레이트

✅ `padOverview()` 축소·분야별 맞춤 문단으로 교체 (2026-06-25).

### 7.2 지중경사계 이중 경로 (해결 — 의도적 분리)

| 역할 | URL | SEO |
|------|-----|-----|
| **상세·canonical** | `/homepage/sensors/inclinometer/` | sitemap·`rel=canonical` |
| **요약·연계** | `/homepage/technology/#sensors/inclinometer` | SEO 정적 페이지 **생략** (`SKIP_IDS`) |

SPA `detailLink` → 정적 페이지. 정적 CTA → SPA 연계 분야. `generate-technology-seo-pages.mjs`·`generate-sitemap-technology.mjs`와 동기화.

### 7.3 기술 트리 UX

`js/technology/tree.js`: `fields/*` 3단계 리프 `isFieldLeaf` — navigable (2026-06-25, 운영 반영).

### 7.4 SEO (별도 트랙)

루트 `robots.txt` `Disallow: /homepage/` — SEO 작업에서 수정됨. 서버 배포·Search Console 재검증 필요. [DEPLOYMENT-IIS.md](./DEPLOYMENT-IIS.md)

---

## 8. 수정 우선순위 백로그

### P0 — 즉시 (용어·회사정보)

- [x] `sensors/inclinometer/index.html` 인클리노미터 문구 삭제·KDS 정의로 교체
- [x] `index.html` 「내공 변위」→「내공변위」
- [x] JSON-LD·푸터 주소 `4층 403호` 통일

### P1 — 구조·검증

- [x] 터널: 지표·지중침하, 막장전방 선행변위, 강지보 응력 노드·콘텐츠
- [x] `validate-terminology.mjs` 범위 확대: `index.html`, `sensors/`, `technology/**/index.html`
- [x] `tree.js` 수정분

### P2 — 분야·콘텐츠 심화

- [x] 항만·호안 `fields/harbor/` — **2026-06-22:** `quay-wall` · `caisson` 리프 · §4.9②
- [x] **다점지중변위계** `sensors/borehole-extensometer` · MPBX · §4.5⑨
- [x] 교량·댐 KCS 세부 항목 보강 · **댐/철도 AI 프롬프트** docs/36 §4.9
- [x] 보일러플레이트 분야별 재작성
- [x] 지명원 연혁·중소기업 확인 → About·인증 섹션
- [x] IMG-040 LVDT 파일명·alt 정리

### P3 — 인프라

- [x] `KDS 27 50 10`, `KCS 24 99 05`, `KCS 54 20 25` → `_kds_kcs_term_extract.json` 갱신 (`analyze_kds_kcs_terms.py`)
- [x] `KDS-KCS_용어기준.md` 기준서 목록·교량/댐 절 확장
- [x] book 현장 도면 PDF ↔ 기술자료 1차 교차 검증 (`book-site-plan-crosscheck.md`)

---

## 9. 자동 감사 이슈 목록 (JSON)

`docs/book-consistency-audit.json` (2026-06-25): **이슈 0건** — P0~P3 반영 및 감사 로직 정비 완료.

재실행: `python scripts/audit_book_pdf.py`

---

## 10. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-25 | 최초 감사·문서화. `scripts/audit_book_pdf.py` 추가 |
| 2026-06-25 | `tree.js` fields 리프 navigable 수정 (운영 반영) |
| 2026-06-25 | P0~P2 백로그 구현·검증 → [05-기술자료-수정-배포-검증.md](./05-기술자료-수정-배포-검증.md) |
| 2026-06-25 | 지중경사계 canonical·감사 0건·지명원 피로·상품용역 |
| 2026-06-22 | dictionary 104노드 · harbor quay/caisson · MPBX · docs/36 §4.9·§6.1 |
| 2026-06-25 | 터널 히어로 분리 — [06-터널-히어로-및-콘텐츠-API.md](./06-터널-히어로-및-콘텐츠-API.md) |
| 2026-06-25 | 가시설·터널 Figure 7종 재생성 — [image-audit.md](./image-audit.md) §12 |

---

## 11. 관련 문서

| 문서 | 용도 |
|------|------|
| [TERMINOLOGY.md](./TERMINOLOGY.md) | 용어 기준 진입점 |
| [book/KDS-KCS_용어기준.md](../book/KDS-KCS_용어기준.md) | 최상위 용어 규칙 |
| [03-콘텐츠-정보.md](./03-콘텐츠-정보.md) | 지명원 추출 텍스트 (구버전 가능) |
| [image-audit.md](./image-audit.md) | 이미지·Figure 검수 |
| [05-기술자료-수정-배포-검증.md](./05-기술자료-수정-배포-검증.md) | 수정·로컬/운영 검증·FTP 체크리스트 |
| [book-site-plan-crosscheck.md](./book-site-plan-crosscheck.md) | 현장 도면 1차 키워드 매핑 |
| [06-터널-히어로-및-콘텐츠-API.md](./06-터널-히어로-및-콘텐츠-API.md) | heroCaption·터널 Figure 매핑 |
| [07-미구현-백로그.md](./07-미구현-백로그.md) | 잔여 작업 통합 목록 |
| [DEPLOYMENT-IIS.md](./DEPLOYMENT-IIS.md) | 배포·SEO 주의 |

---

## 12. 부록 — `book/` 현장 계측도면 PDF (미대조)

다음 파일은 **회사 실적·현장 준공/유지관리 도면**으로, 본 감사에서 본문 대조는 하지 않았다. 향후 Figure·배치도 검증 시 참고.

- `3-150120_대구통합계측 준공도면.pdf`
- `도담영천 터널 계측 도면2.pdf`, `도담영천 토공 계측 도면.pdf`
- `페이지 원본 2. 계측도면_그랑르피에드.pdf`
- `계측계획도면.pdf`, `03 계측계획도면.pdf`
- `2. 유지관리계측 도면.pdf`, `붙임3. 유지관리계측도면(도영9).pdf`
- `추가첨부2. 유지관리계측 도면(도담_영천6공구).pdf`
- `A3도면-설치및시공, 계측결과.pdf`

**권장 후속:** 대표 도면 1~2건을 선정해 `fields/*`·IMG 배치도와 측점·센서 종류 일치 여부를 [image-audit.md](./image-audit.md) 형식으로 확장 감사.
