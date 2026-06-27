# IMG-066 - 상시 전원 AC 인입

> **AI (docs/36):** [§4.8③](../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · Prefix §2.1


## 목적
220V/380V 배전반·Surge·AC-DC·12V DC 계측 함체 단선도.

## 노드
`instruments/power/ac-mains`

## 필수 요소
- 배전반·차단기·Surge·AC-DC 전원·접지
- CR1000X 유형 데이터로거
- 관리동·터널 AC 적용 콜아웃

## 최종 생성 프롬프트 (v2 — docs/36 §4.8③)

**Prefix:** docs/36 §2.1 · **nodeId:** `instruments/power/ac-mains` · **실패:** docs/36 §5

AC mains power supply schematic for field monitoring station. Utility input → breaker → surge protector → UPS/AVR → logger and communication load. Electrical one-line diagram, white background.

## 최종 생성 프롬프트 (v2 — docs/36 §4.8③)

**Prefix:** docs/36 §2.1 · **nodeId:** `instruments/power/ac-mains` · **실패:** docs/36 §5

AC mains power supply schematic for field monitoring station. Utility input → breaker → surge protector → UPS/AVR → logger and communication load. Electrical one-line diagram, white background.

<!-- citation-sync:v1 -->
## 근거 기준

> **노드:** `instruments/power/overview` · 레지스트리: `book/kds-kcs-citation-registry.json`

- **KCS 11 10 15:2025**「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 (국가건설기준센터(KCSC))
- **KCS 11 10 15:2025**「시공 중 지반계측」 — 현장 전원·설계 시방 *[D]* (국가건설기준센터(KCSC))

※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.
<!-- /citation-sync:v1 -->
