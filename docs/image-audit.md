# NMTI 기술자료 이미지·측 콘텐츠 검수 및 수정 계획

> **2026-06-25 강제 표준:** [TECHNICAL_IMAGE_STANDARD.md](./TECHNICAL_IMAGE_STANDARD.md) · [INSTRUMENTATION_DRAWING_RULES.md](./INSTRUMENTATION_DRAWING_RULES.md) · [IMAGE_AUDIT_CHECKLIST.md](./IMAGE_AUDIT_CHECKLIST.md) · [IMAGE_REVIEW_LOG.md](./IMAGE_REVIEW_LOG.md) · `npm run audit:images`  
> **P1/P2/P3 실행 계획 (심층 리서치 반영):** [08-기술자료-이미지-심층리서치-구현계획.md](./08-기술자료-이미지-심층리서치-구현계획.md)  
> 미승인 이미지는 `resolveImage()`가 null — 운영 차단.

> 작성: 2026-06-25  
> 범위: `js/technology/` SPA, `scripts/content-data/`, `assets/images/technology/`, ImageWorks 프롬프트  
> 용어 기준: [book/KDS-KCS_용어기준.md](../book/KDS-KCS_용어기준.md)

---

## 1. 목표

기술자료 삽도를 **일반 설명 그림**이 아니라 **계측관리계획서·시방서·장비 매뉴얼**에 실을 수 있는 **기술 도식(Figure)** 수준으로 통일한다.

| 원칙 | 내용 |
|------|------|
| 표현 | 단면·배치·측정축·데이터 흐름이 한눈에 보이는 CAD/매뉴얼 Figure |
| 금지 | 센서 아이콘 나열, 사람·굴삭기 홍보, 실제 현장명·노선명·공구명 |
| 구분 | 지하수위계 ≠ 간극수압계, 지중경사계 ≠ 침하계, 하중계 = 축방향/앵커 두부, ATS ≠ 카메라, 내공변위 ≠ 천단침하, **GNSS = book/GNSS.pdf 기준국·이동국·RTK** |
| 콘텐츠 | hero 1장 + 섹션별 `sectionImages`(installation / principle / data / related) |
| 메타 | `alt` + **`caption`**(그림 번호·설명) 동시 제공 |

---

## 2. 현황 대조 (2026-06-25)

> §3.1은 **Phase 1 이전 초판** 등급표입니다. 최신 합격 등급은 **§10·§12**를 따릅니다.

### 2.1 dictionary.js ↔ images.js ↔ PNG

| 항목 | 결과 |
|------|------|
| 마스터리스트 (`03_IMAGE_MASTER_LIST.json`) | **64종** |
| 배포 PNG (`assets/images/technology/`) | **64종** |
| `IMAGE_ASSETS` (`images.js`) | **64종** |
| `dictionary.js` hero `imageId` | **44종** 참조 |
| WebP (`IMG-###.webp`) | **64종** (`convert-technology-webp.py`) |

### 2.2 자동 생성 파이프라인

```
03_IMAGE_MASTER_LIST.json (title, purpose, caption)
        ↓
assets/images/technology/IMG-XXX_*.png  (+ optional IMG-XXX.webp)
        ↓
scripts/generate-image-assets.mjs  →  js/technology/images.js (alt, caption, webp)
        ↓
scripts/build-content-data.mjs     →  sectionImages, heroCaption → resolveImage()
        ↓
content-loader.js renderFigure()   →  <figure><img><figcaption>
```

**Phase 0 완료 (2026-06-25):** caption·figcaption·sectionImages 객체·`heroCaption` API

### 2.3 sectionImages 사용 현황

| 패턴 | 예시 | 비고 |
|------|------|------|
| 다중 principle | `sensors/inclinometer` → IMG-028, IMG-026 | ✅ 모범 사례 |
| installation 단일 | `sensors/water-level-meter` → IMG-030 | 캡션 없음 |
| data 그래프 | `sensors/piezometer` → IMG-051 | 기술 도식·그래프 혼재 |
| 분야 leaf | `earth-retaining-wall` → overview·principle·data | IMG-062 연계 ✅ |
| hero만 | 다수 instrument/mode | 섹션 Figure 부족 |

