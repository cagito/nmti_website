/** @typedef {{ id: string, label: string, hidden?: boolean, children?: TreeNode[] }} TreeNode */
/** @typedef {{ id: string, label: string, type: 'group'|'category'|'field'|'sensor'|'instrument'|'mode', parentId?: string, keywords?: string[], relatedSensors?: string[], relatedFields?: string[], metaDescription?: string, imageId?: string }} NodeMeta */

export const BASE_PATH = '/homepage/technology';

/** Hash-based SPA URLs — no IIS rewrite. See docs/DEPLOYMENT-IIS.md */

/** @type {TreeNode[]} */
export const TREE = [
  {
    id: 'group-field',
    label: '구조물·공종별',
    children: [
      {
        id: 'fields/retaining-excavation',
        label: '가시설·흙막이',
        children: [
          { id: 'fields/retaining-excavation/earth-retaining-wall', label: '흙막이 벽체' },
          { id: 'fields/retaining-excavation/strut', label: '버팀보' },
          { id: 'fields/retaining-excavation/anchor', label: '어스앵커' },
          { id: 'fields/retaining-excavation/adjacent-building', label: '주변건물' },
          { id: 'fields/retaining-excavation/surrounding-ground', label: '주변지반' }
        ]
      },
      {
        id: 'fields/tunnel',
        label: '터널',
        children: [
          { id: 'fields/tunnel/surface-subsidence', label: '지표·지중침하' },
          { id: 'fields/tunnel/crown-settlement', label: '천단침하' },
          { id: 'fields/tunnel/convergence', label: '내공변위' },
          { id: 'fields/tunnel/ground-displacement', label: '지중변위' },
          { id: 'fields/tunnel/face-advance', label: '막장전방 선행변위' },
          { id: 'fields/tunnel/rockbolt', label: '록볼트 축력' },
          { id: 'fields/tunnel/shotcrete', label: '숏크리트' },
          { id: 'fields/tunnel/blast-vibration', label: '발파진동·영향권' },
          { id: 'fields/tunnel/steel-support', label: '강지보 응력' },
          { id: 'fields/tunnel/construction-phase', label: '건설중 계측' }
        ]
      },
      {
        id: 'fields/bridge',
        label: '교량',
        children: [
          { id: 'fields/bridge/pier', label: '교각' },
          { id: 'fields/bridge/abutment', label: '교대' },
          { id: 'fields/bridge/foundation-settlement', label: '기초침하' },
          { id: 'fields/bridge/strain-stress', label: '변형률·응력' },
          { id: 'fields/bridge/deflection', label: '처짐' },
          { id: 'fields/bridge/expansion-joint', label: '신축이음량' },
          { id: 'fields/bridge/cable-tension', label: '케이블 장력' },
          { id: 'fields/bridge/bearing-displacement', label: '받침부 변위' },
          { id: 'fields/bridge/wind', label: '풍하중' },
          { id: 'fields/bridge/vibration', label: '진동' },
          { id: 'fields/bridge/temperature', label: '온도' },
          { id: 'fields/bridge/seismic', label: '지진' }
        ]
      },
      {
        id: 'fields/slope',
        label: '사면',
        children: [
          { id: 'fields/slope/ground-displacement', label: '지중변위' },
          { id: 'fields/slope/surface-tilt', label: '지표경사' },
          { id: 'fields/slope/structural-displacement', label: '구조물 변위' },
          { id: 'fields/slope/groundwater', label: '지하수위' },
          { id: 'fields/slope/slip-surface', label: '활동면' },
          { id: 'fields/slope/rainfall', label: '강우' },
          { id: 'fields/slope/drainage', label: '배수시설' }
        ]
      },
      {
        id: 'fields/soft-ground',
        label: '연약 지반',
        children: [
          { id: 'fields/soft-ground/settlement', label: '침하' },
          { id: 'fields/soft-ground/layer-settlement', label: '층별침하' },
          { id: 'fields/soft-ground/pore-pressure', label: '간극수압' },
          { id: 'fields/soft-ground/lateral-flow', label: '측방유동' }
        ]
      },
      {
        id: 'fields/structural-safety',
        label: '구조물 안전',
        children: [
          { id: 'fields/structural-safety/crack', label: '균열' },
          { id: 'fields/structural-safety/tilt', label: '경사' },
          { id: 'fields/structural-safety/displacement', label: '변위' },
          { id: 'fields/structural-safety/vibration', label: '진동' }
        ]
      },
      {
        id: 'fields/railway',
        label: '철도',
        children: [
          { id: 'fields/railway/track-settlement', label: '노반침하' },
          { id: 'fields/railway/track-displacement', label: '궤도변위' },
          { id: 'fields/railway/adjacent-construction', label: '인접공사 영향' },
          { id: 'fields/railway/construction-phase', label: '건설중 계측' }
        ]
      },
      {
        id: 'fields/dam',
        label: '댐·제방',
        children: [
          { id: 'fields/dam/leakage', label: '침투·누수' },
          { id: 'fields/dam/pore-pressure', label: '수위·수압' },
          { id: 'fields/dam/settlement', label: '침하' },
          { id: 'fields/dam/displacement', label: '변위' },
          { id: 'fields/dam/strain', label: '응력·변형률' },
          { id: 'fields/dam/tilt', label: '기울기' },
          { id: 'fields/dam/temperature', label: '온도' },
          { id: 'fields/dam/seismic', label: '지진' },
          { id: 'fields/dam/river-levee', label: '하천제방' },
          { id: 'fields/dam/construction-phase', label: '건설중 계측' }
        ]
      },
      {
        id: 'fields/harbor',
        label: '항만·해안',
        children: [
          { id: 'fields/harbor/structure', label: '항만구조물' },
          { id: 'fields/harbor/quay-wall', label: '안벽' },
          { id: 'fields/harbor/caisson', label: '케이슨' },
          { id: 'fields/harbor/surrounding-ground', label: '주변지반' },
          { id: 'fields/harbor/tide-groundwater', label: '조위·지하수' }
        ]
      },
      {
        id: 'fields/building',
        label: '건축·인접 구조물',
        children: [
          { id: 'fields/building/deflection', label: '처짐' },
          { id: 'fields/building/column-shortening', label: '기둥 축소량' },
          { id: 'fields/building/crack', label: '균열' },
          { id: 'fields/building/adjacent-building', label: '주변건물' },
          { id: 'fields/building/stress-strain', label: '응력·변형률' }
        ]
      },
      {
        id: 'fields/foundation-pile',
        label: '기초·말뚝',
        children: [
          { id: 'fields/foundation-pile/cast-in-place-pile', label: '현장타설말뚝' },
          { id: 'fields/foundation-pile/precast-pile', label: '기성말뚝' }
        ]
      },
      {
        id: 'fields/environmental-impact',
        label: '환경·민원',
        children: [
          { id: 'fields/environmental-impact/noise-level', label: '소음' },
          { id: 'fields/environmental-impact/dust-concentration', label: '분진' }
        ]
      }
    ]
  },
  {
    id: 'group-sensor',
    label: '계측센서별',
    children: [
      { id: 'sensors/inclinometer', label: '지중경사계' },
      { id: 'sensors/water-level-meter', label: '지하수위계' },
      { id: 'sensors/piezometer', label: '간극수압계' },
      { id: 'sensors/settlement-gauge', label: '침하계' },
      { id: 'sensors/layer-settlement-gauge', label: '층별침하계' },
      { id: 'sensors/earth-pressure-cell', label: '토압계' },
      { id: 'sensors/load-cell', label: '하중계' },
      { id: 'sensors/strain-gauge', label: '변형률계' },
      { id: 'sensors/stress-free-strain-gauge', label: '무응력계' },
      { id: 'sensors/crack-meter', label: '균열계' },
      { id: 'sensors/tilt-meter', label: '구조물경사계' },
      { id: 'sensors/joint-meter', label: '신축이음계' },
      { id: 'sensors/cable-tension-meter', label: '케이블장력계' },
      { id: 'sensors/borehole-extensometer', label: '다점지중변위계' },
      { id: 'sensors/displacement-transducer', label: '변위계' },
      { id: 'sensors/deflection-gauge', label: '처짐계' },
      { id: 'sensors/vibration-meter', label: '진동계' },
      { id: 'sensors/automated-total-station', label: '자동광파기' },
      { id: 'sensors/gnss', label: 'GNSS' },
      { id: 'sensors/weather-station', label: '기상계측기' }
    ]
  },
  {
    id: 'group-system',
    label: '계측 시스템',
    children: [
      {
        id: 'instruments/modes',
        label: '계측 방식',
        children: [
          { id: 'instruments/modes/overview', label: '계측 방식 개요' },
          { id: 'instruments/modes/manual', label: '수동 계측' },
          { id: 'instruments/modes/automatic', label: '자동 계측' },
          { id: 'instruments/modes/remote-automatic', label: '원격 자동계측' },
          { id: 'instruments/modes/smart', label: '스마트 계측' },
          { id: 'instruments/modes/ai', label: 'AI 계측' },
          { id: 'instruments/modes/normal-mode', label: '상시 계측 모드' },
          { id: 'instruments/modes/realtime-mode', label: '실시간·이벤트 계측' },
          { id: 'instruments/modes/alarm-status', label: '경보·알림 상태' }
        ]
      },
      {
        id: 'instruments/datalogger',
        label: '데이터 로거',
        children: [
          { id: 'sensors/datalogger', label: '데이터 로거 개요' },
          { id: 'instruments/datalogger/static', label: '정적 데이터 로거' },
          { id: 'instruments/datalogger/dynamic', label: '동적 데이터 로거' },
          { id: 'instruments/datalogger/multiplexer', label: '멀티플렉서' }
        ]
      },
      {
        id: 'instruments/communication',
        label: '통신·전송',
        children: [
          { id: 'instruments/communication/iot-gateway', label: 'IoT 게이트웨이' },
          { id: 'instruments/communication/lte-remote', label: 'LTE M2M' }
        ]
      },
      {
        id: 'instruments/power',
        label: '전원 구성',
        children: [
          { id: 'instruments/power/overview', label: '전원 개요' },
          { id: 'instruments/power/solar-power', label: '태양광 전원' },
          { id: 'instruments/power/ac-mains', label: '상시 전원' },
          { id: 'instruments/power/avr', label: 'AVR' },
          { id: 'instruments/power/wind-power', label: '풍력 발전' },
          { id: 'instruments/power/battery', label: '배터리' }
        ]
      },
      { id: 'sensors/remote-monitoring-system', label: '원격 모니터링' },
      { id: 'instruments/data-management', label: '데이터 관리' }
    ]
  }
];

