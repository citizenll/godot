@{
    SconsPath = "C:\global\emsdk\python\3.13.3_64bit\Scripts\scons.exe"
    Builds = @{
        "4.5.1-minigame" = @{
            Repo = "C:\toolkit\godot4-custom\.worktrees\4.5.1-minigame"
            TargetEngines = @(
                "C:\toolkit\导出模板demo项目\empty-tips4.4-pack\wxgame\engine"
            )
        }
        "4.7" = @{
            Repo = "C:\toolkit\godot4-custom"
            BuildArgs = @(
                "platform=web"
                "target=template_release"
                "threads=no"
                "dlink_enabled=no"
                "use_wx_glx=yes"
                "-j6"
            )
            TargetEngines = @(
                "C:\toolkit\导出模板demo项目\empty-tips4.6\wxgame\engine"
            )
        }
    }
}
