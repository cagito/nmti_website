# IMG-103 교량 상부구조 GNSS 처짐 — v3 표현 표준

> **⛔ DEPRECATED (2026-06-29):** 본 문서는 **폐기**되었습니다. **IMG-103 유일 정본**은 [148-IMG-103-교량-상부구조-GNSS-처짐-표현-표준](./148-IMG-103-교량-상부구조-GNSS-처짐-표현-표준.md) · [151 정본 충돌 정리](./151-IMG-103-GNSS-처짐계-정본-충돌-정리.md)를 따릅니다.  
> **금지 복원:** 1/4·3/4 경간 GNSS · 교각 위 GNSS · 하부 와이어식 처짐계 hero.

**등록:** 2026-06-29  
**등급:** ~~P0 정본~~ → **deprecated**  
**노드:** `fields/bridge/deflection` · **imageId** IMG-103  
**연계:** [INSTRUMENTATION §3.23.4](./INSTRUMENTATION_DRAWING_RULES.md) · [68 BRI-DEF](./68-교량-처짐-계측-표현-표준.md) · [image-knowledge/IMG-103](./image-knowledge/IMG-103-교량-GNSS-처짐.md)

> **한 줄:** 와이어식 처짐계 hero가 **아님**. **경간 상부 GNSS 이동국**의 **수직 위치 변화 ΔZ** → **처짐량 δ** 장기 모니터링 개념도.

**이전:** BRI-DEF v2 · 와이어식 처짐계 hero → **v3 GNSS REGENERATE** · [121 재작업](./121-IMG-103-v3-재작업-계획.md)

---

## 0. 최상위 강제 지시문 (P0)

```text
1. 중앙 하부 와이어식 처짐계는 그리지 않는다.
2. 하부 기준대, 수직 와이어, 바닥 고정 장치는 그리지 않는다.
3. 교각 측면 또는 교각 중간에 GNSS 안테나를 설치하지 않는다.
4. 처짐 측정용 GNSS 안테나는 반드시 경간 상부(상판·거더 상부)에 설치한다.
5. 처짐량 δ는 GNSS 안테나의 수직 위치 변화 ΔZ로 표현한다.
6. GNSS 기준국은 교량 영향권 밖 안정 기준점에 배치한다.
7. 교량 상부구조 처짐 hero에 와이어식 변위계 구조를 섞지 않는다.
8. 생성 시 로고·워터마크·제품 사진형 로거·모바일 UI 금지.
```

---

## 1. 전체 목적

핵심 메시지:

```text
교량 외부 안정 GNSS 기준국
→ 경간 상부 GNSS 이동국
→ GNSS 수직 위치 변화 ΔZ
→ 처짐량 δ 산정
→ 장기 모니터링
```

**IMG-104** = 와이어·LVDT **센서 상세** (보조·별도 Figure).

---

## 2. 디자인

2D 기술도면 · 흰 배경 · Deep Navy · Cool Gray 교량 · Teal 계측 · 사진·3D·카탈로그 **금지**

---

## 3. 메인 교량 단면 (좌·중 70%)

**필수:** 교면·거더·중앙 경간·교각·받침·교대/단부  
**라벨:** 중앙 경간(Mid-Span) · 거더 · 받침장치(베어링) · 교각 · 경간 상부 GNSS 이동국

**금지:** 하부 기준대 · 거더 하부 와이어 · 하부 와이어식 변위계 · 교각 측면/중간 GNSS · 교각 부착 로거

---

## 4. GNSS 이동국 (deprecated — 정본은 docs/148)

- **필수:** 경간 중앙 상부 **1개만** ([148](./148-IMG-103-교량-상부구조-GNSS-처짐-표현-표준.md) SPAN-MID-01)  
- **금지:** 1/4·3/4 경간 · 교각 위·측면 · 복수 이동국  
- 상판/거더 상부 **브래킷** · 위성 시야 확보

**라벨:** GNSS 이동국 · 경간 상부 처짐 측정점 · 수직 위치 변화 ΔZ · 처짐량 δ

---

## 5. GNSS 기준국

- 교량 **영향권 밖** 안정 지반 · 좌측 외부 또는 **인셋**
- `GNSS 기준국(교량 영향권 밖 안정점)` · 이동국과 **점선 보정/기준** 연결

**금지:** 교각 위·교각 측면 기준국 · 상부구조를 완전 고정 기준으로 표현

---

## 6. 처짐량 δ

- 이동국 안테나 옆 **t0 기준** · **↓ ΔZ / δ**
- `처짐량 δ = 기준 시점 대비 수직변위 ΔZ`

