/**
 * 재작도 프로그램 사전 점검 (redline·프롬프트·patch·handoff)
 * Usage: npm run rework:check
 */
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shell = process.platform === 'win32';

function runNpm(script, { fail = true } = {}) {
  const r = spawnSync('npm', ['run', script], { cwd: root, stdio: 'inherit', shell });
  if (fail && r.status !== 0) return false;
  return r.status === 0;
}

console.log('PNG 재작도 — 사전 점검 (rework:check)\n');

let ok = true;
ok = runNpm('validate:rework-redlines:strict') && ok;
ok = runNpm('validate:rework-prompts:strict') && ok;

console.log('');
runNpm('rework:patch-status', { fail: false });
console.log('');
runNpm('rework:handoff', { fail: false });

if (!ok) {
  console.error('\nFAIL — redline 또는 프롬프트 검증 실패');
  process.exit(1);
}

console.log('\nPASS — 제작 시작: npm run rework:next');
