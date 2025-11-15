# Godot 4.3 微信小游戏平台适配更新手册

本文档为一份详细的技术手册，旨在完整记录 Godot 4.3 引擎为适配微信小游戏平台所做的各项修改。其目的是提供一份清晰、可操作的指南，以便于理解、维护以及将这些适配逻辑移植到未来版本的 Godot 引擎（如 Godot 4.5）。

## 目录
- [Godot 4.3 微信小游戏平台适配更新手册](#godot-43-微信小游戏平台适配更新手册)
  - [目录](#目录)
    - [1. 构建系统与编译流程](#1-构建系统与编译流程)
      - [1.1. SCons 构建配置 (`platform/web/SCsub`)](#11-scons-构建配置-platformwebscsub)
      - [1.2. 编译选项 (`platform/web/detect.py`)](#12-编译选项-platformwebdetectpy)
      - [1.3. WASM 压缩与后处理](#13-wasm-压缩与后处理)
    - [2. 文件系统 (FS) 适配](#2-文件系统-fs-适配)
    - [3. 网络请求 (Fetch API)](#3-网络请求-fetch-api)
    - [4. 音频 (Audio)](#4-音频-audio)
    - [5. 渲染与显示 (Rendering \& Display)](#5-渲染与显示-rendering--display)
    - [6. 输入系统 (Input)](#6-输入系统-input)
    - [7. JavaScript 接口与核心修改](#7-javascript-接口与核心修改)
    - [8. 引擎核心与模块修改](#8-引擎核心与模块修改)

---

### 1. 构建系统与编译流程

为了将小游戏平台的特定库和配置集成到 Godot 的 Web 导出流程中，我们对 Emscripten 的构建脚本进行了修改。

#### 1.1. SCons 构建配置 (`platform/web/SCsub`)

- **添加预加载脚本**:
  通过 `sys_env.AddJSPre()` 将小游戏平台的核心库在 `godot.js` 主文件之前加载。这确保了在 Emscripten 的 FS（文件系统）初始化之前，我们自定义的 `GODOTFS` 和其他依赖项（如 `Blob.js`, `crypto` polyfill）已经准备就绪。

  ```python
  # platform/web/SCsub
  sys_env.AddJSPre([
      "js/libs/library_blob.js",
      "js/libs/library_godot_crypto.js",
      "js/libs/library_godot_fs.js",
  ])
  ```

- **移除旧的 `--pre-js` 方式**:
  原先通过 `sys_env.Append(LINKFLAGS=["--pre-js", ...])` 的方式被更可靠的 `AddJSPre` 取代，以保证加载顺序。

#### 1.2. 编译选项 (`platform/web/detect.py`)

- **禁用 `WASM_BIGINT`**:
  为兼容部分不支持 `BigInt` 的 JavaScript 环境（尤其是在某些移动端或旧版 JS Core 中），强制禁用了 `WASM_BIGINT`。

  ```python
  # platform/web/detect.py
  needs_wasm_bigint = False # cc_semver >= (3, 1, 41)
  ```

- **禁用 `javascript_eval`**:
  出于安全和性能考虑，移除了对 `eval()` 的直接支持，并重命名了相关接口为 `exec`，尽管在后续补丁中实际功能被禁用了。

#### 1.3. WASM 压缩与后处理

- **Brotli 压缩**:
  引入 `compress_wasm.bat` 和 `compress_wasm.sh` 脚本，在构建完成后自动使用 Brotli 工具将 `godot.wasm` 压缩为 `godot.wasm.br`。这能显著减小 WebAssembly 模块的体积，加快下载速度。

- **JavaScript 后处理 (`godot_process.js`)**:
  这是一个关键步骤。在 Emscripten 生成 `godot.js` 后，运行此 Node.js 脚本对其进行字符串替换，以修复与小游戏环境的兼容性问题。主要修复点包括：
    - **挂载文件系统**: 将 `FS.mount(IDBFS,{},path)` 替换为 `FS.mount(GODOTFS,{},path)`，强制使用我们自定义的文件系统。
    - **错误处理**: 将 `e instanceof WebAssembly.RuntimeError` 替换为 `e`，简化了 Wasm 运行时的错误捕捉逻辑，以适应某些环境下错误类型不标准的问题。
    - **Polyfill 注入**: 注入 `performance.now` 的 polyfill，并定义 `tempDouble`、`tempI64` 等临时变量以支持 `i64` 的 `setValue/getValue` 模拟。

---

### 2. 文件系统 (FS) 适配

这是适配工作的核心。微信小游戏提供了一套同步的文件系统 API，我们创建了 `library_godot_fs.js` 来桥接 Emscripten FS 和微信的 API。

- **核心实现 `GODOTFS`**:
  - **路径映射**: `getPath` 和 `getPathByNode` 函数将 Emscripten VFS 中的路径（如 `/user`）转换为微信文件系统中的物理路径（`wx.env.USER_DATA_PATH/...`）。
  - **同步 API**: 所有文件操作（`mkdirSync`, `readFileSync`, `writeFileSync`, `statSync` 等）都使用微信文件系统管理器的同步版本，因为 Godot 引擎的文件 I/O 是阻塞式的。
  - **节点操作**: 实现了 `createNode`, `lookup`, `mknod`, `rename`, `unlink`, `rmdir` 等 VFS 节点操作函数，这些函数底层调用微信的 API。
  - **流操作**: 实现了 `open`, `close`, `read`, `write`, `llseek` 等文件流操作函数。`read` 操作利用了缓存 (`fileCache`) 来优化性能，避免重复读取。`write` 操作则直接写入物理文件。
  - **错误码转换**: `getErrno` 函数将微信 API 返回的错误信息（字符串）转换为 Emscripten 能理解的数字错误码（如 `ENOENT`）。

- **启动与同步**:
  - 在引擎启动时，通过 `syncfs` 函数递归地读取微信用户目录下的所有文件和目录，并在 Emscripten VFS 中创建对应的节点。这使得引擎能够“看到”之前持久化存储的文件。

---

### 3. 网络请求 (Fetch API)

- **重写 `library_godot_fetch.js`**:
  - **API 替换**: 将 `fetch()` API 完全替换为 `wx.request()`。
  - **无流式处理**: 由于 `wx.request` 不支持流式响应，整个实现被修改为一次性接收所有数据。`onresponse` 回调函数直接将 `response.data` (一个 `ArrayBuffer`) 存入 `chunks` 数组，并立即将状态标记为 `done`。
  - **请求/响应适配**: `create` 函数将 Godot 传递的 HTTP 方法、URL、头信息和请求体适配为 `wx.request` 需要的格式。`godot_js_fetch_read_headers` 则从 `response.header` 对象中读取响应头。
  - **新增 `godot_js_fetch_body_length_get`**: 由于可以预先知道内容长度，增加了此函数以返回响应体的总字节数。

---

### 4. 音频 (Audio)

- **适配 `library_godot_audio.js`**:
  - **共享 `AudioContext`**: 强制 Godot 使用微信小游戏环境已经创建并管理的全局 `AudioContext` (`GODOTSDK.audio.WEBAudio.audioContext`)，而不是自己创建新的实例。这避免了多 `AudioContext` 冲突和平台限制。
  - **移除 `AudioWorklet`**: 完全移除了与 `AudioWorklet` 和 `godot.audio.position.worklet.js` 相关的所有逻辑。音频播放位置跟踪等高级功能被禁用，以保证基础播放的兼容性。
  - **简化节点连接**: 音频源节点 (`_source`) 直接连接到 `audioContext.destination`，移除了中间复杂的 `SampleNodeBus` 和多通道处理，以最简单可靠的方式输出声音。
  - **事件处理兼容**: 将 `addEventListener('ended', ...)` 改为 `onended = ...`，以兼容不同 JavaScript 引擎的事件模型。
  - **状态检查**: 在 `_onended` 回调中增加了 `this.isCleared` 检查，防止在节点已被清理后仍然执行循环播放或回调逻辑，避免了潜在的运行时错误。

---

### 5. 渲染与显示 (Rendering & Display)

- **高 DPI 和尺寸修复 (`library_godot_display.js`)**:
  - **动态像素比**: `getPixelRatio` 函数被修改为从 `wx.getWindowInfo()` 获取 `pixelRatio`。这确保了在 iOS 等设备上能获取到正确的高清屏幕信息。
  - **屏幕/窗口尺寸**: `godot_js_display_screen_size_get` 和 `updateSize` 函数同样被修改，使用 `wx.getWindowInfo()` 返回的 `screenWidth`, `screenHeight`, `windowWidth`, `windowHeight` 来设置 Canvas 的尺寸和引擎的渲染尺寸，从而解决了高分屏下的模糊问题。

- **WebGL 兼容性 (`drivers/gles3/`)**:
  - **SRGB 帧缓冲**: 在 `rasterizer_gles3.cpp` 中，`glDisable(GL_FRAMEBUFFER_SRGB)` 的调用被移至 `GLES3::Config` 初始化之后，并增加了 `if (config->srgb_framebuffer_supported)` 的判断。这确保了只在硬件支持时才禁用 sRGB，避免在不支持的设备上产生 GL 错误。
  - **纹理参数**: 在 `rasterizer_canvas_gles3.cpp` 中，为 `glTexParameteri` 调用增加了 `if (render_target->backbuffer != 0)` 的保护，防止在无效的 backbuffer 上设置纹理参数导致崩溃。

---

### 6. 输入系统 (Input)

- **虚拟键盘/输入法 (`library_godot_input.js`)**:
  - **原生 API 替换**: 彻底重构了 `GodotIME` 的实现。原先基于 DOM 元素模拟输入的逻辑被完全移除。
  - **`ime.show()`**: 调用 `wx.showKeyboard()` 拉起原生键盘，并注册 `wx.onKeyboardInput` 和 `wx.onKeyboardConfirm` 等回调来监听输入。
  - **`ime.hide()`**: 调用 `wx.hideKeyboard()` 关闭原生键盘，并注销相关回调。
  - **事件桥接**: 将微信键盘 API 返回的输入值通过 `ime_cb` 回调函数传递回 Godot 引擎。

---

### 7. JavaScript 接口与核心修改

- **Blob Polyfill (`library_blob.js`)**:
  - 引入了一个完整的 `Blob.js` polyfill。这为那些不完全支持 `Blob`, `File`, `FileReader` API 的 JavaScript 环境提供了兼容实现。

- **Crypto Polyfill (`library_godot_crypto.js`)**:
  - 提供了一个简单的 `crypto.getRandomValues` polyfill，使用 `Math.random()` 来生成随机数，以满足引擎对随机数生成的需求。

- **引擎加载 (`platform/web/js/engine/`)**:
  - **WASM 加载**: `engine.js` 和 `config.js` 中的加载逻辑被修改，优先加载 `.wasm.br` (Brotli 压缩) 文件。
  - **资源加载**: `preloader.js` 中的 `fetch` 调用被替换为 `fsUtils.localFetch`，这表明资源加载流程被重定向到了一个平台提供的自定义实现中，可能是为了利用小游戏的分包加载或缓存机制。

---

### 8. 引擎核心与模块修改

- **EditorExport API 扩展**:
  - 对 `EditorExportPreset`, `EditorExportPlatform`, `EditorExportPlugin` 类进行了大幅扩展，增加了大量 `get/set` 方法，允许通过脚本更精细地控制导出过程的每一个环节（如文件过滤、加密、自定义特性等）。
  - 这为实现自动化、可定制的导出流程奠定了基础，是实现小游戏一键发布功能的关键。

- **GLTF 导入修复**:
  - 在 `resource_importer_scene.cpp` 和 `gltf_document_extension_convert_importer_mesh.cpp` 中，增加了 `mesh_node->set_visible(src_mesh_node->is_visible())` 等代码，确保在导入 GLTF 模型时，节点的可见性状态得以保留。
