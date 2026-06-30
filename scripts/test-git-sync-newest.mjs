#!/usr/bin/env node
/**
 * Integration smoke test: temp repo, local bare origin, newest-wins dry-run.
 */
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { join } from 'path';
import { tmpdir } from 'os';

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  return { ok: r.status === 0, out: (r.stdout || '') + (r.stderr || ''), status: r.status };
}

const base = mkdtempSync(join(tmpdir(), 'git-sync-test-'));
const bare = join(base, 'origin.git');
const work = join(base, 'work');
let failed = 0;

try {
  mkdirSync(bare, { recursive: true });
  run('git', ['init', '--bare', bare], base);
  run('git', ['clone', bare, work], base);
  run('git', ['config', 'user.email', 'test@test.local'], work);
  run('git', ['config', 'user.name', 'test'], work);
  writeFileSync(join(work, 'hello.txt'), 'remote-v1\n');
  run('git', ['add', 'hello.txt'], work);
  run('git', ['commit', '-m', 'init'], work);
  run('git', ['branch', '-M', 'main'], work);
  run('git', ['push', '-u', 'origin', 'main'], work);

  writeFileSync(join(work, 'hello.txt'), 'local-newer\n');
  const syncScript = join(process.cwd(), 'scripts', 'git-sync-newest.mjs');
  const dry = run(
    'node',
    [syncScript, '--root', work, '--dry-run', '--no-push'],
    process.cwd()
  );
  if (!dry.ok) {
    console.error('dry-run failed:', dry.out);
    failed++;
  } else if (!dry.out.includes('keep local hello.txt') && !dry.out.includes('candidate paths')) {
    console.error('expected sync activity:', dry.out);
    failed++;
  } else {
    console.log('integration dry-run OK');
  }

  const lastRun = join(work, '.git-sync-last-run.json');
  if (!readFileSync(lastRun, 'utf8').includes('hello.txt')) {
    console.error('last-run missing hello.txt');
    failed++;
  }
} catch (e) {
  console.error('integration error:', e.message);
  failed++;
} finally {
  try {
    rmSync(base, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

if (failed) {
  console.error(`test-git-sync-newest: ${failed} failure(s)`);
  process.exit(1);
}
console.log('test-git-sync-newest: OK');
process.exit(0);
