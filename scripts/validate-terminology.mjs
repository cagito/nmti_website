/**
 * KDS/KCS 용어 위반 검사.
 * 기준: book/KDS-KCS_용어기준.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SCAN_DIRS = [
  path.join(ROOT, 'scripts', 'content-data'),
  path.join(ROOT, 'js', 'technology'),
  path.join(ROOT, 'ImageWorks', 'NMTI_Engineering_Image_Prompt_Package_v1'),
  path.join(ROOT, 'sensors'),
  path.join(ROOT, 'technology')
];

const SCAN_FILES = [
  path.join(ROOT, 'scripts', 'build-content-data.mjs'),
  path.join(ROOT, 'index.html')
];

const SCAN_EXT = new Set(['.mjs', '.js', '.md', '.html']);

/** @type {{ pattern: RegExp, message: string }[]} */
const RULES = [
  { pattern: /내공변위[^<]*\(수렴\)/, message: '「내공변위(수렴)」금지 — 「내공변위」만 사용' },
  { pattern: /수렴은 단면/, message: '「수렴은 단면」금지 — 「내공변위」= 단면 변형' },
  { pattern: /천단침하[^<]{0,40}단면 수축/, message: '천단침하를 단면 수축으로 설명 금지' },
  { pattern: /인클리노미터라고도/, message: '지중경사계=인클리노미터 동일시 금지' },
  { pattern: /Inclinometer Monitoring Guide/, message: '영문 Inclinometer 표기 대신 지중경사계 사용' },
  {
    pattern: /draw_label\([^)]*"[^"]*①[^"]*지중경사계"/,
    message: 'Figure 라벨은「센서형 다단식 지중경사계」전칭 — INSTRUMENTATION §3.3 · ImageWorks 09'
  },
  { pattern: /1·2·3차 경보/, message: '「1·2·3차 경보」단독 금지 — 설계예상변위·최대허용변위 병기' },
  { pattern: /1차 관리기준/, message: '「1차 관리기준」금지 — KDS 관리 용어 사용' },
  { pattern: /2차는 원인분석/, message: '「2차 관리」단계 표현 금지' },
  { pattern: /3차는 긴급/, message: '「3차 관리」단계 표현 금지' },
  { pattern: /3차 경보/, message: '「3차 경보」단독 금지' },
  { pattern: /1차\(주의\)/, message: '「1차(주의)」경보 단계 금지 — 설계예상변위·최대허용변위 사용' },
  { pattern: /2차\(조정\)/, message: '「2차(조정)」경보 단계 금지' },
  { pattern: /3차\(긴급\)/, message: '「3차(긴급)」경보 단계 금지' },
  { pattern: /LTE 원격통신/, message: '「LTE 원격통신」금지 — 「LTE M2M」·「LTE M2M 모뎀」 사용' },
  { pattern: /LTE 원격계측/, message: '「LTE 원격계측」금지 — 「LTE M2M 통신」 사용' },
  {
    pattern: /지표침하계\s*[—\-·/]\s*침하핀|침하핀\/연장봉/,
    message: 'SETTLE-01: 지표침하계(센서)와 침하핀(표식) 혼용 금지 — docs/42'
  },
  {
    pattern: /settlement pin \(vertical down\)/,
    message: 'SETTLE-01: settlement pin 금지 — surface settlement GAUGE(지표침하계) 사용'
  }
];

/** @type {{ pathPart: string, pattern: RegExp, message: string }[]} */
const PATH_RULES = [
  {
    pathPart: `${path.sep}content-data${path.sep}`,
    pattern: /건설기간\s*계측/,
    message: '153 DOC-CANON: 대외 「건설기간 계측」금지 — 「건설중 계측」'
  }
];

const SKIP_FILES = new Set(['validate-terminology.mjs']);
const SKIP_PATH_PARTS = [
  'KDS-KCS_용어기준.md',
  '_kds_kcs_term_extract.json',
  'docs/42-',
  'docs/43-',
  `${path.sep}redlines${path.sep}`
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (SKIP_PATH_PARTS.some((p) => full.includes(p))) continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (SCAN_EXT.has(path.extname(name)) && !SKIP_FILES.has(name)) files.push(full);
  }
  return files;
}

/** @type {{ file: string, line: number, message: string, text: string }[]} */
const violations = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    scanFile(file);
  }
}
for (const file of SCAN_FILES) {
  if (fs.existsSync(file)) scanFile(file);
}

function scanFile(file) {
  const rel = path.relative(ROOT, file);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (line.includes('terminology-ok')) return;
    for (const rule of RULES) {
      if (rule.pattern.test(line)) {
        violations.push({
          file: rel,
          line: i + 1,
          message: rule.message,
          text: line.trim().slice(0, 120)
        });
      }
    }
    for (const rule of PATH_RULES) {
      if (!file.includes(rule.pathPart)) continue;
      if (rule.pattern.test(line)) {
        violations.push({
          file: rel,
          line: i + 1,
          message: rule.message,
          text: line.trim().slice(0, 120)
        });
      }
    }
  });
}

if (violations.length) {
  console.error(`용어 검증 실패: ${violations.length}건\n`);
  violations.forEach((v) => {
    console.error(`${v.file}:${v.line} — ${v.message}`);
    console.error(`  ${v.text}\n`);
  });
  process.exit(1);
}

console.log('용어 검증 통과 (KDS/KCS 기준)');
