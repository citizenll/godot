多线程 Worker
对于游戏来说，每帧 16ms 是极其宝贵的，如果有一些可以异步处理的任务，可以放置于 Worker 中运行，待运行结束后，再把结果返回到主线程。Worker 运行于一个单独的全局上下文与线程中，不能直接调用主线程的方法，Worker 也不具备渲染的能力。 Worker 与主线程之间的数据传输，双方使用 Worker.postMessage() 来发送数据，Worker.onMessage() 来接收数据，传输的数据并不是直接共享，而是被复制的。

步骤
1. 配置 Worker 信息
在 game.json 中可配置 Worker 代码放置的目录，目录下的所有 JS 代码最终将被打包成一个 JS 文件：

配置示例：

{
  "workers": "workers"
}
通过以上方式配置，workers 目录下的所有 JS 文件会被打包为一个 JS 文件，并作为小游戏首包的一部分。

小游戏首包体积是有上限的（目前为4M），为了使 worker 代码不占用首包体积，从基础库 v2.27.3 开始支持将 worker 代码打包为一个分包。（需要更新开发者工具至最新 nightly 版本）

worker 代码配置为分包示例：

{
  "workers": {
    "path": "workers",
    "isSubpackage": true  // true 表示把 worker 打包为分包。默认 false。填 false 时等同于 { "workers": "workers" }
  }
}
2. 添加 Worker 代码文件
根据步骤 1 中的配置，在代码目录下新建以下两个入口文件：

workers/request/index.js
workers/request/utils.js
workers/response/index.js
添加后，目录结构如下：

├── game.js
├── game.json
├── project.config.json
└── workers
    ├── request
    │   ├── index.js
    │   └── utils.js
    └── response
        └── index.js
3. 编写 Worker 代码
在 workers/request/index.js 编写 Worker 响应代码

var utils = require('./utils')

// 在 Worker 线程执行上下文会全局暴露一个 `worker` 对象，直接调用 worker.onMessage/postMessage 即可
worker.onMessage(function (res) {
  console.log(res)
})
4. 在主线程中初始化 Worker
在主线程的代码 game.js 中初始化 Worker

var worker = wx.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径
从基础库 v2.27.3 开始，如果 worker 代码配置为了分包，则需要先通过 wx.preDownloadSubpackage 接口下载好 worker 代码，再初始化 Worker

var task = wx.preDownloadSubpackage({
   packageType: "workers", 
   success(res) {
      console.log("load worker success", res)
      var worker = wx.createWorker("workers/request/index.js")   // 创建 worker。 如果 worker 分包没下载完就调 createWorker 的话将报错
   },
   fail(res) {
      console.log("load worker fail", res)
   }
})

task.onProgressUpdate(res => {
  console.log(res.progress) // 可通过 onProgressUpdate 接口监听下载进度
  console.log(res.totalBytesWritten)
  console.log(res.totalBytesExpectedToWrite)
})
5. 主线程向 Worker 发送消息
worker.postMessage({
  msg: 'hello worker'
})
worker 对象的其它接口请看 worker接口说明

Tips
Worker 最大并发数量限制为 1 个，创建下一个前请用 Worker.terminate() 结束当前 Worker
Worker 内代码只能 require 指定 Worker 路径内的文件，无法引用其它路径
Worker 的入口文件由 wx.createWorker() 时指定，开发者可动态指定 Worker 入口文件
Worker 内不支持 wx 系列的 API
Workers 之间不支持发送消息
Worker 目录内只支持放置 JS 文件，其他类型的静态文件需要放在 Worker 目录外
基础库 v2.18.1 开始支持在插件内使用 worker。相应地，插件使用 worker 前需要在 plugin.json 内配置 workers 代码路径，即一个相对插件代码包根目录的路径


Worker 实例，主线程中可通过 wx.createWorker 接口获取，worker 线程中可通过全局变量 worker 获取。

属性
Object env
worker内的环境变量

属性	类型	说明
USER_DATA_PATH	string	文件系统中的用户目录路径 (本地路径)
方法
Worker.postMessage(Object message)
向主线程/Worker 线程发送的消息。

Worker.terminate()
结束当前 Worker 线程。仅限在主线程 worker 对象上调用。

Worker.testOnProcessKilled()
用于模拟 iOS ExperimentalWorker 线程被系统回收事件，以便于调试。接口仅在 worker 线程内可用。参考 Worker.onProcessKilled

Worker.onMessage(function listener)
监听主线程/Worker 线程向当前线程发送的消息的事件。

Worker.onError(function listener)
监听 Worker 线程错误事件。当 Worker 线程中发生脚本错误时会触发此事件。

Worker.onProcessKilled(function listener)
监听 worker线程被系统回收事件（开启 useExperimentalWorker 后，当iOS系统资源紧张时，ExperimentalWorker 线程存在被系统回收的可能，开发者可监听此事件并重新创建一个worker）。仅限在主线程 worker 对象上调用。

示例代码
运行以下代码需先进行基础配置，详细请查阅 多线程 Worker 文档了解基础知识和配置方法。

const worker = wx.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径

worker.onMessage(function (res) {
  console.log(res)
})
// 监听worker被系统回收事件
worker.onProcessKilled(function () {
  console.log('worker has been killed')
  // 重新创建一个worker
  // wx.createWorker()
})

worker.postMessage({
  msg: 'hello worker'
})

worker.terminate()