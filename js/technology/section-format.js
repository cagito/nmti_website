const LABELS = {
  overview: ['목적', '적용 범위', '주요 구성', '운영 포인트', '확인 사항'],
  principle: ['측정 대상', '측정 원리', '해석 포인트', '주의 사항', '병행 검토'],
  installation: ['설치 기준', '설치 절차', '운영 방법', '유지관리', '주의 사항'],
  criteria: ['기준 출처', '적용 방법', '초과 판단', '대응 절차', '주의 사항'],
  siteLayout: ['구성 흐름', '배치 원칙', '연결 관계', '주의 사항'],
  troubleshooting: ['장애 유형', '확인 항목', '점검 방법', '조치 방향']
};

const NARRATIVE_KEYS = new Set([
  'overview',
  'principle',
  'installation',
  'criteria',
  'siteLayout',
  'troubleshooting'
]);

export function numberedSectionTitle(index, title) {
  return String(index) + '. ' + title;
}

export function shouldFormatNarrative(key, value) {
  return NARRATIVE_KEYS.has(key) && typeof value === 'string' && value.trim() !== '';
}

export function formatNarrativeSection(key, html) {
  if (!shouldFormatNarrative(key, html)) return html || '';

  let blocks = extractParagraphBlocks(html).map(tightenProse);
  blocks = expandSingleParagraph(blocks);
  if (!blocks.length) {
    return renderBulletList(key, [tightenProse(String(html).trim())]);
  }

  const tail = String(html)
    .replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, '')
    .trim();
  return renderBulletList(key, blocks) + tail;
}

/** 한 단락에 문장이 여러 개면 불릿 항목으로 분리 */
function expandSingleParagraph(blocks) {
  if (blocks.length !== 1) return blocks;
  const body = blocks[0];
  if (!body || /<a\b|<strong|<em/i.test(body)) return blocks;
  const plain = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const parts = plain
    .split(/(?<=[.。!？])\s+/)
    .map(function (s) {
      return s.trim();
    })
    .filter(function (s) {
      return s.length > 6;
    });
  return parts.length > 1 ? parts : blocks;
}

/** 문장 끝 「…연계합니다」류 제거·간결화 */
export function tightenProse(html) {
  let s = String(html || '').trim();
  if (!s) return s;
  s = s.replace(/([·,]\s*)?([가-힣A-Za-z0-9·\s]+와\s+)?연계(합니다|해|됩니다|하며)\s*[.。]?$/g, '');
  s = s.replace(/으로\s+연계(합니다|해)\s*[.。]?$/g, '');
  s = s.replace(/과\s+연계(합니다|해)\s*[.。]?$/g, '');
  s = s.replace(/를\s+연계(합니다|해)\s*[.。]?$/g, '');
  s = s.replace(/와\s+연계(합니다|해)\s*[.。]?$/g, '');
  s = s.replace(/\s+연계(합니다|해)\s*[.。]?$/g, '');
  s = s.replace(/연계\s*해석(합니다)?/g, '통합 해석');
  s = s.replace(/연계\s*모니터링/g, '동시 모니터링');
  return s.trim();
}

function extractParagraphBlocks(html) {
  const out = [];
  String(html).replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, function (_, body) {
    const trimmed = body.trim();
    if (trimmed) out.push(trimmed);
    return '';
  });
  return out;
}

function renderBulletList(key, blocks) {
  const labels = LABELS[key] || ['내용'];
  const items = blocks
    .map(function (body, index) {
      const label = labels[index] || '내용 ' + (index + 1);
      return (
        '<li class="tech-bullet-list__item"><strong class="tech-bullet-list__label">' +
        escapeHtml(label) +
        '</strong><span class="tech-bullet-list__text">' +
        body +
        '</span></li>'
      );
    })
    .join('');
  return '<ul class="tech-bullet-list tech-bullet-list--' + escapeAttr(key) + '">' + items + '</ul>';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}

/** 설치·적용 등 문자열 배열 → 들여쓰기 불릿 */
export function formatPlainBulletList(items, variant) {
  if (!Array.isArray(items) || !items.length) return '';
  const mod = variant ? ' tech-bullet-list--' + variant : '';
  const bullets = items
    .map(function (item) {
      const raw = String(item || '').trim();
      if (!raw) return '';
      const body = raw.startsWith('<') ? tightenProse(raw) : escapeHtml(tightenProse(raw));
      return (
        '<li class="tech-bullet-list__item tech-bullet-list__item--plain">' +
        '<span class="tech-bullet-list__text">' +
        body +
        '</span></li>'
      );
    })
    .filter(Boolean)
    .join('');
  return '<ul class="tech-bullet-list tech-bullet-list--plain' + mod + '">' + bullets + '</ul>';
}

export function formatStringSection(key, value) {
  if (!shouldFormatNarrative(key, value)) {
    return typeof value === 'string' ? value : '';
  }
  return formatNarrativeSection(key, value);
}

export function wrapIndented(content) {
  if (!content) return '';
  return '<div class="tech-section__indent">' + content + '</div>';
}

function cardBodyToHtml(body) {
  const t = String(body || '').trim();
  if (!t) return '';
  return t.startsWith('<') ? tightenProse(t) : escapeHtml(tightenProse(t));
}

function renderLabeledItems(items, variant) {
  const bullets = items
    .map(function (item) {
      if (!item.label && !item.body) return '';
      return (
        '<li class="tech-bullet-list__item"><strong class="tech-bullet-list__label">' +
        escapeHtml(item.label) +
        '</strong><span class="tech-bullet-list__text">' +
        item.body +
        '</span></li>'
      );
    })
    .filter(Boolean)
    .join('');
  if (!bullets) return '';
  return (
    '<ul class="tech-bullet-list tech-bullet-list--labeled tech-bullet-list--' +
    escapeAttr(variant) +
    '">' +
    bullets +
    '</ul>'
  );
}

/** purpose 카드 배열 → 라벨+문장 불릿 */
export function formatPurposeCards(cards) {
  if (!Array.isArray(cards) || !cards.length) return '';
  const items = cards.map(function (card) {
    const label =
      String(card.title || '') +
      (card.signal && card.signal !== card.title ? ' · ' + card.signal : '');
    return { label, body: cardBodyToHtml(card.body) };
  });
  return renderLabeledItems(items, 'purpose');
}

/** 시공 단계 표 → 불릿 */
export function formatConstructionPhases(phases) {
  if (!phases?.rows?.length) return '';
  const items = phases.rows.map(function (row) {
    const label = row[0] || '';
    const rest = row.slice(1).filter(Boolean).join(' — ');
    return label + (rest ? ': ' + rest : '');
  });
  return formatPlainBulletList(items, 'construction-phases');
}

/** HTML 설치 본문 — process-list ol 추출 후 불릿 변환 */
export function formatInstallationHtml(html) {
  let s = String(html || '');
  const olMatch = s.match(/<ol\b[^>]*class="[^"]*process-list[^"]*"[^>]*>([\s\S]*?)<\/ol>/i);
  let listHtml = '';
  if (olMatch) {
    const items = [...olMatch[1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map(function (m) {
      return m[1].trim();
    });
    s = s.replace(olMatch[0], '');
    listHtml = formatPlainBulletList(items, 'installation');
  }
  const prose = formatStringSection('installation', s.trim());
  return prose + listHtml;
}