---

## 3. 우선 10종 기술 검수 (초판 — 2026-06-25 AM)

> **§3.1은 Phase 1 착수 전 스냅샷(아카이브)입니다.** 운영·배포 등급은 **§10·§12** 및 `scripts/image-review-registry.json`이 최종입니다.  
> 불일치 추출: `node scripts/audit-image-doc-mismatch.mjs` → [image-doc-mismatch-report.md](./image-doc-mismatch-report.md)

### 3.1 요약표 (아카이브 → §10 동기화)

| ID | 제목 | 연결 노드 | §3 초판 | **§10 최종** | 비고 |
|----|------|-----------|---------|--------------|------|
| **IMG-002** | 흙막이 계측 대표 단면도 | `earth-retaining-wall` hero | C | **P** | v7 Pillow — 좌→우·11종·로거 지표함 |
| **IMG-025** | 지중경사계 시스템 구성도 | `sensors/inclinometer` hero | F | **P** | 케이싱 4홈·프로브·그래프 반영 |
| **IMG-027** | 지중경사계 설치 단면도 | inclinometer `installation` | C | **P** | 보링·활동면·안정층 |
| **IMG-008** | 터널 내공변위 | `fields/tunnel/convergence` hero | C | **P** | v3 Extension Tube 체인(P4–P5) |
| **IMG-034** | 토압계 설치 개념도 | `sensors/earth-pressure-cell` | C | **P** | 토압 작용 방향 |
| **IMG-035** | 하중계 설치 개념도 | `sensors/load-cell` | C | **P** | 끝단·앵커 두부 |
| **IMG-030** | 지하수위계 설치도 | `water-level-meter` installation | C | **P** | 관측공 개방 수면 |
| **IMG-031** | 간극수압계 설치도 | `piezometer` installation | F | **P** | 파일명·용어 정리 완료 (진동현식/VW 제거) |
| **IMG-042** | 자동광파기 계측 | `sensors/automated-total-station` hero | C | **P** | TS·시준선·벡터 |
| **IMG-058** | 원격계측 플랫폼 | `remote-monitoring-system` hero | C | **P** | 블록 아키텍처 |

### 3.2 항목별 상세 검수

#### IMG-002 — 흙막이 계측 설치 대표 단면도

| 체크 | 기준 | 상태 |
|------|------|------|
| 좌→우 | 인접건물 \| 배면 \| 벽체·띠장 \| 굴착측 | ✅ v4 |
| 11종 단면 표기 | 지중경사계~데이터로거 | ✅ |
| 지하수위선 | G.W.L | ✅ |
| 하단 원격 흐름도 | 없음 | ✅ |
| 버팀보 하중계 | **띠장–보 끝단** 축압축 | ⚠️ 프롬프트 v5·PNG 재검 |
| 어스앵커 하중계 | 굴착측 두부, 인장 T | ⚠️ ref-04 대조 |
| 데이터로거 | 배면 지표 센서단자함 | ⚠️ v4는 벽체 상부 — **지표함으로 수정** |
| 터널 요소 | 없음 | ✅ |

**조치:** `prompts/IMG-002_*.md` v5 → 재생성 → `05_흙막이_계측_이미지_가이드.md` §3 갱신

---

#### IMG-025 — 지중경사계 시스템 구성도

| 체크 | 기준 | 상태 |
|------|------|------|
| 케이싱 4방향 홈 | Guide groove | ❌ 프롬프트 미명시 |
| 프로브 + 휠 | 홈 안 롤링 | ❌ |
| 케이블·리드아웃 | 지상 연결 | △ |
| 누적변위–깊이 그래프 | 우측 패널 | ❌ |
| 침하계 혼동 | 수직 막대만 금지 | ⚠️ |

