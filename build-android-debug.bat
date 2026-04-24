@echo off
setlocal
set "ROOT_DIR=%~dp0"
set "JAVA_HOME=%ROOT_DIR%tools\jdk-21"
set "ANDROID_HOME=%ROOT_DIR%Android\Sdk"
set "ANDROID_SDK_ROOT=%ROOT_DIR%Android\Sdk"

set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%"

if not exist "%JAVA_HOME%\bin\java.exe" (
  call "%ROOT_DIR%install-android-toolchain.bat"
  if errorlevel 1 exit /b 1
)

if not exist "%ANDROID_HOME%\platforms\android-35" (
  call "%ROOT_DIR%install-android-toolchain.bat"
  if errorlevel 1 exit /b 1
)

call "%ROOT_DIR%prepare-android-release.bat"
if errorlevel 1 exit /b 1

cd /d "%ROOT_DIR%frontend\android"
call gradlew.bat assembleDebug
if errorlevel 1 exit /b 1

echo.
echo APK debug Byronz siap:
echo %ROOT_DIR%frontend\android\app\build\outputs\apk\debug\app-debug.apk
