$ErrorActionPreference = "Stop"

$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$backendRoot = Join-Path $root "backend"
$frontendRoot = Join-Path $root "frontend"
$cloudflaredExe = Join-Path $root "tools\cloudflared\cloudflared.exe"
$localTunnelRoot = Join-Path $root "tools\localtunnel"
$localTunnelEntry = Join-Path $localTunnelRoot "node_modules\localtunnel\bin\lt.js"
$logsRoot = Join-Path $root "logs"
$runtimePath = Join-Path $root "public-backend-runtime.json"
$urlPath = Join-Path $root "public-backend-url.txt"
$backendUrl = "http://127.0.0.1:8000"
$healthUrl = "$backendUrl/health"

New-Item -ItemType Directory -Force -Path $logsRoot | Out-Null

function Test-BackendHealth {
    try {
        $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 2
        return $response.Content -match '"status"\s*:\s*"ok"'
    }
    catch {
        return $false
    }
}

function Test-PublicHealth {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Url
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        return $response.Content -match '"status"\s*:\s*"ok"'
    }
    catch {
        return $false
    }
}

function Get-CombinedLog {
    param(
        [Parameter(Mandatory = $true)]
        [string] $OutPath,

        [Parameter(Mandatory = $true)]
        [string] $ErrPath
    )

    $combinedLog = ""
    if (Test-Path $OutPath) {
        $combinedLog += Get-Content -LiteralPath $OutPath -Raw -ErrorAction SilentlyContinue
    }
    if (Test-Path $ErrPath) {
        $combinedLog += "`n" + (Get-Content -LiteralPath $ErrPath -Raw -ErrorAction SilentlyContinue)
    }

    return $combinedLog
}

function Wait-ForPublicHealth {
    param(
        [Parameter(Mandatory = $true)]
        [System.Diagnostics.Process] $Process,

        [Parameter(Mandatory = $true)]
        [string] $PublicUrl,

        [Parameter(Mandatory = $true)]
        [string] $ErrorLog,

        [int] $MaxSeconds = 120
    )

    $publicHealthUrl = "$PublicUrl/health"
    for ($i = 0; $i -lt $MaxSeconds; $i++) {
        Start-Sleep -Seconds 1

        if ($Process.HasExited) {
            return $false
        }

        if (Test-PublicHealth -Url $publicHealthUrl) {
            return $true
        }
    }

    return $false
}

function Stop-SavedTunnel {
    if (-not (Test-Path $runtimePath)) {
        return
    }

    try {
        $runtime = Get-Content -LiteralPath $runtimePath -Raw | ConvertFrom-Json
        if ($runtime.tunnelPid) {
            Stop-Process -Id ([int] $runtime.tunnelPid) -Force -ErrorAction SilentlyContinue
        }
    }
    catch {
        Write-Host "Runtime lama tidak dapat dibaca, lanjut membuat tunnel baru."
    }
}

function Ensure-Cloudflared {
    if (Test-Path $cloudflaredExe) {
        return
    }

    & (Join-Path $root "install-cloudflared.bat")
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $cloudflaredExe)) {
        throw "Cloudflared belum siap."
    }
}

function Ensure-LocalTunnelCli {
    if (Test-Path $localTunnelEntry) {
        return $localTunnelEntry
    }

    New-Item -ItemType Directory -Force -Path $localTunnelRoot | Out-Null
    & npm.cmd install localtunnel --prefix $localTunnelRoot --no-fund --no-audit
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $localTunnelEntry)) {
        throw "LocalTunnel gagal dipasang."
    }

    return $localTunnelEntry
}

