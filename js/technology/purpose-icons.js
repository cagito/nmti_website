export function inferPurposeIcon(title) {
  const t = String(title || '').trim();
  if (/경보|알림/.test(t)) return 'bell';
  if (/저장|버퍼|로그|백업/.test(t)) return 'storage';
  if (/주기|정기|스캔/.test(t)) return 'clock';
  if (/다채널|채널|확장/.test(t)) return 'layers';
  if (/전원|전압|배터리/.test(t)) return 'bolt';
  if (/무선|LTE|전송/.test(t)) return 'signal';
  if (/변위|경사|처짐/.test(t)) return 'move';
  if (/하중|장력|토압/.test(t)) return 'load';
  if (/수위|수압|지하수/.test(t)) return 'water';
  if (/침하|지표/.test(t)) return 'settle';
  if (/균열/.test(t)) return 'crack';
  if (/진동|발파/.test(t)) return 'wave';
  if (/데이터|해석|실시간/.test(t)) return 'chart';
  return 'dot';
}

export function renderPurposeIconHtml(iconId) {
  const id = String(iconId || 'dot')
    .trim()
    .replace(/^icon-/, '');
  return (
    '<span class="purpose-card__icon" aria-hidden="true">' +
    '<svg class="purpose-card__icon-svg" width="24" height="24" viewBox="0 0 24 24" focusable="false">' +
    '<use href="#icon-' +
    escapeAttr(id) +
    '"></use>' +
    '</svg></span>'
  );
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}
