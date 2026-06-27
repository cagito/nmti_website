import { renderTree } from './tree.js';
import { createRouter } from './router.js';
import { loadContent, renderContent } from './content-loader.js';
import { updateSeo } from './seo.js';
import { nodePath } from './dictionary.js';
import { applyAutolink } from '../autolink.js';
import { initFigureLightbox } from './figure-lightbox.js';
import { initImageProtection } from '../image-protection.js';

const treeEls = ['techTree', 'techTreeMobile']
  .map(function (id) {
    return document.getElementById(id);
  })
  .filter(Boolean);
const contentEl = document.getElementById('techContent');
const searchEls = ['techSearch', 'techSearchMobile']
  .map(function (id) {
    return document.getElementById(id);
  })
  .filter(Boolean);
const treeOffcanvas = document.getElementById('techTreePanel');

let currentNodeId = '';
let router;

function getFilter() {
  return searchEls[0] ? searchEls[0].value : '';
}

function renderAllTrees(nodeId) {
  const opts = {
    activeId: nodeId,
    onSelect: function (id) {
      router.navigate(id);
      closeMobileTree();
    },
    filter: getFilter()
  };
  treeEls.forEach(function (el) {
    renderTree(el, opts);
  });
}

function showContent(nodeId) {
  currentNodeId = nodeId;
  contentEl.setAttribute('aria-busy', 'true');
  contentEl.innerHTML = '<p class="tech-content__loading">불러오는 중…</p>';

  renderAllTrees(nodeId);

  loadContent(nodeId).then(function (data) {
    renderContent(contentEl, data, nodePath);
    updateSeo(nodeId, data);
    applyAutolink(contentEl);
    initFigureLightbox(contentEl);
    initImageProtection(contentEl);
    contentEl.setAttribute('aria-busy', 'false');
    contentEl.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function closeMobileTree() {
  if (!treeOffcanvas) return;
  const bs = window.bootstrap;
  if (bs && bs.Offcanvas) {
    const instance = bs.Offcanvas.getInstance(treeOffcanvas);
    if (instance) instance.hide();
  }
}

router = createRouter(showContent);

if (searchEls.length && treeEls.length) {
  searchEls.forEach(function (input) {
    input.addEventListener('input', function () {
      const value = input.value;
      searchEls.forEach(function (other) {
        if (other !== input) other.value = value;
      });
      renderAllTrees(currentNodeId);
    });
  });
}

router.init();

