# 기술자료 이미지 검수 로그

**표준:** [TECHNICAL_IMAGE_STANDARD.md](./TECHNICAL_IMAGE_STANDARD.md) · **체크리스트:** [IMAGE_AUDIT_CHECKLIST.md](./IMAGE_AUDIT_CHECKLIST.md)

> `node scripts/generate-image-review-log.mjs`로 레지스트리와 동기화. 수동 검수 내용은 본문 섹션에 직접 보강.

## 요약

| ID | 등급 | status | 검수일 | P | cite (KDS/KCS) | requiresReaudit |
|----|------|--------|--------|---|----------------|-----------------|
| IMG-001 | PASS | reviewed | 2026-06-22 | P1 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-002 | PASS | reviewed | 2026-06-22 | P0 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-003 | PASS | reviewed | 2026-06-26 | — | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-004 | PASS | reviewed | 2026-06-22 | P0 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-005 | PASS | reviewed | 2026-06-22 | P1 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-006 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-007 | PASS | reviewed | 2026-06-26 | P0 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-008 | PASS | reviewed | 2026-06-27 | P0 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-009 | PASS | reviewed | 2026-06-29 | P1 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-010 | PASS | reviewed | 2026-06-26 | — | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-011 | PASS | reviewed | 2026-06-29 | — | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 | — |
| IMG-012 | PASS | reviewed | 2026-06-26 | — | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 | — |
| IMG-013 | PASS | reviewed | 2026-06-26 | — | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 | — |
| IMG-014 | PASS | reviewed | 2026-06-26 | — | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 | — |
| IMG-015 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 | — |
| IMG-016 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 | — |
| IMG-017 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 | — |
| IMG-018 | PASS | reviewed | 2026-06-27 | P1 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 | — |
| IMG-019 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.4 · KCS 11 10 15:2025 §3 | — |
| IMG-020 | PASS | reviewed | 2026-06-29 | P1 | KDS 11 10 15:2025 §4.1.4 · KCS 11 10 15:2025 §3 | — |
| IMG-021 | PASS | reviewed | 2026-06-26 | P0 | KDS 11 10 15:2025 §4.1.4 · KCS 11 10 15:2025 §3 | — |
| IMG-022 | PASS | reviewed | 2026-06-26 | — | KDS 11 10 15:2025 §4.1.6 · KCS 11 10 15:2025 §3 | — |
| IMG-023 | PASS | reviewed | 2026-06-26 | P0 | KDS 11 10 15:2025 §4.1.7 · KCS 11 10 15:2025 §3 | — |
| IMG-024 | PASS | reviewed | 2026-06-29 | P0 | KCS 54 20 25:2018 §3 · KDS 11 10 15:2025 §4.1 | — |
| IMG-025 | PASS | reviewed | 2026-06-22 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-026 | PASS | reviewed | 2026-06-26 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-027 | PASS | reviewed | 2026-06-22 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-028 | PASS | reviewed | 2026-06-26 | P0 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-029 | PASS | reviewed | 2026-06-27 | P0 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-030 | PASS | reviewed | 2026-06-22 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-031 | PASS | reviewed | 2026-06-22 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-032 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-033 | PASS | reviewed | 2026-06-26 | P0 | KCS 54 20 25:2018 §3.2 | — |
| IMG-034 | PASS | reviewed | 2026-06-22 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-035 | PASS | reviewed | 2026-06-22 | P0 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-036 | PASS | reviewed | 2026-06-26 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-037 | PASS | reviewed | 2026-06-30 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-038 | PASS | reviewed | 2026-06-26 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-039 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-040 | PASS | reviewed | 2026-06-29 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-041 | PASS | reviewed | 2026-06-29 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-042 | PASS | reviewed | 2026-06-26 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-043 | PASS | reviewed | 2026-06-29 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-044 | PASS | reviewed | 2026-06-27 | P1 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-045 | PASS | reviewed | 2026-06-29 | P0 | KCS 11 10 15:2025 §3.2.1 · KCS 11 10 15:2025 §3.2.3 | — |
| IMG-046 | PASS | reviewed | 2026-06-27 | P1 | KCS 11 10 15:2025 §3.1.2 · KCS 11 10 15:2025 §3.2.4 | — |
| IMG-047 | PASS | reviewed | 2026-06-27 | P1 | KCS 11 10 15:2025 §3.1.2 | — |
| IMG-048 | PASS | reviewed | 2026-06-29 | P1 | KCS 11 10 15:2025 §3.1.2 · KCS 11 10 15:2025 §3.2.4 | — |
| IMG-049 | PASS | reviewed | 2026-06-27 | P1 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-050 | PASS | reviewed | 2026-06-27 | P0 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-051 | PASS | reviewed | 2026-06-27 | P1 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-052 | PASS | reviewed | 2026-06-27 | P0 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-053 | PASS | reviewed | 2026-06-27 | P1 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-054 | PASS | reviewed | 2026-06-27 | P0 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-055 | PASS | reviewed | 2026-06-27 | P1 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-056 | PASS | reviewed | 2026-06-27 | P0 | — | — |
| IMG-057 | PASS | reviewed | 2026-06-27 | — | — | — |
| IMG-058 | PASS | reviewed | 2026-06-29 | P0 | KCS 11 10 15:2025 §3.1.2 | — |
| IMG-059 | PASS | reviewed | 2026-06-27 | P0 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-060 | PASS | reviewed | 2026-06-27 | P1 | — | — |
| IMG-061 | PASS | reviewed | 2026-06-29 | — | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-062 | PASS | reviewed | 2026-06-22 | P2 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-063 | PASS | reviewed | 2026-06-29 | — | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-064 | PASS | reviewed | 2026-06-29 | P2 | KDS 11 10 15:2025 §4.1.8 · KCS 11 10 15:2025 §3 | — |
| IMG-065 | PASS | reviewed | 2026-06-26 | — | KCS 11 10 15:2025 §3.1.2 | — |
| IMG-066 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3.1.2 | — |
| IMG-067 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3.1.2 | — |
| IMG-068 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3.1.2 | — |
| IMG-069 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3.1.2 | — |
| IMG-070 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-071 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-072 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-073 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-074 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-075 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-076 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3.2.1 · KCS 11 10 15:2025 §3.2.3 | — |
| IMG-077 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3.2.1 · KCS 11 10 15:2025 §3.2.3 | — |
| IMG-078 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-079 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-080 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-081 | PASS | reviewed | 2026-06-30 | P0 | KCS 11 10 15:2025 §3.9 · KDS 11 10 15:2025 §4.1 | — |
| IMG-082 | PASS | reviewed | 2026-06-26 | — | KCS 11 10 15:2025 §3.9 · KDS 11 10 15:2025 §4.1 | — |
| IMG-083 | PASS | reviewed | 2026-06-26 | — | KCS 54 20 25:2018 §3.2 | — |
| IMG-084 | PASS | reviewed | 2026-06-26 | — | KDS 11 10 15:2025 §4.1.8 · KCS 11 10 15:2025 §3 | — |
| IMG-085 | DELETE | rejected | 2026-06-26 | — | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 | — |
| IMG-086 | PASS | reviewed | 2026-06-26 | — | KCS 24 99 05:2023 §3.2 | — |
| IMG-087 | PASS | reviewed | 2026-06-26 | — | KCS 24 99 05:2023 §3.2 | — |
| IMG-088 | PASS | reviewed | 2026-06-26 | — | KCS 24 99 05:2023 §3.2 | — |
| IMG-089 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 | — |
| IMG-090 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 | — |
| IMG-091 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 | — |
| IMG-092 | PASS | reviewed | 2026-06-27 | P0 | KDS 11 10 15:2025 §4.1.9 | — |
| IMG-093 | PASS | reviewed | 2026-06-27 | — | KDS 11 10 15:2025 §4.1.5 | — |
| IMG-096 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 | — |
| IMG-097 | PASS | reviewed | 2026-06-30 | P1 | KDS 11 10 15:2025 §4.1.5 | — |
| IMG-098 | PASS | reviewed | 2026-06-29 | P0 | KDS 11 10 15:2025 §4.1.8 · KCS 11 10 15:2025 §3 | — |
| IMG-099 | PASS | reviewed | 2026-06-30 | — | KCS 11 10 15:2025 §3.9.1.1 | — |
| IMG-100 | PASS | reviewed | 2026-06-30 | — | KCS 11 10 15:2025 §3.9 · KDS 11 10 15:2025 §4.1 | — |
| IMG-101 | PASS | reviewed | 2026-06-30 | — | KCS 11 10 15:2025 §3.9 · KDS 11 10 15:2025 §4.1 | — |
| IMG-094 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-095 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-102 | PASS | reviewed | 2026-06-27 | — | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 | — |
| IMG-103 | PASS | reviewed | 2026-06-29 | — | KCS 24 99 05:2023 §3.2 · KDS 11 10 15:2025 §4.2.1.6 | — |
| IMG-104 | PASS | reviewed | 2026-06-27 | — | KDS 11 10 15:2025 §4.2.1.6 | — |
| IMG-105 | PASS | reviewed | 2026-06-29 | — | KCS 24 99 05:2023 §3.2 · KDS 11 10 15:2025 §4.2.1.9 | — |
| IMG-106 | PASS | reviewed | 2026-06-29 | — | KDS 11 10 15:2025 §4.2.1.9 | — |
| IMG-107 | PASS | reviewed | 2026-06-29 | — | KCS 24 99 05:2023 §3.2 | — |
| IMG-108 | PASS | reviewed | 2026-06-29 | — | — | — |
| IMG-109 | PASS | reviewed | 2026-06-29 | — | KCS 24 99 05:2023 §3.2 | — |
| IMG-110 | PASS | reviewed | 2026-06-29 | — | KCS 24 99 05:2023 §3.2 | — |
| IMG-111 | PASS | reviewed | 2026-06-27 | — | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 | — |
| IMG-112 | PASS | reviewed | 2026-06-27 | — | KDS 11 10 15:2025 §4.1.7 · KCS 11 10 15:2025 §3 | — |
| IMG-113 | PASS | reviewed | 2026-06-27 | — | KCS 54 20 25:2018 §3 · KDS 11 10 15:2025 §4.1 | — |

