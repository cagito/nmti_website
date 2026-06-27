/**
 * PNG 재작도 Figure → 복붙 프롬프트 소스 인덱스
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT } from './rework-phases.mjs';

const PROMPTS_DIR = join(
  REWORK_ROOT,
  'ImageWorks',
  'NMTI_Engineering_Image_Prompt_Package_v1',
  'prompts',
);

/** 통합 블록이 별도 정본 doc에 있는 W1·Phase B 예외 */
export const PROMPT_SPECIAL = {
  'IMG-002': {
    file: 'docs/52-IMG-002-전면재작성-프롬프트-정본.md',
    heading: '## 12. AI 복붙용 통합 블록',
  },
  'IMG-096': {
    file: 'docs/57-IMG-096-가시설-주변지반-계측-표현-표준.md',
    heading: '## 8.1 AI 복붙용 통합 블록',
  },
  'IMG-004': {
    file: 'docs/54-IMG-004-어스앵커-하중계-설치-표현-표준.md',
    heading: '## 15. AI 복붙용 통합 블록',
  },
  'IMG-024': {
    file: 'docs/39-IMG-024-댐-안전관리-계측-체계도-전면-수정-계획.md',
    heading: '## 12. AI 복붙용 통합 블록',
  },
  'IMG-008': {
    file: 'docs/IMAGE_REGENERATION_PROMPTS.md',
    heading: '### IMG-008 — 터널 내공변위 (REGENERATE)',
  },
  'IMG-015': {
    file: 'docs/IMAGE_REGENERATION_PROMPTS.md',
    heading: '### IMG-015 — 사면 계측 (REGENERATE)',
  },
  'IMG-032': {
    file: 'docs/IMAGE_REGENERATION_PROMPTS.md',
    heading: '### IMG-032 — 침하판·침하계 (REGENERATE)',
  },
  'IMG-078': {
    file: 'docs/IMAGE_REGENERATION_PROMPTS.md',
    heading: '### IMG-078 — 록볼트 축력 (REGENERATE)',
  },
  'IMG-080': {
    file: 'docs/IMAGE_REGENERATION_PROMPTS.md',
    heading: '### IMG-080 — 강지보 응력 (REGENERATE)',
  },
};

const PHASE_PROMPT_DOCS = [
  'docs/86-Phase-AA-REGENERATE-복붙-프롬프트-정본.md',
  'docs/87-Phase-AA-MAJOR_FIX-복붙-프롬프트-정본.md',
  'docs/91-Phase-AB-복붙-프롬프트-정본.md',
  'docs/93-Phase-AC-복붙-프롬프트-정본.md',
  'docs/97-Phase-AD-복붙-프롬프트-정본.md',
  'docs/112-Phase-D-복붙-프롬프트-정본.md',
  'docs/115-Phase-E-복붙-프롬프트-정본.md',
];

const SECTION_RE = /^## §\d+\s+(IMG-\d{3})\s+—/gm;

let cachedIndex = null;

export function extractTextBlocks(sectionMd) {
  const blocks = [];
  const re = /```(?:text)?\r?\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(sectionMd)) !== null) {
    const t = m[1].trim();
    if (t && !t.endsWith('.png')) blocks.push(t);
  }
  return blocks;
}

export function pickBestBlock(blocks) {
  if (!blocks.length) return null;
  if (blocks.length === 1) return blocks[0];
  const scored = blocks.map((b) => ({
    text: b,
    score: b.length + (/\b1920\b/.test(b) ? 500 : 0) + (/복붙|통합/.test(b) ? 200 : 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0].text;
}

export function extractFromSection(content, headingPrefix) {
  const idx = content.indexOf(headingPrefix);
  if (idx < 0) return null;
  const after = content.slice(idx);
  const nextH2 = after.search(/\n## (?!\#)/);
  const section = nextH2 > 0 ? after.slice(0, nextH2) : after;
  return pickBestBlock(extractTextBlocks(section));
}

function parsePhaseDoc(relPath) {
  const abs = join(REWORK_ROOT, relPath);
  const content = readFileSync(abs, 'utf8');
  const hits = [];
  let m;
  while ((m = SECTION_RE.exec(content)) !== null) {
    hits.push({ id: m[1], start: m.index });
  }
  const out = new Map();
  for (let i = 0; i < hits.length; i++) {
    const { id, start } = hits[i];
    const end = i + 1 < hits.length ? hits[i + 1].start : content.length;
    const headingLine = content.slice(start).split('\n')[0].trim();
    out.set(id, { file: relPath, heading: headingLine, source: 'phase-doc' });
  }
  return out;
}

function findImageWorksPrompt(id) {
  const prefix = `${id}_`;
  const names = readdirSync(PROMPTS_DIR).filter((n) => n.startsWith(prefix) && n.endsWith('.md'));
  if (!names.length) return null;
  names.sort();
  return join('ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/prompts', names[names.length - 1]);
}

export function buildPromptIndex() {
  if (cachedIndex) return cachedIndex;

  const index = new Map();

  for (const rel of PHASE_PROMPT_DOCS) {
    for (const [id, meta] of parsePhaseDoc(rel)) {
      if (!index.has(id)) index.set(id, meta);
    }
  }

  for (const [id, meta] of Object.entries(PROMPT_SPECIAL)) {
    index.set(id, { ...meta, source: 'special' });
  }

  cachedIndex = index;
  return index;
}

export function resolvePromptSource(id) {
  const index = buildPromptIndex();
  if (index.has(id)) return index.get(id);

  const iw = findImageWorksPrompt(id);
  if (iw) return { file: iw, heading: null, source: 'imageworks' };

  return null;
}

export function loadPromptBody(id) {
  const src = resolvePromptSource(id);
  if (!src) return { src: null, body: null };

  const abs = join(REWORK_ROOT, src.file);
  const content = readFileSync(abs, 'utf8');

  let body = null;
  if (src.heading) {
    body = extractFromSection(content, src.heading);
  }
  if (!body) {
    body = pickBestBlock(extractTextBlocks(content));
  }
  if (!body) {
    body = extractProsePrompt(content);
  }

  return { src, body };
}

function extractProsePrompt(content) {
  const marker = '## 최종 생성 프롬프트';
  const idx = content.indexOf(marker);
  if (idx < 0) return null;
  const after = content.slice(idx + marker.length);
  const nextH2 = after.search(/\n## /);
  const section = nextH2 > 0 ? after.slice(0, nextH2) : after;
  const lines = section
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('**') && !l.startsWith('→') && !l.startsWith('|'));
  const prose = lines.join('\n').trim();
  return prose.length > 80 ? prose : null;
}

export function loadP0Prefix(purposeLine) {
  const guide = join(REWORK_ROOT, 'docs/36-AI-이미지-생성-엔지니어링-프롬프트-가이드.md');
  const content = readFileSync(guide, 'utf8');
  const b0 = extractFromSection(content, '### 1.0 Cursor 최상단');
  const b1 = extractFromSection(content, '### 1.0a P1 보조');
  const parts = [b0, b1].filter(Boolean);
  if (!parts.length) return null;
  let text = parts.join('\n\n');
  if (purposeLine) {
    text = text.replace(
      /이 그림의 계측 목적은 단 하나다: ____ \(여기에 한 줄로 기입\)/,
      `이 그림의 계측 목적은 단 하나다: ${purposeLine}`,
    );
  }
  return text;
}
