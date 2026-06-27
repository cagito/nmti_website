# IIS 배포 원칙 (필독)

## 절대 원칙: 최상위 `web.config` 수정 금지

**경로:** 저장소 루트 `website/web.config` (`homepage` 폴더의 **한 단계 위**)

```
website/
├── web.config          ← ⛔ 절대 수정·추가·삭제 금지 (에이전트·개발자 공통)
└── homepage/
    ├── web.config      ← ✅ 이 프로젝트에서 허용되는 IIS 설정 파일
    └── technology/
        └── (web.config 없음 — rewrite 사용 안 함)
```

### 왜 금지인가

- 최상위 `web.config`에 URL Rewrite 등을 넣으면 **사이트 전체**에 영향을 줍니다.
- 과거 SPA용 rewrite 추가 시 **루트·다른 경로에서 HTTP 500**이 발생한 사례가 있습니다.
- 호스팅 루트는 NMTI 웹사이트 전체(다수 하위 폴더)를 아우르므로, `homepage` 작업만으로 건드리면 안 됩니다.

### 에이전트·개발자 준수 사항

1. **`website/web.config`를 열지도, 수정하지도, 커밋하지도 않는다.**
2. IIS URL Rewrite, SPA fallback, 전역 redirect 규칙을 **최상위에 추가하지 않는다.**
3. 기술자료 SPA 라우팅은 **해시 URL**로만 처리한다.  
   예: `/homepage/technology/#fields/bridge`  
   (서버 rewrite 불필요)
4. MIME 타입·기본 문서 등 **homepage 전용** 설정만 `homepage/web.config`에서 관리한다.
5. `homepage/web.config`에도 **전역 영향이 큰 rewrite 규칙**은 넣지 않는다. (500 재발 방지)

### 배포·검증 체크리스트

수정 반영·FTP 업로드·운영 재검증 절차는 **[05-기술자료-수정-배포-검증.md](./05-기술자료-수정-배포-검증.md)** 를 따른다.

### 기술자료 링크 형식

| 용도 | URL |
|------|-----|
| SPA 앱 내 이동 | `https://www.nmti.co.kr/homepage/technology/#fields/bridge` |
| **SEO·사이트맵·canonical** | `https://www.nmti.co.kr/homepage/technology/fields/bridge/` |
| 지중경사계 전용 정적 페이지 | `https://www.nmti.co.kr/homepage/sensors/inclinometer/` |

- 사이트맵: `homepage/sitemap.xml` — Google은 `#` fragment를 무시하므로 기술자료는 **경로 URL**로 등록한다.
- 루트 `website/robots.txt`는 `Allow: /` 이어야 하며 `Disallow: /homepage/` 를 두면 전체 homepage가 크롤링 차단된다.
- 루트 `website/sitemap.xml`은 `homepage/sitemap.xml`을 가리키는 sitemap index이다.
- `technology/{nodeId}/index.html` 정적 페이지는 `scripts/generate-technology-seo-pages.mjs`로 생성한다 (rewrite 없음).

### 문제 발생 시

- 500 오류 → 최상위 `web.config` 변경 여부를 **먼저** 확인하고, 변경분을 되돌린다.
- 기술자료 딥링크 → rewrite가 아니라 **해시 URL**과 `app.js` 라우터를 점검한다.

---

*이 문서는 운영 사고 방지를 위한 필수 원칙입니다. 예외 없음.*
