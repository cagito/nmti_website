# Find technology content files that have "4." or "설치" sections
import glob, os

# Check content source files
for f in glob.glob('scripts/content-data/*.mjs'):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    if '4.' in content and '설치' in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if '4.' in line and '설치' in line:
                print(f'{f}:L{i+1}: {line.strip()[:120]}')

print('---')
# Also look at generated content
for f in sorted(glob.glob('technology/sensors/*/index.html'))[:3]:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    import re
    # Find section 4 headings
    for m in re.finditer(r'<h[23][^>]*>.*?설치[^<]*</h[23]>', content, re.IGNORECASE):
        print(f'{f}: {m.group()[:100]}')
    # Or look for "4." pattern
    for m in re.finditer(r'[34]\.\s*설치[^<]*', content):
        print(f'{f}: {m.group()[:100]}')
