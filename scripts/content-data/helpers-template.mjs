export const HELPERS = `import { getNode, getCategoryChildren } from './dictionary.js';
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
`;