const CATEGORY_LABELS = {
  'fields/retaining-excavation': '가시설·흙막이',
  'fields/tunnel': '터널',
  'fields/bridge': '교량',
  'fields/slope': '사면',
  'fields/soft-ground': '연약 지반',
  'fields/structural-safety': '구조물 안전',
  'fields/railway': '철도',
  'fields/dam': '댐·제방',
  'fields/harbor': '항만·해안',
  'fields/building': '건축·인접 구조물',
  'fields/foundation-pile': '기초·말뚝',
  'fields/environmental-impact': '환경·민원',
  'group-sensor': '계측센서별',
  'group-field': '구조물·공종별',
  'group-system': '계측 시스템'
};

/** Legacy paths from earlier SPA version */
export const LEGACY_PATH_MAP = {
  'sensor/inclinometer': 'sensors/inclinometer',
  'sensor/water-level': 'sensors/water-level-meter',
  'sensor/pore-pressure': 'sensors/piezometer',
  'sensor/settlement': 'sensors/settlement-gauge',
  'sensor/multipoint-settlement': 'sensors/layer-settlement-gauge',
  'sensor/earth-pressure': 'sensors/earth-pressure-cell',
  'sensor/load-cell': 'sensors/load-cell',
  'sensor/strain-gauge': 'sensors/strain-gauge',
  'sensor/crack-meter': 'sensors/crack-meter',
  'sensor/tilt-meter': 'sensors/tilt-meter',
  'sensor/extensometer': 'sensors/borehole-extensometer',
  'sensor/displacement': 'sensors/displacement-transducer',
  'sensor/vibration': 'sensors/vibration-meter',
  'sensor/automatic-total-station': 'sensors/automated-total-station',
  'sensor/gnss': 'sensors/gnss',
  'sensor/weather-station': 'sensors/weather-station',
  'sensor/data-logger': 'sensors/datalogger',
  'sensor/remote-monitoring': 'sensors/remote-monitoring-system',
  'field/shoring/earth-retaining': 'fields/retaining-excavation/earth-retaining-wall',
  'field/shoring/strut': 'fields/retaining-excavation/strut',
  'field/shoring/anchor': 'fields/retaining-excavation/anchor',
  'field/shoring/adjacent-building': 'fields/retaining-excavation/adjacent-building',
  'field/shoring/surrounding-ground': 'fields/retaining-excavation/surrounding-ground'
};

/** @type {Record<string, NodeMeta>} */
export const NODES = buildNodes();

