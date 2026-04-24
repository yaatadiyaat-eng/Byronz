@echo off
setlocal
set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"

cd /d "%BACKEND_DIR%"

if not exist ".venv\Scripts\python.exe" (
  echo Menyiapkan environment Byronz...
  python -m venv .venv || py -3.12 -m venv .venv
)

call ".venv\Scripts\python.exe" -c "import fastapi, uvicorn" >nul 2>nul
if errorlevel 1 (
  echo Memasang dependensi backend Byronz...
  call ".venv\Scripts\python.exe" -m pip install --upgrade pip
  call ".venv\Scripts\python.exe" -m pip install -r requirements.txt
)

call ".venv\Scripts\python.exe" launcher.py
