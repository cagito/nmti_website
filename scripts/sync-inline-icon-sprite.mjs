#!/usr/bin/env node
/** Copy assets/icons/nmti-icons.svg symbols into technology/index.html inline sprite. */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sprite = readFileSync(join(root, 'assets/icons/nmti-icons.svg'), 'utf8');
const htmlPath = join(root, 'technology/index.html');
let html = readFileSync(htmlPath, 'utf8');

const inner = sprite.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const re = /(<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">)[\s\S]*?(<\/svg>)/;
if (!re.test(html)) {
  console.error('technology/index.html sprite block not found');
  process.exit(1);
}
html = html.replace(re, '$1\n    ' + inner.trim().replace(/\n/g, '\n    ') + '\n  $2');
writeFileSync(htmlPath, html, 'utf8');
console.log('Synced inline icon sprite → technology/index.html');
