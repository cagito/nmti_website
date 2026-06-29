#!/usr/bin/env node
/** Batch-tighten narrative strings in scripts/content-data/*.mjs */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'content-data');

const REPLACEMENTS = [
  [/항목과\s+연계합니다/g, '항목에서 다룹니다'],
  [/항목과\s+연계해\s*/g, '항목에서 다룹니다'],
  [/연계합니다\./g, ''],
  [/연계합니다/g, ''],
  [/연계됩니다\./g, ''],
  [/연계해 /g, '함께 '],
  [/연계 해석/g, '통합 해석'],
  [/연계 모니터링/g, '동시 모니터링'],
  [/지보 연계/g, '지보 부담'],
  [/운행 연계/g, '운행 제한'],
  [/조치 연계/g, '조치 흐름'],
  [/경보 연계/g, '경보 알림'],
  [/연계 센서/g, '병행 센서'],
  [/이메일 연계/g, '이메일 알림']
];

let total = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith('.mjs'))) {
  const path = join(dir, file);
  let src = readFileSync(path, 'utf8');
  let out = src;
  for (const [re, rep] of REPLACEMENTS) {
    out = out.replace(re, rep);
  }
  if (out !== src) {
    writeFileSync(path, out, 'utf8');
    total += 1;
    console.log('tightened', file);
  }
}
console.log(`done — ${total} file(s) updated`);
