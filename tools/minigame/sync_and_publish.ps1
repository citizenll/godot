param(
    [Parameter(Mandatory = $true)]
    [string]$Commit,

    [ValidateSet("4.5.1-minigame", "4.6")]
    [string]$FromBranch = "4.6",

    [ValidateSet("4.5.1-minigame", "4.6")]
    [string[]]$ToBranches = @("4.5.1-minigame"),

    [string]$ConfigPath = (Join-Path $PSScriptRoot "targets.local.psd1")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$syncScript = Join-Path $PSScriptRoot "sync_bugfix.ps1"
$buildScript = Join-Path $PSScriptRoot "build_publish.ps1"

& pwsh -File $syncScript -Commit $Commit -FromBranch $FromBranch -ToBranches $ToBranches -ConfigPath $ConfigPath
if ($LASTEXITCODE -ne 0) {
    throw "sync_bugfix.ps1 failed."
}

# Publish both branches to keep downstream in sync.
& pwsh -File $buildScript -Branch all -ConfigPath $ConfigPath
if ($LASTEXITCODE -ne 0) {
    throw "build_publish.ps1 failed."
}

Write-Host "Sync + publish complete."
