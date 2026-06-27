#!/usr/bin/env node
/**
 * RaiDrive git "short read" / empty 바이너리 일괄 복구·검증
 * 1) restore-empty-images — 0바이트 복구
 * 2) git hash-object 전수 검사
 *
 * Usage: npm run fix:git-binaries
 *        node scripts/fix-git-binaries.mjs [--check-only]
 */
import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const techDir = join(root, 'assets', 'images', 'technology');
const sourceDir = join(techDir, 'source');
const checkOnly = process.argv.includes('--check-only');

function listFiles(dir, extRe) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => extRe.test(f));
}

function gitHashCheck() {
  const failed = [];
  const rels = [];
  for (const f of listFiles(techDir, /\.webp$/i)) {
    rels.push(`assets/images/technology/${f}`);
  }
  for (const f of listFiles(sourceDir, /\.(webp|png)$/i)) {
    rels.push(`assets/images/technology/source/${f}`);
  }
  for (const rel of rels) {
    const r = spawnSync('git', ['hash-object', rel], { cwd: root, encoding: 'utf8' });
    if (r.status !== 0) {
      failed.push({ rel, err: (r.stderr || r.stdout || '').trim() });
    }
  }
  return failed;
}

console.log('\n── fix-git-binaries ──\n');

if (!checkOnly) {
  const restore = spawnSync('node', ['scripts/restore-empty-images.mjs'], {
    cwd: root,
    stdio: 'inherit',
  });
  if (restore.status !== 0) {
    console.error('\nrestore-empty-images failed — 일부 파일 수동 확인 필요\n');
  }
}

const failed = gitHashCheck();

if (failed.length) {
  console.error('\nGIT HASH FAIL', failed.length);
  for (const f of failed) console.error(' ', f.rel, f.err);
  process.exit(1);
}

console.log('\n✓ all binaries OK for git hash-object');
console.log('  next: git add -A -- .\n');
