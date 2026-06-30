# Deprecated — do not use

These scripts patched `git-sync.bat` with **git stash** and **`git reset --hard`**.
That caused local changes and unpushed commits to be lost.

**Use instead:** `git-sync.bat` + `scripts/git-sync-newest.mjs` (newest-wins, no stash/reset).

Files kept for history only:

- `_patch_sync.py`
- `_patch_sync2.py`
- `_f.py`
