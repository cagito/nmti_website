/**
 * Inject image-knowledge §5·§6 into ImageWorks prompts as ## 실행 규칙.
 * Usage: node scripts/sync-prompt-image-rules.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1');
const IK = join(ROOT, 'docs', 'image-knowledge');
const MAP = JSON.parse(readFileSync(join(ROOT, 'scripts', 'img-image-knowledge-map.json'), 'utf8'));

export const RULES_SYNC_START = '<!-- image-rules-sync:v1 -->';
export const RULES_SYNC_END = '<!-- /image-rules-sync:v1 -->';

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractBullets(text, sectionNum) {
  const re = new RegExp(
    `## ${sectionNum}\\. [^\r\n]+\r?\n\r?\n([\\s\\S]*?)(?=\r?\n## |$)`
  );
  const m = text.match(re);
  if (!m) return [];
  const section = m[1].replace(
    /<!-- kds-promoted:v1 -->[\s\S]*?<!-- \/kds-promoted:v1 -->/g,
    ''
  );
  return section
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.replace(/^- /, ''));
}

function buildRulesBlock(topicFile) {
  const path = join(IK, topicFile);
  if (!existsSync(path)) return null;
  const text = readFileSync(path, 'utf8');
  const must = extractBullets(text, 5);
  const forbid = extractBullets(text, 6);
  if (!must.length && !forbid.length) return null;

  const lines = [
    '## 실행 규칙',
    '',
    `> **book/image-knowledge:** \`docs/image-knowledge/${topicFile}\` · §5·§6`,
    ''
  ];
  if (must.length) {
    lines.push('**반드시 그릴 요소:**');
    for (const b of must) lines.push(`- ${b}`);
    lines.push('');
  }
  if (forbid.length) {
    lines.push('**절대 금지:**');
    for (const b of forbid) lines.push(`- ${b}`);
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

function injectRulesBlock(body, blockInner) {
  const wrapped = `${RULES_SYNC_START}\n${blockInner}\n${RULES_SYNC_END}`;
  const re = new RegExp(
    `${escapeRe(RULES_SYNC_START)}[\\s\\S]*?${escapeRe(RULES_SYNC_END)}`,
    'm'
  );
  if (re.test(body)) return body.replace(re, wrapped);

  const afterCitation = body.indexOf('<!-- /citation-sync:v1 -->');
  if (afterCitation >= 0) {
    const insertAt = afterCitation + '<!-- /citation-sync:v1 -->'.length;
    return body.slice(0, insertAt) + '\n\n' + wrapped + '\n' + body.slice(insertAt);
  }
  const sec4 = body.search(/^## 4\.\s/m);
  if (sec4 >= 0) {
    return body.slice(0, sec4) + wrapped + '\n\n' + body.slice(sec4);
  }
  return body.trimEnd() + '\n\n' + wrapped + '\n';
}

let updated = 0;
let skipped = 0;

const master = JSON.parse(
  readFileSync(join(PKG, '03_IMAGE_MASTER_LIST.json'), 'utf8')
);

function topicFromEntry(entry) {
  if (typeof entry === 'string') return entry;
  return entry?.topic || null;
}

for (const [imgId, mapEntry] of Object.entries(MAP.map)) {
  const topicFile = topicFromEntry(mapEntry);
  if (!topicFile) continue;
  const entry = master.find((e) => e.id === imgId);
  const rel = entry?.prompt_file;
  if (!rel) continue;
  const target = join(PKG, ...rel.split('/'));
  if (!existsSync(target)) continue;

  const block = buildRulesBlock(topicFile);
  if (!block) {
    skipped += 1;
    continue;
  }

  const body = readFileSync(target, 'utf8');
  if (!body.trim()) continue;
  const next = injectRulesBlock(body, block);
  if (next !== body) {
    writeFileSync(target, next, 'utf8');
    updated += 1;
    console.log('rules', imgId, '←', topicFile);
  } else skipped += 1;
}

console.log(`sync-prompt-image-rules: updated ${updated}, skipped ${skipped}`);
