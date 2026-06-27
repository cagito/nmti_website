/**
 * Compact KDS/KCS cite for table columns (docs/36, IMAGE_REVIEW_LOG).
 */
import { getRegistry } from './resolve-citations.mjs';

/**
 * @param {object[]} sources
 * @param {{ max?: number }} [opts]
 * @returns {string}
 */
export function formatCiteShort(sources, opts = {}) {
  const max = opts.max ?? 2;
  if (!Array.isArray(sources) || !sources.length) return '—';
  const reg = getRegistry();
  const parts = sources
    .filter((s) => s.grade === 'A' || s.grade === 'B')
    .slice(0, max)
    .map((s) => {
      const doc = reg.documents[s.docId];
      if (!doc) return `${s.docId}${s.cite && s.cite !== '—' ? ` ${s.cite}` : ''}`;
      const cite = s.cite && s.cite !== '—' ? ` ${s.cite}` : '';
      return `${doc.shortTitle}${doc.edition}${cite}`;
    });
  return parts.length ? parts.join(' · ') : '—';
}
