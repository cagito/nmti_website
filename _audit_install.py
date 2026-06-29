"""Audit installation sections across all technology pages."""
import re, os, glob

def find_install_section(html):
    """Extract text content of installation section."""
    # Try various id patterns
    for pattern in [r'id="installation"', r"id='installation'", r'id=installation']:
        m = re.search(pattern, html)
        if m:
            break
    else:
        # Look for section heading with 설치
        for m in re.finditer(r'<h[23][^>]*>[^<]*설치[^<]*</h[23>]', html):
            # Find parent section
            pos = m.start()
            before = html[max(0,pos-500):pos]
            sec = re.search(r'<section', before[::-1])
            if not sec:
                continue
            sec_start = pos - sec.start()
            rest = html[sec_start:]
            sec_end = rest.find('</section>')
            if sec_end > 0:
                inner = rest[:sec_end]
                items = len(re.findall(r'<li[^>]*>', inner))
                text = re.sub(r'<[^>]+>', ' ', inner)
                text = re.sub(r'\s+', ' ', text).strip()
                return {'items': items, 'text': text[:150], 'has_bullets': '<li' in inner}
    return None

# Quick scan
print('=== SENSOR PAGES ===')
count = 0
for d in sorted(glob.glob('technology/sensors/*')):
    f = os.path.join(d, 'index.html')
    if not os.path.exists(f):
        continue
    html = open(f, 'r', encoding='utf-8').read()
    info = find_install_section(html)
    if info:
        print(f'{os.path.basename(d)}: {info["items"]} items, bullets={info["has_bullets"]}')
        count += 1
        if count <= 3:
            print(f'  {info["text"][:100]}')

total_pages = 0
total_items = 0
for root, dirs, files in os.walk('technology'):
    for f in files:
        if f == 'index.html':
            html = open(os.path.join(root, f), 'r', encoding='utf-8').read()
            info = find_install_section(html)
            if info:
                total_pages += 1
                total_items += info['items']

print(f'\n=== TOTAL: {total_pages} pages, {total_items} installation items ===')
