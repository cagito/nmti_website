/**
 * P0 와이어프레임 14종 — wireframeReplace 노출 게이트 + policy targetMethod
 * Usage: npm run patch:registry-p0-wireframe
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';
import { P0_WIREFRAME_IDS } from './lib/rework-phases.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');
const policyPath = join(root, 'scripts', 'figure-production-policy.json');
const NOTE =
  'P0 와이어프레임 교체 대기 — SPA 노출 차단(wireframeReplace) · docs/122 · rework:done 후 해제';

runLocked('registry', 'patch-registry-p0-wireframe', () => {
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
  const today = new Date().toISOString().slice(0, 10);

  let patched = 0;
  for (const id of P0_WIREFRAME_IDS) {
    const reg = registry[id];
    if (!reg) {
      console.error('Missing registry', id);
      process.exit(1);
    }
    reg.wireframeReplace = true;
    reg.wireframeReplaceDate = today;
    if (!reg.notes?.includes('wireframeReplace')) {
      reg.notes = reg.notes ? `${reg.notes} · ${NOTE}` : NOTE;
    }
    patched++;

    const fig = policy.figures?.[id];
    if (fig && fig.targetMethod === 'pillow') {
      fig.targetMethod = 'ai-reviewed';
      policy.figures[id] = fig;
    }
  }

  atomicWriteUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  atomicWriteUtf8(policyPath, `${JSON.stringify(policy, null, 2)}\n`);
  console.log(`Patched ${patched} P0 wireframe entries (wireframeReplace + policy targetMethod)`);
});
