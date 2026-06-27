import { getNode } from './dictionary.js';

/** Leaf label with field-category prefix when needed (e.g. 교량 처짐). */
export function seoDisplayTitle(nodeId, label) {
  if (!label) return label || '';
  if (!nodeId || !nodeId.includes('/')) return label;
  const parts = nodeId.split('/');
  if (parts[0] !== 'fields' || parts.length < 3) return label;
  const fieldCategoryId = parts[0] + '/' + parts[1];
  const parent = getNode(fieldCategoryId);
  if (!parent?.label) return label;
  return parent.label + ' ' + label;
}

const DESC_SUFFIX =
  '의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 공종·센서를 정리한 기술 자료입니다.';

/** Meta description aligned with display title (fixes duplicate short-label descriptions). */
export function seoMetaDescription(nodeId, label, metaDescription) {
  const displayTitle = seoDisplayTitle(nodeId, label);
  const newDefault = displayTitle + DESC_SUFFIX;
  if (!metaDescription) return newDefault;
  if (metaDescription.startsWith(label + '의 측정 목적')) {
    return displayTitle + metaDescription.slice(label.length);
  }
  return metaDescription;
}

const PAGE_SUFFIX = ' | 건설 계측 기술 자료 | NMTI';

/** Full document title for static SEO pages and SPA. */
export function seoPageTitle(nodeId, label) {
  if (!nodeId || nodeId === 'intro') return '건설 계측 기술 자료 | NMTI';
  const displayTitle = seoDisplayTitle(nodeId, label || '');
  return displayTitle + PAGE_SUFFIX;
}
