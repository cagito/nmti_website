/**
 * 기술문서 본문 — 키워드·액션 중심 압축 (조사·종결어미 축약)
 * 정본: build-content-data.mjs 에서 sections 빌드 시 적용
 */

const NARRATIVE_KEYS = new Set([
  'overview',
  'principle',
  'installation',
  'criteria',
  'siteLayout',
  'troubleshooting'
]);

const VERB_TAIL = [
  [/을\s+확정합니다\.?/gu, ' 확정'],
  [/를\s+확정합니다\.?/gu, ' 확정'],
  [/을\s+선정합니다\.?/gu, ' 선정'],
  [/를\s+선정합니다\.?/gu, ' 선정'],
  [/을\s+설치합니다\.?/gu, ' 설치'],
  [/를\s+설치합니다\.?/gu, ' 설치'],
  [/을\s+배치합니다\.?/gu, ' 배치'],
  [/를\s+배치합니다\.?/gu, ' 배치'],
  [/을\s+기록합니다\.?/gu, ' 기록'],
  [/를\s+기록합니다\.?/gu, ' 기록'],
  [/을\s+운영합니다\.?/gu, ' 운영'],
  [/를\s+운영합니다\.?/gu, ' 운영'],
  [/을\s+적용합니다\.?/gu, ' 적용'],
  [/를\s+적용합니다\.?/gu, ' 적용'],
  [/을\s+구축합니다\.?/gu, ' 구축'],
  [/를\s+구축합니다\.?/gu, ' 구축'],
  [/을\s+설정합니다\.?/gu, ' 설정'],
  [/를\s+설정합니다\.?/gu, ' 설정'],
  [/을\s+수립합니다\.?/gu, ' 수립'],
  [/를\s+수립합니다\.?/gu, ' 수립'],
  [/을\s+실시합니다\.?/gu, ' 실시'],
  [/를\s+실시합니다\.?/gu, ' 실시'],
  [/을\s+검토합니다\.?/gu, ' 검토'],
  [/를\s+검토합니다\.?/gu, ' 검토'],
  [/을\s+확인합니다\.?/gu, ' 확인'],
  [/를\s+확인합니다\.?/gu, ' 확인'],
  [/을\s+추적합니다\.?/gu, ' 추적'],
  [/를\s+추적합니다\.?/gu, ' 추적'],
  [/을\s+연동합니다\.?/gu, ' 연동'],
  [/를\s+연동합니다\.?/gu, ' 연동'],
  [/을\s+전환합니다\.?/gu, ' 전환'],
  [/를\s+전환합니다\.?/gu, ' 전환'],
  [/을\s+따릅니다\.?/gu, ' 준수'],
  [/를\s+따릅니다\.?/gu, ' 준수'],
  [/을\s+마련합니다\.?/gu, ' 마련'],
  [/를\s+마련합니다\.?/gu, ' 마련'],
  [/을\s+반영해\s+/gu, ' 반영 — '],
  [/를\s+반영해\s+/gu, ' 반영 — '],
  [/을\s+일치시키고\s+/gu, ' 일치 · '],
  [/를\s+일치시키고\s+/gu, ' 일치 · ']
];

const PHRASE = [
  [/계측관리계획서에\s+따라\s*/gu, '계측관리계획서 기준 — '],
  [/설계\s+도면·지반조사에\s+따라\s*/gu, '설계·지반조사 기준 — '],
  [/철도\s+운영·안전\s+규정에\s+따라\s*/gu, '철도 운영·안전 규정 기준 — '],
  [/설계\s+계측\s+계획에\s+따라\s*/gu, '설계 계측 계획 기준 — '],
  [/계측\s+목적\(시공·공용·재하시험\)에\s+따라\s*/gu, '계측 목적(시공·공용·재하시험) 기준 — '],
  [/에\s+따라\s+/gu, ' 기준 '],
  [/에\s+맞게\s+/gu, ' 기준 '],
  [/에\s+맞춰\s+/gu, ' 기준 '],
  [/을\s+위해\s+/gu, ' '],
  [/를\s+위해\s+/gu, ' '],
  [/하고\s+/gu, '·'],
  [/하며\s+/gu, '·'],
  [/하여\s+/gu, ' → '],
  [/합니다\.?/gu, ''],
  [/습니다\.?/gu, ''],
  [/됩니다\.?/gu, ''],
  [/입니다\.?/gu, ''],
  [/있습니다\.?/gu, '']
];

function tidy(s) {
  return s
    .replace(/\s{2,}/gu, ' ')
    .replace(/\s*·\s*/gu, ' · ')
    .replace(/\s*→\s*/gu, ' → ')
    .replace(/^[\s·→—]+/u, '')
    .replace(/[\s.]+$/u, '')
    .trim();
}

/** @param {string} text */
export function compactActionPhrase(text) {
  if (!text || typeof text !== 'string') return text;
  let s = text.trim();
  if (!s) return s;

  for (const [re, rep] of VERB_TAIL) {
    s = s.replace(re, rep);
  }
  for (const [re, rep] of PHRASE) {
    s = s.replace(re, rep);
  }
  return tidy(s);
}

/** @param {string} html */
function compactHtmlText(html) {
  if (!html) return html;
  let s = html;
  for (const [re, rep] of VERB_TAIL) {
    s = s.replace(re, rep);
  }
  for (const [re, rep] of PHRASE) {
    s = s.replace(re, rep);
  }
  return tidy(s);
}

/** @param {string} html */
export function compactNarrativeHtml(html) {
  if (!html || typeof html !== 'string') return html;
  if (html.includes('<ol') || html.includes('<ul') || html.includes('<table')) {
    return html.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, function (_, body) {
      return '<p>' + compactHtmlText(body) + '</p>';
    });
  }
  return html.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, function (_, body) {
    return '<p>' + compactHtmlText(body) + '</p>';
  });
}

/** @param {Record<string, unknown>} sections */
export function compactSections(sections) {
  if (!sections || typeof sections !== 'object') return;

  if (Array.isArray(sections.installation)) {
    sections.installation = sections.installation.map(compactActionPhrase);
  } else if (typeof sections.installation === 'string') {
    sections.installation = compactNarrativeHtml(sections.installation);
  }

  if (Array.isArray(sections.applications)) {
    sections.applications = sections.applications.map(compactActionPhrase);
  }

  if (Array.isArray(sections.criteria)) {
    sections.criteria = sections.criteria.map(compactActionPhrase);
  }

  for (const key of NARRATIVE_KEYS) {
    if (key === 'installation' || key === 'criteria') continue;
    const val = sections[key];
    if (typeof val === 'string' && val.trim()) {
      sections[key] = compactNarrativeHtml(val);
    }
  }
}
