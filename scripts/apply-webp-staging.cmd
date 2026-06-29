@echo off
powershell.exe -NoProfile -ep Bypass -File "%~dp0apply-webp-staging.ps1" %*
