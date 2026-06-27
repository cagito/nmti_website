import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PdfReader } from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BOOK = path.join(ROOT, 'book');

async function extractPdfText(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await PdfReader({ data }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => it.str).join(' ') + '\n';
  }
  return text;
}

function readUtf8(p) {
  return fs.readFileSync(p, 'utf8');
}

const issues = [];

function add(cat, item, detail) {
  issues.push({ cat, item, detail });
}

const pdfs = fs.readdirSync(BOOK).filter((f) => f.endsWith('.pdf'));
const pdfTexts = {};
for (const name of pdfs) {
  try {
    pdfTexts[name] = await extractPdfText(path.join(BOOK, name));
  } catch (e) {
    pdfTexts[name] = '';
    add('PDF 읽기', name, String(e.message || e));
  }
}

const dictionary = readUtf8(path.join(ROOT, 'js', 'technology', 'dictionary.js'));
const content = readUtf8(path.join(ROOT, 'js', 'technology', 'content-data.js'));
const index = readUtf8(path.join(ROOT, 'index.html'));
const termGuide = readUtf8(path.join(BOOK, 'KDS-KCS_용어기준.md'));
const imagesJs = readUtf8(path.join(ROOT, 'js', 'technology', 'images.js'));

// --- KDS tunnel items vs tree ---
const kdsTunnelRequired = [
  '지표 및 지중침하',
  '내공변위',
  '천단침하',
  '지중변위',
  '막장전방 선행변위',
  '록볼트 축력',
  '숏크리트 응력',
  '강지보 응력'
];
const tunnelSection = dictionary.split('fields/tunnel')[1]?.split('fields/bridge')[0] || '';
const tunnelChildLabels = [...tunnelSection.matchAll(/label: '([^']+)'/g)].map((m) => m[1]);

for (const term of kdsTunnelRequired) {
  if (term === '지표 및 지중침하') {
    if (!tunnelChildLabels.some((l) => l.includes('지표') || l.includes('지중침하'))) {
      add('KDS 4.1.5 터널 항목 누락', term, '트리에 전용 하위 메뉴 없음 (카테고리 overview에만 언급)');
    }
  }
  if (term === '막장전방 선행변위') {
    if (!tunnelChildLabels.some((l) => l.includes('선행') || l.includes('막장'))) {
      add('KDS 4.1.5 터널 항목 누락', term, '트리·리프 페이지 없음');
    }
  }
  if (term === '강지보 응력') {
    if (!content.includes('강지보')) {
      add('KDS 4.1.5 터널 항목 누락', term, 'KDS 4.1.5.2에 명시, 웹 콘텐츠 미반영');
    }
  }
}

// slug convergence
if (!dictionary.includes("id: 'fields/tunnel/convergence', label: '내공변위'")) {
  add('용어/slug', 'fields/tunnel/convergence', '화면 라벨이 내공변위가 아닐 수 있음');
}

// KDS 27 50 10 in book but not in term guide
if (pdfTexts['KDS 27 50 10 터널 계측(23.09).pdf'] && !termGuide.includes('KDS 27 50 10')) {
  add('기준서 참조 불일치', 'KDS 27 50 10', 'book PDF 존재, KDS-KCS_용어기준.md는 KDS 11 10 15만 상위 명시');
}

// Bridge KCS
const bridgePdf = pdfTexts['KCS 24 99 05 교량계측시설(23.09).pdf'] || '';
const bridgeSection = dictionary.split('fields/bridge')[1]?.split('fields/slope')[0] || '';
const bridgeLabels = [...bridgeSection.matchAll(/label: '([^']+)'/g)].map((m) => m[1]);
const kcsBridgeHints = ['교량 처짐', '교량 횡변위', '교량 종방향', '온도', '지진', '교량 기초'];
for (const h of kcsBridgeHints) {
  if (bridgePdf.includes(h.replace('교량 ', '')) || bridgePdf.includes(h)) {
    if (!bridgeLabels.some((l) => h.includes(l) || l.includes(h.replace('교량 ', '')))) {
      if (['온도', '지진'].includes(h) && bridgePdf.includes(h)) {
        add('KCS 24 99 05 교량 항목 미분리', h, 'KCS에 언급되나 트리 하위 항목 없음');
      }
    }
  }
}

// Dam KCS
const damPdf = pdfTexts['KCS 54 20 25 댐 계측설비(18.08).pdf'] || '';
const damSection = dictionary.split('fields/dam')[1]?.split('group-sensor')[0] || '';
const damLabels = [...damSection.matchAll(/label: '([^']+)'/g)].map((m) => m[1]);
for (const h of ['온도', '지진', '변형률', '유량', '기울기']) {
  if (damPdf.includes(h) && !damLabels.some((l) => l.includes(h))) {
    add('KCS 54 20 25 댐 항목 미분리', h, `현재 트리: ${damLabels.join(', ')}`);
  }
}