**조치:** IMG-026(케이싱 단면)·IMG-028(원리)·IMG-029(해석)과 **역할 분리** 명시 후 IMG-025 전용 프롬프트 v2 작성

---

#### IMG-027 — 지중경사계 설치 단면도

> **REGENERATE (2026-06-22):** [17-IMG-027 §0·P1·P2](./17-IMG-027-지중경사계-설치단면도-오류분석-및-재작업-계획.md) · §3.3.1

| 체크 | 기준 | 상태 |
|------|------|------|
| **P1 수평변위↔활동면** | 파선 **→** = 화살표 **→** | ❌ **← 역방향** |
| **P2 고정단 근입** | Base = 영향 심도/활동면 **하부 안정층** (설계·계획서) | ❌ **얕음/미도달** |
| 보링공 | 천공 | ✅ |
| 그라우트 | 공벽 충전 | △ |
| 센서형 다단식 | 내부 다점 센서 | ❌ C1 |
| 활동면 | 점선·콜아웃 | △ (있으나 P1·P2와 모순) |

**조치:** 프롬프트 **v2** · §3.3.1 · IMAGE_AUDIT_CHECKLIST §4.3.1

---

#### IMG-008 — 터널 전단면 내공변위 (v4 상부 아치)

| 체크 | 기준 | 상태 |
|------|------|------|
| P1~P5 아치 Kit | 상부·측벽만, **노반 없음** | ✅ v4 Pillow |
| Extension Tube | 아치 체인 (invert 미통과) | ✅ |
| 프로파일 | **반원·P1~P5** (P6~P8·360° 금지) | ✅ |
| 노반 라벨 | 도로·철도·미계측 | ✅ |
| ACE·진동현식 | **금지** | ✅ 제거 |
| 천단침하 혼동 | 없음 | ✅ |

**조치:** [11-터널-내공변위-IMG008-기술검증-및-개선계획.md](./11-터널-내공변위-IMG008-기술검증-및-개선계획.md) · `npm run audit:img008`

---

#### IMG-030 / IMG-031 — 수위 vs 간극수압

| 구분 | IMG-030 지하수위계 | IMG-031 간극수압계 |
|------|-------------------|-------------------|
| 측정 대상 | 관측공 **자유 수면** | 토층 내부 **간극수압** |
| 설치 | 관측공·보호함·개방 수위 | 필터·그라우트·차수·케이블 |
| 금지 | 벽체에 수위계 부착 | 지하수위계와 동일 관 그림 |
| 명칭 | — | **「진동현식」「VW」제거** |

**조치:** IMG-031 마스터·파일명·프롬프트 파일명 정리 → `IMG-031_간극수압계-설치도_...png`

---

#### IMG-034 — 토압계

| 체크 | 기준 | 상태 |
|------|------|------|
| 위치 | 벽체 배면 또는 지정 심도 | △ |
| 감지면 | 토압 수용 방향 표시 | ❌ |
| 작용 방향 | 배면 지반 → 벽체 | ❌ |
| 성토 하중 vs 토압 | 구분 | ⚠️ |

---

#### IMG-035 — 하중계

| 체크 | 기준 | 상태 |
|------|------|------|
| 버팀보 | **축방향·끝단/접합부** | ⚠️ 정중앙 금지 |
| 어스앵커 | **두부·인장** | △ |
| IMG-003·004와 역할 | leaf 상세 vs 센서 일반 | 중복 정리 필요 |

---

#### IMG-042 — 자동광파기

| 체크 | 기준 | 상태 |
|------|------|------|
| Total Station | 광파기 본체 | △ |
| Prism(반사경) | 측점 | △ |
| 기준점·시준선 | Backsight | ❌ |
| 좌표 변위 벡터 | ΔX, ΔY | ❌ |
| 카메라 형상 | 금지 | ⚠️ |

---