function buildNodes() {
  /** @type {Record<string, NodeMeta>} */
  const nodes = {
    intro: {
      id: 'intro',
      label: '소개',
      type: 'group',
      imageId: 'IMG-001',
      metaDescription:
        '구조물·공종별·계측센서별·계측 시스템 기술 자료 — 개요, 측정 원리, 설치, 데이터 해석, 관리기준을 정리합니다.'
    }
  };

  function resolveNodeType(id, hasChildren) {
    if (id.startsWith('sensors/')) return 'sensor';
    if (id.startsWith('instruments/modes/')) return 'mode';
    if (id.startsWith('instruments/')) return hasChildren ? 'group' : 'instrument';
    if (id.startsWith('fields/')) return hasChildren ? 'category' : 'field';
    return 'group';
  }

  function walk(items, parentId) {
    items.forEach(function (item) {
      const hasChildren = item.children && item.children.length;
      const type = resolveNodeType(item.id, hasChildren);
      nodes[item.id] = {
        id: item.id,
        label: item.label,
        type: type,
        parentId: parentId
      };
      if (hasChildren) walk(item.children, item.id);
    });
  }

  TREE.forEach(function (group) {
    if (group.children) walk(group.children, group.id);
  });

  Object.assign(nodes, {
    'fields/retaining-excavation': {
      ...nodes['fields/retaining-excavation'],
      relatedSensors: [
        'sensors/inclinometer',
        'sensors/load-cell',
        'sensors/water-level-meter',
        'sensors/earth-pressure-cell',
        'sensors/crack-meter',
        'sensors/tilt-meter',
        'sensors/settlement-gauge',
        'sensors/automated-total-station'
      ],
      imageId: 'IMG-001',
      metaDescription:
        '가시설 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.'
    },
    'fields/retaining-excavation/earth-retaining-wall': {
      ...nodes['fields/retaining-excavation/earth-retaining-wall'],
      relatedSensors: [
        'sensors/inclinometer',
        'sensors/water-level-meter',
        'sensors/piezometer',
        'sensors/earth-pressure-cell',
        'sensors/load-cell',
        'sensors/settlement-gauge',
        'sensors/crack-meter',
        'sensors/tilt-meter',
        'sensors/strain-gauge'
      ],
      relatedFields: [
        'fields/retaining-excavation/strut',
        'fields/retaining-excavation/anchor',
        'fields/retaining-excavation/surrounding-ground',
        'fields/retaining-excavation/adjacent-building'
      ],
      imageId: 'IMG-002'
    },
    'fields/retaining-excavation/strut': {
      ...nodes['fields/retaining-excavation/strut'],
      relatedSensors: ['sensors/load-cell', 'sensors/strain-gauge'],
      relatedFields: ['fields/retaining-excavation/earth-retaining-wall', 'fields/retaining-excavation/anchor'],
      imageId: 'IMG-003'
    },
    'fields/retaining-excavation/anchor': {
      ...nodes['fields/retaining-excavation/anchor'],
      relatedSensors: ['sensors/load-cell'],
      relatedFields: ['fields/retaining-excavation/strut'],
      imageId: 'IMG-004'
    },
    'fields/retaining-excavation/adjacent-building': {
      ...nodes['fields/retaining-excavation/adjacent-building'],
      relatedSensors: ['sensors/crack-meter', 'sensors/tilt-meter', 'sensors/automated-total-station'],
      relatedFields: ['fields/retaining-excavation/surrounding-ground'],
      imageId: 'IMG-005'
    },
    'fields/retaining-excavation/surrounding-ground': {
      ...nodes['fields/retaining-excavation/surrounding-ground'],
      relatedSensors: ['sensors/inclinometer', 'sensors/settlement-gauge', 'sensors/piezometer'],
      relatedFields: ['fields/retaining-excavation/earth-retaining-wall', 'fields/retaining-excavation/adjacent-building'],
      imageId: 'IMG-096'
    },
    'fields/tunnel': {
      ...nodes['fields/tunnel'],
      relatedSensors: [
        'sensors/settlement-gauge',
        'sensors/displacement-transducer',
        'sensors/inclinometer',
        'sensors/load-cell',
        'sensors/automated-total-station',
        'sensors/tilt-meter',
        'sensors/vibration-meter'
      ],
      imageId: 'IMG-007',
      metaDescription:
        '터널 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.'
    },
    'fields/tunnel/crown-settlement': {
      ...nodes['fields/tunnel/crown-settlement'],
      relatedSensors: ['sensors/settlement-gauge', 'sensors/automated-total-station'],
      imageId: 'IMG-061'
    },
    'fields/tunnel/surface-subsidence': {
      ...nodes['fields/tunnel/surface-subsidence'],
      relatedSensors: [
        'sensors/settlement-gauge',
        'sensors/inclinometer',
        'sensors/automated-total-station',
        'sensors/tilt-meter',
        'sensors/vibration-meter'
      ],
      imageId: 'IMG-010'
    },
    'fields/tunnel/convergence': {
      ...nodes['fields/tunnel/convergence'],
      relatedSensors: ['sensors/displacement-transducer', 'sensors/automated-total-station'],
      imageId: 'IMG-008'
    },
    'fields/tunnel/ground-displacement': {
      ...nodes['fields/tunnel/ground-displacement'],
      relatedSensors: ['sensors/inclinometer', 'sensors/settlement-gauge', 'sensors/automated-total-station'],
      imageId: 'IMG-025'
    },
    'fields/tunnel/face-advance': {
      ...nodes['fields/tunnel/face-advance'],
      relatedSensors: ['sensors/displacement-transducer', 'sensors/settlement-gauge'],
      imageId: 'IMG-063'
    },
    'fields/tunnel/rockbolt': {
      ...nodes['fields/tunnel/rockbolt'],
      relatedSensors: ['sensors/load-cell', 'sensors/strain-gauge'],
      imageId: 'IMG-078'
    },
    'fields/tunnel/shotcrete': {
      ...nodes['fields/tunnel/shotcrete'],
      relatedSensors: ['sensors/strain-gauge'],
      imageId: 'IMG-079'
    },
    'fields/tunnel/blast-vibration': {
      ...nodes['fields/tunnel/blast-vibration'],
      keywords: ['발파진동', '발파 영향권', 'PPV'],
      relatedSensors: ['sensors/vibration-meter', 'instruments/datalogger/dynamic'],
      relatedFields: ['fields/tunnel/surface-subsidence', 'fields/tunnel/convergence'],
      imageId: 'IMG-097'
    },
    'fields/tunnel/steel-support': {
      ...nodes['fields/tunnel/steel-support'],
      relatedSensors: ['sensors/strain-gauge', 'sensors/load-cell'],
      imageId: 'IMG-080'
    },
    'fields/tunnel/construction-phase': {
      ...nodes['fields/tunnel/construction-phase'],
      keywords: [
        '건설중 계측',
        '터널 시공 계측',
        'railway tunnel monitoring',
        'tunnel monitoring'
      ],
      relatedSensors: [
        'sensors/settlement-gauge',
        'sensors/displacement-transducer',
        'sensors/inclinometer',
        'sensors/automated-total-station',
        'sensors/vibration-meter'
      ],
      relatedFields: [
        'fields/tunnel/convergence',
        'fields/tunnel/crown-settlement',
        'fields/tunnel/surface-subsidence',
        'fields/tunnel/blast-vibration',
        'fields/railway/construction-phase'
      ],
      metaDescription:
        '터널 건설중 계측 — 굴착·지보·라이닝 단계별 내공·천단·지표 변위와 운행철도 구간 보호. Railway tunnel monitoring during construction.'
    },
    'fields/bridge': {
      ...nodes['fields/bridge'],
      relatedFields: [
        'fields/bridge/deflection',
        'fields/bridge/cable-tension',
        'fields/bridge/strain-stress',
        'fields/bridge/expansion-joint',
        'fields/bridge/wind',
        'fields/bridge/vibration'
      ],
      relatedSensors: [
        'sensors/tilt-meter',
        'sensors/strain-gauge',
        'sensors/deflection-gauge',
        'sensors/cable-tension-meter',
        'sensors/settlement-gauge',
        'sensors/vibration-meter',
        'sensors/gnss',
        'sensors/automated-total-station',
        'sensors/weather-station'
      ],
      imageId: 'IMG-011',
      metaDescription:
        '교량 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.'
    },
    'fields/bridge/pier': {
      ...nodes['fields/bridge/pier'],
      relatedFields: ['fields/bridge/cable-tension', 'fields/bridge/wind', 'fields/bridge/foundation-settlement'],
      relatedSensors: ['sensors/tilt-meter', 'sensors/strain-gauge'],
      imageId: 'IMG-012'
    },
    'fields/bridge/abutment': {
      ...nodes['fields/bridge/abutment'],
      relatedSensors: ['sensors/tilt-meter', 'sensors/settlement-gauge'],
      imageId: 'IMG-038'
    },
    'fields/bridge/foundation-settlement': {
      ...nodes['fields/bridge/foundation-settlement'],
      relatedSensors: ['sensors/settlement-gauge', 'sensors/water-level-meter'],
      imageId: 'IMG-013'
    },
    'fields/bridge/strain-stress': {
      ...nodes['fields/bridge/strain-stress'],
      relatedFields: ['fields/bridge/cable-tension', 'fields/bridge/temperature', 'fields/bridge/deflection'],
      relatedSensors: ['sensors/strain-gauge', 'sensors/stress-free-strain-gauge', 'sensors/weather-station'],
      imageId: 'IMG-107'
    },
    'fields/bridge/deflection': {
      ...nodes['fields/bridge/deflection'],
      relatedFields: ['fields/bridge/cable-tension', 'fields/bridge/wind', 'fields/bridge/foundation-settlement'],
      relatedSensors: ['sensors/deflection-gauge', 'sensors/automated-total-station', 'sensors/displacement-transducer'],
      imageId: 'IMG-103'
    },
    'fields/bridge/expansion-joint': {
      ...nodes['fields/bridge/expansion-joint'],
      relatedSensors: ['sensors/joint-meter', 'sensors/displacement-transducer'],
      imageId: 'IMG-014'
    },
    'fields/bridge/cable-tension': {
      ...nodes['fields/bridge/cable-tension'],
      relatedSensors: ['sensors/cable-tension-meter', 'sensors/vibration-meter', 'sensors/strain-gauge'],
      imageId: 'IMG-105'
    },
    'fields/bridge/bearing-displacement': {
      ...nodes['fields/bridge/bearing-displacement'],
      relatedSensors: ['sensors/displacement-transducer', 'sensors/tilt-meter', 'sensors/deflection-gauge'],
      imageId: 'IMG-110'
    },
    'fields/bridge/wind': {
      ...nodes['fields/bridge/wind'],
      relatedFields: ['fields/bridge/cable-tension', 'fields/bridge/vibration', 'fields/bridge/deflection'],
      relatedSensors: ['sensors/weather-station', 'sensors/vibration-meter', 'sensors/deflection-gauge'],
      imageId: 'IMG-109'
    },
    'fields/bridge/vibration': {
      ...nodes['fields/bridge/vibration'],
      relatedFields: ['fields/bridge/cable-tension', 'fields/bridge/wind', 'fields/bridge/deflection'],
      relatedSensors: ['sensors/vibration-meter', 'sensors/cable-tension-meter'],
      imageId: 'IMG-086'
    },
    'fields/bridge/temperature': {
      ...nodes['fields/bridge/temperature'],
      relatedSensors: ['sensors/strain-gauge', 'sensors/weather-station', 'sensors/joint-meter'],
      imageId: 'IMG-088'
    },
    'fields/bridge/seismic': {
      ...nodes['fields/bridge/seismic'],
      relatedSensors: ['sensors/vibration-meter', 'sensors/displacement-transducer', 'sensors/strain-gauge'],
      imageId: 'IMG-087'
    },
    'fields/slope': {
      ...nodes['fields/slope'],
      relatedSensors: [
        'sensors/inclinometer',
        'sensors/water-level-meter',
        'sensors/piezometer',
        'sensors/weather-station'
      ],
      imageId: 'IMG-015',
      metaDescription:
        '사면 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.'
    },
    'fields/slope/slip-surface': {
      ...nodes['fields/slope/slip-surface'],
      relatedSensors: ['sensors/inclinometer', 'sensors/piezometer'],
      imageId: 'IMG-016'
    },
    'fields/slope/rainfall': {
      ...nodes['fields/slope/rainfall'],
      relatedSensors: ['sensors/weather-station', 'sensors/water-level-meter'],
      imageId: 'IMG-018'
    },
    'fields/slope/surface-tilt': {
      ...nodes['fields/slope/surface-tilt'],
      relatedSensors: ['sensors/tilt-meter'],
      imageId: 'IMG-089'
    },
    'fields/slope/structural-displacement': {
      ...nodes['fields/slope/structural-displacement'],
      relatedSensors: ['sensors/automated-total-station', 'sensors/displacement-transducer'],
      imageId: 'IMG-090'
    },
    'fields/soft-ground': {
      ...nodes['fields/soft-ground'],
      relatedSensors: [
        'sensors/settlement-gauge',
        'sensors/layer-settlement-gauge',
        'sensors/piezometer',
        'sensors/inclinometer'
      ],
      imageId: 'IMG-019',
      metaDescription:
        '연약지반 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.'
    },
    'fields/soft-ground/settlement': {
      ...nodes['fields/soft-ground/settlement'],
      relatedSensors: ['sensors/settlement-gauge', 'sensors/layer-settlement-gauge'],
      imageId: 'IMG-020'
    },
    'fields/soft-ground/lateral-flow': {
      ...nodes['fields/soft-ground/lateral-flow'],
      relatedSensors: ['sensors/inclinometer', 'sensors/piezometer'],
      imageId: 'IMG-021'
    },
    'fields/structural-safety': {
      ...nodes['fields/structural-safety'],
      relatedSensors: [
        'sensors/crack-meter',
        'sensors/tilt-meter',
        'sensors/displacement-transducer',
        'sensors/vibration-meter'
      ],
      imageId: 'IMG-022',
      metaDescription:
        '구조물 안전계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.'
    },
    'fields/railway': {
      ...nodes['fields/railway'],
      relatedSensors: [
        'sensors/settlement-gauge',
        'sensors/vibration-meter',
        'sensors/automated-total-station',
        'sensors/gnss'
      ],
      imageId: 'IMG-023',
      metaDescription:
        '철도·고속철도 계측 — 노반·궤도 변위, 건설중·운영기 계측, 인접공사 연계를 정리한 기술자료입니다.'
    },
    'fields/railway/construction-phase': {
      ...nodes['fields/railway/construction-phase'],
      keywords: [
        '건설중 계측',
        '고속철도 계측',
        'high-speed railway monitoring',
        'HSR monitoring',
        'rail track monitoring'
      ],
      relatedSensors: [
        'sensors/settlement-gauge',
        'sensors/automated-total-station',
        'sensors/vibration-meter',
        'sensors/gnss'
      ],
      relatedFields: [
        'fields/railway/track-settlement',
        'fields/railway/track-displacement',
        'fields/railway/adjacent-construction',
        'fields/tunnel/construction-phase'
      ],
      metaDescription:
        '철도·고속철도 건설중 계측 — 노반·궤도 시공 단계별 침하·변위와 인접공사 연계. High-speed railway monitoring during construction.'
    },
    'fields/dam': {
      ...nodes['fields/dam'],
      relatedSensors: [
        'sensors/piezometer',
        'sensors/water-level-meter',
        'sensors/inclinometer',
        'sensors/settlement-gauge',
        'sensors/strain-gauge',
        'sensors/tilt-meter',
        'sensors/vibration-meter'
      ],
      imageId: 'IMG-024',
      metaDescription:
        '댐 안전관리 계측 체계 — 저수위·간극수압·누수·침하·변위를 연계하여 이상징후를 조기 판단하는 기술자료입니다.'
    },
    'fields/dam/temperature': {
      ...nodes['fields/dam/temperature'],
      relatedSensors: ['sensors/strain-gauge', 'sensors/weather-station'],
      imageId: 'IMG-088'
    },
    'fields/dam/seismic': {
      ...nodes['fields/dam/seismic'],
      relatedSensors: ['sensors/vibration-meter', 'sensors/displacement-transducer'],
      imageId: 'IMG-087'
    },
    'fields/dam/strain': {
      ...nodes['fields/dam/strain'],
      relatedSensors: ['sensors/strain-gauge'],
      imageId: 'IMG-083'
    },
    'fields/dam/tilt': {
      ...nodes['fields/dam/tilt'],
      relatedSensors: ['sensors/tilt-meter', 'sensors/automated-total-station'],
      imageId: 'IMG-033'
    },
    'fields/dam/river-levee': {
      ...nodes['fields/dam/river-levee'],
      keywords: ['하천제방', '제방'],
      relatedSensors: [
        'sensors/piezometer',
        'sensors/water-level-meter',
        'sensors/settlement-gauge',
        'sensors/inclinometer'
      ],
      imageId: 'IMG-024'
    },
    'fields/dam/construction-phase': {
      ...nodes['fields/dam/construction-phase'],
      keywords: [
        '건설중 계측',
        '댐 축조 계측',
        'dam construction monitoring',
        'dam construction monitoring software',
        'dam monitoring software'
      ],
      relatedSensors: [
        'sensors/piezometer',
        'sensors/settlement-gauge',
        'sensors/inclinometer',
        'sensors/strain-gauge',
        'sensors/datalogger'
      ],
      relatedFields: [
        'fields/dam/settlement',
        'fields/dam/displacement',
        'fields/dam/temperature',
        'sensors/remote-monitoring-system',
        'instruments/data-management'
      ],
      metaDescription:
        '댐·제방 건설중 계측 — 축조·성토 단계 변위·수압·온도와 원격계측 SW 연계. Dam construction monitoring and integrated monitoring software.'
    },
    'fields/harbor': {
      ...nodes['fields/harbor'],
      relatedSensors: [
        'sensors/displacement-transducer',
        'sensors/settlement-gauge',
        'sensors/water-level-meter',
        'sensors/piezometer',
        'sensors/inclinometer'
      ],
      imageId: 'IMG-064',
      metaDescription:
        '항만·호안 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.'
    },
    'fields/harbor/structure': {
      ...nodes['fields/harbor/structure'],
      relatedSensors: ['sensors/displacement-transducer', 'sensors/tilt-meter', 'sensors/strain-gauge'],
      imageId: 'IMG-084'
    },
    'fields/harbor/quay-wall': {
      ...nodes['fields/harbor/quay-wall'],
      relatedSensors: [
        'sensors/tilt-meter',
        'sensors/earth-pressure-cell',
        'sensors/displacement-transducer'
      ],
      imageId: 'IMG-064'
    },
    'fields/harbor/caisson': {
      ...nodes['fields/harbor/caisson'],
      relatedSensors: [
        'sensors/tilt-meter',
        'sensors/earth-pressure-cell',
        'sensors/displacement-transducer'
      ],
      imageId: 'IMG-084'
    },
    'fields/harbor/surrounding-ground': {
      ...nodes['fields/harbor/surrounding-ground'],
      relatedSensors: ['sensors/inclinometer', 'sensors/settlement-gauge', 'sensors/piezometer'],
      imageId: 'IMG-064'
    },
    'fields/harbor/tide-groundwater': {
      ...nodes['fields/harbor/tide-groundwater'],
      relatedSensors: ['sensors/water-level-meter', 'sensors/piezometer'],
      imageId: 'IMG-098'
    },
    'fields/building': {
      ...nodes['fields/building'],
      relatedSensors: [
        'sensors/strain-gauge',
        'sensors/crack-meter',
        'sensors/tilt-meter',
        'sensors/displacement-transducer',
        'sensors/load-cell',
        'sensors/automated-total-station'
      ],
      imageId: 'IMG-100',
      metaDescription:
        '건축공사 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.'
    },
    'fields/building/deflection': {
      ...nodes['fields/building/deflection'],
      relatedSensors: ['sensors/displacement-transducer', 'sensors/automated-total-station', 'sensors/tilt-meter'],
      imageId: 'IMG-099'
    },
    'fields/building/column-shortening': {
      ...nodes['fields/building/column-shortening'],
      relatedSensors: ['sensors/strain-gauge', 'sensors/displacement-transducer'],
      imageId: 'IMG-081'
    },
    'fields/building/crack': {
      ...nodes['fields/building/crack'],
      relatedSensors: ['sensors/crack-meter', 'sensors/tilt-meter'],
      imageId: 'IMG-037'
    },
    'fields/building/adjacent-building': {
      ...nodes['fields/building/adjacent-building'],
      relatedSensors: ['sensors/crack-meter', 'sensors/tilt-meter', 'sensors/automated-total-station'],
      relatedFields: ['fields/retaining-excavation/adjacent-building'],
      imageId: 'IMG-101'
    },
    'fields/building/stress-strain': {
      ...nodes['fields/building/stress-strain'],
      relatedSensors: ['sensors/strain-gauge', 'sensors/load-cell'],
      imageId: 'IMG-082'
    },
    'fields/foundation-pile': {
      ...nodes['fields/foundation-pile'],
      relatedSensors: ['sensors/strain-gauge', 'sensors/load-cell', 'sensors/settlement-gauge'],
      relatedFields: ['fields/bridge/foundation-settlement'],
      keywords: ['말뚝', 'pile', 'sister-bar', '축력분포'],
      imageId: 'IMG-092'
    },
    'fields/foundation-pile/cast-in-place-pile': {
      ...nodes['fields/foundation-pile/cast-in-place-pile'],
      relatedSensors: ['sensors/strain-gauge', 'sensors/load-cell'],
      relatedFields: ['fields/foundation-pile/precast-pile']
    },
    'fields/foundation-pile/precast-pile': {
      ...nodes['fields/foundation-pile/precast-pile'],
      relatedSensors: ['sensors/strain-gauge', 'sensors/load-cell'],
      relatedFields: ['fields/foundation-pile/cast-in-place-pile']
    },
    'fields/environmental-impact': {
      ...nodes['fields/environmental-impact'],
      relatedSensors: ['sensors/weather-station', 'sensors/datalogger', 'sensors/vibration-meter'],
      relatedFields: ['fields/retaining-excavation', 'fields/tunnel/blast-vibration'],
      keywords: ['소음', '분진', 'PM10', 'PM2.5', '민원'],
      imageId: 'IMG-093'
    },
    'fields/environmental-impact/noise-level': {
      ...nodes['fields/environmental-impact/noise-level'],
      relatedSensors: ['sensors/vibration-meter', 'sensors/datalogger']
    },
    'fields/environmental-impact/dust-concentration': {
      ...nodes['fields/environmental-impact/dust-concentration'],
      relatedSensors: ['sensors/weather-station', 'sensors/datalogger']
    },
    'sensors/inclinometer': {
      ...nodes['sensors/inclinometer'],
      keywords: ['지중경사계', '경사관'],
      relatedSensors: ['sensors/water-level-meter', 'sensors/piezometer', 'sensors/load-cell'],
      relatedFields: [
        'fields/retaining-excavation/earth-retaining-wall',
        'fields/slope/ground-displacement',
        'fields/tunnel/ground-displacement',
        'fields/soft-ground/lateral-flow'
      ],
      imageId: 'IMG-027',
      metaDescription:
        '지중경사계의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.'
    },
    'sensors/water-level-meter': {
      ...nodes['sensors/water-level-meter'],
      keywords: ['지하수위'],
      relatedSensors: ['sensors/piezometer', 'sensors/inclinometer'],
      relatedFields: ['fields/retaining-excavation/earth-retaining-wall', 'fields/slope/groundwater'],
      imageId: 'IMG-030'
    },
    'sensors/piezometer': {
      ...nodes['sensors/piezometer'],
      keywords: ['간극수압'],
      imageId: 'IMG-031'
    },
    'sensors/settlement-gauge': {
      ...nodes['sensors/settlement-gauge'],
      imageId: 'IMG-032'
    },
    'sensors/layer-settlement-gauge': {
      ...nodes['sensors/layer-settlement-gauge'],
      imageId: 'IMG-033'
    },
    'sensors/earth-pressure-cell': {
      ...nodes['sensors/earth-pressure-cell'],
      imageId: 'IMG-034'
    },
    'sensors/load-cell': {
      ...nodes['sensors/load-cell'],
      imageId: 'IMG-035'
    },
    'sensors/strain-gauge': {
      ...nodes['sensors/strain-gauge'],
      relatedFields: [
        'fields/bridge/strain-stress',
        'fields/tunnel/steel-support',
        'fields/dam/strain',
        'fields/building/stress-strain'
      ],
      imageId: 'IMG-036'
    },
    'sensors/stress-free-strain-gauge': {
      ...nodes['sensors/stress-free-strain-gauge'],
      keywords: ['무응력계'],
      relatedFields: ['fields/bridge/strain-stress', 'fields/bridge/temperature'],
      imageId: 'IMG-108'
    },
    'sensors/crack-meter': {
      ...nodes['sensors/crack-meter'],
      imageId: 'IMG-037'
    },
    'sensors/tilt-meter': {
      ...nodes['sensors/tilt-meter'],
      keywords: ['경사계'],
      imageId: 'IMG-038'
    },
    'sensors/joint-meter': {
      ...nodes['sensors/joint-meter'],
      imageId: 'IMG-039'
    },
    'sensors/borehole-extensometer': {
      ...nodes['sensors/borehole-extensometer'],
      keywords: ['다점지중변위계', 'MPBX', 'extensometer'],
      relatedFields: ['fields/tunnel/face-advance', 'fields/slope/ground-displacement'],
      imageId: 'IMG-091'
    },
    'sensors/displacement-transducer': {
      ...nodes['sensors/displacement-transducer'],
      relatedFields: [
        'fields/bridge/bearing-displacement',
        'fields/structural-safety/displacement',
        'fields/tunnel/convergence'
      ],
      imageId: 'IMG-040'
    },
    'sensors/deflection-gauge': {
      ...nodes['sensors/deflection-gauge'],
      keywords: ['처짐계'],
      relatedFields: ['fields/bridge/deflection', 'fields/building/deflection'],
      imageId: 'IMG-104'
    },
    'sensors/cable-tension-meter': {
      ...nodes['sensors/cable-tension-meter'],
      keywords: ['장력계', '케이블장력계'],
      relatedFields: ['fields/bridge/cable-tension'],
      imageId: 'IMG-106'
    },
    'sensors/vibration-meter': {
      ...nodes['sensors/vibration-meter'],
      relatedFields: [
        'fields/tunnel',
        'fields/bridge/vibration',
        'fields/railway',
        'fields/structural-safety'
      ],
      imageId: 'IMG-041'
    },
    'sensors/automated-total-station': {
      ...nodes['sensors/automated-total-station'],
      keywords: ['자동 광파기', '토탈스테이션'],
      imageId: 'IMG-042'
    },
    'sensors/gnss': {
      ...nodes['sensors/gnss'],
      keywords: ['GNSS', 'GPS', 'RTK', '기준국', '이동국'],
      imageId: 'IMG-043'
    },
    'sensors/weather-station': {
      ...nodes['sensors/weather-station'],
      relatedFields: ['fields/slope/rainfall', 'fields/bridge/wind', 'fields/bridge/temperature'],
      imageId: 'IMG-044'
    },
    'sensors/datalogger': {
      ...nodes['sensors/datalogger'],
      relatedSensors: ['sensors/remote-monitoring-system'],
      imageId: 'IMG-045'
    },
    'instruments/datalogger/static': {
      ...nodes['instruments/datalogger/static'],
      keywords: ['정적 데이터로거', '산업용 데이터로거'],
      relatedSensors: [
        'sensors/inclinometer',
        'sensors/piezometer',
        'sensors/water-level-meter',
        'sensors/load-cell',
        'sensors/settlement-gauge'
      ],
      imageId: 'IMG-045'
    },
    'instruments/datalogger/dynamic': {
      ...nodes['instruments/datalogger/dynamic'],
      keywords: ['동적 데이터로거', '고속 DAQ', '모듈형 DAQ'],
      relatedSensors: ['sensors/vibration-meter', 'sensors/strain-gauge'],
      imageId: 'IMG-076'
    },
    'instruments/datalogger/multiplexer': {
      ...nodes['instruments/datalogger/multiplexer'],
      keywords: ['MUX', '멀티플렉서'],
      relatedSensors: ['sensors/inclinometer', 'sensors/piezometer'],
      imageId: 'IMG-077'
    },
    'sensors/remote-monitoring-system': {
      ...nodes['sensors/remote-monitoring-system'],
      keywords: ['자동화계측', '건설중 계측'],
      relatedSensors: ['sensors/datalogger', 'sensors/automated-total-station'],
      relatedFields: [
        'fields/dam/construction-phase',
        'fields/tunnel/construction-phase',
        'fields/railway/construction-phase'
      ],
      imageId: 'IMG-058'
    },
    'instruments/data-management': {
      ...nodes['instruments/data-management'],
      keywords: ['건설중 계측', 'dam monitoring software'],
      relatedFields: [
        'fields/dam/construction-phase',
        'sensors/remote-monitoring-system'
      ],
      imageId: 'IMG-056'
    },
    'instruments/communication/iot-gateway': {
      ...nodes['instruments/communication/iot-gateway'],
      imageId: 'IMG-046'
    },
    'instruments/communication/lte-remote': {
      ...nodes['instruments/communication/lte-remote'],
      imageId: 'IMG-048'
    },
    'instruments/power/solar-power': {
      ...nodes['instruments/power/solar-power'],
      imageId: 'IMG-047'
    },
    'instruments/power/overview': {
      ...nodes['instruments/power/overview'],
      imageId: 'IMG-065'
    },
    'instruments/power/ac-mains': {
      ...nodes['instruments/power/ac-mains'],
      keywords: ['상시 전원', 'AC 전원'],
      imageId: 'IMG-066'
    },
    'instruments/power/avr': {
      ...nodes['instruments/power/avr'],
      keywords: ['AVR', '자동전압조정기'],
      imageId: 'IMG-067'
    },
    'instruments/power/wind-power': {
      ...nodes['instruments/power/wind-power'],
      keywords: ['풍력', '하이브리드 전원'],
      imageId: 'IMG-068'
    },
    'instruments/power/battery': {
      ...nodes['instruments/power/battery'],
      keywords: ['축전지', '배터리'],
      imageId: 'IMG-069'
    },
    'instruments/modes/overview': {
      ...nodes['instruments/modes/overview'],
      imageId: 'IMG-075'
    },
    'instruments/modes/manual': {
      ...nodes['instruments/modes/manual'],
      keywords: ['수동계측'],
      imageId: 'IMG-070'
    },
    'instruments/modes/automatic': {
      ...nodes['instruments/modes/automatic'],
      keywords: ['자동계측', '자동화 계측'],
      imageId: 'IMG-071'
    },
    'instruments/modes/remote-automatic': {
      ...nodes['instruments/modes/remote-automatic'],
      keywords: ['원격 자동계측', '원격계측'],
      imageId: 'IMG-072'
    },
    'instruments/modes/smart': {
      ...nodes['instruments/modes/smart'],
      keywords: ['스마트 계측'],
      imageId: 'IMG-073'
    },
    'instruments/modes/ai': {
      ...nodes['instruments/modes/ai'],
      keywords: ['AI 계측'],
      imageId: 'IMG-074'
    },
    'instruments/modes/normal-mode': {
      ...nodes['instruments/modes/normal-mode'],
      keywords: ['상시 계측', '정상 운영', 'routine monitoring'],
      relatedFields: ['fields/retaining-excavation', 'fields/dam'],
      relatedSensors: ['sensors/datalogger', 'sensors/remote-monitoring-system'],
      imageId: 'IMG-094'
    },
    'instruments/modes/realtime-mode': {
      ...nodes['instruments/modes/realtime-mode'],
      keywords: ['실시간 계측', '이벤트 계측', '발파', '동적'],
      relatedFields: ['fields/tunnel/blast-vibration', 'fields/bridge/vibration'],
      relatedSensors: ['sensors/vibration-meter', 'instruments/datalogger/dynamic'],
      imageId: 'IMG-095'
    },
    'instruments/modes/alarm-status': {
      ...nodes['instruments/modes/alarm-status'],
      keywords: ['경보', '알림', '관리기준', 'SMS'],
      relatedFields: ['fields/structural-safety'],
      relatedSensors: ['sensors/remote-monitoring-system', 'sensors/datalogger'],
      imageId: 'IMG-102'
    }
  });

  return nodes;
}

