# LTE M2M 용어·Figure — 계획·구현·운영 가이드

**작성:** 2026-06-25  
**요청:** 「LTE 원격통신」→ **「LTE M2M」**, Figure·본문에서 **LTE M2M 모뎀**으로 표현  
**상태:** ✅ **구현·문서화 완료** (2026-06-25)

> **운영 진입점:** [10-최종-완료-및-운영-가이드.md](./10-최종-완료-및-운영-가이드.md) · 용어: [TERMINOLOGY.md](./TERMINOLOGY.md) § LTE M2M  
> **SEO URL (slug 유지):** `/homepage/technology/instruments/communication/lte-remote/`

---

## 0. 한눈에 보기 (구현 결과)

| 항목 | 결과 |
|------|------|
| 페이지 제목·트리 | **LTE M2M** (`lte-remote` 노드 ID·URL 유지) |
| Figure | **IMG-048** v2 · **IMG-058** · **IMG-072** — 모뎀 실루엣(SIM·안테나) |
| canonical PNG | `IMG-048_LTE-M2M-통신-구성도_센서로거모뎀서버웹모바일.png` |
| 용어 게이트 | `validate-terminology` — 「LTE 원격통신」「LTE 원격계측」금지 |
| 운영 SEO | `verify:production` **#15 LTE M2M SEO** |
| 로컬 | `verify:local` ✅ |

**계층 구분 (혼동 방지)**

```
원격계측시스템 (플랫폼 전체, IMG-058)
  └─ IoT 게이트웨이 (집계·프로토콜 변환, IMG-046) — 선택
  └─ LTE M2M (셀룰러 송신, IMG-048) ← 본 개편
       └─ LTE M2M 모뎀 + M2M SIM (Cat-M / NB-IoT)
```

---

## 1. 배경·용어 정리

| 구분 | 현재 | 변경 후 |
|------|------|---------|
| 트리·페이지 제목 | LTE 원격통신 | **LTE M2M** (또는 **LTE M2M 통신**) |
| 기술 정의 | “원격 데이터 무선 전송” (추상) | **M2M(Machine-to-Machine)** — 로거·게이트웨이 ↔ 서버 간 **LTE 모뎀** IP 링크 |
| Figure 중간 블록 | `LTE` (일반 박스) | **LTE M2M 모뎀** (장비 실루엣 + SIM·안테나 캡션) |
| 유지 (변경 없음) | 원격계측시스템 · IoT 게이트웨이 · 원격 자동계측 | 상위/인접 개념 — M2M은 **통신 수단** 계층 |

**구분 원칙**

- **LTE M2M** = 통신 계층(모뎀·SIM·안테나·Cat-M/NB-IoT)
- **원격계측시스템** = 센서~웹·경보 **전체 플랫폼** (IMG-058 hero)
- **IoT 게이트웨이** = 다로거 집계·프로토콜 변환 (모뎀 **앞단** 또는 병렬)

---

## 2. 영향 범위 요약

### 2.1 핵심 (필수 변경)

| 대상 | 파일·산출물 | 변경 내용 |
|------|-------------|-----------|
| **콘텐츠 소스** | `scripts/content-data/instruments.mjs` → `lte-remote` | title·tagline·overview·FAQ — M2M·모뎀 중심 |
| **트리·키워드** | `js/technology/dictionary.js` | label `LTE M2M`, KEYWORD_MAP `'LTE M2M'` / `'LTE M2M 통신'` |
| **라벨 빌드** | `scripts/build-content-data.mjs` | `'instruments/communication/lte-remote': 'LTE M2M'` |
| **연관 캡션** | `scripts/content-data/sensors.mjs` | IMG-048 캡션 「LTE M2M·모뎀 구성」 |
| **Figure (주)** | `scripts/lib/platform_draw.py` → `render_img048` | 제목·흐름·**모뎀 블록** |
| **PNG·canonical** | `IMG-048_…png` | 파일명·`canonical-image-png.json`·WebP |
| **메타·registry** | `js/technology/images.js`, `image-review-registry.json`, ImageWorks master list | title·alt·caption |

