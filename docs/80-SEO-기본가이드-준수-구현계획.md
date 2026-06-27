# Google SEO 기본 가이드 준수 — 구현 계획

**수립:** 2026-06-22 · **구현 완료:** 2026-06-22 → [81 완료 보고](./81-SEO-기본가이드-준수-구현-완료-보고.md)  
**우선순위:** **P1** (검색 노출·중복 신호 제거 · 크롤 발견성)  
**선행 점검:** SEO 감사 (2026-06-22 대화) — 준수율 약 75~80%, 치명 차단 없음  
**참고 패턴:** [44-메뉴·템플릿 통합](./44-건설계측-메뉴·템플릿-통합-구현계획.md) · [05-기술자료-수정-배포-검증](./05-기술자료-수정-배포-검증.md) · [DEPLOYMENT-IIS](./DEPLOYMENT-IIS.md)

> **한 줄:** 정적 SEO 페이지 121개·사이트맵·구조화 데이터는 이미 양호. **중복 title 11쌍**, **사이트맵 해시 URL**, **홈→기술 해시 링크**, **기술 허브 메타** 4가지를 생성기·검증 스크립트 중심으로 일괄 정리한다.

---

## 1. 현황·갭 요약

### 1.1 이미 충족 (재작업 최소)

| 영역 | 상태 |
|------|------|
| `robots.txt` Allow, `noindex` 없음 | ✅ |
| 홈·기술 leaf — canonical, description, OG, JSON-LD | ✅ |
| 기술자료 SPA + 정적 SEO 이중 구조 | ✅ (권장 패턴) |
| `sitemap.xml` 124 URL + image extension | ✅ |
| skip-link, h1, 이미지 alt (샘플 검증) | ✅ |
| `validate:heroes` · `verify:production` SEO 샘플 | ✅ |

### 1.2 개선 대상 (본 계획 범위)

| # | 갭 | 영향 | 우선순위 |
|---|-----|------|----------|
| G1 | **중복 `<title>` / description 11쌍** | SERP 혼동·중복 신호 | **P0** |
| G2 | 사이트맵 `#about` 등 해시 URL 7개 | Google이 fragment 무시 → 무의미 항목 | **P1** |
| G3 | 홈 `index.html` 기술 링크 21곳 `#hash` | 크롤러가 정적 SEO URL 발견 약함 | **P1** |
| G4 | `technology/index.html` — `og:image`·Twitter·JSON-LD 없음 | 허브 공유·리치 결과 약함 | **P2** |
| G5 | leaf SEO 페이지 `twitter:card` 없음 | 소셜 미리보기 일부 플랫폼 | **P3** |
| G6 | `robots.txt` 사이트맵 2줄 (루트 + `/homepage/`) | 루트 404 가능성 | **P2** (운영 확인) |

### 1.3 중복 title 11쌍 (정본 목록)

| 공통 제목 | URL A | URL B |
|-----------|-------|-------|
| 지중변위 | `fields/tunnel/ground-displacement` | `fields/slope/ground-displacement` |
| 주변건물 | `fields/building/adjacent-building` | `fields/retaining-excavation/adjacent-building` |
| 균열 | `fields/building/crack` | `fields/structural-safety/crack` |
| 응력·변형률 | `fields/building/stress-strain` | `fields/dam/strain` |
| 처짐 | `fields/building/deflection` | `fields/bridge/deflection` |
| 진동 | `fields/structural-safety/vibration` | `fields/bridge/vibration` |
| 변위 | `fields/structural-safety/displacement` | `fields/dam/displacement` |
| 지진 | `fields/bridge/seismic` | `fields/dam/seismic` |
| 온도 | `fields/bridge/temperature` | `fields/dam/temperature` |
| 주변지반 | `fields/retaining-excavation/surrounding-ground` | `fields/harbor/surrounding-ground` |
| 침하 | `fields/dam/settlement` | `fields/soft-ground/settlement` |

**근본 원인:** `generate-technology-seo-pages.mjs` L154~156 — leaf `label`만으로 `title | 건설 계측 …` 조합. 분야(교량·댐 등) 맥락 미포함.

---

## 2. 목표 아키텍처

### 2.1 TO-BE title 규칙

