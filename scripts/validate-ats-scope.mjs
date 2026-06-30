/**
 * ATS-SUB-01 — 지하공사 외 노드에서 자동광파기(ATS) 언급 금지 검증.
 * 정본: docs/206-자동광파기-지하공사-전용-표현-통합-적용-계획.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const STRICT = process.argv.includes('--strict');

/** @type {RegExp} */
const ATS_PATTERN = /자동\s*광파기|automated[- ]total[- ]station/i;

/** 노드별 ATS 언급 허용 (206 §4.1 + 터널 하위 전체) */
const ALLOW_PREFIXES = [
  'fields/tunnel',
  'fields/retaining-excavation/earth-retaining-wall',
  'fields/retaining-excavation/strut',
  'fields/retaining-excavation/anchor',
  'fields/retaining-excavation/surrounding-ground',
  'sensors/automated-total-station'
];

/** 명시 금지 노드 (인접건물·지상 분야) */
const DENY_EXACT = new Set([
  'fields/retaining-excavation/adjacent-building',
  'fields/bridge',
  'fields/building',
  'fields/slope',
  'fields/railway',
  'fields/structural-safety',
  'fields/dam',
  'fields/harbor',
  'fields/soft-ground',
  'fields/environmental-impact',
  'fields/foundation-pile',
  'sensors/gnss'
]);

function isAllowed(nodeId) {
  if (DENY_EXACT.has(nodeId)) return false;
  if (nodeId.startsWith('sensors/') && nodeId !== 'sensors/automated-total-station') return false;
  if (DENY_EXACT.has(nodeId.replace(/\/[^/]+$/, ''))) {
    const parent = nodeId.replace(/\/[^/]+$/, '');
    if (DENY_EXACT.has(parent)) return false;
  }
  if (nodeId.startsWith('fields/bridge/')) return false;
  if (nodeId.startsWith('fields/building/')) return false;
  if (nodeId.startsWith('fields/slope/')) return false;
  if (nodeId.startsWith('fields/railway/')) return false;
  if (nodeId.startsWith('fields/structural-safety/')) return false;
  if (nodeId.startsWith('fields/dam/')) return false;
  if (nodeId.startsWith('fields/harbor/')) return false;
  if (nodeId.startsWith('fields/soft-ground/')) return false;
  if (nodeId.startsWith('fields/environmental-impact/')) return false;
  if (nodeId.startsWith('fields/foundation-pile/')) return false;
  if (nodeId === 'fields/retaining-excavation') return false;
  if (nodeId === 'fields/retaining-excavation/adjacent-building') return false;
  return ALLOW_PREFIXES.some((p) => nodeId === p || nodeId.startsWith(`${p}/`));
}

/** @type {{ file: string, nodeId: string, line: number, text: string }[]} */
const violations = [];

function scanContentDataFile(filePath) {
  const rel = path.relative(ROOT, filePath);
  const src = fs.readFileSync(filePath, 'utf8');
  const nodeRe = /['"]([^'"]+)['"]\s*:\s*\{/g;
  let match;
  const starts = [];
  while ((match = nodeRe.exec(src)) !== null) {
    if (!match[1].includes('/')) continue;
    starts.push({ nodeId: match[1], index: match.index });
  }
  for (let i = 0; i < starts.length; i++) {
    const { nodeId, index } = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1].index : src.length;
    const block = src.slice(index, end);
    if (!ATS_PATTERN.test(block)) continue;
    if (isAllowed(nodeId)) continue;
    const linesBefore = src.slice(0, index).split(/\r?\n/).length;
    const blockLines = block.split(/\r?\n/);
    blockLines.forEach((line, li) => {
      if (!ATS_PATTERN.test(line)) return;
      violations.push({
        file: rel,
        nodeId,
        line: linesBefore + li,
        text: line.trim().slice(0, 140)
      });
    });
  }
}

