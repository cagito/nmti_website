/**
 * KCS/KDS citation coverage audit.
 * Registry: book/kds-kcs-citation-registry.json
 * Built content: js/technology/content-data.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRegistry, resolveSourcesForNode } from './lib/resolve-citations.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT_PATH = path.join(ROOT, 'js', 'technology', 'content-data.js');
const REPORT_MD = path.join(ROOT, 'docs', 'citation-coverage-report.md');
const REPORT_JSON = path.join(ROOT, 'docs', 'citation-coverage-report.json');

const STRICT = process.argv.includes('--strict');
const STRONG_CLAIM = /(?:법정\s*의무|KDS에\s*따라\s*필수|반드시\s*설치)/;

/** @type {{ file: string, line: number, message: string, severity: string }[]} */
const issues = [];

function extractContentKeys() {
  const src = fs.readFileSync(CONTENT_PATH, 'utf8');
  const match = src.match(/const CONTENT = (\{[\s\S]*?\n\});/);
  if (!match) throw new Error('CONTENT block not found in content-data.js — run npm run build:content');
  const content = Function(`"use strict"; return (${match[1]});`)();
  return content;
}

function scanStrongClaims() {
  const dirs = [
    path.join(ROOT, 'scripts', 'content-data'),
    path.join(ROOT, 'js', 'technology')
  ];
  for (const dir of dirs) {
    if (!dir.endsWith('technology') && !fs.existsSync(dir)) continue;
    const files =
      dir.endsWith('technology')
        ? [path.join(dir, 'content-data.js')]
        : fs.readdirSync(dir).filter((f) => f.endsWith('.mjs')).map((f) => path.join(dir, f));
    for (const file of files) {
      const rel = path.relative(ROOT, file);
      const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, i) => {
        if (!STRONG_CLAIM.test(line)) return;
        const nodeMatch = rel.includes('content-data') ? null : null;
        issues.push({
          file: rel,
          line: i + 1,
          message: '강한 표현(필수·법정 의무) — 등급 A/B 출처 대조 권장',
          severity: 'warn'
        });
      });
    }
  }
}

function scanPromptCitations() {
  const promptDir = path.join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1', 'prompts');
  let missing = 0;
  if (!fs.existsSync(promptDir)) return 0;
  for (const name of fs.readdirSync(promptDir)) {
    if (!name.endsWith('.md')) continue;
    const body = fs.readFileSync(path.join(promptDir, name), 'utf8');
    if (!body.includes('<!-- citation-sync:v1 -->')) {
      missing += 1;
      issues.push({
        file: `prompts/${name}`,
        line: 0,
        message: '근거 기준 블록 없음 — npm run sync:prompt-citations',
        severity: 'error'
      });
    }
  }
  return missing;
}

const content = extractContentKeys();
const reg = getRegistry();
const nodeIds = Object.keys(content);

let missingSources = 0;
let emptySources = 0;
let registryOrphans = 0;

for (const nodeId of nodeIds) {
  const entry = content[nodeId];
  const html = entry.sections?.sources || '';
  if (!html) {
    missingSources += 1;
    issues.push({
      file: `content:${nodeId}`,
      line: 0,
      message: 'sections.sources HTML 누락',
      severity: STRICT ? 'error' : 'warn'
    });
    continue;
  }
  if (!html.includes('tech-sources')) {
    emptySources += 1;
    issues.push({
      file: `content:${nodeId}`,
      line: 0,
      message: 'sections.sources 형식 오류',
      severity: 'error'
    });
  }
  const baked = entry.standardSources || [];
  const resolved = resolveSourcesForNode(nodeId).sources;
  if (baked.length === 0) {
    issues.push({
      file: `content:${nodeId}`,
      line: 0,
      message: 'standardSources 배열 비어 있음',
      severity: 'warn'
    });
  }
  if (baked.length !== resolved.length) {
    issues.push({
      file: `content:${nodeId}`,
      line: 0,
      message: `standardSources(${baked.length}) ≠ registry(${resolved.length}) — build:content 재실행`,
      severity: 'warn'
    });
  }
}

const registryNodeIds = new Set([
  'intro',
  ...Object.keys(reg.categories || {}),
  ...Object.keys(reg.nodes || {})
]);
for (const nodeId of nodeIds) {
  if (nodeId === 'intro') continue;
  const parts = nodeId.split('/');
  const fieldParent = parts[0] === 'fields' && parts.length >= 3 ? `${parts[0]}/${parts[1]}` : null;
  const hasMapping =
    registryNodeIds.has(nodeId) ||
    (fieldParent && reg.categories?.[fieldParent]) ||
    (reg.prefixDefaults || []).some((p) => nodeId.startsWith(p.prefix));
  if (!hasMapping) {
    registryOrphans += 1;
    issues.push({
      file: `registry:${nodeId}`,
      line: 0,
      message: '레지스트리 매핑 없음 — categories·nodes·prefixDefaults 추가 권장',
      severity: 'warn'
    });
  }
}

scanStrongClaims();
const promptMissing = scanPromptCitations();

const errors = issues.filter((i) => i.severity === 'error');
const warnings = issues.filter((i) => i.severity === 'warn');

const summary = {
  generatedAt: new Date().toISOString(),
  nodes: nodeIds.length,
  missingSources,
  emptySources,
  registryOrphans,
  promptMissing,
  errors: errors.length,
  warnings: warnings.length,
  issues
};

fs.writeFileSync(REPORT_JSON, JSON.stringify(summary, null, 2), 'utf8');

const md = [
  '# KCS/KDS 출처 커버리지 보고서',
  '',
  `생성: ${summary.generatedAt}`,
  '',
  '| 항목 | 값 |',
  '|------|-----|',
  `| 콘텐츠 노드 | ${summary.nodes} |`,
  `| sources 누락 | ${missingSources} |`,
  `| 레지스트리 미매핑 | ${registryOrphans} |`,
  `| 프롬프트 미동기화 | ${promptMissing} |`,
  `| errors | ${errors.length} |`,
  `| warnings | ${warnings.length} |`,
  '',
  errors.length || warnings.length
    ? '## 이슈\n\n' +
      [...errors, ...warnings]
        .map((i) => `- **${i.severity.toUpperCase()}** \`${i.file}\`${i.line ? `:${i.line}` : ''} — ${i.message}`)
        .join('\n')
    : '## 이슈\n\n없음 — PASS',
  ''
].join('\n');

fs.writeFileSync(REPORT_MD, md, 'utf8');
console.log(`Wrote ${path.relative(ROOT, REPORT_MD)}`);
console.log(`Wrote ${path.relative(ROOT, REPORT_JSON)}`);
console.log(
  `validate-citations: nodes ${nodeIds.length}, errors ${errors.length}, warnings ${warnings.length}${STRICT ? ' (strict)' : ''}`
);

if (errors.length) {
  process.exit(1);
}
console.log('OK   validate-citations');
