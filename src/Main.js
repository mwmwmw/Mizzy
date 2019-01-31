import MIDIEvents from "./MIDIEvents";
import {ENHARMONIC_KEYS, NOTE_ON_EVENT, NOTE_OFF_EVENT, CONTROLLER_EVENT, PITCHWHEEL_EVENT} from "./Constants";
import Generate from "./Generate";
import Clock from "./Clock/Clock";

class MidiMessage extends MessageEvent {
	constructor(name, params) {
		super(params);
		this.name = name;
	} 
}

if (window.MIDIMessageEvent === undefined) {
	window.MIDIMessageEvent = MidiMessage;
}


export default class Mizzy extends MIDIEvents {

	static get Generate () {
		return Generate;
	}

	static get Clock () {
		return Clock;
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

		this.clock = new Clock();

		this.key = ENHARMONIC_KEYS[0]; // C-Major

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

	panic () {
		for (let i = 0; i < 127; i++) {
			this.sendMidiMessage(Generate.MidiEvent(Mizzy.Generate.NoteOff(i, 127), this.key));
		}
	}
}
