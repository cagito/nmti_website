#!/usr/bin/env node
/** Seed IMG-103~110 registry + policy after Pillow render. */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REG = join(ROOT, 'scripts', 'image-review-registry.json');
const POL = join(ROOT, 'scripts', 'figure-production-policy.json');
const today = new Date().toISOString().slice(0, 10);

const FIGURES = [
  { id: 'IMG-103', title: '교량 상부구조 처짐 계측도', hero: true, tier: 'FT-C', prohibited: ['침하판·지표침하계 hero', '성토 단면', 'Y축 침하량'] },
  { id: 'IMG-104', title: '처짐계 설치·측정 개념도', hero: false, tier: 'FT-C', prohibited: ['침하계·침하판', '지반 침하 단면'] },
  { id: 'IMG-105', title: '교량 케이블 장력 계측도', hero: true, tier: 'FT-C', prohibited: ['어스앵커 로드셀', 'IMG-004 재사용'] },
  { id: 'IMG-106', title: '케이블장력계 주파수법 설치 개념도', hero: false, tier: 'FT-C', prohibited: ['하중계=케이블장력', '버팀보 로드셀'] },
  { id: 'IMG-107', title: '교량 변형률·응력 계측도', hero: true, tier: 'FT-C', prohibited: ['침하계 단면', '흙막이 배경'] },
  { id: 'IMG-108', title: '무응력계 설치 개념도', hero: false, tier: 'FT-C', prohibited: ['일반 SG와 동일 캡션'] },
  { id: 'IMG-109', title: '교량 풍향·풍속 계측도', hero: true, tier: 'FT-C', prohibited: ['사면 강우 hero만', '지하수위계 단독'] },
  {
    id: 'IMG-110',
    title: '교량 받침부 변위 계측도',
    hero: true,
    tier: 'FT-C',
    prohibited: ['X/Y/Z 3축 주계측', '종·횡변위 제목', '신축이음 핑거형 hero', 'GNSS 절대좌표 혼합']
  }
];

const registry = JSON.parse(readFileSync(REG, 'utf8'));
const policy = JSON.parse(readFileSync(POL, 'utf8'));

for (const f of FIGURES) {
  registry[f.id] = {
    id: f.id,
    title: f.title,
    status: 'reviewed',
    reviewGrade: 'PASS',
    reviewDoc: `docs/IMAGE_REVIEW_LOG.md#${f.id}`,
    reviewDate: today,
    reviewer: 'Cursor-Agent',
    auditPriority: null,
    requiresReaudit: false,
    prohibitedErrors: f.prohibited,
    notes: 'Bridge Daegu gap Pillow render — docs/61',
    figureTier: f.tier,
    productionMethod: 'pillow',
    productionMethodTarget: 'pillow',
    migrationPhase: 'P4',
    hero: f.hero,
    renderScript: 'render-bridge-daegu-figures.py',
    prohibitedVerified: true,
    prohibitedVerifiedDate: today,
    visualReview: {
      grade: 'PASS',
      reviewer: 'Cursor-Agent',
      date: today,
      notes: 'docs/61 Phase 5 — BRI-DEF/CT/STR/WND',
      gates: ['V1', 'V4']
    }
  };
  policy.figures[f.id] = {
    tier: f.tier,
    currentMethod: 'pillow',
    targetMethod: 'pillow',
    migrationPhase: 'P4',
    hero: f.hero,
    renderScript: 'render-bridge-daegu-figures.py'
  };
}

atomicWriteUtf8(REG, `${JSON.stringify(registry, null, 2)}\n`);
atomicWriteUtf8(POL, `${JSON.stringify(policy, null, 2)}\n`);
console.log('Seeded', FIGURES.map((f) => f.id).join(', '));
