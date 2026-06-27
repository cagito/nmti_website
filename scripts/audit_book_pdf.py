# -*- coding: utf-8 -*-
import json, re, os, sys
from pathlib import Path
from pypdf import PdfReader

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(r'x:\website\homepage')
BOOK = ROOT / 'book'
issues = []

def add(cat, item, detail):
    issues.append({'cat': cat, 'item': item, 'detail': detail})

def leaf_chunk(content: str, node_id: str, limit: int = 15000) -> str:
    """LEAVES block in content-data.js (not sources-only string entry)."""
    marker = f'"{node_id}": {{'
    idx = content.find(marker)
    if idx < 0:
        return ''
    return content[idx : idx + limit]


def png_path_for(content: str, img_id: str) -> str:
    m = re.search(rf'"{re.escape(img_id)}"[^}}]*?"png":\s*"([^"]+)"', content, re.S)
    return m.group(1) if m else ''


def read_utf8(p):
    return Path(p).read_text(encoding='utf-8')

pdf_texts = {}
for p in sorted(BOOK.glob('*.pdf')):
    try:
        r = PdfReader(str(p))
        pdf_texts[p.name] = '\n'.join((page.extract_text() or '') for page in r.pages)
    except Exception as e:
        pdf_texts[p.name] = ''
        add('PDF 읽기', p.name, str(e))

dictionary = read_utf8(ROOT / 'js/technology/dictionary.js')
content = read_utf8(ROOT / 'js/technology/content-data.js')
index = read_utf8(ROOT / 'index.html')
term_guide = read_utf8(BOOK / 'KDS-KCS_용어기준.md')
images_js = read_utf8(ROOT / 'js/technology/images.js')

tunnel_section = dictionary.split('fields/tunnel')[1].split('fields/bridge')[0]
tunnel_child_labels = re.findall(r"label: '([^']+)'", tunnel_section)

kds_tunnel_required = [
    ('지표 및 지중침하', 'surface-subsidence'),
    ('막장전방 선행변위', 'face-advance'),
    ('강지보 응력', 'steel-support'),
]
for term, slug in kds_tunnel_required:
    if f'fields/tunnel/{slug}' not in dictionary:
        add('KDS 4.1.5 터널 항목 누락', term, f'트리 리프 fields/tunnel/{slug} 없음')

if 'fields/tunnel/blast-vibration' not in dictionary:
    add('KDS 4.1.5 선택', '발파진동', 'fields/tunnel/blast-vibration 리프 없음')

if 'fields/dam/river-levee' not in dictionary:
    add('KDS 제방', '하천제방', 'fields/dam/river-levee 리프 없음')

if 'fields/harbor' not in dictionary:
    add('KDS 4.1.8', '항만·호안', 'fields/harbor 트리 없음')

if 'fields/building' not in dictionary:
    add('KCS 3.9', '건축공사', 'fields/building 트리 없음')

if pdf_texts.get('KDS 27 50 10 터널 계측(23.09).pdf') and 'KDS 27 50 10' not in term_guide:
    add('기준서 참조 불일치', 'KDS 27 50 10', 'book PDF 존재, KDS-KCS_용어기준.md 미명시')

bridge_pdf = pdf_texts.get('KCS 24 99 05 교량계측시설(23.09).pdf', '')
dam_pdf = pdf_texts.get('KCS 54 20 25 댐 계측설비(18.08).pdf', '')

def tree_block(dictionary: str, field_id: str, next_field_id: str) -> str:
    """Extract TREE children block between two field category ids."""
    m = re.search(
        rf"id: '{re.escape(field_id)}'[\s\S]*?id: '{re.escape(next_field_id)}'",
        dictionary,
    )
    return m.group(0) if m else ''

bridge_section = tree_block(dictionary, 'fields/bridge', 'fields/slope')
for slug in ['temperature', 'seismic', 'expansion-joint']:
    if bridge_pdf and f'fields/bridge/{slug}' not in bridge_section:
        add('KCS 24 99 05 교량 항목 미분리', slug, 'KCS 대비 트리 리프 없음')

dam_section = tree_block(dictionary, 'fields/dam', 'fields/harbor')
for slug in ['temperature', 'seismic', 'strain', 'tilt']:
    if dam_pdf and f'fields/dam/{slug}' not in dam_section:
        add('KCS 54 20 25 댐 항목 미분리', slug, 'KCS 대비 트리 리프 없음')
# 유량은 fields/dam/leakage(누수)에서 다룸

source_files = list((ROOT / 'scripts/content-data').rglob('*.mjs'))
source_files += [
    ROOT / 'js/technology/content-data.js',
    ROOT / 'index.html',
    ROOT / 'sensors/inclinometer/index.html',
]
forbidden = [
    (r'내공변위[^\\n]{0,20}\(수렴\)', '내공변위(수렴)'),
    (r'1·2·3차 경보', '1·2·3차 경보'),
    (r'1차 관리기준', '1차 관리기준'),
    (r'인클리노미터', '인클리노미터 동일시'),
    (r'진동현식', '진동현식'),
]
for f in source_files:
    rel = str(f.relative_to(ROOT))
    lines = read_utf8(f).splitlines()
    for i, line in enumerate(lines, 1):
        if 'terminology-ok' in line:
            continue
        for pat, name in forbidden:
            if re.search(pat, line):
                add('금지 용어', name, f'{rel}:{i}')

