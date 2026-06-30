<!-- image-knowledge-links:v1 -->
> **image-knowledge:** [00-공통](../../../docs/image-knowledge/00-공통-이미지-작성-원칙.md) · [MPBX·지중변위-표현](../../../docs/image-knowledge/25-MPBX·지중변위-표현.md)
<!-- /image-knowledge-links:v1 -->

<!-- watermark-sync:v1 -->
> **WATERMARK-01 (생성 금지):** NMTI 로고·워터마크·브랜드 마크·유사 로고·흰색 로고 박스를 **GenerateImage·AI·CAD 생성 단계에 넣지 않는다.** 출판용 워터마크는 `watermark-figures.bat` · `npm run watermark:figures` (`scripts/apply-figure-watermark.py`)로 **등록·배포 전 일괄 후처리**만 한다. 정본: [docs/183](../../../docs/183-이미지-생성-워터마크-금지-정본.md)
<!-- /watermark-sync:v1 -->


<!-- image-rules-sync:v1 -->
## 실행 규칙

> **book/image-knowledge:** `docs/image-knowledge/25-MPBX·지중변위-표현.md` · §5·§6

**반드시 그릴 요소:**
- **GL** · **well cap** · **천공축**.
- **≥2~3 anchor node** · **rod 연결** · **head block**.
- **축방향 변위** 화살표(Teal) · **base = 안정층** 각주.
- 라벨: `다점지중변위계`, `앵커`, `로드`, `헤드`, `지표면`.

**절대 금지:**
- **4홈 inclinometer casing** · **프로브 휠**.
- **지중경사계** 제목·범례.
- **신축이음·교량 이음**.
- **내공변위·천단** (터널).
- **Magnet extensometer = IPI** 동형(층별침하=12 별주제).
<!-- /image-rules-sync:v1 -->

<!-- citation-sync:v1 -->
## 근거 기준

> **노드:** `sensors/borehole-extensometer` · 레지스트리: `book/kds-kcs-citation-registry.json`

- **KDS 11 10 15:2025**「지반계측」 표 4.1-1 — 계측기 분류·용도 (국가건설기준센터(KCSC))
- **KCS 11 10 15:2025**「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 (국가건설기준센터(KCSC))

※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.
<!-- /citation-sync:v1 -->

## 최종 생성 프롬프트 (v4 — ai-reviewed)

**정본:** [docs/146](../../docs/146-IMG-091-MPBX-설치-개념도-표현-표준.md) · [redline v3](../redlines/IMG-091_redline_v3_외부PNG.md) · **등록:** 2026-06-29 agent PASS

```text
[docs/36 §1.0 10줄 블록]
계측 목적: 다점지중변위계(MPBX) 설치 — 보링 내 다점 앵커·로드 축방향 상대변위.

지표면·well cap · 보호관(4홈 IPI 금지) · 앵커 A1~A3+ · 로드 · 헤드(기준).
축방향 변위 화살표(Teal) · Base=안정 지반 · 그라우트(로드 비본딩).
callout: ≠센서형 다단식 지중경사계 · ≠신축이음계.
흰 배경 CAD, 한글, 1920×1080.
```
