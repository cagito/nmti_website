function withLeadingSlash(value) {
  if (!value) return '/';
  return value.startsWith('/') ? value : '/' + value;
}

function withTrailingSlash(value) {
  return value.endsWith('/') ? value : value + '/';
}

function publicBaseFromEnv() {
  const value = typeof process !== 'undefined' ? process.env.PUBLIC_BASE : '';
  return withTrailingSlash(withLeadingSlash(value || '/homepage/'));
}

function siteRootFromRuntime() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return publicBaseFromEnv();
  }
  return withTrailingSlash(new URL('../', import.meta.url).pathname);
}

const SITE_ROOT_URL = new URL('../', import.meta.url);

export const SITE_ROOT = siteRootFromRuntime();
export const TECHNOLOGY_ROOT = SITE_ROOT + 'technology';

export function assetPath(path) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return SITE_ROOT + String(path).replace(/^\/+/, '');
  }
  return new URL(String(path).replace(/^\/+/, ''), SITE_ROOT_URL).pathname;
}
