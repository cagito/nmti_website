# NMTI 건설계측 기술자료 — 외부 공학 검증 대조·수정계획

**수립:** 2026-06-26  
**근거:** 외부 「NMTI 건설계측 기술자료 공학 검증 보고서」(2026-06) · 저장소 [28-공학감사](./28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) · [29-Master Plan](./29-NMTI-기술자료-이미지-공학-감사-수정계획.md)  
**목적:** 외부 감사 항목을 **저장소 감사 ID·Phase·Exit**에 1:1 매핑하고, **문서·지침·자동검사**까지 포함한 실행 계획을 고정  
**갱신:** Living Plan — Phase 완료 시 §2·§3 상태표만 갱신

---

## 0. Executive summary

| 구분 | 내용 |
|------|------|
| **외부 보고서 핵심** | (1) 센서 종류 혼동 (2) 설치 위치·힘·변위 방향 오류 (3) 자동계측 정책과 Figure 불일치 |
| **저장소 대응** | (1)(2) → [28 §2·§3](./28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) 감사 ID **EXC·BLD·BRI** · Pillow/AI 재작도 **001~005·038·085~088** |
| **잔여 P1** | **없음** — Phase 5 전항 Pillow v2 ✅ (2026-06-22) |
| **신규 지침** | **AUTO-01** 자동계측 정책 · **CLS-01** 센서 클래스 혼동 금지 · **[51](./51-계측-도면-검수-공통-원칙.md)** FIG·INST·REJECT — [TECHNICAL §0.4](./TECHNICAL_IMAGE_STANDARD.md) · [INSTRUMENTATION §3.24](./INSTRUMENTATION_DRAWING_RULES.md) |
| **조사 한계** | 공개 크롤러는 SPA 셸만 수집 → **저장소 + `npm run verify:local`** 이 정본 |

**최종 권고 (외부·내부 공통):** `reviewed`/`PASS` 없는 Figure는 **구조적으로 미노출** — 이미 `resolveImage()`·`audit:images:strict`로 운영 중.

---

## 1. 조사 범위·한계 (외부 ↔ 저장소)

| 항목 | 외부 보고서 | 저장소 정본 |
|------|-------------|-------------|
| 기술자료 본문 | JS 동적 로딩 → 크롤러 「불러오는 중…」 | `js/technology/content-data.js` · `scripts/content-data/*.mjs` |
| `#fields/bridge` | 해시 URL 정적 HTML 미분리 | **SEO:** `technology/fields/bridge/**/index.html` (99페이지) · **SPA:** `#fields/bridge` |
| GitHub `nmti` | 공개 repo 0 | **본 저장소** `homepage/` — `verify:local`·registry |
| 이미지 ID | 일부 `미지정` | `IMG-001`~`097` · `image-review-registry.json` |
| KDS/KCS | KDS 21 30 00 (2024-09-26) | `book/KDS-KCS_용어기준.md` · `validate-terminology.mjs` |

> **에이전트·작업자:** 공개 URL 크롤 결과만으로 PASS 판정 **금지**. §1 표 우측만 정본.

---

## 2. 외부 오류표 ↔ 저장소 감사 ID 매핑

### 2.1 유형 혼동 (CLS-01)

| 외부 진단 | 금지 | 저장소 감사 ID | 대표 IMG | 저장소 상태 (2026-06-26) |
|-----------|------|----------------|----------|--------------------------|
| 지중경사계 ↔ 구조물경사계 | 동일 「경사계」·동형 아이콘 | **EXC-02** | 002·025·027 | 002 v5 ✅ · 025·027 **재검수** |
| 지하수위계 ↔ 간극수압계 | 개방 관 = 밀폐 filter | **EXC-03** | 002·030·031·062 | 002 v5 ✅ · 030·031 **재검수** |
| 균열계 ↔ 변위계 | spring extensometer 혼동 | **BLD-01** | 005·037 | 005 v3 ✅ |
| 자동광파기 ↔ 프리즘 | 옥상 TS = 측점 | **BLD-03** | 005·042 | 005 v3 ✅ |
| 앵커 LC ↔ 버팀보 LC | generic 「하중계」 | **EXC-01** / **STR-01** | 004·035 | 004 v3 ✅ · 035 **재검수** |

