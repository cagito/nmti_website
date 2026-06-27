/**
 * 이미지 ↔ 문서(마스터·레지스트리·콘텐츠·image-audit) 불일치 추출.
 * Usage: node scripts/audit-image-doc-mismatch.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { createHash } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getAllContentNodeIds, getNode } from '../js/technology/dictionary.js';
import { getContentForNode } from '../js/technology/content-data.js';
import { IMAGE_ASSETS } from '../js/technology/images.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1');
const master = JSON.parse(readFileSync(join(pkg, '03_IMAGE_MASTER_LIST.json'), 'utf8'));
const registry = JSON.parse(readFileSync(join(ROOT, 'scripts', 'image-review-registry.json'), 'utf8'));
const auditMd = readFileSync(join(ROOT, 'docs', 'image-audit.md'), 'utf8');

const masterById = new Map(master.map((m) => [m.id, m]));
const issues = [];

function add(severity, category, id, message, refs = [], node = '') {
  issues.push({ severity, category, id, node, message, refs });
}

// §3 legacy grade table (image-audit.md) — registry PASS와 대조
const legacyGrade = new Map();
for (const m of auditMd.matchAll(
  /\|\s*\*\*(IMG-\d{3})\*\*[^|]*\|[^|]*\|[^|]*\|\s*\*\*(C|F)\*\*[^|]*\|\s*([^|]+)\|/g
)) {
  legacyGrade.set(m[1], { grade: m[2], note: m[3].trim() });
}

for (const [id, { grade, note }] of legacyGrade) {
  const reg = registry[id];
  const asset = IMAGE_ASSETS[id];
  if (reg?.reviewGrade === 'PASS' && asset?.reviewGrade === 'PASS') {
    add(
      'review',
      '문서-등급 불일치',
      id,
      `image-audit.md §3.1은 등급 ${grade}·이슈 기록 — 레지스트리/운영은 PASS. §3 갱신 또는 육안 재확인 필요.`,
      [note]
    );
  }
}

// 마스터 caption ↔ images.js caption
for (const item of master) {
  const asset = IMAGE_ASSETS[item.id];
  if (!asset) continue;
  if (item.caption && asset.caption && item.caption !== asset.caption) {
    add('warn', '마스터-caption', item.id, '03_IMAGE_MASTER_LIST caption ≠ images.js caption', [
      `master: ${item.caption.slice(0, 80)}…`,
      `images: ${asset.caption.slice(0, 80)}…`
    ]);
  }
  if (item.title && asset.title && item.title !== asset.title) {
    add('warn', '마스터-title', item.id, `마스터 title "${item.title}" ≠ images.js "${asset.title}"`);
  }
}

// PASS인데 prohibitedErrors 있음 → 육안 미확인 시만 review
for (const id of Object.keys(registry)) {
  const reg = registry[id];
  const errs = reg.prohibitedErrors || [];
  if (reg.reviewGrade === 'PASS' && errs.length > 0 && !reg.prohibitedVerified) {
    add(
      'review',
      '조건부 PASS',
      id,
      `PASS이나 금지 오류 ${errs.length}종 등록 — PNG가 실제로 회피했는지 육안·체크리스트 확인 필요`,
      errs.slice(0, 4)
    );
  }
}

// BRI-01 — bridge 노드에 굴착·흙막이 hero 금지
const BRIDGE_FORBIDDEN_HERO = ['IMG-001', 'IMG-002', 'IMG-005'];
for (const nodeId of getAllContentNodeIds()) {
  if (!nodeId.startsWith('fields/bridge')) continue;
  const node = getNode(nodeId);
  if (BRIDGE_FORBIDDEN_HERO.includes(node?.imageId)) {
    add(
      'mismatch',
      'BRI-01',
      node.imageId,
      `교량 노드 ${nodeId}에 굴착·흙막이 hero ${node.imageId} 바인딩 — REGENERATE 또는 imageId 교체 필요`,
      [nodeId],
      nodeId
    );
  }
}

// HAR-01 — 항만 조위·지하수에 육상 지하수위계(IMG-030) hero 금지
const HARBOR_TIDE_FORBIDDEN = ['IMG-001', 'IMG-002', 'IMG-005', 'IMG-030'];
for (const nodeId of getAllContentNodeIds()) {
  if (nodeId !== 'fields/harbor/tide-groundwater') continue;
  const node = getNode(nodeId);
  if (HARBOR_TIDE_FORBIDDEN.includes(node?.imageId)) {
    add(
      'mismatch',
      'HAR-01',
      node.imageId,
      `조위·지하수 노드에 육상/굴착 Figure ${node.imageId} hero — IMG-098(호안 단면) 또는 IMG-064로 교체 필요 (doc33)`,
      [nodeId],
      nodeId
    );
  }
}

// DEF-01 — 건축 구조물 처짐에 침하 Figure(IMG-050·032·033) hero 금지
const BUILDING_DEFLECTION_FORBIDDEN = ['IMG-050', 'IMG-032', 'IMG-033'];
for (const nodeId of getAllContentNodeIds()) {
  if (nodeId !== 'fields/building/deflection') continue;
  const node = getNode(nodeId);
  if (BUILDING_DEFLECTION_FORBIDDEN.includes(node?.imageId)) {
    add(
      'mismatch',
      'DEF-01',
      node.imageId,
      `건축 처짐 노드에 침하 Figure ${node.imageId} hero — IMG-099(RC 골조·처짐 그래프)로 교체 필요 (doc34)`,
      [nodeId],
      nodeId
    );
  }
}

// BLD-H-01 — 건축공사 분야 hero에 구조물 안전(IMG-022) 금지
const BUILDING_FORBIDDEN_HERO = ['IMG-022'];
for (const nodeId of getAllContentNodeIds()) {
  if (nodeId !== 'fields/building') continue;
  const node = getNode(nodeId);
  if (BUILDING_FORBIDDEN_HERO.includes(node?.imageId)) {
    add(
      'mismatch',
      'BLD-H-01',
      node.imageId,
      `건축공사 노드에 구조물 안전 Figure ${node.imageId} hero — IMG-100(건축 KCS 3.9)으로 교체 필요`,
      [nodeId],
      nodeId
    );
  }
}

// BLD-ADJ-01 — 건축 주변건물에 굴착 IMG-005 hero 금지
for (const nodeId of getAllContentNodeIds()) {
  if (nodeId !== 'fields/building/adjacent-building') continue;
  const node = getNode(nodeId);
  if (node?.imageId === 'IMG-005') {
    add(
      'mismatch',
      'BLD-ADJ-01',
      node.imageId,
      `건축 주변건물 노드에 굴착 Figure IMG-005 hero — IMG-101로 교체 필요`,
      [nodeId],
      nodeId
    );
  }
}

// dictionary imageId 중복 — 전용 Figure 있는데 공용 hero
const heroUsers = new Map();
for (const nodeId of getAllContentNodeIds()) {
  const node = getNode(nodeId);
  const img = node?.imageId;
  if (!img) continue;
  if (!heroUsers.has(img)) heroUsers.set(img, []);
  heroUsers.get(img).push(nodeId);
}

const DEDICATED = {
  'IMG-009': ['fields/tunnel/rockbolt', 'fields/tunnel/shotcrete'],
  'IMG-041': ['fields/tunnel/blast-vibration', 'sensors/vibration-meter'],
  'IMG-036': ['fields/tunnel/steel-support', 'fields/building/stress-strain'],
  'IMG-058': ['sensors/remote-monitoring-system']
};

for (const [img, nodes] of heroUsers) {
  if (nodes.length < 2) continue;
  const dedicated = DEDICATED[img];
  if (dedicated && dedicated.some((n) => nodes.includes(n))) {
    add(
      'warn',
      '히어로 공용',
      img,
      `전용 Figure 가능 노드가 공용 hero — ${nodes.join(', ')}`,
      dedicated
    );
  } else if (nodes.length >= 3) {
    add('info', '히어로 공용', img, `${nodes.length}개 노드 공용: ${nodes.join(', ')}`);
  }
}

// sectionImages ↔ 노드 주제 불일치 (휴리스틱)
const SECTION_RULES = [
  {
    node: 'fields/tunnel/blast-vibration',
    section: 'principle',
    img: 'IMG-041',
    expect: ['097', '발파', '터널'],
    problem: '발파진동 principle·hero에 범용 진동계 IMG-041(교량 deck) — IMG-097 전용 Figure 필요 (doc23)'
  },
  {
    section: 'principle',
    img: 'IMG-009',
    expect: ['강지보', '080', '스틸'],
    problem: '강지보 페이지 principle에 록볼트·숏크리트 통합도(IMG-009) — 전용 IMG-080 권장'
  },
  {
    node: 'fields/tunnel/rockbolt',
    section: 'principle',
    img: 'IMG-009',
    expect: ['록볼트', '078'],
    problem: '록볼트 전용 IMG-078 있음 — IMG-009(록볼트+숏크리트)는 보조만'
  },
  {
    node: 'fields/tunnel/shotcrete',
    section: 'principle',
    img: 'IMG-009',
    expect: ['숏크리트', '079'],
    problem: '숏크리트 전용 IMG-079 있음 — IMG-009는 보조만'
  }
];

function sectionImageId(sectionVal) {
  if (!sectionVal) return null;
  const entry = Array.isArray(sectionVal) ? sectionVal[0] : sectionVal;
  if (typeof entry === 'string') return entry;
  return entry?.imageId || entry?.id || null;
}

for (const rule of SECTION_RULES) {
  const c = getContentForNode(rule.node);
  const imgId = sectionImageId(c?.sectionImages?.[rule.section]);
  if (imgId === rule.img) {
    add('mismatch', 'sectionImages', rule.img, rule.problem, [rule.img], rule.node);
  }
}

// 콘텐츠 본문에 언급된 IMG vs hero 불일치 (sectionImages 교차참조는 허용)
function allSectionImageIds(c) {
  const ids = new Set();
  const map = c?.sectionImages;
  if (!map) return ids;
  for (const val of Object.values(map)) {
    const entries = Array.isArray(val) ? val : [val];
    for (const fig of entries) {
      const imgId =
        typeof fig === 'string' ? fig : fig?.imageId || fig?.id;
      if (imgId) ids.add(imgId);
    }
  }
  return ids;
}

for (const nodeId of getAllContentNodeIds()) {
  const node = getNode(nodeId);
  const c = getContentForNode(nodeId);
  if (!node?.imageId || !c?.sections?.overview) continue;
  const sectionIds = allSectionImageIds(c);
  const overview = String(c.sections.overview);
  const imgRefs = [...overview.matchAll(/IMG-\d{3}/g)].map((m) => m[0]);
  for (const ref of new Set(imgRefs)) {
    if (ref !== node.imageId && !sectionIds.has(ref)) {
      add(
        'warn',
        '본문-hero',
        nodeId,
        `개요에 ${ref} 언급 — hero는 ${node.imageId}`,
        [ref, node.imageId]
      );
    }
  }
}

// image-audit §4.6 권장 매핑 vs 현재 dictionary (일부)
const PLANNED = {
  'sensors/piezometer': { hero: 'IMG-031', install: 'IMG-031' },
  'sensors/remote-monitoring-system': { hero: 'IMG-058', data: 'IMG-056' }
};
for (const [nodeId, plan] of Object.entries(PLANNED)) {
  const node = getNode(nodeId);
  if (plan.hero && node?.imageId !== plan.hero) {
    add('info', '계획서-hero', nodeId, `image-audit §4.6 hero ${plan.hero} — 현재 ${node?.imageId}`);
  }
}

// PNG 파일명 vs 마스터 title 키워드 (간단)
const imgDir = join(ROOT, 'assets', 'images', 'technology');
for (const f of readdirSync(imgDir)) {
  const m = f.match(/^(IMG-\d{3})_(.+)\.png$/);
  if (!m) continue;
  const item = masterById.get(m[1]);
  if (!item) continue;
  const slug = m[2].replace(/-/g, '');
  const titleCompact = item.title.replace(/\s/g, '').slice(0, 6);
  if (!slug.includes(titleCompact.slice(0, 3)) && m[1] === 'IMG-031') {
    add('mismatch', '파일명', m[1], `PNG 파일명 "${m[2]}" — 마스터 제목「${item.title}」과 불일치 (진동현식 잔존)`, [
      f
    ]);
  }
}

// book-plan 2단계 — read crosscheck if body fail
try {
  const plan = readFileSync(join(ROOT, 'docs', 'book-plan-review-2026-06.md'), 'utf8');
  for (const m of plan.matchAll(/\|\s*`[^`]+`\s*\|\s*(\S+)\s*\|\s*`([^`]+)`\s*\|\s*미포함\s*\|\s*FAIL\s*\|/g)) {
    add('mismatch', 'book-도면', m[2], `도면 키워드 ${m[1]} — 기술자료 본문 미포함`);
  }
} catch {
  /* optional */
}