---

## 검수 기록

<a id="IMG-001"></a>

### IMG-001 가시설 계측 전체 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-001_가시설-계측-전체-개념도_굴착단면계측항목.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/가시설 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | Phase 6 Q0: C0 지표면·1F·출입구 · C1~C4 INSTRUMENTATION §3.1 · render-p1 v8. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 6 formal — Pillow v8·doc 19 Q0 |
| 검수일 | 2026-06-22 |
| 금지 대조 | EXC-05·§3.1.1 — 좌→우 단면·프리즘 측점·구조물경사계 표면 부착 |

**금지 오류 대조:**

- 건물 기초 아래 굴착 공동·배면 빈 공간
- 버팀보·굴착저가 배면·건물 아래
- 옥상 자동광파기 본체·「자동광파기 측정(프리즘)」 라벨
- 구조물경사계 지반 속·말뚝 형태

<a id="IMG-002"></a>

### IMG-002 흙막이 계측 설치 대표 단면도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-002_흙막이-계측-설치-대표-단면도.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/가시설 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | PNG canonical v7 · 11종·②③ 이형·앵커 두부·토압 방향. legacySvgSource 수정 금지 (doc 16). |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 6 formal — v7 PNG·doc 19 Q1~Q7 |
| 검수일 | 2026-06-22 |
| 금지 대조 | EXC-01~05·§3.1.1 — doc 19 Q1~Q7 육안 0건 |

**금지 오류 대조:**

- 건물 기초 아래 굴착 공동·배면 빈 공간
- 버팀보·굴착저가 배면·건물 아래
- 옥상 자동광파기 본체·「자동광파기 측정(프리즘)」 라벨
- 구조물경사계 지반 속·말뚝 형태
- 인접건물을 지하에 묻힌 것처럼 표현
- 지하수위계를 벽체 부착 센서로 표현
- 간극수압계를 지하수위 관측공으로 표현
- 하중계를 지반 내부에 배치
- 토압계 감지면·작용 방향 누락
- 굴착측·배면 지반 혼동
- 어스앵커 강연선·T가 굴착측(공중)으로 향함
- 앵커 하중계 반력판–헤드–텐던 조립 미표현
- 어스앵커 하중계 수평(3~9시) 배치 (ANC-CLOCK)
- G.W.L이 굴착저 위인데 차수·배수 없이 굴착 건조
- 지중경사계 Base — 활동면/영향 심도 하부 안정층 미도달·임의 m 일반화
- 버팀보 하중계를 보 정중앙에 배치
- SOE 혼합형·지보체계 정체성 불명
- 지중경사계·지하수위·간극수압 CIP/벽체 내부 매설 (SOE-INST-01)
- 침하핀·측점에 「지표침하계」 라벨 (SETTLE-01)
- 자동 지표침하계 침하판 주변 콘크리트 패드·해칭 (SETTLE-PLATE-01)
- 앵커 LC ≠ 굴착측 두부
- IPI·지하수위·간극수압 배면 천공 위반
- ⑦ 지표침하 측점에 지표침하계 라벨
- 진동현식 라벨

<a id="IMG-003"></a>

### IMG-003 버팀보 하중계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-003_버팀보-하중계-설치-개념도_띠장접합부축압축.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/가시설 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | — |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |

<a id="IMG-004"></a>

### IMG-004 어스앵커 하중계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-004_어스앵커-하중계-설치-개념도_앵커두부정착구.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/가시설 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v3: 굴착측 두부 조립(지지링·반력판–LC–헤드)·T/P 분리·정착장 내부 금지. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 6 formal — Pillow v3·doc 26 EXC-01 |
| 검수일 | 2026-06-22 |
| 금지 대조 | EXC-01·§3.2 — anchor_head_draw 5-panel |

**금지 오류 대조:**

- 하중계를 지반 내부에 배치
- 정착장·그라우트체 내부에 하중계
- 자유장 중간에 하중계 삽입
- 반력판 없이 벽체 직접 부착
- 인장력 T와 압축 반력 P를 단일 화살표로 혼동
- P=T 단일 표기 (ANC-AXIS)
- 수평 버팀보형 앵커 두부 (ANC-AXIS)
- 어스앵커 하중계 수평(3~9시) 배치 (ANC-CLOCK)
- 앵커 강연선이 굴착측(공중)으로 향함
- 설치도 하단 서버·모바일 데이터 흐름도 (P0-4)
- 하중계 지반·정착장 내부
- 자유장 중간 하중계
- 앵커 시계 3시/9시 오류

<a id="IMG-005"></a>

### IMG-005 주변건물 균열·경사 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-005_주변건물-균열-경사-계측도_굴착주변건물배치.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/가시설 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4c SETTLE-01 — 배면 침하핀 제거 · §14·§3.18 · doc 41 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 6 formal — v3·doc 15 BLD Q0 |
| 검수일 | 2026-06-22 |
| 금지 대조 | BLD-01~04·§3.18 — 구조물경사계 외벽·프리즘 분리·C0 지표면 |

**금지 오류 대조:**

- 건물↔벽체 이격 L 구간 허공·배면 토사 없음
- 건물 기초가 굴착저 높이 — 원 지표면 위 안착 아님
- 지층이 굴착저에서만 시작 — 건물 아래 단절
- 배면 거동→건물 변위 인과 불성립
- 「경사계」 단독 라벨 — 지중경사계 혼동
- 구조물경사계를 지주·포스트에 설치 (외벽 표면 부착 아님)
- 「자동광파기 측정(프리즘)」 복합 라벨
- §3.1 배면·굴착 공간 역전 (건물 부양)
- 배면 지표침하핀·T자 측점 (SETTLE-01)

<a id="IMG-006"></a>

### IMG-006 굴착 단계별 계측 흐름도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-006_굴착-단계별-계측-흐름도_1단계최종굴착계측.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/가시설 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 v4 ai-reviewed — 4단계 굴착저면·어스앵커 LC만·ANC-CLOCK·운영루프 · prohibitedErrors 유지 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 버팀보·지반앵커·지보재 하중계
- 수평(3·9시)·5시 앵커 관통
- 지중·굴착공중 하중계
- IMG-002와 동일 대표 단면도 역할 중복
- 누적변위 그래프·로거 제품 사진 hero
- 생성 시 로고·워터마크

<a id="IMG-007"></a>

### IMG-007 터널 계측 전체 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-007_터널-계측-전체-개념도_NATM단면주요계측항목.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v3 ai-reviewed TUN-MEAS-01 · 측점·측선·항목 분리 · docs/134 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 천단침하와 내공변위 동일 측선
- 지중변위계를 록볼트처럼 표현
- 단일 센서가 터널 전체 거동 대표
- 숏크리트·강지보 응력계 동일 센서 표현

<a id="IMG-008"></a>

