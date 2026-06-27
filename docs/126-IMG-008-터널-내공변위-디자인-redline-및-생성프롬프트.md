# IMG-008 터널 내공변위 — 디자인 원칙·redline·생성 프롬프트

**대상:** `IMG-008` 터널 상부 아치 내공변위 측정시스템  
**연계 계획:** [125-IMG-008-터널-내공변위-출판부적합-재검수-구현계획](./125-IMG-008-터널-내공변위-출판부적합-재검수-구현계획.md)  
**목적:** 기술 오류 수정뿐 아니라 출판·홈페이지 hero 품질까지 통과하는 이미지 제작 지시서 제공  
**판정:** 기존 이미지는 신규 검수 전까지 `출판 PASS`로 보지 않는다.

---

## 1. 디자인 작성 원칙

### 1.1 전체 톤

| 항목 | 원칙 |
|---|---|
| 스타일 | Engineering technical drawing / CAD schematic / clean report figure |
| 배경 | 흰색 또는 매우 밝은 회색 CAD 톤 |
| 색상 | Deep Navy, Teal, Cool Gray 중심. 보조 강조색은 1개 이하 |
| 금지 | 네온, 사이버펑크, 과한 3D, 홍보 배너, 풍경, 사람 얼굴, 캐릭터 |
| 해상도 | 1920×1080 이상, 가능하면 2× 제작 후 WebP 변환 |
| 라벨 | 짧은 한글 2~8자 중심. 장문 설명은 caption 또는 우측 주석 패널로 분리 |
| 선 위계 | 구조선 > 계측선 > 보조선 > 배경선 순으로 명확히 구분 |

### 1.2 색상 역할

| 역할 | 색상 지시 |
|---|---|
| 터널 라이닝·구조선 | Deep Navy 또는 짙은 Cool Gray |
| 내공변위 측점·체인 | Teal 계열 |
| 건축한계 Envelope | Cool Gray 점선 또는 얇은 보조선 |
| 금지·위험 표현 | 빨강 사용 금지. 본 Figure는 경보도가 아니라 계측 설치도임 |
| 배경 지반·노반 | 과도한 질감 금지, 낮은 채도의 회색 |

### 1.3 레이아웃

- 16:9 단일 hero 구도.
- 좌측 65~70%: 터널 단면 본도.
- 우측 25~30%: P1~P5 개방 체인·ΔX/ΔY 로컬 좌표 설명 패널.
- 하단 1줄: `개념도 / 현장별 계측관리계획서 우선 / 건축한계 내부 미계측`.
- 여백은 넓게 두고, 라벨이 터널 단면을 덮지 않게 한다.
- 본도와 우측 패널의 정보 중복을 줄인다.

---

## 2. 공학 redline

### 2.1 필수 구성

| 요소 | redline 지시 |
|---|---|
| 터널 라이닝 | 말굽형 또는 NATM형 단면. 하부 노반 명확히 분리 |
| 건축한계 | 내부를 `통행·궤도(미계측)` 영역으로 표시 |
| 측점 | P1 천단, P2/P4 어깨부, P3/P5 좌우 상부 |
| 체인 | P3 → P2 → P1 → P4 → P5, 개방 체인 |
| 센서 Kit | 라이닝 측 Envelope 외측에만 부착 |
| Extension Tube | 상부 아치 구간에만 표현 |
| Ball Joint | 상부 아치 체인 연결부에만 표현 |
| 우측 패널 | ΔX/ΔY 로컬 좌표, Open chain, 노반 미계측 설명 |

### 2.2 절대 금지

| 금지 | 사유 |
|---|---|
| P6/P7 하부 스프링라인 측점 | 건축한계 침범·통행 공간 오인 |
| invert·노반 하부 Kit | 내공변위 계측 위치 오인 |
| 360도 폐합 체인 | 전둘레 계측으로 오인 |
| 천단침하계 표현 | 계측 항목 혼동 |
| ACE-TCS, 진동현식, VW 라벨 | 특정 방식·상품 인터페이스 오인 |
| 통행·궤도 구간에 센서 밀착 문구 | 설치 불가 역메시지 |
| 뇌·AI·추상 네트워크 | 기술도면 원칙 위반 |

---

## 3. 이미지 생성 프롬프트

### 3.1 System / Context

