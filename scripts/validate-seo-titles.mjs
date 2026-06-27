/**
 * Unique <title> and meta description across technology SEO static pages.
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', 'technology');

function walk(dir, acc = []) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) walk(p, acc);
    else if (f.name === 'index.html') acc.push(p);
  }
  return acc;
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

const titles = new Map();
const descs = new Map();
let warnings = 0;
let failed = 0;

for (const file of walk(root)) {
  const rel = file.replace(/\\/g, '/').replace(root.replace(/\\/g, '/') + '/', 'technology/');
  const html = readFileSync(file, 'utf8');
  const title = extract(html, /<title>([^<]+)<\/title>/);
  const desc = extract(html, /<meta name="description" content="([^"]*)"/);
  const canon = /<link rel="canonical"/.test(html);

  if (!canon) {
    failed++;
    console.log('FAIL missing canonical:', rel);
  }

  if (title) {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(rel);
    if (title.length > 60) {
      warnings++;
      console.log('WARN title > 60 chars:', rel, '(' + title.length + ')');
    }
  } else {
    failed++;
    console.log('FAIL missing title:', rel);
  }

  if (desc) {
    if (!descs.has(desc)) descs.set(desc, []);
    descs.get(desc).push(rel);
    if (desc.length > 160) {
      warnings++;
      console.log('WARN description > 160 chars:', rel, '(' + desc.length + ')');
    }
  } else {
    failed++;
    console.log('FAIL missing description:', rel);
  }
}

for (const [title, files] of titles) {
  if (files.length > 1) {
    failed++;
    console.log('FAIL duplicate title:', title);
    files.forEach((f) => console.log('  ', f));
  }
}

for (const [desc, files] of descs) {
  if (files.length > 1) {
    failed++;
    console.log('FAIL duplicate description:', desc.slice(0, 80) + (desc.length > 80 ? '…' : ''));
    files.forEach((f) => console.log('  ', f));
  }
}

if (failed) {
  console.error('validate-seo-titles:', failed, 'failure(s)', warnings ? ', ' + warnings + ' warning(s)' : '');
  process.exit(1);
}

console.log(
  'validate-seo-titles: OK (' +
    titles.size +
    ' unique titles, ' +
    descs.size +
    ' unique descriptions' +
    (warnings ? ', ' + warnings + ' warning(s)' : '') +
    ')'
);
