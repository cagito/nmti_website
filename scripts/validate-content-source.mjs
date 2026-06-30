#!/usr/bin/env node
/**
 * content-data 소스 (*.mjs) — 5섹션 통일 금지 패턴 검사
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, 'content-data');
const files = readdirSync(srcDir).filter((f) => f.endsWith('.mjs'));

const errors = [];

for (const file of files) {
  const text = readFileSync(join(srcDir, file), 'utf8');
  if (/process-list/.test(text)) {
    errors.push(`${file}: process-list HTML — installation 배열 사용`);
  }
  if (/installation:\s*['"]<(?:p|ol|ul)/.test(text)) {
    errors.push(`${file}: installation HTML 문자열 — 배열로 작성`);
  }
}

if (errors.length) {
  console.error('validate-content-source: FAIL');
  for (const e of errors) console.error(' ', e);
  process.exit(1);
}

console.log(`validate-content-source: OK (${files.length} files)`);