### IMG-008 터널 전단면 내공변위 측정시스템

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-008_터널-전단면-내공변위-측정시스템_상부아치내공변위.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel/convergence`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v10 ai-reviewed — 내공변위계 11점(P1~P11), 전단면 대표 측점·측선, 노반 Open. docs/126·redline v10. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent v10 |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase Z ZIP-AUD fix — Pillow v+1 |

**금지 오류 대조:**

- 천단침하계처럼 상하 측정
- ACE-TCS를 2점 거리만으로 표현
- Extension Tube 체인 누락
- 센서가 터널 중앙에 부유
- 라이닝 연속 센서 튜브형 내공변위
- Kit가 전체 변형 프로파일 자동 산정
- P1~P5만으로 전단면 대표 표현

<a id="IMG-009"></a>

### IMG-009 록볼트 축력·숏크리트 응력 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-009_록볼트-축력-숏크리트-응력-계측도_지보재거동센서.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 Pillow/WebP PASS — IMG-009는 지보재 계측 위치 보조도, 록볼트 축력(IMG-078)·숏크리트 응력(IMG-079) 전용 Figure와 분리 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Codex CAD redraw |
| 검수일 | 2026-06-29 |
| 금지 대조 | v4 Pillow/WebP — 숏크리트 계기 공중 부유 제거, 록볼트 축력·숏크리트 응력 역할 분리 |

**금지 오류 대조:**

- 숏크리트·변형률계 공중 부유 아이콘

<a id="IMG-010"></a>

### IMG-010 터널 지표침하 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-010_터널-지표침하-계측도_침하계자동광파기배치.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | — |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |

<a id="IMG-011"></a>

### IMG-011 교량 계측 전체 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-011_교량-계측-전체-개념도_상부구조교각교대기초.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed — Pillow R1. 사장교 10종 callout · ⑩-A/B 분리 · 로거·원격 흐름 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | v4 ai-reviewed — BRI-OV 10종·사장교 단일 (agent) |

**금지 오류 대조:**

- 흙막이·굴착 단면 (BRI-01)
- 종·횡변위 3축 주계측
- 일반 거더교·사장교 혼재
- ⑩ 침하·광파 단일 아이콘 혼동
- 우측 패널 내부 감사 코드 노출
- 생성 시 로고·워터마크

<a id="IMG-012"></a>

### IMG-012 교각 변위·경사 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-012_교각-변위-경사-계측도_상하부경사계변위계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v2 BRI-PIER PASS — 경사·상대·절대·기초침하 분리 (docs/46) |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | BRI-PIER-01~11 redline v2 — 측면 단독 변위계·흐름도 0건 |

**금지 오류 대조:**

- 교각 측면 단독 수평 변위계 (BRI-PIER-01)
- 변위계에 기준·상대측정 대상 없음 (BRI-PIER-02)
- 절대변위 ATS·프리즘 미표현 (BRI-PIER-04~05)
- 기준점이 기초·말뚹캡 바로 옆 (BRI-PIER-06)
- 상·하부 경사계 Δθ 회전 개념 누락 (BRI-PIER-07)
- 기초 지표침하계·부등침하 미표현 (BRI-PIER-08)
- 우측 데이터 흐름도 (BRI-PIER-09)
- 관리기준 그래프 일반 수치 mm·° (BRI-PIER-10)

<a id="IMG-013"></a>

### IMG-013 교량 기초 침하 계측 배치도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-013_교량-기초-침하-계측도_침하계수위계변위계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v2 BRI-FND PASS — 침하 측점·지표침하계·ATS 분리 (docs/48) |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | BRI-FND-01~11 redline v2 — 침하계·흐름도·측면 변위계 0건 |

**금지 오류 대조:**

- 기초 모서리 「침하계」 T자·작은 장치 (BRI-FND-01)
- 침하 측점·지표침하계 미구분 (BRI-FND-02~03)
- 수위계 주계측 과대 (BRI-FND-04)
- 교각 측면 단독 변위계 (BRI-FND-05)
- 기준점이 기초 근처 (BRI-FND-06)
- 평면도 침하계 아이콘 (BRI-FND-07)
- 침하 그래프 보편 mm 임계 (BRI-FND-08)
- 우측 데이터 흐름도 (BRI-FND-09)

<a id="IMG-014"></a>

### IMG-014 교량 신축이음부 신축량 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-014_교량-신축이음부-신축량-계측도_신축이음계핑거형.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 와이어식 신축이음계·핑거형 이음·양측 브라켓·늘음/줄음, BRI-EJ-01~13. 정본 docs/52. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | BRI-EJ-01~12 redline v2 — 3축·흐름도·부유센서 0건 |

**금지 오류 대조:**

- X/Y/Z 3축 변위 표현 (BRI-EJ-01)
- 종·횡·개폐량 병렬 주계측 (BRI-EJ-01)
- 임의 관리기준 mm 표 (BRI-EJ-08)
- 대형 데이터 흐름도 (BRI-EJ-09)
- 핑거형 신축이음 미표현 (BRI-EJ-05)
- 부유 센서·지그 미표현 (BRI-EJ-04)

<a id="IMG-015"></a>

### IMG-015 사면 계측 전체 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-015_사면-계측-전체-개념도_활동면지중경사계지하수위계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/slope`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/사면 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed DISP-ATS-01·BORE-GL-01·활동면추정·SLOPE-01 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | Phase Z ZIP-AUD fix — Pillow v+1 |

**금지 오류 대조:**

- 사면 꼭대기·활동 구간에 자동광파기 본체
- 지중경사계 Base가 활동면만 간신히 통과
- 간극수압계가 G.W.L 위·수평 누운 형태
- 수평변위 화살표 좌우 지그재그
- 사면에 광파기·부동점에 측점 역전
- 확정 원호 활동면
- 활동면 아래 3~5m 일반값

<a id="IMG-016"></a>

### IMG-016 원호활동면 계측 해석도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-016_원호활동면-계측-해석도_원호파괴지중경사계프로파일.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/slope`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/사면 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 v5 ai-reviewed — INTERP-01 추정 원호활동면·최대변위≠활동면·IPI 단독확정 금지 · prohibitedErrors 유지 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | v4 Pillow/WebP — INTERP-01, SLOPE-01, IPI-EMBED, G.W.L≠piezo, 최대변위=활동면 금지 대조 PASS |

**금지 오류 대조:**

- 최대 변위 깊이 = 활동면 위치
- 지중경사계 단독으로 원호활동면 확정
- 추정선과 실측선 동일 의미

<a id="IMG-017"></a>

### IMG-017 평면활동면 계측 해석도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-017_평면활동면-계측-해석도_암반사면평면파괴.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/slope`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/사면 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 Pillow/WebP PASS — 추정 평면활동면, 안정성 검토식, IPI 프로파일, G.W.L·간극수압 병행 검토 분리 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Codex CAD redraw |
| 검수일 | 2026-06-29 |
| 금지 대조 | v4 Pillow/WebP — 해석식=활동면 확정, 변위 최대=평면활동면 단정, IPI 단독 확정 표현 제거 |

**금지 오류 대조:**

- 무한사면 안정식으로 활동면 확정
- 변위 최대지점 = 평면활동면 단정
- 간극수압 U 단순 상향 화살표만

<a id="IMG-018"></a>

### IMG-018 강우-지하수위-변위 상관도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-018_강우-지하수위-변위-상관도_강우후수위상승변위증가.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/slope`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/사면 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint5 v3 — INTERP-01 상관분석·지체·인과 단정 금지 · docs/87 §1 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 상관=인과 확정
- 고정 지연시간

<a id="IMG-019"></a>

### IMG-019 연약지반 성토부 계측기 설치 배치도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-019_연약지반-계측-전체-개념도_성토침하간극수압측방유동.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/soft-ground`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.4 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/연약지반 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v3 PASS — docs/109 SOFT-LAYOUT-01 · Pillow render_img019 · 설치 배치 단면도 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | v3 SOFT-LAYOUT-01 redline v3 · docs/109 |

**금지 오류 대조:**

- 간극수압계를 침하계처럼 표현
- 측방유동 단순 수평화살표만
- 성토고 H 고정 관리기준
- 성토→압밀→침하 흐름 누락
- 흐름도·인포그래픽 주형·센서 아이콘 나열
- 데이터 로거·서버·모바일 UI
- 지표침하핀·판에 지표침하계 라벨
- 간극수압계를 지하수위계처럼 긴 관측공
- 지중경사계 과얕·지중경사계 단독 라벨
- 토압계 감지면 누락

<a id="IMG-020"></a>

### IMG-020 압밀 침하 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-020_압밀-침하-계측-개념도_시간침하간극수압소산.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/soft-ground`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.4 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/연약지반 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed SETTLE-01 SOFT-CONS-01 · BM 영향권 밖 · S-t+u-t · docs/133 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 기준점을 성토 영향권 안에 배치
- 침하판 상단을 기준점으로 표기
- 간극수압계가 침하량 직접 측정

<a id="IMG-021"></a>

### IMG-021 측방유동 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-021_측방유동-계측도_연약층측방변위경사계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/soft-ground`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.4 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/연약지반 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed REGENERATE SOFT-LAT-01 · IPI 어깨·TOE · δh 비대칭 · docs/132 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 연약층 전체 균일 좌우 밀림
- 침하계로 측방유동 측정
- 지중경사계 안정층 근입 생략

<a id="IMG-022"></a>

### IMG-022 구조물 안전계측 전체 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-022_구조물-안전계측-전체-개념도_균열경사진동변위.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/structural-safety`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.6 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/구조물 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | 구조물 안전계측 전용 — ⚠ BLD-H-01: fields/building hero 금지 → IMG-100 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |

<a id="IMG-023"></a>

### IMG-023 철도 노반 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-023_철도-노반-계측-개념도_침하진동변위계측.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/railway`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.7 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/철도 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v3 ai-reviewed RAIL-MEAS-01 · 4영역·그래프 분리 · docs/135 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 레일 변위와 노반침하 동일 센서
- 진동 단위와 침하 단위 혼재
- 철도 계측 단일 로거 흐름도 단순화

<a id="IMG-024"></a>

### IMG-024 댐 안전관리 계측 체계도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-024_댐-안전관리-계측-체계도_필댐6항목데이터흐름.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/dam`) |
| KDS/KCS 근거 | KCS 54 20 25:2018 §3 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/댐 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 v4 ai-reviewed — 필댐 6항목·DAM-01 침하·침윤선·V-notch·7단계 흐름 · prohibitedErrors 유지 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | v4 local-corrected — DAM-01 침하 방향 보정, 제조사 문자 제거 |

**금지 오류 대조:**

- 침하 그래프 -20mm=경보 -60mm=관리기준 역전 (DAM-01)
- 침윤선 파선과 피에조 수두 불일치 (DAM-02)
- 간극수압계 개방 standpipe·전관 수면 (DAM-03)
- 지하수위계와 동형 관 (EXC-03)
- 콘크리트 중력식 단면 혼재 (DAM-04)
- 지하수위선≠해석 침윤선 라벨 (DAM-05)
- 하단 7단계 데이터 흐름 누락 (DAM-06)
- 관리기준 항목별 로직 불일치 (DAM-07)
- 누수계를 제체 내부 박힌 센서처럼 표현
- 간극수압계가 누수량 직접 측정
- 침투선을 실측값처럼 단정

<a id="IMG-025"></a>

### IMG-025 지중경사계 시스템 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-025_지중경사계-시스템-구성도_ProbeCableReadoutCasing.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/inclinometer`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/지중경사계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | Phase 5 v2: IPI 다점·4홈 casing·안정층 Base·자동 로거 체인. 수동 프로브는 비교 inset만. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 5 Pillow v2 — AUTO-01 IPI·datalogger chain |
| 검수일 | 2026-06-22 |
| 금지 대조 | §3.3·AUTO-01 — IPI hero · manual inset only |

**금지 오류 대조:**