**CLS-01:** Figure·범례·caption에서 **측정 물리량이 다른 장비를 같은 이름으로 쓰지 않는다** — [IMAGE_AUDIT_CHECKLIST §2.1](./IMAGE_AUDIT_CHECKLIST.md).

### 2.2 설치 위치·방향 (P1 Figure)

| 외부 항목 | 심각도 | 감사 ID | IMG | 코드/버전 | 잔여 |
|-----------|--------|---------|-----|-----------|------|
| 흙막이 대표 단면 | P1 | EXC-02~05 | **002** | v5 C0 | caption·SEO·002 inset=004 **육안** |
| 어스앵커 하중계 | P1 | EXC-01 | **004** | v3 | REVIEW_LOG formal 서명 |
| 지중경사계 시스템 | P1 | EXC-02 | **025** | Phase 5 v2 | ✅ AUTO-01 IPI·logger |
| 지중경사계 설치 단면 | P1 | EXC-02 | **027** | v2 PASS | 외부 대조 **서명** |
| 지하수위계 | P1 | EXC-03·AUTO | **030** | Phase 5 v2 | ✅ well cap·screen·seal |
| 간극수압계 | P1 | EXC-03·AUTO | **031** | Phase 5 v2 | ✅ filter·junction·logger |
| 토압계 | P1 | EXC-04 | **034** | Phase 5 v2 | ✅ 감지면·배면→벽체 |
| 하중계(일반) | P1 | STR-01 | **035** | Phase 5 v2 | ✅ strut vs anchor |
| 주변건물 균열·경사 | P1 | BLD-01~04 | **005** | v3 | REVIEW_LOG·예시 그래프 주석 |
| 교량 분야 | P2→완료 | BRI-01·02 | 012~014·038·085~088 | v2 bridge | ✅ Phase 4 |

### 2.3 자동계측 정책 (AUTO-01)

| 외부 지적 | 올바른 해석 | 지침 반영 |
|-----------|-------------|-----------|
| 「방수보호함 있으면 수동」 오해 | well cap·junction box **허용** — **센서 클래스**가 핵심 | [INSTRUMENTATION §3.24](./INSTRUMENTATION_DRAWING_RULES.md) |
| manual probe를 hero로 | **비교용** inset만 · hero = logger chain | AUTO-01 · 025 principle |
| 데이터 흐름 불일치 | `센서 → 로거/터미널 → LTE M2M → 서버 → 경보` | [24 §3](./24-토목-계측-개념도-및-구성도-작성-가이드라인.md) · §4.13 |

---

## 3. Phase 로드맵 (29번 Plan 확장)

```mermaid
gantt
    title 외부 공학검증 반영 수정계획
    dateFormat YYYY-MM-DD
    section Phase 0~4 완료
    28·27·AUTO·CLS 지침           :done, d0, 2026-06-20, 7d
    001·002·004·005·bridge        :done, d1, 2026-06-21, 6d
    section Phase 5 P2 재검수
    025·030·031·034·035 Pillow v2   :done, p5, 2026-06-22, 1d
    027·062 외부 서명               :active, p5b, 2026-06-26, 5d
    section Phase 6 문서·게이트
    001·002·004·005 REVIEW_LOG   :done, p6, 2026-06-22, 2d
    verify:local strict           :done, p6b, 2026-06-22, 1d
    section Phase 7 운영
    FTP·verify:production         :p7, 2026-07-10, 3d
    section Phase 8 자동화
    audit 키워드·AUTO flag        :p8, 2026-07-15, 5d
```

---

## 4. Phase별 실행 (상세)

