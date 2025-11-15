/**  
 * @externs  
 */
var GameGlobal
var GODOTFS = {
    joinPath: function (left, right) {
        if (right && right.length > 0) {
            return left + (right[0] === '/' ? right : '/' + right);
        }
        return left;
    },
    isCreatingFSFile: false,
    fileCache: {},
    notExistCache: {},
    mountpoint: '/',
    mount: function (mount) {
        // console.log('FS mount');
        GODOTFS.mountpoint = mount.mountpoint;
        return GODOTFS.createNode(null, '/', 16384 | 511, 0);
    },
    clearCache: function () {
        Object.keys(GODOTFS.fileCache).forEach(function (key) {
            var expreTime = Date.now() - 5000;
            if (
                GODOTFS.fileCache[key].readBuffer &&
                !GODOTFS.fileCache[key].fd &&
                GODOTFS.fileCache[key].lastReadTime < expreTime
            ) {
                GODOTFS.fileCache[key].readBuffer = null;
            }
        });
    },
    staticInit: function () {
        GODOTFS.syncfs();
        setInterval(function () {
            GODOTFS.clearCache();
        }, 5000);
    },
    getPath: function (path, name) {
        var tmpPath = path;
        if (path.startsWith(GODOTFS.mountpoint)) {
            tmpPath = path.substr(GODOTFS.mountpoint.length);
        }
        return GODOTFS.joinPath(`${wx.env.USER_DATA_PATH}${tmpPath}`, name);
    },
    getPathByNode: function (parent, name) {
        var path = FS.getPath(parent);
        return GODOTFS.getPath(path, name);
    },
    syncDeleteToCache: function (parent, name) {
        var path = GODOTFS.joinPath(FS.getPath(parent), name);
        if (GODOTFS.fileCache[path]) {
            delete GODOTFS.fileCache[path];
        }
        GODOTFS.notExistCache[path] = Date.now();
    },
    getErrno: function (e) {
        var errnoMap = {
            1300002: 44,
            1301005: 4,
            1300009: 8,
            1300001: 63,
            1300013: 2,
            1300014: 2,
            1300020: 54,
            1300021: 31,
            1300022: 28,
            1300036: 37,
            1300066: 55,
            1300202: 51,
            1301e3: 2,
            1301005: 4,
            1301006: 28,
            1301007: 28,
            1301009: 28,
        };
        if (e.errno) {
            if (errnoMap[e.errno]) {
                return errnoMap[e.errno];
            } else {
                err(e.message);
                return e.errno;
            }
        } else {
            if (e.message.indexOf('no such file or directory') >= 0) {
                return 44;
            } else if (e.message.indexOf('nput/output error') >= 0) {
                return 4;
            } else if (e.message.indexOf('bad file descriptor') >= 0) {
                return 8;
            } else if (e.message.indexOf('operation not permitted') >= 0) {
                return 63;
            } else if (e.message.indexOf('permission denied') >= 0 || e.message.indexOf('Path permission denied') >= 0) {
                return 2;
            } else if (e.message.indexOf('not a directory') >= 0) {
                return 54;
            } else if (e.message.indexOf('s a directory') >= 0) {
                return 31;
            } else if (e.message.indexOf('nvalid argument') >= 0) {
                return 28;
            } else if (e.message.indexOf('ile name too long') >= 0) {
                return 37;
            } else if (e.message.indexOf('directory not empty') >= 0) {
                return 55;
            } else if (e.message.indexOf('the maximum size of the file storage limit is exceeded') >= 0) {
                return 51;
            } else if (e.message.indexOf('file already exists') >= 0) {
                return 4;
            } else if (e.message.indexOf('is out of range') >= 0) {
                return 28;
            }
        }
    },
    createNode: function (parent, name, mode, dev) {
        var node_ops = {
            dir: {
                getattr: GODOTFS.getattr,
                lookup: GODOTFS.lookup,
                mknod: GODOTFS.mknod,
                rename: GODOTFS.rename,
                unlink: GODOTFS.unlink,
                rmdir: GODOTFS.rmdir,
                readdir: GODOTFS.readdir,
                setattr: GODOTFS.setattr,
            },
            file: {
                mknod: GODOTFS.mknod,
                getattr: GODOTFS.getattr,
                setattr: GODOTFS.setattr,
                unlink: GODOTFS.unlink,
                rename: GODOTFS.rename,
            },
        };
        var stream_ops = {
            dir: {
                llseek: GODOTFS.llseek,
            },
            file: {
                read: GODOTFS.read,
                write: GODOTFS.write,
                open: GODOTFS.open,
                close: GODOTFS.close,
                llseek: GODOTFS.llseek,
            },
        };
        const isDir = FS.isDir(mode);
        const isFile = FS.isFile(mode);
        if (!isDir && !isFile) {
            throw new FS.ErrnoError(28);
        }
        const key = isDir ? 'dir' : 'file';
        var node = FS.createNode(parent, name, mode);
        node.node_ops = node_ops[key];
        node.stream_ops = stream_ops[key];
        node.usedBytes = 0;
        var path = GODOTFS.joinPath(parent ? FS.getPath(parent) : '', name);
        if (GODOTFS.notExistCache[path]) {
            delete GODOTFS.notExistCache[path];
        }
        return node;
    },
    getFlagInfo: function (flag) {
        var flagStr;
        var O_WRONLY = flag & 1;
        var O_RDWR = flag & 2;
        if (O_RDWR || O_WRONLY) {
            var O_TRUNC = flag & 512;
            var O_EXCL = flag & 128;
            var O_APPEND = flag & 1024;
            if (O_APPEND) {
                flagStr += 'a';
                if (O_EXCL) {
                    flagStr += 'x';
                }
                if (O_RDWR) {
                    flagStr += '+';
                }
            } else if (O_TRUNC) {
                flagStr += 'w';
                if (O_EXCL) {
                    flagStr += 'x';
                }
                if (O_RDWR) {
                    flagStr += '+';
                }
            } else {
                flagStr = 'r+'; // hack，这里有可能不需要读，但是没有非trunc和append的w
            }
        } else {
            flagStr = 'r';
        }
        return flagStr;
    },
    createFSFile: function (parent, path, stat) {
        // console.log('GODOTFS createFSFile:', GODOTFS.joinPath(FS.getPath(parent), path));
        GODOTFS.isCreatingFSFile = true;
        var parts = path.split('/').reverse();
        var node = parent;
        stat.mode |= (292 | 146 | 73);
        var createNode = function (parent, part) {
            try {
                return GODOTFS.createNode(node, part, stat.mode);
            } catch (e) {
                console.log('FS createFSFile fail:', e.message);
                return null;
            }
        };
        while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            if (parts.length == 0) {
                node = createNode(node, part);
            } else {
                try {
                    node = FS.lookupNode(node, part);
                } catch (e) {
                    node = createNode(node, part);
                    if (!node) {
                        break;
                    }
                }
            }
        }
        if (!node) {
            GODOTFS.isCreatingFSFile = false;
            return null;
        }
        node.stat = stat;
        if (FS.isFile(stat.mode)) {
            node.usedBytes = stat.size;
        }
        GODOTFS.isCreatingFSFile = false;
        return node;
    },
    syncfs: function (mount, populate, done) {
        var root = FS.lookupPath(GODOTFS.mountpoint);
        if (!root.node) {
            console.log("Can't find mountpoint node:", GODOTFS.mountpoint);
            return;
        }
        var stats = wx.getFileSystemManager().statSync(`${wx.env.USER_DATA_PATH}`, true);
        if (Array.isArray(stats)) {
            stats.forEach(function (stat) {
                GODOTFS.createFSFile(root.node, GODOTFS.joinPath(GODOTFS.mountpoint, stat.path), stat.stats);
            });
        } else {
        }
        done()
    },
    runAndCatch: function (func, catchFunc) {
        try {
            return func();
        } catch (e) {
            if (catchFunc) {
                catchFunc(e);
            }
            throw new FS.ErrnoError(GODOTFS.getErrno(e));
        }
    },
    llseek: function (stream, offset, whence) {
        var position = offset;
        if (whence === 1) {
            position += stream.position;
        } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
                position += stream.node.usedBytes;
            }
        }
        if (position < 0) {
            throw new FS.ErrnoError(28);
        }
        return position;
    },
    getattr: function (node) {
        var st = node.stat;
        var now = Date.now();
        if (!node.stat || !node.stat.lastAccessedTime || now - node.lastStatTime > 5000) {
            var path = GODOTFS.getPathByNode(node);
            st = GODOTFS.runAndCatch(function () {
                return wx.getFileSystemManager().statSync(path);
            });
            if (st && GODOTFS.notExistCache[path]) {
                delete GODOTFS.notExistCache[path];
            }
        }
        st.mode |= (292 | 146 | 73);
        node.stat = st;
        node.mode = st.mode;
        node.lastStatTime = now;
        return {
            mode: st.mode,
            size: st.size,
            atime: new Date(st.lastAccessedTime * 1e3),
            mtime: new Date(st.lastModifiedTime * 1e3),
            ctime: new Date(st.lastAccessedTime * 1e3),
        };
    },
    setattr: function (node, attr) {
        if (attr.size) {
            var path = FS.getPath(node);
            GODOTFS.runAndCatch(
                function () {
                    wx.getFileSystemManager().truncateSync({
                        filePath: GODOTFS.getPath(path),
                        length: attr.size,
                    });
                    node.usedBytes = attr.size;
                    if (GODOTFS.fileCache[path] && GODOTFS.fileCache[path].readBuffer) {
                        if (attr.size > GODOTFS.fileCache[path].readBuffer.byteLength) {
                            var oldView = new Uint8Array(GODOTFS.fileCache[path].readBuffer);
                            GODOTFS.fileCache[path].readBuffer = new ArrayBuffer(attr.size);
                            var newView = new Uint8Array(GODOTFS.fileCache[path].readBuffer);
                            newView.set(oldView);
                            GODOTFS.fileCache[path].lastUpdateTime = Date.now();
                        } else if (attr.size < GODOTFS.fileCache[path].readBuffer.byteLength) {
                            GODOTFS.fileCache[path].readBuffer.resize(attr.size);
                            GODOTFS.fileCache[path].lastUpdateTime = Date.now();
                        }
                    }
                },
                function (e) {
                    console.error('GODOTFS truncate exception:', e.message);
                },
            );
            node.stat = node.stat || {};
            node.stat.size = attr.size;
        }
        node.stat = node.stat || {};
        node.stat.lastAccessedTime = attr.timestamp;
    },
    lookup: function (parent, name) {
        // 走到这个函数，说明存在没同步过的目录或文件，就顺便同步整个目录或文件
        if (GODOTFS.isCreatingFSFile) {
            throw new FS.ErrnoError(44);
        }
        var now = Date.now();
        var path = GODOTFS.getPathByNode(parent, name);
        var key = GODOTFS.joinPath(FS.getPath(parent), name);
        if (GODOTFS.notExistCache[key] && now - GODOTFS.notExistCache[key] < 1000) {
            throw new FS.ErrnoError(44);
        }
        var retNode;
        GODOTFS.runAndCatch(
            function () {
                var stats = wx.getFileSystemManager().statSync(path, true);
                if (stats.forEach) {
                    stats.forEach(function (stat) {
                        var node = GODOTFS.createFSFile(parent, name + (stat.path === '/' ? '' : stat.path), stat.stats);
                        node.lastStatTime = now;
                        if ('/' === stat.path) {
                            retNode = node;
                        }
                    });
                } else {
                    var node = GODOTFS.createFSFile(parent, name, stats);
                    node.lastStatTime = now;
                    retNode = node;
                }
            },
            function (e) {
                if (e.errno === 1300002 || e.message.indexOf('no such file or directory') >= 0) {
                    GODOTFS.notExistCache[key] = now;
                }
            },
        );
        if (retNode) {
            return retNode;
        } else {
            throw new FS.ErrnoError(44);
        }
    },
    mknod: function (parent, name, mode, dev) {
        var path = GODOTFS.joinPath(FS.getPath(parent), name);
        if (FS.isDir(mode)) {
            return GODOTFS.runAndCatch(
                function () {
                    wx.getFileSystemManager().mkdirSync(GODOTFS.getPath(path), true);
                    return GODOTFS.createNode(parent, name, mode);
                },
                function (e) {
                    console.error('GODOTFS mknod exception:', e.message);
                },
            );
        } else if (FS.isFile(mode)) {
            return GODOTFS.runAndCatch(
                function () {
                    wx.getFileSystemManager().writeFileSync(GODOTFS.getPath(path), '', 'utf-8');
                    return GODOTFS.createNode(parent, name, mode);
                },
                function (e) {
                    console.error('GODOTFS mknod exception:', e.message);
                },
            );
        }
        throw new FS.ErrnoError(63);
    },
    rename: function (old_node, new_dir, new_name) {
        GODOTFS.runAndCatch(function () {
            var oldPath = GODOTFS.getPathByNode(old_node);
            var newPath = GODOTFS.getPathByNode(new_dir, new_name);
            wx.getFileSystemManager().renameSync(oldPath, newPath);
            GODOTFS.syncDeleteToCache(old_node);
            var newFSPath = GODOTFS.joinPath(FS.getPath(new_dir), new_name);
            if (GODOTFS.notExistCache[newFSPath]) {
                delete GODOTFS.notExistCache[newFSPath];
            }
        });
    },
    unlink: function (parent, name) {
        GODOTFS.runAndCatch(function () {
            wx.getFileSystemManager().unlinkSync(GODOTFS.getPathByNode(parent, name));
            GODOTFS.syncDeleteToCache(parent, name);
        });
    },
    rmdir: function (parent, name) {
        GODOTFS.runAndCatch(function () {
            wx.getFileSystemManager().rmdirSync(GODOTFS.getPathByNode(parent, name));
            GODOTFS.syncDeleteToCache(parent, name);
        });
    },
    readdir: function (node) {
        return GODOTFS.runAndCatch(function () {
            var files = wx.getFileSystemManager().readdirSync(GODOTFS.getPathByNode(node));
            return files;
        });
    },
    open: function (stream) {
        GODOTFS.runAndCatch(
            function () {
                var flag = GODOTFS.getFlagInfo(stream.flags);
                var path = GODOTFS.getPath(stream.path);
                var fd = wx.getFileSystemManager().openSync({
                    filePath: path,
                    flag: flag,
                });
                stream.wxInfo = { fd: fd, path: path, flag: flag };
                stream.node.stat = stream.node.stat || {};
                stream.node.stat.lastAccessedTime = Date.now();
                stream.position = 0;
            },
            function (e) {
                console.error('GODOTFS open exception:', e.message);
            },
        );
    },
    close: function (stream) {
        if (stream.wxInfo.fd) {
            GODOTFS.runAndCatch(function () {
                wx.getFileSystemManager().closeSync({
                    fd: stream.wxInfo.fd,
                });
                var path = GODOTFS.getPath(stream.path);
                if (GODOTFS.fileCache[path]) {
                    GODOTFS.fileCache[path].fd = null;
                }
            });
        }
    },
    read: function (stream, buffer, offset, length, position) {
        var path = GODOTFS.getPath(stream.path);
        if (!GODOTFS.fileCache[path] || !GODOTFS.fileCache[path].readBuffer) {
            GODOTFS.fileCache[path] = GODOTFS.fileCache[path] || {
                flag: stream.wxInfo.flag,
                lastReadTime: Date.now(),
            };
            GODOTFS.runAndCatch(
                function () {
                    GODOTFS.fileCache[path].readBuffer = new Uint8Array(wx.getFileSystemManager().readFileSync(path, undefined, 0));
                },
                function (e) {
                    console.error('GODOTFS read exception:', e.message);
                },
            );
        }
        var content = GODOTFS.fileCache[path].readBuffer;
        if (position >= content.byteLength) return 0;
        var size = Math.min(content.byteLength - position, length);
        buffer.set(content.subarray(position, position + size), offset);
        return size;
    },
    write: function (stream, buffer, offset, length, position, canOwn) {
        if (!length) return 0;
        return GODOTFS.runAndCatch(
            function () {
                var bytesWritten = 0;
                var start = Date.now();
                while (bytesWritten < length) {
                    var nextToWrite = Math.min(length - bytesWritten, 9999999); // writeSync传入的buffer最大是10M
                    var data;
                    if (buffer.subarray) {
                        data = buffer.slice(offset + bytesWritten, offset + bytesWritten + nextToWrite);
                    } else if (buffer.length) {
                        data = new Uint8Array(nextToWrite);
                        for (let i = 0; i < nextToWrite; i++) {
                            var j = i + offset + bytesWritten;
                            if (j >= buffer.length) {
                                break;
                            }
                            data[i] = buffer[j];
                        }
                    } else {
                        console.error('TypeError: buffer not typedArray or Array but type: ', typeof buffer, ' write nothing');
                        return 0;
                    }
                    var res = wx.getFileSystemManager().writeSync({
                        fd: stream.wxInfo.fd,
                        data: data.buffer,
                        offset: 0,
                        length: nextToWrite,
                        position: position + bytesWritten,
                    });
                    bytesWritten += res.bytesWritten;
                }
                if (GODOTFS.fileCache[stream.path]) {
                    if (GODOTFS.fileCache[stream.path].readBuffer) {
                        var newOffset = position ? position + bytesWritten : bytesWritten;
                        if (newOffset > GODOTFS.fileCache[stream.path].readBuffer) {
                            var oldView = new Uint8Array(GODOTFS.fileCache[stream.path].readBuffer);
                            GODOTFS.fileCache[stream.path].readBuffer = new ArrayBuffer(newOffset);
                            var newView = new Uint8Array(GODOTFS.fileCache[stream.path].readBuffer);
                            newView.set(oldView);
                        }
                        var tmpData = new Uint8Array(GODOTFS.fileCache[stream.path].readBuffer);
                        var writeOffet = position ? position : 0;
                        if (buffer.subarray) {
                            tmpData.set(buffer.subarray(offset, length), writeOffet);
                        } else {
                            for (let i = 0; i < length; i++) {
                                tmpData[i + writeOffet] = buffer[i + offset];
                            }
                        }
                    }
                }
                // console.log("write cost:", Date.now() - start, "ms, bytesWritten:", bytesWritten);
                stream.node.stat = stream.node.stat || {};
                var now = Date.now();
                stream.node.stat.lastAccessedTime = now;
                stream.node.stat.lastModifiedTime = now;
                if (position + bytesWritten > stream.node.usedBytes) {
                    stream.node.usedBytes = position + bytesWritten;
                    stream.node.stat.size = stream.node.usedBytes;
                }
                return bytesWritten;
            },
            function (e) {
                console.error('GODOTFS write exception:', e.message);
            },
        );
    },
};
