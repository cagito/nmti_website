@echo off

setlocal EnableExtensions EnableDelayedExpansion



REM ============================================================

REM NMTI website git sync helper (newest-wins)

REM - Syncs local and origin/main by per-file timestamp (newest wins).

REM - Auto commit + push when local is newer. Backup before remote overwrite.

REM - No git reset --hard, no stash.

REM - Press R during wait to run immediately. Press Q to quit.

REM - WebP staging: *.webp.b64.part* -> decode to *.webp

REM - Strong mode (default): uncommitted never take-remote · ±2min ambiguous skip · no FTP mtime
REM - Opt-out: set GIT_SYNC_AGGRESSIVE=1 or pass --aggressive to sync:git
REM - Override: GIT_SYNC_FORCE_REMOTE=1 (dangerous — remote over uncommitted)

REM

REM Env: GIT_SYNC_AUTO_COMMIT GIT_SYNC_AUTO_PUSH GIT_SYNC_DRY_RUN RUN_BUILD

REM ============================================================



set "BRANCH=main"

set "WAIT_SECONDS=60"

set "IMAGE_ROOT=assets\images\technology"

set "RUN_BUILD=auto"

set "RUN_VERIFY=0"

set "DELETE_STAGING_AFTER_APPLY=0"



if not defined GIT_SYNC_AUTO_COMMIT set "GIT_SYNC_AUTO_COMMIT=1"

if not defined GIT_SYNC_AUTO_PUSH set "GIT_SYNC_AUTO_PUSH=1"

if not defined GIT_SYNC_CONSERVATIVE set "GIT_SYNC_CONSERVATIVE=1"

if not defined GIT_SYNC_AMBIGUITY_SEC set "GIT_SYNC_AMBIGUITY_SEC=120"



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

echo [%date% %time%] git-sync start (newest-wins)

echo ============================================================



echo [1/6] Newest-wins git sync...

node ".\scripts\git-sync-newest.mjs"

set "SYNC_RC=!ERRORLEVEL!"

if !SYNC_RC! equ 2 (

  echo [WARN] merge/rebase in progress — resolve manually, then retry.

  exit /b 2

)

if !SYNC_RC! equ 3 (

  echo [WARN] workspace lock held — see npm run lock:status

  exit /b 3

)

if !SYNC_RC! neq 0 (

  echo [ERROR] git-sync-newest failed.

  exit /b 1

)



echo.

echo [2/6] Decode text-based WebP staging files...

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

echo [3/6] Install npm dependencies if node_modules is missing...

if not exist "node_modules" (

  npm install

  if errorlevel 1 (

    echo [WARN] npm install failed. Continue.

  )

)



echo.

echo [4/6] Build images (conditional)...

set "DO_BUILD=0"

if /I "%RUN_BUILD%"=="1" set "DO_BUILD=1"

if /I "%RUN_BUILD%"=="auto" (

  node ".\scripts\git-sync-should-build.mjs"

  if not errorlevel 1 set "DO_BUILD=1"

)

if "!DO_BUILD!"=="1" (

  npm run build:images

  if errorlevel 1 (

    echo [WARN] npm run build:images failed. Continue.

  )

) else (

  echo [SKIP] RUN_BUILD=%RUN_BUILD% — no image/registry changes this cycle

)



echo.

echo [5/6] Verify content...

if "%RUN_VERIFY%"=="1" (

  npm run verify:content

  if errorlevel 1 (

    echo [WARN] npm run verify:content failed. Continue.

  )

) else (

  echo [SKIP] RUN_VERIFY=0

)



echo.

echo [6/6] Status

git status -sb



echo.

echo [%date% %time%] git-sync done

exit /b 0



:END

echo.

echo git-sync stopped.

endlocal

exit /b 0

