@echo off
setlocal EnableExtensions

REM Fixed Windows git-sync (use: .\scripts\git-sync-win.bat [once])
REM Root git-sync.bat delegates here so pull does not overwrite this file.

set "BRANCH=main"
set "WAIT_SECONDS=60"
set "IMAGE_ROOT=assets\images\technology"
set "RUN_BUILD=1"
set "RUN_VERIFY=0"
set "DELETE_STAGING_AFTER_APPLY=0"
set "STAGING_CMD=%~dp0apply-webp-staging.cmd"

cd /d "%~dp0.."
if errorlevel 1 (
  echo [ERROR] cannot cd to repo root.
  exit /b 1
)

if /I "%~1"=="once" (
  call :RUN_ONCE
  goto END
)

:LOOP
call :RUN_ONCE
if errorlevel 1 echo [WARN] sync cycle had errors; will retry.
call :WAIT_OR_QUIT
if errorlevel 1 goto END
goto LOOP

:WAIT_OR_QUIT
echo.
echo [WAIT] %WAIT_SECONDS% seconds. Press R = run now, Q = quit.
choice /C:RQ /N /T %WAIT_SECONDS% /D R
if errorlevel 2 exit /b 1
exit /b 0

:RUN_ONCE
echo.
echo ============================================================
echo [%date% %time%] git-sync start
echo ============================================================

echo [1/5] Pull latest source...
call :GIT_PULL_SAFE
if errorlevel 1 (
  echo [ERROR] git pull failed.
  exit /b 1
)

echo.
echo [2/5] Decode text-based WebP staging files...
call :APPLY_WEBP_STAGING
if errorlevel 1 (
  echo [ERROR] image staging failed.
  exit /b 1
)

echo.
echo [3/5] Install npm dependencies if node_modules is missing...
if not exist "node_modules" (
  call npm install
  if errorlevel 1 echo [WARN] npm install failed. Continue.
)

echo.
echo [4/5] Build images...
if "%RUN_BUILD%"=="1" (
  call npm run build:images
  if errorlevel 1 echo [WARN] npm run build:images failed. Continue.
) else (
  echo [SKIP] RUN_BUILD=0
)

echo.
echo [5/5] Verify content...
if "%RUN_VERIFY%"=="1" (
  call npm run verify:content
  if errorlevel 1 echo [WARN] npm run verify:content failed. Continue.
) else (
  echo [SKIP] RUN_VERIFY=0
)

echo.
echo [STATUS]
git status --short
echo.
echo [%date% %time%] git-sync done
exit /b 0

:GIT_PULL_SAFE
git merge --abort 2>nul
git stash push -m "git-sync-auto-stash" 2>nul
git pull -X ours origin %BRANCH%
if errorlevel 1 (
  echo [WARN] merge pull failed. Trying rebase...
  git pull --rebase -X ours origin %BRANCH%
)
if errorlevel 1 (
  echo [WARN] pull failed. Resetting to origin/%BRANCH%...
  git fetch origin %BRANCH%
  if errorlevel 1 exit /b 1
  git reset --hard origin/%BRANCH%
  if errorlevel 1 exit /b 1
)
git stash pop 2>nul
exit /b 0

:APPLY_WEBP_STAGING
if not exist "%STAGING_CMD%" (
  echo [ERROR] missing script: %STAGING_CMD%
  exit /b 1
)
if "%DELETE_STAGING_AFTER_APPLY%"=="1" (
  call "%STAGING_CMD%" -ImageRoot "%IMAGE_ROOT%" -DeleteAfterApply
) else (
  call "%STAGING_CMD%" -ImageRoot "%IMAGE_ROOT%"
)
if errorlevel 1 exit /b 1
exit /b 0

:END
echo.
echo git-sync stopped.
endlocal
exit /b 0
