@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "URL_FILE=%ROOT_DIR%public-backend-url.txt"
set "LOCAL_APK=%ROOT_DIR%frontend\android\app\build\outputs\apk\debug\app-debug-local.apk"
set "PUBLIC_APK=%ROOT_DIR%frontend\android\app\build\outputs\apk\debug\app-debug-public.apk"

if not exist "%URL_FILE%" (
  echo URL public backend belum ada.
  echo Jalankan dulu: "%ROOT_DIR%start-public-backend-tunnel.bat"
  exit /b 1
)

set /p API_URL=<"%URL_FILE%"
if "%API_URL%"=="" (
  echo URL public backend kosong.
  exit /b 1
)

call "%ROOT_DIR%build-android-debug-local.bat" "%API_URL%"
if errorlevel 1 exit /b 1

copy /Y "%LOCAL_APK%" "%PUBLIC_APK%" >nul

echo.
echo APK public test Byronz siap:
echo %PUBLIC_APK%
