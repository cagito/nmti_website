@echo off
setlocal EnableExtensions

REM ============================================================
REM NMTI 기술자료 Figure 워터마크 일괄 적용 (WATERMARK-01)
REM - AI/CAD/GenerateImage 생성 단계에는 로고·워터마크 넣지 않음 (docs/183)
REM - 원본 보관: assets/images/technology/original/ (최초 1회, 덮어쓰기 없음)
REM - 배포본은 original/ 또는 source/ 에서 읽어 워터마크 합성
REM
REM 사용법:
REM   watermark-figures.bat              배포본만 (technology/ 루트)
REM   watermark-figures.bat all          배포본 + source/
REM   watermark-figures.bat force        이미 처리된 파일도 재적용
REM   watermark-figures.bat dry-run      대상 목록만 출력
REM   watermark-figures.bat 002 force    IMG-002 1건만
REM ============================================================

chcp 65001 >nul
cd /d "%~dp0"
if errorlevel 1 (
  echo [ERROR] 저장소 루트로 이동할 수 없습니다.
  exit /b 1
)

set "PY="
where python >nul 2>&1 && set "PY=python"
if not defined PY where py >nul 2>&1 && set "PY=py -3"
if not defined PY (
  echo [ERROR] Python이 필요합니다. pip install Pillow cairosvg
  exit /b 1
)

set "ARGS="
set "MODE=deployed"

:PARSE
if "%~1"=="" goto RUN
if /I "%~1"=="all" (
  set "ARGS=%ARGS% --all"
  set "MODE=deployed+source"
  shift
  goto PARSE
)
if /I "%~1"=="source" (
  set "ARGS=%ARGS% --include-source"
  set "MODE=deployed+source"
  shift
  goto PARSE
)
if /I "%~1"=="force" (
  set "ARGS=%ARGS% --force"
  shift
  goto PARSE
)
if /I "%~1"=="dry-run" (
  set "ARGS=%ARGS% --dry-run"
  shift
  goto PARSE
)
echo %~1| findstr /R "^IMG-[0-9][0-9][0-9]$" >nul && (
  set "ARGS=%ARGS% --id %~1"
  shift
  goto PARSE
)
echo %~1| findstr /R "^[0-9][0-9][0-9]$" >nul && (
  set "ARGS=%ARGS% --id IMG-%~1"
  shift
  goto PARSE
)
if /I "%~1"=="help" (
  goto HELP
)
if /I "%~1"=="-h" (
  goto HELP
)
if /I "%~1"=="--help" (
  goto HELP
)
echo [WARN] 알 수 없는 옵션: %~1
shift
goto PARSE

:RUN
echo [watermark] mode=%MODE%
%PY% scripts\apply-figure-watermark.py %ARGS%
set "EC=%ERRORLEVEL%"
if not "%EC%"=="0" (
  echo [FAIL] exit %EC%
  exit /b %EC%
)
echo [OK] 워터마크 적용 완료
exit /b 0

:HELP
echo.
echo watermark-figures.bat [옵션...]
echo.
echo   (없음)     technology/ 배포 WebP만
echo   all        배포본 + source/ 전체
echo   source     source/ 포함 (all과 동일)
echo   force      manifest 무시하고 재적용
echo   dry-run    파일 목록만 출력
echo.
echo 예: watermark-figures.bat all force
exit /b 0