// AUTO-01 — 자동계측 Figure(025·030·031) caption/alt logger chain
const AUTO01_IDS = new Set(['IMG-025', 'IMG-030', 'IMG-031']);
const MANUAL_ONLY = /리드아웃|readout|sounder|수동\s*프로브|manual\s*probe|현장\s*판독/i;
const AUTO_CHAIN = /비교|inset|AUTO|IPI|로거|logger|datalogger|well\s*cap|junction|vented|submersible|필터/i;

for (const id of AUTO01_IDS) {
  const asset = IMAGE_ASSETS[id];
  if (!asset || asset.reviewGrade !== 'PASS') continue;
  const blob = `${asset.alt || ''} ${asset.caption || ''}`;
  if (MANUAL_ONLY.test(blob) && !AUTO_CHAIN.test(blob)) {
    add(
      'mismatch',
      'AUTO-01',
      id,
      `${id} caption/alt — manual-only hero 표현, datalogger chain 누락 (INSTRUMENTATION §3.24)`
    );
  }
}

for (const nodeId of getAllContentNodeIds()) {
  const node = getNode(nodeId);
  const c = getContentForNode(nodeId);
  const principleId = sectionImageId(c?.sectionImages?.principle);
  const heroId = node?.imageId;
  for (const autoId of AUTO01_IDS) {
    if (principleId !== autoId && heroId !== autoId) continue;
    const asset = IMAGE_ASSETS[autoId];
    const blob = `${asset?.alt || ''} ${asset?.caption || ''}`;
    if (MANUAL_ONLY.test(blob) && !AUTO_CHAIN.test(blob)) {
      add(
        'mismatch',
        'AUTO-01',
        autoId,
        `노드 ${nodeId} principle/hero ${autoId} — AUTO-01 위반`,
        [nodeId],
        nodeId
      );
    }
  }
}

