const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

function createCanvas(initialContextType = null, allowModeMismatch = false) {
	let contextType = initialContextType;
	let glContext = initialContextType ? createGLContext(initialContextType) : null;
	const requests = [];

	return {
		requests,
		getContext(requestedType) {
			requests.push(requestedType);
			if (contextType && contextType !== requestedType && !allowModeMismatch) {
				return null;
			}
			if (!contextType) {
				contextType = requestedType;
				glContext = createGLContext(requestedType);
			}
			return glContext;
		},
	};
}

function createGLContext(contextType) {
	const isWXGLX = contextType === "wxwebgl" || contextType === "wxwebgl2";
	return {
		emscriptenglxContextType: contextType,
		emscriptenGLX: isWXGLX
			? {
				ctxid: 7,
				isWebGL2: contextType === "wxwebgl2",
				platform: 2,
				registerAfterDoFrame() {},
			}
			: null,
	};
}

function createHarness({ pinnedMode, disabled = false, initialContextType = null, allowModeMismatch = false } = {}) {
	const nativeCalls = [];
	const gameGlobal = {};
	if (typeof pinnedMode === "boolean") {
		gameGlobal.__godotMinigameWXGLXEnabled = pinnedMode;
	}
	if (disabled) {
		gameGlobal.__GODOT_DISABLE_WXGLX = true;
	}

	const context = {
		GameGlobal: gameGlobal,
		HEAPU8: new Uint8Array(0),
		HEAPU32: new Uint32Array(0),
		Module: {
			_glxInit: (enabled) => nativeCalls.push(["init", enabled]),
			_glxInitBufferDataAndGlState: (version, platform) =>
				nativeCalls.push(["buffer", version, platform]),
			_glxUpdateContextId: (id) => nativeCalls.push(["context", id]),
		},
		UTF8Decoder: new TextDecoder(),
		UTF8ToString: () => "",
		addOnPostRun() {},
		console,
		wx: {
			env: { isSupportEmscriptenGLX: true },
		},
	};

	context.GL = {
		contexts: [],
		currentContext: null,
		createContext(canvas, attributes) {
			const type = attributes.majorVersion === 2 ? "webgl2" : "webgl";
			const glContext = canvas.getContext(type, attributes);
			if (!glContext) {
				return 0;
			}
			this.contexts[1] = { GLctx: glContext };
			return 1;
		},
		makeContextCurrent(handle) {
			this.currentContext = this.contexts[handle] || null;
			return true;
		},
	};

	vm.createContext(context);
	vm.runInContext(fs.readFileSync("platform/web/js/patches/patch_em_gl.js", "utf8"), context);
	return {
		canvas: createCanvas(initialContextType, allowModeMismatch),
		context,
		gameGlobal,
		nativeCalls,
	};
}

function createWebGL2(harness) {
	return harness.context.GL.createContext(harness.canvas, { majorVersion: 2 });
}

{
	const harness = createHarness({ pinnedMode: true, initialContextType: "wxwebgl2" });
	assert.strictEqual(createWebGL2(harness), 1);
	assert.deepStrictEqual(harness.canvas.requests, ["wxwebgl2"]);
	assert.strictEqual(harness.gameGlobal.__godotMinigameWXGLXEnabled, true);
	assert.deepStrictEqual(harness.nativeCalls, [
		["init", true],
		["buffer", 2, 2],
		["context", 7],
	]);
}

{
	const harness = createHarness({ pinnedMode: false, initialContextType: "webgl2" });
	assert.strictEqual(createWebGL2(harness), 1);
	assert.deepStrictEqual(harness.canvas.requests, ["webgl2"]);
	assert.strictEqual(harness.gameGlobal.__godotMinigameWXGLXEnabled, false);
	assert.deepStrictEqual(harness.nativeCalls, [["init", false]]);
}

{
	const harness = createHarness({ disabled: true });
	assert.strictEqual(createWebGL2(harness), 1);
	assert.deepStrictEqual(harness.canvas.requests, ["webgl2"]);
	assert.strictEqual(harness.gameGlobal.__godotMinigameWXGLXEnabled, false);
}

{
	const harness = createHarness();
	assert.strictEqual(createWebGL2(harness), 1);
	assert.deepStrictEqual(harness.canvas.requests, ["wxwebgl2"]);
	assert.strictEqual(harness.gameGlobal.__godotMinigameWXGLXEnabled, true);
}

{
	const harness = createHarness({ pinnedMode: true, initialContextType: "webgl2" });
	assert.throws(
		() => createWebGL2(harness),
		/Failed to create pinned wxwebgl2 context/,
		"a pinned GLX mode must not fall back to a standard context"
	);
	assert.deepStrictEqual(harness.canvas.requests, ["wxwebgl2"]);
}

{
	const harness = createHarness({
		pinnedMode: true,
		initialContextType: "webgl2",
		allowModeMismatch: true,
	});
	assert.throws(
		() => createWebGL2(harness),
		/Canvas context mode mismatch/,
		"a context returned in the wrong mode must fail before rendering starts"
	);
}

console.log("WeChat GLX runtime selection tests passed");