```text
[분야 카테고리 라벨] [리프 라벨] | 건설 계측 기술 자료 | NMTI

예)
  처짐 (bridge/deflection)  → 교량 처짐 | 건설 계측 기술 자료 | NMTI
  처짐 (building/deflection) → 건축·인접 구조물 처짐 | …
  교량 (fields/bridge)       → 교량 | …  (분야 상위는 기존 유지)
  지하수위계 (sensor)        → 지하수위계 | …  (이미 고유 — 접두 불필요)
```

**접두 조건 (생성기 단일 함수):**

1. `nodeId`에 `/` 포함 (리프·하위 노드)
2. `getNode(parentId)`가 `fields/*` 분야 카테고리 (`type === 'field'` 또는 `parentId`가 `fields/xxx` 형태의 카테고리)
3. 접두 = **직계 분야 카테고리** `label` (breadcrumb 4번째 또는 `findParentChain`의 `fields/…` 노드)

**description:** `metaDescription` 필드 우선 → 없으면 `seoTitle + '의 측정 목적…'` (helpers-template 패턴). title 접두와 연동되면 11쌍 description도 자동 분리.

**SPA 동기화:** `js/technology/seo.js` `updateSeo()`에 동일 `seoPageTitle(nodeId)` 로직 공유 (모듈 추출).

### 2.2 TO-BE 사이트맵

```text
staticUrls = [
  /homepage/                    (priority 1.0)
  /homepage/technology/         (기존 techUrls[0])
  /homepage/sensors/inclinometer/
]
#about, #fields … 7개 제거
```

홈 단일 페이지 섹션(`#about` 등)은 **초기 HTML에 본문 존재** → 홈 URL 하나로 색인 충분.

### 2.3 TO-BE 내부 링크 (홈)

```text
AS-IS: /homepage/technology/#fields/bridge
TO-BE: /homepage/technology/fields/bridge/
```

- 크롤러: 정적 SEO HTML·breadcrumb·내부 링크 그래프 강화
- 사용자: 정적 요약 페이지 → 「인터랙티브 기술자료에서 전체 보기」 CTA로 SPA 진입 (기존 SEO 페이지 패턴)
- `target="_blank"` 유지 여부: **기존과 동일** (본 계획에서 변경 없음)

### 2.4 TO-BE 기술 허브 (`technology/index.html`)

| 메타 | 값 |
|------|-----|
| `og:image` | `hero-civil-monitoring.webp` (홈과 동일 fallback) |
| `twitter:card` | `summary_large_image` |
| JSON-LD | `WebPage` + `isPartOf` → `WebSite` (홈과 동일 publisher) |

SPA 런타임 `updateSeo('intro')`와 정적 `<head>` 정합.

### 2.5 범위 외

| 항목 | 사유 |
|------|------|
| IIS URL Rewrite / SPA fallback | [DEPLOYMENT-IIS](./DEPLOYMENT-IIS.md) 금지 — 해시 라우팅 유지 |
| Search Console·PageSpeed 실측 | 운영·수동 (Phase E) |
| 전 페이지 purpose 카드 Phase C | 별도 백로그 |
| `hreflang` | 단일 언어(ko) — 불필요 |

---

## 3. 구현 Phase

### Phase A — SEO title/description 생성 로직 (0.5일) · P0

| # | 작업 | 파일 |
|---|------|------|
| A1 | `seoDisplayTitle(nodeId, label)` 함수 추가 — 분야 접두 규칙 | `scripts/seo-title.mjs` (신규) |
| A2 | `renderPage()` — `pageTitle`, `desc`, JSON-LD `headline`에 적용 | `scripts/generate-technology-seo-pages.mjs` |
| A3 | SPA `updateSeo()` 동일 함수 import | `js/technology/seo.js` |
| A4 | (선택) `helpers-template.mjs` `metaDescription(title)` — title이 이미 접두 포함 시 그대로 사용 | `scripts/content-data/helpers-template.mjs` |

**`seoDisplayTitle` 의사코드:**

```javascript
export function seoDisplayTitle(nodeId, label) {
  if (!nodeId || !nodeId.includes('/')) return label;
  const parts = nodeId.split('/');
  if (parts[0] !== 'fields' || parts.length < 2) return label;
  const fieldCategoryId = parts[0] + '/' + parts[1]; // fields/bridge
  const parent = getNode(fieldCategoryId);
  if (!parent?.label) return label;
  // 리프가 분야 상위 자신이면 접두 생략
  if (nodeId === fieldCategoryId) return label;
  return parent.label + ' ' + label;
}
```