// Forbidden / risky terms in source mjs
const scanDirs = [path.join(ROOT, 'scripts', 'content-data')];
const sourceFiles = [];
function walk(d) {
  for (const n of fs.readdirSync(d)) {
    const f = path.join(d, n);
    if (fs.statSync(f).isDirectory()) walk(f);
    else if (n.endsWith('.mjs')) sourceFiles.push(f);
  }
}
walk(scanDirs[0]);
sourceFiles.push(path.join(ROOT, 'js', 'technology', 'content-data.js'));

const forbidden = [
  [/내공변위[^\\n]{0,20}\(수렴\)/, '내공변위(수렴)'],
  [/1·2·3차 경보/, '1·2·3차 경보'],
  [/1차 관리기준/, '1차 관리기준'],
  [/인클리노미터/, '인클리노미터 동일시'],
  [/진동현식/, '진동현식']
];
for (const f of sourceFiles) {
  const rel = path.relative(ROOT, f);
  const lines = readUtf8(f).split(/\r?\n/);
  lines.forEach((line, i) => {
    if (line.includes('terminology-ok')) return;
    for (const [re, name] of forbidden) {
      if (re.test(line)) add('금지 용어', name, `${rel}:${i + 1}`);
    }
  });
}

// settlement gauge table '수렴' as stage label
if (/\['잔류',\s*'수렴'/.test(content)) {
  add('KDS 용어 주의', '수렴 (표 헤더)', '침하계 데이터 표에 단독 「수렴」열 — KDS 의미(계측값 수렴)와 혼동 가능');
}

// LVDT in images
if (imagesJs.includes('LVDT')) {
  add('이미지 파일명', 'LVDT', 'IMG-040 파일명에 LVDT — 화면 용어는 변위계여야 함');
}

// JSON-LD address
if (index.includes('4층 403호') && index.includes('"streetAddress": "가산디지털1로 84, 403호"')) {
  add('회사정보 불일치', '본사 주소', '본문·연락처: 4층 403호 / JSON-LD: 층 없이 403호만');
}

// Company brochures
for (const name of ['25년 12월 지명원-(주)신계측기술정보.pdf', '241226 지명원_신계측기술정보.pdf']) {
  const t = pdfTexts[name] || '';
  if (!t) continue;
  const checks = [
    ['황인섭', '대표이사'],
    ['E-09-006550', '엔지니어링사업자'],
    ['108-81-66678', '사업자등록번호'],
    ['가산디지털', '본사 주소'],
    ['복용동로', '지사 주소'],
    ['865', '전화']
  ];
  for (const [needle, label] of checks) {
    if (t.includes(needle) && !index.includes(needle.replace('865', '865'))) {
      if (needle === '865' && index.includes('865-2188')) continue;
      add('지명원 vs 홈페이지', label, `${name}에 있으나 index.html 검색 불일치 가능`);
    }
  }
  // ISO / patents from brochure
  if (/ISO\s*9001|ISO9001/i.test(t) && !/ISO/i.test(index)) {
    add('지명원 vs 홈페이지', 'ISO 인증', `${name}에 ISO 언급, index 인증 섹션에 ISO 미표기`);
  }
  if (/특허\s*\d|제\d+호/.test(t)) {
    const patentNums = [...t.matchAll(/제\s*(\d{6,})호/g)].map((m) => m[1]);
    const missing = patentNums.filter((n) => !index.includes(n));
    if (missing.length) {
      add('지명원 vs 홈페이지', '특허 번호', `지명원 특허 ${missing.slice(0, 3).join(', ')}… index 미반영`);
    }
  }
}

// Boilerplate
const bp = '인접 센서(지중경사계, 하중계, 지하수위계, 간극수압계 등)와의 동시 변화';
const bpCount = (content.match(new RegExp(bp.replace(/[()]/g, '\\$&'), 'g')) || []).length;
if (bpCount > 10) {
  add('콘텐츠 품질', '보일러플레이트', `분야별 페이지에 동일 문단 ${bpCount}회 반복 — KDS/KCS 맞춤 서술 부족`);
}

// KCS ground vs website scope
const kcsGround = pdfTexts['KCS 11 10 15 시공 중 지반계측_(25. 12. 24).pdf'] || '';
if (kcsGround.includes('계측책임자') && !content.includes('계측책임자')) {
  add('KCS 용어 누락', '계측책임자', 'KCS 1.3에 정의, 기술자료 본문에 거의 미사용');
}

// inclinometer dual path
add('구조/운영', '지중경사계 이중 콘텐츠', '/homepage/sensors/inclinometer/ 정적 페이지 + SPA — 동기화·canonical 분리');

// validate term guide vs book PDF count
if (!fs.existsSync(path.join(BOOK, 'KDS 11 10 15 지반계측(25.12).pdf'))) {
  add('book 자산', 'KDS PDF', '파일 누락');
}

const outPath = path.join(ROOT, 'docs', 'book-consistency-audit.json');
fs.writeFileSync(outPath, JSON.stringify({ generated: new Date().toISOString(), issue_count: issues.length, issues }, null, 2), 'utf8');
console.log('Wrote', outPath);
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`- [${i.cat}] ${i.item}: ${i.detail}`));
