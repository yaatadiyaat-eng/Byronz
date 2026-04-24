@echo off
setlocal
set "ROOT_DIR=%~dp0"

if "%~1"=="" (
  echo Gunakan: "%ROOT_DIR%set-byronz-api.bat" https://api.domain-anda.com
  exit /b 1
)

powershell -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\set_byronz_api.ps1" -ApiBaseUrl "%~1"