**검증:** `npm run build:seo` 후 11쌍 title 유일성 수동·스크립트 확인.

---

### Phase B — 사이트맵·robots 정리 (0.25일) · P1

| # | 작업 | 파일 |
|---|------|------|
| B1 | `staticUrls`에서 `#about`~`#contact` 7개 제거 | `scripts/generate-sitemap-technology.mjs` |
| B2 | `npm run sitemap` → `sitemap.xml` 재생성 (URL 수 124 → **117** 예상) | `sitemap.xml` |
| B3 | 프로덕션 `/sitemap.xml` 존재 여부 확인 — 없으면 `robots.txt`를 `/homepage/sitemap.xml` 단일 선언으로 | `robots.txt` |

**주의:** 루트 `website/sitemap.xml`은 **본 저장소 밖** — FTP·IIS 담당자와 합의 후 수정. 저장소 내 `robots.txt`만 변경 가능.

---

### Phase C — 홈 내부 링크 canonical화 (0.25일) · P1

| # | 작업 | 파일 |
|---|------|------|
| C1 | `technology/#…` → `technology/…/` (21곳) | `index.html` |
| C2 | 링크 대상 nodeId ↔ 경로 매핑 표 작성 (실수 방지) | 본 문서 부록 |

**매핑 예:**

| AS-IS hash | TO-BE path |
|------------|------------|
| `#fields/retaining-excavation/earth-retaining-wall` | `/homepage/technology/fields/retaining-excavation/earth-retaining-wall/` |
| `#fields/bridge` | `/homepage/technology/fields/bridge/` |
| `#sensors/remote-monitoring-system` | `/homepage/technology/sensors/remote-monitoring-system/` |
| `#fields/retaining-excavation` | `/homepage/technology/fields/retaining-excavation/` |

`#` 없는 `/homepage/technology/` 허브 링크 1곳은 유지.

---

### Phase D — 기술 허브·Twitter 메타 보강 (0.25일) · P2~P3

| # | 작업 | 파일 |
|---|------|------|
| D1 | `og:image`, `twitter:*` 정적 추가 | `technology/index.html` |
| D2 | `WebPage` JSON-LD `<script>` 추가 | 동일 |
| D3 | leaf SEO 페이지에 `twitter:card` + `twitter:image` (OG와 동일) | `generate-technology-seo-pages.mjs` |
| D4 | `updateSeo()` — twitter 메타 동적 설정 (SPA) | `js/technology/seo.js` |

---

### Phase E — 검증·배포 (0.5일)

| # | 작업 | 명령 |
|---|------|------|
| E1 | 콘텐츠·SEO·사이트맵 일괄 빌드 | `npm run build:all` |
| E2 | 히어로·용어·인용 검증 | `npm run validate:heroes` · `validate:terminology` · `validate:citations` |
| E3 | **신규** title 유일성 검증 | `validate:seo-titles` (아래 §4) |
| E4 | 배포 산출물 | `npm run verify:deploy` |
| E5 | 프로덕션 스팟 | `npm run verify:production` (기존 SEO must 유지) |
| E6 | (수동) Search Console — 사이트맵 재제출, URL 검사 2~3건 | 운영 |

---

## 4. 신규 검증 스크립트

### `scripts/validate-seo-titles.mjs`

```text
입력: technology/**/index.html (hub 제외 또는 포함)
검사:
  1. <title> 전역 유일 (0 duplicate)
  2. <meta name="description"> 전역 유일
  3. <link rel="canonical"> 존재
  4. (선택) title 길이 ≤ 60자 권고, description ≤ 160자
출력: FAIL 시 중복 쌍 경로 나열
exit 1 on failure
```

### `package.json`

```json
"validate:seo-titles": "node scripts/validate-seo-titles.mjs"
```

`verify:local` 체인 **말미**에 추가 (기존 CI 깨지지 않도록).

---

## 5. 파일 변경 요약

