import { TREE, findParentChain, nodePath } from './dictionary.js';
import { getTreeIconId, getTreeIconTier, renderTreeIconMarkup } from './tree-icons.js';

export function renderTree(container, options) {
  const { activeId, onSelect, filter = '' } = options;
  container.innerHTML = '';
  const root = document.createElement('ul');
  root.className = 'tech-tree';
  root.setAttribute('role', 'tree');

  const openIds = activeId ? new Set(findParentChain(activeId)) : new Set(['group-field']);

  TREE.forEach(function (group) {
    root.appendChild(renderNode(group, 0, { activeId, onSelect, filter, openIds }));
  });

  container.appendChild(root);
}

function renderNode(node, depth, ctx) {
  if (node.hidden) return null;

  const li = document.createElement('li');
  const iconTier = getTreeIconTier(node.id);
  li.className = 'tech-tree__item tech-tree__item--' + iconTier;
  li.setAttribute('role', 'none');

  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const isFieldNode = node.id.startsWith('fields/');
  const isCategory = hasChildren && isFieldNode;
  const isFieldLeaf = !hasChildren && isFieldNode;
  const isInstrumentLeaf =
    !hasChildren &&
    (node.id.startsWith('sensors/') || node.id.startsWith('instruments/'));
  const isNavigable = isInstrumentLeaf || isCategory || isFieldLeaf;
  const label = node.label;
  const q = ctx.filter.trim().toLowerCase();
  const selfMatch = !q || label.toLowerCase().includes(q);
  const childFragment = hasChildren
    ? (function () {
        const ul = document.createElement('ul');
        ul.className = 'tech-tree__children';
        ul.setAttribute('role', 'group');
        let any = false;
        node.children.forEach(function (child) {
          const el = renderNode(child, depth + 1, ctx);
          if (el) {
            ul.appendChild(el);
            any = true;
          }
        });
        return any ? ul : null;
      })()
    : null;

  if (!selfMatch && !childFragment) return null;

  const row = document.createElement('div');
  row.className = 'tech-tree__row';
  if (isNavigable && ctx.activeId === node.id) row.classList.add('is-active');

  if (hasChildren) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'tech-tree__toggle';
    const isOpen = ctx.openIds.has(node.id) || !!ctx.filter;
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', (isOpen ? '접기: ' : '펼치기: ') + label);
    toggle.innerHTML = isOpen ? '▼' : '▶';
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.innerHTML = expanded ? '▶' : '▼';
      const childList = li.querySelector(':scope > .tech-tree__children');
      if (childList) childList.hidden = expanded;
    });
    row.appendChild(toggle);
  } else {
    const spacer = document.createElement('span');
    spacer.className = 'tech-tree__spacer';
    spacer.setAttribute('aria-hidden', 'true');
    row.appendChild(spacer);
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tech-tree__label';
  btn.insertAdjacentHTML('afterbegin', renderTreeIconMarkup(getTreeIconId(node.id)));
  const textSpan = document.createElement('span');
  textSpan.className = 'tech-tree__text';
  textSpan.textContent = label;
  btn.appendChild(textSpan);
  btn.setAttribute('role', 'treeitem');
  if (isNavigable) {
    btn.dataset.nodeId = node.id;
    btn.addEventListener('click', function () {
      ctx.onSelect(node.id);
    });
  } else {
    btn.addEventListener('click', function () {
      const toggle = row.querySelector('.tech-tree__toggle');
      if (toggle) toggle.click();
    });
  }
  row.appendChild(btn);

  li.appendChild(row);

  if (childFragment) {
    const isOpen = ctx.openIds.has(node.id) || !!ctx.filter;
    childFragment.hidden = !isOpen;
    li.appendChild(childFragment);
  }

  return li;
}

export function expandToNode(container, nodeId) {
  renderTree(container, {
    activeId: nodeId,
    onSelect: function () {},
    filter: ''
  });
}