- 지중경사계를 침하계처럼 표현
- 「지중경사계」단독 Figure 라벨 — 센서형 다단식 전칭 필수
- 케이싱 4홈·프로브 휠 누락
- 안정층 근입 없이 중단
- 수평변위를 수직 침하로 표현
- 수동 probe·리드아웃을 hero로 표현 (AUTO-01)

<a id="IMG-026"></a>

### IMG-026 지중경사계 케이싱 단면도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-026_지중경사계-케이싱-단면도_GuideGroove4방향ProbeWheel.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/inclinometer`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/지중경사계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): Guide groove 4방향·Probe wheel, AXIS-01 A/B축 굴착방향 연결, 화면좌표≠현장축 경고. 정본 docs/142. ZIP-AUD-21 MAJOR_FIX 해소. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- A축/B축을 화면 좌표처럼 표현
- 굴착·활동방향과 무관한 축 방향
- 축 방향 설정 오류 경고 누락

<a id="IMG-027"></a>

### IMG-027 지중경사계 설치 단면도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-027_지중경사계-설치-단면도_보링그라우트안정층활동면.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/inclinometer`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/지중경사계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | Phase 5 v2: → 화살표·Base 4m 근입·보링·그라우트·센서형 다단식. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 5 Pillow v2 — doc 17 C1~C5 |
| 검수일 | 2026-06-22 |
| 금지 대조 | §3.3.1·doc 17 — 활동면→·안정층 근입·다점 센서 |

**금지 오류 대조:**

- P1: 수평변위← — 활동면·슬라이딩→ 역학 모순
- P2: Base 얕은 관입 — 절대 고정단 1~3 m+ (권장 3~5 m+) 미달
- 활동면·변위 집중 심도 미표시
- 안정층 근입 누락
- 수평변위를 수직 침하로 표현
- 센서형 다단식 미표현
- 「지중경사계」단독 Figure 라벨 — 센서형 다단식 전칭 필수

<a id="IMG-028"></a>

### IMG-028 지중경사계 측정 원리도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-028_지중경사계-측정-원리도_기울기누적변위계산.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/inclinometer`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/지중경사계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed IPI-MEAS-01 · 초기·현재·왕복 · docs/137 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 초기 프로파일 없이 변위 산정
- 현재 기울기 θ만으로 곧바로 누적변위
- 하부 기준점 항상 고정 단정
- 왕복 측정·누적오차 미표시

<a id="IMG-029"></a>

### IMG-029 지중경사계 데이터 해석도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-029_지중경사계-데이터-해석도_IncrementalCumulative활동면.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/inclinometer`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/지중경사계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 누적·간격변위, 변위집중≠활동면, 단일IPI확정금지. 정본 docs/144. INTERP-01. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 최대변위깊이=활동면
- 단일 IPI 확정

<a id="IMG-030"></a>

### IMG-030 지하수위계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-030_지하수위계-설치-개념도_관측공수위센서케이블보호함.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/water-level-meter`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/지하수위계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | Phase 5 v2: well cap·screen·filter pack·bentonite seal·submersible logger. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 5 Pillow v2 — well cap·screen·seal·logger |
| 검수일 | 2026-06-22 |
| 금지 대조 | §3.4·§3.24·AUTO-01 |

**금지 오류 대조:**

- 벽체 부착 센서로 표현
- 토압계·간극수압계와 혼동
- 수위선 없이 센서만 표시
- 방수보호함만 표시 (well cap·screen·seal 누락)

<a id="IMG-031"></a>

### IMG-031 간극수압계 설치도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-031_간극수압계-설치도_필터그라우트케이블.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/piezometer`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/간극수압계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | Phase 5 v2: filter zone·grout seals·junction box·logger. ≠ 개방 관. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 5 Pillow v2 — filter·seal·junction·logger |
| 검수일 | 2026-06-22 |
| 금지 대조 | §3.5·§3.24 — sealed piezometer |

**금지 오류 대조:**

- 지하수위 관측공 전체 개방으로 표현
- 수위선만 표시하고 필터·차수 누락
- 벽체 표면 센서로 표현
- G.W.L 라벨로 간극수압 오인

<a id="IMG-032"></a>

### IMG-032 침하판·침하계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-032_침하판-침하계-설치-개념도_성토하부연장봉보호관.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/settlement-gauge`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/침하계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v6 ai-reviewed — 침하판·연장봉·보호관·측정점≠기준점 SETTLE-01 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | Phase Z ZIP-AUD fix — Pillow v+1 |

**금지 오류 대조:**

- 연장봉 상단을 기준점으로 표기
- 측정점·안정 기준점 미분리

<a id="IMG-033"></a>

### IMG-033 층별침하계 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-033_층별침하계-개념도_자석링기준관층별침하.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/dam/tilt`) |
| KDS/KCS 근거 | KCS 54 20 25:2018 §3.2 |
| 관련 계측기 | 센서별/층별침하계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v3 ai-reviewed MAG-RING-01 · 기준관·자석링·프로브 · docs/136 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 자석링을 로거 직결 전기센서처럼 표현
- 기준관이 지반과 함께 침하
- 층별침하 막대그래프만·기준 위치 생략

<a id="IMG-034"></a>

### IMG-034 토압계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-034_토압계-설치-개념도_흙막이배면성토부.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/earth-pressure-cell`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/토압계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | Phase 5 v2: backfill burial·감지면→벽체·토압 화살표. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 5 Pillow v2 — sensing face·배면→벽체 |
| 검수일 | 2026-06-22 |
| 금지 대조 | §3.6 — EPC sensing face toward structure |

**금지 오류 대조:**

- 감지면 방향 없는 원형 아이콘
- 관측공 내부 설치
- 굴착측 앞면 임의 부착
- 성토 하중=토압계 측정값
- q·σh 미분리

<a id="IMG-035"></a>

### IMG-035 하중계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-035_하중계-설치-개념도_버팀보앵커하중전달.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/load-cell`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/하중계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | Phase 5 v2: ① 띠장-버팀보 접합부 축압축 ② 앵커 두부 LC. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 5 Pillow v2 — STR-01 strut vs anchor LC |
| 검수일 | 2026-06-22 |
| 금지 대조 | §3.2·§3.7·STR-01 |

**금지 오류 대조:**

- 버팀보 정중앙 하중계
- 축방향과 무관한 설치
- 옆면 장식처럼 배치
- strut LC와 anchor LC 혼동

<a id="IMG-036"></a>

### IMG-036 변형률계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-036_변형률계-설치-개념도_철근강재표면부착.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/strain-gauge`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/변형률계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 철근·강재 부착, 측정축, 중립축, 온도보정·E, 변형률≠즉시 안전판정. 정본 docs/141. ZIP-AUD-37 MAJOR_FIX 해소. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 변형률 수치=구조 안전판정
- 게이지 방향 미표시
- 온도보정·E·중립축 생략

<a id="IMG-037"></a>

### IMG-037 균열계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-037_균열계-설치-개념도_균열양측앵커변위측정.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/crack-meter`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/균열계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 ai-reviewed CRACK-01·LOGO-01·균열폭δ수직·docs/138 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-30 |
| 금지 대조 | v5 ai-reviewed — CRACK-01·측정축 수직·전단단차회전 별도 |

**금지 오류 대조:**

- 균열과 평행 설치
- 균열 없이 센서만 부착
- 균열계로 3D 거동 전체 측정
- 균열폭 변화=균열 길이 증가 동일 표기
- 전단·단차·회전을 균열계로 대체

<a id="IMG-038"></a>

### IMG-038 구조물 경사계 설치도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-038_구조물-경사계-설치도_벽체교각표면.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/tilt-meter`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/구조물경사계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed TILT-STRUCT-01 · 강체 브라켓·국부 경사 · docs/139 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 지중경사계와 혼동
- 지반 내부 센서로 표현
- 유연 브라켓 위 센서 = 구조물 전체 경사
- 브라켓 처짐을 기준면으로 표현
- 1점 경사로 전체 기울기 단정

<a id="IMG-039"></a>

### IMG-039 신축계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-039_신축계-설치-개념도_이음부조인트상대변위.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/joint-meter`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/신축계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 Pillow/WebP PASS — 두 고정점 사이 상대변위 ΔL 1축 목적, 고정측·이동측 브라켓과 측정축 분리 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Codex CAD redraw |
| 검수일 | 2026-06-29 |
| 금지 대조 | v4 Pillow/WebP — 신축계·LVDT·균열계 동일 범례 혼합 제거, 3축 동시 측정 표현 제거 |

**금지 오류 대조:**

- 신축계=신축이음계 동일 센서
- LVDT·균열계·신축계 동일 범례
- 신축계로 수평·수직 전방위 동시 측정

<a id="IMG-040"></a>

### IMG-040 변위계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-040_변위계-설치-개념도_기준점대상점변위측정.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/displacement-transducer`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/변위계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 Pillow/WebP PASS — 안정 기준점·이동 대상점 분리, 측정축=변위방향, stroke 중립·브라켓 유격·영점/온도 보정 표시 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Codex CAD redraw |
| 검수일 | 2026-06-29 |
| 금지 대조 | v4 Pillow/WebP — 기준점 불안, 측정축 불일치, stroke·브라켓 유격 누락, 신축계(039) 혼동 제거 |

**금지 오류 대조:**

- 기준점 항상 완전 고정 가정
- 측정축 무관 부착
- stroke·브라켓 유격 미표시

<a id="IMG-041"></a>

### IMG-041 진동계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-041_진동계-설치-개념도_구조물지반3축방향.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/vibration-meter`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/진동계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 Pillow/WebP PASS — 구조물 고정형과 지반 매설형 분리, 가속도(m/s²·gal·g)와 PPV(mm/s) 단위 분리 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Codex CAD redraw |
| 검수일 | 2026-06-29 |
| 금지 대조 | v4 Pillow/WebP — 가속도 단위 mm/s 혼입 제거, 그래프 축 분리 |