// EXC-01 / STR-01 — 앵커 LC vs 버팀보 LC caption 휴리스틱
const LC_RULES = [
  {
    id: 'IMG-004',
    need: /앵커|anchor|강연선|지지링|반력판/i,
    msg: '어스앵커 LC — 앵커 두부 키워드 누락 (EXC-01)'
  },
  {
    id: 'IMG-035',
    need: /버팀보|띠장|strut/i,
    alsoNeed: /앵커|어스앵커|anchor/i,
    msg: 'STR-01 — strut·anchor LC 모두 caption/alt에 명시 필요'
  }
];

for (const rule of LC_RULES) {
  const asset = IMAGE_ASSETS[rule.id];
  if (!asset) continue;
  const blob = `${asset.alt || ''} ${asset.caption || ''}`;
  if (!rule.need.test(blob)) {
    add('warn', 'EXC-01', rule.id, rule.msg);
  } else if (rule.alsoNeed && !rule.alsoNeed.test(blob)) {
    add('warn', 'STR-01', rule.id, rule.msg);
  }
}

// EXC-03 — 지하수위계·간극수압계 PNG 동일 hash (이형 Figure 중복)
function pngSha256(id) {
  const f = readdirSync(imgDir).find((x) => x.startsWith(`${id}_`) && x.endsWith('.png'));
  if (!f) return null;
  return createHash('sha256').update(readFileSync(join(imgDir, f))).digest('hex');
}

