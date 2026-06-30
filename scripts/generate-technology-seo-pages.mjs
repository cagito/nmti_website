import { mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  getAllContentNodeIds,
  getNode,
  getBreadcrumb,
  nodePath,
  nodePathSeo
} from '../js/technology/dictionary.js';
import { getContentForNode } from '../js/technology/content-data.js';
import { seoDisplayTitle, seoMetaDescription, seoPageTitle } from '../js/technology/seo-title.js';
import { buildSectionNavHtml, buildUnifiedSectionsHtml } from '../js/technology/unified-section-render.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://www.nmti.co.kr';
const techRoot = join(__dirname, '..', 'technology');
const lastmod = new Date().toISOString().slice(0, 10);

/** Previously skipped — now generated with unified section preview. */
const SKIP_IDS = new Set([]);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function seoUrl(nodeId) {
  return SITE + nodePathSeo(nodeId);
}

function seoLinkBuilder(nodeId) {
  return SITE + nodePathSeo(nodeId);
}

function renderSeoSectionFigure(image) {
  if (!image || image.placeholder) return '';
  const webp = image.src && String(image.src).endsWith('.webp') ? image.src : '';
  if (!webp) return '';
  const url = '/homepage/' + String(webp).replace(/^\//, '');
  const alt = escapeHtml(image.alt || image.caption || '');
  return (
    '<figure class="tech-seo-figure">' +
    '<img class="img-protected" draggable="false" data-img-protect src="' +
    url +
    '" alt="' +
    alt +
    '" loading="lazy" decoding="async">' +
    (image.caption ? '<figcaption>' + escapeHtml(image.caption) + '</figcaption>' : '') +
    '</figure>'
  );
}

function breadcrumbSchema(nodeId, title) {
  const crumbs = getBreadcrumb(nodeId);
  const itemListElement = crumbs.map(function (c, i) {
    const item = { '@type': 'ListItem', position: i + 1, name: c.label };
    if (c.href) {
      const hash = c.href.match(/#(.+)$/);
      item.item =
        hash && c.href.includes('/technology/')
          ? SITE + nodePathSeo(hash[1])
          : SITE + c.href;
    } else if (i === crumbs.length - 1) {
      item.item = seoUrl(nodeId);
    }
    return item;
  });
  if (itemListElement[itemListElement.length - 1] && !itemListElement[itemListElement.length - 1].item) {
    itemListElement[itemListElement.length - 1].item = seoUrl(nodeId);
  }
  return {
    '@type': 'BreadcrumbList',
    itemListElement: itemListElement
  };
}

function articleSchema(nodeId, title, desc, imageUrl, content) {
  const displayTitle = seoDisplayTitle(nodeId, title);
  const schema = {
    '@type': 'TechArticle',
    headline: displayTitle,
    description: desc,
    inLanguage: 'ko-KR',
    dateModified: lastmod,
    mainEntityOfPage: seoUrl(nodeId),
    publisher: {
      '@type': 'Organization',
      name: '(주)신계측기술정보',
      url: SITE + '/homepage/'
    }
  };
  if (imageUrl) schema.image = imageUrl;
  const basedOn = content?.jsonLdIsBasedOn;
  if (Array.isArray(basedOn) && basedOn.length) schema.isBasedOn = basedOn;
  return schema;
}

function faqSchema(faq, pageUrl) {
  if (!Array.isArray(faq) || !faq.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': pageUrl + '#faq',
    mainEntity: faq.map(function (item) {
      return {
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(item.a) }
      };
    })
  };
}

function heroImageUrl(content) {
  const hero = content?.heroImage;
  if (!hero || hero.placeholder) return '';
  const src = hero.src;
  if (!src) return '';
  return SITE + '/homepage/' + String(src).replace(/^\//, '');
}

function heroFigureHtml(content) {
  const hero = content?.heroImage;
  if (!hero || hero.placeholder) return '';
  const webp = hero.src && hero.src.endsWith('.webp') ? hero.src : '';
  if (!webp) return '';
  const alt = escapeHtml(hero.alt || content.title || '');
  const caption = hero.caption ? escapeHtml(hero.caption) : '';
  const url = '/homepage/' + String(webp).replace(/^\//, '');
  const imgBlock =
    '<img class="img-protected" draggable="false" data-img-protect src="' +
    escapeHtml(url) +
    '" alt="' +
    alt +
    '" width="1200" height="675" loading="lazy" decoding="async">';
  return (
    '    <figure class="tech-seo-hero" data-watermark-baked="1">' +
    imgBlock +
    (caption ? '<figcaption>' + caption + '</figcaption>' : '') +
    '</figure>\n'
  );
}

function linkHref(href) {
  if (!href) return '';
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  if (href.startsWith('/')) return SITE + href;
  return SITE + '/homepage/' + href.replace(/^\//, '');
}

function renderPage(nodeId, content) {
  const title = content.title || getNode(nodeId)?.label || nodeId;
  const displayTitle = seoDisplayTitle(nodeId, title);
  const desc =
    seoMetaDescription(nodeId, title, content.metaDescription) ||
    stripHtml(content.sections?.overview).slice(0, 160);
  const pageTitle = seoPageTitle(nodeId, title);
  const canonical = seoUrl(nodeId);
  const spaUrl = SITE + nodePath(nodeId);
  const imageUrl = heroImageUrl(content);
  const sectionNav = buildSectionNavHtml(content);
  const unifiedBody = buildUnifiedSectionsHtml(content, seoLinkBuilder, {
    includeAppendix: true,
    renderFigure: renderSeoSectionFigure,
    sectionWrapClass: 'tech-section tech-section--numbered tech-seo-section'
  });
  const crumbs = getBreadcrumb(nodeId);

  const graph = [
    breadcrumbSchema(nodeId, title),
    articleSchema(nodeId, title, desc, imageUrl || undefined, content)
  ];
  const faq = faqSchema(content.sections?.faq, canonical);
  if (faq) graph.push(faq);

  const breadcrumbHtml = crumbs
    .map(function (c, i) {
      const isLast = i === crumbs.length - 1;
      if (isLast) return '<span aria-current="page">' + escapeHtml(c.label) + '</span>';
      if (!c.href) return '<span>' + escapeHtml(c.label) + '</span>';
      const href =
        c.href.includes('/technology/#') || c.href.includes('/technology#')
          ? SITE + nodePathSeo(c.href.split('#')[1])
          : SITE + c.href;
      return '<a href="' + escapeHtml(href) + '">' + escapeHtml(c.label) + '</a>';
    })
    .join('<span aria-hidden="true"> / </span>');

  const ogImage = imageUrl || SITE + '/homepage/assets/images/hero-civil-monitoring.webp';

  return (
    '<!DOCTYPE html>\n' +
    '<html lang="ko">\n' +
    '<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '  <meta name="robots" content="index, follow">\n' +
    '  <meta name="description" content="' +
    escapeHtml(desc) +
    '">\n' +
    '  <meta property="og:title" content="' +
    escapeHtml(pageTitle) +
    '">\n' +
    '  <meta property="og:description" content="' +
    escapeHtml(desc) +
    '">\n' +
    '  <meta property="og:type" content="article">\n' +
    '  <meta property="og:url" content="' +
    canonical +
    '">\n' +
    '  <meta property="og:locale" content="ko_KR">\n' +
    '  <meta property="og:image" content="' +
    ogImage +
    '">\n' +
    '  <meta name="twitter:card" content="summary_large_image">\n' +
    '  <meta name="twitter:title" content="' +
    escapeHtml(pageTitle) +
    '">\n' +
    '  <meta name="twitter:description" content="' +
    escapeHtml(desc) +
    '">\n' +
    '  <meta name="twitter:image" content="' +
    ogImage +
    '">\n' +
    '  <link rel="canonical" href="' +
    canonical +
    '">\n' +
    '  <link rel="sitemap" type="application/xml" title="Sitemap" href="https://www.nmti.co.kr/homepage/sitemap.xml">\n' +
    '  <title>' +
    escapeHtml(pageTitle) +
    '</title>\n' +
    '  <link rel="icon" href="/homepage/assets/favicon.svg?v=2" type="image/svg+xml">\n' +
    '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">\n' +
    '  <link rel="stylesheet" href="/homepage/css/style.css?v=46">\n' +
    '  <link rel="stylesheet" href="/homepage/css/technology.css?v=12">\n' +
    '  <style>.tech-seo{max-width:48rem;margin:0 auto;padding:2rem 1.25rem 4rem;font-size:1.05rem;line-height:1.75}.tech-seo h1{font-size:clamp(1.5rem,4vw,2rem);margin:1rem 0}.tech-seo h2{font-size:1.15rem;margin:2rem 0 .75rem;font-weight:800}.tech-seo .breadcrumb{font-size:.9rem;color:#555;margin-bottom:1rem}.tech-seo .breadcrumb a{color:inherit}.tech-seo .lead{color:#333;margin-bottom:1.5rem}.tech-seo .cta{margin-top:2rem;padding:1rem 1.25rem;background:#f4f7fb;border-radius:.5rem}.tech-seo img{max-width:100%;height:auto;border-radius:.35rem}.tech-seo-hero{margin:1.25rem 0 1.75rem;position:relative}.tech-seo-hero figcaption{margin-top:.5rem;font-size:.9rem;color:#555}.tech-seo-article{margin-top:1rem}.tech-seo-section{margin-top:0}.tech-seo-figure{margin:1rem 0}.tech-seo-figure figcaption{font-size:.9rem;color:#555;margin-top:.35rem}</style>\n' +
    '  <script type="application/ld+json">\n' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2) +
    '\n  </script>\n' +
    '</head>\n' +
    '<body>\n' +
    '  <a href="#main" class="skip-link">본문 바로가기</a>\n' +
    '  <main id="main" class="tech-seo">\n' +
    '    <nav class="breadcrumb" aria-label="breadcrumb">' +
    breadcrumbHtml +
    '</nav>\n' +
    '    <h1>' +
    escapeHtml(title) +
    '</h1>\n' +
    '    <p class="lead">' +
    escapeHtml(desc) +
    '</p>\n' +
    heroFigureHtml(content) +
    sectionNav +
    '    <article class="tech-article tech-article--unified tech-seo-article">\n' +
    unifiedBody +
    '    </article>\n' +
    (content.sections?.sources ? '    ' + content.sections.sources.replace(/class="tech-sources"/g, 'class="tech-sources tech-sources--seo"') + '\n' : '') +
    '    <p class="cta"><a href="' +
    spaUrl +
    '">인터랙티브 기술자료에서 전체 보기</a> · <a href="' +
    SITE +
    '/homepage/technology/">기술자료 목록</a>' +
    (content.detailLink
      ? ' · <a href="' +
        escapeHtml(linkHref(content.detailLink.href)) +
        '"' +
        (String(content.detailLink.href).includes('.pdf')
          ? ' target="_blank" rel="noopener noreferrer"'
          : '') +
        '>' +
        escapeHtml(content.detailLink.label) +
        '</a>'
      : '') +
    '</p>\n' +
    '  </main>\n' +
    '  <script type="module">\n' +
    '    import { initFigureLightbox } from "/homepage/js/technology/figure-lightbox.js";\n' +
    '    import { initImageProtection } from "/homepage/js/image-protection.js";\n' +
    '    const main = document.getElementById("main");\n' +
    '    initFigureLightbox(main);\n' +
    '    initImageProtection(main);\n' +
    '  </script>\n' +
    '</body>\n' +
    '</html>\n'
  );
}

let count = 0;
getAllContentNodeIds().forEach(function (nodeId) {
  if (SKIP_IDS.has(nodeId)) return;
  const content = getContentForNode(nodeId);
  if (!content) return;
  const dir = join(techRoot, ...nodeId.split('/'));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderPage(nodeId, content), 'utf8');
  count += 1;
});

console.log('Wrote', count, 'SEO pages under technology/');
