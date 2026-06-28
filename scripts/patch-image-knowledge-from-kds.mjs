/**
 * Apply approved KDS/KCS bullets to image-knowledge §5·§6.
 * Usage: node scripts/patch-image-knowledge-from-kds.mjs [--dry-run]
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { KDS_PROMOTED_START, KDS_PROMOTED_END } from './lib/kds-promoted-markers.mjs';

export { KDS_PROMOTED_START, KDS_PROMOTED_END };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPROVED = join(ROOT, 'scripts', 'kds-figure-rules-approved.json');
const IK = join(ROOT, 'docs', 'image-knowledge');
const DRY = process.argv.includes('--dry-run');

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalize(s) {
  return s.replace(/\*\*/g, '').replace(/\s+/g, '').toLowerCase();
}

function sectionBounds(lines, sectionNum) {
  let start = -1;
  let end = lines.length;
  const hdr = new RegExp(`^## ${sectionNum}\\.`);
  for (let i = 0; i < lines.length; i++) {
    if (hdr.test(lines[i])) start = i;
    else if (start >= 0 && /^## \d+\./.test(lines[i])) {
      end = i;
      break;
    }
  }
  return { start, end };
}

function bulletsInSection(lines, start, end) {
  const out = [];
  for (let i = start + 1; i < end; i++) {
    const t = lines[i].trim();
    if (t.startsWith('- ')) out.push(t.slice(2));
  }
  return out;
}

function buildPromotedBlock(mustItems, forbidItems) {
  const lines = [
    KDS_PROMOTED_START,
    '### book PDF 승격 (KDS/KCS)',
    '',
    '> `npm run patch:image-knowledge-from-kds` · 정본: `scripts/kds-figure-rules-approved.json`',
    '',
  ];
  if (mustItems.length) {
    lines.push('**§5 추가 (승격):**', '');
    for (const { text, cite } of mustItems) {
      lines.push(`- ${text} — *${cite}*`);
    }
    lines.push('');
  }
  if (forbidItems.length) {
    lines.push('**§6 추가 (승격):**', '');
    for (const { text, cite } of forbidItems) {
      lines.push(`- ${text} — *${cite}*`);
    }
    lines.push('');
  }
  lines.push(KDS_PROMOTED_END);
  return lines.join('\n');
}

function injectPromoted(body, block) {
  const re = new RegExp(
    `\n*${escapeRe(KDS_PROMOTED_START)}[\\s\\S]*?${escapeRe(KDS_PROMOTED_END)}\n*`,
    'm'
  );
  body = body.replace(re, '\n');

  const sec5 = body.search(/^## 5\.\s/m);
  if (sec5 >= 0) {
    return body.slice(0, sec5) + block + '\n\n' + body.slice(sec5);
  }
  return body.trimEnd() + '\n\n' + block + '\n';
}

function appendBulletsToSection(body, sectionNum, newBullets) {
  const lines = body.split(/\r?\n/);
  const { start, end } = sectionBounds(lines, sectionNum);
  if (start < 0) return body;

  const existing = bulletsInSection(lines, start, end);
  const norms = new Set(existing.map(normalize));
  const toAdd = [];
  for (const b of newBullets) {
    if (norms.has(normalize(b.text))) continue;
    toAdd.push(`- ${b.text} — *${b.cite}*`);
    norms.add(normalize(b.text));
  }
  if (!toAdd.length) return body;

  const insertAt = end;
  lines.splice(insertAt, 0, ...toAdd);
  return lines.join('\n');
}

function main() {
  const { promotions } = JSON.parse(readFileSync(APPROVED, 'utf8'));
  const byTopic = new Map();

  for (const p of promotions) {
    if (!byTopic.has(p.topic)) byTopic.set(p.topic, { must: [], forbid: [] });
    byTopic.get(p.topic)[p.target === 'forbid' ? 'forbid' : 'must'].push(p);
  }

  let updated = 0;

  for (const [topic, groups] of byTopic) {
    const path = join(IK, topic);
    if (!existsSync(path)) {
      console.warn('skip missing', topic);
      continue;
    }

    let body = readFileSync(path, 'utf8');
    if (body.length < 500) {
      console.error('REFUSE truncated', topic, `(${body.length} chars)`);
      continue;
    }

    const before = body;
    body = appendBulletsToSection(body, 5, groups.must);
    body = appendBulletsToSection(body, 6, groups.forbid);
    body = injectPromoted(body, buildPromotedBlock(groups.must, groups.forbid));

    if (body !== before) {
      if (body.length < 500 || body.length < before.length * 0.5) {
        console.error('REFUSE shrink', topic, `${before.length} → ${body.length}`);
        continue;
      }
      if (!DRY) {
        atomicWriteUtf8(path, body);
        const verify = readFileSync(path, 'utf8');
        if (verify.length < 500) {
          console.error('REFUSE verify-fail', topic, `wrote ${body.length}, read ${verify.length}`);
          continue;
        }
      }
      updated += 1;
      console.log('kds-promote', topic, `+${groups.must.length} must`, `+${groups.forbid.length} forbid`);
    }
  }

  console.log(`patch-image-knowledge-from-kds: ${DRY ? 'dry-run ' : ''}updated ${updated} topics`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1].replace(/\\/g, '/');
if (isMain || process.argv[1]?.endsWith('patch-image-knowledge-from-kds.mjs')) {
  main();
}