```text
You are creating a civil engineering instrumentation figure, not a marketing illustration.
The figure explains tunnel convergence monitoring only.
One figure, one monitoring purpose: tunnel upper-arch convergence measurement.
Use a clean engineering technical drawing style, white or light CAD background, deep navy structural lines, teal monitoring chain, cool gray secondary annotations.
No human face, no landscape, no cyberpunk, no neural network, no biological brain, no unreadable Korean, no random numbers, no product logos.
```

### 3.2 Main prompt

```text
Create a 16:9 engineering technical drawing for a Korean civil monitoring website.

Subject: 터널 상부 아치 내공변위 측정시스템.

Layout:
- Left 70%: tunnel cross-section with lining and road/railbed at bottom.
- Show a dashed clearance envelope inside the tunnel labeled "건축한계 — 통행·궤도(미계측)".
- Place convergence measurement points only on the upper arch lining outside the clearance envelope.
- Use five points: P1 at crown, P2 and P4 at upper shoulders, P3 and P5 at left/right upper arch.
- Connect the points as an open chain: P3 → P2 → P1 → P4 → P5.
- Show Extension Tube and Ball Joint only along the upper arch chain.
- Do not place any kit, sensor, chain, or tube in the invert, roadbed, railbed, or clearance envelope.
- Right 30%: small clean explanation panel showing ΔX / ΔY local coordinate arrows and text "Open chain / 노반 미계측 / 전둘레 폐합 아님".

Korean labels must be short and readable:
- 터널 라이닝
- 건축한계
- 통행·궤도(미계측)
- 내공변위 측점
- Extension Tube
- Ball Joint
- Open Chain
- ΔX / ΔY

Design:
- White or very light gray CAD background.
- Deep navy lines for tunnel and structure.
- Teal for monitoring points and chain.
- Cool gray for clearance envelope and secondary labels.
- Use leader lines and clear spacing.
- Keep the figure suitable for a technical report and website hero.
```

### 3.3 Negative prompt

```text
Do not draw full 360-degree closed loop.
Do not draw sensors in the invert, roadbed, railbed, or inside the clearance envelope.
Do not draw P6 or P7 near the lower springline.
Do not label the clearance envelope as sensor installation space.
Do not show crown settlement equipment.
Do not use vibrating wire, VW, ACE-TCS, product names, brand logos, real site names.
Do not use red danger colors, alarm UI, server dashboard, mobile app, or data flow diagram.
Do not use biological brain, neural network, cyberpunk, neon, marketing 3D render, fantasy machine parts, workers, faces, or unreadable Korean text.
```

---

## 4. 출판 검수 체크리스트

| ID | 질문 | 불합격 처리 |
|---|---|---|
| IMG008-V1 | P1~P5가 전부 상부 아치 라이닝에 있는가? | REGENERATE |
| IMG008-V2 | 측점·체인·Tube가 건축한계 내부를 침범하지 않는가? | REGENERATE |
| IMG008-V3 | 건축한계이 `통행·궤도(미계측)`으로 읽히는가? | REGENERATE |
| IMG008-V4 | 노반·invert에 Kit·Tube·체인이 없는가? | REGENERATE |
| IMG008-V5 | 전둘레 폐합·천단침하계·ACE-TCS로 오인되지 않는가? | REGENERATE |
| IMG008-V6 | 100%·200% 확대 시 라벨과 선이 선명한가? | MAJOR_FIX |
| IMG008-V7 | 홈페이지 hero로 보았을 때 여백·시선 흐름·정보 위계가 충분한가? | MAJOR_FIX |
| IMG008-V8 | 색상이 Deep Navy/Teal/Cool Gray 중심이며 빨강·네온을 쓰지 않았는가? | MAJOR_FIX |

---

## 5. 파일 반영 지시

최종 이미지가 확정되면 기존 운영 파일명을 유지한다.

```text
assets/images/technology/IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.png
assets/images/technology/IMG-008.webp
```

반영 절차:

```bash
python scripts/convert-technology-webp.py
npm run build:images
npm run build:content
npm run build:seo
npm run sitemap
npm run verify:content
```

---

## 6. 현재 도구 제한

현재 GitHub 커넥터는 텍스트 파일 생성·수정에는 사용할 수 있으나, PNG/WebP 바이너리 이미지를 직접 교체하는 데는 부적합하다. 따라서 본 문서는 이미지 제작자가 바로 사용할 수 있는 디자인 지시서·redline·프롬프트 정본으로 관리한다.
