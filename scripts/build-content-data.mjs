import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

import { CATEGORY_SECTIONS } from './content-data/categories.mjs';
import { LEAF_SECTIONS as LEAVES1 } from './content-data/leaves-part1.mjs';
import { LEAF_SECTIONS as LEAVES2 } from './content-data/leaves-part2.mjs';
import { LEAF_SECTIONS as LEAVES3 } from './content-data/leaves-part3.mjs';
import { SENSOR_SECTIONS } from './content-data/sensors.mjs';
import { INSTRUMENT_SECTIONS } from './content-data/instruments.mjs';
import { LEAF_OVERVIEW_EXTRA } from './content-data/leaves-extra.mjs';
import { HELPERS } from './content-data/helpers-template.mjs';
import { sourcesToJsonLd } from './lib/citation-jsonld.mjs';
import { resolveStandardSources, sourcesToHtml } from './lib/resolve-citations.mjs';
import { compactSections } from './lib/compact-action-phrase.mjs';
import { normalizeSections } from './lib/normalize-sections.mjs';
import { getNode } from '../js/technology/dictionary.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'js', 'technology', 'content-data.js');

const LEAF_SECTIONS = { ...LEAVES1, ...LEAVES2, ...LEAVES3 };

const INTRO = {
  id: 'intro',
  title: '건설 계측 기술 자료',
  tagline: '구조물·공종별·계측센서별·계측 시스템 기술 매뉴얼',
  metaDescription:
    '구조물·공종별·계측센서별·계측 시스템 기술 자료 — 개요, 측정 원리, 설치, 데이터 해석, 관리기준을 정리합니다.',
  sections: {
    overview:
      '<p>NMTI <strong>건설 계측 기술 자료</strong>는 토목·지반·구조 현장에서 필요한 <strong>구조물·공종별</strong> 계측 항목, <strong>계측센서</strong> 선정·설치·해석, <strong>계측 시스템</strong>(데이터 로거·통신·전원·원격 모니터링) 구성을 한곳에서 확인할 수 있는 엔지니어링 매뉴얼입니다. 센서 제조가 아닌 <strong>현장 조건별 선정·설치·자동화·유지관리·데이터 분석</strong> 관점으로 정리합니다.</p><p>좌측 메뉴에서 <strong>구조물·공종별</strong>·<strong>계측센서별</strong>·<strong>계측 시스템</strong>을 선택하면 공종별 위험요인, 센서 적용·설치, 수동·자동·원격 운영 방식을 확인할 수 있습니다.</p><p><strong>건설중 계측:</strong> 시공·굴착·축조 단계의 통합 계측 — <a href="#fields/tunnel/construction-phase">터널</a> · <a href="#fields/railway/construction-phase">철도·고속철</a> · <a href="#fields/dam/construction-phase">댐·제방</a> (준공 후 운영기·안전관리 계측과 구분)</p><p><strong>구조물·공종:</strong> 가시설·흙막이, 터널, 교량, 사면, 연약 지반, 철도, 댐·제방, 항만·해안, 건축·인접 구조물</p><p><strong>계측센서:</strong> 지중경사계, 지하수위계, 간극수압계, 하중계 등 20종 — 적용 현장·설치·해석 중심</p><p><strong>계측 시스템:</strong> 계측 방식, 데이터 로거, 통신·전송, 전원 구성, 원격 모니터링, 데이터 관리</p>',
    purpose: [
      {
        title: '현장 의사결정 지원',
        body: '굴착·성토·시공 단계별 계측값을 설계 허용범위와 비교하여 보강, 공정 조정, 작업 중지 여부를 판단하는 근거를 제공합니다.'
      },
      {
        title: '통합 해석 관점',
        body: '단일 센서가 아닌 변위·하중·수위·균열 데이터를 함께 해석하는 관점을 제시합니다. <strong>원격계측시스템</strong>과 <strong>데이터로거</strong> 연동 시 실무 활용도가 높아집니다.'
      },
      {
        title: '제안·계획서 활용',
        body: '계측관리계획서, 제안서, 기술 설명 자료에 바로 인용할 수 있는 수준의 전문 콘텐츠를 제공합니다.'
      }
    ],
    principle:
      '<p>모든 계측은 <strong>초기치 설정 → 반복 측정 → 변화량 산정 → 관리기준 비교 → 원인 분석</strong>의 흐름으로 운영됩니다. 측정 원리를 이해하면 데이터 이상 여부와 센서 고장을 구분하는 데 도움이 됩니다.</p>',
    installation: [
      '계측관리계획서·설계도서 검토',
      '위험 단면·대표 측점 선정',
      '센서 설치 및 초기치 확정',
      '자동화·원격계측 구성',
      '관리기준·경보 체계 운영'
    ],
    data: {
      headers: ['구분', '확인 항목', '실무 포인트'],
      rows: [
        ['분야별', '공종별 위험 요인', '굴착 단계, 강우, 지하수위와 연계 해석'],
        ['계측기기별', '측정값·변화량', '초기치 안정성, 이상값, 센서 상태 점검'],
        ['시스템', '수동·자동·원격·스마트·AI', 'KCS 빈도·자동화 전환·백업 측정'],
        ['관리기준', '설계예상·최대허용', '계측관리계획서 기준 및 관리 단계']
      ]
    },
    criteria:
      '<p>관리기준은 설계도서, 발주처 기준, 인접 구조물 민감도에 따라 현장별로 설정합니다. KCS에 따라 현장에는 <strong>계측책임자</strong>를 두고 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다. 본 기술자료는 장비·해석 원칙을 정리하며, 조직·자격은 계측관리계획서와 발주처 요건을 따릅니다.</p>',
    related: {
      fields: [
        'fields/retaining-excavation',
        'fields/tunnel',
        'fields/bridge',
        'fields/slope',
        'fields/soft-ground',
        'fields/railway',
        'fields/dam',
        'fields/harbor',
        'fields/building'
      ],
      sensors: [
        'sensors/inclinometer',
        'sensors/water-level-meter',
        'sensors/piezometer',
        'sensors/load-cell',
        'sensors/settlement-gauge',
        'sensors/automated-total-station',
        'sensors/datalogger',
        'sensors/remote-monitoring-system'
      ]
    },
    faq: [
      {
        q: '분야별과 계측기기별 자료는 어떻게 활용하나요?',
        a: '공종·구조물 관점에서는 <strong>가시설·흙막이</strong> 등 분야별 항목을, 센서 선정·설치·해석에서는 <strong>지중경사계</strong> 등 계측센서별 항목을 참고합니다. 두 관점을 함께 보면 계측 계획 수립에 유리합니다.'
      },
      {
        q: '기존 지중경사계 상세 페이지와의 관계는?',
        a: '지중경사계 센서 항목 하단의 상세 링크를 통해 기존 <code>/homepage/sensors/inclinometer/</code> 페이지로 이동할 수 있습니다. 기술자료에서는 요약과 연계 분야·센서를 중심으로 정리합니다.'
      }
    ]
  }
};

