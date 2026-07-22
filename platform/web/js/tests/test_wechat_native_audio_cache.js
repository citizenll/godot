const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

class MemoryFileSystem {
	constructor() {
		this.directories = new Set(["/", "/user"]);
		this.files = new Map();
	}

	mkdirSync(path, recursive) {
		if (this.directories.has(path) || this.files.has(path)) {
			throw new Error("mkdirSync:fail file already exists");
		}
		const parts = path.split("/").filter(Boolean);
		let current = "";
		for (const part of parts) {
			current += `/${part}`;
			if (!recursive && current !== path && !this.directories.has(current)) {
				throw new Error(`Missing parent directory: ${current}`);
			}
			this.directories.add(current);
		}
	}

	statSync(path) {
		if (this.files.has(path)) {
			return {
				size: this.files.get(path).byteLength,
				isDirectory: () => false,
			};
		}
		if (this.directories.has(path)) {
			return {
				size: 0,
				isDirectory: () => true,
			};
		}
		throw new Error(`Missing path: ${path}`);
	}

	readdirSync(path) {
		const prefix = `${path}/`;
		const entries = new Set();
		for (const filePath of this.files.keys()) {
			if (filePath.startsWith(prefix)) {
				const rest = filePath.slice(prefix.length);
				if (!rest.includes("/")) {
					entries.add(rest);
				}
			}
		}
		return Array.from(entries);
	}

	writeFileSync(path, data) {
		let bytes;
		if (typeof data === "string") {
			bytes = Buffer.from(data, "utf8");
		} else if (data instanceof ArrayBuffer) {
			bytes = Buffer.from(new Uint8Array(data));
		} else if (ArrayBuffer.isView(data)) {
			bytes = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
		} else {
			throw new Error("Unsupported write payload");
		}
		this.files.set(path, Buffer.from(bytes));
	}

	readFileSync(path, encoding) {
		const bytes = this.files.get(path);
		if (!bytes) {
			throw new Error(`Missing file: ${path}`);
		}
		return encoding === "utf8" ? bytes.toString("utf8") : Buffer.from(bytes);
	}

	unlinkSync(path) {
		if (!this.files.delete(path)) {
			throw new Error(`Missing file: ${path}`);
		}
	}

	renameSync(from, to) {
		const bytes = this.files.get(from);
		if (!bytes) {
			throw new Error(`Missing file: ${from}`);
		}
		this.files.set(to, bytes);
		this.files.delete(from);
	}
}

const memoryFs = new MemoryFileSystem();
const context = {
	ArrayBuffer,
	Buffer,
	DataView,
	GameGlobal: {
		__godotMinigameNativeAudioCacheLimitBytes: 10,
	},
	HEAPF32: new Float32Array(0),
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
		env: { USER_DATA_PATH: "/user" },
		getFileSystemManager: () => memoryFs,
	},
};
vm.createContext(context);
const source =
	fs.readFileSync("platform/web/js/libs/library_godot_audio.js", "utf8") +
	"\n;globalThis.GodotAudio = _GodotAudio.$GodotAudio; globalThis.__GodotAudio = GodotAudio;";
vm.runInContext(source, context);

const audio = context.__GodotAudio.WX;
audio.init();

const hashA = "a".repeat(64);
const hashB = "b".repeat(64);
const hashC = "c".repeat(64);
const hashD = "d".repeat(64);
assert(audio.materializeCacheFile(hashA, "mp3", new Uint8Array(6)));
assert(audio.materializeCacheFile(hashB, "mp3", new Uint8Array(6)));
assert(!audio.cacheRecords.has(hashA), "oldest unlocked entry should be evicted");
assert(audio.acquireCache(hashB));
assert.strictEqual(
	audio.materializeCacheFile(hashC, "mp3", new Uint8Array(6)),
	"",
	"active entries must not be evicted"
);
audio.releaseCache(hashB);
assert(audio.materializeCacheFile(hashC, "mp3", new Uint8Array(6)));
assert(!audio.cacheRecords.has(hashB));

const cachedCPath = audio.cacheRecords.get(hashC).path;
memoryFs.unlinkSync(cachedCPath);
assert(audio.materializeCacheFile(hashC, "mp3", new Uint8Array(4)));
assert.strictEqual(audio.cacheBytes, 4, "missing indexed files must not remain in byte accounting");
assert(audio.acquireCache(hashC));
audio.invalidateCacheRecord(hashC);
assert(memoryFs.files.has(cachedCPath), "active invalid entries must remain until playback releases them");
assert.strictEqual(audio.acquireCache(hashC), false, "invalid entries must reject new playback");
audio.releaseCache(hashC);
assert(!audio.cacheRecords.has(hashC), "invalid entries must be deleted after the final playback releases them");

assert(audio.materializeCacheFile(hashC, "mp3", new Uint8Array(4)));

memoryFs.writeFileSync(`/user/godot_native_audio/${hashD}.aac`, new Uint8Array(2));
memoryFs.writeFileSync("/user/godot_native_audio/crash.tmp", new Uint8Array(2));
audio.init();
assert(audio.cacheRecords.has(hashC), "indexed entries should survive restart");
assert(audio.cacheRecords.has(hashD), "valid orphan files should be recovered");
assert(!memoryFs.files.has("/user/godot_native_audio/crash.tmp"));
assert.strictEqual(audio.cacheRefs.size, 0, "playback references must remain in memory only");
assert(
	!memoryFs.readdirSync("/user/godot_native_audio").some((file) => file.endsWith(".tmp")),
	"atomic writes must not leave temporary files"
);

const packageHash = "e".repeat(64);
audio.manifest = {
	aliases: {
		"res://music/theme.mp3": packageHash,
		"uid://theme": packageHash,
	},
	assets: {
		[packageHash]: {
			src: `subpackages/music/native_audio/${packageHash}.mp3`,
			subpackage: "music",
			codec: "mp3",
		},
	},
};
const filesBeforePackageRegistration = memoryFs.files.size;
audio.registerNativeStream(
	"packaged-stream",
	"res://music/theme.mp3",
	"uid://theme",
	packageHash,
	0,
	0,
	"mp3",
	"disabled",
	0,
	0
);
assert.deepStrictEqual(
	JSON.parse(JSON.stringify(audio.nativeStreams.get("packaged-stream"))),
	{
		kind: "package",
		hash: packageHash,
		path: `subpackages/music/native_audio/${packageHash}.mp3`,
		subpackage: "music",
		codec: "mp3",
		loopMode: "disabled",
	},
	"manifest assets should register as direct package streams"
);
assert.strictEqual(
	memoryFs.files.size,
	filesBeforePackageRegistration,
	"package streams must not consume user storage"
);
let subpackageLoadCount = 0;
context.wx.loadSubpackage = ({ success }) => {
	subpackageLoadCount++;
	success();
};
const firstSubpackageLoad = audio.ensureSubpackage("music");
const secondSubpackageLoad = audio.ensureSubpackage("music");
assert.strictEqual(firstSubpackageLoad, secondSubpackageLoad);
assert.strictEqual(subpackageLoadCount, 1, "concurrent subpackage loads must be coalesced");

console.log("WeChat native audio cache tests passed");
