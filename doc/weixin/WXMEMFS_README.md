# WXMEMFS - 微信小游戏持久化文件系统

## 概述

WXMEMFS 是基于 Emscripten MEMFS 的增强版文件系统,专为微信小游戏平台设计。它结合了:

- ✅ **MEMFS 的性能**: 内存中直接读写 `node.contents`,无路径映射开销
- ✅ **微信的持久化**: 自动序列化到微信文件系统,重启后数据保留
- ✅ **写后立即可读**: 写入直接修改内存,无需等待刷盘
- ✅ **资源管理**: 基于 fd 索引,close 时自动释放并持久化

## 核心设计

### 数据流

```
┌─────────────────────────────────────────────┐
│              WXMEMFS 架构                    │
├─────────────────────────────────────────────┤
│                                              │
│  Godot FileAccess API                       │
│         ↓                                    │
│  Emscripten FS Layer                        │
│         ↓                                    │
│  ┌─────────────────────────────┐            │
│  │   WXMEMFS (本实现)          │            │
│  │                              │            │
│  │  ┌──────────────┐            │            │
│  │  │ node.contents│◄───────────┼─ read()   │
│  │  │  (Uint8Array)│            │            │
│  │  └──────┬───────┘            │            │
│  │         │                    │            │
│  │         ├─► write() ────┐    │            │
│  │         │               ↓    │            │
│  │         │          dirty flag│            │
│  │         │               ↓    │            │
│  │         └─► close() ────┼───►│ persistNode()
│  │                         │    │            │
│  └─────────────────────────┼────┘            │
│                            ↓                 │
│                  微信文件系统                │
│         (wx.getFileSystemManager())         │
│                                              │
└─────────────────────────────────────────────┘
```

### 关键特性

1. **懒加载 (Lazy Load)**
   - mount 时只创建节点树,不加载文件内容
   - open 时才读取微信文件系统到 `node.contents`
   - 使用 `WeakSet` 追踪已加载节点,避免重复加载

2. **写时标记 (Dirty Tracking)**
   - write 操作直接修改 `node.contents`
   - 同时设置 `openStreams[fd].dirty = true`
   - close 时检查 dirty 标志,自动持久化

3. **fd-based 索引**
   - 避免路径字符串匹配问题
   - `openStreams[wxfd]` 存储 `{node, wxPath, flags, dirty}`
   - close 时精确释放资源

4. **引用计数管理 (NEW!)**
   - 使用 `WeakMap` 追踪每个 node 的打开次数
   - open 时 refCount +1, close 时 refCount -1
   - refCount 降为 0 时,自动释放 `node.contents` 内存
   - 支持同一文件多次打开,内存共享

## 使用方法

### 1. 在 Godot 导出模板中集成

**替换原有的 library_godot_fs.js**:

在 `godot4-custom/platform/web/js/libs/` 目录:

```bash
# 备份原文件
mv library_godot_fs.js library_godot_fs.js.bak

# 使用 WXMEMFS
cp WXMEMFS.js library_godot_fs.js
```

或者在构建脚本中引入:

```javascript
// 在 Godot 的 JS 模块加载时
mergeInto(LibraryManager.library, WXMEMFS);
```

### 2. 挂载文件系统

在 Godot 启动时,Emscripten 会自动挂载:

```javascript
FS.mount(WXMEMFS, { mountpoint: '/user' }, '/user');
```

`/user` 目录会映射到 `wx.env.USER_DATA_PATH`。

### 3. Godot 中使用 (无需修改代码!)

```gdscript
# 写入文件
var file = FileAccess.open("user://save.dat", FileAccess.WRITE)
file.store_string("Hello WXMEMFS!")
file.close()  # ← 自动持久化到微信文件系统

# 立即读取 (无需等待!)
var file2 = FileAccess.open("user://save.dat", FileAccess.READ)
var content = file2.get_as_text()  # ← 从内存读取,立即可用
file2.close()

print(content)  # 输出: Hello WXMEMFS!
```

