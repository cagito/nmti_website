/**
 * Inject WATERMARK-01 (no logo in generation) block into ImageWorks prompts.
 * Usage: node scripts/sync-prompt-watermark.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROMPTS = join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1', 'prompts');

export const WATERMARK_SYNC_START = '<!-- watermark-sync:v1 -->';
export const WATERMARK_SYNC_END = '<!-- /watermark-sync:v1 -->';

const BLOCK = `${WATERMARK_SYNC_START}
> **WATERMARK-01 (생성 금지):** NMTI 로고·워터마크·브랜드 마크·유사 로고·흰색 로고 박스를 **GenerateImage·AI·CAD 생성 단계에 넣지 않는다.** 출판용 워터마크는 \`watermark-figures.bat\` · \`npm run watermark:figures\` (\`scripts/apply-figure-watermark.py\`)로 **등록·배포 전 일괄 후처리**만 한다. 정본: [docs/183](../../../docs/183-이미지-생성-워터마크-금지-정본.md)
${WATERMARK_SYNC_END}`;

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function inject(body) {
  const re = new RegExp(
    `${escapeRe(WATERMARK_SYNC_START)}[\\s\\S]*?${escapeRe(WATERMARK_SYNC_END)}`,
    'm'
  );
  if (re.test(body)) return body.replace(re, BLOCK);

  const afterIk = body.indexOf('<!-- /image-knowledge-links:v1 -->');
  if (afterIk >= 0) {
    const insertAt = afterIk + '<!-- /image-knowledge-links:v1 -->'.length;
    return body.slice(0, insertAt) + '\n\n' + BLOCK + '\n' + body.slice(insertAt);
  }
  return BLOCK + '\n\n' + body;
}

let updated = 0;
for (const name of readdirSync(PROMPTS).filter((f) => f.endsWith('.md')).sort()) {
  const path = join(PROMPTS, name);
  const body = readFileSync(path, 'utf8');
  const next = inject(body);
  if (next !== body) {
    writeFileSync(path, next, 'utf8');
    updated += 1;
    console.log('watermark', name);
  }
}

console.log(`sync-prompt-watermark: updated ${updated} prompts`);
