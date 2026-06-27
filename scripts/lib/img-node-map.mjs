/**
 * IMG-### → technology nodeId for citation resolution.
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

/** @type {Record<string, string>} */
export const CATEGORY_TO_NODE = {
  '분야별/가시설': 'fields/retaining-excavation',
  '분야별/터널': 'fields/tunnel',
  '분야/터널': 'fields/tunnel',
  '분야별/교량': 'fields/bridge',
  '분야별/사면': 'fields/slope',
  '분야별/연약지반': 'fields/soft-ground',
  '분야별/구조물': 'fields/structural-safety',
  '분야별/철도': 'fields/railway',
  '분야별/댐': 'fields/dam',
  '분야별/항만·호안': 'fields/harbor',
  '분야별/항만': 'fields/harbor',
  '분야별/건축': 'fields/building',
  '분야별/기초말뚝': 'fields/foundation-pile',
  '분야별/환경민원': 'fields/environmental-impact',
  '센서별/지중경사계': 'sensors/inclinometer',
  '센서별/지하수위계': 'sensors/water-level-meter',
  '센서별/간극수압계': 'sensors/piezometer',
  '센서별/침하계': 'sensors/settlement-gauge',
  '센서별/층별침하계': 'sensors/layer-settlement-gauge',
  '센서별/토압계': 'sensors/earth-pressure-cell',
  '센서별/하중계': 'sensors/load-cell',
  '센서별/변형률계': 'sensors/strain-gauge',
  '센서별/균열계': 'sensors/crack-meter',
  '센서별/구조물경사계': 'sensors/tilt-meter',
  '센서별/신축이음계': 'sensors/joint-meter',
  '센서별/변위계': 'sensors/displacement-transducer',
  '센서별/진동계': 'sensors/vibration-meter',
  '센서별/자동광파기': 'sensors/automated-total-station',
  '센서별/GNSS': 'sensors/gnss',
  '센서별/기상계측기': 'sensors/weather-station',
  '시스템/데이터로거': 'instruments/datalogger/static',
  '시스템/게이트웨이': 'instruments/communication/iot-gateway',
  '시스템/전원': 'instruments/power/overview',
  '시스템/통신': 'instruments/communication/lte-remote',
  '시스템/계측방식': 'instruments/modes/overview',
  '시스템/경보': 'instruments/modes/alarm-status',
  '시스템/운영모드': 'instruments/modes/normal-mode',
  '시스템/통합': 'instruments/modes/remote-automatic',
  '시스템/관리기준': 'fields/retaining-excavation',
  '시스템/데이터품질': 'instruments/modes/smart',
  '시스템/대시보드': 'instruments/modes/smart',
  '시스템/보고서': 'instruments/modes/smart',
  '데이터/그래프': 'fields/retaining-excavation',
  '계측기/센서': 'sensors/borehole-extensometer'
};

/** IMG-specific overrides (hero binding · specialized leaf) */
/** @type {Record<string, string>} */
export const IMG_NODE_OVERRIDES = {
  'IMG-008': 'fields/tunnel/convergence',
  'IMG-061': 'fields/tunnel/crown-settlement',
  'IMG-063': 'fields/tunnel/face-advance',
  'IMG-078': 'fields/tunnel/rockbolt',
  'IMG-079': 'fields/tunnel/shotcrete',
  'IMG-080': 'fields/tunnel/steel-support',
  'IMG-097': 'fields/tunnel/blast-vibration',
  'IMG-096': 'fields/retaining-excavation/surrounding-ground',
  'IMG-098': 'fields/harbor/tide-groundwater',
  'IMG-099': 'fields/building/deflection',
  'IMG-100': 'fields/building',
  'IMG-101': 'fields/building/adjacent-building',
  'IMG-089': 'fields/slope/surface-tilt',
  'IMG-090': 'fields/slope/structural-displacement',
  'IMG-091': 'sensors/borehole-extensometer',
  'IMG-092': 'fields/foundation-pile/cast-in-place-pile',
  'IMG-093': 'fields/environmental-impact/noise-level',
  'IMG-094': 'instruments/modes/normal-mode',
  'IMG-095': 'instruments/modes/realtime-mode',
  'IMG-102': 'instruments/modes/alarm-status',
  'IMG-103': 'fields/bridge/deflection',
  'IMG-104': 'sensors/deflection-gauge',
  'IMG-105': 'fields/bridge/cable-tension',
  'IMG-106': 'sensors/cable-tension-meter',
  'IMG-107': 'fields/bridge/strain-stress',
  'IMG-108': 'sensors/stress-free-strain-gauge',
  'IMG-109': 'fields/bridge/wind',
  'IMG-110': 'fields/bridge/bearing-displacement',
  'IMG-084': 'fields/harbor/caisson',
  'IMG-064': 'fields/harbor/quay-wall',
  'IMG-087': 'fields/bridge/seismic',
  'IMG-088': 'fields/bridge/temperature',
  'IMG-086': 'fields/bridge/seismic',
  'IMG-083': 'fields/dam/strain',
  'IMG-033': 'fields/dam/tilt'
};

/** @type {Record<string, string> | null} */
let dictImgCache = null;

/**
 * @param {string | undefined} existing
 * @param {string} candidate
 */
function preferImgNode(existing, candidate) {
  if (!existing) return true;
  const rank = (id) => {
    if (id === 'intro' || id.startsWith('group-')) return 0;
    if (id.startsWith('fields/') || id.startsWith('sensors/') || id.startsWith('instruments/')) {
      return 2;
    }
    return 1;
  };
  return rank(candidate) > rank(existing);
}

/**
 * Build IMG → nodeId from dictionary.js imageId bindings.
 * @returns {Record<string, string>}
 */
export function loadDictionaryImgMap() {
  if (dictImgCache) return dictImgCache;
  const src = readFileSync(join(ROOT, 'js', 'technology', 'dictionary.js'), 'utf8');
  /** @type {Record<string, string>} */
  const map = {};
  const imageRe = /imageId:\s*'(IMG-\d+)'/g;
  let im;
  while ((im = imageRe.exec(src)) !== null) {
    const before = src.slice(Math.max(0, im.index - 1500), im.index);
    let nodeId = null;
    const keyMatch = before.match(
      /'((?:fields|sensors|instruments)(?:\/[^']+)*)':\s*\{[^}]*$/
    );
    if (keyMatch) {
      nodeId = keyMatch[1];
    } else {
      const idMatches = [...before.matchAll(/id:\s*'([^']+)'/g)];
      if (idMatches.length) nodeId = idMatches[idMatches.length - 1][1];
    }
    if (!nodeId) continue;
    const imgId = im[1];
    if (preferImgNode(map[imgId], nodeId)) {
      map[imgId] = nodeId;
    }
  }
  dictImgCache = map;
  return map;
}

/**
 * @param {string} imgId
 * @param {string} [category]
 */
export function resolveNodeForImg(imgId, category) {
  if (IMG_NODE_OVERRIDES[imgId]) return IMG_NODE_OVERRIDES[imgId];
  if (category && CATEGORY_TO_NODE[category]) return CATEGORY_TO_NODE[category];
  const dict = loadDictionaryImgMap();
  if (dict[imgId]) return dict[imgId];
  return 'intro';
}
