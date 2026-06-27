/**
 * Figure production policy audit — tier, method, visual review.
 * Usage: npm run audit:figure-production
 *        node scripts/audit-figure-production.mjs [--strict]
 *
 * Phase 0~4: violations → WARN (exit 0 unless --strict)
 * Phase 5+:   npm run audit:figure-production:strict in verify:local
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let sizeOf;
try {
  sizeOf = require('image-size');
} catch {
  sizeOf = null;
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const POLICY_PATH = join(ROOT, 'scripts', 'figure-production-policy.json');
const REGISTRY_PATH = join(ROOT, 'scripts', 'image-review-registry.json');
const IMG_DIR = join(ROOT, 'assets', 'images', 'technology');
const BULK_REVIEWER = '일괄 마이그레이션';
const APPROVED = new Set(['PASS', 'MINOR_FIX']);
const HERO_MIN_W = 1920;
const HERO_MIN_H = 1080;

const policy = JSON.parse(readFileSync(POLICY_PATH, 'utf8'));
const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
const tiers = policy.tiers;

let errors = 0;
let warnings = 0;

function issue(level, msg) {
  if (level === 'fail') {
    console.error('FAIL', msg);
    errors++;
  } else {
    console.warn('WARN', msg);
    warnings++;
  }
}

function enforce(level, msg) {
  if (STRICT) issue('fail', msg);
  else issue('warn', msg);
}

function ok(msg) {
  console.log('OK  ', msg);
}

function webpPathFor(id) {
  const prefix = `${id}_`;
  const files = readdirSync(IMG_DIR).filter((f) => f.startsWith(prefix) && f.endsWith('.webp'));
  if (!files.length) return null;
  return join(IMG_DIR, files.sort()[0]);
}

function allowedMethods(tier) {
  return tiers[tier]?.allowedMethods ?? [];
}

for (const [id, fig] of Object.entries(policy.figures)) {
  if (!registry[id]) {
    enforce('fail', `${id}: policy에 있으나 image-review-registry.json 없음`);
    continue;
  }

  const reg = registry[id];
  const tier = fig.tier;
  const allowed = allowedMethods(tier);

  if (!tier || !tiers[tier]) {
    issue('fail', `${id}: 잘못된 figureTier "${tier}"`);
    continue;
  }

  if (!reg.figureTier) {
    enforce('fail', `${id}: registry figureTier 없음 — seed-figure-production-registry 실행`);
  } else if (reg.figureTier !== tier) {
    enforce('fail', `${id}: registry figureTier ${reg.figureTier} ≠ policy ${tier}`);
  }

  const method = reg.productionMethod ?? fig.currentMethod;
  if (!method) {
    enforce('fail', `${id}: productionMethod 없음`);
  } else if (!allowed.includes(method)) {
    enforce('fail', `${id}: productionMethod "${method}" not allowed for ${tier} (allowed: ${allowed.join(', ')})`);
  }

  if ((tier === 'FT-A' || tier === 'FT-B') && method === 'pillow') {
    const pending = reg.migrationStatus === 'pending-external' ? ' [Phase1 pending — register-external-figure]' : '';
    enforce('fail', `${id}: FT-A/B + pillow — 외부 PNG(ai-reviewed/cad)로 교체 필요${pending}`);
  }

  if (fig.renderScript && method === 'pillow' && (tier === 'FT-A' || tier === 'FT-B')) {
    enforce('fail', `${id}: renderScript ${fig.renderScript} — Pillow FT-A/B 재렌더 금지`);
  }

  if (reg.status === 'reviewed' && APPROVED.has(reg.reviewGrade)) {
    if (!reg.visualReview?.grade) {
      enforce('fail', `${id}: reviewGrade ${reg.reviewGrade} but visualReview 없음 (출판 게이트 미완)`);
    } else if (!APPROVED.has(reg.visualReview.grade)) {
      enforce('fail', `${id}: visualReview.grade ${reg.visualReview.grade} — 운영 불가`);
    }

    if (reg.reviewer === BULK_REVIEWER || reg.visualReview?.reviewer === BULK_REVIEWER) {
      enforce('fail', `${id}: reviewer "${BULK_REVIEWER}" — 출판·기술 재서명 필요`);
    }
  }

  if (fig.hero && reg.status === 'reviewed' && APPROVED.has(reg.reviewGrade)) {
    const webp = webpPathFor(id);
    if (!webp) {
      enforce('fail', `${id}: hero WebP 없음`);
    } else if (sizeOf) {
      try {
        const dim = sizeOf(webp);
        if (dim.width < HERO_MIN_W || dim.height < HERO_MIN_H) {
          enforce('fail', `${id}: hero WebP ${dim.width}×${dim.height} < ${HERO_MIN_W}×${HERO_MIN_H}`);
        }
      } catch {
        enforce('fail', `${id}: hero WebP 크기 읽기 실패`);
      }
    }
  }
}

// Registry ids not in policy
for (const id of Object.keys(registry)) {
  if (!policy.figures[id]) {
    enforce('fail', `${id}: figure-production-policy.json에 없음`);
  }
}

console.log('---');
console.log(
  `figure-production: policy ${Object.keys(policy.figures).length}종, errors: ${errors}, warnings: ${warnings}, mode: ${STRICT ? 'strict' : 'warn'}`
);

if (errors) process.exit(1);
if (STRICT && warnings) process.exit(1);
ok('audit-figure-production');
