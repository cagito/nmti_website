/**
 * Phase 7.3 — bridge·retaining hero 브라우저 스크린샷 보관.
 * Usage: npm run capture:hero-screenshots
 *        node scripts/capture-hero-screenshots.mjs [--base https://www.nmti.co.kr]
 *
 * Edge headless(Windows) 또는 SEO 정적 페이지 fetch 검증으로 hero Figure를 기록합니다.
 */
import { execFileSync, spawnSync } from 'child_process';
import { mkdirSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getNode, nodePathSeo } from '../js/technology/dictionary.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs', 'qa-screenshots');
const MANIFEST = join(OUT_DIR, 'manifest.json');

const BASE = (() => {
  const i = process.argv.indexOf('--base');
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1].replace(/\/$/, '') : 'https://www.nmti.co.kr';
})();

const BRIDGE_IDS = [
  'fields/bridge',
  'fields/bridge/pier',
  'fields/bridge/abutment',
  'fields/bridge/foundation-settlement',
  'fields/bridge/expansion-joint',
  'fields/bridge/vibration',
  'fields/bridge/temperature',
  'fields/bridge/seismic',
  'fields/bridge/expansion-joint'
];

const RETAINING_IDS = [
  'fields/retaining-excavation',
  'fields/retaining-excavation/earth-retaining-wall',
  'fields/retaining-excavation/surrounding-ground'
];

const PAGES = [...BRIDGE_IDS, ...RETAINING_IDS].map((nodeId) => {
  const imageId = getNode(nodeId)?.imageId || '';
  const seoPath = nodePathSeo(nodeId);
  const slug = nodeId.replace(/\//g, '_');
  return {
    nodeId,
    imageId,
    group: nodeId.startsWith('fields/bridge') ? 'bridge' : 'retaining',
    spaUrl: `${BASE}/homepage/technology/#${nodeId}`,
    seoUrl: `${BASE}${seoPath}`,
    fileBase: `${slug}__${imageId}`
  };
});

const EDGE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

function findEdge() {
  return EDGE_CANDIDATES.find((p) => existsSync(p)) || null;
}

function slugFile(base, ext) {
  return join(OUT_DIR, `${base}.${ext}`);
}

function captureWithEdge(edge, url, outPng) {
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1400,900',
    '--virtual-time-budget=12000',
    `--screenshot=${outPng}`,
    url
  ];
  const r = spawnSync(edge, args, { stdio: 'pipe', timeout: 45000 });
  return r.status === 0 && existsSync(outPng) && statSync(outPng).size > 8000;
}

async function verifySeoHero(page) {
  const res = await fetch(page.seoUrl, {
    headers: { 'User-Agent': 'NMTI-capture-hero/1.0' },
    redirect: 'follow'
  });
  if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
  const html = await res.text();
  if (!html.includes(page.imageId)) {
    return { ok: false, reason: `${page.imageId} not in SEO HTML` };
  }
  if (!html.includes('tech-seo-hero')) {
    return { ok: false, reason: 'tech-seo-hero missing' };
  }
  const m = html.match(/<img[^>]+src="([^"]+)"[^>]*alt="[^"]*"/);
  const imgSrc = m?.[1] || html.match(/og:image" content="([^"]+)"/)?.[1];
  if (!imgSrc) return { ok: true, imgUrl: null };
  const imgUrl = imgSrc.startsWith('http') ? imgSrc : `${BASE}${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
  const ir = await fetch(imgUrl, { method: 'HEAD', headers: { 'User-Agent': 'NMTI-capture-hero/1.0' } });
  if (!ir.ok) return { ok: false, reason: `hero image HTTP ${ir.status}` };
  return { ok: true, imgUrl };
}

mkdirSync(OUT_DIR, { recursive: true });

const edge = findEdge();
const captured = [];
let failed = 0;

for (const page of PAGES) {
  const outPng = slugFile(page.fileBase, 'png');
  let method = 'seo-verify';
  let screenshot = false;
  let detail = '';

  if (edge) {
    const spaOk = captureWithEdge(edge, page.spaUrl, outPng);
    if (spaOk) {
      method = 'edge-spa';
      screenshot = true;
      detail = page.spaUrl;
    } else {
      const seoOk = captureWithEdge(edge, page.seoUrl, outPng);
      if (seoOk) {
        method = 'edge-seo';
        screenshot = true;
        detail = page.seoUrl;
      }
    }
  }

  const seo = await verifySeoHero(page);
  if (!seo.ok) {
    failed++;
    console.log('FAIL', page.nodeId, seo.reason);
    captured.push({ ...page, method: 'fail', screenshot: false, error: seo.reason });
    continue;
  }

  if (!screenshot) {
    writeFileSync(
      slugFile(page.fileBase, 'json'),
      JSON.stringify(
        {
          nodeId: page.nodeId,
          imageId: page.imageId,
          verifiedAt: new Date().toISOString(),
          seoUrl: page.seoUrl,
          heroImage: seo.imgUrl
        },
        null,
        2
      ),
      'utf8'
    );
    detail = seo.imgUrl || page.seoUrl;
  }

  console.log(screenshot ? 'SHOT' : 'OK  ', page.nodeId, page.imageId, method);
  captured.push({
    nodeId: page.nodeId,
    imageId: page.imageId,
    group: page.group,
    method,
    screenshot,
    file: screenshot ? `${page.fileBase}.png` : `${page.fileBase}.json`,
    url: detail,
    verifiedAt: new Date().toISOString()
  });
}

const manifest = {
  generated: new Date().toISOString().slice(0, 10),
  base: BASE,
  edge: edge || null,
  total: PAGES.length,
  screenshots: captured.filter((c) => c.screenshot).length,
  entries: captured
};

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');

const readme = [
  '# QA Hero Screenshots (Phase 7.3)',
  '',
  `> 생성: \`npm run capture:hero-screenshots\` · ${manifest.generated}`,
  '',
  '| 구분 | 노드 수 |',
  '|------|--------|',
  `| bridge | ${BRIDGE_IDS.length} |`,
  `| retaining | ${RETAINING_IDS.length} |`,
  '',
  '## 파일',
  '',
  '- `manifest.json` — 노드·imageId·캡처 방식',
  '- `*_*.png` — Edge headless 스크린샷 (가능 시)',
  '- `*_*.json` — SEO hero URL 검증 기록 (스크린샷 불가 시)',
  '',
  '## 재실행',
  '',
  '```bash',
  'npm run capture:hero-screenshots',
  'npm run verify:hero-screenshots',
  '```',
  ''
].join('\n');

writeFileSync(join(OUT_DIR, 'README.md'), readme, 'utf8');

console.log('---');
console.log(`Wrote ${MANIFEST}`);
console.log(`Screenshots: ${manifest.screenshots}/${manifest.total}, failures: ${failed}`);

if (failed) process.exit(1);
process.exit(0);
