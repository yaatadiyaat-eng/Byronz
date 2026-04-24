$ErrorActionPreference = "Stop"

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$releaseRoot = Join-Path $repoRoot "release\Byronz-Android-Live"
$urlPath = Join-Path $repoRoot "public-backend-url.txt"
$apkPath = Join-Path $repoRoot "frontend\android\app\build\outputs\apk\release\app-release.apk"
$aabPath = Join-Path $repoRoot "frontend\android\app\build\outputs\bundle\release\app-release.aab"
$notesPath = Join-Path $releaseRoot "README-LIVE.txt"
$publicUrl = $null

function Invoke-CmdStep {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Command,

        [Parameter(Mandatory = $true)]
        [string] $Description
    )

    Write-Host ""
    Write-Host "==> $Description"
    cmd /c $Command
    if ($LASTEXITCODE -ne 0) {
        throw "Langkah gagal: $Description"
    }
}

function Get-OllamaModels {
    try {
        $payload = Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/tags" -Method Get -TimeoutSec 8
    } catch {
        return @()
    }

    return @($payload.models | ForEach-Object { $_.name }) | Where-Object { $_ }
}

function Ensure-ByronzModel {
    $existingModels = Get-OllamaModels
    $preferredModels = @("qwen2.5:1.5b", "mistral:latest", "llama3:latest")

    foreach ($model in $preferredModels) {
        if ($existingModels -contains $model) {
            Write-Host "Model Ollama siap: $model"
            return
        }
    }

    Write-Host "Belum ada model Byronz yang siap. Mengunduh qwen2.5:1.5b..."
    & ollama pull qwen2.5:1.5b
    if ($LASTEXITCODE -ne 0) {
        throw "Gagal mengunduh model qwen2.5:1.5b"
    }
}

Ensure-ByronzModel

Invoke-CmdStep -Command "`"$repoRoot\start-public-backend-tunnel.bat`"" -Description "Menyalakan backend HTTPS publik Byronz"

if (-not (Test-Path -LiteralPath $urlPath)) {
    throw "URL backend publik tidak ditemukan di $urlPath"
}

$publicUrl = (Get-Content -LiteralPath $urlPath -Raw).Trim()
if (-not $publicUrl) {
    throw "URL backend publik kosong."
}

Invoke-CmdStep -Command "`"$repoRoot\set-byronz-api.bat`" $publicUrl" -Description "Menyetel aplikasi ke backend publik aktif"
Invoke-CmdStep -Command "`"$repoRoot\verify-production-backend.bat`" $publicUrl" -Description "Memverifikasi backend publik Byronz"
Invoke-CmdStep -Command "`"$repoRoot\build-android-release.bat`"" -Description "Membangun Android release Byronz"

New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
Copy-Item -LiteralPath $apkPath -Destination (Join-Path $releaseRoot "Byronz-live-release.apk") -Force
Copy-Item -LiteralPath $aabPath -Destination (Join-Path $releaseRoot "Byronz-live-release.aab") -Force
Copy-Item -LiteralPath $urlPath -Destination (Join-Path $releaseRoot "backend-url.txt") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "start-public-backend-tunnel.bat") -Destination (Join-Path $releaseRoot "start-public-backend-tunnel.bat") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "stop-public-backend-tunnel.bat") -Destination (Join-Path $releaseRoot "stop-public-backend-tunnel.bat") -Force

$notes = @"
BYRONZ ANDROID LIVE RELEASE
===========================

Backend publik aktif saat paket ini dibuat:
$publicUrl

File penting:
- Byronz-live-release.apk
- Byronz-live-release.aab
- backend-url.txt

Catatan:
1. APK/AAB ini siap dipakai sekarang selama backend publik Byronz tetap hidup.
2. Jika PC ini dimatikan atau tunnel dihentikan, aplikasi mobile akan kehilangan koneksi backend.
3. Untuk menyalakan ulang backend publik, jalankan start-public-backend-tunnel.bat dari root repo atau dari folder release ini.
4. Jika URL tunnel berubah, jalankan build-android-live-release.bat lagi agar APK/AAB memakai URL terbaru.
"@

[System.IO.File]::WriteAllText($notesPath, $notes, [System.Text.UTF8Encoding]::new($false))

Write-Host ""
Write-Host "Byronz Android live release siap:"
Write-Host $releaseRoot