**금지:** 거더 하부 와이어 δ · 바닥 기준대 · 와이어+GNSS **동시 주계측**

---

## 7. 우측 그래프

`GNSS 수직변위 ΔZ - 시간 변화` · X:시간 · Y:ΔZ/δ(mm)  
주석: 기준 시점 대비 · 온도·차량·풍하동 포함 · **예시 그래프·일반 관리기준 아님**

---

## 8. 하단 데이터 흐름

`GNSS 기준국 → GNSS 이동국 → 보정/통신 → ΔZ 산정 → 처짐량 δ 모니터링`  
간단 아이콘만 · **제품 사진·서버 UI 과다 금지**

---

## 9. 하단 참고

```text
GNSS 처짐계는 경간 상부 이동국의 수직 위치 변화 ΔZ로 처짐량 δ를 산정한다.
기준국은 교량 영향권 밖 안정점 설치를 원칙으로 한다.
와이어식 처짐계는 단기 점검 또는 보조 계측으로만 별도 적용한다.
```

---

## 10. 최종 생성 프롬프트 (EN)

> ImageWorks `prompts/IMG-103_…md` · docs/36 §1.0 선행

```text
Create a clean 2D Korean technical engineering diagram titled “교량 상부구조 GNSS 처짐 계측도”.

This diagram must show GNSS-based bridge deflection monitoring. It must not show a wire displacement gauge as the main method. Do not draw any vertical wire, lower reference frame, floor-mounted displacement gauge, or hanging wire sensor under the bridge.

Use a white background, deep navy linework, cool gray bridge structure, and teal monitoring elements. No logo, no watermark, no product photo, no mobile app UI, no server UI.

Main bridge section:
Show a bridge deck, girder, mid-span, piers, bearings, and abutment/end supports. The bridge structure should be realistic and simple.

GNSS measurement concept:
Place exactly ONE GNSS rover antenna at the mid-span upper deck only. Do NOT add quarter-span or three-quarter-span rovers (see docs/148).
Label them:
“GNSS 이동국”
“경간 상부 처짐 측정점”

Do not place GNSS antennas on the pier side, pier middle, or under the bridge. GNSS antennas must be on the upper span where satellite visibility is available.

Reference station:
Place one GNSS reference station outside the bridge influence zone, on stable ground or in a separate small inset. Label:
“GNSS 기준국(교량 영향권 밖 안정점)”
Use a dashed correction/reference signal line between the reference station and rover antennas.

Deflection representation:
At the mid-span GNSS rover antenna, show a vertical downward arrow labeled:
“수직 위치 변화 ΔZ”
“처짐량 δ”
Add a small reference mark showing baseline position t0 and monitored position t1. The deflection must be shown as vertical movement of the GNSS antenna position, not as movement of a wire gauge under the girder.

Right panel:
Show a small time-series graph titled:
“GNSS 수직변위 ΔZ - 시간 변화”
X-axis: 시간
Y-axis: 수직변위 ΔZ / 처짐량 δ(mm)
Add note:
“기준 시점 대비 수직 위치 변화”
“온도·차량하중·풍하동 영향 포함”
“예시 그래프이며 일반 관리기준 아님”

Bottom simple system flow:
“GNSS 기준국 → GNSS 이동국 → 보정/통신 → ΔZ 산정 → 처짐량 δ 모니터링”

Strictly avoid:
wire displacement gauge as the main method, vertical wire under the bridge, lower floor-mounted reference device, hanging sensor under the girder, GNSS antenna on the pier side or pier middle, data logger boxes attached to piers, too many product devices, mobile app screen, server UI, logo or watermark, fake NMTI logo.

The final figure must clearly communicate:
Bridge deflection is measured from GNSS rover antennas installed on the upper span, using vertical coordinate change ΔZ relative to an external stable GNSS reference station.
1920×1080.
```

---

## 11. PASS 기준 (10항)

1. GNSS 이동국이 **경간 상부**에 있는가?  
2. **중앙 경간** 처짐 측정점이 명확한가?  
3. 교각 측면/중간 안테나 **제거**되었는가?  
4. 하부 와이어식·수직 와이어·바닥 기준대 **제거**되었는가?  
5. δ가 **GNSS ΔZ**로 표현되었는가?  
6. 기준국이 **영향권 밖**인가?  
7. 그래프가 **GNSS ΔZ 시간 변화**인가?  
8. 제품 사진·로거 과다 **없음**?  
9. 로고·워터마크 **없음**?  
10. 와이어식과 GNSS **혼합 주계측 없음**?

---

*갱신: 2026-06-29*
