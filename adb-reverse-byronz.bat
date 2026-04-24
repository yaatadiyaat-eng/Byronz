@echo off
setlocal
set "ROOT_DIR=%~dp0"
set "ANDROID_HOME=%ROOT_DIR%Android\Sdk"
set "PATH=%ANDROID_HOME%\platform-tools;%PATH%"

adb reverse tcp:8000 tcp:8000
if errorlevel 1 (
  echo Gagal membuat adb reverse. Pastikan HP tersambung, USB debugging aktif, dan izin debugging diterima.
  exit /b 1
)

echo ADB reverse aktif: perangkat Android dapat mengakses backend PC melalui http://127.0.0.1:8000