#### IMG-058 — 원격계측 플랫폼

| 체크 | 기준 | 상태 |
|------|------|------|
| 센서→로거→서버→DB→웹 | 계층 | ✅ |
| 흙막이 단면도 하단 흐름도 | IMG-002에 금지된 것과 구분 | ✅ (별도 이미지) |
| 아이콘 나열·홍보 UI | 억제 | ⚠️ |
| IMG-056·048과 역할 | 대시보드 vs 아키텍처 | 문서화 필요 |

---

## 4. 코드·구조 수정 계획

### 4.1 마스터 데이터 확장 (`03_IMAGE_MASTER_LIST.json`)

각 이미지에 필드 추가:

```json
{
  "id": "IMG-025",
  "title": "지중경사계 시스템 구성도",
  "purpose": "...",
  "caption": "그림 1. 지중경사계 시스템 구성 — 케이싱(4홈), 프로브·휠, 케이블, 리드아웃 및 누적변위-깊이 관계",
  "figureNo": 1,
  "auditStatus": "F",
  "auditNote": "2026-06-25: 케이싱 4홈·그래프 미표현"
}
```

동기화: `01_IMAGE_MASTER_LIST.csv` 동일 컬럼 추가

### 4.2 `scripts/generate-image-assets.mjs`

```javascript
// 변경 요약
alt:   item.title + ' - ' + item.purpose   // 유지 (접근성)
caption: item.caption || defaultCaption(item) // 신규
figureNo: item.figureNo                       // 선택
```

`resolveImage()` 반환:

```javascript
{ src, fallback, alt, caption, figureNo }
```

### 4.3 `sectionImages` 스키마 확장 (`helpers-template.mjs`)

```javascript
// 기존
sectionImages: { installation: 'IMG-027' }

// 확장 (하위 호환)
sectionImages: {
  installation: [
    'IMG-027',
    { id: 'IMG-026', caption: '그림 2. 케이싱 단면 — 4방향 가이드 홈과 프로브 휠' }
  ]
}
```

`sectionImagesFor()`에서 문자열·객체 혼용 파싱.

### 4.4 `renderFigure()` (`content-loader.js`)

```html
<figure class="tech-figure">
  <img ...>
  <figcaption><b>그림 N.</b> 캡션 텍스트</figcaption>
</figure>
```

- `caption` 없으면 `alt` fallback
- `figureNo` 없으면 섹션 내 순번 자동
- placeholder에도 짧은 figcaption

### 4.5 CSS (`css/technology.css`)

`inclinometer.css` `.figure-panel figcaption` 스타일을 `.tech-figure figcaption`에 이식.

### 4.6 콘텐츠 연결 확장 (우선 매핑)

| 노드 | hero | principle | installation | data | related |
|------|------|-----------|--------------|------|---------|
| `earth-retaining-wall` | IMG-002 | IMG-062 | — | IMG-050 등 검토 | IMG-003~005 |
| `sensors/inclinometer` | IMG-025 | IMG-028,026 | IMG-027 | IMG-029 | — |
| `sensors/water-level-meter` | IMG-030 | IMG-062 | IMG-030 | — | — |
| `sensors/piezometer` | IMG-031 | — | IMG-031 | IMG-051 | — |
| `sensors/earth-pressure-cell` | IMG-034 | — | IMG-034 | — | — |
| `sensors/load-cell` | IMG-035 | — | IMG-035,003,004 | IMG-052 | — |
| `sensors/automated-total-station` | IMG-042 | IMG-042 | — | IMG-049 | — |
| `fields/tunnel/convergence` | IMG-008 | IMG-008 | — | IMG-049 | — |
| `sensors/remote-monitoring-system` | IMG-058 | IMG-058 | — | IMG-056 | IMG-048 |

---

## 5. 단계별 실행 계획

### Phase 0 — 인프라 (1일)

