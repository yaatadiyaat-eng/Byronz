param(
    [Parameter(Mandatory = $true)]
    [string] $ApiBaseUrl
)

$ErrorActionPreference = "Stop"

if ($ApiBaseUrl -notmatch "^https://") {
    throw "Untuk release publik, URL backend wajib memakai HTTPS. Contoh: https://api.byronz.app"
}

$normalizedUrl = $ApiBaseUrl.TrimEnd("/")
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$configPath = Join-Path $repoRoot "frontend\app-config.js"

$content = @"
window.BYRONZ_CONFIG = Object.freeze({
  // Example: "https://api.byronz.app"
  // For Android/iOS release builds distributed to many users, this value must point to your public HTTPS backend.
  // Leave empty to use the same host in production or localhost during local development.
  apiBaseUrl: "$normalizedUrl"
});
"@

for ($attempt = 1; $attempt -le 8; $attempt++) {
    try {
        [System.IO.File]::WriteAllText(
            $configPath,
            $content,
            [System.Text.UTF8Encoding]::new($false)
        )
        Write-Host "apiBaseUrl Byronz sudah diset ke $normalizedUrl"
        exit 0
    } catch {
        if ($attempt -eq 8) {
            throw
        }
        Start-Sleep -Milliseconds 350
    }
}

Write-Host "apiBaseUrl Byronz sudah diset ke $normalizedUrl"