| 파일 | 변경 유형 |
|------|-----------|
| `scripts/seo-title.mjs` | **신규** |
| `scripts/validate-seo-titles.mjs` | **신규** |
| `scripts/generate-technology-seo-pages.mjs` | title·twitter |
| `scripts/generate-sitemap-technology.mjs` | hash URL 제거 |
| `js/technology/seo.js` | title·twitter 동기화 |
| `technology/**/index.html` | **재생성** 121개 |
| `sitemap.xml` | **재생성** |
| `index.html` | 내부 링크 21곳 |
| `technology/index.html` | 허브 메타 |
| `robots.txt` | (조건부) 사이트맵 1줄 |
| `package.json` | `validate:seo-titles` |

**직접 수동 편집 금지:** `technology/**/index.html` — 반드시 `build:seo`로만 갱신.

---

## 6. 리스크·완화

| 리스크 | 완화 |
|--------|------|
| title 길이 증가로 SERP 잘림 | 접두는 분야 라벨만; 60자 초과 시 `validate:seo-titles` warning |
| 홈 링크 → 정적 페이지 UX 변화 | CTA로 SPA 진입 유지; 필요 시 카드별 hash 유지는 **의도적 예외** (문서화) |
| Google 색인 지연 | Search Console URL 검사; canonical·sitemap 일치 |
| `verify:production` 문자열 must 실패 | bridge·GNSS 등 기존 must는 **본문 키워드** 기준 — title 변경과 무관, 배포 후 재실행 |

---

## 7. 완료 기준 (Definition of Done)

- [ ] 중복 `<title>` **0건** (`validate:seo-titles` PASS)
- [ ] `sitemap.xml`에 `#` fragment URL **0건**
- [ ] 홈 기술 autolink가 `/homepage/technology/.../` 경로 사용
- [ ] `technology/index.html`에 `og:image` + JSON-LD 존재
- [ ] `npm run build:all` · `validate:*` · `verify:deploy` PASS
- [ ] `verify:production` PASS (배포 후)
- [ ] 완료 보고서 `docs/81-SEO-기본가이드-준수-구현-완료-보고.md`

---

## 8. 일정·공수

| Phase | 공수 | 담당 |
|-------|------|------|
| A title 로직 | 0.5일 | 개발 |
| B 사이트맵 | 0.25일 | 개발 |
| C 홈 링크 | 0.25일 | 개발 |
| D 허브·Twitter | 0.25일 | 개발 |
| E 검증·배포 | 0.5일 | 개발 + 운영 |
| **합계** | **~1.75일** | |

**권장 순서:** A → B → `build:all` → C → D → E (A가 121페이지 메타의 기준).

---

## 부록 A — 홈 `index.html` 링크 매핑 (21곳)

| 섹션·카드 | nodeId | TO-BE canonical path |
|-----------|--------|----------------------|
| 가시설·흙막이 (2곳) | `fields/retaining-excavation/earth-retaining-wall` · `fields/retaining-excavation` | `…/fields/retaining-excavation/earth-retaining-wall/` · `…/fields/retaining-excavation/` |
| 교량·구조물 / 교량 (2곳) | `fields/bridge` | `…/fields/bridge/` |
| 터널 (2곳) | `fields/tunnel` | `…/fields/tunnel/` |
| 비탈면 (2곳) | `fields/slope` | `…/fields/slope/` |
| 연약 지반 / 지하수·연약 (2곳) | `fields/soft-ground` | `…/fields/soft-ground/` |
| 건축·인접 구조물 (2곳) | `fields/building` | `…/fields/building/` |
| 철도 (2곳) | `fields/railway` | `…/fields/railway/` |
| 댐·제방 (2곳) | `fields/dam` | `…/fields/dam/` |
| 항만·해안 (2곳) | `fields/harbor` | `…/fields/harbor/` |
| 자동화·유지 / 유지관리 / 자동화계측 (4곳) | `sensors/remote-monitoring-system` | `…/sensors/remote-monitoring-system/` |
| 건설계측 | (허브) | `/homepage/technology/` 유지 |

---

## 부록 B — 참고 코드 위치

| 역할 | 경로 |
|------|------|
| SEO 정적 페이지 생성 | `scripts/generate-technology-seo-pages.mjs` L153~156 |
| 사이트맵 생성 | `scripts/generate-sitemap-technology.mjs` L15~25 |
| SPA SEO 런타임 | `js/technology/seo.js` L6~37 |
| breadcrumb·경로 | `js/technology/dictionary.js` `nodePathSeo`, `getBreadcrumb` |
| 빌드 체인 | `package.json` `build:all` |
