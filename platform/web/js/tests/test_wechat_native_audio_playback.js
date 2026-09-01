const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const pendingStopEvents = [];
const createdContexts = [];

class FakeInnerAudioContext {
	constructor() {
		this.listeners = new Map();
		this._src = "";
		this.srcAssignments = 0;
		this.autoplay = false;
		this.loop = false;
		this.volume = 1;
		this.playbackRate = 1;
		this.startTime = 0;
		this.currentTime = 0;
		this.destroyed = false;
		createdContexts.push(this);
	}

	get src() {
		return this._src;
	}

	set src(value) {
		this._src = value;
		this.srcAssignments += 1;
	}

	on(name, callback) {
		this.listeners.set(name, callback);
	}

	off(name) {
		this.listeners.delete(name);
	}

	emit(name, value) {
		const callback = this.listeners.get(name);
		if (callback) {
			callback(value);
		}
	}

	onCanplay(callback) { this.on("canplay", callback); }
	onPlay(callback) { this.on("play", callback); }
	onPause(callback) { this.on("pause", callback); }
	onStop(callback) { this.on("stop", callback); }
	onEnded(callback) { this.on("ended", callback); }
	onTimeUpdate(callback) { this.on("timeupdate", callback); }
	onError(callback) { this.on("error", callback); }
	onWaiting(callback) { this.on("waiting", callback); }
	onSeeking(callback) { this.on("seeking", callback); }
	onSeeked(callback) { this.on("seeked", callback); }
	offCanplay() { this.off("canplay"); }
	offPlay() { this.off("play"); }
	offPause() { this.off("pause"); }
	offStop() { this.off("stop"); }
	offEnded() { this.off("ended"); }
	offTimeUpdate() { this.off("timeupdate"); }
	offError() { this.off("error"); }
	offWaiting() { this.off("waiting"); }
	offSeeking() { this.off("seeking"); }
	offSeeked() { this.off("seeked"); }

	play() {}
	pause() {}

	stop() {
		pendingStopEvents.push(this);
	}

	destroy() {
		this.destroyed = true;
	}
}

const heap = new Float32Array([0.25, 0.25]);
const context = {
	ArrayBuffer,
	DataView,
	GameGlobal: {},
	GodotRuntime: {
		heapSub: () => heap,
	},
	HEAPF32: heap,
	HEAPU8: new Uint8Array(0),
	LibraryManager: { library: {} },
	Map,
	Math,
	Number,
	Promise,
	Set,
	Uint8Array,
	console,
	autoAddDeps() {},
	mergeInto() {},
	wx: {
		createInnerAudioContext: () => new FakeInnerAudioContext(),
	},
};

vm.createContext(context);
const source =
	fs.readFileSync("platform/web/js/libs/library_godot_audio.js", "utf8") +
	"\n;globalThis.GodotAudio = _GodotAudio.$GodotAudio; globalThis.__GodotAudio = GodotAudio;";
vm.runInContext(source, context);

const audio = context.__GodotAudio.WX;
audio.nativeStreams = new Map();
audio.activePlaybacks = new Map();
audio.contextPool = [];
audio.busVolumes = new Map();
audio.busMutes = new Map();
audio.subpackageLoads = new Map();

function registerStream(id, path) {
	audio.nativeStreams.set(id, {
		kind: "package",
		hash: id,
		path,
		subpackage: "",
		codec: "mp3",
		loopMode: "forward",
	});
}

async function flushPromiseJobs() {
	await Promise.resolve();
}

async function main() {
	registerStream("stream-a", "music/a.mp3");
	registerStream("stream-b", "music/b.mp3");
	registerStream("stream-c", "music/c.mp3");

	audio.startSample("bgm", "stream-a", 2, 0, 1, 0);
	await flushPromiseJobs();
	const firstContext = audio.activePlaybacks.get("bgm").ctx;
	assert.strictEqual(firstContext.loop, true);
	assert.strictEqual(firstContext.volume, 0.25);

	assert.strictEqual(audio.stopSample("bgm"), true);
	assert.strictEqual(firstContext.destroyed, true, "stopped contexts must be destroyed");
	assert.strictEqual(audio.contextPool.length, 0, "stopped contexts must not enter the pool");

	audio.startSample("bgm", "stream-b", 2, 0, 1, 0);
	await flushPromiseJobs();
	const secondPlayback = audio.activePlaybacks.get("bgm");
	const secondContext = secondPlayback.ctx;
	assert.notStrictEqual(secondContext, firstContext, "new playback must receive a clean context");

	const staleStopContext = pendingStopEvents.shift();
	assert.strictEqual(staleStopContext, firstContext);
	staleStopContext.emit("stop");
	assert.strictEqual(
		audio.activePlaybacks.get("bgm"),
		secondPlayback,
		"a delayed stop event must not clean up the replacement playback"
	);
	assert.strictEqual(secondContext.loop, true);
	assert.strictEqual(secondContext.volume, 0.25);

	audio.setBusMute(2, true);
	assert.strictEqual(secondContext.volume, 0);
	audio.setBusMute(2, false);
	assert.strictEqual(secondContext.volume, 0.25);

	secondContext.emit("ended");
	assert.strictEqual(audio.activePlaybacks.has("bgm"), false);
	assert.strictEqual(audio.contextPool.length, 1, "naturally ended contexts should remain reusable");

	audio.startSample("bgm", "stream-c", 2, 0, 1, 0);
	await flushPromiseJobs();
	const thirdContext = audio.activePlaybacks.get("bgm").ctx;
	assert.notStrictEqual(
		thirdContext,
		secondContext,
		"a pooled context must not be rebound to a different source"
	);
	assert.strictEqual(audio.contextPool.includes(secondContext), true);

	thirdContext.emit("ended");
	audio.startSample("bgm", "stream-c", 2, 0, 1, 0);
	await flushPromiseJobs();
	assert.strictEqual(
		audio.activePlaybacks.get("bgm").ctx,
		thirdContext,
		"a pooled context should remain reusable for the same source"
	);
	assert.strictEqual(firstContext.srcAssignments, 1);
	assert.strictEqual(secondContext.srcAssignments, 1);
	assert.strictEqual(thirdContext.srcAssignments, 1);

	assert.strictEqual(createdContexts.length, 3);
	console.log("WeChat native audio playback lifecycle tests passed");
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
