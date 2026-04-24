$ErrorActionPreference = "Stop"

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$toolsRoot = Join-Path $repoRoot "tools"
$jdkRoot = Join-Path $toolsRoot "jdk-21"
$androidHome = Join-Path $repoRoot "Android\Sdk"
$downloadDir = Join-Path $toolsRoot "downloads"
$cmdlineRoot = Join-Path $androidHome "cmdline-tools"
$cmdlineLatest = Join-Path $cmdlineRoot "latest"
$sdkManager = Join-Path $cmdlineLatest "bin\sdkmanager.bat"

$jdkUrl = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.10%2B7/OpenJDK21U-jdk_x64_windows_hotspot_21.0.10_7.zip"
$cmdlineUrl = "https://dl.google.com/android/repository/commandlinetools-win-14742923_latest.zip"
$jdkZip = Join-Path $downloadDir "temurin-jdk-21.zip"
$cmdlineZip = Join-Path $downloadDir "android-commandlinetools.zip"

New-Item -ItemType Directory -Force -Path $toolsRoot, $downloadDir, $androidHome | Out-Null

function Download-IfMissing {
    param(
        [string] $Url,
        [string] $OutFile
    )

    if ((Test-Path $OutFile) -and ((Get-Item $OutFile).Length -gt 1048576)) {
        Write-Host "Sudah ada: $OutFile"
        return
    }

    Remove-Item $OutFile -Force -ErrorAction SilentlyContinue
    Write-Host "Mengunduh $Url"
    & curl.exe --location --fail --retry 5 --retry-delay 3 --output $OutFile $Url
    if ($LASTEXITCODE -ne 0) {
        throw "Download gagal: $Url"
    }

    if ((Get-Item $OutFile).Length -le 1048576) {
        throw "Download tidak valid atau terlalu kecil: $OutFile"
    }
}

if (-not (Test-Path (Join-Path $jdkRoot "bin\java.exe"))) {
    Download-IfMissing -Url $jdkUrl -OutFile $jdkZip
    $tempJdk = Join-Path $toolsRoot "jdk-21-extract"
    Remove-Item $tempJdk -Recurse -Force -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Force -Path $tempJdk | Out-Null
    Expand-Archive -Path $jdkZip -DestinationPath $tempJdk -Force
    $extractedJdk = Get-ChildItem $tempJdk -Directory | Select-Object -First 1
    Remove-Item $jdkRoot -Recurse -Force -ErrorAction SilentlyContinue
    Move-Item -Path $extractedJdk.FullName -Destination $jdkRoot
    Remove-Item $tempJdk -Recurse -Force -ErrorAction SilentlyContinue
}

if (-not (Test-Path $sdkManager)) {
    Download-IfMissing -Url $cmdlineUrl -OutFile $cmdlineZip
    $tempCmdline = Join-Path $toolsRoot "android-cmdline-extract"
    Remove-Item $tempCmdline -Recurse -Force -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Force -Path $tempCmdline | Out-Null
    Expand-Archive -Path $cmdlineZip -DestinationPath $tempCmdline -Force
    Remove-Item $cmdlineLatest -Recurse -Force -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Force -Path $cmdlineRoot | Out-Null
    Move-Item -Path (Join-Path $tempCmdline "cmdline-tools") -Destination $cmdlineLatest
    Remove-Item $tempCmdline -Recurse -Force -ErrorAction SilentlyContinue
}

$env:JAVA_HOME = $jdkRoot
$env:ANDROID_HOME = $androidHome
$env:ANDROID_SDK_ROOT = $androidHome
$env:Path = "$jdkRoot\bin;$cmdlineLatest\bin;$androidHome\platform-tools;$env:Path"

Write-Host "Menerima lisensi Android SDK..."
1..20 | ForEach-Object { "y" } | & $sdkManager --sdk_root=$androidHome --licenses | Out-Host

Write-Host "Memasang Android SDK packages..."
& $sdkManager --sdk_root=$androidHome "platform-tools" "platforms;android-35" "build-tools;35.0.0"

Write-Host ""
Write-Host "Toolchain Android siap."
Write-Host "JAVA_HOME=$jdkRoot"
Write-Host "ANDROID_HOME=$androidHome"
