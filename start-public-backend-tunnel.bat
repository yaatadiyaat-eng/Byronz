@echo off
setlocal
set "ROOT_DIR=%~dp0"
powershell -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\start_public_backend_tunnel.ps1"
