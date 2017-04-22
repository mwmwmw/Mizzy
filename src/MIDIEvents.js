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
		return this.on(CONTROLLER_EVENT, data => {
			if (data.cc == cc) {
				handler(data);
			}
		});
	}

	removeCC(cc, handler) {
		return this.off(CONTROLLER_EVENT, handler);
	}

	// EZ binding for key presses, bind these two handlers to key on/off. Can only be unbound with unbindALL()
	keyToggle(handlerOn, handlerOff) {
		return {
			on: this.on(NOTE_ON_EVENT, handlerOn),
			off: this.on(NOTE_OFF_EVENT, handlerOff)
		}
	};

	removeKeyToggle(toggles) {
		this.off(NOTE_ON_EVENT, toggles.on);
		this.off(NOTE_OFF_EVENT, toggles.off);
	}

	// EZ binding for key values. Can only be unbound with unbindALL()
	onNoteNumber(number, handler) {
		return this.on(NOTE_ON_EVENT, data => {
			if (data.value == number) {
				handler(data);
			}
		});
	};

	// EZ binding for key values. Can only be unbound with unbindALL()
	offNoteNumber(number, handler) {
		return this.on(NOTE_OFF_EVENT, data => {
			if (data.value == number) {
				handler(data);
			}
		});
	};

	// EZ binding for a range of key values, bind these two handlers to key value. Can only be unbound with unbindALL()
	keyToggleRange(min, max, onHandler, offHandler) {
		return {
			onRange: this.onSplit(min, max, onHandler),
			offRange: this.offSplit(min, max, offHandler)
		}
	};

	onSplit(min, max, onHandler) {
		let on = [];
		if (max > min) {
			for (let i = min; i <= max; i++) {
				on.push(this.onNoteNumber(i, onHandler));
			}
		} else {
			for (let i = max; i >= min; i--) {
				on.push(this.onNoteNumber(i, onHandler));
			}
		}
		return on;
	};

	offSplit(min, max, offHandler) {
		let off = [];
		if (max > min) {
			for (let i = min; i <= max; i++) {
				off.push(this.onNoteNumber(i, offHandler));
			}
		} else {
			for (let i = max; i >= min; i--) {
				off.push(this.onNoteNumber(i, offHandler));
			}
		}
		return off;
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