**금지 오류 대조:**

- 가속도(m/s² 또는 mm/s) 혼합 표기

<a id="IMG-042"></a>

### IMG-042 자동광파기 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-042_자동광파기-계측-개념도_TotalStation프리즘좌표변위.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/automated-total-station`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/자동광파기 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 기준점·후시점·시준선·프리즘·ΔXΔY, 기상보정, 기준점이동 경고. 정본 docs/143. ZIP-AUD-27 MAJOR_FIX 해소. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- CCTV·카메라 표현
- 프리즘·시준선 없음
- 레이저스캐너 혼동
- 기준 프리즘 없이 대상만
- ATS 한 대가 절대변위 자동 확정
- 후시점·기상보정 누락

<a id="IMG-043"></a>

### IMG-043 GNSS 변위 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-043_GNSS-변위-계측-개념도_기준국이동국서버연결.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/gnss`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/GNSS |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 ai-reviewed — Pillow R1. 기준국(안정 외부)·이동국 3점·RTK 보정·LTE→서버·ΔX/Y/Z |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | v5 ai-reviewed — ZIP-AUD-07 보정정보/광학 시준 분리 (agent) |

**금지 오류 대조:**

- 기준국을 변형 구간에 배치
- 이동국·기준국 역할 역전
- 광파기·프리즘·레이저스캐너 표현
- 기준국 없이 단일 안테나만
- book/GNSS.pdf 제조사 로고·상표 복사
- GNSS 기준국이 이동국 직접 시준
- 광파 시준선 유사 점선

<a id="IMG-044"></a>

### IMG-044 기상계측기 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-044_기상계측기-구성도_강우량풍향온습도기압.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/weather-station`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 센서별/기상계측기 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint6 v3 — WX-SITE-01 강우·풍속·온습·기압·보조자료·지체 callout |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 장애물 무시 임의 설치
- 기상-변위 상관=인과
- 설치 높이·이격 미표시

<a id="IMG-045"></a>

### IMG-045 데이터로거 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-045_데이터로거-구성도_센서입력전원통신저장.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/datalogger/static`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.2.1 · KCS 11 10 15:2025 §3.2.3 |
| 관련 계측기 | 시스템/데이터로거 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed LOGGER-SIG-01·P0-3함체·신호형식분리 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 내부 CPU·저장·통신 블록 다이어그램만
- 정사각 접속함·DATA LOGGER 세로 박스
- 브랜드·CR1000X 모델명 인쇄
- 흙막이 단면 주 화면
- 모든 센서 동일 아날로그 입력
- 로거가 센서 종류 자동 처리
- 신호 형식·여자전원 미구분

<a id="IMG-046"></a>

### IMG-046 IoT 게이트웨이 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-046_IoT-게이트웨이-구성도_현장센서서버통신중계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/communication/iot-gateway`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.1.2 · KCS 11 10 15:2025 §3.2.4 |
| 관련 계측기 | 시스템/게이트웨이 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint6 v3 — GW-ROLE-01 로거↔GW 분리·버퍼·시간동기·판정≠GW |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- GW=로거 동일
- GW 관리기준 판정
- 로컬저장 vs GW버퍼 미구분

<a id="IMG-047"></a>

### IMG-047 태양광 전원 시스템 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-047_태양광-전원-시스템-구성도_패널컨트롤러배터리로거.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/power/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.1.2 |
| 관련 계측기 | 시스템/전원 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint3 v3 — SOLAR-SIZE-01 MPPT·LVD·SPD·부하·자율운전일 · docs/97 §1 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 무정전 보장 암시
- 부하 산정 없이 12V만

<a id="IMG-048"></a>

### IMG-048 LTE M2M 통신 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-048_LTE-M2M-통신-구성도_센서로거모뎀서버웹모바일.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/communication/lte-remote`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.1.2 · KCS 11 10 15:2025 §3.2.4 |
| 관련 계측기 | 시스템/통신 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed LTE-BUF-01·GW-ROLE-01·APN/VPN/ACK · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- LTE 모뎀·통신사 브랜드 로고
- 센서·로거 생략
- 클라우드 UI 스크린샷 복사
- 센서→로거→LTE→서버 직렬만
- 로컬 저장·재전송 없음
- APN·VPN·ACK·방화벽 누락
- LTE 모뎀이 경보 판정

<a id="IMG-049"></a>

### IMG-049 변위 그래프 예시

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-049_변위-그래프-예시_관리기준선실시간추세.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 데이터/그래프 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint6 v3 — DISP-GRAPH-01 상대변위·기준점·속도·예시 기준선 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 단일 ±기준선 보편화
- 단일계=전체 안정
- 기준점·속도 누락

<a id="IMG-050"></a>

### IMG-050 침하 그래프 예시

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-050_침하-그래프-예시_시간침하곡선예측선.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 데이터/그래프 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint7 v3 — GRAPH-PRED-01 해석예측·성토마커·BM·예시기준 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 선형외삽 예측
- 침하판=기준점
- 보편 관리기준

<a id="IMG-051"></a>

### IMG-051 간극수압 소산 그래프

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-051_간극수압-소산-그래프_성토단계상승소산.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 데이터/그래프 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint7 v3 — PIEZO-DISS-01 단계별 상승소산·초정수압 분리 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 단계별 동일곡선
- G.W.L=piezo

<a id="IMG-052"></a>

### IMG-052 하중 변화 그래프

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-052_하중-변화-그래프_버팀보하중경보기준선.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 데이터/그래프 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint7 v3 — LOAD-STAGE-01 단별 기준·프리로드·급감 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 전단계 동일 기준선
- 하중감소=안전

<a id="IMG-053"></a>

### IMG-053 진동 계측 그래프

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-053_진동-계측-그래프_PPV기준선표현.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 데이터/그래프 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint7 v3 — VIB-GRAPH-01 PPV성분·이벤트·예시기준 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 축 혼동
- 보편 PPV 기준

<a id="IMG-054"></a>

### IMG-054 경보 단계 프로세스

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-054_경보-단계-프로세스_정상주의경고위험조치.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/alarm-status`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/경보 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint7 v3 — ALARM-FLOW-01 QC·별도상태·해제조건 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 선형 4단계만
- 초과=위험 단정

<a id="IMG-055"></a>

### IMG-055 모바일 경보 알림 화면

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-055_모바일-경보-알림-화면_휴대폰경보표현.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/alarm-status`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/경보 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint7 v3 — MOB-ALARM-01 확인·조치·감사로그 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 색상만 경보
- 실사 휴대폰

<a id="IMG-056"></a>

### IMG-056 웹 대시보드 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-056_웹-대시보드-구성도_지도센서목록그래프이벤트로그.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/smart`) |
| KDS/KCS 근거 | — |
| 관련 계측기 | 시스템/대시보드 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint3 v3 — DASH-STATE-01 지도·목록·그래프·이벤트 상태 일치 · docs/97 §10 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 전 센서 초록
- 축·단위 없는 그래프

<a id="IMG-057"></a>

### IMG-057 자동 보고서 생성 흐름도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-057_자동-보고서-생성-흐름도_계측데이터PDF보고서.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/smart`) |
| KDS/KCS 근거 | — |
| 관련 계측기 | 시스템/보고서 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint3 v3 — 계측→PDF 보고서 자동 생성 흐름 · docs/122 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 설치 체크리스트 혼동
- 빈 클라우드 박스

<a id="IMG-058"></a>

### IMG-058 통합 계측 플랫폼 아키텍처

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-058_통합-계측-플랫폼-아키텍처_센서로거서버DB웹모바일.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/remote-automatic`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.1.2 |
| 관련 계측기 | 시스템/통합 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed ARCH-01·5계층E2E·전원·통신·모드·뇌금지 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | ARCH-01~03 · INSTRUMENTATION §3.36 |

**금지 오류 대조:**

- 내부 CPU 블록만 표현
- CR1000X 실사·브랜드
- 흙막이·터널 단면 주 화면
- 뇌·홀로그램·SF UI

<a id="IMG-059"></a>

### IMG-059 관리기준 설정 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-059_관리기준-설정-개념도_센서별기준치경보조건.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 시스템/관리기준 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint4 v3 — THRESH-01 항목별·누적/속도·시공/유지 · docs/93 §10 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 모든 센서 동일 경보
- 출처 없는 수치
- 자동 삭제

<a id="IMG-060"></a>

### IMG-060 데이터 품질관리 흐름도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-060_데이터-품질관리-흐름도_수집검증보정분석보고.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/smart`) |
| KDS/KCS 근거 | — |
| 관련 계측기 | 시스템/데이터품질 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint4 v3 — QC 원본보존·플래그·보정분리 · Phase Z |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase Z ZIP-AUD fix — Pillow v+1 |

**금지 오류 대조:**

- 이상치 자동 삭제
- 원본 미보존

<a id="IMG-061"></a>

### IMG-061 터널 천단침하 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-061_천단침하계-외부-수준점-계측-개념도.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel/crown-settlement`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed TUN-CROWN·천단측점·ATS시준·와이어금지 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | TUN-CROWN-01~12 redline v2 — 와이어·앵커·로거 0건 |

**금지 오류 대조:**

