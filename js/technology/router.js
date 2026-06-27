import {
  BASE_PATH,
  parseNodeIdFromPath,
  nodePath,
  getNode,
  resolveNodeIdFromLocation
} from './dictionary.js';

export function createRouter(onRoute) {
  function resolveId() {
    if (!isTechnologyApp()) return null;
    return resolveNodeIdFromLocation();
  }

  function isTechnologyApp() {
    const path = window.location.pathname.replace(/\/$/, '').replace(/\/index\.html$/, '');
    const base = BASE_PATH.replace(/\/$/, '');
    return path === base;
  }

  function navigate(nodeId, replace) {
    const url = nodePath(nodeId);
    const state = { nodeId: nodeId };
    if (replace) {
      history.replaceState(state, '', url);
    } else {
      history.pushState(state, '', url);
    }
    onRoute(nodeId);
  }

  function syncUrl(nodeId) {
    const expected = nodePath(nodeId);
    const current = window.location.pathname + window.location.search + window.location.hash;
    if (current !== expected) {
      history.replaceState({ nodeId: nodeId }, '', expected);
    }
  }

  function init() {
    if (!isTechnologyApp()) return;

    const pathSegment = parseNodeIdFromPath(window.location.pathname);
    if (pathSegment) {
      const nodeId = getNode(pathSegment) ? pathSegment : '';
      history.replaceState({ nodeId: nodeId }, '', nodePath(nodeId));
      onRoute(nodeId);
    } else {
      const nodeId = resolveId();
      if (nodeId === null) return;
      syncUrl(nodeId);
      onRoute(nodeId);
    }

    window.addEventListener('popstate', function () {
      const id = resolveId();
      if (id !== null) onRoute(id);
    });

    window.addEventListener('hashchange', function () {
      const id = resolveId();
      if (id !== null) onRoute(id);
    });

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[data-tech-route]');
      if (!link) return;
      const nodeId = link.getAttribute('data-tech-route');
      if (!getNode(nodeId)) return;
      e.preventDefault();
      navigate(nodeId);
    });
  }

  return { init, navigate, resolveId };
}

export { BASE_PATH, nodePath };
