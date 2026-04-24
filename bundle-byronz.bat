@echo off
setlocal
set "ROOT_DIR=%~dp0"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "BACKEND_DIR=%ROOT_DIR%backend"

cd /d "%FRONTEND_DIR%"
call npm.cmd run build
if errorlevel 1 exit /b 1

cd /d "%BACKEND_DIR%"
if exist ".venv\Scripts\python.exe" (
  call ".venv\Scripts\python.exe" sync_frontend_dist.py
) else (
  py -3 sync_frontend_dist.py
  if errorlevel 1 python sync_frontend_dist.py
)
if errorlevel 1 exit /b 1
