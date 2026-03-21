---
name: wechat-emscriptenglx-adapter
description: Adapt Godot Web exports to WeChat Mini Game using the experimental EmscriptenGLX rendering path. Use when enabling `use_wx_glx`, linking `libemscriptenglx_*.a`, patching WebGL context creation to `wxwebgl`/`wxwebgl2`, or debugging WeChat-only GLX startup issues such as offscreen framebuffer conflicts, `resizeOffscreenFramebuffer` crashes, null-write checks, or runtime `.gdextension` loading.
---

# WeChat EmscriptenGLX Adapter

Use this skill when working on the experimental WeChat Mini Game GLX path in this repo.

This folder already contains:

- `libemscriptenglx_3.1.17.a`
- `libemscriptenglx_3.1.74.a`
- `libemscriptenglx_4.0.10.a`
- `version.txt`
- `官网文档.txt`

The current repo wiring targets the `4.0.10` library and should be treated as experimental.

## When To Use

Use this skill for tasks like:

- enabling or updating `use_wx_glx`
- switching Emscripten versions to match `libemscriptenglx_*.a`
- debugging WeChat-only GLX stalls after context creation
- checking whether Godot Web runtime glue still matches the GLX requirements
- rebuilding and publishing a GLX experiment to downstream WeChat test projects

Do not use this for the normal Web/minigame path unless the task explicitly mentions EmscriptenGLX.

## Current Integration Points

The current repo integrates GLX in these files:

- `platform/web/detect.py`
  - `use_wx_glx` and `wx_glx_lib`
  - auto-detects `platform/web/libemscriptenglx/libemscriptenglx_<emscripten-version>.a`
  - forces exception support for GLX builds
  - sets `CHECK_NULL_WRITES=0`
  - disables `OFFSCREEN_FRAMEBUFFER` when GLX is on
  - switches `SUPPORT_LONGJMP` to `emscripten` when GLX is on
- `platform/web/js/patches/patch_em_gl.js`
  - patches `GL.createContext`
  - requests `wxwebgl` / `wxwebgl2`
  - calls `glxInit`
  - calls `glxInitBufferDataAndGlState`
  - calls `glxUpdateContextId`
- `platform/web/display_server_web.cpp`
  - disables `explicitSwapControl` for GLX builds
  - skips `emscripten_webgl_commit_frame()` for GLX builds
- `platform/web/js/libs/library_godot_display.js`
  - guards `GL.resizeOffscreenFramebuffer()` so GLX builds do not crash when offscreen framebuffer support is disabled
- `drivers/gles3/storage/utilities.cpp`
  - skips timestamp query creation and reads in GLX builds
- `platform/web/os_web.cpp`
  - runtime remains normal, but `.gdextension` loading is skipped for WeChat runtime

## Version Rules

Match the Emscripten version to the static library version exactly.

Known library versions in this folder:

- `3.1.17`
- `3.1.74`
- `4.0.10`

For this repo, prefer:

- `emcc 4.0.10`
- `use_wx_glx=yes`
- `threads=no`

If the current `emcc` version does not exactly match a local `libemscriptenglx_<version>.a`, do not guess. Either switch Emscripten or pass `wx_glx_lib=` explicitly and accept that it is an experiment.

## Build Command

Use the real global SCons, not the pyenv shim:

```powershell
& C:\global\emsdk\python\3.13.3_64bit\Scripts\scons.exe platform=web target=template_release threads=no use_wx_glx=yes
```

Then:

```powershell
.\compress_wasm.bat
```

The generated files of interest are:

- `bin/.web_zip/godot.js`
- `bin/.web_zip/godot.wasm.br`

## Downstream Publish Pattern

Example publish:

```powershell
Copy-Item -Force bin/.web_zip/godot.js <target>\godot.js
Copy-Item -Force bin/.web_zip/godot.wasm.br <target>\godot.wasm.br
```

Always verify hashes after copying.

## GLX-Specific Pitfalls

### 1. Context init timing matters

Do not wait until after the whole `GL.createContext()` finishes to initialize GLX.

The working pattern in this repo is:

- intercept `canvas.getContext(...)`
- switch `webgl` -> `wxwebgl` and `webgl2` -> `wxwebgl2`
- call `glxInit` immediately after `getContext()` returns the context
- call `glxInitBufferDataAndGlState` once
- call `glxUpdateContextId` on every context switch

### 2. Offscreen framebuffer conflicts

Godot Web normally uses:

- `-sOFFSCREEN_FRAMEBUFFER=1`
- `explicitSwapControl = true`
- `emscripten_webgl_commit_frame()`

For GLX builds in this repo, these are disabled because they conflict with the native GLX path.

If a WeChat build stalls after:

- `完成BufferData逻辑初始化`

check this first.

### 3. `resizeOffscreenFramebuffer` crash

If `OFFSCREEN_FRAMEBUFFER` is disabled, `GL.resizeOffscreenFramebuffer` may not exist.

Guard all calls to it.

### 4. Address-zero heap corruption warning

If the app renders and keeps running but Emscripten aborts with:

- `Runtime error: The application has corrupted its heap memory area (address zero)!`

this repo currently suppresses the null-write guard in GLX mode with:

- `-sCHECK_NULL_WRITES=0`

Treat this as a runtime compatibility workaround, not proof that memory is truly safe.

### 5. Query/timestamp compatibility

`GLES3::Utilities` normally allocates timestamp queries.

In this repo, GLX mode skips those query allocations and reads because they were suspected to conflict with the WeChat GLX runtime.

### 6. `.gdextension` runtime loading

WeChat Mini Game runtime does not support loading project-side dynamic GDExtension libraries.

This repo skips `extension_list.cfg` runtime loading in:

- `web + wechat + non-editor`

Do not re-enable this unless side-loaded wasm extensions are actually supported.

## Debugging Workflow

When the app hangs on real device but not on desktop:

1. Confirm Emscripten version matches the local static library version.
2. Confirm `use_wx_glx=yes` and `threads=no`.
3. Confirm GLX path is actually active:
   - WeChat GLX library version log appears
   - `当前为 EmscriptenGLX 渲染方案`
4. If context init succeeds but the app stalls:
   - check offscreen framebuffer conflicts
   - check `resizeOffscreenFramebuffer`
   - check timestamp query usage
   - check first frame swap path
5. If the app renders but later aborts:
   - inspect Emscripten runtime checks such as address-zero guard

## Acceptance Checks

A GLX experiment is considered minimally healthy when:

- WeChat logs show the GLX path is active
- the game reaches scene rendering on real device
- no `resizeOffscreenFramebuffer is not a function`
- no `.gdextension` runtime load errors on WeChat
- no immediate stack cookie / address-zero abort after the first frames

## References

- `platform/web/libemscriptenglx/官网文档.txt`
  - Official GLX integration notes bundled with this repo
- `platform/web/detect.py`
- `platform/web/js/patches/patch_em_gl.js`
- `platform/web/display_server_web.cpp`
- `platform/web/js/libs/library_godot_display.js`
- `drivers/gles3/storage/utilities.cpp`
- `platform/web/os_web.cpp`
