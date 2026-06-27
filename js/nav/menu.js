/** Shared site navigation configuration */

export const HOME_URL = '/homepage/';
export const LOGO_SRC = '/homepage/assets/logo.svg';
export const LOGO_WIDTH = 300;
export const LOGO_HEIGHT = 52;

/** @typedef {{ id: string, label: string, hash?: string, path?: string, cta?: boolean }} NavItem */

/** @type {NavItem[]} */
export const NAV_ITEMS = [
  { id: 'about', label: '회사소개', hash: 'about' },
  { id: 'fields', label: '계측분야', hash: 'fields' },
  { id: 'approach', label: '해결방식', hash: 'approach' },
  { id: 'certifications', label: '기술역량', hash: 'certifications' },
  { id: 'technology', label: '기술자료', path: '/homepage/technology/' },
  { id: 'contact', label: '연락', hash: 'contact', cta: true }
];

/**
 * @param {NavItem} item
 * @param {'home' | 'subpage'} variant
 */
export function resolveNavHref(item, variant) {
  if (item.path) return item.path;
  if (!item.hash) return '#';
  return variant === 'home' ? '#' + item.hash : HOME_URL + '#' + item.hash;
}

/**
 * @param {'home' | 'subpage'} variant
 */
export function resolveLogoHref(variant) {
  return variant === 'home' ? '#hero' : HOME_URL;
}
