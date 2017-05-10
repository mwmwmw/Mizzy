class Events {
	constructor() {
		this.listeners = {};
	}

	// take this event name, and run this handler when it occurs
	on(event, handler) {
		if (this.listeners[event] === undefined) {
			this.listeners[event] = [handler];
		} else {
			this.listeners[event].push(handler);
		}
		return handler;
	};

	// unbind this event and handler
	off(event, handler = null) {
		if (this.listeners[event]) {
			if (handler == null) {
				for (let i = this.listeners[event].length - 1; i >= 0; i--) {
					if (this.listeners[event].length === 1) {
						delete this.listeners[event];
						return true;
					} else {
						this.listeners[event].splice(i, 1);
						return true;
					}
				}
			} else {
				for (let i = 0; i < this.listeners[event].length; i++) {
					if (this.listeners[event][i] == handler) {
						this.listeners[event].splice(i, 1);
						if(this.listeners[event].length === 0) {
							delete this.listeners[event];
						}
						return true;
					}
				}
			}
		}
		return false;
	}

	trigger(event, data) {
		if (this.listeners[event]) {
			for (let i = this.listeners[event].length - 1; i >= 0; i--) {
				if (this.listeners[event] !== undefined) {
					if (typeof this.listeners[event][i] === "function" && this.listeners[event][i]) {
						this.listeners[event][i](data);
					} else {
						throw "Event handler is not a function.";
					}
				}
			}
		}
	}
}

const GLOBAL_TUNE = 440;
const MIDI_14BIT_MAX_VALUE = 16384;
const MIDI_MAX_VALUE = 127;

class Convert {

	static MIDINoteToFrequency(midinote, tune = GLOBAL_TUNE) {
		return tune * Math.pow(2, (midinote - 69) / 12); //
	}

	static PitchWheelToPolar (raw) {
		return -((MIDI_14BIT_MAX_VALUE * 0.5) - raw);
	}

	static PitchWheelToPolarRatio (raw) {
		return Convert.PitchWheelToPolar(raw) / (MIDI_14BIT_MAX_VALUE * 0.5)
	}

	static MidiValueToRatio (value) {
		return value / MIDI_MAX_VALUE;
	}

	static MidiValueToPolarRatio (value) {
		let halfmax = (MIDI_MAX_VALUE * 0.5);
		return -(halfmax - value) / halfmax;
	}

}

const MIDI_NOTE_ON = 0x90;
const MIDI_NOTE_OFF = 0x80;
const MIDI_AFTERTOUCH = 0xA0;
const MIDI_CONTROL_CHANGE = 0xB0;
const MIDI_PROGRAM_CHANGE = 0xC0;
const MIDI_CHANNEL_PRESSURE = 0xD0;
const MIDI_PITCHBEND = 0xE0;

const MIDI_MESSAGE_EVENT = "midimessage";

const NOTE_ON_EVENT = "NoteOn";
const NOTE_OFF_EVENT = "NoteOff";
const PITCHWHEEL_EVENT = "PitchWheel";
const CONTROLLER_EVENT = "Controller";
const PROGRAM_CHANGE_EVENT$1 = "ProgramChange";
const AFTERTOUCH_EVENT$1 = "Aftertouch";

const KEYBOARD_EVENT_KEY_DOWN = "keydown";
const KEYBOARD_EVENT_KEY_UP = "keyup";

const ENHARMONIC_KEYS = ["C", "G", "D", "A", "E", "B", "Cb", "F#", "Gb", "C#", "Db", "Ab", "Eb", "Bb", "F"];

