@echo off
setlocal
set "ROOT_DIR=%~dp0"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

cd /d "%FRONTEND_DIR%"
call npm.cmd run cap:sync
if errorlevel 1 exit /b 1
