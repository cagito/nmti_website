# 계측이론 정합성 Phase G — 실행 계획



**수립:** 2026-06-29  

**선행:** [155 Phase F Handoff](./155-계측이론-정합성-Phase-F-완료-Handoff.md)



---



## 1. 목표



Phase F 산출물 **운영 반영** · image-knowledge **중복·동기화 재발 방지** · Figure 재검수 대기열 정리.



## 2. 이번 배치



| # | 작업 | 상태 |

|---|------|------|

| G1 | `01-터널` §5·§6 kds 중복 제거 | ✅ |

| G2 | `sync-prompt-image-rules` bullet dedupe | ✅ |

| G3 | prompt 재동기화 (IMG-007·008·063 등) | ✅ |

| G4 | `17-건축` §5 중복 정리 | ✅ |

| G5 | FTP·운영 동기화 확인 | ✅ (`verify:production` 28/28) |

| G6 | **docs/146** MPBX 정본 · **docs/166** IMG-024 v4 기록 | ✅ |

| G7 | IMG-024 prompt·152 침윤선 정합 · redline **v3** | ✅ |

| G8 | IMG-091 redline **v3** · 146 연계 | ✅ |

| G9 | `15-댐` §5·§6 중복·152 반영 | ✅ |

| G10 | IMG-032 v6 재생성 (SETTLE-01) | ✅ |

| G11 | 미사용 WebP purge (192건) · `purge:orphan-webp` | ✅ |

| H1 | **docs/136** IMG-033 · [157 Handoff](./157-계측이론-정합성-Phase-H-Handoff.md) | ✅ |



**Phase G 종료** (2026-06-29)



## 3. Figure 재검수 (문서·redline 완료)



| IMG | 문서·redline | 픽셀 재검수 |

|-----|--------------|-------------|

| IMG-024 | 152·166·redline v3 | registry PASS — 필요 시 인간 서명 |

| IMG-091 | 146·redline v3 | registry PASS — 필요 시 인간 서명 |



## 4. 검증



```bash

npm run sync:prompt-image-rules

npm run sync:redline-image-knowledge

npm run validate:doc-links:strict

npm run verify:local

npm run verify:production

```



## 5. 재발 방지



- `patch:image-knowledge-from-kds` — §5·§6 append 시 `normalize()` dedupe

- `sync:prompt-image-rules` — `uniqueBullets`

- IMG-024 프롬프트 — **침윤선≠tip 연결** 문구 금지 ([152](./152-IMG-024-댐-피에조-침윤선-정합성-수정계획.md))

