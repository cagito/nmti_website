> **⛔ 폐기 (2026-06-25):** 에이전트·코드 SVG Figure 생성 **전면 금지** — [16-기술자료-이미지-에이전트-SVG-생성-금지.md](./16-기술자료-이미지-에이전트-SVG-생성-금지.md)  
> 본 문서는 SVG 시도 **이력·교훈** 참고용만. 신규 작업에 적용하지 않음.

# ~~IMG-002 흙막이 단면도 — SVG 최우선 재작업 계획~~ (폐기)

**우선순위:** ⛔ **P0 — 최상위 (즉시 blocker)**  
**대상 URL:** [흙막이 벽체](https://www.nmti.co.kr/homepage/technology/#fields/retaining-excavation/earth-retaining-wall)  
**현행 산출:** `scripts/lib/retaining_wall_draw.py` → Pillow PNG (`render-p1-blockers.py`)  
**최종 갱신:** 2026-06-25

---

## 1. 문제 진단

### 1.1 사용자·운영 관찰

- [earth-retaining-wall](https://www.nmti.co.kr/homepage/technology/#fields/retaining-excavation/earth-retaining-wall) 히어로 Figure 품질 **불량**
- 텍스트·선·해치 **계단 현상(pixelation)** — SVG를 저품질 PNG로 래스터화한 것과 유사
- 범례·라벨 과밀, CAD 단면도 수준 미달

### 1.2 기술 원인

| 원인 | 설명 |
|------|------|
| **Pillow 래스터** | `retaining_wall_draw.py`가 1920×1080 bitmap에 `ImageDraw`로 직접 그림 → 확대·WebP 변환 시 계단·번짐 |
| **「그림 그리기」 금지 위반** | 단면·지층·벽체·버팀보는 **벡터(CAD/SVG)** 여야 하나, 코드로 픽셀 painting |
| **아이콘 혼재** | ①~⑪을 원형 아이콘+긴 라벨로 단면 위에 겹침 — 계측관리계획서 삽도와 거리 |
| **audit 한계** | 레이아웃 규칙(§3.1) PASS ≠ **시각·출력 품질** PASS |

### 1.3 현재 파일

```text
assets/images/technology/IMG-002_흙막이-계측-설치-대표-단면도.png   ← Pillow 산출
assets/images/technology/IMG-002.webp
scripts/lib/retaining_wall_draw.py                              ← 폐기 예정
scripts/render-p1-blockers.py (IMG-002)
```

**SVG 소스 없음** — 재편집·확대 불가.

---

## 2. 최우선 정책 (Non-negotiable)

> **단면·배치·시스템 블록 다이어그램은 SVG 소스로 작성한다. Pillow·AI로 「그림을 그리지」 않는다.**

| 구분 | 형식 | 비고 |
|------|------|------|
| **단면 주 도면** | **SVG** (path, line, rect, text) | 건물·지층·벽체·굴착·G.W.L·화살표 |
| **범례 ①~⑪** | SVG **텍스트 목록** | 번호+한글명 — 장식 아이콘 최소 |
| **계측기 위치 표시** | SVG **기호만** (원+번호, 짧은 지시선) | 실사·3D 아이콘 금지 |
| **데이터로거 ⑪** | SVG 단순 실루엣 또는 `datalogger` path | 레거시 산업용, 브랜드 금지 |
| **웹 배포** | SVG → **고해상도 PNG** (≥2×) + WebP | OG·`<picture>` 호환용 **파생**만 |
| **금지** | Pillow `ImageDraw` 단면, SVG→저해상도 PNG만 보관, AI 일러스트 단면 | |

**적용 순위 (P0 연쇄):**

1. **IMG-002** — `earth-retaining-wall` hero (**본 계획**)
2. **IMG-001** — 가시설 전체 개념도 (동일 `retaining_wall_draw.py`)
3. **IMG-015** — 사면 (유사 단면 규칙)

블록 다이어그램(045·048·058 등)은 기존 Pillow 허용 — **흙막이·터널 단면 CAD**만 SVG 강제.

상위 표준: [TECHNICAL_IMAGE_STANDARD.md](./TECHNICAL_IMAGE_STANDARD.md) §0.1

---

## 3. 목표 Figure (IMG-002)

### 3.1 레이아웃 (변경 없음 — INSTRUMENTATION §3.1)

```text
[좌] 인접 건물 | 배면 연속 토사 | 흙막이·띠장 | [우] 굴착측(버팀보·굴착저)
         우 75%: 단면  |  좌 25%: 범례 ①~⑪ (텍스트)
         하단: 원격계측 흐름도 금지
```

### 3.2 시각 목표

- **CAD/계측관리계획서** 수준 — 선명한 벡터, 100%·200% 확대 시 텍스트 가독
- 지층: 단색 fill + 얇은 hatch (SVG pattern)
- 라벨: `<text>` — Pillow bitmap text 아님
- 센서: 단면 내 **위치+번호**만; 상세 설명은 범례

### 3.3 참고 자료 (기존)

| 자료 | 경로 |
|------|------|
| 프롬프트·치명 오류 | [IMG-002_흙막이_벽체_계측_배치도.md](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-002_흙막이_벽체_계측_배치도.md) |
| 검수 체크 | [05_흙막이_계측_이미지_가이드.md](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/05_흙막이_계측_이미지_가이드.md) |
| ref 단면도 | `assets/images/technology/source/reference-retaining/ref-01~04` |
| 구현 이력 | [04-흙막이-계측-구현.md](./04-흙막이-계측-구현.md) |

---

## 4. 실행 계획 (Phase)

### Phase 0 — 동결·blocker 선언 ✅ (문서)

| # | 작업 | 산출 |
|---|------|------|
| 0.1 | 본 문서·TECHNICAL_IMAGE_STANDARD §0.1 | P0 정책 |
| 0.2 | `image-review-registry` IMG-002 `requiresReaudit: true` | audit strict 경고 |
| 0.3 | `npm run render:p1` IMG-002 **재실행 금지** (Pillow v8 폐기) | AGENTS.md |

### Phase 1 — SVG 소스 작성 (1~2일)

| # | 작업 | 산출 |
|---|------|------|
| 1.1 | `assets/images/technology/svg/IMG-002_흙막이-계측-설치-대표-단면도.svg` | **canonical 소스** |
| 1.2 | 레이어: `background`, `ground`, `structures`, `sensors`, `labels`, `legend` | Inkscape/VS Code SVG |
| 1.3 | viewBox `0 0 1920 1080`, font: system sans 또는 Noto Sans KR | 16:9 |
| 1.4 | 11종 위치·화살표(토압·하중·앵커 T) §3.1 대조 | 자체 체크리스트 |

**작성 원칙:** 손으로 SVG 태그 작성 또는 ref-01 위에 벡터 트레이스 — **Pillow 코드 이식 금지**.

### Phase 2 — 빌드 파이프라인 (0.5일)

| # | 작업 | 산출 |
|---|------|------|
| 2.1 | `scripts/render-svg-figures.py --id 002` | SVG → PNG 3840×2160 (2×) |
| 2.2 | 도구: `cairosvg` 또는 `resvg` CLI (로컬 설치) | `requirements-dev.txt` |
| 2.3 | `python scripts/convert-technology-webp.py --force` | WebP |
| 2.4 | (선택) SPA `<picture>`에 SVG 직접 제공 검토 | `images.js` `svg` 필드 |

```bash
# 목표 파이프라인 (구현 후)
python scripts/render-svg-figures.py --id 002
python scripts/convert-technology-webp.py --force
node scripts/generate-image-assets.mjs
npm run audit:images:strict
```

### Phase 3 — 기술 검수 (0.5일)

| # | 검수 | 담당 |
|---|------|------|
| 3.1 | [05_흙막이_계측_이미지_가이드.md](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/05_흙막이_계측_이미지_가이드.md) §3 치명 0건 | 기술 검수자 |
| 3.2 | [IMAGE_AUDIT_CHECKLIST.md](./IMAGE_AUDIT_CHECKLIST.md) + **벡터 품질** (100%/200% 스크린샷) | 동일 |
| 3.3 | registry `reviewGrade: PASS`, `requiresReaudit: false`, reviewer: `SVG v1` | 개발 |

### Phase 4 — 배포 (0.5일)

| # | FTP·운영 |
|---|----------|
| 4.1 | `svg/IMG-002*.svg`, PNG, WebP, `images.js`, SEO HTML |
| 4.2 | `verify:production` — earth-retaining-wall hero 200 |
| 4.3 | [04-흙막이-계측-구현.md](./04-흙막이-계측-구현.md) §완료 갱신 |

### Phase 5 — 연쇄 (P0 후속)

| ID | 작업 |
|----|------|
| IMG-001 | 동일 SVG 패턴 (가시설 개요 단면) |
| IMG-015 | 사면 단면 SVG |
| `retaining_wall_draw.py` | **삭제 또는 `@deprecated`** |

---

## 5. exit criteria

- [x] SVG 소스 1개가 repo에 존재하고 Git diff로 편집 가능
- [x] PNG/WebP가 SVG에서 **2×** 렌더 — 픽셀화 없음 (육안·200% 확대)
- [x] INSTRUMENTATION §3.1 치명 오류 **0건**
- [x] `npm run audit:images:strict` PASS (registry 갱신 후)
- [ ] 운영 URL 히어로 교체 확인 (FTP 배포 후)

---

## 6. 리스크·의존성

| 항목 | 대응 |
|------|------|
| `cairosvg`/`svglib` 미설치 | Phase 2 전 `pip install cairosvg` 또는 Inkscape CLI `--export-filename` |
| IIS MIME `.svg` | 필요 시 `homepage/web.config`에 `image/svg+xml` (SVG 직접 서빙 시) |
| 기존 PASS 등급 | 레이아웃 PASS 유지 가능 — **출력 매체 교체**로 재검수 |

---

## 7. 관련 문서

| 문서 | 역할 |
|------|------|
| [TECHNICAL_IMAGE_STANDARD.md](./TECHNICAL_IMAGE_STANDARD.md) §0.1 | SVG 최우선 정책 |
| [07-미구현-백로그.md](./07-미구현-백로그.md) §P0 | blocker 요약 |
| [AGENTS.md](../AGENTS.md) | 에이전트 필수 규칙 |
| [08-기술자료-이미지-심층리서치-구현계획.md](./08-기술자료-이미지-심층리서치-구현계획.md) | P1 Pillow 완료 → P0 SVG 전환 |

---

## 8. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-25 | Phase 1–2 완료 — `retaining_wall_svg.py`, SVG 소스, cairosvg 2× PNG/WebP |
| 2026-06-25 | P0 신설 — Pillow IMG-002 품질 불량·SVG 재작업 계획 |
