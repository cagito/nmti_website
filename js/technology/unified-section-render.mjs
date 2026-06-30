import { getNode } from './dictionary.js';
import {
  numberedSectionTitle,
  formatStringSection,
  formatPlainBulletList,
  formatPurposeCards,
  formatConstructionPhases,
  formatInstallationHtml
} from './section-format.js';
import {
  UNIFIED_KEYS,
  APPENDIX,
  unifiedTitlesFor,
  hasUnifiedContent,
  sectionFiguresFor
} from './unified-sections.mjs';

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

function renderPurposeSection(s) {
  let html = '';
  if (Array.isArray(s.purpose) && s.purpose.length) {
    html += formatPurposeCards(s.purpose);
  } else if (typeof s.purpose === 'string' && s.purpose.trim()) {
    html += formatStringSection('overview', s.purpose);
  }
  if (Array.isArray(s.applications) && s.applications.length) {
    html += formatPlainBulletList(s.applications, 'applications');
  }
  return html;
}

function renderPrincipleSection(s) {
  let html = '';
  if (s.siteLayout) html += formatStringSection('siteLayout', s.siteLayout);
  if (s.principle) html += formatStringSection('principle', s.principle);
  return html;
}

function renderInstallationSection(s) {
  let html = '';
  if (typeof s.installation === 'string' && s.installation.trim()) {
    html += formatInstallationHtml(s.installation);
  } else if (Array.isArray(s.installation) && s.installation.length) {
    html += formatPlainBulletList(s.installation, 'installation');
  }
  if (s.constructionPhases?.rows?.length) {
    html += formatConstructionPhases(s.constructionPhases);
  }
  return html;
}

function renderManagementSection(s) {
  let html = '';
  if (s.data?.rows?.length) {
    html += renderTable(s.data);
  }
  if (s.troubleshooting?.rows?.length) {
    html +=
      '<h3 class="tech-subheading">장애 유형 및 점검</h3>' + renderTable(s.troubleshooting);
  }
  if (s.criteria) {
    if (Array.isArray(s.criteria)) {
      html += formatPlainBulletList(s.criteria, 'criteria');
    } else {
      html += formatStringSection('criteria', s.criteria);
    }
  }
  return html;
}

function renderUnifiedBody(key, data) {
  const s = data.sections || {};
  switch (key) {
    case 'overview':
      return formatStringSection('overview', s.overview);
    case 'purpose':
      return renderPurposeSection(s);
    case 'principle':
      return renderPrincipleSection(s);
    case 'installation':
      return renderInstallationSection(s);
    case 'management':
      return renderManagementSection(s);
    default:
      return '';
  }
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

function renderFaq(items) {
  return (
    '<div class="faq-list">' +
    items
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

function renderAppendixBody(key, data, linkBuilder) {
  const s = data.sections || {};
  if (key === 'related') return renderRelated(s.related, linkBuilder);
  if (key === 'faq') return renderFaq(s.faq);
  return '';
}

function renderSectionFigure(image, renderFigure) {
  if (!renderFigure || !image) return '';
  return renderFigure(image);
}

/**
 * @param {object} data
 * @param {(nodeId: string) => string} linkBuilder
 * @param {{ includeAppendix?: boolean, renderFigure?: Function, sectionWrapClass?: string }} [opts]
 */
export function buildUnifiedSectionsHtml(data, linkBuilder, opts) {
  const options = opts || {};
  const includeAppendix = options.includeAppendix !== false;
  const renderFigure = options.renderFigure || null;
  const wrapClass = options.sectionWrapClass || 'tech-section tech-section--numbered';
  const html = [];
  const titles = unifiedTitlesFor(data);

  UNIFIED_KEYS.forEach(function (key, index) {
    if (!hasUnifiedContent(key, data)) return;

    const body = renderUnifiedBody(key, data);
    const figs = sectionFiguresFor(key, data);
    if (!body && !figs.length) return;

    html.push(
      '<section class="' +
        wrapClass +
        '" id="' +
        key +
        '" data-section="' +
        (index + 1) +
        '">'
    );
    html.push(
      '<h2 class="tech-section__title">' +
        escapeHtml(numberedSectionTitle(index + 1, titles[index])) +
        '</h2>'
    );
    html.push('<div class="tech-section__body">');
    figs.forEach(function (fig) {
      html.push(renderSectionFigure(fig, renderFigure));
    });
    if (body) html.push(body);
    html.push('</div></section>');
  });

  if (includeAppendix) {
    APPENDIX.forEach(function (pair) {
      const key = pair[0];
      const title = pair[1];
      if (!hasUnifiedContent(key, data)) return;
      const body = renderAppendixBody(key, data, linkBuilder);
      if (!body) return;
      html.push('<section class="tech-section tech-section--appendix" id="' + key + '">');
      html.push('<h2 class="tech-section__title">' + escapeHtml(title) + '</h2>');
      html.push('<div class="tech-section__body">' + body + '</div></section>');
    });
  }

  return html.join('\n');
}