- 외부 수준점–천단 와이어·케이블 직결 (TUN-CROWN-01)
- 천단침하계(앵커) 라이닝·지반 관통 (TUN-CROWN-02)
- 지중침하계·층별침하계 표현 (TUN-CROWN-03)
- 데이터 로거 필수 구성 (TUN-CROWN-04)
- 상부 지반 관통 수직 침하계 (TUN-CROWN-05)
- 축방향 다수 지점 센서열 (TUN-CROWN-06)
- BM을 와이어 고정 상부로 표현 (TUN-CROWN-07)
- 천단·내공·지표·지중 혼동 (TUN-CROWN-08)
- 데이터 흐름도 (TUN-CROWN-11)

<a id="IMG-062"></a>

### IMG-062 지하수위·간극수압 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-062_지하수위-간극수압-계측도.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/가시설 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | Phase 5 v2: ① 관측공 개방 수면 vs ② 밀폐 필터·접속함·로거. IMG-002 ②③ 연계. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Phase 5 Pillow v2 — EXC-03 ②③ 이형 |
| 검수일 | 2026-06-22 |
| 금지 대조 | §3.4·§3.5·EXC-03 E2 |

**금지 오류 대조:**

- 지하수위계를 벽체 표면에 부착
- ②③ 동형 관 표현 (관측공=간극수압 혼동)
- 수위선 없이 센서만 표시
- 굴착 바닥에만 센서 표시

<a id="IMG-063"></a>

### IMG-063 막장전방 선행변위 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-063_막장전방-선행변위-계측-개념도_막장전방지반.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel/face-advance`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed 막장전방·선행변위계·굴진방향·막장거리 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |

<a id="IMG-064"></a>

### IMG-064 항만·호안 계측 전체 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-064_항만-호안-계측-전체-개념도_케이슨옹벽주변지반.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/harbor/quay-wall`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.8 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/항만·호안 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 Pillow/WebP PASS — 좌=육측·중=케이슨/안벽·우=해측으로 재작도, 조위선·G.W.L·간극수압 분리 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Codex CAD redraw |
| 검수일 | 2026-06-29 |
| 금지 대조 | v4 Pillow/WebP — HAR-Q01~Q03 및 19-image-knowledge 대조 |

**금지 오류 대조:**

- 케이슨·옹벽·주변지반 구분 누락
- 조위선·지하수위선 혼동
- 지하수위계를 벽체 부착으로 표현
- 간극수압계를 관측공으로 표현

<a id="IMG-065"></a>

### IMG-065 현장 계측 전원 통합 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-065_현장-계측-전원-통합-구성도_태양광풍력AC배터리.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/power/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.1.2 |
| 관련 계측기 | 시스템/전원 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | render:power v2 — 주·백업·보조·DC분배·LVD · docs/112 §11 · interim FT-C PASS |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-26 |

<a id="IMG-066"></a>

### IMG-066 상시 전원 AC 인입

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-066_상시-전원-AC-인입_배전반차단기정류.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/power/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.1.2 |
| 관련 계측기 | 시스템/전원 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint2 v3 ai-reviewed — AC 인입·배전반·서지·DC · docs/122 §4 P1-A |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 빈 박스·PPT 와이어프레임
- 뇌·실사 풍경

<a id="IMG-067"></a>

### IMG-067 AVR 자동전압조정기

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-067_AVR-자동전압조정기_입력출력안정화.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/power/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.1.2 |
| 관련 계측기 | 시스템/전원 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint2 v3 ai-reviewed — AVR 입력출력 안정화 · docs/122 §4 P1-A |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 빈 박스·PPT 와이어프레임
- 뇌·실사 풍경

<a id="IMG-068"></a>

### IMG-068 풍력 하이브리드 전원

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-068_풍력-하이브리드-전원_태양광풍력배터리.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/power/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.1.2 |
| 관련 계측기 | 시스템/전원 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint2 v3 ai-reviewed — 태양광+풍력 하이브리드 · docs/122 §4 P1-A |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 빈 박스·PPT 와이어프레임
- 뇌·실사 풍경

<a id="IMG-069"></a>

### IMG-069 배터리·축전 시스템

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-069_배터리-축전-시스템_용량종류모니터링.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/power/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.1.2 |
| 관련 계측기 | 시스템/전원 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint2 v3 ai-reviewed — 배터리 용량·SOC 모니터링 · docs/122 §4 P1-A |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 빈 박스·PPT 와이어프레임
- 뇌·실사 풍경

<a id="IMG-070"></a>

### IMG-070 수동 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-070_수동-계측-개념도_현장방문리드아웃기록.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/계측방식 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint2 v2 — 현장방문·리드아웃·측정일지 · redline v2 · docs/36 §4.8② · Phase D W10 — redline v2 PASS · docs/113 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

<a id="IMG-071"></a>

### IMG-071 자동 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-071_자동-계측-개념도_로거현장저장주기.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/계측방식 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint2 v2 — 센서→로거→현장저장·수집주기 · redline v2 · Phase D W10 — redline v2 PASS · docs/113 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

<a id="IMG-072"></a>

### IMG-072 원격 자동계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-072_원격-자동계측-개념도_현장통신서버모니터링.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/계측방식 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint2 v2 — 현장→LTE→서버→대시보드 · redline v2 · Phase D W10 — redline v2 PASS · docs/113 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

<a id="IMG-073"></a>

### IMG-073 스마트 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-073_스마트-계측-개념도_플랫폼경보보고로그.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/계측방식 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint2 v2 — 플랫폼·경보·보고·로그 · redline v2 · Phase D W10 — redline v2 PASS · docs/113 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

<a id="IMG-074"></a>

### IMG-074 AI 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-074_AI-계측-개념도_이상탐지예측HITL.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/계측방식 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint2 v2 — 이상탐지·HITL 검토 · redline v2 · 뇌 금지 · Phase D W10 — redline v2 PASS · docs/113 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

<a id="IMG-075"></a>

### IMG-075 계측 방식 5단계 계층도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-075_계측-방식-5단계-계층도_수동자동원격스마트AI.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/overview`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/계측방식 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint2 v2 — 5단계 계층·포함관계 · redline v2 · Phase D W10 — redline v2 PASS · docs/113 · 179 §9 caption sync 2026-06-30 · pixel 5단계 ladder REGENERATE 권장(캡션만 정합) · 179 §9 caption sync 2026-06-30 · pixel 5단계 ladder REGENERATE 권장(캡션만 정합) · 179 §9 caption sync 2026-06-30 · pixel 5단계 ladder REGENERATE 권장(캡션만 정합) · 179 §9 caption sync 2026-06-30 · pixel 5단계 ladder REGENERATE 권장(캡션만 정합) |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

<a id="IMG-076"></a>

### IMG-076 동적 데이터로거 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-076_동적-데이터로거-구성도_모듈형DAQ고속샘플링.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/datalogger/static`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.2.1 · KCS 11 10 15:2025 §3.2.3 |
| 관련 계측기 | 시스템/데이터로거 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint4 v3 — 모듈형 DAQ·IEPE·고속샘플링·PPV · docs/112 §11 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

**금지 오류 대조:**

- CR1000X 정적로거 혼동
- 제조사 모델명

<a id="IMG-077"></a>

### IMG-077 멀티플렉서(MUX) 구성도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-077_멀티플렉서-구성도_체인센서순차스캔.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/datalogger/static`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.2.1 · KCS 11 10 15:2025 §3.2.3 |
| 관련 계측기 | 시스템/데이터로거 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P1 Sprint5 v3 — MOD-06 MUX 순차 스캔·채널 체인 · docs/122 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

**금지 오류 대조:**

- 동시 측정 표현
- VW·진동현식 라벨

<a id="IMG-078"></a>

### IMG-078 록볼트 축력 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-078_록볼트-축력-계측-개념도_축력계변형률계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel/rockbolt`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v3 ai-reviewed — Pillow R1. 천단·어깨 볼트 암반 관입·축력계+변형률계·두부 LC≠전체 분포(Z-1d) |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | v3 ai-reviewed — ZIP-AUD-09 Z-1d 두부/분포 분리 (agent) |

**금지 오류 대조:**

- 두부 하중=P 전체 록볼트 축력
- 축력분포·변형률계 미구분

<a id="IMG-079"></a>

### IMG-079 숏크리트 응력·변형 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-079_숏크리트-응력-변형-계측-개념도_변형률계매립.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel/shotcrete`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed TUN-SC·암반|숏크리트|굴착·SG매립·σ · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- 숏크리트 응력계로 터널 전체 안정성 평가
- 숏크리트 응력계=토압계
- 지반압 화살표와 센서 1:1 연결

<a id="IMG-080"></a>

### IMG-080 강지보 응력 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-080_강지보-응력-계측-개념도_스틸세트변형률계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel/steel-support`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 ai-reviewed — Pillow R1 완료. H형강 스틸세트·천단·어깨·측벽 다점 SG·N/M 분리(Z-1e) |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | v5 ai-reviewed — ZIP-AUD-10 다점 SG·플랜지 내외측 (agent) |

**금지 오류 대조:**

- 플랜지 일부 변형률만으로 전체 응력 대표
- 내외측·다점 계측 미표시

<a id="IMG-081"></a>

### IMG-081 기둥 축소량 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-081_기둥-축소량-계측-개념도_수직변형률계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/building`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.9 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/건축 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 ai-reviewed 층별변형률+온도·상대측점·축소그래프·P0-1 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-30 |
| 금지 대조 | v5 ai-reviewed — 층별 상대측점·변형률+온도·RF절대기준 없음 |

**금지 오류 대조:**

- 수직 로드 하나가 모든 층 축소 직접 측정
- RF층을 절대 기준점
- 크리프·건조수축·탄성축소 단순화

<a id="IMG-082"></a>

### IMG-082 건축 응력·변형률 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-082_건축-응력변형률-계측-개념도_중대부재하중계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/building`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.9 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/건축 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | render-building-audit-fixes.py v2 — LC·SG·하중변형 그래프 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |

