/**
 * 운영 사이트 핵심 반영 여부 확인.
 * Usage: node scripts/verify-production.mjs
 */
const BASE = 'https://www.nmti.co.kr';

const checks = [
  {
    name: '홈 12분야',
    url: BASE + '/homepage/',
    must: ['건설 계측 12분야', '항만·해안', '건축·인접 구조물', '구조물 안전', '기초·말뚝', '환경·민원', '4층 403호', '2025년 주요 실적']
  },
  {
    name: '지중경사계 정적',
    url: BASE + '/homepage/sensors/inclinometer/',
    must: ['지중경사계 기술 가이드', '4층 403호'],
    mustNot: ['인클리노미터라고도']
  },
  {
    name: '기술자료 SPA 셸',
    url: BASE + '/homepage/technology/',
    must: ['4층 403호']
  },
  {
    name: 'SEO 누수',
    url: BASE + '/homepage/technology/fields/dam/leakage/',
    must: ['tech-seo-hero', '누수']
  },
  {
    name: '막장전방 선행변위 SEO',
    url: BASE + '/homepage/technology/fields/tunnel/face-advance/',
    must: ['막장전방', '선행변위', 'IMG-063'],
    mustNot: ['터널 지표침하 계측도', 'IMG-007_터널-계측-전체']
  },
  {
    name: '강지보 응력 SEO',
    url: BASE + '/homepage/technology/fields/tunnel/steel-support/',
    must: ['강지보', 'IMG-080', 'tech-seo-hero']
  },
  {
    name: '하천제방 SEO',
    url: BASE + '/homepage/technology/fields/dam/river-levee/',
    must: ['하천제방', 'tech-seo-hero']
  },
  {
    name: '발파진동 SEO',
    url: BASE + '/homepage/technology/fields/tunnel/blast-vibration/',
    must: ['발파진동', '영향권', 'IMG-097', 'tech-seo-hero'],
    mustNot: ['IMG-041_진동계']
  },
  {
    name: '항만·호안 IMG-064 SEO',
    url: BASE + '/homepage/technology/fields/harbor/',
    must: ['항만·호안', 'IMG-064', 'tech-seo-hero'],
    mustNot: ['IMG-001_가시설']
  },
  {
    name: '흙막이 주변지반 SEO',
    url: BASE + '/homepage/technology/fields/retaining-excavation/surrounding-ground/',
    must: ['주변지반', 'IMG-096', '주변지반 계측', 'tech-seo-hero'],
    mustNot: ['IMG-032_침하판']
  },
  {
    name: '항만 주변지반 SEO',
    url: BASE + '/homepage/technology/fields/harbor/surrounding-ground/',
    must: ['주변지반', 'IMG-064', 'tech-seo-hero'],
    mustNot: ['IMG-032_침하판']
  },
  {
    name: 'GNSS PDF',
    url: BASE + '/homepage/book/GNSS.pdf',
    pdf: true
  },
  {
    name: 'GNSS SEO',
    url: BASE + '/homepage/technology/sensors/gnss/',
    must: ['GNSS', 'IMG-043', '기준국', '이동국', 'RTK', 'tech-seo-hero', '/homepage/book/GNSS.pdf'],
    mustNot: ['자동광파기 계측 개념도', 'IMG-042_']
  },
  {
    name: '내공변위 SEO',
    url: BASE + '/homepage/technology/fields/tunnel/convergence/',
    must: ['전단면', 'IMG-008', '노반', '미계측', 'P1~P11', '건축한계', '기준 측정선', '측선', 'tech-seo-hero'],
    mustNot: ['ACE-TCS', 'ACE', 'P8', 'P1~P8', '360°', '진동현식']
  },
  {
    name: 'LTE M2M SEO',
    url: BASE + '/homepage/technology/instruments/communication/lte-remote/',
    must: ['LTE M2M', 'IMG-048', '모뎀', 'tech-seo-hero'],
    mustNot: ['LTE 원격통신', 'LTE 원격계측']
  },
  // Phase 5 Pillow v2 — sensor SEO (AUTO-01·CLS-01·EXC-03)
  {
    name: '지중경사계 IMG-025 hero',
    url: BASE + '/homepage/sensors/inclinometer/',
    must: ['IMG-025', '데이터로거', '지중경사계'],
    mustNot: ['인클리노미터라고도']
  },
  {
    name: '지하수위계 Phase5 SEO',
    url: BASE + '/homepage/technology/sensors/water-level-meter/',
    must: ['IMG-030', 'well cap', 'tech-seo-hero', '개방 G.W.L'],
    mustNot: ['진동현식']
  },
  {
    name: '간극수압계 Phase5 SEO',
    url: BASE + '/homepage/technology/sensors/piezometer/',
    must: ['IMG-031', 'junction', 'tech-seo-hero', '≠ 관측공'],
    mustNot: ['진동현식', 'VW 간극']
  },
  {
    name: '토압계 Phase5 SEO',
    url: BASE + '/homepage/technology/sensors/earth-pressure-cell/',
    must: ['IMG-034', '배면', 'tech-seo-hero', '감지면']
  },
  {
    name: '하중계 Phase5 SEO',
    url: BASE + '/homepage/technology/sensors/load-cell/',
    must: ['IMG-035', '띠장 접합부', 'tech-seo-hero', '어스앵커']
  },
  {
    name: '흙막이 벽체 IMG-002 hero',
    url: BASE + '/homepage/technology/fields/retaining-excavation/earth-retaining-wall/',
    must: ['IMG-002', 'tech-seo-hero', '인접 구조물 | 배면'],
    mustNot: ['IMG-001_가시설']
  },
  // Phase 4 bridge BRI-01 — og:image ≠ 굴착·흙막이 Figure
  {
    name: '교량 교대 BRI SEO',
    url: BASE + '/homepage/technology/fields/bridge/abutment/',
    must: ['IMG-038', 'tech-seo-hero', '교대'],
    mustNot: ['IMG-001_가시설', 'IMG-002_흙막이', 'IMG-005_주변건물']
  },
  {
    name: '교량 신축이음량 BRI SEO',
    url: BASE + '/homepage/technology/fields/bridge/expansion-joint/',
    must: ['IMG-014', 'tech-seo-hero', '신축이음량'],
    mustNot: ['IMG-001_가시설', 'IMG-002_흙막이']
  },
  {
    name: '교량 처짐 SEO',
    url: BASE + '/homepage/technology/fields/bridge/deflection/',
    must: ['IMG-103', 'tech-seo-hero', '처짐'],
    mustNot: ['IMG-001_가시설', 'IMG-085']
  },
  {
    name: '교량 받침부 변위 SEO',
    url: BASE + '/homepage/technology/fields/bridge/bearing-displacement/',
    must: ['IMG-110', 'tech-seo-hero', '받침'],
    mustNot: ['IMG-085', 'deck-displacement']
  },
  {
    name: '교량 케이블 장력 SEO',
    url: BASE + '/homepage/technology/fields/bridge/cable-tension/',
    must: ['IMG-105', 'tech-seo-hero', '케이블'],
    mustNot: ['IMG-004', '진동현식']
  },
  {
    name: '교량 변형률 SEO',
    url: BASE + '/homepage/technology/fields/bridge/strain-stress/',
    must: ['IMG-107', 'tech-seo-hero', '변형률'],
    mustNot: ['IMG-001_가시설']
  },
  {
    name: '교량 풍하동 SEO',
    url: BASE + '/homepage/technology/fields/bridge/wind/',
    must: ['IMG-109', 'tech-seo-hero', '풍'],
    mustNot: ['IMG-015']
  },
  {
    name: '교량 분야 BRI SEO',
    url: BASE + '/homepage/technology/fields/bridge/',
    must: ['IMG-011', 'tech-seo-hero', '교량'],
    mustNot: ['IMG-001_가시설', 'IMG-002_흙막이']
  }
];

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'NMTI-verify/1.0' },
    redirect: 'follow'
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.text();
}

async function verifyPdf(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'NMTI-verify/1.0', Range: 'bytes=0-4' },
    redirect: 'follow'
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const type = res.headers.get('content-type') || '';
  if (!type.includes('pdf') && !type.includes('octet-stream')) {
    throw new Error('unexpected content-type: ' + type);
  }
}

let failed = 0;
for (const c of checks) {
  try {
    if (c.pdf) {
      await verifyPdf(c.url);
      console.log('OK  ', c.name);
      continue;
    }
    const html = await fetchText(c.url);
    const missing = c.must.filter((s) => !html.includes(s));
    const forbidden = (c.mustNot || []).filter((s) => html.includes(s));
    if (missing.length || forbidden.length) {
      failed++;
      console.log('FAIL', c.name, c.url);
      if (missing.length) console.log('  missing:', missing.join(', '));
      if (forbidden.length) console.log('  forbidden:', forbidden.join(', '));
    } else {
      console.log('OK  ', c.name);
    }
  } catch (e) {
    failed++;
    console.log('ERR ', c.name, e.message);
  }
}

process.exit(failed ? 1 : 0);
