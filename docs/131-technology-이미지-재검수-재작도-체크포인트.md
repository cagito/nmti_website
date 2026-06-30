# Technology 이미지 재검수·재작도 체크포인트

**시작일:** 2026-06-28  
**목표:** `technology` 이미지 중 저품질·오작도·문서 불일치 이미지를 한 장씩 재검수하고, 이미지·문서·registry를 같은 단위로 갱신한다.

## 운영 원칙

- 이미지 원본은 WebP 바이트를 보존한다. Git 전송이 필요하면 `.webp.b64.partNNN` + `.webp.b64.parts.json`으로 분할한다.
- 이미지가 바뀌면 반드시 `IMAGE_REVIEW_LOG`, `image-review-registry.json`, 관련 `docs/image-knowledge/*`, redline/프롬프트 근거를 함께 갱신한다.
- `reviewGrade: PASS`는 기술 게이트와 출판 게이트를 모두 통과한 경우에만 유지한다.
- 중단 시 이 문서의 “현재 작업”과 “다음 작업”부터 재개한다.
- `reviewGrade: DELETE` 이미지는 노출 경로에 남기지 않는다.

## 우선순위 큐

| 순번 | ID | 상태 | 핵심 사유 |
|---:|---|---|---|
| 1 | IMG-025 | 진행 | 지중경사계 하단 안정층 기준 0 mm 그래프 재작도, 페이지 노출 영향 큼 |
| 2 | IMG-085 | 대기 | `reviewGrade: DELETE`; IMG-110 대체 후 잔여 노출 차단 필요 |
| 3 | IMG-007 | 대기 | 터널 전체도: 천단침하·내공변위·지중변위·지보재 계측 측점/측선 분리 필요 |
| 4 | IMG-084 | 보류 | 항만구조물 변위, v6 PASS이나 후순위 유지 |
| 5 | IMG-091 | 보류 | MPBX, 지중경사계·신축계 혼동 방지 재확인 |

## 현재 작업

| 항목 | 내용 |
|---|---|
| ID | IMG-025 |
| 단계 | 1차 코드 수정 완료, 이미지 재생성·registry/log 갱신 대기 |
| 수정 파일 | `scripts/lib/inclinometer_system_draw.py` |
| 수정 요지 | mini graph를 하단 안정층 0 mm 기준의 누적 상대변위 곡선으로 변경 |
| 다음 작업 | `python scripts/render-phase5-sensors.py --id 025 --force-legacy-pillow` 실행 후 운영 PNG/WebP 재생성, registry·IMAGE_REVIEW_LOG 갱신 |

## IMG-025 감사 메모

- 대상: `assets/images/technology/IMG-025_지중경사계-시스템-구성도_ProbeCableReadoutCasing.*`
- 기존 오류: 우측 해석 그래프가 하단 안정층에서 큰 변위를 갖는 형태로 표현될 수 있음.
- 수정 기준: 안정층/Base 지점은 개념도 기준 `0 mm`이며, 상부로 갈수록 누적 상대변위가 증가하는 예시 곡선으로 표현한다.
- 주석 필수: “최대 위치는 지반·하중·시공조건별 상이”.
- 금지: 하부 50 m에서 최대변위, 지중경사계를 침하계처럼 표현, 수동 probe/리드아웃을 hero로 격상.

## IMG-085 감사 메모

- registry 상태: `status: rejected`, `reviewGrade: DELETE`, `supersededBy: IMG-110`.
- 기존 오류: 종·횡·3축 변위 혼합, deck-displacement 바인딩 충돌.
- 처리 원칙: 재작도보다 노출 차단이 우선이다.
- 다음 작업: technology routing, docs, manifest, prompt/export 잔여 참조를 점검하고 실제 노출 경로는 IMG-110으로 통일한다.

## IMG-007 감사 메모

- 대상: 터널 계측 전체 개념도.
- 기존 금지오류: 천단침하와 내공변위 동일 측선, 지중변위계를 록볼트처럼 표현, 숏크리트·강지보 응력계 동일 센서화.
- 수정 기준: NATM 단면에서 천단침하점, 내공변위 측선, 지중변위계, 록볼트축력계, 숏크리트응력계를 서로 다른 측점·측선·기준점으로 분리한다.

## 완료 이력

### IMG-024

