# IMG-008 터널 전단면 내공변위 — 디자인 원칙·redline·생성 프롬프트

**대상:** `assets/images/technology/IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.webp`  
**연계 계획:** [125-IMG-008-터널-내공변위-출판부적합-재검수-구현계획](./125-IMG-008-터널-내공변위-출판부적합-재검수-구현계획.md)  
**목적:** 터널 **전단면 내공변위계**를 기술자료 및 홈페이지 hero 품질로 제작하기 위한 디자인·공학 기준 정본  
**판정:** 신규 검수 전까지 기존 이미지는 `출판 PASS`로 보지 않는다.

---

## 1. 디자인 작성 원칙

### 1.1 전체 톤

| 항목 | 원칙 |
|---|---|
| 스타일 | Engineering technical drawing / clean schematic figure |
| 배경 | 흰색 또는 매우 밝은 회색 |
| 색상 | Deep Navy, Teal, Cool Gray 중심 |
| 금지 | 네온, 사이버펑크, 풍경, 사람, 캐릭터, 홍보형 3D |
| 레이아웃 | 좌측 본도 + 우측 설명 패널 |
| 정보 위계 | 제목 > 단면도 > 측점/측선 > 보조 설명 |
| 해상도 | WebP 운영본 기준 고해상도 |

### 1.2 색상 역할

| 역할 | 지시 |
|---|---|
| 터널 라이닝 | Deep Navy 또는 짙은 Cool Gray |
| 대표 측점·측선 | Teal |
| 보조선·주석 | Cool Gray |
| 배경 | 흰색 또는 밝은 회색 |
| 금지 | 빨강 경보색 중심 구성, 네온 효과 |

### 1.3 레이아웃

- 16:9 단일 Figure.
- 좌측 70%: 터널 단면 본도.
- 우측 30%: 전단면 내공변위계 설명 패널.
- 하단: `개념도 / 전단면 대표 측선 예시 / 현장 조건에 따라 상이` 문구.
- 축약 파일명은 사용하지 않는다.

---

## 2. 공학 redline

### 2.1 Figure 핵심 정의

본 Figure는 **전단면 내공변위계**이다.

즉, 상부 아치만의 계측도가 아니고, 터널 단면 전체의 내공 변화 설명도이며, 대표 측점과 대표 측선을 통해 수렴·확대·비대칭 변형을 보여주는 개념도여야 한다.

### 2.2 반드시 포함할 요소

| 요소 | redline 지시 |
|---|---|
| 터널 단면 | 말굽형 또는 일반 NATM형 단면 |
| 라이닝 | 단면 외곽 구조선 명확 |
| 대표 측점 | **P1~P11 내공변위계** — 좌·우 측벽·스프링라인·궁부 |
| 대표 측선 | 수평, 수직, 대각 또는 이에 준하는 전단면 대표 측선 |
| 변위 개념 | 내공 수렴/확대 방향 화살표 |
| 우측 패널 | 측점 개념, 대표 측선, 측정 목적 설명 |

### 2.3 절대 금지

| 금지 | 사유 |
|---|---|
| 상부 아치만 연결된 개방 체인만 표현 | 전단면 의미 상실 |
| 천단침하계처럼 수직선만 강조 | 계측 목적 혼동 |
| 서버/통신/대시보드/UI 혼입 | Figure 목적 불일치 |
| 진동현식, VW, 특정 제품명 | 방식·상품 인터페이스 오인 |
| 뇌·AI 회로·광고 일러스트 | 기술도면 원칙 위반 |
| `IMG-008.webp` 축약명 | SEO 파일명 정책 위반 |

---

## 3. 생성 프롬프트

### 3.1 System / Context

```text
You are creating a civil engineering instrumentation figure.
This is not a marketing illustration.
This figure explains a tunnel full-section convergence measurement system.
One figure, one purpose: tunnel full-section convergence monitoring.
Use a clean engineering drawing style with white background, deep navy structural lines, teal measurement lines, and cool gray annotations.
No biological brain, no AI network, no people, no landscape, no cyberpunk, no dashboard UI.
```

### 3.2 Main prompt

```text
Create a 16:9 engineering technical drawing for a Korean civil monitoring website.

Subject:
터널 전단면 내공변위 측정시스템.

Main idea:
This figure must explain full-section tunnel convergence measurement, not upper-arch-only monitoring.

Layout:
- Left 70%: tunnel cross-section with clear lining.
- Place **eleven (11) measurement points P1 through P11** as convergence meters on the tunnel lining (left wall, springlines, crown, right wall).
- Show representative measurement lines across the section, including horizontal, vertical, and diagonal or equivalent representative lines.
- The figure should clearly communicate that the tunnel section as a whole is monitored for convergence and deformation.
- Show simple arrows indicating inward displacement / convergence concept.
- Right 30%: a clean explanation panel with short Korean labels describing representative points, representative measurement lines, and interpretation of full-section convergence.

Korean labels:
- 터널 라이닝
- 전단면 내공변위
- 대표 측점 P1~P11
- 대표 측선
- 수평 측선
- 수직 측선
- 대각 측선
- 수렴 변위

Design:
- White or very light gray background.
- Deep navy for tunnel structure.
- Teal for measurement points and measurement lines.
- Cool gray for secondary notes.
- Clear leader lines.
- Publication-quality technical figure for homepage hero use.
```

### 3.3 Negative prompt

```text
Do not draw upper-arch-only chain.
Do not make it look like crown settlement monitoring.
Do not show only P1 to P5 on the upper arch.
Do not use fewer than 11 labeled convergence measurement points when depicting the v10 standard layout.
Do not draw server, data logger, mobile app, dashboard, or communication flow.
Do not use vibrating wire, VW, product names, brand logos, or real site names.
Do not use neon, cyberpunk, fantasy machine parts, biological brain, AI abstract network, workers, faces, or unreadable Korean text.
```

---

## 4. 출판 검수 체크리스트

| ID | 질문 | 불합격 |
|---|---|---:|
| IMG008-F1 | 그림이 전단면 내공변위계로 읽히는가? | REGENERATE |
| IMG008-F2 | 상부 아치 단독 계측도로 보이지 않는가? | REGENERATE |
| IMG008-F3 | 대표 측점이 단면 전체를 설명하는가? | REGENERATE |
| IMG008-F4 | 대표 측선이 수평·수직·대각 또는 동등한 전단면 개념을 보여주는가? | REGENERATE |
| IMG008-F5 | 천단침하계 또는 상부 체인 계측으로 오인되지 않는가? | REGENERATE |
| IMG008-F6 | 서버/통신/UI 등 무관 요소가 배제되었는가? | MAJOR_FIX |
| IMG008-F7 | 100%·200% 확대 시 라벨과 선이 선명한가? | MAJOR_FIX |
| IMG008-F8 | 홈페이지 hero로 사용 가능한 정돈된 디자인인가? | MAJOR_FIX |

---

## 5. 반영 파일명

최종 운영 파일명은 무조건 아래 풀네임 WebP를 사용한다.

```text
assets/images/technology/IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.webp
```

축약 파일명 및 PNG 운영본 사용 금지.

---

## 6. 반영 절차

새 WebP가 확정되면 다음 순서로 반영한다.

```bash
git add assets/images/technology/IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.webp
git commit -m "Replace IMG-008 full-section convergence webp"
git push origin main
npm run build:images
npm run verify:content
```
