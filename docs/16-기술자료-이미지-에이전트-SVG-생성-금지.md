# 기술자료 이미지 — 에이전트·코드 SVG 생성 금지 (최상위)

**우선순위:** ⛔ **최상위 (Non-negotiable)** — `web.config` 수정 금지와 동급  
**적용:** Cursor·Copilot·기타 AI 에이전트, `scripts/lib/*_svg.py`, `render-svg-figures.py`  
**최종 갱신:** 2026-06-25

---

## 1. 금지 (핵심)

> **에이전트·자동화 코드로 기술자료 Figure를 SVG로 그리거나, SVG를 만들어 PNG/WebP로 변환하는 작업을 하지 않는다.**

| 금지 | 예 |
|------|-----|
| Python/JS로 SVG XML 생성 | `retaining_wall_svg.py`, `adjacent_building_svg.py`, `svg_helpers.py` |
| `render-svg-figures.py` 실행·확장 | `--id 002`, `--id 005` 등 |
| 에이전트가 `<path>`·`<text>`로 단면·배치도 작성 | IMG-001·002·005·015 등 |
| 「SVG 소스 → cairosvg → PNG」 파이프라인 **신규·수정** | `requirements-dev.txt` cairosvg 목적 |
| 문서에 「SVG 필수」「SVG v1 PASS」로 **신규 Figure 지시** | — |

**이유:** 에이전트 생성 SVG는 CAD·계측관리계획서 수준 품질·물리 정합·가독성을 **안정적으로 충족하지 못함**. Pillow 래스터와 마찬가지로 **자동 「그림 그리기」** 에 해당.

### 1.1 복합 개념도 — Pillow·코드 래스터 추가 금지 (2026-06-22)

**대상:** 롹볼트·숏크리트·지보재 **복합** Figure (IMG-009, 078, 079 등), 다패널 인포그래피, **SVG→PNG 변환만**으로 교체하는 작업.

| 금지 | 예 |
|------|-----|
| Pillow `ImageDraw`로 **단면+인셋+그래프** 한 장 | ~~복잡 generic AI~~ · ~~SVG export→PNG~~ |
| 에이전트 세션 **1-shot GenerateImage** 후 **즉시 배포** | redline·§3.20 없음 |

**허용:** 인간 CAD/Illustrator · 외주 · **상세 프롬프트 + 기술 redline** AI PNG → `assets/.../IMG-###.png`

→ [21-록볼트 계획](./21-IMG-078-009-록볼트-축력-오류분석-및-재작업-계획.md)

---

## 2. 허용 (예외 — 본 금지와 무관)

| 구분 | 허용 |
|------|------|
| **홈페이지 UI** | `index.html` `<symbol>`·CSS 장식 SVG (기술 Figure 아님) |
| **외부 제작 SVG/PNG** | **인간** CAD·Illustrator·Inkscape 수작업 — repo에 **PNG만** 반영 |
| **AI 일러스트** | 프롬프트 + §14·INSTRUMENTATION + **인간 기술 검수** 후 PNG 수령 (SVG 소스 불필요) |
| **블록 다이어그램** | 기존 Pillow `render-p3` 등 — 단순 박스·화살표 (단면 CAD 아님) |
| **레거시 SVG** | ~~`assets/images/technology/svg/`~~ **2026-06-22 삭제** — PNG만 유지 |

---

## 3. Figure 재작업 시 올바른 절차

1. [INSTRUMENTATION_DRAWING_RULES.md](./INSTRUMENTATION_DRAWING_RULES.md) · [14-AI 가이드라인 §2](./14-흙막이-굴착-계측-개념도-AI-생성-가이드라인.md) 확인  
2. `source/reference-retaining/ref-01~04`, `book/` PDF, ImageWorks 프롬프트 **v2+**  
3. **인간** 또는 **검수 가능한 AI** → **PNG** (권장 ≥1920×1080, 2× 가능)  
4. `assets/images/technology/IMG-###_*.png` + `source/` 동일명  
5. `python scripts/convert-technology-webp.py` → `generate-image-assets.mjs`  
6. [IMAGE_AUDIT_CHECKLIST.md](./IMAGE_AUDIT_CHECKLIST.md) · registry · IMAGE_REVIEW_LOG  

**금지:** 에이전트가 4단계를 SVG로 대체.

---

## 4. 에이전트 필수 행동

- Figure 수정·신규 요청 시 **SVG 작성·`render-svg-figures` 제안하지 않음**
- 사용자가 「SVG로 그려줘」 → **본 정책 인용 후** §3 절차 안내
- `docs/12-IMG-002-SVG-*` 등 **구 SVG 최우선 문서** — **폐기·역사 참고**만 (§5)

---

## 5. 폐기·대체 문서

| 구 문서 | 상태 |
|---------|------|
| [12-IMG-002-SVG-단면도-최우선-재작업-계획.md](./12-IMG-002-SVG-단면도-최우선-재작업-계획.md) | **폐기** — 에이전트 SVG 시도 이력 |
| TECHNICAL_IMAGE_STANDARD §0.1 「SVG 최우선」 | **본 문서로 대체** |
| AGENTS.md 「P0 SVG 단면도」 | **본 문서로 대체** |
| `.cursor/rules/no-agent-svg-figures.mdc` | Cursor **alwaysApply** 최상위 규칙 |

---

## 6. 레거시 스크립트 (실행 금지)

```text
scripts/render-svg-figures.py          ← 에이전트 실행 금지
scripts/lib/retaining_wall_svg.py
scripts/lib/adjacent_building_svg.py
scripts/lib/svg_helpers.py
```

교체 PNG 확정 전까지 **기존 PNG/WebP는 운영 유지** 가능. `technology/svg/` 디렉터리 **삭제됨** — SVG 재생성·보관 **하지 않음**.

---

## 7. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-22 | IMG-002 AI PNG v2 · `technology/svg/` 전량 삭제 |
| 2026-06-25 | 최상위 신설 — 에이전트·코드 SVG Figure 생성 전면 금지 |
