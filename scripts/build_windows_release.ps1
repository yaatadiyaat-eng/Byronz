$ErrorActionPreference = "Stop"

$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$frontendRoot = Join-Path $root "frontend"
$backendRoot = Join-Path $root "backend"
$releaseRoot = Join-Path $root "release"
$packageName = "Byronz-Windows"
$packageDir = Join-Path $releaseRoot $packageName
$frontendPackage = Get-Content (Join-Path $frontendRoot "package.json") -Raw | ConvertFrom-Json
$packageVersion = if ($frontendPackage.version) { $frontendPackage.version } else { "dev" }
$zipPath = Join-Path $releaseRoot "Byronz-Windows-v$packageVersion.zip"

function Assert-PathInside {
    param(
        [string] $Path,
        [string] $Parent
    )

    $parentFull = [System.IO.Path]::GetFullPath($Parent)
    $pathFull = [System.IO.Path]::GetFullPath($Path)

    if (-not $pathFull.StartsWith($parentFull, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Target path tidak aman: $pathFull"
    }
}

New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
Assert-PathInside -Path $packageDir -Parent $releaseRoot
Assert-PathInside -Path $zipPath -Parent $releaseRoot

Write-Host "Membangun frontend Byronz..."
Push-Location $frontendRoot
try {
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend build gagal."
    }
}
finally {
    Pop-Location
}

Write-Host "Menyalin frontend build ke backend..."
Push-Location $backendRoot
try {
    & ".\.venv\Scripts\python.exe" "sync_frontend_dist.py"
    if ($LASTEXITCODE -ne 0) {
        throw "Sync frontend-dist gagal."
    }
}
finally {
    Pop-Location
}

Remove-Item -LiteralPath $packageDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $packageDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $packageDir "backend") | Out-Null

$backendPackageDir = Join-Path $packageDir "backend"
$backendDirs = @("ai_modules", "api", "core", "database", "frontend-dist", "memory", "router")
$backendFiles = @(
    ".env.example",
    ".env.production.example",
    "DEPLOY.md",
    "Dockerfile",
    "docker-compose.yml",
    "launcher.py",
    "main.py",
    "nginx-byronz.conf.example",
    "requirements.txt",
    "sync_frontend_dist.py"
)

foreach ($dir in $backendDirs) {
    $source = Join-Path $backendRoot $dir
    if (Test-Path $source) {
        Copy-Item -LiteralPath $source -Destination $backendPackageDir -Recurse -Force
    }
}

foreach ($file in $backendFiles) {
    $source = Join-Path $backendRoot $file
    if (Test-Path $source) {
        Copy-Item -LiteralPath $source -Destination $backendPackageDir -Force
    }
}

Copy-Item -LiteralPath (Join-Path $root "PRIVACY_POLICY_DRAFT.md") -Destination $packageDir -Force
Copy-Item -LiteralPath (Join-Path $root "PUBLISHING_CHECKLIST.md") -Destination $packageDir -Force

@'
@echo off
setlocal

set "APP_DIR=%~dp0"
set "BACKEND_DIR=%APP_DIR%backend"
cd /d "%BACKEND_DIR%"

where python >nul 2>nul
if errorlevel 1 (
  where py >nul 2>nul
  if errorlevel 1 (
    echo Python belum terpasang. Install Python 3.12+ terlebih dahulu, lalu jalankan Byronz lagi.
    pause
    exit /b 1
  )
)

if not exist ".venv\Scripts\python.exe" (
  echo Menyiapkan runtime Byronz...
  py -3 -m venv .venv || python -m venv .venv
)

call ".venv\Scripts\python.exe" -m pip install --upgrade pip
call ".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
  echo Gagal memasang dependency Byronz. Pastikan koneksi internet aktif untuk setup pertama.
  pause
  exit /b 1
)

call ".venv\Scripts\python.exe" launcher.py
'@ | Set-Content -LiteralPath (Join-Path $packageDir "Byronz.bat") -Encoding ASCII

@'
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.Run """" & scriptDir & "\Byronz.bat" & """", 1, False
'@ | Set-Content -LiteralPath (Join-Path $packageDir "Byronz.vbs") -Encoding ASCII

@'
# Byronz Windows Portable

Jalankan Byronz.bat untuk membuka Byronz di Windows.

## Kebutuhan

- Windows 10/11
- Python 3.12 atau lebih baru
- Ollama sudah terpasang agar AI offline bisa menjawab
- Model Ollama seperti `llama3` atau `mistral`

## Cara pakai

1. Ekstrak folder ini.
2. Jalankan `Byronz.bat`.
3. Tunggu setup pertama selesai.
4. Browser akan terbuka otomatis ke Byronz.

## Catatan

- Setup pertama butuh internet untuk memasang dependency Python.
- Setelah dependency terpasang, Byronz bisa berjalan secara lokal/offline selama Ollama dan model AI sudah tersedia.
- File chat lokal disimpan di folder backend.
'@ | Set-Content -LiteralPath (Join-Path $packageDir "README_WINDOWS.md") -Encoding UTF8

Remove-Item -LiteralPath $zipPath -Force -ErrorAction SilentlyContinue
Get-ChildItem -LiteralPath $packageDir -Recurse -Directory -Filter "__pycache__" |
    Remove-Item -Recurse -Force

$packageItems = Get-ChildItem -LiteralPath $packageDir -Force
Compress-Archive -Path $packageItems.FullName -DestinationPath $zipPath -Force

if (-not (Test-Path $zipPath)) {
    throw "ZIP release gagal dibuat: $zipPath"
}

Write-Host ""
Write-Host "Paket Windows Byronz siap:"
Write-Host $packageDir
Write-Host $zipPath