/** Spec keyword map: keyword → nodeId (longer phrases first in sort) */
export const KEYWORD_MAP = {
  '가시설·흙막이': 'fields/retaining-excavation',
  '가시설 계측': 'fields/retaining-excavation',
  '구조물·공종별': 'intro',
  '계측센서별': 'intro',
  '계측 시스템': 'intro',
  '건설 계측 기술 자료': 'intro',
  '흙막이': 'fields/retaining-excavation',
  '흙막이 벽체': 'fields/retaining-excavation/earth-retaining-wall',
  '교량': 'fields/bridge',
  '터널': 'fields/tunnel',
  '사면': 'fields/slope',
  '댐': 'fields/dam',
  '제방': 'fields/dam',
  '철도': 'fields/railway',
  '데이터 관리': 'instruments/data-management',
  '데이터 로거': 'sensors/datalogger',
  '통신·전송': 'instruments/communication/lte-remote',
  '전원 구성': 'instruments/power/overview',
  '멀티플렉서': 'instruments/datalogger/multiplexer',
  '동적 데이터로거': 'instruments/datalogger/dynamic',
  'MPBX': 'sensors/borehole-extensometer',
  '다점지중변위계': 'sensors/borehole-extensometer',
  '층별침하계': 'sensors/layer-settlement-gauge',
  '신축이음': 'fields/bridge/expansion-joint',
  '신축이음량': 'fields/bridge/expansion-joint',
  '신축이음계': 'sensors/joint-meter',
  '교량 계측': 'fields/bridge',
  '구조물 안전계측': 'fields/structural-safety',
  '터널·지하': 'fields/tunnel',
  '터널 계측': 'fields/tunnel',
  '비탈면·사면': 'fields/slope',
  '사면 계측': 'fields/slope',
  '지하수·연약지반': 'fields/soft-ground',
  '지하수·연약': 'fields/soft-ground',
  '연약 지반': 'fields/soft-ground',
  '연약지반 계측': 'fields/soft-ground',
  '댐·제방 계측': 'fields/dam',
  '항만·해안': 'fields/harbor',
  '항만·호안 계측': 'fields/harbor',
  '항만·호안': 'fields/harbor',
  '건축·인접 구조물': 'fields/building',
  '건축공사 계측': 'fields/building',
  '건축공사': 'fields/building',
  '기초·말뚝 계측': 'fields/foundation-pile',
  '말뚝 계측': 'fields/foundation-pile',
  '현장타설말뚝': 'fields/foundation-pile/cast-in-place-pile',
  '기성말뚝': 'fields/foundation-pile/precast-pile',
  'PHC말뚝': 'fields/foundation-pile/precast-pile',
  '환경·민원 계측': 'fields/environmental-impact',
  '환경 계측': 'fields/environmental-impact',
  '소음 계측': 'fields/environmental-impact/noise-level',
  '분진 계측': 'fields/environmental-impact/dust-concentration',
  '미세먼지': 'fields/environmental-impact/dust-concentration',
  '계측 분야별': 'intro',
  '계측기기 별': 'intro',
  '원격 모니터링': 'sensors/remote-monitoring-system',
  '원격계측시스템': 'sensors/remote-monitoring-system',
  '철도 계측': 'fields/railway',
  '록볼트 축력계': 'fields/tunnel/rockbolt',
  '막장전방 선행변위': 'fields/tunnel/face-advance',
  '지표 및 지중침하': 'fields/tunnel/surface-subsidence',
  '강지보 응력': 'fields/tunnel/steel-support',
  '자동 광파기': 'sensors/automated-total-station',
  '지중변위계': 'fields/tunnel/ground-displacement',
  '내공변위계': 'fields/tunnel/convergence',
  '천단침하계': 'fields/tunnel/crown-settlement',
  '막장거리': 'fields/tunnel',
  '설계예상변위': 'fields/tunnel',
  '최대허용변위': 'fields/tunnel',
  '지표변위계': 'sensors/displacement-transducer',
  '구조물경사계': 'sensors/tilt-meter',
  '원격계측시스템': 'sensors/remote-monitoring-system',
  '수동 계측': 'instruments/modes/manual',
  '수동계측': 'instruments/modes/manual',
  '자동 계측': 'instruments/modes/automatic',
  '자동계측': 'instruments/modes/automatic',
  '원격 자동계측': 'instruments/modes/remote-automatic',
  '스마트 계측': 'instruments/modes/smart',
  'AI 계측': 'instruments/modes/ai',
  '상시 계측 모드': 'instruments/modes/normal-mode',
  '정상 운영 모드': 'instruments/modes/normal-mode',
  'routine monitoring': 'instruments/modes/normal-mode',
  '실시간 계측': 'instruments/modes/realtime-mode',
  '이벤트 계측': 'instruments/modes/realtime-mode',
  '경보 상태': 'instruments/modes/alarm-status',
  '경보·알림': 'instruments/modes/alarm-status',
  '관리기준 초과': 'instruments/modes/alarm-status',
  'IoT 게이트웨이': 'instruments/communication/iot-gateway',
  'LTE M2M': 'instruments/communication/lte-remote',
  'LTE M2M 모뎀': 'instruments/communication/lte-remote',
  '태양광 전원': 'instruments/power/solar-power',
  '전원 개요': 'instruments/power/overview',
  '상시 전원': 'instruments/power/ac-mains',
  AVR: 'instruments/power/avr',
  '자동전압조정기': 'instruments/power/avr',
  '풍력 발전': 'instruments/power/wind-power',
  배터리: 'instruments/power/battery',
  '계측 방식': 'instruments/modes/overview',
  '계측 방식 개요': 'instruments/modes/overview',
  '통합 프로그램': 'sensors/remote-monitoring-system',
  '알림 시스템': 'sensors/remote-monitoring-system',
  '간극수압계': 'sensors/piezometer',
  '층별침하계': 'sensors/layer-settlement-gauge',
  '지하수위계': 'sensors/water-level-meter',
  '변형률계': 'sensors/strain-gauge',
  '자동화계측': 'sensors/remote-monitoring-system',
  '자동화·유지': 'sensors/remote-monitoring-system',
  '기상계측기': 'sensors/weather-station',
  '데이터로거': 'sensors/datalogger',
  '정적 데이터로거': 'instruments/datalogger/static',
  '동적 데이터로거': 'instruments/datalogger/dynamic',
  멀티플렉서: 'instruments/datalogger/multiplexer',
  MUX: 'instruments/datalogger/multiplexer',
  '지중경사계': 'sensors/inclinometer',
  '자동광파기': 'sensors/automated-total-station',
  '건설계측': 'intro',
  '연약지반': 'fields/soft-ground',
  '가시설': 'fields/retaining-excavation',
  '내공변위': 'fields/tunnel/convergence',
  '천단침하': 'fields/tunnel/crown-settlement',
  '지중변위': 'fields/tunnel/ground-displacement',
  '간극수압': 'fields/soft-ground/pore-pressure',
  '유지관리': 'sensors/remote-monitoring-system',
  '통신장비': 'sensors/datalogger',
  '흙막이': 'fields/retaining-excavation/earth-retaining-wall',
  '버팀보': 'fields/retaining-excavation/strut',
  '어스앵커': 'fields/retaining-excavation/anchor',
  '구조물': 'fields/structural-safety',
  '비탈면': 'fields/slope',
  '지하수위': 'sensors/water-level-meter',
  '간극수압': 'fields/soft-ground/pore-pressure',
  '처짐계': 'sensors/deflection-gauge',
  '케이블 장력': 'fields/bridge/cable-tension',
  '케이블장력': 'fields/bridge/cable-tension',
  '케이블장력계': 'sensors/cable-tension-meter',
  '장력계': 'sensors/cable-tension-meter',
  '받침부변위': 'fields/bridge/bearing-displacement',
  '받침변위': 'fields/bridge/bearing-displacement',
  '무응력계': 'sensors/stress-free-strain-gauge',
  '풍하중': 'fields/bridge/wind',
  '상부구조 처짐': 'fields/bridge/deflection',
  '교량 처짐': 'fields/bridge/deflection',
  '변형률·응력': 'fields/bridge/strain-stress',
  '가속도계': 'sensors/vibration-meter',
  '강우량계': 'sensors/weather-station',
  '침하판': 'sensors/settlement-gauge',
  '침하계': 'sensors/settlement-gauge',
  '교량': 'fields/bridge',
  '터널': 'fields/tunnel',
  '사면': 'fields/slope',
  '지하수': 'fields/slope/groundwater',
  '연약': 'fields/soft-ground',
  '활동면': 'fields/slope/slip-surface',
  '지표경사': 'fields/slope/surface-tilt',
  '지표경사계': 'fields/slope/surface-tilt',
  '측방유동': 'fields/soft-ground/lateral-flow',
  '록볼트': 'fields/tunnel/rockbolt',
  '발파진동': 'fields/tunnel/blast-vibration',
  '발파 영향권': 'fields/tunnel/blast-vibration',
  '발파 진동': 'sensors/vibration-meter',
  '발파 영향권': 'sensors/vibration-meter',
  '소음': 'sensors/vibration-meter',
  '지반 수평변위': 'sensors/inclinometer',
  '시설물 경사': 'sensors/tilt-meter',
  '철도': 'fields/railway',
  '댐 계측': 'fields/dam',
  '제방': 'fields/dam',
  '하천제방': 'fields/dam/river-levee',
  '댐': 'fields/dam',
  '토압계': 'sensors/earth-pressure-cell',
  '하중계': 'sensors/load-cell',
  '균열계': 'sensors/crack-meter',
  '경사계': 'sensors/tilt-meter',
  '신축계': 'sensors/joint-meter',
  '다점지중변위계': 'sensors/borehole-extensometer',
  'MPBX': 'sensors/borehole-extensometer',
  '변위계': 'sensors/displacement-transducer',
  '진동계': 'sensors/vibration-meter',
  GNSS: 'sensors/gnss',
  GPS: 'sensors/gnss',
  RTK: 'sensors/gnss',
  '건설중 계측': 'intro',
  '건설중': 'intro',
  '터널 건설중 계측': 'fields/tunnel/construction-phase',
  '철도 건설중 계측': 'fields/railway/construction-phase',
  '댐 건설중 계측': 'fields/dam/construction-phase',
  '댐·제방 건설중 계측': 'fields/dam/construction-phase',
  /* legacy autolink (deprecated 표기 — docs/153) */
  '건설기간 계측': 'intro',
  '건설기간': 'intro',
  '터널 건설기간 계측': 'fields/tunnel/construction-phase',
  '철도 건설기간 계측': 'fields/railway/construction-phase',
  '댐 건설기간 계측': 'fields/dam/construction-phase',
  '고속철도 계측': 'fields/railway/construction-phase',
  '고속철': 'fields/railway/construction-phase',
  'railway tunnel monitoring': 'fields/tunnel/construction-phase',
  'high-speed railway monitoring': 'fields/railway/construction-phase',
  'dam construction monitoring': 'fields/dam/construction-phase',
  'dam construction monitoring software': 'fields/dam/construction-phase',
  'dam monitoring software': 'fields/dam/construction-phase'
};