- 근거 문서: `docs/39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md`, `docs/32-IMG-024-댐-계측-개념도-오류분석-및-재작업-계획.md`, `docs/image-knowledge/15-댐-계측-배치.md`.
- 유지할 요소: 필댐 단면, 저수위, 간극수압계, 침윤선, 누수·탁도, 침하, 수평변위, 데이터 흐름 7단계.
- 수정할 요소: 데이터로거/함체의 제조사·브랜드성 문자 제거, 전체 제목 가시성 보강, 침하 카드 그래프를 침하 증가 방향(하향 또는 음수 누적)으로 정렬.
- 금지: 품질 임의 저하, PNG/JPG 운영 등록, 근거 없는 센서 추가, 진동현식·VW 등 특정 측정 방식 라벨 추가.

### IMG-064

- 근거 문서: `docs/image-knowledge/19-항만·호안-계측-배치.md`, `docs/112-Phase-D-복붙-프롬프트-정본.md`, `ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts/IMG-064_항만-호안-계측-전체-개념도.md`.
- 기존 오류: 운영 WebP가 `해측|케이슨|육측` 방향으로 그려져 문서 기준 `육측|구조물|해측`과 반대.
- v4 반영: `scripts/render-img064-harbor-v4.py`로 WebP 직접 생성, 좌=육측 뒤채움·중=케이슨/안벽·우=해측 바다/조위로 재작도.
- 필수 분리: 조위선(H.W.L/L.W.L), G.W.L, 간극수압계는 서로 다른 물리량으로 분리 표기.
- v4 SHA-256: `87D76B1ACE4F5C21B13E53844651AA8E52B65FD8B93548760BCDAB725BED8FA3`.

## 작업 로그

### 2026-06-28

- 체크포인트 문서 생성.
- 첫 대상: `IMG-024 댐 안전관리 계측 체계도`.
- IMG-024 근거 문서와 기존 WebP를 확인하고 v4 후보 수정 범위를 확정.
- v4 draft 생성·저장: `assets/images/technology/source/IMG-024_댐-안전관리-계측-체계도_v4-draft.webp`.
- v4 draft 폐기 사유: 1920x1080이 아닌 1672x941 생성, 일부 라벨 오탈자·어색한 표현 가능성, 기존 v3보다 기술 라벨 안정성이 낮음. registry 미반영.
- v4 draft SHA-256: `778B6FFCC20FEB7CAB9CD2A377D3157F973642BAAF7A67D77BA88634A489F7C5`.
- 다음 재개 지점: 기존 v3 WebP를 기준으로 브랜드 문자 제거, 전체 제목 보강, 침하 카드 방향만 국소 보정.
- v4-local-4 후보 생성: 원본 v3에서 제목 보강, 데이터로거 제조사 문자 제거, 침하 카드 음수·하향 누적 그래프로 국소 보정.
- v4-local-4 SHA-256: `D8D5CC02844DAB9DD61AFCDE6C69EE42617121972AE0F8C04D98AB81D0CDB5B6`.
- v4-local-4 크기: 1920x1080 WebP.
- 운영 WebP 교체 완료: `assets/images/technology/IMG-024_댐-안전관리-계측-체계도_필댐6항목데이터흐름.webp`.
- registry·`IMAGE_REVIEW_LOG`를 v4 local-corrected 기준으로 갱신.
- `npm run build:images` PASS, `npm run audit:images` PASS.
- `node scripts/validate-image-master.mjs` OK. 단, 기존 상태로 `IMG-085` WebP pending 메시지는 남아 있음.
- 다음 재개 지점: `IMG-064` 근거 문서와 현재 WebP 확인.
- IMG-064 기존 WebP 검수: 단면 방향이 기준과 반대라 전면 재작도 결정.
- IMG-064 v4 후보 생성·운영 교체 완료: `assets/images/technology/IMG-064_항만-호안-계측-전체-개념도_케이슨옹벽주변지반.webp`.
- IMG-064 registry·`IMAGE_REVIEW_LOG`·`figure-production-policy.json`을 v4 Pillow/WebP 기준으로 갱신.
- IMG-064 검증: `npm run build:images` PASS, `npm run audit:images` PASS, `node scripts/validate-image-master.mjs` OK.

### 2026-06-30

- 우선순위 큐를 TOP3 재검수 체계로 재정렬: IMG-025 → IMG-085 → IMG-007.
- IMG-025 `scripts/lib/inclinometer_system_draw.py` 수정: mini graph를 하단 안정층 0 mm 기준 누적 상대변위로 변경.
- 다음 재개 지점: IMG-025 이미지 재생성 및 registry/log 갱신.
