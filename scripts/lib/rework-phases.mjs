/**
 * PNG 재작도 W1~W11 — phase 정의 (sign · patch · redline 정본)
 */
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const redlinesDir = join(
  root,
  'ImageWorks',
  'NMTI_Engineering_Image_Prompt_Package_v1',
  'redlines',
);

export const REWORK_ROOT = root;
export const REDLINES_DIR = redlinesDir;

/** 제작자 redline 정본 (검증·status 표시) */
export const REDLINE_CANONICAL = {
  'IMG-002': 'IMG-002_redline_v5_외부PNG.md',
  'IMG-096': 'IMG-096_redline_v4_외부PNG.md',
  'IMG-004': 'IMG-004_redline_v2_외부PNG.md',
  'IMG-016': 'IMG-016_redline_v2_외부PNG.md',
  'IMG-017': 'IMG-017_redline_v2_외부PNG.md',
  'IMG-018': 'IMG-018_redline_v2_외부PNG.md',
  'IMG-020': 'IMG-020_redline_v2_외부PNG.md',
  'IMG-021': 'IMG-021_redline_v2_외부PNG.md',
  'IMG-025': 'IMG-025_redline_v2_외부PNG.md',
  'IMG-027': 'IMG-027_redline_v2_외부PNG.md',
  'IMG-037': 'IMG-037_redline_v2_외부PNG.md',
  'IMG-038': 'IMG-038_redline_v2_외부PNG.md',
  'IMG-039': 'IMG-039_redline_v2_외부PNG.md',
  'IMG-024': 'IMG-024_redline_v2_외부PNG.md',
  'IMG-089': 'IMG-089_redline_v2_외부PNG.md',
  'IMG-090': 'IMG-090_redline_v2_외부PNG.md',
  'IMG-091': 'IMG-091_redline_v2_외부PNG.md',
  'IMG-008': 'IMG-008_redline_v8_외부PNG.md',
  'IMG-015': 'IMG-015_redline_v2_외부PNG.md',
  'IMG-032': 'IMG-032_redline_v2_외부PNG.md',
  'IMG-078': 'IMG-078_redline_v2_외부PNG.md',
  'IMG-080': 'IMG-080_redline_v2_외부PNG.md',
  'IMG-026': 'IMG-026_redline_v2_외부PNG.md',
  'IMG-028': 'IMG-028_redline_v2_외부PNG.md',
  'IMG-029': 'IMG-029_redline_v2_외부PNG.md',
  'IMG-030': 'IMG-030_redline_v2_외부PNG.md',
  'IMG-035': 'IMG-035_redline_v2_외부PNG.md',
  'IMG-040': 'IMG-040_redline_v2_외부PNG.md',
  'IMG-042': 'IMG-042_redline_v2_외부PNG.md',
  'IMG-044': 'IMG-044_redline_v2_외부PNG.md',
  'IMG-045': 'IMG-045_redline_v2_외부PNG.md',
  'IMG-046': 'IMG-046_redline_v2_외부PNG.md',
  'IMG-007': 'IMG-007_redline_v2_외부PNG.md',
  'IMG-019': 'IMG-019_redline_v2_외부PNG.md',
  'IMG-023': 'IMG-023_redline_v2_외부PNG.md',
  'IMG-031': 'IMG-031_redline_v2_외부PNG.md',
  'IMG-033': 'IMG-033_redline_v2_외부PNG.md',
  'IMG-036': 'IMG-036_redline_v2_외부PNG.md',
  'IMG-059': 'IMG-059_redline_v2_외부PNG.md',
  'IMG-079': 'IMG-079_redline_v2_외부PNG_AC.md',
  'IMG-081': 'IMG-081_redline_v2_외부PNG.md',
  'IMG-047': 'IMG-047_redline_v2_외부PNG.md',
  'IMG-048': 'IMG-048_redline_v2_외부PNG.md',
  'IMG-049': 'IMG-049_redline_v2_외부PNG.md',
  'IMG-050': 'IMG-050_redline_v2_외부PNG.md',
  'IMG-051': 'IMG-051_redline_v2_외부PNG.md',
  'IMG-052': 'IMG-052_redline_v2_외부PNG.md',
  'IMG-053': 'IMG-053_redline_v2_외부PNG.md',
  'IMG-054': 'IMG-054_redline_v2_외부PNG.md',
  'IMG-055': 'IMG-055_redline_v2_외부PNG.md',
  'IMG-056': 'IMG-056_redline_v2_외부PNG.md',
  'IMG-011': 'IMG-011_redline_v2_외부PNG.md',
  'IMG-034': 'IMG-034_redline_v2_외부PNG.md',
  'IMG-041': 'IMG-041_redline_v2_외부PNG.md',
  'IMG-043': 'IMG-043_redline_v2_외부PNG.md',
  'IMG-064': 'IMG-064_redline_v2_외부PNG.md',
  'IMG-084': 'IMG-084_redline_v2_외부PNG.md',
  'IMG-070': 'IMG-070_redline_v2_외부PNG.md',
  'IMG-071': 'IMG-071_redline_v2_외부PNG.md',
  'IMG-072': 'IMG-072_redline_v2_외부PNG.md',
  'IMG-073': 'IMG-073_redline_v2_외부PNG.md',
  'IMG-074': 'IMG-074_redline_v2_외부PNG.md',
  'IMG-075': 'IMG-075_redline_v2_외부PNG.md',
  'IMG-076': 'IMG-076_redline_v2_외부PNG.md',
  'IMG-077': 'IMG-077_redline_v2_외부PNG.md',
  'IMG-092': 'IMG-092_redline_v2_외부PNG.md',
  'IMG-093': 'IMG-093_redline_v2_외부PNG.md',
  'IMG-097': 'IMG-097_redline_v2_외부PNG.md',
  'IMG-094': 'IMG-094_redline_v2_외부PNG.md',
  'IMG-095': 'IMG-095_redline_v2_외부PNG.md',
  'IMG-102': 'IMG-102_redline_v2_외부PNG.md',
};

