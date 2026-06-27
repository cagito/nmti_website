/**
 * PNG 재작도 프로그램 — 제작자 1화면 Handoff
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { REWORK_ROOT, PHASES } from './lib/rework-phases.mjs';
import { getQuickstart } from './lib/rework-quickstarts.mjs';
import { hasSourceAsset } from './lib/rework-source.mjs';

const registry = JSON.parse(
  readFileSync(join(REWORK_ROOT, 'scripts', 'image-review-registry.json'), 'utf8'),
);

let signed = 0;
let reaudit = 0;
let pending = 0;
let ready = 0;

for (const p of PHASES) {
  for (const id of p.ids) {
    const reg = registry[id];
    const ra = reg?.requiresReaudit === true;
    const ok =
      !ra && reg?.visualReview?.grade === 'PASS' && reg?.prohibitedVerified === true;
    if (ok) signed++;
    else if (ra) {
      reaudit++;
      if (hasSourceAsset(id).ok) ready++;
    } else pending++;
  }
}

console.log(`
PNG 재작도 프로그램 — 제작자 Handoff
══════════════════════════════════════

현황: 69 Figure · signed ${signed} · reaudit ${reaudit} · ready ${ready} · pending ${pending}

▶ 최우선 W1 P0
  1. npm run rework:prompt -- --id IMG-002
  2. redline v5 → source/IMG-002_흙막이-계측-설치-대표-단면도.png
  3. npm run rework:preflight -- --id IMG-002
  4. npm run rework:done -- --id IMG-002 --input assets/images/technology/source/IMG-002_흙막이-계측-설치-대표-단면도.png --reviewer "검수자"
     (또는 register → sign 분리)
  5. 096 · 004 동일 → npm run rework:sign -- --phase A
  6. source PNG 있으면: npm run rework:ready

▶ 명령
  rework:next          다음 1건 (+ register/sign)
  rework:w1            W1 3건 순서
  rework:phase         Phase 단위 목록 (--phase A)
  rework:prompt        복붙 블록 출력 (--id IMG-###)
  rework:preflight      PNG·redline·canonical 등록 전 검증
  rework:register       preflight + register + build:images
  rework:sign           redline 서명 (phase 자동 · 가드)
  rework:done           register + sign 일괄
  rework:ready          source PNG·서명 대기 목록
  rework:check          사전 점검 (redline·프롬프트·patch)
  rework:canonical        canonical source 경로 (--id IMG-###)
  rework:export-prompts  exports/rework-prompts/*.txt
  rework:status        진행표 (--pending)

▶ 검증
  verify:content       재작도 중 일상 (reaudit WARN)
  verify:local         배포 게이트 (reaudit 0)

▶ 문서
  docs/108  마스터 · docs/119 Handoff · docs/102 W1 허브
  퀵스타트 IMG-002: ${getQuickstart('IMG-002')}
`);