function Start-CloudflareQuickTunnel {
    param(
        [Parameter(Mandatory = $true)]
        [string] $TargetUrl,

        [Parameter(Mandatory = $true)]
        [string] $OutPath,

        [Parameter(Mandatory = $true)]
        [string] $ErrPath
    )

    Ensure-Cloudflared

    $lastTunnelError = "Cloudflare Quick Tunnel tidak berhasil disiapkan."

    for ($attempt = 1; $attempt -le 3; $attempt++) {
        Remove-Item -LiteralPath $OutPath, $ErrPath -Force -ErrorAction SilentlyContinue

        $tunnelProcess = Start-Process `
            -FilePath $cloudflaredExe `
            -ArgumentList @("tunnel", "--url", $TargetUrl, "--no-autoupdate") `
            -RedirectStandardOutput $OutPath `
            -RedirectStandardError $ErrPath `
            -WindowStyle Hidden `
            -PassThru

        $publicUrl = $null
        for ($i = 0; $i -lt 80; $i++) {
            Start-Sleep -Milliseconds 750
            $combinedLog = Get-CombinedLog -OutPath $OutPath -ErrPath $ErrPath
            $match = [regex]::Match($combinedLog, "https://[a-zA-Z0-9-]+\.trycloudflare\.com")
            if ($match.Success) {
                $publicUrl = $match.Value.TrimEnd("/")
                break
            }

            if ($tunnelProcess.HasExited) {
                $lastTunnelError = "Cloudflare Tunnel berhenti sebelum URL dibuat. Cek log: $ErrPath"
                break
            }
        }

        if (-not $publicUrl) {
            if ($tunnelProcess -and -not $tunnelProcess.HasExited) {
                Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue
            }
            continue
        }

        if (Wait-ForPublicHealth -Process $tunnelProcess -PublicUrl $publicUrl -ErrorLog $ErrPath -MaxSeconds 120) {
            return @{
                process = $tunnelProcess
                publicUrl = $publicUrl
                provider = "cloudflare-quick-tunnel"
            }
        }

        $lastTunnelError = "Endpoint publik Byronz belum siap di $publicUrl/health. Cek log: $ErrPath"
        Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue
    }

    throw $lastTunnelError
}

function Start-LocalTunnel {
    param(
        [Parameter(Mandatory = $true)]
        [string] $OutPath,

        [Parameter(Mandatory = $true)]
        [string] $ErrPath
    )

    $ltEntry = Ensure-LocalTunnelCli
    $nodeExe = (Get-Command node.exe -ErrorAction Stop).Source
    $lastTunnelError = "LocalTunnel tidak berhasil disiapkan."

    for ($attempt = 1; $attempt -le 2; $attempt++) {
        Remove-Item -LiteralPath $OutPath, $ErrPath -Force -ErrorAction SilentlyContinue

        $tunnelProcess = Start-Process `
            -FilePath $nodeExe `
            -ArgumentList @($ltEntry, "--port", "8000", "--local-host", "127.0.0.1") `
            -RedirectStandardOutput $OutPath `
            -RedirectStandardError $ErrPath `
            -WindowStyle Hidden `
            -PassThru

        $publicUrl = $null
        for ($i = 0; $i -lt 80; $i++) {
            Start-Sleep -Milliseconds 750
            $combinedLog = Get-CombinedLog -OutPath $OutPath -ErrPath $ErrPath
            $match = [regex]::Match($combinedLog, "https://[a-zA-Z0-9-]+\.loca\.lt")
            if ($match.Success) {
                $publicUrl = $match.Value.TrimEnd("/")
                break
            }

            if ($tunnelProcess.HasExited) {
                $lastTunnelError = "LocalTunnel berhenti sebelum URL dibuat. Cek log: $ErrPath"
                break
            }
        }

        if (-not $publicUrl) {
            if ($tunnelProcess -and -not $tunnelProcess.HasExited) {
                Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue
            }
            continue
        }

        if (Wait-ForPublicHealth -Process $tunnelProcess -PublicUrl $publicUrl -ErrorLog $ErrPath -MaxSeconds 45) {
            return @{
                process = $tunnelProcess
                publicUrl = $publicUrl
                provider = "localtunnel"
            }
        }

        $lastTunnelError = "Endpoint publik Byronz belum siap di $publicUrl/health. Cek log: $ErrPath"
        Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue
    }

    throw $lastTunnelError
}

