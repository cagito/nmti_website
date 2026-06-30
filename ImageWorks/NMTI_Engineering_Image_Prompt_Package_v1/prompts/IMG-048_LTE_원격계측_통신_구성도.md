# IMG-048 — LTE M2M 통신 구성도

<!-- image-knowledge-links:v1 -->
> **image-knowledge:** [00-공통](../../../docs/image-knowledge/00-공통-이미지-작성-원칙.md) · [통신·게이트웨이-역할](../../../docs/image-knowledge/29-통신·게이트웨이-역할.md)
<!-- /image-knowledge-links:v1 -->

<!-- watermark-sync:v1 -->
> **WATERMARK-01 (생성 금지):** NMTI 로고·워터마크·브랜드 마크·유사 로고·흰색 로고 박스를 **GenerateImage·AI·CAD 생성 단계에 넣지 않는다.** 출판용 워터마크는 `watermark-figures.bat` · `npm run watermark:figures` (`scripts/apply-figure-watermark.py`)로 **등록·배포 전 일괄 후처리**만 한다. 정본: [docs/183](../../../docs/183-이미지-생성-워터마크-금지-정본.md)
<!-- /watermark-sync:v1 -->


**node:** `instruments/communication/lte-remote`
**목적:** LTE M2M — 로컬 버퍼·재전송·APN·ACK (Phase AD)

## 최종 생성 프롬프트

```text
NMTI 홈페이지 기술자료용 2D 기술 개념도. 주제는 "LTE M2M 통신 구성도"이다.
그림의 목적은 "LTE M2M — 로컬 버퍼·재전송·APN·ACK (Phase AD)"을 설명하는 것이다.
정투영 단면도 또는 단순 입면도 스타일로 구성하고, 구조물·지반·계측기·케이블·화살표를 실제 설치 관계에 맞게 배치한다.
모든 라벨은 한국어로 수평 배치하고, 라벨과 리더선이 구조물이나 계측기와 겹치지 않게 한다.
색상은 딥네이비, 쿨그레이, 청록색 중심으로 제한한다.
중요: NMTI 로고, 유사 로고, 워터마크, 흰색 로고 박스, 임의 빨간 점을 그리지 않는다. 우측 하단은 공식 로고 후처리 합성을 위한 여백으로 둔다.
```

<!-- citation-sync:v1 -->
## 근거 기준

> **노드:** `instruments/communication/lte-remote` · 레지스트리: `book/kds-kcs-citation-registry.json`

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

