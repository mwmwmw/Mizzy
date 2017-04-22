import MIDIEvents from "./MIDIEvents";
import {ENHARMONIC_KEYS, NOTE_ON_EVENT, NOTE_OFF_EVENT, CONTROLLER_EVENT, PITCHWHEEL_EVENT} from "./Constants";
import Generate from "./Generate";


export default class Mizzy extends MIDIEvents {

	static get Generate () {
		return Generate;
	}

	static get NOTE_ON () {
		return NOTE_ON_EVENT;
	}
	static get NOTE_OFF () {
		return NOTE_OFF_EVENT;
	}
	static get CONTROLCHANGE() {
		return CONTROLLER_EVENT;
	}
	static get PITCHWHEEL () {
		return PITCHWHEEL_EVENT;
	}

	constructor() {
		super();
		this.keysPressed = [];
		this.midiAccess = null;
		this.loopback = true;

		this.boundInputs = [];
		this.boundOutputs = [];

		this.key = ENHARMONIC_KEYS[0]; // C-Major

		if (!window.MIDIMessageEvent) {
			window.MIDIMessageEvent = (name, params) => {
				this.name = name;
				return Object.assign(this, params);
			}
		}

	}

	initialize() {
		if (this.midiAccess === null) {
			if (navigator.requestMIDIAccess) {
				return navigator.requestMIDIAccess({
					sysex: false
				}).then((e) => this.onMIDISuccess(e), (e) => this.onMIDIFailure(e));
			} else {
				console.warn("[Mizzy] Your browser does not support Web MIDI API. You can still use the local loopback however.");
				return new Promise((resolve, reject) => {
					setTimeout(function(){
						resolve();
					}, 50);
				});
			}
		}
	}

	get keys() {
		return ENHARMONIC_KEYS;
	}

	setKey(keyletter = "C") {
		this.key = ENHARMONIC_KEYS[ENHARMONIC_KEYS.indexOf(keyletter.toUpperCase())] || "C";
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
		input.onmidimessage = (e) => this.onMIDIMessage(e, this.key);
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

	bindToOutput(output) {
		this.boundOutputs.push(output);
	}

	bindToAllOutputs() {
		if (this.midiAccess != null) {
			let outputs = this.getMidiOutputs();
			for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
				this.bindToOutput(output.value);
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
		this.boundOutputs.forEach((output) => {
			output.send(message.data, message.timeStamp);
		});
		if (this.loopback) {
			this.onMIDIMessage(message, this.key);
		}
	}
}