const MIDI_NOTE_MAP = {
	"C": [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
	"D": [2, 14, 26, 38, 50, 62, 74, 86, 98, 110, 122],
	"E": [4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124],
	"F": [5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125],
	"G": [7, 19, 31, 43, 55, 67, 79, 91, 103, 115, 127],
	"A": [9, 21, 33, 45, 57, 69, 81, 93, 105, 117],
	"B": [11, 23, 35, 47, 59, 71, 83, 95, 107, 119],
	"C#": [1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121],
	"D#": [3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123],
	"E#": [5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125],
	"F#": [6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126],
	"G#": [8, 20, 32, 44, 56, 68, 80, 92, 104, 116],
	"A#": [10, 22, 34, 46, 58, 70, 82, 94, 106, 118],
	"B#": [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
	"Db": [1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121],
	"Eb": [3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123],
	"Fb": [4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124],
	"Gb": [6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126],
	"Ab": [8, 20, 32, 44, 56, 68, 80, 92, 104, 116],
	"Bb": [10, 22, 34, 46, 58, 70, 82, 94, 106, 118],
	"Cb": [11, 23, 35, 47, 59, 71, 83, 95, 107, 119]
};



const KEY_NOTE_ARRAYS = {
	"C": ["C", "D", "E", "F", "G", "A", "B"],
	"G": ["G", "A", "B", "C", "D", "E", "F#"],
	"D": ["D", "E", "F#", "G", "A", "B", "C#"],
	"A": ["A", "B", "C#", "D", "E", "F#", "G#"],
	"E": ["E", "F#", "G#", "A", "B", "C#", "D#"],
	"B": ["B", "C#", "D#", "E", "F#", "G#", "A#"],
	"F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
	"C#": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
	"Cb": ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
	"Gb": ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
	"Db": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
	"Ab": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
	"Eb": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
	"Bb": ["Bb", "C", "D", "Eb", "F", "G", "A"],
	"F": ["F", "G", "A", "Bb", "C", "D", "E"]
};

class DataProcess {
	// add all of our extra data to the MIDI message event.
	static NoteEvent(message, key = ENHARMONIC_KEYS[0], transpose = 0) {
		const value = message.data[1] + transpose;
		const notes = this.getNoteNames(value);
		const data = {
			"enharmonics": notes,
			"note": DataProcess.findNoteInKey(notes, key),
			"inKey": DataProcess.isNoteInKey(notes, key),
			"value": value,
			"velocity": message.data[2],
			"frequency": Convert.MIDINoteToFrequency(value)
		};
		return Object.assign(message, data);
	};

	// add all of our extra data to the MIDI message event.
	static CCEvent(message, ccNameOverride) {
		return Object.assign(message, {
			"cc": ccNameOverride || message.data[1],
			"value": message.data[2],
			"ratio": Convert.MidiValueToRatio(message.data[2]),
			"polarRatio":Convert.MidiValueToPolarRatio(message.data[2]),
		});
	}

	// add all of our extra data to the MIDI message event.
	static MidiControlEvent(message, controlName) {
		return Object.assign(message, {
			"cc": controlName,
			"value": message.data[1],
			"ratio": Convert.MidiValueToRatio(message.data[2]),
		});
	}

	// add all of our extra data to the MIDI message event.
	static PitchWheelEvent(message) {
		const raw = message.data[1] | (message.data[2] << 7);
		return Object.assign(message, {
			"cc": "pitchwheel",
			"value": raw,
			"polar": Convert.PitchWheelToPolar(raw),
			"polarRatio": Convert.PitchWheelToPolarRatio(raw),
		});
	}

	// process the midi message. Go through each type and add processed data
	// when done, check for any bound events and run them.

	// get a list of notes that match this noteNumber
	static getNoteNames(noteNumber) {
		let noteNames = []; // create a list for the notes
		for (var note in MIDI_NOTE_MAP) {
			// loop through the note table and push notes that match.
			MIDI_NOTE_MAP[note].forEach(keynumber => {
					if (noteNumber === keynumber) {
						noteNames.push(note);
					}
				}
			);
		}
		return noteNames;
	};

	// find the first note that is in the current key
	static findNoteInKey(notes, key) {
		// loop through the note list
		for (let i = 0; i < notes.length; i++) {
			var note = notes[i];
			if (DataProcess.matchNoteInKey(note, key)) {
				return note;
			}
		}
		return notes[0];
	};

	// is this note in key
	static isNoteInKey(notes, key) {
		for (let n = 0; n < notes.length; n++) {
			const note = notes[n];
			if (this.matchNoteInKey(note, key)) {
				return true;
			}
		}
		return false;
	}

	static matchNoteInKey(note, key) {
		for (let i = 0; i < KEY_NOTE_ARRAYS[key].length; i++) {
			const keynote = KEY_NOTE_ARRAYS[key][i];
			if (note === keynote) {
				return true;
			}
		}
		return false;
	}
}

class Generate {

	static NoteOn(noteNumber, velocity) {
		return new Uint8Array([MIDI_NOTE_ON, noteNumber, velocity]);
	}

	static NoteOff(noteNumber, velocity) {
		return new Uint8Array([MIDI_NOTE_OFF, noteNumber, velocity]);
	}

	static AfterTouch(noteNumber, value) {
		return new Uint8Array([MIDI_AFTERTOUCH, noteNumber, value]);
	}

	static CC(controller, value) {
		return new Uint8Array([MIDI_CONTROL_CHANGE, controller, value]);
	}

	static ProgramChange(instrument) {
		return new Uint8Array([MIDI_PROGRAM_CHANGE, instrument]);
	}

	static ChannelPressure(pressure) {
		return new Uint8Array([MIDI_CHANNEL_PRESSURE, pressure]);
	}

	static PitchBend(value) {
		var msb = 0,
			lsb = 0;
		return new Uint8Array([MIDI_PITCHBEND, msb, lsb]);
	}

	static MidiEvent (data, key) {

		const message = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, {"data": data}) || {"data": data};

		switch (data[0]) {
			case MIDI_NOTE_ON:
				return DataProcess.NoteEvent(message, key);
				break;
			case MIDI_NOTE_OFF:
				return DataProcess.NoteEvent(message, key);
				break;
			case MIDI_CONTROL_CHANGE:
				return DataProcess.CCEvent(message);
				break;
			case MIDI_PITCHBEND:
				return DataProcess.PitchWheelEvent(message);
				break;
			case MIDI_AFTERTOUCH:
				return DataProcess.MidiControlEvent(message, AFTERTOUCH_EVENT);
				break;
			case MIDI_PROGRAM_CHANGE:
				return DataProcess.MidiControlEvent(message, PROGRAM_CHANGE_EVENT);
				break;
		}

	}

	static NoteEvent(messageType, value, velocity = 127) {
		let data = null;
		switch (messageType) {
			case NOTE_ON_EVENT:
				data = Generate.NoteOn(value, velocity);
				break;
			case NOTE_OFF_EVENT:
				data = Generate.NoteOff(value, velocity);
				break;
		}
		const newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, {"data": data}) || {"data": data};
		return DataProcess.NoteEvent(newMessage, this.key);
	}

	static CCEvent(cc, value) {
		let data = Generate.CC(cc, value);
		const newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, {"data": data});
		return DataProcess.CCEvent(newMessage);
	}

	static PitchBendEvent(value) {
		let data = Generate.PitchBend(value);
		const newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, {"data": data});
		return DataProcess.CCEvent(newMessage);
	}
}

