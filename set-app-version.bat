@echo off
setlocal
set "ROOT_DIR=%~dp0"

if "%~1"=="" (
  echo Gunakan: "%ROOT_DIR%set-app-version.bat" 1.2.1 121
  exit /b 1
)

if "%~2"=="" (
  echo Gunakan: "%ROOT_DIR%set-app-version.bat" 1.2.1 121
  exit /b 1
)

powershell -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\set_app_version.ps1" -VersionName "%~1" -VersionCode "%~2"
