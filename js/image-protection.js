/**
 * Client-side image protection — context menu, drag, selection (WATERMARK-01 §4).
 * Not DRM; deters casual save/right-click.
 */

const PROTECT_SELECTOR =
  '.img-protected, .tech-figure:not(.tech-figure--placeholder) img, .tech-seo-hero img, .tech-figure-lightbox img, [data-img-protect]';

function isProtectedTarget(target) {
  if (!target || !target.closest) return false;
  const el = target.closest(PROTECT_SELECTOR);
  if (!el) return false;
  if (el.matches('img')) return true;
  if (el.matches('.tech-figure, .tech-seo-hero, [data-img-protect]')) return !!el.querySelector('img');
  return true;
}

function preventIfProtected(e) {
  if (!isProtectedTarget(e.target)) return;
  e.preventDefault();
}

function markImage(img) {
  if (!img || img.tagName !== 'IMG') return;
  if (img.closest('.tech-figure--placeholder')) return;
  img.classList.add('img-protected');
  img.setAttribute('draggable', 'false');
  img.setAttribute('data-img-protect', '');
  if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
}

function markFigure(figure) {
  if (!figure) return;
  figure.querySelectorAll('img').forEach(markImage);
  if (figure.classList.contains('tech-figure') && !figure.classList.contains('tech-figure--placeholder')) {
    figure.setAttribute('data-watermark-baked', '1');
  }
}

/**
 * @param {ParentNode | null} root
 */
export function initImageProtection(root) {
  const scope = root && root.addEventListener ? root : document;

  if (scope === document && !document.documentElement.dataset.imgProtection) {
    document.documentElement.dataset.imgProtection = '1';
    document.addEventListener('contextmenu', preventIfProtected, true);
    document.addEventListener('dragstart', preventIfProtected, true);
    document.addEventListener('copy', preventIfProtected, true);
  } else if (scope !== document && !scope.dataset?.imgProtectionBound) {
    scope.dataset.imgProtectionBound = '1';
    scope.addEventListener('contextmenu', preventIfProtected, true);
    scope.addEventListener('dragstart', preventIfProtected, true);
    scope.addEventListener('copy', preventIfProtected, true);
  }

  const container = root && root.querySelectorAll ? root : document;
  container.querySelectorAll('.tech-figure, .tech-seo-hero, [data-img-protect]').forEach(markFigure);
  container.querySelectorAll('img.img-protected, img[data-img-protect]').forEach(markImage);
}
