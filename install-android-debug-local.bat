@echo off
setlocal
set "ROOT_DIR=%~dp0"

set "ANDROID_HOME=%ROOT_DIR%Android\Sdk"
set "PATH=%ANDROID_HOME%\platform-tools;%PATH%"
set "APK_PATH=%ROOT_DIR%frontend\android\app\build\outputs\apk\debug\app-debug-local.apk"

if not exist "%APK_PATH%" (
  call "%ROOT_DIR%build-android-debug-local.bat"
  if errorlevel 1 exit /b 1
)

adb get-state >nul 2>nul
if errorlevel 1 (
  echo Tidak ada perangkat Android aktif.
  echo Sambungkan HP, aktifkan USB debugging, lalu terima izin debugging di HP.
  exit /b 1
)

call "%ROOT_DIR%adb-reverse-byronz.bat"
if errorlevel 1 exit /b 1

adb install -r "%APK_PATH%"
if errorlevel 1 exit /b 1

echo Byronz berhasil dipasang ke perangkat Android.