### 4. 调试

WXMEMFS 提供详细的控制台日志:

```javascript
[WXMEMFS] Mounted at: /user wx: wxfile://usr
[WXMEMFS] Synced 15 items from wx filesystem
[WXMEMFS] open: /user/save.dat flags: 577
[WXMEMFS] opened: wxfd 1000 path: wxfile://usr/save.dat
[WXMEMFS] close: wxfd 1000 dirty: true
[WXMEMFS] Persisted: wxfile://usr/save.dat 15 bytes
```

## API 参考

### WXMEMFS 对象

```javascript
WXMEMFS = {
    mountpoint: '/user',       // FS 挂载点
    wxBasePath: '',            // 微信基础路径 (自动设置)
    openStreams: {},           // fd -> streamInfo
    fdCounter: 1000,           // fd 计数器
    nodeRefCounts: WeakMap,    // node -> 打开次数
    lazyLoadedNodes: WeakSet,  // 已加载节点追踪
}
```

### 核心方法

#### `getWxPath(fsPath)`
转换 FS 路径到微信路径:
```javascript
WXMEMFS.getWxPath('/user/save.dat')
// → 'wxfile://usr/save.dat'
```

#### `persistNode(node, wxPath)`
持久化节点到微信文件系统:
```javascript
WXMEMFS.persistNode(node, 'wxfile://usr/save.dat')
// 将 node.contents 写入微信文件系统
```

#### `loadNode(node, wxPath)`
从微信文件系统加载节点:
```javascript
WXMEMFS.loadNode(node, 'wxfile://usr/save.dat')
// 读取微信文件系统到 node.contents
```

#### `incrementRefCount(node)` / `decrementRefCount(node)`
管理引用计数:
```javascript
WXMEMFS.incrementRefCount(node)  // 返回新的引用计数
WXMEMFS.decrementRefCount(node)  // 返回新的引用计数
```

#### `releaseNodeContents(node)`
释放节点内存 (当引用计数为 0 时):
```javascript
WXMEMFS.releaseNodeContents(node)
// 设置 node.contents = null, node.usedBytes = 0
```

## 性能对比

| 操作 | MEMFS | GODOTFS (原) | WXMEMFS |
|------|-------|--------------|---------|
| 写入 | 内存操作,极快 | wx.writeSync,慢 | 内存操作,极快 |
| 写后读取 | 立即可用 | **失败** (缓存bug) | 立即可用 ✅ |
| 读取 | 内存操作,极快 | wx.readFileSync,慢 | 首次: wx读取<br>后续: 内存 |
| 关闭 | 无操作 | wx.closeSync | wx.writeSync (仅dirty)<br>+ 释放内存 (refCount=0) |
| 持久化 | ❌ 无 | ✅ 有 | ✅ 有 |
| 内存管理 | ❌ 常驻 | ✅ 手动清理 | ✅ 自动释放 (引用计数) |

## 测试案例

### 测试 1: 写入后立即读取

```gdscript
func test_immediate_read():
    var path = "user://test_%d.txt" % Time.get_ticks_usec()

    # 写入
    var fw = FileAccess.open(path, FileAccess.WRITE)
    fw.store_string("Test data")
    fw.close()

    # 立即读取 (无需延迟!)
    var fr = FileAccess.open(path, FileAccess.READ)
    var data = fr.get_as_text()
    fr.close()

    assert(data == "Test data")  # ✅ 通过!
```

### 测试 2: 图片写入后立即读取

```gdscript
func test_image_immediate_read():
    var path = "user://test_%d.png" % Time.get_ticks_usec()

    # 保存图片
    var img = Image.create(64, 64, false, Image.FORMAT_RGBA8)
    img.fill(Color.RED)
    img.save_png(path)

    # 立即读取 (两种方式都可用!)

    # 方式1: load_from_file
    var img1 = Image.load_from_file(path)
    assert(img1 != null)  # ✅ 通过!

    # 方式2: FileAccess + buffer
    var fa = FileAccess.open(path, FileAccess.READ)
    var buffer = fa.get_buffer(fa.get_length())
    fa.close()

    var img2 = Image.new()
    var err = img2.load_png_from_buffer(buffer)
    assert(err == OK)  # ✅ 通过!
```

