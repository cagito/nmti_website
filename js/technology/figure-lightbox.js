import { initImageProtection } from '../image-protection.js';

/** @type {HTMLDialogElement | null} */
let dialogEl = null;

function protectLightboxImg(img) {
  if (!img) return;
  img.className = 'tech-figure-lightbox__img img-protected';
  img.setAttribute('draggable', 'false');
  img.setAttribute('data-img-protect', '');
}

function ensureDialog() {
  if (dialogEl) return dialogEl;

  dialogEl = document.createElement('dialog');
  dialogEl.className = 'tech-figure-lightbox';
  dialogEl.setAttribute('aria-label', '이미지 확대 보기');
  dialogEl.innerHTML =
    '<div class="tech-figure-lightbox__panel">' +
    '<button type="button" class="tech-figure-lightbox__close" aria-label="닫기">' +
    '<span aria-hidden="true">&times;</span>' +
    '</button>' +
    '<div class="tech-figure-lightbox__media"></div>' +
    '<p class="tech-figure-lightbox__caption"></p>' +
    '</div>';

  document.body.appendChild(dialogEl);

  dialogEl.querySelector('.tech-figure-lightbox__close').addEventListener('click', function () {
    dialogEl.close();
  });

  dialogEl.addEventListener('click', function (e) {
    if (e.target === dialogEl) dialogEl.close();
  });

  return dialogEl;
}

/**
 * @param {HTMLElement} figure
 */
function openLightbox(figure) {
  const picture = figure.querySelector('picture');
  const img = figure.querySelector('img');
  if (!img) return;

  const dlg = ensureDialog();
  const media = dlg.querySelector('.tech-figure-lightbox__media');
  const captionEl = dlg.querySelector('.tech-figure-lightbox__caption');
  const figcaption = figure.querySelector('figcaption');

  media.innerHTML = '';
  if (picture) {
    const clone = picture.cloneNode(true);
    const cloneImg = clone.querySelector('img');
    if (cloneImg) {
      cloneImg.removeAttribute('loading');
      protectLightboxImg(cloneImg);
      cloneImg.decoding = 'async';
    }
    media.appendChild(clone);
  } else {
    const cloneImg = img.cloneNode(true);
    cloneImg.removeAttribute('loading');
    protectLightboxImg(cloneImg);
    cloneImg.decoding = 'async';
    media.appendChild(cloneImg);
  }

  if (figcaption && figcaption.innerHTML.trim()) {
    captionEl.innerHTML = figcaption.innerHTML;
    captionEl.hidden = false;
  } else if (img.alt) {
    captionEl.textContent = img.alt;
    captionEl.hidden = false;
  } else {
    captionEl.innerHTML = '';
    captionEl.hidden = true;
  }

  initImageProtection(dlg);
  dlg.showModal();
}

/**
 * Bind click-to-zoom on all engineering figures under root (SPA + SEO).
 * @param {ParentNode | null} root
 */
export function initFigureLightbox(root) {
  if (!root) return;

  root.querySelectorAll('.tech-figure:not(.tech-figure--placeholder)').forEach(function (figure) {
    if (figure.dataset.zoomReady === '1') return;
    figure.dataset.zoomReady = '1';
    figure.classList.add('tech-figure--zoomable');

    const zoomBtn = figure.querySelector('.tech-figure__zoom');
    if (!zoomBtn) return;

    zoomBtn.addEventListener('click', function () {
      openLightbox(figure);
    });
  });

  root.querySelectorAll('.tech-seo-hero:not([data-zoom-ready])').forEach(function (hero) {
    hero.dataset.zoomReady = '1';
    const img = hero.querySelector('img');
    const figcaption = hero.querySelector('figcaption');
    if (!img) return;

    hero.classList.add('tech-seo-hero--zoomable');
    hero.setAttribute('tabindex', '0');
    hero.setAttribute('role', 'button');
    const label = (figcaption && figcaption.textContent.trim()) || img.alt || '계측 도면';
    hero.setAttribute('aria-label', label + ' — 클릭하여 크게 보기');

    function openHero() {
      const dlg = ensureDialog();
      const media = dlg.querySelector('.tech-figure-lightbox__media');
      const captionEl = dlg.querySelector('.tech-figure-lightbox__caption');
      media.innerHTML = '';
      const picture = hero.querySelector('picture');
      if (picture) {
        const clone = picture.cloneNode(true);
        const cloneImg = clone.querySelector('img');
        if (cloneImg) {
          cloneImg.removeAttribute('loading');
          protectLightboxImg(cloneImg);
        }
        media.appendChild(clone);
      } else {
        const cloneImg = img.cloneNode(true);
        cloneImg.removeAttribute('loading');
        protectLightboxImg(cloneImg);
        media.appendChild(cloneImg);
      }
      if (figcaption && figcaption.innerHTML.trim()) {
        captionEl.innerHTML = figcaption.innerHTML;
        captionEl.hidden = false;
      } else {
        captionEl.textContent = img.alt || '';
        captionEl.hidden = !captionEl.textContent;
      }
      initImageProtection(dlg);
      dlg.showModal();
    }

    hero.addEventListener('click', openHero);
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openHero();
      }
    });
  });
}
