/**
 * Format KDS/KCS sources as markdown (prompts · internal docs).
 */
import { getRegistry } from './resolve-citations.mjs';

/**
 * @param {object[]} sources
 * @param {{ nodeId?: string, intro?: string }} [opts]
 */
export function formatSourcesMarkdown(sources, opts = {}) {
  const reg = getRegistry();
  const lines = [];
  if (opts.nodeId) {
    lines.push(`> **노드:** \`${opts.nodeId}\` · 레지스트리: \`book/kds-kcs-citation-registry.json\``);
    lines.push('');
  }
  for (const s of sources) {
    const doc = reg.documents[s.docId];
    if (!doc) {
      lines.push(`- ${s.docId} ${s.cite || ''}${s.label ? ` — ${s.label}` : ''}`);
      continue;
    }
    const cite = s.cite && s.cite !== '—' ? ` ${s.cite}` : '';
    const title = doc.fullTitle ? `「${doc.fullTitle}」` : '';
    const label = s.label ? ` — ${s.label}` : '';
    const grade =
      s.grade && !['A', 'B'].includes(s.grade) ? ` *[${s.grade}]*` : '';
    lines.push(
      `- **${doc.shortTitle}${doc.edition}**${title}${cite}${label}${grade} (${doc.publisher})`
    );
  }
  lines.push('');
  lines.push(reg.disclaimer);
  return lines.join('\n');
}

/**
 * @param {object[]} sources
 * @param {{ nodeId?: string }} [opts]
 */
export function formatSourcesBlock(sources, opts = {}) {
  return `## 근거 기준\n\n${formatSourcesMarkdown(sources, opts)}`;
}

export const CITATION_SYNC_START = '<!-- citation-sync:v1 -->';
export const CITATION_SYNC_END = '<!-- /citation-sync:v1 -->';

/**
 * @param {string} body
 * @param {string} blockInner — without markers
 */
export function injectCitationBlock(body, blockInner) {
  const wrapped = `${CITATION_SYNC_START}\n${blockInner}\n${CITATION_SYNC_END}`;
  const re = new RegExp(
    `${escapeRe(CITATION_SYNC_START)}[\\s\\S]*?${escapeRe(CITATION_SYNC_END)}`,
    'm'
  );
  if (re.test(body)) {
    return body.replace(re, wrapped);
  }
  const neg = body.search(/^## 4\.\s/m);
  if (neg >= 0) {
    return body.slice(0, neg) + wrapped + '\n\n' + body.slice(neg);
  }
  const sec5 = body.search(/^## 5\.\s/m);
  if (sec5 >= 0) {
    return body.slice(0, sec5) + wrapped + '\n\n' + body.slice(sec5);
  }
  const hr = body.indexOf('\n---\n');
  if (hr >= 0) {
    return body.slice(0, hr) + '\n\n' + wrapped + body.slice(hr);
  }
  return body.trimEnd() + '\n\n' + wrapped + '\n';
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
