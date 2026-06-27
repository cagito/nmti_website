# nmti_website

(주)신계측기술정보 홍보용 정적 홈페이지입니다.

## ⛔ 배포 필수 원칙 (절대 위반 금지)

**최상위 `website/web.config`** (`homepage` 폴더 **바로 위**)는 **절대 수정하지 않는다.**  
URL Rewrite 등을 넣으면 사이트 전체 HTTP 500이 날 수 있다. 자세한 내용은 [docs/DEPLOYMENT-IIS.md](./docs/DEPLOYMENT-IIS.md).

- IIS 설정 변경: **`homepage/web.config`만** 허용
- 기술자료 SPA: **해시 라우팅** (`/homepage/technology/#fields/bridge`) — rewrite 사용 안 함

## 배포 경로

- Canonical URL: `https://www.nmti.co.kr/homepage/`
- HTML base path: `/homepage/`

## 주요 구성

- `index.html`: 원페이지 본문 콘텐츠
- `technology/`: 건설계측 기술자료 SPA (해시 라우팅)
- `css/style.css`: 디자인 시스템과 반응형 레이아웃
- `js/main.js`: 모바일 메뉴, 스크롤 이동, 섹션 활성화, 상단 이동 버튼
- `js/map.js`: 본사/지사 지도 표시
- `js/technology/`: 기술자료 TreeView·콘텐츠·라우터
- `assets/images/`: 현장 이미지, OG 이미지, 기술 삽도 (`assets/images/technology/`)
- `ImageWorks/`: 기술 삽도 프롬프트·마스터리스트 패키지
- `scripts/`: `generate-image-assets.mjs`, `build-content-data.mjs` 등 빌드 스크립트

## 기술자료·이미지 빌드

```bash
npm run build:all                       # content · SEO · sitemap
npm run build:images                    # images.js · IMAGE_REVIEW_LOG
node scripts/validate-terminology.mjs   # KDS/KCS (콘텐츠 수정 후)
npm run verify:local                    # 로컬 통합 7단계
npm run verify:deploy                   # 배포 산출물 8 checks
npm run verify:production               # 운영 13 checks (FTP 후)
```

- 콘텐츠 수정: `scripts/content-data/*.mjs`
- **용어 기준:** `book/KDS-KCS_용어기준.md`
- **최종 가이드:** [docs/10-최종-완료-및-운영-가이드.md](./docs/10-최종-완료-및-운영-가이드.md)
- 에이전트·배포: `AGENTS.md`, `docs/DEPLOYMENT-IIS.md`

## 콘텐츠 관리 기준

- 수행실적은 `index.html`의 `#projects` 섹션에서 관리합니다.
- 사업분야는 `#services` 섹션에서 관리합니다.
- 인증·특허는 `#certifications` 섹션에서 관리합니다.
- 이미지 교체 시 동일 파일명을 유지하면 HTML 수정 없이 반영됩니다.

## 이미지 기준

- 실제 현장·장비·설치 사진을 우선 사용합니다.
- 가상 대시보드, 미래형 합성 이미지, 과한 네온 이미지는 사용하지 않습니다.
- 공개 전 사람 얼굴, 차량번호, 민감한 현장 정보가 보이는지 확인합니다.
- 권장 포맷: WebP, OG 이미지는 JPG.

## 검수 항목

1. PC/태블릿/모바일 레이아웃 확인
2. `/homepage/` 하위 경로에서 이미지와 CSS 로딩 확인
3. 전화, 이메일, 지도 링크 확인
4. 수행실적과 인증 정보가 최신 지명원 기준과 일치하는지 확인