const hash030 = pngSha256('IMG-030');
const hash031 = pngSha256('IMG-031');
if (hash030 && hash031 && hash030 === hash031) {
  add(
    'mismatch',
    'EXC-03',
    'IMG-030',
    '030·031 PNG file hash 동일 — 개방 관측공 vs filter piezo 이형 Figure 중복 (EXC-03)',
    ['IMG-031']
  );
}

// Sort: mismatch > review > warn > info
const rank = { mismatch: 0, review: 1, warn: 2, info: 3 };
issues.sort((a, b) => rank[a.severity] - rank[b.severity] || a.id.localeCompare(b.id));

const outJson = join(ROOT, 'docs', 'image-doc-mismatch-report.json');
const outMd = join(ROOT, 'docs', 'image-doc-mismatch-report.md');

writeFileSync(
  outJson,
  JSON.stringify(
    {
      generated: new Date().toISOString().slice(0, 10),
      total: issues.length,
      bySeverity: {
        mismatch: issues.filter((i) => i.severity === 'mismatch').length,
        review: issues.filter((i) => i.severity === 'review').length,
        warn: issues.filter((i) => i.severity === 'warn').length,
        info: issues.filter((i) => i.severity === 'info').length
      },
      issues
    },
    null,
    2
  ),
  'utf8'
);

