/**
 * JSON-LD isBasedOn from standardSources (docs/40 §4.4).
 */
import { getRegistry } from './resolve-citations.mjs';

const KCSC = 'https://www.kcsc.re.kr';

/**
 * @param {object[] | undefined} sources
 * @returns {object[]}
 */
export function sourcesToJsonLd(sources) {
  if (!Array.isArray(sources) || !sources.length) return [];
  const reg = getRegistry();
  return sources
    .filter((s) => s.grade === 'A' || s.grade === 'B')
    .slice(0, 3)
    .map((s) => {
      const doc = reg.documents[s.docId];
      if (!doc) return null;
      const name = `${doc.shortTitle}${doc.edition} ${doc.fullTitle}${s.cite && s.cite !== '—' ? ` ${s.cite}` : ''}`.trim();
      return {
        '@type': 'CreativeWork',
        name,
        publisher: { '@type': 'Organization', name: doc.publisher },
        url: KCSC
      };
    })
    .filter(Boolean);
}
