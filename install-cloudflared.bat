@echo off
setlocal
set "ROOT_DIR=%~dp0"
powershell -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\install_cloudflared.ps1"
