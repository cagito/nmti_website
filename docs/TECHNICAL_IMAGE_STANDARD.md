# NMTI 기술자료 이미지 기술 표준

**적용 범위:** `/homepage/technology/` SPA·SEO 정적 페이지·`assets/images/technology/`  
**상위 규칙:** [TERMINOLOGY.md](./TERMINOLOGY.md), [book/KDS-KCS_용어기준.md](../book/KDS-KCS_용어기준.md)  
**연계:** [24-토목-계측-개념도-및-구성도-작성-가이드라인.md](./24-토목-계측-개념도-및-구성도-작성-가이드라인.md), [INSTRUMENTATION_DRAWING_RULES.md](./INSTRUMENTATION_DRAWING_RULES.md), **[IMAGE_REJECT_CHECKLIST.md](./IMAGE_REJECT_CHECKLIST.md)**, [51-계측-도면-검수-공통-원칙.md](./51-계측-도면-검수-공통-원칙.md), [IMAGE_AUDIT_CHECKLIST.md](./IMAGE_AUDIT_CHECKLIST.md), [IMAGE_REVIEW_LOG.md](./IMAGE_REVIEW_LOG.md), [08-기술자료-이미지-심층리서치-구현계획.md](./08-기술자료-이미지-심층리서치-구현계획.md)

---

## 0a. 근거 및 출처 (KDS/KCS)

Figure·프롬프트·검수 기록에 **국가건설기준(KDS/KCS) 조항**을 명시해 기술 주장의 근거를 방어 가능하게 한다.

| 항목 | 정본 |
|------|------|
| **레지스트리** | [`book/kds-kcs-citation-registry.json`](../book/kds-kcs-citation-registry.json) — 문서·분야·nodeId·IMG 매핑 |
| **IMG §3.x 조항** | [INSTRUMENTATION §0·부록 A](./INSTRUMENTATION_DRAWING_RULES.md) · 각 §3.x `### 근거` |
| **웹 기술자료** | `npm run build:content` → 본문 하단 **「근거 기준」** · JSON-LD `isBasedOn` |
| **프롬프트** | `npm run sync:prompt-citations` → `prompts/IMG-###_*.md` `## 근거 기준` |
| **검증** | `npm run validate:citations` · `docs/citation-coverage-report.md` |

**등급:** A/B = registry 검증 조항만 · C = 용어·일반 관행 · D = 설계도서·발주처 지침 우선. Figure caption·redline에 **registry에 등록된 A/B 조항만** 인용 — **없으면** 「설계도서·계측관리계획서 우선」으로 표기. **조항 1줄 이상 삽입 권장**은 폐기(근거 없는 조항 유도 방지).

---

## 0. 강제 적용 (Non-negotiable)

기술자료 이미지가 실제 계측 설치 원리와 다르면 홈페이지 신뢰도가 훼손된다. **선택이 아니다.**

### 0.0 P0 / P1 / P2 — 심각도 (2026-06-26 정리)

> **ZIP 207 검수 (2026-06-26):** 외부 전수검수 **신규 심각 10종** — [77-수정계획](./77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md) · [IMAGE_REGENERATION_PROMPTS §ZIP](./IMAGE_REGENERATION_PROMPTS.md)  
> **ZIP 105 검수:** P0는 **즉시 폐기**만 · 스타일·외형은 P1/P2 — [66-정합-수정-보고](./66-ZIP105-문서-정합-수정-보고.md)

| 등급 | 의미 | 대표 |
|------|------|------|
| **P0** | REGENERATE — 계측 논리 붕괴 | P0-4~6 · MIX-01 · SETTLE 혼동 · G.W.L≠piezo · VIEW-01 · 센서≠로거 혼동 |
| **P1** | 전면 수정 | P0-1(건물 있을 때) · P0-2 · 로거=함체(빈박스·접속함만 금지) · 설치도에 시스템 UI 금지 |
| **P2** | 부분·출판 | 로거 외형 세부(CR1000X=예시) · IPI 본도 지시선 단축 · 색상·visualReview |

**운영 정본 3종:** 본 문서 · [INSTRUMENTATION](./INSTRUMENTATION_DRAWING_RULES.md) · **[IMAGE_REJECT_CHECKLIST](./IMAGE_REJECT_CHECKLIST.md)** (Cursor 폐기 10줄)

### 0.0a P0 최상위 — Figure 폐기 조건 (계측 논리)

