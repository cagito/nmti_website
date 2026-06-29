import os

for name in ['git-sync', 'git-sync.bat']:
    sz = os.path.getsize(name)
    print(f'{name}: {sz} bytes')
    with open(name, 'rb') as f:
        head = f.read(200)
        print(f'  Head: {head[:100]!r}')
    print()