| # | 작업 | 산출물 |
|---|------|--------|
| 0.1 | 마스터 JSON/CSV에 `caption`, `auditStatus` 추가 | ImageWorks |
| 0.2 | `generate-image-assets.mjs` + `resolveImage` caption | `images.js` |
| 0.3 | `sectionImagesFor` 객체 형식 + `renderFigure` figcaption | SPA |
| 0.4 | `css/technology.css` figcaption | UI |
| 0.5 | 본 문서 유지·갱신 | `docs/image-audit.md` |

```bash
node scripts/generate-image-assets.mjs
node scripts/build-content-data.mjs
node scripts/validate-terminology.mjs
```

### Phase 1 — 우선 10종 프롬프트 v2 (3~5일)

| 순서 | ID | 작업 |
|------|-----|------|
| 1 | IMG-031 | 명칭·파일명 정리 → 프롬프트 v2 (간극수압 전용) |
| 2 | IMG-002 | v5 (하중계·로거·앵커) → PNG 재생성·가이드 합격 처리 |
| 3 | IMG-025,027 | 지중경사계 3종 세트 (025 시스템 / 026 케이싱 / 027 설치) |
| 4 | IMG-008 | P4–P5 Extension Tube PNG 검수·재생성 |
| 5 | IMG-030,031 | 수위·수압 **대비 쌍**으로 동시 재생성 (혼동 방지) |
| 6 | IMG-034,035 | 토압·하중 방향·축 명시 |
| 7 | IMG-042 | ATS 시준·벡터 |
| 8 | IMG-058 | 아키텍처 단순화 (블록·화살표 중심) |

각 이미지 완료 시:

1. `source/` + `technology/` PNG 배포  
2. `generate-image-assets.mjs` 실행  
3. 본 문서 §3 등급 **P**로 갱신  
4. 해당 `content-data` 캡션·sectionImages 반영  

### Phase 2 — dictionary hero 44종 + sectionImages 보강 (5일)

- hero만 있는 instrument/mode에 `principle` 또는 `installation` Figure 추가
- 분야 category 8종 overview(IMG-001,007,011…) 기술 검수
- 그래프류(IMG-049~053)는 **data 섹션 전용**으로 유지, installation에 혼입 금지

### Phase 3 — 정적 SEO·사이트맵 연동 (1일)

```bash
node scripts/generate-technology-seo-pages.mjs
node scripts/generate-sitemap-technology.mjs
```

- SEO 페이지 `<img alt+caption>` 또는 figure 구조 반영

### Phase 4 — 검증·문서 (지속)

| 검증 | 명령/문서 |
|------|-----------|
| 용어 | `node scripts/validate-terminology.mjs` |
| 흙막이 | `05_흙막이_계측_이미지_가이드.md` |
| 터널 내공 | `04_터널_내공변위_이미지_가이드.md` |
| 런타임 | `getContentForNode()` hero·sectionImages null 없음 |
| 시각 | 항목별 14~10항 체크리스트 (§3.2) |

---

## 6. 프롬프트·파일명 정리 목록

| 현재 | 변경 제안 |
|------|-----------|
| `IMG-031_진동현식-간극수압계-...` | `IMG-031_간극수압계-설치도_필터그라우트케이블.png` |
| `prompts/IMG-031_진동현식_간극수압계_설치도.md` | `IMG-031_간극수압계_설치도.md` |
| 마스터 title「진동현식 간극수압계」 | 「간극수압계 설치도」 |
| IMG-025 등 템플릿 프롬프트 | 센서별 **필수 요소 체크리스트** 섹션 추가 (IMG-002·008 수준) |

---

## 7. 금지 사항 체크리스트 (재생성 공통)

- [ ] 센서 아이콘만 나열한 그림
- [ ] 사람·캐릭터·굴삭기 중심
- [ ] 실제 현장명·노선명·공구명 (00 복선전철 제00공구 예시만 허용)
- [ ] 지하수위계와 간극수압계 동일 관·동일 라벨
- [ ] 지중경사계를 수직 침하 막대로 표현
- [ ] 하중계를 보 중앙에만 배치
- [ ] 자동광파기를 DSLR 카메라 형태로 표현
- [ ] 터널 내공변위를 천단침하·2점 테이프로 표현
- [ ] IMG-008·터널 본문에 「진동현식」「VW」