### Phase 5 — P2 센서 상세 Figure (최우선 잔여)

| ID | 외부 확인 포인트 | INSTRUMENTATION | 불합격 시 | 담당 |
|----|------------------|-----------------|-----------|------|
| **IMG-025** | 4홈 casing · 다점 · Base · **수동 probe hero 금지**(AUTO) | §3.3 | REGENERATE | 계측 |
| **IMG-027** | 안정층 · groove · grout | §3.3.1 | Pillow v2 | ✅ doc 17 |
| **IMG-030** | screen · filter pack · bentonite seal · **well cap** | §3.4·§3.24 | Pillow v2 | ✅ |
| **IMG-031** | filter · seal · **≠ 개방 관** · junction→logger | §3.5·§3.24 | Pillow v2 | ✅ |
| **IMG-034** | 감지면 · 배면→구조물 | §3.6 | Pillow v2 | ✅ |
| **IMG-035** | **strut 축압** vs **anchor LC 압축** 분리 | §3.2·§3.7 | Pillow v2 | ✅ |
| **IMG-062** | 002 연계 ②③ 이형 | §3.4·§3.5 | Pillow v2 | ✅ EXC-03 |

**절차:**

1. [IMAGE_AUDIT_CHECKLIST §4.x](./IMAGE_AUDIT_CHECKLIST.md) 체크  
2. 불합격 → `requiresReaudit: true` · `reviewGrade` 하향  
3. `render-p2-sensors.py` / 전용 draw · registry · `npm run build:images`  
4. [IMAGE_REVIEW_LOG](./IMAGE_REVIEW_LOG.md) · 외부 감사 ID **0건**까지 재승인

```bash
python scripts/render-phase5-sensors.py          # 025·030·031·034·035
python scripts/render-phase5-sensors.py --id 030
npm run build:images && npm run verify:local
```

### Phase 6 — 문서·캡션·설명문

| # | 작업 | 산출 |
|---|------|------|
| 6.1 | **본 문서(30)** Living Plan 유지 | §2 상태표 |
| 6.2 | 001·002·004·005 **REVIEW_LOG** formal 서명 | 검수자·육안 Q0 |
| 6.3 | SEO **alt/caption** — [28 §2](./28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) 물리량 반영 | `generate-technology-seo-pages.mjs` |
| 6.4 | **용어 표** — [TERMINOLOGY](./TERMINOLOGY.md) · 아래 §5 표 | content-data |
| 6.5 | `image-audit.md` §3 레거시 C/F → PASS 대조 정리 | mismatch 0 목표 |

### Phase 7 — 배포

| Exit | 명령 |
|------|------|
| 로컬 | `npm run verify:local` |
| FTP 후 | `npm run verify:production` **24/24** |
| 브라우저 | bridge·retaining hero 스크린샷 보관 | ✅ `docs/qa-screenshots/` |

### Phase 8 — 자동검사 강화 (재발 방지)

| 검사 | 구현 | 우선 |
|------|------|------|
| BRI-01 bridge→001·002·005 | `audit-image-doc-mismatch.mjs` | ✅ |
| AUTO-01 manual hero on auto nodes | `audit-image-doc-mismatch.mjs` · `audit-technology-images.mjs` | ✅ |
| EXC-01 anchor LC keywords | caption/alt 휴리스틱 | ✅ |
| EXC-03 030·031 동일 file hash | 이미지 중복 탐지 | ✅ |
| `requiresReaudit: true` + PASS 충돌 | `audit-technology-images.mjs --strict` | ✅ |
| IMG-041→097 blast-vibration principle | `leaves-part3.mjs` · `verify:production` | ✅ |

---

## 5. 설명문·메뉴 수정 권고 (콘텐츠)

### 5.1 메뉴 논리 (현행 유지 + caption 보강)

