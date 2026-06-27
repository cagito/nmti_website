import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  getAllContentNodeIds,
  nodePathSeo
} from '../js/technology/dictionary.js';
import { getContentForNode } from '../js/technology/content-data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sitemapPath = join(__dirname, '..', 'sitemap.xml');
const SITE = 'https://www.nmti.co.kr';
const lastmod = new Date().toISOString().slice(0, 10);

const staticUrls = [
  { loc: SITE + '/homepage/', priority: '1.0', changefreq: 'weekly' },
  { loc: SITE + '/homepage/sensors/inclinometer/', priority: '0.95', changefreq: 'monthly' }
];

const PRIORITY_BOOST = new Set(['fields/retaining-excavation/earth-retaining-wall']);

function locForNode(id) {
  if (id === 'sensors/inclinometer') return SITE + '/homepage/sensors/inclinometer/';
  return SITE + nodePathSeo(id);
}

function priorityFor(id) {
  if (PRIORITY_BOOST.has(id)) return '0.94';
  if (id.startsWith('sensors/') || id.startsWith('instruments/')) return '0.88';
  if (id.includes('/')) return '0.85';
  return '0.82';
}

function heroImageEntry(id) {
  const content = getContentForNode(id);
  const hero = content?.heroImage;
  if (!hero || hero.placeholder) return null;
  const src = hero.fallback || hero.src;
  if (!src) return null;
  const loc = SITE + '/homepage/' + String(src).replace(/^\//, '');
  const title = content.title || hero.alt || id;
  return { loc, title };
}

const techUrls = [
  {
    loc: SITE + nodePathSeo(''),
    priority: '0.92',
    changefreq: 'weekly'
  },
  ...getAllContentNodeIds()
    .filter(function (id) {
      return id !== 'sensors/inclinometer';
    })
    .map(function (id) {
    return {
      loc: locForNode(id),
      priority: priorityFor(id),
      changefreq: 'monthly',
      image: heroImageEntry(id)
    };
  })
];

const all = [...staticUrls, ...techUrls];

function renderUrl(u) {
  let block =
    '  <url>\n' +
    '    <loc>' +
    u.loc +
    '</loc>\n' +
    '    <lastmod>' +
    lastmod +
    '</lastmod>\n' +
    '    <changefreq>' +
    u.changefreq +
    '</changefreq>\n' +
    '    <priority>' +
    u.priority +
    '</priority>\n';
  if (u.image) {
    block +=
      '    <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
      '      <image:loc>' +
      u.image.loc +
      '</image:loc>\n' +
      '      <image:title>' +
      escapeXml(u.image.title) +
      '</image:title>\n' +
      '    </image:image>\n';
  }
  block += '  </url>';
  return block;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
  all.map(renderUrl).join('\n') +
  '\n</urlset>\n';

writeFileSync(sitemapPath, xml, 'utf8');
const withImages = all.filter(function (u) {
  return u.image;
}).length;
console.log('Wrote', all.length, 'URLs to sitemap.xml (' + withImages + ' with images)');