/**
 * MIDIEvents - contains all the functionality for binding and removing MIDI events
 */
const KEY_CODE_MAP = {
	"90": 60,
	"83": 61,
	"88": 62,
	"68": 63,
	"67": 64,
	"86": 65,
	"71": 66,
	"66": 67,
	"72": 68,
	"78": 69,
	"74": 70,
	"77": 71,
	"188": 72
};

class MIDIEvents extends Events {
	constructor() {
		super();
		this.keysPressed = [];
		this.keyboadKeyPressed = [];
	}

	/**
	 * onMIDIMessage handles all incoming midi messages, processes them and then routes them to the correct event handler.
	 * @param message
	 * @param key
	 */
	onMIDIMessage(message, key = ENHARMONIC_KEYS[0]) {
		let eventName = null, data = null;
		switch (message.data[0]) {
			case MIDI_NOTE_OFF:
				eventName = NOTE_OFF_EVENT;
				delete this.keysPressed[message.data[1]];
				data = DataProcess.NoteEvent(message, key);
				break;
			case MIDI_NOTE_ON:
				// handle 0 velocity as a note off event
				if (message.data[2] > 0) {
					eventName = NOTE_ON_EVENT;
				} else {
					eventName = NOTE_OFF_EVENT;
				}
				data = DataProcess.NoteEvent(message, key);
				if (eventName == NOTE_ON_EVENT) {
					this.keysPressed[message.data[1]] = data;
				} else {
					delete this.keysPressed[message.data[1]];
				}
				break;
			case MIDI_CONTROL_CHANGE:
				eventName = CONTROLLER_EVENT;
				data = DataProcess.CCEvent(message);
				break;
			case MIDI_PITCHBEND:
				eventName = PITCHWHEEL_EVENT;
				data = DataProcess.PitchWheelEvent(message);
				break;
			case MIDI_AFTERTOUCH:
				eventName = AFTERTOUCH_EVENT$1;
				data = DataProcess.MidiControlEvent(message, eventName);
				break;
			case MIDI_PROGRAM_CHANGE:
				eventName = PROGRAM_CHANGE_EVENT$1;
				data = DataProcess.MidiControlEvent(message, eventName);
				break;
		}
		// if there is no event name, then we don't support that event yet so do nothing.
		if (eventName !== null) {
			this.trigger(eventName, data);
		}
	};