/** Inherit criteria/principle from category when leaf omits */
const CATEGORY_DEFAULTS = {
  'fields/retaining-excavation': CATEGORY_SECTIONS['fields/retaining-excavation'],
  'fields/tunnel': CATEGORY_SECTIONS['fields/tunnel'],
  'fields/bridge': CATEGORY_SECTIONS['fields/bridge'],
  'fields/slope': CATEGORY_SECTIONS['fields/slope'],
  'fields/soft-ground': CATEGORY_SECTIONS['fields/soft-ground'],
  'fields/structural-safety': CATEGORY_SECTIONS['fields/structural-safety'],
  'fields/railway': CATEGORY_SECTIONS['fields/railway'],
  'fields/dam': CATEGORY_SECTIONS['fields/dam'],
  'fields/foundation-pile': CATEGORY_SECTIONS['fields/foundation-pile'],
  'fields/environmental-impact': CATEGORY_SECTIONS['fields/environmental-impact']
};

function parentId(nodeId) {
  const parts = nodeId.split('/');
  if (parts.length >= 3 && parts[0] === 'fields') return parts[0] + '/' + parts[1];
  return null;
}

function mergeSections(base, override) {
  const merged = { ...base, ...override };
  if (!merged.criteria && base.criteria) merged.criteria = base.criteria;
  return merged;
}

function serialize(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");
}

