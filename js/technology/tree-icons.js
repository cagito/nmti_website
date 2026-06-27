/** @typedef {'group' | 'category' | 'field-leaf' | 'sensor'} TreeIconTier */

/** Direct nodeId → icon symbol id */
const ICON_MAP = {
  'group-field': 'icon-terrain',
  'group-sensor': 'icon-chip',
  'group-system': 'icon-hub',
  'instruments/sensors': 'icon-chip',
  'instruments/datalogger': 'icon-chip',
  'instruments/communication': 'icon-hub',
  'instruments/power': 'icon-auto',
  'instruments/modes': 'icon-doc',

  'fields/retaining-excavation': 'icon-wall',
  'fields/tunnel': 'icon-tunnel',
  'fields/bridge': 'icon-bridge',
  'fields/slope': 'icon-slope',
  'fields/soft-ground': 'icon-water',
  'fields/structural-safety': 'icon-build',
  'fields/railway': 'icon-auto',
  'fields/dam': 'icon-dam',

  'fields/retaining-excavation/strut': 'icon-load',
  'fields/retaining-excavation/anchor': 'icon-cable',
  'fields/retaining-excavation/adjacent-building': 'icon-factory',
  'fields/slope/rainfall': 'icon-rain',
  'fields/slope/drainage': 'icon-water',
  'fields/structural-safety/crack': 'icon-crack',
  'fields/structural-safety/vibration': 'icon-wave',
  'fields/bridge/vibration': 'icon-wave',
  'fields/dam/leakage': 'icon-water',

  'sensors/inclinometer': 'icon-slope',
  'sensors/water-level-meter': 'icon-water',
  'sensors/piezometer': 'icon-chart',
  'sensors/settlement-gauge': 'icon-load',
  'sensors/layer-settlement-gauge': 'icon-layers',
  'sensors/earth-pressure-cell': 'icon-wall',
  'sensors/load-cell': 'icon-load',
  'sensors/strain-gauge': 'icon-cable',
  'sensors/crack-meter': 'icon-crack',
  'sensors/tilt-meter': 'icon-slope',
  'sensors/joint-meter': 'icon-cable',
  'sensors/displacement-transducer': 'icon-pin',
  'sensors/vibration-meter': 'icon-wave',
  'sensors/automated-total-station': 'icon-map',
  'sensors/gnss': 'icon-pin',
  'sensors/weather-station': 'icon-rain',
  'sensors/datalogger': 'icon-chip',
  'instruments/datalogger/static': 'icon-chip',
  'instruments/datalogger/dynamic': 'icon-wave',
  'instruments/datalogger/multiplexer': 'icon-layers',
  'sensors/remote-monitoring-system': 'icon-hub',
  'instruments/communication/iot-gateway': 'icon-hub',
  'instruments/communication/lte-remote': 'icon-hub',
  'instruments/power/solar-power': 'icon-auto',
  'instruments/power/overview': 'icon-auto',
  'instruments/power/ac-mains': 'icon-hub',
  'instruments/power/avr': 'icon-chip',
  'instruments/power/wind-power': 'icon-wave',
  'instruments/power/battery': 'icon-layers',
  'instruments/modes/overview': 'icon-doc',
  'instruments/modes/manual': 'icon-doc',
  'instruments/modes/automatic': 'icon-chip',
  'instruments/modes/remote-automatic': 'icon-hub',
  'instruments/modes/smart': 'icon-hub',
  'instruments/modes/ai': 'icon-doc',
  'instruments/modes/normal-mode': 'icon-chip',
  'instruments/modes/realtime-mode': 'icon-hub',
  'instruments/modes/alarm-status': 'icon-doc',
  'instruments/data-management': 'icon-chart'
};

const FIELD_CATEGORY_PREFIXES = [
  'fields/retaining-excavation',
  'fields/tunnel',
  'fields/bridge',
  'fields/slope',
  'fields/soft-ground',
  'fields/structural-safety',
  'fields/railway',
  'fields/dam'
];

function parentFieldCategory(nodeId) {
  if (!nodeId.startsWith('fields/')) return null;
  const parts = nodeId.split('/');
  if (parts.length < 2) return null;
  const category = parts[0] + '/' + parts[1];
  return FIELD_CATEGORY_PREFIXES.includes(category) ? category : null;
}

/**
 * @param {string} nodeId
 * @returns {TreeIconTier}
 */
export function getTreeIconTier(nodeId) {
  if (nodeId === 'group-field' || nodeId === 'group-sensor' || nodeId === 'group-system') return 'group';
  if (
    nodeId === 'instruments/datalogger' ||
    nodeId === 'instruments/communication' ||
    nodeId === 'instruments/power' ||
    nodeId === 'instruments/modes'
  ) {
    return 'category';
  }
  if (nodeId.startsWith('sensors/') || nodeId.startsWith('instruments/')) return 'sensor';
  if (nodeId.startsWith('fields/')) {
    const parts = nodeId.split('/');
    return parts.length > 2 ? 'field-leaf' : 'category';
  }
  return 'category';
}

/**
 * @param {string} nodeId
 * @returns {string | null}
 */
export function getTreeIconId(nodeId) {
  if (ICON_MAP[nodeId]) return ICON_MAP[nodeId];

  const category = parentFieldCategory(nodeId);
  if (category && ICON_MAP[category]) return ICON_MAP[category];

  if (nodeId.startsWith('sensors/')) return 'icon-chip';

  if (nodeId.startsWith('instruments/')) return 'icon-doc';

  return 'icon-doc';
}

/**
 * @param {string} iconId
 * @returns {string}
 */
export function renderTreeIconMarkup(iconId) {
  return (
    '<span class="tech-tree__icon" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" focusable="false">' +
    '<use href="#' +
    iconId +
    '"></use>' +
    '</svg></span>'
  );
}
