/**
 * ZIP 207 — 2차 전수검수 (메타·캡션·본문 휴리스틱).
 * Phase Z 완료 10종 제외 · 신규 의심 패턴 탐지.
 *
 * Usage: node scripts/audit-zip-pass2.mjs [--strict]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteUtf8 } from './lib/atomic-write.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const REGISTRY = JSON.parse(readFileSync(join(ROOT, 'scripts', 'image-review-registry.json'), 'utf8'));
const CONTENT = readFileSync(join(ROOT, 'js', 'technology', 'content-data.js'), 'utf8');
const IMAGES_JS = readFileSync(join(ROOT, 'js', 'technology', 'images.js'), 'utf8');

/** Phase Z 완료 — 휴리스틱 스킵 (이미 수정됨) */
const PHASE_Z_DONE = new Set([
  'IMG-008', 'IMG-009', 'IMG-015', 'IMG-032', 'IMG-034',
  'IMG-041', 'IMG-043', 'IMG-060', 'IMG-078', 'IMG-080',
]);

/** ZIP2-## — 신규 2차 검수 휴리스틱 */
const HEURISTICS = [
  {
    id: 'ZIP2-01',
    severity: '상',
    re: /가속도\s*\([^)]*mm\/s|mm\/s[^)]*가속도|가속도.*또는\s*mm\/s/i,
    reason: '가속도 단위에 mm/s(속도) 혼재',
    fix: '가속도계 m/s²·gal / PPV mm/s 분리',
    onlyIds: new Set(['IMG-041', 'IMG-053', 'IMG-086', 'IMG-087', 'IMG-097']),
  },
  {
    id: 'ZIP2-02',
    severity: '상',
    re: /이상치\s*(제거|삭제)|자동\s*보간|outlier\s*remov/i,
    reason: 'QC 흐름에서 이상치 자동 삭제·보간 표현',
    fix: '원본 보존·QC 플래그·승인 후 보정',
  },
  {
    id: 'ZIP2-03',
    severity: '상',
    re: /연장봉\s*상단.*기준점|기준점.*연장봉\s*상단/i,
    reason: '침하계 연장봉 상단=기준점 혼동',
    fix: '측정점 vs 영향권 밖 안정 BM',
  },
  {
    id: 'ZIP2-04',
    severity: '상',
    re: /Extension\s*Tube|연속\s*센서\s*튜브|센서\s*튜브.*프로파일/i,
    reason: '내공변위 연속 센서 튜브/Extension Tube 표현',
    fix: 'P1~P5 측점·측선·기준 측정선',
    onlyIds: new Set(['IMG-008', 'IMG-007', 'IMG-063']),
  },
  {
    id: 'ZIP2-05',
    severity: '중',
    re: /확정\s*활동면|확정\s*원호\s*활동면|활동면\s*아래\s*\d+\s*~\s*\d+\s*m/i,
    reason: '확정·고정 m 활동면 표현',
    fix: '잠재 활동면(추정)·근입=설계·조사',
    skipIds: PHASE_Z_DONE,
  },
  {
    id: 'ZIP2-06',
    severity: '중',
    re: /RTK.*시준|기준국.*이동국.*점선/i,
    reason: 'GNSS를 광파 시준선처럼 표현',
    fix: '위성 신호·보정정보 통신',
    onlyIds: new Set(['IMG-043', 'IMG-052']),
  },
  {
    id: 'ZIP2-07',
    severity: '중',
    re: /성토\s*하중.*토압|토압.*성토\s*하중/i,
    reason: '상재하중 q와 수평토압 σh 혼재',
    fix: 'q·σh 분리 표기',
    skipIds: PHASE_Z_DONE,
  },
  {
    id: 'ZIP2-08',
    severity: '중',
    re: /두부\s*하중\s*=\s*전체\s*축력|P\s*=\s*T\s*전체|축력계.*전체\s*분포/i,
    reason: '록볼트 두부 하중=전체 축력',
    fix: '두부 반력·SG 부착 록볼트 구분',
    skipIds: PHASE_Z_DONE,
  },
  {
    id: 'ZIP2-09',
    severity: '중',
    re: /(?<!센서형 다단식 )지중경사계(?!.*다단식)/i,
    reason: '지중경사계 단독 라벨 (센서형 다단식 미표기)',
    fix: '센서형 다단식 지중경사계',
    onlyIds: new Set(['IMG-025', 'IMG-027', 'IMG-015', 'IMG-096', 'IMG-028', 'IMG-029']),
  },
  {
    id: 'ZIP2-10',
    severity: '중',
    re: /수동\s*(프로브|리드아웃|sounder)/i,
    reason: 'AUTO-01 — 수동 probe hero 표현',
    fix: 'well cap·logger chain·자동형',
    skipIds: new Set(['IMG-025', 'IMG-070']),
  },
  {
    id: 'ZIP2-11',
    severity: '상',
    re: /진동현식|\bVW\b.*인터페이스/i,
    reason: 'METHOD-01 — 진동현식/VW Figure 라벨',
    fix: '계측기 종류·설치 위치만',
  },
  {
    id: 'ZIP2-12',
    severity: '중',
    re: /데이터로거\s*(?:=|는|만)\s*(?:센서|probe)|로거\s*본체[^.\n]{0,30}센서\s*외형/i,
    reason: '로거=센서 혼동 가능',
    fix: '로거=함체·케이블 수렴',
    skipIds: new Set(['IMG-045', 'IMG-077']),
  {
    id: 'ZIP2-22',
    severity: '상',
    re: /최대\s*변위\s*(깊이|심도)\s*=\s*활동면|최대변위.*활동면\s*위치/i,
    reason: 'ZIP-AUD-11 — 최대변위 심도=활동면 단정',
    fix: '추정·잠재 활동면 · 다자료 병행',
    onlyIds: new Set(['IMG-016', 'IMG-017']),
  },
  {
    id: 'ZIP2-23',
    severity: '중',
    re: /강우.*→.*지하수위.*→.*변위|상관.*인과|원인\s*확정/i,
    reason: 'ZIP-AUD-13 — 상관=인과 확정',
    fix: '상관 분석 · 가설 · 지연시간',
    onlyIds: new Set(['IMG-018']),
  },
  {
    id: 'ZIP2-24',
    severity: '중',
    re: /누적변위.*절대|절대\s*수평변위|절대좌표\s*변위/i,
    reason: 'ZIP-AUD-16 — 누적변위=절대변위',
    fix: '기준 심도 대비 상대변위',
    onlyIds: new Set(['IMG-025']),
  },
  {
    id: 'ZIP2-26',
    severity: '상',
    re: /최대\s*누적변위\s*깊이\s*=\s*활동면|최대\s*누적변위.*활동면/i,
    reason: 'ZIP-AUD-23 — 최대 누적심도=활동면',
    fix: '집중 구간 vs 추정 구간 · INTERP-01',
    onlyIds: new Set(['IMG-029']),
  },
  {
    id: 'ZIP2-27',
    severity: '중',
    re: /θ.*적분|기울기.*곧바로.*누적변위/i,
    reason: 'ZIP-AUD-22 — θ 단순 적분=변위',
    fix: '초기 프로파일 · 왕복 · IPI-MEAS-01',
    onlyIds: new Set(['IMG-028']),
  },
  {
    id: 'ZIP2-28',
    severity: '중',
    re: /모든\s*센서.*동일|단순\s*선\s*하나.*로거/i,
    reason: 'ZIP-AUD-29 — 센서 동일 입력',
    fix: 'LOGGER-SIG-01 신호 형식 분리',
    onlyIds: new Set(['IMG-045']),
  },
];

