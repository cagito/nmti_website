/**
 * image-review-registry.json 초기화·갱신.
 * Usage: node scripts/seed-image-review-registry.mjs [--merge]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8, readJsonSafe } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const master = JSON.parse(
  readFileSync(
    join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1', '03_IMAGE_MASTER_LIST.json'),
    'utf8'
  )
);
const priority = JSON.parse(readFileSync(join(ROOT, 'scripts', 'image-review-priority.json'), 'utf8'));
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');
const imgDir = join(ROOT, 'assets', 'images', 'technology');
const reviewedDir = join(imgDir, 'reviewed');
const rejectedDir = join(imgDir, 'rejected');

const pngOnDisk = new Set(
  readdirSync(imgDir)
    .filter((f) => /^IMG-\d{3}_/.test(f))
    .map((f) => f.match(/^(IMG-\d{3})/)[1])
);

const PROHIBITED_BY_PREFIX = {
  'IMG-001': [
    '건물 기초 아래 굴착 공동·배면 빈 공간',
    '버팀보·굴착저가 배면·건물 아래',
    '옥상 자동광파기 본체·「자동광파기 측정(프리즘)」 라벨',
    '구조물경사계 지반 속·말뚝 형태'
  ],
  'IMG-002': [
    '건물 기초 아래 굴착 공동·배면 빈 공간',
    '버팀보·굴착저가 배면·건물 아래',
    '옥상 자동광파기 본체·「자동광파기 측정(프리즘)」 라벨',
    '구조물경사계 지반 속·말뚝 형태',
    '인접건물을 지하에 묻힌 것처럼 표현',
    '지하수위계를 벽체 부착 센서로 표현',
    '간극수압계를 지하수위 관측공으로 표현',
    '하중계를 지반 내부에 배치',
    '토압계 감지면·작용 방향 누락',
    '굴착측·배면 지반 혼동',
    '어스앵커 강연선·T가 굴착측(공중)으로 향함',
    '앵커 하중계 반력판–헤드–텐던 조립 미표현',
    'G.W.L이 굴착저 위인데 차수·배수 없이 굴착 건조',
    '지중경사계 Base — 활동면/영향 심도 하부 안정층 미도달·임의 m 일반화',
    '버팀보 하중계를 보 정중앙에 배치',
    'SOE 혼합형·지보체계 정체성 불명',
    '지중경사계·지하수위·간극수압 CIP/벽체 내부 매설 (SOE-INST-01)',
    '침하핀·측점에 「지표침하계」 라벨 (SETTLE-01)',
    '자동 지표침하계 침하판 주변 콘크리트 패드·해칭 (SETTLE-PLATE-01)'
  ],
  'IMG-005': [
    '건물↔벽체 이격 L 구간 허공·배면 토사 없음',
    '건물 기초가 굴착저 높이 — 원 지표면 위 안착 아님',
    '지층이 굴착저에서만 시작 — 건물 아래 단절',
    '「경사계」 단독 — 지중경사계 혼동',
    '구조물경사계 지주·포스트 부착 (외벽 표면 아님)',
    '「자동광파기 측정(프리즘)」 복합 라벨',
    '§3.1 배면·굴착 공간 역전 (건물 부양)',
    '배면 지표침하핀·T자 측점 (SETTLE-01) — 본 Figure는 인접건물 균열·경사'
  ],
  'IMG-096': [
    '잠재 슬립면·활동면 원호 (MIX-01)',
    '옹벽형 영구 구조·캡 (MIX-01)',
    'H·2H 미정의 (DIM-01)',
    '② 「지표침하계」라벨 — 측점/핀만 (SETTLE-01)',
    '② 로거 직결 케이블 (측량·ATS 대상)',
    '지중경사계·지하수위·간극수압 벽체/CIP 내부 매설 (SOE-INST-01)',
    '간극수압계 = 지하수위 관측공 동형',
    '수평변위 ← (P1 역방향)',
    '로거가 계측 배치보다 강조 (G-15)'
  ],
  'IMG-012': [
    '교각 측면 단독 수평 변위계 (BRI-PIER-01)',
    '변위계에 기준·상대측정 대상 없음 (BRI-PIER-02)',
    '절대변위 ATS·프리즘 미표현 (BRI-PIER-04~05)',
    '기준점이 기초·말뚹캡 바로 옆 (BRI-PIER-06)',
    '상·하부 경사계 Δθ 회전 개념 누락 (BRI-PIER-07)',
    '기초 지표침하계·부등침하 미표현 (BRI-PIER-08)',
    '우측 데이터 흐름도 (BRI-PIER-09)',
    '관리기준 그래프 일반 수치 mm·° (BRI-PIER-10)'
  ],
  'IMG-013': [
    '기초 모서리 「침하계」 T자·작은 장치 (BRI-FND-01)',
    '침하 측점·지표침하계 미구분 (BRI-FND-02~03)',
    '수위계 주계측 과대 — 지하수위계 보조 아님 (BRI-FND-04)',
    '교각 측면 단독 변위계 (BRI-FND-05)',
    '기준점이 기초·말뚹캡 근처 (BRI-FND-06)',
    '평면도 침하계 아이콘 — 측점 배치 아님 (BRI-FND-07)',
    '침하 그래프 보편 mm 임계 (BRI-FND-08)',
    '우측 데이터 흐름도 (BRI-FND-09)'
  ],
  'IMG-061': [
    '외부 수준점–천단 와이어·케이블 직결 (TUN-CROWN-01)',
    '천단침하계(앵커) 라이닝·지반 관통 (TUN-CROWN-02)',
    '지중침하계·층별침하계 표현 (TUN-CROWN-03)',
    '데이터 로거 필수 구성 (TUN-CROWN-04)',
    '상부 지반 관통 수직 침하계 (TUN-CROWN-05)',
    '축방향 다수 지점 센서열 (TUN-CROWN-06)',
    'BM을 와이어 고정 상부로 표현 (TUN-CROWN-07)',
    '천단·내공·지표·지중 혼동 (TUN-CROWN-08)',
    '데이터 흐름도 (TUN-CROWN-11)'
  ],
  'IMG-024': [
    '침하 그래프 -20mm=경보 -60mm=관리기준 역전 (DAM-01)',
    '침윤선 파선과 피에조 filter tip 수두 불일치 (DAM-02)',
    '간극수압계 개방 standpipe·전관 수면 (DAM-03)',
    '지하수위계와 동형 관 (EXC-03)',
    '콘크리트 중력식 단면 혼재 (DAM-04)',
    '지하수위선≠해석 침윤선 라벨 (DAM-05)',
    '하단 7단계 데이터 흐름 누락 (DAM-06)',
    '관리기준 항목별 로직 불일치 (DAM-07)'
  ],
  'IMG-098': [
    'fields/harbor/tide-groundwater hero에 IMG-030(육상) (HAR-01)',
    '해수면·H.W.L/L.W.L·조위계 없음 (HAR-02)',
    '수평 G.W.L — tidal lag 곡선 아님 (HAR-03)',
    '관측공 불통 관 — screen·filter pack 없음 (HAR-04)'
  ],
  'IMG-004': [
    '하중계를 지반 내부에 배치',
    '정착장·그라우트체 내부에 하중계',
    '자유장 중간에 하중계 삽입',
    '반력판 없이 벽체 직접 부착',
    '인장력 T와 압축 반력 P를 단일 화살표로 혼동',
    'P=T 단일 표기 (ANC-AXIS)',
    '수평 버팀보형 앵커 두부 (ANC-AXIS)',
    '앵커 강연선이 굴착측(공중)으로 향함',
    '설치도 하단 서버·모바일 데이터 흐름도 (P0-4)'
  ],
  'IMG-025': [
    '지중경사계를 침하계처럼 표현',
    '「지중경사계」단독 Figure 라벨 — 센서형 다단식 전칭 필수',
    '케이싱 4홈·프로브 휠 누락',
    '안정층 근입 없이 중단',
    '수평변위를 수직 침하로 표현'
  ],
  'IMG-089': [
    '지중경사계 보링 casing',
    '풍경화·숲',
    '구조물경사계(IMG-038)',
    '지표경사계 pad·θ 미표기 (SLO-TILT-01)',
    'pad 없이 지중 매설',
    '흙막이·교량 풍경 맥락'
  ],
  'IMG-090': [
    '사면 외부 ATS 부동점 누락',
    '풍경 hero',
    'ATS 옹벽·사면 꼭대기 부착 (SLO-STR-01)',
    '프리즘 측점 누락',
    '시준선(점선) 누락',
    '흙막이 굴착·교량 풍경 맥락'
  ],
  'IMG-091': [
    '지중경사계 혼동',
    '수평변위 화살표만',
    '신축계(039) 교량 이음부 (MPX-02)',
    '단일 강봉만 — 다점 앵커 없음 (MPX-03)',
    '보링 GL well cap 누락 (P0-2)',
    '4홈 casing·프로브 휠 (MPX-01)'
  ],
  'IMG-027': [
    '활동면·변위 집중 심도 미표시',
    '안정층 근입 누락'
  ],
  'IMG-030': [
    '벽체 부착 센서로 표현',
    '토압계·간극수압계와 혼동',
    '수위선 없이 센서만 표시'
  ],
  'IMG-031': [
    '지하수위 관측공 전체 개방으로 표현',
    '수위선만 표시하고 필터·차수 누락',
    '벽체 표면 센서로 표현'
  ],
  'IMG-034': [
    '감지면 방향 없는 원형 아이콘',
    '관측공 내부 설치',
    '굴착측 앞면 임의 부착'
  ],
  'IMG-035': [
    '버팀보 정중앙 하중계',
    '축방향과 무관한 설치',
    '옆면 장식처럼 배치'
  ],
  'IMG-008': [
    '천단침하계처럼 상하 측정',
    'ACE-TCS를 2점 거리만으로 표현',
    'Extension Tube 체인 누락',
    '센서가 터널 중앙에 부유',
    '360° 원형 폐합·invert·노반 Kit',
    'P측점·체인이 건축한계 Envelope 내부',
    'Envelope 캡션 통행구간 센서 밀착',
    '노반 아래 Extension Tube 캡션'
  ],
  'IMG-015': [
    '사면 꼭대기·활동 구간에 자동광파기 본체',
    '지중경사계 Base가 활동면만 간신히 통과',
    '간극수압계가 G.W.L 위·수평 누운 형태',
    '수평변위 화살표 좌우 지그재그',
    '사면에 광파기·부동점에 측점 역전'
  ],
  'IMG-037': ['균열과 평행 설치', '균열 없이 센서만 부착'],
  'IMG-038': ['지중경사계와 혼동', '지반 내부 센서로 표현'],
  'IMG-045': [
    '내부 CPU·저장·통신 블록 다이어그램만',
    '정사각 접속함·DATA LOGGER 세로 박스',
    '브랜드·CR1000X 모델명 인쇄',
    '흙막이 단면 주 화면'
  ],
  'IMG-045': [
    '내부 CPU·저장·통신 블록 다이어그램만',
    '정사각 접속함·DATA LOGGER 세로 박스',
    '브랜드·CR1000X 모델명 인쇄',
    '흙막이 단면 주 화면'
  ],
  'IMG-048': [
    'LTE 모뎀·통신사 브랜드 로고',
    '센서·로거 생략',
    '클라우드 UI 스크린샷 복사'
  ],
  'IMG-056': [
    '실제 URL·회사 로고',
    '과도한 대시보드 장식·광고 배너',
    '읽을 수 없는 한글 라벨'
  ],
  'IMG-058': [
    '내부 CPU 블록만 표현',
    'CR1000X 실사·브랜드',
    '흙막이·터널 단면 주 화면'
  ],
  'IMG-043': [
    '기준국을 변형 구간에 배치',
    '이동국·기준국 역할 역전',
    '광파기·프리즘·레이저스캐너 표현',
    '기준국 없이 단일 안테나만',
    'book/GNSS.pdf 제조사 로고·상표 복사'
  ],
  'IMG-042': ['CCTV·카메라 표현', '프리즘·시준선 없음', '레이저스캐너 혼동']
};

function priorityOf(id) {
  if (priority.P1.includes(id)) return 'P1';
  if (priority.P2.includes(id)) return 'P2';
  if (priority.P3.includes(id)) return 'P3';
  return null;
}

const existing = readJsonSafe(registryPath, {});

const out = { ...existing };
for (const item of master) {
  const id = item.id;
  const hasPng = pngOnDisk.has(id);
  const inRejected = readdirSync(rejectedDir).some((f) => f.startsWith(id + '_'));
  const prev = existing[id] || {};

  let status = prev.status;
  let reviewGrade = prev.reviewGrade;
  if (!status) {
    if (inRejected) {
      status = 'rejected';
      reviewGrade = 'DELETE';
    } else if (!hasPng) {
      status = 'pending';
      reviewGrade = null;
    } else {
      status = 'reviewed';
      reviewGrade = prev.reviewGrade || 'PASS';
    }
  }

  // Preserve figure-production / visualReview / migration fields from register-external-figure & phase seeds.
  out[id] = {
    ...prev,
    id,
    title: item.title,
    status,
    reviewGrade,
    reviewDoc: prev.reviewDoc || `docs/IMAGE_REVIEW_LOG.md#${id}`,
    reviewDate: prev.reviewDate || (hasPng && status === 'reviewed' ? '2026-06-25' : null),
    reviewer: prev.reviewer || (hasPng && status === 'reviewed' ? '일괄 마이그레이션' : null),
    auditPriority: prev.auditPriority ?? priorityOf(id),
    requiresReaudit: prev.requiresReaudit ?? priorityOf(id) === 'P1',
    prohibitedErrors:
      prev.prohibitedErrors?.length > 0
        ? prev.prohibitedErrors
        : PROHIBITED_BY_PREFIX[id] || [],
    notes: prev.notes ?? null
  };
  if (prev.prohibitedVerified) {
    out[id].prohibitedVerified = true;
    out[id].prohibitedVerifiedDate = prev.prohibitedVerifiedDate || out[id].reviewDate;
    out[id].prohibitedVerifiedNote = prev.prohibitedVerifiedNote ?? null;
  }
}

atomicWriteUtf8(registryPath, JSON.stringify(out, null, 2) + '\n');
console.log('Wrote', registryPath, Object.keys(out).length, 'entries');