const contentDir = path.join(ROOT, 'scripts', 'content-data');
for (const name of fs.readdirSync(contentDir)) {
  if (name.endsWith('.mjs')) scanContentDataFile(path.join(contentDir, name));
}

/** DOC-CANON-02 G2 — ImageWorks prompts on ATS-deny heroes */
const PROMPTS_DIR = path.join(
  ROOT,
  'ImageWorks',
  'NMTI_Engineering_Image_Prompt_Package_v1',
  'prompts'
);
const PROMPT_ATS_DENY = ['IMG-005', 'IMG-012', 'IMG-013', 'IMG-015', 'IMG-090', 'IMG-101'];

/** @param {string} line */
function isAtsNegativeContext(line) {
  return /금지|그리지\s*않|없음|NO\s|not\s|without|제외|생략|선택|inset|보조|optional|tiny inset|삭제|전면/i.test(
    line
  );
}

/** @param {string} text */
function extractPositivePromptProse(text) {
  /** @type {string[]} */
  const parts = [];

  const sec3 = text.match(/## 3\. 필수 포함\n([\s\S]*?)(?=\n## |\n<!-- |$)/);
  if (sec3) parts.push(sec3[1]);

  const rulesStart = text.indexOf('<!-- image-rules-sync:v1 -->');
  const rulesEnd = text.indexOf('<!-- /image-rules-sync:v1 -->');
  if (rulesStart !== -1 && rulesEnd !== -1) {
    const block = text.slice(rulesStart, rulesEnd);
    const req = block.match(
      /\*\*반드시 그릴 요소:\*\*([\s\S]*?)(?=\*\*절대 금지|\*\*[^*]+:\*\*|<!--|$)/i
    );
    if (req) parts.push(req[1]);
  }

  const codeMatch = text.match(/## 최종 생성 프롬프트[\s\S]*?\n\n```[\w]*\n([\s\S]*?)```/);
  if (codeMatch) {
    const positiveLines = codeMatch[1]
      .split('\n')
      .filter((line) => line.trim() && !isAtsNegativeContext(line));
    parts.push(positiveLines.join('\n'));
  }

  const finalBlock = text.match(/## 최종 생성 프롬프트[\s\S]*$/);
  if (finalBlock && !finalBlock[0].includes('```')) {
    const prose = finalBlock[0]
      .split('\n')
      .slice(1)
      .filter((line) => !line.startsWith('**Prefix:') && line.trim());
    parts.push(prose.join('\n'));
  }

  return parts.join('\n');
}

function scanPromptAtsDeny() {
  if (!fs.existsSync(PROMPTS_DIR)) return;
  for (const file of fs.readdirSync(PROMPTS_DIR)) {
    const imgMatch = file.match(/^(IMG-\d{3})_/);
    if (!imgMatch || !PROMPT_ATS_DENY.includes(imgMatch[1])) continue;
    const rel = path.relative(ROOT, path.join(PROMPTS_DIR, file));
    const text = fs.readFileSync(path.join(PROMPTS_DIR, file), 'utf8');
    const positive = extractPositivePromptProse(text);
    if (!ATS_PATTERN.test(positive)) continue;
    positive.split('\n').forEach((line, li) => {
      if (!ATS_PATTERN.test(line) || isAtsNegativeContext(line)) return;
      violations.push({
        file: rel,
        nodeId: imgMatch[1],
        line: li + 1,
        text: line.trim().slice(0, 140)
      });
    });
  }
}

scanPromptAtsDeny();

if (violations.length) {
  console.error(`ATS-SUB-01 검증 실패: ${violations.length}건 (지하공사 외 노드·prompt 금지 Figure에 ATS 언급)\n`);
  violations.forEach((v) => {
    console.error(`${v.file}:${v.line} [${v.nodeId}]`);
    console.error(`  ${v.text}\n`);
  });
  process.exit(STRICT ? 1 : 0);
}

console.log('ATS-SUB-01 검증 통과 (content-data · ImageWorks prompts)');
