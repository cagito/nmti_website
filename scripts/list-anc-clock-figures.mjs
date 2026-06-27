#!/usr/bin/env node
/**
 * Figures affected by ANC-CLOCK (anchor load cell diagonal axis).
 * docs/83-어스앵커-하중계-ANC-CLOCK-정본.md
 */
import { existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(ROOT, 'assets', 'images', 'technology');

const DIRECT = [
  {
    id: 'IMG-004',
    nodeId: 'fields/retaining-excavation/anchor',
    role: '어스앵커 하중계 히어로 — ANC-CLOCK 정본'
  },
  {
    id: 'IMG-002',
    nodeId: 'fields/retaining-excavation/earth-retaining-wall',
    role: '대표 단면도 ⑥ 앵커 LC + Anchor Head Detail'
  },
  {
    id: 'IMG-035',
    nodeId: 'sensors/load-cell',
    role: '하중계 개요 — 앵커 패널 사선'
  }
];

const INDIRECT = [
  { id: 'IMG-001', nodeId: 'fields/retaining-excavation', role: '가시설 전체 개념도' },
  { id: 'IMG-005', nodeId: 'fields/retaining-excavation/adjacent-building', role: '주변건물' },
  { id: 'IMG-096', nodeId: 'fields/retaining-excavation/surrounding-ground', role: '주변지반' }
];

const CONTRAST = [
  {
    id: 'IMG-003',
    nodeId: 'fields/retaining-excavation/strut',
    role: '버팀보 LC — 수평(3~9시)이 정상, 앵커에 복사 금지'
  }
];

function filesFor(id) {
  if (!existsSync(imgDir)) return [];
  return readdirSync(imgDir).filter((f) => f.startsWith(id + '_') || f === id + '.webp');
}

function printGroup(title, items) {
  console.log('\n' + title);
  for (const item of items) {
    const files = filesFor(item.id);
    console.log(' ', item.id, '—', item.role);
    console.log('    node:', item.nodeId);
    if (files.length) files.forEach((f) => console.log('    file:', f));
    else console.log('    file: (none on disk)');
  }
}

console.log('ANC-CLOCK affected figures — docs/83');
printGroup('=== DIRECT (재작도·육안 검수 필수) ===', DIRECT);
printGroup('=== INDIRECT (앵커 표기 시 준수) ===', INDIRECT);
printGroup('=== CONTRAST (수평 LC 정상) ===', CONTRAST);
console.log('\nRule: strand 7 o\'clock · load cell axis 1~7 o\'clock · NOT horizontal 3~9');
