/**
 * Build-time section normalization — 5섹션 통일 형식으로 변환
 */

function extractListItems(html) {
  const items = [];
  String(html).replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, function (_, body) {
    const trimmed = body.trim();
    if (trimmed) items.push(trimmed);
    return '';
  });
  return items;
}

/** @param {Record<string, unknown>} sections */
export function normalizeSections(sections) {
  if (!sections || typeof sections !== 'object') return;

  if (typeof sections.installation === 'string' && sections.installation.trim()) {
    const html = sections.installation;
    if (/<ol\b|<ul\b/i.test(html)) {
      const items = extractListItems(html);
      if (items.length) sections.installation = items;
    } else if (!html.includes('<')) {
      sections.installation = [html.trim()];
    }
  }

  if (typeof sections.criteria === 'string' && sections.criteria.trim()) {
    const html = sections.criteria;
    if (/<ul\b/i.test(html) && !/<table\b/i.test(html)) {
      const items = extractListItems(html);
      if (items.length >= 2) sections.criteria = items;
    }
  }

  if (Array.isArray(sections.purpose)) {
    sections.purpose = sections.purpose.map(function (card) {
      if (!card || typeof card !== 'object') return card;
      const out = { ...card };
      if (typeof out.body === 'string' && out.body.startsWith('<p>') && out.body.endsWith('</p>')) {
        out.body = out.body.replace(/^<p>/, '').replace(/<\/p>$/, '');
      }
      return out;
    });
  }
}
