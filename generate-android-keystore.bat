@echo off
setlocal
set "ROOT_DIR=%~dp0"
powershell -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\generate_android_keystore.ps1"
