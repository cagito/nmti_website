import { BASE_PATH, getBreadcrumb, getNode, nodePath, nodePathSeo } from './dictionary.js';
import { defaultOgImage } from './images.js';
import { seoDisplayTitle, seoMetaDescription, seoPageTitle } from './seo-title.js';

const SITE = 'https://www.nmti.co.kr';

export function updateSeo(nodeId, content) {
  const id = nodeId || 'intro';
  const node = getNode(id) || (id === 'intro' ? { label: '건설 계측 기술 자료' } : null);
  const title = content?.title || node?.label || '건설 계측 기술 자료';
  const desc =
    seoMetaDescription(id === 'intro' ? '' : id, title, content?.metaDescription || node?.metaDescription) ||
    title + '의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 공종·센서를 정리한 기술 자료입니다.';

  const pageTitle = seoPageTitle(id === 'intro' ? '' : id, title);

  document.title = pageTitle;

  setMeta('name', 'description', desc);
  setMeta('property', 'og:title', pageTitle);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:url', SITE + nodePathSeo(id === 'intro' ? '' : id));
  setMeta('property', 'og:type', id === 'intro' ? 'website' : 'article');

  const ogImage = content?.heroImage?.src
    ? SITE + '/homepage/' + content.heroImage.src.replace(/^\//, '')
    : SITE + '/homepage/' + defaultOgImage();
  setMeta('property', 'og:image', ogImage);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', pageTitle);
  setMeta('name', 'twitter:description', desc);
  setMeta('name', 'twitter:image', ogImage);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', SITE + nodePathSeo(id === 'intro' ? '' : id));

  renderBreadcrumb(getBreadcrumb(id === 'intro' ? '' : id));
  renderSchema(id === 'intro' ? '' : id, title, desc, content);
}

function setMeta(attr, name, content) {
  let el = document.querySelector('meta[' + attr + '="' + name + '"]');
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function renderBreadcrumb(crumbs) {
  const nav = document.getElementById('techBreadcrumb');
  if (!nav) return;
  nav.innerHTML = crumbs
    .map(function (c, i) {
      const isLast = i === crumbs.length - 1;
      if (isLast || !c.href) {
        return '<span aria-current="page">' + escapeHtml(c.label) + '</span>';
      }
      return '<a href="' + escapeAttr(c.href) + '">' + escapeHtml(c.label) + '</a>';
    })
    .join('<span class="tech-breadcrumb__sep" aria-hidden="true">/</span>');
}

function renderSchema(nodeId, title, desc, content) {
  const crumbs = getBreadcrumb(nodeId || '');
  renderBreadcrumbSchema(crumbs);
  renderArticleSchema(nodeId, title, desc, content);
  renderFaqSchema(nodeId, content);
}

function renderBreadcrumbSchema(crumbs) {
  const scriptId = 'tech-breadcrumb-schema';
  let el = document.getElementById(scriptId);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = scriptId;
    document.head.appendChild(el);
  }

  const itemListElement = crumbs.map(function (c, i) {
    const item = {
      '@type': 'ListItem',
      position: i + 1,
      name: c.label
    };
    if (c.href) {
      const hash = c.href.match(/#(.+)$/);
      item.item =
        hash && c.href.includes('/technology/')
          ? SITE + nodePathSeo(hash[1])
          : SITE + c.href;
    }
    return item;
  });

  el.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itemListElement
  });
}

function renderArticleSchema(nodeId, title, desc, content) {
  let article = document.getElementById('tech-article-schema');
  if (!article) {
    article = document.createElement('script');
    article.type = 'application/ld+json';
    article.id = 'tech-article-schema';
    document.head.appendChild(article);
  }

  if (!nodeId) {
    article.textContent = '';
    return;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: seoDisplayTitle(nodeId, title),
    description: desc,
    inLanguage: 'ko-KR',
    mainEntityOfPage: SITE + nodePathSeo(nodeId),
    publisher: {
      '@type': 'Organization',
      name: '(주)신계측기술정보',
      url: SITE + '/homepage/'
    }
  };
  const basedOn = content?.jsonLdIsBasedOn;
  if (Array.isArray(basedOn) && basedOn.length) {
    schema.isBasedOn = basedOn;
  }
  article.textContent = JSON.stringify(schema);
}

function renderFaqSchema(nodeId, content) {
  let el = document.getElementById('tech-faq-schema');
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'tech-faq-schema';
    document.head.appendChild(el);
  }

  const faq = content?.sections?.faq;
  if (!Array.isArray(faq) || !faq.length) {
    el.textContent = '';
    return;
  }

  el.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(function (item) {
      return {
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: stripHtml(item.a)
        }
      };
    })
  });
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
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
