import { getNode, getCategoryChildren } from './dictionary.js';
import { resolveImage, IMAGE_ASSETS } from './images.js';

function metaDescription(title) {
  return title + '의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 공종·센서를 정리한 기술 자료입니다.';
}

function heroFor(node) {
  let current = node;
  while (current) {
    const imageId = current.imageId;
    if (imageId && IMAGE_ASSETS[imageId]) {
      const overrides = {};
      if (node?.heroCaption) overrides.caption = node.heroCaption;
      if (node?.heroAlt) overrides.alt = node.heroAlt;
      const resolved = resolveImage(imageId, Object.keys(overrides).length ? overrides : node);
      if (resolved) return resolved;
      if (current.id === node.id) {
        const asset = IMAGE_ASSETS[imageId];
        const pendingRework = asset.wireframeReplace || asset.requiresReaudit;
        return {
          placeholder: true,
          alt: (node?.label || '') + ' 개념도',
          pendingRework: !!pendingRework
        };
      }
    }
    if (!current.parentId) break;
    current = getNode(current.parentId);
  }
  return { placeholder: true, alt: (node?.label || '') + ' 개념도' };
}

function relatedFor(node) {
  let fields = node?.relatedFields || [];
  let sensors = node?.relatedSensors || [];
  if (!fields.length && node?.type === 'category') {
    fields = getCategoryChildren(node.id).map(function (c) {
      return c.id;
    });
  }
  return { sensors: sensors, fields: fields };
}

function resolveSectionFigure(entry) {
  if (typeof entry === 'string') {
    return IMAGE_ASSETS[entry] ? resolveImage(entry) : null;
  }
  if (entry && typeof entry === 'object' && entry.id) {
    if (!IMAGE_ASSETS[entry.id]) return null;
    return resolveImage(entry.id, {
      caption: entry.caption,
      figureNo: entry.figureNo
    });
  }
  return null;
}

function sectionImagesFor(map) {
  if (!map) return undefined;
  const out = {};
  Object.keys(map).forEach(function (key) {
    const entries = Array.isArray(map[key]) ? map[key] : [map[key]];
    const figures = entries.map(resolveSectionFigure).filter(Boolean);
    if (figures.length) out[key] = figures;
  });
  return Object.keys(out).length ? out : undefined;
}

function baseContent(node, sections, extras) {
  const out = {
    id: node.id,
    title: node.label,
    metaDescription: node.metaDescription || metaDescription(node.label),
    heroImage: heroFor(node),
    sections: Object.assign(
      {
        related: relatedFor(node)
      },
      sections
    )
  };
  if (extras?.tagline) out.tagline = extras.tagline;
  if (extras?.detailLink) out.detailLink = extras.detailLink;
  if (extras?.sectionImages) out.sectionImages = sectionImagesFor(extras.sectionImages);
  return out;
}

function parentCategoryId(nodeId) {
  const parts = nodeId.split('/');
  if (parts.length >= 3 && parts[0] === 'fields') return parts[0] + '/' + parts[1];
  return null;
}


/** @type {Record<string, string>} */
const CITATION_HTML = {
  "intro": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1 — 지반계측 설계 기준 총칙 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §1 — 시공 중 지반계측 총칙 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 설계도서·계측관리계획서·발주처 기준 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/retaining-excavation": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/slope": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/soft-ground": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/structural-safety": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/railway": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/harbor": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/building": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 건축공사 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 구조물·건축 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/foundation-pile": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.9 — 기초·말뚝 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 현장 시험·설계 축력·발주처 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/environmental-impact": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 발파진동·소음 등 선택 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 환경·민원 기준·발주처 지침 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/retaining-excavation/earth-retaining-wall": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/retaining-excavation/strut": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/retaining-excavation/anchor": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/retaining-excavation/adjacent-building": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/retaining-excavation/surrounding-ground": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/surface-subsidence": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/crown-settlement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/convergence": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/ground-displacement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/rockbolt": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/shotcrete": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/face-advance": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/steel-support": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/pier": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/abutment": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/foundation-settlement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/strain-stress": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 변형률·응력 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/deflection": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 처짐 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.2.1.6 — 교량 정·동적 처짐 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/cable-tension": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 케이블 장력 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.2.1.9 — 주파수·케이블 장력 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 유지관리 실무 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/wind": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 풍하중·동적 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 풍향풍속 사례 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/bearing-displacement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 받침부 변위 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/expansion-joint": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 신축이음량 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/vibration": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/temperature": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 온도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/bridge/seismic": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 지진 응답 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/construction-phase": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/slope/ground-displacement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/slope/surface-tilt": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/slope/structural-displacement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/slope/groundwater": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/slope/slip-surface": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/slope/rainfall": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/slope/drainage": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/soft-ground/settlement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/soft-ground/layer-settlement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/soft-ground/pore-pressure": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/soft-ground/lateral-flow": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/structural-safety/crack": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/structural-safety/tilt": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/structural-safety/displacement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/structural-safety/vibration": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/railway/track-settlement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/railway/track-displacement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/railway/adjacent-construction": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/railway/construction-phase": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/leakage": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 유량·누수 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/pore-pressure": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/settlement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/displacement": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/harbor/quay-wall": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/harbor/caisson": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/harbor/structure": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/harbor/surrounding-ground": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/harbor/tide-groundwater": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/temperature": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 온도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/seismic": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 지진 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/strain": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 변형률 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/tilt": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 기울기 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/building/deflection": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9.1.1 — 처짐 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/building/column-shortening": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 기둥 축소량 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/building/crack": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 건축공사 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 구조물·건축 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/building/adjacent-building": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 건축공사 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 구조물·건축 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/building/stress-strain": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 건축공사 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 구조물·건축 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/river-levee": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/dam/construction-phase": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/tunnel/blast-vibration": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 발파진동 (선택 항목) <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 환경·진동 기준·발주처 지침 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/foundation-pile/cast-in-place-pile": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.9 — 기초·말뚝 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 현장 시험·설계 축력·발주처 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/foundation-pile/precast-pile": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.9 — 기초·말뚝 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 현장 시험·설계 축력·발주처 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/environmental-impact/noise-level": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 발파진동·소음 등 선택 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 환경·민원 기준·발주처 지침 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "fields/environmental-impact/dust-concentration": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 발파진동·소음 등 선택 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 환경·민원 기준·발주처 지침 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/inclinometer": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/water-level-meter": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/piezometer": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/settlement-gauge": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/layer-settlement-gauge": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/earth-pressure-cell": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/load-cell": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/strain-gauge": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/stress-free-strain-gauge": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 무응력계·크리프 보정 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/crack-meter": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/tilt-meter": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/joint-meter": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/cable-tension-meter": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.2.1.9 — 케이블 장력 측정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/borehole-extensometer": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/displacement-transducer": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/deflection-gauge": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.2.1.6 — 처짐계·변위변환기 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/vibration-meter": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/automated-total-station": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/gnss": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/weather-station": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/datalogger": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "sensors/remote-monitoring-system": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/datalogger/static": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.1 — 데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.3 — 온도 범위 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/datalogger/dynamic": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.1 — 데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.3 — 온도 범위 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/datalogger/multiplexer": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.1 — 데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.3 — 온도 범위 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/communication/iot-gateway": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 계측시스템·원격 전송 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.4 — 알람경보 전송 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/communication/lte-remote": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 계측시스템·원격 전송 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.4 — 알람경보 전송 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/power/overview": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/power/solar-power": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/power/ac-mains": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/power/avr": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/power/wind-power": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/power/battery": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/modes/overview": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 계측 방식·빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1.3 — 관리 용어·기준 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/modes/manual": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 수동계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/modes/automatic": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 자동계측 전환 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/modes/remote-automatic": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 원격 전송·시스템 구축 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/modes/smart": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.4 — 알람·경보 운영 (기준 연계) <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/modes/ai": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 일반 관행 — 기준 보조·예측 분석 <span class=\"tech-sources__grade\">[E]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/modes/normal-mode": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 계측 방식·빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1.3 — 관리 용어·기준 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/modes/realtime-mode": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 계측 방식·빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1.3 — 관리 용어·기준 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/modes/alarm-status": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 계측 방식·빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1.3 — 관리 용어·기준 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>",
  "instruments/data-management": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.4 — 보고·경보·데이터 운영 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 발주처·계측관리계획서 보고 요건 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
};

/** @type {Record<string, object>} */
const CONTENT = {
  "intro": {
    "id": "intro",
    "title": "건설 계측 기술 자료",
    "tagline": "구조물·공종별·계측센서별·계측 시스템 기술 매뉴얼",
    "metaDescription": "구조물·공종별·계측센서별·계측 시스템 기술 자료 — 개요, 측정 원리, 설치, 데이터 해석, 관리기준을 정리합니다.",
    "sections": {
      "overview": "<p>NMTI <strong>건설 계측 기술 자료</strong>는 토목·지반·구조 현장에서 필요한 <strong>구조물·공종별</strong> 계측 항목, <strong>계측센서</strong> 선정·설치·해석, <strong>계측 시스템</strong>(데이터 로거·통신·전원·원격 모니터링) 구성을 한곳에서 확인할 수 있는 엔지니어링 매뉴얼입니다. 센서 제조가 아닌 <strong>현장 조건별 선정·설치·자동화·유지관리·데이터 분석</strong> 관점으로 정리합니다.</p><p>좌측 메뉴에서 <strong>구조물·공종별</strong>·<strong>계측센서별</strong>·<strong>계측 시스템</strong>을 선택하면 공종별 위험요인, 센서 적용·설치, 수동·자동·원격 운영 방식을 확인할 수 있습니다.</p><p><strong>건설중 계측:</strong> 시공·굴착·축조 단계의 통합 계측 — <a href=\"#fields/tunnel/construction-phase\">터널</a> · <a href=\"#fields/railway/construction-phase\">철도·고속철</a> · <a href=\"#fields/dam/construction-phase\">댐·제방</a> (준공 후 운영기·안전관리 계측과 구분)</p><p><strong>구조물·공종:</strong> 가시설·흙막이, 터널, 교량, 사면, 연약 지반, 철도, 댐·제방, 항만·해안, 건축·인접 구조물</p><p><strong>계측센서:</strong> 지중경사계, 지하수위계, 간극수압계, 하중계 등 20종 — 적용 현장·설치·해석 중심</p><p><strong>계측 시스템:</strong> 계측 방식, 데이터 로거, 통신·전송, 전원 구성, 원격 모니터링, 데이터 관리</p>",
      "purpose": [
        {
          "title": "현장 의사결정 지원",
          "body": "굴착·성토·시공 단계별 계측값을 설계 허용범위와 비교하여 보강, 공정 조정, 작업 중지 여부를 판단하는 근거를 제공합니다."
        },
        {
          "title": "통합 해석 관점",
          "body": "단일 센서가 아닌 변위·하중·수위·균열 데이터를 함께 해석하는 관점을 제시합니다. <strong>원격계측시스템</strong>과 <strong>데이터로거</strong> 연동 시 실무 활용도가 높아집니다."
        },
        {
          "title": "제안 · 계획서 활용",
          "body": "계측관리계획서, 제안서, 기술 설명 자료에 바로 인용할 수 있는 수준의 전문 콘텐츠를 제공합니다."
        }
      ],
      "principle": "<p>모든 계측은 <strong>초기치 설정 → 반복 측정 → 변화량 산정 → 관리기준 비교 → 원인 분석</strong>의 흐름으로 운영됩니다. 측정 원리를 이해하면 데이터 이상 여부와 센서 고장을 구분하는 데 도움이 됩니다.</p>",
      "installation": [
        "계측관리계획서 · 설계도서 검토",
        "위험 단면 · 대표 측점 선정",
        "센서 설치 및 초기치 확정",
        "자동화 · 원격계측 구성",
        "관리기준 · 경보 체계 운영"
      ],
      "data": {
        "headers": [
          "구분",
          "확인 항목",
          "실무 포인트"
        ],
        "rows": [
          [
            "분야별",
            "공종별 위험 요인",
            "굴착 단계, 강우, 지하수위와 연계 해석"
          ],
          [
            "계측기기별",
            "측정값 · 변화량",
            "초기치 안정성, 이상값, 센서 상태 점검"
          ],
          [
            "시스템",
            "수동 · 자동 · 원격 · 스마트 · AI",
            "KCS 빈도 · 자동화 전환 · 백업 측정"
          ],
          [
            "관리기준",
            "설계예상 · 최대허용",
            "계측관리계획서 기준 및 관리 단계"
          ]
        ]
      },
      "criteria": "<p>관리기준은 설계도서, 발주처 기준, 인접 구조물 민감도에 따라 현장별로 설정합니다. KCS에 따라 현장에는 <strong>계측책임자</strong>를 두고 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다. 본 기술자료는 장비·해석 원칙을 정리하며, 조직·자격은 계측관리계획서와 발주처 요건을 따릅니다.</p>",
      "related": {
        "fields": [
          "fields/retaining-excavation",
          "fields/tunnel",
          "fields/bridge",
          "fields/slope",
          "fields/soft-ground",
          "fields/railway",
          "fields/dam",
          "fields/harbor",
          "fields/building"
        ],
        "sensors": [
          "sensors/inclinometer",
          "sensors/water-level-meter",
          "sensors/piezometer",
          "sensors/load-cell",
          "sensors/settlement-gauge",
          "sensors/automated-total-station",
          "sensors/datalogger",
          "sensors/remote-monitoring-system"
        ]
      },
      "faq": [
        {
          "q": "분야별과 계측기기별 자료는 어떻게 활용하나요?",
          "a": "공종·구조물 관점에서는 <strong>가시설·흙막이</strong> 등 분야별 항목을, 센서 선정·설치·해석에서는 <strong>지중경사계</strong> 등 계측센서별 항목을 참고합니다. 두 관점을 함께 보면 계측 계획 수립에 유리합니다."
        },
        {
          "q": "기존 지중경사계 상세 페이지와의 관계는?",
          "a": "지중경사계 센서 항목 하단의 상세 링크를 통해 기존 <code>/homepage/sensors/inclinometer/</code> 페이지로 이동할 수 있습니다. 기술자료에서는 요약과 연계 분야·센서를 중심으로 정리합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1 — 지반계측 설계 기준 총칙 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §1 — 시공 중 지반계측 총칙 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 설계도서·계측관리계획서·발주처 기준 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§1",
        "label": "지반계측 설계 기준 총칙"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§1",
        "label": "시공 중 지반계측 총칙"
      },
      {
        "grade": "D",
        "docId": "KDS-11-10-15",
        "cite": "—",
        "label": "설계도서·계측관리계획서·발주처 기준"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/retaining-excavation": {
    "id": "fields/retaining-excavation",
    "title": "가시설·흙막이",
    "tagline": "굴착 과정에서 흙막이·지보재·주변 지반·인접 구조물의 거동을 정량 관리",
    "metaDescription": "가시설 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>가시설·흙막이</strong>는 굴착 과정에서 흙막이 벽체, 지보재, 주변 지반 및 인접 구조물의 거동을 정량적으로 확인하여 굴착 안정성과 주변 영향성을 관리하는 계측입니다. 가시설 공사는 지반을 단계적으로 굴착하면서 흙막이 벽체, 버팀보, 어스앵커, 주변 지반이 상호작용하는 공정입니다.</p><p>굴착 깊이가 증가하면 벽체 수평변위, 지보재 하중 변화, 지하수위 저하, 인접 건물 침하 및 균열이 동시에 발생할 수 있습니다. 따라서 <strong>지중경사계</strong>, <strong>하중계</strong>, <strong>지하수위계</strong>, <strong>토압계</strong> 데이터를 함께 해석해야 합니다. 단일 센서의 절대값만으로 판단하지 않고 굴착 단계·강우·양수 이력과 복수 센서의 동시 변화를 검토하는 것이 핵심입니다.</p>",
      "purpose": [
        {
          "title": "벽체 안정성",
          "accent": "displacement",
          "body": "흙막이 벽체의 수평변위가 설계 허용범위 내에 있는지 <strong>지중경사계</strong>로 확인합니다.",
          "sensors": [
            "sensors/inclinometer"
          ]
        },
        {
          "title": "지보재 부담",
          "accent": "load",
          "body": "버팀보·어스앵커 하중의 과소 또는 과대 상태를 <strong>하중계</strong>로 점검합니다.",
          "sensors": [
            "sensors/load-cell"
          ]
        },
        {
          "title": "주변 영향",
          "accent": "settlement",
          "body": "굴착에 따른 주변 지반 침하와 인접 건물 영향을 <strong>지표침하계</strong>, <strong>균열계</strong>, <strong>구조물경사계</strong>로 조기 파악합니다.",
          "sensors": [
            "sensors/settlement-gauge",
            "sensors/crack-meter",
            "sensors/tilt-meter"
          ]
        },
        {
          "title": "수리 · 토압 조건",
          "accent": "water",
          "body": "지하수위 변화와 토압 변화가 굴착 안정성에 미치는 영향을 <strong>지하수위계</strong>, <strong>토압계</strong>로 분석합니다.",
          "sensors": [
            "sensors/water-level-meter",
            "sensors/earth-pressure-cell"
          ]
        }
      ],
      "principle": "<p>가시설 계측은 변위(지중경사계), 하중(하중계), 수위(지하수위계), 토압(토압계), 균열·경사(균열계·구조물경사계)를 통합 해석합니다. 굴착 단계별로 계측값을 기록하고 설계 예측값·관리기준과 비교합니다. 벽체 변위 증가와 지보재 하중 증가가 동시에 나타나면 배면 토압 증가 또는 지보재 부담 증가를 의심하고, 변위만 증가하면 지보재 설치 시점·프리로드·초기치 오류를 점검합니다.</p>",
      "installation": [
        "계측관리계획서 기준 — 위험 단면 · 대표 단면 · 인접 구조물 인접부 배치 확정",
        "지중경사계는 예상 변위 방향과 측정축 일치 · 안정층까지 설치",
        "버팀보 · 앵커 <strong>하중계</strong>는 설계 위치에 설치 · 초기치를 안정 후 확정",
        "지하수위계 · 토압계는 관측 목적 심도 기준 설치 · 표면수 유입을 차단",
        "인접 건물에는 균열계 · 구조물경사계 · 자동광파기를 배치 · 초기 상태 기록",
        "데이터로거 · 원격계측시스템으로 자동 수집 · 설계예상변위 · 최대허용변위 기준 적용"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "착공 전",
            "전 계측 항목",
            "초기치 설정, 인접 구조물 사전조사"
          ],
          [
            "1단 굴착",
            "지표침하, 지하수위",
            "배면 지반 초기 반응 확인"
          ],
          [
            "지보재 설치 후",
            "하중계, 변형률계",
            "프리로드, 축력 변화 확인"
          ],
          [
            "심층 굴착",
            "지중경사계, 토압계, 수위계",
            "벽체 변위 집중 심도 확인"
          ],
          [
            "최종 굴착",
            "전 계측 항목",
            "관리기준 접근 여부 검토"
          ],
          [
            "해체 · 되메우기",
            "하중계, 변위계",
            "지보재 해체에 따른 변위 재증가 확인"
          ]
        ]
      },
      "data": {
        "headers": [
          "연계 현상",
          "확인 센서",
          "해석 포인트"
        ],
        "rows": [
          [
            "벽체 변위 증가 + 하중 증가",
            "지중경사계, 하중계",
            "배면 토압 · 지보재 부담 증가 검토"
          ],
          [
            "변위 증가, 하중 변화 소",
            "지중경사계, 하중계",
            "지보재 설치 시점 · 프리로드 · 초기치 점검"
          ],
          [
            "지하수위 급변",
            "지하수위계, 침하계",
            "양수 · 강우 · 주변 침하와 연계"
          ],
          [
            "인접 건물 균열 · 경사",
            "균열계, 구조물경사계",
            "굴착 단계 · 거리 · 지반조건과 비교"
          ]
        ]
      },
      "criteria": "<p>관리기준은 설계도서, 계측관리계획서, 발주처 기준, 인접 구조물 민감도, <strong>굴착심도</strong>에 따라 현장별로 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>를 기준으로 하며, 초과 시 원인분석·시공 조정·작업 중지를 검토하는 관리 단계를 운영할 수 있습니다. 변위속도·복수 센서 동시 변화가 단순 절대값보다 중요합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "가시설 계측에서 가장 중요한 계측기는?",
          "a": "현장 조건에 따라 다르지만 흙막이 벽체·배면 지반 변위를 확인하는 <strong>지중경사계</strong>, 지보재 하중을 확인하는 <strong>하중계</strong>, 지하수 영향을 확인하는 <strong>지하수위계</strong>가 핵심입니다."
        },
        {
          "q": "굴착 중 계측값이 갑자기 증가하면?",
          "a": "먼저 계측 오류·초기치·센서 상태를 확인하고, 굴착 단계·강우·지하수위·지보재 설치 이력과 비교합니다. 증가 속도와 복수 센서의 동시 변화가 중요합니다."
        },
        {
          "q": "어스앵커와 버팀보 하중계를 어떻게 구분하나요?",
          "a": "버팀보 하중계는 보체 축력, 어스앵커 하중계는 앵커 축력·반력을 봅니다. 설치 위치·감지면 방향이 설계와 일치해야 합니다."
        },
        {
          "q": "인접 건물 계측은 언제 시작하나요?",
          "a": "굴착 착공 전 사전조사로 초기 균열·경사·침하 기준을 확보하고, 굴착 단계별로 동일 측점을 추적합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-001",
        "IMG-002"
      ],
      "installation": [
        "IMG-006"
      ],
      "data": [
        "IMG-062"
      ]
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.1",
        "label": "가시설·굴착 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측·관리"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel": {
    "id": "fields/tunnel",
    "title": "터널",
    "tagline": "굴착으로 인한 지반·지보재 변형을 측정하여 터널 안정성 검증",
    "metaDescription": "터널 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>터널</strong>은 굴착으로 인한 지반 및 지보재의 변형을 측정하여 터널 안정성과 주변 영향성을 검증하는 계측입니다(KDS 4.1.5). 지표 및 지중침하, <strong>내공변위</strong>, <strong>천단침하</strong>, <strong>지중변위</strong>, 록볼트 축력, 숏크리트 응력, 막장전방 선행변위가 주요 항목입니다.</p><p><strong>건설중 계측</strong>(<a href=\"#fields/tunnel/construction-phase\">시공 단계 통합</a>)은 준공·운영기와 구분하여 굴착·지보·라이닝 단계별 측점·보고·운행철도 상부 보호를 통합 관리합니다.</p><p>NATM 터널에서는 계측 결과로 지보 패턴과 굴착 방법을 조정하는 관찰시공이 중요합니다. <strong>내공변위계</strong>(상부 아치 전단면 프로파일), <strong>천단침하 측점</strong>(<strong>자동광파기</strong>·수준), <strong>지중변위계</strong>, <strong>지중경사계</strong>, 록볼트·숏크리트 계측을 <strong>동일 단면</strong>에서 통합합니다. 계측값은 <strong>막장거리</strong>와 함께 해석합니다.</p><p>KDS <strong>선택 항목</strong>(지반 수평변위·시설물 경사·발파진동·소음)은 <strong>발파진동·영향권</strong> 리프와 영향권 <strong>지중경사계</strong>·<strong>구조물경사계</strong>·<strong>진동계</strong> 항목에서 다룹니다. 소음은 진동·민원 기준과 현장 측정으로 관리합니다.</p>",
      "purpose": [
        {
          "title": "내공변위",
          "body": "<strong>내공변위계</strong>로 전단면 프로파일·단면 변형 확인"
        },
        {
          "title": "천단침하",
          "body": "<strong>천단침하 측점</strong>(<strong>프리즘</strong>)과 <strong>자동광파기</strong>로 천단 연직 침하를 측정하고 지표침하와 비교합니다."
        },
        {
          "title": "지표 · 지중",
          "body": "<strong>지표 및 지중침하</strong>로 상부 관리대상물 영향 검토"
        },
        {
          "title": "지중변위",
          "body": "<strong>지중변위계</strong>(굴착면 주변)·<strong>지중경사계</strong>(영향권)로 주변 지반 거동을 파악합니다."
        },
        {
          "title": "지보재",
          "body": "록볼트 축력계·숏크리트·강지보 응력계로 지보 효과를 평가합니다."
        }
      ],
      "principle": "<p>터널 계측은 굴착 직후 급속 변위 후 시간에 따른 <strong>변위 안정화</strong>(계측값 수렴)를 기본 가정으로 합니다. 막장거리가 멀어진 후에도 변위가 지속 증가하면 지보 부족·지반 불량·지하수 영향을 검토합니다. 내공변위·천단침하·지중변위·록볼트·숏크리트는 동일 단면 종합 해석이 원칙입니다.</p>",
      "installation": [
        "계측관리계획서 기준 — 천단 · 변곡 · 막장 · 지표 대표 단면 선정",
        "내공변위 · 천단침하 측점을 동일 단면에 배치(축방향 0~20 m, 민감 구간 10 m)",
        "실링 숏크리트 후 천단 측점 · 내공변위계를 설치 · 다음 굴착 전 초기치 확정",
        "지중변위계를 굴착면 주변 동일 단면에 설치",
        "지표 및 지중침하 · 영향권 지중경사계 · 막장전방 선행변위계를 보완 배치",
        "막장거리 · 변위속도에 따른 계측 빈도를 KCS 표 3.5-1 기준 운영",
        "원격계측시스템으로 고빈도 구간을 자동화"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "굴착 착공",
            "지표 · 지중침하, 영향권",
            "초기치 · 관리대상물 사전조사"
          ],
          [
            "상부 굴착",
            "천단침하, 내공변위",
            "변위 안정화 · 수렴 추세"
          ],
          [
            "지보재 설치",
            "록볼트 축력, 숏크리트 · 강지보 응력",
            "지보 효과 · 프리로드 확인"
          ],
          [
            "막장 접근",
            "지중변위, 막장전방 선행변위",
            "변위속도 · 보강 · 공법 조정"
          ],
          [
            "발파 구간",
            "진동계",
            "PPV · 영향권 기준 · 발파 영향권"
          ],
          [
            "굴착 완료",
            "전 항목",
            "수렴 여부 · 후속 모니터링 계획"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "계측기",
          "해석 시 유의점"
        ],
        "rows": [
          [
            "천단침하",
            "천단 측점, 자동광파기",
            "지표침하 비교 · 변위 안정화"
          ],
          [
            "내공변위",
            "내공변위계",
            "상부 아치 · 동일 단면 · ΔX · ΔY 프로파일"
          ],
          [
            "지중변위",
            "지중변위계",
            "굴착면 주변 반경방향"
          ],
          [
            "록볼트 축력",
            "록볼트 축력계",
            "지보 패턴 · 동일 단면"
          ],
          [
            "강지보 응력",
            "변형률계, 축력계",
            "스틸 세트 부담"
          ],
          [
            "막장 전방",
            "선행변위계",
            "전방 지반 · 불량구간"
          ],
          [
            "영향권 수평변위",
            "지중경사계",
            "지반수평변위 프로파일"
          ],
          [
            "시설물 경사",
            "구조물경사계",
            "관리대상물 기울기"
          ],
          [
            "발파진동",
            "진동계",
            "PPV · 기준 초과 시 공법 조정"
          ],
          [
            "소음",
            "진동계 · 민원 측정",
            "환경 · 인체 기준"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "변위 수렴이 중요한 이유는?",
          "a": "계측값이 시간에 따라 안정화되면 지반·지보재가 안정 상태로 수렴하고 있음을 의미합니다. 지속 증가 시 지보 보강이나 굴착 방법 조정이 필요할 수 있습니다."
        },
        {
          "q": "NATM에서 계측 결과는 어떻게 활용하나요?",
          "a": "천단침하·내공변위 추세를 보고 숏크리트 두께, 록볼트 간격·길이, 다음 굴착 진행 여부를 결정합니다. 관찰시공의 핵심 입력 자료입니다."
        },
        {
          "q": "KDS 선택 항목(발파진동·소음 등)은 어디서 보나요?",
          "a": "<strong>발파진동·영향권</strong> 리프와 <strong>지중경사계</strong>(지반 수평변위), <strong>구조물경사계</strong>(시설물 경사), <strong>진동계</strong>(PPV·동적 응답) 항목을 참고합니다. 소음은 진동·민원 기준과 현장 측정으로 관리합니다."
        },
        {
          "q": "천단침하와 내공변위를 왜 같은 단면에 두나요?",
          "a": "KCS 3.5.3에 따라 천단 연직 침하와 단면 변형을 동일 단면·시간축에서 비교해 지보 패턴·굴착 속도를 판단합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-008",
        "caption": "터널 전단면 내공변위 — P1~P11 내공변위계·대표 측선·기준 측정선, 건축한계, 노반 Open",
        "figureNo": 2
      },
      "installation": {
        "id": "IMG-010",
        "caption": "터널 지표침하 — 침하계·자동광파기 배치(천단침하와 구분)",
        "figureNo": 3
      }
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge": {
    "id": "fields/bridge",
    "title": "교량",
    "tagline": "교량 상부구조·교각·교대·기초의 변위·경사·진동을 통합 평가",
    "metaDescription": "교량 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>교량</strong>은 상부구조·교각·교대·기초의 변위·경사·진동·응력을 측정하여 구조 안전성과 사용성을 평가하는 계측입니다. 차량하중, 온도, 풍하동, 지반 침하, 지진·진동에 따른 장·단기 거동을 구분해 해석합니다.</p><p>센서는 <strong>부재·위치·물리량</strong>에 맞게 선정하며, 아래 <strong>매핑 표</strong>와 각 리프 nodeId를 기준으로 조합합니다. 현수·사장·아치교는 <strong>케이블 장력</strong>이 핵심이고, 상부구조 처짐은 <strong>경간 중앙 GNSS(ΔZ→δ)</strong>와 <strong>접촉식 처짐계</strong>를 역할 분리합니다.</p>",
      "purpose": [
        {
          "title": "교량 통합 평가",
          "variant": "lead",
          "accent": "integrated",
          "body": "상부구조·교각·교대·기초의 정적·동적 거동을 온도·하중·지반 조건과 함께 통합 해석합니다.",
          "sensors": [
            "sensors/tilt-meter",
            "sensors/deflection-gauge",
            "sensors/vibration-meter"
          ]
        },
        {
          "title": "교각 · 교대 거동",
          "accent": "displacement",
          "body": "변위·경사를 <strong>구조물경사계</strong>, <strong>변위계</strong>로 확인합니다.",
          "sensors": [
            "sensors/tilt-meter",
            "sensors/displacement-transducer"
          ]
        },
        {
          "title": "변형률 · 응력",
          "accent": "structure",
          "body": "PSC·강재 휨응력을 <strong>변형률계</strong>·<strong>무응력계</strong>로 관리합니다.",
          "sensors": [
            "sensors/strain-gauge",
            "sensors/stress-free-strain-gauge"
          ]
        },
        {
          "title": "상부구조 처짐",
          "accent": "displacement",
          "body": "경간 중앙 <strong>GNSS</strong> ΔZ→δ(hero)와 <strong>처짐계</strong> 국부 δ를 분리합니다.",
          "sensors": [
            "sensors/gnss",
            "sensors/deflection-gauge"
          ]
        },
        {
          "title": "케이블 장력",
          "accent": "load",
          "body": "사장·아치 케이블을 <strong>케이블장력계</strong>로 추적합니다.",
          "sensors": [
            "sensors/cable-tension-meter"
          ]
        },
        {
          "title": "받침부 변위",
          "accent": "displacement",
          "body": "받침 슬라이드·회전을 <strong>변위계</strong>로 확인합니다.",
          "sensors": [
            "sensors/displacement-transducer"
          ]
        },
        {
          "title": "신축이음량",
          "accent": "displacement",
          "body": "이음부 상대 신축량을 <strong>신축이음계</strong>로 측정합니다.",
          "sensors": [
            "sensors/joint-meter"
          ]
        },
        {
          "title": "풍하중",
          "accent": "vibration",
          "body": "주탑·교면 <strong>풍향풍속</strong>을 진동·처짐과 연계합니다.",
          "sensors": [
            "sensors/weather-station",
            "sensors/vibration-meter"
          ]
        },
        {
          "title": "기초 안정",
          "accent": "settlement",
          "body": "기초 침하·세굴 영향을 <strong>지표침하계</strong>, <strong>GNSS</strong>로 추적합니다.",
          "sensors": [
            "sensors/settlement-gauge",
            "sensors/gnss"
          ]
        },
        {
          "title": "동적 응답",
          "accent": "vibration",
          "body": "차량·환경 진동을 <strong>진동계</strong>로 분석하고 유지관리 데이터를 축적합니다.",
          "sensors": [
            "sensors/vibration-meter"
          ]
        }
      ],
      "principle": "<p>교량 계측은 <strong>정적 변위</strong>(침하·경사·신축·처짐)와 <strong>동적 응답</strong>(진동·풍하동)을 구분합니다. 처짐은 <a href=\"#fields/bridge/deflection\">경간 중앙 GNSS</a>(장기 ΔZ)와 <a href=\"#sensors/deflection-gauge\">접촉식 처짐계</a>(국부 δ)를 혼동하지 않습니다. 온도·일교차 신축은 정상 범주이나 급격한 증가·비대칭은 이상 징후일 수 있습니다.</p>",
      "installation": [
        "계측 목적(시공 · 공용 · 재하시험)과 아래 매핑 표에서 부재 · 물리량별 nodeId 선정",
        "교각 · 교대: 구조물경사계 · 변위계 — fields/bridge/pier · abutment",
        "상부구조 처짐: 경간 중앙 GNSS 1점 — fields/bridge/deflection",
        "국부 · 재하시험 처짐: LVDT · 와이어 — sensors/deflection-gauge",
        "현수 · 사장 · 아치: 케이블장력계 — fields/bridge/cable-tension",
        "신축이음 · 받침 · 기초침하 · 풍 · 진동: 매핑 표 nodeId 참조",
        "자동광파 · 원격계측으로 장기 모니터링 체계 구축"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "시공 · 가설",
            "처짐, 변형률",
            "가설 하중 · 응력 · 온도 영향"
          ],
          [
            "긴장 · 조정",
            "케이블 장력",
            "목표 T · f · 시공 기록"
          ],
          [
            "상부구조 시공",
            "변위, 신축이음",
            "온도 · 하중에 따른 신축 패턴"
          ],
          [
            "교각 · 교대",
            "경사, 기초침하",
            "부등침하 · 받침 거동"
          ],
          [
            "공용 전환",
            "진동, GNSS",
            "장기 추세 · 기준선 확립"
          ],
          [
            "유지관리",
            "균열, 신축, 진동",
            "이상 징후 · 세굴 · 온도 연계"
          ]
        ]
      },
      "data": {
        "headers": [
          "부재",
          "위치",
          "물리량",
          "대표 센서",
          "nodeId"
        ],
        "rows": [
          [
            "거더 · 상부구조",
            "경간 중앙 상부",
            "처짐 δ(ΔZ)",
            "GNSS",
            "fields/bridge/deflection"
          ],
          [
            "거더 · 슬래브",
            "mid-span · 기준대",
            "처짐 δ",
            "LVDT · 와이어",
            "sensors/deflection-gauge"
          ],
          [
            "교각",
            "상부 · 기초 연결",
            "경사 · 변위",
            "구조물경사계 · 변위계",
            "fields/bridge/pier"
          ],
          [
            "교대",
            "받침 · 이음부",
            "경사 · 변위",
            "구조물경사계 · 변위계",
            "fields/bridge/abutment"
          ],
          [
            "PSC · 강재",
            "휨 · 전단부",
            "변형률 · 응력",
            "변형률계 · 무응력계",
            "fields/bridge/strain-stress"
          ],
          [
            "주케이블",
            "케이블 노출부",
            "인장력 T",
            "케이블장력계",
            "fields/bridge/cable-tension"
          ],
          [
            "받침",
            "슬라이드 · 회전",
            "상대변위",
            "변위계",
            "fields/bridge/bearing-displacement"
          ],
          [
            "신축이음",
            "이음부",
            "신축량",
            "신축이음계",
            "fields/bridge/expansion-joint"
          ],
          [
            "기초",
            "교각 · 교대 하부",
            "침하",
            "지표침하계 · GNSS",
            "fields/bridge/foundation-settlement"
          ],
          [
            "교면 · 주탑",
            "풍하동 구간",
            "풍 · 진동",
            "풍향풍속 · 진동계",
            "fields/bridge/wind · vibration"
          ],
          [
            "전체",
            "",
            "온도 · 지진",
            "온도계 · 진동계",
            "fields/bridge/temperature · seismic"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "시공 중과 공용 중 계측의 차이는?",
          "a": "시공 중에는 가설·콘크리트 양생·하중 재분배를, 공용 중에는 장기 침하·피로·온도 신축·이상 진동을 중점으로 봅니다."
        },
        {
          "q": "신축이음량이 크게 나오면?",
          "a": "온도·계절 변화에 따른 정상 신축인지, 지지 조건 악화·구속 부족인지 과거 데이터·온도와 함께 판단합니다."
        },
        {
          "q": "처짐과 기초침하를 어떻게 구분하나요?",
          "a": "경간 중앙 GNSS·처짐계는 거더·교면 δ(상부구조)이고, 기초침하는 지표침하계·GNSS로 교각·교대 기초를 봅니다. nodeId·관리기준을 분리합니다."
        },
        {
          "q": "GNSS 처짐과 처짐계 차이?",
          "a": "deflection=경간 중앙 GNSS 1점·ΔZ→δ(IMG-103). deflection-gauge=LVDT·와이어 국부 δ(IMG-104). 매핑 표 참조."
        },
        {
          "q": "대구 3호선 유지관리 사례와의 관계는?",
          "a": "변형률·처짐·신축이음·케이블 장력·풍하동 등 10종 센서 통합 모니터링 사례입니다. 현장별 형식·기준은 설계·계측관리계획서를 따릅니다."
        },
        {
          "q": "단순 교량에도 케이블 장력이 필요한가요?",
          "a": "일반 RC·PC 단순교는 해당 없습니다. 현수·사장·아치·닐슨교 등 주케이블이 있는 형식에서 케이블 장력·케이블장력계 항목을 적용합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "heroCaption": "교량 계측 전체 개념도 — 10종 센서(변형률·처짐·케이블 장력·풍하동·받침 등)",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.1",
        "label": "교량 계측시설 시공"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "교량·구조물 계측 일반"
      },
      {
        "grade": "D",
        "docId": "KCS-24-99-05",
        "cite": "—",
        "label": "대구 3호선 통합 유지관리 10종"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/slope": {
    "id": "fields/slope",
    "title": "사면",
    "tagline": "비탈면 내부·표면 변위와 지하수·강우를 연계한 활동면·붕괴 위험 판단",
    "metaDescription": "사면 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>사면</strong>은 비탈면 내부와 표면의 변위, 지하수위, 강우 조건을 관측하여 활동면 위치와 붕괴 가능성을 판단하는 계측입니다. 사면 불안정은 강우, 지하수위 상승, 절토·성토, 풍화, 배수 불량 등이 결합되어 발생합니다.</p><p><strong>센서형 다단식 지중경사계</strong>로 활동면 위치와 변위 진행성을 확인하고, <strong>지하수위계</strong>, <strong>간극수압계</strong>, <strong>지표침하계</strong>, <strong>기상계측기</strong>로 변위 원인을 추적합니다. 절대 변위보다 <strong>변위속도</strong>와 가속 여부가 중요하며, 강우 후 속도 증가·특정 심도 집중은 활동면 형성·진행성 파괴 가능성을 시사합니다. <strong>배면 사면</strong>은 <strong>와이어식 변위계</strong>로, 옹벽 본체는 <strong>프리즘</strong>·<strong>균열계</strong>로 보완하며, 공사 중에만 광학 측량망을 선택 병행합니다.</p>",
      "purpose": [
        {
          "title": "활동면 추정",
          "body": "<strong>지중경사계</strong> 변위 집중 심도로 활동면 위치를 추정합니다."
        },
        {
          "title": "진행성 추적",
          "body": "변위량·변위속도를 시계열로 관리하고 가속 여부를 판단합니다."
        },
        {
          "title": "원인 분석",
          "body": "강우·지하수위 상승과 변위 반응을 <strong>기상계측기</strong>, <strong>지하수위계</strong>와 연계합니다."
        },
        {
          "title": "대책 검증",
          "body": "배수·압밀·보강공 효과를 계측으로 검증하고 경보 체계 운영"
        }
      ],
      "principle": "<p>사면 안정은 지반 강도·간극수압·외력(절토, 상부하중, 지진)의 균형으로 설명됩니다. 지중경사계는 심도별 수평변위 분포를, 간극수압계는 토층 내부 수압을, 지하수위계는 자유수면 변화를 제공합니다. 이들을 시간축에서 겹쳐 보면 붕괴 전조 현상을 조기에 포착할 수 있습니다.</p>",
      "installation": [
        "위험 등급 · 지질 · 지형 기준 대표 단면과 보조 측점 선정",
        "예상 활동면 하부 안정층까지 지중경사계를 설치 · 측정축을 정의",
        "지하수위계 · 간극수압계를 취약 지층 · 배수 경로에 배치",
        "기상계측기(강우량계)를 현장 대표 지점에 설치",
        "배면 사면 변위가 크면 와이어식 변위계를, 옹벽 본체는 프리즘 · 균열계로 보완",
        "원격계측시스템으로 강우 · 야간 · 휴일 고빈도 모니터링 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "평상시",
            "지중경사계, 지하수위",
            "기준 추세 · 변위속도"
          ],
          [
            "강우 전 · 중",
            "기상계측기, 수위",
            "경보 준비 · 배수 상태"
          ],
          [
            "강우 후",
            "변위속도, 간극수압",
            "활동면 · 가속 여부 검토"
          ],
          [
            "보강 · 배수 후",
            "변위, 배수량",
            "대책 효과 검증"
          ],
          [
            "장기 관리",
            "GNSS, 균열계",
            "잔류 변위 · 표면 징후"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "연계 데이터",
          "판단"
        ],
        "rows": [
          [
            "강우 후 변위속도 증가",
            "강우량, 지하수위, 지중경사계",
            "간극수압 · 활동면 검토"
          ],
          [
            "특정 심도 변위 집중",
            "지중경사계 깊이별 곡선",
            "활동면 위치 추정"
          ],
          [
            "간극수압 장기 고수준",
            "간극수압계",
            "배수 · 공법 재검토"
          ],
          [
            "표면 균열 확대",
            "균열계, GNSS",
            "표면 · 심부 연계 분석"
          ]
        ]
      },
      "criteria": "<p>사면 관리기준은 설계 안정율, 붕괴 위험 등급, 인접 시설물에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 변위속도·강우 후 반응 기준을 병행합니다. 한계 초과 시 대피·공사 중지·보강을 검토하는 관리 단계를 운영할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "사면에서 변위속도가 왜 중요한가요?",
          "a": "일정 속도의 미소 변위는 장기 크리프일 수 있으나, 강우 후 가속되면 진행성 파괴 위험이 커집니다. 속도 추세가 핵심 지표입니다."
        },
        {
          "q": "지중경사계만으로 충분한가요?",
          "a": "활동면·심부 변위 파악에 필수이나, 강우·지하수위·표면 균열 데이터를 함께 봐야 원인과 위험도를 정확히 판단할 수 있습니다."
        },
        {
          "q": "지표경사와 구조물 변위는 어디서 보나요?",
          "a": "<strong>지표경사</strong>·<strong>구조물 변위</strong> 리프에서 옹벽·암반 표면 계측을 다룹니다. 활동면 해석은 지중경사계와 연계합니다."
        },
        {
          "q": "GNSS는 언제 쓰나요?",
          "a": "광역 표면 변위·장기 추세 확인에 활용하며, 활동면 심도 해석은 지중경사계가 우선입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.2",
        "label": "사면·절토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/soft-ground": {
    "id": "fields/soft-ground",
    "title": "연약 지반",
    "tagline": "성토·지반개량 과정의 침하·간극수압·측방유동 통합 관리",
    "metaDescription": "연약지반 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>연약 지반</strong>은 성토 및 지반개량 과정에서 침하, 간극수압, 측방유동을 측정하여 압밀 진행과 안정성을 관리하는 계측입니다. 연약지반은 하중 재하 시 장기 침하와 측방유동이 발생할 수 있으며, 간극수압 소산 속도에 따라 전단강도 증가와 안정성이 달라집니다.</p><p><strong>침하계</strong>, <strong>층별침하계</strong>, <strong>간극수압계</strong>, <strong>지중경사계</strong>를 함께 설치하여 성토 속도와 안정성을 판단합니다. 총 침하량만으로는 원인 지층을 알기 어려우므로 층별침하계가 중요하며, 측방유동 징후는 지중경사계 수평변위와 연계합니다. 성토 속도·단계성토·프리로딩 해제 시점 결정의 핵심 근거가 됩니다.</p>",
      "purpose": [
        {
          "title": "압밀 진행",
          "body": "침하·간극수압 소산으로 압밀 진행과 강도 증가 확인"
        },
        {
          "title": "침하 예측",
          "body": "최종 침하량·잔류침하를 예측하고 개량 효과를 평가합니다."
        },
        {
          "title": "측방 안정",
          "body": "측방유동·성토 안정성을 <strong>지중경사계</strong>로 평가합니다."
        },
        {
          "title": "공정 제어",
          "body": "성토 속도·단계성토·프리로딩 해제 시점을 계측으로 결정합니다."
        }
      ],
      "principle": "<p>연약지반 거동은 Terzaghi 압밀 이론과 유효응력 개념으로 설명됩니다. 성토 하중 → 간극수압 상승 → 시간에 따른 소산 → 유효응력 증가 → 침하·강도 변화. 층별침하계는 지층별 기여도를, 간극수압계는 소산 속도를, 지중경사계는 측방 변형을 제공합니다.</p>",
      "installation": [
        "지반조사 · 성토 계획 기준 대표 단면과 계측 심도 확정",
        "성토 전 침하계 · 층별침하계 · 간극수압계를 설치 · 초기치를 확보",
        "성토체 · 연약층 경계에 지중경사계를 배치해 측방유동을 감시",
        "지하수위계로 배수 · 수위 변화 추적",
        "성토 단계별 계측 빈도를 높이고 데이터를 성토고와 연동",
        "원격계측으로 야간 · 휴일 성토 시 실시간 경보 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "착공 전",
            "침하계, 간극수압계",
            "초기치 · 지반조사 연계"
          ],
          [
            "1단 성토",
            "총침하, 간극수압",
            "즉시침하 · 압밀 반응"
          ],
          [
            "성토 진행",
            "층별침하, 지중경사계",
            "침하속도 · 측방유동"
          ],
          [
            "프리로드 · 안정",
            "간극수압 소산",
            "다음 하중 단계 · 안정관리"
          ],
          [
            "개량 · 되메우기",
            "전 항목",
            "잔류침하 · 개량 효과 검증"
          ]
        ]
      },
      "data": {
        "headers": [
          "현상",
          "센서",
          "해석"
        ],
        "rows": [
          [
            "시간-침하 곡선",
            "침하계, 층별침하계",
            "압밀계수 · 잔류침하 추정"
          ],
          [
            "간극수압 소산",
            "간극수압계",
            "강도 증가 · 다음 성토 가능 여부"
          ],
          [
            "측방 변위",
            "지중경사계",
            "성토 속도 · 한도 검토"
          ],
          [
            "지층별 침하",
            "층별침하계",
            "개량층 · 연약층 기여도 분리"
          ]
        ]
      },
      "criteria": "<p>연약지반 기준은 성토 안정율, 허용 침하, 허용 측방변위, 간극수압 소산율에 따라 설정합니다. 성토 중 급격한 침하·측방변위·간극수압 재상승 시 성토 중지·속도 조정을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "침하계와 층별침하계를 함께 쓰는 이유는?",
          "a": "총 침하만으로는 어느 지층에서 침하가 발생하는지 알 수 없습니다. 층별침하계는 개량 효과와 잔류침하 위험 판단에 유리합니다."
        },
        {
          "q": "간극수압이 오래 소산되지 않으면?",
          "a": "성토 속도가 과도하거나 배수가 불량할 수 있습니다. 성토 속도 조정·배수 대책을 검토합니다."
        },
        {
          "q": "측방유동은 어떤 계측기로 보나요?",
          "a": "<strong>지중경사계</strong>·<strong>다점지중변위계</strong>로 수평·전단 변형을 추적하고, 성토 하중·지하수위와 연계합니다."
        },
        {
          "q": "잔류침하 예측은 필수인가요?",
          "a": "교통·구조물 연계 시 잔류침하가 허용치를 넘을 수 있어 시간-침하 곡선·압밀 해석과 계측을 병행합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.4",
        "label": "연약지반·성토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.4",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/structural-safety": {
    "id": "fields/structural-safety",
    "title": "구조물 안전",
    "tagline": "기존·시공 중 구조물의 균열·경사·변위·진동 장기 감시",
    "metaDescription": "구조물 안전계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>구조물 안전계측</strong>은 기존 구조물 또는 시공 중 구조물의 균열, 경사, 변위, 진동을 측정하여 안전성 및 사용성 변화를 감시하는 계측입니다. 인접 굴착, 기초 침하, 온도 변화, 반복하중, 노후화에 의해 균열과 변형이 발생할 수 있습니다.</p><p>초기 상태를 기록하고 시간에 따른 변화를 추적하여 보수·보강 필요성을 판단하는 근거를 제공합니다. <strong>균열계</strong>, <strong>구조물경사계</strong>, <strong>변위계</strong>, <strong>진동계</strong>, <strong>변형률계</strong>, <strong>자동광파기</strong>를 조합하며, 온도·계절에 따른 정상 반복 거동과 구조적 이상을 구분합니다. 인접 공사 영향 평가에서도 핵심 역할을 합니다.</p>",
      "purpose": [
        {
          "title": "손상 추적",
          "body": "균열 폭·길이 변화를 <strong>균열계</strong>로 정량 관리합니다."
        },
        {
          "title": "기울기 · 회전",
          "body": "구조물 경사·기초 부등침하를 <strong>구조물경사계</strong>로 확인합니다."
        },
        {
          "title": "변위 감시",
          "body": "절대·상대 변위를 <strong>변위계</strong>, <strong>자동광파기</strong>로 추적합니다."
        },
        {
          "title": "동적 특성",
          "body": "진동 응답 변화로 강성 저하·연결부 손상 징후를 <strong>진동계</strong>로 검토합니다."
        }
      ],
      "principle": "<p>구조물 계측은 기준 상태 대비 변화량 관리가 핵심입니다. 균열은 폭·추세, 경사는 회전·부등침하, 변위는 누적·속도, 진동은 고유진동수·감쇠 변화로 해석합니다. 복수 센서를 함께 보면 원인(기초·온도·외력) 추정이 가능합니다.</p>",
      "installation": [
        "구조물 유형 · 손상 우려 부위 · 인접 공사 여부 반영 — 측점 선정",
        "균열계를 대표 균열 · 신규 균열에 설치 · 사진 · 위치 기록",
        "교각 · 기둥 · 벽체에 구조물경사계를 수평 · 수직 방향으로 배치",
        "변위계 · 자동광파기로 절대 변위 기준망 구축",
        "동적 평가가 필요하면 진동계를 설치 · 기준 응답을 확보",
        "데이터로거 · 원격계측으로 장기 추세를 자동 수집"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "사전조사",
            "균열 · 경사 · 변위",
            "기준 상태 · 사진 기록"
          ],
          [
            "인접 공사 전",
            "초기치 · 기준망",
            "협의 · 경보 체계"
          ],
          [
            "모니터링",
            "추세 · 속도",
            "정상 반복 vs 구조적 이상"
          ],
          [
            "이벤트",
            "급변 · 복수 징후",
            "현장 조사 · 공정 조정"
          ],
          [
            "장기",
            "누적 · 잔류",
            "보수 · 보강 우선순위"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "센서",
          "해석"
        ],
        "rows": [
          [
            "균열 확대",
            "균열계",
            "온도 보정 후 추세 · 속도"
          ],
          [
            "경사 증가",
            "구조물경사계",
            "부등침하 · 회전 변형"
          ],
          [
            "변위 누적",
            "변위계, 자동광파기",
            "인접 공사 · 침하 연계"
          ],
          [
            "진동 특성 변화",
            "진동계",
            "강성 · 연결부 이상"
          ]
        ]
      },
      "criteria": "<p>구조물 안전 기준은 설계, 노후도, 중요도, 인접 공사에 따라 설정합니다. 균열 폭·경사·변위의 절대값과 속도 기준을 병행하고, 급격한 변화 시 현장 조사·보강을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "균열 폭이 조금씩 변하는데 문제인가요?",
          "a": "온도에 따른 반복 변화와 구조적 진행 균열을 구분해야 합니다. 추세가 지속 증가하면 원인 분석이 필요합니다."
        },
        {
          "q": "인접 굴착 시 어떤 센서가 우선인가요?",
          "a": "균열계·구조물경사계·자동광파기 조합이 일반적이며, 구조물 유형에 따라 변위계·진동계를 보완합니다."
        },
        {
          "q": "진동 기준은 구조물마다 다른가요?",
          "a": "구조물 고유진동수·민감도·용도에 따라 다릅니다. 인체·민원 기준과 구조물 기준을 구분 적용합니다."
        },
        {
          "q": "건축·인접 구조물과 차이는?",
          "a": "건축·인접 구조물은 KCS 3.9 시공 중·준공 연계 계측에 초점을 둡니다. 본 분야는 준공 후·운영 중 장기 모니터링·인접 공사 영향 평가에 초점을 둡니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-022"
      ]
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.6",
        "label": "구조물 안전계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공·유지관리 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.6",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/railway": {
    "id": "fields/railway",
    "title": "철도",
    "tagline": "철도 노반·궤도 변위·진동을 고빈도 감시하여 운행 안전 확보",
    "metaDescription": "철도·고속철도 계측 — 노반·궤도 변위, 건설중·운영기 계측, 인접공사 연계를 정리한 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>철도</strong>는 철도 노반, 궤도, 인접 구조물의 침하·변위·진동을 감시하여 열차 운행 안전과 인접공사 영향을 관리하는 계측입니다. 철도는 허용 변위가 매우 작고 운행 안전과 직결되므로 고빈도 계측과 신속한 경보 체계가 중요합니다.</p><p><strong>건설중 계측</strong>(<a href=\"#fields/railway/construction-phase\">道床·노반·궤도 시공</a>)은 신규·개량·고속철 시공 단계를 운영기 노반·궤도 계측과 구분합니다.</p><p>인접 굴착, 터널 하부 통과, 노반 보강, 교량 접속부 등에서 <strong>자동광파기</strong>, <strong>침하계</strong>, <strong>진동계</strong>, <strong>GNSS</strong>를 활용합니다. 계측값은 선로 유지관리 기준·운행 제한 기준과 즉시 연계되며, 야간·휴일 자동화가 필수적입니다. 인접공사 계획과 계측 빈도·기준을 사전에 합의하는 것이 실무 핵심입니다.</p>",
      "purpose": [
        {
          "title": "노반 안정",
          "body": "노반 침하·융기를 <strong>침하계</strong>, <strong>자동광파기</strong>로 고빈도 감시합니다."
        },
        {
          "title": "궤도 변위",
          "body": "궤도 변위·선형 변화를 정밀 측량으로 관리합니다."
        },
        {
          "title": "인접공사",
          "body": "굴착·터널·보강공이 선로에 미치는 영향을 실시간 추적합니다."
        },
        {
          "title": "진동 · 동적",
          "body": "공사·열차 진동을 <strong>진동계</strong>로 평가하고 민원·기준과 연계합니다."
        }
      ],
      "principle": "<p>철도 계측은 mm 단위 변위와 μm/s~mm/s 진동 속도 관리가 일반적입니다. 자동광파기는 3차원 좌표 반복 측정, 침하계는 국부 수직변위, GNSS는 장거리 추세, 진동계는 발파·공사·열차 이벤트를 포착합니다. 기준점 안정성과 대기·시야 조건이 해석 품질을 좌우합니다.</p>",
      "installation": [
        "철도 운영 · 안전 규정 기준 — 계측 구간 · 빈도 · 경보 체계를 협의",
        "선로 양측 · 절개 · 교량 접속부에 자동광파기 프리즘망 구축",
        "노반 · 궤도 하부에 침하계를 설치 · 초기치 확정",
        "인접공사 구간에 고빈도 계측 · 실시간 전송 설정",
        "발파 · 굴착 구간에 진동계를 배치 · 기준과 연동",
        "원격계측시스템으로 24시간 모니터링 · SMS · 이메일 경보 운영"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "사전 조사",
            "노반 · 궤도 기준",
            "초기치 · 협약 기준 확립"
          ],
          [
            "인접공사 착공 전",
            "자동광파기",
            "영향권 · 경보 체계 합의"
          ],
          [
            "굴착 · 터널 · 보강",
            "고빈도 변위 · 침하",
            "운행 제한 · 속도 조정 검토"
          ],
          [
            "발파 · 진동 이벤트",
            "진동계",
            "PPV · 철도 · 구조물 기준"
          ],
          [
            "장기 유지",
            "침하 · 궤도 추세",
            "누적 변위 · 유지관리 연계"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "수단",
          "실무"
        ],
        "rows": [
          [
            "노반침하",
            "자동광파기, 침하계",
            "운행 제한 기준과 즉시 연계"
          ],
          [
            "궤도변위",
            "정밀 측량, 변위계",
            "선형 · 고저 · 통과 변위"
          ],
          [
            "인접 굴착",
            "자동광파기",
            "굴착 단계 · 거리 · 속도와 상관"
          ],
          [
            "발파 진동",
            "진동계",
            "철도 · 구조물 진동 기준"
          ]
        ]
      },
      "criteria": "<p>철도 관리기준은 철도공사·국토부·인접공사 협약 기준을 따릅니다. 허용 변위·변위속도·진동 속도가 매우 엄격하며, 기준 초과 시 운행 속도 제한·공사 중지가 즉시 검토됩니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "철도 계측 빈도는 어느 정도인가요?",
          "a": "인접공사 구간은 시간당~일 수회 자동 계측이 일반적이며, 위험도에 따라 실시간에 가깝게 설정합니다."
        },
        {
          "q": "자동광파기 기준점이 불안정하면?",
          "a": "전체 변위 해석이 왜곡됩니다. 기준점은 선로 영향권 밖 안정 지반에 설치하고 정기 검증합니다."
        },
        {
          "q": "궤도 침하와 선로 변위 차이는?",
          "a": "침하는 연직, 변위는 수평·비틀림을 봅니다. 동일 단면에서 궤도·도상 측점을 함께 두고 해석합니다."
        },
        {
          "q": "인접 공사와 본선 계측을 통합하나요?",
          "a": "시간·좌표 기준을 맞춰 인접공사·본선 데이터를 한 대시보드에서 비교하는 것이 일반적입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.7",
        "label": "철도·궤도 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.7",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam": {
    "id": "fields/dam",
    "title": "댐·제방",
    "tagline": "댐·제방 안전관리 — 저수위·침투·누수·변형 응답의 통합 계측",
    "metaDescription": "댐 안전관리 계측 체계 — 저수위·간극수압·누수·침하·변위를 연계하여 이상징후를 조기 판단하는 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>댐 안전관리 계측 체계</strong>는 저수위 변화에 따른 제체·기초의 침투, 누수, 변형 응답을 종합 관찰하여 이상 징후를 조기에 판단하는 안전관리 시스템입니다. 계측 항목은 센서 설치 위치, 측정값, 해석값, 관리기준, 조치 절차가 상호 연계되도록 구성합니다.</p><p><strong>건설중 계측</strong>(<a href=\"#fields/dam/construction-phase\">축조·성토 단계</a>)은 준공 후 누수·간극수압 안전관리와 구분하며, 원격계측·데이터관리 SW로 QC·보고를 연계합니다.</p><p><strong>수리 해석 용어:</strong> <strong>filter tip</strong>(필터 구간 끝)=간극수압 측정 지점이며 침윤선과 동일하지 않습니다. <strong>piezometric head</strong>(간극수압 수두)는 관측공·필터 위치의 수압을 뜻하며 <strong>지하수위(G.W.L)</strong>와 구분합니다. 침윤선은 간극수압·수위·지층 데이터를 종합해 <strong>추정</strong>합니다.</p>",
      "purpose": [
        {
          "title": "수위 · 간극수압",
          "body": "저수위 변화에 따른 제체·기초 <strong>간극수압</strong>과 수두 조건을 관리합니다."
        },
        {
          "title": "침투 · 누수",
          "body": "<strong>간극수압계</strong>·해석 침윤선과 하류 <strong>누수량·탁도</strong>로 침투·누수 이상을 판단합니다."
        },
        {
          "title": "침하 · 변위",
          "body": "<strong>침하계</strong>·<strong>GNSS</strong>·경사계로 누적 변형과 변위속도 추적"
        },
        {
          "title": "응력 · 변형률",
          "body": "<strong>변형률계</strong>·기울기계로 제체·기초의 응력·변형 응답 확인"
        },
        {
          "title": "온도 · 지진",
          "body": "강우·지진·온도 등 외력 조건과 계측 반응의 상관성을 분석합니다."
        },
        {
          "title": "하천제방 · 의사결정",
          "body": "제방·저수지별 관리기준에 따라 정상/주의/경계/위험 단계로 조치 절차와 연계합니다."
        }
      ],
      "principle": "<p>댐 안정은 저수위(외력)와 제체·기초의 간극수압·누수·변위 응답 균형으로 평가합니다. 계측자료는 데이터로거 및 서버 DB로 수집된 후 결측·이상치·드리프트·온도 영향을 검증하고, 관리기준과 비교하여 정상·주의·경계·위험 단계로 판단합니다. 이상 징후 발생 시 현장점검·계측기 확인·원인분석·보수·보강·비상대응 절차와 연계합니다.</p>",
      "installation": [
        "설계 계측 단면 · 수위 구간별 계측 계획 준수",
        "기초 · 제체 · 배수층에 간극수압계 · 지하수위계 설치",
        "제체 크레스트 · 익스트 · 기초에 침하계 · 변위계 배치",
        "누수량 측정 시설 · 배수로를 계측 대상에 포함",
        "장기 모니터링용 GNSS · 자동화 체계 구축",
        "원격계측으로 수위 급변 · 태풍 · 지진 시 고빈도 계측 전환"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "평상 저수위",
            "간극수압, 침하",
            "정상 패턴 · 기준선 확립"
          ],
          [
            "수위 상승",
            "수압, 누수량, 탁도",
            "침투 · 파이핑 징후"
          ],
          [
            "홍수기 · 태풍",
            "전 항목 고빈도",
            "경보 단계 · 비상 대응"
          ],
          [
            "지진 · 급변 이벤트",
            "변위, 수압, 진동",
            "잔류변위 · 이상 징후"
          ],
          [
            "장기 운영",
            "GNSS, 침하 추세",
            "누적 변형 · 유지관리"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "센서",
          "해석"
        ],
        "rows": [
          [
            "수위-간극수압",
            "간극수압계",
            "정상 패턴 vs 이상 상승"
          ],
          [
            "제체 변위",
            "변위계, GNSS",
            "비대칭 · 집중 변형"
          ],
          [
            "장기 침하",
            "침하계",
            "압밀 · 크리프 추세"
          ],
          [
            "누수량",
            "유량계",
            "급증 · 탁도 변화"
          ],
          [
            "온도",
            "온도센서",
            "수화열 · 열응력"
          ],
          [
            "지진",
            "진동계",
            "잔류변위 · 수압 이탈"
          ]
        ]
      },
      "criteria": "<p>댐 관리기준은 댐 안전점검 규정·설계 기준·과거 데이터 기반 통계적 한계를 적용합니다. 수위별·계절별 정상 범위를 설정하고 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "댐 계측에서 가장 민감한 항목은?",
          "a": "현장마다 다르지만 간극수압 급변, 누수량 증가, 비대칭 변위는 공통적으로 중요하게 봅니다."
        },
        {
          "q": "제방도 같은 방식인가요?",
          "a": "원리는 유사하나 규모·재료·수위 조건이 다릅니다. 간극수압·침하·표면 변위 중심으로 단순화하는 경우가 많습니다."
        },
        {
          "q": "침윤선과 피에조 수두는 어떻게 맞추나요?",
          "a": "간극수압·수위계 데이터로 침윤선을 추정할 때 관측공 위치·지층 연속성을 함께 검토합니다."
        },
        {
          "q": "홍수기 운영은?",
          "a": "수위 상승·지하수위·제체 변위속도를 고빈도로 전환하고 관리기준을 단계별로 적용합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3",
        "label": "댐·제방 계측설비"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "댐·제체 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/harbor": {
    "id": "fields/harbor",
    "title": "항만·해안",
    "tagline": "항만·호안 구조물과 주변 지반·수위 변화를 통합 모니터링",
    "metaDescription": "항만·호안 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>항만·해안</strong>은 부두·옹벽·파제제 등 항만구조물과 주변 지반·조위·지하수 변화를 측정하여 구조 안전성과 해안 안정을 평가하는 계측입니다(KDS 4.1.8). 조위·파랑·지진·기상에 따른 구조물 변위·경사·간극수압·침하를 추적합니다.</p><p><strong>변위계</strong>, <strong>구조물경사계</strong>, <strong>침하계</strong>, <strong>지하수위계</strong>, <strong>간극수압계</strong>, <strong>지중경사계</strong>를 조합하여 구조물·지반·수문 조건을 통합 해석합니다. 조위 주기·강우·공사 이벤트와 시간 동기화가 해석의 기본입니다.</p>",
      "purpose": [
        {
          "title": "구조물 거동",
          "body": "항만구조물 변위·경사·균열을 <strong>변위계</strong>, <strong>구조물경사계</strong>로 확인합니다."
        },
        {
          "title": "주변 지반",
          "body": "옹벽 배면·해안 지반 침하·측방 유동을 <strong>침하계</strong>, <strong>지중경사계</strong>로 감시합니다."
        },
        {
          "title": "수문 조건",
          "body": "조위·지하수·간극수압을 <strong>지하수위계</strong>, <strong>간극수압계</strong>로 관리합니다."
        },
        {
          "title": "장기 안전",
          "body": "태풍·지진·공사 후 잔류 변위·수압 변화를 데이터베이스로 축적합니다."
        }
      ],
      "principle": "<p>항만·호안 구조물은 조위·파랑 하중과 배면 지반 반력의 균형으로 안정합니다. 조위 상승 시 간극수압·측방 지압이 변하며, 구조물 변위·경사·배면 침하가 연동됩니다. 정상 조위-변위 패턴을 확립한 뒤 이탈을 감시합니다.</p>",
      "installation": [
        "설계 계측 계획 기준 — 구조물 · 지반 · 수문 측점 선정",
        "부두 · 옹벽에 변위계 · 구조물경사계 설치",
        "배면 · 해안 지반에 침하계 · 지중경사계 배치",
        "조위 · 지하수 · 간극수압 측정 연동",
        "태풍 · 지진 · 대규모 공사 시 고빈도 계측으로 전환",
        "원격계측시스템으로 장기 모니터링 체계 구축"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "평상",
            "구조물 변위, 조위 연동",
            "조석 · 온도 정상 패턴"
          ],
          [
            "매립 · 굴착 공사",
            "배면 침하, 지중변위",
            "안벽 · 지반 연동"
          ],
          [
            "태풍 · 지진",
            "고빈도 변위 · 수압",
            "급변 · 잔류 변위 검토"
          ],
          [
            "장기 운영",
            "간극수압, 침하",
            "수두 · 배수 성능 · 추세"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "센서",
          "해석"
        ],
        "rows": [
          [
            "구조물 변위",
            "변위계, 경사계",
            "조위 · 온도 정상범위"
          ],
          [
            "배면 지반",
            "침하계, 지중경사계",
            "측방 지압 · 침하"
          ],
          [
            "조위 · 지하수",
            "지하수위계",
            "조석 · 강우 연동"
          ],
          [
            "간극수압",
            "간극수압계",
            "수두 · 배수 성능"
          ]
        ]
      },
      "criteria": "<p>항만·호안 관리기준은 설계, 구조 형식, 조위·파랑 조건, 인접 시설물 민감도에 따라 설정합니다. 조위별·계절별 정상 패턴을 정의하고, 급격한 변위·수압 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "조위 변화만으로 변위가 커지면?",
          "a": "정상 조석·온도 신축 범위인지, 배면 지반·기초 문제인지 과거 데이터·동시 계측으로 구분합니다."
        },
        {
          "q": "호안과 부두 계측 차이는?",
          "a": "원리는 유사하나 하중 조건·구조 형식이 다릅니다. 파랑·세굴·배면 지반 조건에 맞게 센서를 선정합니다."
        },
        {
          "q": "케이슨과 부두는 어디서 보나요?",
          "a": "<strong>케이슨</strong>·<strong>부두</strong> 리프에서 침하·변위·조위·지하수를 분리해 다룹니다."
        },
        {
          "q": "지하수위와 조위를 같이 봐야 하나요?",
          "a": "매립·퇴적 지반에서는 조위·지하수위·침하를 연계해 세굴·배면 안정을 판단합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-064"
      ]
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.8",
        "label": "항만·호안 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.8",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/building": {
    "id": "fields/building",
    "title": "건축·인접 구조물",
    "tagline": "시공 중 건축구조물의 처짐·축소·균열·인접영향·응력을 KCS 3.9 기준으로 관리",
    "metaDescription": "건축공사 계측의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.",
    "sections": {
      "overview": "<p><strong>건축·인접 구조물</strong>은 고층·장경간 건축물 시공 중 구조물의 처짐, 기둥 축소량, 균열, 주변건물 영향, 응력·변형률을 측정하여 시공 안전과 품질을 확보하는 계측입니다(KCS 3.9). 준공 후 건물 계측을 위한 시공 과정 계측기 설치·측정을 포함합니다.</p><p>준공 이후 장기 운영·교량·댐 등 구조물의 변위·균열·진동 모니터링은 <a href=\"#fields/structural-safety\">구조물 안전</a> 항목과 연계합니다.</p><p><strong>와이어식/LVDT 처짐계</strong>, <strong>변형률계</strong>, <strong>균열계</strong>, <strong>구조물경사계</strong>, <strong>하중계</strong>를 조합하여 구조 거동을 통합 해석합니다. 온도·지하수위·하중 변동과 시간 동기화가 해석의 기본입니다.</p>",
      "purpose": [
        {
          "title": "처짐",
          "body": "장경간 구조물의 처짐을 <strong>와이어식/LVDT 처짐계</strong>로 관리합니다."
        },
        {
          "title": "기둥 축소량",
          "body": "초고층 건물 기둥·코아벽체 축소를 <strong>변형률계</strong>·변위계로 측정합니다."
        },
        {
          "title": "균열",
          "body": "안전에 유해한 균열을 <strong>균열계</strong>로 감시합니다."
        },
        {
          "title": "주변건물",
          "body": "굴착·진동 등 인접 영향을 <strong>균열계</strong>·<strong>구조물경사계</strong>·<strong>와이어식 변위계</strong>로 확인합니다."
        },
        {
          "title": "응력 · 변형률",
          "body": "중대 부재의 응력·변형률을 <strong>하중계</strong>·<strong>변형률계</strong>로 평가합니다."
        }
      ],
      "principle": "<p>건축공사 계측은 절대·상대 변위, 응력, 균열 폭, 기둥 축소량을 시공 단계별로 기록하고 설계 예측·관리기준과 비교합니다. 온도·지하수위·하중에 따른 일상적 신축과 구조적 이상을 구분하며, 계측값 수렴 여부와 변화속도가 판단의 핵심입니다.</p>",
      "installation": [
        "계측관리계획서 기준 — 처짐 · 축소 · 균열 · 인접 · 응력 측점 선정",
        "경사계는 건물 기울기를 가장 잘 나타내는 위치에 설치",
        "기둥 축소량 계측기는 주요 기둥 · 코아벽체 축방향 중심에 설치",
        "주변건물은 사전 조사 후 균열 · 경사 · 변위 기준치 확정",
        "응력 · 변형률계는 시공 과정 기준 주요 부재에 설치",
        "온도 · 지하수위 등 연계 계측을 동시 운영",
        "원격계측으로 고층 · 대형 현장을 자동화"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "착공 전",
            "인접 건물 균열 · 경사",
            "초기치 · 사전조사"
          ],
          [
            "굴착 · 기초",
            "침하, 지하수위",
            "차등침하 · 인접 영향"
          ],
          [
            "승장 · 구조 시공",
            "기둥축소, 처짐",
            "층별 누적 · 온도 보정"
          ],
          [
            "구조 완료",
            "응력 · 변형률, 경사",
            "수렴 · 관리기준 접근"
          ],
          [
            "준공 · 이관",
            "균열, 변위",
            "장기 모니터링 계획"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "계측기",
          "해석"
        ],
        "rows": [
          [
            "처짐",
            "와이어/LVDT, 처짐계",
            "설계 처짐 · 수렴"
          ],
          [
            "기둥 축소",
            "변형률계, 변위계",
            "층별 축소 누적"
          ],
          [
            "균열",
            "균열계",
            "폭 · 속도 추세"
          ],
          [
            "주변건물",
            "균열계, 경사계",
            "인접 공사 영향"
          ],
          [
            "응력 · 변형률",
            "하중계, 변형률계",
            "과응력 · 허용 대비"
          ]
        ]
      },
      "criteria": "<p>건축공사 관리기준은 구조 형식·중요도·설계 예측치·현장 조건에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong> 및 응력 한계를 기준으로 하며, 변위 수렴·변화속도·복수 센서 동시 변화를 우선 검토합니다. 준공 시 계측기 이관·장기 모니터링 계획을 수립할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "구조물 안전과 차이는?",
          "a": "건축·인접 구조물은 KCS 3.9에 따른 시공 중·준공 연계 계측에 초점을 둡니다. 운영 중 장기 모니터링은 <a href=\"#fields/structural-safety\">구조물 안전</a> 항목과 연계합니다."
        },
        {
          "q": "기둥 축소량은 언제 측정하나요?",
          "a": "KCS에 따라 매 층 승장 시 최소 1회 실시하는 것이 원칙입니다. 콘크리트 수화·탈형에 따른 축소 추세를 누적 관리합니다."
        },
        {
          "q": "처짐과 균열 중 무엇이 우선인가요?",
          "a": "고층·장스팬은 처짐·기둥 축소가 시공성에 직결되고, 균열은 응력·구속 문제를 봅니다. 설계 단계별로 중점이 달라집니다."
        },
        {
          "q": "인접 건물은 흙막이와 같은 센서인가요?",
          "a": "원리는 유사하나 건축 구조 응답에 맞게 균열계·경사·와이어식 변위계 배치를 조정합니다. 흙막이 hero(005)와 구분합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 건축공사 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 구조물·건축 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-100"
      ]
    },
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.9",
        "label": "건축공사 계측"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "구조물·건축 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/foundation-pile": {
    "id": "fields/foundation-pile",
    "title": "기초·말뚝",
    "tagline": "현장타설·기성말뚝 내부 축력·변형률로 깊이별 하중 분포·선단 지지력 관리",
    "metaDescription": "기초·말뚝의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "sections": {
      "overview": "<p><strong>기초·말뚝 계측</strong>은 구조물 하중을 지탱하는 지중 깊은 말뚝 내부에 <strong>변형률계</strong>·<strong>하중계</strong>를 매설하여 깊이별 축하중 분포와 선단 지지력을 추정하는 계측입니다. 현장타설말뚝(CIP)과 PHC 등 기성말뚝(precast) 모두 철근 cage 또는 공심부에 센서를 배치합니다.</p><p>시공·하중 시험·운영 단계에서 축력 재분배·선단·주면 마찰 기여도를 해석하며, <strong>침하계</strong>·지반조사 자료와 통합합니다. sister-bar형 진동현 변형률계는 콘크리트 타설 전 cage에 등간격 설치가 일반적입니다.</p>",
      "purpose": [
        {
          "title": "축력 분포",
          "body": "깊이별 변형률로 축하중 분포를 추정합니다."
        },
        {
          "title": "선단 지지",
          "body": "선단층 반응과 지지력 여유를 평가합니다."
        },
        {
          "title": "시공 검증",
          "body": "타설·항타 후 축력·변위를 시험하중과 비교합니다."
        },
        {
          "title": "장기 추세",
          "body": "연약지반·교량·고층 기초의 장기 거동 추적"
        }
      ],
      "principle": "<p>말뚝 축력은 선단 지지와 주면 마찰의 합입니다. cage에 매설된 변형률계는 깊이별 축변형률을 측정하고, 적분·역해석으로 축력 분포를 산출합니다. 지층별 토질(모래·점토·암반)에 따라 센서·그라우팅·필터 설치 상세가 달라집니다.</p>",
      "installation": [
        "설계 · 지반조사 기준 — 대표 말뚝 · 측정 단면 선정",
        "철근 cage 조립 시 sister-bar 변형률계를 등간격 매설",
        "선단 · 중간 · 말뚝두부에 측정 구간 배치",
        "케이블 · 보호관을 cage 외측으로 인양 · 데이터로거와 연결",
        "정적 · 동적 시험하중과 시간 동기화",
        "주변 말뚝 · 지표 침하계와 연계"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "설계 · 시추",
            "지층 · 단면",
            "센서 · 대표 말뚝 선정"
          ],
          [
            "cage · 매설",
            "영점 · 케이블 보호",
            "calibration"
          ],
          [
            "타설 · 항타",
            "초기 변형률 · 축력",
            "시험하중 연동"
          ],
          [
            "운영",
            "깊이별 분포",
            "재분배 · 추세"
          ],
          [
            "이상",
            "선단 급변",
            "지반 · 시공 재검토"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "수단",
          "해석"
        ],
        "rows": [
          [
            "축변형률",
            "sister-bar 변형률계",
            "깊이별 축력"
          ],
          [
            "선단 반응",
            "하부 게이지 군",
            "지지력 · 침하"
          ],
          [
            "시험하중",
            "하중계 · 변형률",
            "O-cell · 정적 시험"
          ],
          [
            "장기",
            "원격 로거",
            "재분배 · creep"
          ]
        ]
      },
      "criteria": "<p>말뚝 계측 기준은 설계 축력·허용 침하·시험하중 규정(KDS·현장 시험)을 따릅니다. 축력 분포 급변·선단층 이상 변형률은 지반·시공 재검토를 유발합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "교량 기초침하(013)와 차이는?",
          "a": "013은 교각 하부 pile group·riverbed 맥락입니다. 본 분야는 말뚝 내부 축력·변형률 단면(092)에 초점을 둡니다."
        },
        {
          "q": "기성말뚝에도 변형률계를 넣나요?",
          "a": "PHC 말뚝은 공심부·부착형 센서 또는 pilot bore 내 별도 계측 말뚝으로 대체하는 경우가 많습니다."
        },
        {
          "q": "현장타설과 기성말뚝 계측 차이는?",
          "a": "현장타설은 철근·콘크리트 응력·변형률, 기성은 말뚝체 변위·반력 중심으로 센서를 선정합니다."
        },
        {
          "q": "교량 기초침하(013)와 함께 보나요?",
          "a": "013은 교각 하부 pile group 침하·수위 맥락입니다. 본 분야는 말뚝 내부 축력·변형률 단면(092)에 초점을 둡니다. 동일 현장에서 병행 계측할 수 있습니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.9 — 기초·말뚝 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 현장 시험·설계 축력·발주처 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-092"
      ]
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.9",
        "label": "기초·말뚝 계측"
      },
      {
        "grade": "D",
        "docId": "KDS-11-10-15",
        "cite": "—",
        "label": "현장 시험·설계 축력·발주처 시방"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/environmental-impact": {
    "id": "fields/environmental-impact",
    "title": "환경·민원",
    "tagline": "가시설·터널 입구 등 공사 경계에서 소음·분진을 실시간 감시하여 민원·법규 준수",
    "metaDescription": "환경·민원의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "sections": {
      "overview": "<p><strong>환경·민원 계측</strong>은 도심 가시설·터널 입구 등에서 발생하는 <strong>소음(dB)</strong>과 <strong>비산먼지(PM10/PM2.5)</strong>가 인근 주거지에 미치는 영향을 실시간 관리하는 계측입니다. 공사 경계 펜스·독립 계측주에 일체형 센서를 설치하고 <strong>데이터로거</strong>·원격 전송으로 24시간 모니터링합니다.</p><p>법정 기준·계약 허용치·민원 임계치를 측점별로 설정하며, 초과 시 공정 조정·방진·살수·작업 시간 변경과 연동합니다. <strong>기상계측기</strong> 풍속·풍향과 연계하면 분진 확산 해석이 가능합니다.</p>",
      "purpose": [
        {
          "title": "소음",
          "body": "Leq·Lmax 등 dB 지표를 경계 측정주에서 연속 기록합니다."
        },
        {
          "title": "분진",
          "body": "PM10·PM2.5 농도를 광학·베타선 센서로 측정합니다."
        },
        {
          "title": "민원 대응",
          "body": "시간대·공종별 이벤트 로그로 원인 분석을 지원합니다."
        },
        {
          "title": "법규 · 계약",
          "body": "환경·소음 관련 허용 기준과 자동 경보 연동"
        }
      ],
      "principle": "<p>경계 측정주는 공사면과 민감 수용체(주택·학교) 사이 대표 위치에 설치합니다. 소음계는 IEC Class 1 마이크·풍속 보정, 분진계는 흡입 노즐·샘플링 펌프·광학 셀을 포함합니다. 데이터는 이벤트·1분·15분 통계로 저장합니다.</p>",
      "installation": [
        "민감 수용체 방향 · 도로 · 터널 입구 등 대표 측점 선정",
        "가설 펜스 상단 또는 독립 강주에 센서 일체형 랙 설치",
        "마이크 풍향막 · 분진 흡입구 높이를 규격(약 1.2~4 m)에 맞춥니다",
        "방수 데이터로거 · LTE 모뎀을 주기 또는 펜스 내 박스에 설치",
        "기준 초과 SMS · 이메일 · 현장 경보등 설정",
        "공종 · 장비 · 발파 일지와 시간 태그 연동"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "착공 전",
            "배경 소음 · PM",
            "기준선 · 측점 확정"
          ],
          [
            "주간 공사",
            "Leq · PM 연속",
            "법규 · 계약 한계"
          ],
          [
            "야간 · 휴일",
            "강화 기준",
            "작업 시간 · 공법 조정"
          ],
          [
            "이벤트",
            "공종 · 장비 태그",
            "원인 분석 · 민원"
          ],
          [
            "준공",
            "잔류 모니터링",
            "해제 · 보고"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "수단",
          "관리"
        ],
        "rows": [
          [
            "소음",
            "Class 1 sound level meter",
            "Leq · Lmax · 주간/야간"
          ],
          [
            "분진",
            "PM sensor inlet",
            "PM10 · PM2.5"
          ],
          [
            "기상",
            "풍속 · 풍향",
            "확산 · 민감도"
          ],
          [
            "경보",
            "원격 로거",
            "기준 초과 · 공정"
          ]
        ]
      },
      "criteria": "<p>허용 기준은 소음·대기환경 관련 법규·지자체 조례·계약 특별조건을 따릅니다. 야간·주말 기준이 더 엄격한 경우가 많으며, 초과 시 즉시 공정·방법 조정을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "터널 발파진동(097)과 차이는?",
          "a": "097은 PPV·영향권 지진파형입니다. 본 분야는 경계 dB·PM 농도의 연속 환경 모니터링(093)입니다."
        },
        {
          "q": "기상계측기(044)와 중복인가요?",
          "a": "풍속·강우는 044와 연동 가능하나, hero는 경계 소음·분진 일체형 주(093)입니다."
        },
        {
          "q": "소음과 분진 기준은 어디서 정하나요?",
          "a": "환경영향평가·계약·지자체 기준을 따르며, 계측관리계획서에 1·2차 관리기준을 명시합니다."
        },
        {
          "q": "가시설·터널과 연계는?",
          "a": "흙막이·터널 입구 등 경계에서 소음·분진을 연속 모니터링합니다. 발파진동(097)은 PPV·영향권, 본 분야는 경계 dB·PM입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 발파진동·소음 등 선택 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 환경·민원 기준·발주처 지침 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-093"
      ]
    },
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "발파진동·소음 등 선택 항목"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "환경·민원 기준·발주처 지침"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/retaining-excavation/earth-retaining-wall": {
    "id": "fields/retaining-excavation/earth-retaining-wall",
    "title": "흙막이 벽체",
    "sections": {
      "overview": "<p><strong>흙막이 벽체</strong> 계측은 굴착에 따른 벽체 수평변위, 배면 지반 거동, 지하수·토압, 지보재 하중, 지표침하, 인접 구조물 균열·경사를 <strong>통합</strong>하여 굴착 안정성을 관리합니다. 계측관리계획서의 대표 단면도처럼 <strong>인접 구조물 | 배면 지반 | 흙막이 벽체·띠장 | 굴착측</strong> 관계(좌→우) 속에서 계측기 위치를 이해하는 것이 출발점입니다.</p><p>단일 센서(예: 지중경사계만)로 판단하지 않습니다. 벽체 변위 증가 시 동시에 <strong>토압계</strong>·<strong>하중계</strong>·<strong>지하수위계</strong>·<strong>지표침하계</strong>·<strong>균열계</strong>·<strong>구조물경사계</strong> 변화를 시간 동기화하여 원인(배면 토압, 수압, 지보재 부담, 양수, 인접 영향)을 구분합니다.</p><p>대표 단면도(IMG-002)는 인접 건물·배면 지반·벽체·굴착측이 한 단면에 보이는 계측관리계획서 수준의 그림이며, 지중경사계·지하수위계·간극수압계·토압계·하중계·지표침하계·구조물경사계·균열계·변형률계·데이터로거 설치 위치를 표시합니다. 수위·간극수압 상세는 IMG-062, 버팀보·앵커 하중계는 IMG-003·004, 인접 건물은 IMG-005를 함께 참고합니다. 계측 빈도는 굴착 단계 전환·지보재 설치·강우·양수 전후에 높이며, 데이터는 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 비교합니다.</p>",
      "purpose": [
        {
          "title": "통합 감시",
          "variant": "lead",
          "accent": "integrated",
          "body": "굴착 단계별로 벽체·배면·지보재·수리·인접 구조물 거동을 <strong>한 단면·한 시간축</strong>에서 동시에 확인합니다.",
          "sensors": [
            "sensors/inclinometer",
            "sensors/load-cell",
            "sensors/water-level-meter"
          ]
        },
        {
          "title": "벽체 · 배면 변위",
          "accent": "displacement",
          "signal": "수평변위 · 변위속도",
          "body": "<strong>지중경사계</strong>로 심도별 수평변위 프로파일과 변위 집중 심도를 관리합니다.",
          "sensors": [
            "sensors/inclinometer"
          ]
        },
        {
          "title": "토압 · 수압",
          "accent": "water",
          "signal": "유효응력 · 수압",
          "body": "<strong>토압계</strong>·<strong>간극수압계</strong>·<strong>지하수위계</strong>로 배면 토압과 유효응력 변화를 해석합니다.",
          "sensors": [
            "sensors/earth-pressure-cell",
            "sensors/piezometer",
            "sensors/water-level-meter"
          ]
        },
        {
          "title": "지보재 하중",
          "accent": "load",
          "signal": "축력 · 인장력",
          "body": "버팀보·어스앵커 <strong>하중계</strong>로 축력·인장력과 설계 가정을 검증합니다.",
          "sensors": [
            "sensors/load-cell",
            "sensors/strain-gauge"
          ]
        },
        {
          "title": "주변 · 인접 영향",
          "accent": "settlement",
          "signal": "지표침하 · 균열 · 경사",
          "body": "<strong>지표침하계</strong>, <strong>균열계</strong>, <strong>구조물경사계</strong>로 배면 침하와 인접 건물 영향을 조기 파악합니다.",
          "sensors": [
            "sensors/settlement-gauge",
            "sensors/crack-meter",
            "sensors/tilt-meter"
          ]
        }
      ],
      "principle": "<p>흙막이 계측은 지중(지중경사계·토압계·간극수압계), 지표(지표침하계), 구조물(균열계·구조물경사계), 지보재(하중계·변형률계)를 한 단면에서 연계 해석합니다. 벽체 형식(흙막이말뚝·CIP·슬러리월·시트파일 등)에 따라 지중경사계·토압계 위치가 달라지나, 배면 지반 천공 또는 벽체 인접부 설치·안정층 근입 원칙은 공통입니다.</p><p>굴착이 깊어질수록 변위 집중 심도·지보재 부담·수위 저하가 동시에 진행됩니다. 1단계 굴착에서는 지표침하·수위 기준을, 지보재 설치 후에는 하중계·변형률계, 최종 굴착 단계에서는 벽체 하부 변위·토압 집중을 중점 검토합니다. 토압계는 감지면이 배면 지반→벽체 방향과 일치해야 하며, 버팀보 하중계는 띠장 접합부, 어스앵커 하중계는 <strong>굴착측에 노출된 두부</strong>(지지링·반력판–하중계–앵커헤드)에만 설치합니다.</p>",
      "installation": [
        "대표 단면 · 최대 변위 예상 단면 · 인접 구조물 인접 단면을 계측관리계획서에 확정",
        "지중경사계: 벽체 배면 또는 인접 지반 천공에 수직 설치, 굴착 영향 심도 하부 안정층까지 근입, A · B축을 굴착 방향 · 직교 방향으로 정의",
        "토압계: 벽체 배면 또는 설계 심도에 설치, 감지면 · 토압 작용 방향(배면 → 벽체)을 도면에 표기",
        "지하수위계: 배면 지반 관측공 내부에 설치(벽체 표면 부착 금지), 수위선 · 보호관을 함께 기록",
        "간극수압계: 배면 · 굴착저 하부 지정 심도 천공에 설치",
        "버팀보 하중계: 띠장–버팀보 접합부(끝단)에 축압축력 방향으로 설치",
        "어스앵커 하중계: 굴착측에 노출된 앵커 두부에 설치(지지링 · 반력판 → 플레이트 → 하중계 → 플레이트 → 앵커헤드 → 강연선). 정착장 · 그라우트 내부 설치 금지",
        "지표침하계: 배면 지표면 측점에 배치 · 굴착 단계별 침하 측선을 구성",
        "인접 건물: 균열계(균열에 수직 교차), 구조물경사계(외벽 · 기둥), 필요 시 자동광파기 설치",
        "변형률계: 띠장 · 버팀보 · 벽체 부재에 부착해 응력 · 변형을 보완",
        "데이터로거 · 원격계측으로 센서를 연결하고, 설계예상변위 · 최대허용변위 기준 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측 항목",
          "확인 사항"
        ],
        "rows": [
          [
            "착공 전",
            "전 계측 항목",
            "초기치 설정, 인접 구조물 사전조사"
          ],
          [
            "1단 굴착",
            "지표침하, 지하수위",
            "배면 지반 초기 반응 확인"
          ],
          [
            "지보재 설치 후",
            "하중계, 변형률계",
            "프리로드, 축력 변화 확인"
          ],
          [
            "심층 굴착",
            "지중경사계, 토압계, 수위계",
            "벽체 변위 집중 심도 확인"
          ],
          [
            "최종 굴착",
            "전 계측 항목",
            "관리기준 접근 여부 검토"
          ],
          [
            "해체 · 되메우기",
            "하중계, 변위계",
            "지보재 해체에 따른 변위 재증가 확인"
          ]
        ]
      },
      "data": {
        "headers": [
          "연계 현상",
          "확인 센서",
          "해석·조치"
        ],
        "rows": [
          [
            "벽체 변위↑ + 하중↑",
            "지중경사계, 하중계",
            "배면 토압 · 지보재 부담 증가, 굴착 속도 · 양수 검토"
          ],
          [
            "변위↑, 하중 변화 소",
            "지중경사계, 하중계",
            "지보재 설치 시점 · 프리로드 · 초기치 오류 점검"
          ],
          [
            "토압↑ + 수위↓",
            "토압계, 지하수위계, 간극수압계",
            "유효응력 · 수압 분리 해석, 양수 · 배수 조정"
          ],
          [
            "지표침하 + 건물 균열 · 경사",
            "지표침하계, 균열계, 구조물경사계",
            "차등침하 · 수평변위 전달, 공법 · 굴착 단계 조정"
          ],
          [
            "복수 센서 동시 급변",
            "전 센서 시간 동기화",
            "관리기준 초과 시 원인분석 · 시공 조정 · 작업 중지 검토"
          ]
        ]
      },
      "criteria": "<p>관리기준은 설계도서·계측관리계획서·발주처 기준·인접 구조물 민감도에 따라 현장별로 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>를 벽체·배면·인접 구조물 각각에 적용하고, 단일 절대값보다 변위속도·복수 센서 동시 변화가 중요합니다. 기준 초과 시 지중경사계 프로파일·토압·하중·수위·침하를 통합 원인분석한 뒤 굴착 중지·지보 보강·양수 조정·계측 빈도 강화를 단계적으로 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "지중경사계는 벽체에 설치하나요, 배면 지반에 설치하나요?",
          "a": "현장 조건과 벽체 형식에 따라 다르지만, 일반적으로 벽체 배면 또는 인접 지반 천공에 설치하여 굴착 방향 수평변위를 확인합니다. 안정층까지 근입하고 측정 축 방향을 명확히 정의해야 합니다."
        },
        {
          "q": "버팀보 하중계는 어디에 설치해야 하나요?",
          "a": "띠장–버팀보 접합부에서 축압축력이 전달되는 위치에 설치합니다. 버팀보 중앙부에 설치하는 표현은 피해야 합니다."
        },
        {
          "q": "어스앵커 하중계는 정착장 내부에 설치하나요?",
          "a": "아닙니다. 일반적으로 굴착측에 노출된 앵커 두부의 반력판, 하중계, 앵커헤드 구성부에 설치합니다."
        },
        {
          "q": "지하수위계와 간극수압계는 어떻게 구분하나요?",
          "a": "지하수위계는 관측공 내 수위 변화를 확인하고, 간극수압계는 특정 심도에서 수압 또는 수두 변화를 측정합니다."
        },
        {
          "q": "벽체 변위가 증가하면 어떤 센서를 함께 봐야 하나요?",
          "a": "지중경사계와 함께 하중계, 토압계, 지하수위계, 간극수압계, 침하계, 인접 건물 균열·경사 자료를 같은 시간축에서 비교해야 합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        {
          "id": "IMG-002",
          "caption": "흙막이 계측 대표 단면도 — 11종 계측기 통합 배치",
          "figureNo": 2
        },
        {
          "id": "IMG-062",
          "caption": "지하수위·간극수압 상세 — 관측공·천공 구분",
          "figureNo": 3
        }
      ],
      "installation": [
        {
          "id": "IMG-003",
          "caption": "버팀보 하중계 — 띠장 접합부(끝단) 축압축",
          "figureNo": 4
        },
        {
          "id": "IMG-004",
          "caption": "어스앵커 하중계 — 굴착측 앵커 두부",
          "figureNo": 5
        },
        {
          "id": "IMG-005",
          "caption": "인접 건물 — 균열계·구조물경사계 배치",
          "figureNo": 6
        }
      ],
      "data": {
        "id": "IMG-062",
        "caption": "수위·간극수압 데이터 해석 참고",
        "figureNo": 7
      }
    },
    "metaDescription": "흙막이 벽체의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.1",
        "label": "가시설·굴착 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측·관리"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/retaining-excavation/strut": {
    "id": "fields/retaining-excavation/strut",
    "title": "버팀보",
    "sections": {
      "overview": "<p><strong>버팀보</strong> 계측은 가시설 굴착에서 수평 지지력을 담당하는 버팀보(띠장·스트럿)에 작용하는 축력을 <strong>하중계</strong>로 측정하여 지보재 부담과 설계 가정을 검증합니다. 굴착이 진행되면 배면 지반 변위 증가에 따라 버팀보 축력이 변하며, 설치 직후 프리로드·온도·지지 조건의 영향도 받습니다.</p><p>중간부·단부에 <strong>하중계</strong>를 설치해 축력 시간 이력을 확보하고, 필요 시 <strong>변형률계</strong>로 보재 응력을 보완합니다. 버팀보 하중 증가와 <strong>지중경사계</strong> 변위 증가가 동시에 나타나면 배면 토압·지보재 부담 증가를 의심합니다. 하중 감소·이탈은 지지 실패·접촉 불량 징후일 수 있어 즉시 확인이 필요합니다.</p><p>버팀보 하중계 데이터는 Excel·원격계측 대시보드에서 굴착 단계·버팀보 설치·해체 이벤트와 함께 표시하면 해석 효율이 높아집니다. 설계 축력 대비 실측이 지속적으로 높으면 띠장·벽체 변형·지반 조건을 재검토하고, 온도 보정 후에도 비정상 패턴이면 센서·접촉 상태를 점검합니다. 중간부·단부 하중계를 함께 두면 편심 하중·불균형 지지도 평가할 수 있어 대형 굴착에서 유용합니다.</p>",
      "purpose": [
        {
          "title": "축력 모니터링",
          "body": "<strong>하중계</strong>로 버팀보 축력 변화를 실시간·정기 추적합니다."
        },
        {
          "title": "설계 검증",
          "body": "설계 축력·지지력 대비 실측 부담을 비교합니다."
        },
        {
          "title": "이상 징후",
          "body": "급격한 하중 증감·한쪽 편심을 조기에 포착합니다."
        }
      ],
      "principle": "<p>버팀보는 압축 축부재로 굴착면 쪽 토압을 띠장·벽체를 통해 지지합니다. 하중계는 저항 변화를 축력으로 환산합니다. 온도에 따른 축력 변화, 프리로드 손실, 중간 지지점 강성 차이를 해석 시 고려합니다.</p>",
      "installation": [
        "설계도에 따른 중간부 · 단부 하중계 위치 확정",
        "버팀보 설치 전 · 후 하중계 장착 절차를 시공 순서에 반영",
        "케이블 보호 · 방청 · 고정을 · 데이터로거를 연결",
        "설치 직후 및 안정 후 초기 축력을 여러 회 측정",
        "굴착 단계 · 버팀보 설치 · 해체 이력과 데이터 연동",
        "자동계측 시 경보 한계치를 관리기준 기준 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "버팀보 설치",
            "하중계 초기 축력",
            "프리로드 · 접촉 상태"
          ],
          [
            "굴착 심화",
            "축력 · 지중경사",
            "배면 토압 · 변위 연계"
          ],
          [
            "지보 보강",
            "축력 변화",
            "설계 대비 부담"
          ],
          [
            "하부 굴착",
            "축력 · 변위",
            "지지 조건 변화"
          ],
          [
            "해체 전",
            "축력 감소",
            "이탈 · 접촉 상실"
          ]
        ]
      },
      "data": {
        "headers": [
          "패턴",
          "연계",
          "판단"
        ],
        "rows": [
          [
            "축력 점진 증가",
            "지중경사계 변위",
            "배면 토압 · 굴착 심도"
          ],
          [
            "축력 급감",
            "변위 · 소음",
            "이탈 · 파손 · 접촉 상실"
          ],
          [
            "온도 주기 변동",
            "기온",
            "정상 열축력 vs 이상"
          ],
          [
            "좌우 비대칭",
            "지반 · 지지",
            "편심 · 불균형 하중"
          ]
        ]
      },
      "criteria": "<p>관리기준은 설계도서, 계측관리계획서, 발주처 기준, 인접 구조물 민감도, <strong>굴착심도</strong>에 따라 현장별로 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>를 기준으로 하며, 초과 시 원인분석·시공 조정·작업 중지를 검토하는 관리 단계를 운영할 수 있습니다. 변위속도·복수 센서 동시 변화가 단순 절대값보다 중요합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "하중계는 어디에 설치하나요?",
          "a": "축력 변화가 크고 대표적인 중간 스팬·단부에 설치합니다. 설계·시공도와 협의해 위치를 정합니다."
        },
        {
          "q": "야간 축력이 변하는 이유는?",
          "a": "온도 변화에 따른 보재 열팽창·수축이 흔한 원인입니다. 계절·일교차 패턴과 비교합니다."
        },
        {
          "q": "축력이 설계치를 지속 초과하면?",
          "a": "지중경사계 변위·토압·굴착 심도를 함께 검토하고, 지보 보강·굴착 속도 조정을 계측관리계획서에 따라 검토합니다."
        },
        {
          "q": "버팀보 해체 시점은 어떻게 판단하나요?",
          "a": "하부 굴착 완료·축력 감소·배면 변위 안정화를 확인한 뒤 설계·시공 순서에 따라 해체합니다. 해체 전후 계측을 강화합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "버팀보의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.1",
        "label": "가시설·굴착 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측·관리"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/retaining-excavation/anchor": {
    "id": "fields/retaining-excavation/anchor",
    "title": "어스앵커",
    "sections": {
      "overview": "<p><strong>어스앵커</strong> 계측은 인장형 지보재인 앵커의 인장력(축력)을 <strong>로드셀</strong>(KDS 표 4.1-1) 또는 <strong>하중계</strong>로 측정하여 지반 정착·지보 효과를 확인합니다. 앵커는 자유장·정착장·두부 정착구로 구성되며, 프리스트레스 인장 후 지반과 지보재를 연결합니다.</p><p>두부 <strong>로드셀</strong>·<strong>하중계</strong>로 잔류 축력·시간에 따른 힘 손실(lock-off loss)을 추적합니다. 축력 감소는 정착부 이완·지반 크리프, 급증은 굴착·변위에 따른 부담 증가를 시사합니다. 버팀보·흙막이 벽체 변위와 함께 해석해야 원인 판단이 가능합니다.</p><p>앵커 축력은 인장 직후·lock-off 직후·7일·14일·굴착 단계별로 기록하는 것이 일반적입니다. 잔류 축력이 설계 인장력 대비 현저히 낮으면 정착장 그라우팅·지반 강도·자유장 길이를 조사하고, 인접 앵커와 비교해 국부 이상 여부를 판단합니다. 버팀보와 앵커를 병용하는 혼합 지보에서는 하중 분담 변화도 함께 검토해야 합니다.</p>",
      "purpose": [
        {
          "title": "잔류 축력",
          "body": "프리스트레스 후 잔류 <strong>로드셀</strong>·<strong>하중계</strong> 값이 설계 범위인지 확인합니다."
        },
        {
          "title": "시간 의존",
          "body": "축력 손실 속도로 정착·지반 거동을 평가합니다."
        },
        {
          "title": "지보 연계",
          "body": "벽체 변위·굴착 단계와 앵커 부담 변화를 연계합니다."
        }
      ],
      "principle": "<p>앵커 축력은 프리로드와 외부 변위에 의해 변합니다. <strong>로드셀</strong>·하중계는 <strong>굴착측에 노출된 두부</strong>에서 인장력을 직접 측정합니다. KDS 기준 조립 순서는 지지링·반력판→로드셀(하중계)→앵커헤드이며, 강연선은 센서 중심을 관통합니다. 그라우팅 품질·정착장 길이·지반 강도가 장기 축력 유지에 영향을 줍니다.</p>",
      "installation": [
        "설계 앵커별 하중계 설치 여부 · 위치 확정",
        "인장 전 브라켓에 하부 플레이트–하중계–상부 플레이트–앵커 콘 순으로 설치하고, 앵커 축과 하중계가 수직이 되도록",
        "하중계 · 앵커헤드 · 강연선이 굴착측에서 노출되도록 두부를 정리 · 계측케이블을 보호",
        "인장 · 잠금(lock-off) 직후 초기 축력 기록",
        "두부 · 정착구 · 케이블 보호 상태를 점검",
        "정기 계측 일정에 앵커 축력 측정을 포함",
        "축력 급변 시 현장 육안 · 지반조건을 함께 확인",
        "자동화 시 데이터로거 · 경보 연동 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "인장 · lock-off",
            "로드셀 초기 축력",
            "설계 인장력 대비"
          ],
          [
            "굴착 진행",
            "잔류 축력 · 벽체 변위",
            "축력 손실 추세"
          ],
          [
            "지보 전환",
            "앵커 · 버팀보",
            "하중 분담 변화"
          ],
          [
            "정기 계측",
            "잔류 축력",
            "정착 · 크리프"
          ],
          [
            "이상 시",
            "축력 급변",
            "재인장 · 보강 검토"
          ]
        ]
      },
      "data": {
        "headers": [
          "현상",
          "가능 원인",
          "대응"
        ],
        "rows": [
          [
            "축력 점진 감소",
            "정착 이완 · 크리프",
            "재인장 · 보강 검토"
          ],
          [
            "축력 급증",
            "굴착 · 변위 증가",
            "지보 · 굴착 속도 조정"
          ],
          [
            "앵커 간 편차",
            "지반 불균질",
            "보강 · 배치 재검토"
          ],
          [
            "초기 대비 큰 손실",
            "그라우팅 · 정착",
            "시공 품질 조사"
          ]
        ]
      },
      "criteria": "<p>관리기준은 설계도서, 계측관리계획서, 발주처 기준, 인접 구조물 민감도, <strong>굴착심도</strong>에 따라 현장별로 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>를 기준으로 하며, 초과 시 원인분석·시공 조정·작업 중지를 검토하는 관리 단계를 운영할 수 있습니다. 변위속도·복수 센서 동시 변화가 단순 절대값보다 중요합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "모든 앵커에 하중계가 필요한가요?",
          "a": "대표 앵커·고부담 앵커·민감 구간에 우선 설치합니다. 계측관리계획서에 따라 확대합니다."
        },
        {
          "q": "lock-off 손실은 어느 정도까지 허용되나요?",
          "a": "설계·발주처 기준에 따릅니다. 추세가 지속되면 정착·지반 조건을 조사합니다."
        },
        {
          "q": "재인장이 필요한 경우는?",
          "a": "잔류 축력이 설계 범위를 벗어나거나 lock-off 손실이 지속될 때입니다. 그라우팅·정착 상태를 조사한 뒤 재인장·보강을 검토합니다."
        },
        {
          "q": "버팀보와 앵커를 함께 볼 때 주의점은?",
          "a": "굴착 단계에 따라 하중 분담이 바뀝니다. 앵커 축력 증가와 벽체 변위·버팀보 축력을 동일 시간축에서 비교합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "어스앵커의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.1",
        "label": "가시설·굴착 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측·관리"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/retaining-excavation/adjacent-building": {
    "id": "fields/retaining-excavation/adjacent-building",
    "title": "주변건물",
    "sections": {
      "overview": "<p><strong>주변건물</strong> 계측은 굴착·터널·성토 등 인접 공사가 기존 건축물에 미치는 영향을 <strong>균열계</strong>, <strong>구조물경사계</strong>, <strong>자동광파기</strong>로 정량 관리합니다. 건물은 기초 형식·구조·노후도에 따라 민감도가 크게 다릅니다.</p><p>사전 조사로 균열·경사·변위 기준 상태를 기록하고, 공사 중 변화량을 추적합니다. 균열 폭 증가·건물 경사·절대 변위가 동시에 진행되면 즉시 원인 분석·공법 조정이 필요합니다. 온도·계절에 따른 정상 변동과 구분하는 것이 해석의 출발점입니다.</p><p>인접 건물 계측은 사전·공사 중·공사 후 3단계로 계획하며, 민감 건물은 계측 빈도를 일 1회 이상으로 설정하기도 합니다. 균열·경사·총변위가 동시에 증가하면 지반 수평변위·차등 침하를 의심하고, 단일 센서만 증가하면 센서·온도·설치 상태를 우선 점검합니다. 보고서에는 위치 도면·사진·초기 대비 변화량 표를 포함하는 것이 분쟁 예방에 도움이 됩니다.</p>",
      "purpose": [
        {
          "title": "균열 감시",
          "body": "<strong>균열계</strong>로 대표 균열 폭 변화 추적"
        },
        {
          "title": "경사 · 기울기",
          "body": "<strong>구조물경사계</strong>로 건물 회전·부등침하 확인"
        },
        {
          "title": "절대 변위",
          "body": "<strong>자동광파기</strong>로 3차원 변위를 고빈도 측정합니다."
        }
      ],
      "principle": "<p>인접 건물 영향은 지반 침하·수평변위가 기초를 통해 구조물로 전달되는 과정입니다. 균열은 인장·전단 응력 집중, 경사는 부등침하·회전, 총변위는 전체 이동량을 나타냅니다.</p>",
      "installation": [
        "영향 평가 결과 기준 계측 대상 건물 · 측점 선정",
        "기존 균열에 균열계를 설치 · 위치 사진 · 도면 기록",
        "건물 모서리 · 기둥에 구조물경사계를 수직 · 수평 배치",
        "옥상 · 외벽에 자동광파기 반사판을 설치 · 기준망 구축",
        "공사 전 충분한 사전 계측으로 초기치를 안정화",
        "민감 구간은 원격계측 · 실시간 경보 적용"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "사전조사",
            "균열 · 경사 · 변위",
            "초기치 · 사진 · 도면 기록"
          ],
          [
            "착공 · 얕은 굴착",
            "균열계 · 구조물경사계",
            "온도 변동 vs 단방향 증가"
          ],
          [
            "심층 · 양수",
            "광파 · 경사 · 균열",
            "부등침하 · 총변위 속도"
          ],
          [
            "이상 징후",
            "복합 센서",
            "공정 중지 · 협의 절차"
          ],
          [
            "준공 후",
            "잔류 추세",
            "사후 모니터링 · 해제 기준"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "센서",
          "조치"
        ],
        "rows": [
          [
            "균열 폭 증가",
            "균열계",
            "굴착 · 양수 · 공법 검토"
          ],
          [
            "경사 증가",
            "구조물경사계",
            "부등침하 · 지반 변위"
          ],
          [
            "총변위 증가",
            "자동광파기",
            "거리 · 굴착 단계 상관"
          ],
          [
            "복수 징후 동시",
            "복합",
            "긴급 협의 · 공정 조정"
          ]
        ]
      },
      "criteria": "<p>관리기준은 설계도서, 계측관리계획서, 발주처 기준, 인접 구조물 민감도, <strong>굴착심도</strong>에 따라 현장별로 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>를 기준으로 하며, 초과 시 원인분석·시공 조정·작업 중지를 검토하는 관리 단계를 운영할 수 있습니다. 변위속도·복수 센서 동시 변화가 단순 절대값보다 중요합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "건물이 많을 때 우선순위는?",
          "a": "거리·기초 형식·노후·용도(병원·학교 등)를 반영해 위험도 순으로 계측 대상을 선정합니다."
        },
        {
          "q": "온도로 균열이 변하는데?",
          "a": "온도 보정·일교차 패턴을 기록하고, 지속적인 단방향 증가만 이상으로 판단합니다."
        },
        {
          "q": "사전 조사는 얼마나 해야 하나요?",
          "a": "초기치 안정을 위해 수주~수개월 사전 계측이 일반적입니다. 민감 건물은 기간·빈도를 늘립니다."
        },
        {
          "q": "관리기준 초과 시 절차는?",
          "a": "공사 중지·원인 분석·보강·이해관계자 협의를 계측관리계획서·협약에 따라 진행합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "주변건물의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.1",
        "label": "가시설·굴착 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측·관리"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/retaining-excavation/surrounding-ground": {
    "id": "fields/retaining-excavation/surrounding-ground",
    "title": "주변지반",
    "sections": {
      "overview": "<p><strong>주변지반</strong> 계측은 굴착·성토 영향권 내 지반의 침하·수평변위·간극수압 변화를 확인합니다. 흙막이 배면 변위와 지표·지중 변위는 연속체이므로 <strong>지중경사계</strong>, <strong>침하계</strong>, <strong>간극수압계</strong>를 굴착 경계에서 일정 거리마다 배치합니다.</p><p>양수에 따른 지하수위 저하가 원거리 침하를 유발할 수 있어 <strong>지하수위계</strong>와 침하 데이터를 연계합니다. 주변 도로·상하수도·지하매설물에 대한 영향 평가의 핵심 자료가 됩니다.</p><p>주변지반 계측 단면은 굴착선에 수직하는 단면과 평행하는 단면을 함께 두면 3차원 거동 파악에 유리합니다. 양수에 따른 원거리 침하는 지하수위계·침하계 상관으로 조기에 감지할 수 있으며, 상하수도·전력 구간 인접 시 해당 관리 주체와 계측 데이터를 공유합니다. 영향권 밖 기준점은 자동광파기·GNSS로 보완해 절대 변위 추세를 확인합니다.</p>",
      "purpose": [
        {
          "title": "수평변위",
          "body": "배면·측방 <strong>지중경사계</strong>로 지반 이동 추적"
        },
        {
          "title": "침하",
          "body": "<strong>침하계</strong>로 지표·층별 침하 확인"
        },
        {
          "title": "수압",
          "body": "<strong>간극수압계</strong>·<strong>지하수위계</strong>로 수리 조건 변화를 분석합니다."
        }
      ],
      "principle": "<p>굴착은 배면 토압 재분배·응력 해제·양수로 인한 유효응력 변화를 일으킵니다. 영향권은 지반 종류·굴착 깊이·지하수 조건에 따라 달라지며, 변위는 거리에 따라 감쇠하는 경향이 있습니다.</p>",
      "installation": [
        "영향권 예측 단면에 계측 공 배치",
        "굴착선으로부터 단계별 거리(예: H, 2H)에 측점을 둡니다",
        "지중경사계 · 침하계 · 간극수압계를 동일 단면에 집중 배치",
        "양수정 · 배수 구간에 지하수위계를 추가",
        "굴착 · 양수 이력과 계측 일시를 동기화",
        "원거리 기준점으로 자동광파기 보완 검토"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "착공 전",
            "지중 · 침하 · 수압",
            "초기치 · 영향권 단면 확정"
          ],
          [
            "얕은 굴착",
            "지표침하 · 수위",
            "근거리(H) 반응"
          ],
          [
            "심층 굴착",
            "지중경사 · 간극수압",
            "변위 집중 · 감쇠 패턴"
          ],
          [
            "양수 · 배수",
            "원거리 침하",
            "수위-침하 시간 상관"
          ],
          [
            "준공 · 되메우기",
            "전 항목",
            "잔류 변위 · 매설물 · 민원"
          ]
        ]
      },
      "data": {
        "headers": [
          "거리",
          "관심량",
          "해석"
        ],
        "rows": [
          [
            "근거리",
            "수평 · 수직 변위",
            "굴착 직접 영향"
          ],
          [
            "중거리",
            "침하 · 수위",
            "양수 · 응력 해제"
          ],
          [
            "원거리",
            "침하 추세",
            "누적 · 민원 연계"
          ],
          [
            "간극수압",
            "층별 수압",
            "안정 · 배수 검토"
          ]
        ]
      },
      "criteria": "<p>관리기준은 설계도서, 계측관리계획서, 발주처 기준, 인접 구조물 민감도, <strong>굴착심도</strong>에 따라 현장별로 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>를 기준으로 하며, 초과 시 원인분석·시공 조정·작업 중지를 검토하는 관리 단계를 운영할 수 있습니다. 변위속도·복수 센서 동시 변화가 단순 절대값보다 중요합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "주변지반 계측 공은 몇 개?",
          "a": "영향 평가·단면 수에 따륅니다. 최소 1~2개 대표 단면에 복수 센서를 집중 배치하는 것이 일반적입니다."
        },
        {
          "q": "침하만 있고 수평변위가 없으면?",
          "a": "양수·응력 해제에 의한 수직 변형일 수 있습니다. 수위·간극수압과 함께 봅니다."
        },
        {
          "q": "영향권 거리는 어떻게 정하나요?",
          "a": "굴착 심도·지반조건·인접 시설물 민감도를 반영해 계측관리계획서·영향 평가에서 확정합니다."
        },
        {
          "q": "양수 시 원거리 침하가 나타나면?",
          "a": "지하수위 저하에 따른 압밀·응력 재분배일 수 있습니다. 수위계·침하계 상관으로 조기에 감지합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.1 — 가시설·굴착 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측·관리 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-025"
      ],
      "installation": [
        "IMG-096",
        "IMG-027",
        "IMG-032",
        "IMG-030",
        "IMG-031"
      ],
      "data": [
        "IMG-050"
      ]
    },
    "heroCaption": "굴착 영향권 주변지반 — 지중경사계 설치·침하·간극수압 연계",
    "metaDescription": "주변지반의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.1",
        "label": "가시설·굴착 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측·관리"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/surface-subsidence": {
    "id": "fields/tunnel/surface-subsidence",
    "title": "지표·지중침하",
    "sections": {
      "overview": "<p><strong>지표·지중침하</strong>는 터널 굴착에 따른 상부 지반의 연직 변위를 지상·지중에서 측정하는 항목입니다(KDS 4.1.5.2①). 토피가 터널 직경의 3배 이내이거나, 지표상에 연직 변위 피해를 입을 구조물이 있으면 계측을 실시합니다.</p><p><strong>침하계</strong>·<strong>지중경사계</strong>·<strong>자동광파기</strong>로 지표침하·지중침하를 추적하며, 천단침하·내공변위와 동일 단면·시간축에서 비교합니다. 횡단 침하곡선 작성을 위해 터널 하부 좌우 모서리 45° 범위 내 5~10 m 간격 측정을 계획합니다.</p><p>지표·지중침하 단면은 터널 축선 상부·변곡부와 영향권 측방에 배치합니다. 횡단 침하곡선은 터널 하부 좌우 45° 범위 내 측점으로 작성하며, 천단침하·내공변위와 동일 단면에서 통합 검토합니다. 영향권 <strong>지중경사계</strong>·<strong>구조물경사계</strong>·<strong>진동계</strong>와 연계하면 관리대상물·발파 영향을 함께 판단할 수 있습니다. 강우·양수 이벤트는 일지에 기록해 침하 가속과 연계합니다.</p>",
      "purpose": [
        {
          "title": "지표 안전",
          "body": "도로·건물·철도 등 관리대상물의 연직 영향 확인"
        },
        {
          "title": "천단 연계",
          "body": "천단침하·지표침하 상대비교로 터널 상부 거동을 해석합니다."
        },
        {
          "title": "공정 제어",
          "body": "침하 속도·비대칭에 따라 굴착·지보를 조정합니다."
        }
      ],
      "principle": "<p>터널 굴착은 상부 토피·지층에 연직·수평 응력 재분배를 일으킵니다. 지표침하는 연직 변위, 지중침하는 심도별 연직 변형을 나타냅니다. KDS에 따라 토피 두께·지상시설물 유무로 계측 범위를 가감할 수 있습니다.</p>",
      "installation": [
        "토피 · 지상시설물 조건 기준 지표 · 지중침하 단면 선정",
        "터널 축선 상부 · 변곡부에 침하계 · 기준점 설치",
        "영향권에 지중경사계 · 지중침하 측점을 보완 배치",
        "천단침하 · 내공변위와 동일 단면에서 통합 계측",
        "강우 · 양수 · 굴착 이벤트와 시간 동기화",
        "자동광파기로 지표 절대 변위를 보조 확인"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "굴착 전",
            "지표 · 지중 초기치",
            "관리대상물 사전조사"
          ],
          [
            "상부 굴착",
            "지표침하 · 지중침하",
            "횡단 침하곡선 · 천단 연계"
          ],
          [
            "변곡 · 막장",
            "지표 · 지중 · 천단",
            "비대칭 · 가속 여부"
          ],
          [
            "강우 · 양수",
            "침하 · 지하수위",
            "이벤트 연동 해석"
          ],
          [
            "굴착 완료",
            "지표 · 천단 비교",
            "잔류 침하 · 모니터링 계획"
          ]
        ]
      },
      "data": {
        "headers": [
          "구간",
          "계측기",
          "해석"
        ],
        "rows": [
          [
            "지표",
            "침하계, 자동광파기",
            "연직 침하 · 횡단 곡선"
          ],
          [
            "지중",
            "지중경사계, 침하계",
            "심도별 연직 변형"
          ],
          [
            "천단 연계",
            "천단 측점",
            "상대비교"
          ],
          [
            "민감 구조물",
            "다중 측점",
            "관리대상물 영향"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "토피가 두꺼우면 생략할 수 있나요?",
          "a": "토피가 직경 3배 이상이어도 지표상 피해 구조물이 있으면 계측이 필요합니다(KDS 4.1.5.2①②)."
        },
        {
          "q": "지표침하와 천단침하 차이는?",
          "a": "지표침하는 지표 연직 변위, 천단침하는 터널 천단부 연직 변위(천단 측점·기준점 대비 측량)입니다. 함께 비교합니다."
        },
        {
          "q": "지표만 계측해도 되나요?",
          "a": "토피·지상시설물 조건에 따라 지중경사계·지중침하 측점을 보완합니다. 계측관리계획서 범위를 따릅니다."
        },
        {
          "q": "횡단 침하곡선 측점 간격은?",
          "a": "터널 하부 좌우 45° 범위 내 5~10 m 간격을 계획하며, 천단·내공과 동일 단면에서 통합합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": [
        "IMG-010"
      ],
      "data": [
        "IMG-050"
      ]
    },
    "heroCaption": "터널 지표·지중침하 계측 — 상부 침하계·지중경사계·자동광파기 배치",
    "metaDescription": "지표·지중침하의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/crown-settlement": {
    "id": "fields/tunnel/crown-settlement",
    "title": "천단침하",
    "sections": {
      "overview": "<p><strong>천단침하</strong>는 터널 천단부의 <strong>연직 침하</strong>를 측정하는 항목입니다(KDS 4.1.5.2②). 굴착에 따른 상부 지반·토피 하중 재분배로 천단이 하향 변형하며, 과도한 침하는 지표 균열·상부 <strong>관리대상물</strong>·도로·철도 안전과 직결됩니다.</p><p>천단부에 설치한 <strong>천단침하 측점</strong>(<strong>프리즘</strong>·타깃)의 표고 변화를 <strong>자동광파기</strong>·수준으로 기준점 대비 측정합니다. 외부 수준점은 수준측량 네트워크 <strong>기준(BM)</strong>으로 활용하되 천단과 물리적 와이어로 연결하지 않습니다. <strong>지표침하</strong>와 비교·<strong>내공변위</strong>와 동일 단면 통합 해석합니다.</p><p>천단침하 측점은 막장 전방·변곡부·지표 민감 구간에 우선 배치합니다. <strong>막장거리</strong>별 침하량을 그래프로 정리하면 지보 패턴 조정 근거가 되며, 시간 이력이 <strong>설계예상변위</strong>·이론 곡선에서 벗어나면 지반등급 재평가·지보 보강을 검토합니다. 터널 내 <strong>자동광파기</strong>·수준 측량과 지표침하 연계로 관리대상물 영향을 mm 단위로 관리합니다.</p>",
      "purpose": [
        {
          "title": "지표 안전",
          "body": "상부 도로·건물·철도 등 관리대상물 영향을 조기에 파악합니다."
        },
        {
          "title": "지보 검증",
          "body": "숏크리트·록볼트 효과를 침하 추세로 평가합니다."
        },
        {
          "title": "공정 제어",
          "body": "침하 속도에 따라 굴착·지보 순서를 조정합니다."
        }
      ],
      "principle": "<p>천단침하는 터널 <strong>천단부 측점</strong>의 <strong>연직 변위</strong>이며, <strong>내공변위</strong>(벽면·단면 변형)·<strong>지표침하</strong>·<strong>지중침하</strong>와 구분합니다. 측점은 터널 축선 상부·변곡부에 배치하며, 내공변위·천단침하 측점은 <strong>동일 단면</strong>에 설치합니다.</p>",
      "installation": [
        "막장 전방 · 변곡부 · 지표 민감 구간 대표 단면 선정",
        "천단부에 천단침하 측점(프리즘 · 타깃) 설치(여굴 · 록볼트 손상 방지)",
        "터널 내 자동광파기 · 수준으로 기준점 대비 천단 표고 변화를 측정",
        "외부 수준점은 수준측량 기준으로 활용하되, 천단과 와이어로 연결하지 않",
        "실링 숏크리트 후 측점을 설치하고, 다음 굴착 전 초기치 확정(KCS 3.5.3)",
        "내공변위 · 지표침하와 동일 단면 · 시간축에서 통합 검토"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "실링 직후",
            "천단 측점 초기치",
            "기준점 · 안정화"
          ],
          [
            "굴착 진행",
            "천단침하, 내공변위",
            "변위속도 · 막장거리 연계"
          ],
          [
            "지보재 설치",
            "천단 · 록볼트",
            "수렴 추세"
          ],
          [
            "막장 근접",
            "천단 · 지표침하",
            "관리기준 · 보강 검토"
          ],
          [
            "굴착 완료",
            "천단 · 지표 비교",
            "잔류 침하 · 후속 모니터링"
          ]
        ]
      },
      "data": {
        "headers": [
          "단계",
          "침하 패턴",
          "판단"
        ],
        "rows": [
          [
            "굴착 직후",
            "급증",
            "설계예상변위 대비"
          ],
          [
            "24~72시간",
            "감속",
            "변위 안정화 추세"
          ],
          [
            "장기",
            "잔류 증가",
            "최대허용변위 · 지반 검토"
          ],
          [
            "지표 연계",
            "지표침하 비교",
            "관리대상물 영향"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "천단침하 허용값은?",
          "a": "설계예상변위·최대허용변위는 계측관리계획서·상부 시설물 민감도에 따라 정합니다."
        },
        {
          "q": "내공변위와 천단침하 차이는?",
          "a": "내공변위는 터널 벽면·단면 변형, 천단침하는 천단부 연직 침하입니다. 동일 단면에서 함께 해석합니다."
        },
        {
          "q": "한쪽만 침하하면?",
          "a": "비대칭 굴착·지반 불균질·편압 가능성을 검토합니다."
        },
        {
          "q": "외부 수준점을 천단에 연결?",
          "a": "아닙니다. 외부 BM은 수준 네트워크 기준이며, 천단과 와이어로 물리 연결하지 않습니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        {
          "id": "IMG-061",
          "caption": "터널 천단 측점·자동광파기 측량 — 내공변위와 별도 항목",
          "figureNo": 2
        }
      ],
      "data": [
        "IMG-050"
      ]
    },
    "metaDescription": "천단침하의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/convergence": {
    "id": "fields/tunnel/convergence",
    "title": "내공변위",
    "sections": {
      "overview": "<p><strong>내공변위</strong>는 굴착에 따른 <strong>터널 벽면</strong>의 변위를 측정하는 항목입니다(KDS 4.1.5.2①). 단면의 수평·수직 변형으로 터널 거동을 파악하며, 과도한 내공변위는 라이닝 균열·천단침하 악화를 유발할 수 있습니다.</p><p>대표 Figure는 전단면에 <strong>내공변위계 11점(P1~P11)</strong>을 두고, <strong>수평·수직·대각 대표 측선</strong>과 <strong>기준 측정선</strong> 대비 초기·현재 형상을 비교합니다. <strong>자동광파기</strong>·테이프 익스텐소미터 등 현장 방식을 병행할 수 있습니다. <strong>하단 노반(도로·철도)</strong>은 통행·궤도 구간으로 <strong>「노반 Open · 미계측」</strong>이며, 라이닝을 따라 연속 센서 튜브만으로 전단면을 대표하는 표현은 사용하지 않습니다.</p><p><strong>내공변위계</strong> 데이터는 MUX·데이터로거를 통해 자동 수집되며, <strong>상부 아치</strong> 전단면 프로파일 그래프에서 초기 형상 대비 현재 형상 변화를 시각화합니다. 지보 설치 전·후 프로파일 비교로 지보 효과를 정량화하고, 온도 보정 후 ΔX·ΔY 추세를 <strong>최대허용변위</strong>와 비교합니다. 막장 근처 고빈도 계측은 NATM 관찰시공에 적합합니다.</p>",
      "purpose": [
        {
          "title": "측점 · 측선",
          "body": "P1~P11 내공변위계와 대표 측선(수평·수직·대각)으로 전단면 변형 추적 노반은 Open·미계측."
        },
        {
          "title": "건축한계",
          "body": "통행·궤도 구간(건축한계 Envelope) 내부에는 측점·센서를 두지 않습니다."
        },
        {
          "title": "천단침하 구분",
          "body": "천단 연직 침하는 천단 측점·기준점 대비 별도 항목입니다."
        },
        {
          "title": "통합 모니터링",
          "body": "원격계측으로 측점별 추세·관리기준·경보 확인"
        }
      ],
      "principle": "<p>내공변위는 <strong>측점 좌표 변화</strong> 또는 <strong>측점 간 거리 변화</strong>로 확인합니다. 좌·우 측벽·스프링라인·궁부에 배치한 <strong>P1~P11 내공변위계</strong>에서 초기 형상과 현재 형상을 비교하고, 하부 노반과 가상 폐합(Closed Loop)을 가정하지 않습니다. <strong>자동광파기</strong> 시준·거리 측정, 테이프 익스텐소미터, 내장 변위 센서 등 설계·현장 조건에 맞는 방식을 선택합니다.</p><p>신호는 데이터로거·원격계측으로 수집하며, 발파·장비 진동 구간은 정적 변위 추출·이벤트 분리로 해석합니다. 온도 보정 후 전단면 프로파일을 갱신하고 <strong>천단침하</strong>·<strong>지중변위</strong>와 동일 단면에서 통합합니다.</p>",
      "installation": [
        "좌 · 우 측벽 · 스프링라인 · 궁부에 내공변위계 P1~P11 배치 (노반 · 건축한계 내부 제외)",
        "프리즘 · 타깃 또는 설계된 내공변위 센서를 라이닝 표면 · 지정 위치에 설치",
        "기준 측정선 · 초기 형상을 확정 · 측점 간 측선 기록",
        "자동광파기 · 로거 · 원격계측과 연동",
        "다음 굴착 전 초기 측정으로 기준 프로파일 확정",
        "내공변위 · 천단침하 · 지중변위와 동일 단면에서 통합 검토"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "실링 직후",
            "내공변위계 초기 프로파일",
            "P1~P11 기준 형상 · 노반 Open"
          ],
          [
            "굴착 진행",
            "ΔX · ΔY · 천단침하",
            "변위속도 · 막장거리 연계"
          ],
          [
            "지보재 설치",
            "아치 프로파일 변화",
            "지보 효과 · 수렴 추세"
          ],
          [
            "막장 근접",
            "내공 · 선행변위",
            "최대허용변위 · 보강 검토"
          ],
          [
            "굴착 완료",
            "전 단면 비교",
            "잔류 변형 · 후속 모니터링"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "산출값",
          "해석"
        ],
        "rows": [
          [
            "X축 변위",
            "ΔX (mm)",
            "측벽 · 궁부 반경방향 이동"
          ],
          [
            "Y축 변위",
            "ΔY (mm)",
            "천단 · 스프링라인 접선방향"
          ],
          [
            "아치 프로파일",
            "초기 vs 현재",
            "P1~P11 — 노반 Open"
          ],
          [
            "정밀도",
            "±1 mm",
            "KCS 내공변위 · 천단 측점"
          ],
          [
            "신호",
            "로거 · 원격",
            "측점별 시계열"
          ],
          [
            "필터",
            "Static 추출",
            "발파 · 장비 진동 제거"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "바닥·노반 변위는 왜 없나요?",
          "a": "도로·철도·인버트가 점유하는 하부는 측점 설치·계측이 불가합니다. P1~P11은 측벽·아치 구간만 측정하며, 프로파일 하부는 「노반 Open · 미계측」입니다."
        },
        {
          "q": "내공변위와 천단침하 차이는?",
          "a": "내공변위는 터널 벽면·단면 변형(측점·측선), 천단침하는 천단부 연직 침하입니다. 동일 단면에서 함께 봅니다."
        },
        {
          "q": "발파·장비 진동은 어떻게 처리하나요?",
          "a": "정적 변위 추출·이벤트 분리로 해석합니다. 급변 구간은 원본을 보존하고 검토합니다."
        },
        {
          "q": "변위가 안정화되지 않으면?",
          "a": "최대허용변위 초과·지속 증가 시 지보 보강·굴착 일시 중지·지반 조사를 검토합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "data": [
        {
          "id": "IMG-049",
          "caption": "변위 시계열·관리기준 — 아치 측점별 추세",
          "figureNo": 3
        },
        {
          "id": "IMG-056",
          "caption": "원격계측 Web 대시보드 — 지도·센서·그래프·이벤트 로그 (현장 운영 UI)",
          "figureNo": 4
        }
      ]
    },
    "heroCaption": "터널 전단면 내공변위 — P1~P11 내공변위계·대표 측선·기준 측정선, 건축한계, 노반 Open",
    "metaDescription": "내공변위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/ground-displacement": {
    "id": "fields/tunnel/ground-displacement",
    "title": "지중변위",
    "sections": {
      "overview": "<p><strong>터널 지중변위</strong>는 두 가지 문맥으로 해석합니다. KDS 4.1.5.2③에 따른 <strong>지중변위계</strong>는 <strong>굴착면 주변 지반</strong>의 심도별 <strong>반경방향 변위</strong>를 측정하여 이완영역을 확인합니다. 영향권·원거리에서는 <strong>지중경사계</strong>·<strong>지표 및 지중침하</strong>로 수평·연직 거동을 보완합니다.</p><p>지중변위·내공변위·천단침하·록볼트·숏크리트는 <strong>동일 단면</strong>에서 종합 분석합니다. 변위는 막장거리에 따라 감쇠하며, 인접 터널·구조물 영향 평가에 필수입니다.</p><p>터널 지중변위 계측은 병렬 터널·상부 구조물이 있는 경우 영향권 중첩을 고려해 측점을 배치합니다. <strong>지중변위계</strong>로 굴착면 주변 반경방향 변위를, <strong>지중경사계</strong>로 영향권 수평 프로파일을 추적하며, 이완영역 경계는 지보·그라우팅 범위 결정에 활용합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 터널 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "이완영역",
          "body": "지중변위계로 굴착면 주변 반경방향 변위·이완 범위를 파악합니다."
        },
        {
          "title": "영향권",
          "body": "지중경사계로 영향권 내 수평변위 프로파일 확인"
        },
        {
          "title": "지보 조정",
          "body": "지중변위 추세로 지보 패턴·그라우팅을 수정합니다."
        }
      ],
      "principle": "<p>터널 굴착은 주변 응력장 재분배를 일으킵니다. 지중변위계는 벽면 천공 다중 측점의 반경방향 변위를, 지중경사계는 심도별 수평변위 프로파일을 제공합니다. 막장전방 선행변위계는 막장 전방 불량구간 사전 인지에 활용합니다.</p>",
      "installation": [
        "내공변위 · 천단침하와 동일 단면에 지중변위계(3~5 측점) 설치",
        "측벽 · 천정부 등 3개소에 심도별 다중 측점 배치",
        "영향권 단면에 지중경사계 · 지표 및 지중침하를 보완 배치",
        "막장 전방 선행변위계를 필요 구간에 설치",
        "굴착 진행 기준 측점을 조정",
        "자동광파기로 지표 변위를 보완"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "굴착 초기",
            "지중변위 · 천단",
            "이완영역 형성"
          ],
          [
            "굴착 진행",
            "지중변위 · 내공",
            "막장거리별 감쇠"
          ],
          [
            "영향권",
            "지중경사 · 침하",
            "인접 터널 · 구조물"
          ],
          [
            "막장 근접",
            "선행변위",
            "전방 불량 · 굴진 속도"
          ],
          [
            "지보 완료",
            "전 항목",
            "잔류 변위 · 안정화"
          ]
        ]
      },
      "data": {
        "headers": [
          "위치",
          "계측기",
          "의미"
        ],
        "rows": [
          [
            "굴착면 주변",
            "지중변위계",
            "반경방향 · 이완영역"
          ],
          [
            "영향권 측방",
            "지중경사계",
            "수평변위 프로파일"
          ],
          [
            "터널 상부",
            "지표 및 지중침하",
            "연직 영향"
          ],
          [
            "막장 전방",
            "선행변위계",
            "전방 지반 침하"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "지중변위계와 지중경사계 차이는?",
          "a": "터널 굴착면 주변 반경방향 변위는 지중변위계, 영향권 수평 프로파일은 지중경사계로 구분합니다(KDS 4.1.5)."
        },
        {
          "q": "터널 두 개 근접 시?",
          "a": "선행·후행 터널 상호 영향을 고려해 양쪽 영향권에 계측을 배치합니다."
        },
        {
          "q": "측점 수는 몇 개가 적당한가요?",
          "a": "굴착면 주변 3~5개가 일반적이며, 지질·단면 크기에 따라 조정합니다."
        },
        {
          "q": "막장전방 선행변위와 차이는?",
          "a": "지중변위계는 굴착된 단면 주변 반경방향 변위, 선행변위는 막장 앞 지반의 사전 침하·변위입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-028"
      ],
      "installation": [
        "IMG-027"
      ],
      "data": [
        "IMG-029"
      ]
    },
    "metaDescription": "지중변위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/rockbolt": {
    "id": "fields/tunnel/rockbolt",
    "title": "록볼트 축력",
    "sections": {
      "overview": "<p><strong>록볼트 축력</strong> 계측은 터널 주변 암반을 고정하는 록볼트의 축력을 <strong>록볼트 축력계</strong>, <strong>변형률계</strong>로 측정합니다. 축력은 지반 이완·굴착 진행·지보 순서에 따라 변하며, 설계 축력 대비 실측값으로 지보 효과를 평가합니다.</p><p>급격한 축력 증가는 암반 수축·이완 진행, 감소는 이탈·파손 징후일 수 있습니다. 숏크리트·천단침하·내공변위와 함께 해석합니다.</p><p>록볼트 축력 분포는 지질 불균질·지보 패턴 적정성을 평가하는 지표입니다. 막장 근처 록볼트는 축력 변화가 크므로 대표 계측 대상으로 선정하고, 숏크리트 응력·천단침하와 시간축에서 비교합니다. 축력 급감 시 즉시 육안·타격 시험으로 이탈 여부를 확인합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 터널 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "축력 확인",
          "body": "설계·시공 록볼트 축력을 검증합니다."
        },
        {
          "title": "지보 적정성",
          "body": "간격·길이·패턴 조정 근거를 제공합니다."
        },
        {
          "title": "안전",
          "body": "이탈·파손을 조기에 감지합니다."
        }
      ],
      "principle": "<p>록볼트는 인장 축력으로 암반 웨지를 고정합니다. 록볼트 축력계는 두부 축력, 변형률계는 보체 변형을 측정합니다.</p>",
      "installation": [
        "대표 록볼트에 록볼트 축력계 · 변형률계 설치",
        "인장 · 잠금 직후 초기 축력 기록",
        "굴착 · 지보 단계별 계측 일정 수립",
        "케이블 · 센서 보호 조치를",
        "축력 이상 시 현장 육안 조사를 병행",
        "데이터를 천단침하 · 내공변위와 통합 관리"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "설치 · 인장",
            "록볼트 축력",
            "초기치 · 잠금"
          ],
          [
            "굴착 진행",
            "축력 · 천단",
            "이완 · 지보 패턴"
          ],
          [
            "추가 지보",
            "축력 변화",
            "간격 · 길이 검증"
          ],
          [
            "이상 시",
            "급감 · 편차",
            "이탈 · 보강"
          ],
          [
            "장기",
            "크리프 추세",
            "재인장 검토"
          ]
        ]
      },
      "data": {
        "headers": [
          "축력 변화",
          "연계",
          "조치"
        ],
        "rows": [
          [
            "점진 증가",
            "굴착 · 이완",
            "정상 범위 확인"
          ],
          [
            "급감",
            "이탈 · 파손",
            "즉시 보강"
          ],
          [
            "편차 큼",
            "지질 불균질",
            "패턴 조정"
          ],
          [
            "장기 감소",
            "크리프",
            "재인장 검토"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "모든 록볼트에 계측하나요?",
          "a": "대표부·불량 지질·고부담부에 우선 설치합니다."
        },
        {
          "q": "축력 0에 가까우면?",
          "a": "센서 오류·이탈·접촉 불량을 구분해 현장 확인합니다."
        },
        {
          "q": "락볼트 축력만 보면 충분한가요?",
          "a": "축력과 함께 천단변위·숏크리트 두께·굴착면 변위를 연계해야 지지 효과를 판단할 수 있습니다."
        },
        {
          "q": "축력이 감소하면?",
          "a": "지반 이완·볼트 손상·계측기 이상을 구분합니다. 급감 시 추가 천공·보강을 검토합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-078"
    },
    "metaDescription": "록볼트 축력의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/shotcrete": {
    "id": "fields/tunnel/shotcrete",
    "title": "숏크리트",
    "sections": {
      "overview": "<p><strong>숏크리트</strong> 계측은 터널 초기 지보인 숏크리트 라이닝의 응력·변형을 <strong>변형률계</strong>, <strong>숏크리트 응력계</strong> 등으로 측정합니다. 숏크리트는 굴착 직후 지반 이완을 제한하며, 과다 응력은 균열·박리, 부족은 내공변위 증가를 유발합니다.</p><p>변형률 시간 이력으로 라이닝 부담을 추정하고, 두께·재령·지보 순서와 연계합니다.</p><p>숏크리트 변형률은 양생 초기·굴착 재개·추가 지보 시점에 민감하게 반응합니다. 설계 두께·강도 대비 응력 수준이 지속적으로 높으면 두께 증가·강도 등급 상향·굴착 속도 조정을 검토합니다. 계측 데이터는 품질 시험(압축강도) 결과와 함께 기록하면 시공 품질 평가에 도움이 됩니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 터널 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "응력 · 변형",
          "body": "라이닝 부담 상태를 정량 확인합니다."
        },
        {
          "title": "지보 설계",
          "body": "두께·강도·시공 순서를 검증합니다."
        },
        {
          "title": "손상 예방",
          "body": "균열·박리 전 응력 집중을 포착합니다."
        }
      ],
      "principle": "<p>숏크리트는 압축 막부재로 굴착면 수축을 제한합니다. 변형률계는 표면·내부 변형률을 측정해 응력을 추정합니다.</p>",
      "installation": [
        "대표 단면에 변형률계를 숏크리트 시공 시 매립",
        "측정 위치 · 방향을 설계와 일치시킵니다",
        "양생 · 재령에 따른 응력 발현 기록",
        "굴착 · 추가 지보와 시간 연동",
        "케이블을 보호 · 데이터로거를 연결",
        "천단침하 · 내공변위 데이터와 함께 검토"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "타설 직후",
            "변형률 · 응력",
            "양생 · 초기 부담"
          ],
          [
            "24~72h",
            "변위 수렴",
            "이완 제한 효과"
          ],
          [
            "추가 굴착",
            "응력 재상승",
            "단계별 부담"
          ],
          [
            "록볼트 · 강지보",
            "연계 응력",
            "지보 순서"
          ],
          [
            "장기",
            "크리프 · 균열",
            "박리 · 보강"
          ]
        ]
      },
      "data": {
        "headers": [
          "응력·변형",
          "시점",
          "해석"
        ],
        "rows": [
          [
            "초기 증가",
            "굴착 직후",
            "이완 제한 효과"
          ],
          [
            "변위 안정화",
            "24~72h",
            "계측값 수렴"
          ],
          [
            "재상승",
            "추가 굴착",
            "단계별 부담"
          ],
          [
            "이상 스파이크",
            "시공 · 충격",
            "품질 점검"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "숏크리트 계측이 항상 필요한가요?",
          "a": "약암·변형 큰 구간·관찰시공 핵심 단면에서 우선 적용합니다."
        },
        {
          "q": "변형률만으로 응력을 알 수 있나요?",
          "a": "탄성계수·단면을 가정해 추정합니다. 정성·정량 비교에 활용합니다."
        },
        {
          "q": "숏크리트 두께 계측은 어디에 하나요?",
          "a": "천단·측벽 대표 단면에 배치하며, 굴착 직후·지보 후 시계열로 기록합니다."
        },
        {
          "q": "두께 부족 징후는?",
          "a": "천단변위 가속·굴착면 떨어짐과 동시에 나타날 수 있어 즉시 보강 두께·배합을 점검합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-079"
    },
    "metaDescription": "숏크리트의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/face-advance": {
    "id": "fields/tunnel/face-advance",
    "title": "막장전방 선행변위",
    "sections": {
      "overview": "<p><strong>막장전방 선행변위</strong>는 터널 굴착면 전방 지반의 침하·변위를 전체변위량 차원에서 관리하는 항목입니다(KDS 4.1.5.2⑥). 막장전방 선행변위계를 터널 전방에 설치하여 파쇄대·공동 등 불량구간 존재 여부를 사전에 인지하고, 굴진 속도·지보를 조정합니다.</p><p>선행변위 급증은 전방 지반 불량·지하수 영향·굴착 과속을 시사할 수 있습니다. 내공변위·천단침하·지중변위와 시간·<strong>막장거리</strong>를 연계해 해석합니다.</p><p>막장전방 선행변위는 굴진 속도·지보 순서 결정의 핵심 입력입니다. 선행변위 급증 시 굴진 중지·물리탐사·시추 등 추가 조사를 연계하고, 내공변위·천단침하 데이터와 시간축에서 비교합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 터널 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "전방 지반",
          "body": "막장 앞 불량구간·침하 정도를 조기에 파악합니다."
        },
        {
          "title": "굴진 제어",
          "body": "선행변위 추세로 굴진 속도·지보 순서를 조정합니다."
        },
        {
          "title": "안전",
          "body": "전방 지반 붕괴·과다 침하 위험을 사전에 관리합니다."
        }
      ],
      "principle": "<p>막장전방 선행변위계는 굴착면 전방 일정 거리에 설치하여 전방 지반의 연직·수평 변위를 통합 관리합니다. KDS에 따라 터널 영향권 내 구조물 안전 판단 시 막장전방 선행변위 측정을 터널계측에 포함할 수 있습니다.</p>",
      "installation": [
        "지반등급 · 지질 조건 기준 막장 전방 대표 단면 선정",
        "막장전방 선행변위계를 설계 간격 · 심도 기준 설치",
        "굴착 진행 기준 측점 위치 · 간격을 조정",
        "내공변위 · 천단침하와 동일 시간축으로 기록",
        "선행변위 급증 시 물리탐사 · 시추 등 추가 조사를 연계",
        "원격계측으로 막장 근접 구간 고빈도 모니터링 적용"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "막장 접근",
            "선행변위",
            "전방 지반 상태"
          ],
          [
            "굴진 중",
            "선행 · 내공 · 천단",
            "막장거리 연계"
          ],
          [
            "불량 의심",
            "급증 · 비대칭",
            "조사 · 굴진 중지"
          ],
          [
            "지보 후",
            "변위 안정",
            "다음 굴진 허용"
          ],
          [
            "통과 후",
            "잔류 추세",
            "측점 이동 · 해제"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "가능 원인",
          "조치"
        ],
        "rows": [
          [
            "급증",
            "전방 불량지반",
            "굴진 중지 · 조사"
          ],
          [
            "지속 증가",
            "지하수 · 약지반",
            "그라우팅 · 지보 보강"
          ],
          [
            "안정화",
            "정상 이완",
            "설계예상변위 대비"
          ],
          [
            "비대칭",
            "편압 · 층리",
            "3차원 계측 검토"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "막장전방 선행변위와 천단침하 차이는?",
          "a": "선행변위는 굴착면 전방 지반의 사전 침하·변위, 천단침하는 이미 굴착된 터널 천단부 연직 변위입니다."
        },
        {
          "q": "모든 터널에 필수인가요?",
          "a": "지반조건·상부 시설물·설계 계획에 따라 선정합니다. 민감 구간·불량 지질에서는 필수에 가깝습니다."
        },
        {
          "q": "굴착면 변위와 천단변위를 같이 봐야 하나요?",
          "a": "천단변위는 전방 지반·지보 상태를, 굴착면 변위는 작업면 안정을 봅니다. 계측관리계획서에 정한 측점을 함께 해석합니다."
        },
        {
          "q": "TBM과 NATM에서 계측 차이는?",
          "a": "TBM은 실링·토압·천단변위 중심, NATM은 굴착면·천단·지보(숏크리트·락볼트) 연계가 핵심입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-040",
        "caption": "변위계 설치 — 막장전방 선행변위계 측정 개념",
        "figureNo": 2
      },
      "data": [
        "IMG-050"
      ]
    },
    "heroImageId": "IMG-063",
    "heroCaption": "막장전방 선행변위계 — 막장 앞 지반 선행변위·굴진 방향·막장거리",
    "metaDescription": "막장전방 선행변위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/steel-support": {
    "id": "fields/tunnel/steel-support",
    "title": "강지보 응력",
    "sections": {
      "overview": "<p><strong>강지보 응력</strong>은 터널 내 강지보(스틸 세트·허리보 등)에 작용하는 축력·변형을 <strong>변형률계</strong>, 하중 측정 센서로 확인하는 항목입니다(KDS 4.1.5.1③). 터널 주변 변위에 수반하여 강지보 부담이 증가하며, 허용응력·설계 축력 대비 실측값으로 지보 적정성을 평가합니다.</p><p>숏크리트·록볼트 축력·내공변위와 동일 단면에서 종합 해석합니다. 응력 급증·비대칭은 지보 부족·부재 손상 징후일 수 있습니다.</p><p>강지보 응력 계측은 변곡부·고부담 단면·스틸 세트 대표부에 우선 적용합니다. 숏크리트·록볼트 축력과 함께 동일 단면 종합 해석하며, 응력 급증 시 스틸 세트 간격·단면 보강을 검토합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 터널 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "축력 · 응력",
          "body": "강지보 부담 상태를 정량 확인합니다."
        },
        {
          "title": "지보 검증",
          "body": "스틸 세트 간격·단면·설치 시점을 검증합니다."
        },
        {
          "title": "안전",
          "body": "과부하·좌굴 전 조기 경보 근거를 제공합니다."
        }
      ],
      "principle": "<p>강지보는 터널 단면 수축을 제한하는 압축·휨 부재입니다. 변형률계는 부재 변형률, 축력계는 축력을 측정해 설계값과 비교합니다. KDS에 따라 노출 지반 상태·초기 계측결과에 따라 설치 간격·위치를 조정할 수 있습니다.</p>",
      "installation": [
        "대표 강지보 · 고부담 단면에 변형률계 · 축력계 설치",
        "설치 직후 · 지보 완료 후 초기값 기록",
        "굴착 · 추가 지보 단계별 계측 일정 수립",
        "숏크리트 · 록볼트 · 내공변위 데이터와 통합",
        "케이블 · 센서 보호 및 방청 조치를",
        "이상 시 육안 · 두께 측정 등 현장 조사를 병행"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "설치 직후",
            "변형률 · 축력",
            "초기치 · 접촉"
          ],
          [
            "굴착 진행",
            "응력 · 내공변위",
            "지보 간격 · 패턴"
          ],
          [
            "추가 지보",
            "응력 재분배",
            "숏크리트 · 록볼트 연계"
          ],
          [
            "이상 시",
            "급증 · 편차",
            "보강 · 교체"
          ],
          [
            "통과 후",
            "잔류 응력",
            "해제 · 이력 보관"
          ]
        ]
      },
      "data": {
        "headers": [
          "현상",
          "연계",
          "조치"
        ],
        "rows": [
          [
            "점진 증가",
            "굴착 · 이완",
            "설계 대비 확인"
          ],
          [
            "급증",
            "내공변위 증가",
            "지보 보강"
          ],
          [
            "편차 큼",
            "비대칭 지반",
            "스틸 세트 조정"
          ],
          [
            "감소 · 이탈",
            "부재 손상",
            "즉시 교체 · 보강"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "숏크리트 응력과 차이는?",
          "a": "숏크리트는 초기 라이닝 막부재 응력, 강지보는 강재 세트·허리보 등 강성 지보재 부담입니다. 함께 해석합니다."
        },
        {
          "q": "모든 스틸 세트에 계측하나요?",
          "a": "대표부·변곡부·고부담 구간에 우선 설치합니다."
        },
        {
          "q": "강지보 하중과 변위 중 무엇이 우선인가요?",
          "a": "둘 다 필수입니다. 하중 급증은 지반압 증가, 변위 증가는 강성 부족·지반 이완 징후입니다."
        },
        {
          "q": "강지보 교체 시 계측은?",
          "a": "교체 전후 하중·변위 기준선을 재설정하고, 단계적 굴착과 연동해 재하력을 확인합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-080",
        "caption": "강지보 응력 계측 — 스틸 세트·변형률계 배치와 록볼트·숏크리트 연계 해석",
        "figureNo": 2
      }
    },
    "heroCaption": "강지보 응력 계측 — 터널 스틸 세트·변형률계 배치 개념",
    "metaDescription": "강지보 응력의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/pier": {
    "id": "fields/bridge/pier",
    "title": "교각",
    "sections": {
      "overview": "<p><strong>교각</strong> 계측은 교량 수직부재인 교각의 경사·변위·변형률을 <strong>구조물경사계</strong>, <strong>변위계</strong>, <strong>변형률계</strong>로 측정합니다. 기초 침하·세굴·지진·온도에 따른 교각 거동은 상부구조 안전과 직결됩니다.</p><p>부등침하·회전 변형은 교각 경사 증가로 나타나며, 장기 추세는 기초·지반 문제를 시사합니다. 사장교 주탑은 <strong>케이블 장력</strong>·<strong>풍하중</strong>과 함께 통합 해석합니다.</p><p>교각 계측은 시공 단계(가설·콘크리트 타설·프리스트레스)별로 기준을 달리 적용합니다. 장기 모니터링에서는 온도·교통 하중 이벤트를 분리해 추세만 추출하는 것이 중요하며, 인접 하천 교각은 세굴·수위 변화와 침하 데이터를 연계합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "경사 · 회전",
          "body": "구조물경사계로 교각 기울기 변화 추적"
        },
        {
          "title": "변위",
          "body": "받침·신축 상대변위(변위계)와 절대 좌표변위(자동광파기·프리즘)를 구분합니다."
        },
        {
          "title": "응력",
          "body": "변형률계로 예상 외 부담 검토"
        }
      ],
      "principle": "<p>교각은 축압·휨·전단을 받습니다. 기초 불균등 침하 시 경사·균열이 동반됩니다.</p>",
      "installation": [
        "교각 상 · 하단에 구조물경사계를 설치 · Δθ로 회전 · 기초 변형을 판단",
        "받침부 · 신축이음에 변위계로 상대변위를 측정",
        "교각 상부 프리즘과 영향권 밖 자동광파기로 절대 좌표변위 확인",
        "기초에 지표침하계를 복수 설치해 부등침하를 평가",
        "재하시험 시 변형률계를 추가",
        "온도 · 하중 이벤트를 일지에 기록"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "가설 · 타설",
            "교각 경사 · 변위",
            "초기치 · 온도 보정"
          ],
          [
            "시공 중",
            "경사 · 변형률 · 침하",
            "부등침하 · 가설 지지"
          ],
          [
            "공용 개시",
            "경사 · 신축 · 침하",
            "정상 범위 확립"
          ],
          [
            "홍수 · 세굴",
            "침하 · 경사 급변",
            "기초 · 하천 조건"
          ],
          [
            "장기 운영",
            "추세 · 이벤트",
            "유지관리 · 보수 시기"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "센서",
          "원인 추정"
        ],
        "rows": [
          [
            "경사 증가",
            "구조물경사계",
            "부등침하 · 세굴"
          ],
          [
            "수평 변위",
            "변위계",
            "지진 · 온도 · 지반"
          ],
          [
            "변형률 증가",
            "변형률계",
            "과하중 · 손상"
          ],
          [
            "비대칭",
            "복합",
            "기초 불균질"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "교각 경사 허용값은?",
          "a": "설계·교량 유형·용도에 따라 다릅니다. 유지관리 매뉴얼·계측계획을 따릅니다."
        },
        {
          "q": "온도로 경사가 변하면?",
          "a": "일교차·계절 패턴을 기록하고 지속적 단방향 변화만 이상으로 봅니다."
        },
        {
          "q": "교각과 기초침하는 어떻게 연계하나요?",
          "a": "부등침하·세굴 시 교각 경사가 증가합니다. 기초침하·지표침하계와 함께 해석합니다."
        },
        {
          "q": "절대 변위와 받침부 상대 변위 차이는?",
          "a": "받침·신축부는 변위계로 상대변위, 교각 프리즘·자동광파기로 절대 좌표변위를 구분해 기록합니다."
        },
        {
          "q": "사장교 주탑 경사는 교각과 같나요?",
          "a": "주탑(tower)은 케이블·풍하중에 민감합니다. 교각 경사계와 동일 원리이나 측점·관리기준은 유형별로 구분합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "교각의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.1",
        "label": "교량 계측시설 시공"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "교량·구조물 계측 일반"
      },
      {
        "grade": "D",
        "docId": "KCS-24-99-05",
        "cite": "—",
        "label": "대구 3호선 통합 유지관리 10종"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/abutment": {
    "id": "fields/bridge/abutment",
    "title": "교대",
    "sections": {
      "overview": "<p><strong>교대</strong> 계측은 교량 단부 지지 구조인 교대의 침하·전위·균열을 관리합니다. 교대는 접속 도로·성토하중·지반 침하의 영향을 받으며, <strong>침하계</strong>, <strong>구조물경사계</strong>, <strong>균열계</strong>, <strong>지중경사계</strong>(배면)를 활용합니다.</p><p>배면 성토·굴착이 있는 경우 측방 지반 변위도 함께 봅니다.</p><p>교대는 상부 성토하중·접속 도로·배면 지반의 복합 영향을 받습니다. 배면 지중경사계로 성토 단계별 측방 지압을 확인하고, 교대 균열·경사·침하가 동시 악화되면 성토 속도·배수·지반개량을 검토합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "침하",
          "body": "교대 기초 침하를 침하계로 추적합니다."
        },
        {
          "title": "배면 안정",
          "body": "배면 지중경사계로 측방·수평 변위 확인"
        },
        {
          "title": "균열",
          "body": "균열계로 콘크리트 손상 진행을 감시합니다."
        }
      ],
      "principle": "<p>교대는 상부 하중을 기초 지반에 전달합니다. 배면 지반 불안정은 교대 전위·균열을 유발합니다.</p>",
      "installation": [
        "교대 기초 · 최상단에 침하 · 경사 측점을 둡니다",
        "배면에 지중경사계 설치",
        "대표 균열에 균열계를 부착",
        "성토 · 굴착 단계별 계측 실시",
        "자동광파기로 총변위를 보완",
        "장기 데이터베이스 구축"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "기초 · 성토",
            "침하 · 배면 지중경사",
            "성토 단계별 변위"
          ],
          [
            "상부 시공",
            "교대 경사 · 균열",
            "하중 재분배"
          ],
          [
            "공용 전",
            "침하 · 신축",
            "초기 안정화"
          ],
          [
            "공용 중",
            "침하 · 균열 추세",
            "부등침하 · 배면 안정"
          ],
          [
            "보수 · 보강",
            "총변위 · 균열",
            "성토 · 배수 조치"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "도구",
          "해석"
        ],
        "rows": [
          [
            "기초침하",
            "침하계",
            "지반 · 성토"
          ],
          [
            "배면 변위",
            "지중경사계",
            "성토체 안정"
          ],
          [
            "균열",
            "균열계",
            "구조 응력"
          ],
          [
            "총변위",
            "자동광파기",
            "절대 이동"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "교대 배면 성토 시 주의점은?",
          "a": "측방 지압·배면 변위를 지중경사계로 반드시 확인합니다."
        },
        {
          "q": "신축이음과 교대 계측 관계는?",
          "a": "교대 침하·회전이 신축이음량에 영향을 줍니다. 함께 봅니다."
        },
        {
          "q": "성토 속도를 제한해야 하나요?",
          "a": "배면 변위·토압 급증 시 성토 중지·층다짐·배수 조정을 검토합니다. 계측관리계획서에 따릅니다."
        },
        {
          "q": "교대와 교각 침하를 비교할 때?",
          "a": "성토·지반 조건이 다르므로 절대값보다 추세·비대칭·동시 악화 여부를 봅니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "교대의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.1",
        "label": "교량 계측시설 시공"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "교량·구조물 계측 일반"
      },
      {
        "grade": "D",
        "docId": "KCS-24-99-05",
        "cite": "—",
        "label": "대구 3호선 통합 유지관리 10종"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/foundation-settlement": {
    "id": "fields/bridge/foundation-settlement",
    "title": "기초침하",
    "sections": {
      "overview": "<p><strong>기초침하</strong>는 교량 기초·교대·교각 하부 지반의 수직 침하를 <strong>침하 측점</strong>(<strong>자동광파기</strong>·<strong>GNSS</strong>), <strong>지표침하계</strong>, <strong>층별침하계</strong>로 측정합니다. 연약지반·매립지·세굴 구간에서 장기 침하가 교량 사용성·안전에 영향을 줍니다.</p><p>시공 중 침하와 공용 중 장기 침하를 구분하고, 부등침하는 경사·균열과 연계됩니다.</p><p>기초침하는 교각별·교대별로 비교해 부등침하를 평가합니다. 연약지반 교량은 공용 개시 후에도 잔류침하가 수년간 지속될 수 있어 최소 5년 이상 추세 관리가 권장됩니다. 하천 교량은 홍수·세굴 후 집중 계측을 실시합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "총침하",
          "body": "기초 최종 침하량을 예측·관리합니다."
        },
        {
          "title": "부등침하",
          "body": "교각 간 침하 차로 부등침하를 평가합니다."
        },
        {
          "title": "세굴",
          "body": "하천 교량 세굴에 따른 침하를 감시합니다."
        }
      ],
      "principle": "<p>기초 침하는 압밀·크리프·굴착·세굴에 의해 발생합니다. 층별침하계는 지층별 기여도를 분리하고, <strong>지하수위계</strong>는 침하 원인 분석 보조에 활용합니다.</p>",
      "installation": [
        "기초 · 교각 · 주변 지반에 침하 측점(프리즘)을 두고 자동광파기 · GNSS로 표고 변화 확인",
        "필요 시 기초에 지표침하계를 설치해 연직 침하를 자동 계측",
        "연약층이 있으면 층별침하계로 지층별 기여도를 분리",
        "지하수위계로 지하수위 변화를 보조 모니터링",
        "안정 기준점은 침하 영향권 밖에 설치",
        "경사 · 신축 계측과 통합"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "기초 시공",
            "침하 측점 · 지표침하계",
            "초기치 · 압밀 시작"
          ],
          [
            "상부 구조",
            "교각별 침하",
            "부등침하 · 경사 연계"
          ],
          [
            "공용 개시",
            "시간-침하 곡선",
            "잔류 침하 예측"
          ],
          [
            "홍수 · 세굴",
            "침하 가속",
            "하천 · 기초 조건"
          ],
          [
            "장기",
            "GNSS · 추세",
            "유지관리 · 보강 검토"
          ]
        ]
      },
      "data": {
        "headers": [
          "유형",
          "센서",
          "관리"
        ],
        "rows": [
          [
            "압밀침하",
            "지표침하계 · 측점",
            "시간-침하 곡선"
          ],
          [
            "부등침하",
            "다점 측점 · 지표침하계",
            "경사 연계"
          ],
          [
            "세굴",
            "침하 측점 · 지하수위계",
            "수위 · 유량"
          ],
          [
            "장기",
            "GNSS",
            "추세 · 예측"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "시공 중 침하가 크면?",
          "a": "가설·임시 지지·지반 개량 효과를 검토합니다. 설계 허용과 비교합니다."
        },
        {
          "q": "침하가 멈춘 뒤 다시 시작하면?",
          "a": "세굴·지반 섭동·과하중을 조사합니다."
        },
        {
          "q": "층별침하계가 필요한 경우는?",
          "a": "연약층·매립층이 있어 총 침하만으로 원인 지층을 구분하기 어려울 때입니다."
        },
        {
          "q": "기준점(BM)은 어디에 두나요?",
          "a": "침하 영향권 밖 안정 지반 또는 구조물에 두고, 자동광파기·GNSS와 연계합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "기초침하의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.1",
        "label": "교량 계측시설 시공"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "교량·구조물 계측 일반"
      },
      {
        "grade": "D",
        "docId": "KCS-24-99-05",
        "cite": "—",
        "label": "대구 3호선 통합 유지관리 10종"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/strain-stress": {
    "id": "fields/bridge/strain-stress",
    "title": "변형률·응력",
    "sections": {
      "overview": "<p><strong>교량 변형률·응력</strong> 계측은 PSC 궤도빔·강재 거더·아치 리브 등 상부구조의 <strong>휨·축력 응력</strong>을 <strong>변형률계</strong>로 측정합니다(KCS 24 99 05). 유지관리계측에서는 사하중 제외 초기치를 기준으로 활하중·온도·풍에 따른 응력 변화를 추적합니다.</p><p>대구도시철도 3호선 통합 유지관리계측 사업에서는 전 공구에 변형률계가 설치되어 허용응력 대비 관리기준을 운영했습니다. 사장·현수교는 <strong>케이블 장력</strong>·변형률을 함께 봅니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "휨응력",
          "body": "주거더·PSC 박스 휨 변형률로 응력 수준을 평가합니다."
        },
        {
          "title": "전단",
          "body": "PSC 박스·I형 거더 <strong>웹–플랜지 접합부</strong> 등에 <strong>3축 전단변형률계</strong>(로제트)를 매립해 전단 응력·전단변형 집중을 보조 확인합니다. 휨 최대 구간의 단축 변형률계와 축·방향을 구분합니다."
        },
        {
          "title": "온도 보정",
          "body": "무응력계·온도계와 연동해 크리프·열응력을 분리합니다."
        }
      ],
      "principle": "<p>변형률 ε과 탄성계수·단면으로 응력을 환산합니다. 재하시험·장기 모니터링에서 하중-변형 관계와 설계 허용응력을 비교합니다. 전단변형률계는 휨 게이지와 별도 축으로 배치합니다.</p>",
      "installation": [
        "휨 최대 · 전단 집중 구간에 변형률계를 매립 · 부착",
        "PSC 웹 · 플랜지 접합부 · 지지부 전단부에 3축 전단변형률계를 설계 심도 기준 배치",
        "휨 게이지 축(주거더 축 · 휨 작용면)과 전단 게이지 축을 도면 · 시공도에 명시",
        "PSC · 강재 재질에 맞는 게이지 · 보호재 선정",
        "온도 센서 · 무응력계를 동일 부재 또는 인접부에 둡니다",
        "초기치 안정 후 사하중 제외 기준선을 확립",
        "정적 로거 · MUX로 장기 추세를 수집",
        "처짐 · 진동 · 케이블 장력 데이터와 교차 해석"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "설치 · 초기",
            "변형률 · 온도",
            "초기치 · 재현성"
          ],
          [
            "재하시험",
            "하중-변형",
            "설계 대비"
          ],
          [
            "공용",
            "활하중 · 온도",
            "정상 패턴"
          ],
          [
            "특별 점검",
            "이벤트 후",
            "잔류 응력"
          ],
          [
            "유지관리",
            "추세 · 기준 초과",
            "보수 · 제한 하중"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "연계",
          "조치"
        ],
        "rows": [
          [
            "응력 증가",
            "활하중 · 온도",
            "하중 · 온도 상관"
          ],
          [
            "비대칭",
            "부등침하",
            "기초 · 받침"
          ],
          [
            "급변",
            "손상 · 균열",
            "육안 · NDT"
          ],
          [
            "전단 집중",
            "3축 전단 SG",
            "웹 · 지지부 · 전단부 점검"
          ]
        ]
      },
      "criteria": "<p>휨·축력 응력은 설계 허용응력·유지관리 매뉴얼·계측관리계획서 기준을 따릅니다. <strong>전단변형률</strong>은 휨 변형률과 분리 해석하며, 전단부 3축 게이지는 국부 전단 집중·비틀림 보조 확인용입니다. 온도·무응력계 보정 없이 절대 응력 환산은 지양합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "전단변형률계는 어디에 설치하나요?",
          "a": "PSC 박스 거더는 웹–플랜지 접합부·지지부 인접 전단부, 강교는 복부·가새 접합 등 설계·시공도에 따른 전단 집중 구간에 3축 게이지를 둡니다. 휨 최대 스팬 중앙 단축 게이지와 혼동하지 않습니다."
        },
        {
          "q": "무응력계와 어떻게 쓰나요?",
          "a": "동일 조건 매립 무응력계로 크리프·건조수축 변형률을 빼면 구조 응력 변형률을 분리합니다."
        },
        {
          "q": "대구 3호선 사례는?",
          "a": "PSC·사장·아치 교량에 변형률계를 다수 설치하고 설계예상변위·최대허용변위 대비 관리기준을 운영했습니다."
        },
        {
          "q": "침하계와 혼동되나요?",
          "a": "변형률계는 부재 응력, 침하계는 지반·기초 수직변위입니다. 처짐은 처짐계·광파 항목입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 변형률·응력 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-107",
        "caption": "교량 변형률·응력 — PSC·강재 휨·전단 보조",
        "figureNo": 2
      }
    },
    "metaDescription": "변형률·응력의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.2",
        "label": "변형률·응력 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/deflection": {
    "id": "fields/bridge/deflection",
    "title": "처짐",
    "sections": {
      "overview": "<p><strong>교량 상부구조 처짐</strong> 계측은 인접 <strong>교각 중심선 사이 경간</strong>의 <strong>경간 중앙 상부</strong>에 <strong>GNSS 이동국 1개</strong>를 두고, 수직 위치 변화 <strong>ΔZ</strong>를 <strong>처짐량 δ</strong>로 해석하는 장기 모니터링입니다(KDS 11 10 15 · KCS 24 99 05). <strong>기초침하</strong>·<strong>지표침하</strong>와 구분되는 상부구조 항목입니다.</p><p><strong>GNSS 기준국</strong>은 교량 영향권 밖 안정 지반에 설치합니다. LVDT·와이어식 <strong>처짐계</strong>·1/4 경간 측점은 본 노드 hero가 아니며 <a href=\"#sensors/deflection-gauge\">처짐계</a>·<a href=\"#sensors/gnss\">GNSS</a> 센서 페이지에서 다룹니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "경간 중앙 δ",
          "body": "경간=교각↔교각, 이동국=경간 중앙 1점의 ΔZ→δ 추적"
        },
        {
          "title": "장기 추세",
          "body": "온도·크리프·활하중을 분리해 처짐 증가 징후를 감시합니다."
        },
        {
          "title": "구조 검증",
          "body": "재하시험·공용 전환 시 설계 허용 처짐과 비교합니다."
        }
      ],
      "principle": "<p><strong>경간</strong>은 좌·우 <strong>교각 중심선</strong> 사이만 표시합니다(교대↔교대 전체 아님). <strong>GNSS 이동국</strong>은 <strong>경간 중앙 상부 1개</strong>만 배치하며 분할 경간·교각·교대 위 이동국은 사용하지 않습니다. 처짐 δ는 해당 이동국의 <strong>ΔZ(t0→t1)</strong>입니다. 그래프는 경간 중앙 ΔZ–시간입니다.</p><p>동적 처짐·국부 휨은 <a href=\"#sensors/deflection-gauge\">접촉식 처짐계</a>·<a href=\"#fields/bridge/vibration\">진동</a>과 병행할 수 있으나 hero Figure(IMG-103)는 GNSS 중앙 1점 전용입니다.</p>",
      "installation": [
        "경간=인접 교각 중심선 사이로 정의 · Mid-Span 위치 확정",
        "경간 중앙 상부(상판 · 거더)에 GNSS 이동국 1개 설치",
        "교량 영향권 밖 안정 지반에 GNSS 기준국 1개 설치",
        "온도 · 기상 데이터와 연동 · 초기치 · 기준선을 확립",
        "ΔZ → δ 해석 · 보고 주기를 계측관리계획에 따릅니다",
        "기초침하 · 교각 경사와 교차 검토(별도 nodeId)"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "가설 · 시공",
            "경간 중앙 ΔZ",
            "가설 하중 · 온도"
          ],
          [
            "재하시험",
            "δ vs 하중",
            "설계 허용"
          ],
          [
            "공용 개시",
            "정적 ΔZ",
            "기준선 · 기준국"
          ],
          [
            "풍 · 통행",
            "이벤트 ΔZ",
            "동적 항목과 분리"
          ],
          [
            "유지관리",
            "추세",
            "L/xxx · 비대칭"
          ]
        ]
      },
      "data": {
        "headers": [
          "패턴",
          "원인",
          "조치"
        ],
        "rows": [
          [
            "온도 주기",
            "열팽창",
            "정상"
          ],
          [
            "단조 ΔZ 증가",
            "크리프 · 손상",
            "조사"
          ],
          [
            "급증",
            "과하중 · 지지",
            "긴급 점검"
          ],
          [
            "비대칭",
            "부등침하",
            "기초 · 교각 연계"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "왜 경간 중앙 GNSS 1개인가요?",
          "a": "IMG-103 hero·DEF-GNSS 정본에 따라 경간=교각↔교각, 이동국=경간 중앙 1점, δ=ΔZ입니다. 분할 경간·복수 이동국은 본 노드 범위가 아닙니다."
        },
        {
          "q": "처짐계·LVDT는 어디서 보나요?",
          "a": "국부 연직 처짐·재하시험·동적 처짐은 sensors/deflection-gauge(IMG-104)와 building/deflection을 참고합니다."
        },
        {
          "q": "L/600 기준은 어디서 오나요?",
          "a": "설계·계측관리계획·유지관리 매뉴얼에 따릅니다."
        },
        {
          "q": "GNSS와 광파·처짐계 병행?",
          "a": "GNSS는 경간 중앙 장기 ΔZ, 광파·처짐계는 국부·절대 보완에 쓰입니다. 역할을 분리해 해석합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 처짐 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.2.1.6 — 교량 정·동적 처짐 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-103",
        "caption": "교량 상부구조 GNSS 처짐 — 경간 중앙 1점·ΔZ→δ·기준국 영향권 밖",
        "figureNo": 2
      }
    },
    "metaDescription": "처짐의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.2",
        "label": "처짐 계측"
      },
      {
        "grade": "B",
        "docId": "KDS-11-10-15",
        "cite": "§4.2.1.6",
        "label": "교량 정·동적 처짐"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.2.1.6",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/cable-tension": {
    "id": "fields/bridge/cable-tension",
    "title": "케이블 장력",
    "sections": {
      "overview": "<p><strong>케이블 장력</strong> 계측은 현수교·사장교·아치교·닐슨교 등 <strong>주케이블 인장력</strong>을 <strong>케이블장력계</strong>(주파수법·가속 픽업)로 측정합니다. 시공 긴장·조정 단계와 공용 중 유지관리 모두에서 형상·내하력 평가의 핵심입니다.</p><p>대구 3호선 금호강교·경관교량·신천사장교 등에 장력계가 설치되어 정적·동적 장력을 모니터링했습니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "형상 유지",
          "body": "설계 장력 대비 편차·비대칭 확인"
        },
        {
          "title": "내하력",
          "body": "장력 감소는 케이블·앵커 손상 징후일 수 있습니다."
        },
        {
          "title": "시공 품질",
          "body": "긴장·조정 이력의 기준 데이터를 확보합니다."
        }
      ],
      "principle": "<p>가속 픽업·주파수 분석으로 케이블 고유진동수 f를 측정하고 장력 T로 환산합니다(KDS 11 10 15 §4.2.1.9). 부분 장력계·현장별 보정이 적용될 수 있습니다. 하중계(앵커 로드셀)와 대상·원리가 다릅니다.</p>",
      "installation": [
        "케이블 노출부 · 앵커블록 근처에 센서 설치",
        "온도 · 풍 · 진동 보조 채널을 둡니다",
        "긴장 직후 · 조정 후 기준 장력 기록",
        "동적 DAQ로 통행 · 풍 이벤트를 포착",
        "케이블별 식별 · 배선을 문서화",
        "정기 특별 점검 주기에 재측정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "긴장 · 조정",
            "목표 장력",
            "시공 기록"
          ],
          [
            "준공",
            "기준 f · T",
            "설계 대비"
          ],
          [
            "공용",
            "온도 · 활하중",
            "정상 범위"
          ],
          [
            "특별 점검",
            "비대칭",
            "앵커 · 케이블"
          ],
          [
            "이벤트 후",
            "지진 · 풍",
            "잔류 장력"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "연계",
          "조치"
        ],
        "rows": [
          [
            "장력 감소",
            "온도 · 손상",
            "육안 · NDT"
          ],
          [
            "비대칭",
            "침하 · 풍",
            "조정 검토"
          ],
          [
            "f 변화",
            "강성",
            "연결부"
          ],
          [
            "급변",
            "충격",
            "긴급 점검"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "하중계와 차이는?",
          "a": "하중계는 앵커·버팀보 축력, 케이블장력계는 주케이블 인장력(주파수법·f→T)입니다."
        },
        {
          "q": "시공 vs 운영 계측 차이는?",
          "a": "시공은 긴장·조정 검증, 운영은 추세·이상 징후 감시입니다. 동적 채널은 운영에서 강조됩니다."
        },
        {
          "q": "대구 3호선 사례는?",
          "a": "사장·아치 복합 교량에 장력계를 배치하고 통합 유지관리 S/W로 경보·보고를 운영했습니다."
        },
        {
          "q": "온도 영향은?",
          "a": "케이블 장력은 온도에 민감합니다. 온도계·계절 패턴과 함께 해석합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 케이블 장력 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.2.1.9 — 주파수·케이블 장력 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 유지관리 실무 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-105",
        "caption": "케이블 장력 — 주파수·f→T",
        "figureNo": 2
      },
      "installation": {
        "id": "IMG-106",
        "caption": "케이블장력계 설치 (≠앵커 로드셀)",
        "figureNo": 3
      }
    },
    "metaDescription": "케이블 장력의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.2",
        "label": "케이블 장력"
      },
      {
        "grade": "B",
        "docId": "KDS-11-10-15",
        "cite": "§4.2.1.9",
        "label": "주파수·케이블 장력"
      },
      {
        "grade": "D",
        "docId": "KCS-24-99-05",
        "cite": "—",
        "label": "대구 3호선 유지관리 실무"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.2.1.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/wind": {
    "id": "fields/bridge/wind",
    "title": "풍하중",
    "sections": {
      "overview": "<p><strong>교량 풍하중</strong> 계측은 주탑·교면에 설치한 <strong>풍향풍속계</strong>로 풍속·풍향을 측정하고, 진동·처짐·<strong>케이블 장력</strong> 등 <strong>동적 거동</strong>과 연계합니다. 사면 강우용 기상계측과 달리 교량 주탑·deck 레벨 바람이 대상입니다.</p><p>대구 3호선 금호강교·신천사장교 등에 RM Young 풍향풍속계가 설치되어 동적 응답 평가에 활용되었습니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "풍하중",
          "body": "풍속·풍향 시계열로 동적 하중 입력을 확보합니다."
        },
        {
          "title": "동적 연계",
          "body": "진동·처짐 이벤트와 상관분석합니다."
        },
        {
          "title": "안전 운영",
          "body": "강풍 시 통행 제한·점검 근거를 제공합니다."
        }
      ],
      "principle": "<p>풍향풍속계는 3차원 바람 벡터를 샘플링합니다. 고속 동적 로거·이벤트 트리거와 연동해 처짐·가속도 응답과 동기화합니다.</p>",
      "installation": [
        "주탑 상부 · 교면 난간 등 개방 위치에 설치",
        "케이블 · 구조물에 대한 와류 영향을 고려해 높이를 정",
        "진동계 · 처짐계와 타임스탬프를 동기화",
        "기상계측기(강우 · 온도)와 역할을 분리해 기록",
        "강풍 임계 · 경보 규칙 설정",
        "정기 보정 · 결빙 · 오염 점검 일정을 둡니다"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점",
          "확인"
        ],
        "rows": [
          [
            "설치",
            "풍향풍속",
            "보정 · 방향"
          ],
          [
            "준공",
            "기준 풍속",
            "모델 검증"
          ],
          [
            "공용",
            "이벤트",
            "진동 연계"
          ],
          [
            "강풍",
            "임계 초과",
            "운영 조치"
          ],
          [
            "유지관리",
            "추세",
            "센서 상태"
          ]
        ]
      },
      "data": {
        "headers": [
          "현상",
          "연계",
          "해석"
        ],
        "rows": [
          [
            "강풍",
            "진동 RMS",
            "동적 증폭"
          ],
          [
            "돌풍",
            "처짐 δ",
            "과도 응답"
          ],
          [
            "계절",
            "온도",
            "풍 로즈"
          ],
          [
            "센서 이상",
            "결빙",
            "보정"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "기상계측기와 차이는?",
          "a": "기상계측기는 강우·온도 등 통합 현장 기상용입니다. 교량 풍하중은 주탑·교면 바람에 특화된 해석 맥락입니다."
        },
        {
          "q": "풍속만으로 손상 판단?",
          "a": "진동·처짐·케이블 장력과 함께 봅니다. 단일 채널 판단은 지양합니다."
        },
        {
          "q": "대구 3호선 사례는?",
          "a": "사장교 주탑·교면에 풍향풍속계를 두고 동적 Q-gate 데이터와 통합 모니터링했습니다."
        },
        {
          "q": "별도 wind 센서 메뉴는?",
          "a": "풍향풍속 하드웨어는 기상계측기 계열을 쓰되, 교량 풍하중은 본 리프에서 운영·해석을 정리합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 풍하중·동적 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 풍향풍속 사례 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-109",
        "caption": "교량 풍향·풍속 — 주탑·교면·진동 연계",
        "figureNo": 2
      }
    },
    "metaDescription": "풍하중의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.2",
        "label": "풍하중·동적 계측"
      },
      {
        "grade": "D",
        "docId": "KCS-24-99-05",
        "cite": "—",
        "label": "대구 3호선 풍향풍속 사례"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/bearing-displacement": {
    "id": "fields/bridge/bearing-displacement",
    "title": "받침부 변위",
    "sections": {
      "overview": "<p><strong>받침부 변위</strong> 계측은 거더·교면과 교각(또는 교대) 사이 <strong>받침</strong>에서 발생하는 <strong>슬라이드·회전</strong> 등 상대 변위를 <strong>변위계</strong>·LVDT로 측정합니다. 신축이음부 상대 신축량·교량 전체 절대 좌표변위(GNSS·광파)와 구분되는 항목입니다.</p><p>부등침하·온도·과하중 시 받침 이상 거동의 조기 징후로 활용됩니다. 과거 종·횡변위 통합 메뉴를 대체하는 전용 항목입니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "슬라이드",
          "body": "받침 상·하부 간 수평 상대변위 확인"
        },
        {
          "title": "회전",
          "body": "받침부 회전·기울기 변화를 보조 계측합니다."
        },
        {
          "title": "지지 상태",
          "body": "침하·온도·과하중과 연계해 받침 손상 징후를 포착합니다."
        }
      ],
      "principle": "<p>이동·고정·롤러 받침 유형에 따라 허용 슬라이드·회전 범위가 다릅니다. 변위계는 받침 상·하부에 앵커하여 상대 이동을 직접 측정합니다. 신축이음계는 이음부 전용이며, 처짐계는 거더 연직 처짐 전용입니다.</p>",
      "installation": [
        "이동 · 고정 받침 유형을 확인 · 측정축(주로 슬라이드 방향)을 정",
        "받침 상 · 하부에 변위계 · LVDT 앵커 설치",
        "온도 · 침하 · 신축이음 데이터와 타임스탬프를 동기화",
        "초기치 · 온도 보정 기준을 확립",
        "과하중 · 지진 이벤트 후 잔류 변위 기록",
        "정기 육안 점검과 계측 추세를 병행"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점",
          "확인"
        ],
        "rows": [
          [
            "설치",
            "받침 유형 · 축",
            "앵커 안정"
          ],
          [
            "재하시험",
            "슬라이드 · 회전",
            "설계 여유"
          ],
          [
            "공용",
            "온도 · 침하",
            "정상 패턴"
          ],
          [
            "이벤트",
            "지진 · 과하중",
            "잔류 변위"
          ],
          [
            "유지관리",
            "추세",
            "받침 교체 시기"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "연계",
          "조치"
        ],
        "rows": [
          [
            "슬라이드 증가",
            "침하 · 온도",
            "기초 · 교각"
          ],
          [
            "비대칭",
            "부등침하",
            "받침 점검"
          ],
          [
            "급변",
            "충격 · 지진",
            "긴급 점검"
          ],
          [
            "회전 증가",
            "경사계",
            "받침 손상"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "신축이음량과 차이는?",
          "a": "신축이음은 이음부 상대 신축량(늘음/줄음)입니다. 받침부 변위는 교각·교대 상부 받침에서의 슬라이드·회전입니다."
        },
        {
          "q": "포괄 변위 메뉴는 어디에 있나요?",
          "a": "종·횡변위 통합 메뉴는 삭제되었습니다. 받침·처짐·신축이음·광파·GNSS 등 목적별 항목으로 분리합니다."
        },
        {
          "q": "GNSS로 대체 가능?",
          "a": "GNSS·광파는 절대 좌표 변위입니다. 받침부 국부 상대변위는 변위계가 정밀합니다."
        },
        {
          "q": "X/Y/Z 3축 변위계인가요?",
          "a": "아닙니다. 받침 슬라이드·회전 등 목적축에 맞춘 국부 계측입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 받침부 변위 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-110",
        "caption": "받침부 변위 — 슬라이드·회전 (≠신축이음·3축)",
        "figureNo": 2
      }
    },
    "metaDescription": "받침부 변위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.2",
        "label": "받침부 변위"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/expansion-joint": {
    "id": "fields/bridge/expansion-joint",
    "title": "신축이음량",
    "sections": {
      "overview": "<p><strong>신축이음량</strong> 계측은 교량 신축이음부 양측 구조물 사이의 <strong>상대 신축량</strong>을 <strong>신축이음계</strong>로 측정합니다. 계측값은 <strong>늘음량(+)</strong>과 <strong>줄음량(−)</strong>으로 표현하며, 온도에 따른 정상 신축과 비정상 증가를 구분합니다.</p><p>이음부 과다 신축량은 낙하물·충돌·밀착 손상 위험이 있습니다. 교량 전체의 종·횡·수직 절대변위와는 별도 항목입니다.</p><p>신축이음량은 계절별 최대·최소 신축량 범위를 확립한 뒤 이탈 여부를 판단합니다. 차량 하중에 민감한 이음부는 통과 전후 이벤트를 분리 기록하고, 이음재 파손·낙하 위험이 있는 신축량 수준은 유지관리 기준에 반영합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "신축량",
          "body": "종방향 늘음·줄음 범위를 확립합니다."
        },
        {
          "title": "이상 신축",
          "body": "지지 손상·침하 불균형 징후를 포착합니다."
        },
        {
          "title": "유지관리",
          "body": "이음 장치 교체·조정 시기를 판단합니다."
        }
      ],
      "principle": "<p>신축이음 장치는 구조물 길이 변화를 흡수합니다. <strong>신축이음계</strong>는 양측에 고정 지그·브라켓으로 설치되어 두 부재 간 <strong>신축량</strong>을 직접 측정합니다.</p>",
      "installation": [
        "이음부 양측에 신축이음계(고정 지그 · 브라켓 · 보호박스) 설치",
        "온도 센서 또는 기상 데이터와 연동",
        "초기 여유 · 간격 기록",
        "차량 통과 영향이 있으면 이벤트를 분리",
        "정기 계측으로 계절 패턴을 축적",
        "교대 · 교각 침하 데이터와 비교"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "설치 · 초기",
            "신축이음계 · 온도",
            "연간 신축량 기준선"
          ],
          [
            "계절 변화",
            "일교차 · 연간 패턴",
            "정상 신축"
          ],
          [
            "공용 중",
            "누적 신축량 추세",
            "비대칭 · 급변"
          ],
          [
            "보수 · 교체 전",
            "최대 신축량",
            "이음 장치 상태"
          ],
          [
            "이벤트 후",
            "지진 · 충격",
            "잔류 신축량"
          ]
        ]
      },
      "data": {
        "headers": [
          "패턴",
          "원인",
          "조치"
        ],
        "rows": [
          [
            "일교차 주기",
            "온도",
            "정상"
          ],
          [
            "단방향 증가",
            "침하 · 회전",
            "기초 조사"
          ],
          [
            "급격 확대",
            "지지 손상",
            "긴급 점검"
          ],
          [
            "비대칭",
            "부등침하",
            "교각 · 교대 검토"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "신축이음계 없이 측정 가능한가요?",
          "a": "변위계·광파 측량으로 대체 가능하나, 이음부에는 신축이음계가 정밀합니다."
        },
        {
          "q": "여름에 간격이 줄면?",
          "a": "열팽창에 따른 정상 현상일 수 있습니다. 겨울 값과 함께 연간 신축량 범위를 봅니다."
        },
        {
          "q": "종·횡·수직 변위계로 신축이음을 대체할 수 있나요?",
          "a": "교량 절대·받침 변위와 신축이음부 상대 신축량은 별도 항목입니다. 이음부에는 신축이음계가 정본입니다."
        },
        {
          "q": "관리기준 mm는 어떻게 정하나요?",
          "a": "이음 장치 제원·온도범위·설계 여유에 따라 현장별로 정합니다. 계절 패턴 확립 후 이탈 시 경보합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 신축이음량 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "신축이음량의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.1",
        "label": "신축이음량"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/vibration": {
    "id": "fields/bridge/vibration",
    "title": "진동",
    "sections": {
      "overview": "<p><strong>교량 진동</strong> 계측은 차량·풍·지진에 의한 교량 동적 응답을 <strong>진동계</strong>로 측정합니다. 고유진동수·감쇠·변위 응답 변화는 강성 저하·연결부 손상 징후일 수 있습니다.</p><p>공용 교량 건전성 평가·재하시험·인접 공사 영향 평가에 활용됩니다. 사장·현수교는 <strong>케이블 장력</strong>·풍하동 데이터와 교차 해석합니다.</p><p>교량 진동 계측은 개통 전 기준 모드를 확보한 뒤 공용 중 주기적으로 비교합니다. 고유진동수 저하·감쇠비 변화는 경간 내 연결부·교각 지지 조건 악화 징후일 수 있어 상세 점검을 연계합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "동적 특성",
          "body": "고유진동수·모드 형상을 파악합니다."
        },
        {
          "title": "과도 응답",
          "body": "차량·지진 이벤트 응답을 평가합니다."
        },
        {
          "title": "손상 감지",
          "body": "진동 특성 변화로 손상 징후 추적"
        }
      ],
      "principle": "<p>교량은 질량-강성-감쇠 시스템입니다. 가속도·속도 측정으로 스펙트럼·응답을 분석합니다.</p>",
      "installation": [
        "주요 경간 · 교각 · 이음부에 센서 배치",
        "샘플링 주파수 · 트리거 설정",
        "기준 응답(건전 상태) 기록",
        "차량 축하중 · 속도와 연계",
        "장기 모니터링은 이벤트 · 트렌드 병행",
        "구조물 기준 · 민원 기준을 구분 적용"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "기준 확립",
            "고유진동수 · 감쇠",
            "건전 상태 기록"
          ],
          [
            "공용 운행",
            "차량 · 풍 이벤트",
            "과도 응답 · 민원"
          ],
          [
            "재하시험",
            "모드 · 스펙트럼",
            "설계 대비"
          ],
          [
            "이상 징후",
            "진동수 변화",
            "손상 · 연결부"
          ],
          [
            "유지관리",
            "장기 트렌드",
            "보수 · 보강 시기"
          ]
        ]
      },
      "data": {
        "headers": [
          "지표",
          "의미",
          "활용"
        ],
        "rows": [
          [
            "고유진동수",
            "강성",
            "손상 감지"
          ],
          [
            "최대 가속도",
            "이벤트",
            "과도 하중"
          ],
          [
            "감쇠비",
            "에너지 소산",
            "연결부"
          ],
          [
            "RMS",
            "연속",
            "운행 영향"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "교량 진동 기준은?",
          "a": "구조물 설계 기준과 별도로 인체·민원 기준이 있을 수 있습니다. 목적에 맞게 적용합니다."
        },
        {
          "q": "고유진동수가 낮아지면?",
          "a": "강성 저하·연결부 손상·질량 증가·경계 조건 변화를 검토합니다. 기준 상태와 비교하고 육안 점검을 병행합니다."
        },
        {
          "q": "재하시험과 상시 모니터링 차이는?",
          "a": "재하시험은 이벤트·모드 분석 중심, 상시는 트렌드·이상 진동 감시입니다. 목적에 맞게 샘플링을 설정합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.1 — 교량 계측시설 시공 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 교량·구조물 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 대구 3호선 통합 유지관리 10종 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "진동의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.1",
        "label": "교량 계측시설 시공"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "교량·구조물 계측 일반"
      },
      {
        "grade": "D",
        "docId": "KCS-24-99-05",
        "cite": "—",
        "label": "대구 3호선 통합 유지관리 10종"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/temperature": {
    "id": "fields/bridge/temperature",
    "title": "온도",
    "sections": {
      "overview": "<p><strong>교량 온도</strong> 계측은 콘크리트·강재 교량의 온도 분포·일교차·계절 변화를 <strong>기상계측기</strong>, 온도 센서, <strong>변형률계</strong>와 연동하여 측정합니다(KCS 24 99 05). 온도는 <strong>신축이음량</strong>·콘크리트 응력·처짐의 주요 외부 요인입니다.</p><p>온도-신축량·온도-변형률 상관을 확립하면 정상 열신축과 구조적 이상을 구분합니다. 재하시험·장기 모니터링에서 온도 보정의 기준이 됩니다.</p><p>교량 온도 계측은 신축이음·상부판 변위 해석의 기준입니다. 일교차·계절 패턴을 확립한 뒤 온도 보정 없이 증가하는 변위·변형률만 구조적 이상으로 판단합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "열신축",
          "body": "신축이음·상부구조 변위의 온도 성분을 분리합니다."
        },
        {
          "title": "응력",
          "body": "온도 구배에 따른 콘크리트·강재 응력을 추정합니다."
        },
        {
          "title": "해석 보정",
          "body": "변위·변형률 데이터의 온도 보정 기준을 제공합니다."
        }
      ],
      "principle": "<p>교량은 일교차·계절 온도에 따라 팽창·수축합니다. 표면·내부 온도 차이는 온도 구배 응력을 유발합니다. 온도 센서는 상부판·교각·신축이음 인접부에 배치합니다.</p>",
      "installation": [
        "상부구조 · 교각 · 신축이음 인접부에 온도 센서 설치",
        "기상계측기 · 일사량 데이터와 연동",
        "신축이음계 · 변위계 · 변형률계와 시간 동기화",
        "계절별 최대 · 최소 온도-변위 패턴 기록",
        "재하시험 시 온도 이벤트를 일지에 기록",
        "장기 데이터베이스로 열신축 정상 범위를 확립"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "설치 · 초기",
            "온도 · 신축",
            "기준선 · 센서 위치"
          ],
          [
            "계절 순환",
            "일교차 · 연간",
            "정상 열신축 패턴"
          ],
          [
            "공용 중",
            "온도-변위 상관",
            "이상 이탈"
          ],
          [
            "재하시험",
            "온도 이벤트",
            "하중-온도 분리"
          ],
          [
            "유지관리",
            "장기 추세",
            "이음 · 응력 보정"
          ]
        ]
      },
      "data": {
        "headers": [
          "온도 패턴",
          "연계 계측",
          "해석"
        ],
        "rows": [
          [
            "일교차",
            "신축이음",
            "정상 주기 변위"
          ],
          [
            "계절",
            "상부판 변위",
            "연간 범위"
          ],
          [
            "급변",
            "변형률",
            "온도 구배 응력"
          ],
          [
            "결빙",
            "교각 · 배수",
            "비정상 응력"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "온도만으로 손상을 판단할 수 있나요?",
          "a": "온도는 보조 지표입니다. 변위·변형률·균열과 함께 해석합니다."
        },
        {
          "q": "강교와 RC교 차이는?",
          "a": "강교는 선팽창 계수·부재 두께에 따라 반응 속도가 다릅니다. 측점 위치를 형식에 맞게 선정합니다."
        },
        {
          "q": "온도만으로 손상을 판단할 수 있나요?",
          "a": "온도는 신축·처짐 해석의 보조 변수입니다. 변위·신축이음·변형률과 함께 봅니다."
        },
        {
          "q": "센서는 어디에 두나요?",
          "a": "상부구조·교각 대표 위치와 신축이음 인접부에 배치해 일교차·계절 패턴을 잡습니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 온도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "온도의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.2",
        "label": "온도 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/bridge/seismic": {
    "id": "fields/bridge/seismic",
    "title": "지진",
    "sections": {
      "overview": "<p><strong>교량 지진</strong> 계측은 지진 동작 시 교량의 가속도·변위·변형률 응답을 <strong>진동계</strong>, <strong>변위계</strong>, <strong>변형률계</strong>로 기록합니다(KCS 24 99 05). 지진 후 잔류 변위·연결부 손상·교각·교대 거동 변화를 평가합니다.</p><p>차량하중 진동과 구분하여 지진 이벤트 전후 고빈도·이벤트 트리거 계측을 운영합니다.</p><p>교량 지진 계측은 이벤트 트리거·고속 샘플링으로 지진 전후 응답을 보존합니다. 잔류 변위·신축이음·교각 거동을 집중 검토하고 내진 점검 계획과 연동합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 교량 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "지진 응답",
          "body": "가속도·변위 피크 기록"
        },
        {
          "title": "잔류 변위",
          "body": "지진 후 잔류·추가 변형 추적"
        },
        {
          "title": "복구 판단",
          "body": "통행 제한·상세 점검 필요성을 평가합니다."
        }
      ],
      "principle": "<p>교량 지진 거동은 상부구조·교각·교대·기초가 연계된 시스템 응답입니다. 지진파 입력 대비 과도 응답·잔류 변위가 안전 평가의 핵심입니다.</p>",
      "installation": [
        "교각 · 교대 · 주요 경간에 진동계 · 변위계 설치",
        "지진 이벤트 트리거 · 고속 샘플링 설정",
        "지진 전 기준 응답 · 변위 데이터를 확보",
        "신축이음 · 지지부 변위를 집중 감시",
        "지진 후 집중 계측 일정 수립",
        "내진 점검 · 유지관리 계획과 연동"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "평상시",
            "기준 응답 · 변위",
            "트리거 · 샘플링 설정"
          ],
          [
            "지진 발생",
            "PGA · 변위 피크",
            "실시간 모니터링"
          ],
          [
            "직후",
            "잔류 변위 · 신축",
            "통행 제한 검토"
          ],
          [
            "24~72h",
            "추가 변형",
            "상세 점검 · 육안"
          ],
          [
            "복구 후",
            "고유진동수",
            "손상 · 보수 이력"
          ]
        ]
      },
      "data": {
        "headers": [
          "단계",
          "관심 항목",
          "조치"
        ],
        "rows": [
          [
            "지진 중",
            "PGA · 변위",
            "실시간 모니터링"
          ],
          [
            "직후",
            "잔류 변위",
            "통행 제한 검토"
          ],
          [
            "24~72h",
            "추가 변형",
            "상세 점검"
          ],
          [
            "장기",
            "고유진동수",
            "손상 추적"
          ]
        ]
      },
      "criteria": "<p>교량 관리기준은 설계, 교량 형식, 교통량, 하부 지반 조건에 따라 설정합니다. 시공 중 가설 변위, 공용 중 장기 침하·경사, 재하시험 시 허용 변형률을 각각 적용합니다. 진동은 구조물 기준과 인체·민원 기준을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "진동 계측과 지진 계측 차이는?",
          "a": "진동은 차량·풍 등 운행 하중, 지진은 지진파 입력에 대한 구조 응답·잔류 변위를 중점으로 봅니다."
        },
        {
          "q": "지진 후 즉시 통행 가능한가요?",
          "a": "설계·발주처 기준과 현장 점검 결과에 따릅니다. 계측 데이터가 판단 근거가 됩니다."
        },
        {
          "q": "지진 후 어떤 계측을 우선하나요?",
          "a": "교각·교대 변위·경사, 신축이음 잔류량, 받침 상태를 우선 확인합니다."
        },
        {
          "q": "상시 지진계와 이벤트 기록 차이는?",
          "a": "상시는 PGA·트리거, 이벤트는 구조 응답 스펙트럼 분석에 활용합니다. 계획서에 맞게 연동합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 §3.2 — 지진 응답 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "지진의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-24-99-05",
        "cite": "§3.2",
        "label": "지진 응답 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 24 99 05:2023 교량계측시설 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/construction-phase": {
    "id": "fields/tunnel/construction-phase",
    "title": "건설중 계측",
    "sections": {
      "overview": "<p><strong>터널 건설중 계측</strong>은 준공·운영기 계측과 구분하여, <strong>NAT·TBM 굴착·지보·라이닝</strong> 등 시공 전 기간에 내공변위·천단침하·지표·지중 변위를 단계별로 측정·보고하는 체계입니다. 운행철도·도로·건물 등 관리대상물이 상부에 있을 때 <em>railway tunnel monitoring during construction</em> 관점으로 협약·경보·운행 제한을 연계합니다.</p><p>단일 항목(내공변위·천단침하 등) 계측과 달리, <strong>공정 단계·측점 네트워크·데이터 흐름</strong>을 통합 관리합니다. 준공 시 기준선·센서 이력을 운영기 모니터링으로 이관합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 터널 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "단계별 안전",
          "body": "막장·지보·라이닝 단계별 관리기준과 누적·속도 추적"
        },
        {
          "title": "운행선 보호",
          "body": "상부·인접 철도 구간의 침하·변위를 선제 대응합니다."
        },
        {
          "title": "데이터 연속성",
          "body": "건설 중 초기치·이벤트 기록을 준공 인수 기준으로 확정합니다."
        },
        {
          "title": "협약 · 보고",
          "body": "철도·도로 관리주체와 건설 중 보고 주기·경보를 명문화합니다."
        }
      ],
      "principle": "<p>터널 건설중 계측은 <strong>천단·내공·지표·지중</strong>을 동일 시간축·대표 단면에서 비교합니다. 천단침하와 내공변위는 <strong>별도 측선·측점</strong>으로 분리하고, 운행철도 상부는 <strong>자동광파기·침하계</strong>로 고빈도 보조합니다. 발파 구간은 <strong>진동계</strong> 이벤트와 연동합니다.</p>",
      "installation": [
        "계측관리계획서에 건설중 항목 · 단계 · 빈도 · 관리기준을 명시",
        "대표 단면에 내공변위 · 천단침하 · 지표 · 지중 측점 배치",
        "운행철도 · 도로 상부에 침하계 · 광파기 기준망 구축",
        "굴착 · 지보 · 라이닝 공정과 계측 일정을 동기화",
        "원격계측 · 자동 수집으로 야간 · 연속 데이터를 확보",
        "준공 전 최종 수렴 · 기준값을 확정 · 운영기 계획으로 이관"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "사전 · 지표면",
            "지표 · 지중 초기치",
            "운행선 · 관리대상물 조사"
          ],
          [
            "굴착 · 막장",
            "내공변위 · 천단 · 선행변위",
            "3D 수렴 · 천단 급변"
          ],
          [
            "지보 · 라이닝",
            "숏크리트 · 록볼트 · 강지보",
            "단계별 누적 변위"
          ],
          [
            "인접 · 발파",
            "발파진동 · 지표침하",
            "철도 운행 제한 협약"
          ],
          [
            "준공 · 인수",
            "최종 수렴 · 기준값",
            "운영기 계측 이관"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "수단",
          "건설중 포인트"
        ],
        "rows": [
          [
            "내공변위",
            "변위계 · 광파기",
            "단계별 누적 · 속도"
          ],
          [
            "천단침하",
            "침하계 · 광파기",
            "천단 · 지표 상대비교"
          ],
          [
            "운행철도",
            "광파기 · 침하계",
            "railway tunnel monitoring"
          ],
          [
            "발파",
            "진동계",
            "PPV · 이벤트 연동"
          ],
          [
            "통합",
            "원격계측",
            "일 · 주 보고 · 경보"
          ]
        ]
      },
      "criteria": "<p>건설 중 관리기준은 설계·KDS·인접 구조물·철도 협약에 따릅니다. 운영기(준공 후) 안전관리 기준과 혼용하지 않고, <strong>시공 단계별 허용 누적·속도</strong>를 별도 설정합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "건설 중 계측과 운영기 계측 차이는?",
          "a": "건설 중 계측은 굴착·지보·라이닝 시공 중 변위·속도 관리, 운영기는 준공 후 장기 안전·유지관리 중심입니다."
        },
        {
          "q": "운행철도 상부 터널은?",
          "a": "철도 협약·고빈도 계측·운행 제한 연계가 필수입니다. 철도 건설중 계측 항목과 데이터를 통합합니다."
        },
        {
          "q": "내공변위·천단침하를 같이 보나요?",
          "a": "동일 단면·시간축에서 비교하되 측점·측선은 분리합니다. 하나의 그래프에 혼합하지 않습니다."
        },
        {
          "q": "준공 후 데이터는?",
          "a": "건설 중 최종값·센서 이력·보고서를 운영기 계측관리계획 인수 자료로 이관합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 터널 계측 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 27 50 10:2023</strong>「터널 계측」 §4.1.5 — 터널 계측 (참고) <span class=\"tech-sources__grade\">[C]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-111"
      ]
    },
    "heroImageId": "IMG-111",
    "heroCaption": "터널 건설중 계측 — 굴착·지보·라이닝 단계별 내공·천단·지표 변위 통합",
    "metaDescription": "터널 건설중 계측 — 굴착·지보·라이닝 단계별 내공·천단·지표 변위와 운행철도 구간 보호. Railway tunnel monitoring during construction.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "터널 계측 항목"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "계측 빈도"
      },
      {
        "grade": "C",
        "docId": "KDS-27-50-10",
        "cite": "§4.1.5",
        "label": "터널 계측 (참고)"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/slope/ground-displacement": {
    "id": "fields/slope/ground-displacement",
    "title": "지중변위",
    "sections": {
      "overview": "<p><strong>사면 지중변위</strong>는 비탈면 내부 심도별 수평변위를 <strong>지중경사계</strong>로 측정하여 활동면 위치·변위 진행성을 판단합니다. 표면 균열·지표 변위보다 심부 거동을 조기에 포착할 수 있어 붕괴 예측의 핵심입니다.</p><p>변위 집중 심도는 활동면 후보이며, 강우·지하수위 상승 후 변위속도 증가는 위험 신호입니다. <strong>간극수압계</strong>, <strong>지하수위계</strong>와 시간축 연계가 필수입니다.</p><p>사면 지중변위는 강우 예보·태풍 시 계측 빈도를 사전에 높이는 운영 규칙을 두는 것이 좋습니다. 변위 가속이 확인되면 현장 순찰·배수 점검·인근 주민·도로 통제와 연계하며, 보강 후에도 동일 측점에서 효과를 검증합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 사면 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "활동면",
          "body": "변위 집중 심도로 활동면을 추정합니다."
        },
        {
          "title": "진행성",
          "body": "변위속도·가속 추적"
        },
        {
          "title": "보강 검증",
          "body": "압밀·앵커·말뚝 효과를 평가합니다."
        }
      ],
      "principle": "<p>사면 내부 전단 변형은 지중경사계 A·B축 변위곡선으로 표현됩니다. 누적변위·속도 그래프로 위험 단계를 판단합니다.</p>",
      "installation": [
        "위험 단면 · 대표 단면에 지중경사계 설치",
        "활동면 예상 하부 안정층까지 천공",
        "측정축을 사면 진행 방향에 맞춥니다",
        "강우 · 지하수위 계측과 동일 단면에 배치",
        "초기치 안정 후 정기 · 집중 계측 실시",
        "원격계측으로 강우 후 고빈도 계측 전환"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "평상시",
            "지중경사계 추세",
            "기준 변위속도"
          ],
          [
            "강우 전 · 중",
            "기상 · 지하수위",
            "경보 준비"
          ],
          [
            "강우 후",
            "변위속도 · 활동면",
            "가속 · 집중 심도"
          ],
          [
            "보강 후",
            "변위 감소",
            "대책 효과"
          ],
          [
            "장기",
            "누적 변위",
            "잔류 위험"
          ]
        ]
      },
      "data": {
        "headers": [
          "그래프",
          "징후",
          "대응"
        ],
        "rows": [
          [
            "깊이-변위",
            "특정 심도 꺾임",
            "활동면"
          ],
          [
            "시간-변위",
            "속도 증가",
            "경보 · 조사"
          ],
          [
            "강우 후",
            "지연 반응",
            "간극수압"
          ],
          [
            "보강 후",
            "속도 감소",
            "효과 확인"
          ]
        ]
      },
      "criteria": "<p>사면 관리기준은 설계 안정율, 붕괴 위험 등급, 인접 시설물에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 변위속도·강우 후 반응 기준을 병행합니다. 한계 초과 시 대피·공사 중지·보강을 검토하는 관리 단계를 운영할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "지중경사계 몇 본이 적당한가요?",
          "a": "단면당 1~2본이 일반적이며, 복잡 지질은 추가합니다."
        },
        {
          "q": "변위가 작은데 속도만 증가하면?",
          "a": "진행성 파괴 전 단계일 수 있어 경계 관찰·빈도 강화가 필요합니다."
        },
        {
          "q": "강우 후 계측 빈도를 높여야 하나요?",
          "a": "변위속도 가속·지하수위 상승 시 고빈도·집중 계측으로 전환합니다."
        },
        {
          "q": "표면 균열과 지중변위 관계는?",
          "a": "지중 변위·속도 증가가 표면 균열·지표 변위보다 선행할 수 있어 지중경사계가 핵심입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "지중변위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.2",
        "label": "사면·절토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/slope/surface-tilt": {
    "id": "fields/slope/surface-tilt",
    "title": "지표경사",
    "sections": {
      "overview": "<p><strong>지표경사</strong> 계측은 사면 표면·옹벽 상부 등에 설치한 <strong>지표경사계</strong>(틸트미터)로 기울기 변화를 측정합니다. 보링식 <strong>지중경사계</strong>와 달리 표면 패드에 고정하며, 국부 전도·배수 불량·동결·침식 징후를 조기에 포착합니다.</p><p>지표 균열·소규모 변위보다 전체 기울기 추세를 보는 항목으로, <strong>지중경사계</strong>·<strong>지하수위계</strong>와 병행합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 사면 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "전도 감시",
          "body": "표면 기울기·변화율 추적"
        },
        {
          "title": "국부 이상",
          "body": "배수·침식·동결 등 지표 원인을 포착합니다."
        },
        {
          "title": "구조물 연계",
          "body": "옹벽·석축 상부 안정 확인"
        }
      ],
      "principle": "<p>지표경사계는 중력 기준 기울기(각도 또는 sinθ)를 측정합니다. 온도·진동 영향을 분리하고, 강우·수위 이벤트와 시간 동기화합니다.</p>",
      "installation": [
        "사면 상부 · 옹벽 crest 등 대표 위치에 패드 기초를 조성",
        "지표경사계를 수평 패드에 고정 · 방향 기록",
        "케이블 보호 · 방수 처리를",
        "강우 · 지하수위 계측과 동일 단면에 배치",
        "초기치 안정 후 정기 · 집중 계측 실시",
        "지중경사계 · 표면 변위 측점과 데이터 연동"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "설치 · 초기",
            "지표경사계 기준선",
            "패드 안정 · 방향"
          ],
          [
            "우기",
            "강우 · 수위 연계",
            "기울기 가속"
          ],
          [
            "건기",
            "온도 · 건조 수축",
            "정상 범위"
          ],
          [
            "보강 후",
            "기울기 감소",
            "대책 효과"
          ],
          [
            "장기",
            "누적 기울기",
            "잔류 안정"
          ]
        ]
      },
      "data": {
        "headers": [
          "패턴",
          "연계",
          "판단"
        ],
        "rows": [
          [
            "강우 후 증가",
            "지하수위 · 지중변위",
            "배수 · 활동"
          ],
          [
            "단방향 기울기",
            "옹벽 · 균열",
            "국부 불안정"
          ],
          [
            "급격 변화",
            "이벤트",
            "즉시 점검"
          ],
          [
            "장기 완만",
            "온도",
            "정상 추세"
          ]
        ]
      },
      "criteria": "<p>사면 관리기준은 설계 안정율, 붕괴 위험 등급, 인접 시설물에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 변위속도·강우 후 반응 기준을 병행합니다. 한계 초과 시 대피·공사 중지·보강을 검토하는 관리 단계를 운영할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "지표경사계와 지중경사계 차이는?",
          "a": "지표경사계는 표면 패드 기울기, 지중경사계는 심도별 수평변위입니다. 함께 쓰면 표면·심부 거동을 구분합니다."
        },
        {
          "q": "패드 기초가 중요한 이유는?",
          "a": "센서는 패드와 함께 움직입니다. 침하·전도가 패드에 포함되므로 기초 안정화가 필수입니다."
        },
        {
          "q": "온도 보정이 필요한가요?",
          "a": "고정밀 장기 추세에서는 온도 영향을 보정합니다. 계획서·제조사 권장에 따릅니다."
        },
        {
          "q": "경보 기준은?",
          "a": "설계·계측관리계획서에 따릅니다. 변화율·누적 기울기와 지중변위를 함께 판단합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-089"
      ]
    },
    "metaDescription": "지표경사의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.2",
        "label": "사면·절토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/slope/structural-displacement": {
    "id": "fields/slope/structural-displacement",
    "title": "구조물 변위",
    "sections": {
      "overview": "<p><strong>구조물 변위</strong> 계측은 사면 하단 옹벽·석축의 수평·연직 변위를 <strong>프리즘(측점)</strong>·광학 측량망·<strong>LVDT 변위계</strong>로 추적합니다. <strong>배면 사면</strong> 표면 거동은 <strong>와이어식 변위계</strong>로 별도 관측합니다.</p><p>공사 중 다점 3D가 필요할 때만 영향권 밖 부동점·프리즘 망을 보조로 병행합니다. 장기 유지관리에서는 센서형·광학 측점이 일반적입니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 사면 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "구조물 변위",
          "body": "옹벽·옹벽형 구조 수평·연직 변위 추적"
        },
        {
          "title": "배면 사면",
          "body": "옹벽 뒤 성토면 표면 변위를 와이어식으로 연속 기록합니다."
        },
        {
          "title": "안정 평가",
          "body": "전도·활동 징후를 조기에 포착합니다."
        },
        {
          "title": "보강 검증",
          "body": "앵커·보강 공법 효과 확인"
        }
      ],
      "principle": "<p><strong>와이어식 변위계</strong>는 안정 기준부에서 <strong>배면 사면 표면 측점</strong>까지 연장량을 기록합니다. <strong>옹벽 본체</strong>는 프리즘 측점·(선택) 광학 측량으로 좌표 변위를 추적합니다.</p>",
      "installation": [
        "배면 사면 상부 안정지에 와이어식 변위계 기준부 설치",
        "배면 사면 표면 측점에 센서 헤드 · 와이어 배치",
        "옹벽 전 · 중 · 하부에 프리즘(측점) 설치",
        "데이터로거 · 원격계측으로 연속 수집 설정",
        "(선택) 공사 중 다점 3D — 영향권 밖 부동점 · 프리즘 측점",
        "지중경사계 · 지표경사와 동일 단면 좌표를 맞춥니다",
        "강우 · 지하수위 이벤트 시 고빈도 계측으로 전환"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "설치 · 초기",
            "와이어식 변위계",
            "영점 · 케이블"
          ],
          [
            "우기",
            "수위 · 지중변위",
            "옹벽 전진"
          ],
          [
            "보강 후",
            "변위 감소",
            "앵커 효과"
          ],
          [
            "이벤트",
            "지진 · 굴착",
            "잔류 변위"
          ],
          [
            "장기",
            "누적 변위",
            "유지관리"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "연계",
          "대응"
        ],
        "rows": [
          [
            "수평 전진",
            "지중경사 · 토압",
            "보강 검토"
          ],
          [
            "연직 침하",
            "기초 · 배수",
            "원인 조사"
          ],
          [
            "비대칭 변위",
            "균열 · 경사",
            "국부 손상"
          ],
          [
            "속도 증가",
            "강우 후",
            "경보 · 대피"
          ]
        ]
      },
      "criteria": "<p>사면 관리기준은 설계 안정율, 붕괴 위험 등급, 인접 시설물에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 변위속도·강우 후 반응 기준을 병행합니다. 한계 초과 시 대피·공사 중지·보강을 검토하는 관리 단계를 운영할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "와이어식 변위계는 어디에 설치하나요?",
          "a": "배면 사면(옹벽 뒤·위 성토면) 표면에 설치합니다. 옹벽 전면에는 설치하지 않습니다."
        },
        {
          "q": "옹벽 변위는 어떻게 측정하나요?",
          "a": "옹벽 전면 프리즘 측점과 (선택) 영향권 밖 광학 측량망으로 좌표 변위를 추적합니다."
        },
        {
          "q": "부동점 위치 기준은?",
          "a": "옹벽 변위·침하 영향권 밖 안정 지반 또는 구조물에 둡니다."
        },
        {
          "q": "지표 변위와 구조물 변위 차이는?",
          "a": "지표는 토체 표면, 구조물 변위는 옹벽·석축 자체 거동입니다. 둘 다 보면 전도·활동을 구분합니다."
        },
        {
          "q": "경보 시 우선 조치는?",
          "a": "추가 계측·육안 점검·배수·하중 제한 등 계획서 단계별 대응을 시행합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-090"
      ]
    },
    "metaDescription": "구조물 변위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.2",
        "label": "사면·절토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/slope/groundwater": {
    "id": "fields/slope/groundwater",
    "title": "지하수위",
    "sections": {
      "overview": "<p><strong>사면 지하수위</strong> 계측은 <strong>지하수위계</strong>로 자유수면·포압수면 변화를 추적합니다. 지하수위 상승은 간극수압 증가·사면 안정 저하를 유발하며, 강우와의 시간차 분석이 중요합니다.</p><p>배수공 효과·우기 취약성 평가·<strong>지중경사계</strong> 변위 원인 분석에 필수 데이터입니다.</p><p>지하수위 계측공은 사면 상부·중부·하부에 다층으로 두면 침투 경로 파악에 유리합니다. 우기 전 배수시설 점검과 수위 기준을 정하고, 수위 상승 속도가 과거 이벤트 대비 빠르면 경보 단계를 상향합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 사면 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "수위 추적",
          "body": "우기·건기 수위 변화 기록"
        },
        {
          "title": "안정 연계",
          "body": "수위-변위 상관을 분석합니다."
        },
        {
          "title": "배수 평가",
          "body": "배수시설 효과를 검증합니다."
        }
      ],
      "principle": "<p>지하수위 상승은 토층 간극수압을 높여 전단강도를 낮춥니다. 관측공 심도는 활동층·배수 경로를 반영합니다.</p>",
      "installation": [
        "사면 상 · 중 · 하부에 관측공 설치",
        "필터 구간을 목적 지층에 맞춥니다",
        "표면수 유입 방지 조치를",
        "강우계와 시간 동기화",
        "데이터로거 · 원격 전송 설정",
        "간극수압계와 병행"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "건기",
            "기준 수위",
            "정상 추세"
          ],
          [
            "우기 전",
            "수위 · 강우",
            "경보 준비"
          ],
          [
            "강우 후",
            "수위 · 변위",
            "지체 · 불안정"
          ],
          [
            "배수 시",
            "수위 하강",
            "배수 효과"
          ],
          [
            "장기",
            "고수위 유지",
            "상시 위험 · 보강"
          ]
        ]
      },
      "data": {
        "headers": [
          "현상",
          "연계",
          "판단"
        ],
        "rows": [
          [
            "강우 후 수위 상승",
            "강우량",
            "침투 · 지체 시간"
          ],
          [
            "수위 상승+변위",
            "지중경사계",
            "불안정"
          ],
          [
            "배수 후 수위 하강",
            "배수공",
            "효과"
          ],
          [
            "장기 고수위",
            "간극수압",
            "상시 위험"
          ]
        ]
      },
      "criteria": "<p>사면 관리기준은 설계 안정율, 붕괴 위험 등급, 인접 시설물에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 변위속도·강우 후 반응 기준을 병행합니다. 한계 초과 시 대피·공사 중지·보강을 검토하는 관리 단계를 운영할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "지하수위계와 간극수압계 차이는?",
          "a": "지하수위계는 관측공 수면, 간극수압계는 토층 내부 압력입니다. 함께 쓰면 해석이 정확합니다."
        },
        {
          "q": "수위가 갑자기 떨어지면?",
          "a": "배수·누수·관측공 손상을 확인합니다."
        },
        {
          "q": "관측공 수위와 실제 활동층 수압이 다를 수 있나요?",
          "a": "관측공 위치·필터 구간에 따라 다릅니다. 간극수압계와 병행해 활동층 조건을 보완합니다."
        },
        {
          "q": "우기 전 수위 기준선은?",
          "a": "건기 안정 수위·전년 우기 패턴을 비교해 임계 수위·경보 규칙을 갱신합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "지하수위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.2",
        "label": "사면·절토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/slope/slip-surface": {
    "id": "fields/slope/slip-surface",
    "title": "활동면",
    "sections": {
      "overview": "<p><strong>활동면</strong> 계측은 사면 내부 전단 활동 <strong>추정 후보</strong>의 위치·변위를 <strong>센서형 다단식 지중경사계</strong>, <strong>간극수압계</strong>, 지표변위·균열·침하·지하수위·현장관찰을 종합해 검증합니다. 지중경사계 프로파일의 전단변형 집중 구간은 <strong>활동면 추정 후보</strong>일 뿐, 단일 계측만으로 확정하지 않습니다.</p><p>원호·평면 활동 가정과 계측 데이터를 비교해 안정율·보강 설계를 점검합니다.</p><p>활동면 추정은 단일 계측일이 아닌 복수 시점의 지중경사계 프로파일 비교로 신뢰도가 높아집니다. 간극수압계가 활동면 상부에 설치된 경우 수압-변위 동시 상승은 전단 강도 저하를 강하게 시사합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 사면 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "후보 추정",
          "body": "변위 집중 심도를 활동면 추정 후보로 기록합니다."
        },
        {
          "title": "진행 판단",
          "body": "후보 심도·변위속도 변화 추적"
        },
        {
          "title": "설계 검증",
          "body": "보강 후 후보 이동·속도 감소 여부 확인"
        }
      ],
      "principle": "<p>활동면에서 전단 변형이 집중될 수 있으며 지중경사계는 해당 심도에서 변위 기울기가 클 수 있습니다. 간극수압·지하수위·강우·균열·지표변위와 함께 해석해야 하며, 단일 IPI 최대 기울기만으로 활동면을 확정하지 않습니다.</p>",
      "installation": [
        "예상 활동면 관통 단면에 센서형 다단식 지중경사계 설치",
        "활동면 상 · 하부에 간극수압계 배치",
        "표면 변위 측점 · 지하수위 · 강우 계측을 동시에 운영",
        "현장관찰 · 균열 · 침하 데이터와 시간 동기화",
        "위험 시 계측 빈도를 높",
        "해석 소프트웨어와 프로파일을 비교 · 후보를 정교화"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "초기",
            "지중경사 프로파일",
            "설계 가정 vs 후보"
          ],
          [
            "강우 · 우기",
            "집중 심도 · 속도",
            "후보 정교화"
          ],
          [
            "가속 시",
            "변위속도",
            "진행성 판단"
          ],
          [
            "보강 후",
            "심도 이동",
            "효과 검증"
          ],
          [
            "장기",
            "잔류 변위",
            "관리 · 유지"
          ]
        ]
      },
      "data": {
        "headers": [
          "해석",
          "데이터",
          "의미"
        ],
        "rows": [
          [
            "변위 집중 심도",
            "지중경사계",
            "활동면 추정 후보"
          ],
          [
            "상부 간극수압",
            "간극수압계",
            "전단 저항 보조"
          ],
          [
            "속도 증가",
            "시계열",
            "진행성"
          ],
          [
            "보강 후",
            "비교",
            "효과"
          ]
        ]
      },
      "criteria": "<p>사면 관리기준은 설계 안정율, 붕괴 위험 등급, 인접 시설물에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 변위속도·강우 후 반응 기준을 병행합니다. 한계 초과 시 대피·공사 중지·보강을 검토하는 관리 단계를 운영할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "활동면은 한 번에 확정되나요?",
          "a": "아닙니다. IPI 집중 심도는 추정 후보며, 지질·수압·균열·침하·현장관찰을 종합해 정교화합니다."
        },
        {
          "q": "평면·원호 중 어떤 모델?",
          "a": "지질·지형에 따라 다릅니다. 계측 프로파일 형태로 가설을 검증합니다."
        },
        {
          "q": "보강 후 활동면이 이동하나요?",
          "a": "변위 집중 심도·속도 변화로 보강 효과를 판단합니다. 후보 이동·재형성 시 추가 대책을 검토합니다."
        },
        {
          "q": "간극수압계는 어디에 두나요?",
          "a": "활동면 상·하부와 배수 상태를 함께 보는 위치에 배치합니다. 강우·수위와 시간 동기화합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        {
          "id": "IMG-016",
          "caption": "원호활동면 — IPI 프로파일·활동면 추정 후보",
          "figureNo": 2
        },
        {
          "id": "IMG-017",
          "caption": "평면활동면 해석 — 암반 사면 평면 파괴",
          "figureNo": 3
        }
      ]
    },
    "metaDescription": "활동면의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.2",
        "label": "사면·절토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/slope/rainfall": {
    "id": "fields/slope/rainfall",
    "title": "강우",
    "sections": {
      "overview": "<p><strong>강우</strong> 계측은 <strong>기상계측기</strong>(강우량계)로 사면에 영향을 주는 강수를 기록하고, <strong>지중경사계</strong>·<strong>지하수위계</strong> 변위와 시간차 상관분석을 수행합니다. 사면 붕괴는 많은 경우 강우 후 지하수위 상승·간극수압 증가와 연관됩니다.</p><p>누적 강우·강우 강도·선행 강우 조건을 위험도 평가에 반영합니다.</p><p>강우 계측은 시간 강우량·일 강우량·누적 강우를 함께 관리합니다. 선행 강우로 지반이 포화된 상태에서 추가 강우가 오면 변위 반응이 증폭될 수 있어 3일·7일 누적 강우 기준을 병행하기도 합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 사면 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "강우 기록",
          "body": "시간별·일별 강우량을 축적합니다."
        },
        {
          "title": "상관 분석",
          "body": "강우-수위-변위 지연 시간을 파악합니다."
        },
        {
          "title": "경보",
          "body": "임계 강우 시 계측 강화·대피를 연계합니다."
        }
      ],
      "principle": "<p>강우는 지표 침투→지하수위 상승→간극수압 증가→전단강도 저하 순으로 작용합니다. 지체 시간은 지질·심도에 따라 수시간~수일입니다.</p>",
      "installation": [
        "사면 대표 지점에 강우량계 설치",
        "지중경사계 · 지하수위계와 동일 데이터로거에 연동",
        "풍 · 온도 센서를 보완",
        "원격 실시간 수신 설정",
        "임계 강우 경보 규칙을 정의",
        "과거 붕괴 · 위험 사례와 비교"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "평상시",
            "강우 · 수위",
            "기준 추세"
          ],
          [
            "강우 예보",
            "계측 빈도",
            "경보 준비"
          ],
          [
            "강우 중 · 후",
            "수위 · 변위",
            "지체 시간"
          ],
          [
            "임계 초과",
            "변위 가속",
            "대피 · 공사 중지"
          ],
          [
            "건기",
            "회복 추세",
            "기준 갱신"
          ]
        ]
      },
      "data": {
        "headers": [
          "강우 조건",
          "반응",
          "조치"
        ],
        "rows": [
          [
            "일강우 80mm+",
            "수위 상승",
            "계측 강화"
          ],
          [
            "연속 강우",
            "변위 가속",
            "경보"
          ],
          [
            "선행 강우",
            "지연 변위",
            "잠재 위험"
          ],
          [
            "태풍",
            "복합",
            "24h 모니터링"
          ]
        ]
      },
      "criteria": "<p>사면 관리기준은 설계 안정율, 붕괴 위험 등급, 인접 시설물에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 변위속도·강우 후 반응 기준을 병행합니다. 한계 초과 시 대피·공사 중지·보강을 검토하는 관리 단계를 운영할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "강우량계만 있으면 충분한가요?",
          "a": "변위·수위 계측과 반드시 연계해야 합니다. 강우는 원인 변수입니다."
        },
        {
          "q": "지체 시간은 어떻게 알 수 있나요?",
          "a": "과거 이벤트 상관그래프로 현장별 지체를 추정합니다."
        },
        {
          "q": "강우 강도와 누적 강우 중 무엇이 중요한가요?",
          "a": "사면 재질·배수에 따라 다릅니다. 둘 다 기록하고 변위·수위 반응과 상관분석합니다."
        },
        {
          "q": "원격 강우만으로 경보 가능한가요?",
          "a": "가능하나 지중경사계·수위 계측과 연동된 규칙이어야 오경보를 줄일 수 있습니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "강우의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.2",
        "label": "사면·절토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/slope/drainage": {
    "id": "fields/slope/drainage",
    "title": "배수시설",
    "sections": {
      "overview": "<p><strong>배수시설</strong> 계측은 사면 배수공·측구·지하배수의 효과를 <strong>지하수위계</strong>, <strong>간극수압계</strong>, 유량계로 검증합니다. 배수 불량은 간극수압 상승·변위 가속의 주요 원인입니다.</p><p>보강공 시공 전후 수위·간극수압·변위 변화를 비교해 배수 성능을 정량 평가합니다.</p><p>배수시설 계측은 보수 전후 수위·간극수압·변위속도를 비교해 정량적으로 효과를 입증합니다. 막힘 의심 시 내시경·유량 측정을 병행하고, 배수 공사 후에도 1~2 우기 관찰 기간을 둡니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 사면 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "배수 효과",
          "body": "수위·간극수압 저하 확인"
        },
        {
          "title": "막힘 감지",
          "body": "수위 재상승으로 배수 불량을 포착합니다."
        },
        {
          "title": "유지관리",
          "body": "배수공 청소·보수 시기를 결정합니다."
        }
      ],
      "principle": "<p>배수는 간극수압을 소산시켜 유효응력·전단강도를 회복시킵니다. 배수 경로상 수위·압력 변화로 성능을 판단합니다.</p>",
      "installation": [
        "배수공 상 · 하류 · 측면에 관측공을 둡니다",
        "배수 전후 간극수압계를 비교 배치",
        "유량계가 있으면 유량 추세 기록",
        "시공 전 기준 데이터를 확보",
        "보수 후 효과를 재평가",
        "지중경사계와 연계"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "시공 전",
            "수위 · 간극수압",
            "기준선"
          ],
          [
            "배수 시공",
            "유량 · 수위",
            "즉시 효과"
          ],
          [
            "운영 중",
            "막힘 · 재상승",
            "청소 · 보수"
          ],
          [
            "강우 후",
            "변위속도",
            "배수 성능"
          ],
          [
            "보수 후",
            "전후 비교",
            "효과 재평가"
          ]
        ]
      },
      "data": {
        "headers": [
          "지표",
          "개선 시",
          "악화 시"
        ],
        "rows": [
          [
            "지하수위",
            "하강",
            "재상승 → 막힘"
          ],
          [
            "간극수압",
            "소산",
            "고수준 유지"
          ],
          [
            "변위속도",
            "감소",
            "재가속"
          ],
          [
            "유량",
            "안정",
            "감소"
          ]
        ]
      },
      "criteria": "<p>사면 관리기준은 설계 안정율, 붕괴 위험 등급, 인접 시설물에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 변위속도·강우 후 반응 기준을 병행합니다. 한계 초과 시 대피·공사 중지·보강을 검토하는 관리 단계를 운영할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "배수공 계측 없이 변위만 보면?",
          "a": "원인 분리가 어렵습니다. 수위·간극수압으로 배수 효과를 확인해야 합니다."
        },
        {
          "q": "배수 후에도 변위가 증가하면?",
          "a": "활동면 깊이·보강 부족·추가 강우를 검토합니다."
        },
        {
          "q": "배수공 효과는 어떻게 검증하나요?",
          "a": "배수 전후 지하수위·간극수압·변위속도 변화를 비교합니다."
        },
        {
          "q": "배수공 막힘 징후는?",
          "a": "강우 후 수위 상승 지연이 길어지고 변위속도가 증가할 수 있습니다. 정기 점검·청소 이력과 대조합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.2 — 사면·절토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "배수시설의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.2",
        "label": "사면·절토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/soft-ground/settlement": {
    "id": "fields/soft-ground/settlement",
    "title": "침하",
    "sections": {
      "overview": "<p><strong>연약지반 침하</strong>는 성토·건물 하중에 따른 수직 변형을 <strong>침하계</strong>로 측정합니다. 연약지반은 장기 압밀 침하가 특징이며, 시간-침하 곡선으로 최종 침하·잔류침하를 예측합니다.</p><p><strong>간극수압계</strong> 소산과 연계해 성토 속도·다음 단계 성토 시점을 결정합니다.</p><p>연약지반 침하는 성토 속도·간극수압 소산·측방변위를 동시에 만족할 때만 다음 단계 성토를 진행합니다. Asaoka·하이퍼볼릭 피팅 등으로 잔류침하를 예측하고, 공용 구조물 하중 단계와 구분해 기준을 설정합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 연약 지반 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "압밀 진행",
          "body": "시간-침하 곡선으로 압밀 상태 확인"
        },
        {
          "title": "성토 제어",
          "body": "허용 침하·속도 내에서 성토 속도를 조정합니다."
        },
        {
          "title": "예측",
          "body": "최종 침하량을 추정합니다."
        }
      ],
      "principle": "<p>침하는 유효응력 증가에 따른 압밀·크리프입니다. 하이퍼볼릭·대수 곡선 피팅으로 잔류침하를 추정합니다.</p>",
      "installation": [
        "성토 전 침하계를 설치 · 초기치를 확보",
        "기준점을 안정 지반에 고정",
        "성토 단계별 계측 빈도를 높",
        "간극수압계와 동일 단면에 배치",
        "성토고 · 하중 이력과 연동",
        "원격계측으로 야간 성토를 감시"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "성토 전",
            "침하계 · 간극수압 초기치",
            "기준점 · 지반조사"
          ],
          [
            "1단 성토",
            "즉시침하 · 간극수압 상승",
            "공극압 실화"
          ],
          [
            "성토 진행",
            "침하속도 · 소산",
            "다음 단계 · 속도 조정"
          ],
          [
            "안정화",
            "잔류침하 추세",
            "최종 고 예측"
          ],
          [
            "개량 후",
            "총침하 비교",
            "효과 검증"
          ]
        ]
      },
      "data": {
        "headers": [
          "곡선",
          "의미",
          "활용"
        ],
        "rows": [
          [
            "초기 급침하",
            "즉시 침하",
            "공극압 실화"
          ],
          [
            "압밀 구간",
            "로그 시간",
            "압밀계수"
          ],
          [
            "잔류",
            "안정화",
            "최종 고"
          ],
          [
            "재상승",
            "간극수압",
            "성토 속도"
          ]
        ]
      },
      "criteria": "<p>연약지반 기준은 성토 안정율, 허용 침하, 허용 측방변위, 간극수압 소산율에 따라 설정합니다. 성토 중 급격한 침하·측방변위·간극수압 재상승 시 성토 중지·속도 조정을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "침하가 설계보다 크면?",
          "a": "성토 속도·지반개량·공법을 검토합니다. 층별침하로 원인 지층을 확인합니다."
        },
        {
          "q": "침하 속도가 빨라지면?",
          "a": "성토 중지·간극수압 확인이 필요할 수 있습니다."
        },
        {
          "q": "성토를 중지해야 하는 경우는?",
          "a": "침하속도·간극수압이 급증하거나 관리기준을 초과할 때입니다. 계측관리계획서에 따라 조정합니다."
        },
        {
          "q": "최종 침하는 어떻게 예측하나요?",
          "a": "시간-침하 곡선·압밀 이론과 현장 데이터를 병행합니다. 현장별 검증이 필요합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "침하의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.4",
        "label": "연약지반·성토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.4",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/soft-ground/layer-settlement": {
    "id": "fields/soft-ground/layer-settlement",
    "title": "층별침하",
    "sections": {
      "overview": "<p><strong>층별침하</strong>는 지중 여러 심도에서 발생하는 침하를 <strong>층별침하계</strong>로 분리 측정합니다. 총 침하만으로는 어느 연약층·매립층에서 침하가 집중되는지 알 수 없어, 지반개량 효과·잔류침하 위험 판단에 필수입니다.</p><p>압밀층 위치·두께와 침하 기여도를 정량화합니다.</p><p>층별침하 데이터는 지반개량 공법(PBD 간격·SD 깊이) 검증에 직접 활용됩니다. 특정 층만 침하가 지속되면 해당 층 추가 개량·공법 변경을 검토하며, 총침하계와의 차이는 기준점·측정 오차 점검에 사용합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 연약 지반 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "지층 분리",
          "body": "층별 기여 침하를 산정합니다."
        },
        {
          "title": "개량 검증",
          "body": "PBD·SD·교반 등 개량층 효과를 평가합니다."
        },
        {
          "title": "잔류 위험",
          "body": "미압밀층 잔류침하를 예측합니다."
        }
      ],
      "principle": "<p>층별침하계는 앵커·마그네트 반복 측정으로 구간별 상대 침하를 산출합니다. 각 구간 길이로 나누어 층별 침하율을 계산합니다.</p>",
      "installation": [
        "지반조사 심도 기준 계측 공을 시공",
        "연약층 상 · 하부에 앵커 배치",
        "성토 전 설치 · 초기치를 확보",
        "성토 중 · 후 정기 계측",
        "간극수압 · 총침하와 통합",
        "데이터로거 자동 수집 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "성토 전",
            "층별 · 총침하",
            "초기치 · 앵커"
          ],
          [
            "1단 성토",
            "즉시 · 층별",
            "압밀 반응"
          ],
          [
            "성토 진행",
            "층별 기여도",
            "속도 · 한도"
          ],
          [
            "프리로드",
            "잔류 압밀",
            "다음 단계"
          ],
          [
            "준공",
            "최종 침하",
            "잔류 위험"
          ]
        ]
      },
      "data": {
        "headers": [
          "층",
          "침하율",
          "판단"
        ],
        "rows": [
          [
            "매립층",
            "급속",
            "즉시 침하"
          ],
          [
            "연약점토",
            "장기",
            "압밀"
          ],
          [
            "개량층",
            "감소",
            "효과"
          ],
          [
            "하부 모래",
            "미소",
            "기준"
          ]
        ]
      },
      "criteria": "<p>연약지반 기준은 성토 안정율, 허용 침하, 허용 측방변위, 간극수압 소산율에 따라 설정합니다. 성토 중 급격한 침하·측방변위·간극수압 재상승 시 성토 중지·속도 조정을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "침하계와 함께 써야 하나요?",
          "a": "총침하 검증·기준점 안정성 확인에 침하계 병행이 좋습니다."
        },
        {
          "q": "한 층만 침하하면?",
          "a": "해당 층 압밀·개량 필요성을 집중 검토합니다."
        },
        {
          "q": "층별침하와 표고침하를 같이 써야 하나요?",
          "a": "연약층 구분이 필요하면 층별침하계, 총 침하만 필요하면 표고침하·자동광파기를 씁니다."
        },
        {
          "q": "압밀과 즉시침하 구분은?",
          "a": "초기 급침하 후 장기 수렴 곡선으로 구분합니다. 공수·하중 이력과 함께 해석합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "층별침하의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.4",
        "label": "연약지반·성토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.4",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/soft-ground/pore-pressure": {
    "id": "fields/soft-ground/pore-pressure",
    "title": "간극수압",
    "sections": {
      "overview": "<p><strong>연약지반 간극수압</strong>은 성토 하중에 따른 토층 내부 수압을 <strong>간극수압계</strong>로 측정합니다. 간극수압 소산은 압밀 진행·강도 증가의 지표이며, 소산 지연은 성토 불안정·한도 초과 신호입니다.</p><p>성토 속도 결정·다음 단계 성토·프리로딩 해제 시점의 핵심 근거입니다.</p><p>간극수압 소산 곡선에서 t50·Cv 추정으로 압밀 성숙도를 판단합니다. 성토 중 B-bar·Δu 모니터링으로 즉시 안정을 평가하고, 우기·지하수위 상승 시 간극수압 재상승 여부를 확인합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 연약 지반 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "소산 추적",
          "body": "시간에 따른 간극수압 감소 확인"
        },
        {
          "title": "성토 한도",
          "body": "허용 간극수압 대비 성토 속도를 조정합니다."
        },
        {
          "title": "안정",
          "body": "급격한 수압 상승 시 성토 중지 검토"
        }
      ],
      "principle": "<p>성토 → 간극수압 상승 → 배수 경로로 소산 → 유효응력 증가. Piezometer는 특정 지층 압력을 직접 측정합니다.</p>",
      "installation": [
        "연약층 · 성토체 접촉부에 간극수압계 설치",
        "필터부가 목적 지층과 수리적으로 연결되게",
        "성토 전 초기 수압 기록",
        "성토 단계별 고빈도 계측",
        "지하수위계와 비교",
        "자동 경보 한계 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "성토 전",
            "간극수압",
            "초기 수압"
          ],
          [
            "하중 재하",
            "상승 · 소산",
            "B값 · 속도"
          ],
          [
            "소산 지연",
            "수압 · 침하",
            "성토 중지"
          ],
          [
            "다음 단계",
            "허용 수압",
            "성토 고 · 속도"
          ],
          [
            "안정",
            "장기 소산",
            "해제 · 준공"
          ]
        ]
      },
      "data": {
        "headers": [
          "패턴",
          "의미",
          "조치"
        ],
        "rows": [
          [
            "상승 후 소산",
            "정상 압밀",
            "다음 성토 검토"
          ],
          [
            "소산 지연",
            "배수 불량 · 속도 과다",
            "성토 중지"
          ],
          [
            "재상승",
            "추가 하중",
            "속도 조정"
          ],
          [
            "B값 추세",
            "압밀도",
            "예측"
          ]
        ]
      },
      "criteria": "<p>연약지반 기준은 성토 안정율, 허용 침하, 허용 측방변위, 간극수압 소산율에 따라 설정합니다. 성토 중 급격한 침하·측방변위·간극수압 재상승 시 성토 중지·속도 조정을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "간극수압 0에 가까우면?",
          "a": "배수 조건·필터 막힘·공기 혼입을 점검합니다."
        },
        {
          "q": "침하와 수압 중 무엇이 우선?",
          "a": "둘 다 필수입니다. 수압은 안정, 침하는 변형 결과입니다."
        },
        {
          "q": "간극수압과 층별 수압계 차이는?",
          "a": "목적 지층·심도에 맞게 선택합니다. 연약층 압밀·안정 해석에 필요한 위치에 배치합니다."
        },
        {
          "q": "하중 재분배 시 수압 급변은?",
          "a": "굴착·말뚝 타설 등 공정 변화와 시간 동기화해 정상 반응인지 판단합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "간극수압의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.4",
        "label": "연약지반·성토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.4",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/soft-ground/lateral-flow": {
    "id": "fields/soft-ground/lateral-flow",
    "title": "측방유동",
    "sections": {
      "overview": "<p><strong>측방유동</strong> 계측은 연약지반 성토 시 측방으로 지반이 밀려나는 현상을 <strong>지중경사계</strong>, <strong>간극수압계</strong>로 감시합니다. 측방유동은 성토 안정 파괴의 한 형태로, 급격한 수평변위·지표 균열·성토체 슬립과 연관됩니다.</p><p>성토 속도·성토고·지반 강도·배수 조건과 함께 통합 판단합니다.</p><p>측방유동 징후는 지중경사계 수평변위 가속·지표 균열·성토체 슬립과 연계됩니다. 한계 상태 근접 시 성토 중지·성토고 감소·반치 공법·지반置換 등을 검토하며, 야간 성토는 자동 경보가 필수입니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 연약 지반 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "수평변위",
          "body": "성토체·연약층 측방 변위 추적"
        },
        {
          "title": "안정",
          "body": "허용 측방변위·속도 내인지 확인합니다."
        },
        {
          "title": "조기 경보",
          "body": "가속 징후 시 성토 중지를 연계합니다."
        }
      ],
      "principle": "<p>측방유동은 연약층 전단강도 초과 시 발생합니다. 지중경사계는 측방 수평변위, 간극수압은 전단 저항 상태를 나타냅니다.</p>",
      "installation": [
        "성토체 측면 · 연약층에 지중경사계 설치",
        "성토 방향에 수직인 측정축 설정",
        "간극수압계를 연약층에 배치",
        "성토 단계 · 고를 일지와 연동",
        "지표 균열 · 변위 측점을 보완",
        "실시간 경보 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "성토 전",
            "지중경사 · 수압",
            "초기치"
          ],
          [
            "성토 진행",
            "측방 변위",
            "속도 · 한도"
          ],
          [
            "가속 징후",
            "수평 · 지표",
            "성토 중지"
          ],
          [
            "속도 조정",
            "간극수압",
            "안정 회복"
          ],
          [
            "준공",
            "잔류 변위",
            "보강 검증"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "센서",
          "대응"
        ],
        "rows": [
          [
            "측방 변위 증가",
            "지중경사계",
            "성토 중지"
          ],
          [
            "간극수압 상승",
            "간극수압계",
            "속도 감소"
          ],
          [
            "지표 균열",
            "육안 · 균열계",
            "긴급 조사"
          ],
          [
            "가속",
            "속도 그래프",
            "보강 · 공법"
          ]
        ]
      },
      "criteria": "<p>연약지반 기준은 성토 안정율, 허용 침하, 허용 측방변위, 간극수압 소산율에 따라 설정합니다. 성토 중 급격한 침하·측방변위·간극수압 재상승 시 성토 중지·속도 조정을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "측방유동과 활동면 차이는?",
          "a": "측방유동은 성토 하중에 의한 연약지반 밀림, 활동면은 사면 전단 파괴입니다. 계측 배치는 유사합니다."
        },
        {
          "q": "성토고를 낮추면?",
          "a": "측방변위·간극수압 반응으로 효과를 계측으로 확인합니다."
        },
        {
          "q": "측방향 유동과 지반 융기를 어떻게 구분하나요?",
          "a": "수평변위 방향·지표 융기·지중경사 프로파일을 함께 봅니다. 연약층 두께·하중 조건이 핵심입니다."
        },
        {
          "q": "말뚝 공사 시 측방향 변위 기준은?",
          "a": "설계·계측관리계획서에 따릅니다. 인접 구조물·지하매설물 계측과 연계합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.4 — 연약지반·성토 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "측방유동의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.4",
        "label": "연약지반·성토 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.4",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/structural-safety/crack": {
    "id": "fields/structural-safety/crack",
    "title": "균열",
    "sections": {
      "overview": "<p><strong>균열</strong> 계측은 구조물·암반·콘크리트 표면의 균열 폭 변화를 <strong>균열계</strong>로 정량 관리합니다. 인접 굴착·침하·온도·하중에 따른 균열 진행은 구조 안전의 직접 지표입니다.</p><p>절대 폭보다 시간에 따른 증가 추세·온도 보정 후 변화가 중요하며, 복수 균열의 동시 진행은 전체적 응력 재분배를 시사합니다.</p><p>균열 계측은 구조도·균열 맵과 연동해 관리합니다. 온도 보정 후 균열 속도(mm/월)가 기준을 초과하면 원인(기초·인접 공사·과하중) 조사를 실시하고, 복수 균열 동시 진행은 전체 거동 악화 신호로 봅니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 구조물 안전 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "진행 추적",
          "body": "균열 폭·길이 변화 기록"
        },
        {
          "title": "원인 구분",
          "body": "온도 반복 vs 구조적 진행을 구분합니다."
        },
        {
          "title": "조기 대응",
          "body": "급격한 확대 시 보수·공법 조정을 연계합니다."
        }
      ],
      "principle": "<p>균열계는 두 판 사이 변위를 측정해 폭으로 환산합니다. 인장 균열·전단 균열 위치는 응력 상태를 반영합니다.</p>",
      "installation": [
        "기존 · 신규 대표 균열에 균열계 설치",
        "위치 사진 · 좌표 기록",
        "온도 측정을 보완",
        "인접 공사 전 사전 계측 실시",
        "정기 · 이벤트 계측 일정을 둡니다",
        "경사 · 변위 계측과 통합"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "사전조사",
            "균열 폭 · 사진",
            "초기치"
          ],
          [
            "인접공사 전",
            "온도 · 폭",
            "기준선"
          ],
          [
            "공사 중",
            "추세 · 급변",
            "협의 · 조정"
          ],
          [
            "이벤트",
            "복수 균열",
            "긴급 점검"
          ],
          [
            "장기",
            "잔류 추세",
            "보수 시기"
          ]
        ]
      },
      "data": {
        "headers": [
          "패턴",
          "해석",
          "조치"
        ],
        "rows": [
          [
            "일교차",
            "온도",
            "정상"
          ],
          [
            "단방향 증가",
            "구조",
            "조사"
          ],
          [
            "급확대",
            "이벤트",
            "긴급"
          ],
          [
            "복수 동시",
            "전체 거동",
            "종합 분석"
          ]
        ]
      },
      "criteria": "<p>균열 관리기준은 구조 유형·용도·중요도에 따라 설계·유지관리 지침을 따릅니다. 온도 보정 후 폭 증가 속도·복수 균열 동시 진행 시 조사·보강을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "균열 폭 몇 mm부터 위험?",
          "a": "구조·재료·위치마다 다릅니다. 추세와 설계 기준이 더 중요합니다."
        },
        {
          "q": "균열이 멈추면?",
          "a": "안정화일 수 있으나 하중·환경 변화 시 재개할 수 있어 지속 관찰합니다."
        },
        {
          "q": "온도 보정은 필수인가요?",
          "a": "콘크리트·외벽 균열은 일교차에 민감합니다. 온도 기록과 함께 단방향 증가만 이상으로 판단합니다."
        },
        {
          "q": "인접 굴착과 연계?",
          "a": "굴착·양수 일지와 시간 동기화해 균열 급변 시 원인 분석·공정 조정을 검토합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": [
        "IMG-005"
      ]
    },
    "metaDescription": "균열의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.6",
        "label": "구조물 안전계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공·유지관리 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.6",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/structural-safety/tilt": {
    "id": "fields/structural-safety/tilt",
    "title": "경사",
    "sections": {
      "overview": "<p><strong>구조물 경사</strong> 계측은 건물·교각·옹벽·기둥의 기울기 변화를 <strong>구조물경사계</strong>로 측정합니다. 부등침하·기초 변형·인접 굴착은 회전 변형으로 나타나며, 경사 증가는 즉각적인 안전 검토가 필요할 수 있습니다.</p><p>침하계·균열계·변위계와 함께 원인을 추정합니다.</p><p>구조물 경사는 높이가 클수록 상부 변위 증폭이 크므로 층별·높이별 해석이 필요합니다. 인접 굴착 시 경사·침하·균열을 일일 또는 실시간으로 연계 모니터링하며, 급변 시 공사 중지 협의 절차를 사전에 정합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 구조물 안전 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "회전 변형",
          "body": "구조물 기울기 변화 추적"
        },
        {
          "title": "부등침하",
          "body": "기초 불균등 침하 징후를 포착합니다."
        },
        {
          "title": "인접 영향",
          "body": "굴착·터널 영향을 정량 평가합니다."
        }
      ],
      "principle": "<p>경사계는 중력 기준 또는 기준축 대비 각도 변화를 측정합니다. 양방향(2축) 설치로 회전 평면을 파악합니다.</p>",
      "installation": [
        "구조물 모서리 · 기둥에 경사계 설치",
        "수직 · 수평 두 방향을 측정",
        "기준점 · 온도 영향 기록",
        "인접 공사 전 초기치를 확보",
        "자동 수집 · 경보 설정",
        "변위 · 균열과 시간 동기화"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "초기",
            "2축 경사",
            "기준 · 온도"
          ],
          [
            "인접공사",
            "경사 · 침하",
            "부등침하"
          ],
          [
            "급변",
            "굴착 일지",
            "공정 조정"
          ],
          [
            "계절",
            "주기 변동",
            "정상 vs 이상"
          ],
          [
            "장기",
            "누적 경사",
            "보강 · 기초"
          ]
        ]
      },
      "data": {
        "headers": [
          "변화",
          "연계",
          "판단"
        ],
        "rows": [
          [
            "경사 증가",
            "침하계",
            "부등침하"
          ],
          [
            "급변",
            "굴착 일지",
            "인접 공사"
          ],
          [
            "주기 변동",
            "온도",
            "정상"
          ],
          [
            "비대칭",
            "복수 측점",
            "회전축"
          ]
        ]
      },
      "criteria": "<p>경사 허용값은 구조물 높이·기초 형식·인접 공사에 따라 계획서에 명시합니다. 급격한 경사 증가·비대칭 회전은 부등침하·기초 이상 징후로 1차 점검합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "경사계와 GNSS 차이는?",
          "a": "경사계는 국부 회전, GNSS는 절대 3D 변위입니다. 규모에 따라 선택합니다."
        },
        {
          "q": "경사 0.1% 증가는?",
          "a": "구조물 높이·기준에 따라 영향이 다릅니다. 계획서 기준을 따릅니다."
        },
        {
          "q": "2축 설치 이유는?",
          "a": "부등침하·회전 평면을 파악하려면 수직·수평 두 방향 측정이 일반적입니다."
        },
        {
          "q": "침하계와 함께 보면?",
          "a": "경사 증가와 차등 침하가 동시에 나타나면 기초·지반 불균등을 의심합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": [
        "IMG-038"
      ]
    },
    "metaDescription": "경사의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.6",
        "label": "구조물 안전계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공·유지관리 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.6",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/structural-safety/displacement": {
    "id": "fields/structural-safety/displacement",
    "title": "변위",
    "sections": {
      "overview": "<p><strong>구조물 변위</strong>는 절대·상대 이동량을 <strong>변위계</strong>, <strong>자동광파기</strong>, <strong>GNSS</strong>로 측정합니다. 교량·건물·옹벽의 수평·수직 변위는 하중·온도·지반·인접 공사의 복합 결과입니다.</p><p>기준망 안정성과 초기치 관리가 해석 품질을 결정합니다.</p><p>구조물 변위 계측은 기준망·측점망 도면을 유지관리하며, 기준점 변동 의심 시 재측량·재설치를 실시합니다. 장기 GNSS와 단기 광파기를 병행하면 단기 이벤트와 장기 추세를 동시에 관리할 수 있습니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 구조물 안전 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "절대 변위",
          "body": "3D 좌표 변화로 총 이동량을 파악합니다."
        },
        {
          "title": "상대 변위",
          "body": "부재 간 차이로 균열·이음 원인을 분석합니다."
        },
        {
          "title": "추세",
          "body": "장기 누적 변위로 유지관리를 지원합니다."
        }
      ],
      "principle": "<p>변위계는 두 점 간 상대 변위, 광파기/GNSS는 절대 좌표 변화를 제공합니다. 온도·하중 이벤트를 분리합니다.</p>",
      "installation": [
        "안정 기준점 · 측점망을 설계",
        "변위계 · 프리즘을 구조물에 설치",
        "초기 좌표 · 변위를 반복 측정",
        "대기 · 시야 조건을 일지에 기록",
        "자동광파기 주기 · 경보 설정",
        "균열 · 경사와 통합 분석"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "기준망",
            "절대 · 상대",
            "기준점 안정"
          ],
          [
            "평상시",
            "3D 좌표",
            "온도 · 하중"
          ],
          [
            "인접공사",
            "속도 · 누적",
            "경보"
          ],
          [
            "이벤트",
            "지진 · 발파",
            "피크 · 잔류"
          ],
          [
            "유지관리",
            "장기 추세",
            "보수 판단"
          ]
        ]
      },
      "data": {
        "headers": [
          "성분",
          "도구",
          "해석"
        ],
        "rows": [
          [
            "수직",
            "침하계, 광파기",
            "침하 · 처짐"
          ],
          [
            "수평",
            "광파기, GNSS",
            "이동 · 밀림"
          ],
          [
            "상대",
            "변위계",
            "균열 · 이음"
          ],
          [
            "속도",
            "시계열",
            "진행성"
          ]
        ]
      },
      "criteria": "<p>변위 기준은 절대·상대·속도 한계를 병행 설정합니다. 기준점 불안정·인접 굴착 이벤트와 연동해 이탈 시 공사 중지·보강을 협의합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "기준점이 움직이면?",
          "a": "전체 변위가 왜곡됩니다. 기준점은 영향권 밖 안정 지반에 둡니다."
        },
        {
          "q": "GNSS 정밀도는?",
          "a": "mm~cm 수준이며, 장기 추세에 유리합니다. 단기 고정밀은 광파기가 적합합니다."
        },
        {
          "q": "상대 vs 절대 변위?",
          "a": "변위계는 부재 간 상대, 광파기·GNSS는 절대 좌표 변화입니다. 목적에 따라 병행합니다."
        },
        {
          "q": "온도·하중 이벤트는?",
          "a": "교량·건물은 온도팽창·교통하중이 변위에 겹칩니다. 이벤트 태그와 분리 해석합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": [
        "IMG-042",
        "IMG-043"
      ]
    },
    "metaDescription": "변위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.6",
        "label": "구조물 안전계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공·유지관리 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.6",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/structural-safety/vibration": {
    "id": "fields/structural-safety/vibration",
    "title": "진동",
    "sections": {
      "overview": "<p><strong>구조물 진동</strong> 계측은 인접 발파·공사·교통·지진에 의한 구조물 동적 응답을 <strong>진동계</strong>로 측정합니다. 고유진동수 변화·과도 응답 증가는 강성 저하·연결부 손상·기초 문제 징후일 수 있습니다.</p><p>구조물 안전 기준과 인체·민원 기준을 구분 적용합니다.</p><p>구조물 진동은 인접 발파·철도·공장 가동과 연계될 수 있어 이벤트 로그가 중요합니다. 기준 초과 시 공법 변경·방진벽·작업 시간 조정 등을 검토하고, 구조 응답 변화는 상세 안전 점검으로 이어질 수 있습니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 구조물 안전 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "동적 특성",
          "body": "고유진동수·감쇠를 파악합니다."
        },
        {
          "title": "이벤트",
          "body": "발파·지진 응답 기록"
        },
        {
          "title": "손상",
          "body": "장기 특성 변화 추적"
        }
      ],
      "principle": "<p>가속도·속도 센서로 시간 이력·스펙트럼을 분석합니다. FFT·모달 분석으로 특성을 추출합니다.</p>",
      "installation": [
        "구조물 대표 부위에 센서 설치",
        "샘플링 · 트리거 설정",
        "기준 응답 기록",
        "발파 · 공사 일정과 연동",
        "민원 구간은 연속 모니터링",
        "데이터로거 · 원격 전송을 구성"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "기준",
            "고유진동수",
            "건전 상태"
          ],
          [
            "발파 · 공사",
            "PPV · 이벤트",
            "작업 한도"
          ],
          [
            "지진",
            "가속도 · 잔류",
            "피해 평가"
          ],
          [
            "민원 구간",
            "RMS",
            "연속 모니터링"
          ],
          [
            "장기",
            "특성 변화",
            "손상 추적"
          ]
        ]
      },
      "data": {
        "headers": [
          "지표",
          "기준",
          "활용"
        ],
        "rows": [
          [
            "PPV",
            "발파 · 공사",
            "작업 중지"
          ],
          [
            "고유진동수",
            "구조",
            "손상"
          ],
          [
            "RMS",
            "교통",
            "민원"
          ],
          [
            "지속시간",
            "지진",
            "피해 평가"
          ]
        ]
      },
      "criteria": "<p>구조물 진동은 고유진동수·PPV·RMS 한계를 목적별(구조·민원)로 구분합니다. 발파·철도·공장 가동 이벤트 전후 비교와 기준 초과 시 공법 조정을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "진동이 크지만 균열이 없으면?",
          "a": "동적 허용 범위 내일 수 있습니다. 반복·누적 영향은 별도 검토합니다."
        },
        {
          "q": "가속도 vs 속도?",
          "a": "발파 기준은 종종 속도(PPV), 구조 해석은 가속도를 사용합니다."
        },
        {
          "q": "구조물 vs 인체 기준?",
          "a": "안전 해석과 민원·환경 기준은 다릅니다. 계획서에 목적별 한계를 구분해 둡니다."
        },
        {
          "q": "고유진동수 변화는?",
          "a": "강성 저하·연결부 손상·기초 문제 징후일 수 있습니다. 기준 응답과 비교합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.6 — 구조물 안전계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공·유지관리 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "data": [
        "IMG-041"
      ]
    },
    "metaDescription": "진동의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.6",
        "label": "구조물 안전계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공·유지관리 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.6",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/railway/track-settlement": {
    "id": "fields/railway/track-settlement",
    "title": "노반침하",
    "sections": {
      "overview": "<p><strong>노반침하</strong>는 철도 노반·궤도 하부 지반의 수직 변형을 <strong>침하계</strong>, <strong>자동광파기</strong>로 고빈도 측정합니다. 허용 침하가 매우 작아 mm 단위 관리가 필요하며, 인접 굴착·터널·보강공 영향을 실시간 추적합니다.</p><p>운행 제한·속도 제한 기준과 즉시 연계됩니다.</p><p>노반침하는 철도 운영사·시공사·감리가 공유하는 실시간 대시보드로 관리하는 것이 일반적입니다. 침하 속도 기준 초과 시 즉시 운행 제한·공사 중지·보강 공법 검토가 이루어지며, 계측 데이터는 사후 책임 소재 판단 자료가 됩니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 철도 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "침하 감시",
          "body": "노반 수직변위를 고빈도 추적합니다."
        },
        {
          "title": "인접공사",
          "body": "굴착·터널 영향을 실시간 평가합니다."
        },
        {
          "title": "유지보수",
          "body": "장기 침하 추세로 보수 시기를 판단합니다."
        }
      ],
      "principle": "<p>노반 침하는 지반 압밀·굴착 영향·동적 하중에 의해 발생합니다. 광파기는 3D, 침하계는 국부 수직 변위를 제공합니다.</p>",
      "installation": [
        "선로 양측 · 절개 · 교량 접속에 측점을 둡니다",
        "기준점을 영향권 밖에 설치",
        "자동광파기 주기를 시간당 이상으로 설정",
        "인접공사 구간은 실시간 경보 연동",
        "굴착 · 발파 일지와 동기화",
        "철도 운영 규정 기준 협의"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "사전 조사",
            "노반 · 궤도 초기치",
            "협약 기준선"
          ],
          [
            "인접공사",
            "침하 · 속도",
            "실시간 경보"
          ],
          [
            "발파 · 굴착",
            "이벤트 전후",
            "누적 · 속도"
          ],
          [
            "공사 완료",
            "잔류 변위",
            "복구 · 모니터링"
          ],
          [
            "장기",
            "추세",
            "유지보수"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "기준",
          "조치"
        ],
        "rows": [
          [
            "누적 침하",
            "협약 mm",
            "보강"
          ],
          [
            "침하 속도",
            "mm/일",
            "공사 중지"
          ],
          [
            "비대칭",
            "좌우 차",
            "원인 조사"
          ],
          [
            "이벤트",
            "발파 후",
            "즉시 확인"
          ]
        ]
      },
      "criteria": "<p>철도 관리기준은 철도공사·국토부·인접공사 협약 기준을 따릅니다. 허용 변위·변위속도·진동 속도가 매우 엄격하며, 기준 초과 시 운행 속도 제한·공사 중지가 즉시 검토됩니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "노반 침하 허용값은?",
          "a": "철도공사·인접공사 협약에 따르며 매우 엄격합니다. 계획서를 확인합니다."
        },
        {
          "q": "야간에만 공사하면?",
          "a": "공사 전후·야간 고빈도 계측으로 변위를 포착합니다."
        },
        {
          "q": "협약 기준 초과 시 조치는?",
          "a": "공사 중지·운행 제한·속도 제한을 즉시 검토합니다. 철도 담당자와 실시간 공유합니다."
        },
        {
          "q": "발파·굴착 이벤트 후에는?",
          "a": "이벤트 전후 계측을 분리 기록하고 누적·속도를 재평가합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "노반침하의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.7",
        "label": "철도·궤도 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.7",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/railway/track-displacement": {
    "id": "fields/railway/track-displacement",
    "title": "궤도변위",
    "sections": {
      "overview": "<p><strong>궤도변위</strong>는 선로의 수평·수직 위치 변화(선형·고저·통과·轨距)를 정밀 측량·<strong>변위계</strong>·<strong>자동광파기</strong>로 관리합니다. 인접 공사·지반 침하·온도에 따른 궤도 틀어짐은 운행 안전에 직결됩니다.</p><p>노반침하와 함께 3차원 거동을 평가합니다.</p><p>궤도변위는 선로 유지관리 TQI·통과 변위 등 철도 고유 지표와 연계됩니다. 온도·열차 하중·인접 공사를 이벤트로 태깅하면 이상 변위 원인 분석이 수월해지며, 교량 접속부는 별도 측점망을 구성합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 철도 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "선형 유지",
          "body": "평면·종단 변위 추적"
        },
        {
          "title": "통과 · 轨距",
          "body": "궤도 기하학적 변화 확인"
        },
        {
          "title": "공사 연계",
          "body": "인접공사 영향을 실시간 평가합니다."
        }
      ],
      "principle": "<p>궤도는 레일·침목·노반 시스템입니다. 변위는 지반·온도·하중의 복합 결과입니다.</p>",
      "installation": [
        "궤도 중심 · 레일 · 슬리퍼에 측점 설정",
        "자동광파기로 3D 좌표를 반복 측정",
        "필요 시 궤도 변위 전용 센서 설치",
        "온도 · 열차 통과 이벤트 기록",
        "운행 전후 계측 일정을 조정",
        "노반침하 데이터와 통합"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "사전",
            "선형 · 고저",
            "협약 기준"
          ],
          [
            "인접공사",
            "3D 변위",
            "실시간 경보"
          ],
          [
            "열차 통과",
            "이벤트",
            "동적 영향"
          ],
          [
            "공사 후",
            "잔류 틀어짐",
            "복구"
          ],
          [
            "장기",
            "온도 · 누적",
            "유지보수"
          ]
        ]
      },
      "data": {
        "headers": [
          "성분",
          "측정",
          "관리"
        ],
        "rows": [
          [
            "수평",
            "광파기",
            "선형"
          ],
          [
            "수직",
            "광파기, 침하계",
            "고저"
          ],
          [
            "통과",
            "전용 측량",
            "틀어짐"
          ],
          [
            "속도",
            "시계열",
            "긴급"
          ]
        ]
      },
      "criteria": "<p>철도 관리기준은 철도공사·국토부·인접공사 협약 기준을 따릅니다. 허용 변위·변위속도·진동 속도가 매우 엄격하며, 기준 초과 시 운행 속도 제한·공사 중지가 즉시 검토됩니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "궤도변위와 노반침하 관계는?",
          "a": "침하가 궤도 고저·통과에 영향을 줍니다. 함께 봐야 합니다."
        },
        {
          "q": "열차 운행 중 측정 가능한가요?",
          "a": "자동광파기는 운행 시간대를 피하거나 협약된 창구에 측정합니다."
        },
        {
          "q": "궤도 변위와 선로 기준은?",
          "a": "통과·수평·高低 변위를 궤도 기하 기준으로 관리합니다. 인접 공사 영향 시 빈도를 높입니다."
        },
        {
          "q": "열차 운행 중 계측 가능한가요?",
          "a": "고정 측점은 운행 외 시간에, 필요 시 선로 검측차·이동식 계측을 병행합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "궤도변위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.7",
        "label": "철도·궤도 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.7",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/railway/adjacent-construction": {
    "id": "fields/railway/adjacent-construction",
    "title": "인접공사 영향",
    "sections": {
      "overview": "<p><strong>철도 인접공사 영향</strong> 계측은 굴착·터널·말뚝·발파 등이 선로·노반·구조물에 미치는 변위·진동을 <strong>자동광파기</strong>, <strong>침하계</strong>, <strong>진동계</strong>로 통합 관리합니다. 사전 협약·관리기준·경보·운행 제한이 필수입니다.</p><p>24시간 원격계측·즉시 보고 체계가 일반적입니다.</p><p>철도 인접공사는 사전 협약서에 계측 항목·빈도·기준·보고·운행 제한 조치를 명문화합니다. 24시간 모니터링·이중화 통신·배터리 백업으로 데이터 공백을 최소화하고, 공사 종료 후에도 일정 기간 잔류 변위를 관찰합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 철도 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "사전 기준",
          "body": "공사 전 기준 상태·관리기준을 합의합니다."
        },
        {
          "title": "실시간",
          "body": "공사 중 변위·진동을 고빈도 추적합니다."
        },
        {
          "title": "운행 연계",
          "body": "기준 초과 시 운행 제한을 연계합니다."
        }
      ],
      "principle": "<p>인접공사 영향은 거리·공법·지반·굴착 심도에 비례합니다. 복수 센서 동시 변화가 신뢰도를 높입니다.</p>",
      "installation": [
        "협약에 따른 계측 범위 · 빈도 · 경보 확정",
        "선로 · 노반 · 교량 접속에 자동망 구축",
        "발파 구간에 진동계 배치",
        "데이터를 철도 담당자와 실시간 공유",
        "공사 일지 · 굴착 단계와 연동",
        "사후 평가 · 복구까지 데이터를 보존"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "협약 · 사전",
            "기준선 · 관리기준",
            "철도 합의"
          ],
          [
            "공사 중",
            "변위 · 진동",
            "실시간 공유"
          ],
          [
            "발파 · 굴착",
            "이벤트",
            "PPV · 누적"
          ],
          [
            "기준 초과",
            "복합 징후",
            "중지 · 운행 제한"
          ],
          [
            "사후",
            "잔류 · 복구",
            "데이터 보존"
          ]
        ]
      },
      "data": {
        "headers": [
          "공법",
          "주 계측",
          "경보"
        ],
        "rows": [
          [
            "굴착",
            "광파기",
            "변위 mm"
          ],
          [
            "터널",
            "광파기, 진동",
            "복합"
          ],
          [
            "발파",
            "진동계",
            "PPV"
          ],
          [
            "말뚝",
            "광파기",
            "누적 · 속도"
          ]
        ]
      },
      "criteria": "<p>철도 관리기준은 철도공사·국토부·인접공사 협약 기준을 따릅니다. 허용 변위·변위속도·진동 속도가 매우 엄격하며, 기준 초과 시 운행 속도 제한·공사 중지가 즉시 검토됩니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "협약 없이 공사하면?",
          "a": "철도 안전 규정 위반·사고 위험이 큽니다. 사전 계측·협약이 필수입니다."
        },
        {
          "q": "기준 초과 시?",
          "a": "공사 중지·공법 변경·운행 제한을 즉시 검토합니다."
        },
        {
          "q": "인접 공사 계측 범위는?",
          "a": "영향 예상 구간·구조물·지하매설물을 계획서에 명시하고 기준선을 사전 확립합니다."
        },
        {
          "q": "궤도와 토공 계측 데이터 공유는?",
          "a": "동일 시간축·좌표계로 통합해 원인(굴착·지보·그라우팅)을 추적합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "인접공사 영향의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.7",
        "label": "철도·궤도 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.7",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/railway/construction-phase": {
    "id": "fields/railway/construction-phase",
    "title": "건설중 계측",
    "sections": {
      "overview": "<p><strong>철도 건설중 계측</strong>은 신규·개량·복선 등 <strong>시공 중</strong> 노반·道床·궤도 기준선을 확보하고, 단계별 침하·변위를 관리하는 체계입니다. 운영기 <strong>노반침하·궤도변위</strong>와 구분하며, 고속철도(KTX·SRT 등)는 더 촘촘한 주기·기준을 적용합니다(<em>high-speed railway monitoring during construction</em>).</p><p>인접 터널·굴착·발파 영향은 <strong>인접공사 영향</strong> 항목·터널 건설중 계측과 시간 동기화합니다. 개통 전 종합 판정 후 운영기 모니터링으로 이관합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 철도 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "道床 · 노반 시공",
          "body": "되메우기·다짐·층별 침하 추적"
        },
        {
          "title": "궤도 기준",
          "body": "시공 중 선형·高低·통과 변위를 확보합니다."
        },
        {
          "title": "고속철 특수",
          "body": "고속철도는 계측 주기·허용치·보고를 강화합니다."
        },
        {
          "title": "인접공사 연계",
          "body": "터널·굴착·발파와 통합 데이터로 원인 추적"
        }
      ],
      "principle": "<p>철도 건설중 계측은 <strong>노반·궤도·하부 지반</strong>을 분리 해석합니다. 궤도틀림·노반침하·진동 그래프를 한 축에 혼합하지 않고, <strong>자동광파기·침하계·GNSS</strong>를 공정 단계에 맞게 배치합니다.</p>",
      "installation": [
        "계측관리계획서에 건설중 항목 · 공정별 빈도 · 관리기준을 명시",
        "토공 · 道床 · 궤도 단계별 대표 측점 선정",
        "고속철 구간은 협약에 따른 고빈도 · 실시간 경보 설정",
        "인접 터널 · 굴착 구간과 기준망 · 시간축을 통합",
        "원격계측으로 일 · 주 자동 보고를 구성",
        "개통 전 잔류 변위 · 기준선을 확정 · 운영기 계획으로 이관"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "토공 · 노반",
            "층별 침하 · 다짐",
            "침하율 · 균열"
          ],
          [
            "道床 · 궤도",
            "궤도변위 · 노반침하",
            "기준선 대비"
          ],
          [
            "고속선 조정",
            "고빈도 3D 변위",
            "개통 전 허용치"
          ],
          [
            "인접 터널 · 굴착",
            "연계 계측",
            "누적 · 속도"
          ],
          [
            "개통 전",
            "종합 판정 · 인수",
            "운영기 이관"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "수단",
          "건설중 포인트"
        ],
        "rows": [
          [
            "노반침하",
            "침하계 · 광파기",
            "층별 · 누적"
          ],
          [
            "궤도변위",
            "광파기",
            "선형 · 高低"
          ],
          [
            "고속철",
            "광파기 · GNSS",
            "HSR monitoring"
          ],
          [
            "인접공사",
            "광파기 · 진동계",
            "협약 · 경보"
          ],
          [
            "통합",
            "원격계측",
            "자동 보고"
          ]
        ]
      },
      "criteria": "<p>건설 중 관리기준은 철도공사·발주처·인접공사 협약에 따릅니다. 운영기 노반·궤도 기준과 별도로 <strong>시공 단계 허용치</strong>를 설정합니다. 고속철도는 일반선보다 엄격한 속도·누적 기준을 적용합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "건설 중 계측과 노반침하(운영기) 차이는?",
          "a": "건설 중 계측은 道床·토공·궤도 시공 중 층별·단계별 관리, 운영기는 개통 후 장기 침하·인접공사 영향 중심입니다."
        },
        {
          "q": "고속철도만 다른가요?",
          "a": "계측 주기·허용치·보고·경보가 더 엄격합니다. 동일 leaf에서 고속철 특수 절을 참고합니다."
        },
        {
          "q": "터널 공사와 연계는?",
          "a": "인접 터널·굴착 시 철도·터널 건설중 계측 데이터를 동일 시간축으로 통합합니다."
        },
        {
          "q": "개통 전 무엇을 확정하나요?",
          "a": "잔류 변위·기준선·센서 상태·보고 이력을 운영기 계측관리계획 인수 자료로 이관합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.7 — 철도·궤도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-112"
      ]
    },
    "heroImageId": "IMG-112",
    "heroCaption": "철도·고속철도 건설중 계측 — 노반·궤도 시공 단계별 침하·변위",
    "metaDescription": "철도·고속철도 건설중 계측 — 노반·궤도 시공 단계별 침하·변위와 인접공사 연계. High-speed railway monitoring during construction.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.7",
        "label": "철도·궤도 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.7",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/leakage": {
    "id": "fields/dam/leakage",
    "title": "침투·누수",
    "sections": {
      "overview": "<p><strong>댐 누수</strong> 계측은 제체·기초·배수층을 통한 침투수량·탁도·수위 변화를 <strong>하류 배수갤러리·집수부·측수로·계측정</strong>의 유량계·<strong>지하수위계</strong>로 감시합니다. 누수량 급증·탁도 증가·비정상 수위는 내부 침식·댐체 손상 징후일 수 있습니다.</p><p>정상 운영 시 계절·수위별 패턴을 축적하고 이탈을 감지합니다. 센서를 제체 내부에 무작위로 박아 넣는 표현은 사용하지 않습니다.</p><p>누수 계측은 정상 운영 수위별 유량 기준선을 통계적으로 구축합니다. 지진·홍수·수위 급변 후 집중 관찰 기간을 두고, 탁도·온도·전기 전도도 등 보조 지표로 침식·필터 이상을 구분합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "누수량",
          "body": "배수갤러리·계측정 유량 추적"
        },
        {
          "title": "이상 감지",
          "body": "급증·탁도 변화를 조기에 포착합니다."
        },
        {
          "title": "장기 추세",
          "body": "노후화에 따른 누수 변화 기록"
        }
      ],
      "principle": "<p>댐 침투는 수두에 비례하는 경향이 있으나 경로·공극 변화에 민감합니다. 정상 패턴 대비 이탈이 핵심입니다.</p>",
      "installation": [
        "하류 배수갤러리 · 집수부 · 측수로 · 계측정에 유량계 설치",
        "제체 · 기초 관측공에 지하수위계를 둡니다",
        "수위 · 강우와 시간 동기화",
        "정상 운영 데이터를 수위별로 분류",
        "이상 시 계측 빈도를 높",
        "원격계측 · 경보 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "준공 · 초기",
            "유량 · 수위 기준선",
            "정상 패턴 확립"
          ],
          [
            "일상 운영",
            "누수량 · 간극수압",
            "수위별 분류"
          ],
          [
            "홍수 · 태풍",
            "유량 급증 · 탁도",
            "고빈도 · 경보"
          ],
          [
            "이상 징후",
            "유량 · 지하수위",
            "내부 조사"
          ],
          [
            "장기",
            "추세 · 노후",
            "안전 점검 · 보수"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "가능 원인",
          "조치"
        ],
        "rows": [
          [
            "유량 급증",
            "침식 · 균열",
            "정밀 조사"
          ],
          [
            "탁도 증가",
            "세굴 · 이완",
            "공동 조사"
          ],
          [
            "수위 연동 이탈",
            "경로 변화",
            "내부 점검"
          ],
          [
            "계절 패턴 변화",
            "노후",
            "안전 점검"
          ]
        ]
      },
      "criteria": "<p>댐 관리기준은 댐 안전점검 규정·설계 기준·과거 데이터 기반 통계적 한계를 적용합니다. 수위별·계절별 정상 범위를 설정하고 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "누수가 있으면 항상 위험한가요?",
          "a": "설계 배수·정상 침투와 이상 누수를 구분합니다. 추세·수위·탁도가 중요합니다."
        },
        {
          "q": "제방도 동일한가요?",
          "a": "규모는 작으나 원리 유사합니다. 유량·지하수위 중심으로 단순화합니다."
        },
        {
          "q": "정상 누수와 이상을 어떻게 구분하나요?",
          "a": "수위별·계절별 패턴을 확립한 뒤 추세 이탈·급증을 이상으로 봅니다."
        },
        {
          "q": "탁도가 증가하면?",
          "a": "침식·세굴·이완 가능성을 의심하고 내부 조사·계측 빈도를 높입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 유량·누수 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "침투·누수의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3.2",
        "label": "유량·누수 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/pore-pressure": {
    "id": "fields/dam/pore-pressure",
    "title": "수위·수압",
    "sections": {
      "overview": "<p><strong>댐·제방 간극수압</strong>은 제체·기초·배수층 내부 수압을 <strong>간극수압계</strong>로 측정합니다. <strong>filter tip</strong>(필터 구간 끝)은 간극수압 측정 지점이며 <strong>침윤선과 동일하지 않습니다</strong>. <strong>piezometric head</strong>는 필터 위치의 수압을 뜻하며 <strong>지하수위(G.W.L)</strong>·저수위와 구분합니다.</p><p>수위 상승 시 간극수압 분포 변화는 제체·기초 안정 평가의 핵심입니다. 정상 수위-압력 관계를 확립하고 이탈·비대칭 상승을 감시합니다.</p><p>댐 간극수압은 수위 상승·하강 주기마다 히스테리시스 패턴이 형성됩니다. 패턴 이탈·비대칭 상승은 배수층·필터 막힘·집중 침투를 시사하며, 안전 점검 등급과 연동해 조치 우선순위를 정합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "수압 분포",
          "body": "제체 단면별 간극수압 확인"
        },
        {
          "title": "안정",
          "body": "수위 변화에 따른 안전 여유를 평가합니다."
        },
        {
          "title": "침투",
          "body": "배수층·필터 성능을 검증합니다."
        }
      ],
      "principle": "<p>간극수압은 수두·침투 경로에 의해 결정됩니다. 제체 하부·기초의 과잉간극수압은 불안정 요인입니다.</p>",
      "installation": [
        "설계 계측 단면에 간극수압계 설치",
        "필터 · 배수층과 수리적 연결 확인",
        "수위계 · 강우 데이터와 연동",
        "초기 · 정상 운영 패턴 기록",
        "태풍 · 홍수 시 고빈도 계측",
        "변위 · 침하와 통합"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "초기 충수",
            "간극수압 분포",
            "정상 수위-압력 관계"
          ],
          [
            "일상 운영",
            "간극수압 · 수위",
            "패턴 이탈"
          ],
          [
            "홍수 · 태풍",
            "과잉간극수압",
            "고빈도 계측"
          ],
          [
            "수위 하강",
            "압력 소산",
            "배수 · 압밀"
          ],
          [
            "장기",
            "단면 간 비교",
            "집중 유출 · 노후"
          ]
        ]
      },
      "data": {
        "headers": [
          "수위",
          "압력",
          "판단"
        ],
        "rows": [
          [
            "상승",
            "비례 증가",
            "정상 패턴"
          ],
          [
            "상승",
            "과다 증가",
            "배수 · 침투 이상"
          ],
          [
            "하강",
            "지연 소산",
            "압밀 · 배수"
          ],
          [
            "비대칭",
            "단면 간 차",
            "집중 유출"
          ]
        ]
      },
      "criteria": "<p>filter tip=간극수압 측정 지점(≠침윤선). piezometric head≠G.W.L. 관리기준은 설계·댐 안전점검 규정·과거 데이터를 따릅니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "간극수압이 수위보다 빨리 오르면?",
          "a": "침투 경로 단축·배수 불량·센서 이상을 검토합니다."
        },
        {
          "q": "제방 간극수압계 심도는?",
          "a": "제체·기초 구조에 맞게 설계 계획을 따릅니다."
        },
        {
          "q": "댐 체 수압계 배치 원칙은?",
          "a": "단면·층별로 대표 위치에 두고 수위·온도·변위와 연계합니다."
        },
        {
          "q": "수압 급상승 시 우선 조치는?",
          "a": "측량·누수·변위 이상 여부를 확인하고 관리기준에 따라 단계별 대응합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "수위·수압의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3",
        "label": "댐·제방 계측설비"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "댐·제체 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/settlement": {
    "id": "fields/dam/settlement",
    "title": "침하",
    "sections": {
      "overview": "<p><strong>댐·제방 침하</strong>는 제체 크레스트·익스트·기초의 수직 변형을 <strong>침하계</strong>, <strong>GNSS</strong>로 장기 추적합니다. 압밀·크리프·수위 변화·지진 후 침하는 제체 안정성 지표입니다.</p><p>부등침하는 변위계·경사와 연계됩니다. 침하량 <strong>증가(아래 방향)</strong>는 그래프에서 시간에 따라 값이 커지는 방향이며, 관리기준 초과 시 단계별 조치를 검토합니다.</p><p>댐 침하는 준공 후 수년~수십년에 걸쳐 진행될 수 있어 동일 측점의 장기 연속성이 중요합니다. 제체·기초 침하 차이가 커지면 비대칭 변형·균열 가능성을 검토하고, 수위·온도와 상관 분석합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "장기 침하",
          "body": "압밀·크리프 추세 기록"
        },
        {
          "title": "부등침하",
          "body": "제체 불균등 침하를 감시합니다."
        },
        {
          "title": "이벤트",
          "body": "홍수·지진 후 침하를 평가합니다."
        }
      ],
      "principle": "<p>댐 제체 침하는 압밀·변형에 의합니다. 기초 침하는 지반 조건에 좌우됩니다.</p>",
      "installation": [
        "크레스트 · 익스트 · 기초에 침하계 설치",
        "장기 안정 기준점을 확보",
        "GNSS로 대규모 추세를 보완",
        "수위 · 온도와 연동",
        "정기(월 · 분기) 계측 일정을 둡니다",
        "변위 데이터와 통합"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "준공 · 초기",
            "크레스트 · 기초",
            "초기치 · 압밀"
          ],
          [
            "일상 운영",
            "장기 침하",
            "속도 · 비대칭"
          ],
          [
            "홍수 · 수위",
            "일시 침하",
            "회복 추세"
          ],
          [
            "지진 후",
            "잔류 침하",
            "손상 조사"
          ],
          [
            "장기",
            "크리프",
            "안전 점검"
          ]
        ]
      },
      "data": {
        "headers": [
          "위치",
          "침하 유형",
          "관리"
        ],
        "rows": [
          [
            "크레스트",
            "압밀",
            "장기 추세"
          ],
          [
            "기초",
            "지반",
            "안정"
          ],
          [
            "비대칭",
            "부등",
            "변위 연계"
          ],
          [
            "홍수 후",
            "일시",
            "회복 확인"
          ]
        ]
      },
      "criteria": "<p>침하 그래프는 시간(가로)·침하량 증가=아래 방향(세로)을 명시합니다. 관리기준 초과·속도 가속 시 단계별 조치를 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "침하가 계속되면?",
          "a": "압밀 진행 중일 수 있으나 속도·비대칭을 함께 봅니다."
        },
        {
          "q": "신축 댐도 침하계?",
          "a": "콘크리트 크리프·기초 압밀 모두 해당될 수 있습니다."
        },
        {
          "q": "댐 침하와 기초 침하 구분은?",
          "a": "측점 위치·심도별 침하계로 체·기초·주변 지반을 구분합니다."
        },
        {
          "q": "수위 변화와 침하 상관은?",
          "a": "수위 상승 후 지연 침하가 있을 수 있어 장기 추세로 판단합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "침하의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3",
        "label": "댐·제방 계측설비"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "댐·제체 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/displacement": {
    "id": "fields/dam/displacement",
    "title": "변위",
    "sections": {
      "overview": "<p><strong>댐·제방 변위</strong>는 제체 수평·수직 이동을 <strong>변위계</strong>, <strong>GNSS</strong>, <strong>지중경사계</strong>로 측정합니다. 수위 하중·온도·지진에 따른 제체 변형은 안전 평가의 핵심입니다.</p><p>비대칭·집중 변위는 내부 손상·침식 징후일 수 있습니다.</p><p>댐 변위는 수위 하중·온도·시간 의존성을 모델링해 정상 범위를 설정합니다. 지진 후 잔류 변위·추가 증가가 있으면 내부 손상 조사를 실시하며, GNSS와 국부 변위계를 교차 검증합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "제체 변형",
          "body": "수위별 변위 패턴을 확립합니다."
        },
        {
          "title": "비대칭",
          "body": "단면·방향별 차이를 감시합니다."
        },
        {
          "title": "지진",
          "body": "지진 후 잔류·추가 변위를 평가합니다."
        }
      ],
      "principle": "<p>댐은 아치·중력·필댐 등 형식별 변위 특성이 다릅니다. 수위-변위 관계가 정상 운영의 기준입니다.</p>",
      "installation": [
        "설계 계측 단면에 변위계 · 협심측정 설치",
        "GNSS를 크레스트 · 익스트에 배치",
        "수위 · 온도 센서와 연동",
        "정상 패턴 데이터베이스 구축",
        "홍수 · 지진 시 고빈도 계측",
        "간극수압 · 누수와 통합"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "초기 충수",
            "변위 · 수위",
            "기준 패턴"
          ],
          [
            "일상 운영",
            "수위-변위",
            "정상 범위"
          ],
          [
            "홍수 · 태풍",
            "고빈도",
            "이탈 · 비대칭"
          ],
          [
            "지진 후",
            "잔류 변위",
            "손상 조사"
          ],
          [
            "장기",
            "추세",
            "노후 · 보수"
          ]
        ]
      },
      "data": {
        "headers": [
          "형식",
          "변위",
          "해석"
        ],
        "rows": [
          [
            "중력댐",
            "수평 · 굴곡",
            "수위 연동"
          ],
          [
            "아치댐",
            "아치 변형",
            "축력"
          ],
          [
            "필댐",
            "침하 · 측방",
            "간극수압"
          ],
          [
            "지진 후",
            "잔류",
            "손상 조사"
          ]
        ]
      },
      "criteria": "<p>댐 관리기준은 댐 안전점검 규정·설계 기준·과거 데이터 기반 통계적 한계를 적용합니다. 수위별·계절별 정상 범위를 설정하고 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "수위 올릴 때 변위 증가는?",
          "a": "탄성 변형 범위 내면 정상일 수 있습니다. 패턴·한계를 사전에 정의합니다."
        },
        {
          "q": "GNSS만으로 충분한가요?",
          "a": "장기 추세에 유리하나 국부 변위는 변위계·협심측정을 병행합니다."
        },
        {
          "q": "댐 변위 방향 해석은?",
          "a": "수위·온도·시공 이력과 함께 상·하류·연직 방향을 분리해 봅니다."
        },
        {
          "q": "변위 급증과 균열 계측 연계는?",
          "a": "동일 단면 균열계·변위계를 연동해 국부 손상 여부를 확인합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "변위의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3",
        "label": "댐·제방 계측설비"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "댐·제체 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/harbor/quay-wall": {
    "id": "fields/harbor/quay-wall",
    "title": "안벽",
    "sections": {
      "overview": "<p><strong>안벽(Quay wall)</strong> 계측은 항만·호안 **안벽·중력식 옹벽**의 조석·파랑 하중에 따른 **측방 변위·경사·배면 토압**을 추적합니다. 좌측 배면 매립과 우측 바닷물 수위차가 구조 거동을 지배합니다.</p><p><strong>구조물경사계</strong>·<strong>토압계</strong>·<strong>변위계</strong>를 조합하여 케이슨·중력식 벽체의 안정을 평가합니다.</p><p>안벽 계측은 조석·배면 토압에 따른 측방 변위·경사 패턴을 만조·간조 주기와 동기화합니다. 좌측 매립과 우측 바닷물 수위차가 구조 거동의 기본 입력입니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 항만·해안 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "측방 변위",
          "body": "조위·토압에 따른 밀림 추적"
        },
        {
          "title": "경사",
          "body": "벽체 회전·기울기를 감시합니다."
        },
        {
          "title": "배면",
          "body": "매립 지반·간극수압과 연계합니다."
        }
      ],
      "principle": "<p>안벽은 조석 하중과 배면 토압의 합력으로 거동합니다. 만조·간조 주기와 동기화한 변위·경사 패턴을 확립합니다.</p>",
      "installation": [
        "벽체 상부 · 모서리에 변위계 · 경사계 설치",
        "배면 수직면에 토압계를 부착",
        "조위계 · 지하수위와 시간 동기화",
        "태풍 · 지진 전후 집중 계측"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "시공 · 매립",
            "배면 변위 · 토압",
            "성토 단계"
          ],
          [
            "초기 운영",
            "조위 패턴",
            "만조 · 간조 기준"
          ],
          [
            "일상",
            "변위 · 경사",
            "정상 범위"
          ],
          [
            "태풍 · 지진",
            "급변",
            "고빈도 · 점검"
          ],
          [
            "장기",
            "추세 · 균열",
            "보수 · 보강"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "센서",
          "조치"
        ],
        "rows": [
          [
            "측방 증가",
            "변위계",
            "배면 조사"
          ],
          [
            "경사",
            "구조물경사계",
            "기초"
          ],
          [
            "토압 급변",
            "토압계",
            "배수"
          ]
        ]
      },
      "criteria": "<p>항만 구조물 허용 변위·경사는 설계·KDS 4.1.8 기준을 따릅니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "케이슨과 차이?",
          "a": "안벽은 포괄 개념이며, 케이슨은 대형 prefab 구조물 유형입니다."
        },
        {
          "q": "안벽 변위와 토압 계측 연계는?",
          "a": "변위·경사와 토압·지하수위를 같은 단면에서 해석합니다."
        },
        {
          "q": "선박 접안 하중 영향은?",
          "a": "접안 이벤트 전후 변위·경사를 비교하고 정상 범위를 축적합니다."
        },
        {
          "q": "염해·조위 변화 보정은?",
          "a": "센서 드리프트·온도 보정과 조위에 따른 해수면 하중 변화를 분리해 봅니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "안벽의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.8",
        "label": "항만·호안 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.8",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/harbor/caisson": {
    "id": "fields/harbor/caisson",
    "title": "케이슨",
    "sections": {
      "overview": "<p><strong>케이슨(Caisson)</strong> 계측은 대형 prefab 콘크리트 **케이슨 안벽**의 조석·배면 토압에 따른 **기울어짐·측방 유동**을 <strong>구조물경사계</strong>·<strong>토압계</strong>·<strong>변위계</strong>로 추적합니다.</p><p>해측(→) 방향 미세 밀림과 crest 경사 변화가 핵심 지표입니다.</p><p>케이슨 계측은 crest 경사·배면 토압·해측 방향 측방 변위를 통합합니다. prefab 콘크리트 블록의 회전·슬라이딩 징후를 조위 이벤트와 연계합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 항만·해안 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "케이슨 경사",
          "body": "crest tiltmeter로 회전을 측정합니다."
        },
        {
          "title": "배면 토압",
          "body": "매립 측 토압계로 압력 변동 추적"
        },
        {
          "title": "측방 변위",
          "body": "해측 방향 변위 벡터 확인"
        }
      ],
      "principle": "<p>케이슨은 조석·파랑과 배면 토압의 불균형 하에서 회전·슬라이딩 거동을 보입니다.</p>",
      "installation": [
        "케이슨 crest에 구조물경사계 설치",
        "배면 수직면에 토압계를 부착",
        "변위계 · 프리즘으로 수평 변위를 보완",
        "조위 · 지하수와 연동"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "침설 · 매립",
            "경사 · 토압",
            "싱킹 · 편심"
          ],
          [
            "초기 운영",
            "조위 패턴",
            "만조 · 간조"
          ],
          [
            "일상",
            "측방 · 회전",
            "정상 범위"
          ],
          [
            "태풍 · 지진",
            "급변",
            "점검 · 보강"
          ],
          [
            "장기",
            "잔류 기울기",
            "기초 안정"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "원인",
          "조치"
        ],
        "rows": [
          [
            "변위",
            "조석 · 토압",
            "배면"
          ],
          [
            "θ 증가",
            "회전",
            "기초"
          ],
          [
            "비대칭",
            "지반",
            "조사"
          ]
        ]
      },
      "criteria": "<p>케이슨 허용 변위·경사는 설계 도면·KCS 기준을 따릅니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "항만구조물 hero와?",
          "a": "케이슨은 IMG-084 상세, 안벽 개요는 IMG-064를 참조합니다."
        },
        {
          "q": "침설 중 싱킹 속도와 변위는?",
          "a": "싱킹률·기울기·편심을 동시에 보고 이상 시 공법·투수를 점검합니다."
        },
        {
          "q": "가물막이와 침식 계측은?",
          "a": "투수량·지하수위·바닥 융기와 연계해 안정을 판단합니다."
        },
        {
          "q": "침설 완료 후 계측은?",
          "a": "잔류 기울기·침하·구조 응력을 장기 모니터링해 기초 안정을 확인합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "케이슨의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.8",
        "label": "항만·호안 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.8",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/harbor/structure": {
    "id": "fields/harbor/structure",
    "title": "항만구조물",
    "sections": {
      "overview": "<p><strong>항만구조물</strong> 계측은 부두·옹벽·파제제 등 해안 구조물의 변위·경사·균열을 <strong>변위계</strong>, <strong>구조물경사계</strong>, <strong>균열계</strong>로 측정합니다. 조위·파랑·온도·지진에 따른 구조물 거동은 해안 시설 안전의 핵심입니다.</p><p>비대칭 변위·경사 증가는 배면 지반·기초·연결부 손상 징후일 수 있습니다. 조위 주기와 동기화한 해석이 필요합니다.</p><p>항만구조물 계측은 조위·파랑·온도에 따른 정상 변위 범위를 계절별로 확립합니다. 태풍·지진 전후 고빈도 계측으로 잔류 변위를 평가하고, 배면 지반·조위 데이터와 통합 보고합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 항만·해안 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "변위",
          "body": "수평·수직 변위를 변위계로 추적합니다."
        },
        {
          "title": "경사",
          "body": "구조물경사계로 회전·기울기 확인"
        },
        {
          "title": "균열",
          "body": "균열계로 대표 균열 폭 변화를 감시합니다."
        }
      ],
      "principle": "<p>항만구조물은 조위 하중·파랑·상재하중에 반응합니다. 조석·온도에 따른 정상 변위 범위를 확립한 뒤 이탈을 평가합니다.</p>",
      "installation": [
        "구조물 형식 · 민감 구간에 측점 선정",
        "변위계 · 경사계 기준점을 안정 지반에 설치",
        "대표 균열에 균열계 설치",
        "조위계 · 기상 데이터와 연동",
        "태풍 · 지진 전후 고빈도 계측 실시",
        "장기 데이터베이스 구축"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "시공 · 매립",
            "변위 · 경사",
            "초기치"
          ],
          [
            "초기 운영",
            "조위 연동",
            "정상 패턴"
          ],
          [
            "일상",
            "균열 · 변위",
            "염해 · 마모"
          ],
          [
            "태풍 · 지진",
            "급변",
            "고빈도"
          ],
          [
            "유지관리",
            "장기 추세",
            "보수 우선순위"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "센서",
          "조치"
        ],
        "rows": [
          [
            "조위 연동 변위",
            "변위계",
            "정상 패턴 확인"
          ],
          [
            "경사 증가",
            "구조물경사계",
            "배면 · 기초 조사"
          ],
          [
            "균열 확대",
            "균열계",
            "구조 점검"
          ],
          [
            "급격한 증가",
            "복합",
            "공사 중지 · 보강"
          ]
        ]
      },
      "criteria": "<p>항만·호안 관리기준은 설계, 구조 형식, 조위·파랑 조건, 인접 시설물 민감도에 따라 설정합니다. 조위별·계절별 정상 패턴을 정의하고, 급격한 변위·수압 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "조위만으로 변위가 변하면?",
          "a": "정상 조석 범위인지 과거 데이터·온도와 비교합니다."
        },
        {
          "q": "파제제도 동일한가요?",
          "a": "원리 유사하나 파랑·세굴 영향이 큽니다. 변위·경사 중심으로 단순화할 수 있습니다."
        },
        {
          "q": "항만 구조물 계측과 육상 교량 차이는?",
          "a": "조위·파랑·염해·지반 침하가 추가 변수입니다. 해수면·지반 계측과 연동합니다."
        },
        {
          "q": "염해 환경 센서 관리는?",
          "a": "방식·케이블·접속부 정기 점검과 교정 주기를 계획서에 반영합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "항만구조물의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.8",
        "label": "항만·호안 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.8",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/harbor/surrounding-ground": {
    "id": "fields/harbor/surrounding-ground",
    "title": "주변지반",
    "sections": {
      "overview": "<p><strong>항만·호안 주변지반</strong> 계측은 옹벽 배면·해안 사면·매립지의 침하·측방 변위를 <strong>침하계</strong>, <strong>지중경사계</strong>, <strong>간극수압계</strong>로 추적합니다. 배면 지반 불안정은 구조물 과변위·파손으로 이어질 수 있습니다.</p><p>강우·조위·공사 하중 변화와 연계하여 지반 거동을 해석합니다.</p><p>해안 주변지반은 조위·강우·공사 하중에 민감합니다. 배면 침하·측방 변위가 구조물 변위와 동시 증가하면 배수·지반 보강을 검토하며, 매립지는 장기 압밀 침하 추세를 별도 관리합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 항만·해안 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "침하",
          "body": "배면·해안 지반 침하를 침하계로 확인합니다."
        },
        {
          "title": "측방 변위",
          "body": "지중경사계로 수평변위 프로파일 추적"
        },
        {
          "title": "간극수압",
          "body": "배면 수압 상승을 간극수압계로 감시합니다."
        }
      ],
      "principle": "<p>해안 지반은 조위·파랑·배수 조건에 민감합니다. 배면 침하·측방 유동은 옹벽 안정성에 직접 영향을 줍니다.</p>",
      "installation": [
        "배면 · 해안 대표 단면에 침하계 · 지중경사계 설치",
        "배수 · 투수 조건 기준 간극수압계 배치",
        "강우 · 조위 데이터와 연동",
        "공사 단계별 계측 빈도를 조정",
        "이상 시 추가 시추 · 물리탐사를 연계",
        "구조물 변위 데이터와 통합"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "매립 · 성토",
            "침하 · 간극수압",
            "압밀 반응"
          ],
          [
            "일상",
            "지중경사 · 수위",
            "조위 · 강우"
          ],
          [
            "공사",
            "측방 변위",
            "하중 재분배"
          ],
          [
            "이상",
            "급변",
            "조사 · 보강"
          ],
          [
            "장기",
            "잔류 침하",
            "구조물 연계"
          ]
        ]
      },
      "data": {
        "headers": [
          "현상",
          "가능 원인",
          "대응"
        ],
        "rows": [
          [
            "침하 증가",
            "배면 이완",
            "배수 · 보강"
          ],
          [
            "수평변위",
            "측방 지압",
            "앵커 · 옹벽 검토"
          ],
          [
            "간극수압 상승",
            "조위 · 배수 불량",
            "배수 개선"
          ],
          [
            "급변",
            "공사 · 지진",
            "긴급 점검"
          ]
        ]
      },
      "criteria": "<p>항만·호안 관리기준은 설계, 구조 형식, 조위·파랑 조건, 인접 시설물 민감도에 따라 설정합니다. 조위별·계절별 정상 패턴을 정의하고, 급격한 변위·수압 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "배면만 계측하면 충분한가요?",
          "a": "구조물 변위·조위·간극수압과 함께 봅니다."
        },
        {
          "q": "매립지는?",
          "a": "압밀 침하가 장기 지속될 수 있어 장기 추세 관리가 중요합니다."
        },
        {
          "q": "항만 주변 지반 침하 원인 구분은?",
          "a": "굴착·투수·진동·하중 재분배를 공정 이력과 연계해 구분합니다."
        },
        {
          "q": "인접 부지 계측 범위는?",
          "a": "영향권 내 건축물·옹벽·지하매설물 측점을 계획서에 포함합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": [
        "IMG-032",
        "IMG-027"
      ],
      "data": [
        "IMG-050"
      ]
    },
    "heroCaption": "항만·호안 주변지반 — 배면 침하·측방변위·간극수압 모니터링",
    "metaDescription": "주변지반의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.8",
        "label": "항만·호안 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.8",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/harbor/tide-groundwater": {
    "id": "fields/harbor/tide-groundwater",
    "title": "조위·지하수",
    "sections": {
      "overview": "<p><strong>조위·지하수</strong> 계측은 해안 구조물 주변의 조석·지하수위·간극수압 변화를 <strong>지하수위계</strong>, <strong>간극수압계</strong>, 조위계로 관리합니다(KDS 4.1.8). 조위 상승 시 배면 간극수압·지하수위 변화는 구조물·지반 안정에 영향을 줍니다.</p><p>강우·태풍·공사 양수와 연계하여 수문 조건을 통합 해석합니다.</p><p>조위·지하수·간극수압은 해안 구조물 안정의 기본 입력입니다. 조석 주기·강우 이벤트를 태깅하면 수압 이탈 원인 분석이 수월하며, 태풍·홍수 시 고빈도 계측으로 전환합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 항만·해안 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "조위",
          "body": "조석에 따른 수위 변화 기록"
        },
        {
          "title": "지하수위",
          "body": "지하수위계로 심도별 수위 추적"
        },
        {
          "title": "간극수압",
          "body": "배면·기초 간극수압 분포 확인"
        }
      ],
      "principle": "<p>해안 지반의 수문 조건은 조위·강우·투수 경로에 의해 결정됩니다. 조위-지하수위-간극수압 연동 패턴이 정상 운영의 기준입니다.</p>",
      "installation": [
        "조위계 · 지하수위계 · 간극수압계 설치 위치를 설계에 따릅니다",
        "구조물 · 지반 계측과 시간 동기화",
        "태풍 · 홍수 시 고빈도 계측으로 전환",
        "배수 시설 상태를 정기 점검",
        "데이터를 구조물 변위 · 침하와 통합",
        "원격계측으로 실시간 모니터링 구축"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "평상시",
            "조위 · 수위",
            "조석 패턴"
          ],
          [
            "강우 · 홍수",
            "간극수압",
            "급상승 · 배수"
          ],
          [
            "조위 상승",
            "복합 수압",
            "구조물 연계"
          ],
          [
            "이탈",
            "투수 · 배수",
            "조사"
          ],
          [
            "장기",
            "추세",
            "유지관리"
          ]
        ]
      },
      "data": {
        "headers": [
          "조건",
          "계측기",
          "해석"
        ],
        "rows": [
          [
            "조석",
            "조위계",
            "정상 주기 패턴"
          ],
          [
            "강우",
            "지하수위계",
            "급상승 · 소산"
          ],
          [
            "조위 상승",
            "간극수압계",
            "배면 수압"
          ],
          [
            "이탈",
            "복합",
            "배수 · 투수 조사"
          ]
        ]
      },
      "criteria": "<p>항만·호안 관리기준은 설계, 구조 형식, 조위·파랑 조건, 인접 시설물 민감도에 따라 설정합니다. 조위별·계절별 정상 패턴을 정의하고, 급격한 변위·수압 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "조위와 지하수위 차이는?",
          "a": "조위는 해수면 변화, 지하수위는 지하 포화대 높이입니다. 해안에서는 상호 영향이 큽니다."
        },
        {
          "q": "간극수압이 조위보다 늦게 오르면?",
          "a": "투수 경로·배수 성능·센서 이상을 검토합니다."
        },
        {
          "q": "조위와 지하수위 동기화는?",
          "a": "동일 타임스탬프로 조위·수위·변위를 맞춰 침투·부력 영향을 분석합니다."
        },
        {
          "q": "조석 주기 패턴 활용은?",
          "a": "정상 조석 반응을 기준선으로 이탈 시 투수·지반 이상을 조사합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.8 — 항만·호안 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 시공 중 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "조위·지하수의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.8",
        "label": "항만·호안 계측"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "시공 중 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.8",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/temperature": {
    "id": "fields/dam/temperature",
    "title": "온도",
    "sections": {
      "overview": "<p><strong>댐·제방 온도</strong> 계측은 제체·기초 콘크리트·필댐재의 온도 분포·일교차·수위 연동 변화를 온도 센서·<strong>기상계측기</strong>로 추적합니다(KCS 54 20 25). 온도는 콘크리트 수화열·계절 변화·변위·변형률 해석의 필수 입력입니다.</p><p>수위 상승·하강과 온도-변위 패턴을 함께 보면 정상 운영 범위를 설정할 수 있습니다.</p><p>댐 온도는 수화열·계절 변화·수위 연동을 함께 봅니다. 변위·변형률·간극수압 해석의 온도 보정 기준으로 활용하며, 이상 온도 구배 시 내부 조사를 연계합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "수화열",
          "body": "타설·준공 초기 온도 상승을 관리합니다."
        },
        {
          "title": "계절",
          "body": "일교차·연간 온도 변화 기록"
        },
        {
          "title": "해석 보정",
          "body": "변위·변형률·간극수압 데이터의 온도 보정에 활용합니다."
        }
      ],
      "principle": "<p>댐 제체는 온도 변화에 따라 팽창·수축하며 내부·표면 온도 구배가 응력을 유발합니다. 수위에 따른 냉각·가열 효과도 고려합니다.</p>",
      "installation": [
        "설계 계측 단면에 온도 센서를 매립 · 표면 설치",
        "수위계 · 기상 데이터와 연동",
        "변위계 · 변형률계와 시간 동기화",
        "준공 초기 수화열 구간 고빈도 계측",
        "계절별 정상 패턴을 데이터베이스화",
        "이상 온도 구배 시 내부 균열 · 배수 조사를 연계"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "준공 · 수화",
            "내부 온도",
            "균열 · 변형"
          ],
          [
            "일상",
            "일교차 · 수위",
            "변위 보정"
          ],
          [
            "계절",
            "연간 패턴",
            "정상 범위"
          ],
          [
            "이상 구배",
            "국부 온도",
            "내부 점검"
          ],
          [
            "장기",
            "크리프 연계",
            "노후 평가"
          ]
        ]
      },
      "data": {
        "headers": [
          "구간",
          "온도",
          "연계"
        ],
        "rows": [
          [
            "수화 초기",
            "급상승",
            "균열 · 변형"
          ],
          [
            "일교차",
            "표면 · 심부",
            "변위"
          ],
          [
            "수위 연동",
            "냉각",
            "간극수압"
          ],
          [
            "이상 구배",
            "국부",
            "내부 점검"
          ]
        ]
      },
      "criteria": "<p>댐 관리기준은 댐 안전점검 규정·설계 기준·과거 데이터 기반 통계적 한계를 적용합니다. 수위별·계절별 정상 범위를 설정하고 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "필댐도 온도 계측이 필요한가요?",
          "a": "규모·재료에 따라 다릅니다. 콘크리트 부재·계측 계획에 따릅니다."
        },
        {
          "q": "온도만으로 손상을 판단하나요?",
          "a": "변위·변형률·간극수압과 함께 종합 판단합니다."
        },
        {
          "q": "댐 온도 계측 목적은?",
          "a": "콘크리트 수화열·계절 신축·변형률·변위 해석의 보정 변수입니다."
        },
        {
          "q": "표면과 내부 온도차는?",
          "a": "균열·응력 재분배 징후일 수 있어 심부·표면 센서를 병행합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 온도 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "온도의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3.2",
        "label": "온도 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/seismic": {
    "id": "fields/dam/seismic",
    "title": "지진",
    "sections": {
      "overview": "<p><strong>댐·제방 지진</strong> 계측은 지진 동작 시 제체 가속도·변위·간극수압·누수량 변화를 <strong>진동계</strong>, <strong>변위계</strong>, <strong>간극수압계</strong>로 기록합니다(KCS 54 20 25). 지진 후 잔류 변위·누수 급증·간극수압 이상은 내부 손상 징후일 수 있습니다.</p><p>지진 전 정상 패턴 대비 이탈 여부가 안전 평가의 핵심입니다.</p><p>댐 지진 계측은 변위·간극수압·누수 동시 이탈을 중점으로 봅니다. 지진 후 집중 계측·방류·검사 판단에 계측 데이터를 활용합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "지진 응답",
          "body": "가속도·변위 피크 기록"
        },
        {
          "title": "잔류 효과",
          "body": "지진 후 잔류 변위·수압·누수 변화 추적"
        },
        {
          "title": "응급 판단",
          "body": "방류·검사·수위 조절 근거를 제공합니다."
        }
      ],
      "principle": "<p>댐은 지진 하중에 대해 제체·기초·절리면이 연계 응답합니다. 액상화·슬라이딩·균열 진행은 계측 이탈로 조기 감지할 수 있습니다.</p>",
      "installation": [
        "크레스트 · 익스트 · 기초에 진동계 · 변위계 설치",
        "지진 트리거 · 이벤트 저장 설정",
        "간극수압 · 누수 · 수위와 동시 기록",
        "지진 후 집중 계측 · 육안 점검 일정 수립",
        "내진 안전 평가 · 비상 대응 계획과 연동",
        "장기 지진 이력 데이터베이스를 유지"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "평상시",
            "트리거 · 기준",
            "이벤트 저장"
          ],
          [
            "지진 발생",
            "PGA · 변위",
            "실시간"
          ],
          [
            "직후",
            "누수 · 간극수압",
            "방류 검토"
          ],
          [
            "24~72h",
            "잔류 변위",
            "상세 점검"
          ],
          [
            "복구",
            "패턴 복귀",
            "이력 보관"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "지진 후",
          "조치"
        ],
        "rows": [
          [
            "변위",
            "잔류 · 추가",
            "상세 조사"
          ],
          [
            "간극수압",
            "이탈",
            "내부 점검"
          ],
          [
            "누수",
            "급증",
            "방류 · 검사"
          ],
          [
            "가속도",
            "과대",
            "구조 응답 평가"
          ]
        ]
      },
      "criteria": "<p>댐 관리기준은 댐 안전점검 규정·설계 기준·과거 데이터 기반 통계적 한계를 적용합니다. 수위별·계절별 정상 범위를 설정하고 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "소규모 지진도 계측하나요?",
          "a": "트리거 임값을 설정해 의미 있는 이벤트를 저장합니다."
        },
        {
          "q": "제방도 동일한가요?",
          "a": "원리 유사하나 규모·위험도에 따라 계측 항목을 단순화할 수 있습니다."
        },
        {
          "q": "댐 지진 계측 최소 구성은?",
          "a": "자유장 진동·댐체 응답·수위를 연동한 이벤트 기록이 일반적입니다."
        },
        {
          "q": "지진 후 우선 확인 항목은?",
          "a": "변위·경사·누수·균열 급변 여부를 즉시 점검하고 잔류 변형을 추적합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 지진 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "지진의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3.2",
        "label": "지진 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/strain": {
    "id": "fields/dam/strain",
    "title": "응력·변형률",
    "sections": {
      "overview": "<p><strong>댐·제방 변형률</strong> 계측은 제체·기초 콘크리트·필댐 인접 구조의 변형률을 <strong>변형률계</strong>로 측정합니다(KCS 54 20 25). 수위 하중·온도·지진에 따른 응력-변형 관계를 추적하며, 균열·박리 전 응력 집중을 포착합니다.</p><p>변위계·간극수압과 함께 제체 거동을 종합 해석합니다.</p><p>댐 변형률은 수위·온도·지진 이벤트와 연동해 응력 수준을 추정합니다. 변위·간극수압과 함께 제체 거동을 종합 평가합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "응력",
          "body": "수위·온도에 따른 변형률로 응력 수준을 추정합니다."
        },
        {
          "title": "손상 예방",
          "body": "응력 집중·비정상 증가를 조기에 감지합니다."
        },
        {
          "title": "설계 검증",
          "body": "재하·수위 단계별 설계 가정을 검증합니다."
        }
      ],
      "principle": "<p>변형률계는 콘크리트·철근 표면·내부에 매립해 변형률 시간 이력을 제공합니다. 탄성계수·단면을 가정해 응력을 추정합니다.</p>",
      "installation": [
        "설계 계측 단면에 변형률계를 시공 시 매립",
        "수위 · 온도 센서와 연동",
        "초기 · 정상 운영 패턴 기록",
        "홍수 · 지진 시 고빈도 계측",
        "변위 · 간극수압 데이터와 통합",
        "이상 변형률 시 내부 조사를 연계"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "준공 · 수화",
            "변형률 · 온도",
            "수화열"
          ],
          [
            "충수 · 운영",
            "수위-응력",
            "정상 패턴"
          ],
          [
            "홍수 · 지진",
            "고빈도",
            "과도 응력"
          ],
          [
            "이상",
            "응력 집중",
            "조사"
          ],
          [
            "장기",
            "크리프",
            "노후"
          ]
        ]
      },
      "data": {
        "headers": [
          "조건",
          "변형률",
          "해석"
        ],
        "rows": [
          [
            "수위 상승",
            "증가",
            "수압 부담"
          ],
          [
            "온도",
            "주기",
            "열응력"
          ],
          [
            "지진",
            "스파이크",
            "과도 응력"
          ],
          [
            "장기",
            "크리프",
            "노후 평가"
          ]
        ]
      },
      "criteria": "<p>댐 관리기준은 댐 안전점검 규정·설계 기준·과거 데이터 기반 통계적 한계를 적용합니다. 수위별·계절별 정상 범위를 설정하고 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "변형률만으로 응력을 알 수 있나요?",
          "a": "탄성계수 가정이 필요합니다. 정성·정량 비교·추세 관리에 활용합니다."
        },
        {
          "q": "필댐에도 적용되나요?",
          "a": "콘크리트 부재·계측 계획 대상에 한합니다."
        },
        {
          "q": "댐 변형률계 위치 선정은?",
          "a": "응력 집중·설계 검토 단면에 배치하며 온도 보정을 적용합니다."
        },
        {
          "q": "콘크리트 크리프와 구분하려면?",
          "a": "장기 추세·온도·수위와 상관분석하고 시공 직후 기준선을 확립합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 변형률 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "응력·변형률의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3.2",
        "label": "변형률 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/tilt": {
    "id": "fields/dam/tilt",
    "title": "기울기",
    "sections": {
      "overview": "<p><strong>댐·제방 기울기</strong> 계측은 제체 크레스트·익스트의 경사·회전을 <strong>구조물경사계</strong>, <strong>자동광파기</strong>로 측정합니다(KCS 54 20 25). 비대칭 기울기는 부등침하·내부 손상·기초 불안 징후일 수 있습니다.</p><p>침하계·변위계·GNSS 데이터와 함께 제체 거동을 평가합니다.</p><p>댐 기울기는 부등침하·비대칭 변형의 징후입니다. 침하·변위·간극수압 데이터와 통합해 내부 손상 가능성을 평가합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "경사",
          "body": "제체 기울기 변화 추적"
        },
        {
          "title": "비대칭",
          "body": "단면·방향별 기울기 차이를 감시합니다."
        },
        {
          "title": "지진 · 홍수",
          "body": "이벤트 후 잔류 기울기를 평가합니다."
        }
      ],
      "principle": "<p>댐 제체 기울기는 침하·수평 변위·회전의 결과입니다. 경사계는 국부 회전, 광파기는 절대 변위 기반 기울기를 제공합니다.</p>",
      "installation": [
        "크레스트 · 익스트에 구조물경사계 설치",
        "광파기 측점망으로 절대 기울기를 보완",
        "수위 · 온도와 연동",
        "정상 운영 패턴을 확립",
        "홍수 · 지진 후 집중 계측",
        "침하 · 변위 · 간극수압과 통합"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "초기",
            "2축 경사",
            "기준선"
          ],
          [
            "일상",
            "경사 · 침하",
            "비대칭"
          ],
          [
            "홍수 · 지진",
            "급변",
            "응급 점검"
          ],
          [
            "이상",
            "누수 연계",
            "내부 조사"
          ],
          [
            "장기",
            "추세",
            "보수"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "연계",
          "조치"
        ],
        "rows": [
          [
            "점진 증가",
            "침하",
            "기초 조사"
          ],
          [
            "비대칭",
            "간극수압",
            "내부 점검"
          ],
          [
            "지진 후",
            "변위",
            "손상 조사"
          ],
          [
            "급증",
            "누수",
            "응급 점검"
          ]
        ]
      },
      "criteria": "<p>댐 관리기준은 댐 안전점검 규정·설계 기준·과거 데이터 기반 통계적 한계를 적용합니다. 수위별·계절별 정상 범위를 설정하고 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "변위 계측과 차이는?",
          "a": "기울기는 회전·부등침하에 민감합니다. 변위·침하와 함께 봅니다."
        },
        {
          "q": "제방도 동일한가요?",
          "a": "규모에 따라 경사·침하 중심으로 단순화할 수 있습니다."
        },
        {
          "q": "댐 경사와 변위계 중복이 필요한가요?",
          "a": "전체 기울기는 경사계, 국부 변형은 변위계로 보완하는 경우가 많습니다."
        },
        {
          "q": "비대칭 경사 징후는?",
          "a": "기초 불균등·수압 비대칭·굴착 영향을 조사합니다. 수위·온도와 동시 해석합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3.2 — 기울기 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "기울기의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3.2",
        "label": "기울기 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/building/deflection": {
    "id": "fields/building/deflection",
    "title": "처짐",
    "sections": {
      "overview": "<p><strong>처짐 계측</strong>은 장경간 구조물·슬래브·보 등에서 시공 중 처짐(요·처짐)을 <strong>침하계</strong>, <strong>자동광파기</strong>, <strong>변위계</strong>로 관리하는 항목입니다(KCS 3.9.1.1①). 거푸집 해체·프리스트레스·슬래브 타설 단계별 처짐이 설계 허용을 초과하지 않는지 확인합니다.</p><p>절대·상대 변위를 측정 목적에 맞게 구분하며, 온도·콘크리트 강도 발현과 연계해 해석합니다.</p><p>처짐 계측은 거푸집 해체·프리스트레스·슬래브 타설 등 시공 이벤트별로 기록합니다. 설계 예측 처짐 곡선과 비교하고, 수렴 전 과다 처짐은 동바리·타설 순서·강도 발현을 점검합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 건축·인접 구조물 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "시공 품질",
          "body": "거푸집·동바리·타설 품질을 처짐으로 검증합니다."
        },
        {
          "title": "안전",
          "body": "과다 처짐 시 보강·공정 조정 근거를 제공합니다."
        },
        {
          "title": "준공",
          "body": "장기 처짐 추세의 기준 데이터를 확보합니다."
        }
      ],
      "principle": "<p>처짐은 하중 재하·콘크리트 강도 증가·크리프에 따라 시간에 따라 변합니다. 초기 급변 후 수렴 추세를 확인하며, 설계 예측 처짐과 비교합니다.</p>",
      "installation": [
        "장경간 보 · 슬래브 대표 위치에 측점 선정",
        "침하계 · 광파기 · 변위계를 설계 위치에 설치",
        "거푸집 해체 전 · 후, 프리스트레스 전 · 후 초기치 기록",
        "온도 · 강도 시험 결과와 연동",
        "이상 처짐 시 즉시 원인 분석 · 보강 검토",
        "원격계측으로 연속 모니터링"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "타설 · 양생",
            "처짐 급변",
            "동바리 · 강도"
          ],
          [
            "거푸집 해체 전",
            "허용 대비",
            "보강 검토"
          ],
          [
            "프리스트레스",
            "이벤트 전후",
            "축력 · 처짐"
          ],
          [
            "수렴 후",
            "잔류 증가",
            "구조 검토"
          ],
          [
            "준공",
            "기준 데이터",
            "장기 이력"
          ]
        ]
      },
      "data": {
        "headers": [
          "단계",
          "징후",
          "조치"
        ],
        "rows": [
          [
            "타설 직후",
            "급처짐",
            "양생 · 동바리 점검"
          ],
          [
            "해체 전",
            "허용 초과",
            "보강 · 재타설 검토"
          ],
          [
            "수렴 후",
            "지속 증가",
            "구조 검토"
          ],
          [
            "온도 급변",
            "일시 증가",
            "온도 보정 후 판단"
          ]
        ]
      },
      "criteria": "<p>건축공사 관리기준은 구조 형식·중요도·설계 예측치·현장 조건에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong> 및 응력 한계를 기준으로 하며, 변위 수렴·변화속도·복수 센서 동시 변화를 우선 검토합니다. 준공 시 계측기 이관·장기 모니터링 계획을 수립할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "침하계와 광파기 차이는?",
          "a": "침하계는 국부 수직 변위, 광파기는 절대 3D 변위에 유리합니다. 현장에 맞게 병행합니다."
        },
        {
          "q": "수렴 기준은?",
          "a": "일정 기간 상대 침하량이 미미할 때 수렴으로 판단합니다. KCS·설계 기준을 따릅니다."
        },
        {
          "q": "처짐 허용은 어디서 확인하나요?",
          "a": "구조 설계·시공계획서·계측관리계획서에 따릅니다. 층별·경간별로 구분합니다."
        },
        {
          "q": "크리프와 즉시 처짐 구분은?",
          "a": "하중 이력·재령·온도와 장기 추세로 구분합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9.1.1 — 처짐 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "처짐의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.9.1.1",
        "label": "처짐 계측"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.9.1.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/building/column-shortening": {
    "id": "fields/building/column-shortening",
    "title": "기둥 축소량",
    "sections": {
      "overview": "<p><strong>기둥 축소량</strong> 계측은 초고층 건물의 콘크리트 기둥·코아벽체 수화·탈형에 따른 축방향 축소를 <strong>변형률계</strong>, 변위계로 측정하는 항목입니다(KCS 3.9.1.1②). 층별 축소 누적은 슬래브·외장재 거동·수직성에 영향을 줍니다.</p><p>KCS에 따라 매 층 승장 시 최소 1회 측정하는 것이 원칙입니다.</p><p>기둥 축소량은 층별 누적표로 관리하며, 동일 층 기둥 간 비대칭 축소는 슬래브·외장재 거동에 영향을 줍니다. 매 층 승장 시 측정 원칙을 준수하고 온도·강도 시험과 연동합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 건축·인접 구조물 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "축소 누적",
          "body": "층별·전체 축소량 추적"
        },
        {
          "title": "수직성",
          "body": "기둥 축소 차이에 따른 기울기·부등침하를 예방합니다."
        },
        {
          "title": "슬래브",
          "body": "기둥-슬래브 상대 변위를 관리합니다."
        }
      ],
      "principle": "<p>콘크리트 수화열·탈형에 따른 축방향 수축은 시간 함수입니다. 동일 층 기둥 간 축소 차이는 구조 비틀림·균열 원인이 될 수 있어 대칭 측정이 중요합니다.</p>",
      "installation": [
        "주요 기둥 · 코아벽체에 계측기 선정",
        "기둥 축방향 중심에 설치 · 균열 · 공극이 없는 부재를 선택",
        "매 층 승장 시 측정 일정 수립",
        "온도 · 강도 · 타설 이력과 연동",
        "누적 축소량을 설계 예측과 비교",
        "이상 시 구조 검토 · 공정 조정 실시"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "저층 타설",
            "축소 초기",
            "강도 · 양생"
          ],
          [
            "층별 승장",
            "층별 축소",
            "KCS 측정"
          ],
          [
            "중 · 상층",
            "누적 · 비대칭",
            "타설 순서"
          ],
          [
            "수렴",
            "설계 대비",
            "구조 검토"
          ],
          [
            "준공",
            "잔류",
            "이관 · 모니터링"
          ]
        ]
      },
      "data": {
        "headers": [
          "층",
          "징후",
          "대응"
        ],
        "rows": [
          [
            "저층",
            "축소 과대",
            "강도 · 양생 점검"
          ],
          [
            "중층",
            "비대칭",
            "타설 순서 조정"
          ],
          [
            "상층",
            "급증",
            "하중 · 온도 검토"
          ],
          [
            "누적",
            "설계 초과",
            "구조 재검토"
          ]
        ]
      },
      "criteria": "<p>건축공사 관리기준은 구조 형식·중요도·설계 예측치·현장 조건에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong> 및 응력 한계를 기준으로 하며, 변위 수렴·변화속도·복수 센서 동시 변화를 우선 검토합니다. 준공 시 계측기 이관·장기 모니터링 계획을 수립할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "변형률계만으로 충분한가요?",
          "a": "국부 변형률과 전체 축소량을 함께 봅니다. long gauge·변위계 보완이 필요할 수 있습니다."
        },
        {
          "q": "측정 종료 시점은?",
          "a": "축소 수렴 또는 준공까지이며, 장기 모니터링은 별도 계획할 수 있습니다."
        },
        {
          "q": "기둥 수축이 슬래브에 미치는 영향은?",
          "a": "상부 슬래브 처짐·균열·들뜸과 연계해 순공법 단계별로 봅니다."
        },
        {
          "q": "콘크리트 강도·재령 보정은?",
          "a": "동일 조건 시험체·온도 데이터로 수축 곡선을 보정합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 기둥 축소량 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "기둥 축소량의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.9",
        "label": "기둥 축소량"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/building/crack": {
    "id": "fields/building/crack",
    "title": "균열",
    "sections": {
      "overview": "<p><strong>균열 계측</strong>은 구조물 안전에 유해한 것으로 의심되는 균열 발생 시 <strong>균열계</strong>로 폭 변화를 추적하는 항목입니다(KCS 3.9.1.1③). 시공 중 콘크리트·조적·마감 균열은 온도 수축과 구조적 균열을 구분해 해석합니다.</p><p>정밀도·목적에 맞는 균열 측정 방식을 선정합니다.</p><p>시공 중 균열은 온도 수축과 구조적 균열을 구분합니다. 균열 맵·사진과 연동해 보고하며, 급속 확대 시 구조 검토·공법 조정을 연계합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 건축·인접 구조물 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "조기 발견",
          "body": "균열 진행을 정량 감시합니다."
        },
        {
          "title": "원인 구분",
          "body": "온도·수축·과응력·기초 문제를 구분합니다."
        },
        {
          "title": "조치",
          "body": "보수·공법 변경 근거를 제공합니다."
        }
      ],
      "principle": "<p>균열계는 균열 양측 상대 변위(폭)를 측정합니다. 온도·습도에 따른 일상 변동을 제외한 추세 증가가 구조적 이상 신호입니다.</p>",
      "installation": [
        "대표 균열 · 민감 부위 선정",
        "균열에 수직 교차 설치 · 초기 폭 기록",
        "온도 · 시공 이벤트와 시간 동기화",
        "복수 균열 동시 모니터링",
        "급속 확대 시 구조 점검을 연계",
        "사진 · 도면과 함께 보고"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "시공 초기",
            "균열 발생",
            "온도 · 수축"
          ],
          [
            "구조 재하",
            "폭 변화",
            "과응력"
          ],
          [
            "이벤트",
            "급확대",
            "구조 점검"
          ],
          [
            "준공 전",
            "복수 균열",
            "종합 판단"
          ],
          [
            "사용 중",
            "잔류 추세",
            "보수"
          ]
        ]
      },
      "data": {
        "headers": [
          "패턴",
          "해석",
          "조치"
        ],
        "rows": [
          [
            "단일 균열",
            "국부 응력",
            "부재 점검"
          ],
          [
            "복수 동시",
            "전체 거동",
            "구조 검토"
          ],
          [
            "온도 연동",
            "수축",
            "보정 후 판단"
          ],
          [
            "급확대",
            "과응력",
            "즉시 조치"
          ]
        ]
      },
      "criteria": "<p>건축공사 관리기준은 구조 형식·중요도·설계 예측치·현장 조건에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong> 및 응력 한계를 기준으로 하며, 변위 수렴·변화속도·복수 센서 동시 변화를 우선 검토합니다. 준공 시 계측기 이관·장기 모니터링 계획을 수립할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "모든 균열을 계측하나요?",
          "a": "안전에 유해한 것으로 의심되는 균열만 대상으로 합니다. 미세 균열은 육안·사진으로 보조합니다."
        },
        {
          "q": "구조물 안전계측 균열과 차이는?",
          "a": "원리는 동일하나 건축공사는 시공 단계·KCS 3.9 맥락에서 운영합니다."
        },
        {
          "q": "균열 폭 증가만으로 위험한가요?",
          "a": "폭·길이·방향·주변 변위·응력과 함께 봅니다. 급증 시 구조 검토가 필요합니다."
        },
        {
          "q": "온도·수축 균열과 구조 균열 구분은?",
          "a": "패턴·위치·하중 이벤트·변위 연계로 구분합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 건축공사 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 구조물·건축 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "균열의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.9",
        "label": "건축공사 계측"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "구조물·건축 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/building/adjacent-building": {
    "id": "fields/building/adjacent-building",
    "title": "주변건물",
    "sections": {
      "overview": "<p><strong>주변건물 계측</strong>은 굴착·진동·성토 등 건축공사가 인접 건축물에 미치는 영향을 <strong>균열계</strong>, <strong>구조물경사계</strong>, <strong>와이어식 변위계</strong>로 관리하는 항목입니다(KCS 3.9.1.1④). 손상 발생 또는 우려 시 사전·공사 중 계측을 실시합니다.</p><p>가시설·터널 인접 건물 계측과 원리는 유사하나 건축공사 맥락에서 운영합니다. 광학 측량은 공사 중 선택 보조입니다.</p><p>건축공사 인접 영향 계측은 사전·공사 중·종료 후 3단계로 계획합니다. 굴착·발파·진동 일지와 시간 동기화하고, 민감 건물은 계측 빈도를 높입니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 건축·인접 구조물 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "손상 예방",
          "body": "인접 건물 균열·경사·변위를 조기 파악합니다."
        },
        {
          "title": "분쟁 예방",
          "body": "객관적 계측 기록을 확보합니다."
        },
        {
          "title": "공법 조정",
          "body": "진동·굴착 속도 조절 근거를 제공합니다."
        }
      ],
      "principle": "<p>인접 영향은 거리·지반조건·공법·건물 노후도에 따라 다릅니다. 사전 조사로 기준 상태를 기록하고, 공사 이벤트와 동기화한 변화량을 관리합니다.</p>",
      "installation": [
        "영향권 내 건물을 선정 · 사전 조사 실시",
        "균열계 · 경사계 · 와이어식 변위계 배치",
        "굴착 · 발파 · 타설 일지와 연동",
        "민감 건물은 계측 빈도를 높",
        "이상 시 공사 중지 · 보강을 협의",
        "공사 종료 후 잔류 관찰 기간을 둡니다"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "사전 조사",
            "균열 · 경사 · 변위",
            "기준 상태 기록"
          ],
          [
            "굴착 · 타설",
            "변화량",
            "이벤트 연동"
          ],
          [
            "발파 · 진동",
            "진동 · 균열",
            "기준 대비"
          ],
          [
            "이상 징후",
            "복수 센서",
            "공법 조정"
          ],
          [
            "공사 후",
            "잔류 관찰",
            "복구 · 보고"
          ]
        ]
      },
      "data": {
        "headers": [
          "징후",
          "가능 원인",
          "조치"
        ],
        "rows": [
          [
            "균열 증가",
            "굴착 · 진동",
            "공법 조정"
          ],
          [
            "경사 증가",
            "차등 침하",
            "지반 보강"
          ],
          [
            "변위 급증",
            "지하 공사",
            "중지 · 조사"
          ],
          [
            "단일 센서만",
            "센서 · 온도",
            "점검 우선"
          ]
        ]
      },
      "criteria": "<p>건축공사 관리기준은 구조 형식·중요도·설계 예측치·현장 조건에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong> 및 응력 한계를 기준으로 하며, 변위 수렴·변화속도·복수 센서 동시 변화를 우선 검토합니다. 준공 시 계측기 이관·장기 모니터링 계획을 수립할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "가시설 주변건물과 동일한가요?",
          "a": "계측 원리는 같습니다. 건축공사 KCS 3.9·현장 협약 맥락에서 운영합니다."
        },
        {
          "q": "진동 기준은?",
          "a": "발파·기계 진동은 별도 기준·계약 조건을 따르며, 진동계 병행이 일반적입니다."
        },
        {
          "q": "KCS 3.9는 언제 적용하나요?",
          "a": "손상 발생 또는 우려가 있는 인접 건물에 사전·공사 중 계측을 실시할 때입니다."
        },
        {
          "q": "단일 센서만 증가하면?",
          "a": "센서·온도·설치 상태를 우선 점검하고, 복수 징후 동시 악화 시 공법 조정을 검토합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 건축공사 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 구조물·건축 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-101"
      ]
    },
    "metaDescription": "주변건물의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.9",
        "label": "건축공사 계측"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "구조물·건축 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/building/stress-strain": {
    "id": "fields/building/stress-strain",
    "title": "응력·변형률",
    "sections": {
      "overview": "<p><strong>응력·변형률 계측</strong>은 매우 중대한 구조부재의 응력과 중요 건축물 주요 부재의 변형률을 <strong>하중계</strong>, <strong>변형률계</strong>로 평가하는 항목입니다(KCS 3.9.1.1⑤⑥). 시공 과정에서 설치하며, 준공까지 측정 기간을 운영합니다.</p><p>광범위 변형률이 필요한 경우 광섬유·long gauge 등을 검토합니다.</p><p>응력·변형률 계측은 준공까지 측정 기간을 운영합니다. 중대 부재 선정·시공 단계 설치가 핵심이며, 준공 시 발주처 이관을 검토할 수 있습니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 건축·인접 구조물 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "과응력",
          "body": "설계 대비 응력 수준 확인"
        },
        {
          "title": "품질",
          "body": "프리스트레스·철근 정착 등을 검증합니다."
        },
        {
          "title": "장기",
          "body": "준공까지 변형률 이력을 축적합니다."
        }
      ],
      "principle": "<p>변형률계는 국부 변형률, 하중계는 축력·반력을 직접 측정합니다. 온도·수화열·재하 순서에 따른 변화를 분리해 해석합니다.</p>",
      "installation": [
        "설계 · 구조 검토 기준 대상 부재 선정",
        "시공 단계 기준 계측기 설치",
        "초기치 · 재하 이력 기록",
        "온도 보정 · 강도 발현과 연동",
        "이상 응력 시 구조 재검토를 연계",
        "준공 시 계측기 이관 검토"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "시공 설치",
            "초기 변형률",
            "영점 · 온도"
          ],
          [
            "재하 단계",
            "하중-변형",
            "설계 검증"
          ],
          [
            "프리스트레스",
            "축력 · 변형",
            "긴장 이력"
          ],
          [
            "이상",
            "응력 급증",
            "재검토"
          ],
          [
            "준공까지",
            "누적 이력",
            "이관 · 보관"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "징후",
          "조치"
        ],
        "rows": [
          [
            "응력 급증",
            "과재하",
            "하중 재분배 검토"
          ],
          [
            "변형률 지속",
            "크리프",
            "설계 대비 평가"
          ],
          [
            "비대칭",
            "편심",
            "부재 점검"
          ],
          [
            "온도 상관",
            "열응력",
            "보정 후 판단"
          ]
        ]
      },
      "criteria": "<p>건축공사 관리기준은 구조 형식·중요도·설계 예측치·현장 조건에 따라 설정합니다. <strong>설계예상변위</strong>·<strong>최대허용변위</strong> 및 응력 한계를 기준으로 하며, 변위 수렴·변화속도·복수 센서 동시 변화를 우선 검토합니다. 준공 시 계측기 이관·장기 모니터링 계획을 수립할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "모든 건물에 필요한가요?",
          "a": "KCS는 중대 부재·중요 건축물 등 조건부 적용입니다. 계측관리계획서에서 선정합니다."
        },
        {
          "q": "변형률로 응력을 알 수 있나요?",
          "a": "탄성계수·단면 가정이 필요합니다. 정성·추세 비교와 정량 해석을 병행합니다."
        },
        {
          "q": "응력계와 변형률계 선택은?",
          "a": "목적에 따라 선택합니다. 철근·콘크리트 응력·변형률을 설계 단면에 맞게 배치합니다."
        },
        {
          "q": "재하 시험 최소 측정 항목은?",
          "a": "하중 단계별 변형률·변위·균열을 동시 기록해 설계 검증에 사용합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.9 — 건축공사 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 구조물·건축 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "응력·변형률의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.9",
        "label": "건축공사 계측"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "구조물·건축 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/river-levee": {
    "id": "fields/dam/river-levee",
    "title": "하천제방",
    "sections": {
      "overview": "<p><strong>하천제방</strong> 계측은 하천 유역 제방(둑)의 침하·간극수압·지하수위·제체 변위·누수를 장기 모니터링하는 항목입니다. 콘크리트 댐과 달리 토성 제체·호안 블록 구조가 많아 침투·침식·침하가 핵심 위험 요인입니다.</p><p><strong>간극수압계</strong>·<strong>지하수위계</strong>로 수위 상승 시 제체 내부 압력을 추적하고, <strong>침하계</strong>·<strong>지중경사계</strong>로 제체·기초 변형을 확인합니다. 홍수기·우기 전후 계측 빈도를 높입니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "제체 안정",
          "body": "수위·간극수압·변위 연계로 붕괴·침식 징후를 조기 포착합니다."
        },
        {
          "title": "유지관리",
          "body": "장기 침하·누수 추세로 보수 우선순위를 정합니다."
        },
        {
          "title": "홍수 대응",
          "body": "극한 수위 시 제체 반응을 실시간·사후 해석합니다."
        }
      ],
      "principle": "<p>제방은 수두에 따라 간극수압·침투가 증가합니다. 제체 표면·호안 침하는 기초 압밀·침식과 연관되며, 지중경사계는 제체 내부 슬라이딩·변형을 추정합니다.</p>",
      "installation": [
        "제방 단면 · 약점 구간에 대표 측점 선정",
        "간극수압 · 지하수위 관측공을 제체 · 기초에 배치",
        "제체 정상 · 비탈에 침하 · 경사 측점 설치",
        "홍수기 전 점검 · 자동화 계측을 가동",
        "누수 · 백사 현상 구간을 육안 · 계측 병행",
        "댐 · 제방 공통 관리기준 · 보고 체계 적용"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "건설 · 보강",
            "침하 · 수압",
            "초기치"
          ],
          [
            "평상시",
            "간극수압 · 수위",
            "기준 추세"
          ],
          [
            "우기 · 홍수",
            "고빈도",
            "변위속도"
          ],
          [
            "누수 · 침식",
            "유량 · 탁도",
            "응급 점검"
          ],
          [
            "유지관리",
            "장기 추세",
            "보수 우선"
          ]
        ]
      },
      "data": {
        "headers": [
          "현상",
          "연계",
          "판단"
        ],
        "rows": [
          [
            "수위 상승+간극수압",
            "지하수위",
            "침투 · 안정"
          ],
          [
            "표면 침하",
            "층별침하",
            "기초 · 제체"
          ],
          [
            "누수 증가",
            "간극수압",
            "침식 · 균열"
          ],
          [
            "경사 증가",
            "지중경사",
            "슬라이딩"
          ]
        ]
      },
      "criteria": "<p>댐 관리기준은 댐 안전점검 규정·설계 기준·과거 데이터 기반 통계적 한계를 적용합니다. 수위별·계절별 정상 범위를 설정하고 이탈 시 등급별 조치를 실시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "댐과 제방 계측이 같나요?",
          "a": "센서·해석 원리는 유사하나 제체 재료·단면·수위 운영이 달라 측점·기준을 현장별로 설정합니다."
        },
        {
          "q": "하천제방만 별도 기준이 있나요?",
          "a": "KDS·지자체 유지관리 지침을 따르며, 본 항목은 제방 특화 운영 포인트를 정리합니다."
        },
        {
          "q": "하천 제방과 댐 계측 차이는?",
          "a": "제방은 선형 구조·침투·파고 영향이 크므로 수위·지하수·변위를 연계합니다."
        },
        {
          "q": "홍수기 집중 계측은?",
          "a": "수위 상승·지하수위·제방 변위속도를 고빈도로 전환합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-024",
      "installation": "IMG-030"
    },
    "heroCaption": "하천제방 계측 — 토성 제체·간극수압·침하·지하수위 모니터링",
    "metaDescription": "하천제방의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3",
        "label": "댐·제방 계측설비"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "댐·제체 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/dam/construction-phase": {
    "id": "fields/dam/construction-phase",
    "title": "건설중 계측",
    "sections": {
      "overview": "<p><strong>댐·제방 건설중 계측</strong>은 준공 후 안전관리(누수·간극수압·운영기 침하)와 구분하여, <strong>기초굴착·연속 콘크리트·성토·제방 축조</strong> 단계의 침하·변위·수압·온도·응력을 측정하는 체계입니다. 다측점 데이터는 <strong>원격계측시스템</strong>·<strong>데이터 관리</strong> SW로 QC·경보·일·주 보고를 자동화합니다(<em>dam construction monitoring software</em>).</p><p>건설 중 수화열·기초 변위와 운영기 간극수압·누수 패턴을 혼동하지 않고, 단계별 기준·센서 배치·데이터 이관 계획을 계측관리계획서에 명시합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 댐·제방 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "축조 단계 안전",
          "body": "기초·제체·연속 콘크리트 단계 변위·응력 추적"
        },
        {
          "title": "성토 · 제방",
          "body": "층별 침하·간극수압·지하수위를 관리합니다."
        },
        {
          "title": "초기 수압 · 온도",
          "body": "재령·수화열·기초 수압을 운영기와 구분해 기록합니다."
        },
        {
          "title": "통합 SW",
          "body": "다측점·QC·경보·보고를 원격계측·데이터관리로 연계합니다."
        }
      ],
      "principle": "<p>댐 건설중 계측은 <strong>단면·공정·센서</strong>를 공정표와 동기화합니다. <strong>간극수압계·침하계·지중경사계·변형률계</strong> 데이터는 현장 <strong>데이터로거</strong> → 통신 → <strong>데이터 관리</strong> → <strong>원격 모니터링</strong> 대시보드로 흐릅니다. 준공 시 운영기 안전관리 DB로 이관합니다.</p>",
      "installation": [
        "계측관리계획서에 건설중 항목 · 공정별 측점 · 관리기준을 명시",
        "설계 계측 단면에 간극수압 · 침하 · 경사 측점 배치",
        "콘크리트 타설 · 성토 층별 이벤트와 계측을 동기화",
        "방수 함체 · 산업용 로거에 센서를 수렴(지표면 가시)",
        "원격계측 · 데이터관리 SW로 QC · 경보 · 보고를 구성",
        "준공 전 기준값 · 센서 · 보고 이력을 운영기 안전관리로 이관"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "기초 · 굴착",
            "지중변위 · 지하수위",
            "기초 안정"
          ],
          [
            "제체 · 콘크리트",
            "변형률 · 온도 · 침하",
            "수화열 · 타설 속도"
          ],
          [
            "성토 · 제방",
            "층별 침하 · 간극수압",
            "다짐 · 층 두께"
          ],
          [
            "초기 충수 전",
            "변위 · 수압 기준",
            "운영기 대비"
          ],
          [
            "준공 · 인수",
            "종합 판정 · DB 이관",
            "안전관리 계측"
          ]
        ]
      },
      "data": {
        "headers": [
          "구성",
          "역할",
          "SW 연계"
        ],
        "rows": [
          [
            "센서 · 로거",
            "현장 수집",
            "데이터로거"
          ],
          [
            "통신",
            "LTE · 광 전송",
            "원격계측"
          ],
          [
            "QC · 보고",
            "검증 · 일 · 주 보고",
            "데이터 관리"
          ],
          [
            "경보",
            "기준 초과",
            "원격 모니터링"
          ],
          [
            "이관",
            "준공 DB",
            "운영기 안전관리"
          ]
        ]
      },
      "criteria": "<p>건설 중 관리기준은 설계·시공 단계별 허용 변위·수압·온도 상승률로 설정합니다. 운영기 댐 안전관리 기준(홍수·누수·간극수압 패턴)과 별도 관리합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "건설 중 계측과 누수·간극수압(운영기) 차이는?",
          "a": "건설 중 계측은 축조·성토·수화열·기초 단계, 운영기는 충수·홍수·장기 누수·안전관리 패턴 중심입니다."
        },
        {
          "q": "monitoring software는 무엇을 쓰나요?",
          "a": "현장 로거·통신·QC·경보·보고를 통합하는 원격계측·데이터관리 체계입니다. 제품명보다 프로세스·연동이 중요합니다."
        },
        {
          "q": "제방 공사도 포함되나요?",
          "a": "토성 제방·하천제방 축조·보강도 동일 프레임으로 층별 침하·수압·변위를 관리합니다."
        },
        {
          "q": "준공 후 데이터는?",
          "a": "건설 중 기준·이력·센서 상태를 운영기 안전관리 DB·계측관리계획으로 이관합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 54 20 25:2018</strong>「댐 계측설비」 §3 — 댐·제방 계측설비 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1 — 댐·제체 계측 일반 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-113"
      ],
      "data": [
        "IMG-056"
      ]
    },
    "heroImageId": "IMG-113",
    "heroCaption": "댐·제방 건설중 계측 — 축조·성토 단계 변위·수압·원격계측 SW",
    "metaDescription": "댐·제방 건설중 계측 — 축조·성토 단계 변위·수압·온도와 원격계측 SW 연계. Dam construction monitoring and integrated monitoring software.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-54-20-25",
        "cite": "§3",
        "label": "댐·제방 계측설비"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1",
        "label": "댐·제체 계측 일반"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 54 20 25:2018 댐 계측설비 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/tunnel/blast-vibration": {
    "id": "fields/tunnel/blast-vibration",
    "title": "발파진동·영향권",
    "sections": {
      "overview": "<p><strong>발파진동·영향권</strong> 계측은 터널·굴착 발파가 인접 구조물·지반·민원 구역에 미치는 진동을 <strong>진동계</strong>로 모니터링하는 KDS 4.1.5 선택 항목입니다. PPV(피크 입자 속도)·가속도를 관리기준과 비교하고, 초과 시 장약·발파 패턴·공법을 조정합니다.</p><p>영향권 측점은 <strong>지표·지중침하</strong>·<strong>구조물경사계</strong>·<strong>내공변위</strong>와 시간 동기화해 해석합니다. 고속 파형 기록은 <strong>동적 데이터로거</strong>를 병행할 수 있습니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 터널 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "민원 · 안전",
          "body": "인접 건물·시설 진동을 관리기준 이내로 유지합니다."
        },
        {
          "title": "공법 조정",
          "body": "PPV 초과 시 발파 설계를 즉시 수정합니다."
        },
        {
          "title": "연계 해석",
          "body": "침하·경사·내공변위와 동시 해석합니다."
        }
      ],
      "principle": "<p>발파진동은 지반 전파·구조 고유진동을 유발합니다. 측점은 영향권 경계·민감 구조물·기준 측점에 배치하고, 트리거·연속 기록으로 이벤트를 포착합니다.</p>",
      "installation": [
        "영향권 도면 · 민감 시설 목록 확정",
        "지표 · 지중 · 구조물 측점과 진동계를 동시 배치",
        "동적 DAQ 또는 이벤트 로거로 PPV를 산출",
        "발파 일지 · 장약 · 딜레이와 시간 태그 연동",
        "관리기준(구조 · 인체 · 계약)을 측점별로 설정",
        "초과 시 공정 중지 · 재설계 절차를 문서화"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "사전",
            "기준선 · PPV",
            "영향권 확정"
          ],
          [
            "발파 중",
            "PPV · 파형",
            "실시간 경보"
          ],
          [
            "초과 시",
            "장약 · 딜레이",
            "공정 중지"
          ],
          [
            "사후",
            "침하 · 경사",
            "누적 손상"
          ],
          [
            "준공",
            "민원 · 이력",
            "보고 · 해제"
          ]
        ]
      },
      "data": {
        "headers": [
          "지표",
          "기준",
          "조치"
        ],
        "rows": [
          [
            "PPV",
            "구조 · 인체",
            "장약 · 딜레이 조정"
          ],
          [
            "가속도",
            "민원",
            "보호 · 차단"
          ],
          [
            "주파수",
            "구조 고유",
            "공진 검토"
          ],
          [
            "동기 침하",
            "지표침하",
            "지반 손상"
          ]
        ]
      },
      "criteria": "<p>터널 관리기준은 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>, 지반등급, 굴착 방법, 상부 <strong>관리대상물</strong> 민감도에 따라 설정합니다. <strong>변위 수렴 여부</strong>(계측값 안정화)가 안정성 판단의 핵심이며, 지속 증가 추세는 지보 보강·굴착 방법 조정을 검토합니다. 내공변위·천단침하 정밀도는 KCS 기준 ±1 mm입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "정적 로거만으로 충분한가요?",
          "a": "발파 파형·PPV는 동적 DAQ 또는 이벤트형 진동계가 필요합니다. 추세만 보면 정적 로거로 부족합니다."
        },
        {
          "q": "터널 내부만 측정하나요?",
          "a": "영향권은 지표·인접 구조·지하 포함입니다. 터널 내공변위와 별도로 외부 측점이 필수입니다."
        },
        {
          "q": "발파 진동 기준은 어디서 정하나요?",
          "a": "인접 구조물·계측관리계획서·발파설계서에 따릅니다. 사전·사후 계측으로 기준선을 확립합니다."
        },
        {
          "q": "진동만 크고 변위는 작으면?",
          "a": "동적 영향은 별도 항목입니다. 천단·굴착면 정적 변위와 함께 누적 손상 여부를 봅니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 발파진동 (선택 항목) <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 환경·진동 기준·발주처 지침 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-097",
      "data": "IMG-052"
    },
    "heroCaption": "발파진동·영향권 — PPV·민감 구역 진동 모니터링",
    "metaDescription": "발파진동·영향권의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "발파진동 (선택 항목)"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "환경·진동 기준·발주처 지침"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/foundation-pile/cast-in-place-pile": {
    "id": "fields/foundation-pile/cast-in-place-pile",
    "title": "현장타설말뚝",
    "sections": {
      "overview": "<p><strong>현장타설말뚝(CIP)</strong> 계측은 천공·철근 cage 조립 후 콘크리트 타설 전·후에 <strong>sister-bar 변형률계</strong>를 cage에 등간격 매설하여 깊이별 축변형률을 측정합니다. 선단 암반·중간 토사층·말뚝두부의 하중 분담을 추정합니다.</p><p>벤토나이트·케이싱 천공 현장에서는 케이블 보호와 타설 전 calibration이 중요합니다. 정적·O-cell 시험과 연동하면 선단·주면 기여도를 분리할 수 있습니다.</p><p>현장타설말뚝은 cage 매설 sister-bar 변형률계로 깊이별 축력을 추정합니다. 타설 전 calibration·케이블 보호가 데이터 품질의 핵심입니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 기초·말뚝 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "축력 분포",
          "body": "깊이별 변형률로 축하중 분포를 산출합니다."
        },
        {
          "title": "선단 지지",
          "body": "암반 선단 반응 확인"
        },
        {
          "title": "시공 QC",
          "body": "타설·양생 후 초기 응답을 검증합니다."
        }
      ],
      "principle": "<p>CIP 말뚝은 지표면 아래 토사층을 관통해 암반에 선단을 받칩니다. cage 내부 sister-bar 게이지는 축 압축 변형률을 측정하고, 탄성역학·말뚝 이론으로 축력을 역산합니다.</p>",
      "installation": [
        "대표 말뚝 · 지층 단면을 설계와 대조",
        "cage 조립 시 sister-bar를 등간격(예: 2~5 m)으로 결속",
        "선단 · 중간 · 두부 구간에 측점을 집중 배치",
        "케이블을 보호관으로 인양 · 두부 박스에 연결",
        "타설 전 영점 · 온도 보정 실시",
        "시험하중 · 운영하중과 시간 동기화"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "천공 · cage",
            "영점 · 보호",
            "calibration"
          ],
          [
            "타설",
            "초기 변형률",
            "양생 · 온도"
          ],
          [
            "시험하중",
            "축력 분포",
            "선단 · 주면"
          ],
          [
            "운영",
            "추세",
            "재분배"
          ],
          [
            "이상",
            "선단 급증",
            "지지력 검토"
          ]
        ]
      },
      "data": {
        "headers": [
          "구간",
          "징후",
          "해석"
        ],
        "rows": [
          [
            "선단",
            "변형률 급증",
            "지지력 한계"
          ],
          [
            "중간",
            "마찰 구간",
            "주면 분담"
          ],
          [
            "두부",
            "상부 축력",
            "구조 전달"
          ],
          [
            "시험",
            "하중-변형",
            "O-cell · 정적"
          ]
        ]
      },
      "criteria": "<p>말뚝 축력·변형률 기준은 설계 축하중·시험하중(KDS·현장 정적·O-cell)을 따릅니다. 선단층 급변·주면 마찰 이상 시 지반·시공을 재검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "지표 위 기둥만 그리면 안 되나요?",
          "a": "hero(092)는 지중 수직 단면·지층·cage·게이지가 필수입니다. 지상 기둥 투시도는 금지입니다."
        },
        {
          "q": "bridge foundation-settlement(013)?",
          "a": "013은 교각 하부 pile group 침하입니다. 본 항목은 말뚝 내부 축력 단면입니다."
        },
        {
          "q": "sister-bar는 몇 개 설치하나요?",
          "a": "대표 말뚝·지층 단면에 등간격(통상 2~5 m)으로 배치합니다. 선단·중간·두부 구간을 집중합니다."
        },
        {
          "q": "타설 전 calibration이 필요한 이유는?",
          "a": "케이블·게이지 영점·온도 보정을 확정해야 타설 후 축력 역산이 신뢰됩니다. 벤토나이트·케이싱 현장은 케이블 보호가 특히 중요합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.9 — 기초·말뚝 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 현장 시험·설계 축력·발주처 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": [
        "IMG-092"
      ]
    },
    "metaDescription": "현장타설말뚝의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.9",
        "label": "기초·말뚝 계측"
      },
      {
        "grade": "D",
        "docId": "KDS-11-10-15",
        "cite": "—",
        "label": "현장 시험·설계 축력·발주처 시방"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/foundation-pile/precast-pile": {
    "id": "fields/foundation-pile/precast-pile",
    "title": "기성말뚝",
    "sections": {
      "overview": "<p><strong>기성말뚝(PHC·PC)</strong> 계측은 항타·압입 후 축력·변형을 <strong>변형률계</strong>·<strong>하중계</strong>·변위계로 추적합니다. 공심부 배치형·외부 부착형·pilot 계측 말뚝 등 현장 조건에 맞는 방식을 선택합니다.</p><p>항타 에너지·관입 깊이·지층 변화와 연동하면 주면 마찰·선단 지지력을 평가할 수 있습니다.</p><p>기성말뚝은 공심부·pilot 계측 말뚝 등 현장 조건에 맞는 센서 방식을 선택합니다. 항타 에너지·관입 깊이와 축력 데이터를 연동합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 기초·말뚝 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "항타 검증",
          "body": "관입 깊이·항타 에너지 대비 축력 확인"
        },
        {
          "title": "축력",
          "body": "하중 시험·운영 하중 시 변형률을 측정합니다."
        },
        {
          "title": "품질",
          "body": "말뚝두부·절단면 손상 여부를 간접 평가합니다."
        }
      ],
      "principle": "<p>PHC 말뚝은 공장 제작 원통형 prestressed concrete입니다. 내부 공심에 센서를 넣거나, 인접 pilot bore에 계측용 CIP 말뚝을 병설해 대표 축력을 추정합니다.</p>",
      "installation": [
        "계측 대상 말뚝 · 대표 지층 선정",
        "공심부 · 부착형 센서 또는 pilot 계측 말뚝을 설계",
        "항타 전후 영점 · 케이블 보호 확인",
        "말뚝두부 로거 · 연장 케이블 설치",
        "정적 시험하중과 동기화",
        "군 말뚝 침하 · 경사와 연계"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "항타 · 압입",
            "에너지 · 관입",
            "거부 · 손상"
          ],
          [
            "시험하중",
            "하중-변위",
            "지지력"
          ],
          [
            "운영",
            "축력 추세",
            "군 효과"
          ],
          [
            "pilot",
            "내부 게이지",
            "대표 분포"
          ],
          [
            "이상",
            "두부 손상",
            "재타 · 보강"
          ]
        ]
      },
      "data": {
        "headers": [
          "단계",
          "데이터",
          "판단"
        ],
        "rows": [
          [
            "항타",
            "에너지 · 관입",
            "거부 · 손상"
          ],
          [
            "시험",
            "하중-변위",
            "지지력"
          ],
          [
            "운영",
            "축력 추세",
            "재분배"
          ],
          [
            "pilot",
            "내부 게이지",
            "대표값"
          ]
        ]
      },
      "criteria": "<p>기성말뚝 계측 기준은 설계 지지력·항타 거부·시험하중 결과를 따릅니다. 관입 깊이 부족·두부 손상·축력 급변 시 재타·보강·지반 재검토를 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "CIP와 hero를 공유하나요?",
          "a": "category·cast-in-place hero는 IMG-092 단면입니다. PHC는 동일 단면에 hollow core·항타 맥락을 추가할 수 있습니다."
        },
        {
          "q": "load cell만으로 충분한가요?",
          "a": "두부 하중계는 총 축력만 제공합니다. 깊이별 분포는 변형률계가 필요합니다."
        },
        {
          "q": "항타 에너지와 연계?",
          "a": "관입 깊이·에너지·지층 변화와 축력을 함께 보면 거부·손상·주면 마찰을 평가할 수 있습니다."
        },
        {
          "q": "pilot 계측 말뚝은?",
          "a": "인접 bore에 CIP 계측 말뚝을 병설해 군 말뚝의 대표 축력·분포를 추정합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.9 — 기초·말뚝 계측 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 현장 시험·설계 축력·발주처 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": [
        "IMG-092"
      ]
    },
    "metaDescription": "기성말뚝의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.9",
        "label": "기초·말뚝 계측"
      },
      {
        "grade": "D",
        "docId": "KDS-11-10-15",
        "cite": "—",
        "label": "현장 시험·설계 축력·발주처 시방"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/environmental-impact/noise-level": {
    "id": "fields/environmental-impact/noise-level",
    "title": "소음",
    "sections": {
      "overview": "<p><strong>소음 계측</strong>은 공사 경계에서 <strong>소음계(Class 1)</strong>로 Leq·Lmax·주간/야간 dB를 연속 기록합니다. 굴착·항타·절단·발파·야간 작업 등 공종별 이벤트와 시간 태그를 연동합니다.</p><p>민감 수용체(주택·학교) 방향 측정주 배치가 핵심이며, 풍속·강우 보정과 방풍막 설치가 데이터 품질을 좌우합니다.</p><p>소음 계측은 민감 수용체 방향 경계 측정주에서 Leq·Lmax를 연속 기록합니다. 공종 일지·야간 기준과 시간 동기화가 필수입니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 환경·민원 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "연속 dB",
          "body": "1분·15분 Leq 기록"
        },
        {
          "title": "이벤트",
          "body": "공종·장비별 소음 peak를 식별합니다."
        },
        {
          "title": "민원",
          "body": "민원 시간대 데이터로 원인 분석을 지원합니다."
        }
      ],
      "principle": "<p>IEC 61672 Class 1 마이크는 A-weighting·Fast/Slow time constant로 dB를 산출합니다. 경계 펜스·독립 주에 설치하고 데이터로거로 원격 전송합니다.</p>",
      "installation": [
        "민감 수용체 방향 대표 측점 선정",
        "마이크 · 풍향막을 규격 높이에 설치",
        "방수 로거 · LTE를 주기에 연결",
        "주간/야간 · 휴일 기준 설정",
        "공종 일지와 시간 동기화"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "착공 전",
            "배경 소음",
            "기준선"
          ],
          [
            "주간 공사",
            "Leq · Lmax",
            "법규 · 계약"
          ],
          [
            "야간 · 휴일",
            "강화 기준",
            "작업 중지"
          ],
          [
            "이벤트",
            "공종 태그",
            "장비 · 공법"
          ],
          [
            "민원",
            "시간대 상관",
            "조치 · 보고"
          ]
        ]
      },
      "data": {
        "headers": [
          "지표",
          "기준",
          "조치"
        ],
        "rows": [
          [
            "Leq",
            "법규 · 계약",
            "공정 조정"
          ],
          [
            "Lmax",
            "이벤트",
            "장비 · 공법"
          ],
          [
            "야간",
            "강화 기준",
            "작업 중지"
          ],
          [
            "풍속",
            "보정",
            "마이크 품질"
          ]
        ]
      },
      "criteria": "<p>소음 허용 기준은 환경정책기본법·소음·진동 관련 법규·계약 특별조건을 따릅니다. 주간·야간·휴일 한계를 구분하고 Leq·Lmax 초과 시 공정·작업 시간을 조정합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "진동계(041)와 같나요?",
          "a": "진동계는 PPV·가속도(mm/s)입니다. 소음은 dB 음압 레벨로 별도 센서·기준입니다."
        },
        {
          "q": "터널 발파(097)?",
          "a": "발파는 지진파 PPV 영향권입니다. 소음은 경계 dB 연속 측정입니다."
        },
        {
          "q": "Class 1이 필요한가요?",
          "a": "법규·협약·환경영향평가에 따라 등급을 정합니다. 민감 수용체 구간은 고등급·연속 기록이 일반적입니다."
        },
        {
          "q": "야간 작업은?",
          "a": "주간·야간 한계가 다릅니다. 공종 일지와 Leq·Lmax를 시간 태그로 연동합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 발파진동·소음 등 선택 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 환경·민원 기준·발주처 지침 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": [
        "IMG-093"
      ]
    },
    "metaDescription": "소음의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "발파진동·소음 등 선택 항목"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "환경·민원 기준·발주처 지침"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "fields/environmental-impact/dust-concentration": {
    "id": "fields/environmental-impact/dust-concentration",
    "title": "분진",
    "sections": {
      "overview": "<p><strong>분진(미세먼지) 계측</strong>은 공사 경계에서 <strong>PM10·PM2.5</strong> 농도를 광학·베타선 센서로 실시간 측정합니다. 비산먼지·굴착·운반·절삭 등 공정과 연동해 살수·차단·작업 강도를 조절합니다.</p><p>흡입 노즐·샘플링 펌프·광학 셀이 일체형으로 장착된 실물 형상이 hero(093)의 핵심입니다.</p><p>분진 계측은 PM10·PM2.5 흡입형 센서와 풍속 데이터를 연동합니다. 기준 초과 시 살수·차단·공정 조정과 즉시 연계합니다.</p><p>계측 데이터는 <strong>계측책임자</strong>가 검토하는 계측관리계획서의 계측 빈도·<strong>설계예상변위</strong>·<strong>최대허용변위</strong>와 연계하여 운영합니다. 환경·민원 현장에서는 추세·변화속도·인접 센서의 동시 변화를 우선 검토하며, 현장별 상세 시방·허용값은 설계도서와 발주처 기준을 따릅니다.</p>",
      "purpose": [
        {
          "title": "PM 농도",
          "body": "PM10·PM2.5를 연속 기록합니다."
        },
        {
          "title": "확산",
          "body": "풍속·풍향과 연계해 민감 방향을 평가합니다."
        },
        {
          "title": "대응",
          "body": "기준 초과 시 살수·덮개·속도 제한과 연동합니다."
        }
      ],
      "principle": "<p>분진 센서는 공기 샘플을 흡입해 광 산란 또는 베타 감쇠로 질량 농도(μg/m³)를 산출합니다. 경계 펜스·독립 주에 노즐·펌프·셀·로거를 일체 배치합니다.</p>",
      "installation": [
        "민감 수용체 · 도로변 대표 측점 선정",
        "흡입구 높이 · 방향을 규격에 맞춥니다",
        "샘플링 라인 · 필터 유지보수 주기 설정",
        "기상(풍속) 데이터와 연동",
        "허용 농도 · 경보 설정"
      ],
      "constructionPhases": {
        "headers": [
          "단계",
          "중점 계측",
          "확인 사항"
        ],
        "rows": [
          [
            "착공 전",
            "배경 PM",
            "기준선"
          ],
          [
            "굴착 · 운반",
            "PM10 · 2.5",
            "살수 · 차단"
          ],
          [
            "강풍",
            "풍속 연계",
            "확산 · 민감 방향"
          ],
          [
            "기준 초과",
            "1h 평균",
            "작업 강도 조절"
          ],
          [
            "준공",
            "잔류 모니터링",
            "해제 · 보고"
          ]
        ]
      },
      "data": {
        "headers": [
          "항목",
          "수단",
          "조치"
        ],
        "rows": [
          [
            "PM10",
            "optical inlet",
            "살수 · 차단"
          ],
          [
            "PM2.5",
            "fine fraction",
            "민감 수용체"
          ],
          [
            "풍속",
            "anemometer",
            "확산"
          ],
          [
            "1h mean",
            "통계",
            "법규 보고"
          ]
        ]
      },
      "criteria": "<p>분진 허용 농도는 대기환경 보전법·지자체 조례·계약 기준을 따릅니다. PM10·PM2.5 1시간 평균 초과 시 살수·차단·작업 강도 조절을 연동합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "대기오염 그래프만 그리면?",
          "a": "hero(093)는 펜스·민가 레이아웃·실물 센서 주가 필수입니다. 추상 그래프는 금지입니다."
        },
        {
          "q": "기상계측기 hero?",
          "a": "044는 종합 기상입니다. 분진은 PM 전용 흡입 노즐·셀 형상(093)을 사용합니다."
        },
        {
          "q": "PM10과 PM2.5 차이?",
          "a": "입자 직경 기준이 다릅니다. 민감 수용체·보고 요건에 따라 둘 다 연속 기록합니다."
        },
        {
          "q": "기준 초과 시 조치?",
          "a": "살수·차단·작업 강도 조절·덮개 등 공정 대응을 계획서·협약에 따라 연동합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.1.5 — 발파진동·소음 등 선택 항목 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 환경·민원 기준·발주처 지침 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        "IMG-093"
      ]
    },
    "metaDescription": "분진의 측정 목적, 적용 현장, 설치, 데이터 해석, 유지관리 및 관련 센서를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§4.1.5",
        "label": "발파진동·소음 등 선택 항목"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "환경·민원 기준·발주처 지침"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.1.5",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/inclinometer": {
    "id": "sensors/inclinometer",
    "title": "지중경사계",
    "tagline": "심도별 수평변위 분포를 산정하는 지반·가시설 핵심 계측",
    "sections": {
      "overview": "<p><strong>지중경사계</strong>는 지중에 매설된 경사관 내부에서 깊이별 기울기 변화를 측정하여, 각 구간의 변위를 누적 계산함으로써 지반의 <strong>수평변위 분포</strong>를 산정하는 계측기입니다(KDS 표 4.1-1).</p><p>굴착·성토·강우·지하수위 변화로 인해 지반이 어느 깊이에서 어느 방향으로 움직이는지 확인하기 위한 심도별 수평변위 계측에 사용합니다. 터널 <strong>굴착면 주변 반경방향 변위</strong>는 <strong>지중변위계</strong>로, 영향권 수평 프로파일은 지중경사계로 구분합니다. <strong>지하수위계</strong>, <strong>간극수압계</strong>, <strong>로드셀</strong>·하중계와 함께 배치하면 원인 분석에 유리합니다.</p>",
      "purpose": [
        {
          "title": "심도별 변위",
          "accent": "displacement",
          "signal": "수평변위 · 프로파일",
          "body": "깊이별 수평변위 곡선으로 변위 집중 심도·활동면을 추정합니다. 절대값보다 <strong>변위속도</strong>와 심도별 꺾임을 함께 봅니다.",
          "relatedField": "fields/retaining-excavation/earth-retaining-wall"
        },
        {
          "title": "진행성 판단",
          "accent": "vibration",
          "signal": "누적 · 속도",
          "body": "누적변위·변위속도로 위험 단계를 평가하고, 강우·양수 이벤트와 시간 동기화합니다."
        },
        {
          "title": "통합 해석",
          "accent": "integrated",
          "signal": "연계 센서",
          "body": "굴착 단계·강우·수위·지보재 하중과 연계해 원인(토압·수압·지보 부담)을 구분합니다.",
          "sensors": [
            "sensors/water-level-meter",
            "sensors/piezometer",
            "sensors/load-cell"
          ]
        },
        {
          "title": "장기 관리",
          "accent": "structure",
          "signal": "유지관리",
          "body": "사면·제방·교대 등 장기 현장에서 추세 데이터를 축적하고 이상 징후를 조기 포착합니다.",
          "relatedField": "fields/slope"
        }
      ],
      "applications": [
        "흙막이 굴착 벽체 · 배면 수평변위",
        "사면 · 비탈면 활동면 · 진행성 감시",
        "연약 지반 성토 측방유동 · 심부 변형",
        "터널 영향권 · 교대 · 제방 장기 유지관리"
      ],
      "installation": [
        "위치 확정 및 A축 · B축 기준축 설정",
        "설계 심도까지 천공 및 공벽 · 지하수 상태 확인",
        "경사관 삽입(관 홈 방향과 기준축 일치)",
        "그라우팅 및 지상부 보호함 설치",
        "설치 안정 후 반복 측정으로 초기치 확정",
        "데이터로거 · 원격계측 연동 및 계측 일정 수립"
      ],
      "principle": "<p>경사관은 일정 간격의 홈을 가진 관으로 설치됩니다. 프로브 또는 고정식 센서는 관 축 방향을 따라 이동·설치되어 각 심도의 기울기 변화를 측정합니다. 초기 측정값을 기준으로 이후 측정값과의 차이를 구하고, 구간 길이에 따라 누적하면 깊이별 수평변위 곡선이 만들어집니다.</p><ul><li><strong>측정축:</strong> A축·B축(또는 X·Y). 흙막이에서는 굴착 방향과 직교 방향을 명확히 정의합니다.</li><li><strong>초기치:</strong> 설치 안정 후 반복 측정으로 재현성을 확인해 기준값을 설정합니다.</li><li><strong>누적변위:</strong> 구간별 경사 변화량을 심도 방향으로 누적해 변위곡선을 산출합니다.</li><li><strong>변위속도:</strong> 일정 기간의 변위 증가량을 시간으로 나누어 진행성을 판단합니다.</li></ul>",
      "data": {
        "headers": [
          "적용 현장",
          "확인 대상",
          "활용 포인트"
        ],
        "rows": [
          [
            "흙막이 굴착",
            "벽체 · 배면 수평변위",
            "굴착 단계 · 지보재 하중 연계"
          ],
          [
            "사면 · 비탈면",
            "활동면 · 진행성",
            "강우 · 지하수위 상관"
          ],
          [
            "연약지반 성토",
            "측방유동 · 심부 변형",
            "간극수압 · 침하 동시 검토"
          ],
          [
            "터널 주변",
            "영향권 수평변위",
            "지중변위계(굴착면) · 천단 · 내공 연계"
          ],
          [
            "교대 · 제방",
            "배면 지반 변형",
            "장기 유지관리"
          ]
        ]
      },
      "criteria": "<p>관리기준은 설계·계측관리계획서·인접 시설 민감도에 따라 <strong>설계예상변위</strong>·<strong>최대허용변위</strong>를 설정합니다. 절대 변위·변위속도·심도별 집중을 병행합니다. 초기치 불안정·관 변형·그라우팅 불량은 해석 전 시공 품질을 점검합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "수동과 자동 지중경사계 차이는?",
          "a": "수동은 프로브 삽입 정기 측정, 자동은 다점 고정 센서·데이터로거 연속 수집입니다. 고위험 현장은 자동이 유리합니다."
        },
        {
          "q": "A축·B축을 어떻게 정하나요?",
          "a": "굴착·활동 예상 방향을 한 축으로, 직교 방향을 다른 축으로 정의합니다. 설치 기록에 반드시 남깁니다."
        },
        {
          "q": "변위곡선에서 꺾임이 보이면?",
          "a": "해당 심도가 전단·활동 집중 구간일 수 있습니다. 시간 추세·간극수압과 함께 해석합니다."
        },
        {
          "q": "안정층은 어디까지 근입하나요?",
          "a": "변위 집중 심도·활동 예상면 하부의 안정 지층까지 근입합니다. 설계·지반조사에 따라 심도를 확정하고 도면에 명시합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": [
        {
          "id": "IMG-028",
          "caption": "측정 원리 — 구간 기울기 변화에서 누적변위 산정",
          "figureNo": 2
        },
        {
          "id": "IMG-026",
          "caption": "케이싱 단면 — 4방향 가이드 홈과 프로브 휠",
          "figureNo": 3
        }
      ],
      "installation": {
        "id": "IMG-027",
        "caption": "설치 단면 — 보링·그라우트·안정층 근입·활동면(변위 집중 심도)",
        "figureNo": 4
      },
      "data": {
        "id": "IMG-029",
        "caption": "데이터 해석 — Incremental·Cumulative 변위와 활동면",
        "figureNo": 5
      }
    },
    "detailLink": {
      "href": "/homepage/sensors/inclinometer/",
      "label": "지중경사계 상세 기술자료 보기"
    },
    "metaDescription": "지중경사계의 정의, 계측 목적, 측정 원리, 설치 방법, 데이터 해석, 관리기준 및 관련 센서를 정리한 기술자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/water-level-meter": {
    "id": "sensors/water-level-meter",
    "title": "지하수위계",
    "tagline": "관측공·우물 내 지하수위 변화를 추적하는 수리 계측",
    "sections": {
      "overview": "<p><strong>지하수위계</strong>는 관측공 또는 우물 내 수위 변화를 측정하여 지하수위 상승·저하와 계측 대상 지반의 수리 조건 변화를 확인하는 계측기입니다. 강우·양수·굴착·배수에 따른 수위 반응을 기록합니다.</p><p>흙막이 굴착, 사면, 연약지반, 댐·제방, 지하수 영향 평가에 널리 사용되며 <strong>지중경사계</strong>, <strong>간극수압계</strong>와 연계 해석합니다.</p>",
      "purpose": [
        {
          "title": "수위 추적",
          "body": "지하수위·변화속도를 시계열로 관리합니다."
        },
        {
          "title": "원인 분석",
          "body": "강우·양수·굴착과 수위 반응을 상관분석합니다."
        },
        {
          "title": "안정 연계",
          "body": "수위 변화가 변위·토압·간극수압에 미치는 영향을 평가합니다."
        }
      ],
      "applications": [
        "흙막이 굴착 지하수위 · 배수 관리",
        "사면 · 비탈면 배수 · 수리 조건 추적",
        "연약 지반 · 매립지 수위 변화",
        "댐 · 제방 · 해안 조위 · 지하수 연동"
      ],
      "installation": [
        "관측 목적 지층 · 심도에 관측공을 시공",
        "필터 · 보호관 · 표면수 차단 조치를",
        "센서 · 케이블 · 보호함 설치",
        "초기 수위를 안정 후 기록",
        "강우계 · 데이터로거와 연동",
        "정기 점검 · 보정 일정을 둡니다"
      ],
      "principle": "<p>압력식·부력식·초음파식 등으로 관측공 내 수면 높이를 측정합니다. 수위 상승은 사면·굴착 안정 저하, 과도 저하는 주변 침하를 유발할 수 있어 변위·침하와 함께 봅니다.</p>",
      "data": {
        "headers": [
          "현상",
          "연계",
          "해석"
        ],
        "rows": [
          [
            "강우 후 상승",
            "강우량",
            "침투 · 지체 시간"
          ],
          [
            "양수 시 하강",
            "양수량",
            "주변 침하"
          ],
          [
            "굴착 중 변동",
            "굴착 단계",
            "배면 안정"
          ],
          [
            "장기 상승",
            "간극수압",
            "사면 위험"
          ]
        ]
      },
      "criteria": "<p>수위 급변·설계 수위 초과·인접 침하 연계 시 경보합니다. 관측공 막힘·센서 drift는 정기 점검으로 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "지하수위계와 간극수압계 차이?",
          "a": "지하수위계는 관측공 자유수면, 간극수압계는 토층 내부 압력입니다. 함께 쓰면 해석이 정확합니다."
        },
        {
          "q": "수위가 불규칙하면?",
          "a": "관측공 손상·표면수 유입·인근 양수 영향을 조사합니다."
        },
        {
          "q": "벽체 표면에 수위계를 달아도 되나요?",
          "a": "아닙니다. 관측공 또는 우물 내 자유수면을 측정합니다. 벽체 부착은 수리 조건을 대표하지 못합니다."
        },
        {
          "q": "강우와 수위가 동시에 변하면?",
          "a": "침투 지체 시간을 고려해 강우량·수위 상승 시차를 분석합니다. 단순 상관만으로 원인을 단정하지 않습니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-030",
        "caption": "설치 개념 — well cap·screen·개방 G.W.L·submersible logger(벽체 부착 금지)",
        "figureNo": 2
      },
      "principle": {
        "id": "IMG-062",
        "caption": "배면 지반 — ① 관측공·개방 수면 vs ② 밀폐 필터 간극수압(IMG-002 ②③)",
        "figureNo": 3
      }
    },
    "metaDescription": "지하수위계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/piezometer": {
    "id": "sensors/piezometer",
    "title": "간극수압계",
    "tagline": "토층 내부 간극수압·압밀 소산을 직접 측정",
    "sections": {
      "overview": "<p><strong>간극수압계</strong>는 토층 내부의 물 압력을 측정하여 압밀, 사면 안정, 굴착 안정성, 제체 침투 안정성을 평가하는 계측기입니다. 과잉간극수압·소산 속도·수위 반응이 핵심 측정 대상입니다.</p>",
      "purpose": [
        {
          "title": "간극수압",
          "body": "성토·수위 변화에 따른 토층 압력 추적"
        },
        {
          "title": "압밀",
          "body": "소산 곡선으로 압밀 진행 확인"
        },
        {
          "title": "안정",
          "body": "사면·굴착·댐 안정 해석 입력 자료를 제공합니다."
        }
      ],
      "applications": [
        "흙막이 · 굴착 배면 간극수압 소산",
        "연약 지반 성토 · 압밀 진행 확인",
        "사면 · 댐 제체 침투 · 수압 관리",
        "기초 · 말뚝 주변 수압 조건 평가"
      ],
      "installation": [
        "목적 지층에 천공 · 필터 설치",
        "공기 혼입 · 그라우팅 품질 관리",
        "케이블 보호 · 방수",
        "초기 수압 기록",
        "지하수위계 · 침하계와 동단면 배치",
        "자동 수집 · 경보 설정"
      ],
      "principle": "<p>필터부가 목적 지층과 수리적으로 연결된 압력 센서입니다. 성토 중 상승 후 소산은 정상 압밀, 장기 미소산·재상승은 속도 조정·배수 검토가 필요합니다.</p>",
      "data": {
        "headers": [
          "패턴",
          "의미",
          "조치"
        ],
        "rows": [
          [
            "상승 후 소산",
            "압밀 진행",
            "다음 하중 단계"
          ],
          [
            "소산 지연",
            "배수 불량",
            "성토 중지"
          ],
          [
            "재상승",
            "추가 하중",
            "속도 조정"
          ],
          [
            "수위 연동",
            "침투",
            "댐 · 사면 안정"
          ]
        ]
      },
      "criteria": "<p>허용 간극수압·소산율은 설계·안정 해석에 따릅니다. 급격 상승 시 즉시 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "Piezometer 종류는?",
          "a": "관입형·매립형·공압식 등이 있습니다. 지층·시공 조건에 맞게 선택합니다."
        },
        {
          "q": "간극수압 0이면?",
          "a": "배수·필터 막힘·센서 이상을 점검합니다."
        },
        {
          "q": "토압계와 함께 보면?",
          "a": "유효응력 해석에 간극수압이 필요합니다. 동일 단면·심도에서 토압·간극수압·지하수위를 함께 배치합니다."
        },
        {
          "q": "소산이 멈추지 않으면?",
          "a": "배수 경로·필터 막힘·추가 하중 여부를 점검하고, 성토 속도·하중 단계 조정을 검토합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-031",
        "caption": "설치도 — 필터·그라우트·차수·junction→로거(≠ 관측공)",
        "figureNo": 2
      },
      "data": {
        "id": "IMG-051",
        "caption": "간극수압 소산 그래프 — 성토 단계별 상승·소산",
        "figureNo": 3
      }
    },
    "metaDescription": "간극수압계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/settlement-gauge": {
    "id": "sensors/settlement-gauge",
    "title": "침하계",
    "tagline": "지표·지중 특정점의 수직변위(침하·융기) 측정",
    "sections": {
      "overview": "<p><strong>침하계</strong>는 지표 또는 지중 특정 지점의 수직변위를 측정하여 성토, 굴착, 구조물 하중에 따른 침하 또는 융기를 확인하는 계측기입니다. 연약지반, 기초, 도로·철도 노반, 굴착 주변에 적용합니다.</p>",
      "purpose": [
        {
          "title": "침하량",
          "accent": "settlement",
          "signal": "누적 ΔH · 속도",
          "body": "기준점 대비 <strong>누적 침하·융기</strong>와 변화속도 추적 즉시침하·압밀·잔류 구간을 구분해 해석합니다.",
          "relatedField": "fields/soft-ground/settlement"
        },
        {
          "title": "성토 제어",
          "accent": "load",
          "signal": "공정 · 허용",
          "body": "성토 단계·속도를 허용 범위와 비교하고, 간극수압 소산·측방변위와 함께 안정성을 판단합니다.",
          "relatedField": "fields/retaining-excavation/earth-retaining-wall"
        },
        {
          "title": "예측",
          "accent": "integrated",
          "signal": "t–S 곡선",
          "body": "시간-침하 곡선으로 <strong>최종 침하</strong>·잔류침하 위험을 추정하고, 층별침하계와 병행해 지층 기여도 검토",
          "sensors": [
            "sensors/layer-settlement-gauge"
          ]
        }
      ],
      "applications": [
        "연약 지반 성토 · 압밀 침하",
        "흙막이 굴착 배면 지표침하",
        "철도 · 도로 노반 침하",
        "건축 · 인접 구조물 기초 침하"
      ],
      "installation": [
        "안정 기준점 설치",
        "측점 앵커 · 보호관 설치",
        "초기치 반복 측정",
        "하중 · 공정 이력 연동",
        "자동화 검토",
        "온도 · 결빙 영향 기록"
      ],
      "principle": "<p>기준점 대비 수직 변위를 레벨·와이어·압전식 등으로 측정합니다. 침하량·기울기·간극수압 소산 상관이 중요합니다.</p>",
      "data": {
        "headers": [
          "곡선",
          "의미",
          "활용"
        ],
        "rows": [
          [
            "즉시 침하",
            "공극압 실화",
            "초기"
          ],
          [
            "압밀 구간",
            "로그 시간",
            "예측"
          ],
          [
            "잔류",
            "안정화",
            "최종 고"
          ],
          [
            "재가속",
            "불안정",
            "중지"
          ]
        ]
      },
      "criteria": "<p>허용 침하·속도는 설계·공종별로 다릅니다. 철도·인접 구조물은 특히 엄격합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "기준점이 불안정하면?",
          "a": "측정값 전체가 왜곡됩니다. 영향권 밖 안정 지반에 설치합니다."
        },
        {
          "q": "융기(상승)도 측정?",
          "a": "네, 상대 기준점 대비 상승도 침하계로 포착 가능합니다."
        },
        {
          "q": "지표침하핀과 차이는?",
          "a": "침하핀은 측량 표식으로 수동 측량용입니다. 자동계측 Figure에는 침하계(센서)를 사용합니다."
        },
        {
          "q": "최종 침하 예측은?",
          "a": "로그 시간-침하 곡선·히퍼볼릭 외삽 등으로 추정하며, 층별침하계·간극수압과 교차 검증합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-032",
        "caption": "침하판·침하계 설치 — 성토 하부 연장봉·보호관",
        "figureNo": 2
      }
    },
    "metaDescription": "침하계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/layer-settlement-gauge": {
    "id": "sensors/layer-settlement-gauge",
    "title": "층별침하계",
    "tagline": "지중 층별 침하를 분리 측정하는 다점 침하계",
    "sections": {
      "overview": "<p><strong>층별침하계</strong>는 지중 여러 심도에서 발생하는 침하를 분리 측정하여 어느 지층에서 침하가 집중되는지 확인하는 계측기입니다. 연약지반, 매립지, 대심도 압밀층, 성토 구간에 적용합니다.</p>",
      "purpose": [
        {
          "title": "지층 분리",
          "body": "구간별 침하 기여도를 산정합니다."
        },
        {
          "title": "개량 검증",
          "body": "PBD·SD·교반 효과를 평가합니다."
        },
        {
          "title": "잔류 위험",
          "body": "미압밀층 잔류침하를 판단합니다."
        }
      ],
      "applications": [
        "연약 지반 성토 · 압밀층",
        "매립지 · 대심도 압밀 구간",
        "성토부 층별 침하 분리",
        "지반개량 효과 검증"
      ],
      "installation": [
        "지반조사 심도 기준 시공",
        "연약층 경계에 앵커",
        "성토 전 설치 · 초기치",
        "정기 계측",
        "총침하계와 교차 검증",
        "데이터로거 연동"
      ],
      "principle": "<p>앵커·마그네트 반복 측정으로 구간 상대 침하를 산출합니다. 총 침하만으로는 원인 지층을 알 수 없어 층별침하계가 유리합니다.</p>",
      "data": {
        "headers": [
          "층",
          "침하",
          "판단"
        ],
        "rows": [
          [
            "매립",
            "급속",
            "즉시"
          ],
          [
            "연약점토",
            "장기",
            "압밀"
          ],
          [
            "개량층",
            "감소",
            "효과"
          ],
          [
            "하부",
            "미소",
            "기준"
          ]
        ]
      },
      "criteria": "<p>특정 층 집중 침하 시 해당 층 개량·공법을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "침하계 대체 가능?",
          "a": "총침하는 가능하나 층별 분리는 불가합니다. 목적에 따라 병행합니다."
        },
        {
          "q": "마그네트 방식이란?",
          "a": "심도별 마그네트 위치를 프로브로 읽어 상대 침하를 계산하는 방식입니다."
        },
        {
          "q": "앵커 깊이는 어떻게 정하나요?",
          "a": "연약층 경계·개량층 하부 등 지반조사 심도에 맞춰 배치합니다. 총침하와 교차 검증합니다."
        },
        {
          "q": "성토 전 설치 이유는?",
          "a": "각 층의 초기·누적 침하를 분리하려면 하중 전에 기준을 잡아야 합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-033",
        "caption": "층별침하계 — 자석링·기준관·층별 침하",
        "figureNo": 2
      }
    },
    "metaDescription": "층별침하계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/earth-pressure-cell": {
    "id": "sensors/earth-pressure-cell",
    "title": "토압계",
    "tagline": "흙막이·옹벽·매설체 접촉면 토압 측정",
    "sections": {
      "overview": "<p><strong>토압계</strong>는 흙막이 벽체, 옹벽, 매설 구조물, 성토체 내부 또는 접촉면에 작용하는 토압을 측정하는 계측기입니다. 흙막이, 옹벽, 지하구조물, 성토, 터널 라이닝, 댐·제방에 적용합니다.</p>",
      "purpose": [
        {
          "title": "토압 검증",
          "body": "설계 토압·주동토압 발현 확인"
        },
        {
          "title": "지보 연계",
          "body": "벽체 변위·하중계와 함께 해석합니다."
        },
        {
          "title": "공정",
          "body": "굴착·성토 단계별 토압 변화 기록"
        }
      ],
      "applications": [
        "흙막이 · 굴착 벽체 배면 토압",
        "옹벽 · 지하구조물 접촉면",
        "성토체 · 터널 라이닝 주변",
        "댐 · 제방 제체 토압 검증"
      ],
      "installation": [
        "설계 위치 · 방향에 매립",
        "초기 접촉 상태 기록",
        "케이블 보호",
        "굴착 · 성토 단계 연동",
        "변위 · 하중 데이터 통합",
        "손상 · 드리프트 점검"
      ],
      "principle": "<p>압력 셀이 토압을 직접 측정합니다. 설치 조건·접촉·아치효과에 민감하므로 단독 값보다 추세·연계 해석이 중요합니다.</p>",
      "data": {
        "headers": [
          "현상",
          "연계",
          "해석"
        ],
        "rows": [
          [
            "토압 증가",
            "굴착 심도",
            "주동토압"
          ],
          [
            "정체",
            "변위 증가",
            "아치 · 접촉"
          ],
          [
            "급감",
            "센서",
            "고장 · 이탈"
          ],
          [
            "수위 연동",
            "지하수위",
            "유효응력"
          ]
        ]
      },
      "criteria": "<p>설계 토압 대비 편차·급변 시 원인 분석합니다. 절대값보다 패턴이 중요할 수 있습니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "토압이 설계보다 낮으면?",
          "a": "접촉 불량·아치효과·센서 편향을 점검합니다."
        },
        {
          "q": "총응력·간극수압과 관계?",
          "a": "유효응력 = 총응력 - 간극수압. 간극수압계와 함께 봅니다."
        },
        {
          "q": "감지면 방향이 중요한 이유는?",
          "a": "토압 작용 방향(배면→벽체)과 일치해야 측정값이 해석에 사용됩니다. 도면에 화살표로 표기합니다."
        },
        {
          "q": "굴착 단계별 토압 변화는?",
          "a": "주동토압 재분배·아치효과로 패턴이 바뀝니다. 절대값보다 단계별 추세·변위·하중 연계가 중요합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-034",
        "caption": "설치 개념 — 벽체 배면 감지면과 토압 작용 방향(배면→벽체)",
        "figureNo": 2
      }
    },
    "metaDescription": "토압계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/load-cell": {
    "id": "sensors/load-cell",
    "title": "하중계",
    "tagline": "버팀보·앵커·록볼트·말뚝 축력·하중 측정",
    "sections": {
      "overview": "<p><strong>하중계</strong>는 버팀보, 어스앵커, 록볼트, 말뚝, 구조 부재에 작용하는 축력 또는 압축·인장 하중을 측정하는 계측기입니다. 앵커 장력은 KDS 표기에 따라 <strong>로드셀</strong>로 구분하기도 합니다. 가시설, 터널, 재하시험에 핵심입니다.</p>",
      "purpose": [
        {
          "title": "축력",
          "body": "지보재·기초 부담을 실시간·정기 추적합니다."
        },
        {
          "title": "안전",
          "body": "과부하·이탈·파솕 징후를 포착합니다."
        },
        {
          "title": "설계 검증",
          "body": "설계 하중 대비 실측을 비교합니다."
        }
      ],
      "applications": [
        "가시설 버팀보 · 어스앵커 축력",
        "터널 록볼트 · 지보 하중",
        "말뚝 · 기초 재하 시험",
        "교량 · 구조물 시험하중 계측"
      ],
      "installation": [
        "설계 위치에 장착",
        "인장 · 잠금 직후 초기값",
        "케이블 · 방청",
        "굴착 · 공정 일지 연동",
        "자동 경보",
        "정기 교정"
      ],
      "principle": "<p>저항 변화·변형률로 축력을 환산합니다. 온도·프리로드·지지 조건 영향을 함께 검토합니다.</p>",
      "data": {
        "headers": [
          "패턴",
          "의미",
          "조치"
        ],
        "rows": [
          [
            "증가",
            "부담 증가",
            "지보 · 굴착 검토"
          ],
          [
            "급감",
            "이탈 · 파손",
            "즉시 확인"
          ],
          [
            "열주기",
            "온도",
            "정상"
          ],
          [
            "편차",
            "지반",
            "보강"
          ]
        ]
      },
      "criteria": "<p>설계 축력·허용 변화율 기준. 급변 시 현장 조사합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "하중계와 변형률계?",
          "a": "하중계는 축력 직접, 변형률계는 응력 추정. 용도에 따라 선택·병행합니다."
        },
        {
          "q": "앵커 lock-off 손실?",
          "a": "정착·크리프 영향. 추세 모니터링이 중요합니다."
        },
        {
          "q": "버팀보 중앙에 설치하면?",
          "a": "축압축력 전달 위치가 아닙니다. 띠장–버팀보 접합부(끝단)가 일반적입니다."
        },
        {
          "q": "음수 축력이 나오면?",
          "a": "인장·이탈·온도·초기치 오류·접촉 불량을 점검합니다. 장비·설치 상태를 우선 확인합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": [
        {
          "id": "IMG-035",
          "caption": "하중계 개요 — 버팀보 끝단 축압축·어스앵커 굴착측 노출 두부 인장",
          "figureNo": 2
        },
        {
          "id": "IMG-003",
          "caption": "버팀보 하중계 — 띠장 접합부(끝단) 설치 상세",
          "figureNo": 3
        },
        {
          "id": "IMG-004",
          "caption": "어스앵커 하중계 — 굴착측 노출(지지링·반력판–하중계–앵커헤드)",
          "figureNo": 4
        }
      ],
      "data": {
        "id": "IMG-052",
        "caption": "버팀보 하중 변화 그래프와 경보 기준선",
        "figureNo": 5
      }
    },
    "metaDescription": "하중계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/strain-gauge": {
    "id": "sensors/strain-gauge",
    "title": "변형률계",
    "tagline": "강재·철근·콘크리트 변형률로 응력·부담 추정",
    "sections": {
      "overview": "<p><strong>변형률계</strong>는 강재, 철근, 콘크리트 등 구조 부재의 변형률을 측정하여 응력 변화와 부담 상태를 추정하는 센서입니다. 교량 PSC·강재 거더, 터널 지보, 버팀보, 말뚝, 재하시험에 적용합니다. 교량 휨·전단 응력은 <a href=\"#fields/bridge/strain-stress\">변형률·응력</a> 항목과 연계합니다.</p>",
      "purpose": [
        {
          "title": "응력",
          "body": "탄성계수·단면으로 응력 환산"
        },
        {
          "title": "재하시험",
          "body": "하중-변형 관계 확인"
        },
        {
          "title": "지보",
          "body": "숏크리트·록볼트 부담 평가"
        }
      ],
      "applications": [
        "교량 PSC · 강재 상부구조 휨응력",
        "교량 전단부 3축 전단변형률",
        "터널 강지보 · 숏크리트",
        "가시설 띠장 · 버팀보",
        "말뚝 · 재하시험 변형률"
      ],
      "installation": [
        "측정 위치 · 방향 확정",
        "시공 시 매립 또는 표면 부착",
        "온도 보상",
        "케이블 보호",
        "초기 변형률 기록",
        "하중 이벤트 연동"
      ],
      "principle": "<p>저항 변화형·진동 현형 등. 온도 보정·부착 품질이 정확도를 좌우합니다.</p>",
      "data": {
        "headers": [
          "적용",
          "측정",
          "해석"
        ],
        "rows": [
          [
            "교량",
            "휨 변형률",
            "응력"
          ],
          [
            "숏크리트",
            "압축",
            "라이닝"
          ],
          [
            "말뚝",
            "축력",
            "재하"
          ],
          [
            "버팀보",
            "보조",
            "하중계 보완"
          ]
        ]
      },
      "criteria": "<p>허용 변형률·응력은 설계 기준. 급격 변화 시 손상 조사. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "콘크리트에 부착?",
          "a": "매립형·표면형이 있습니다. 양생·크리프 영향을 고려합니다."
        },
        {
          "q": "온도 영향?",
          "a": "온도 보정 없으면 오판 가능. 온도 센서·무응력계 병행이 좋습니다."
        },
        {
          "q": "무응력계와 차이는?",
          "a": "일반 변형률계는 응력+크리프, 무응력계는 건조수축·크리프만 측정해 보정값을 제공합니다."
        },
        {
          "q": "록볼트·숏크리트에도?",
          "a": "지보재 축력·응력 평가에 사용합니다. 하중계와 역할이 겹치면 병행해 해석합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": "IMG-036"
    },
    "metaDescription": "변형률계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/stress-free-strain-gauge": {
    "id": "sensors/stress-free-strain-gauge",
    "title": "무응력계",
    "tagline": "건조수축·크리프 변형률 — 변형률계 보정용",
    "sections": {
      "overview": "<p><strong>무응력계</strong>는 동일 재질·초기 조건에서 <strong>응력 0</strong> 상태의 변형률만 측정하는 변형률계입니다. 일반 변형률계 값에서 무응력계 변형률을 빼면 구조 응력에 따른 변형률을 분리할 수 있습니다.</p><p>교량 콘크리트 유지관리·대구 3호선 금호강교 등에서 크리프·온도 보정에 사용됩니다.</p>",
      "purpose": [
        {
          "title": "크리프",
          "body": "장기 수축·크리프 변형률 추적"
        },
        {
          "title": "보정",
          "body": "일반 SG 응력 해석의 보조 기준"
        },
        {
          "title": "온도",
          "body": "열응력과 구분"
        }
      ],
      "applications": [
        "교량 콘크리트 유지관리",
        "PSC 박스 크리프 보정",
        "장기 모니터링 온도 · 응력 분리",
        "무응력 매립 기준 측정"
      ],
      "installation": [
        "일반 변형률계 인접 · 동일 조건 매립",
        "온도 센서 병행",
        "초기치 안정 후 보정 시작",
        "데이터로거 채널 매핑",
        "보호 · 습윤 방지",
        "정기 drift 점검"
      ],
      "principle": "<p>동일 콘크리트에 매립하되 외부 응력이 전달되지 않도록 설계합니다. 별도 관리기준 없이 변형률계 보정값으로 활용합니다.</p>",
      "data": {
        "headers": [
          "용도",
          "연계",
          "해석"
        ],
        "rows": [
          [
            "크리프",
            "일반 SG",
            "차분"
          ],
          [
            "온도",
            "온도계",
            "열응력"
          ],
          [
            "장기",
            "추세",
            "보수 시기"
          ],
          [
            "이상",
            "드리프트",
            "센서 점검"
          ]
        ]
      },
      "criteria": "<p>단독 임계치보다 변형률계 보정·추세 해석이 중심입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "변형률계 대체 가능?",
          "a": "아닙니다. 목적이 다릅니다. 병기 설치가 일반적입니다."
        },
        {
          "q": "어디에 설치?",
          "a": "동일 부재·유사 환경에 무응력 조건으로 매립합니다."
        },
        {
          "q": "콘크리트가 달라도 되나요?",
          "a": "동일 배합·양생 조건의 무응력 매립이 원칙입니다. 다른 조건이면 보정 오차가 큽니다."
        },
        {
          "q": "보정값이 음수로 나오면?",
          "a": "일반 변형률계에서 무응력계 변형률을 빼 응력 성분을 분리합니다. 드리프트·온도·센서 이상을 함께 점검합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 24 99 05:2023</strong>「교량계측시설」 — 무응력계·크리프 보정 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-108",
        "caption": "무응력계 — 동일 콘크리트 매립·응력 0 보정",
        "figureNo": 2
      }
    },
    "metaDescription": "무응력계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "D",
        "docId": "KCS-24-99-05",
        "cite": "—",
        "label": "무응력계·크리프 보정"
      }
    ],
    "jsonLdIsBasedOn": []
  },
  "sensors/crack-meter": {
    "id": "sensors/crack-meter",
    "title": "균열계",
    "tagline": "균열 폭 변화의 정량 추적",
    "sections": {
      "overview": "<p><strong>균열계</strong>는 구조물·암반·콘크리트 표면 균열 폭 변화를 측정합니다. 건축물, 교량, 터널, 옹벽, 사면 암반에 적용합니다.</p>",
      "purpose": [
        {
          "title": "폭 추적",
          "body": "시간에 따른 균열 진행 기록"
        },
        {
          "title": "구분",
          "body": "온도 반복 vs 구조적 진행을 구분합니다."
        },
        {
          "title": "인접 공사",
          "body": "굴착·터널 영향 평가에 활용합니다."
        }
      ],
      "applications": [
        "인접 건물 · 구조물 균열",
        "교량 · 옹벽 콘크리트",
        "터널 · 굴착 영향권",
        "사면 암반 균열"
      ],
      "installation": [
        "대표 균열 선택",
        "앵커 · 계측기 설치",
        "사진 · 좌표 기록",
        "온도 보완",
        "정기 계측",
        "경사 · 변위 연계"
      ],
      "principle": "<p>두 앵커 간 변위를 측정해 폭으로 환산. 추세가 절대값보다 중요합니다.</p>",
      "data": {
        "headers": [
          "패턴",
          "해석",
          "조치"
        ],
        "rows": [
          [
            "일교차",
            "온도",
            "정상"
          ],
          [
            "단방향 증가",
            "구조",
            "조사"
          ],
          [
            "급확대",
            "이벤트",
            "긴급"
          ],
          [
            "정체",
            "안정?",
            "지속 관찰"
          ]
        ]
      },
      "criteria": "<p>프로젝트별 균열 폭·속도 기준. 급확대 시 즉시 보고. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "균열계 vs 육안?",
          "a": "0.01mm급 변화도 추적 가능. 정량 관리에 유리합니다."
        },
        {
          "q": "여러 균열?",
          "a": "대표·최대·신규 균열에 우선 설치합니다."
        },
        {
          "q": "균열에 수직으로 설치?",
          "a": "인장 균열 폭 변화를 잡으려면 균열선에 수직으로 앵커를 둡니다. 설치 방향을 도면·사진에 기록합니다."
        },
        {
          "q": "경사계와 함께 보면?",
          "a": "균열 진행과 건물 회전·부등침하가 동시에 나타나면 지반·기초 영향을 의심합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-037",
        "caption": "균열계 설치 — 균열선 양측 앵커·변위 측정",
        "figureNo": 2
      }
    },
    "metaDescription": "균열계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/tilt-meter": {
    "id": "sensors/tilt-meter",
    "title": "구조물경사계",
    "tagline": "구조물 기울기·회전 변형 측정",
    "sections": {
      "overview": "<p><strong>구조물경사계</strong>는 벽체, 교각, 건축물, 기둥의 기울기 변화를 측정하여 회전 변형·기초 변동을 확인합니다. 인접 건물, 교각, 옹벽, 흙막이, <strong>터널</strong> 영향권 <strong>관리대상물</strong>에 적용합니다. KDS 터널 <strong>선택 항목</strong> 중 시설물 경사는 영향권 경사계로 추적합니다.</p>",
      "purpose": [
        {
          "title": "경사",
          "body": "2축 기울기 변화 추적"
        },
        {
          "title": "부등침하",
          "body": "회전·기울기로 간접 평가"
        },
        {
          "title": "인접 영향",
          "body": "굴착·침하 영향 정량화"
        }
      ],
      "applications": [
        "건축물 · 인접 구조물 경사",
        "교각 · 옹벽 기울기",
        "흙막이 · 굴착 영향권",
        "터널 영향권 관리대상물"
      ],
      "installation": [
        "모서리 · 기둥 설치",
        "2축 측정",
        "초기치 안정",
        "온도 기록",
        "자동 수집",
        "변위 연계"
      ],
      "principle": "<p>중력식·MEMS 등. 침하계·균열계와 함께 원인 추정.</p>",
      "data": {
        "headers": [
          "변화",
          "연계",
          "판단"
        ],
        "rows": [
          [
            "경사 증가",
            "침하",
            "부등침하"
          ],
          [
            "급변",
            "굴착",
            "인접"
          ],
          [
            "주기",
            "온도",
            "정상"
          ],
          [
            "비대칭",
            "복수점",
            "회전축"
          ]
        ]
      },
      "criteria": "<p>허용 경사는 구조·높이·기준에 따름. 계획서 기준 적용. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "경사계 vs 경사계(지중)?",
          "a": "구조물경사계는 구조물 표면, 지중경사계는 지반 내부입니다."
        },
        {
          "q": "무선 경사계?",
          "a": "배터리·샘플링·장기 drift를 고려해 선정합니다."
        },
        {
          "q": "한 축만 측정해도 되나요?",
          "a": "가능하나 2축 설치로 회전 평면·비대칭을 파악하는 것이 일반적입니다."
        },
        {
          "q": "침하계만 있고 경사가 없으면?",
          "a": "균등 침하일 수 있습니다. 좌우 침하 차이·기둥 회전은 경사계가 민감합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-038",
        "caption": "구조물경사계 — 외벽·교각 표면 브래킷 설치",
        "figureNo": 2
      }
    },
    "metaDescription": "구조물경사계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/joint-meter": {
    "id": "sensors/joint-meter",
    "title": "신축이음계",
    "tagline": "이음부·신축이음 상대 변위 측정 (와이어식)",
    "sections": {
      "overview": "<p><strong>신축이음계</strong>는 교량 신축이음·구조물 조인트의 <strong>상대 신축량</strong>을 측정합니다. NMTI Figure·기술자료 표준은 <strong>와이어식</strong>(양측 고정 앵커 사이 인장 와이어 + 변위 변환기)을 기본으로 합니다. 온도 정상 신축과 비정상 증가를 구분합니다.</p>",
      "purpose": [
        {
          "title": "신축",
          "body": "열·크리프에 따른 변위"
        },
        {
          "title": "이상",
          "body": "지지 악화·침하 징후"
        },
        {
          "title": "유지관리",
          "body": "이음 장치 교체 시기"
        }
      ],
      "applications": [
        "교량 신축이음 · 교대",
        "콘크리트 구조물 조인트",
        "온도 · 크리프 변위 추적",
        "이음 장치 유지관리"
      ],
      "installation": [
        "이음 양측 앵커 · 브라켓",
        "와이어 장착 · 장력 조정",
        "온도 연동",
        "초기 간격 기록",
        "정기 계측",
        "교대 · 교각 데이터 비교",
        "보호 · 방수"
      ],
      "principle": "<p>이음 양측 <strong>고정 앵커</strong> 사이 <strong>와이어</strong> 장력·이격 변화로 상대 변위를 측정합니다. LVDT 직결 단축형은 본 사이트 Figure 표준에서 제외합니다. 온도 상관 필수.</p>",
      "data": {
        "headers": [
          "패턴",
          "원인",
          "조치"
        ],
        "rows": [
          [
            "주기",
            "온도",
            "정상"
          ],
          [
            "단방향",
            "침하",
            "조사"
          ],
          [
            "급확대",
            "손상",
            "점검"
          ],
          [
            "비대칭",
            "부등침하",
            "기초"
          ]
        ]
      },
      "criteria": "<p>계절 범위 확립 후 이탈 시 경보. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "변위계로 대체?",
          "a": "가능하나 이음부에는 신축이음계가 정밀·설치 용이합니다."
        },
        {
          "q": "겨울·여름 차이?",
          "a": "연간 범위를 축적해 정상으로 정의합니다."
        },
        {
          "q": "교량 신축이음량만 측정?",
          "a": "BRI-EJ 표준에 따라 종방향 신축량(늘음·줄음)이 주 관심량입니다. 종·횡·개폐를 동등 hero로 그리지 않습니다."
        },
        {
          "q": "와이어식이 표준인 이유는?",
          "a": "이음부 상대 변위를 현장에서 안정적으로 측정하기 쉽고, NMTI Figure·기술자료가 와이어식을 기본으로 합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-039",
        "caption": "신축이음계 설치 — 와이어식·이음부 상대 변위",
        "figureNo": 2
      }
    },
    "metaDescription": "신축이음계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/cable-tension-meter": {
    "id": "sensors/cable-tension-meter",
    "title": "케이블장력계",
    "tagline": "주케이블 인장력 — 주파수·장력 환산·주파수법",
    "sections": {
      "overview": "<p><strong>케이블장력계</strong>는 현수·사장·아치교 <strong>주케이블 장력</strong>을 주파수·장력 환산·주파수 분석 등으로 측정합니다. <strong>하중계</strong>(앵커·버팀보 축력)와 대상·설치가 다릅니다.</p>",
      "purpose": [
        {
          "title": "장력 T",
          "body": "f→T 환산·추세"
        },
        {
          "title": "시공",
          "body": "긴장·조정 검증"
        },
        {
          "title": "유지관리",
          "body": "손상·비대칭 조기 징후"
        }
      ],
      "applications": [
        "현수교 · 사장교 주케이블",
        "아치교 · 닐슨교 케이블",
        "보도육교 · 특수 구조",
        "시공 긴장 · 공용 모니터링",
        "동적 이벤트(풍 · 통행) 연계"
      ],
      "installation": [
        "케이블 노출부 센서 부착",
        "온도 · 진동 보조",
        "동적 DAQ 연동",
        "케이블 ID · 채널 문서화",
        "긴장 후 기준값",
        "정기 재측정"
      ],
      "principle": "<p>케이블 고유진동수와 장력의 관계를 이용합니다. 부분 장력계·현장 보정이 적용될 수 있습니다.</p>",
      "data": {
        "headers": [
          "징후",
          "연계",
          "조치"
        ],
        "rows": [
          [
            "T 감소",
            "온도 · 손상",
            "점검"
          ],
          [
            "f 변화",
            "강성",
            "앵커"
          ],
          [
            "비대칭",
            "침하 · 풍",
            "조정"
          ],
          [
            "이벤트",
            "진동",
            "특별 점검"
          ]
        ]
      },
      "criteria": "<p>설계 장력·시공 기록 대비 편차를 관리합니다. 설계예상변위·최대허용변위 체계와 연계합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "하중계(로드셀)와 차이?",
          "a": "로드셀은 앵커 축력 직접 측정, 케이블장력계는 주케이블 인장력(주파수·진동)입니다."
        },
        {
          "q": "장력계=신축이음 하중계?",
          "a": "아닙니다. 신축이음은 신축이음계, 케이블은 케이블장력계입니다."
        },
        {
          "q": "주파수만 측정하면?",
          "a": "케이블 고유진동수와 장력 관계로 T를 환산합니다. 온도·경계 조건 보정이 필요할 수 있습니다."
        },
        {
          "q": "앵커 로드셀과 병행?",
          "a": "가능합니다. 앵커 축력은 로드셀, 주케이블 장력은 케이블장력계로 역할을 분리합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.2.1.9 — 케이블 장력 측정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-106",
        "caption": "케이블장력계 — 주파수·장력 환산 (≠앵커 로드셀)",
        "figureNo": 2
      },
      "principle": {
        "id": "IMG-105",
        "caption": "주파수 분석 → 장력 T",
        "figureNo": 3
      }
    },
    "metaDescription": "케이블장력계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KDS-11-10-15",
        "cite": "§4.2.1.9",
        "label": "케이블 장력 측정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.2.1.9",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/borehole-extensometer": {
    "id": "sensors/borehole-extensometer",
    "title": "다점지중변위계",
    "tagline": "MPBX — 보링 내 다점 앵커·강봉 상대변위",
    "sections": {
      "overview": "<p><strong>다점지중변위계(MPBX)</strong>는 암반·대절토 **단일 천공** 내 **깊이별 앵커**에 고정된 **길이 다른 강봉**과 공두부 **변위계(LVDT)** 로 상대 이격을 측정합니다. <strong>지중경사계</strong>(연속 기울기) · <strong>신축이음계</strong>(교량 이음)와 구분됩니다.</p>",
      "purpose": [
        {
          "title": "암반 변위",
          "body": "불연속면·joint 관통 구간 변위"
        },
        {
          "title": "깊이별",
          "body": "앵커 심도별 상대 변위"
        },
        {
          "title": "막장 · 사면",
          "body": "전방·활동면 조기 징후"
        }
      ],
      "applications": [
        "터널 · 암반 굴진 구간",
        "사면 · 비탈면 활동면",
        "막장 전방 변위",
        "지중경사계 보완 단면"
      ],
      "installation": [
        "목적 심도까지 천공 후 앵커 · 강봉 순차 설치",
        "Head block에 LVDT · 데이터로거 연결",
        "지중경사계와 동일 단면 배치(해석 교차)",
        "초기치 안정 후 정기 · 이벤트 계측"
      ],
      "principle": "<p>각 앵커 심도에서 강봉-헤드 간 거리 변화 = 해당 구간 굴진·수축량. 3점 이상으로 변형 모드 추정.</p>",
      "data": {
        "headers": [
          "패턴",
          "징후",
          "조치"
        ],
        "rows": [
          [
            "특정 깊이",
            "joint 활성",
            "조사"
          ],
          [
            "전체 증가",
            "굴진",
            "보강"
          ],
          [
            "급변",
            "붕괴 전",
            "경보"
          ]
        ]
      },
      "criteria": "<p>허용 변위는 암질·구조·설계 기준. 속도·가속도 병행. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "지중경사계와 차이?",
          "a": "MPBX는 앵커-강봉 상대변위, inclinometer는 casing 내 연속 기울기입니다."
        },
        {
          "q": "신축이음계와 같나요?",
          "a": "아닙니다. 신축이음계(joint-meter)는 교량 신축이음부 전용이며, MPBX는 지중 다점 변위용입니다."
        },
        {
          "q": "지중경사계 대신 쓰나요?",
          "a": "아닙니다. 암반 joint·막장 전방 등 불연속 변위에는 MPBX가 유리하고, 연속 지반 프로파일은 지중경사계가 적합합니다."
        },
        {
          "q": "앵커 개수는?",
          "a": "변형 모드 파악에 3점 이상이 일반적입니다. 목적 심도·암질에 따라 설계합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-091",
        "caption": "다점지중변위계 — 보링 내 다점 앵커·강봉",
        "figureNo": 1
      }
    },
    "metaDescription": "다점지중변위계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/displacement-transducer": {
    "id": "sensors/displacement-transducer",
    "title": "변위계",
    "tagline": "두 점 간 상대 변위 직접 측정 (변위계)",
    "sections": {
      "overview": "<p><strong>변위계</strong>는 두 기준점 사이 상대 이동을 직접 측정합니다. 재하시험, 구조물, 가시설에 적용합니다.</p><p>터널 <strong>내공변위</strong>의 전단면 프로파일은 <strong>내공변위계</strong>로 측정하며, 상부 아치에 센서 Kit를 연속 배치해 다수 측점의 X·Y 좌표를 누적 산정하는 방식이 일반적입니다. 국부 2점 상대변위와 전단면 프로파일 방식을 구분합니다.</p>",
      "purpose": [
        {
          "title": "상대 변위",
          "body": "부재·이음·단면 변위"
        },
        {
          "title": "고정밀",
          "body": "mm 이하 해상도"
        },
        {
          "title": "동적",
          "body": "빠른 샘플링 가능"
        }
      ],
      "applications": [
        "터널 내공 · 지보재 변위",
        "교량 · 구조물 국부 변위",
        "가시설 부재 상대변위",
        "재하시험 하중-변위"
      ],
      "installation": [
        "기준 · 측점 앵커",
        "센서 방향 · 량정",
        "케이블 · 보호",
        "초기치",
        "로거 연동",
        "온도 영향 기록"
      ],
      "principle": "<p>전기적 변위-신호 변환. 앵커 안정성이 핵심.</p>",
      "data": {
        "headers": [
          "용도",
          "범위",
          "비고"
        ],
        "rows": [
          [
            "내공변위",
            "내공변위계 프로파일",
            "터널 전단면"
          ],
          [
            "국부 변위",
            "변위계",
            "2점 상대"
          ],
          [
            "재하",
            "하중-변위",
            "시험"
          ],
          [
            "이음",
            "신축",
            "교량"
          ],
          [
            "가시설",
            "부재",
            "보조"
          ]
        ]
      },
      "criteria": "<p><strong>설계예상변위</strong>·<strong>최대허용변위</strong> 기준을 적용합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "터널 내공변위에 변위계만 쓰나요?",
          "a": "전단면 프로파일은 내공변위계(Kit 체인)로 다수 측점 좌표를 누적하는 방식이 일반적입니다. 변위계는 국부 2점 상대변위에 적합합니다."
        },
        {
          "q": "변위계와 자동 광파기?",
          "a": "변위계는 국부 상대, 자동 광파기는 절대 좌표·특수구간 3D 보조에 적합합니다(KDS 4.1.5)."
        },
        {
          "q": "앵커 느슨하면?",
          "a": "허위 변위 발생. 정기 점검 필수."
        },
        {
          "q": "LVDT와 동일 개념?",
          "a": "변위-전압 변환 원리의 변위계가 LVDT류입니다. 용도·량정·설치 위치가 해석의 핵심입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": "IMG-040",
      "data": "IMG-049"
    },
    "metaDescription": "변위계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/deflection-gauge": {
    "id": "sensors/deflection-gauge",
    "title": "처짐계",
    "tagline": "접촉식 처짐계(LVDT·와이어) — ≠ GNSS 경간 중앙 hero",
    "sections": {
      "overview": "<p><strong>처짐계</strong>는 거더·PSC 박스·보·슬래브 등 구조 부재의 <strong>연직 처짐량 δ</strong>를 <strong>접촉식</strong>으로 측정합니다. LVDT, 와이어, ring type 변위변환기·자동광파 보조 측점이 사용됩니다. <strong>침하계</strong>(지반·기초 침하)와 구분됩니다.</p><p>교량 <strong>경간 중앙 GNSS 처짐(ΔZ→δ)</strong> hero는 <a href=\"#fields/bridge/deflection\">교량 처짐</a>(IMG-103) 전용입니다. 본 센서 페이지는 LVDT·와이어·광파 등 <strong>국부·재하시험·동적</strong> 처짐에 초점을 둡니다. 건축은 <a href=\"#fields/building/deflection\">처짐</a> 항목과 연계합니다.</p>",
      "purpose": [
        {
          "title": "처짐 δ",
          "body": "휨·연직 변위 정량"
        },
        {
          "title": "재하시험",
          "body": "하중-처짐 관계"
        },
        {
          "title": "장기",
          "body": "크리프·강성 변화"
        }
      ],
      "applications": [
        "교량 거더 · PSC 박스 mid-span",
        "강교 · 재하시험 처짐",
        "건축 보 · 슬래브 시공 처짐",
        "동적 처짐(풍 · 통행) 보조",
        "자동광파기 보완 측점"
      ],
      "installation": [
        "설계 · 시방 대표 위치(주로 mid-span)에 고정 앵커 · 센서 본체 설치",
        "온도 채널 연동",
        "케이블 보호 · 방수",
        "초기치 · 재현성 확인",
        "데이터로거 · 원격 연동"
      ],
      "principle": "<p>고정 앵커 대비 부재 <strong>연직 변위</strong>를 측정합니다. 교량 <strong>경간 중앙 GNSS</strong>는 ΔZ→δ 장기 모니터링(IMG-103)이고, 본 센서는 <strong>접촉식 국부 δ</strong>(IMG-104)입니다. mid-span은 설계 대표 위치, GNSS 「경간 중앙」은 교각↔교각 중앙 1점으로 구분합니다.</p>",
      "data": {
        "headers": [
          "구분",
          "측정 위치",
          "물리량",
          "Figure",
          "nodeId"
        ],
        "rows": [
          [
            "GNSS",
            "경간 중앙 상부 1점(교각↔교각)",
            "ΔZ → δ",
            "IMG-103",
            "fields/bridge/deflection"
          ],
          [
            "LVDT",
            "mid-span · 기준대",
            "국부 δ",
            "IMG-104",
            "sensors/deflection-gauge"
          ],
          [
            "와이어",
            "하부 · 장경간",
            "국부 δ",
            "IMG-104",
            "sensors/deflection-gauge"
          ],
          [
            "자동광파",
            "프리즘 측점",
            "절대 좌표",
            "",
            "sensors/automatic-level"
          ]
        ]
      },
      "criteria": "<p>설계예상변위·최대허용변위·L/xxx는 계측관리계획·설계에 따릅니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "침하계와 같나요?",
          "a": "아닙니다. 처짐계는 구조 부재, 침하계는 지반·기초입니다."
        },
        {
          "q": "변위계로 대체?",
          "a": "국부 연직 처짐에는 처짐계·LVDT가 정밀합니다. 받침 상대변위는 변위계 항목입니다."
        },
        {
          "q": "교량 GNSS 처짐과 차이?",
          "a": "교량 hero(IMG-103)는 경간 중앙 GNSS 1점·ΔZ→δ입니다. 처짐계는 LVDT·와이어 등 접촉식 국부 δ에 쓰입니다."
        },
        {
          "q": "와이어·레이저?",
          "a": "장경간·가시거리 조건에서 대체 가능합니다. 현장별 시방을 따릅니다."
        },
        {
          "q": "mid-span 위치?",
          "a": "대표 처짐은 설계·시방 위치(주로 mid-span)에 설치합니다. GNSS 경간 중앙 1점과 역할을 구분합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §4.2.1.6 — 처짐계·변위변환기 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": {
        "id": "IMG-104",
        "caption": "처짐계 설치 — LVDT·와이어 (≠침하판·≠GNSS hero)",
        "figureNo": 2
      }
    },
    "metaDescription": "처짐계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KDS-11-10-15",
        "cite": "§4.2.1.6",
        "label": "처짐계·변위변환기"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §4.2.1.6",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/vibration-meter": {
    "id": "sensors/vibration-meter",
    "title": "진동계",
    "tagline": "진동 속도·가속도·주파수 특성 측정",
    "sections": {
      "overview": "<p><strong>진동계</strong>는 발파, 장비, 차량, 열차, 지진, 구조 동적 응답을 측정합니다. 철도, 교량, <strong>터널</strong> 영향권, 인접 구조물, 민원 관리에 적용합니다. 터널·굴착 <strong>발파진동</strong>은 영향권 측점에서 PPV·가속도를 모니터링하고, <strong>지표 및 지중침하</strong>·<strong>구조물경사계</strong> 데이터와 시간 동기화해 해석합니다.</p>",
      "purpose": [
        {
          "title": "PPV · 가속도",
          "body": "이벤트·기준 비교"
        },
        {
          "title": "스펙트럼",
          "body": "고유진동수·에너지"
        },
        {
          "title": "민원",
          "body": "인체 감지 기준"
        }
      ],
      "applications": [
        "터널 · 굴착 발파진동",
        "교량 · 철도 교통진동",
        "인접 구조물 · 민원 관리",
        "구조물 동적 응답"
      ],
      "installation": [
        "측점 · 방향 확정",
        "샘플링 · 트리거",
        "기준 응답",
        "이벤트 일지",
        "원격 전송",
        "교정"
      ],
      "principle": "<p>가속도계·속도계. 최대입자속도, 주파수, 지속시간 병행 검토.</p>",
      "data": {
        "headers": [
          "지표",
          "기준 유형",
          "활용"
        ],
        "rows": [
          [
            "PPV",
            "발파 · 공사",
            "중지"
          ],
          [
            "가속도",
            "구조",
            "손상"
          ],
          [
            "주파수",
            "모달",
            "건전성"
          ],
          [
            "RMS",
            "연속",
            "민원"
          ]
        ]
      },
      "criteria": "<p>구조물 vs 인체 기준 구분. 프로젝트별 한계 설정. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "진동 기준은 어디서?",
          "a": "발파기준, 철도·교량 설계, 환경 기준 등 목적별로 다릅니다."
        },
        {
          "q": "한 번 큰 진동?",
          "a": "누적·반복 영향과 구조 응답 변화를 함께 봅니다."
        },
        {
          "q": "정적 로거로 충분한가요?",
          "a": "발파·교통 파형·PPV는 kHz급 동적 DAQ 또는 이벤트형 진동계가 필요합니다."
        },
        {
          "q": "터널 내공변위와 관계?",
          "a": "발파진동은 영향권 정적 변위와 별도 항목입니다. 시간 동기화해 누적 영향을 봅니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "installation": "IMG-041",
      "data": "IMG-053"
    },
    "metaDescription": "진동계의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/automated-total-station": {
    "id": "sensors/automated-total-station",
    "title": "자동광파기",
    "tagline": "원격 제어 광파 측량으로 3D 변위 자동 모니터링",
    "sections": {
      "overview": "<p><strong>자동광파기</strong>는 원격 제어 토탈스테이션으로 프리즘·반사 타깃 3D 좌표를 반복 측정해 변위를 산정합니다. 철도, 교량, 건축물, 흙막이, 사면, 터널 지표침하에 적용합니다.</p>",
      "purpose": [
        {
          "title": "3D 변위",
          "body": "고빈도·고정밀 좌표"
        },
        {
          "title": "자동화",
          "body": "야간·원격 무인 계측"
        },
        {
          "title": "다점",
          "body": "망 전체 동시 관리"
        }
      ],
      "applications": [
        "흙막이 · 굴착 3D 변위",
        "터널 · 교량 고정밀 모니터링",
        "철도 · 건축물 변위",
        "사면 · 지표 대규모 망"
      ],
      "installation": [
        "기준점 · 측점망",
        "기기 보호함",
        "통신 · 전원",
        "측정 주기 · 필터",
        "이상값 검증",
        "경보 연동"
      ],
      "principle": "<p>기준점·측점 좌표 차이로 변위. 대기·시야·프리즘·기준점 안정성 영향.</p>",
      "data": {
        "headers": [
          "요인",
          "영향",
          "대응"
        ],
        "rows": [
          [
            "기준점 불안",
            "전체 왜곡",
            "재설치"
          ],
          [
            "대기 굴절",
            "산란",
            "시간대 · 필터"
          ],
          [
            "시야",
            "결측",
            "프리즘 청소"
          ],
          [
            "이상값",
            "오경보",
            "통계 필터"
          ]
        ]
      },
      "criteria": "<p>mm~sub-mm 목표 시 기준·환경 관리 엄격. 철도는 협약 기준. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "수동 토탈과 차이?",
          "a": "자동은 주기 반복·야간·경보 연동이 가능합니다."
        },
        {
          "q": "비·안개?",
          "a": "측정 불가·품질 저하. 결측 처리 규칙 필요."
        },
        {
          "q": "프리즘 vs 비접촉?",
          "a": "프리즘 반사가 표준이며, 특수 구간은 비접촉 대체를 검토합니다. 기준망 안정성이 우선입니다."
        },
        {
          "q": "기준점은 어디에?",
          "a": "영향권 밖 안정 지반·구조물에 설치합니다. 기준점 변위는 전체 해석을 왜곡합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-042",
        "caption": "계측 개념 — Total Station, 기준점·시준선, 프리즘, 좌표 변위 벡터",
        "figureNo": 2
      },
      "data": {
        "id": "IMG-049",
        "caption": "변위 그래프 예시 — 관리기준선·실시간 추세",
        "figureNo": 3
      }
    },
    "metaDescription": "자동광파기의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/gnss": {
    "id": "sensors/gnss",
    "title": "GNSS",
    "tagline": "위성항법 기반 장기 3D 변위 모니터링",
    "sections": {
      "overview": "<p><strong>GNSS</strong>(<strong>GPS</strong> 등 위성항법) 계측은 기준국·이동국 GNSS 안테나로 구조물·지반의 장기 <strong>3D 변위</strong>(ΔX·ΔY·ΔZ)를 측정합니다. 대형 <strong>사면</strong>, <strong>댐</strong>, <strong>교량</strong>, 지반침하, 장대 구조물·원거리 계측에 적용하며, 현장 구성은 <strong>기준국</strong>(안정 지반) + <strong>이동국</strong> 복수 측점 + <strong>RTK</strong>·차분 보정 + <strong>LTE</strong>·무선 → <strong>중앙 서버</strong> 수집·분석 흐름입니다.</p><p>Figure(IMG-043)은 현장 계측 계획서·<a href=\"/homepage/book/GNSS.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">GNSS 계측 시스템 구성(PDF)</a>과 동일한 개념(기준국·이동국·서버·무선·3D 변위)을 따릅니다. 단기 mm급·고빈도 변위는 <strong>자동광파기</strong>와 병행하는 경우가 많습니다.</p>",
      "purpose": [
        {
          "title": "장기 추세",
          "body": "월·년 단위 3D 변위·잔류침하 추세"
        },
        {
          "title": "원거리 · 다점",
          "body": "광파 시야 없이 다수 측점 동시 모니터링"
        },
        {
          "title": "구조 · 지반",
          "body": "사면·댐·교량·연약지반 장기 안정성"
        },
        {
          "title": "원격 운영",
          "body": "태양광·LTE로 무인 장기 계측"
        }
      ],
      "applications": [
        "교량 · 대형 구조물 장기 변위",
        "사면 · 댐 · 제방 안정성",
        "연약 지반 · 지반침하",
        "원거리 · 다점 3D 모니터링"
      ],
      "installation": [
        "계측 대상 · 영향권에 이동국 측점망(#1~#n)을 설계",
        "영향권 밖 안정 지반에 기준국 GNSS 안테나 · 수신기 설치",
        "안테나 기초 · 방수 · 낙뢰 · 멀티패스 최소 위치를 확보",
        "태양광 · 배터리 · LTE/무선 모뎀으로 중앙 서버 연결을 구성",
        "RTK · 후처리 · 실시간 스트리밍 방식과 좌표계 확정",
        "초기 좌표 · 품질 지표(PDOP 등)를 기록 · 경보 기준 설정"
      ],
      "principle": "<p><strong>RTK</strong>·차분 GNSS는 기준국 좌표를 고정하고 이동국 상대 변위를 산출합니다. GPS·GLONASS·Galileo·BeiDou 등 다중 위성 가시성, 다중경로·대기·안테나 설치 품질이 정밀도를 좌우합니다. 후처리는 mm급, 실시간 RTK는 cm급 목표가 일반적이며, 목적·KCS 기준에 맞게 후처리·실시간을 선택합니다.</p><p>기준국은 변형 영향권 <strong>밖</strong> 안정 지반·암반에, 이동국은 계측 대상(사면·제체·교량·지반)에 설치합니다. 광파기·프리즘과 달리 위성 신호 기반이므로 시준선·프리즘 개념과 혼동하지 않습니다.</p>",
      "data": {
        "headers": [
          "항목",
          "정밀도(목표)",
          "용도"
        ],
        "rows": [
          [
            "수평 ΔE · ΔN",
            "mm~cm",
            "사면 · 댐 · 교량"
          ],
          [
            "수직 ΔU",
            "cm급",
            "침하 · 장기 추세"
          ],
          [
            "속도",
            "mm/일 · mm/월",
            "가속 · 이상 탐지"
          ],
          [
            "이벤트",
            "지진 · 공사",
            "동적 · 급변"
          ]
        ]
      },
      "criteria": "<p>장기 한계변위·변화속도 기준은 설계·KCS·발주처 기준을 따릅니다. 지표침하 연계 시 KCS 11 10 15 등 측정오차 요건을 확인합니다. 단기 고정밀·고빈도는 GNSS만으로 부족할 수 있어 자동광파기·지중경사계와 병행합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "GNSS vs 자동광파기?",
          "a": "GNSS는 장기·원거리·다점 3D, 광파는 단기 mm급·고빈도. 병행하면 상호 보완됩니다."
        },
        {
          "q": "GPS와 GNSS 차이?",
          "a": "GPS는 미국 위성군, GNSS는 GPS·GLONASS 등 통칭. 본 기술자료 GNSS는 다중 위성 차분 계측을 의미합니다."
        },
        {
          "q": "구름·수목·건물?",
          "a": "가시성 저하·다중경로로 품질이 떨어집니다. 안테나 위치·마스크각·결측 처리 규칙이 중요합니다."
        },
        {
          "q": "기준국이 필요한가요?",
          "a": "RTK·네트워크 보정 시 기준국·가상기준점 품질이 정밀도를 좌우합니다. 가시위성·다중경로를 모니터링합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-043",
        "caption": "GNSS 변위 계측 — 기준국·이동국·RTK·중앙 서버·3D 변위",
        "figureNo": 2
      }
    },
    "detailLink": {
      "href": "/homepage/book/GNSS.pdf",
      "label": "GNSS 계측 시스템 구성 참고(PDF)"
    },
    "metaDescription": "GNSS의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/weather-station": {
    "id": "sensors/weather-station",
    "title": "기상계측기",
    "tagline": "강우·풍·온도 등 계측 데이터 외부 원인 해석",
    "sections": {
      "overview": "<p><strong>기상계측기</strong>는 강우량, 풍향·풍속, 온도, 습도, 기압을 측정해 변위·수위·균열의 외부 원인을 해석합니다. 사면, 댐, 교량, 장기 유지관리에 보조 계측으로 필수적입니다.</p>",
      "purpose": [
        {
          "title": "강우",
          "body": "사면·댐 위험 상관"
        },
        {
          "title": "온도",
          "body": "신축·균열 보정"
        },
        {
          "title": "풍",
          "body": "교량·고층 구조"
        }
      ],
      "applications": [
        "사면 · 댐 강우 연계",
        "장기 유지관리 현장",
        "변위 · 수위 외부 원인 해석",
        "온도 · 신축 보정 보조"
      ],
      "installation": [
        "대표 지점 설치",
        "센서 보호",
        "로거 연동",
        "원격 전송",
        "유지보수",
        "타 계측 시간 동기"
      ],
      "principle": "<p>강우-지하수위-변위 시간차 분석. 온도-변위 상관.</p>",
      "data": {
        "headers": [
          "데이터",
          "연계",
          "활용"
        ],
        "rows": [
          [
            "일강우",
            "지중경사계",
            "경보"
          ],
          [
            "온도",
            "신축이음계",
            "보정"
          ],
          [
            "풍속",
            "교량",
            "하중"
          ],
          [
            "기압",
            "수위",
            "보조"
          ]
        ]
      },
      "criteria": "<p>임계 강우 시 계측 강화·경보. 기상 단독 기준은 드묾. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "기상계만으로 사면 관리?",
          "a": "불가. 변위·수위 계측과 반드시 연계합니다."
        },
        {
          "q": "AWS와 차이?",
          "a": "현장 국지 강우가 중요해 현장 설치가 일반적입니다."
        },
        {
          "q": "강우만 측정하면?",
          "a": "사면·굴착은 강우와 함께 풍속·온도·습도가 해석에 필요합니다. 현장 국지 기상이 중요합니다."
        },
        {
          "q": "AWS 데이터 대체?",
          "a": "인근 AWS는 참고용입니다. 공사 영향권 국지 강우·배수 조건은 현장 설치가 일반적입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-044",
        "caption": "기상계측기 구성 — 강우·풍·온도·습도",
        "figureNo": 2
      }
    },
    "metaDescription": "기상계측기의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/datalogger": {
    "id": "sensors/datalogger",
    "title": "데이터 로거 개요",
    "tagline": "센서 신호 수집·저장·전송의 자동계측 핵심",
    "sections": {
      "overview": "<p><strong>데이터로거</strong>는 현장 센서 신호를 수집·저장·전송하는 자동계측 핵심 장치입니다. 토목·지반 현장에서는 신호 특성에 따라 <strong>정적 데이터로거</strong>와 <strong>동적 데이터로거</strong>로 구분하며, 채널 수 확장에는 <strong>멀티플렉서(MUX)</strong>를 병행합니다.</p><p><strong>정적 데이터로거</strong>는 변위·수위·하중·간극수압 등 느리게 변하는 신호를 분~시간 주기로 스캔합니다. <strong>동적 데이터로거</strong>는 발파·교통·지진에 의한 진동·가속도처럼 밀리초~kHz 대역 고속 신호를 연속 샘플링합니다. 다채널 정적 센서(지중경사계 체인·VW 계열)는 MUX로 로거 아날로그 입력을 확장합니다. 무인 현장 운영 시 <a href=\"/homepage/technology/instruments/power/overview/\">전원 체계</a>(<a href=\"/homepage/technology/instruments/power/solar-power/\">태양광</a>·<a href=\"/homepage/technology/instruments/power/battery/\">배터리</a>·<a href=\"/homepage/technology/instruments/power/ac-mains/\">상시 전원</a>) 설계와 함께 계획합니다.</p>",
      "purpose": [
        {
          "title": "정적 수집",
          "body": "변위·수위·하중 등 저주파·주기 계측"
        },
        {
          "title": "동적 수집",
          "body": "진동·가속도 등 고속·이벤트 계측"
        },
        {
          "title": "채널 확장",
          "body": "MUX로 다점·체인 센서 연결"
        },
        {
          "title": "연동",
          "body": "통신·경보·원격계측시스템"
        }
      ],
      "installation": [
        "채널 · 센서 매핑",
        "전원 · 태양광 · 배터리",
        "방수 · 함체",
        "통신 안테나",
        "초기 캘리브레이션",
        "원격 설정 · OTA"
      ],
      "principle": "<p>정적 로거는 스캔 주기·필터·캘리브레이션으로 품질이 결정되고, 동적 로거는 샘플링률·동기·대역폭이 핵심입니다. MUX는 순차 스캔으로 채널을 확장하므로 스캔 시간과 센서 안정화 시간을 함께 설계합니다.</p>",
      "siteLayout": "<p><strong>센서</strong>(아날로그·디지털·SDI-12·RS-485) → (선택) <strong>멀티플렉서</strong> → <strong>데이터로거</strong> → 현장 저장(SD·플래시) → <strong>통신 모뎀</strong> → 서버. 무인 현장은 태양광·배터리·충전제어기와 함께 방수 계측함에 집중 배치합니다.</p>",
      "data": {
        "headers": [
          "기능",
          "설정",
          "운영"
        ],
        "rows": [
          [
            "주기",
            "1분~1일",
            "위험도"
          ],
          [
            "필터",
            "이상값",
            "오경보"
          ],
          [
            "동기",
            "GPS 시간",
            "상관"
          ],
          [
            "백업",
            "SD · 클라우드",
            "손실 방지"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "장애 유형",
          "확인 항목",
          "조치"
        ],
        "rows": [
          [
            "전원 차단",
            "배터리 · 충전 · 퓨즈",
            "전압 복구 · 용량 점검"
          ],
          [
            "채널 결측",
            "케이블 · MUX · 센서",
            "단선 · 접속 · 교체"
          ],
          [
            "드리프트",
            "초기치 · 온도",
            "재교정 · 센서 점검"
          ],
          [
            "통신 불량",
            "모뎀 · 안테나",
            "로컬 SD 백업 확인"
          ]
        ]
      },
      "criteria": "<p>데이터 가용성·지연·결측률 KPI. 전원·통신 장애 대응 절차. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "정적과 동적 로거 차이?",
          "a": "정적은 분~시간 주기 스캔(변위·수위·하중), 동적은 kHz급 연속 샘플링(진동·발파)입니다. 현장에 따라 두 체계를 병행합니다."
        },
        {
          "q": "MUX가 필요한 경우?",
          "a": "지중경사계 체인·다점 VW 센서처럼 아날로그 채널이 로거 입력보다 많을 때 MUX로 확장합니다."
        },
        {
          "q": "로거 용량?",
          "a": "채널 수·주기·보존 기간·동적 버퍼 용량에 따라 선정합니다."
        },
        {
          "q": "현장 전원이 끊기면?",
          "a": "SD·플래시에 로컬 저장 후 복전 시 재전송합니다. 자립 일수·배터리 용량을 설계에 반영합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-045"
    },
    "metaDescription": "데이터 로거 개요의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "sensors/remote-monitoring-system": {
    "id": "sensors/remote-monitoring-system",
    "title": "원격 모니터링",
    "tagline": "센서·통신·서버·대시보드·경보 통합 원격계측",
    "sections": {
      "overview": "<p><strong>원격계측시스템</strong>은 센서, 데이터로거, 통신, 서버, DB, 웹 대시보드, 모바일 경보를 통합해 현장 계측을 실시간·주기 관리합니다. 자동화계측의 완성 형태입니다.</p><p>구성: 센서 → 데이터로거 → 게이트웨이/LTE → 서버 → DB → 웹 대시보드 → 모바일 알림 → 보고서</p><p><strong>적용 현장:</strong> 댐·제방·터널·철도 <strong>건설중 계측</strong> 현장에서 다측점·다공정 데이터를 24시간 수집·경보합니다. 축조·굴착·道床 시공 단계의 QC·일·주 보고와 연동합니다.</p>",
      "purpose": [
        {
          "title": "통합",
          "body": "다현장·다센서 일원화"
        },
        {
          "title": "경보",
          "body": "SMS·이메일·단계별"
        },
        {
          "title": "보고",
          "body": "자동 보고서·그래프"
        },
        {
          "title": "품질",
          "body": "이상값·센서 상태 감시"
        }
      ],
      "installation": [
        "시스템 아키텍처 설계",
        "현장 로거 · 통신 설치",
        "서버 · DB · 보안",
        "대시보드 · 권한",
        "경보 규칙",
        "운영 · 유지보수 교육"
      ],
      "principle": "<p>단순 수집이 아닌 기준치·검증·이력·보고 자동화까지 포함. IoT 게이트웨이·클라우드·온프레미스 혼용.</p>",
      "siteLayout": "<p><strong>센서</strong> → <strong>데이터로거</strong> → <strong>게이트웨이/LTE M2M</strong> → <strong>서버·DB</strong> → <strong>웹 대시보드</strong> → <strong>모바일 경보·보고서</strong>. 다현장은 중앙 플랫폼에서 측점·기준치·권한·이력을 통합 관리합니다.</p>",
      "data": {
        "headers": [
          "계층",
          "구성",
          "역할"
        ],
        "rows": [
          [
            "현장",
            "센서 · 로거",
            "수집"
          ],
          [
            "통신",
            "LTE · 광",
            "전송"
          ],
          [
            "서버",
            "DB · API",
            "저장"
          ],
          [
            "UI",
            "웹 · 앱",
            "모니터링"
          ],
          [
            "1차 관리",
            "설계예상 대비",
            "관찰 · 보고 강화(예: 75%)"
          ],
          [
            "2차 관리",
            "최대허용 대비",
            "경보 · 조치 검토(예: 90%)"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "실시간 미표시",
            "통신 · 서버",
            "링크 · API · DB"
          ],
          [
            "경보 미발송",
            "규칙 · 수신자",
            "임계값 · SMS 게이트웨이"
          ],
          [
            "오경보",
            "필터 · 기준",
            "이상값 · 3단계 재설정"
          ],
          [
            "보고서 오류",
            "템플릿 · 시간",
            "동기 · QC · 수동 검증"
          ]
        ]
      },
      "criteria": "<p>가용성 99%+, 경보 지연 목표, 데이터 품질 관리 절차. 정기 DR·백업.</p><p><strong>1차·2차 관리기준:</strong> 플랫폼에는 측점별 <strong>설계예상변위·허용응력</strong> 등 1차(관찰·보고 강화)와 <strong>최대허용변위·허용응력</strong> 등 2차(경보·공정 조정 검토) 임계를 매핑합니다. 유지관리 통합계측(예: 대구 3호선)에서는 허용 대비 <strong>75%·90%</strong> 단계별 SMS·대시보드 경보를 운영하기도 합니다. 수치는 설계도서·계약이 우선이며, 플랫폼은 <a href=\"#instruments/modes/alarm-status\">경보·알림 상태</a>·IMG-054 프로세스와 연동합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "자동화계측과 동일?",
          "a": "원격계측시스템은 통신·플랫폼·경보까지 포함한 상위 개념입니다."
        },
        {
          "q": "보안?",
          "a": "VPN·암호화·접근통제. OT·IT 분리 검토."
        },
        {
          "q": "1차·2차 관리기준 차이는?",
          "a": "1차는 설계예상·초기 관찰 단계(추세·보고 강화), 2차는 최대허용·계약 한계 접근 시 경보·조치 검토 단계입니다. 75%/90%는 유지관리 사례의 비율 예시이며 절대값은 설계·계측관리계획서를 따릅니다."
        },
        {
          "q": "로거만 있으면 원격?",
          "a": "현장 수집에 통신·서버·대시보드·경보가 더해져야 원격계측시스템입니다."
        },
        {
          "q": "플랫폼과 차이?",
          "a": "원격계측시스템은 하드웨어·통신·서버·웹까지 포함합니다. 스마트 계측은 경보·보고 운영 계층입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 표 4.1-1 — 계측기 분류·용도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 센서·데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-058",
        "caption": "플랫폼 아키텍처 — 센서·로거·서버·DB·웹·모바일",
        "figureNo": 2
      },
      "installation": [
        {
          "id": "IMG-048",
          "caption": "LTE M2M·모뎀 구성",
          "figureNo": 3
        },
        {
          "id": "IMG-046",
          "caption": "IoT 게이트웨이 중계",
          "figureNo": 4
        }
      ],
      "data": [
        {
          "id": "IMG-056",
          "caption": "웹 대시보드 구성 — 지도·센서·그래프·이벤트",
          "figureNo": 5
        },
        {
          "id": "IMG-055",
          "caption": "모바일 경보 알림 화면",
          "figureNo": 6
        }
      ],
      "criteria": {
        "id": "IMG-054",
        "caption": "경보 단계 프로세스 — 정상·주의·경고·위험·조치",
        "figureNo": 7
      }
    },
    "metaDescription": "원격 모니터링의 측정 목적, 적용 현장, 설치, 원리, 데이터 해석 및 관련 공종을 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "표 4.1-1",
        "label": "계측기 분류·용도"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "센서·데이터로거 선정"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 표 4.1-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/datalogger/static": {
    "id": "instruments/datalogger/static",
    "title": "정적 데이터 로거",
    "tagline": "변위·수위·하중 등 저주파 신호의 현장 주기 수집",
    "sections": {
      "overview": "<p><strong>정적 데이터로거</strong>는 변위·수위·하중·간극수압·온도 등 <strong>느리게 변하는 신호</strong>를 분~시간 단위로 스캔·저장하는 현장 계측 장치입니다. 토목·지반 자동계측에서 가장 널리 쓰이며, 본 기술자료 Figure는 <strong>범용 산업용 소형 로거</strong>(LCD·전면 단자 포트) 외형을 표준으로 합니다.</p><p>아날로그·디지털·SDI-12·RS-485 입력, 내부 스케줄러, SD·플래시 저장, 12V 전원, 이더넷·셀룰러 통신 옵션으로 구성됩니다. <strong>지중경사계</strong>·<strong>간극수압계</strong>·<strong>하중계</strong>·<strong>침하계</strong> 등 다채널 정적 센서와 직접 연동하며, 채널 부족 시 <strong>멀티플렉서</strong>로 확장합니다.</p>",
      "purpose": [
        {
          "title": "주기 수집",
          "body": "1분~1일 스캔으로 추세·변화량 산정"
        },
        {
          "title": "다채널",
          "body": "수십 채널 아날로그·디지털 동시 관리"
        },
        {
          "title": "현장 저장",
          "body": "SD·내부 메모리로 통신 단절 대비"
        },
        {
          "title": "경보",
          "body": "한계치·이상값 현장 판별"
        }
      ],
      "siteLayout": "<p><strong>센서 체인</strong> → (선택) <strong>멀티플렉서</strong> → <strong>정적 데이터로거</strong> → 현장 SD·플래시 저장 → <strong>LTE·이더넷</strong> → 서버. 진동·발파 구간은 <strong>동적 DAQ</strong>를 별도 두고 시간 동기화합니다.</p>",
      "applications": [
        "가시설 · 터널 · 사면 다채널 자동계측",
        "댐 · 교량 · 철도 장기 모니터링 현장",
        "연약 지반 성토 · 압밀 추세 수집",
        "원격 모니터링 전 단계 현장 저장 · 백업"
      ],
      "installation": [
        "채널 · 센서 · MUX 매핑 및 스캔 주기 설계",
        "12V 전원 · 태양광 · 배터리 · 접지",
        "방수 함체 · 케이블 글랜드 · 서지 보호",
        "초기 영점 · 캘리브레이션 · 안정화 측정",
        "통신(이더넷 · LTE) · 원격 설정",
        "수동계측 백업 절차 유지"
      ],
      "principle": "<p>정적 로거는 프로그램(스캔 테이블)에 따라 채널을 순차 또는 병렬로 읽습니다. ADC 해상도·입력 범위·여기·필터가 측정 정밀도를 좌우하며, 전원·온도 드리프트는 캘리브레이션·보정으로 관리합니다. MUX 연결 시 스캔 한 주기에 모든 채널을 읽는 데 수 초~수 분이 소요될 수 있어, 계측 주기 설계에 MUX 지연을 반영합니다.</p><p>외형은 밝은 회색 배선판형 인클로저·12V 전원 포트·나사 단자 블록이 특징이며, 방수 함체 안에 설치해 야외 현장에서 운용합니다.</p>",
      "data": {
        "headers": [
          "항목",
          "정적 로거",
          "실무 포인트"
        ],
        "rows": [
          [
            "스캔 주기",
            "1분~24시간",
            "위험도 · KCS 빈도"
          ],
          [
            "입력",
            "mV · V · 4–20mA · SDI-12",
            "센서 호환"
          ],
          [
            "저장",
            "SD · 플래시",
            "결측 · 백업"
          ],
          [
            "확장",
            "MUX · 디지털 버스",
            "체인 센서"
          ],
          [
            "통신",
            "이더넷 · LTE",
            "원격계측 연동"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "장애",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "전원 저하",
            "배터리 · 충전기",
            "전압 · SOC · 용량"
          ],
          [
            "채널 이상",
            "MUX · 케이블",
            "단선 · 접속 · 교체"
          ],
          [
            "스캔 지연",
            "채널 수 · 주기",
            "MUX · 테이블 재설계"
          ],
          [
            "데이터 결측",
            "SD · 통신",
            "로컬 백업 · 재전송"
          ]
        ]
      },
      "criteria": "<p>결측률·스캔 지연·전원·센서 drift를 KPI로 관리합니다. MUX 사용 시 채널당 유효 주기가 목표 빈도를 만족하는지 검증합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "대표 외형은?",
          "a": "본 기술자료 Figure는 범용 산업용 소형 로거(LCD·단자 포트)를 표준으로 합니다. 선정 시 채널·프로토콜·전원·통신 호환을 우선합니다."
        },
        {
          "q": "동적 로거와 병행?",
          "a": "발파·진동 고속 계측은 동적 DAQ를 별도 두고, 침하·수위 등은 정적 로거로 운영하는 혼합 구성이 일반적입니다."
        },
        {
          "q": "MUX 없이 가능한 채널 수?",
          "a": "로거 내장 아날로그 채널(통상 8~16)과 디지털·버스 센서 수에 따릅니다. 초과 시 MUX 또는 추가 로거를 검토합니다."
        },
        {
          "q": "SD 카드 백업?",
          "a": "통신 단절·서버 장애 대비 로컬 저장 후 재전송합니다. 카드 용량·보존 기간을 설계에 반영합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.1 — 데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.3 — 온도 범위 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-045"
    },
    "metaDescription": "정적 데이터 로거의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.1",
        "label": "데이터로거 선정"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.3",
        "label": "온도 범위"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2.3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/datalogger/dynamic": {
    "id": "instruments/datalogger/dynamic",
    "title": "동적 데이터 로거",
    "tagline": "진동·가속도 등 고속 신호의 연속 샘플링 (Gantner 기준)",
    "sections": {
      "overview": "<p><strong>동적 데이터로거</strong>는 발파·교통·지진·구조물 동적 응답처럼 <strong>밀리초~kHz 대역</strong>에서 변하는 신호를 연속·동시 샘플링하는 고속 데이터 수집(DAQ) 시스템입니다. 정적 로거의 분 단위 스캔과 달리, 채널별 고정 샘플링률로 파형·스펙트럼·피크값(PPV)을 산출합니다.</p><p>본 기술자료에서는 오스트리아 <strong>Gantner Instruments</strong> 제품군을 대표 사례로 설명합니다. 모듈형 메인프레임·I/O 모듈·이더넷 스트리밍 구조는 교량·터널·건물 <strong>구조 건전성 모니터링(SHM)</strong>·발파진동·재하시험 현장에서 널리 참고됩니다.</p>",
      "purpose": [
        {
          "title": "고속 샘플링",
          "body": "수백 Hz~수십 kHz 연속 기록"
        },
        {
          "title": "동시 채널",
          "body": "다채널 가속도·변형률 동기 수집"
        },
        {
          "title": "이벤트",
          "body": "트리거·사전·사후 버퍼 기록"
        },
        {
          "title": "실시간",
          "body": "PC·서버로 스트리밍·분석"
        }
      ],
      "siteLayout": "<p><strong>동적 센서</strong>(IEPE 가속도계 등) → <strong>DAQ 모듈·섀시</strong> → <strong>PC/서버</strong>(이더넷) → 이벤트 저장·분석. 정적 로거와 <strong>별도 체계</strong>로 두고 GPS 시간 동기·트리거 버퍼로 발파·교통 이벤트를 포착합니다.</p>",
      "installation": [
        "측정 목적 · 대역 · 채널 수에 따른 모듈 · 샘플링률 선정",
        "IEPE 가속도계 · 케이블 · 접지 · 노이즈 차폐",
        "섀시 · PC · 스위치 · UPS · 접지 단일점",
        "트리거 조건 · 버퍼 길이 · 저장 경로 설정",
        "초기 기준 파형 · 교정 · 클리핑 · 포화 점검",
        "발주 · 민원 기준(PPV 등)과 연동한 보고 체계"
      ],
      "principle": "<p>Gantner 계열 DAQ는 <strong>모듈형 섀시</strong>에 아날로그·디지털 I/O 카드를 장착하고, 이더넷으로 PC 또는 현장 서버에 데이터를 전송합니다. <strong>IEPE</strong> 가속도계·변형률계·마이크로폰 등 동적 센서는 전원 공급·임피던스 매칭이 내장된 입력 모듈에 직접 연결합니다.</p><p>샘플링 클럭이 모든 채널을 동기화하므로 상관·전달함수·모드 분석에 유리합니다. 대용량 버퍼·SSD·NAS에 원시 파형을 저장하고, 애플리케이션(GI.bench·TestSuite 등)에서 FFT·필터·PPV·관리기준 비교를 수행합니다. 정적 로거와 달리 <strong>연속 전력·데이터 대역폭</strong> 요구가 크므로 AC 전원·고속 LAN 설계가 중요합니다.</p>",
      "data": {
        "headers": [
          "구분",
          "Gantner형 DAQ",
          "정적 로거 대비"
        ],
        "rows": [
          [
            "샘플링",
            "수백 Hz~kHz",
            "분~시간 스캔"
          ],
          [
            "센서",
            "IEPE 가속도 · 동적 변형",
            "변위 · 수위 · 하중"
          ],
          [
            "연결",
            "이더넷 · USB 고속",
            "RS-485 · SDI-12 · 저속"
          ],
          [
            "데이터량",
            "GB/일 · 이벤트 버퍼",
            "MB/일 · 시계열"
          ],
          [
            "분석",
            "FFT · PPV · 모드",
            "추세 · 변화량"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "클리핑",
            "입력 범위 · 게인",
            "재설정 · 센서 교체"
          ],
          [
            "노이즈",
            "접지 · 케이블",
            "차폐 · 단일점 접지"
          ],
          [
            "동기 오류",
            "GPS · 클럭",
            "시간 태그 재동기"
          ],
          [
            "이벤트 누락",
            "트리거 · 버퍼",
            "임계값 · 버퍼 길이 조정"
          ]
        ]
      },
      "criteria": "<p>샘플링률(나이퀴스트)·클리핑·SNR·동기·시간 태그를 정기 점검합니다. PPV·가속도 관리기준은 인체·구조·민원 기준을 구분 적용합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "Gantner만 사용하나요?",
          "a": "Gantner는 본 문서의 설명 기준 제품입니다. NI·HBM 등 동급 DAQ도 동일 원리로 선정·운용합니다."
        },
        {
          "q": "정적 로거로 진동 측정?",
          "a": "저주파(0.1Hz 미만) 추세는 가능하나 발파·교통 진동 파형·PPV는 동적 DAQ가 필요합니다."
        },
        {
          "q": "터널·교량 적용?",
          "a": "발파 영향권·교량 통과·지진 이벤트 계측에 배치하며, 정적 침하·내공변위 로거와 시간 동기화해 해석합니다."
        },
        {
          "q": "GPS 시간 동기?",
          "a": "다채널·다현장 이벤트 상관에 PTP·GPS 타임스탬프를 사용합니다. 정적 로거와 동기 규칙을 문서화합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.1 — 데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.3 — 온도 범위 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-076"
    },
    "metaDescription": "동적 데이터 로거의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.1",
        "label": "데이터로거 선정"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.3",
        "label": "온도 범위"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2.3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/datalogger/multiplexer": {
    "id": "instruments/datalogger/multiplexer",
    "title": "멀티플렉서",
    "tagline": "정적 로거 아날로그 채널 확장·다점 센서 순차 스캔",
    "sections": {
      "overview": "<p><strong>멀티플렉서(MUX)</strong>는 정적 데이터로거의 제한된 아날로그 입력을 확장해, 다수 센서 신호를 <strong>순차 스캔</strong>으로 로거에 전달하는 장치입니다. <strong>지중경사계</strong> 깊이별 소자·VW <strong>간극수압계</strong>·다점 변위 센서처럼 채널 수가 많은 체인형 센서에 필수적입니다.</p><p>센서 체인 → MUX → 데이터로거 순으로 연결하며, 로거가 MUX 채널을 제어해 한 번에 하나(또는 소수)의 센서를 읽습니다. 본 페이지 Figure(IMG-077)처럼 체인형 센서 종단이 MUX를 거쳐 로거로 수렴하는 토폴로지가 표준입니다.</p>",
      "purpose": [
        {
          "title": "채널 확장",
          "body": "16·32·48채널 이상 스캔"
        },
        {
          "title": "체인 센서",
          "body": "지중경사·다점 VW 연결"
        },
        {
          "title": "비용 효율",
          "body": "로거 본체 채널 절약"
        },
        {
          "title": "현장 배선",
          "body": "센서 측 다심 케이블 수렴"
        }
      ],
      "siteLayout": "<p><strong>체인형 센서</strong>(지중경사·VW 다점) → <strong>MUX</strong> → <strong>정적 데이터로거</strong>. 체인 종단이 MUX로 수렴한 뒤 로거 아날로그 입력으로 순차 스캔합니다. 스캔 주기 = 채널 수 × 채널당 읽기 시간입니다.</p>",
      "installation": [
        "센서 체인 · 채널 수 · Excitation 요구 확인",
        "MUX–로거 호환(제어 포트 · 전압) 확인",
        "체인 종단 · 중간 접속 · 방수 처리",
        "스캔 테이블 · 안정화 · 필터 설정",
        "초기치 전 채널 노이즈 · 단선 점검",
        "스캔 주기가 계측 빈도 요구 충족 검증"
      ],
      "principle": "<p>MUX는 아날로그 스위치 배열로 공용 Excitation·Sense 라인을 센서마다 전환합니다. 로거 프로그램에서 채널 목록·안정화 시간(settling time)·Excitation 시간을 설정합니다. 스캔 주기 = (채널 수 × 채널당 읽기 시간)이므로, 깊이 30m 지중경사계(30소자)는 MUX 지연이 전체 주기를 좌우합니다.</p><p>배선은 <strong>체인(직렬)</strong> 토폴로지가 일반적이며, 중앙 허브에서 별도 방사형 배선은 피합니다. MUX·로거·센서 Excitation 전압·케이블 저항·접지 루프를 함께 점검합니다.</p>",
      "data": {
        "headers": [
          "항목",
          "설계",
          "유의"
        ],
        "rows": [
          [
            "채널 수",
            "16/32/48+",
            "로거 · MUX 정격"
          ],
          [
            "토폴로지",
            "체인 → MUX → 로거",
            "허브 별선 지양"
          ],
          [
            "주기",
            "채널×읽기시간",
            "KCS 빈도"
          ],
          [
            "Excitation",
            "VW · 저항식",
            "케이블 저항"
          ],
          [
            "고장",
            "채널별 단선",
            "체인 전체 영향 최소화"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "특정 채널 결측",
            "MUX · 케이블 · 센서",
            "단선 위치 추정 · 교체"
          ],
          [
            "스캔 지연",
            "채널 수 · 안정화 시간",
            "테이블 · 주기 재설계"
          ],
          [
            "노이즈 증가",
            "Excitation · 접지",
            "케이블 · 접속 점검"
          ],
          [
            "전 채널 이상",
            "로거 · MUX 전원",
            "전압 · 퓨즈 확인"
          ]
        ]
      },
      "criteria": "<p>채널별 결측·노이즈·스캔 지연을 모니터링합니다. MUX 또는 체인 단선 시 인접 채널 교차 확인으로 고장 위치를 추정합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "MUX 없이 지중경사계?",
          "a": "소자 수가 로거 채널 이내이면 직결 가능하나, 심도 10m 이상 체인은 MUX가 일반적입니다."
        },
        {
          "q": "동적 DAQ에 MUX?",
          "a": "고속 동시 샘플링이 목적이면 MUX 순차 스캔은 부적합합니다. 동적은 전용 다채널 입력 모듈을 사용합니다."
        },
        {
          "q": "대표 제품?",
          "a": "정적 로거·MUX 조합은 제조사별 배선 가이드를 따릅니다. 본 Figure는 특정 브랜드가 아닌 범용 산업용 외형을 사용합니다."
        },
        {
          "q": "스캔 지연은?",
          "a": "MUX 순차 읽기로 한 주기가 길어질 수 있습니다. 채널당 유효 주기가 목표 빈도를 만족하는지 검증합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.1 — 데이터로거 선정 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.3 — 온도 범위 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-077"
    },
    "metaDescription": "멀티플렉서의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.1",
        "label": "데이터로거 선정"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.3",
        "label": "온도 범위"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2.1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2.3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/communication/iot-gateway": {
    "id": "instruments/communication/iot-gateway",
    "title": "IoT 게이트웨이",
    "tagline": "현장 센서·로거와 서버 사이 통신 중계",
    "sections": {
      "overview": "<p><strong>IoT 게이트웨이</strong>는 현장 데이터로거·센서와 중앙 서버 사이에서 프로토콜 변환·버퍼링·중계를 수행하는 통신 장치입니다. 유선·무선 혼합 현장에서 LTE 모뎀 부하 분산·방화벽 경계·로컬 집계에 활용합니다.</p>",
      "purpose": [
        {
          "title": "중계",
          "body": "현장 버스·시리얼·이더넷을 서버 프로토콜로 변환합니다."
        },
        {
          "title": "버퍼",
          "body": "통신 단절 시 로컬 저장 후 재전송합니다."
        },
        {
          "title": "보안",
          "body": "VPN·방화벽·인증 경계를 구성합니다."
        }
      ],
      "siteLayout": "<p>현장 <strong>로거·센서 버스</strong> → <strong>IoT 게이트웨이</strong>(프로토콜 변환·버퍼) → <strong>LTE/유선</strong> → 서버. 다수 로거·혼합 프로토콜 현장에서 모뎀 부하 분산·로컬 집계에 사용합니다.</p>",
      "installation": [
        "현장 함체 · 전원 · 안테나 위치 확정",
        "로거 · 센서 통신 포트 매핑",
        "서버 주소 · VPN · 인증 설정",
        "버퍼 · 재전송 정책 설정",
        "장애 시 로컬 접속 절차 문서화"
      ],
      "principle": "<p>게이트웨이는 수집 주기·패킷 크기·QoS를 조정해 통신 비용과 안정성을 균형합니다. 다수 로거를 하나의 LTE 회선으로 묶을 때 필수입니다.</p>",
      "data": {
        "headers": [
          "항목",
          "설정",
          "비고"
        ],
        "rows": [
          [
            "프로토콜",
            "Modbus · MQTT 등",
            "로거 호환"
          ],
          [
            "지연",
            "버퍼 · 재시도",
            "결측 최소화"
          ],
          [
            "보안",
            "VPN · TLS",
            "OT 분리"
          ],
          [
            "전원",
            "UPS · 태양광",
            "무정전"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "재전송 실패",
            "버퍼 · 서버",
            "용량 · 재시도 정책"
          ],
          [
            "프로토콜 오류",
            "매핑 · 펌웨어",
            "Modbus · MQTT 설정"
          ],
          [
            "VPN 단절",
            "인증 · 방화벽",
            "로컬 접속 · 복구"
          ],
          [
            "지연 누적",
            "패킷 크기",
            "압축 · 주기 조정"
          ]
        ]
      },
      "criteria": "<p>통신 가용성·패킷 손실률·재전송 성공률을 KPI로 관리합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "데이터로거와 차이?",
          "a": "로거는 센서 신호 수집·저장이 주역이고, 게이트웨이는 통신 중계·집계가 주역입니다. 역할이 다르며 함께 배치합니다."
        },
        {
          "q": "LTE 모뎀만으로 부족한가요?",
          "a": "단일 로거·단순 링크는 모뎀만으로 가능하나, 다채널·다현장·프로토콜 변환이 필요하면 게이트웨이를 검토합니다."
        },
        {
          "q": "MQTT vs Modbus?",
          "a": "로거·센서 프로토콜에 맞게 게이트웨이에서 변환합니다. 서버·플랫폼 요구와 함께 선정합니다."
        },
        {
          "q": "통신 단절 시 데이터는?",
          "a": "로컬 버퍼·SD에 저장 후 복구 시 재전송합니다. 버퍼 용량·재시도 정책을 설계에 포함합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 계측시스템·원격 전송 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.4 — 알람경보 전송 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-046"
    },
    "metaDescription": "IoT 게이트웨이의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.1.2",
        "label": "계측시스템·원격 전송"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.4",
        "label": "알람경보 전송"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2.4",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/communication/lte-remote": {
    "id": "instruments/communication/lte-remote",
    "title": "LTE M2M",
    "tagline": "LTE M2M 모뎀 기반 현장–서버 데이터 전송",
    "sections": {
      "overview": "<p><strong>LTE M2M</strong>은 현장 데이터로거·IoT 게이트웨이에 연결된 <strong>LTE M2M 모뎀</strong>을 통해 계측 데이터를 이동통신망(M2M 전용 SIM·Cat-M/NB-IoT 등)으로 중앙 서버·클라우드에 전송하는 구성입니다. 인프라가 제한된 터널·굴착·사면 현장에서 <strong>원격 자동계측</strong>의 핵심 통신 수단입니다.</p>",
      "purpose": [
        {
          "title": "M2M 무선 전송",
          "body": "LTE M2M 모뎀·SIM으로 유선 공사 없이 실시간·주기 전송"
        },
        {
          "title": "원격 모니터링",
          "body": "웹·모바일 대시보드 연동"
        },
        {
          "title": "경보",
          "body": "SMS·푸시·이메일 연계"
        }
      ],
      "siteLayout": "<p>현장 <strong>데이터로거</strong> 또는 <strong>IoT 게이트웨이</strong> → <strong>LTE M2M 모뎀</strong>(외부 안테나) → 이동통신망 → VPN·방화벽 → <strong>중앙 서버·DB</strong> → 웹·모바일 대시보드·경보.</p>",
      "installation": [
        "M2M 요금제 · SIM · 통신사 다중화 검토",
        "LTE M2M 모뎀 · 안테나 · 케이블 · 서지 보호 설치",
        "VPN · 방화벽 · 고정 IP 또는 DDNS",
        "전송 주기 · 패킷 압축 설정",
        "통신 장애 시 로컬 버퍼 · 알림"
      ],
      "principle": "<p><strong>LTE M2M 모뎀</strong>과 외부 안테나로 IP 링크를 구성하고, 로거(RS-232/Ethernet) 또는 게이트웨이가 TCP/UDP·MQTT 등으로 서버에 접속합니다. 다수 로거는 게이트웨이 뒤단 1회선 M2M, 단일 로거는 모뎀 직결을 선택합니다. 신호 약화 구간은 외부 안테나·중계기를 검토합니다.</p>",
      "data": {
        "headers": [
          "지표",
          "목표",
          "조치"
        ],
        "rows": [
          [
            "가용성",
            "99%+",
            "SIM · 안테나 · 모뎀 점검"
          ],
          [
            "지연",
            "수초~수분",
            "주기 조정"
          ],
          [
            "데이터량",
            "M2M 요금 한도",
            "압축 · 필터"
          ],
          [
            "보안",
            "암호화",
            "VPN 필수"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "원인",
          "조치"
        ],
        "rows": [
          [
            "링크 다운",
            "SIM · 안테나 · 음영",
            "안테나 · 중계 · 다중 SIM"
          ],
          [
            "패킷 손실",
            "대역 · QoS",
            "압축 · 주기 · 버퍼"
          ],
          [
            "지연 증가",
            "서버 · VPN",
            "경로 · 부하 점검"
          ],
          [
            "데이터 누락",
            "로거 버퍼",
            "재전송 · 로컬 SD 확인"
          ]
        ]
      },
      "criteria": "<p>월 M2M 데이터 사용량·링크 다운타임·경보 지연을 모니터링합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "LTE M2M과 IoT 게이트웨이 차이는?",
          "a": "게이트웨이는 다로거 집계·프로토콜 변환, <strong>LTE M2M 모뎀</strong>은 셀룰러 송신 장치입니다. 규모에 따라 게이트웨이→모뎀 또는 로거→모뎀 직결을 선택합니다."
        },
        {
          "q": "5G가 필요한가요?",
          "a": "대부분 계측은 LTE Cat-M·NB-IoT·일반 LTE M2M으로 충분합니다. 초고빈도·대용량 영상은 별도 검토합니다."
        },
        {
          "q": "터널 내부는?",
          "a": "막장 근처·통신구·중계 안테나·광케이블 혼용 등 현장별 대안이 필요합니다."
        },
        {
          "q": "SIM 다중화?",
          "a": "가용성 향상을 위해 이중 SIM·통신사 분산을 검토합니다. 링크 다운 시 로컬 버퍼가 필수입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 계측시스템·원격 전송 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.4 — 알람경보 전송 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-048"
    },
    "metaDescription": "LTE M2M의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.1.2",
        "label": "계측시스템·원격 전송"
      },
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.4",
        "label": "알람경보 전송"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2.4",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/power/overview": {
    "id": "instruments/power/overview",
    "title": "전원 개요",
    "tagline": "현장 계측 장비에 안정 DC를 공급하는 전원 체계",
    "sections": {
      "overview": "<p><strong>전원</strong>은 데이터로거·통신·센서에 <strong>안정 DC(주로 12V/24V)</strong>를 공급하는 현장 인프라입니다. 토목·지반 자동계측에서는 <strong>태양광</strong>·<strong>풍력</strong>·<strong>상시 AC</strong>·<strong>AVR</strong>·<strong>배터리</strong>를 조합해 무인 구간의 연속 가동을 보장합니다.</p><p>무인 굴착·사면·터널 외곽은 재생에너지+배터리가 주 전원이고, 관리동·전기실이 있는 구간은 AC 상시 전원을 병행하면 안정성이 높아집니다. 전원 단절은 곧 데이터 결측이므로 전압·SOC를 원격계측과 연동하는 것이 실무 표준입니다.</p>",
      "purpose": [
        {
          "title": "연속 가동",
          "body": "야간·휴일·통신 피크 전류 대응"
        },
        {
          "title": "다원화",
          "body": "태양광·풍력·AC·배터리 병행"
        },
        {
          "title": "보호",
          "body": "AVR·퓨즈·Surge·접지"
        },
        {
          "title": "감시",
          "body": "전압·충전 상태 원격 모니터링"
        }
      ],
      "siteLayout": "<p><strong>주 전원</strong>(태양광 PV / AC 상시 / 풍력) → <strong>충전제어기·AVR</strong> → <strong>배터리</strong> → DC 분배 → 데이터로거·통신·센서 Excitation. AC 구간은 배전반→Surge→UPS→DC 변환 후 계측함에 공급합니다.</p>",
      "installation": [
        "부하 전류 · 최대 피크 · 자립 일수 산정",
        "주 전원(태양광/AC/하이브리드) 선정",
        "배터리 Ah · 종류 · 함체 환기",
        "퓨즈 · 접지 · Surge · 역극성 보호",
        "전압 · SOC 원격 채널 또는 통신 연동",
        "정기 점검 · 교체 주기 문서화"
      ],
      "principle": "<p>설계 순서: 부하 전류(로거+통신+센서 Excitation) 산정 → 자립 일수·방전 깊이(DoD) → 배터리 Ah → 충전원(Wp·풍력 W) → 보호·분배. AC 구간은 배전반→(AVR)→정류/UPS→배터리 또는 DC 직供으로 계측 함체에 연결합니다.</p>",
      "data": {
        "headers": [
          "구분",
          "무인 구간",
          "AC 가능 구간"
        ],
        "rows": [
          [
            "주 전원",
            "태양광 · 풍력",
            "상시 AC"
          ],
          [
            "안정화",
            "충전제어기",
            "AVR · UPS"
          ],
          [
            "백업",
            "배터리",
            "배터리 병행"
          ],
          [
            "KPI",
            "전압 하한 · SOC",
            "가용성 · 결측률"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "장애",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "야간 정전",
            "배터리 · DoD",
            "Ah · 충전 재설계"
          ],
          [
            "흐림 · 동절기",
            "PV · 풍력",
            "AC 보조 · 용량 여유"
          ],
          [
            "과방전",
            "제어기 · 퓨즈",
            "LOAD 차단 · 교체"
          ],
          [
            "노이즈 · 서지",
            "접지 · Surge",
            "배선 · 보호기 점검"
          ]
        ]
      },
      "criteria": "<p>배터리 전압 하한·충전 상태·전원 결측을 원격 모니터링하고, 장기 흐림·동절기 시나리오를 계획서에 명시합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "태양광만으로 충분한가요?",
          "a": "일조·부하에 따라 가능하나, AC 가능 구간 병행·풍력 보조·배터리 여유를 검토합니다."
        },
        {
          "q": "AVR이 필요한 경우?",
          "a": "발전기·임시 배전 등 입력 전압 변동이 클 때 계측·통신 전단에 AVR을 둡니다."
        },
        {
          "q": "24V가 필요한 경우?",
          "a": "일부 통신·산업 장비는 24V입니다. 로거·센서 Excitation 사양에 맞춰 분배합니다."
        },
        {
          "q": "전원 결측을 어떻게 감지?",
          "a": "로거 전압 채널·원격 SOC·결측 알림을 연동합니다. 통신 단절과 구분합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-065"
    },
    "metaDescription": "전원 개요의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.1.2",
        "label": "전력 공급 계획"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "현장 전원·설계 시방"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/power/solar-power": {
    "id": "instruments/power/solar-power",
    "title": "태양광 전원",
    "tagline": "무인 현장 자동계측용 태양광·충전제어·배터리 DC 전원",
    "sections": {
      "overview": "<p><strong>태양광 전원</strong>은 PV 모듈이 생성한 DC를 충전제어기(MPPT/PWM)로 배터리에 저장하고, 데이터로거·통신·센서에 <strong>12V DC</strong>를 공급하는 무인 현장의 대표 전원입니다. 패널·충전제어기·배터리·퓨즈·DC 분배·접지로 구성됩니다.</p>",
      "purpose": [
        {
          "title": "무인 운영",
          "body": "상시·야간·휴일 연속 전원"
        },
        {
          "title": "자동계측",
          "body": "로거·LTE 모뎀 부하"
        },
        {
          "title": "보호",
          "body": "과충전·과방전 차단"
        },
        {
          "title": "내구",
          "body": "우기·동절기·흐림 대비"
        }
      ],
      "siteLayout": "<p><strong>PV 모듈</strong> → <strong>충전제어기(MPPT/PWM)</strong> → <strong>배터리</strong> → DC 분배 → 로거·통신·센서. 패널·제어기·배터리는 방수 함체에 집중하고 LOAD 출력 과방전 보호를 설정합니다.</p>",
      "installation": [
        "일조 · 그늘 · 낙뢰 · 도난 · 패널 각도(남향 15~35°)",
        "PV · BAT · LOAD 배선 · 퓨즈 · 접지",
        "충전제어기 · 배터리 함체 · 환기",
        "부하 전류 · 잔압 모니터링 채널",
        "AC 보조 전원 병행 검토"
      ],
      "principle": "<p>일사량·피크선 시간·흐림일을 반영해 Wp를 산정하고, 배터리는 (자립 일수×일일 소비 Ah)÷허용 DoD로 설계합니다. MPPT는 일사 변동 시 수확률이 높고, 제어기 LOAD 출력의 과방전 보호가 배터리 수명을 좌우합니다.</p>",
      "data": {
        "headers": [
          "요소",
          "설계",
          "운영"
        ],
        "rows": [
          [
            "패널",
            "Wp · 면적",
            "오염 · 그늘"
          ],
          [
            "제어기",
            "MPPT/PWM",
            "LOAD 보호"
          ],
          [
            "배터리",
            "Ah · DoD",
            "교체 주기"
          ],
          [
            "부하",
            "로거+통신",
            "피크 전류"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "야간 정전",
            "배터리 · DoD",
            "Ah · 용량 재산정"
          ],
          [
            "충전 부족",
            "패널 · 그늘 · 오염",
            "각도 · 청소 · Wp 증설"
          ],
          [
            "과방전",
            "제어기 LOAD",
            "하한 전압 · 교체"
          ],
          [
            "피크 부족",
            "통신 송신",
            "배터리 · 용량 여유"
          ]
        ]
      },
      "criteria": "<p>배터리 전압 하한·PV 전압·충전 전류를 원격 모니터링합니다. 동절기 용량 여유 1.3~1.5배를 권장합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "시가전만으로 충분한가요?",
          "a": "통신·로거 동시 가동·동절기를 감안해 Ah를 산정합니다. 용량·DoD·보호는 <a href=\"/homepage/technology/instruments/power/battery/\">배터리</a> 항목을 참고하세요."
        },
        {
          "q": "AC 전원 병행?",
          "a": "관리동·터널 구간 등 AC 가능 시 <a href=\"/homepage/technology/instruments/power/ac-mains/\">상시 전원</a>·<a href=\"/homepage/technology/instruments/power/avr/\">AVR</a>와 혼용하면 안정성이 높아집니다. 전체 조합은 <a href=\"/homepage/technology/instruments/power/overview/\">전원 개요</a>를 참고하세요."
        },
        {
          "q": "패널 각도는?",
          "a": "위도·계절 일조를 반영해 설계합니다. 그늘·적설·오염은 충전량에 직접 영향을 줍니다."
        },
        {
          "q": "동절기 부족 시?",
          "a": "배터리 Ah·DoD 여유를 늘리거나 AC 보조·풍력을 검토합니다. 전압 하한 경보를 설정합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-047",
      "installation": "IMG-047"
    },
    "metaDescription": "태양광 전원의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.1.2",
        "label": "전력 공급 계획"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "현장 전원·설계 시방"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/power/ac-mains": {
    "id": "instruments/power/ac-mains",
    "title": "상시 전원",
    "tagline": "관리동·터널 전기실 등 220V/380V AC 상시 인입",
    "sections": {
      "overview": "<p><strong>상시 전원</strong>은 건설 현장 관리동·터널 전기실·임시 배전반에서 인입하는 <strong>AC 220V/380V</strong> 전원입니다. 데이터로거·통신 장비는 AC-DC 전원공급장치 또는 UPS 경유로 12V/24V DC를 받으며, 무인 구간 태양광과 <strong>병행</strong>하면 결측을 줄일 수 있습니다.</p>",
      "purpose": [
        {
          "title": "안정 공급",
          "body": "AC 인프라 활용"
        },
        {
          "title": "고부하",
          "body": "통신·로거 상시 가동"
        },
        {
          "title": "병행",
          "body": "배터리 백업와 혼용"
        },
        {
          "title": "유지보수",
          "body": "현장 접근 용이 구간"
        }
      ],
      "siteLayout": "<p><strong>AC 배전반</strong> → Surge·누전차단 → <strong>AC-DC/UPS</strong> → 12V/24V DC → 계측 함체. 관리동·터널 전기실 구간에서 태양광과 병행하면 결측을 줄일 수 있습니다.</p>",
      "installation": [
        "배전 용량 · 회로 분리 · 접지",
        "Surge · 누전차단 · 케이블 규격",
        "AC-DC 전원 · UPS 선정",
        "배터리 백업 병행 여부",
        "함체 방수 · 환기"
      ],
      "principle": "<p>배전반·차단기·누전차단·Surge 보호 후 AC-DC 정류 또는 UPS로 DC 변환합니다. 입력 변동이 크면 후단에 <strong>AVR</strong>을 두고, 민감 계측은 UPS 무정전 구간을 검토합니다.</p>",
      "data": {
        "headers": [
          "구성",
          "역할",
          "유의"
        ],
        "rows": [
          [
            "배전반",
            "차단 · 분기",
            "용량"
          ],
          [
            "Surge",
            "낙뢰 · 서지",
            "접지"
          ],
          [
            "AC-DC",
            "12V 공급",
            "효율 · 여유"
          ],
          [
            "UPS",
            "무정전",
            "배터리 용량"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "정전",
            "배전 · 차단기",
            "복구 · 백업 전원"
          ],
          [
            "약전압",
            "입력 품질",
            "AVR · UPS 검토"
          ],
          [
            "서지 손상",
            "Surge · 접지",
            "보호기 · 배선"
          ],
          [
            "DC 출력 불안",
            "정류 · UPS",
            "부하 · 용량 점검"
          ]
        ]
      },
      "criteria": "<p>정전·약전압 이벤트 로그와 계측 결측을 연계해 AC 품질을 관리합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "태양광 대체?",
          "a": "AC 가능 구간은 상시 전원이 주, 태양광은 보조 또는 무인 이전 단계에 적용합니다."
        },
        {
          "q": "발전기 전원?",
          "a": "변동이 크므로 AVR·UPS 후단 연결을 권장합니다."
        },
        {
          "q": "UPS는 필수?",
          "a": "민감 계측·통신은 무정전 구간을 검토합니다. AVR은 전압 안정, UPS는 정전 백업입니다."
        },
        {
          "q": "220V와 380V?",
          "a": "현장 배전 조건에 맞춥니다. AC-DC 변환기·UPS 입출력 사양을 확인합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-066"
    },
    "metaDescription": "상시 전원의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.1.2",
        "label": "전력 공급 계획"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "현장 전원·설계 시방"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/power/avr": {
    "id": "instruments/power/avr",
    "title": "AVR",
    "tagline": "불안정 AC 입력을 정격 전압으로 자동 안정화",
    "sections": {
      "overview": "<p><strong>AVR(Automatic Voltage Regulator, 자동전압조정기)</strong>는 디젤 발전기·약전압 배전·임시 전력처럼 입력 전압이 변동할 때 출력을 <strong>220V 정격 근처(±1~3%)</strong>로 유지하는 장치입니다. 계측 함체·통신 장비 전단에 두어 로거·모뎀 오동작을 방지합니다.</p>",
      "purpose": [
        {
          "title": "전압 안정",
          "body": "입력 ±20~30% 변동 흡수"
        },
        {
          "title": "장비 보호",
          "body": "민감 전자부 보호"
        },
        {
          "title": "품질",
          "body": "노이즈·고조파 완화(기종별)"
        },
        {
          "title": "연속성",
          "body": "UPS 전단 조건 정비"
        }
      ],
      "siteLayout": "<p>불안정 <strong>AC 입력</strong>(발전기·임시 배전) → <strong>AVR</strong> → (선택) 절연변압기·<strong>UPS</strong> → 계측·통신 장비. 출력 220V 정격 근처 유지가 목표입니다.</p>",
      "installation": [
        "입력 변동 범위 · 부하 kVA 산정",
        "AVR 정격 · 응답 속도 선정",
        "접지 · 단락 용량 · 배선",
        "출력 측 UPS · 정류 연결",
        "전압 이력 모니터링(선택)"
      ],
      "principle": "<p>서보·탭체인저 또는 고체소자 방식으로 출력 전압을 제어합니다. 고정밀 계측 현장에서는 <strong>AVR → 절연변압기 → UPS</strong> 3단 구성으로 접지 루프·공통모드 노이즈를 줄이기도 합니다.</p>",
      "data": {
        "headers": [
          "항목",
          "목표",
          "비고"
        ],
        "rows": [
          [
            "출력 정밀도",
            "±1~3%",
            "기종별"
          ],
          [
            "입력 범위",
            "±20~30%",
            "발전기"
          ],
          [
            "부하",
            "로거+통신",
            "피크"
          ],
          [
            "병행",
            "UPS · 절연변압기",
            "고정밀"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "출력 변동",
            "입력 범위 · 부하",
            "AVR 정격 · kVA"
          ],
          [
            "과열 · 소음",
            "부하 · 환기",
            "용량 · 배선"
          ],
          [
            "오동작 연쇄",
            "접지 루프",
            "접지 · 분리"
          ],
          [
            "이력 불일치",
            "전압 로그",
            "계측 이상과 대조"
          ]
        ]
      },
      "criteria": "<p>입력·출력 전압 이력과 계측 이상 시각을 대조해 전원 품질을 검토합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "UPS와 차이?",
          "a": "AVR은 전압 안정화, UPS는 정전 시 무정전 백업. 병행 사용이 일반적입니다."
        },
        {
          "q": "태양광 DC에 AVR?",
          "a": "AVR은 AC용입니다. DC는 충전제어기·DC-DC regulator가 해당 역할입니다."
        },
        {
          "q": "계측 함체에 직결?",
          "a": "AVR·UPS 후단 DC를 로거·통신에 분배합니다. Surge·접지를 함께 설계합니다."
        },
        {
          "q": "발전기 구간은?",
          "a": "입력 전압 변동이 큰 경우 AVR을 전단에 두는 것이 일반적입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-067"
    },
    "metaDescription": "AVR의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.1.2",
        "label": "전력 공급 계획"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "현장 전원·설계 시방"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/power/wind-power": {
    "id": "instruments/power/wind-power",
    "title": "풍력 발전",
    "tagline": "소형 풍력터빈으로 태양광·배터리 하이브리드 보완",
    "sections": {
      "overview": "<p><strong>풍력 발전</strong>은 소형 풍력터빈(통상 수 kW 이하)으로 DC를 충전해 <strong>태양광과 공용 배터리</strong>를 충전하는 보조 전원입니다. 야간·우천·동절기 일조 부족 구간에서 통신 기지국·무인 계측과 유사한 하이브리드 아키텍처로 활용됩니다.</p>",
      "purpose": [
        {
          "title": "보완",
          "body": "야간·흐림 시 충전"
        },
        {
          "title": "하이브리드",
          "body": "PV+풍력+배터리"
        },
        {
          "title": "자립",
          "body": "무인 구간 연장"
        },
        {
          "title": "다양화",
          "body": "기상 리스크 분산"
        }
      ],
      "siteLayout": "<p><strong>풍력터빈</strong> → <strong>풍력 충전제어기</strong> → <strong>공용 배터리 버스</strong>(태양광 PV 충전제어기와 병렬). 무풍·무일 장기 구간은 AC·디젤 백업을 검토합니다.</p>",
      "installation": [
        "풍속 자원 · 장애물 · 소음 조사",
        "마스트 · 기초 · guy wire 설계",
        "풍력 · 태양광 충전제어 호환",
        "배터리 · 접지 · 낙뢰 보호",
        "유지보수 · 안전 작업 계획"
      ],
      "principle": "<p>지역 풍속·난류 조사 후 터빈 형식(HAWT/VAWT)·용량을 선정합니다. 풍력충전제어기가 배터리 보호를 담당하며, 태양광 충전제어기와 배터리 버스를 공유하는 구성이 일반적입니다. 풍속 자원이 부족하면 구조·비용 대비 효과가 낮을 수 있습니다.</p>",
      "data": {
        "headers": [
          "요소",
          "설계",
          "유의"
        ],
        "rows": [
          [
            "터빈",
            "W · 허브 높이",
            "풍속 조사"
          ],
          [
            "충전",
            "풍력 제어기",
            "BAT 보호"
          ],
          [
            "병행",
            "PV 공용",
            "버스 용량"
          ],
          [
            "백업",
            "디젤(선택)",
            "장기 무풍"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "충전 없음",
            "풍속 · 터빈",
            "무풍 · 고장 · 브레이크"
          ],
          [
            "과속 · 소음",
            "풍속 · 난류",
            "제한 · 방향 조정"
          ],
          [
            "배터리 미충전",
            "버스 · 제어기",
            "PV 병행 · 용량"
          ],
          [
            "장기 무풍",
            "SOC",
            "디젤 · AC 보조"
          ]
        ]
      },
      "criteria": "<p>풍력·PV·배터리 전압을 통합 모니터링하고, 무풍·무일 장기 구간 시나리오를 계획합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "모든 현장에 필요?",
          "a": "아닙니다. 풍속 자원이 확인된 무인·해안·고지 구간에서 검토합니다."
        },
        {
          "q": "태양광 단독 대비?",
          "a": "야간 충전 이점이 있으나 초기 비용·유지보수가 큽니다."
        },
        {
          "q": "풍속 기준은?",
          "a": "제조사·현장 풍자원 조사로 최소 풍속·정격을 확인합니다. 무풍 구간에는 부적합합니다."
        },
        {
          "q": "유지보수?",
          "a": "블레이드·베어링·케이블 점검이 필요합니다. 태양광 대비 방문 빈도가 높을 수 있습니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-068"
    },
    "metaDescription": "풍력 발전의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.1.2",
        "label": "전력 공급 계획"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "현장 전원·설계 시방"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/power/battery": {
    "id": "instruments/power/battery",
    "title": "배터리",
    "tagline": "DC 백업·버퍼 — 용량·종류·방전 깊이·모니터링",
    "sections": {
      "overview": "<p><strong>배터리</strong>는 태양광·풍력·AC 정류 간 전원 변동을 흡수하고, 야간·흐림·통신 피크 시 데이터로거·모뎀에 전력을 공급하는 축전 장치입니다. 납축 AGM/Gel과 LiFePO₄가 현장에서 널리 쓰입니다.</p>",
      "purpose": [
        {
          "title": "버퍼",
          "body": "충전·방전 완충"
        },
        {
          "title": "자립",
          "body": "무일·무충전 구간"
        },
        {
          "title": "피크",
          "body": "통신 송신 전류"
        },
        {
          "title": "백업",
          "body": "AC 정전 시"
        }
      ],
      "siteLayout": "<p>충전원(태양광·AC 정류) → <strong>배터리 버스</strong> → 로거·통신·센서 Excitation. BMS·충전제어기가 과충·과방전·역극성을 보호합니다.</p>",
      "installation": [
        "Ah · DoD · 종류 선정",
        "함체 환기 · 온도 · 결로 방지",
        "극성 · 퓨즈 · 접지",
        "충전 전압 · 온도 보상",
        "전압 · SOC 원격 채널"
      ],
      "principle": "<p>용량(Ah) ≈ (자립 일수 × 일일 소비 Ah) ÷ 허용 DoD. 동절기·장기 흐림을 반영해 1.3~1.5배 여유를 둡니다. BMS·충전제어기가 과충전·과방전·역극성을 보호하며, LiFePO₄는 사이클·경량·저온 정책이 기종별로 다릅니다.</p>",
      "data": {
        "headers": [
          "종류",
          "특성",
          "적용"
        ],
        "rows": [
          [
            "AGM/Gel",
            "성숙 · 경제",
            "일반 현장"
          ],
          [
            "LiFePO₄",
            "사이클 · 경량",
            "고빈도 · 한랭"
          ],
          [
            "DoD",
            "50~80%",
            "수명"
          ],
          [
            "모니터링",
            "전압 · SOC",
            "원격계측"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "용량 부족",
            "Ah · DoD · 자립일",
            "배터리 증설"
          ],
          [
            "급격 방전",
            "누전 · 부하",
            "회로 · 피크 전류"
          ],
          [
            "충전 불량",
            "제어기 · 접속",
            "극성 · 퓨즈"
          ],
          [
            "수명 단축",
            "과방전 · 온도",
            "함체 · DoD 정책"
          ]
        ]
      },
      "criteria": "<p>전압 하한·자가방전·교체 주기를 KPI로 관리합니다. 동결·과열 함체를 금지합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "시가전 vs LiFePO₄?",
          "a": "부하·자립·온도·비용을 비교해 선정합니다. 리튬은 BMS 필수입니다."
        },
        {
          "q": "몇 일 자립?",
          "a": "계획서·기상·통신 중요도에 따라 3~7일 이상을 검토합니다."
        },
        {
          "q": "DoD란?",
          "a": "방전 깊이(Depth of Discharge)입니다. 과방전을 줄이려면 제어기 하한·Ah 여유를 설계합니다."
        },
        {
          "q": "온도 영향?",
          "a": "저온·고온에서 용량·수명이 변합니다. 함체 환기·보온과 BMS(리튬)를 검토합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 전력 공급 계획 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 현장 전원·설계 시방 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-069"
    },
    "metaDescription": "배터리의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.1.2",
        "label": "전력 공급 계획"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "현장 전원·설계 시방"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/modes/overview": {
    "id": "instruments/modes/overview",
    "title": "계측 방식 개요",
    "tagline": "수집·전송·운영 확장·런타임 모드 — KCS와 NMTI 운영 계층",
    "sections": {
      "overview": "<p><strong>계측 방식</strong>은 현장에서 데이터를 어떻게 취득·저장·전송·운영하는지를 구분하는 개념입니다. <strong>KDS·KCS</strong>는 <strong>수동계측</strong>·<strong>반자동계측</strong>·<strong>자동계측</strong> 등 <strong>데이터 수집방법</strong>과 계측 빈도를 기준으로 제시합니다. <strong>유선·무선·유·무선</strong>은 <strong>전송방법</strong>입니다.</p><p><strong>원격 자동계측</strong>·<strong>스마트 계측</strong>·<strong>AI 보조 분석</strong>은 KCS의 기본 계측방식 분류가 아니라, 자동 수집·전송 인프라 위에 얹는 <strong>NMTI 운영 확장 계층</strong>입니다. 별도로 <strong>운영 모드</strong>(<a href=\"#instruments/modes/normal-mode\">상시</a>·<a href=\"#instruments/modes/realtime-mode\">이벤트</a>·<a href=\"#instruments/modes/alarm-status\">경보</a>)는 런타임 수집 주기·트리거·알림 동작을 설명합니다.</p><p><em>단일 「5단계 진화」 화살표·상하 등급으로 표현하지 않습니다.</em></p>",
      "purpose": [
        {
          "title": "KCS 수집방법",
          "body": "수동·반자동·자동 선정"
        },
        {
          "title": "전송 · 연동",
          "body": "유선·무선·서버·표출"
        },
        {
          "title": "운영 확장",
          "body": "원격·스마트·AI 보조 (법정 분류 아님)"
        },
        {
          "title": "병행 · 검증",
          "body": "수동 백업·교차 확인"
        }
      ],
      "siteLayout": "<p>현장 <strong>측점·센서</strong> → <strong>데이터로거</strong> 또는 <strong>수동 리드아웃</strong> → (선택) <strong>통신</strong> → <strong>서버·대시보드</strong>. 수동만 운영하는 구간은 현장 기록·보고서로 종료하고, 자동·원격 구간은 로거·전원·LTE를 계측함에 통합합니다.</p>",
      "installation": [
        "공종 · 위험도 · KCS 빈도 요구 분석",
        "수동 · 자동 수집방법 및 초기치 확보",
        "로거 · 센서 · 전원 설계 (자동 구간)",
        "전송 · 플랫폼 · 경보 요건 정의 (원격 · 스마트)",
        "AI 보조 적용 시 데이터 · 라벨 · HITL 검토"
      ],
      "principle": "<p><strong>① 데이터 수집방법 (KCS):</strong> 수동계측 · 반자동계측 · 자동계측</p><p><strong>② 데이터 전송방법:</strong> 유선 · 무선 · 유·무선 병행</p><p><strong>③ NMTI 운영 확장 (KCS 계측방식 분류 아님):</strong> 원격 자동계측 · 스마트 계측 · AI 보조 분석</p><p><strong>④ 운영 모드 (런타임):</strong> normal-mode · realtime-mode · alarm-status — 수집 주기·트리거·경보 상태</p>",
      "data": {
        "headers": [
          "구분",
          "항목",
          "대표 구성"
        ],
        "rows": [
          [
            "KCS 수집",
            "수동계측",
            "리드아웃 · 수준 · 광파"
          ],
          [
            "KCS 수집",
            "반자동 · 자동계측",
            "데이터로거 · 전원 · MUX"
          ],
          [
            "전송",
            "유선 · 무선",
            "LTE M2M · VPN · 게이트웨이"
          ],
          [
            "NMTI 확장",
            "원격 · 스마트 · AI 보조",
            "서버 · 경보 · 모델(HITL)"
          ],
          [
            "런타임",
            "normal · realtime · alarm",
            "주기 · 트리거 · 임계"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "이슈",
          "원인",
          "대응"
        ],
        "rows": [
          [
            "자동 · 수동 편차",
            "센서 · 초기치",
            "교차 검증 · 재교정"
          ],
          [
            "원격 미수신",
            "통신 · 전원",
            "로컬 SD · 수동 백업"
          ],
          [
            "과도한 경보",
            "기준 · 필터",
            "임계값 · 이상값 규칙 조정"
          ],
          [
            "보고 지연",
            "운영 프로세스",
            "담당 · 권한 · 자동화 점검"
          ]
        ]
      },
      "criteria": "<p>방식 선정은 KCS 빈도·발주처 요건·위험도에 따릅니다. 원격·스마트·AI는 <strong>운영 확장</strong>이며 KCS 계측방식 등급이 아닙니다. 자동·원격 구간에서도 수동 검증 병행을 유지합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "5단계 화살표가 맞나요?",
          "a": "아닙니다. KCS는 수집방법(수동·자동)을 기준으로 하고, 원격·스마트·AI는 운영 확장 계층입니다. 현장은 수동+자동, 자동+원격 등 조합이 일반적입니다."
        },
        {
          "q": "AI가 관리기준 대체?",
          "a": "아닙니다. 설계예상·최대허용변위 등 법정 기준을 보조합니다."
        },
        {
          "q": "수동 백업은?",
          "a": "자동·원격 구간에서도 통신·센서 장애 대비 수동 측정 계획을 유지합니다."
        },
        {
          "q": "한 번에 전부 도입?",
          "a": "아닙니다. 수동 기준선 확보 후 자동 수집·전송·플랫폼을 단계적으로 확장합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 계측 방식·빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1.3 — 관리 용어·기준 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-075",
        "caption": "계측 방식 — KCS 수집·전송·NMTI 확장·런타임 (≠ 5단계 등급)",
        "figureNo": 2
      }
    },
    "metaDescription": "계측 방식 개요의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "계측 방식·빈도"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§1.3",
        "label": "관리 용어·기준"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §1.3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/modes/manual": {
    "id": "instruments/modes/manual",
    "title": "수동 계측",
    "tagline": "KCS 수동계측 — 현장 방문·휴대 리드아웃",
    "sections": {
      "overview": "<p><strong>수동계측</strong>(KCS <strong>데이터 수집방법</strong>)은 계측 담당자가 현장을 방문해 리드아웃기·수준기·광파기 등으로 측정값을 직접 취득·기록하는 방식입니다. KCS 계측 빈도 표에서 기본 기준으로 제시되며, <strong>자동계측</strong> 구간에서도 이상 작동 대비 수동 측정 병행이 요구됩니다.</p><p>수동계측은 원격·스마트·AI보다 「낮은 단계」가 아니라, <strong>기준값 확인·정밀 검측·교차 검증</strong>에 필수인 수집방법입니다.</p>",
      "purpose": [
        {
          "title": "기준 확립",
          "body": "초기치·정기 검측의 신뢰 기반"
        },
        {
          "title": "검증",
          "body": "자동계측값 교차 확인"
        },
        {
          "title": "유연성",
          "body": "저빈도·단기 현장에 적합"
        }
      ],
      "siteLayout": "<p>현장 <strong>측점·기준점</strong> → 담당자 <strong>휴대 장비</strong>(리드아웃·수준·광파) → 현장 기록·엑셀·보고서. 자동화 구간과 병행해 교차 검증·백업 측정에 사용합니다.</p>",
      "installation": [
        "측점 · 기준점 · 보호 시설 설치",
        "리드아웃 · 수준 · 광파 장비 교정",
        "측정 매뉴얼 · 기록 양식 확정",
        "초기치 반복 측정으로 안정화",
        "자동계측 대비 수동 백업 계획"
      ],
      "principle": "<p>측정 주기는 계측관리계획서·KCS 표에 따르며, 위험 발생·변형 가속 시 빈도를 높입니다. 기록은 일시·측점·공정·날씨와 함께 남깁니다.</p>",
      "data": {
        "headers": [
          "장비",
          "용도",
          "유의"
        ],
        "rows": [
          [
            "지중경사계 리드아웃",
            "심도별 변위",
            "A · B축 기록"
          ],
          [
            "수준 · 광파",
            "침하 · 변위",
            "기준점"
          ],
          [
            "하중계",
            "축력",
            "온도 · 영점"
          ],
          [
            "기록",
            "현장 · 엑셀",
            "동기화"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "이슈",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "자동값과 편차",
            "초기치 · 영점",
            "교차 측정 · 재교정"
          ],
          [
            "기준점 불안",
            "영향권",
            "기준점 재설치"
          ],
          [
            "기록 누락",
            "양식 · 일지",
            "공정 · 날씨 동기"
          ],
          [
            "장비 오차",
            "교정 주기",
            "검교정 · 교체"
          ]
        ]
      },
      "criteria": "<p>측정자 자격·교정 주기·기록 보존을 관리합니다. 자동계측과 편차 발생 시 원인을 구분합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "수동만으로 충분한가요?",
          "a": "고위험·고빈도·야간 굴착 구간은 자동·원격 계측 병행이 일반적입니다."
        },
        {
          "q": "KCS 빈도 표?",
          "a": "수동계측을 기준으로 제시되며, 현장 여건에 따라 자동계측으로 전환할 수 있습니다."
        },
        {
          "q": "초기치는 몇 회?",
          "a": "안정화를 위해 반복 측정 후 재현성을 확인합니다. 공정·날씨를 일지에 남깁니다."
        },
        {
          "q": "자동값과 편차 시?",
          "a": "교차 측정·영점·케이블을 점검합니다. 어느 쪽이 이상인지 원인을 구분합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 표 3.5-1 — 수동계측 빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-070",
        "caption": "KCS 수동계측 — 현장 방문·리드아웃·교차 검증",
        "figureNo": 2
      }
    },
    "metaDescription": "수동 계측의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "표 3.5-1",
        "label": "수동계측 빈도"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 표 3.5-1",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/modes/automatic": {
    "id": "instruments/modes/automatic",
    "title": "자동 계측",
    "tagline": "KCS 자동계측 — 수집·저장·(필요 시) 전송·표출 연계",
    "sections": {
      "overview": "<p><strong>자동계측</strong>(KCS <strong>데이터 수집방법</strong>)은 센서 데이터를 설정 주기로 자동 수집·저장하고, 필요 시 유선·무선 통신을 통해 서버로 전송하여 표출·경보·보고 체계와 연계하는 운용방식입니다.</p><p>KCS에서는 구간 특성에 따라 수동계측에서 자동계측으로 전환할 수 있으며, 실시간 감시·자동경보, 원격지·접근 곤란, 센서 다수·인력 부족 등에서 자동화를 검토합니다. 현장 <strong>데이터로거</strong>는 자동 수집의 핵심 장비이나, 자동계측 전체를 로컬 저장만으로 한정하지 않습니다.</p>",
      "purpose": [
        {
          "title": "연속 수집",
          "body": "야간·휴일·고빈도 데이터"
        },
        {
          "title": "객관성",
          "body": "측정자 편차 감소"
        },
        {
          "title": "연계",
          "body": "통신·표출·경보·보고"
        }
      ],
      "siteLayout": "<p><strong>센서</strong> → <strong>데이터로거</strong> → 로컬 저장 → (선택) <strong>유선·무선 통신</strong> → 서버·표출·경보. 무인 현장은 태양광·배터리·방수 함체와 함께 스캔 주기·경보 규칙을 설정합니다.</p>",
      "installation": [
        "로거 채널 · 센서 매핑",
        "전원 · 태양광 · 배터리 설계",
        "수집 주기 · 경보 조건 설정",
        "초기치 · 영점 안정화",
        "수동계측 백업 절차 유지"
      ],
      "principle": "<p>센서 → 데이터로거 → 로컬 저장 → (필요 시) 통신 → 서버·표출·경보·보고 순으로 운용합니다. 샘플링 주기·필터·캘리브레이션이 데이터 품질을 결정합니다. 무인 현장 전원은 <a href=\"/homepage/technology/instruments/power/solar-power/\">태양광</a>·<a href=\"/homepage/technology/instruments/power/battery/\">배터리</a> 설계가 핵심이며, AC 가능 구간은 <a href=\"/homepage/technology/instruments/power/overview/\">전원 체계</a> 전체를 함께 검토합니다.</p>",
      "data": {
        "headers": [
          "요소",
          "설정",
          "해석"
        ],
        "rows": [
          [
            "주기",
            "1분~1일",
            "위험도"
          ],
          [
            "필터",
            "스파이크 제거",
            "오경보"
          ],
          [
            "동기",
            "공정 일지",
            "원인"
          ],
          [
            "백업",
            "SD · 중복",
            "손실 방지"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "결측 증가",
            "전원 · SD",
            "배터리 · 카드"
          ],
          [
            "드리프트",
            "센서 · 온도",
            "재교정"
          ],
          [
            "오경보",
            "필터 · 기준",
            "임계값 조정"
          ],
          [
            "통신 없음",
            "로컬 저장",
            "수동 백업 절차"
          ]
        ]
      },
      "criteria": "<p>결측률·센서 drift·전원 장애를 모니터링합니다. 이상 작동 시 수동 측정으로 검증합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "자동과 원격의 차이?",
          "a": "자동계측은 KCS 수집방법(현장 수집·저장·연계)입니다. 원격 자동계측은 통신·서버·대시보드까지 포함한 NMTI 운영 확장 개념입니다."
        },
        {
          "q": "로거만 있으면 자동계측?",
          "a": "로거는 핵심 장비입니다. 자동계측 운용은 수집·저장과 필요 시 전송·표출·경보·보고까지 포함합니다."
        },
        {
          "q": "스캔 주기는?",
          "a": "위험도·KCS·관리기준에 따라 분~시간 단위를 설정합니다. MUX 사용 시 채널당 유효 주기를 검증합니다."
        },
        {
          "q": "수동 병행?",
          "a": "이상 작동·통신 장애 대비 수동 측정을 계획서에 포함합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2 — 자동계측 전환 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-071",
        "caption": "KCS 자동계측 — 수집·저장·(선택) 전송",
        "figureNo": 2
      },
      "installation": "IMG-047"
    },
    "metaDescription": "자동 계측의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2",
        "label": "자동계측 전환"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/modes/remote-automatic": {
    "id": "instruments/modes/remote-automatic",
    "title": "원격 자동계측",
    "tagline": "NMTI 운영 확장 — 통신·서버·대시보드 원격 자동계측",
    "sections": {
      "overview": "<p><strong>원격 자동계측</strong>은 KCS 계측방식 분류가 아니라, 현장 <strong>자동계측</strong> 데이터를 <strong>LTE M2M</strong>·유선 등으로 서버에 전송하고 웹·모바일에서 모니터링·경보하는 <strong>NMTI 운영 확장 계층</strong>입니다. <strong>원격계측시스템</strong>이 대표 구현 형태입니다.</p>",
      "purpose": [
        {
          "title": "실시간성",
          "body": "현장 없이 추세·경보 확인"
        },
        {
          "title": "다현장",
          "body": "중앙 통합 모니터링"
        },
        {
          "title": "보고",
          "body": "자동 그래프·보고서"
        }
      ],
      "siteLayout": "<p>현장 <strong>자동계측</strong> → <strong>LTE M2M·게이트웨이</strong> → <strong>서버·DB</strong> → 웹·모바일·경보. 가용성·보안·데이터 품질이 핵심이며 수동 백업 계획을 병행합니다.</p>",
      "installation": [
        "아키텍처 · 보안 설계",
        "현장 로거 · 통신 설치",
        "서버 · DB · API 구축",
        "대시보드 · 권한 · 경보 규칙",
        "운영 · DR · 백업 절차"
      ],
      "principle": "<p>센서 → 로거 → <strong>LTE M2M 모뎀</strong>(또는 게이트웨이) → 서버·DB → 웹/모바일 → 경보의 계층 구조입니다. 가용성·보안·데이터 품질 관리가 핵심입니다.</p>",
      "data": {
        "headers": [
          "계층",
          "구성",
          "KPI"
        ],
        "rows": [
          [
            "현장",
            "센서 · 로거",
            "결측률"
          ],
          [
            "통신",
            "LTE M2M · VPN",
            "가용성"
          ],
          [
            "플랫폼",
            "DB · 웹",
            "지연"
          ],
          [
            "경보",
            "SMS · 앱",
            "응답시간"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "대시보드 미갱신",
            "링크 · 서버",
            "통신 · API"
          ],
          [
            "경보 지연",
            "규칙 · 큐",
            "Escalation 점검"
          ],
          [
            "데이터 불일치",
            "시간 동기",
            "NTP · 타임존"
          ],
          [
            "보안 이벤트",
            "VPN · 로그",
            "접근 · 패치"
          ]
        ]
      },
      "criteria": "<p>링크 가용성·경보 지연·데이터 무결성을 관리합니다. OT·IT 보안을 분리합니다. 원격 자동계측은 KCS 수집방법 등급이 아닌 운영 확장입니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "원격계측시스템과 동일?",
          "a": "원격 자동계측은 방식(개념)이고, 원격계측시스템은 이를 구현하는 통합 장비·플랫폼입니다."
        },
        {
          "q": "수동 병행?",
          "a": "통신·센서 장애 대비 수동 측정 계획을 유지하는 것이 KDS·KCS 원칙입니다."
        },
        {
          "q": "대시보드가 필수?",
          "a": "원격 자동계측은 서버·웹·모바일 등 모니터링 수단이 포함됩니다. 규모에 따라 단순 알림부터 확장합니다."
        },
        {
          "q": "LTE만으로 충분?",
          "a": "단일 현장·소규모는 가능하나, 다현장·게이트웨이·보안 요건에 따라 구성을 확장합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.1.2 — 원격 전송·시스템 구축 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-072",
        "caption": "NMTI 운영 확장 — LTE·서버·원격 모니터링",
        "figureNo": 2
      },
      "installation": "IMG-048",
      "data": "IMG-056"
    },
    "metaDescription": "원격 자동계측의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.1.2",
        "label": "원격 전송·시스템 구축"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.1.2",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/modes/smart": {
    "id": "instruments/modes/smart",
    "title": "스마트 계측",
    "tagline": "NMTI 운영 확장 — 플랫폼·경보·자동 보고",
    "sections": {
      "overview": "<p><strong>스마트 계측</strong>은 KCS 공식 계측방식 분류가 아니라, 원격 자동계측에 웹 대시보드·이벤트 로그·자동 보고서·단계별 경보 프로세스를 결합한 <strong>NMTI 운영 확장 계층</strong>입니다. 다수 센서·다현장 데이터를 한 화면에서 관리하고, 관리기준 초과 시 정의된 조치 흐름으로 연계합니다.</p>",
      "purpose": [
        {
          "title": "가시성",
          "body": "지도·목록·그래프 통합"
        },
        {
          "title": "자동화",
          "body": "보고서·이벤트 로그"
        },
        {
          "title": "경보 체계",
          "body": "정상·주의·경고·위험 단계"
        }
      ],
      "siteLayout": "<p><strong>원격 자동계측</strong>(센서·로거·LTE) → <strong>중앙 플랫폼</strong>(DB·웹·모바일) → <strong>경보·보고</strong> 프로세스. 관리기준·담당자·조치 이력이 플랫폼에 매핑됩니다.</p>",
      "installation": [
        "플랫폼 · 권한 · 조직 구조 설계",
        "센서 · 기준치 · 경보 매핑",
        "대시보드 · 모바일 알림 연동",
        "보고서 템플릿 · 배포 주기",
        "운영 매뉴얼 · 교육"
      ],
      "principle": "<p>데이터 수집 이상의 운영 계층입니다. 센서별 관리기준·경보 조건·담당자 알림·조치 이력을 플랫폼에 내장합니다.</p>",
      "data": {
        "headers": [
          "기능",
          "산출물",
          "활용"
        ],
        "rows": [
          [
            "대시보드",
            "실시간 그래프",
            "일상 모니터링"
          ],
          [
            "경보",
            "단계 · 담당자",
            "신속 조치"
          ],
          [
            "보고서",
            "PDF · 엑셀",
            "발주 · 감리"
          ],
          [
            "이력",
            "이벤트 로그",
            "원인 분석"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "이슈",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "오경보 다발",
            "임계값 · 필터",
            "기준 · 이상값 규칙 조정"
          ],
          [
            "보고 지연",
            "담당 · 권한",
            "자동화 · 템플릿 점검"
          ],
          [
            "대시보드 결측",
            "통신 · DB",
            "로컬 SD · 재전송"
          ],
          [
            "조치 이력 누락",
            "워크플로",
            "이벤트 로그 · 교육"
          ]
        ]
      },
      "criteria": "<p>경보 정확도·오경보율·보고 적시성을 KPI로 관리합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "스마트와 AI 보조 차이?",
          "a": "스마트는 규칙·기준 기반 운영 자동화입니다. AI 보조 분석은 학습·예측·이상탐지를 추가한 확장입니다. 둘 다 KCS 계측방식 분류가 아닙니다."
        },
        {
          "q": "필수 요소?",
          "a": "원격 자동계측 인프라 위에 플랫폼·기준·경보 프로세스가 갖춰져야 합니다."
        },
        {
          "q": "원격 자동과 차이?",
          "a": "원격은 수집·전송·모니터링까지이고, 스마트는 경보 단계·보고·운영 프로세스가 플랫폼에 내장됩니다."
        },
        {
          "q": "관리기준은 어디서?",
          "a": "설계도서·계측관리계획서·발주처 기준을 플랫폼에 매핑합니다. AI·스마트가 법정 기준을 대체하지 않습니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.4 — 알람·경보 운영 (기준 연계) <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-073",
        "caption": "NMTI 스마트 계측 — 플랫폼·단계별 경보 (KCS 분류 아님)",
        "figureNo": 2
      },
      "criteria": {
        "id": "IMG-054",
        "caption": "경보 단계 프로세스 — 정상·주의·경고·위험",
        "figureNo": 2
      },
      "data": [
        {
          "id": "IMG-056",
          "caption": "웹 대시보드·이벤트 로그",
          "figureNo": 3
        },
        {
          "id": "IMG-057",
          "caption": "자동 보고서·그래프 출력",
          "figureNo": 4
        },
        {
          "id": "IMG-055",
          "caption": "모바일 경보 알림",
          "figureNo": 5
        }
      ]
    },
    "metaDescription": "스마트 계측의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.4",
        "label": "알람·경보 운영 (기준 연계)"
      }
    ],
    "jsonLdIsBasedOn": []
  },
  "instruments/modes/ai": {
    "id": "instruments/modes/ai",
    "title": "AI 계측",
    "tagline": "NMTI AI 보조 분석 — 이상탐지·예측 (HITL)",
    "sections": {
      "overview": "<p><strong>AI 보조 분석</strong>은 KCS 계측방식이 아니라, 축적된 계측 시계열에 머신러닝·통계 기법을 적용해 이상 패턴 탐지, 변위·침하 예측, 센서 고장·노이즈 구분을 <strong>보조</strong>하는 NMTI 운영 확장입니다. 스마트 계측 플랫폼의 데이터 레이크·API 위에서 구현하는 것이 일반적이며, 관리기준·조치 판단을 AI 단독으로 확정하지 않습니다.</p>",
      "purpose": [
        {
          "title": "이상탐지",
          "body": "복합 센서 동시 이상 포착"
        },
        {
          "title": "예측",
          "body": "추세·잔류 변위 예측"
        },
        {
          "title": "품질",
          "body": "결측·드리프트 자동 판별"
        }
      ],
      "siteLayout": "<p><strong>데이터 레이크·API</strong>(원격·스마트 플랫폼 축적) → <strong>분석·모델</strong>(이상탐지·예측) → <strong>HITL 검토</strong> → 경보·보고에 보조 반영. AI 단독 결정은 사용하지 않습니다.</p>",
      "installation": [
        "데이터 품질 · 메타데이터 정비",
        "이벤트 · 공정 라벨링 체계",
        "모델 · 기준선 · 검증 지표 정의",
        "HITL(사람 검토) 워크플로",
        "모델 버전 · 감사 로그"
      ],
      "principle": "<p>초기에는 규칙 기반 경보와 병행하며, 충분한 라벨·이벤트 데이터가 쌓이면 모델을 보조 의사결정에 사용합니다. AI 결과는 항상 공학적 해석·현장 확인과 함께 적용합니다.</p>",
      "data": {
        "headers": [
          "적용",
          "입력",
          "주의"
        ],
        "rows": [
          [
            "이상탐지",
            "다채널 시계열",
            "오경보 검토"
          ],
          [
            "예측",
            "침하 · 변위 곡선",
            "외삽 한계"
          ],
          [
            "분류",
            "센서 상태",
            "현장 교차 확인"
          ],
          [
            "보조",
            "경보 우선순위",
            "최종 판단은 책임자"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "이슈",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "오탐 다발",
            "라벨 · 임계",
            "HITL 검토 · 모델 재학습"
          ],
          [
            "예측 외삽",
            "데이터 범위",
            "공학 해석 병행"
          ],
          [
            "결측 · 노이즈",
            "센서 · 통신",
            "품질 규칙 · 보정"
          ],
          [
            "모델 드리프트",
            "이벤트 분포",
            "버전 · 감사 로그"
          ]
        ]
      },
      "criteria": "<p>모델 성능·재현율·오탐률을 정기 평가하고, 중대 결정은 AI 단독 사용을 금지합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "데이터 양은?",
          "a": "이상탐지는 수개월 이상, 예측 모델은 사건·공정 라벨이 풍부할수록 유리합니다."
        },
        {
          "q": "KDS·KCS 대체?",
          "a": "아닙니다. 설계예상변위·최대허용변위 등 법정 기준을 대체하지 않고 보조합니다."
        },
        {
          "q": "스마트 계측 선행?",
          "a": "데이터 수집·품질·경보 체계가 갖춰진 뒤 분석·모델을 얹는 것이 일반적입니다."
        },
        {
          "q": "HITL이란?",
          "a": "Human-in-the-loop — AI 결과를 담당자가 검토·승인한 뒤 경보·조치에 반영합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 — 일반 관행 — 기준 보조·예측 분석 <span class=\"tech-sources__grade\">[E]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": {
        "id": "IMG-074",
        "caption": "AI 보조 분석 — HITL·법정기준 보조 (≠ KCS 계측방식)",
        "figureNo": 2
      },
      "data": {
        "id": "IMG-060",
        "caption": "데이터 품질관리 흐름 — 수집·검증·보정·분석·보고",
        "figureNo": 2
      }
    },
    "metaDescription": "AI 계측의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "E",
        "docId": "KDS-11-10-15",
        "cite": "—",
        "label": "일반 관행 — 기준 보조·예측 분석"
      }
    ],
    "jsonLdIsBasedOn": []
  },
  "instruments/modes/normal-mode": {
    "id": "instruments/modes/normal-mode",
    "title": "상시 계측 모드",
    "tagline": "안정 현장에서 고정 주기로 규칙 수집·전송하는 표준 운영 상태",
    "sections": {
      "overview": "<p><strong>상시 계측 모드(Normal/Routine Monitoring)</strong>는 현장이 안정적일 때 설정된 주기(예: 1시간 또는 1일 1회)에 맞춰 <strong>데이터로거</strong>가 규칙적으로 샘플링하고 서버로 전송하는 표준 운영 상태입니다. <strong>자동 계측</strong> 장비를 사용하되, 데이터 추세가 평탄하고 관리기준 이내인 구간의 일반 모드입니다.</p><p>타임라인 상 **등간격 트리거**·안정적인 시계열·클라우드 DB로의 일직선 데이터 흐름이 핵심 시각 요소입니다. 시계·달력 아이콘만으로 표현하지 않습니다.</p>",
      "purpose": [
        {
          "title": "정기 수집",
          "body": "고정 Interval 스케줄로 ADC 패킷 생성"
        },
        {
          "title": "안정 추세",
          "body": "평탄·완만한 시계열 유지"
        },
        {
          "title": "표준 운영",
          "body": "대부분의 구간 기본 모드"
        },
        {
          "title": "전환",
          "body": "이벤트·경보 시 realtime/alarm 모드로 전환"
        }
      ],
      "siteLayout": "<p>안정 구간: <strong>센서</strong> → <strong>로거</strong>(고정 Scan Interval) → <strong>서버</strong> — 등간격 시계열·평탄 추세. 임계 접근 시 <strong>realtime/alarm</strong> 모드로 전환하는 운영 규칙을 둡니다.</p>",
      "installation": [
        "계측관리계획서에 수집 주기 · 통신 주기를 명시",
        "로거 Scan/Store Interval을 현장 위험도 기준 설정",
        "서버 수신 · 시간 동기(NTP) 확인",
        "정상 추세 기준선을 초기 운영 데이터로 확립",
        "임계값 접근 시 realtime 모드 전환 규칙 설정"
      ],
      "principle": "<p>로거는 Scan Interval·Store Interval을 설정해 센서 채널을 순차 또는 병렬 샘플링합니다. 통신 모듈은 배치 또는 주기 업로드로 서버 DB에 기록하며, 그래프는 급격한 spike 없이 안정적입니다.</p>",
      "data": {
        "headers": [
          "항목",
          "설정",
          "표시"
        ],
        "rows": [
          [
            "주기",
            "1h · 1d 등",
            "등간격 트리거"
          ],
          [
            "추세",
            "평탄",
            "stable plot"
          ],
          [
            "전송",
            "LTE · 로컬",
            "일직선 화살표"
          ],
          [
            "전환",
            "임계값",
            "realtime/alarm"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "추세 이탈",
            "관리기준 · 속도",
            "모드 전환 검토"
          ],
          [
            "결측 증가",
            "통신 · 전원",
            "로컬 SD · 복구"
          ],
          [
            "오경보 없음",
            "임계값",
            "기준 · 필터 재설정"
          ],
          [
            "동기 오류",
            "NTP",
            "시간 태그 정비"
          ]
        ]
      },
      "criteria": "<p>정상 모드에서도 관리기준·변화속도를 모니터링합니다. 추세 이탈·통신 단절은 운영 이상으로 처리합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "자동 계측(071)과 차이?",
          "a": "071은 장비·현장 자동 수집 개념입니다. normal-mode는 **운영 상태**로 안정 구간·고정 주기·평탄 추세를 강조합니다."
        },
        {
          "q": "주기는 얼마나?",
          "a": "공종·KCS·위험도에 따라 10분~1일까지 다양합니다. 안정 구간은 긴 주기가 일반적입니다."
        },
        {
          "q": "언제 realtime-mode로?",
          "a": "관리기준 접근·발파·이상 징후 시 고속·이벤트 수집으로 전환합니다. 사전 트리거 규칙을 둡니다."
        },
        {
          "q": "평탄 추세란?",
          "a": "변위속도·하중 변화가 완만한 구간입니다. 단일 절대값보다 추세 안정이 중요합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 계측 방식·빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1.3 — 관리 용어·기준 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "상시 계측 모드의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "계측 방식·빈도"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§1.3",
        "label": "관리 용어·기준"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §1.3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/modes/realtime-mode": {
    "id": "instruments/modes/realtime-mode",
    "title": "실시간·이벤트 계측",
    "tagline": "런타임 이벤트 모드 — 트리거·고속 샘플링 (이벤트별 상이)",
    "sections": {
      "overview": "<p><strong>실시간·이벤트 계측 모드</strong>는 발파, 급격한 변위, 굴착 단계 변화 등 <strong>Trigger Event</strong> 발생 시 <strong>이벤트 유형에 맞는</strong> 고속 샘플링·즉시 전송을 수행하는 <strong>런타임 운영 모드</strong>입니다. 모든 이벤트가 수십~수백 Hz로 동일하지 않으며, 발파·진동·급변·관리자 명령 등 <strong>계획서에 정의한 rate·duration</strong>을 따릅니다.</p><p><strong>동적 데이터로거</strong>·<strong>진동계</strong>·트리거 DAQ가 대표 장비입니다. <a href=\"#instruments/modes/normal-mode\">상시 모드</a>의 고정 주기 수집과 구분합니다.</p>",
      "purpose": [
        {
          "title": "이벤트별 rate",
          "body": "발파·급변·명령마다 상이"
        },
        {
          "title": "이벤트 포착",
          "body": "트리거 전후 파형·peak"
        },
        {
          "title": "즉시 전송",
          "body": "동적 벡터·경보 연동"
        },
        {
          "title": "복귀",
          "body": "normal-mode로 전환"
        }
      ],
      "siteLayout": "<p>이벤트 발생: <strong>트리거</strong>(진동·임계·일정) → <strong>동적 DAQ/진동계</strong>(고속 샘플링) → 버퍼 저장 → <strong>실시간 서버·경보</strong>. 종료 후 <strong>normal-mode</strong> 복귀.</p>",
      "installation": [
        "이벤트 유형 · 샘플링 rate · duration을 정의",
        "동적 DAQ · 트리거 채널 · GPS 시간 동기 설정",
        "발파 · 굴착 일지와 트리거 시간 태그 연동",
        "실시간 대시보드 · 경보 연동을 테스트",
        "이벤트 종료 후 normal-mode 복귀 규칙 설정"
      ],
      "principle": "<p>트리거는 하드웨어(진동 threshold)·소프트웨어(관리자 명령)·일정(발파 시각)로 설정합니다. Pre-trigger buffer·Post-trigger record로 이벤트 전후 파형을 보존하고 PPV·변위 peak를 산출합니다.</p>",
      "data": {
        "headers": [
          "이벤트",
          "rate",
          "산출"
        ],
        "rows": [
          [
            "발파",
            "100+ Hz",
            "PPV · 주파수"
          ],
          [
            "급변",
            "10~100 Hz",
            "peak · 속도"
          ],
          [
            "명령",
            "연속",
            "파형 저장"
          ],
          [
            "복귀",
            "자동",
            "normal-mode"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "파형 누락",
            "트리거 · 버퍼",
            "임계값 · 길이 조정"
          ],
          [
            "클리핑",
            "게인 · 범위",
            "재설정"
          ],
          [
            "동기 실패",
            "GPS · 클럭",
            "시간 태그"
          ],
          [
            "복귀 안 됨",
            "모드 규칙",
            "수동 normal 전환"
          ]
        ]
      },
      "criteria": "<p>동적 모드 기준은 계약·법규·구조물·인체 진동 한계와 연동합니다. 파형 품질·클리핑·동기 오류를 검증합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "모든 이벤트가 100Hz?",
          "a": "아닙니다. 발파·진동은 100Hz급이 흔하나, 급변·명령·구조 응답은 계획서·장비에 따라 1~100Hz 등으로 다릅니다."
        },
        {
          "q": "정적 로거로 충분한가요?",
          "a": "발파·충격 이벤트는 동적 DAQ 또는 이벤트형 진동계가 필요합니다. 정적 Scan Interval만으로는 파형을 놓칩니다."
        },
        {
          "q": "터널 발파(097)와?",
          "a": "097은 현장 PPV·영향권 Figure입니다. 본 모드는 **시스템 토폴로지**·고속 샘플링 전환(095)입니다."
        },
        {
          "q": "normal-mode와 차이?",
          "a": "normal-mode는 안정 구간 고정 주기, realtime-mode는 이벤트·위험 구간 고속·트리거 수집입니다."
        },
        {
          "q": "전환 기준은?",
          "a": "관리기준 비율·발파 일정·담당자 수동 전환 등을 계획서에 정의합니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 계측 방식·빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1.3 — 관리 용어·기준 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "metaDescription": "실시간·이벤트 계측의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "계측 방식·빈도"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§1.3",
        "label": "관리 용어·기준"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §1.3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/modes/alarm-status": {
    "id": "instruments/modes/alarm-status",
    "title": "경보·알림 상태",
    "tagline": "관리기준 초과 시 경광·SMS·푸시로 비상 상태 전파",
    "sections": {
      "overview": "<p><strong>경보·알림 상태</strong>는 센서 값이 **관리기준치(주의·경고·위험/조치 3단계)** 를 초과했을 때 시스템이 비상 상태를 감지하고 **현장 경광등**·**SMS/푸시**·서버 알림을 즉시 발송하는 메커니즘입니다. SF형 경고창·네온 일러스트는 사용하지 않습니다.</p><p>그래프 상 **수평 threshold line**·데이터 plot의 **돌파 변곡점**·경광등·알림 블록으로 연결되는 **제어 흐름도**가 hero(102)의 핵심입니다. <strong>스마트 계측</strong>·IMG-054 경보 프로세스와 연계합니다.</p>",
      "purpose": [
        {
          "title": "3단계 기준",
          "body": "Caution·Warning·Action 수평선"
        },
        {
          "title": "즉시 전파",
          "body": "경광등·SMS·푸시 트리거"
        },
        {
          "title": "조치 연계",
          "body": "공정 중지·현장 확인·보고"
        },
        {
          "title": "로그",
          "body": "경보 이력·확인·해제 기록"
        }
      ],
      "siteLayout": "<p>계측값 → <strong>기준 비교</strong>(로거/서버) → 임계 돌파 시 <strong>경광등</strong>·<strong>SMS/푸시</strong>·Escalation. 해제는 확인 측정·책임자 승인 후 처리합니다.</p>",
      "installation": [
        "측점별 Caution/Warning/Action 임계값 설정",
        "현장 경광등 · 무선 알림 수신기 배치",
        "SMS · 이메일 · 앱 푸시 수신자 목록을 관리",
        "경보 · 확인 · 해제 워크플로를 문서화",
        "오경보 · 통신 장애 시 fallback을 정의"
      ],
      "principle": "<p>로거 또는 서버 규칙 엔진이 실시간·배치 데이터를 기준과 비교합니다. Action 초과 시 Escalation chain(현장→감리→발주)으로 알림이 전달되며, 해제는 확인 측정·책임자 승인 후 처리합니다.</p>",
      "data": {
        "headers": [
          "단계",
          "색",
          "조치"
        ],
        "rows": [
          [
            "Caution",
            "주의",
            "관찰 강화"
          ],
          [
            "Warning",
            "경고",
            "현장 확인"
          ],
          [
            "Action",
            "위험",
            "공정 중지 검토"
          ],
          [
            "알림",
            "SMS/푸시",
            "Escalation"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "증상",
          "점검",
          "조치"
        ],
        "rows": [
          [
            "오경보 다발",
            "필터 · 기준",
            "임계값 · 이상값 규칙"
          ],
          [
            "경보 미발송",
            "SMS · 수신자",
            "게이트웨이 · 권한"
          ],
          [
            "해제 안 됨",
            "워크플로",
            "확인 측정 · 승인"
          ],
          [
            "통신 장애",
            "로거 버퍼",
            "fallback · 수동 확인"
          ]
        ]
      },
      "criteria": "<p>관리기준은 설계예상변위·최대허용변위·계약·KCS를 따릅니다. 유지관리 통합계측에서는 설계 허용 대비 <strong>75%·90%</strong> 단계별 관찰·경보를 운영하기도 합니다. Action 초과 시 즉시 대응 절차를 가동합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "IMG-054와 차이?",
          "a": "054는 정상→주의→경고→위험→조치 **프로세스** Figure입니다. 102는 threshold 돌파→경광·SMS **제어 흐름** hero입니다."
        },
        {
          "q": "스마트 계측(073)?",
          "a": "073은 플랫폼·경보·보고 통합 개념입니다. alarm-status는 **기준 초과 비상 상태** 전용입니다."
        },
        {
          "q": "유지관리 75%·90% 단계는?",
          "a": "설계예상·최대허용 대비 단계별 관찰·경보입니다. 대구 3호선 통합 유지관리 S/W·SMS와 같은 운영 맥락입니다."
        },
        {
          "q": "normal-mode와 차이?",
          "a": "normal-mode는 안정 구간 정기 수집, alarm-status는 기준 초과·비상 경보·SMS·경광 등 즉시 조치 상태입니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3 — 계측 방식·빈도 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KDS 11 10 15:2025</strong>「지반계측」 §1.3 — 관리 용어·기준 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-054",
      "data": "IMG-055"
    },
    "metaDescription": "경보·알림 상태의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3",
        "label": "계측 방식·빈도"
      },
      {
        "grade": "A",
        "docId": "KDS-11-10-15",
        "cite": "§1.3",
        "label": "관리 용어·기준"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      },
      {
        "@type": "CreativeWork",
        "name": "KDS 11 10 15:2025 지반계측 §1.3",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  },
  "instruments/data-management": {
    "id": "instruments/data-management",
    "title": "데이터 관리",
    "tagline": "수집·저장·품질·보고·경보까지 계측 데이터 운영",
    "sections": {
      "overview": "<p><strong>데이터 관리</strong>는 현장에서 수집된 계측값을 <strong>저장·검증·보고·경보</strong>까지 운영하는 계측 시스템 계층입니다. 센서·로거·통신 하드웨어와 별도로, <strong>결측·이상값 처리</strong>, 관리기준 대비 추세 분석, 자동 보고서, 담당자 알림을 체계화합니다.</p><p>NMTI는 제품 판매가 아니라 <strong>발주처·설계 기준에 맞는 데이터 운영 프로세스</strong> 구성·유지관리를 수행합니다. <strong>댐·제방 건설중 계측</strong> 현장에서는 층별 침하·수압·온도 QC, 일·주 보고, 준공 시 운영기 안전관리 DB 이관을 같은 계층에서 운영합니다. 고급 통합·예측 분석은 필요 시 <a href=\"#instruments/modes/smart\">스마트 계측</a>·<a href=\"#instruments/modes/ai\">AI 보조 분석</a> 항목으로 확장할 수 있습니다.</p>",
      "purpose": [
        {
          "title": "데이터 품질",
          "body": "결측·드리프트·이상값 식별·보정"
        },
        {
          "title": "보고 · 이력",
          "body": "일·주·월 보고서·이벤트 로그"
        },
        {
          "title": "경보 연계",
          "body": "관리기준·단계별 조치 흐름"
        },
        {
          "title": "다현장 통합",
          "body": "중앙 DB·권한·감사 추적"
        }
      ],
      "siteLayout": "<p>현장 <strong>로거·통신</strong> → <strong>수집 서버·DB</strong> → <strong>QC·보정</strong> → <strong>대시보드·보고서</strong> → <strong>경보·이력</strong>. 메타데이터(측점·초기치·공정·담당자)와 백업·DR·접근 권한을 같은 계층에서 운영합니다.</p>",
      "installation": [
        "계측관리계획서 · 발주처 보고 주기에 맞춘 데이터 모델을 정의",
        "채널 · 측점 · 기준치 · 담당자 매핑 테이블 구축",
        "자동 보고서 · 대시보드 · 경보 규칙 설정",
        "백업 · 복구 · 보안 · 운영 매뉴얼을 문서화",
        "통신 · 센서 장애 시 수동 측정 · 보간 정책을 유지"
      ],
      "principle": "<p>현장 로거 → 통신 → 서버·DB → 대시보드·보고 → 경보의 파이프라인 위에 <strong>데이터 관리 정책</strong>(백업, 무결성, 메타데이터, 버전)을 둡니다. OT·IT 경계·접근 권한·DR을 함께 설계합니다.</p>",
      "data": {
        "headers": [
          "영역",
          "산출물",
          "실무 포인트"
        ],
        "rows": [
          [
            "수집",
            "원시 · 보정 시계열",
            "타임스탬프 · 초기치"
          ],
          [
            "품질",
            "QC 플래그",
            "결측 · 스파이크"
          ],
          [
            "보고",
            "PDF · 엑셀 · 웹",
            "발주처 양식"
          ],
          [
            "경보",
            "SMS · 앱 · 경광",
            "3단계 기준"
          ],
          [
            "감사",
            "이력 · 권한 로그",
            "계약 · 준공 대응"
          ]
        ]
      },
      "troubleshooting": {
        "headers": [
          "이슈",
          "확인",
          "조치"
        ],
        "rows": [
          [
            "이상값 다발",
            "센서 · 기준",
            "QC 플래그 · 현장 확인"
          ],
          [
            "결측 · 드리프트",
            "통신 · 전원",
            "백업 · 보간 정책"
          ],
          [
            "오경보",
            "임계값 · 필터",
            "규칙 · 3단계 기준 조정"
          ],
          [
            "보고 지연",
            "템플릿 · 권한",
            "자동화 · 담당 재지정"
          ]
        ]
      },
      "criteria": "<p>데이터 관리 기준은 계측관리계획서·발주처 지침·KCS 보고·경보 요건을 따릅니다. 관리기준 수치는 설계도서를 우선 적용하며, 원격 플랫폼의 1차·2차 임계 매핑은 <a href=\"#sensors/remote-monitoring-system\">원격계측시스템</a>·<a href=\"#instruments/modes/alarm-status\">경보·알림 상태</a>와 정합합니다. KCS에 따라 현장 <strong>계측책임자</strong>가 계측관리계획서·측정·보고·기준 초과 대응을 총괄합니다.</p>",
      "faq": [
        {
          "q": "스마트·AI 보조와의 차이?",
          "a": "데이터 관리는 **운영·품질·보고·경보**의 기본 계층입니다. 스마트·AI는 통합 플랫폼·예측 분석 등 확장 기능으로, 프로젝트 요구 시 추가합니다."
        },
        {
          "q": "원격 모니터링과의 관계?",
          "a": "원격 모니터링은 현장→서버 **전송·모니터링 체계**이고, 데이터 관리는 서버 이후 **저장·보고·운영 정책**입니다."
        },
        {
          "q": "결측·이상값 처리는?",
          "a": "수집 후 검증·보정 규칙을 두고, 원인(센서·통신·공정)을 구분합니다. 보고 전 품질 게이트를 운영합니다."
        },
        {
          "q": "보고서 자동화?",
          "a": "템플릿·배포 주기·승인 절차를 정의합니다. 발주·감리 요구 형식에 맞춥니다."
        }
      ],
      "sources": "<div class=\"tech-sources\" id=\"sources\"><h2 class=\"tech-sources__title\">근거 기준</h2><ul class=\"tech-sources__list\"><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 §3.2.4 — 보고·경보·데이터 운영 <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li><li class=\"tech-sources__item\">· <strong>KCS 11 10 15:2025</strong>「시공 중 지반계측」 — 발주처·계측관리계획서 보고 요건 <span class=\"tech-sources__grade\">[D]</span> <span class=\"tech-sources__publisher\">(국가건설기준센터(KCSC))</span></li></ul><p class=\"tech-sources__disclaimer\">※ 본 자료는 건설기준(KDS/KCS) 해설이며, 구체적 관리기준·허용값·시공 상세는 설계도서, 계측관리계획서, 발주처 지침을 우선 적용합니다.</p></div>"
    },
    "sectionImages": {
      "principle": "IMG-056",
      "data": "IMG-054"
    },
    "metaDescription": "데이터 관리의 구성, 설치, 운영, 데이터 흐름 및 현장 유지관리를 정리한 기술 자료입니다.",
    "standardSources": [
      {
        "grade": "B",
        "docId": "KCS-11-10-15",
        "cite": "§3.2.4",
        "label": "보고·경보·데이터 운영"
      },
      {
        "grade": "D",
        "docId": "KCS-11-10-15",
        "cite": "—",
        "label": "발주처·계측관리계획서 보고 요건"
      }
    ],
    "jsonLdIsBasedOn": [
      {
        "@type": "CreativeWork",
        "name": "KCS 11 10 15:2025 시공 중 지반계측 §3.2.4",
        "publisher": {
          "@type": "Organization",
          "name": "국가건설기준센터(KCSC)"
        },
        "url": "https://www.kcsc.re.kr"
      }
    ]
  }
};

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
