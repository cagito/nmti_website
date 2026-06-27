/**
 * P1 — registry pillow 전건 wireframeReplace 노출 게이트 (P0 14종 제외 중복 스킵)
 * Usage: npm run patch:registry-pillow-wireframe
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { runLocked } from './lib/run-locked.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'scripts', 'image-review-registry.json');
const policyPath = join(root, 'scripts', 'figure-production-policy.json');
const NOTE =
  'Pillow 와이어프레임 교체 대기 — SPA 노출 차단(wireframeReplace) · docs/122 P1 · rework:done 후 해제';

runLocked('registry', 'patch-registry-pillow-wireframe', () => {
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
  const today = new Date().toISOString().slice(0, 10);

  let patched = 0;
  let policyPatched = 0;

  for (const [id, reg] of Object.entries(registry)) {
    if (reg.status === 'rejected' || reg.productionMethod !== 'pillow') continue;
    if (reg.wireframeReplace === true) continue;

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
      policyPatched++;
    }
  }

  atomicWriteUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  atomicWriteUtf8(policyPath, `${JSON.stringify(policy, null, 2)}\n`);
  console.log(
    `Patched ${patched} pillow entries (wireframeReplace) · policy targetMethod ${policyPatched}`,
  );
});