### 2.2 보조 Figure (권장, 동일 배포 묶음)

| ID | 파일 | 현재 | 변경 |
|----|------|------|------|
| **IMG-058** | `platform_draw.py` `render_img058` | `통신 (LTE)` 박스 | **`LTE M2M 모뎀`** |
| **IMG-072** | `modes_draw.py` `render_img072` | `LTE/무선` 박스 | **`LTE M2M 모뎀`** |
| IMG-047 | `render-power-figures.py` | 부하 「LTE 모뎀」 | ✅ 이미 모뎀 표기 — 유지 |

### 2.3 간접 언급 (선택·일관성)

| 위치 | 조치 |
|------|------|
| `instruments.mjs` — 원격 자동계측·전원·modes | 「LTE·유선」→ 「**LTE M2M**·유선」 (과도한 치환 금지) |
| `intro` (`build-content-data.mjs`) | 통신 분류: `IoT 게이트웨이·**LTE M2M**·원격계측시스템` |
| `docs/INSTRUMENTATION_DRAWING_RULES.md` §072 | LTE·경보 → M2M 모뎀 언급 |
| ImageWorks `IMG-048` 프롬프트 | 제목·라벨·Negative Prompt 갱신 |

### 2.4 변경하지 않음

- 노드 ID `instruments/communication/lte-remote` (URL 경로) — **1차 유지** (§4 참고)
- `sensors/remote-monitoring-system`, `iot-gateway` 페이지 구조
- IMG-056 (웹 대시보드), IMG-045 (로거) — LTE 블록 없음

---

## 3. Figure 설계 (IMG-048 v2)

### 3.1 구성도 레이아웃 (16:9, 기존 흐름 유지)

```
[계측 센서] → [데이터로거] → [LTE M2M 모뎀] → [서버] → [웹]
                                    │              ↘ [모바일]
                              (SIM · 안테나)
```

### 3.2 모뎀 표현 가이드 (Pillow `render_img048`)

| 요소 | 지시 |
|------|------|
| 외형 | 직사각형 함체(약 160×100) + **외부 안테나** 1~2본 (단순 CAD) |
| 라벨 | **「LTE M2M 모뎀」** (주), 보조 「SIM」「RS-232/Ethernet」 (선택) |
| 금지 | 통신사 로고·실제 모델명·3D 렌더·사진 합성 |
| 제목 | **「LTE M2M 통신 구성도」** |
| 부제 | `Sensor → logger → LTE M2M modem → server → web / mobile` |

### 3.3 canonical 파일명 (안)

```
IMG-048_LTE-M2M-통신-구성도_센서로거모뎀서버웹모바일.png
```

- 구 파일 `…LTE-원격계측…` → `render-p3-platform.py` 또는 IMG-048 전용 스크립트에서 **LEGACY 삭제**
- `scripts/canonical-image-png.json` `"IMG-048"` 값 갱신

### 3.4 구현 파일

```text
scripts/lib/platform_draw.py          # render_img048 (+ render_img058)
scripts/lib/modes_draw.py             # render_img072 (보조)
scripts/render-p3-platform.py         # IMG-048·058·056 재렌더 진입점
python scripts/convert-technology-webp.py --force
npm run build:images
```

---

## 4. 콘텐츠 설계 (`lte-remote` 노드)

### 4.1 제목·tagline (안)

| 필드 | 문구 |
|------|------|
| **title** (빌드) | LTE M2M |
| **tagline** | LTE M2M 모뎀 기반 현장–서버 데이터 전송 |
| **heroCaption** | LTE M2M — 센서·로거·모뎀·서버·웹·모바일 |

### 4.2 overview (핵심 문장)

> **LTE M2M**은 현장 데이터로거·IoT 게이트웨이에 연결된 **LTE M2M 모뎀**을 통해 계측 데이터를 이동통신망(M2M 전용 SIM·Cat-M/NB-IoT 등)으로 중앙 서버에 전송하는 구성입니다.