저장소는 이미 **「계측 분야별 · 계측기기 별 · 시스템」** 3단(`dictionary.js`)이다. 외부 권고 「적용 분야 → 계측 목적 → 계측기」는 **leaf 노드 overview·sectionImages**에서 목적별 서술로 보강한다.

### 5.2 문장 치환표 (필수)

| 금지·모호 | 수정 (한글 · 필요 시 영문 병기) |
|-----------|----------------------------------|
| 경사계 | **센서형 다단식 지중경사계** 또는 **구조물경사계(Tiltmeter)** |
| 하중계 | **어스앵커 하중계(센터홀)** / **버팀보 하중계(축압축)** |
| 자동광파기 측점 | **프리즘 측점** / **자동광파기(AMTS) 본체** 분리 |
| 지하수위계 (간극수압 문맥) | 개방 **관측정·G.W.L** vs 밀폐 **간극수압계** 명시 |
| 방수보호함 (030) | **well cap·surface protective casing·vented cable** (자동형 허용) |
| 경보 0.3/0.6/0.9 mm 단독 | **「예시 관리기준」** 또는 **프로젝트별 설정** |

적용: `scripts/content-data/*.mjs` · `leaves-*.mjs` · SEO figcaption.

### 5.3 지하수위계 vs 간극수압계 (Figure 최소 요건)

| 항목 | 지하수위계 (030) | 간극수압계 (031) |
|------|------------------|------------------|
| 계측 대상 | 개방 수면 | 특정 심도 u |
| 상부 | well cap·보호정 | junction/terminal box |
| 하부 | screen·filter pack·seal | filter tip·grout/seal |
| 수면선 | **필수** | **금지**(개방형 표현) |
| 자동계측 | submerged logger·vented cable | VW piezo→logger |

---

## 6. 재발 방지 — 지침 반영 목록

| 문서 | 반영 내용 |
|------|-----------|
| [TECHNICAL_IMAGE_STANDARD §0.4](./TECHNICAL_IMAGE_STANDARD.md) | AUTO-01 자동계측 · manual hero 금지 |
| [INSTRUMENTATION §3.24](./INSTRUMENTATION_DRAWING_RULES.md) | AUTO-01 · 030/031 비교 · 데이터 흐름 |
| [IMAGE_AUDIT_CHECKLIST §2.1·§4.15](./IMAGE_AUDIT_CHECKLIST.md) | CLS-01 · AUTO-01 · Phase 5 목록 |
| [28-공학감사 §3](./28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) | AUTO-01·STR-01·외부 보고서 교차 |
| [29-Master Plan](./29-NMTI-기술자료-이미지-공학-감사-수정계획.md) | Phase 5~8 · doc 30 링크 |
| [AGENTS.md](../AGENTS.md) | 작업 전 §1 순서 + AUTO·CLS |
| [IMAGE_REGENERATION_PROMPTS](./IMAGE_REGENERATION_PROMPTS.md) | 025·030·031·034·035 블록 (Phase 5) |
| [`book/kds-kcs-citation-registry.json`](../book/kds-kcs-citation-registry.json) · [40-KCS/KDS 출처](./40-KCS-KDS-출처-표기-통합-계획.md) | **근거 기준** 레지스트리 · 웹·프롬프트·INSTRUMENTATION §3.x 동기화 |

---

## 7. 검수 Exit (외부·내부 공통)

1. [28 §2](./28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) 해당 **감사 ID 0건** (해당 Figure scope)  
2. [INSTRUMENTATION](./INSTRUMENTATION_DRAWING_RULES.md) 해당 § **금지 0건**  
3. [IMAGE_AUDIT_CHECKLIST](./IMAGE_AUDIT_CHECKLIST.md) 해당 § **전항 체크**  
4. `reviewGrade`: PASS · `requiresReaudit`: false  
5. `npm run audit:images:strict` **0 error**

---

## 8. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | 신규 — 외부 공학 검증 보고서 대조 · Phase 5~8 · AUTO-01·CLS-01 · 설명문 표 |
