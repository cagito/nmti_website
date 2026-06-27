# Phase AA — MAJOR_FIX 6종 AI 복붙 프롬프트 정본

**상위:** [81](./81-외부-ZIP-신규-심각오류-10종-Phase-AA-수정계획.md) · [85](./85-Phase-AA-재작도-실행-체크리스트.md)  
**MAJOR_FIX:** 부분 재작성 허용 · **전면 재작성 권장** when in doubt

---

## §1 IMG-018 — 강우-지하수위-변위 상관도

**nodeId:** `fields/slope` · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-018_redline_v2_외부PNG.md)

```text
강우-지하수위-변위 상관 분석 개념도로 수정한다.

제목에 「상관 분석」 포함. 강우→수위→변위 = 가설(점선), 인과 확정 금지.
3축 그래프: 강우량 · 지하수위 · IPI 변위 — 시간지연 「현장별」 표기.
선행강우·누적강우 검토 항목. 대체 원인 callout: 절리·배수불량·공사영향.
사면 단면에 지하수위계·IPI 해석 가능 배치.

금지: 단일 인과 화살표 · 고정 지연시간 · 즉시 변위만

1920x1080, Korean CAD.
```

---

## §2 IMG-020 — 압밀 침하 계측 개념도

**nodeId:** `fields/soft-ground` · SETTLE-01 · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-020_redline_v2_외부PNG.md)

```text
압밀 침하 계측 개념도 수정. SETTLE-01 준수.

침하판 = 성토 하부/원지반 + 연장봉 → 지표 측정.
BM(기준점) = 성토 영향권 밖 안정지반 — 침하판 상단 ≠ BM.
침하량 = BM 대비 침하판 표고 변화.
간극수압계 = 연약층 내 지정 심도 · 압밀 보조 해석(≠ 침하 직접 측정).
그래프: 성토단계 · u 상승·소산 · 침하 — 즉시침하·1차압밀 구분 주석.

금지: BM 영향권 내 · 간극수압=침하계

1920x1080, Korean.
```

---

## §3 IMG-025 — IPI 시스템 구성도

**nodeId:** `sensors/inclinometer` · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-025_redline_v2_외부PNG.md)

```text
센서형 다단식 지중경사계 시스템 구성도 수정.

좌: 케이싱·다점 센서 노드·케이블·데이터로거 함체(≠ 센서).
우 그래프 제목: 「기준 심도 대비 누적 상대변위」 — 절대좌표 변위 금지.
각 노드 = 구간 경사·상대각. 하부 기준 불확실 시 절대변위 표현 금지.
센서 간격 = 예시·현장 설계 가변. 온도·오프셋·방향 보정 주석.

금지: 수동 프로브 hero · 누적=절대 · 로거=센서

1920x1080, Korean. Label: 센서형 다단식 지중경사계.
```

---

## §4 IMG-027 — IPI 설치 단면도

**nodeId:** `sensors/inclinometer` · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-027_redline_v2_외부PNG.md)  
**금지:** Pillow `inclinometer_ground_draw.py` 재렌더

```text
센서형 다단식 지중경사계 설치 단면도 — 그라우트·Base 개념 수정.

보링공 | 외주 그라우트 | 케이싱 | 내부 센서열 분리 표시.
그라우트 = 케이싱 외주·보링공 사이 — 내부 센서 구간 막힘 금지.
Base = 기준 심도 확보(≠ 물리 절대고정). 안정층 근입 = 현장 설계.
케이싱이 지반 변형 따라 휨 개념. GL well cap · 케이블 보호관.

금지: 내부 전체 그라우트 · Base=절대고정 · 3~5m 일반 기준 문구

1920x1080, Korean CAD.
```

---

## §5 IMG-037 — 균열계 설치 개념도

**nodeId:** `sensors/crack-meter` · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-037_redline_v2_외부PNG.md)

```text
균열계 설치 개념도 수정.

측정 = 균열폭 변화(주). 주석: 전단·단차·회전 = 별도 계측 필요.
≠ 변위계 · ≠ 신축계(039). 앵커·베이스 플레이트 현실적.
데이터로거 = 함체.

금지: 균열계로 3D 거동 전체 · 균열폭=균열 길이 동일 표기

1920x1080, Korean.
```

---

## §6 IMG-038 — 구조물 경사계 설치도

**nodeId:** `sensors/tilt-meter` · **redline:** [v2](../ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/redlines/IMG-038_redline_v2_외부PNG.md)

```text
구조물 경사계(표면형) 설치도 수정. ≠ 센서형 다단식 지중경사계.

강체 브라켓·평활 설치면. 볼트 유격·브라켓 변형 = 측정오차 주석.
X/Y = 구조물 기준축 정렬. 초기·재 영점.
「설치 위치의 국부 경사」 — 구조물 전체 기울기 단정 금지.

금지: 유연 긴 브라켓 · 1점=전체 경사 · 지중 IPI 혼동

1920x1080, Korean.
```

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-26 | MAJOR_FIX 6종 §1~§6 복붙 정본 |