### 4.3 principle (보강)

- **LTE M2M 모뎀** + 외부 안테나 → IP 링크
- 로거 RS-232/Ethernet → 모뎀 → TCP/UDP·MQTT
- 게이트웨이 뒤단 1회선 M2M vs 로거 직결 모뎀 — 현장 규모별 선택

### 4.4 FAQ (수정·추가)

| Q | A 방향 |
|---|--------|
| LTE M2M과 IoT 게이트웨이 차이? | 게이트웨이=집계·변환, **M2M 모뎀=셀룰러 송신** |
| Cat-M / NB-IoT? | M2M 요금제·저전력·소패킷 계측에 적합 |
| 5G 필요? | (기존 유지) 대부분 LTE M2M으로 충분 |
| 터널 내부? | (기존 유지) 중계·광 혼용 |

### 4.5 URL·slug 정책

| 옵션 | 장단 | 권장 |
|------|------|------|
| **A. slug 유지** (`lte-remote`) | SEO·북마크 유지, 제목만 M2M | ✅ **1차 배포** |
| **B. slug 변경** (`lte-m2m`) | 의미 정확, 301·sitemap·내부 링크 전량 수정 | 2차(필요 시) |

1차는 **A** — `technology/instruments/communication/lte-remote/` 경로 유지, `<title>`·H1만 **LTE M2M**.

---

## 5. 단계별 실행 계획

### Phase 0 — 용어 잠금 ✅

- [x] `docs/TERMINOLOGY.md` — **LTE M2M**, **LTE M2M 모뎀**
- [x] `validate-terminology.mjs` — 「LTE 원격통신」「LTE 원격계측」금지

### Phase 1 — 콘텐츠 ✅

- [x] `instruments.mjs` · `dictionary.js` · `build-content-data.mjs` · `sensors.mjs`
- [x] `npm run build:all`

### Phase 2 — Figure IMG-048 ✅

- [x] `platform_draw.py` — `draw_lte_m2m_modem()` · `render_img048` v2
- [x] `render-p3-platform.py` — canonical 갱신 · legacy PNG 삭제
- [x] ImageWorks master list · 프롬프트

### Phase 3 — 보조 Figure ✅

- [x] `render_img058` · `render_img072` (modes_draw)

### Phase 4 — 메타·문서 ✅

- [x] `images.js` · registry · `INSTRUMENTATION_DRAWING_RULES.md` §3.17
- [x] 본 문서 · doc 09·10 갱신

### Phase 5 — 검증·배포 ✅

```bash
npm run validate:terminology   # OK
npm run verify:local           # OK
npm run verify:production      # 15/15 (LTE M2M SEO #15)
```

**verify:production #15 (적용됨)**

```javascript
{
  name: 'LTE M2M SEO',
  url: BASE + '/homepage/technology/instruments/communication/lte-remote/',
  must: ['LTE M2M', 'IMG-048', '모뎀', 'tech-seo-hero'],
  mustNot: ['LTE 원격통신', 'LTE 원격계측']
}
```

### Phase 6 — slug 마이그레이션 ☐ (미실시)

- [ ] `lte-m2m` 노드 ID — **1차 배포는 `lte-remote` 유지** (북마크·SEO)

---

## 6. 파일 체크리스트

```
[콘텐츠]
scripts/content-data/instruments.mjs
scripts/content-data/sensors.mjs
scripts/build-content-data.mjs
js/technology/dictionary.js          ← 빌드 전 소스 dictionary는 scripts 쪽 확인 필요*

[Figure]
scripts/lib/platform_draw.py
scripts/lib/modes_draw.py
scripts/canonical-image-png.json
assets/images/technology/IMG-048_*.png
assets/images/technology/IMG-048.webp

[ImageWorks]
ImageWorks/.../prompts/IMG-048_*.md
ImageWorks/.../03_IMAGE_MASTER_LIST.json
ImageWorks/.../01_IMAGE_MASTER_LIST.csv

[빌드 산출 — commit/deploy]
js/technology/content-data.js
js/technology/images.js
technology/instruments/communication/lte-remote/index.html
sitemap.xml

[문서]
docs/TERMINOLOGY.md
docs/13-LTE-M2M-용어-및-Figure-개편-계획.md  ← 본 문서
docs/10-최종-완료-및-운영-가이드.md           ← 완료 후 링크
```