if re.search(r"\['잔류',\s*'수렴'", content):
    add('KDS 용어 주의', '수렴 (표 헤더)', '침하계 데이터 표에 단독 「수렴」열 — KDS 의미와 혼동 가능')

if 'LVDT' in png_path_for(images_js, 'IMG-040').upper():
    add('이미지 파일명', 'LVDT', 'IMG-040 PNG 경로에 LVDT 잔존')

if '"streetAddress": "가산디지털1로 84, 403호"' in index and '4층 403호' in index:
    if '"streetAddress": "가산디지털1로 84, 4층 403호"' not in index:
        add('회사정보 불일치', '본사 주소', 'JSON-LD streetAddress에 4층 누락')

for name in ['25년 12월 지명원-(주)신계측기술정보.pdf', '241226 지명원_신계측기술정보.pdf']:
    t = pdf_texts.get(name, '')
    if not t:
        continue
    if re.search(r'ISO\s*9001|ISO9001', t, re.I) and not re.search(r'ISO', index):
        add('지명원 vs 홈페이지', 'ISO 인증', f'{name}에 ISO 언급, index 인증 섹션에 ISO 미표기')
    patent_nums = [m.group(1) for m in re.finditer(r'제\s*(\d{6,})\s*호', t)]
    missing = [n for n in patent_nums if n not in index]
    if missing:
        add('지명원 vs 홈페이지', '특허 번호', f'{name}: {", ".join(missing[:5])} index 미반영')

bp = '인접 센서(지중경사계, 하중계, 지하수위계, 간극수압계 등)와의 동시 변화'
bp_count = content.count(bp)
if bp_count > 10:
    add('콘텐츠 품질', '보일러플레이트', f'동일 문단 {bp_count}회 반복')

kcs_ground = pdf_texts.get('KCS 11 10 15 시공 중 지반계측_(25. 12. 24).pdf', '')
if '계측책임자' in kcs_ground and '계측책임자' not in content:
    add('KCS 용어 누락', '계측책임자', 'KCS 1.3 정의, 기술자료 본문에 거의 미사용')

gnss_pdf = pdf_texts.get('GNSS.pdf', '')
if gnss_pdf:
    gnss_chunk = leaf_chunk(content, 'sensors/gnss')
    for kw in ('기준국', '이동국', 'RTK', 'GNSS', 'GPS'):
        if kw in gnss_pdf and kw not in gnss_chunk:
            add('GNSS.pdf vs 웹', kw, 'book/GNSS.pdf 키워드 — sensors/gnss 본문 미포함')
    if '/homepage/book/GNSS.pdf' not in gnss_chunk:
        add('GNSS.pdf vs 웹', 'PDF 링크', 'sensors/gnss detailLink·본문 PDF href 누락')
    if 'IMG-043' not in gnss_chunk:
        add('GNSS.pdf vs 웹', 'IMG-043', 'sensors/gnss hero Figure 누락')

# 지중경사계: SPA 요약 + 정적 상세 (의도적 이중 경로). SEO canonical = 정적 페이지.
incl_static = ROOT / 'sensors/inclinometer/index.html'
incl_seo_dup = ROOT / 'technology/sensors/inclinometer/index.html'
sitemap = read_utf8(ROOT / 'sitemap.xml') if (ROOT / 'sitemap.xml').exists() else ''
incl_ok = (
    incl_static.exists()
    and 'detailLink' in content
    and '/homepage/sensors/inclinometer/' in content
    and not incl_seo_dup.exists()
    and '/homepage/sensors/inclinometer/' in sitemap
)
if not incl_ok:
    add('구조/운영', '지중경사계 이중 콘텐츠', 'SPA+정적 canonical 정책 미충족 — detailLink·SKIP_IDS·sitemap 점검')

# Extract brochure business areas
for name in ['25년 12월 지명원-(주)신계측기술정보.pdf']:
    t = pdf_texts.get(name, '')
    if not t:
        continue
    for kw in ['지반조사', '재하시험', '구조안전', '계측관리', '자동화', 'AI']:
        if kw in t and kw not in index:
            add('지명원 vs 홈페이지', f'사업 키워드 {kw}', f'지명원에 있으나 index.html 본문 검색 미매칭')

# KDS shoring - earth pressure vs load cell
if '로드셀' in read_utf8(BOOK / '_kds_kcs_term_extract.json'):
    chunk = leaf_chunk(content, 'fields/retaining-excavation/anchor', 8000)
    if chunk and '로드셀' not in chunk:
        add('KDS 용어', '어스앵커 장력', 'KDS 표4.1-1 앵커=로드셀, 어스앵커 페이지에 로드셀 병기 부족')

# Check certifications section content vs brochure
cert_section = index[index.find('등록·인증·특허'):index.find('등록·인증·특허')+3000] if '등록·인증·특허' in index else ''
if 'SW' in cert_section and 'GS' in t if (t := pdf_texts.get('25년 12월 지명원-(주)신계측기술정보.pdf','')) else False:
    pass

out = ROOT / 'docs' / 'book-consistency-audit.json'
out.write_text(json.dumps({'issue_count': len(issues), 'issues': issues}, ensure_ascii=False, indent=2), encoding='utf-8')
print('Issues:', len(issues))
for i in issues:
    print(f"[{i['cat']}] {i['item']}: {i['detail']}")
