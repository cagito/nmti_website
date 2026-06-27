# IMG-045 데이터로거 구성도 — CR1000X 유형 재작성 계획

**작성:** 2026-06-25  
**대상:** `IMG-045_데이터로거-구성도_센서입력전원통신저장.png`  
**노드:** `sensors/datalogger` hero · `instruments/modes/manual` · `instruments/modes/automatic`  
**외형 기준:** Campbell Scientific **CR1000X** 형태 참고 (브랜드·모델명 Figure 인쇄 **금지**)

관련: [06_데이터로거_CR1000X_이미지_가이드.md](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md) · [prompts/IMG-045](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-045_데이터로거_구성도.md) · [00_STYLE_GUIDE](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/00_STYLE_GUIDE.md) §데이터로거

---

## 1. 배경 — 왜 다시 그리는가

### 1.1 현행 배포본 (불합격)

| 항목 | 현황 |
|------|------|
| 파일 | `assets/images/technology/IMG-045_데이터로거-구성도_센서입력전원통신저장.png` |
| 형태 | **내부 기능 블록 다이어그램** (①센서입력부 ~ ⑤통신부, CPU/A-D, IP65 외함 단면도) |
| 문제 | 가이드·프롬프트가 요구하는 **CR1000X 정면 배선판 실루엣**이 아님 |
| 혼동 | 흙막이 단면(IMG-002)·플랫폼 아키텍처(IMG-058) 역할과 겹치는 「시스템 요약 표」 과다 |

### 1.2 목표 Figure (합격 기준)

```text
[좌 25%] 계측 센서 케이블 수렴
[중앙 50%] CR1000X 유형 데이터로거 **정면 배선판** (주 피사체)
[우 25%] 전원 · 통신 · 저장 블록 + 화살표
[하단] (선택) 센서 → 로거 → 통신 — 단순 1줄, 대시보드 UI 금지
```

**한 줄 정의:** 「장비 매뉴얼 앞면 사진 수준의 배선판 + 입출력 구성」이지, 「PCB 내부 블록도」가 아니다.

### 1.3 CR1000X에서 차용할 외형 요소 (Figure에 인쇄할 것)

| 요소 | 표현 |
|------|------|
| 인클로저 | 밝은 회색 직사각, 가로:세로 ≈ **2.4:1** (약 24×10 cm 비율) |
| 배선판 | 탈착식 **나사 단자 블록** 2~3열 (채널 번호, H/L, GND) |
| 전원 | **12V** 녹색 포트 또는 POWER 라벨 |
| 상태 | 소형 **LED** 1~2개 |
| (측면 암시) | SD 슬롯·케이블 글랜드는 정면에서 보이거나 캡션으로만 |
| 금지 인쇄 | Campbell Scientific, CR1000X, 제조사 로고 |

### 1.4 금지 (06 가이드 §2.3 · 프롬프트 동일)

- 내부 CPU/저장/통신 **블록 다이어그램만**으로 대체
- 정사각 접속함, 「DATA LOGGER」 세로 박스, PC·서버 랙
- 흙막이·굴착 **단면을 주 화면**으로 사용
- 웹 대시보드·사람·실제 현장명

---

## 2. 작업 범위

### Phase 0 — 문서·검수 체계 (선행)

| # | 작업 | 산출물 | 상태 |
|---|------|--------|------|
| 0.1 | 본 계획서 확정 | `docs/IMG-045_DATALOGGER_CR1000X_PLAN.md` | ✅ |
| 0.2 | 프롬프트 v2 초안 | `prompts/IMG-045_*.md` §치명·§v2 | 예정 |
| 0.3 | INSTRUMENTATION §3.14 데이터로거 | `INSTRUMENTATION_DRAWING_RULES.md` | 예정 |
| 0.4 | 레지스트리 `REGENERATE` + 금지 오류 | `image-review-registry.json` | 재작성 직전 |
| 0.5 | 체크리스트 §4.10 | `IMAGE_AUDIT_CHECKLIST.md` | 예정 |

### Phase 1 — IMG-045 표준 Figure (P0)

| # | 작업 | 담당 경로 | 비고 |
|---|------|-----------|------|
| 1.1 | **경로 A (권장 1차):** Pillow `draw_cr1000x_front` | `scripts/lib/datalogger_draw.py` | `render_045()`가 현재 `draw_legacy_*` 사용 → **교체** |
| 1.2 | **경로 B (품질 보완):** AI 생성 | `prompts/IMG-045` §최종 프롬프트 v2 | A 결과 육안 불합격 시 |
| 1.3 | PNG·source 동기화 | `technology/` + `technology/source/` | 파일명 유지 |
| 1.4 | WebP·`images.js` | `convert-technology-webp.py` → `build:images` | |
| 1.5 | 육안 검수 | 06 가이드 §7 체크리스트 | PASS 후 레지스트리 상향 |

