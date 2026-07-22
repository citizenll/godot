param(
    [string]$Branch = "all",

    [string]$ConfigPath = (Join-Path $PSScriptRoot "targets.local.psd1"),

    [switch]$SkipBuild,
    [switch]$SkipCompress
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Invoke-Checked {
    param(
        [scriptblock]$Script,
        [string]$ErrorMessage
    )
    & $Script
    if ($LASTEXITCODE -ne 0) {
        throw $ErrorMessage
    }
}

function Get-Hash {
    param([string]$Path)
    return (Get-FileHash -Path $Path -Algorithm SHA256).Hash
}

if (!(Test-Path $ConfigPath)) {
    throw "Config not found: $ConfigPath"
}

$config = Import-PowerShellDataFile -Path $ConfigPath
if (!$config.Builds) {
    throw "Invalid config: missing Builds"
}

$branches = if ($Branch -eq "all") {
    @($config.Builds.Keys | Sort-Object)
} else {
    @($Branch)
}

foreach ($branchName in $branches) {
    if (!$config.Builds.ContainsKey($branchName)) {
        throw "Config missing branch: $branchName"
    }

    $build = $config.Builds[$branchName]
    $repo = $build.Repo
    $targets = @($build.TargetEngines)
    $sconsPath = if ($build.ContainsKey("SconsPath")) {
        $build.SconsPath
    } elseif ($config.ContainsKey("SconsPath")) {
        $config.SconsPath
    } else {
        "scons"
    }
    $buildArgs = if ($build.ContainsKey("BuildArgs")) {
        @($build.BuildArgs)
    } else {
        @("platform=web", "target=template_release", "threads=no")
    }

    if (!(Test-Path $repo)) {
        throw "Repo path missing for ${branchName}: $repo"
    }
    if ($targets.Count -eq 0) {
        throw "No TargetEngines configured for $branchName"
    }

    Write-Host "=== [$branchName] repo: $repo ==="

    $currentBranch = (& git -C $repo rev-parse --abbrev-ref HEAD).Trim()
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to get current branch for $repo"
    }
    if ($currentBranch -ne $branchName) {
        throw "Branch mismatch for $repo. Expected '$branchName', got '$currentBranch'."
    }

    Push-Location $repo
    try {
        if (!$SkipBuild) {
            Write-Host "Building: $sconsPath $($buildArgs -join ' ')"
            Invoke-Checked -Script {
                & $sconsPath @buildArgs
            } -ErrorMessage "Build failed: $branchName"
        }

        if (!$SkipCompress) {
            Write-Host "Compressing wasm + patching JS ..."
            Invoke-Checked -Script {
                .\compress_wasm.bat
            } -ErrorMessage "compress_wasm.bat failed: $branchName"
        }

        $srcJs = Join-Path $repo "bin/.web_zip/godot.js"
        $srcWasmBr = Join-Path $repo "bin/.web_zip/godot.wasm.br"

        if (!(Test-Path $srcJs) -or !(Test-Path $srcWasmBr)) {
            throw "Build artifacts missing for ${branchName}: $srcJs / $srcWasmBr"
        }

        $srcJsHash = Get-Hash -Path $srcJs
        $srcWasmHash = Get-Hash -Path $srcWasmBr

        foreach ($target in $targets) {
            Write-Host "Publishing to $target"
            New-Item -Path $target -ItemType Directory -Force | Out-Null

            $dstJs = Join-Path $target "godot.js"
            $dstWasmBr = Join-Path $target "godot.wasm.br"

            Copy-Item -Force $srcJs $dstJs
            Copy-Item -Force $srcWasmBr $dstWasmBr

            $dstJsHash = Get-Hash -Path $dstJs
            $dstWasmHash = Get-Hash -Path $dstWasmBr

            if ($srcJsHash -ne $dstJsHash -or $srcWasmHash -ne $dstWasmHash) {
                throw "Hash mismatch after publish: $target"
            }
        }
    } finally {
        Pop-Location
    }
}

Write-Host "All done."