function contentSnippetsFor(id) {
  const snippets = [];
  const blockRe = new RegExp(
    `\\{[^{}]*(?:imageId:\\s*'${id}'|id:\\s*'${id}')[^{}]*\\}`,
    'g'
  );
  for (const m of CONTENT.matchAll(blockRe)) {
    snippets.push(m[0]);
  }
  // heroCaption / section near id in leaves
  const nearRe = new RegExp(
    `'${id}'[\\s\\S]{0,800}|imageId:\\s*'${id}'[\\s\\S]{0,800}`,
    'g'
  );
  for (const m of CONTENT.matchAll(nearRe)) {
    snippets.push(m[0].slice(0, 800));
  }
  return [...new Set(snippets)].join('\n');
}

function extractAltCaption(block) {
  if (!block) return { alt: '', caption: '' };
  const altM = block.match(/alt:\s*'([^']*)'/);
  const capM = block.match(/caption:\s*'([^']*)'/);
  return { alt: altM?.[1] || '', caption: capM?.[1] || '' };
}

function corpusFor(id) {
  const reg = REGISTRY[id] || {};
  const imgBlock = IMAGES_JS.split(`'${id}':`)[1]?.split(/\n  '/)[0] || '';
  const { alt: jsAlt, caption: jsCaption } = extractAltCaption(imgBlock);
  return [
    reg.alt || jsAlt,
    reg.caption || jsCaption,
    contentSnippetsFor(id),
  ]
    .filter(Boolean)
    .join('\n');
}

const findings = [];
const imgDir = join(ROOT, 'assets', 'images', 'technology');
const pngCount = readdirSync(imgDir).filter((f) => /^IMG-\d{3}_.*\.png$/i.test(f)).length;
const webpCount = readdirSync(imgDir).filter((f) => /^IMG-\d{3}\.webp$/i.test(f)).length;
const registryIds = Object.keys(REGISTRY).filter((k) => /^IMG-\d{3}$/.test(k));

for (const id of registryIds) {
  if (PHASE_Z_DONE.has(id)) continue;
  const text = corpusFor(id);
  if (!text.trim()) continue;
  for (const h of HEURISTICS) {
    if (h.skipIds?.has(id)) continue;
    if (h.onlyIds && !h.onlyIds.has(id)) continue;
    if (PHASE_Z_DONE.has(id) && ['ZIP2-04', 'ZIP2-05', 'ZIP2-06', 'ZIP2-07', 'ZIP2-08'].includes(h.id)) continue;
    if (h.re.test(text)) {
      findings.push({
        id,
        heuristic: h.id,
        severity: h.severity,
        reason: h.reason,
        fix: h.fix,
        grade: REGISTRY[id]?.reviewGrade,
        reaudit: REGISTRY[id]?.requiresReaudit,
      });
    }
  }
}

// 미검수 PNG (registry 없음)
const diskIds = new Set(
  readdirSync(imgDir)
    .filter((f) => /^IMG-\d{3}_/.test(f))
    .map((f) => f.match(/^(IMG-\d{3})/)[1])
);
for (const id of diskIds) {
  if (!REGISTRY[id]) {
    findings.push({
      id,
      heuristic: 'ZIP2-99',
      severity: '하',
      reason: 'PNG 존재하나 registry 없음',
      fix: 'registry·master list 등록',
    });
  }
}

findings.sort((a, b) => {
  const sev = { 상: 0, 중: 1, 하: 2 };
  return (sev[a.severity] ?? 9) - (sev[b.severity] ?? 9) || a.id.localeCompare(b.id);
});

const high = findings.filter((f) => f.severity === '상');
const med = findings.filter((f) => f.severity === '중');

const md = [
  '# ZIP 207 — 2차 전수검수 보고서',
  '',
  `**실행:** ${new Date().toISOString().slice(0, 10)} · \`node scripts/audit-zip-pass2.mjs\``,
  '',
  '## 요약',
  '',
  '| 항목 | 값 |',
  '|------|-----|',
  `| PNG (technology/) | ${pngCount} |`,
  `| WebP | ${webpCount} |`,
  `| registry IMG | ${registryIds.length} |`,
  `| Phase Z 완료 (스캔 제외) | ${PHASE_Z_DONE.size} |`,
  `| 2차 신규 의심 | **${findings.length}** (상 ${high.length} · 중 ${med.length}) |`,
  '',
  '> 휴리스틱: **alt·caption·content-data**만 검사 (Phase Z 10종 제외) — **육안 PNG 재확인 필수**',
  '',
  '## 상·중 심각도',
  '',
  '| ID | ZIP2 | 등급 | 사유 | 수정 방향 |',
  '|----|------|------|------|-----------|',
  ...findings
    .filter((f) => f.severity !== '하')
    .map((f) => `| ${f.id} | ${f.heuristic} | ${f.severity} | ${f.reason} | ${f.fix} |`),
  '',
  '## 전체 목록',
  '',
  ...findings.map(
    (f) =>
      `- **${f.id}** [${f.heuristic}] ${f.severity} — ${f.reason} → ${f.fix}${f.grade ? ` (registry: ${f.grade})` : ''}`
  ),
  '',
  '## 연계',
  '',
  '- [77-Phase Z](./77-외부-ZIP-전수검수-신규-심각오류-10종-및-수정계획.md)',
  '- [IMAGE_REGENERATION_PROMPTS](./IMAGE_REGENERATION_PROMPTS.md)',
  '',
].join('\n');

atomicWriteUtf8(join(ROOT, 'docs', 'zip-pass2-audit.json'), JSON.stringify({ pngCount, webpCount, findings }, null, 2) + '\n');
atomicWriteUtf8(join(ROOT, 'docs', '78-ZIP-207-2차-전수검수-보고서.md'), md);

console.log(`zip-pass2: PNG ${pngCount} · findings ${findings.length} (상 ${high.length} · 중 ${med.length})`);
console.log(`Wrote docs/78-ZIP-207-2차-전수검수-보고서.md`);

if (STRICT && high.length > 0) {
  console.error('FAIL strict — 상 severity', high.length);
  process.exit(1);
}