export function nodePath(nodeId) {
  const base = BASE_PATH.replace(/\/$/, '') + '/';
  if (!nodeId || nodeId === 'intro') return base;
  return base + '#' + nodeId;
}

/** Crawlable path URL for sitemap, canonical, static SEO pages (no hash). */
export function nodePathSeo(nodeId) {
  const base = BASE_PATH.replace(/\/$/, '');
  if (!nodeId || nodeId === 'intro') return base + '/';
  return base + '/' + nodeId + '/';
}

/** Normalize mistaken full tree paths (e.g. instruments/sensors/inclinometer → sensors/inclinometer). */
export function normalizeNodeAlias(nodeId) {
  if (!nodeId) return nodeId;
  if (LEGACY_PATH_MAP[nodeId]) return LEGACY_PATH_MAP[nodeId];
  if (nodeId.startsWith('instruments/sensors/')) {
    const stripped = nodeId.slice('instruments/'.length);
    if (NODES[stripped]) return stripped;
  }
  return nodeId;
}

/** @param {string} [hash] */
export function parseNodeIdFromHash(hash) {
  const raw = (hash !== undefined ? hash : window.location.hash).replace(/^#\/?/, '').trim();
  if (!raw) return '';
  return normalizeNodeAlias(raw);
}

export function resolveNodeIdFromLocation() {
  const pathId = parseNodeIdFromPath(window.location.pathname);
  if (pathId) return getNode(pathId) ? pathId : '';
  const hashId = parseNodeIdFromHash();
  if (hashId) return getNode(hashId) ? hashId : '';
  return '';
}

function technologyPathPrefixes() {
  const base = BASE_PATH.replace(/\/$/, '');
  const prefixes = [base];
  if (typeof location !== 'undefined' && !location.pathname.startsWith('/homepage/')) {
    prefixes.push('/technology');
  }
  return prefixes;
}

export function parseNodeIdFromPath(pathname) {
  const path = pathname.replace(/\/$/, '').replace(/\/index\.html$/, '');
  for (const prefix of technologyPathPrefixes()) {
    if (path === prefix || path === prefix + '/index.html') return '';
    if (path.startsWith(prefix + '/')) {
      const segment = path.slice(prefix.length + 1);
      return normalizeNodeAlias(segment);
    }
  }
  return null;
}

export function getCategoryChildren(categoryId) {
  for (const group of TREE) {
    if (!group.children) continue;
    for (const node of group.children) {
      if (node.id === categoryId && Array.isArray(node.children)) {
        return node.children.map(function (child) {
          return { id: child.id, label: child.label };
        });
      }
    }
  }
  return [];
}

export function getNode(nodeId) {
  return NODES[nodeId] || null;
}

export function getBreadcrumb(nodeId) {
  const crumbs = [
    { label: '홈', href: '/homepage/' },
    { label: '건설 계측 기술 자료', href: BASE_PATH + '/' }
  ];
  if (!nodeId || nodeId === 'intro') return crumbs;

  const node = getNode(nodeId);
  if (!node) return crumbs;

  const chain = findParentChain(nodeId);
  const top = chain[0];

  if (top === 'group-field') {
    crumbs.push({ label: CATEGORY_LABELS['group-field'], href: null });
  } else if (top === 'group-sensor') {
    crumbs.push({ label: CATEGORY_LABELS['group-sensor'], href: null });
  } else if (top === 'group-system') {
    crumbs.push({ label: CATEGORY_LABELS['group-system'], href: null });
  }

  chain.forEach(function (id) {
    if (id === top || id === nodeId) return;
    const n = getNode(id);
    if (!n) return;
    if (INSTRUMENT_SUBGROUPS.has(id)) {
      crumbs.push({ label: n.label, href: nodePath(id) });
    } else if (node.parentId === id && CATEGORY_LABELS[id]) {
      crumbs.push({ label: CATEGORY_LABELS[id], href: nodePath(id) });
    }
  });

  crumbs.push({ label: node.label, href: nodePath(nodeId) });
  return crumbs;
}

/** @returns {{ keyword: string, nodeId: string }[]} */
export function getKeywordEntries() {
  const entries = [];
  const seen = new Set();

  Object.entries(KEYWORD_MAP).forEach(function ([keyword, nodeId]) {
    const key = keyword + '\0' + nodeId;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ keyword: keyword, nodeId: nodeId });
  });

  Object.values(NODES).forEach(function (node) {
    if (!node.label) return;
    const key = node.label + '\0' + node.id;
    if (!seen.has(key) && getNode(node.id)) {
      seen.add(key);
      entries.push({ keyword: node.label, nodeId: node.id });
    }
    (node.keywords || []).forEach(function (alias) {
      const aliasKey = alias + '\0' + node.id;
      if (!seen.has(aliasKey)) {
        seen.add(aliasKey);
        entries.push({ keyword: alias, nodeId: node.id });
      }
    });
  });

  return entries.sort(function (a, b) {
    return b.keyword.length - a.keyword.length;
  });
}

