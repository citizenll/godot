const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

class FakeAudioNode {
	constructor(name) {
		this.name = name;
		this.gain = { value: 1 };
		this.connections = [];
	}

	connect(node) {
		this.connections.push(node);
		return node;
	}

	disconnect() {
		this.connections = [];
	}
}

class FakeAudioContext {
	constructor() {
		this.destination = new FakeAudioNode("destination");
		this.nextNodeId = 0;
	}

	createGain() {
		return new FakeAudioNode(`gain-${this.nextNodeId++}`);
	}
}

const context = {
	ArrayBuffer,
	DataView,
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
};
vm.createContext(context);
const source =
	fs.readFileSync("platform/web/js/libs/library_godot_audio.js", "utf8") +
	"\n;globalThis.GodotAudio = _GodotAudio.$GodotAudio; globalThis.__GodotAudio = GodotAudio;";
vm.runInContext(source, context);

const audio = context.__GodotAudio;
audio.ctx = new FakeAudioContext();
audio.buses = [];
audio.busSolo = null;

const master = audio.Bus.create();
master.label = "Master";
audio.Bus.addAt(-1);
const appended = audio.Bus.getBus(1);
appended.label = "Appended";

assert.deepStrictEqual(
	audio.buses.map((bus) => bus.label),
	["Master", "Appended"],
	"addAt(-1) must append without moving the new bus before Master"
);
assert.strictEqual(master.getSend(), null, "Master must remain connected to the output");
assert.strictEqual(appended.getSend(), master, "new buses must send to Master");
assert.deepStrictEqual(master.getOutputNode().connections, [audio.ctx.destination]);
assert.deepStrictEqual(appended.getOutputNode().connections, [master.getInputNode()]);

audio.set_sample_bus_send(1, 0);
assert.strictEqual(master.getSend(), null, "setting the appended bus send must not modify Master");
assert.strictEqual(appended.getSend(), master);
assert.deepStrictEqual(master.getOutputNode().connections, [audio.ctx.destination]);

for (const label of ["B", "C"]) {
	audio.Bus.addAt(-1);
	audio.Bus.getBus(audio.buses.length - 1).label = label;
}

audio.Bus.move(3, 1);
assert.deepStrictEqual(
	audio.buses.map((bus) => bus.label),
	["Master", "C", "Appended", "B"],
	"moving a bus backward must use the requested destination index"
);

audio.Bus.move(1, 4);
assert.deepStrictEqual(
	audio.buses.map((bus) => bus.label),
	["Master", "Appended", "B", "C"],
	"moving a bus forward must account for removal of the source index"
);

audio.Bus.move(1, -1);
assert.deepStrictEqual(
	audio.buses.map((bus) => bus.label),
	["Master", "B", "C", "Appended"],
	"move(..., -1) must append"
);

audio.Bus.move(2, 2);
assert.deepStrictEqual(
	audio.buses.map((bus) => bus.label),
	["Master", "B", "C", "Appended"],
	"moving a bus to its current position must be a no-op"
);

audio.Bus.addAt(1);
audio.Bus.getBus(1).label = "Inserted";
assert.deepStrictEqual(
	audio.buses.map((bus) => bus.label),
	["Master", "Inserted", "B", "C", "Appended"],
	"addAt(index) must insert at the same index used by AudioServer"
);

console.log("Web audio sample bus tests passed");
