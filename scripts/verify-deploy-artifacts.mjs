/**
 * 로컬 배포 산출물 존재·내용 검증 (docs/09-GNSS-book-PDF-및-검증-가이드.md §6).
 * Usage: node scripts/verify-deploy-artifacts.mjs
 */
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getNode, nodePathSeo } from '../js/technology/dictionary.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function fail(name, detail) {
  console.log('FAIL', name, detail);
  return false;
}

function ok(name) {
  console.log('OK  ', name);
  return true;
}

function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf8');
}

function findImg043() {
  const dir = join(ROOT, 'assets/images/technology');
  return readdirSync(dir).find((f) => f.startsWith('IMG-043_') && f.endsWith('.webp'));
}

let failed = 0;

function check(name, fn) {
  if (!fn()) failed++;
}

check('book/GNSS.pdf', () => {
  if (!existsSync(join(ROOT, 'book/GNSS.pdf'))) return fail('book/GNSS.pdf', 'missing');
  return ok('book/GNSS.pdf');
});

check('IMG-043 canonical WebP', () => {
  const webp = findImg043();
  if (!webp) return fail('IMG-043 canonical WebP', 'missing');
  return ok('IMG-043 canonical WebP');
});

check('content-data.js GNSS', () => {
  const js = read('js/technology/content-data.js');
  const need = ['sensors/gnss', 'detailLink', '/homepage/book/GNSS.pdf', '기준국', '이동국', 'RTK'];
  const missing = need.filter((s) => !js.includes(s));
  if (missing.length) return fail('content-data.js GNSS', 'missing: ' + missing.join(', '));
  return ok('content-data.js GNSS');
});

check('SEO sensors/gnss', () => {
  const p = 'technology/sensors/gnss/index.html';
  if (!existsSync(join(ROOT, p))) return fail('SEO sensors/gnss', 'missing file');
  const html = read(p);
  const need = ['IMG-043', '/homepage/book/GNSS.pdf', 'target="_blank"', '기준국'];
  const missing = need.filter((s) => !html.includes(s));
  if (missing.length) return fail('SEO sensors/gnss', 'missing: ' + missing.join(', '));
  return ok('SEO sensors/gnss');
});

check('SPA detailLink PDF 새 탭', () => {
  const js = read('js/technology/content-loader.js');
  if (!js.includes('.pdf') || !js.includes('target="_blank"')) {
    return fail('content-loader.js', 'PDF new-tab not wired');
  }
  return ok('SPA detailLink PDF 새 탭');
});

check('technology/index.html cache bust', () => {
  const html = read('technology/index.html');
  const m = html.match(/app\.js\?v=(\d+)/);
  if (!m || Number(m[1]) < 11) {
    return fail('technology/index.html', 'app.js?v>=11 required, got ' + (m?.[1] ?? 'none'));
  }
  return ok('technology/index.html app.js?v=' + m[1]);
});

check('canonical-image-webp.json', () => {
  if (!existsSync(join(ROOT, 'scripts/canonical-image-webp.json'))) {
    return fail('canonical-image-webp.json', 'missing');
  }
  return ok('canonical-image-webp.json');
});

check('deploy manifest includes book PDF', () => {
  const manifestPath = join(ROOT, 'docs/deploy-manifest.txt');
  if (!existsSync(manifestPath)) {
    return fail('deploy-manifest.txt', 'run: node scripts/list-deploy-manifest.mjs --write');
  }
  const text = read('docs/deploy-manifest.txt');
  if (!text.includes('book/GNSS.pdf')) {
    return fail('deploy-manifest.txt', 'book/GNSS.pdf not listed');
  }
  return ok('deploy manifest includes book/GNSS.pdf');
});

const PHASE5_IMAGES = ['IMG-025', 'IMG-030', 'IMG-031', 'IMG-034', 'IMG-035', 'IMG-062'];
check('Phase 5 canonical WebP on disk', () => {
  const dir = join(ROOT, 'assets/images/technology');
  const missing = [];
  for (const id of PHASE5_IMAGES) {
    const webp = readdirSync(dir).some((f) => f.startsWith(id + '_') && f.endsWith('.webp'));
    if (!webp) missing.push(id + ' WebP');
  }
  if (missing.length) return fail('Phase 5 images', missing.join(', '));
  return ok('Phase 5 canonical WebP (025·030·031·034·035·062)');
});

check('patch-registry-phase5-6.mjs', () => {
  if (!existsSync(join(ROOT, 'scripts/patch-registry-phase5-6.mjs'))) {
    return fail('patch-registry-phase5-6.mjs', 'missing');
  }
  return ok('patch-registry-phase5-6.mjs');
});

