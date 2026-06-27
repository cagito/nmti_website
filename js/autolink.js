import { getKeywordEntries, nodePath } from './technology/dictionary.js';

const SKIP_PARENT_TAGS = new Set([
  'A',
  'SCRIPT',
  'STYLE',
  'TITLE',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
  'BUTTON',
  'CODE',
  'PRE',
  'NAV',
  'H1',
  'H2',
  'H3'
]);

export function applyAutolink(root) {
  const main =
    root ||
    document.getElementById('techContent') ||
    document.getElementById('main');
  if (!main) return;

  const onTechPage = document.body && document.body.classList.contains('tech-page');

  const keywords = getKeywordEntries();
  if (!keywords.length) return;

  const linkedInBlock = new WeakMap();

  walkTextNodes(main, function (textNode) {
    if (shouldSkip(textNode)) return;

    const block = nearestBlock(textNode);
    if (!block) return;

    if (!linkedInBlock.has(block)) linkedInBlock.set(block, new Set());
    const used = linkedInBlock.get(block);

    let text = textNode.nodeValue;
    let changed = false;
    const parts = [];
    let cursor = 0;

    while (cursor < text.length) {
      let matched = null;
      for (let i = 0; i < keywords.length; i++) {
        const { keyword, nodeId } = keywords[i];
        if (used.has(keyword)) continue;
        const re = buildKeywordRegex(keyword);
        re.lastIndex = cursor;
        const m = re.exec(text);
        if (m && m.index === cursor) {
          matched = { keyword, nodeId, length: keyword.length };
          break;
        }
      }

      if (!matched) {
        cursor += 1;
        continue;
      }

      if (cursor > 0) parts.push(document.createTextNode(text.slice(0, cursor)));
      text = text.slice(cursor);

      parts.push(createTechLink(matched.keyword, matched.nodeId, onTechPage));

      used.add(matched.keyword);
      text = text.slice(matched.length);
      cursor = 0;
      changed = true;
    }

    if (!changed) return;
    if (text) parts.push(document.createTextNode(text));
    const parent = textNode.parentNode;
    parts.forEach(function (p) {
      parent.insertBefore(p, textNode);
    });
    parent.removeChild(textNode);
  });
}

export function createTechLink(label, nodeId, onTechPage, extraClass) {
  const a = document.createElement('a');
  a.href = nodePath(nodeId);
  a.className = 'tech-autolink' + (extraClass ? ' ' + extraClass : '');
  a.textContent = label;
  if (onTechPage) {
    a.setAttribute('data-tech-route', nodeId);
  } else {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  return a;
}

function buildKeywordRegex(keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(?<![\\w가-힣])' + escaped + '(?![\\w가-힣])');
}

function shouldSkip(textNode) {
  let p = textNode.parentElement;
  while (p) {
    if (SKIP_PARENT_TAGS.has(p.tagName)) return true;
    if (p.classList && p.classList.contains('tech-autolink')) return true;
    p = p.parentElement;
  }
  return false;
}

function nearestBlock(textNode) {
  let p = textNode.parentElement;
  while (p && p !== document.body) {
    if (/^(P|LI|DD|DT|TD|TH|FIGCAPTION|BLOCKQUOTE|H[4-6])$/.test(p.tagName)) return p;
    if (p.classList && p.classList.contains('tag-list')) return p;
    if (p.id === 'main' || p.id === 'techContent') return p;
    p = p.parentElement;
  }
  return textNode.parentElement;
}

function walkTextNodes(root, fn) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return shouldSkip(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  nodes.forEach(fn);
}

if (!document.body?.classList.contains('tech-page')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyAutolink();
    });
  } else {
    applyAutolink();
  }
}
