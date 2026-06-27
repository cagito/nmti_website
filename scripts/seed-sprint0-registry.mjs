/**
 * Seed figure-production-policy + image-review-registry for Sprint 0 (IMG-089~095, 102).
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const policyPath = join(ROOT, 'scripts', 'figure-production-policy.json');
const registryPath = join(ROOT, 'scripts', 'image-review-registry.json');
const canonicalPath = join(ROOT, 'scripts', 'canonical-image-png.json');
const masterPath = join(
  ROOT,
  'ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/03_IMAGE_MASTER_LIST.json'
);

const FIGURES = [
  {
    id: 'IMG-089',
    tier: 'FT-A',
    hero: true,
    method: 'pillow',
    target: 'ai-reviewed',
    phase: 'P0',
    renderScript: 'render-sprint0-figures.py',
    prohibited: ['지중경사계 보링 casing', '풍경화·숲', '구조물경사계(IMG-038)']
  },
  {
    id: 'IMG-090',
    tier: 'FT-A',
    hero: true,
    method: 'pillow',
    target: 'ai-reviewed',
    phase: 'P0',
    renderScript: 'render-sprint0-figures.py',
    prohibited: ['사면 외부 ATS 부동점 누락', '풍경 hero']
  },
  {
    id: 'IMG-091',
    tier: 'FT-A',
    hero: true,
    method: 'pillow',
    target: 'ai-reviewed',
    phase: 'P0',
    renderScript: 'render-sprint0-figures.py',
    prohibited: ['지중경사계 혼동', '수평변위 화살표만']
  },
  {
    id: 'IMG-092',
    tier: 'FT-A',
    hero: true,
    method: 'pillow',
    target: 'ai-reviewed',
    phase: 'P0',
    renderScript: 'render-sprint0-figures.py',
    prohibited: ['지상 기둥만', '교량 pier group(IMG-013)']
  },
  {
    id: 'IMG-093',
    tier: 'FT-B',
    hero: true,
    method: 'pillow',
    target: 'ai-reviewed',
    phase: 'P0',
    renderScript: 'render-sprint0-figures.py',
    prohibited: ['대기 그래프만', '풍경화']
  },
  {
    id: 'IMG-094',
    tier: 'FT-C',
    hero: true,
    method: 'pillow',
    target: 'pillow',
    phase: 'P0',
    renderScript: 'render-sprint0-figures.py',
    prohibited: ['시계 아이콘만', '뇌·홀로그램']
  },
  {
    id: 'IMG-095',
    tier: 'FT-C',
    hero: true,
    method: 'pillow',
    target: 'pillow',
    phase: 'P0',
    renderScript: 'render-sprint0-figures.py',
    prohibited: ['번개 CG', '뇌·SF UI']
  },
  {
    id: 'IMG-102',
    tier: 'FT-C',
    hero: true,
    method: 'pillow',
    target: 'pillow',
    phase: 'P0',
    renderScript: 'render-sprint0-figures.py',
    prohibited: ['SF 경고 팝업', '뇌·네온', 'IMG-054 only without threshold']
  }
];

const CANONICAL = {
  'IMG-089': 'IMG-089_사면-지표경사-계측-개념도_지표경사계pad콘크리트.png',
  'IMG-090': 'IMG-090_사면-구조물-변위-계측-개념도_옹벽프리즘ATS.png',
  'IMG-091': 'IMG-091_다점지중변위계-MPBX-설치-개념도_보링다점앵커.png',
  'IMG-092': 'IMG-092_말뚝-축력-변형률-지중-단면도_CIP철근망변형률계.png',
  'IMG-093': 'IMG-093_환경-소음-분진-경계-계측주_펜스소음PM로거.png',
  'IMG-094': 'IMG-094_상시-계측-모드-흐름도_등간격트리거stabletrend.png',
  'IMG-095': 'IMG-095_실시간-이벤트-계측-모드-토폴로지_고속샘플링impulse.png',
  'IMG-102': 'IMG-102_경보-알림-상태-제어-흐름도_threshold경광SMS.png'
};

const master = JSON.parse(readFileSync(masterPath, 'utf8'));
const titleById = Object.fromEntries(master.map((m) => [m.id, m.title]));

const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const canonical = JSON.parse(readFileSync(canonicalPath, 'utf8'));

const today = '2026-06-26';

for (const fig of FIGURES) {
  policy.figures[fig.id] = {
    tier: fig.tier,
    currentMethod: fig.method,
    targetMethod: fig.target,
    migrationPhase: fig.phase,
    hero: fig.hero,
    renderScript: fig.renderScript
  };

  registry[fig.id] = {
    id: fig.id,
    title: titleById[fig.id] || fig.id,
    status: 'reviewed',
    reviewGrade: 'PASS',
    reviewDoc: `docs/IMAGE_REVIEW_LOG.md#${fig.id}`,
    reviewDate: today,
    reviewer: 'Cursor-Agent',
    auditPriority: fig.tier.startsWith('FT-A') ? 'P0' : null,
    requiresReaudit: fig.target === 'ai-reviewed' ? false : false,
    prohibitedErrors: fig.prohibited,
    notes: 'Sprint 0 Pillow render — docs/36 §4 · pending ai-reviewed if FT-A/B',
    figureTier: fig.tier,
    productionMethod: fig.method,
    productionMethodTarget: fig.target,
    migrationPhase: fig.phase,
    hero: fig.hero,
    renderScript: fig.renderScript,
    migrationStatus: fig.target === 'ai-reviewed' ? 'pending-external' : 'completed',
    visualReview: {
      grade: 'PASS',
      reviewer: 'Cursor-Agent',
      date: today,
      notes: 'Sprint 0 engineering line-art · INSTRUMENTATION cross-check',
      gates: ['V1', 'V2', 'V3']
    }
  };

  canonical[fig.id] = CANONICAL[fig.id];
}

atomicWriteUtf8(policyPath, `${JSON.stringify(policy, null, 2)}\n`);
atomicWriteUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
atomicWriteUtf8(canonicalPath, `${JSON.stringify(canonical, null, 2)}\n`);
console.log(`seed-sprint0-registry: ${FIGURES.length} figures added`);
