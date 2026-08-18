"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");

const SCRIPT_PATH = path.resolve(__dirname, "../../../../godot_process.js");
const EMPTY_SHIM = "var _emscripten_webgl_commit_frame=function(){};";
const WRAPPER_MARKER = "var __godotMinigameOriginalCommitFrame=_emscripten_webgl_commit_frame;";

function processFixture(source, runs = 1) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "godot-minigame-commit-frame-"));
	const outputPath = path.join(root, "bin", ".web_zip", "godot.js");
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, source);
	try {
		for (let i = 0; i < runs; i += 1) {
			childProcess.execFileSync(process.execPath, [SCRIPT_PATH], { cwd: root, stdio: "pipe" });
		}
		return fs.readFileSync(outputPath, "utf8");
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
}

const generatedGlue = [
	"var calls=[];",
	"var GL={currentContext:{GLctx:{flush:function(){calls.push('flush')},commit:function(){calls.push('commit')}}}};",
	"var _emscripten_webgl_do_commit_frame=function(){calls.push('original');return 17};",
	"var _emscripten_webgl_commit_frame=_emscripten_webgl_do_commit_frame;",
	"var wasmImports={a:_emscripten_webgl_commit_frame};",
].join("");

const processed = processFixture(generatedGlue, 2);
assert(!processed.includes(EMPTY_SHIM), "must not replace Emscripten's commit implementation with a no-op");
assert.strictEqual(processed.split(WRAPPER_MARKER).length - 1, 1, "wrapper must be idempotent");

const context = {};
vm.createContext(context);
vm.runInContext(`${processed}result=wasmImports.a();`, context);
assert.strictEqual(context.result, 17);
assert.deepStrictEqual(Array.from(context.calls), ["original", "flush", "commit"]);

const withoutCommitImport = processFixture("var existing=function(){};var wasmImports={a:existing};");
assert(!withoutCommitImport.includes("_emscripten_webgl_commit_frame"), "must not invent a missing frame import");

console.log("godot_process commit-frame tests passed");
