/**
 * Figure별 퀵스타트 doc 경로 (rework-next · rework-phase)
 */
import { PHASES, P0_WIREFRAME_IDS } from './rework-phases.mjs';

const PHASE_HUB = {
  AA: 'docs/103-W2-Phase-AA-REGENERATE-퀵스타트.md',
  B: 'docs/105-W3-Phase-B-퀵스타트.md',
  C: 'docs/106-W4-Phase-C-퀵스타트.md',
  AB: 'docs/107-W5-Phase-AB-REGENERATE-퀵스타트.md',
  AC: 'docs/109-W8-Phase-AC-퀵스타트.md',
  AD: 'docs/110-W9-Phase-AD-퀵스타트.md',
  D: 'docs/114-W10-Phase-D-퀵스타트.md',
  E: 'docs/117-W11-Phase-E-퀵스타트.md',
  P0: 'docs/123-P0-와이어프레임-14종-실행-체크리스트.md',
};

const ID_QUICKSTART = {
  'IMG-002': 'docs/96-W1-IMG-002-PNG-제작자-퀵스타트.md',
  'IMG-096': 'docs/100-W1-IMG-096-PNG-제작자-퀵스타트.md',
  'IMG-004': 'docs/101-W1-IMG-004-PNG-제작자-퀵스타트.md',
  'IMG-094': 'docs/124-P0-IMG-094-운영모드-3종-제작자-퀵스타트.md',
  'IMG-095': 'docs/124-P0-IMG-094-운영모드-3종-제작자-퀵스타트.md',
  'IMG-102': 'docs/124-P0-IMG-094-운영모드-3종-제작자-퀵스타트.md',
  'IMG-018': 'docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md',
  'IMG-020': 'docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md',
  'IMG-025': 'docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md',
  'IMG-027': 'docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md',
  'IMG-037': 'docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md',
  'IMG-038': 'docs/104-W2-Phase-AA-MAJOR_FIX-퀵스타트.md',
};

const MASTER = 'docs/108-PNG-재작도-제작자-마스터-인덱스.md';

export function getQuickstart(id) {
  if (ID_QUICKSTART[id]) return ID_QUICKSTART[id];
  if (P0_WIREFRAME_IDS.includes(id)) return PHASE_HUB.P0;
  const phase = PHASES.find((p) => p.ids.includes(id));
  if (!phase) return MASTER;
  return PHASE_HUB[phase.phase] || MASTER;
}

export function getPhaseMeta(phaseCode) {
  return PHASES.find((p) => p.phase === phaseCode) || null;
}
