param(
    [Parameter(Mandatory = $true)]
    [string] $AppConfig
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $AppConfig)) {
    exit 1
}

$content = Get-Content -LiteralPath $AppConfig -Raw

if ($content -notmatch 'apiBaseUrl:\s*"(?<api>https://[^"]+)"') {
    exit 1
}

$apiBaseUrl = $Matches["api"].TrimEnd("/")
$healthUrl = "$apiBaseUrl/health"
$streamUrl = "$apiBaseUrl/ask-stream"

try {
    $response = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 15 -Headers @{
        "User-Agent" = "ByronzReleaseValidator/1.0"
        "Accept" = "application/json"
    }
} catch {
    Write-Host "Health check gagal untuk $healthUrl"
    Write-Host $_.Exception.Message
    exit 1
}

if ($null -eq $response -or $response.status -ne "ok") {
    Write-Host "Health check tidak valid untuk $healthUrl"
    Write-Host "Respons yang diterima tidak mengandung status=ok"
    exit 1
}

try {
    $preflightHeaders = & curl.exe -sS -D - -o NUL -X OPTIONS $streamUrl `
        -H "Origin: capacitor://localhost" `
        -H "Access-Control-Request-Method: POST" `
        -H "Access-Control-Request-Headers: content-type" `
        -H "User-Agent: ByronzReleaseValidator/1.0" `
        -H "Accept: */*"
    if ($LASTEXITCODE -ne 0) {
        throw "curl gagal memeriksa preflight CORS"
    }
} catch {
    Write-Host "Preflight CORS gagal untuk $streamUrl"
    Write-Host $_.Exception.Message
    exit 1
}

$rawPreflightHeaders = [string]::Join("`n", @($preflightHeaders))
$allowOriginMatch = [regex]::Match($rawPreflightHeaders, "(?im)^access-control-allow-origin:\s*(.+)$")
$allowOrigin = if ($allowOriginMatch.Success) { $allowOriginMatch.Groups[1].Value.Trim() } else { "" }
if (-not $allowOrigin -or ($allowOrigin -ne "*" -and $allowOrigin -ne "capacitor://localhost")) {
    Write-Host "CORS belum siap untuk aplikasi mobile Byronz."
    Write-Host "Header Access-Control-Allow-Origin saat ini: $allowOrigin"
    exit 1
}

exit 0
