#!/usr/bin/env node
/**
 * 0바이트·손상 WebP/PNG 복구 (RaiDrive short-read 대응)
 * Usage: node scripts/restore-empty-images.mjs [--dry-run]
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  statSync,
  unlinkSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const techDir = join(root, 'assets', 'images', 'technology');
const sourceDir = join(techDir, 'source');
const dryRun = process.argv.includes('--dry-run');

function list(dir, re) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => re.test(f));
}

function fileSize(path) {
  try {
    return statSync(path).size;
  } catch {
    return -1;
  }
}

function idOf(name) {
  return name.match(/^(IMG-\d{3})/)?.[1] || null;
}

function isValidWebp(path) {
  if (fileSize(path) <= 12) return false;
  try {
    return readFileSync(path).slice(8, 12).toString('ascii') === 'WEBP';
  } catch {
    return false;
  }
}

function runPy(code) {
  if (dryRun) return { ok: true, out: 'dry-run' };
  const r = spawnSync('python', ['-c', code], { cwd: root, encoding: 'utf8' });
  return { ok: r.status === 0, out: (r.stdout || r.stderr || '').trim() };
}

function pngToWebp(src, dst) {
  return runPy(
    `from PIL import Image; from pathlib import Path; s=Path(${JSON.stringify(src)}); d=Path(${JSON.stringify(dst)}); Image.open(s).convert('RGB').save(d,'WEBP',quality=85); print(d.stat().st_size)`,
  );
}

function webpToPng(src, dst) {
  return runPy(
    `from PIL import Image; from pathlib import Path; s=Path(${JSON.stringify(src)}); d=Path(${JSON.stringify(dst)}); Image.open(s).convert('RGB').save(d,'PNG'); print(d.stat().st_size)`,
  );
}

function gitRestore(rel) {
  if (dryRun) return true;
  spawnSync('git', ['checkout', 'HEAD', '--', rel], { cwd: root, stdio: 'pipe' });
  return fileSize(join(root, rel)) > 0;
}

function gitRestoreOld(rel) {
  const r = spawnSync('git', ['rev-list', '-n', '1', 'HEAD', '--', rel], {
    cwd: root,
    encoding: 'utf8',
  });
  const rev = r.stdout?.trim();
  if (!rev) return false;
  if (dryRun) return true;
  spawnSync('git', ['checkout', rev, '--', rel], { cwd: root, stdio: 'pipe' });
  return fileSize(join(root, rel)) > 0;
}

const fixed = [];
let unrestored = 0;

console.log('\n── restore-empty-images ──\n');

for (const png of list(sourceDir, /^IMG-\d{3}_.+\.png$/i)) {
  const path = join(sourceDir, png);
  if (fileSize(path) > 0) continue;
  const id = idOf(png);
  const extPath = join(sourceDir, `${id}_external.png`);
  if (existsSync(extPath) && fileSize(extPath) > 0) {
    if (!dryRun) writeFileSync(path, readFileSync(extPath));
    console.log('source ← external:', png);
    fixed.push(path);
    continue;
  }
  const webp = list(techDir, new RegExp(`^${id}_.+\\.webp$`, 'i')).find((w) =>
    isValidWebp(join(techDir, w)),
  );
  if (webp) {
    const r = webpToPng(join(techDir, webp), path);
    if (r.ok) {
      console.log('source ← webp:', png, r.out);
      fixed.push(path);
      continue;
    }
  }
  if (gitRestore(`assets/images/technology/source/${png}`)) {
    console.log('source ← git HEAD:', png);
    fixed.push(path);
  }
}

for (const webp of list(techDir, /^IMG-\d{3}_.+\.webp$/i)) {
  const path = join(techDir, webp);
  if (isValidWebp(path)) continue;
  const id = idOf(webp);
  const srcPng = list(sourceDir, new RegExp(`^${id}_.+\\.png$`, 'i')).find(
    (f) => fileSize(join(sourceDir, f)) > 0,
  );
  if (srcPng) {
    const r = pngToWebp(join(sourceDir, srcPng), path);
    if (r.ok) {
      console.log('webp ← source:', webp, r.out);
      fixed.push(path);
      continue;
    }
  }
  const rel = `assets/images/technology/${webp}`;
  if (gitRestoreOld(rel) || gitRestore(rel)) {
    if (isValidWebp(path)) {
      console.log('webp ← git:', webp);
      fixed.push(path);
      continue;
    }
  }
  console.error('UNRESTORED:', webp);
  unrestored++;
}

for (const png of list(techDir, /^IMG-\d{3}_.+\.png$/i)) {
  if (dryRun) {
    console.log('[dry-run] delete root png', png);
  } else {
    try {
      unlinkSync(join(techDir, png));
      console.log('deleted root png', png);
    } catch {
      /* ignore */
    }
  }
}

console.log(`\nfixed ${fixed.length} · unrestored ${unrestored}${dryRun ? ' (dry-run)' : ''}\n`);
process.exit(unrestored ? 1 : 0);
