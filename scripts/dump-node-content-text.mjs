/** Plain text blobs per node for book-plan cross-check. */
import { getAllContentNodeIds } from '../js/technology/dictionary.js';
import { getContentForNode } from '../js/technology/content-data.js';

function strip(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const out = {};
for (const id of getAllContentNodeIds()) {
  const c = getContentForNode(id);
  if (!c?.sections) continue;
  const inst = c.sections.installation;
  const instText = Array.isArray(inst) ? inst.join(' ') : strip(inst);
  out[id] =
    strip(c.sections.overview) +
    ' ' +
    strip(c.sections.principle) +
    ' ' +
    instText;
}
process.stdout.write(JSON.stringify(out));
