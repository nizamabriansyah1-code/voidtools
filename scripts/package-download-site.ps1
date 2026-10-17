$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$siteRoot = Join-Path $projectRoot "out"
$downloadRoot = Join-Path $siteRoot "downloads"
$artifactRoot = Join-Path $projectRoot "outputs"
$zipPath = Join-Path $artifactRoot "VOIDTOOLS-site.zip"
$apkPath = Join-Path $artifactRoot "VOIDTOOLS-android.apk"
$windowsPath = Join-Path $artifactRoot "VOIDTOOLS-Windows.exe"

foreach ($requiredPath in @($siteRoot, $apkPath, $windowsPath)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
        throw "Required site or app artifact was not found: $requiredPath"
    }
}

New-Item -ItemType Directory -Path $downloadRoot -Force | Out-Null
Copy-Item -LiteralPath $apkPath -Destination (Join-Path $downloadRoot "VOIDTOOLS-android.apk") -Force
Copy-Item -LiteralPath $windowsPath -Destination (Join-Path $downloadRoot "VOIDTOOLS-Windows.exe") -Force

if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -Path (Join-Path $siteRoot "*") -DestinationPath $zipPath -CompressionLevel Optimal
Write-Output "Static download site created: $zipPath"
