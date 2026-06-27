#!/usr/bin/env node
/**
 * RaiDrive 등 네트워크 드라이브에서 git "short read" / mmap 오류 시
 * 파일을 메모리로 전량 읽어 동일 경로에 다시 씁니다.
 *
 * Usage: node scripts/refresh-binary-for-git.mjs <file> [file...]
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/refresh-binary-for-git.mjs <file> [file...]');
  process.exit(1);
}

for (const f of files) {
  const path = resolve(f);
  if (!existsSync(path)) {
    console.error('MISSING:', path);
    process.exit(1);
  }
  const buf = readFileSync(path);
  writeFileSync(path, buf);
  console.log('refreshed', path, buf.length, 'bytes');
}
