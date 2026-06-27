/**
 * P0 와이어프레임 Figure 운영 노출 게이트 — docs/122 · docs/123
 * PNG 재작도(rework:done) 완료 시 clearWireframeReplace로 해제.
 */

/** @param {{ wireframeReplace?: boolean } | null | undefined} asset */
export function isWireframeBlocked(asset) {
  return asset?.wireframeReplace === true;
}

/** @param {Record<string, unknown>} reg */
export function clearWireframeReplace(reg) {
  if (!reg?.wireframeReplace) return false;
  delete reg.wireframeReplace;
  reg.wireframeClearedDate = new Date().toISOString().slice(0, 10);
  return true;
}
