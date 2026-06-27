import { LOGO_HEIGHT, LOGO_SRC, LOGO_WIDTH, NAV_ITEMS, resolveLogoHref, resolveNavHref } from './menu.js';

/**
 * @param {HTMLElement} mount
 * @param {{ variant?: 'home' | 'subpage', active?: string, scrolled?: boolean }} options
 */
export function mountSiteNav(mount, options) {
  if (!mount) return null;

  const variant = options.variant === 'home' ? 'home' : 'subpage';
  const active = options.active || '';
  const scrolled = options.scrolled ?? variant === 'subpage';

  const header = document.createElement('header');
  header.className = scrolled ? 'nav nav--scrolled' : 'nav';
  header.id = 'nav';

  const logoHref = resolveLogoHref(variant);
  const menuHtml = NAV_ITEMS.map(function (item) {
    const href = resolveNavHref(item, variant);
    const cls = [item.cta ? 'nav__cta' : '', active === item.id ? 'is-active' : '']
      .filter(Boolean)
      .join(' ');
    return (
      '<a href="' +
      escapeAttr(href) +
      '"' +
      (cls ? ' class="' + cls + '"' : '') +
      (active === item.id ? ' aria-current="page"' : '') +
      '>' +
      escapeHtml(item.label) +
      '</a>'
    );
  }).join('\n        ');

  header.innerHTML =
    '<div class="nav__inner container">' +
    '<a href="' +
    escapeAttr(logoHref) +
    '" class="nav__logo" aria-label="(주)신계측기술정보 홈">' +
    '<img src="' +
    escapeAttr(LOGO_SRC) +
    '" alt="(주)신계측기술정보" class="nav__logo-img" width="' +
    LOGO_WIDTH +
    '" height="' +
    LOGO_HEIGHT +
    '" fetchpriority="high" decoding="async">' +
    '</a>' +
    '<button class="nav__toggle" id="navToggle" aria-label="메뉴 열기" aria-expanded="false">' +
    '<span></span><span></span><span></span>' +
    '</button>' +
    '<nav class="nav__menu" id="navMenu" aria-label="주 메뉴">' +
    menuHtml +
    '</nav>' +
    '</div>';

  mount.replaceWith(header);
  return header;
}

/**
 * @param {{ variant?: 'home' | 'subpage', forceScrolled?: boolean }} options
 */
export function initSiteNavBehavior(options) {
  const variant = options.variant === 'home' ? 'home' : 'subpage';
  const forceScrolled = options.forceScrolled ?? variant === 'subpage';

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const backTop = document.getElementById('backTop');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const open = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
  }

  initInPageAnchorScroll(nav, closeMobileNav);

  if (variant === 'home') {
    initNavSpy(nav, navMenu);
  }

  function closeMobileNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '메뉴 열기');
  }

  function onScroll() {
    if (nav) {
      const useScrolled = forceScrolled || window.scrollY > 20;
      nav.classList.toggle('nav--scrolled', useScrolled);
    }
    if (backTop) {
      const visible = window.scrollY > 520;
      backTop.hidden = !visible;
      backTop.classList.toggle('is-visible', visible);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  onScroll();
}

function initInPageAnchorScroll(nav, closeMobileNav) {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMobileNav();
      const offset = nav ? nav.offsetHeight : 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset + 1,
        behavior: 'smooth'
      });
    });
  });
}

function initNavSpy(nav, navMenu) {
  if (!navMenu) return;

  const links = navMenu.querySelectorAll('a[href^="#"]');
  const sections = [];

  links.forEach(function (link) {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (!section) return;
    sections.push({ id: id, el: section, link: link });
  });

  if (!sections.length) return;

  function setActive(id) {
    sections.forEach(function (item) {
      const isActive = item.id === id;
      item.link.classList.toggle('is-active', isActive);
      if (isActive) item.link.setAttribute('aria-current', 'page');
      else item.link.removeAttribute('aria-current');
    });
  }

  if (!('IntersectionObserver' in window)) return;

  const spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    {
      rootMargin: '-' + (nav ? nav.offsetHeight + 8 : 72) + 'px 0px -55% 0px',
      threshold: 0
    }
  );

  sections.forEach(function (item) {
    spy.observe(item.el);
  });
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
