# Phase AA — REGENERATE 4종 AI 복붙 프롬프트 정본

**상위:** [81-Phase AA](./81-외부-ZIP-신규-심각오류-10종-Phase-AA-수정계획.md) · [85 실행 체크리스트](./85-Phase-AA-재작도-실행-체크리스트.md)  
**redline:** `ImageWorks/.../redlines/IMG-###_redline_v2_외부PNG.md`  
**정책:** Pillow·SVG **금지** · 인간 검수 AI/CAD → PNG ≥1920×1080

---

## §0 공통 — INTERP-01 (4종 맨 앞에 붙여넣기)

```text
[INTERP-01 — 해석 Figure 필수]
이 그림은 토목 계측 기술도면이다. 해석·추정·상관은 「추정」「검토」「가능」「상관」으로만 표기한다.
확정·단정·인과 표현 금지. 지중경사계 하나로 활동면 전체를 확정하지 않는다.
Figure 라벨 = 「센서형 다단식 지중경사계」 전칭. 진동현식·VW 금지.
데이터로거 = 함체(인클로저). IPI 케이싱·관측공 = 지표면(GL)에서 연속.
틀리면 전면 폐기한다.
```

---

## §1 IMG-016 — 원호활동면 계측 해석도

**nodeId:** `fields/slope/slip-surface` · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-016_redline_v2_외부PNG.md)

```text
[§0 INTERP-01 블록]

원호활동면 계측 해석도를 전면 재작성한다.

현재 그림의 오류: IPI 누적변위 프로파일에서 최대변위 심도를 곧바로 원호활동면으로 단정함.

필수:
1. 라벨 「추정 원호활동면」 또는 「잠재 활동면」 — 「원호활동면」단독 확정 금지
2. 「최대 변위 깊이 = 활동면」 표현 삭제
3. 좌: 토사 사면 단면 + GL + 센서형 다단식 지중경사계(케이싱·다점 센서·안정층 근입)
4. 프로파일 그래프: 「전단변형 집중 구간」 vs 「활동면 추정 구간」 점선으로 구분
5. 우: 원호파괴 = 안정해석 검토 모식도(점선·「검토」) — 계측 확정 단면 아님
6. 하단 callout: 지질 경계·지하수위·균열·침하·현장관찰 병행 검토
7. 요약: 「단일 IPI만으로 활동면 확정 금지」

금지: 최대변위=활동면 · IPI 단독 확정 · 추정선=실측선 동일 의미 · 뇌·인포그래픽

2D CAD, white, Korean labels, 1920x1080.
```

---

## §2 IMG-017 — 평면활동면 계측 해석도

**nodeId:** `fields/slope` · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-017_redline_v2_외부PNG.md)

```text
[§0 INTERP-01 블록]

평면활동면 계측 해석도를 전면 재작성한다.

오류: 무한사면 안정식과 IPI 프로파일을 직접 연결해 활동면이 확정된 것처럼 표현.

필수:
1. 「추정 평면활동면」·「불연속면 기반 잠재활동면」
2. 무한사면식 패널 = 「안정성 검토식」 — ≠ 계측 산정식
3. IPI 3소: 후방부(안정) · 활동면 교차부(추정) · 안정영역 — 목적 라벨 분리
4. 암반 단면: 절리·층리·단층 표시 + 「병행 검토」 callout
5. 간극수압 U — 지하수 조건·배수와 연결 (단순 ↑화살표만 금지)
6. 변위-시간 그래프: 「현장별 관리기준 적용」 — 일반 수치 단정 금지

금지: 해석식=활동면 확정 · 변위 최대지점=평면활동면 · IPI 단독

2D CAD, white, Korean, 1920x1080.
```

---

## §3 IMG-021 — 측방유동 계측도

**nodeId:** `fields/soft-ground/lateral-flow` · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-021_redline_v2_외부PNG.md)

```text
[§0 INTERP-01 블록 — 측방유동은 INTERP보다 역할 분리 우선]

측방유동 계측도를 전면 재작성한다.

오류: 성토 중앙·어깨·TOE IPI 동일 역할, 연약층 균일 좌우 밀림.

필수:
1. 성토 단면: 연약층 + 하부 견고 지지층 — IPI 근입 깊이 명시
2. IPI 3소 목적: 중앙=연직·침하 검토(측방 주역 아님) · 어깨=측방유동 검토 · TOE=측방·안정 검토
3. 측방변위 화살표 = 어깨·TOE 집중 — 대칭 균일 밀림 금지
4. 침하계(또는 지표침하 측점) = 연직 — ≠ 측방 측정
5. 우측: 깊이별 측방변위 프로파일 + 변위속도·성토단계·간극수압 병행 검토 callout
6. GL 연속 IPI 케이싱 · 데이터로거 함체

금지: 연약층 전체 좌우 밀림 · 침하계로 측방 · 근입 생략 · 굴착 흙막이 혼동

2D geotechnical CAD, white, Korean, 1920x1080.
```

---

## §4 IMG-039 — 신축계 설치 개념도

**nodeId:** `sensors/joint-meter` · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-039_redline_v2_외부PNG.md)

```text
[docs/36 §1.0 — CLS-01]
이 그림의 계측 목적은 단 하나: 두 고정점 사이 상대변위 ΔL.

신축계 설치 개념도를 전면 재작성한다.

오류: 신축계·LVDT·균열계·신축이음계 혼합.

필수:
1. 제목 「구조물 신축계 설치 개념도」
2. 좌: 고정측 브라켓 — 신축계 본체 — 이동측 브라켓, 측정축 ΔL 방향 화살표
3. 적용 예시 3패널 분리: 조인트 · 균열(별도 균열계) · 이음부
4. 우 하: 교량 신축이음부 = 「신축이음계 사례」별도 — ≠ 신축계 동일 센서
5. 그래프 「상대변위-시간」 ΔL=L1-L0 · 온도=보조 요인 주석
6. 데이터로거 = 소형 함체, 보조 배치

금지: 신축계=신축이음계 · LVDT·균열계 동일 범례 · 수평·수직 동시 전방위 측정 장비

White technical CAD, Korean, 1920x1080.
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | REGENERATE 4종 §0~§4 복붙 정본 — INTERP-01 · redline v2 연동 |
