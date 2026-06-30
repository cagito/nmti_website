/** Shared helpers for git-sync-newest.mjs */

/** @param {string} p */
export function pathNeedsBuild(p) {
  const n = p.replace(/\\/g, '/');
  return (
    n === 'scripts/image-review-registry.json' ||
    n === 'js/technology/images.js' ||
    /(^|\/)assets\/images\/technology\//.test(n) ||
    /ImageWorks\/NMTI_Engineering_Image_Prompt_Package_v1\/03_IMAGE_MASTER_LIST\.json$/.test(n)
  );
}

/** @param {string[]} paths */
export function anyPathNeedsBuild(paths) {
  return paths.some(pathNeedsBuild);
}
