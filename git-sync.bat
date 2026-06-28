@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ============================================================
REM NMTI website git sync helper
REM - Pulls latest main branch every 60 seconds.
REM - Press R during wait to run immediately.
REM - Press Q to quit.
REM - If a non-webp image with the same base name as an existing .webp
REM   exists, it replaces the .webp target.
REM
REM Example:
REM   assets\images\technology\IMG-008_xxx.webp exists
REM   assets\images\technology\IMG-008_xxx.png is pulled from git
REM   -> this script converts/copies IMG-008_xxx.png to IMG-008_xxx.webp
REM
REM Conversion order:
REM   1) If source binary is already WebP, copy directly.
REM   2) If ImageMagick 'magick' exists, convert to WebP.
REM   3) If 'cwebp' exists, convert to WebP.
REM   4) Otherwise, warn and keep the current .webp unchanged.
REM ============================================================

set "BRANCH=main"
set "WAIT_SECONDS=60"
set "IMAGE_ROOT=assets\images\technology"
set "RUN_BUILD=1"
set "RUN_VERIFY=0"

cd /d "%~dp0"

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
echo [2/5] Replace matching WebP files from same-name image sources...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "$root = Join-Path (Get-Location) '%IMAGE_ROOT%';" ^
  "if (!(Test-Path $root)) { Write-Host '[SKIP] image root not found:' $root; exit 0 }" ^
  "$exts = @('.png','.jpg','.jpeg','.bmp','.tif','.tiff','.avif','.webp.new','.new','.src');" ^
  "$magick = (Get-Command magick -ErrorAction SilentlyContinue);" ^
  "$cwebp = (Get-Command cwebp -ErrorAction SilentlyContinue);" ^
  "$changed = 0;" ^
  "$sources = Get-ChildItem $root -Recurse -File | Where-Object { $n=$_.Name.ToLowerInvariant(); ($exts | ForEach-Object { $n.EndsWith($_) }) -contains $true };" ^
  "foreach ($src in $sources) {" ^
  "  $name = $src.Name;" ^
  "  $base = $null;" ^
  "  foreach ($e in $exts) { if ($name.ToLowerInvariant().EndsWith($e)) { $base = $name.Substring(0, $name.Length - $e.Length); break } }" ^
  "  if ([string]::IsNullOrWhiteSpace($base)) { continue }" ^
  "  $target = Join-Path $src.DirectoryName ($base + '.webp');" ^
  "  if (!(Test-Path $target)) { continue }" ^
  "  if ($src.FullName -ieq $target) { continue }" ^
  "  $bytes = [System.IO.File]::ReadAllBytes($src.FullName);" ^
  "  $isWebp = $bytes.Length -ge 12 -and [Text.Encoding]::ASCII.GetString($bytes,0,4) -eq 'RIFF' -and [Text.Encoding]::ASCII.GetString($bytes,8,4) -eq 'WEBP';" ^
  "  $backup = $target + '.bak';" ^
  "  Copy-Item $target $backup -Force;" ^
  "  try {" ^
  "    if ($isWebp) {" ^
  "      Copy-Item $src.FullName $target -Force;" ^
  "      Write-Host ('[WEBP] copied ' + $src.FullName + ' -> ' + $target);" ^
  "      Remove-Item $backup -Force -ErrorAction SilentlyContinue;" ^
  "      $changed++;" ^
  "      continue;" ^
  "    }" ^
  "    if ($magick) {" ^
  "      & magick $src.FullName -quality 92 $target;" ^
  "      if ($LASTEXITCODE -ne 0) { throw 'magick conversion failed' }" ^
  "      Write-Host ('[WEBP] magick converted ' + $src.FullName + ' -> ' + $target);" ^
  "      Remove-Item $backup -Force -ErrorAction SilentlyContinue;" ^
  "      $changed++;" ^
  "      continue;" ^
  "    }" ^
  "    if ($cwebp) {" ^
  "      & cwebp -q 92 $src.FullName -o $target;" ^
  "      if ($LASTEXITCODE -ne 0) { throw 'cwebp conversion failed' }" ^
  "      Write-Host ('[WEBP] cwebp converted ' + $src.FullName + ' -> ' + $target);" ^
  "      Remove-Item $backup -Force -ErrorAction SilentlyContinue;" ^
  "      $changed++;" ^
  "      continue;" ^
  "    }" ^
  "    Move-Item $backup $target -Force;" ^
  "    Write-Host ('[WARN] matching source found but no converter: ' + $src.FullName);" ^
  "  } catch {" ^
  "    if (Test-Path $backup) { Move-Item $backup $target -Force }" ^
  "    Write-Host ('[ERROR] failed to replace ' + $target + ' from ' + $src.FullName + ': ' + $_.Exception.Message);" ^
  "  }" ^
  "}" ^
  "Write-Host ('[WEBP] replacements: ' + $changed);"
if errorlevel 1 (
  echo [ERROR] image replacement failed.
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
