import { getNode } from './dictionary.js';
import { getContentForNode } from './content-data.js';

export async function loadContent(nodeId) {
  if (!nodeId) return getContentForNode('intro');
  return getContentForNode(nodeId);
}

const SECTIONS = [
  ['overview', 'Overview', '개요'],
  ['purpose', 'Purpose', '계측 목적'],
  ['principle', 'Principle', '측정 원리'],
  ['installation', 'Installation', '설치 및 운영 방법'],
  ['data', 'Data', '데이터 해석'],
  ['criteria', 'Criteria', '관리기준 및 경보'],
  ['related', 'Related', '관련 분야 및 센서'],
  ['faq', 'FAQ', '자주 묻는 질문']
];

const FIELD_SECTIONS = [
  ['overview', 'Overview', '계측 개요'],
  ['purpose', 'Measurements', '주요 계측 항목'],
  ['principle', 'Section', '대표 단면도'],
  ['installation', 'Installation', '설치 위치 및 유의사항'],
  ['constructionPhases', 'Phases', '시공 단계별 관리 포인트'],
  ['data', 'Analysis', '데이터 해석 및 이상 징후'],
  ['criteria', 'Criteria', '관리 기준 및 조치'],
  ['related', 'Related', '관련 계측센서'],
  ['faq', 'FAQ', '자주 묻는 질문']
];

const SENSOR_SECTIONS = [
  ['overview', 'Overview', '센서 개요'],
  ['purpose', 'Purpose', '측정 목적'],
  ['principle', 'Principle', '측정 원리'],
  ['applications', 'Applications', '적용 현장'],
  ['installation', 'Installation', '설치 방법 및 유의사항'],
  ['data', 'Data', '데이터 해석'],
  ['criteria', 'Maintenance', '점검 및 유지관리'],
  ['related', 'Related', '관련 구조물·공종'],
  ['faq', 'FAQ', '자주 묻는 질문']
];

const SYSTEM_SECTIONS = [
  ['overview', 'Overview', '시스템 개요'],
  ['purpose', 'Components', '구성 요소'],
  ['siteLayout', 'Layout', '현장 구성 방식'],
  ['installation', 'Operations', '설치 및 운영 방법'],
  ['data', 'Dataflow', '데이터 수집·전송'],
  ['troubleshooting', 'Troubleshoot', '장애 유형 및 점검'],
  ['criteria', 'Maintenance', '유지관리 기준'],
  ['related', 'Related', '관련 계측센서'],
  ['faq', 'FAQ', '자주 묻는 질문']
];

const SYSTEM_SENSOR_IDS = new Set(['sensors/datalogger', 'sensors/remote-monitoring-system']);

function isFieldPage(id) {
  return id && id.startsWith('fields/') && id.split('/').length >= 2;
}

function sectionOrderFor(data) {
  const id = data?.id ? String(data.id) : '';
  if (id.startsWith('instruments/') || SYSTEM_SENSOR_IDS.has(id)) return SYSTEM_SECTIONS;
  if (id.startsWith('sensors/')) return SENSOR_SECTIONS;
  if (isFieldPage(id)) return FIELD_SECTIONS;
  return SECTIONS;
}

