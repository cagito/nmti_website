@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ============================================================
REM NMTI website git sync helper
REM - Pulls latest main branch every 60 seconds.
REM - Press R during wait to run immediately.
REM - Press Q to quit.
REM - Uses text-based image staging files, not binary PNG/JPG files.
REM - Runs managed image renderers only when source is newer or output is missing.
REM ============================================================

set "BRANCH=main"
set "WAIT_SECONDS=60"
set "IMAGE_ROOT=assets\images\technology"
set "RUN_BUILD=1"
set "RUN_VERIFY=0"
set "DELETE_STAGING_AFTER_APPLY=0"

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

echo [1/6] Pull latest source...
git pull origin %BRANCH%
if errorlevel 1 (
  echo [ERROR] git pull failed.
  exit /b 1
)

echo.
echo [2/6] Apply text-based WebP staging files...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "$root = Join-Path (Get-Location) '%IMAGE_ROOT%';" ^
  "$deleteAfterApply = '%DELETE_STAGING_AFTER_APPLY%' -eq '1';" ^
  "if (!(Test-Path $root)) { Write-Host '[SKIP] image root not found:' $root; exit 0 }" ^
  "$suffixes = @('.webp.b64','.webp.txt','.img64','.b64');" ^
  "$changed = 0;" ^
  "$sources = Get-ChildItem $root -Recurse -File | Where-Object { $n=$_.Name.ToLowerInvariant(); ($suffixes | ForEach-Object { $n.EndsWith($_) }) -contains $true };" ^
  "foreach ($src in $sources) {" ^
  "  $name = $src.Name;" ^
  "  $lower = $name.ToLowerInvariant();" ^
  "  $base = $null;" ^
  "  foreach ($s in $suffixes) { if ($lower.EndsWith($s)) { $base = $name.Substring(0, $name.Length - $s.Length); break } }" ^
  "  if ([string]::IsNullOrWhiteSpace($base)) { continue }" ^
  "  $target = Join-Path $src.DirectoryName ($base + '.webp');" ^
  "  if (!(Test-Path $target)) { Write-Host ('[SKIP] no matching webp target: ' + $target); continue }" ^
  "  try {" ^
  "    $b64 = [System.IO.File]::ReadAllText($src.FullName, [Text.Encoding]::UTF8);" ^
  "    $b64 = ($b64 -replace '\s','');" ^
  "    if ([string]::IsNullOrWhiteSpace($b64)) { throw 'empty base64 staging file' }" ^
  "    $bytes = [Convert]::FromBase64String($b64);" ^
  "    $isWebp = $bytes.Length -ge 12 -and [Text.Encoding]::ASCII.GetString($bytes,0,4) -eq 'RIFF' -and [Text.Encoding]::ASCII.GetString($bytes,8,4) -eq 'WEBP';" ^
  "    if (!$isWebp) { throw 'decoded bytes are not WebP RIFF/WEBP' }" ^
  "    $backup = $target + '.bak';" ^
  "    Copy-Item $target $backup -Force;" ^
  "    try {" ^
  "      [System.IO.File]::WriteAllBytes($target, $bytes);" ^
  "      Remove-Item $backup -Force -ErrorAction SilentlyContinue;" ^
  "      if ($deleteAfterApply) { Remove-Item $src.FullName -Force -ErrorAction SilentlyContinue }" ^
  "      Write-Host ('[WEBP] applied text staging ' + $src.FullName + ' -> ' + $target);" ^
  "      $changed++;" ^
  "    } catch {" ^
  "      if (Test-Path $backup) { Move-Item $backup $target -Force }" ^
  "      throw" ^
  "    }" ^
  "  } catch {" ^
  "    Write-Host ('[ERROR] failed staging file ' + $src.FullName + ': ' + $_.Exception.Message);" ^
  "  }" ^
  "}" ^
  "Write-Host ('[WEBP] staged replacements: ' + $changed);"
if errorlevel 1 (
  echo [ERROR] image staging failed.
  exit /b 1
)

echo.
echo [3/6] Render managed images only if needed...
if exist "scripts\render-managed-images.py" (
  python scripts\render-managed-images.py
  if errorlevel 1 (
    py -3 scripts\render-managed-images.py
  )
  if errorlevel 1 (
    echo [WARN] managed image renderer failed. Continue.
  )
) else (
  echo [SKIP] scripts\render-managed-images.py not found
)

echo.
echo [4/6] Install npm dependencies if node_modules is missing...
if not exist "node_modules" (
  npm install
  if errorlevel 1 (
    echo [WARN] npm install failed. Continue.
  )
)

echo.
echo [5/6] Build images...
if "%RUN_BUILD%"=="1" (
  npm run build:images
  if errorlevel 1 (
    echo [WARN] npm run build:images failed. Continue.
  )
) else (
  echo [SKIP] RUN_BUILD=0
)

echo.
echo [6/6] Verify content...
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
