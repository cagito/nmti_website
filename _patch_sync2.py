import sys

path = 'git-sync'
with open(path, 'rb') as f:
    data = f.read()

old = (
    b'  echo "[1/5] Pull latest source..."\r\n'
    b'  if ! git pull origin "$BRANCH"; then\r\n'
    b'    echo "[ERROR] git pull failed."\r\n'
    b'    return 1\r\n'
    b'  fi\r\n'
    b'\r\n'
    b'  apply_text_staging || return 1'
)

new = (
    b'  echo "Pull latest source..."\r\n'
    b'\r\n'
    b'  # === Auto-resolve: clean stale merge state and pull with local-first ===\r\n'
    b'\r\n'
    b'  # 1a) Abort any stale merge (ignores error if none)\r\n'
    b'  git merge --abort 2>/dev/null\r\n'
    b'\r\n'
    b'  # 1b) Stash local uncommitted changes (ignores error if nothing to stash)\r\n'
    b'  git stash push -m "git-sync-auto-stash" 2>/dev/null\r\n'
    b'\r\n'
    b'  # 1c) Pull with --strategy-option=ours (local wins on conflict)\r\n'
    b'  if ! git pull origin "$BRANCH" --strategy-option=ours; then\r\n'
    b'    echo "[WARN] git pull with merge failed. Trying rebase strategy..."\r\n'
    b'    git pull origin "$BRANCH" --rebase --strategy-option=ours\r\n'
    b'  fi\r\n'
    b'  if ! git pull origin "$BRANCH" --strategy-option=ours 2>/dev/null; then\r\n'
    b'    echo "[WARN] All pull strategies failed. Fetching and resetting to origin/$BRANCH..."\r\n'
    b'    git fetch origin "$BRANCH"\r\n'
    b'    git reset --hard "origin/$BRANCH"\r\n'
    b'  fi\r\n'
    b'\r\n'
    b'  # 1d) Restore stashed changes (ignores error if no stash)\r\n'
    b'  git stash pop 2>/dev/null\r\n'
    b'\r\n'
    b'  echo\r\n'
    b'  echo "[2/5] Decode text-based WebP staging files..."\r\n'
    b'  apply_text_staging || return 1'
)

print(f'File size: {len(data)} bytes')

idx = data.find(old)
print(f'Old text found at byte: {idx}')

if idx < 0:
    print('ERROR: old text not found!')
    idx2 = data.find(b'[1/5]')
    if idx2 >= 0:
        chunk = data[idx2:idx2+120]
        print('Found context:', repr(chunk))
    sys.exit(1)

data = data.replace(old, new, 1)

with open(path, 'wb') as f:
    f.write(data)

print(f'SUCCESS: written {len(data)} bytes')

import sys

path = sys.argv[1]

with open(path, 'rb') as f:
    data = f.read()

old = b'  echo "[1/5] Pull latest source..."\r\n  if ! git pull origin "$BRANCH"; then\r\n    echo "[ERROR] git pull failed."\r\n    return 1\r\n  fi\r\n\r\n  apply_text_staging || return 1'

new = b"""  echo "Pull latest source..."

  # === Auto-resolve: clean stale merge state and pull with local-first ===

  # 1a) Abort any stale merge (ignores error if none)
  git merge --abort 2>/dev/null

  # 1b) Stash local uncommitted changes (ignores error if nothing to stash)
  git stash push -m "git-sync-auto-stash" 2>/dev/null

  # 1c) Pull with --strategy-option=ours (local wins on conflict)
  if ! git pull origin "$BRANCH" --strategy-option=ours; then
    echo "[WARN] git pull with merge failed. Trying rebase strategy..."
    git pull origin "$BRANCH" --rebase --strategy-option=ours
  fi
  if ! git pull origin "$BRANCH" --strategy-option=ours 2>/dev/null; then
    echo "[WARN] All pull strategies failed. Fetching and resetting to origin/$BRANCH..."
    git fetch origin "$BRANCH"
    git reset --hard "origin/$BRANCH"
  fi

  # 1d) Restore stashed changes (ignores error if no stash)
  git stash pop 2>/dev/null

  echo
  echo "[2/5] Decode text-based WebP staging files..."
  apply_text_staging || return 1"""

if old not in data:
    print('ERROR: old text not found in bash file!')
    sys.exit(1)

data = data.replace(old, new, 1)

with open(path, 'wb') as f:
    f.write(data)

print('SUCCESS: git-sync (bash) updated.')