	/**
	 * EZ binding for a single Control Change data, just pass in the CC number and handler. This returns an anonymous function which you should store a reference to if you want to unbind this CC later.
	 * @param cc
	 * @param handler
	 * @returns {Function}
	 */
	onCC(cc, handler) {
		return this.on(CONTROLLER_EVENT, data => {
			if (data.cc == cc) {
				handler(data);
			}
		});
	}

	/**
	 * Takes the CC# and Event handler and removes the event from the listeners.
	 * @param handler
	 * @returns {Boolean}
	 */
	removeCC(handler) {
		return this.off(CONTROLLER_EVENT, handler);
	}

	/**
	 * KeyToggle will bind to all MIDI note events and execute the `keyDown` handler when the key is pressed and `keyUp` handler when the key is released. This function returns the reference to the handlers created for these events. Pass this reference into removeKeyToggle to unbind these events.
	 *
	 * ### Usage
	 * ```
	 * var m = new Mizzy();
	 * var toggleKeys = m.keyToggle((e) => console.log(e),(e) => console.log(e));
	 * // when ready to unbind
	 * m.removeKeyToggle(toggleKeys);
	 * ```
	 *
	 * @param handlerOn
	 * @param handlerOff
	 * @returns {{on: Function, off: Function}}
	 */
	keyToggle(keyDown, keyUp) {
		return {
			keyDown: this.on(NOTE_ON_EVENT, keyDown),
			keyUp: this.on(NOTE_OFF_EVENT, keyUp)
		}
	};

	/**
	 * This will unbind the keyToggle. Pass in the reference created when you called `keyToggle()`
	 * @param toggles
	 */
	removeKeyToggle(toggles) {
		this.off(NOTE_ON_EVENT, toggles.keyDown);
		this.off(NOTE_OFF_EVENT, toggles.keyUp);
	}

	/**
	 * EZ binding for individual key values. Pass in the note number you want to wait for (ie 60 = middle c) and the handler for it. This function will return a reference to the handler created for this note.
	 * @param number
	 * @param handler
	 * @returns {Function}
	 */
	pressNoteNumber(number, handler) {
		return this.on(NOTE_ON_EVENT, data => {
			if (data.value == number) {
				handler(data);
			}
		});
	};
	removePressNoteNumber(handler) {
		return this.off(NOTE_ON_EVENT, handler);
	}
	// EZ binding for key values. Can only be unbound with unbindALL()
	releaseNoteNumber(number, handler) {
		return this.on(NOTE_OFF_EVENT, data => {
			if (data.value == number) {
				handler(data);
			}
		});
	};
	removeReleaseNoteNumber(handler) {
		return this.off(NOTE_OFF_EVENT, handler);
	}

	/**
	 * Bind keyboard splits. 
	 * @param min
	 * @param max
	 * @param onHandler
	 * @param offHandler
	 * @returns {{onRange: Array, offRange: Array}}
	 */
	keyToggleRange(min, max, onHandler, offHandler) {
		return {
			press: this.onSplit(min, max, onHandler),
			release: this.offSplit(min, max, offHandler)
		}
	};

	onSplit(min, max, onHandler) {
		let on = [];
		if (max > min) {
			for (let i = min; i <= max; i++) {
				on.push(this.pressNoteNumber(i, onHandler));
			}
		} else {
			for (let i = max; i >= min; i--) {
				on.push(this.pressNoteNumber(i, onHandler));
			}
		}
		return on;
	};

	offSplit(min, max, offHandler) {
		let off = [];
		if (max > min) {
			for (let i = min; i <= max; i++) {
				off.push(this.releaseNoteNumber(i, offHandler));
			}
		} else {
			for (let i = max; i >= min; i--) {
				off.push(this.releaseNoteNumber(i, offHandler));
			}
		}
		return off;
	};

	removeKeyToggleRange (ranges) {
		var removeOnRanges = ranges.press.forEach((noteHandler) => this.removePressNoteNumber(noteHandler) );
		var removeOffRanges = ranges.release.forEach((noteHandler) => this.removeReleaseNoteNumber(noteHandler) );
		return removeOffRanges == true && removeOnRanges == true;
	}