function attachSources(entry, id) {
  entry.standardSources = resolveStandardSources(id);
  entry.jsonLdIsBasedOn = sourcesToJsonLd(entry.standardSources);
  if (!entry.sections) entry.sections = {};
  entry.sections.sources = sourcesToHtml(id);
}

function buildContentMap() {
  const content = { intro: INTRO };

  for (const [id, sec] of Object.entries(CATEGORY_SECTIONS)) {
    content[id] = {
      id,
      title: sec.title || labelFromId(id),
      tagline: sec.tagline,
      metaDescription: sec.metaDescription || null,
      sections: {
        overview: sec.overview,
        purpose: sec.purpose,
        principle: sec.principle,
        installation: sec.installation,
        constructionPhases: sec.constructionPhases,
        data: sec.data,
        criteria: ensureKcsOfficer(sec.criteria),
        faq: sec.faq
      }
    };
    if (sec.sectionImages) {
      content[id].sectionImages = sec.sectionImages;
    }
    if (sec.heroCaption) content[id].heroCaption = sec.heroCaption;
  }

  for (const [id, leaf] of Object.entries(LEAF_SECTIONS)) {
    const pid = parentId(id);
    const cat = pid ? CATEGORY_SECTIONS[pid] : null;
    const overview = padOverview(
      leaf.overview + (LEAF_OVERVIEW_EXTRA[id] || ''),
      labelFromId(id),
      cat ? labelFromId(pid) : ''
    );
    const sections = mergeSections(
      {
        overview: overview,
        purpose: leaf.purpose,
        principle: leaf.principle || (cat && cat.principle),
        installation: leaf.installation,
        constructionPhases: leaf.constructionPhases || (cat && cat.constructionPhases),
        data: leaf.data,
        criteria: ensureKcsOfficer(leaf.criteria || (cat && cat.criteria)),
        related: leaf.related,
        faq: leaf.faq
      },
      {}
    );
    content[id] = {
      id,
      title: labelFromId(id),
      sections
    };
    if (leaf.sectionImages) {
      content[id].sectionImages = leaf.sectionImages;
    }
    if (leaf.heroImageId) content[id].heroImageId = leaf.heroImageId;
    if (leaf.heroCaption) content[id].heroCaption = leaf.heroCaption;
    if (leaf.heroAlt) content[id].heroAlt = leaf.heroAlt;
  }

  for (const [id, sen] of Object.entries(SENSOR_SECTIONS)) {
    content[id] = {
      id,
      title: labelFromId(id),
      tagline: sen.tagline,
      sections: {
        overview: sen.overview,
        purpose: sen.purpose,
        applications: sen.applications,
        installation: sen.installation,
        principle: sen.principle,
        siteLayout: sen.siteLayout,
        data: sen.data,
        troubleshooting: sen.troubleshooting,
        criteria: ensureKcsOfficer(sen.criteria),
        related: sen.related,
        faq: sen.faq
      },
      sectionImages: sen.sectionImages || undefined,
      detailLink: sen.detailLink || undefined
    };
    if (!content[id].sectionImages) delete content[id].sectionImages;
    if (!content[id].detailLink) delete content[id].detailLink;
  }

  for (const [id, inst] of Object.entries(INSTRUMENT_SECTIONS)) {
    content[id] = {
      id,
      title: labelFromId(id),
      tagline: inst.tagline,
      sections: {
        overview: inst.overview,
        purpose: inst.purpose,
        siteLayout: inst.siteLayout,
        applications: inst.applications,
        installation: inst.installation,
        principle: inst.principle,
        data: inst.data,
        troubleshooting: inst.troubleshooting,
        criteria: ensureKcsOfficer(inst.criteria),
        related: inst.related,
        faq: inst.faq
      },
      sectionImages: inst.sectionImages || undefined
    };
    if (!content[id].sectionImages) delete content[id].sectionImages;
  }

  return content;
}

function labelFromId(id) {
  return getNode(id)?.label || id.split('/').pop();
}

function defaultMetaDescription(id, label) {
  if (id.startsWith('sensors/')) {
    return (
      label +
      '의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.'
    );
  }
  if (id.startsWith('instruments/')) {
    return label + '의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.';
  }
  return (
    label +
    '의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.'
  );
}