---

## 8. 완료 정의 (Definition of Done)

1. 우선 10종 §3 등급 **P** 이상  
2. `dictionary` 참조 `imageId` 전부 `IMAGE_ASSETS` + PNG + **caption**  
3. SPA `renderFigure` 100% figcaption 출력  
4. 주요 센서·흙막이 leaf에 **2장 이상** 섹션 Figure  
5. `validate-terminology.mjs` 통과  
6. 본 문서 `auditStatus` 최신화  

---

## 9. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-25 | 초판: 현황 대조, 우선 10종 검수, 4-Phase 수정 계획 |
| 2026-06-25 | **Phase 0 완료** — caption·figcaption·sectionImages 객체 형식 |
| 2026-06-25 | §13 PNG 11종 배포 — `render-datalogger-figures.py` |
| 2026-06-25 | §9 초판 — **§13** 데이터로거 CR1000X 유형 통일 계획 |
| 2026-06-25 | **§12** 가시설·터널 Figure 7종 일괄 재생성·문서 동기화 |

## 10. 우선 10종 재검수 (2026-06-25 배포 후)

| ID | 등급 | 비고 |
|----|------|------|
| IMG-002 | **P** | v5 재생성 — 좌→우·11종·로거 지표함 |
| IMG-025 | **P** | 케이싱 4홈·프로브·그래프 반영 |
| IMG-027 | **P** | 보링·활동면·안정층 |
| IMG-008 | **P** | v3 Extension Tube 체인(P4–P5 포함), MUX 허브 별선 제거 (2026-06-25) |
| IMG-034 | **P** | 토압 작용 방향 |
| IMG-035 | **P** | 끝단·앵커 두부 |
| IMG-030 | **P** | 관측공 개방 수면 |
| IMG-031 | **P** | 명칭·도면 정리 (진동현식/VW 제거) |
| IMG-042 | **P** | TS·시준선·벡터 |
| IMG-058 | **P** | 블록 아키텍처 |
| IMG-061 | **P** | 천단침하·외부 수준점 (`crown-settlement`) |
| IMG-063 | **P** | 막장전방 선행변위 (`face-advance`) |
| IMG-001 | **P** | v2 가시설 단면·흐름도 제거 |
| IMG-003 | **P** | v2 띠장 접합부 하중계 |
| IMG-004 | **P** | v2 ref-04 앵커 두부 5패널 |
| IMG-006 | **P** | v2 굴착 4단계·운영 루프 |
| 터널 히어로 | **P** | `heroCaption` 분리 — [06-터널-히어로-및-콘텐츠-API.md](./06-터널-히어로-및-콘텐츠-API.md) |

## 12. 가시설·터널 Figure 일괄 재생성 (2026-06-25 PM)

| ID | 버전 | 핵심 수정 | 가이드 |
|----|------|-----------|--------|
| IMG-061 | 신규 | 천단침하 ≠ 내공변위, 외부 수준점 | [04_터널 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/04_터널_내공변위_이미지_가이드.md) |
| IMG-003 | v2 | 정중앙 하중계 제거 → 띠장 접합부 | [05_흙막이 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/05_흙막이_계측_이미지_가이드.md) §8 |
| IMG-001 | v2 | IMG-002 좌→우 단면, 원격 흐름도 제거 | 동일 §5 |
| IMG-008 | v3 | Extension Tube **체인**, MUX 허브 별선 제거 | [04_터널 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/04_터널_내공변위_이미지_가이드.md) §9 |
| IMG-063 | 신규 | 막장·선행변위계·막장거리 | 동일 §10 |
| IMG-006 | v2 | 4단계 단면·끝단 하중계·운영 루프 | [04-흙막이-계측-구현.md](./04-흙막이-계측-구현.md) |
| IMG-004 | v2 | ref-04 상단 앵커 전용 5패널 | [05_흙막이 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/05_흙막이_계측_이미지_가이드.md) §8 |

