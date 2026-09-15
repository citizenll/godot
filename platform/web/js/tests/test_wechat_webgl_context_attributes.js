"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(path.resolve(__dirname, "../../display_server_web.cpp"), "utf8");
const start = source.indexOf("attributes.majorVersion = 2;");
const end = source.indexOf("EMSCRIPTEN_RESULT_SUCCESS;", start);
assert(start >= 0 && end > start, "context initialization block must exist");
// Execute the actual attribute assignments under both compile-time branches.
const initialization = source.slice(start, end + "EMSCRIPTEN_RESULT_SUCCESS;".length)
	.replace(/&attributes\b/g, "attributes")
	.replace(/^#ifdef WECHAT_GLX_EXPERIMENTAL$/gm, "if (compiledGLX) {")
	.replace(/^#else$/gm, "} else {")
	.replace(/^#endif$/gm, "}");

for (const [compiledGLX, runtimeGLX] of [[true, false], [true, true], [false, false]]) {
	let creates = 0;
	const context = {
		compiledGLX,
		attributes: {},
		wx_glx_enabled: false,
		canvas_id: "canvas",
		EMSCRIPTEN_RESULT_SUCCESS: 0,
		godot_js_display_is_wx_glx_enabled: () => Number(runtimeGLX),
		emscripten_webgl_create_context: (_canvas, attributes) => {
			creates++;
			// Emscripten rejects explicit swaps when the build has no offscreen support.
			return compiledGLX && attributes.explicitSwapControl ? 0 : 1;
		},
		emscripten_webgl_make_context_current: (handle) => handle === 1 ? 0 : -3,
	};
	vm.runInNewContext(initialization, context);
	assert.strictEqual(creates, 1);
	assert.strictEqual(context.webgl2_inited, true, `context failed: build GLX=${compiledGLX}, runtime GLX=${runtimeGLX}`);
	assert.strictEqual(context.wx_glx_enabled, runtimeGLX);
	assert.strictEqual(context.attributes.explicitSwapControl, !compiledGLX);
}

console.log("WeChat WebGL context attribute tests passed");
