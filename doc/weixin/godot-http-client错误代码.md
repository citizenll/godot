● RESULT_SUCCESS = 0
请求成功。
● RESULT_CHUNKED_BODY_SIZE_MISMATCH = 1
请求失败，传输的实际数据块大小与预期不符。可能的原因有网络错误、服务器配置问题、数据块编码问题等。
● RESULT_CANT_CONNECT = 2
连接时请求失败。
● RESULT_CANT_RESOLVE = 3
解析时请求失败。
● RESULT_CONNECTION_ERROR = 4
因连接（读写）错误而失败。
● RESULT_TLS_HANDSHAKE_ERROR = 5
TLS 握手时请求失败。
● RESULT_NO_RESPONSE = 6
请求（目前还）没有获得相应。
● RESULT_BODY_SIZE_LIMIT_EXCEEDED = 7
请求超出了大小上限，见 body_size_limit。
● RESULT_BODY_DECOMPRESS_FAILED = 8
请求失败，解压响应体出错。可能的原因有压缩格式不支持、压缩格式错误、数据损坏、传输不完整等。
● RESULT_REQUEST_FAILED = 9
请求失败（目前未使用）。
● RESULT_DOWNLOAD_FILE_CANT_OPEN = 10
HTTPRequest 无法打开下载文件。
● RESULT_DOWNLOAD_FILE_WRITE_ERROR = 11
HTTPRequest 无法写入下载文件。
● RESULT_REDIRECT_LIMIT_REACHED = 12
请求超出了重定向次数上限，见 max_redirects。
● RESULT_TIMEOUT = 13
请求由于超时而失败。如果本就希望请求花费较长的时间，请尝试增大 timeout，或将其设为 0.0 从而完全移除超时。