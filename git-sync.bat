@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ============================================================
REM NMTI website git sync helper
REM - Pulls latest main branch every 60 seconds.
REM - Press R during wait to run immediately.
REM - Press Q to quit.
REM - Image transfer rule:
REM     ChatGPT uploads text staging files such as *.webp.b64.part001.
REM     git-sync merges parts and decodes them into same-name *.webp files locally.
REM - This script does NOT render images on every sync cycle.
REM ============================================================

set "BRANCH=main"
set "WAIT_SECONDS=60"
set "IMAGE_ROOT=assets\images\technology"
set "RUN_BUILD=1"
set "RUN_VERIFY=0"
set "DELETE_STAGING_AFTER_APPLY=0"

cd /d "%~dp0"
if errorlevel 1 (
  echo [ERROR] cannot cd to repo root.
  exit /b 1
)

:LOOP
call :RUN_ONCE

echo.
echo [WAIT] %WAIT_SECONDS% seconds. Press R = run now, Q = quit.
choice /C RQ /N /T %WAIT_SECONDS% /D R /M ""
if errorlevel 2 goto END
goto LOOP

:RUN_ONCE
echo.
echo ============================================================
echo [%date% %time%] git-sync start
echo ============================================================

echo [1/5] Pull latest source...
git pull origin %BRANCH%
if errorlevel 1 (
  echo [ERROR] git pull failed.
  exit /b 1
)

echo.
echo [2/5] Decode text-based WebP staging files...
if "%DELETE_STAGING_AFTER_APPLY%"=="1" (
  powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\apply-webp-staging.ps1" -ImageRoot "%IMAGE_ROOT%" -DeleteAfterApply
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\apply-webp-staging.ps1" -ImageRoot "%IMAGE_ROOT%"
)
if errorlevel 1 (
  echo [ERROR] image staging failed.
  exit /b 1
)

echo.
echo [3/5] Install npm dependencies if node_modules is missing...
if not exist "node_modules" (
  npm install
  if errorlevel 1 (
    echo [WARN] npm install failed. Continue.
  )
)

echo.
echo [4/5] Build images...
if "%RUN_BUILD%"=="1" (
  npm run build:images
  if errorlevel 1 (
    echo [WARN] npm run build:images failed. Continue.
  )
) else (
  echo [SKIP] RUN_BUILD=0
)

echo.
echo [5/5] Verify content...
if "%RUN_VERIFY%"=="1" (
  npm run verify:content
  if errorlevel 1 (
    echo [WARN] npm run verify:content failed. Continue.
  )
) else (
  echo [SKIP] RUN_VERIFY=0
)

echo.
echo [STATUS]
git status --short

echo.
echo [%date% %time%] git-sync done
exit /b 0

:END
echo.
echo git-sync stopped.
endlocal
exit /b 0
