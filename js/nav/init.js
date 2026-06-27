import { mountSiteNav, initSiteNavBehavior } from './site-nav.js';

/**
 * Mount and initialize the shared site navigation from a placeholder element.
 * @param {HTMLElement} [mount]
 */
export function bootSiteNav(mount) {
  const el = mount || document.getElementById('site-nav-mount');
  if (!el) return;

  const variant = el.dataset.variant === 'home' ? 'home' : 'subpage';
  const active = el.dataset.active || '';
  const navMode = el.dataset.navMode || (variant === 'home' ? 'hero' : 'fixed');
  const forceScrolled = navMode === 'fixed';

  mountSiteNav(el, {
    variant: variant,
    active: active,
    scrolled: forceScrolled
  });

  initSiteNavBehavior({
    variant: variant,
    forceScrolled: forceScrolled
  });
}

const mount = document.getElementById('site-nav-mount');
if (mount) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bootSiteNav(mount);
    });
  } else {
    bootSiteNav(mount);
  }
}
