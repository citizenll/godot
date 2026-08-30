const fs = require("fs");

const GODOT_JS_PATH = "./bin/.web_zip/godot.js";
const WASM_IMPORTS_MARKER = "var wasmImports={";

/**
 * Post-process the generated Emscripten glue so the WeChat runtime and the
 * experimental EmscriptenGLX path stay compatible with Godot's output.
 *
 * Keep this file focused on generated-JS compatibility only. Build-time
 * decisions such as compiler/linker flags belong in platform/web/detect.py.
 */

const REPLACE_RULES = [
    {
        name: "disable-window-title",
        match: `function _godot_js_display_window_title_set(p_data){document.title=GodotRuntime.parseString(p_data)}`,
        replace: `function _godot_js_display_window_title_set(p_data){}`,
    },
    {
        name: "performance-now-polyfill",
        match: `_emscripten_get_now=()=>performance.now()`,
        replace: `_emscripten_get_now=nowPolyfill`,
    },
    {
        name: "getvalue-i64",
        match: `case"i64":abort("to do getValue(i64) use WASM_BIGINT");`,
        replace: `case"i64":return HEAP32[ptr>>2];`,
    },
    {
        name: "setvalue-i64",
        match: `case"i64":abort("to do setValue(i64) use WASM_BIGINT");`,
        replace: `case"i64":tempI64=[value>>>0,(tempDouble=value,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble- +(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;`,
    },
    {
        name: "wx-fs-mount",
        match: `FS.mount(IDBFS,{},path)`,
        replace: `FS.mount(WXMEMFS,{},path)`,
    },
    {
        name: "wasm-runtimeerror-instanceof",
        match: `e instanceof WebAssembly.RuntimeError`,
        replace: `e`,
    },
    {
        name: "wasm-runtimeerror-constructor",
        match: `var e=new WebAssembly.RuntimeError(what);`,
        replace: `var e=(typeof WebAssembly!=="undefined"&&typeof WebAssembly.RuntimeError==="function")?new WebAssembly.RuntimeError(what):new Error(what);`,
    },
    {
        name: "wx-glx-after-do-frame-wrapper",
        match: `Module.wxContextGlobal.registerAfterDoFrame(Module._glxCommandBufferFlush)`,
        replace: `Module.wxContextGlobal.registerAfterDoFrame(function(){return Module._glxCommandBufferFlush();})`,
    },
    {
        name: "stat-ino-guard",
        match: `HEAP64[buf+88>>3]=BigInt(stat.ino);`,
        replace: `if(stat.ino)HEAP64[buf+88>>3]=BigInt(stat.ino);`,
    },
    {
        name: "temp-i64-vars",
        match: `var noExitRuntime=Module["noExitRuntime"]||false;`,
        replace: `var tempDouble;var tempI64;var noExitRuntime=Module["noExitRuntime"]||false;`,
    },
];

function replaceOnce(content, rule) {
    if (!content.includes(rule.match)) {
        console.warn(`skip ${rule.name}: pattern not found`);
        return content;
    }
    console.log(`apply ${rule.name}`);
    return content.replace(rule.match, rule.replace);
}

function ensureInvokeImportMappings(content) {
    const invokeMatches = Array.from(content.matchAll(/function\s+(invoke_[A-Za-z0-9_]+)\s*\(/g));
    const invokeNames = Array.from(new Set(invokeMatches.map((match) => match[1]))).sort();
    const missingMappings = invokeNames
        .filter((name) => !content.includes(`${name}:${name}`))
        .map((name) => `${name}:${name}`);

    if (missingMappings.length === 0) {
        return content;
    }

    console.log(`apply invoke-imports: ${missingMappings.length} missing mappings`);
    return content.replace(
        WASM_IMPORTS_MARKER,
        `${WASM_IMPORTS_MARKER}${missingMappings.join(",")},`
    );
}

function ensureCommitFrameWrapper(content) {
    const wrapperMarker = "var __godotMinigameOriginalCommitFrame=_emscripten_webgl_commit_frame;";
    if (content.includes(wrapperMarker)) {
        return content;
    }

    const importsIndex = content.indexOf(WASM_IMPORTS_MARKER);
    const declarationMatch = content.match(
        /(?:var|let|const)\s+_emscripten_webgl_commit_frame\s*=|function\s+_emscripten_webgl_commit_frame\s*\(/
    );
    if (!declarationMatch || declarationMatch.index >= importsIndex) {
        return content;
    }

    const wrapper = `${wrapperMarker}_emscripten_webgl_commit_frame=function(){var result=__godotMinigameOriginalCommitFrame();var context=typeof GL!=="undefined"&&GL.currentContext&&GL.currentContext.GLctx;if(context){if(typeof context.flush==="function"){context.flush()}if(typeof context.commit==="function"){context.commit()}}return result;};`;
    console.log("apply commit-frame-wrapper");
    return content.replace(
        WASM_IMPORTS_MARKER,
        `${wrapper}${WASM_IMPORTS_MARKER}`
    );
}

let content = fs.readFileSync(GODOT_JS_PATH, "utf-8");

content = ensureInvokeImportMappings(content);
content = ensureCommitFrameWrapper(content);

for (const rule of REPLACE_RULES) {
    content = replaceOnce(content, rule);
}

fs.writeFileSync(GODOT_JS_PATH, content);
console.log("patched");