export function getDefaultNodeId() {
  return '';
}

export function findParentChain(nodeId) {
  const open = [];
  function walk(nodes, ancestors) {
    for (const n of nodes) {
      if (n.id === nodeId) {
        open.push(...ancestors, n.id);
        return true;
      }
      if (n.children && walk(n.children, ancestors.concat(n.id))) return true;
    }
    return false;
  }
  walk(TREE, []);
  return open;
}

/** All leaf node IDs for sitemap generation */
/** Instrument subgroup folders (tree only — no dedicated content page; see docs/36 §4.13) */
const INSTRUMENT_SUBGROUPS = new Set([
  'instruments/datalogger',
  'instruments/communication',
  'instruments/power',
  'instruments/modes'
]);

export function getAllContentNodeIds() {
  const ids = [];
  function walk(nodes) {
    nodes.forEach(function (n) {
      if (n.children && n.children.length) {
        if (!INSTRUMENT_SUBGROUPS.has(n.id) && n.id !== 'group-field' && n.id !== 'group-sensor' && n.id !== 'group-system') {
          ids.push(n.id);
        }
        walk(n.children);
      } else if (n.id !== 'group-field' && n.id !== 'group-sensor' && n.id !== 'group-system') {
        ids.push(n.id);
      }
    });
  }
  TREE.forEach(function (g) {
    if (g.children) walk(g.children);
  });
  return ids;
}

export { CATEGORY_LABELS, INSTRUMENT_SUBGROUPS };
