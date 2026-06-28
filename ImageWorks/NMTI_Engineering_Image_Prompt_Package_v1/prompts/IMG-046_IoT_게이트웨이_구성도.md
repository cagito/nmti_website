<!-- image-knowledge-links:v1 -->
> **image-knowledge:** [00-공통](../../../docs/image-knowledge/00-공통-이미지-작성-원칙.md) · [통신·게이트웨이-역할](../../../docs/image-knowledge/29-통신·게이트웨이-역할.md)
<!-- /image-knowledge-links:v1 -->

# IMG-046 — IoT 게이트웨이 구성도

> **정본:** [docs/91 §10](../../../docs/91-Phase-AB-복붙-프롬프트-정본.md) · [redline v2](../redlines/IMG-046_redline_v2_외부PNG.md) · [84 AB-2g](../../../docs/84-외부-ZIP-신규-심각오류-10종-Phase-AB-수정계획.md)  
> **AI:** [docs/36 §4.8②](../../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · **GW-ROLE-01**  
> **Pillow·에이전트 SVG 금지** — AI+§91+인간 검수 → PNG ≥1920×1080

## 1. 이미지 목적
현장 센서와 서버 사이 통신 중계

## 2. 사용 위치
- NMTI 홈페이지 신규 페이지: 건설계측 기술자료
- TreeView 항목: 시스템/게이트웨이
- 본문 설명 이미지, 기술자료 삽도, 제안서 재사용 가능 이미지

## 3. 제작 이미지 설명
IoT 게이트웨이 구성도를 기술 매뉴얼에 들어갈 수 있는 정밀한 엔지니어링 삽도로 제작한다.
현장 실사 사진이 아니라, 사실적인 CAD 기반 단면도/개념도/시스템 구성도 스타일로 표현한다.
불필요한 배경 장식 없이 핵심 계측 대상, 센서 위치, 데이터 흐름, 측정 방향이 명확해야 한다.

<!-- citation-sync:v1 -->
## 근거 기준

> **노드:** `instruments/communication/iot-gateway` · 레지스트리: `book/kds-kcs-citation-registry.json`

- **KCS 11 10 15:2025**「시공 중 지반계측」 §3.1.2 — 계측시스템·원격 전송 (국가건설기준센터(KCSC))
- **KCS 11 10 15:2025**「시공 중 지반계측」 §3.2.4 — 알람경보 전송 (국가건설기준센터(KCSC))

※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.
<!-- /citation-sync:v1 -->

<!-- image-rules-sync:v1 -->
## 실행 규칙

> **book/image-knowledge:** `docs/image-knowledge/29-통신·게이트웨이-역할.md` · §5·§6

**반드시 그릴 요소:**
- **순서 화살표:** 계측 센서 → **데이터로거** → **IoT 게이트웨이** → 서버.
- **로거:** 「수집·저장·1차 변환」 · **함체** 실루엣(P0-3).
- **GW:** 「중계·변환·재전송」 · **버퍼** (로컬 저장과 구분).
- **시간 동기** · **GW ≠ 판정** callout.
- (048) **LTE** · (058) **전원·통신·모드** 계층.

**절대 금지:**
- **뇌·AI 회로** · **사이버펑크 구름**.
- **빈 접속함** = 로거.
- **게이트웨이 = 데이터로거** 라벨.
- **관리기준선** 을 GW 블록 **내부**에.
- **브랜드** CR1000X·Cisco·特定 LTE 모듈.
<!-- /image-rules-sync:v1 -->


## 4. 필수 포함 요소
- 짧고 명확한 한글 라벨: 계측 센서, 데이터로거, 관리기준, 계측 데이터
- 화살표, 치수선, Callout 박스
- 계측 대상 구조물 또는 지반 단면
- 센서 위치를 작은 아이콘 또는 실제 장비 외형에 가까운 단순 도형으로 표시
- 관리기준 또는 경보 관련 이미지인 경우 색상 단계: 정상 Green, 주의 Orange, 경고 Red
- 현장명이 필요한 경우: "00 복선전철 제00공구"만 사용

## 5. 구도 지시
- 16:9 웹 배너형 또는 본문 삽도형
- 좌측에는 구조물/지반/센서 배치
- 우측에는 핵심 원리 또는 데이터 흐름 요약
- 단면도는 평면적인 기술 도면으로 표현
- 그래프가 필요한 경우 축, 기준선, 범례를 포함하되 숫자는 예시값으로 단순화

## 6. 스타일 지시
- 흰색 또는 아주 밝은 회색 배경
- Deep Navy, Cool Gray, Teal 중심
- 선 두께는 일정하게 유지
- 매뉴얼 Figure 스타일
- 과도한 입체감 금지
- 실제 장비 매뉴얼 삽도처럼 신뢰감 있게 제작

## 7. 텍스트 규칙
- 긴 문장 금지
- 라벨은 2~8자 중심
- 예시 문구 사용 가능:
  - "센서"
  - "데이터로거"
  - "관리기준"
  - "경보"
  - "변위"
  - "침하"
  - "수위"
- 실제 위치명, 실제 노선명, 실제 공구명 금지

## 8. Negative Prompt
AI풍, cartoon, cute, mascot, human, worker, face, brain, biological organ, fantasy, cyberpunk, neon, excessive gradient, dramatic 3D render, cluttered background, unreadable Korean text, distorted labels, actual city map, real station name, real project name, random numbers, messy dashboard, advertising banner style

## 최종 생성 프롬프트 (v3)

**Prefix:** docs/36 §1.0 + §2.1 · **복붙:** [docs/91 §10](../../../docs/91-Phase-AB-복붙-프롬프트-정본.md)

```text
[GW-ROLE-01]

Logger = field acquisition, storage, first conversion. Gateway = relay, protocol conversion, security, retransmission.

Distinguish local logger storage vs gateway buffer. Time sync reference explicit.

Gateway ≠ management threshold decision. Block diagram: sensors → logger → gateway → server. No cyber cloud brain.

Korean labels. White background, 1920x1080.
```
