const SPRITE_URL = '/homepage/assets/icons/nmti-icons.svg';
const SPRITE_ID = 'nmti-icon-sprite';

/**
 * Inline the shared SVG sprite for <use href="#icon-*"> references.
 */
export async function loadIconSprite() {
  if (document.getElementById(SPRITE_ID)) return;

  try {
    const res = await fetch(SPRITE_URL, { cache: 'force-cache' });
    if (!res.ok) throw new Error('sprite fetch failed');
    const text = await res.text();
    const wrap = document.createElement('div');
    wrap.id = SPRITE_ID;
    wrap.hidden = true;
    wrap.innerHTML = text;
    const svg = wrap.querySelector('svg');
    if (svg) {
      svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'absolute';
      svg.style.width = '0';
      svg.style.height = '0';
      svg.style.overflow = 'hidden';
      document.body.insertBefore(svg, document.body.firstChild);
      wrap.remove();
      return;
    }
  } catch (_) {
    /* fallback: symbols may already be inline */
  }
}

if (document.body) {
  loadIconSprite();
} else {
  document.addEventListener('DOMContentLoaded', loadIconSprite);
}
