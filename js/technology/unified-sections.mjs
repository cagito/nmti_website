export const UNIFIED_KEYS = ['overview', 'purpose', 'principle', 'installation', 'management'];

export const UNIFIED_TITLES = {
  field: ['계측 개요', '주요 계측 항목', '대표 단면·원리', '설치·운영', '해석·관리'],
  sensor: ['센서 개요', '측정 목적·적용', '측정 원리', '설치·운영', '해석·유지관리'],
  system: ['시스템 개요', '구성 요소', '현장 구성·원리', '설치·운영', '데이터·관리'],
  default: ['개요', '계측 목적', '측정 원리', '설치·운영', '해석·관리']
};

export const APPENDIX = [
  ['related', '관련 항목'],
  ['faq', '자주 묻는 질문']
];

export const SYSTEM_SENSOR_IDS = new Set(['sensors/datalogger', 'sensors/remote-monitoring-system']);

export function pageContextFor(data) {
  const id = data?.id ? String(data.id) : '';
  if (id === 'intro') return 'default';
  if (data?.sections?.purposeLayout === 'strip') return 'system';
  if (id.startsWith('instruments/') || SYSTEM_SENSOR_IDS.has(id)) return 'system';
  if (id.startsWith('sensors/')) return 'sensor';
  if (id.startsWith('fields/')) return 'field';
  return 'default';
}

export function unifiedTitlesFor(data) {
  return UNIFIED_TITLES[pageContextFor(data)] || UNIFIED_TITLES.default;
}

export function hasUnifiedContent(key, data) {
  const s = data.sections || {};
  const imgs = data.sectionImages || {};
  switch (key) {
    case 'overview':
      return !!s.overview;
    case 'purpose':
      return !!(
        (Array.isArray(s.purpose) && s.purpose.length) ||
        (typeof s.purpose === 'string' && s.purpose.trim()) ||
        (Array.isArray(s.applications) && s.applications.length)
      );
    case 'principle':
      return !!(s.principle || s.siteLayout || imgs.principle?.length || imgs.siteLayout?.length);
    case 'installation':
      return !!(
        (typeof s.installation === 'string' && s.installation.trim()) ||
        (Array.isArray(s.installation) && s.installation.length) ||
        s.constructionPhases?.rows?.length
      );
    case 'management':
      return !!(
        s.data?.rows?.length ||
        (typeof s.criteria === 'string' && s.criteria.trim()) ||
        (Array.isArray(s.criteria) && s.criteria.length) ||
        s.troubleshooting?.rows?.length
      );
    case 'related':
      return !!(s.related?.fields?.length || s.related?.sensors?.length);
    case 'faq':
      return Array.isArray(s.faq) && s.faq.length > 0;
    default:
      return false;
  }
}

export function sectionFiguresFor(key, data) {
  const imgs = data.sectionImages || {};
  if (key === 'principle') {
    return [...(imgs.principle || []), ...(imgs.siteLayout || [])];
  }
  return imgs[key] || [];
}

export function missingUnifiedSections(data) {
  return UNIFIED_KEYS.filter(function (key) {
    return !hasUnifiedContent(key, data);
  });
}
