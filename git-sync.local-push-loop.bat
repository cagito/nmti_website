@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul 2>&1

rem Git Sync loop — fetch → pull → push → 대기 → 반복
rem .git 본체: C:\ProgramSource\nmti_homepage_website\.git (X: 포인터)
rem 사용: git-sync.bat [간격_초]   (기본 60초)

set "INTERVAL=60"
if not "%~1"=="" set "INTERVAL=%~1"

cd /d "%~dp0"
if errorlevel 1 (
  echo ERROR: cannot cd to repo root
  exit /b 1
)

echo.
echo === Git sync loop: %cd% ===
echo === interval: !INTERVAL! sec ^(Ctrl+C to stop^) ===
echo.

:loop
echo.
echo ========================================
echo [%date% %time%] sync cycle start
echo ========================================

set "OK=1"

echo [1/3] git fetch
git fetch origin
if errorlevel 1 set "OK=0"

if "!OK!"=="1" (
  echo.
  echo [2/3] git pull --ff-only
  git pull --ff-only
  if errorlevel 1 (
    echo pull failed — merge/rebase 필요. 다음 주기에 재시도.
    set "OK=0"
  )
)

if "!OK!"=="1" (
  echo.
  echo [3/3] git push
  git push
  if errorlevel 1 set "OK=0"
)

echo.
git status -sb
if "!OK!"=="1" (
  echo OK: sync cycle complete
) else (
  echo WARN: sync cycle had errors — will retry
)

echo.
echo waiting !INTERVAL! sec...
timeout /t !INTERVAL! /nobreak >nul
goto loop