export function renderContent(container, data, linkBuilder) {
  if (!data) {
    container.innerHTML = '<p class="tech-content__empty">항목을 찾을 수 없습니다.</p>';
    return;
  }

  const html = [];
  html.push('<article class="tech-article">');

  if (data.tagline) {
    html.push('<p class="tech-article__tagline">' + escapeHtml(data.tagline) + '</p>');
  }
  html.push('<h1 class="tech-article__title">' + escapeHtml(data.title) + '</h1>');

  if (data.heroImage) {
    html.push(renderFigure(data.heroImage));
  }

  sectionOrderFor(data).forEach(function (triple) {
    const key = triple[0];
    const kicker = triple[1];
    const title = triple[2];
    const value = data.sections?.[key];
    const sectionFigs = data.sectionImages?.[key];
    if ((value === undefined || value === null || value === '') && !sectionFigs) return;

    const body = renderSectionBody(key, value, linkBuilder, data);
    if (!body && !sectionFigs) return;

    html.push('<section class="tech-section" id="' + key + '">');
    html.push('<span class="section-kicker">' + escapeHtml(kicker) + '</span>');
    html.push('<h2 class="tech-section__title">' + escapeHtml(title) + '</h2>');
    html.push('<div class="tech-section__body">');
    if (data.sectionImages && data.sectionImages[key]) {
      data.sectionImages[key].forEach(function (fig) {
        html.push(renderFigure(fig));
      });
    }
    if (body) html.push(body);
    html.push('</div></section>');
  });

  if (data.sections?.sources) {
    html.push('<section class="tech-section tech-section--sources" id="sources">');
    html.push('<div class="tech-section__body">');
    html.push(data.sections.sources);
    html.push('</div></section>');
  }

  if (data.detailLink) {
    const href = data.detailLink.href;
    const pdf = String(href).includes('.pdf');
    html.push(
      '<p class="tech-detail-link"><a href="' +
        escapeAttr(href) +
        '"' +
        (pdf ? ' target="_blank" rel="noopener noreferrer"' : '') +
        '>' +
        escapeHtml(data.detailLink.label) +
        '</a></p>'
    );
  }

  html.push('</article>');
  container.innerHTML = html.join('\n');
}

const PURPOSE_ACCENTS = new Set([
  'integrated',
  'displacement',
  'load',
  'water',
  'settlement',
  'structure',
  'vibration'
]);

function pageContextFor(data) {
  const id = data?.id ? String(data.id) : '';
  if (data?.sections?.purposeLayout === 'strip') return 'system';
  if (id.startsWith('instruments/') || SYSTEM_SENSOR_IDS.has(id)) return 'system';
  if (id.startsWith('sensors/')) return 'sensor';
  if (isFieldPage(id)) return 'field';
  return 'default';
}

function inferAccentFromTitle(title) {
  const t = String(title || '');
  if (/통합|개요|체계|구성/.test(t)) return 'integrated';
  if (/변위|경사|신축|받침|처짐|내공|수평/.test(t)) return 'displacement';
  if (/하중|장력|토압|축력/.test(t)) return 'load';
  if (/수위|수압|수리|조위|지하수|간극/.test(t)) return 'water';
  if (/침하|침하|융기|지표/.test(t)) return 'settlement';
  if (/균열|응력|변형|온도|구조|기둥/.test(t)) return 'structure';
  if (/진동|지진|풍|동적/.test(t)) return 'vibration';
  return 'integrated';
}

function normalizePurposeCard(card, index, context) {
  const out = Object.assign({}, card);
  if (context === 'field') {
    if (!out.variant) out.variant = index === 0 ? 'lead' : 'default';
    if (!out.accent) out.accent = inferAccentFromTitle(out.title);
  } else if (context === 'sensor') {
    if (!out.variant) out.variant = 'metric';
    if (!out.accent) out.accent = inferAccentFromTitle(out.title);
  } else if (context === 'system') {
    if (!out.variant) out.variant = 'compact';
    if (!out.accent) out.accent = 'integrated';
  } else {
    if (!out.accent) out.accent = inferAccentFromTitle(out.title);
  }
  if (out.accent && !PURPOSE_ACCENTS.has(out.accent)) out.accent = 'integrated';
  return out;
}

function wrapPurposeBody(body) {
  const text = String(body || '').trim();
  if (!text) return '';
  if (text.startsWith('<')) return '<div class="purpose-card__body">' + text + '</div>';
  return '<div class="purpose-card__body"><p>' + text + '</p></div>';
}