function overviewTextLen(html) {
  return (html || '').replace(/<[^>]+>/g, '').length;
}

function padOverview(html, label, parentTitle) {
  if (overviewTextLen(html) >= 400) return html;
  const extra =
    '<p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. ' +
    (parentTitle ? parentTitle + ' 현장에서는 ' : '') +
    '추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>';
  return html + extra;
}

function ensureKcsOfficer(html) {
  if (!html || html.includes('계측책임자')) return html;
  return html.replace(
    /<\/p>\s*$/,
    ' KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>'
  );
}

const contentMap = buildContentMap();

for (const entry of Object.values(contentMap)) {
  if (entry?.sections) {
    normalizeSections(entry.sections);
    compactSections(entry.sections);
  }
}

// Category / sensor metaDescriptions
for (const [id, entry] of Object.entries(contentMap)) {
  if (id === 'intro') continue;
  if (!entry.metaDescription) {
    const nodeMeta = getNode(id)?.metaDescription;
    entry.metaDescription = nodeMeta || defaultMetaDescription(id, labelFromId(id));
  }
}

for (const [id, entry] of Object.entries(contentMap)) {
  attachSources(entry, id);
}

const CITATION_HTML = Object.fromEntries(
  Object.entries(contentMap).map(([id, entry]) => [id, entry.sections?.sources || ''])
);

const fileBody = `${HELPERS}

/** @type {Record<string, string>} */
const CITATION_HTML = ${JSON.stringify(CITATION_HTML, null, 2)};

/** @type {Record<string, object>} */
const CONTENT = ${JSON.stringify(contentMap, null, 2)};

function finalizeContent(raw, node) {
  if (!raw || !node) return raw;
  const out = Object.assign({}, raw);
  out.title = out.title || node.label;
  out.metaDescription = out.metaDescription || node.metaDescription || metaDescription(out.title);
  let heroNode = node;
  if (raw.heroImageId) {
    heroNode = Object.assign({}, node, { imageId: raw.heroImageId });
  }
  if (raw.heroCaption) {
    heroNode = Object.assign({}, heroNode, { heroCaption: raw.heroCaption });
  }
  if (raw.heroAlt) {
    heroNode = Object.assign({}, heroNode, { heroAlt: raw.heroAlt });
  }
  out.heroImage = heroFor(heroNode);
  if (!out.sections) out.sections = {};
  if (!out.sections.related) out.sections.related = relatedFor(node);
  if (raw.sectionImages) {
    out.sectionImages = sectionImagesFor(raw.sectionImages);
  }
  if (!out.sections.sources && CITATION_HTML[out.id]) {
    out.sections.sources = CITATION_HTML[out.id];
  }
  return out;
}

function customizeLeafFromMaster(leafId, node, master) {
  if (!master || !node) return null;
  const label = node.label;
  const base = CONTENT[leafId];
  if (base) return finalizeContent(base, node);
  return finalizeContent(
    {
      id: leafId,
      title: label,
      sections: Object.assign({}, master.sections, {
        overview:
          '<p><strong>' +
          label +
          '</strong>에 대한 계측은 ' +
          master.title +
          ' 분야의 핵심 항목입니다.</p>' +
          (master.sections.overview || '')
      })
    },
    node
  );
}

export function getContentForNode(nodeId) {
  const id = nodeId || 'intro';
  if (id === 'intro') {
    const introNode = getNode('intro') || {
      id: 'intro',
      label: '건설 계측 기술 자료',
      imageId: 'IMG-001'
    };
    return finalizeContent(CONTENT.intro, introNode);
  }

  const node = getNode(id);
  if (!node) return null;

  if (CONTENT[id]) {
    return finalizeContent(CONTENT[id], node);
  }

  const parent = parentCategoryId(id);
  if (parent && CONTENT[parent]) {
  if (node.type === 'field') {
      return customizeLeafFromMaster(id, node, CONTENT[parent]);
    }
    if (node.type === 'category') {
      return finalizeContent(CONTENT[parent], node);
    }
  }

  return null;
}
`;

runLocked('build', 'build-content-data', () => {
  atomicWriteUtf8(outPath, fileBody);
  console.log('Wrote', outPath);
  console.log('Nodes:', Object.keys(contentMap).length);
});
