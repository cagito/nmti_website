# MPBX·지중변위 표현 이미지 작성 기준

> **연계 노드(참고):** `sensors/borehole-extensometer` · IMG-091 · INSTR §3.29  
> **근거 PDF:** `book/KDS 11 10 15` 표 4.1-1 · §4.1.5.3③ · `book/guide-to-instrumentation.pdf` p.28~31 (Multi-Point Rod Extensometer)  
> **정책:** **CLS-01** · **MPX-01~03** · **BORE-GL-01**

## 1. Figure 목적

- **다점지중변위계(MPBX·보링 연장계)** 가 **천공축 깊이별 상대 변위** 를 측정하는 **설치 형상** 을 단면 Figure로 설명한다.
- 핵심: **다점 anchor·rod·head** · **축방향(연직) 변위** · **GL 천공·well cap** · **≠ 센서형 IPI** · **≠ 신축이음계(039)** · **≠ 터널 내공변위**.
- 설명하지 않을 것: 4홈 casing·프로브 휠 IPI, 이음부 와이어, 활동면 추정선만.

## 2. 기술 대상

- **표현 대상:** **GL 천공** · **well cap** · **protective pipe** · **깊이별 anchor(기계·그라우트)** · **rod(섬유·강)** · **reference head** · **LVDT/기계식 변위계**(head) · **안정 지반 base anchor**.
- **측정 대상:** **심도별 상대 침하·융기·축방향 변위** — **프로파일**.
- **표현하지 말 것:** **지중경사계 casing 4홈** · **누적 경사각 노드(IPI)** · **신축이음** · **막장 선행변위계**(터널 전용).

## 3. 설치 또는 표현 가능 구간

- **표 4.1-1:** **지중변위계** — 융기·침하·이동 · **변위 발생 심도~안정 지반** 깊게.
- **터널(§4.1.5.3③):** 굴착면 주변 **반경방향** 지중변위 — **MPBX hero와 구분**(터널=별 Figure·목적).
- **guide p.30~31:** Rod extensometer — **anchors + rods + reference head** · base = **stable ground** · grout backfill **≠ rod bond**(protective pipe).
- **BORE-GL-01:** **GL 연속 천공** · **개구부·cap 지표면 가시**.
- **IMG-091:** **≥3 anchor** · **rod별 head 변위계** · **IPI 실루엣 금지**.

## 4. 설치 제한 구간 / 미표현 구간

- **「지중경사계」** 라벨 · **IPI** casing.
- **신축이음계·039** 와이어 on deck.
- **수평변위만**(활동면 IPI 목적).
- **max depth = 활동면** 단정(사면 IPI 규칙 혼용).
- **천공 cap 없음** · **지표면 아래만** 천공(BORE 위반).

## 5. 반드시 그릴 요소

- **GL** · **well cap** · **천공축**.
- **≥2~3 anchor node** · **rod 연결** · **head block**.
- **축방향 변위** 화살표(Teal) · **base = 안정층** 각주.
- 라벨: `다점지중변위계`, `앵커`, `로드`, `헤드`, `지표면`.

## 6. 절대 그리면 안 되는 요소

- **4홈 inclinometer casing** · **프로브 휠**.
- **지중경사계** 제목·범례.
- **신축이음·교량 이음**.
- **내공변위·천단** (터널).
- **Magnet extensometer = IPI** 동형(층별침하=12 별주제).

## 7. 적합한 Figure 유형

- **FT-A** 단면 · IMG-091 hero.
- **사면·연약** inset — **MPBX only** callout.

## 8. 추천 이미지 구성

- **제목:** `다점지중변위계 설치` · **MPBX**.
- **중앙:** 천공+anchors+head.
- **측:** IPI·039 **≠** 비교 callout.

## 9. 라벨 용어

| 라벨 | 용도 |
|------|------|
| 다점지중변위계 | MPBX · borehole extensometer |
| 지중변위계 | KDS 표 4.1-1 (MPBX ⊂) |
| 앵커 | depth anchor |
| 헤드 | reference head |

## 10. 오해하기 쉬운 표현

- **MPBX ≠ IPI** (경사 프로파일 vs 축변위).
- **MPBX ≠ 039 신축계** · **≠ 091를 IPI로**.
- **지중변위계(터널)** ≠ **MPBX(보링 연장)** — node 확인.
- **층별침하 magnet**(12) ≠ **MPBX rod** — 목적·형상 다름.
- **불확실 / 현장 조건 의존:** anchor 수·깊이.

## 11. Cursor Agent 도면 지시

- **One Figure = MPBX 1목적** · [02](./02-지중경사계-관측공-설치.md) **대비** 필수.
- BORE-GL-01 · WebP · Pillow FT-A **금지**(재작도).

## 12. 참고 PDF 근거

| PDF 파일 | 페이지 | 참고 내용 | 신뢰도 | 비고 |
|----------|-------:|-----------|--------|------|
| `book/KDS 11 10 15 …pdf` | 14~15 | 표 4.1-1 지중변위계 | 높음 | |
| `book/KDS 11 10 15 …pdf` | 22 | §4.1.5.3③ 터널 지중변위(구분) | 중간 | hero 분리 |
| `book/guide-to-instrumentation.pdf` | 28~31 | Multi-Point Rod Extensometer | medium | anchor·rod |

## 13. 이미지 생성 전 체크리스트

- [ ] **IPI casing·프로브** 없음?
- [ ] **≥2 anchor**·**rod·head**?
- [ ] **GL·well cap** 가시?
- [ ] **039·신축** 없음?
- [ ] WebP only?