/** AC·Phase C 보조 redline */
export const REDLINE_SUPPLEMENT = {
  'IMG-024': 'IMG-024_redline_v2_외부PNG_AC.md',
  'IMG-008': 'IMG-008_redline_v9_외부PNG.md',
};

export const PHASES = [
  {
    week: 'W1',
    phase: 'A',
    sign: 'sign:phase-a',
    patch: 'patch:registry-phase-a',
    ids: ['IMG-002', 'IMG-096', 'IMG-004'],
  },
  {
    week: 'W2',
    phase: 'AA',
    sign: 'sign:phase-aa',
    patch: 'patch:registry-phase-aa',
    ids: [
      'IMG-016',
      'IMG-017',
      'IMG-018',
      'IMG-020',
      'IMG-021',
      'IMG-025',
      'IMG-027',
      'IMG-037',
      'IMG-038',
      'IMG-039',
    ],
  },
  { week: 'W3', phase: 'B', sign: 'sign:phase-b', patch: null, ids: ['IMG-024', 'IMG-089', 'IMG-090', 'IMG-091'] },
  {
    week: 'W4',
    phase: 'C',
    sign: 'sign:phase-c',
    patch: null,
    ids: ['IMG-008', 'IMG-015', 'IMG-032', 'IMG-078', 'IMG-080'],
  },
  {
    week: 'W5-7',
    phase: 'AB',
    sign: 'sign:phase-ab',
    patch: 'patch:registry-phase-ab',
    ids: [
      'IMG-026',
      'IMG-028',
      'IMG-029',
      'IMG-030',
      'IMG-035',
      'IMG-040',
      'IMG-042',
      'IMG-044',
      'IMG-045',
      'IMG-046',
    ],
  },
  {
    week: 'W8',
    phase: 'AC',
    sign: 'sign:phase-ac',
    patch: 'patch:registry-phase-ac',
    ids: [
      'IMG-007',
      'IMG-019',
      'IMG-023',
      'IMG-024',
      'IMG-031',
      'IMG-033',
      'IMG-036',
      'IMG-059',
      'IMG-079',
      'IMG-081',
    ],
  },
  {
    week: 'W9',
    phase: 'AD',
    sign: 'sign:phase-ad',
    patch: 'patch:registry-phase-ad',
    ids: [
      'IMG-047',
      'IMG-048',
      'IMG-049',
      'IMG-050',
      'IMG-051',
      'IMG-052',
      'IMG-053',
      'IMG-054',
      'IMG-055',
      'IMG-056',
    ],
  },
  {
    week: 'W10',
    phase: 'D',
    sign: 'sign:phase-d',
    patch: 'patch:registry-phase-d',
    ids: [
      'IMG-011',
      'IMG-034',
      'IMG-041',
      'IMG-043',
      'IMG-064',
      'IMG-084',
      'IMG-070',
      'IMG-071',
      'IMG-075',
      'IMG-076',
      'IMG-077',
      'IMG-092',
      'IMG-093',
      'IMG-097',
    ],
  },
  {
    week: 'W11',
    phase: 'E',
    sign: 'sign:phase-e',
    patch: 'patch:registry-phase-e',
    ids: ['IMG-094', 'IMG-095', 'IMG-102'],
  },
];

export function allReworkIds() {
  return PHASES.flatMap((p) => p.ids);
}

/** [122] P0 — Sprint0·modes 와이어프레임 14종 (제작 우선) */
export const P0_WIREFRAME_IDS = [
  'IMG-094',
  'IMG-095',
  'IMG-102',
  'IMG-070',
  'IMG-071',
  'IMG-072',
  'IMG-073',
  'IMG-074',
  'IMG-075',
  'IMG-089',
  'IMG-090',
  'IMG-091',
  'IMG-092',
  'IMG-093',
];

/** [122] P1-A — 플랫폼·전원·로거 (14) */
export const P1_A_IDS = [
  'IMG-006',
  'IMG-045',
  'IMG-047',
  'IMG-048',
  'IMG-056',
  'IMG-058',
  'IMG-060',
  'IMG-065',
  'IMG-066',
  'IMG-067',
  'IMG-068',
  'IMG-069',
  'IMG-076',
  'IMG-077',
];

/** [122] P1-B — 그래프·경보 블록 (14) */
export const P1_B_IDS = [
  'IMG-018',
  'IMG-029',
  'IMG-044',
  'IMG-046',
  'IMG-049',
  'IMG-050',
  'IMG-051',
  'IMG-052',
  'IMG-053',
  'IMG-054',
  'IMG-055',
  'IMG-057',
  'IMG-059',
];

/** [122] P1-C — 교량 대구 gap (8) */
export const P1_C_IDS = [
  'IMG-103',
  'IMG-104',
  'IMG-105',
  'IMG-106',
  'IMG-107',
  'IMG-108',
  'IMG-109',
  'IMG-110',
];

/** [122] P1 전체 (36) */
export const P1_WIREFRAME_IDS = [...P1_A_IDS, ...P1_B_IDS, ...P1_C_IDS];
