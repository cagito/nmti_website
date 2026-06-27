# IMG-048 redline v2 — LTE M2M (외부 PNG)

**대상:** `instruments/communication/lte-remote` · ZIP-AUD-42 · **LTE-BUF-01**  
**정본:** [97 §2](../../../docs/97-Phase-AD-복붙-프롬프트-정본.md)  
**판정:** MAJOR_FIX

| # | 검수 | PASS | FAIL |
|---|------|------|------|
| L1 | 로거 **로컬 저장** · 두절 시 재전송 | ☐ | 직렬만 |
| L2 | APN/VPN · 방화벽 · API · **ACK** | ☐ | 생략 |
| L3 | 웹/모바일 = **클라이언트** (로거 직접 제어 X) | ☐ | 로거 직결 UI |
| L4 | RSSI · 지연 · 누락 패킷 모니터링 | ☐ | 생략 |
| L5 | 모뎀 **경보 판정 X** | ☐ | 모뎀이 판정 |

## 서명

| 검수자 | | 일자 | | 등급 | PASS / REGENERATE |
