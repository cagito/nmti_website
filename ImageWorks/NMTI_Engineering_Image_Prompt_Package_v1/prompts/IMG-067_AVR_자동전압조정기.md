# IMG-067 - AVR 자동전압조정기

> **AI (docs/36):** [§4.8③](../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · Prefix §2.1


## 목적
불안정 AC 입력 → AVR → 220V±3% 출력 → 계측 함체.

## 노드
`instruments/power/avr`

## 필수 요소
- 입력(발전기·약전압)·AVR 본체·출력
- 선택: 절연변압기·UPS 3단 콜아웃

## 최종 생성 프롬프트 (v2 — docs/36 §4.8③)

**Prefix:** docs/36 §2.1 · **nodeId:** `instruments/power/avr` · **실패:** docs/36 §5

Automatic voltage regulator (AVR) schematic in monitoring power chain. Input voltage fluctuation → AVR block → stabilized output to data logger. Simple electrical diagram, white background.

## 최종 생성 프롬프트 (v2 — docs/36 §4.8③)

**Prefix:** docs/36 §2.1 · **nodeId:** `instruments/power/avr` · **실패:** docs/36 §5

Automatic voltage regulator (AVR) schematic in monitoring power chain. Input voltage fluctuation → AVR block → stabilized output to data logger. Simple electrical diagram, white background.

<!-- citation-sync:v1 -->
## 근거 기준

> **노드:** `instruments/power/overview` · 레지스트리: `book/kds-kcs-citation-registry.json`

- **KCS 11 10 15:2025**「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 (국가건설기준센터(KCSC))
- **KCS 11 10 15:2025**「시공 중 지반계측」 — 현장 전원·설계 시방 *[D]* (국가건설기준센터(KCSC))

※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.
<!-- /citation-sync:v1 -->
