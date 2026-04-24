param(
    [Parameter(Mandatory = $true)]
    [string] $VersionName,

    [Parameter(Mandatory = $true)]
    [int] $VersionCode
)

$ErrorActionPreference = "Stop"

if ($VersionName -notmatch '^\d+\.\d+\.\d+$') {
    throw "Format VersionName harus seperti 1.2.1"
}

if ($VersionCode -le 0) {
    throw "VersionCode harus lebih besar dari 0"
}

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$frontendDir = Join-Path $repoRoot "frontend"
$packageJsonPath = Join-Path $frontendDir "package.json"
$releaseConfigPath = Join-Path $frontendDir "release.config.json"
$releaseConfigJsPath = Join-Path $frontendDir "release-config.js"

if (-not (Test-Path $packageJsonPath)) {
    throw "File package.json tidak ditemukan di $packageJsonPath"
}

if (-not (Test-Path $releaseConfigPath)) {
    throw "File release.config.json tidak ditemukan di $releaseConfigPath"
}

$nodeScript = @'
const fs = require('node:fs');

const [packageJsonPath, releaseConfigPath, releaseConfigJsPath, versionName, versionCodeRaw] = process.argv.slice(1);
const versionCode = Number(versionCodeRaw);

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

if (!Number.isInteger(versionCode) || versionCode <= 0) {
  throw new Error('VersionCode harus berupa integer positif.');
}

const packageJson = readJson(packageJsonPath);
const releaseConfig = readJson(releaseConfigPath);

packageJson.version = versionName;
releaseConfig.versionName = versionName;
releaseConfig.versionCode = versionCode;

const releaseConfigJs = `window.BYRONZ_RELEASE = Object.freeze({
  appId: "${releaseConfig.appId}",
  appName: "${releaseConfig.appName}",
  versionName: "${releaseConfig.versionName}",
  versionCode: ${releaseConfig.versionCode}
});
`;

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
fs.writeFileSync(releaseConfigPath, `${JSON.stringify(releaseConfig, null, 2)}\n`);
fs.writeFileSync(releaseConfigJsPath, releaseConfigJs);
'@

& node -e $nodeScript $packageJsonPath $releaseConfigPath $releaseConfigJsPath $VersionName $VersionCode

if ($LASTEXITCODE -ne 0) {
    throw "Gagal memperbarui file versi Byronz"
}

Write-Host "Versi Byronz berhasil diperbarui:"
Write-Host "- VersionName: $VersionName"
Write-Host "- VersionCode: $VersionCode"
