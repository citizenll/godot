# Tools Usage

本文档记录 `tools/minigame` 下活跃分支（`4.5.1-minigame` / `4.7`）维护脚本的使用方式。

## 脚本列表

- `tools/minigame/sync_bugfix.ps1`
  - 将某个修复提交从一个分支同步到另一个分支（`git cherry-pick`）。
- `tools/minigame/build_publish.ps1`
  - 构建（`threads=no`）+ 压缩（`compress_wasm.bat`）+ 发布到下游 `wxgame/engine`。
- `tools/minigame/sync_and_publish.ps1`
  - 一条命令执行“同步修复 + 双分支发布”。
- `tools/minigame/targets.local.psd1`
  - 本地配置：每个分支对应的 repo/worktree 路径与下游目标路径。

## 常用命令（在仓库根目录执行）

1. 同步某个修复到 4.5 分支

```powershell
pwsh -File .\tools\minigame\sync_bugfix.ps1 -Commit <commit_sha> -FromBranch 4.7 -ToBranches 4.5.1-minigame
```

2. 只发布 4.5 分支

```powershell
pwsh -File .\tools\minigame\build_publish.ps1 -Branch 4.5.1-minigame
```

3. 只发布 4.7 分支

```powershell
pwsh -File .\tools\minigame\build_publish.ps1 -Branch 4.7
```

4. 同时发布两个分支

```powershell
pwsh -File .\tools\minigame\build_publish.ps1 -Branch all
```

5. 一步完成：同步修复并双分支发布

```powershell
pwsh -File .\tools\minigame\sync_and_publish.ps1 -Commit <commit_sha> -FromBranch 4.7 -ToBranches 4.5.1-minigame
```

## 配置说明

编辑 `tools/minigame/targets.local.psd1`：

- `Repo`：分支对应本地路径（4.7 主目录，4.5 使用 worktree）。
- `TargetEngines`：下游 `wxgame\engine` 目录数组，发布时会覆盖 `godot.js` 与 `godot.wasm.br`。

## 备注

- 当前流程默认使用 `threads=no`，避免发布成多线程模板。
- 发布后脚本会做哈希一致性校验，确保下游文件和构建产物一致。
