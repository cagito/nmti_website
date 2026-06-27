# 터널 계측 히어로·콘텐츠 API

**최종 갱신:** 2026-06-25  
**관련:** [05-기술자료-수정-배포-검증.md](./05-기술자료-수정-배포-검증.md), [image-audit.md](./image-audit.md), [book-web-consistency-audit.md](./book-web-consistency-audit.md)

---

## 1. 배경

터널 리프 페이지 중 `face-advance`(막장전방 선행변위)·`surface-subsidence`(지표·지중침하)가 **IMG-010**(지표침하) 히어로를 공유해 SEO figcaption이 항목과 불일치했습니다.  
전용 PNG(예: IMG-063) 없이도 **imageId 분리 + heroCaption**으로 항목별 문구를 맞출 수 있도록 빌드 파이프라인을 확장했습니다.

---

## 2. 콘텐츠 빌드 API (`heroImageId` / `heroCaption` / `heroAlt`)

### 2.1 정의 위치

| 필드 | 정의 | 빌드 반영 |
|------|------|-----------|
| `heroImageId` | `scripts/content-data/leaves-part*.mjs` 리프 객체 | `build-content-data.mjs` → `CONTENT[id]` |
| `heroCaption` | 동일 | SEO·SPA figcaption에 사용 |
| `heroAlt` | 동일 (선택) | img `alt` 덮어쓰기 |

`js/technology/dictionary.js`의 `imageId`는 노드 기본값이며, 리프에 `heroImageId`가 있으면 **리프 값이 우선**합니다.

### 2.2 런타임 처리

```
leaves-part*.mjs
  → build-content-data.mjs (CONTENT JSON 생성)
  → content-data.js finalizeContent()
  → heroFor(heroNode)  // helpers-template.mjs
  → resolveImage(imageId, { caption: heroCaption })
```

`getContentForNode()` 호출 시 `heroImage.caption`이 SEO 생성기·SPA `renderFigure`에 전달됩니다.

### 2.3 추가 예시 (새 리프)

```javascript
// scripts/content-data/leaves-part2.mjs
'fields/tunnel/example': {
  heroImageId: 'IMG-007',
  heroCaption: '터널 계측 개념도 — ○○ 항목 배치 참고',
  overview: '<p>…</p>',
  sectionImages: {
    installation: { id: 'IMG-040', caption: '…', figureNo: 2 }
  }
}
```

빌드 후:

```bash
node scripts/build-content-data.mjs
node scripts/generate-technology-seo-pages.mjs
```

---

## 3. 터널 리프 히어로 매핑 (2026-06-25)

| 노드 | imageId | heroCaption / 비고 |
|------|---------|-------------------|
| `crown-settlement` | IMG-061 | 천단침하 전용 Figure |
| `surface-subsidence` | IMG-010 | 지표·지중침하 전용 caption |
| `convergence` | IMG-008 | 내공변위 — **상부 아치 P1~P5** (360°·ACE 금지) |
| `ground-displacement` | IMG-025 | 지중변위 (지중경사계 시스템) |
| `face-advance` | **IMG-063** | 막장전방 전용 Figure (2026-06-25 배포) + section IMG-040 |
| `rockbolt` | **IMG-078** | 록볼트 축력 hero — **PASS v2** |
| `shotcrete` | **IMG-079** | 숏크리트 hero — **PASS v2** |
| `steel-support` | **IMG-080** | 강지보 응력 — hero·principle 동일 Figure |
| `blast-vibration` | **IMG-097** | 발파진동·영향권 — **PASS v1** |

### 3.1 sectionImages (터널)

| 노드 | 섹션 | Figure |
|------|------|--------|
| `surface-subsidence` | installation, data | IMG-010, IMG-050 |
| `crown-settlement` | principle, data | IMG-061, IMG-050 |
| `face-advance` | installation, data | IMG-040, IMG-050 |
| `steel-support` | principle | **IMG-080** |

---

## 4. SEO·운영 검증

| URL | 확인 |
|-----|------|
| `/technology/fields/tunnel/face-advance/` | 히어로 **IMG-063**, figcaption **막장전방** |
| `/technology/fields/tunnel/steel-support/` | 히어로 **IMG-080**, principle **IMG-080**, 본문 **강지보**·**변형률계** |
| `/technology/fields/tunnel/surface-subsidence/` | caption **지표·지중침하** |

자동:

```bash
node scripts/verify-production.mjs   # 6건 — 막장전방은 IMG-063 URL 포함 확인
```

SPA 해시(`#fields/tunnel/face-advance`)는 서버 fetch 불가 — 브라우저에서 동일 figcaption 확인.

---

## 5. 잔여 백로그

| 우선 | 항목 |
|------|------|
| ~~P1~~ | ~~IMG-008~~ 육안 P |
| ~~P2~~ | ~~IMG-063~~ · ~~록볼트/숏크리트/강지보~~ IMG-078~080 |
| ~~P3~~ | ~~발파진동·영향권~~ `blast-vibration` 리프 (2026-06-25) |

잔여: [07-미구현-백로그.md](./07-미구현-백로그.md) §3 (도면 픽셀 수동 QA만)

---

## 6. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-25 | `heroImageId`·`heroCaption` 빌드 API 추가 |
| 2026-06-25 | 터널 4리프 imageId·caption 분리, `verify-production` 6건 확장 |
| 2026-06-25 | **IMG-063** 배포·`face-advance` 히어로 교체 |
| 2026-06-25 | **IMG-061** 천단침하 전용·`crown-settlement` imageId |
| 2026-06-25 | 가시설·터널 Figure 7종 재생성 — [image-audit.md](./image-audit.md) §12 |