\* `dictionary.js`는 저장소 루트 `js/technology/`에 직접 편집하는 구조 — Phase 1에서 동기화.

---

## 7. 리스크·주의

| 리스크 | 대응 |
|--------|------|
| 「LTE 원격통신」 잔존 | `rg "LTE 원격"` · `rg "원격통신"` 배포 전 0건 |
| Figure만 바꾸고 SEO 구문 구버전 | `build:seo` 필수 |
| 모뎀 실루엣이 특정 제품처럼 보임 | generic box + antenna, 브랜드·모델명 금지 (registry prohibited 유지) |
| M2M vs 원격계측시스템 혼동 | overview에 계층 diagram 1문장 유지 |
| 북 PDF·제안서 구 표현 | book-plan crosscheck는 별도 (필요 시 `crosscheck:book-plans`) |

---

## 8. 완료 정의 (DoD) — ✅ 전항 충족

- [x] 트리·SEO·SPA 본문 **「LTE M2M」**, 구 표기 **0건** (검증 스크립트·금지 규칙)
- [x] IMG-048 **「LTE M2M 모뎀」** · SIM · 안테나 · 제목 반영
- [x] `audit:images:strict` · `verify:local` PASS
- [x] `verify:production` **LTE M2M SEO** (#15) PASS
- [x] ImageWorks master list · `canonical-image-png.json` 일치

---

## 10. 운영·재렌더·배포

### 10.1 편집 위치 (콘텐츠)

| 용도 | 경로 |
|------|------|
| LTE M2M 본문 | `scripts/content-data/instruments.mjs` → `lte-remote` |
| 트리·키워드 | `js/technology/dictionary.js` |
| 원격계측 installation Figure | `scripts/content-data/sensors.mjs` (IMG-048 캡션) |
| 빌드 후 | `npm run build:all` |

### 10.2 Figure 재생성

```bash
python scripts/render-p3-platform.py --id 048   # IMG-048 (legacy PNG 자동 삭제)
python scripts/render-p3-platform.py --id 058   # 플랫폼 아키텍처
python scripts/render-modes-figures.py --id 072 # 원격 자동계측
python scripts/convert-technology-webp.py --force
npm run build:images
npm run verify:local
```

**Pillow 헬퍼:** `scripts/lib/platform_draw.py` → `draw_lte_m2m_modem()`

### 10.3 FTP 배포 필수 파일

- `assets/images/technology/IMG-048_LTE-M2M-통신-구성도_센서로거모뎀서버웹모바일.png`
- `assets/images/technology/IMG-048.webp` (+ IMG-058·072 WebP 권장)
- `js/technology/content-data.js` · `images.js` · `dictionary.js`
- `technology/instruments/communication/lte-remote/index.html`

```bash
node scripts/list-deploy-manifest.mjs --write   # manifest에 신규 PNG 반영
npm run verify:deploy
npm run verify:production                       # 15/15
```

### 10.4 잔여·후속 (blocker 없음)

| 항목 | 비고 |
|------|------|
| slug `lte-m2m` | 필요 시 Phase 6 — 301·sitemap |
| book PDF 「LTE 원격」 표현 | `crosscheck:book-plans` 별도 |
| 통신사·모델명 | Figure·본문 **브랜드 금지** (registry prohibited 유지) |

---

## 9. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-25 | 초안 — LTE M2M·모뎀 Figure·콘텐츠 개편 계획 수립 |
| 2026-06-25 | **구현·문서화 완료** — §10 운영 가이드 · verify #15 |