	/**
	 * Removes all bound handlers for all events. Great for when you know you need to lose all the events.
	 * @returns {boolean}
	 */
	unbindAll() {
		this.unBindKeyboard();
		for (let event in this.listeners) {
			delete this.listeners[event];
		}
		return true;
	};

	/**
	 * Bind the computer (qwerty) keyboard to allow it to generate MIDI note on and note off messages.
	 */
	bindKeyboard() {
		window.addEventListener(KEYBOARD_EVENT_KEY_DOWN, (e) => this.keyboardKeyDown(e));
		window.addEventListener(KEYBOARD_EVENT_KEY_UP, (e) => this.keyboardKeyUp(e));
	};

	unBindKeyboard() {
		window.removeEventListener(KEYBOARD_EVENT_KEY_DOWN, (e) => this.keyboardKeyDown(e));
		window.removeEventListener(KEYBOARD_EVENT_KEY_UP, (e) => this.keyboardKeyUp(e));
	};

	keyboardKeyDown(message) {
		if (KEY_CODE_MAP[message.keyCode] != undefined) {
			if (this.keyboadKeyPressed[message.keyCode] != true) {
				this.keyboadKeyPressed[message.keyCode] = true;
				let newMessage = Generate.NoteEvent(NOTE_ON_EVENT, KEY_CODE_MAP[message.keyCode]);
				if (newMessage !== null) {
					this.sendMidiMessage(newMessage);
				}
			}
		}
	};

	keyboardKeyUp(message) {
		if (KEY_CODE_MAP[message.keyCode] != undefined) {
			if (this.keyboadKeyPressed[message.keyCode] == true) {
				delete this.keyboadKeyPressed[message.keyCode];
				let newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, KEY_CODE_MAP[message.keyCode]);
				if (newMessage !== null) {
					this.sendMidiMessage(newMessage);
				}
			}
		}
	}

	sendMidiMessage(message) {}

}

const TICK_INCREMENT = 0.25;
const DEFAULT_LOOP_LENGTH = 16;
const DEFAULT_TEMPO = 120;
const TICK_LENGTH = 0.2;

class Clock extends Events{

	constructor (context) {
		super();
		this.context = context || new AudioContext();

		this.BPM = DEFAULT_TEMPO;
		this.tickSchedule;
		this.tick = 0;
		this.playing = false;
		this.loopIndex = 0;
		this.startClock = 0;
		this.index = 0;
		this.looplength = DEFAULT_LOOP_LENGTH;
		this.direction = 1;
		this.lastTick = 0;
	}

	reset () {
		this.index = 0;
		this.loopIndex = 0;
	}

	play (sync = this.context.currentTime + 0.005, index = 0, loopIndex = 0) {
		this.startClock = sync;
		this.index = index;
		this.loopIndex = loopIndex;
		this.playing = true;
		this.trigger("play", sync);
		this.schedule();
	}

	stop() {
		this.trigger("stop");
		this.playing = false;
	}

	schedule () {
		if(this.playing) {
			var playHead = this.context.currentTime - this.startClock;
			while (this.tick < playHead + TICK_LENGTH) {
				var localPlayHead = this.tick + this.startClock;
				this.process(this.index, this.loopIndex, this.tick, playHead);
				this.next();
			}
			this.tickSchedule = setTimeout(() => this.schedule(), 0);
		}
	}

	process (index, loopIndex, localTime, globalTime) {
		let tick = {
			index, loopIndex, globalTime
		};
		this.trigger("tick", tick);
	}

	next () {
		var beat = 60 / this.BPM;
		this.index++;
		this.loopIndex += this.direction;

		if(this.loopIndex > this.looplength-1) {
			this.loopIndex = 0;
		} else if(this.loopIndex < 0) {
			this.loopIndex = this.looplength-1;
		}

		this.tick += TICK_INCREMENT * beat;
	}

}

class Mizzy extends MIDIEvents {

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

		if (!window.MIDIMessageEvent) {
			window.MIDIMessageEvent = (name, params) => {
				this.name = name;
				return Object.assign(this, params);
			};
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

	panic () {
		for(let i = 0; i < 127; i++) {
			this.sendMidiMessage(Generate.MidiEvent(Mizzy.Generate.NoteOff(i, 127), this.key));
		}
	}
}

export default Mizzy;

//# sourceMappingURL=mizzy.es6.map
