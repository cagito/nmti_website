/**
 * Scaffold pixel-gate skeleton for stub redlines (§13-only or empty).
 * Usage: node scripts/scaffold-redline-stubs.mjs [--force]
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { REDLINE_CANONICAL, REDLINES_DIR } from './lib/rework-phases.mjs';
import {
  REDLINE_IK_START,
  REDLINE_IK_END,
  IK_ROOT,
  topicForImgId,
  extractSection13Checklist,
  escapeRe,
} from './lib/image-knowledge-map.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FORCE = process.argv.includes('--force');
const MIN_BODY = 2000;
const PKG = join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1');

export const SCAFFOLD_START = '<!-- redline-scaffold:v1 -->';
export const SCAFFOLD_END = '<!-- /redline-scaffold:v1 -->';

const MASTER = JSON.parse(
  readFileSync(join(PKG, '03_IMAGE_MASTER_LIST.json'), 'utf8')
);

function extractBullets(topicText, sectionNum, limit = 5) {
  const re = new RegExp(
    `## ${sectionNum}\\. [^\r\n]+\r?\n\r?\n([\\s\\S]*?)(?=\r?\n## |$)`
  );
  const m = topicText.match(re);
  if (!m) return [];
  const section = m[1].replace(
    /<!-- kds-promoted:v1 -->[\s\S]*?<!-- \/kds-promoted:v1 -->/g,
    ''
  );
  return section
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.replace(/^- /, '').replace(/\*\*/g, ''))
    .slice(0, limit);
}

function shorten(s, max = 72) {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function isStub(raw) {
  const withoutComments = raw.replace(/<!--[\s\S]*?-->/g, '').trim();
  const withoutIk = withoutComments.replace(
    /## image-knowledge §13[\s\S]*$/m,
    ''
  ).trim();
  const hasPixelGate = /##\s*[01]\./.test(raw);
  return !hasPixelGate || withoutIk.length < MIN_BODY;
}

function buildScaffold(imgId, title, topicFile, must, forbid) {
  const topicLabel = topicFile.replace(/\.md$/, '').replace(/^\d+-/, '');
  const entry = MASTER.find((e) => e.id === imgId);
  const prompt = entry?.prompt_file || '—';
  const rows = [];
  let n = 1;
  for (const m of must) {
    rows.push(`| Q${n} | ${shorten(m)} | ☐ | |`);
    n += 1;
  }
  for (const f of forbid) {
    rows.push(`| Q${n} | ${shorten(f)} (금지) | ☐ | |`);
    n += 1;
  }

  return [
    SCAFFOLD_START,
    `# ${imgId} redline — ${title} (외부 PNG)`,
    '',
    `> **image-knowledge:** [\`${topicLabel}\`](../../../docs/image-knowledge/${topicFile})`,
    `> **prompt:** \`${prompt}\` · **scaffold:** \`npm run scaffold:redline-stubs\``,
    '',
    '## 0. 레이아웃',
    '',
    '- 16:9 · **1920×1080** · 흰 배경 · 한글 라벨',
    '- Pillow·에이전트 SVG **금지** — 외부 AI/CAD + 육안 PASS',
    '',
    '## 1. 강제 지시문 (image-knowledge §5·§6)',
    '',
    '| # | 검수 | PASS | FAIL |',
    '|---|------|------|------|',
    ...rows,
    '',
    SCAFFOLD_END,
  ].join('\n');
}

function injectScaffold(body, scaffold, ikBlock) {
  const scRe = new RegExp(
    `${escapeRe(SCAFFOLD_START)}[\\s\\S]*?${escapeRe(SCAFFOLD_END)}`,
    'm'
  );
  let core = body;
  if (scRe.test(core)) {
    if (!FORCE) return null;
    core = core.replace(scRe, '').trim();
  }

  if (ikBlock) {
    const ikRe = new RegExp(
      `${escapeRe(REDLINE_IK_START)}[\\s\\S]*?${escapeRe(REDLINE_IK_END)}`,
      'm'
    );
    const m = core.match(ikRe);
    if (m) {
      core = core.replace(ikRe, '').trim();
      return `${scaffold}\n\n${m[0]}\n\n## 서명\n\n| 항목 | 값 |\n|------|-----|\n| 검수자 | |\n| 일자 | |\n| 등급 | PASS / REGENERATE |\n`;
    }
  }

  return `${scaffold}\n\n${ikBlock || ''}\n\n## 서명\n\n| 항목 | 값 |\n|------|-----|\n| 검수자 | |\n| 일자 | |\n| 등급 | PASS / REGENERATE |\n`;
}

let updated = 0;
let skipped = 0;

for (const [imgId, file] of Object.entries(REDLINE_CANONICAL)) {
  const path = join(REDLINES_DIR, file);
  if (!existsSync(path)) {
    skipped += 1;
    continue;
  }

  const raw = readFileSync(path, 'utf8');
  if (!isStub(raw)) {
    skipped += 1;
    continue;
  }

  const topicFile = topicForImgId(imgId);
  if (!topicFile || !existsSync(join(IK_ROOT, topicFile))) {
    console.warn('skip', imgId, '(no topic)');
    skipped += 1;
    continue;
  }

  const topicText = readFileSync(join(IK_ROOT, topicFile), 'utf8');
  const must = extractBullets(topicText, 5, 5);
  const forbid = extractBullets(topicText, 6, 3);
  const entry = MASTER.find((e) => e.id === imgId);
  const title = entry?.title || imgId;

  const ikRe = new RegExp(
    `${escapeRe(REDLINE_IK_START)}[\\s\\S]*?${escapeRe(REDLINE_IK_END)}`,
    'm'
  );
  let ikBlock = raw.match(ikRe)?.[0];
  if (!ikBlock) {
    const items = extractSection13Checklist(topicText);
    ikBlock = [
      REDLINE_IK_START,
      '## image-knowledge §13 (book 실행 규칙)',
      '',
      `> **정본:** [\`${topicFile.replace(/\.md$/, '').replace(/^\d+-/, '')}\`](../../../docs/image-knowledge/${topicFile})`,
      '',
      '**육안 검수 — image-knowledge §13과 1:1:**',
      '',
      ...items.map((i) => `- [ ] ${i}`),
      REDLINE_IK_END,
    ].join('\n');
  }

  const scaffold = buildScaffold(imgId, title, topicFile, must, forbid);
  const next = injectScaffold(raw, scaffold, ikBlock);
  if (!next || next === raw) {
    skipped += 1;
    continue;
  }

  writeFileSync(path, next, 'utf8');
  updated += 1;
  console.log('scaffold', imgId, file);
}

console.log(`scaffold-redline-stubs: updated ${updated}, skipped ${skipped}`);
