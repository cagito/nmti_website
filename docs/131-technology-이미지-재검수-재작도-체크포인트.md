# Technology 이미지 재검수·재작도 체크포인트

**시작일:** 2026-06-28  
**목표:** `technology` 이미지 중 저품질·오작도·문서 불일치 이미지를 한 장씩 재검수하고, 이미지·문서·registry를 같은 단위로 갱신한다.

## 운영 원칙

- 이미지 원본은 WebP 바이트를 보존한다. Git 전송이 필요하면 `.webp.b64.partNNN` + `.webp.b64.parts.json`으로 분할한다.
- 이미지가 바뀌면 반드시 `IMAGE_REVIEW_LOG`, `image-review-registry.json`, 관련 `docs/image-knowledge/*`, redline/프롬프트 근거를 함께 갱신한다.
- `reviewGrade: PASS`는 기술 게이트와 출판 게이트를 모두 통과한 경우에만 유지한다.
- 중단 시 이 문서의 “현재 작업”과 “다음 작업”부터 재개한다.

## 우선순위 큐

| 순번 | ID | 상태 | 핵심 사유 |
|---:|---|---|---|
| 1 | IMG-024 | 완료 | v4 운영 WebP 반영, 제조사 문자 제거·침하 방향 보정 |
| 2 | IMG-064 | 완료 | v4 운영 WebP 반영, 육측|구조물|해측 방향 재작도 |
| 3 | IMG-084 | 다음 | 항만구조물 변위, REGENERATE 권장 |
| 4 | IMG-091 | 대기 | MPBX, 지중경사계·신축계 혼동 방지 |
| 5 | IMG-007 | 대기 | 터널 전체, 측점·측선·기준점 분리 |

## 현재 작업

| 항목 | 내용 |
|---|---|
| ID | IMG-064 |
| 단계 | IMG-064 완료, IMG-084 착수 전 |
| 산출물 | `assets/images/technology/IMG-064_항만-호안-계측-전체-개념도_케이슨옹벽주변지반.webp` |
| 검증 | `npm run build:images` PASS, `npm run audit:images` PASS, `node scripts/validate-image-master.mjs` OK |

## IMG-024 감사 메모

- 근거 문서: `docs/39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md`, `docs/32-IMG-024-댐-계측-개념도-오류분석-및-재작업-계획.md`, `docs/image-knowledge/15-댐-계측-배치.md`.
- 유지할 요소: 필댐 단면, 저수위, 간극수압계, 침윤선, 누수·탁도, 침하, 수평변위, 데이터 흐름 7단계.
- 수정할 요소: 데이터로거/함체의 제조사·브랜드성 문자 제거, 전체 제목 가시성 보강, 침하 카드 그래프를 침하 증가 방향(하향 또는 음수 누적)으로 정렬.
- 금지: 품질 임의 저하, PNG/JPG 운영 등록, 근거 없는 센서 추가, 진동현식·VW 등 특정 측정 방식 라벨 추가.

## IMG-064 감사 메모

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
- 다음 재개 지점: `IMG-084` 근거 문서와 현재 WebP 확인.
