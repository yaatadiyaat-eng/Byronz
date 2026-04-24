$ErrorActionPreference = "Stop"

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$runtimePath = Join-Path $repoRoot "public-backend-runtime.json"
$urlPath = Join-Path $repoRoot "public-backend-url.txt"

$runtime = $null
if (Test-Path $runtimePath) {
    $runtime = Get-Content -LiteralPath $runtimePath -Raw | ConvertFrom-Json
}
else {
    Write-Host "Runtime public backend tidak ditemukan, lanjut membersihkan proses sisa."
}

if ($runtime -and $runtime.tunnelPid) {
    Stop-Process -Id ([int] $runtime.tunnelPid) -Force -ErrorAction SilentlyContinue
}

if ($runtime -and $runtime.backendPid) {
    Stop-Process -Id ([int] $runtime.backendPid) -Force -ErrorAction SilentlyContinue
}

Get-CimInstance Win32_Process |
    Where-Object {
        $_.Name -eq "python.exe" -and
        $_.CommandLine -match "uvicorn main:app" -and
        $_.CommandLine -match "--port 8000"
    } |
    ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }

Get-CimInstance Win32_Process |
    Where-Object {
        $_.Name -eq "node.exe" -and
        $_.CommandLine -match "localtunnel" -and
        $_.CommandLine -match "--port 8000"
    } |
    ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }

Remove-Item -LiteralPath $runtimePath, $urlPath -Force -ErrorAction SilentlyContinue

Write-Host "Byronz public backend tunnel sudah dimatikan."
