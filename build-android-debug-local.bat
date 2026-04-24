@echo off
setlocal
set "ROOT_DIR=%~dp0"

set "API_URL=%~1"
if "%API_URL%"=="" set "API_URL=http://127.0.0.1:8000"

powershell -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\build_android_debug_local.ps1" -ApiBaseUrl "%API_URL%"
