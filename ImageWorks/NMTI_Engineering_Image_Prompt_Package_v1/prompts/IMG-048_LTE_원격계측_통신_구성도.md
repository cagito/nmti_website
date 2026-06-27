# IMG-048 — LTE M2M 통신 구성도

> **정본:** [docs/97 §2](../../../docs/97-Phase-AD-복붙-프롬프트-정본.md) · [redline v2](../redlines/IMG-048_redline_v2_외부PNG.md) · [96 AD §2](../../../docs/96-외부-ZIP-신규-심각오류-10종-Phase-AD-수정계획.md)  
> **AI:** [docs/36 §4.8](../../../docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md) · **LTE-BUF-01** · **OPS-VERIFY-01**  
> **nodeId:** `instruments/communication/lte-remote`

## 메타

| 항목 | 값 |
|------|-----|
| ID | IMG-048 |
| 제목 | LTE M2M 통신 구성도 |
| 판정 | MAJOR_FIX — ZIP-AUD-42 |

---

## 최종 생성 프롬프트 (v3 — Phase AD)

**복붙:** [docs/97 §2](../../../docs/97-Phase-AD-복붙-프롬프트-정본.md)

```text
[LTE-BUF-01]

LTE M2M remote monitoring block diagram — Korean engineering labels, white background, 1920x1080.

Field: sensors → data logger (local storage) → LTE modem — roles separated.

On comm loss: buffer at logger, retransmit arrow when link restored.

Cloud path: LTE network, APN/VPN, firewall, server API with ACK/receive confirmation.

Web and mobile = clients querying server — NOT direct logger control.

Monitor: RSSI, latency, missing packets. Modem does NOT perform alarm judgment.

No brain, no cyber cloud hero art, no home WiFi router icon.
```

<!-- citation-sync:v1 -->
## 근거 기준

> **노드:** `instruments/communication/lte-remote` · 레지스트리: `book/kds-kcs-citation-registry.json`

- **KCS 11 10 15:2025**「시공 중 지반계측」 §3.1.2 — 계측시스템·원격 전송 (국가건설기준센터(KCSC))
- **KCS 11 10 15:2025**「시공 중 지반계측」 §3.2.4 — 알람경보 전송 (국가건설기준센터(KCSC))

※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.
<!-- /citation-sync:v1 -->
