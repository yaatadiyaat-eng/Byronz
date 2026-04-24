@echo off
setlocal
set "ROOT_DIR=%~dp0"
set "JAVA_HOME=%ROOT_DIR%tools\jdk-21"
set "ANDROID_HOME=%ROOT_DIR%Android\Sdk"
set "ANDROID_SDK_ROOT=%ROOT_DIR%Android\Sdk"
set "APP_CONFIG=%ROOT_DIR%frontend\app-config.js"
set "KEYSTORE_PROPERTIES=%ROOT_DIR%frontend\android\keystore.properties"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%"

powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\validate_release_config.ps1" -AppConfig "%APP_CONFIG%"
if errorlevel 1 (
  echo Backend publik Byronz belum lolos validasi production.
  echo Syarat release publik:
  echo 1. app-config.js harus memakai apiBaseUrl HTTPS publik
  echo 2. endpoint /health harus merespons JSON {"status":"ok"}
  echo 3. domain tidak boleh tertahan Cloudflare challenge atau WAF untuk request API biasa
  echo Cara set backend: "%ROOT_DIR%set-byronz-api.bat" https://api.domain-anda.com
  exit /b 1
)

if not exist "%JAVA_HOME%\bin\java.exe" (
  echo Toolchain Android portable belum siap.
  echo Menyiapkan toolchain sekarang...
  call "%ROOT_DIR%install-android-toolchain.bat"
  if errorlevel 1 exit /b 1
)

if not exist "%ANDROID_HOME%\platforms\android-35" (
  echo Android SDK API 35 belum siap.
  echo Menyiapkan Android SDK sekarang...
  call "%ROOT_DIR%install-android-toolchain.bat"
  if errorlevel 1 exit /b 1
)

if not exist "%KEYSTORE_PROPERTIES%" (
  echo File signing belum ada: %KEYSTORE_PROPERTIES%
  echo Salin dulu dari "%ROOT_DIR%frontend\android\keystore.properties.example" lalu isi data keystore Anda.
  exit /b 1
)

call "%ROOT_DIR%prepare-android-release.bat"
if errorlevel 1 exit /b 1

cd /d "%ROOT_DIR%frontend\android"
call gradlew.bat bundleRelease
if errorlevel 1 exit /b 1
call gradlew.bat assembleRelease
if errorlevel 1 exit /b 1

echo.
echo Build release selesai.
echo AAB: %ROOT_DIR%frontend\android\app\build\outputs\bundle\release\app-release.aab
echo APK: %ROOT_DIR%frontend\android\app\build\outputs\apk\release\app-release.apk
