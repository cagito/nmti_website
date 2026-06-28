# image-knowledge — Cursor Agent 읽기 순서

`book/` PDF만 근거로 한 **이미지·도면 작성 제약** 문서 모음이다.

## 읽기 순서

1. [00-공통-이미지-작성-원칙.md](./00-공통-이미지-작성-원칙.md)
2. 작업 Figure에 해당하는 [주제 기준서](./) (`01-*.md` …)
3. [source-index.md](./source-index.md) — PDF·페이지 색인
4. ImageWorks prompt / redline (해당 IMG-###)
5. `scripts/image-review-registry.json` · `js/technology/images.js`

## 주제 파일

| 파일 | 주제 | 주 PDF |
|------|------|--------|
| [01-터널-내공변위-측정.md](./01-터널-내공변위-측정.md) | 터널 내공변위·측선 배치 | KDS 27 50 10 |
| [02-지중경사계-관측공-설치.md](./02-지중경사계-관측공-설치.md) | 지중경사계 casing·관측공 | guide-to-instrumentation |
| [03-지하굴착-흙막이-계측-단면.md](./03-지하굴착-흙막이-계측-단면.md) | 지하굴착·흙막이 계측 배치 | KCS 11 10 15 §3.10 |
| [04-지하수위계-관측공-설치.md](./04-지하수위계-관측공-설치.md) | 지하수위·관측공·G.W.L | KCS §3.10 · guide §7 |
| [05-간극수압계-설치-개념.md](./05-간극수압계-설치-개념.md) | 간극수압·밀폐 필터 | KCS §3.10 · guide §8 |
| [06-어스앵커-버팀보-하중계-설치.md](./06-어스앵커-버팀보-하중계-설치.md) | 하중계·앵커 LC | KCS §3.10.3.1④ |
| [07-GNSS-변위-계측.md](./07-GNSS-변위-계측.md) | GNSS 기준국·이동국·서버 | GNSS.pdf p.2 |
| [08-데이터로거-계측시스템-구성.md](./08-데이터로거-계측시스템-구성.md) | DAQ·로거·보호함·통신 | KDS §4.2.2 · 부록2 §1 |
| [09-변위·광학계측-표현-기준.md](./09-변위·광학계측-표현-기준.md) | 와이어·LVDT vs 광학·ATS | KDS §4.2.1.3 · 도시철도 |
| [10-천단침하-계측.md](./10-천단침하-계측.md) | 천정 절대침하·동단면 | KDS 27 50 10 §4.2 |
| [11-터널-록볼트-숏크리트-계측.md](./11-터널-록볼트-숏크리트-계측.md) | 축력·응력·인발시험 | KDS 27 50 10 §4.3 |
| [12-지표침하·층별침하-계측.md](./12-지표침하·층별침하-계측.md) | 지표침하·층별·침하핀 구분 | KDS 11·27 · 도시철도 표 3.7–3.8 |
| [13-사면·비탈면-계측-배치.md](./13-사면·비탈면-계측-배치.md) | 사면 계측기·활동면 배치 | KDS §4.1.2 · 표 4.1-1·4.1-2 |
| [14-교량-계측시스템-설치.md](./14-교량-계측시스템-설치.md) | 특수교량 자동계측·원격 | KCS 24 99 05 |
| [15-댐-계측-배치.md](./15-댐-계측-배치.md) | 필댐·석괴댐·RC댐 계측 체계 | KCS 54 20 25 |
| [16-발파진동-소음-계측.md](./16-발파진동-소음-계측.md) | 발파 영향권·진동·소음 | KDS §4.1.11 |
| [17-건축공사-계측-배치.md](./17-건축공사-계측-배치.md) | 침하·경사·균열·기둥축소 | KDS §4.1.9 |
| [18-계측계획·배치도면-표현.md](./18-계측계획·배치도면-표현.md) | 배치도·범례·계측단면 | KDS §1.7~1.10 · 03 PDF |
| [19-항만·호안-계측-배치.md](./19-항만·호안-계측-배치.md) | 케이슨·조위·육해측 | KDS §4.1.8 · KCS §3.8 |
| [20-철도·궤도-계측-표현.md](./20-철도·궤도-계측-표현.md) | 궤도 축단면·침하·변위 | KDS §1.8·1.10 · IMG-023 |
| [21-토압계-설치-표현.md](./21-토압계-설치-표현.md) | 토압계 감지면·방향 | KDS 표 4.1-1 · IMG-034 |
| [22-균열·변형률-계측-표현.md](./22-균열·변형률-계측-표현.md) | 균열·변형률 | KDS §4.1.9 · IMG-037·036 |
| [23-신축·변위계-구조부재.md](./23-신축·변위계-구조부재.md) | 신축이음·와이어/LVDT | KCS 24 99 05 · IMG-014·039 |
| [24-진동·소음-계측-표현.md](./24-진동·소음-계측-표현.md) | 진동·소음 설치 | KDS §4.1.11 · IMG-041 |
| [25-MPBX·지중변위-표현.md](./25-MPBX·지중변위-표현.md) | MPBX ≠ IPI | KDS 표 4.1-1 · IMG-091 |
| [26-기상·환경-보조계측.md](./26-기상·환경-보조계측.md) | 기상 보조·INTERP | KDS §4.2.3 · WX-SITE-01 |
| [27-연약지반·압밀-계측.md](./27-연약지반·압밀-계측.md) | 연약·성토·압밀 | KDS §4.1.1 · KCS §3.1 |
| [28-경보·그래프·대시보드-표현.md](./28-경보·그래프·대시보드-표현.md) | FT-C 그래프·경보 | KCS §3.2.4 · IMG-049~055 |
| [29-통신·게이트웨이-역할.md](./29-통신·게이트웨이-역할.md) | 로거↔GW↔서버 | KCS §3.1.2 · GW-ROLE-01 |
| [30-하천제방-계측-배치.md](./30-하천제방-계측-배치.md) | 하천|제방 횡단 | KDS §4.1.7 · river-levee |

갭 매트릭스: [_gap-matrix.md](./_gap-matrix.md) · KDS 후보: [_kds-figure-rules-candidates.md](./_kds-figure-rules-candidates.md) · 계획: [130](../130-book-콘텐츠-이미지작성규칙-반영-실행계획.md)

## 명령

```bash
npm run catalog:book-pdf          # PDF 목록·manifest·source-index 갱신
npm run build:gap-matrix          # INSTR·IMG ↔ image-knowledge 갭 표
npm run patch:instr-image-knowledge  # INSTR §3 역링크 주입
npm run sync:prompt-image-rules   # §5·§6 → ImageWorks prompts
npm run sync:prompt-image-knowledge-links  # 주제 링크 → prompts 상단
npm run patch:registry-image-knowledge     # imageKnowledgeTopic → registry
npm run sync:redline-image-knowledge       # §13 → canonical redlines
npm run extract:kds-figure-rules           # book §4.1 → 후보 bullet JSON
npm run build:kds-figure-rules-report      # _kds-figure-rules-candidates.md
npm run patch:image-knowledge-from-kds     # 승격 bullet → §5·§6
npm run scaffold:redline-stubs             # stub redline pixel gate
npm run list:redline-stubs                 # pixel gate 미작성 redline
npm run validate:book-rules-coverage       # image-knowledge 통합 CI
npm run validate:image-knowledge  # 13절 구조 검증
npm run validate:instr-image-knowledge  # INSTR §3 역링크 검증
```

## 원칙

- PDF는 참고자료, 본 폴더 Markdown은 **실행 규칙**.
- 잘못 그리지 않게 막는 기술 제약 문서이지, 미술적 설명서가 아니다.
