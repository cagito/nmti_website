import sys

path = sys.argv[1]
with open(path, 'rb') as f:
    data = f.read()

# Show around the target area (line 43-48)
lines = data.split(b'\r\n')
for i in range(42, 49):
    print(f'L{i+1}: {lines[i]!r}')
