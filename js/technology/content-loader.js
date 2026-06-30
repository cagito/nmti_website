import { getNode } from './dictionary.js';
import { getContentForNode } from './content-data.js';
import { buildUnifiedSectionsHtml } from './unified-section-render.mjs';
import { formatPurposeCards } from './section-format.js';
import {
  UNIFIED_KEYS,
  hasUnifiedContent,
  missingUnifiedSections,
  unifiedTitlesFor
} from './unified-sections.mjs';

export async function loadContent(nodeId) {
  if (!nodeId) return getContentForNode('intro');
  return getContentForNode(nodeId);
}

export function renderContent(container, data, linkBuilder) {
  if (!data) {
    container.innerHTML = '<p class="tech-content__empty">항목을 찾을 수 없습니다.</p>';
    return;
  }

  const html = [];
  html.push('<article class="tech-article tech-article--unified">');

  if (data.tagline) {
    html.push('<p class="tech-article__tagline">' + escapeHtml(data.tagline) + '</p>');
  }
  html.push('<h1 class="tech-article__title">' + escapeHtml(data.title) + '</h1>');

  if (data.heroImage) {
    html.push(renderFigure(data.heroImage));
  }

  html.push(renderSectionNav(data));

  html.push(
    buildUnifiedSectionsHtml(data, linkBuilder, {
      includeAppendix: true,
      renderFigure: renderFigure
    })
  );

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

function renderSectionNav(data) {
  const titles = unifiedTitlesFor(data);
  const items = UNIFIED_KEYS.map(function (key, index) {
    if (!hasUnifiedContent(key, data)) return '';
    return (
      '<li class="tech-section-nav__item"><a class="tech-section-nav__link" href="#' +
      key +
      '">' +
      escapeHtml(String(index + 1) + '. ' + titles[index]) +
      '</a></li>'
    );
  })
    .filter(Boolean)
    .join('');
  if (!items) return '';
  return (
    '<nav class="tech-section-nav" aria-label="본문 목차"><ol class="tech-section-nav__list">' +
    items +
    '</ol></nav>'
  );
}

/** @deprecated — formatPurposeCards 사용 */
export function renderPurposeCards(cards) {
  return formatPurposeCards(cards);
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

export { buildUnifiedSectionsHtml } from './unified-section-render.mjs';
export { UNIFIED_KEYS, hasUnifiedContent, missingUnifiedSections, unifiedTitlesFor } from './unified-sections.mjs';