**Pillow 1차 수정 포인트 (`render_045`):**

```python
# 현재 (legacy LCD형 — 교체 대상)
draw_legacy_datalogger_front(draw, lx, ly, lw, lh, ...)

# 목표 (CR1000X 배선판)
draw_cr1000x_front(draw, lx, ly, lw, lh, label="데이터로거", ...)
# 비율: lw:lh ≈ 2.4:1  예) 580×240
```

### Phase 2 — 연쇄 Figure (P1·P2)

IMG-045 실루엣이 **표준**이 되면, 단면·흐름도 내 로거 아이콘을 동일 실루엣으로 통일한다.

| 우선 | ID | 맥락 | 방식 |
|------|-----|------|------|
| P1 | IMG-002, 001 | 흙막이 단면 ⑪ — 방수함 내 로거 | composite 또는 AI 재생성 |
| P1 | IMG-025, 008 | 지중경사·터널 MUX→로거 | composite |
| P2 | IMG-047, 048, 058, 006, 003 | 전원·LTE·플랫폼·흐름도 | `render-datalogger-figures.py` |
| P2 | IMG-064 | 항만 히어로 | 생성 시 동일 규칙 |

> **주의:** `render-datalogger-figures.py` 상단 **DEPRECATED** 표기 — Phase 1에서 `render_045`만 CR1000X로 복구·검증 후, 나머지는 AI 또는 선택적 Pillow composite.

### Phase 3 — 콘텐츠·SEO

| # | 작업 |
|---|------|
| 3.1 | `sensors/datalogger` hero·`sectionImages.principle` 캡션 확인 |
| 3.2 | `modes/manual`, `modes/automatic` principle 이미지 동일 ID |
| 3.3 | `generate-technology-seo-pages.mjs` (선택) |
| 3.4 | `verify-production.mjs` figcaption |

### Phase 4 — 검수·운영 반영

```bash
# PASS 전 (의도적 FAIL)
npm run audit:images   # IMG-045 REGENERATE 시 dictionary 차단

# PASS 후
python scripts/convert-technology-webp.py
npm run build:images
node scripts/build-content-data.mjs
npm run audit:images
```

| 등급 | 조건 |
|------|------|
| **PASS** | §7 체크리스트 전항 + 금지 오류 0 |
| **REGENERATE** | 현행 ~ Phase 1 완료 전 |
| **MINOR_FIX** | 실루엣 OK, 라벨·화살표만 수정 |

---

## 3. 생성 경로 비교

| | **A. Pillow 프로그램** | **B. AI 이미지** |
|---|--------------------------|------------------|
| 장점 | 재현성, 11종 일괄 합성, 브랜드 오염 없음 | 단자 디테일·매뉴얼 질감 |
| 단점 | 2026-06 롤백 이력(품질) | Figure마다 편차 |
| 코드 | `datalogger_draw.draw_cr1000x_front` **이미 구현됨** | `IMG-045` 프롬프트 v2 |
| 1차 권장 | ✅ Phase 1.1 | B는 A 불합격 시 |

---

## 4. 검수 체크리스트 (IMG-045 v2)

- [ ] 중앙이 **정면 배선판**(단자 열 2~3행)인가 — 내부 ①~⑤ 블록도 **아님**
- [ ] 가로:세로 ≈ **2.4:1** 인클로저인가
- [ ] **12V** 전원(녹색) 또는 POWER 표기
- [ ] 좌: 센서 케이블 → 단자, 우: 전원·통신·저장
- [ ] 브랜드·**CR1000X** 문자열 **없음**
- [ ] 흙막이 단면·서버 UI가 **주 화면 아님**
- [ ] `alt`·`caption`·KDS 용어 유지

---

## 5. 일정 제안

| 단계 | 기간 | 산출 |
|------|------|------|
| Phase 0 | 0.5일 | 문서·프롬프트 v2·레지스트리 REGENERATE |
| Phase 1 | 1일 | IMG-045 PNG v2 + WebP + PASS |
| Phase 2 | 2~3일 | P1 4종 → P2 5종 (IMG-064 포함) |
| Phase 3 | 0.5일 | SEO·운영 확인 |

---

## 6. 리스크·대응

| 리스크 | 대응 |
|--------|------|
| Pillow 품질 재발 (06 가이드 롤백 이력) | AI v2 병행 · `reviewed/` 폴더에 PASS본만 배포 |
| 단면 Figure(002)와 구성도(045) 역할 혼동 | 045는 **장비 정면 only**, 002는 **지표 방수함 맥락** |
| legacy PNG 복원 필요 | `scripts/restore-pre-datalogger-pngs.py` (롤백용) |

---

## 7. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-25 | 현행 PNG(내부 블록도) 불합격 판정 · CR1000X v2 재작성 계획 수립 |
