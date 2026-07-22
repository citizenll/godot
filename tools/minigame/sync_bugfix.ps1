param(
    [Parameter(Mandatory = $true)]
    [string]$Commit,

    [string]$FromBranch = "4.7",

    [string[]]$ToBranches = @("4.5.1-minigame"),

    [string]$ConfigPath = (Join-Path $PSScriptRoot "targets.local.psd1")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (!(Test-Path $ConfigPath)) {
    throw "Config not found: $ConfigPath"
}

$config = Import-PowerShellDataFile -Path $ConfigPath
if (!$config.Builds) {
    throw "Invalid config: missing Builds"
}

if (!$config.Builds.ContainsKey($FromBranch)) {
    throw "Config missing branch: $FromBranch"
}

$fromRepo = $config.Builds[$FromBranch].Repo
if (!(Test-Path $fromRepo)) {
    throw "From repo path missing: $fromRepo"
}

Write-Host "Checking commit in source branch..."
& git -C $fromRepo cat-file -e "$Commit^{commit}"
if ($LASTEXITCODE -ne 0) {
    throw "Commit not found: $Commit"
}

foreach ($toBranch in $ToBranches) {
    if ($toBranch -eq $FromBranch) {
        Write-Host "Skip same branch: $toBranch"
        continue
    }

    if (!$config.Builds.ContainsKey($toBranch)) {
        throw "Config missing branch: $toBranch"
    }

    $toRepo = $config.Builds[$toBranch].Repo
    if (!(Test-Path $toRepo)) {
        throw "Target repo path missing: $toRepo"
    }

    $currentBranch = (& git -C $toRepo rev-parse --abbrev-ref HEAD).Trim()
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to detect branch for repo: $toRepo"
    }
    if ($currentBranch -ne $toBranch) {
        throw "Branch mismatch for $toRepo. Expected '$toBranch', got '$currentBranch'."
    }

    Write-Host "Cherry-picking $Commit -> $toBranch ($toRepo)"
    & git -C $toRepo cherry-pick $Commit
    if ($LASTEXITCODE -ne 0) {
        throw "Cherry-pick failed on $toBranch. Resolve conflicts in $toRepo, then continue manually."
    }
}

Write-Host "Sync complete."
