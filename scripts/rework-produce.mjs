#!/usr/bin/env node
/**
 * Figure 1건 외부 제작 핸드오프 — prompt + redline + 등록 명령을 한 폴더에
 * Usage:
 *   npm run rework:produce -- --id IMG-002
 *   npm run rework:produce-next              # hero 큐 1순위
 *   npm run rework:produce-next -- --limit 3 # W1 3건
 */
import { mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import {
  REWORK_ROOT,
  REDLINE_CANONICAL,
  REDLINE_SUPPLEMENT,
  PHASES,
} from './lib/rework-phases.mjs';
import { getQuickstart } from './lib/rework-quickstarts.mjs';
import { hasSourceAsset } from './lib/rework-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(
  readFileSync(join(root, 'scripts', 'image-review-registry.json'), 'utf8'),
);
const canonical = JSON.parse(
  readFileSync(join(root, 'scripts', 'canonical-image-webp.json'), 'utf8'),
);

const idArg = (() => {
  const i = process.argv.indexOf('--id');
  if (i >= 0) return process.argv[i + 1]?.toUpperCase();
  return process.argv.find((a) => /^IMG-\d{3}$/i.test(a))?.toUpperCase() || null;
})();
const produceNext = process.argv.includes('--produce-next') || process.argv.includes('--next');
const limitArg = (() => {
  const i = process.argv.indexOf('--limit');
  if (i >= 0) return parseInt(process.argv[i + 1], 10) || 1;
  const bare = process.argv.slice(2).find((a) => /^\d+$/.test(a));
  return bare ? parseInt(bare, 10) : 1;
})();

function phaseFor(id) {
  return PHASES.find((p) => p.ids.includes(id));
}

function queueIds(heroOnly = true) {
  const r = spawnSync(
    'node',
    ['scripts/list-production-queue.mjs', '--json', ...(heroOnly ? ['--hero-only'] : [])],
    { cwd: root, encoding: 'utf8', shell: false },
  );
  if (r.status !== 0) return [];
  return JSON.parse(r.stdout).queue.filter((q) => !q.hasSource).map((q) => q.id);
}

function produceOne(id) {
  const reg = registry[id];
  if (!reg) {
    console.error(`registry 없음: ${id}`);
    return false;
  }

  const png = canonical[id] || `${id}_external.png`;
  const webp = png.replace(/\.png$/i, '.webp');
  const phase = phaseFor(id);
  const src = hasSourceAsset(id);
  const outDir = join(REWORK_ROOT, 'exports', 'produce', id);
  mkdirSync(outDir, { recursive: true });

  const promptPath = join(outDir, 'prompt.txt');
  const pr = spawnSync('node', ['scripts/rework-prompt.mjs', '--id', id, '--out', promptPath], {
    cwd: root,
    stdio: 'pipe',
    shell: false,
  });
  if (pr.status !== 0) {
    console.error(`FAIL ${id}: prompt export`);
    return false;
  }

  const redlines = [];
  for (const rl of [REDLINE_CANONICAL[id], REDLINE_SUPPLEMENT[id]].filter(Boolean)) {
    const rlSrc = join(
      REWORK_ROOT,
      'ImageWorks',
      'NMTI_Engineering_Image_Prompt_Package_v1',
      'redlines',
      rl,
    );
    if (existsSync(rlSrc)) {
      copyFileSync(rlSrc, join(outDir, rl));
      redlines.push(rl);
    }
  }

  const lines = [
    `# ${id} — ${reg.title || id}`,
    '',
    '## 상태',
    '',
    `- phase: ${phase ? `${phase.week} / ${phase.phase}` : '—'}`,
    `- hero: ${reg.hero ? 'Y' : 'n'}`,
    `- requiresReaudit: ${reg.requiresReaudit === true}`,
    `- source 자산: ${src.ok ? '있음 — 등록 가능' : '없음 — 신규 제작 필요'}`,
    `- 퀵스타트: ${getQuickstart(id)}`,
    '',
    '## 제작 규칙',
    '',
    '- **금지:** Cursor/Pillow/SVG FT-A 단면 Figure',
    '- **허용:** 외부 AI/CAD + redline 육안 PASS',
    '- **해상도:** hero ≥ 1920×1080',
    '- **FAIL = 폐기·재생성** (부분 수정 금지)',
    '',
    '## 파일 (이 폴더)',
    '',
    '- `prompt.txt` — AI/CAD에 붙여넣기',
    ...redlines.map((r) => `- \`${r}\` — 검수 redline`),
    '',
    '## 저장 경로',
    '',
    '```',
    `assets/images/technology/source/${webp}`,
    '```',
    '',
    '## 등록 (redline PASS 후)',
    '',
    '```powershell',
    `cd X:\\website\\homepage`,
    `npm run rework:preflight -- --id ${id}`,
    `npm run rework:done -- --id ${id} --input assets/images/technology/source/${webp} --reviewer "검수자"`,
    '```',
    '',
  ];

  if (phase?.sign) {
    lines.push(`Phase 서명: \`npm run ${phase.sign} -- --id ${id}\` (또는 phase 일괄)`);
    lines.push('');
  }

  writeFileSync(join(outDir, 'HANDOFF.md'), lines.join('\n'), 'utf8');
  console.log(`✓ ${id} → exports/produce/${id}/`);
  return true;
}

let ids = [];
if (idArg) {
  ids = [idArg];
} else if (produceNext || !idArg) {
  ids = queueIds(true).slice(0, limitArg);
  if (!ids.length) {
    console.log('제작 대기 hero 없음 (source 미등록 reaudit 0건)');
    process.exit(0);
  }
}

if (!ids.length) {
  console.error('Usage: rework:produce -- --id IMG-### | rework:produce-next [--limit N]');
  process.exit(1);
}

let ok = 0;
for (const id of ids) {
  if (produceOne(id)) ok++;
}

console.log(`\n${ok}/${ids.length} handoff → exports/produce/`);
if (ids[0] === 'IMG-002') {
  console.log('Codex/AI: exports/produce/IMG-002/ 폴더 업로드 → prompt.txt + redline 검수');
}
process.exit(ok === ids.length ? 0 : 1);
