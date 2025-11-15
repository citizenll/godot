const GodotFetch = {
    $GodotFetch__deps: ['$IDHandler', '$GodotRuntime'],
    $GodotFetch: {
        onread: function (id, result) {
            const obj = IDHandler.get(id);
            if (!obj) {
                return;
            }
            if (result.value) {
                obj.chunks.push(result.value);
            }
            obj.reading = false;
            obj.done = result.done;
        },

        onresponse: function (id, response) {
            const obj = IDHandler.get(id);
            if (!obj) {
                return;
            }
            obj.status = response.statusCode;
            obj.response = response;
            obj.chunked = false; // wx.request doesn't support chunked transfer
            obj.bodySize = response.data.byteLength;
            obj.chunks = [new Uint8Array(response.data)];
            obj.done = true;
        },

        onerror: function (id, err) {
            GodotRuntime.error(err);
            const obj = IDHandler.get(id);
            if (!obj) {
                return;
            }
            obj.error = err;
        },

        create: function (method, url, headers, body) {
            const obj = {
                request: null,
                response: null,
                error: null,
                done: false,
                reading: false,
                status: 0,
                chunks: [],
                bodySize: -1,
            };
            const id = IDHandler.add(obj);

            wx.request({
                url: url,
                method: method,
                data: body,
                header: headers,
                responseType: 'arraybuffer',
                success: (res) => GodotFetch.onresponse(id, res),
                fail: (err) => GodotFetch.onerror(id, err)
            });

            return id;
        },

        free: function (id) {
            IDHandler.remove(id);
        },

        read: function (id) {
            // wx.request doesn't support streaming, so we don't need to implement this
        },
    },

    godot_js_fetch_create__sig: 'iiiiiii',
    godot_js_fetch_create: function (p_method, p_url, p_headers, p_headers_size, p_body, p_body_size) {
        const method = GodotRuntime.parseString(p_method);
        const url = GodotRuntime.parseString(p_url);
        const headers = GodotRuntime.parseStringArray(p_headers, p_headers_size);
        const body = p_body_size ? GodotRuntime.heapSlice(HEAP8, p_body, p_body_size) : null;
        return GodotFetch.create(method, url, headers.reduce((acc, hv) => {
            const idx = hv.indexOf(':');
            if (idx > 0) {
                acc[hv.slice(0, idx).trim()] = hv.slice(idx + 1).trim();
            }
            return acc;
        }, {}), body);
    },

    godot_js_fetch_state_get__sig: 'ii',
    godot_js_fetch_state_get: function (p_id) {
        const obj = IDHandler.get(p_id);
        if (!obj) {
            return -1;
        }
        if (obj.error) {
            return -1;
        }
        if (!obj.response) {
            return 0;
        }
        if (obj.done) {
            return 2;
        }
        return 1;
    },

    godot_js_fetch_http_status_get__sig: 'ii',
    godot_js_fetch_http_status_get: function (p_id) {
        const obj = IDHandler.get(p_id);
        if (!obj || !obj.response) {
            return 0;
        }
        return obj.status;
    },

    godot_js_fetch_read_headers__sig: 'iiii',
    godot_js_fetch_read_headers: function (p_id, p_parse_cb, p_ref) {
        const obj = IDHandler.get(p_id);
        if (!obj || !obj.response) {
            return 1;
        }
        const cb = GodotRuntime.get_func(p_parse_cb);
        const arr = Object.entries(obj.response.header).map(([h, v]) => `${h}:${v}`);
        const c_ptr = GodotRuntime.allocStringArray(arr);
        cb(arr.length, c_ptr, p_ref);
        GodotRuntime.freeStringArray(c_ptr, arr.length);
        return 0;
    },

    godot_js_fetch_read_chunk__sig: 'iiii',
    godot_js_fetch_read_chunk: function (p_id, p_buf, p_buf_size) {
        const obj = IDHandler.get(p_id);
        if (!obj || !obj.response) {
            return 0;
        }
        let to_read = p_buf_size;
        const chunks = obj.chunks;
        while (to_read && chunks.length) {
            const chunk = chunks[0];
            if (chunk.length > to_read) {
                GodotRuntime.heapCopy(HEAP8, chunk.slice(0, to_read), p_buf);
                chunks[0] = chunk.slice(to_read);
                to_read = 0;
            } else {
                GodotRuntime.heapCopy(HEAP8, chunk, p_buf);
                to_read -= chunk.length;
                chunks.shift();
            }
        }
        return p_buf_size - to_read;
    },

    godot_js_fetch_body_length_get__sig: 'ii',
    godot_js_fetch_body_length_get: function (p_id) {
        const obj = IDHandler.get(p_id);
        if (!obj || !obj.response) {
            return -1;
        }
        return obj.bodySize;
    },

    godot_js_fetch_is_chunked__sig: 'ii',
    godot_js_fetch_is_chunked: function (p_id) {
        return 0; // wx.request doesn't support chunked transfer
    },

    godot_js_fetch_free__sig: 'vi',
    godot_js_fetch_free: function (id) {
        GodotFetch.free(id);
    },
};

autoAddDeps(GodotFetch, '$GodotFetch');
mergeInto(LibraryManager.library, GodotFetch);