function renderPurposeChips(sensorIds, linkBuilder) {
  if (!Array.isArray(sensorIds) || !sensorIds.length) return '';
  const chips = sensorIds
    .map(function (id) {
      const node = getNode(id);
      if (!node) return '';
      const href = linkBuilder ? linkBuilder(id) : id;
      return (
        '<a class="purpose-chip" href="' +
        escapeAttr(href) +
        '" data-tech-route="' +
        escapeAttr(id) +
        '">' +
        escapeHtml(node.label) +
        '</a>'
      );
    })
    .filter(Boolean)
    .join('');
  if (!chips) return '';
  return '<nav class="purpose-card__chips" aria-label="관련 계측센서">' + chips + '</nav>';
}

function renderPurposeCard(card, linkBuilder) {
  const classes = ['purpose-card'];
  if (card.variant === 'lead') classes.push('purpose-card--lead');
  if (card.variant === 'metric') classes.push('purpose-card--metric');
  if (card.variant === 'compact') classes.push('purpose-card--compact');
  if (card.accent) classes.push('purpose-card--accent-' + card.accent);

  let html = '<article class="' + classes.join(' ') + '">';
  html += '<div class="purpose-card__head">';
  if (card.accent) {
    html += '<span class="purpose-card__icon" aria-hidden="true"></span>';
  }
  html += '<div class="purpose-card__titles">';
  if (card.signal && card.signal !== card.title) {
    html += '<p class="purpose-card__signal">' + escapeHtml(card.signal) + '</p>';
  }
  html += '<h3 class="purpose-card__title">' + escapeHtml(card.title) + '</h3>';
  html += '</div></div>';
  html += wrapPurposeBody(card.body);
  html += renderPurposeChips(card.sensors, linkBuilder);
  if (card.relatedField) {
    const fieldNode = getNode(card.relatedField);
    if (fieldNode) {
      const href = linkBuilder ? linkBuilder(card.relatedField) : card.relatedField;
      html +=
        '<p class="purpose-card__related"><a href="' +
        escapeAttr(href) +
        '" data-tech-route="' +
        escapeAttr(card.relatedField) +
        '">' +
        escapeHtml(fieldNode.label) +
        ' 항목</a></p>';
    }
  }
  html += '</article>';
  return html;
}

export function renderPurposeCards(cards, data, linkBuilder) {
  if (!Array.isArray(cards) || !cards.length) return '';
  const context = pageContextFor(data);
  const layout = data?.sections?.purposeLayout === 'strip' ? 'strip' : context;
  const gridClass =
    'purpose-grid purpose-grid--' +
    (layout === 'strip' ? 'strip' : layout === 'sensor' ? 'sensor' : layout === 'system' ? 'system' : 'field');

  const normalized = cards.map(function (card, index) {
    return normalizePurposeCard(card, index, context);
  });

  return (
    '<div class="' +
    gridClass +
    '">' +
    normalized
      .map(function (card) {
        return renderPurposeCard(card, linkBuilder);
      })
      .join('') +
    '</div>'
  );
}

