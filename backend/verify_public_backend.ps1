param(
    [Parameter(Mandatory = $true)]
    [string] $ApiBaseUrl,

    [string] $AllowedOrigin = "capacitor://localhost"
)

$ErrorActionPreference = "Stop"

function Assert-JsonResponse {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Url,

        [string] $ExpectedProperty,
        [string] $ExpectedValue
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 15 -Headers @{
            "User-Agent" = "ByronzDeployCheck/1.0"
            "Accept" = "application/json"
        }
    } catch {
        $statusCode = $null
        if ($_.Exception.Response) {
            $statusCode = [int] $_.Exception.Response.StatusCode
        }
        if ($statusCode) {
            throw "Endpoint $Url gagal dengan HTTP $statusCode. Pastikan domain API tidak diblokir Cloudflare/WAF dan backend Byronz benar-benar aktif."
        }
        throw "Endpoint $Url gagal diakses. $($_.Exception.Message)"
    }

    $contentType = [string] $response.Headers["Content-Type"]
    if ($contentType -notmatch "application/json") {
        throw "Endpoint $Url tidak mengembalikan JSON. Content-Type saat ini: $contentType"
    }

    $payload = $response.Content | ConvertFrom-Json
    if ($ExpectedProperty) {
        $actualValue = $payload.$ExpectedProperty
        if ($ExpectedValue -and $actualValue -ne $ExpectedValue) {
            throw "Endpoint $Url valid JSON, tetapi nilai $ExpectedProperty = '$actualValue', bukan '$ExpectedValue'"
        }
    }

    return $payload
}

function Assert-CorsPreflight {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Url,

        [Parameter(Mandatory = $true)]
        [string] $Origin,

        [Parameter(Mandatory = $true)]
        [string] $Method
    )

    try {
        $responseHeaders = & curl.exe -sS -D - -o NUL -X OPTIONS $Url `
            -H "Origin: $Origin" `
            -H "Access-Control-Request-Method: $Method" `
            -H "Access-Control-Request-Headers: content-type" `
            -H "User-Agent: ByronzDeployCheck/1.0" `
            -H "Accept: */*"
        if ($LASTEXITCODE -ne 0) {
            throw "curl gagal memeriksa preflight CORS"
        }
    } catch {
        throw "Preflight CORS ke $Url gagal. $($_.Exception.Message)"
    }

    $rawHeaders = [string]::Join("`n", @($responseHeaders))
    $allowOriginMatch = [regex]::Match($rawHeaders, "(?im)^access-control-allow-origin:\s*(.+)$")
    $allowOrigin = if ($allowOriginMatch.Success) { $allowOriginMatch.Groups[1].Value.Trim() } else { "" }
    if (-not $allowOrigin) {
        throw "Preflight CORS ke $Url tidak mengembalikan header Access-Control-Allow-Origin"
    }

    if ($allowOrigin -ne "*" -and $allowOrigin -ne $Origin) {
        throw "Preflight CORS ke $Url mengembalikan origin '$allowOrigin', bukan '$Origin' atau '*'"
    }

    $allowMethodsMatch = [regex]::Match($rawHeaders, "(?im)^access-control-allow-methods:\s*(.+)$")
    $allowMethods = if ($allowMethodsMatch.Success) { $allowMethodsMatch.Groups[1].Value.Trim() } else { "" }
    if ($allowMethods -and $allowMethods -notmatch "(^|,\s*)$Method($|,\s*)") {
        throw "Preflight CORS ke $Url tidak mengizinkan method $Method"
    }
}

$normalizedBaseUrl = $ApiBaseUrl.TrimEnd("/")
$healthUrl = "$normalizedBaseUrl/health"
$modelsUrl = "$normalizedBaseUrl/models"
$streamUrl = "$normalizedBaseUrl/ask-stream"

Write-Host "Memeriksa health endpoint..."
$healthPayload = Assert-JsonResponse -Url $healthUrl -ExpectedProperty "status" -ExpectedValue "ok"
Write-Host "[OK] /health -> $($healthPayload.status)"

Write-Host "Memeriksa model endpoint..."
$modelsPayload = Assert-JsonResponse -Url $modelsUrl
if ($null -eq $modelsPayload.models) {
    throw "Endpoint $modelsUrl tidak mengembalikan field 'models'"
}
Write-Host "[OK] /models tersedia"

Write-Host "Memeriksa preflight CORS untuk endpoint stream..."
Assert-CorsPreflight -Url $streamUrl -Origin $AllowedOrigin -Method "POST"
Write-Host "[OK] CORS preflight untuk /ask-stream lolos"

Write-Host ""
Write-Host "Backend publik Byronz siap dipakai release production."
