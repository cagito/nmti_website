/**
 * Shared helpers for img-image-knowledge-map.json
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

let _mapCache;

export function loadImgImageKnowledgeMap() {
  if (!_mapCache) {
    _mapCache = JSON.parse(
      readFileSync(join(ROOT, 'scripts', 'img-image-knowledge-map.json'), 'utf8')
    );
  }
  return _mapCache;
}

export function topicFromMapEntry(entry) {
  if (typeof entry === 'string') return entry;
  return entry?.topic || null;
}

export function topicForImgId(imgId) {
  const { map } = loadImgImageKnowledgeMap();
  return topicFromMapEntry(map[imgId]);
}

export function alsoTopicsForImgId(imgId) {
  const { map } = loadImgImageKnowledgeMap();
  const entry = map[imgId];
  if (entry && typeof entry === 'object' && Array.isArray(entry.also)) {
    return entry.also;
  }
  return [];
}

export const IK_ROOT = join(ROOT, 'docs', 'image-knowledge');

export const REDLINE_IK_START = '<!-- image-knowledge-redline:v1 -->';
export const REDLINE_IK_END = '<!-- /image-knowledge-redline:v1 -->';

export function extractSection13Checklist(topicText) {
  const re = /## 13\. 이미지 생성 전 체크리스트\r?\n\r?\n([\s\S]*?)(?=\r?\n## |$)/;
  const m = topicText.match(re);
  if (!m) return [];
  return m[1]
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^- \[ \]/.test(l))
    .map((l) => l.replace(/^- \[ \]\s*/, ''));
}

export function normalizeChecklistItem(text) {
  return text
    .replace(/\*\*/g, '')
    .replace(/[「」『』""]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

export function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