function renderSectionBody(key, value, linkBuilder, data) {
  if (key === 'purpose' && Array.isArray(value)) {
    return renderPurposeCards(value, data || {}, linkBuilder);
  }

  if (key === 'installation' && Array.isArray(value)) {
    return (
      '<ol class="process-list">' +
      value
        .map(function (step) {
          return '<li>' + step + '</li>';
        })
        .join('') +
      '</ol>'
    );
  }

  if (key === 'applications' && Array.isArray(value)) {
    return (
      '<ul>' +
      value
        .map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        })
        .join('') +
      '</ul>'
    );
  }

  if ((key === 'data' || key === 'constructionPhases' || key === 'troubleshooting') && value.headers) {
    return renderTable(value);
  }

  if (key === 'siteLayout' && typeof value === 'string') {
    return value;
  }

  if (key === 'related' && typeof value === 'object') {
    return renderRelated(value, linkBuilder);
  }

  if (key === 'faq' && Array.isArray(value)) {
    return (
      '<div class="faq-list">' +
      value
        .map(function (item) {
          return (
            '<details class="faq-item"><summary>' +
            escapeHtml(item.q) +
            '</summary><div class="faq-item__body"><p>' +
            item.a +
            '</p></div></details>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  return typeof value === 'string' ? value : '';
}

function renderTable(table) {
  const headers = table.headers || [];
  const rows = table.rows || [];
  let out =
    '<table class="spec-table"><thead><tr>' +
    headers
      .map(function (h) {
        return '<th scope="col">' + escapeHtml(h) + '</th>';
      })
      .join('') +
    '</tr></thead><tbody>';
  rows.forEach(function (row) {
    out += '<tr>';
    row.forEach(function (cell, i) {
      const tag = i === 0 ? 'th scope="row"' : 'td';
      out += '<' + tag + '>' + cell + '</' + (i === 0 ? 'th' : 'td') + '>';
    });
    out += '</tr>';
  });
  return out + '</tbody></table>';
}

function renderRelated(related, linkBuilder) {
  const parts = [];
  if (related.fields?.length) {
    parts.push('<div class="inline-list"><span class="inline-list__label">관련 분야</span>');
    parts.push(renderLinkList(related.fields, linkBuilder));
    parts.push('</div>');
  }
  if (related.sensors?.length) {
    parts.push('<div class="inline-list"><span class="inline-list__label">관련 센서</span>');
    parts.push(renderLinkList(related.sensors, linkBuilder));
    parts.push('</div>');
  }
  return parts.join('') || '';
}

function renderLinkList(ids, linkBuilder) {
  return (
    '<ul class="tech-related">' +
    ids
      .map(function (id) {
        const node = getNode(id);
        if (!node) return '';
        const href = linkBuilder ? linkBuilder(id) : id;
        return (
          '<li><a href="' +
          escapeAttr(href) +
          '" data-tech-route="' +
          escapeAttr(id) +
          '">' +
          escapeHtml(node.label) +
          '</a></li>'
        );
      })
      .filter(Boolean)
      .join('') +
    '</ul>'
  );
}

function renderFigcaption(image) {
  const text = image.caption || image.alt;
  if (!text) return '';
  const prefix =
    image.figureNo != null
      ? '<b>그림 ' + escapeHtml(String(image.figureNo)) + '.</b> '
      : '';
  return '<figcaption>' + prefix + escapeHtml(text) + '</figcaption>';
}

export function renderFigure(image) {
  if (!image) return '';
  if (image.placeholder) {
    const pending = image.pendingRework;
    const title = pending ? '출판 품질 개선 중' : '이미지 준비 중';
    const detail = pending
      ? '고품질 엔지니어링 도면 제작·검수 후 공개됩니다'
      : '계측 개념도 / 설치 단면도 / 데이터 해석도';
    return (
      '<figure class="tech-figure tech-figure--placeholder' +
      (pending ? ' tech-figure--pending-rework' : '') +
      '">' +
      '<div class="figure-placeholder" role="img" aria-label="' +
      escapeAttr(image.alt || title) +
      '"><span>Engineering Figure</span><b>' +
      escapeHtml(title) +
      '</b><small>' +
      escapeHtml(detail) +
      '</small></div>' +
      renderFigcaption({ caption: image.alt || title }) +
      '</figure>'
    );
  }
  const src = image.src;
  const webp = image.src && String(image.src).endsWith('.webp') ? image.src : '';
  let img;
  if (webp) {
    img =
      '<img class="img-protected" draggable="false" data-img-protect src="/homepage/' +
      escapeAttr(src) +
      '" alt="' +
      escapeAttr(image.alt || '') +
      '" loading="lazy" decoding="async">';
  } else {
    return '';
  }
  return (
    '<figure class="tech-figure tech-figure--zoomable" data-watermark-baked="1">' +
    '<button type="button" class="tech-figure__zoom" aria-label="' +
    escapeAttr((image.caption || image.alt || '계측 도면') + ' — 크게 보기') +
    '">' +
    img +
    '</button>' +
    renderFigcaption(image) +
    '</figure>'
  );
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}
