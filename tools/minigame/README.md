# Minigame Branch Workflow

This folder keeps the active WeChat Mini Game branches in sync:

- `4.7` in `C:\toolkit\godot4-custom`
- `4.5.1-minigame` in `C:\toolkit\godot4-custom\.worktrees\4.5.1-minigame`

## 1) Sync a bugfix commit

Cherry-pick a commit from `4.7` to `4.5.1-minigame`:

```powershell
pwsh -File .\tools\minigame\sync_bugfix.ps1 -Commit <commit_sha> -FromBranch 4.7 -ToBranches 4.5.1-minigame
```

Cherry-pick from `4.5.1-minigame` to `4.7`:

```powershell
pwsh -File .\tools\minigame\sync_bugfix.ps1 -Commit <commit_sha> -FromBranch 4.5.1-minigame -ToBranches 4.7
```

## 2) Build + compress + publish

Build and publish both branches:

```powershell
pwsh -File .\tools\minigame\build_publish.ps1 -Branch all
```

Build and publish only one branch:

```powershell
pwsh -File .\tools\minigame\build_publish.ps1 -Branch 4.7
pwsh -File .\tools\minigame\build_publish.ps1 -Branch 4.5.1-minigame
```

## 2.1) One command: sync + publish

```powershell
pwsh -File .\tools\minigame\sync_and_publish.ps1 -Commit <commit_sha> -FromBranch 4.7 -ToBranches 4.5.1-minigame
```

## 3) Local target configuration

Edit `tools/minigame/targets.local.psd1`:

- `Repo`: local repository/worktree path for each branch.
- `TargetEngines`: downstream `wxgame\engine` output paths to overwrite.