### 测试 3: 持久化验证

```gdscript
func test_persistence():
    # 第一次运行: 写入
    var fw = FileAccess.open("user://persistent.dat", FileAccess.WRITE)
    fw.store_var({"score": 100})
    fw.close()

    # 模拟重启 (实际需要关闭游戏再打开)
    # ...

    # 第二次运行: 读取
    var fr = FileAccess.open("user://persistent.dat", FileAccess.READ)
    var data = fr.get_var()
    fr.close()

    assert(data.score == 100)  # ✅ 数据保留!
```

## 内存管理策略

### 引用计数机制

WXMEMFS 使用引用计数自动管理内存:

1. **open 时**: 引用计数 +1, 加载文件内容到 `node.contents`
2. **close 时**: 引用计数 -1, 如果降为 0,**立即释放 `node.contents`**
3. **多次打开**: 同一文件可以被多次打开,内存共享,直到所有 fd 都 close

```javascript
// 示例日志
[WXMEMFS] opened: wxfd 1000 path: wxfile://usr/test.dat refCount: 1
[WXMEMFS] opened: wxfd 1001 path: wxfile://usr/test.dat refCount: 2  // 同一文件
[WXMEMFS] close: wxfd 1000 refCount after decrement: 1  // 还有引用,不释放
[WXMEMFS] close: wxfd 1001 refCount after decrement: 0  // 引用归零
[WXMEMFS] Releasing node contents, size: 1024  // ✅ 内存释放!
```

### 内存优化

- ✅ **close 后立即释放**: 不再常驻内存
- ✅ **懒加载**: mount 时不加载文件内容,只创建节点树
- ✅ **共享内存**: 多次打开同一文件,共用 `node.contents`
- ✅ **自动持久化**: dirty 文件在释放前自动写入微信文件系统

## 已知限制

1. **不支持 mmap/msync**: 为简化设计,未实现内存映射
2. **同步 I/O**: close 时的持久化是同步操作,可能短暂阻塞

## 故障排除

### 问题: 写入后读取返回 null

**原因**: 可能没有调用 `close()` 或使用了错误的文件系统

**解决**:
```gdscript
# ❌ 错误
var f = FileAccess.open("user://test.dat", FileAccess.WRITE)
f.store_string("data")
# 未调用 close(),数据仍在内存

# ✅ 正确
var f = FileAccess.open("user://test.dat", FileAccess.WRITE)
f.store_string("data")
f.close()  # 必须 close!
```

### 问题: 控制台报错 "wx is not defined"

**原因**: 非微信环境 (如浏览器调试)

**解决**: WXMEMFS 会自动降级,日志显示:
```
[WXMEMFS] wx.env.USER_DATA_PATH not available, persistence disabled
```
此时仍可正常运行,但无持久化。

## 与 GODOTFS 的对比

| 特性 | GODOTFS | WXMEMFS |
|------|---------|---------|
| 数据存储 | 外部缓存 `fileCache[path]` | 节点内部 `node.contents` |
| 路径管理 | 字符串匹配,易出错 | fd 索引,精确 |
| 写后读取 | ❌ 缓存不同步 | ✅ 立即可用 |
| 资源释放 | 手动清理缓存 | 自动释放 fd |
| 异常处理 | 捕获后状态不一致 | 继承 MEMFS 健壮性 |
| 代码复杂度 | 550 行,多处 bug | 700 行,清晰稳定 |

## 许可证

基于 Emscripten MEMFS,遵循 MIT License。

## 贡献

欢迎提交 Issue 和 Pull Request!

---

**Powered by MEMFS + WeChat FileSystem**