const lines = [
  '# 이미지 ↔ 문서 불일치 추출 보고서',
  '',
  `> 생성: \`node scripts/audit-image-doc-mismatch.mjs\` · ${new Date().toISOString().slice(0, 10)}`,
  '',
  '| 심각도 | 건수 |',
  '|--------|------|',
  `| **mismatch** (명확 불일치) | ${issues.filter((i) => i.severity === 'mismatch').length} |`,
  `| **review** (PASS vs 문서 C·금지요소) | ${issues.filter((i) => i.severity === 'review').length} |`,
  `| **warn** | ${issues.filter((i) => i.severity === 'warn').length} |`,
  `| **info** | ${issues.filter((i) => i.severity === 'info').length} |`,
  '',
  '---',
  ''
];

let lastCat = '';
for (const i of issues) {
  if (i.category !== lastCat) {
    lastCat = i.category;
    lines.push(`## ${i.category}`, '');
  }
  const head = i.node
    ? `### ${i.severity.toUpperCase()} · \`${i.node}\` · ${i.id}`
    : `### ${i.severity.toUpperCase()} · \`${i.id}\``;
  lines.push(head, '', i.message);
  if (i.refs?.length) {
    for (const r of i.refs) lines.push(`- ${r}`);
  }
  lines.push('');
}

writeFileSync(outMd, lines.join('\n'), 'utf8');
console.log(`Wrote ${outMd}`);
console.log(`Wrote ${outJson}`);
console.log(
  `Total: ${issues.length} (mismatch ${issues.filter((i) => i.severity === 'mismatch').length}, review ${issues.filter((i) => i.severity === 'review').length})`
);
