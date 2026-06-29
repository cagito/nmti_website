import glob, re

# Find docs with "설치 위치", "4. 설치", etc.
for f in sorted(glob.glob('docs/*.md')):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    if '설치 위치' in content or '4. 설치' in content or '설치 및 유의' in content:
        # Show matching lines
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if '설치 위치' in line or '4. 설치' in line or '설치 및 유의' in line:
                print(f'{f}:L{i+1}: {line.strip()[:80]}')

print('---')
# Also check ImageWorks dir
for f in sorted(glob.glob('ImageWorks/**/*.md', recursive=True)):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    if '설치 위치' in content or '설치 및 유의' in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if '설치 위치' in line or '설치 및 유의' in line:
                print(f'{f}:L{i+1}: {line.strip()[:80]}')
