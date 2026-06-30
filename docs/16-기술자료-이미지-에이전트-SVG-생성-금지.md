# 기술자료 이미지 — 에이전트 생성 가이드

**우선순위:** P0 공학 규칙 > 본 가이드  
**적용:** Cursor·Copilot·기타 AI 에이전트  
**최종 갱신:** 2026-06-27

> **2026-06-27:** 에이전트 Figure 생성 **허용**. (구 「SVG 생성 금지」 정책 폐기)  
> `.cursor/rules/agent-figure-generation.mdc` · `AGENTS.md`

---

## 1. 허용 방식

| 방식 | 대상 | 비고 |
|------|------|------|
| **GenerateImage** | FT-A/B/C 전반 | [docs/36 §1.0](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) 10줄 + ImageWorks 프롬프트 |
| **Pillow** `render-*.py` | FT-A/B/C | FT-A/B: `render_guard` exit 2 시 **`--force-legacy-pillow`** |
| **SVG → WebP** | 벡터 파이프라인 | `render-svg-figures.py` · `*_svg.py` · cairosvg |
| **외부 AI/CAD** | 동일 | WebP 수령 후 동일 등록 절차 |

**출판 형식:** `assets/images/technology/` **WebP only** (PNG 금지).

---

## 2. 필수 선행 (P0)

에이전트도 예외 없음 — [TECHNICAL §0](./TECHNICAL_IMAGE_STANDARD.md) · [51 §0~§2](./51-계측-도면-검수-공통-원칙.md) · [INSTRUMENTATION](./INSTRUMENTATION_DRAWING_RULES.md).

- One Figure = One 계측 목적
- 가시설 3분할 · SOE · 앵커 LC · G.W.L≠piezo · 센서≠로거 등

---

## 3. 작업 절차

1. `ImageWorks/.../prompts/IMG-###_*.md` · redline · §36 §1.0 블록
2. 생성 (GenerateImage / Pillow / SVG) — hero **≥1920×1080** · **[LOGO-01](./183-이미지-생성-워터마크-금지-정본.md) 로고·워터마크 금지**
3. WebP → `assets/images/technology/source/IMG-###_*.webp` (**워터마크·로고 없음** — [183](./183-이미지-생성-워터마크-금지-정본.md))
4. `npm run register:figure -- --id IMG-### --input …webp --method ai-reviewed --reviewer "…" --visual-grade PASS`
5. `npm run sync:images` · `npm run audit:images` · 필요 시 `npm run build:content`
6. 배포 전: `watermark-figures.bat` (또는 `npm run watermark:figures`) — **생성 단계에 로고 넣지 않음**

**LOCK-01:** registry·Figure 등록 전 `npm run lock:status` — [98](./98-다중-Cursor-동시작업-충돌방지.md)

---

## 4. 품질·한계

에이전트·Pillow·1-shot AI는 **공학 assert만 통과**하고 출판 품질이 부족할 수 있다.  
`visualReview` · redline 대조 · 육안 확인 후 `PASS` 등록. P0 위반 시 **REGENERATE**.

---

## 5. 금지 (변경 없음)

- `website/web.config` (homepage 상위) 수정
- **GenerateImage·CAD 생성본에 NMTI 로고·워터마크** — [183](./183-이미지-생성-워터마크-금지-정본.md)
- P0 위반 Figure를 reviewed/PASS로 등록
- 다중 Cursor 잠금 무시 registry 덮어쓰기

---

## 6. 레거시

구 「에이전트·SVG 생성 금지」 본문은 폐기. git history · [docs/31](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md).
