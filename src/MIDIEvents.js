import Events from "./Events";
import DataProcess from "./DataProcess";
import Generate from "./Generate";
import {
	AFTERTOUCH_EVENT,
	CONTROLLER_EVENT,
	ENHARMONIC_KEYS,
	KEYBOARD_EVENT_KEY_DOWN,
	KEYBOARD_EVENT_KEY_UP,
	NOTE_OFF_EVENT,
	NOTE_ON_EVENT,
	PITCHWHEEL_EVENT,
	PROGRAM_CHANGE_EVENT
} from "./Constants";

export default class MIDIEvents extends Events {
	constructor() {
		super();
		this.keysPressed = [];
		this.keyboadKeyPressed = [];
	}

	onMIDIMessage(message, key = ENHARMONIC_KEYS[0]) {
		let eventName = null, data = null;
		switch (message.data[0]) {
			case 128:
				eventName = NOTE_OFF_EVENT;
				delete this.keysPressed[message.data[1]];
				data = DataProcess.NoteEvent(message, key);
				break;
			case 144:
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
			case 176:
				eventName = CONTROLLER_EVENT;
				data = DataProcess.CCEvent(message);
				break;
			case 224:
				eventName = PITCHWHEEL_EVENT;
				data = DataProcess.PitchWheelEvent(message);
				break;
			case 208:
				eventName = AFTERTOUCH_EVENT;
				data = DataProcess.MidiControlEvent(message, eventName);
				break;
			case 192:
				eventName = PROGRAM_CHANGE_EVENT;
				data = DataProcess.MidiControlEvent(message, eventName);
				break;
		}
		// if there is no event name, then we don't support that event yet so do nothing.
		if (eventName !== null) {
			this.executeEventHandlers(eventName, data)
		}
	};

	// loop through all the bound events and execute with the newly processed data.
	executeEventHandlers(event, data) {
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
	};

	// EZ binding for Control Change data, just pass in the CC number and handler. Can only be unbound with unbindALL()
	onCC(cc, handler) {
		const wrapper = data => {
			if (data.cc == cc) {
				handler(data);
			}
		};
		this.on(CONTROLLER_EVENT, wrapper);
	};

	// EZ binding for key presses, bind these two handlers to key on/off. Can only be unbound with unbindALL()
	keyToggle(handlerOn, handlerOff) {
		this.on(NOTE_ON_EVENT, handlerOn);
		this.on(NOTE_OFF_EVENT, handlerOff);
	};

	// EZ binding for key values. Can only be unbound with unbindALL()
	onNoteNumber(number, handler) {
		const wrapper = data => {
			if (data.value == number) {
				handler(data);
			}
		};
		this.on(NOTE_ON_EVENT, wrapper);
	};

	// EZ binding for key values. Can only be unbound with unbindALL()
	offNoteNumber(number, handler) {
		const wrapper = data => {
			if (data.value == number) {
				handler(data);
			}
		};
		this.on(NOTE_OFF_EVENT, wrapper);
	};

	// EZ binding for a range of key values, bind these two handlers to key value. Can only be unbound with unbindALL()
	keyToggleRange(min, max, onHandler, offHandler) {
		this.onSplit(min, max, onHandler);
		this.offSplit(min, max, offHandler);
	};

	onSplit(min, max, onHandler) {
		if (max > min) {
			for (let i = min; i <= max; i++) {
				this.onNoteNumber(i, onHandler);
			}
		} else {
			for (let i = max; i >= min; i--) {
				this.onNoteNumber(i, onHandler);
			}
		}
	};

	offSplit(min, max, offHandler) {
		if (max > min) {
			for (let i = min; i <= max; i++) {
				this.offNoteNumber(i, offHandler);
			}
		} else {
			for (let i = max; i >= min; i--) {
				this.offNoteNumber(i, offHandler);
			}
		}
	};

	// Removes all bound events.
	unbindAll() {
		this.unBindKeyboard();
		for (let event in this.listeners) {
			delete this.listeners[event];
		}
		return true;
	};

	bindKeyboard() {
		window.addEventListener(KEYBOARD_EVENT_KEY_DOWN, (e) => this.keyboardKeyDown(e));
		window.addEventListener(KEYBOARD_EVENT_KEY_UP, (e) => this.keyboardKeyUp(e));
	};

	unBindKeyboard() {
		window.removeEventListener(KEYBOARD_EVENT_KEY_DOWN, (e) => this.keyboardKeyDown(e));
		window.removeEventListener(KEYBOARD_EVENT_KEY_UP, (e) => this.keyboardKeyUp(e));
	};

	keyboardKeyDown(message) {
		if (this.keyboadKeyPressed[message.keyCode] != true) {
			this.keyboadKeyPressed[message.keyCode] = true;
			let newMessage = null;
			switch (message.keyCode) {
				case 90:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 60);
					break;
				case 83:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 61);
					break;
				case 88:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 62);
					break;
				case 68:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 63);
					break;
				case 67:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 64);
					break;
				case 86:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 65);
					break;
				case 71:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 66);
					break;
				case 66:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 67);
					break;
				case 72:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 68);
					break;
				case 78:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 69);
					break;
				case 74:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 70);
					break;
				case 77:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 71);
					break;
				case 188:
					newMessage = Generate.NoteEvent(NOTE_ON_EVENT, 72);
					break;
			}
			if (newMessage !== null) {
				this.sendMidiMessage(newMessage);
			}
		}
	};

	keyboardKeyUp(message) {
		if (this.keyboadKeyPressed[message.keyCode] == true) {
			delete this.keyboadKeyPressed[message.keyCode];
			let newMessage = null;
			switch (message.keyCode) {
				case 90:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 60);
					break;
				case 83:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 61);
					break;
				case 88:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 62);
					break;
				case 68:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 63);
					break;
				case 67:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 64);
					break;
				case 86:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 65);
					break;
				case 71:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 66);
					break;
				case 66:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 67);
					break;
				case 72:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 68);
					break;
				case 78:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 69);
					break;
				case 74:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 70);
					break;
				case 77:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 71);
					break;
				case 188:
					newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, 72);
					break;
			}
			if (newMessage !== null) {
				this.sendMidiMessage(newMessage);
			}
		}
	}

	sendMidiMessage(message) {

	}

}
