# DEPRECATED — injects git stash + reset --hard. Use git-sync.bat (newest-wins) instead.
# See scripts/deprecated/git-sync-patch-README.md
import sys

path = sys.argv[1]

with open(path, 'rb') as f:
    data = f.read()

old = b'echo [1/5] Pull latest source...\r\ngit pull origin %BRANCH%\r\nif errorlevel 1 (\r\n  echo [ERROR] git pull failed.\r\n  exit /b 1\r\n)'

new = b"""echo [1/5] Pull latest source...

REM === Auto-resolve: clean stale merge state and pull with local-first ===

REM 1a) Abort any stale merge (ignores error if none)
git merge --abort 2>nul

REM 1b) Stash local uncommitted changes (ignores error if nothing to stash)
git stash push -m "git-sync-auto-stash" 2>nul

REM 1c) Pull with --strategy-option=ours (local wins on conflict)
git pull origin %BRANCH% --strategy-option=ours
if errorlevel 1 (
  echo [WARN] git pull with merge failed. Trying rebase strategy...
  git pull origin %BRANCH% --rebase --strategy-option=ours
)
if errorlevel 1 (
  echo [WARN] All pull strategies failed. Fetching and resetting to origin/%BRANCH%...
  git fetch origin %BRANCH%
  git reset --hard origin/%BRANCH%
)

REM 1d) Restore stashed changes (ignores error if no stash)
git stash pop 2>nul"""

if old not in data:
    print('ERROR: old text not found in file!')
    sys.exit(1)

data = data.replace(old, new, 1)

with open(path, 'wb') as f:
    f.write(data)

print('SUCCESS: git-sync.bat updated.')
