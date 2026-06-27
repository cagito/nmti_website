/**
 * IMAGE_REVIEW_LOG.md 앵커·요약 테이블 생성.
 * Usage: node scripts/generate-image-review-log.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';
import { resolveNodeForImg } from './lib/img-node-map.mjs';
import { resolveSourcesForNode } from './lib/resolve-citations.mjs';
import { formatCiteShort } from './lib/format-cite-short.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');
const priority = JSON.parse(readFileSync(join(ROOT, 'scripts', 'image-review-priority.json'), 'utf8'));
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const master = JSON.parse(
  readFileSync(
    join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1', '03_IMAGE_MASTER_LIST.json'),
    'utf8'
  )
);

const lines = [
  '# 기술자료 이미지 검수 로그',
  '',
  '**표준:** [TECHNICAL_IMAGE_STANDARD.md](./TECHNICAL_IMAGE_STANDARD.md) · **체크리스트:** [IMAGE_AUDIT_CHECKLIST.md](./IMAGE_AUDIT_CHECKLIST.md)',
  '',
  '> `node scripts/generate-image-review-log.mjs`로 레지스트리와 동기화. 수동 검수 내용은 본문 섹션에 직접 보강.',
  '',
  '## 요약',
  '',
  '| ID | 등급 | status | 검수일 | P | cite (KDS/KCS) | requiresReaudit |',
  '|----|------|--------|--------|---|----------------|-----------------|'
];

for (const item of master) {
  const r = registry[item.id] || {};
  const nodeId = resolveNodeForImg(item.id, item.category);
  const cite = formatCiteShort(resolveSourcesForNode(nodeId).sources);
  lines.push(
    `| ${item.id} | ${r.reviewGrade || '—'} | ${r.status || '—'} | ${r.reviewDate || '—'} | ${r.auditPriority || '—'} | ${cite} | ${r.requiresReaudit ? '예' : '—'} |`
  );
}

lines.push('', '---', '', '## 검수 기록', '');

for (const item of master) {
  const id = item.id;
  const r = registry[id] || {};
  const nodeId = resolveNodeForImg(id, item.category);
  const cite = formatCiteShort(resolveSourcesForNode(nodeId).sources);
  lines.push(`<a id="${id}"></a>`, '', `### ${id} ${item.title}`, '');
  lines.push('| 항목 | 내용 |', '|------|------|');
  lines.push(`| 파일명 | \`${id}_*.png\` |`);
  lines.push(`| 사용 페이지 | dictionary \`imageId\` 참조 노드 (\`${nodeId}\`) |`);
  lines.push(`| KDS/KCS 근거 | ${cite} |`);
  lines.push(`| 관련 계측기 | ${item.category} |`);
  lines.push(`| 검수 등급 | **${r.reviewGrade || '—'}** |`);
  lines.push(`| status | ${r.status || 'pending'} |`);
  lines.push(`| 기술 오류 | ${r.notes || '—'} |`);
  lines.push(`| 설치 위치 오류 | — |`);
  lines.push(`| 방향 오류 | — |`);
  lines.push(`| 용어 오류 | — |`);
  lines.push(`| 수정 지시 | ${r.requiresReaudit ? 'INSTRUMENTATION_DRAWING_RULES 재검수' : '—'} |`);
  lines.push(`| 재생성 프롬프트 | [IMAGE_REGENERATION_PROMPTS.md](./IMAGE_REGENERATION_PROMPTS.md) |`);
  lines.push(`| 검수자 | ${r.reviewer || '—'} |`);
  lines.push(`| 검수일 | ${r.reviewDate || '—'} |`);
  if (r.prohibitedVerifiedNote) {
    lines.push(`| 금지 대조 | ${r.prohibitedVerifiedNote} |`);
  }
  if (r.prohibitedErrors?.length) {
    lines.push('', '**금지 오류 대조:**', '');
    for (const e of r.prohibitedErrors) lines.push(`- ${e}`);
  }
  lines.push('');
}

lines.push('## 변경 이력', '', '| 일자 | 내용 |', '|------|------|', '| 2026-06-25 | 레지스트리 기반 최초 생성 |', '| 2026-06-22 | Phase 5 Pillow v2 (025·027·030·031·034·035·062) · Phase 6 formal 001·002·004·005 |', '');

atomicWriteUtf8(join(ROOT, 'docs', 'IMAGE_REVIEW_LOG.md'), lines.join('\n'));
console.log('Wrote docs/IMAGE_REVIEW_LOG.md');