<a id="IMG-083"></a>

### IMG-083 댐 변형률 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-083_댐-변형률-계측-개념도_제체매립SG.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/dam/strain`) |
| KDS/KCS 근거 | KCS 54 20 25:2018 §3.2 |
| 관련 계측기 | 분야별/댐 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | — |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |

<a id="IMG-084"></a>

### IMG-084 항만구조물 변위 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-084_항만구조물-변위-계측-개념도_케이슨안벽변위계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/harbor/caisson`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.8 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/항만 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | Phase D W10 — redline v2 PASS · docs/113 · Phase D W10 — redline v2 PASS · docs/113 · Phase D W10 — redline v2 PASS · docs/113 · Phase D W10 — redline v2 PASS · docs/113 · Phase D W10 — redline v2 PASS · docs/113 · Phase D W10 — redline v2 PASS · docs/113 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-26 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

<a id="IMG-085"></a>

### IMG-085 교량 종·횡변위 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-085_*.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.1 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **DELETE** |
| status | rejected |
| 기술 오류 | IMG-110 받침부 변위로 대체 — docs/64 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |

**금지 오류 대조:**

- 종·횡 3축 혼합
- deck-displacement 바인딩

<a id="IMG-086"></a>

### IMG-086 교량 진동 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-086_교량-진동-계측-개념도_가속도계통행응답.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge/seismic`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.2 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | — |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |

<a id="IMG-087"></a>

### IMG-087 구조물 지진 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-087_구조물-지진-계측-개념도_강진동응답스펙트럼.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge/seismic`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.2 |
| 관련 계측기 | 분야별/구조물 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | — |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |

<a id="IMG-088"></a>

### IMG-088 구조물 온도 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-088_구조물-온도-계측-개념도_온도계수화열계절.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge/temperature`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.2 |
| 관련 계측기 | 분야별/구조물 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | — |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-26 |

<a id="IMG-089"></a>

### IMG-089 사면 지표경사 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-089_사면-지표경사-계측-개념도_지표경사계pad콘크리트.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/slope/surface-tilt`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/사면 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed SLO-TILT-01·pad·θ·지표경사계 · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | Phase B v3 ai-reviewed — redline 서명 |

**금지 오류 대조:**

- 지중경사계 보링 casing
- 풍경화·숲
- 구조물경사계(IMG-038)
- 지표경사계 pad·θ 미표기 (SLO-TILT-01)
- pad 없이 지중 매설
- 흙막이·교량 풍경 맥락

<a id="IMG-090"></a>

### IMG-090 사면 구조물 변위 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-090_사면-구조물-변위-계측-개념도_배면사면와이어식변위계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/slope/structural-displacement`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.2 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/사면 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 ai-reviewed SLO-WIRE-01·배면와이어·옹벽프리즘·ΔXΔY · 2026-06-29 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | Phase B v5 ai-reviewed — redline 서명 |

**금지 오류 대조:**

- 옹벽 전면·벽체에 와이어식 변위계 부착 (SLO-WIRE-01)
- ATS만 hero — 와이어식 변위계 없음 (DISP-ATS-01)
- ATS 옹벽·사면 꼭대기 부착
- 흙막이 굴착·교량 풍경 맥락

<a id="IMG-091"></a>

### IMG-091 다점지중변위계 (MPBX) 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-091_다점지중변위계-MPBX-설치-개념도_보링다점앵커.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/borehole-extensometer`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 표 4.1-1 · KCS 11 10 15:2025 §3.2 |
| 관련 계측기 | 계측기/센서 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): GL·well cap, 앵커3·로드·헤드, 축방향변위, ≠IPI·≠신축. 정본 docs/146. MPX-01~03. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-29 |
| 금지 대조 | Phase B v3 ai-reviewed — redline 서명 |

**금지 오류 대조:**

- 지중경사계 혼동
- 수평변위 화살표만
- 신축계(039) 교량 이음부 (MPX-02)
- 단일 강봉만 — 다점 앵커 없음 (MPX-03)
- 보링 GL well cap 누락 (P0-2)
- 4홈 casing·프로브 휠 (MPX-01)

<a id="IMG-092"></a>

### IMG-092 말뚝 축력·변형률 지중 단면도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-092_말뚝-축력-변형률-지중-단면도_CIP철근망변형률계.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/foundation-pile/cast-in-place-pile`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.9 |
| 관련 계측기 | 분야별/기초말뚝 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint3 v2 — CIP 말뚝·철근망·변형률계 · redline v2 · §4.11① · Phase D W10 — redline v2 PASS · docs/113 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

**금지 오류 대조:**

- 지상 기둥만
- 교량 pier group(IMG-013)

<a id="IMG-093"></a>

### IMG-093 환경 소음·분진 경계 계측주

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-093_환경-소음-분진-경계-계측주_펜스소음PM로거.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/environmental-impact/noise-level`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 |
| 관련 계측기 | 분야별/환경민원 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint3 v2 — 펜스·소음·분진·로거 · redline v2 · §4.11② · Phase D W10 — redline v2 PASS · docs/113 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase D W10 — redline v2 PASS · docs/113 |

**금지 오류 대조:**

- 대기 그래프만
- 풍경화

<a id="IMG-096"></a>

### IMG-096 가시설 주변지반 계측 설치 대표 단면도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-096_주변지반-계측-설치-대표-단면도_굴착영향권복합.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/retaining-excavation/surrounding-ground`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.1 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/가시설 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 ai-reviewed — Pillow/CAD 와이어프레임 대체. SOE-SURR-01 4종·H=굴착깊이·BORE-GL-01·SETTLE-01. 옹벽·Sand Mat·슬립면 제거 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | v5 ai-reviewed — SOE-SURR-01, SETTLE-01, BORE-GL-01, SOE-INST-01 대조 (agent) |

**금지 오류 대조:**

- 잠재 슬립면·활동면 원호 (MIX-01)
- 옹벽형 영구 구조·캡 (MIX-01)
- H·2H 미정의 (DIM-01)
- ② 「지표침하계」라벨 — 측점/핀만 (SETTLE-01)
- ② 로거 직결 케이블 (측량·ATS 대상)
- 지중경사계·지하수위·간극수압 벽체/CIP 내부 매설 (SOE-INST-01)
- 간극수압계 = 지하수위 관측공 동형
- 수평변위 ← (P1 역방향)
- 로거가 계측 배치보다 강조 (G-15)
- 옹벽·옹벽 기초·옹벽 배면 토압 (SOE-SURR-01)
- Sand Mat·침하판 중심 성토부 연상 (MIX-019)
- 데이터 흐름도·서버·모바일·알람 UI
- 굴착측과 배면 G.W.L 동일 연속 표시
- 옹벽·옹벽 기초·옹벽 토압
- Sand Mat·침하판 중심(019 혼동)
- 지표침하핀에 지표침하계 라벨
- 잠재 슬립면 원호

<a id="IMG-097"></a>

### IMG-097 터널 발파진동·영향권 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-097_터널-발파진동-영향권-계측-개념도_PPV측점배치.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel/blast-vibration`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed BLAST-01·영향권점선·진동계다점·3축·동적DAQ·교량금지 · 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-30 |
| 금지 대조 | v4 ai-reviewed — redline Q1~Q8 · image-knowledge 16 |

**금지 오류 대조:**

- 교량 deck·교각 hero
- 발파원·막장·영향권 미표현
- 진동계 1대만 구조물 정면 hero
- 내공변위계·수렴 hero 혼합
- ATS·프리즘 발파 대체
- 확정 영향권 실선
- IMG-041·086 재사용

<a id="IMG-098"></a>

### IMG-098 항만 호안 조위·지하수 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-098_항만-호안-조위지하수-계측-개념도_외해사석매립지하수위.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/harbor/tide-groundwater`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.8 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/항만·호안 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 v3 ai-reviewed — HAR-01~04 외해·조위계·tidal lag G.W.L·관측공 screen/filter · prohibitedErrors 유지 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |
| 금지 대조 | §10·IMAGE_REVIEW_LOG 육안 체크리스트 완료 |

**금지 오류 대조:**

- fields/harbor/tide-groundwater hero에 IMG-030(육상) 사용 (HAR-01)
- 해수면·H.W.L/L.W.L·조위계 없음 (HAR-02)
- 수평 G.W.L — tidal lag 곡선 아님 (HAR-03)
- 관측공 불통 관 — screen·filter pack 없음 (HAR-04)

<a id="IMG-099"></a>

### IMG-099 건축 구조물 처짐 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-099_건축-구조물-처짐-계측-개념도_RC골조LVDT처짐그래프.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/building/deflection`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.9.1.1 |
| 관련 계측기 | 분야별/건축 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 ai-reviewed DEF-01~04·LVDT·L/250·P0-1 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-30 |
| 금지 대조 | v5 ai-reviewed — DEF-01~04·LVDT·L/250·P0-1 |

**금지 오류 대조:**

- fields/building/deflection hero에 IMG-050·032·033(침하) 사용 (DEF-01)
- 성토체·연약지반 단면 (DEF-02)
- 침하계·침하판 — LVDT·처짐계 아님 (DEF-03)
- Y축 침하량·예측 침하·임의 -50mm (DEF-04)

<a id="IMG-100"></a>

### IMG-100 건축공사 계측 전체 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-100_건축공사-계측-전체-개념도_KCS39처짐축소균열.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/building`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.9 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/건축 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 ai-reviewed BLD-H-01·DISP-ATS-01·KCS39콜아웃·P0-1지표면 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-30 |
| 금지 대조 | v5 ai-reviewed — BLD-H-01·DISP-ATS-01·P0-1 지표면 |