if (-not (Test-Path (Join-Path $backendRoot ".venv\Scripts\python.exe"))) {
    Push-Location $backendRoot
    try {
        py -3 -m venv .venv
    }
    finally {
        Pop-Location
    }
}

$pythonExe = Join-Path $backendRoot ".venv\Scripts\python.exe"

Push-Location $backendRoot
try {
    & $pythonExe -m pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        throw "Gagal memasang dependency backend."
    }
}
finally {
    Pop-Location
}

if (Test-Path (Join-Path $frontendRoot "package.json")) {
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

    Push-Location $backendRoot
    try {
        & $pythonExe "sync_frontend_dist.py"
        if ($LASTEXITCODE -ne 0) {
            throw "Gagal menyalin frontend build ke backend."
        }
    }
    finally {
        Pop-Location
    }
}

if (-not (Test-BackendHealth)) {
    $backendOut = Join-Path $logsRoot "byronz-public-backend.out.log"
    $backendErr = Join-Path $logsRoot "byronz-public-backend.err.log"
    Remove-Item -LiteralPath $backendOut, $backendErr -Force -ErrorAction SilentlyContinue

    $env:CORS_ALLOWED_ORIGINS = "*"
    $env:TRUSTED_HOSTS = "*"
    $backendProcess = Start-Process `
        -FilePath $pythonExe `
        -ArgumentList @("-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000") `
        -WorkingDirectory $backendRoot `
        -RedirectStandardOutput $backendOut `
        -RedirectStandardError $backendErr `
        -WindowStyle Hidden `
        -PassThru

    $backendReady = $false
    for ($i = 0; $i -lt 40; $i++) {
        Start-Sleep -Milliseconds 500
        if (Test-BackendHealth) {
            $backendReady = $true
            break
        }
    }

    if (-not $backendReady) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
        throw "Backend Byronz tidak merespons. Cek log: $backendErr"
    }
}
else {
    $backendProcess = $null
}

Stop-SavedTunnel

$tunnelOut = Join-Path $logsRoot "byronz-public-tunnel.out.log"
$tunnelErr = Join-Path $logsRoot "byronz-public-tunnel.err.log"
Remove-Item -LiteralPath $tunnelOut, $tunnelErr, $urlPath -Force -ErrorAction SilentlyContinue

try {
    $tunnelResult = Start-CloudflareQuickTunnel -TargetUrl $backendUrl -OutPath $tunnelOut -ErrPath $tunnelErr
}
catch {
    Write-Host "Quick Tunnel Cloudflare belum stabil, beralih ke LocalTunnel..."
    $tunnelResult = Start-LocalTunnel -OutPath $tunnelOut -ErrPath $tunnelErr
}

$runtime = [ordered]@{
    backendPid = if ($backendProcess) { $backendProcess.Id } else { $null }
    tunnelPid = $tunnelResult.process.Id
    backendUrl = $backendUrl
    publicUrl = $tunnelResult.publicUrl
    provider = $tunnelResult.provider
    startedAt = (Get-Date).ToString("s")
}

$runtime | ConvertTo-Json | Set-Content -LiteralPath $runtimePath -Encoding UTF8
$tunnelResult.publicUrl | Set-Content -LiteralPath $urlPath -Encoding ASCII

Write-Host ""
Write-Host "Byronz Public HTTPS Backend aktif:"
Write-Host $tunnelResult.publicUrl
Write-Host ""
Write-Host "Provider tunnel:"
Write-Host $tunnelResult.provider
Write-Host ""
Write-Host "URL juga tersimpan di:"
Write-Host $urlPath
Write-Host ""
Write-Host "Untuk mematikan tunnel:"
Write-Host (Join-Path $root "stop-public-backend-tunnel.bat")
