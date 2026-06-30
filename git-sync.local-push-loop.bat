@echo off
REM Deprecated — use git-sync.bat (newest-wins sync includes push).
echo git-sync.local-push-loop.bat is deprecated.
echo Use git-sync.bat instead ^(newest-wins: fetch, per-file sync, commit, push^).
echo.
call "%~dp0git-sync.bat"