**금지 오류 대조:**

- fields/building hero에 IMG-022 사용 (BLD-H-01)
- 침하계·성토 Figure — 건축 hero 금지

<a id="IMG-101"></a>

### IMG-101 건축공사 주변건물 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-101_건축공사-주변건물-계측-개념도_신축인접균열경사.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/building/adjacent-building`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3.9 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/건축 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 ai-reviewed BLD-ADJ-01·DISP-ATS-01·와이어식주계측·P0-1 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-30 |
| 금지 대조 | v5 ai-reviewed — BLD-ADJ-01·와이어식·ATS inset만 |

**금지 오류 대조:**

- fields/building/adjacent-building hero에 IMG-005 사용 (BLD-ADJ-01)
- 굴착 흙막이·버팀보 주 배경

<a id="IMG-094"></a>

### IMG-094 상시 계측 모드 흐름도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-094_상시-계측-모드-흐름도_등간격트리거stabletrend.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/normal-mode`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/운영모드 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint1 v2 ai-reviewed — 등간격 트리거·로거→클라우드·stable trend inset · redline v2 · docs/124 · Phase E W11 — Pillow 출판 검수 PASS · docs/116 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase E W11 — Pillow 출판 검수 PASS · docs/116 |

**금지 오류 대조:**

- 시계 아이콘만
- 뇌·홀로그램

<a id="IMG-095"></a>

### IMG-095 실시간·이벤트 계측 모드 토폴로지

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-095_실시간-이벤트-계측-모드-토폴로지_고속샘플링impulse.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/realtime-mode`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/운영모드 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint1 v2 ai-reviewed — Trigger Event·고속 샘플링·impulse 파형 · redline v2 · docs/124 · Phase E W11 — Pillow 출판 검수 PASS · docs/116 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase E W11 — Pillow 출판 검수 PASS · docs/116 |

**금지 오류 대조:**

- 번개 CG
- 뇌·SF UI

<a id="IMG-102"></a>

### IMG-102 경보·알림 상태 제어 흐름도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-102_경보-알림-상태-제어-흐름도_threshold경광SMS.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`instruments/modes/alarm-status`) |
| KDS/KCS 근거 | KCS 11 10 15:2025 §3 · KDS 11 10 15:2025 §1.3 |
| 관련 계측기 | 시스템/운영모드 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | P0 Sprint1 v2 ai-reviewed — Caution/Warning/Action·경광등·SMS 알림 · redline v2 · docs/124 · Phase E W11 — Pillow 출판 검수 PASS · docs/116 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Human-Reviewer |
| 검수일 | 2026-06-27 |
| 금지 대조 | Phase E W11 — Pillow 출판 검수 PASS · docs/116 |

**금지 오류 대조:**

- SF 경고 팝업
- 뇌·네온
- IMG-054 only without threshold

<a id="IMG-103"></a>

### IMG-103 교량 상부구조 GNSS 처짐 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-103_교량-상부구조-처짐-계측도_거더처짐계δ.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge/deflection`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.2 · KDS 11 10 15:2025 §4.2.1.6 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v5 GNSS ai-reviewed (2026-06-29): 경간=교각간, 이동국 경간중앙 1개, 1/4·3/4·교각 GNSS 금지, ΔZ→δ. 정본 docs/148 SPAN-MID-01. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |

**금지 오류 대조:**

- 침하판·지표침하계 hero
- 성토 단면
- Y축 침하량
- 하부 와이어식 처짐계 hero (DEF-GNSS-04)
- 교각 측면/중간 GNSS (DEF-GNSS-05)
- 1/4·3/4 경간 GNSS·복수 이동국 (SPAN-MID-01)
- 교대↔교대 경간 표시
- 와이어+GNSS 동시 주계측 (DEF-GNSS-06)
- 생성 시 로고·워터마크

<a id="IMG-104"></a>

### IMG-104 처짐계 설치·측정 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-104_처짐계-설치-측정-개념도_LVDT와이어.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/deflection-gauge`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.2.1.6 |
| 관련 계측기 | 센서/처짐계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 와이어식·LVDT 처짐 δ, ≠침하계, IMG-103 GNSS 분리. 정본 docs/150. BRI-DEF. · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 · 179 §9 caption sync 2026-06-30 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor Agent |
| 검수일 | 2026-06-27 |

**금지 오류 대조:**

- 침하계·침하판
- 지반 침하 단면
- GNSS+와이어 동시 주계측 (DEF-GNSS-06)

<a id="IMG-105"></a>

### IMG-105 교량 케이블 장력 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-105_교량-케이블장력-계측도_사장교주파수법.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge/cable-tension`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.2 · KDS 11 10 15:2025 §4.2.1.9 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 사장교 주케이블 케이블장력계·f→T·BRI-CT. 정본 docs/151. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |

**금지 오류 대조:**

- 어스앵커 로드셀
- IMG-004 재사용
- 진동현식·VW 라벨 (METHOD-01)
- 흙막이·굴착 배경 (CT-BRI-02)
- 임의 관리기준 장력표 (CT-BRI-04)

<a id="IMG-106"></a>

### IMG-106 케이블장력계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-106_케이블장력계-주파수법-설치-개념도.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/cable-tension-meter`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.2.1.9 |
| 관련 계측기 | 센서/케이블장력계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 주케이블 클램프·f→T·설치개념·BRI-CT. 정본 docs/155. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |

**금지 오류 대조:**

- 하중계=케이블장력
- 버팀보 로드셀
- 어스앵커 T/P (IMG-004)
- 진동현식·VW 라벨 (METHOD-01)

<a id="IMG-107"></a>

### IMG-107 교량 변형률·응력 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-107_교량-변형률-응력-계측도_PSC강재휨응력.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge/strain-stress`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.2 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): PSC·강재 휨 SG·ε→σ·전단 inset·BRI-STR. 정본 docs/152. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |

**금지 오류 대조:**

- 침하계 단면
- 흙막이 배경
- 숏크리트 hero (STR-BRI-03)
- 무응력계=SG 동일 캡션 (STR-BRI-04)
- 진동현식·VW 라벨 (METHOD-01)

<a id="IMG-108"></a>

### IMG-108 무응력계 설치 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-108_무응력계-설치-개념도_크리프보정.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`sensors/stress-free-strain-gauge`) |
| KDS/KCS 근거 | — |
| 관련 계측기 | 센서/무응력계 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 무응력계 ε₀·크리프보정·BRI-STR. 정본 docs/156. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |

**금지 오류 대조:**

- 일반 SG와 동일 캡션
- 침하·지반 단면 (STR-BRI-01)
- 숏크리트 hero (STR-BRI-03)
- 지중경사계·균열계 hero
- 진동현식·VW 라벨 (METHOD-01)

<a id="IMG-109"></a>

### IMG-109 교량 풍향·풍속 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-109_교량-풍향풍속-계측도_주탑교면.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge/wind`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.2 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 주탑·교면 풍향풍속·BRI-WND. 정본 docs/153. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |

**금지 오류 대조:**

- 사면 강우 hero만
- 지하수위계 단독
- 풍향·풍속 벡터 없음 (WND-BRI-03)
- 임의 풍하중 관리표 (WND-BRI-04)
- 진동현식·VW 라벨 (METHOD-01)

<a id="IMG-110"></a>

### IMG-110 교량 받침부 변위 계측도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-110_교량-받침부-변위-계측도_슬라이드회전.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/bridge/bearing-displacement`) |
| KDS/KCS 근거 | KCS 24 99 05:2023 §3.2 |
| 관련 계측기 | 분야별/교량 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | v4 ai-reviewed (2026-06-29): 받침 슬라이드·회전·변위계·BRI-BRG. 정본 docs/154. |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | agent |
| 검수일 | 2026-06-29 |

**금지 오류 대조:**

- X/Y/Z 3축 주계측
- 종·횡변위 제목
- 신축이음 핑거형 hero
- GNSS 절대좌표 혼합
- 진동현식·VW 라벨 (METHOD-01)

<a id="IMG-111"></a>

### IMG-111 터널 건설중 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-111_external.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/tunnel`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.5 · KCS 11 10 15:2025 표 3.5-1 |
| 관련 계측기 | 분야별/터널 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | 건설중 계측 hero — ai-reviewed · docs/153 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-27 |

<a id="IMG-112"></a>

### IMG-112 철도·고속철도 건설중 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-112_external.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/railway`) |
| KDS/KCS 근거 | KDS 11 10 15:2025 §4.1.7 · KCS 11 10 15:2025 §3 |
| 관련 계측기 | 분야별/철도 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | 건설중 계측 hero — ai-reviewed · docs/153 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-27 |

<a id="IMG-113"></a>

### IMG-113 댐·제방 건설중 계측 개념도

| 항목 | 내용 |
|------|------|
| 파일명 | `IMG-113_external.webp` |
| 사용 페이지 | dictionary `imageId` 참조 노드 (`fields/dam`) |
| KDS/KCS 근거 | KCS 54 20 25:2018 §3 · KDS 11 10 15:2025 §4.1 |
| 관련 계측기 | 분야별/댐 |
| 검수 등급 | **PASS** |
| status | reviewed |
| 기술 오류 | 건설중 계측 hero — ai-reviewed · docs/153 |
| 설치 위치 오류 | — |
| 방향 오류 | — |
| 용어 오류 | — |
| 수정 지시 | — |
| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |
| 검수자 | Cursor-Agent |
| 검수일 | 2026-06-27 |

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-25 | 레지스트리 기반 최초 생성 |
| 2026-06-22 | Phase 5 Pillow v2 (025·027·030·031·034·035·062) · Phase 6 formal 001·002·004·005 |