> **⛔ Figure·프롬프트·redline 작성 시 다른 규칙보다 먼저 적용.**  
> 정본: [27-지표면-건물-안착-원칙.md](./27-지표면-건물-안착-원칙.md) · [36 §1.0](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · [06 데이터로거 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md) (예시)

| # | 규칙 | 등급 | 위반 |
|---|------|------|------|
| **P0-1** | **건물 포함 Figure** — 출입문·1층 = **지표면 위**; 출입구가 토사·매립층 **내부·아래** 금지 | **P1** (건물 없으면 해당 없음) | C0 |
| **P0-2** | **IPI** 케이싱·**지하수위계** = **GL에서 천공** · **천공 개구부·캡·well cap 지표면 가시** (BORE-GL-01 · [111](./111-지중경사계-지하수위계-지표면-천공-가시-표준.md)) | **P1** | C0d |
| **P0-3** | **데이터로거** = **함체(인클로저)** — 범례·빈 박스·접속함만·PC·서버 **금지**; 센서 케이블 수렴. **외형(CR1000X 등)=P2 예시** | **P1** (센서≠로거 혼동=**P0**) | C0e |
| **P0-4** | **One Figure = One 계측 목적** — 계측 목적·분야 **혼합 금지** (FIG-01 · MIX-01) | **P0** | REGENERATE |
| **P0-5** | 가시설·굴착 단면 **3분할:** `배면 지반 \| 벽체 \| 굴착측` — 굴착 공동·버팀보·굴착저는 **굴착측만** (FIG-02) | **P0** | REGENERATE |
| **P0-6** | **띠장·버팀보·어스앵커 두부** = **굴착측 벽면만** — 배면·정착장·그라우트 내부 **금지**; **앵커 LC** = 두부 **반력판–하중계–헤드**, **앵커 설치각과 동축** (SOE-ABS · ANC-AXIS · **ANC-CLOCK 1~7시**) | **P0** | REGENERATE |
| **P0-7** | **단면·입면·평면** 무라벨 혼합 금지 (VIEW-01 · R-11) | **P0** | REGENERATE |
| **P0-8** | **지하수위계 ≠ 간극수압계** — 동일 관·동일 수위선 금지 | **P0** | REGENERATE |
| **P0-9** | **센서·측점·계측기·시스템** 혼동 — 침하핀 라벨을 지표침하계에 부착 등 (SETTLE-01) | **P0** | REGENERATE |
| **P0-10** | **진동현식·VW·특정 센서 방식**을 Figure 라벨·제목·범례에 표기 **금지** (METHOD-01) | **P0** | REGENERATE |

**METHOD-01:** 도면은 **계측기 종류·설치 위치·측정량**만 표현 — **진동현식(VW) 인터페이스** 등 **측정 방식·상품 인터페이스**는 Figure에 넣지 않음 (현장·OEM 다양 · 고가 VW 추세 감소). 본문·FAQ는 설계도서·시방 따름.

### 0.0b ZIP 207 전수검수 — ZIP-AUD-01~10 (2026-06-26)

외부 ZIP **207종** 대표 Figure 검수에서 기존 감사와 **비중복** 신규 심각 오류. 정본: [77-수정계획](./77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md).

| ID | 감사 | 핵심 금지 |
|----|------|-----------|
| ZIP-AUD-01 | IMG-008 | 라이닝 **연속 센서 튜브** = 내공변위 |
| ZIP-AUD-02 | IMG-009 | 숏크리트 응력계 **공중 부유** |
| ZIP-AUD-03 | IMG-015 | **확정** 활동면·`3~5m` 고정 근입 |
| ZIP-AUD-04 | IMG-032 | 연장봉 상단 = **기준점** (측정점 아님) |
| ZIP-AUD-05 | IMG-034 | **상재하중 q** = **수평토압 σh** 혼재 |
| ZIP-AUD-06 | IMG-041 | 가속도에 **mm/s** (속도 단위) 혼합 |
| ZIP-AUD-07 | IMG-043 | GNSS **시준 점선** (광파기 오해) |
| ZIP-AUD-08 | IMG-060 | 이상치 **자동 삭제·보간** (원본 미보존) |
| ZIP-AUD-09 | IMG-078 | 두부 하중 = **전체** 록볼트 축력 |
| ZIP-AUD-10 | IMG-080 | 플랜지 1점 SG = **전체** 강지보 응력 |

**전수검수 10항:** [77 §2](./77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md) · 프롬프트 [IMAGE_REGENERATION_PROMPTS §ZIP](./IMAGE_REGENERATION_PROMPTS.md)

### 0.0c ZIP 207 전수검수 — ZIP-AUD-11~20 · INTERP-01 (2026-06-26)

외부 ZIP **2차 묶음** 10종 — Phase Z(01~10)와 **비중복**. 정본: [81-Phase AA](./81-외부-ZIP-신규-심각오류-10종-Phase-AA-수정계획.md).

**INTERP-01 (전역):** Figure·그래프·라벨에서 **해석·추정·상관**은 `추정` · `검토` · `가능` · `상관` — **확정·단정·인과** 표현 금지.

| ID | 감사 | 핵심 금지 |
|----|------|-----------|
| ZIP-AUD-11 | IMG-016 | 최대변위 심도 = **활동면** 단정 |
| ZIP-AUD-12 | IMG-017 | 무한사면식 ↔ 프로파일 **직접 연결** |
| ZIP-AUD-13 | IMG-018 | 상관관계 = **인과 확정** |
| ZIP-AUD-14 | IMG-020 | 침하판·기준점 혼동 · 압밀 **과단순** |
| ZIP-AUD-15 | IMG-021 | 측방유동 **균일 밀림** · 판단 과단순 |
| ZIP-AUD-16 | IMG-025 | 누적변위 = **절대변위** |
| ZIP-AUD-17 | IMG-027 | 케이싱 **내부 그라우트** · Base **절대고정** |
| ZIP-AUD-18 | IMG-037 | 균열계 = **전단·단차·회전** 전체 |
| ZIP-AUD-19 | IMG-038 | 1점 경사 = **구조물 전체** 기울기 |
| ZIP-AUD-20 | IMG-039 | 신축계·이음계·LVDT·균열계 **혼합** |

프롬프트: [IMAGE_REGENERATION_PROMPTS §Phase AA](./IMAGE_REGENERATION_PROMPTS.md) · `npm run patch:registry-phase-aa`

### 0.0d ZIP 207 전수검수 — ZIP-AUD-21~30 · 센서·시스템 (2026-06-26)

외부 ZIP **3차 묶음** 10종 — Phase Z·AA와 **비중복**. 정본: [84-Phase AB](./84-외부-ZIP-신규-심각오류-10종-Phase-AB-수정계획.md).

| 규칙 | 내용 |
|------|------|
| **AXIS-01** | 지중경사계 A/B축 = **현장 변위·굴착·활동 방향** (화면 좌표 금지) |
| **IPI-MEAS-01** | 초기 프로파일 · 왕복 · 기준 심도 · 누적오차 — θ 단순 적분 금지 |
| **WELL-01** | 관측공 **필터·차수·스크린** — 전 구간 개방 혼합 금지 |
| **LOAD-02** | 하중계 **축 일치·편심·프리로드·온도** |
| **LVDT-01** | 기준점 안정 · 측정축 · stroke · 브라켓 유격 |
| **ATS-NET-01** | 기준/타깃 프리즘 · 후시점 · 기상보정 |
| **WX-SITE-01** | 기상계 **설치 높이·이격** · 변위 원인 단독 확정 금지 |
| **LOGGER-SIG-01** | 센서별 **신호 형식·여자·채널** 분리 |
| **GW-ROLE-01** | 로거=수집·저장 / 게이트웨이=**중계·변환** (판정 금지) |

| ID | 감사 | 핵심 금지 |
|----|------|-----------|
| ZIP-AUD-21 | IMG-026 | A/B축 = **화면 좌표** |
| ZIP-AUD-22 | IMG-028 | θ **단순 적분** = 누적변위 |
| ZIP-AUD-23 | IMG-029 | 최대 누적심도 = **활동면** |
| ZIP-AUD-24 | IMG-030 | 관측공 **전 구간 개방** |
| ZIP-AUD-25 | IMG-035 | 하중계 **편심·프리로드** 누락 |
| ZIP-AUD-26 | IMG-040 | LVDT **축·stroke** 누락 |
| ZIP-AUD-27 | IMG-042 | ATS **기준망·후시점** 누락 |
| ZIP-AUD-28 | IMG-044 | 기상계 **임의 설치** · 상관=인과 |
| ZIP-AUD-29 | IMG-045 | 모든 센서 **동일 입력** |
| ZIP-AUD-30 | IMG-046 | 로거 = **게이트웨이** |

프롬프트: [IMAGE_REGENERATION_PROMPTS §Phase AB](./IMAGE_REGENERATION_PROMPTS.md) · `npm run patch:registry-phase-ab`

### 0.0e ZIP 207 전수검수 — ZIP-AUD-31~40 · MEAS-PRIN-01 (2026-06-22)

외부 ZIP **4차 묶음** — **계측 원리·측정 기준·해석 로직** 오류. 정본: [92-Phase AC](./92-외부-ZIP-신규-심각오류-10종-Phase-AC-수정계획.md).

| ID | 감사 | 핵심 금지 |
|----|------|-----------|
| ZIP-AUD-31 | IMG-007 | 터널 **측점·측선·기준점** 미분리 |
| ZIP-AUD-32 | IMG-019 | 성토·piezo **개념/흐름** — **설치 배치도 아님** (SOFT-LAYOUT-01 · [109](./109-IMG-019-연약지반-성토부-계측기-설치-배치도-표현-표준.md)) |
| ZIP-AUD-33 | IMG-023 | 궤도틀림·노반침하·진동 **혼합** |
| ZIP-AUD-34 | IMG-024 | 누수 = **제체 내부 센서** (DAM-LEAK-01) |
| ZIP-AUD-35 | IMG-031 | piezo = **standpipe** · 필터·차수 불명 |
| ZIP-AUD-36 | IMG-033 | 자석링·기준관·프로브 **역할 모호** |
| ZIP-AUD-37 | IMG-036 | 변형률 = **즉시 응력 판정** |
| ZIP-AUD-38 | IMG-079 | 숏크리트 = **지반압 전체** 대표 |
| ZIP-AUD-39 | IMG-081 | RF = **절대 기준** 축소 산정 |
| ZIP-AUD-40 | IMG-059 | 관리기준 **단일 표** 일반화 |

**MEAS-PRIN-01:** 계측 항목별 **기준점·측점·측선·단위·해석 단계** 분리 — 단일 센서가 전체 거동 **대표** 금지.

프롬프트: [93-복붙](./93-Phase-AC-복붙-프롬프트-정본.md) · `npm run patch:registry-phase-ac`

### 0.0f ZIP 207 전수검수 — ZIP-AUD-41~50 · 운영·그래프·UI (2026-06-26)

외부 ZIP **5차 묶음** (`IMG-047`~`056`) — **계측 시스템 운영·그래프 해석·경보·대시보드**. 정본: [96-Phase AD](./96-외부-ZIP-신규-심각오류-10종-Phase-AD-수정계획.md).

| 규칙 | 내용 |
|------|------|
| **OPS-VERIFY-01** | 계측값 → 운영 판단 전 **데이터 품질·상태·결측·지속시간·현장확인** |
| **GRAPH-AXIS-01** | 그래프 **축·단위·시간·초기치** — 이벤트번호·시간 혼합 금지 |
| **GRAPH-PRED-01** | 침하 예측 = **해석법** — 선형 외삽 금지 |
| **LOAD-STAGE-01** | 하중 = **단계별 설계축력** — 동일 수평 기준 금지 |
| **ALARM-FLOW-01** | 경보 = QC → 이상/결측 분리 → 해제조건 |
| **DASH-STATE-01** | 대시보드 **상태색·이벤트 일관** |

| ID | 감사 | 핵심 금지 |
|----|------|-----------|
| ZIP-AUD-41 | IMG-047 | 태양광 직렬만 · 무정전 보장 |
| ZIP-AUD-42 | IMG-048 | LTE 직렬 · 버퍼·ACK 없음 |
| ZIP-AUD-43 | IMG-049 | 단일 ±변위 기준 |
| ZIP-AUD-44 | IMG-050 | **선형 외삽 = 예측 침하** |
| ZIP-AUD-45 | IMG-051 | 이상화 u 소산 패턴 |
| ZIP-AUD-46 | IMG-052 | **동일 수평 하중 기준** |
| ZIP-AUD-47 | IMG-053 | PPV 시간·이벤트 혼합 |
| ZIP-AUD-48 | IMG-054 | **선형 색상 경보만** |
| ZIP-AUD-49 | IMG-055 | 초과 알림만 |
| ZIP-AUD-50 | IMG-056 | 형식 대시보드 |

프롬프트: [97-복붙](./97-Phase-AD-복붙-프롬프트-정본.md) · [11-그래프·운영 가이드](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/11_그래프_운영_대시보드_이미지_가이드.md) · `npm run patch:registry-phase-ad`

**P0-3 금지(P1):** 범례·라벨만 · 「DATA LOGGER」 빈 박스 · 접속함·정사각 아이콘만 · PC·서버·랙 · 단면에 블록 다이어그램만

**검수:** [27 §2 Q0](./27-지표면-건물-안착-원칙.md) · **가시설 Figure** [51 Q-FIG·Q-SOE](./51-계측-도면-검수-공통-원칙.md) — **P0** 불합격 시 PASS 불가.

### 0.0g IMG-096 — 가시설 주변지반 · SOE-SURR-01 (2026-06-26)

**노드:** `fields/retaining-excavation/surrounding-ground` · 정본: [57](./57-IMG-096-가시설-주변지반-계측-표현-표준.md) · [110 v4](./110-IMG-096-옹벽삭제-가시설-주변지반-재작업-계획.md)

| 규칙 | 내용 |
|------|------|
| **SOE-SURR-01** | = **흙막이 굴착 배면** 주변지반 — **≠ 옹벽 · ≠ 사면 활동 · ≠ 연약지반 성토(019)** |
| **MIX 금지** | 옹벽·기초·토압 · Sand Mat·침하판 중심 · 잠재 슬립면 · 데이터 흐름도 |
| **H** | **H = 굴착깊이** · 1H~2H = 배치 검토 **예시** |
| **②** | **지표침하 측점/핀** — `지표침하계` 라벨 금지 (SETTLE-01) |
| **4종** | 지중경사계 · ② · 간극수압계 · 지하수위계 — 동일 단면 |

### 0.1 에이전트·코드 SVG Figure 생성 금지 (최상위)

> **⛔** [16-기술자료-이미지-에이전트-SVG-생성-금지.md](./16-기술자료-이미지-에이전트-SVG-생성-금지.md)

| 규칙 | 내용 |
|------|------|
| **금지** | 에이전트·`render-svg-figures.py`·`*_svg.py`로 IMG Figure SVG 작성·변환 |
| **금지** | Pillow `ImageDraw`·에이전트 SVG로 **단면 CAD 「그림 그리기」** |
| **대안** | ref·book·§14 프롬프트 → **인간/검수 AI → PNG** → WebP |
| **계측기 표시** | 단면 위 **기호(번호·지시선)** — 장식 아이콘·실사 금지 |
| **블록 다이어그램** | 045·048·070 등 — Pillow 허용 (단면 CAD 아님) |

~~§0.1 SVG 최우선 (2026-06-25)~~ → **폐기**. [12-IMG-002-SVG 계획](./12-IMG-002-SVG-단면도-최우선-재작업-계획.md) 역사 참고만.

| 규칙 | 내용 |
|------|------|
| **운영 차단** | `reviewGrade`가 **PASS** 또는 **MINOR_FIX**가 아니거나, `status`가 **reviewed**가 아닌 이미지는 `resolveImage()`가 **null**을 반환한다. SPA·SEO에 노출되지 않는다. |
| **검수 기록 필수** | [IMAGE_REVIEW_LOG.md](./IMAGE_REVIEW_LOG.md)에 기록 없이 `reviewed`로 표시할 수 없다. |
| **자동 검수** | 배포 전 `npm run audit:images` 통과 필수. |
| **재생성 원칙** | 잘못된 그림은 보정하지 말고 원리부터 다시 그린다. |
| **보류** | 의심스러우면 「그럴듯하게」 생성하지 말고 **검수 보류(pending)** 처리한다. |

### 0.5 Figure Tier·이중 게이트 (출판 품질)

> **★ Master Plan:** [31-출판품질-통합-수정계획](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) · `scripts/figure-production-policy.json`

| 규칙 | 내용 |
|------|------|
| **FT-A/B** | 단면·복합 개념도 — **CAD·검수 AI PNG만** · Pillow `render-*.py` **금지** |
| **FT-C** | 블록·흐름·그래프 — Pillow 허용 · 출판 게이트(V1~V4) 적용 |
| **이중 게이트** | `reviewGrade: PASS` = **기술 게이트** + **`visualReview` 출판 게이트** |
| **CI** | `npm run audit:figure-production` (Phase 5 `--strict`) |

### 0.3 지표면·건물 안착·수직 관로 (P0 치명 — §0.0 상세)

> **⛔** [27-지표면-건물-안착-원칙.md](./27-지표면-건물-안착-원칙.md) · **최우선:** §0.0 P0-1·P0-2

| 규칙 | 내용 |
|------|------|
| **C0 치명** | **건물 포함 Figure** — 인접 건물 **1층·출입문** = **지표면 위** — **모래층·매립층 내부 금지** |
| **C0d 치명** | **IPI 케이싱·지하수위계** = **GL에서 천공** · **천공 개구부·캡·well cap 지표면 가시** — 중간 깊이 단독·끊김·비가시 금지 ([111](./111-지중경사계-지하수위계-지표면-천공-가시-표준.md)) |
| **지층** | 매립·모래·풍화암 등은 **지표면 아래만**; 경계선은 **건물 아래까지 수평 연속** |
| **굴착** | 공동은 **굴착측(맨 우)만** — 건물·배면 아래 연속 토사 |
| **검수 Q0** | 지표면 · **출입문=지표면 위** · 지층 1층 관통 X · **케이싱·관측공=GL 연속** |
| **적용** | **건물·인접구조물이 그려진** IMG-001·005·015 등 — 건물 없는 단면은 P0-1 **해당 없음** |

AI 프롬프트·Figure 수정 **전** §0.3·[14 §2](./14-흙막이-굴착-계측-개념도-AI-생성-가이드라인.md) 확인 **필수**.

### 0.6 센서 혼동·대형 인프라 (P1)

> [36 §4.5⑨·§4.9·§4.11](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · INSTRUMENTATION §3.28~§3.34 · **§2.4 지층 해칭**

| 규칙 | 내용 |
|------|------|
| **MPBX** | 다점 **강봉+앵커** cutaway — **≠ 지중경사계** · **≠ 신축계(039)** |
| **댐 hero** | 상류←→하류 · Plumb line · 기초 piezo — **풍경화 금지** |
| **항만 hero** | 좌=매립 \| 구조물 \| 우=바다 — **풍경·갈매기 금지** |
| **철도 hero** | 노반·궤도 **축단면** — 2레일+침목+道床 · **≠ KTX·역** |
| **건축/구조** | RC **보·슬래브·벽** detail — **≠ 조감도** · crack ⊥ 균열 |
| **말뚝 hero** | **지중 수직 단면** · cage·sister-bar · bedrock — **≠ 지상 기뚝** · **≠ 013** |
| **환경 hero** | **펜스↔민가** · mic+dust+logger — **≠ 대기 그래프** |
| **지층 해칭** | dot / dashed clay / cross-hatch bedrock — [36 §2.4](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) |
| **운영 모드** | timeline·trigger·threshold — [36 §4.12](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · **뇌·SF UI 금지** |
| **E2E Hub** | `INSTRUMENT_SUBGROUPS` 5블록 — [36 §4.13](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · IMG-058 |

### 0.7 AI 배치 생성 QA

Cursor Figure **연속 생성** 시 출력 1장마다 [36 §6.1](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) 4항 검수. 지중 단면은 **§2.4 Soil Layering** 말미 부착. 부분 오류 → **§5.1 Feedback Loop**.

### 0.4 자동계측 정책 (AUTO-01 — P1)

> **근거:** 외부 공학 검증 · [30-외부검증대조](./30-NMTI-건설계측-기술자료-외부공학검증-대조-및-수정계획.md) · [INSTRUMENTATION §3.24](./INSTRUMENTATION_DRAWING_RULES.md)

NMTI 기술자료는 **자동계측·원격 모니터링**을 전제로 한다. Figure·hero·principle은 아래를 따른다.

| 규칙 | 내용 |
|------|------|
| **hero 금지** | manual probe·sounder·portable readout **단독**을 운영 hero/principle로 사용 |
| **비교용 허용** | 수동형은 **「원리 비교」** inset·부록 Figure만 — caption에 「비교용」 명시 |
| **보호함 ≠ 수동** | well cap · surface protective casing · junction/terminal box · vented cable **자동형 허용** |
| **센서 클래스** | 지하수위계(개방 G.W.L) ≠ 간극수압계(밀폐 u) — [§3.4·§3.5 INSTRUMENTATION](./INSTRUMENTATION_DRAWING_RULES.md) |
| **데이터 흐름** | `센서 → 로거/터미널 → LTE M2M → 서버/대시보드 → 경보` — [24 §3.4](./24-토목-계측-개념도-및-구성도-작성-가이드라인.md) |
| **로거 외형 (P0-3)** | Figure의 **데이터로거 = 함체(인클로저)** — [06 로거](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/06_데이터로거_CR1000X_이미지_가이드.md) · 범례·빈 박스 **C0e** |
| **AMTS** | station + control point + line-of-sight + **복수 prism** — 프리즘만 hero **금지** (BLD-03) |

**검수:** AUTO-01 위반 → MAJOR_FIX 이상 · `requiresReaudit: true` — [IMAGE_AUDIT_CHECKLIST §4.15](./IMAGE_AUDIT_CHECKLIST.md)

### 0.2 지중경사계 Figure 라벨 — 센서형 다단식 (필수)

**모든 IMG Figure**에서 지중경사계를 그릴 때 한글 라벨·범례·Callout은 **`센서형 다단식 지중경사계`** 전칭만 허용한다.

| 금지 | 필수 |
|------|------|
| 「지중경사계」단독 라벨 | `센서형 다단식 지중경사계` |
| 침하계형 단일 막대·단일 프로브만 | 케이싱 내부 **다점 센서 노드** |
| 「지중수평변위계」단독 | Base **안정층**까지 근입 — **설계·계획서** ([51 §5](./51-계측-도면-검수-공통-원칙.md)) |

### 0.8 계측 도면 검수 공통 (FIG · SOE · REJECT)

> **[51-계측-도면-검수-공통-원칙.md](./51-계측-도면-검수-공통-원칙.md)** — **P0-4~6는 §0.0 표와 동일** (중복 참조)

| 규칙 | 내용 |
|------|------|
| **FIG-01 / P0-4** | **One Figure = One 계측 목적** — MIX-01 분야·목적 혼합 금지 |
| **FIG-02 / P0-5** | 가시설 **3분할:** `배면 지반 \| 벽체 \| 굴착측` |
| **SOE-ABS / P0-6** | 띠장·버팀보·앵커 두부 = **굴착측만** — [51 §2.1](./51-계측-도면-검수-공통-원칙.md) |
| **IPI-EMBED** | Base = 영향 심도/활동면 **하부 안정층** — **임의 m 일반 기준 금지** |
| **INST** | 설치 가능성 5항 — [IMAGE_AUDIT §4.3](./IMAGE_AUDIT_CHECKLIST.md) |
| **REJECT** | R-01~**R-83** 위반 시 생성·승인 금지 |

- **구조물경사계**와 혼동 금지 — [INSTRUMENTATION §3.3](./INSTRUMENTATION_DRAWING_RULES.md) · [09 ImageWorks 표준](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/09_지중경사계_센서형-다단식_표현_표준.md)

```bash
node scripts/seed-image-review-registry.mjs   # 레지스트리 초기화·병합
node scripts/generate-image-assets.mjs        # images.js 재생성
npm run audit:images                          # 운영 반영 전 필수
```

---

## 1. 이미지의 정체성

모든 기술자료 이미지는 **홍보 삽화가 아니라** 계측관리계획서·시방서·장비 매뉴얼에 들어갈 수 있는 **기술 도면**이다.

1. 계측기는 **실제 설치 위치**에만 배치한다. (**설치 가능성** — [51 §6](./51-계측-도면-검수-공통-원칙.md) · **DP-04**)
2. 센서가 측정하는 **물리량과 방향**을 반드시 표시한다.
3. 힘 전달·변위·수위선·토압·하중 방향은 **공학적으로 맞아야** 한다.
4. 단면은 **굴착측·배면·구조물·지층·안정층**을 명확히 구분한다.
5. **One Figure = One 계측 목적** — [51 FIG-01](./51-계측-도면-검수-공통-원칙.md)
6. **그림·글 작성 전:** [28-공학감사 §1](./28-NMTI-건설계측-기술자료-이미지-공학-감사-보고서.md) · [51 REJECT](./51-계측-도면-검수-공통-원칙.md) · 생성 전 **4항목**(위치·물리량·방향·금지) 작성.
7. 실제 현장명·노선명·공구명·사람 얼굴·차량번호·장난스러운 아이콘 **금지**.
8. 이미지 생성 **전** 기준 자료·[IMAGE_AUDIT_CHECKLIST.md](./IMAGE_AUDIT_CHECKLIST.md) 확인.
9. 생성 **후** [IMAGE_REVIEW_LOG.md](./IMAGE_REVIEW_LOG.md)에 검수 결과 기록.

---

## 2. 생성·수정 전 필수 절차

이미지를 생성하거나 수정하기 전 **반드시** 아래 순서를 따른다.

| 단계 | 작업 |
|------|------|
| 1 | 해당 계측기 **실제 설치 사진** 또는 제조사 설치도 확인 |
| 2 | 국내외 계측·장비 매뉴얼 확인 (KDS/KCS 표 포함) |
| 3 | 센서가 측정하는 **물리량** 정의 |
| 4 | **설치 위치** 정의 |
| 5 | **측정 방향** 정의 |
| 6 | 힘·변위 **전달 경로** 정의 |
| 7 | **단면 구성** 정의 |
| 8 | [INSTRUMENTATION_DRAWING_RULES.md](./INSTRUMENTATION_DRAWING_RULES.md) **금지사항** 확인 |
| 8a | 흙막이·가시설 단면: [14-AI 생성 가이드라인 §2](./14-흙막이-굴착-계측-개념도-AI-생성-가이드라인.md) **조건/제약사항** 블록 확인 |
| 8b | **모든 AI 생성:** [36-AI 엔지니어링 프롬프트 가이드](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) §1 Global Negative + §2 Cursor 템플릿 |
| 9 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md)에 프롬프트 작성 |
| 10 | AI·디자이너에게 생성 지시 |
| 11 | [IMAGE_AUDIT_CHECKLIST.md](./IMAGE_AUDIT_CHECKLIST.md)로 **기술 검수** |
| 12 | 등급·기록을 `scripts/image-review-registry.json` + IMAGE_REVIEW_LOG에 반영 |
| 13 | `generate-image-assets.mjs` → `audit:images` |

### 생성 전 자문 질문

- 이 센서는 **무엇을** 측정하는가?
- 지중·구조물 표면·**두부** 중 어디에 설치되는가?
- 인장·압축·수압·토압·변위 중 무엇인가?
- 힘·변위 **방향**이 그림에 있는가?
- 굴착측·배면·벽체·지층 배치가 물리적으로 맞는가?
- 실제 사진과 **위치**가 일치하는가?
- 비슷한 다른 계측기와 **혼동**되지 않는가?

---

## 3. 저장소 폴더 구조

```text
assets/images/technology/
  source/          # AI 생성 원본·작업 중 (운영 미사용)
  reviewed/        # 기술 검수 통과본 (권장 배포 경로)
  rejected/        # 사용 금지 보관
  IMG-###.webp     # WebP (운영)
  IMG-###_*.png    # 레거시 배포 경로 (reviewed/ 미복사 시)
```

**마이그레이션:** 신규·재생성 이미지는 `reviewed/`에 저장 후 레지스트리 `status: reviewed`로 등록한다. 레거시 `technology/*.png`는 점진 이전한다.

---

## 4. 메타데이터 필수 필드

`scripts/image-review-registry.json` → `js/technology/images.js` (`generate-image-assets.mjs`)

| 필드 | 설명 |
|------|------|
| `id` | IMG-### |
| `title` | 한글 제목 |
| `png` / `webp` | 배포 경로 |
| `alt` | 접근성·검색 (설치 위치·측정량 포함) |
| `caption` | figcaption (원리 한 줄) |
| `status` | `pending` \| `source` \| `reviewed` \| `rejected` |
| `reviewGrade` | PASS \| MINOR_FIX \| MAJOR_FIX \| REGENERATE \| DELETE |
| `reviewDoc` | `docs/IMAGE_REVIEW_LOG.md#IMG-###` |
| `prohibitedErrors` | 해당 이미지 금지 오류 목록 (검수 시 대조) |
| `figureTier` | `FT-A` \| `FT-B` \| `FT-C` — [31-통합수정계획](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) |
| `productionMethod` | `cad` \| `ai-reviewed` \| `pillow` \| `unknown` |
| `productionMethodTarget` | 목표 제작 방식 |
| `visualReview` | 출판 게이트 — `grade`·`reviewer`·`date` |

---

## 5. 운영 반영 금지 조건

다음에 해당하면 **홈페이지에 노출하지 않는다** (`resolveImage` 차단).

- `reviewGrade` 없음
- `status !== reviewed`
- IMAGE_REVIEW_LOG에 검수 기록 없음
- `caption`·`alt` 누락 또는 일반적·부정확
- 실제 설치 위치·방향 오류 (등급 REGENERATE·DELETE)
- 사용자·검수자가 지적한 오류 미반영

---

## 6. 우선 검수 대상

| 우선 | ID | 비고 |
|------|-----|------|
| **P1~P3** | IMG-001~088 | ✅ 88/88 PASS · `verify:local` |
| **선택 QA** | 현장 도면 픽셀 대조 | 수동 — [book-plan-review-2026-06.md](./book-plan-review-2026-06.md) |

상세 프롬프트: [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md)

---

## 7. 역할별 필독

| 역할 | 문서 |
|------|------|
| 이미지 생성 AI·디자이너 | 본 문서 → [36-AI 프롬프트 가이드](./36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) → [24-가이드라인](./24-토목-계측-개념도-및-구성도-작성-가이드라인.md) → INSTRUMENTATION_DRAWING_RULES → IMAGE_REGENERATION_PROMPTS |
| 검수자 | IMAGE_AUDIT_CHECKLIST → IMAGE_REVIEW_LOG 기록 |
| 개발자·Cursor | 본 문서 → [08-기술자료-이미지-심층리서치-구현계획.md](./08-기술자료-이미지-심층리서치-구현계획.md) → `audit:images` → AGENTS.md |

---

## 8. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | **§0.0g SOE-SURR-01** — IMG-096 가시설 주변지반 · [57](./57-IMG-096-가시설-주변지반-계측-표현-표준.md) · [110](./110-IMG-096-옹벽삭제-가시설-주변지반-재작업-계획.md) |
| 2026-06-26 | **BORE-GL-01** — IPI·지하수위 **GL 천공·개구부 가시** · [111](./111-지중경사계-지하수위계-지표면-천공-가시-표준.md) |
| 2026-06-26 | §0.5 Figure Tier·이중 게이트 · [31-통합수정계획](./31-NMTI-기술자료-Figure-출판품질-및-제작방식-통합-수정계획.md) |
| 2026-06-25 | 최초 강제 표준·레지스트리·audit:images·resolveImage 차단 도입 |
