/**
 * MIDIEvents - contains all the functionality for binding and removing MIDI events
 */
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

	/**
	 * onMIDIMessage handles all incoming midi messages, processes them and then routes them to the correct event handler.
	 * @param message
	 * @param key
	 */
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
			this.trigger(eventName, data)
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
