with open('git-sync', 'rb') as f:
    data = f.read()

print(f'Total bytes: {len(data)}')
print(f'Contains \\n: {b"\\n" in data}')
print(f'Contains \\r\\n: {b"\\r\\n" in data}')
print()

# Find the pull section
idx = data.find(b'Pull latest source')
if idx >= 0:
    chunk = data[idx:idx+500]
    print('--- Around "Pull latest source" ---')
    print(chunk.decode('utf-8', errors='replace'))
else:
    print('"Pull latest source" NOT FOUND!')
    print()
    print('--- First 1000 bytes ---')
    print(data[:1000].decode('utf-8', errors='replace'))
