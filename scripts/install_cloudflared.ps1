$ErrorActionPreference = "Stop"

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$toolRoot = Join-Path $repoRoot "tools\cloudflared"
$cloudflaredExe = Join-Path $toolRoot "cloudflared.exe"
$downloadUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"

New-Item -ItemType Directory -Force -Path $toolRoot | Out-Null

if (Test-Path $cloudflaredExe) {
    Write-Host "Cloudflared sudah tersedia: $cloudflaredExe"
    exit 0
}

$tempFile = Join-Path $toolRoot "cloudflared.download.exe"
Remove-Item -LiteralPath $tempFile -Force -ErrorAction SilentlyContinue

Write-Host "Mengunduh Cloudflared..."
& curl.exe --location --fail --retry 5 --retry-delay 3 --output $tempFile $downloadUrl
if ($LASTEXITCODE -ne 0) {
    throw "Gagal mengunduh Cloudflared."
}

if ((Get-Item $tempFile).Length -le 1048576) {
    throw "Download Cloudflared terlihat tidak valid."
}

Move-Item -LiteralPath $tempFile -Destination $cloudflaredExe -Force

Write-Host "Cloudflared siap: $cloudflaredExe"
