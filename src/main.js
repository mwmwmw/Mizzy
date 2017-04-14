import Events from "./Events";
import Generate from "./Generate";
import NoteProcessor from "./NoteProcessor";
import Notation from "./Notation";


export default class Mizzy extends Events{
	constructor() {
		super();
		this.keysPressed = [];
		this.midiAccess = null;
		this.loopback = true;

		this.boundInputs = [];
		this.boundOutputs = [];

		this.key = Notation.Keys[0]; // C-Major
		if (!window.MIDIMessageEvent) {
			window.MIDIMessageEvent = (name, params) => {
				this.name = name;
				return Object.assign(this, params);
			}
		}
		if (this.midiAccess === null) {
			if (navigator.requestMIDIAccess) {
				navigator.requestMIDIAccess({
					sysex: false
				}).then((e) => this.onMIDISuccess(e), (e) => this.onMIDIFailure(e));
			} else {
				throw "Your browser has no midi support";
			}
		}
	}

	setKey(keyname) {
		this.key = keyname;
	}

	getMidiInputs() {
		if (this.midiAccess != null) {
			return this.midiAccess.inputs.values();
		}
	}

	getMidiOutputs() {
		if (this.midiAccess != null) {
			return this.midiAccess.outputs.values();
		}
	}
	

	get outputDevices() {
		let deviceArray = [];
		let devices = this.getMidiOutputs();
		for (let input = devices.next(); input && !input.done; input = devices.next()) {
			deviceArray.push(input.value);
		}
		return deviceArray;
	}

	get inputDevices() {
		let deviceArray = [];
		let devices = this.getMidiInputs();
		for (let input = devices.next(); input && !input.done; input = devices.next()) {
			deviceArray.push(input.value);
		}
		return deviceArray;
	}

	bindToInput(input) {
		this.boundInputs.push(input);
		input.onmidimessage = (e) => this.onMIDIMessage(e);
	}

	unbindInput(input) {
		var index = this.boundInputs.indexOf(input);
		this.boundInputs.slice(1, index);
		input.onmidimessage = null;
	}

	bindToAllInputs() {
		if (this.midiAccess != null) {
			let inputs = this.getMidiInputs();
			for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
				this.bindToInput(input.value);
			}
		}
	}

	unbindAllInputs() {
			this.boundInputs.forEach(this.unbindInput);
	}

	bindToOutput (output) {
		this.boundOutputs.push(output);
	}

	bindToAllOutputs() {
		if (this.midiAccess != null) {
			let inputs = this.getMidiOutputs();
			for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
				this.bindToOutput(input.value);
			}
		}
	}

	onMIDIFailure(error) {
		throw error
	}

	onMIDISuccess(midiAccessObj) {
		this.midiAccess = midiAccessObj;
	}

	sendMidiMessage(message) {

		if (this.loopback) {
			this.loopBackMidiMessage(message);
		}

		this.boundOutputs.forEach((output) => output.send(message.data, message.timeStamp))

	}

	loopBackMidiMessage(message) {
		this.onMIDIMessage(message, this.key);
	}
}