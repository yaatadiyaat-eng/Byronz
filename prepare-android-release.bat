@echo off
setlocal
set "ROOT_DIR=%~dp0"
set "JAVA_HOME=%ROOT_DIR%tools\jdk-21"
set "ANDROID_HOME=%ROOT_DIR%Android\Sdk"
set "ANDROID_SDK_ROOT=%ROOT_DIR%Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%"

cd /d "%ROOT_DIR%frontend"
call npm.cmd run build
if errorlevel 1 exit /b 1
call npx.cmd cap sync android
if errorlevel 1 exit /b 1
echo Byronz Android sudah disiapkan untuk release.
echo Lanjutkan dengan Android Studio atau jalankan "%ROOT_DIR%build-android-release.bat"