**마스터 88/88 PNG** — IMG-080~088 분야 히어로·강지보 SEO 반영 (2026-06-25). [07-미구현-백로그.md](./07-미구현-백로그.md)

## 14. IMG-064 항만·호안 (2026-06-25)

| 항목 | 내용 |
|------|------|
| ID | IMG-064 |
| 방식 | Pillow `render_064()` — 육측\|케이슨·안벽\|해측 횡단, CR1000X 유형 로거 |
| 노드 | `fields/harbor` hero |
| 등급 | **P** PASS |
| 프롬프트 | [IMG-064](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-064_항만-호안-계측-전체-개념도.md) |

## 13. 데이터로거 CR1000X 유형 통일 (2026-06-25)

정적 현장 데이터로거를 **소형 배선판형 인클로저**(CR1000X 유형)로 Figure 전반 통일.

| 구분 | 상태 |
|------|------|
| 프롬프트·가이드 | ✅ |
| **IMG-045** | ✅ CR1000X · **IMG-076/077** MUX·동적 DAQ (2026-06-25) |
| 연쇄 Figure | ✅ 데이터로거 체계 Figure 완료 |

| 우선 | ID | 비고 |
|------|-----|------|
| P0 | IMG-045 | 표준 실루엣·`datalogger` hero |
| P1 | IMG-002, 001, 025, 008 | 단면·현장 배치 |
| P2 | IMG-047, 048, 058, 006, 003, **064** | 시스템·흐름도·항만 |

재생성 후: `convert-technology-webp.py` → `generate-image-assets.mjs` → `validate-image-master.mjs`

## 11. 자동 검증 결과 (2026-06-25)

| 항목 | 결과 |
|------|------|
| `validate-terminology.mjs` | ✅ 통과 |
| `dictionary` imageId ↔ `IMAGE_ASSETS` ↔ PNG | ✅ 64종 |
| `caption` | ✅ 64종 |
| 가시설·터널 P1 Figure (`source/` + `technology/`) | ✅ 7종 쌍 (061·001·003·004·006·008·063) |
| IMG-031 구 파일명(진동현식) | ✅ 제거 |
| Hero + `renderFigure` figcaption (9 노드) | ✅ |
| `sectionImages` 캡션 (지중경사계·흙막이 등) | ✅ |
| SEO 정적 페이지 | ✅ 82 (inclinometer는 `/sensors/inclinometer/`) |
| `sitemap.xml` | ✅ 92 URL |
| `verify-production.mjs` | ✅ 6건 |
| **운영 사이트** `technology.css?v=5` | ✅ |
| **운영** 지중경사계 figcaption | ✅ 5개 |
| **운영** 흙막이 벽체 figcaption | ✅ 7개 (그림 2~7) |
| **운영** hero IMG-002·IMG-025 | ✅ |

**잔여 수동 확인:** 없음 (IMG-008 v3 배포 완료)

## 15. Phase 5·6 Pillow v2 (2026-06-22)

| ID | 스크립트 | 핵심 |
|----|----------|------|
| IMG-025·030·031·034·035 | `render-phase5-sensors.py` | AUTO-01·CLS-01·EXC·STR-01 |
| IMG-027·062 | `render-phase5-remainder.py` | doc 17 C1~C5 · EXC-03 ②③ |
| IMG-001·002·004·005 | registry Phase 6 formal | doc 15·19·26 Q0 |

§3.2 초판 ❌ 항목은 **아카이브** — 운영 등급은 §3.1·§10·registry **P/PASS**가 정본.

**Exit:** `npm run verify:local` 0 error · `npm run render:phase5`로 Figure 재생성
