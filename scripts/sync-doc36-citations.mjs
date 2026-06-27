#!/usr/bin/env node
/**
 * Inject cite (KDS/KCS) column into docs/36 §3 nodeId table (docs/40 Phase 2.2).
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { resolveSourcesForNode } from './lib/resolve-citations.mjs';
import { formatCiteShort } from './lib/format-cite-short.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TARGET = join(__dirname, '..', 'docs', '36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md');

const SECTION_START = '## 3. dictionary.js 노드';
const SECTION_END = '## 4. 분야별 공학 묘사';

/** @type {Record<string, string>} */
const NODE_ALIASES = {
  'INSTRUMENT_SUBGROUPS': 'sensors/remote-monitoring-system'
};

function parseNodeId(cell) {
  const tick = cell.match(/`([^`]+)`/);
  if (tick) return tick[1].split(/\s+/)[0];
  const plain = cell.trim().match(/^([a-z/][a-z0-9/-]*)/i);
  return plain ? plain[1] : null;
}

function resolveNodeId(raw) {
  const id = parseNodeId(raw);
  if (!id) return null;
  if (NODE_ALIASES[id]) return NODE_ALIASES[id];
  if (id.includes(' · ')) return id.split(' · ')[0].trim();
  return id.replace(/\s+\(.*\)$/, '').trim();
}

function citeForNode(nodeId) {
  if (!nodeId) return '—';
  const { sources } = resolveSourcesForNode(nodeId);
  return formatCiteShort(sources);
}

function syncTable(body) {
  const start = body.indexOf(SECTION_START);
  const end = body.indexOf(SECTION_END, start);
  if (start < 0 || end < 0) {
    console.error('§3 table bounds not found');
    process.exit(1);
  }
  const before = body.slice(0, start);
  const section = body.slice(start, end);
  const after = body.slice(end);

  const lines = section.split('\n');
  let updated = 0;
  const out = lines.map((line) => {
    if (line.match(/^\|\s*nodeId\s*\|/)) {
      return '| nodeId | cite (KDS/KCS) | hero | 프롬프트 / 계획 |';
    }
    if (/^\|[-:\s|]+\|$/.test(line) && line.includes('--------')) {
      return '|--------|-------------------|------|-----------------|';
    }
    if (!line.startsWith('|')) return line;
    if (!line.includes('`') && !line.includes('INSTRUMENT_SUBGROUPS')) return line;
    const cells = line
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim());
    if (cells.length < 3) return line;

    let nodeCell;
    let hero;
    let rest;
    const looksLikeCite = (c) => /^KDS\s|^KCS\s|^—$/.test(c);
    const looksLikeHero = (c) => /^IMG-/.test(c) || c.startsWith('(') || c.includes('IMG-');

    if (cells.length >= 4 && looksLikeCite(cells[1])) {
      nodeCell = cells[0];
      hero = cells[2];
      rest = cells.slice(3).join(' | ');
      const nodeId = resolveNodeId(nodeCell);
      const cite = citeForNode(nodeId);
      updated += 1;
      return `| ${nodeCell} | ${cite} | ${hero} | ${rest} |`;
    }

    nodeCell = cells[0];
    hero = cells[1];
    rest = cells.slice(2).join(' | ');
    if (!looksLikeHero(hero) && looksLikeCite(hero)) {
      return line;
    }
    const nodeId = resolveNodeId(nodeCell);
    const cite = citeForNode(nodeId);
    return `| ${nodeCell} | ${cite} | ${hero} | ${rest} |`;
  });

  return before + out.join('\n') + after;
}

const body = readFileSync(TARGET, 'utf8');
const next = syncTable(body);
writeFileSync(TARGET, next, 'utf8');
console.log('sync-doc36-citations: updated docs/36 §3 nodeId table');