const BRIDGE_NODE_IDS = [
  'fields/bridge',
  'fields/bridge/pier',
  'fields/bridge/abutment',
  'fields/bridge/foundation-settlement',
  'fields/bridge/strain-stress',
  'fields/bridge/deflection',
  'fields/bridge/expansion-joint',
  'fields/bridge/cable-tension',
  'fields/bridge/bearing-displacement',
  'fields/bridge/wind',
  'fields/bridge/vibration',
  'fields/bridge/temperature',
  'fields/bridge/seismic'
];
const BRI_FORBIDDEN = ['IMG-001_가시설', 'IMG-002_흙막이', 'IMG-005_주변건물'];

function seoRelPath(nodeId) {
  return nodePathSeo(nodeId).replace(/^\/homepage\//, '') + 'index.html';
}

check('INCL-SEO inclinometer canonical', () => {
  const dup = join(ROOT, 'technology/sensors/inclinometer/index.html');
  if (existsSync(dup)) {
    return fail('INCL-SEO', 'duplicate technology/sensors/inclinometer/ — run npm run build:seo');
  }
  if (!existsSync(join(ROOT, 'sensors/inclinometer/index.html'))) {
    return fail('INCL-SEO', 'missing sensors/inclinometer/index.html');
  }
  const js = read('js/technology/content-data.js');
  if (!js.includes('detailLink') || !js.includes('/homepage/sensors/inclinometer/')) {
    return fail('INCL-SEO', 'sensors/inclinometer detailLink missing in content-data.js');
  }
  const bad = '/homepage/technology/sensors/inclinometer/';
  const sample = read('technology/fields/slope/index.html');
  if (sample.includes(bad)) {
    return fail('INCL-SEO', 'wrong inclinometer href in SEO pages — run npm run build:seo');
  }
  return ok('INCL-SEO inclinometer canonical');
});

check('Bridge BRI SEO (13 nodes)', () => {
  const problems = [];
  for (const nodeId of BRIDGE_NODE_IDS) {
    const imageId = getNode(nodeId)?.imageId;
    if (!imageId) {
      problems.push(`${nodeId}: no imageId`);
      continue;
    }
    const rel = seoRelPath(nodeId);
    if (!existsSync(join(ROOT, rel))) {
      problems.push(`${rel}: missing`);
      continue;
    }
    const html = read(rel);
    if (!html.includes(imageId)) problems.push(`${nodeId}: missing ${imageId}`);
    if (!html.includes('og:image')) problems.push(`${nodeId}: no og:image`);
    for (const bad of BRI_FORBIDDEN) {
      if (html.includes(bad)) problems.push(`${nodeId}: forbidden ${bad}`);
    }
  }
  if (problems.length) return fail('Bridge BRI-01 SEO', problems.join('; '));
  return ok('Bridge BRI SEO (13 nodes)');
});

check('발파진동 IMG-097 SEO', () => {
  const rel = 'technology/fields/tunnel/blast-vibration/index.html';
  if (!existsSync(join(ROOT, rel))) return fail('blast-vibration SEO', 'missing file');
  const html = read(rel);
  if (!html.includes('IMG-097')) return fail('blast-vibration SEO', 'IMG-097 missing');
  if (html.includes('IMG-041_진동계')) return fail('blast-vibration SEO', 'IMG-041 still in hero');
  return ok('발파진동 IMG-097 SEO');
});

check('homepage 12분야 cards', () => {
  const html = read('index.html');
  const required = [
    '건설 계측 12분야',
    '항만·해안',
    '건축·인접 구조물',
    '구조물 안전',
    '기초·말뚝',
    '환경·민원'
  ];
  const missing = required.filter((t) => !html.includes(t));
  if (missing.length) return fail('index.html', 'missing: ' + missing.join(', '));
  const cards = (html.match(/<article class="field-card">/g) || []).length;
  if (cards !== 12) return fail('index.html', `field-card count ${cards} !== 12`);
  return ok('homepage 12분야 (12 cards)');
});

check('Phase 7.3 hero screenshots manifest', () => {
  const manifestPath = join(ROOT, 'docs/qa-screenshots/manifest.json');
  if (!existsSync(manifestPath)) {
    return fail('qa-screenshots', 'run: npm run capture:hero-screenshots');
  }
  const manifest = JSON.parse(read('docs/qa-screenshots/manifest.json'));
  if ((manifest.entries || []).length < 12) {
    return fail('qa-screenshots', `entries ${(manifest.entries || []).length} < 12`);
  }
  return ok('Phase 7.3 hero screenshots manifest');
});

if (failed) {
  console.log('\nverify-deploy-artifacts:', failed, 'failed');
  process.exit(1);
}
console.log('\nverify-deploy-artifacts: all checks passed');
