$ErrorActionPreference = "Stop"

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$frontendAndroid = Join-Path $repoRoot "frontend\android"
$javaHome = Join-Path $repoRoot "tools\jdk-21"
$keytool = Join-Path $javaHome "bin\keytool.exe"
$keystorePath = Join-Path $frontendAndroid "release-keystore.jks"
$propertiesPath = Join-Path $frontendAndroid "keystore.properties"

function Convert-SecureStringToPlainText {
    param([securestring] $SecureValue)

    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        if ($bstr -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
        }
    }
}

if (-not (Test-Path $keytool)) {
    throw "keytool belum ditemukan. Jalankan install-android-toolchain.bat terlebih dahulu."
}

if ((Test-Path $keystorePath) -or (Test-Path $propertiesPath)) {
    $answer = Read-Host "Release keystore/properties sudah ada. Timpa? ketik YES untuk lanjut"
    if ($answer -ne "YES") {
        Write-Host "Dibatalkan. File release lama tetap aman."
        exit 0
    }
}

$alias = Read-Host "Masukkan key alias release (contoh: byronz-release)"
if ([string]::IsNullOrWhiteSpace($alias)) {
    $alias = "byronz-release"
}

$storePasswordSecure = Read-Host "Masukkan password keystore minimal 6 karakter" -AsSecureString
$keyPasswordSecure = Read-Host "Masukkan password key minimal 6 karakter" -AsSecureString
$storePassword = Convert-SecureStringToPlainText $storePasswordSecure
$keyPassword = Convert-SecureStringToPlainText $keyPasswordSecure

if ($storePassword.Length -lt 6 -or $keyPassword.Length -lt 6) {
    throw "Password Android release harus minimal 6 karakter."
}

Remove-Item -LiteralPath $keystorePath -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $propertiesPath -Force -ErrorAction SilentlyContinue

& $keytool -genkeypair `
    -v `
    -keystore $keystorePath `
    -alias $alias `
    -keyalg RSA `
    -keysize 2048 `
    -validity 3650 `
    -storepass $storePassword `
    -keypass $keyPassword `
    -dname "CN=Byronz, OU=Byronz, O=Byronz, L=Jakarta, ST=Indonesia, C=ID"

if ($LASTEXITCODE -ne 0) {
    throw "Gagal membuat Android release keystore."
}

@"
storeFile=release-keystore.jks
storePassword=$storePassword
keyAlias=$alias
keyPassword=$keyPassword
"@ | Set-Content -LiteralPath $propertiesPath -Encoding ASCII

Write-Host ""
Write-Host "Release signing Byronz siap:"
Write-Host $keystorePath
Write-Host $propertiesPath
Write-Host ""
Write-Host "Simpan password dan file .jks ini baik-baik. Kunci ini dibutuhkan untuk update aplikasi di masa depan."
