param(
    [Parameter(Mandatory = $true)]
    [string]$RenderApiKey,

    [Parameter(Mandatory = $true)]
    [string]$LlamaApiKey,

    [string]$OwnerId = "",
    [string]$RepoUrl = "https://github.com/yaatadiyaat-eng/Byronz.git",
    [string]$ServiceName = "byronz-api",
    [string]$Branch = "main",

    [ValidateSet("starter", "standard", "pro", "pro_plus", "pro_max", "pro_ultra", "free")]
    [string]$Plan = "starter",

    [ValidateSet("singapore", "oregon", "ohio", "virginia", "frankfurt")]
    [string]$Region = "singapore",

    [switch]$SkipLlamaValidation
)

$ErrorActionPreference = "Stop"

function Invoke-RenderApi {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("GET", "POST", "PATCH", "PUT")]
        [string]$Method,

        [Parameter(Mandatory = $true)]
        [string]$Path,

        [object]$Body
    )

    $headers = @{
        Authorization = "Bearer $RenderApiKey"
        Accept = "application/json"
    }

    $params = @{
        Uri         = "https://api.render.com/v1$Path"
        Headers     = $headers
        Method      = $Method
        TimeoutSec  = 120
    }

    if ($null -ne $Body) {
        $params["ContentType"] = "application/json"
        $params["Body"] = ($Body | ConvertTo-Json -Depth 20)
    }

    try {
        return Invoke-RestMethod @params
    } catch {
        $statusCode = $null
        $responseBody = ""

        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
        }

        $message = "Render API gagal untuk $Method $Path"
        if ($statusCode) {
            $message += " (HTTP $statusCode)"
        }
        if ($responseBody) {
            $message += ": $responseBody"
        } else {
            $message += ": $($_.Exception.Message)"
        }

        throw $message
    }
}

function Resolve-OwnerId {
    if ($OwnerId) {
        return $OwnerId
    }

    $owners = Invoke-RenderApi -Method GET -Path "/owners"
    if (-not $owners -or $owners.Count -lt 1) {
        throw "Tidak menemukan workspace Render yang bisa diakses oleh API key ini."
    }

    return $owners[0].owner.id
}

function Test-LlamaApiKeyValue {
    if ($SkipLlamaValidation) {
        Write-Host "Lewati validasi LLAMA API key."
        return
    }

    $headers = @{
        Authorization = "Bearer $LlamaApiKey"
        Accept = "application/json"
    }

    try {
        $response = Invoke-RestMethod -Uri "https://api.llama.com/compat/v1/models" -Headers $headers -Method GET -TimeoutSec 60
    } catch {
        $statusCode = $null
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }

        if ($statusCode -eq 401) {
            throw "LLAMA API key tidak valid atau belum lengkap. Kirim key penuh yang benar sebelum deploy production."
        }

        throw "Validasi LLAMA API key gagal: $($_.Exception.Message)"
    }

    if (-not $response.data -or $response.data.Count -lt 1) {
        throw "LLAMA API key diterima, tetapi endpoint models tidak mengembalikan model yang bisa dipakai."
    }
}

function Get-ExistingService {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ResolvedOwnerId
    )

    $encodedName = [uri]::EscapeDataString($ServiceName)
    $encodedOwner = [uri]::EscapeDataString($ResolvedOwnerId)
    $services = Invoke-RenderApi -Method GET -Path "/services?limit=100&name=$encodedName&ownerId=$encodedOwner"

    foreach ($item in $services) {
        if ($item.service.name -eq $ServiceName) {
            return $item.service
        }
    }

    return $null
}

function Build-ServiceDetails {
    $details = [ordered]@{
        runtime = "python"
        plan = $Plan
        region = $Region
        numInstances = 1
        healthCheckPath = "/health"
        envSpecificDetails = [ordered]@{
            buildCommand = "pip install -r requirements.txt"
            startCommand = "python -m uvicorn main:app --host 0.0.0.0 --port `$PORT --proxy-headers --forwarded-allow-ips='*'"
        }
    }

    if ($Plan -ne "free") {
        $details["disk"] = [ordered]@{
            name = "byronz-data"
            mountPath = "/var/data"
            sizeGB = 1
        }
    }

    return $details
}

function Build-EnvVars {
    return @(
        @{ key = "BYRONZ_LLM_PROVIDER"; value = "openai_compatible" },
        @{ key = "OPENAI_COMPATIBLE_BASE_URL"; value = "https://api.llama.com/compat/v1/" },
        @{ key = "LLAMA_API_KEY"; value = $LlamaApiKey },
        @{ key = "OPENAI_COMPATIBLE_DEFAULT_MODEL"; value = "meta-llama/llama-4-maverick-17b-128e-instruct" },
        @{ key = "OPENAI_COMPATIBLE_MODELS"; value = "meta-llama/llama-4-maverick-17b-128e-instruct|Llama 4 Maverick,meta-llama/llama-4-scout-17b-16e-instruct|Llama 4 Scout" },
        @{ key = "BYRONZ_DB_PATH"; value = "/var/data/chat.db" },
        @{ key = "CORS_ALLOWED_ORIGINS"; value = "capacitor://localhost,http://localhost,http://127.0.0.1" },
        @{ key = "TRUSTED_HOSTS"; value = "*" }
    )
}

function Wait-ForHealth {
    param(
        [Parameter(Mandatory = $true)]
        [string]$BaseUrl
    )

    $healthUrl = "$BaseUrl/health"

    for ($attempt = 1; $attempt -le 60; $attempt++) {
        try {
            $response = Invoke-RestMethod -Uri $healthUrl -Method GET -TimeoutSec 15
            if ($response.status -eq "ok") {
                return $true
            }
        } catch {
        }

        Start-Sleep -Seconds 10
    }

    return $false
}

Test-LlamaApiKeyValue
$resolvedOwnerId = Resolve-OwnerId
$existingService = Get-ExistingService -ResolvedOwnerId $resolvedOwnerId
$serviceDetails = Build-ServiceDetails
$envVars = Build-EnvVars

if ($existingService) {
    Write-Host "Service Render ditemukan:" $existingService.id

    Invoke-RenderApi -Method PATCH -Path "/services/$($existingService.id)" -Body @{
        name = $ServiceName
        repo = $RepoUrl
        autoDeploy = "no"
        branch = $Branch
        rootDir = "backend"
        serviceDetails = $serviceDetails
    } | Out-Null

    Invoke-RenderApi -Method PUT -Path "/services/$($existingService.id)/env-vars" -Body $envVars | Out-Null
    Invoke-RenderApi -Method POST -Path "/services/$($existingService.id)/deploys" -Body @{} | Out-Null

    $service = Invoke-RenderApi -Method GET -Path "/services/$($existingService.id)"
} else {
    Write-Host "Membuat service Render baru:" $ServiceName

    $created = Invoke-RenderApi -Method POST -Path "/services" -Body @{
        type = "web_service"
        name = $ServiceName
        ownerId = $resolvedOwnerId
        repo = $RepoUrl
        autoDeploy = "no"
        branch = $Branch
        rootDir = "backend"
        envVars = $envVars
        serviceDetails = $serviceDetails
    }

    $service = $created.service
}

if (-not $service.url) {
    $service = Invoke-RenderApi -Method GET -Path "/services/$($service.id)"
}

Write-Host "URL Render:" $service.url

if (-not (Wait-ForHealth -BaseUrl $service.url)) {
    throw "Service Render sudah dibuat, tetapi /health belum merespons sukses dalam batas waktu tunggu."
}

Write-Output $service.url
