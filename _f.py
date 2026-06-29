with open('git-sync', 'rb') as f:
    data = bytearray(f.read())

old = b'  echo "[1/5] Pull latest source..."\r\n  if ! git pull origin "$BRANCH"; then\r\n    echo "[ERROR] git pull failed."\r\n    return 1\r\n  fi\r\n\r\n  apply_text_staging || return 1'

new = b'  echo "Pull latest source..."\r\n\r\n  # === Auto-resolve: clean stale merge state and pull with local-first ===\r\n\r\n  # 1a) Abort any stale merge (ignores error if none)\r\n  git merge --abort 2>/dev/null\r\n\r\n  # 1b) Stash local uncommitted changes (ignores error if nothing to stash)\r\n  git stash push -m "git-sync-auto-stash" 2>/dev/null\r\n\r\n  # 1c) Pull with --strategy-option=ours (local wins on conflict)\r\n  if ! git pull origin "$BRANCH" --strategy-option=ours; then\r\n    echo "[WARN] git pull with merge failed. Trying rebase strategy..."\r\n    git pull origin "$BRANCH" --rebase --strategy-option=ours\r\n  fi\r\n  if ! git pull origin "$BRANCH" --strategy-option=ours 2>/dev/null; then\r\n    echo "[WARN] All pull strategies failed. Fetching and resetting to origin/$BRANCH..."\r\n    git fetch origin "$BRANCH"\r\n    git reset --hard "origin/$BRANCH"\r\n  fi\r\n\r\n  # 1d) Restore stashed changes (ignores error if no stash)\r\n  git stash pop 2>/dev/null\r\n\r\n  echo\r\n  echo "[2/5] Decode text-based WebP staging files..."\r\n  apply_text_staging || return 1'

idx = data.find(old)
print('Old found at:', idx)
if idx < 0:
    print('ERROR: old not found!')
    exit(1)

data[idx:idx+len(old)] = new

with open('git-sync', 'wb') as f:
    f.write(data)

print('SUCCESS: patched', len(data), 'bytes')

