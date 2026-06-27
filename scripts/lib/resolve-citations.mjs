/**
 * Resolve KDS/KCS standard sources for a technology content node.
 * Registry: book/kds-kcs-citation-registry.json
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, '..', '..', 'book', 'kds-kcs-citation-registry.json');

/** @type {import('./resolve-citations.types').CitationRegistry | null} */
let registry = null;

function loadRegistry() {
  if (!registry) {
    registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
  }
  return registry;
}

/**
 * @param {string} nodeId
 * @returns {string | null}
 */
export function parentCategoryId(nodeId) {
  if (!nodeId || nodeId === 'intro') return null;
  const parts = nodeId.split('/');
  if (parts[0] === 'fields' && parts.length >= 3) {
    return `${parts[0]}/${parts[1]}`;
  }
  if (parts[0] === 'instruments' && parts.length >= 3) {
    if (parts[1] === 'modes') return 'instruments/modes/overview';
    if (parts[1] === 'datalogger') return 'instruments/datalogger/static';
    if (parts[1] === 'communication') return 'instruments/communication/iot-gateway';
    if (parts[1] === 'power') return 'instruments/power/overview';
  }
  return null;
}

/**
 * @param {string} nodeId
 * @param {object} reg
 * @returns {object[]}
 */
function resolvePrefixDefaults(nodeId, reg) {
  const entries = reg.prefixDefaults || [];
  let best = null;
  let bestLen = 0;
  for (const entry of entries) {
    if (nodeId.startsWith(entry.prefix) && entry.prefix.length > bestLen) {
      best = entry;
      bestLen = entry.prefix.length;
    }
  }
  return best?.sources ? [...best.sources] : [];
}

/**
 * @param {string} nodeId
 * @returns {{ sources: object[], disclaimer: string }}
 */
export function resolveSourcesForNode(nodeId) {
  const reg = loadRegistry();
  if (nodeId === 'intro') {
    return { sources: [...(reg.intro || [])], disclaimer: reg.disclaimer };
  }

  if (reg.nodes?.[nodeId]) {
    return { sources: [...reg.nodes[nodeId]], disclaimer: reg.disclaimer };
  }

  if (reg.categories?.[nodeId]) {
    return { sources: [...reg.categories[nodeId]], disclaimer: reg.disclaimer };
  }

  const parent = parentCategoryId(nodeId);
  if (parent && reg.categories?.[parent]) {
    return { sources: [...reg.categories[parent]], disclaimer: reg.disclaimer };
  }

  const prefixSources = resolvePrefixDefaults(nodeId, reg);
  if (prefixSources.length) {
    return { sources: prefixSources, disclaimer: reg.disclaimer };
  }

  return {
    sources: [
      { grade: 'A', docId: 'KDS-11-10-15', cite: '§1', label: '지반계측 일반' },
      { grade: 'D', docId: 'KDS-11-10-15', cite: '—', label: '설계도서·계측관리계획서·발주처 기준' }
    ],
    disclaimer: reg.disclaimer
  };
}

/**
 * @param {object} source
 * @param {object} reg
 */
function formatSourceLine(source, reg) {
  const doc = reg.documents[source.docId];
  if (!doc) return `· ${source.docId} ${source.cite}`;
  const cite = source.cite === '—' ? '' : ` ${source.cite}`;
  const title = doc.fullTitle ? `「${doc.fullTitle}」` : '';
  const label = source.label ? ` — ${source.label}` : '';
  const grade =
    source.grade && source.grade !== 'A' && source.grade !== 'B'
      ? ` <span class="tech-sources__grade">[${source.grade}]</span>`
      : '';
  return (
    `· <strong>${doc.shortTitle}${doc.edition}</strong>${title}${cite}${label}` +
    `${grade} <span class="tech-sources__publisher">(${doc.publisher})</span>`
  );
}

/**
 * @param {string} nodeId
 * @returns {string}
 */
export function sourcesToHtml(nodeId) {
  const reg = loadRegistry();
  const { sources, disclaimer } = resolveSourcesForNode(nodeId);
  const items = sources
    .map((s) => `<li class="tech-sources__item">${formatSourceLine(s, reg)}</li>`)
    .join('');
  return (
    `<div class="tech-sources" id="sources">` +
    `<h2 class="tech-sources__title">근거 기준</h2>` +
    `<ul class="tech-sources__list">${items}</ul>` +
    `<p class="tech-sources__disclaimer">${disclaimer}</p>` +
    `</div>`
  );
}

/**
 * @param {string} nodeId
 * @returns {object[]}
 */
export function resolveStandardSources(nodeId) {
  return resolveSourcesForNode(nodeId).sources;
}

export function getRegistry() {
  return loadRegistry();
}
