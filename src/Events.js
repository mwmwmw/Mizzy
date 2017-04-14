import NoteProcessor from "./NoteProcessor";
import Generate from "./Generate";

export default class Events {
	constructor() {
		this.keysPressed = [];
		this.listeners = {};
		this.keyboadKeyPressed = [];
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
	off(event, handler) {
		if (this.listeners[event]) {
			for (let i = this.listeners[event].length - 1; i >= 0; i--) {
				if (this.listeners[event].length === 1) {
					delete this.listeners[event];
				} else {
					this.listeners[event].splice(i, 1);
					break;
				}
			}
		}
	};

	onMIDIMessage(message, key = "C") {
		let eventName = null, data = null;
		switch (message.data[0]) {
			case 128:
				eventName = "NoteOff";
				delete this.keysPressed[message.data[1]];
				data = NoteProcessor.processNoteEvent(message, eventName, key);
				break;
			case 144:
				// handle 0 velocity as a note off event
				if (message.data[2] > 0) {
					eventName = "NoteOn";
				} else {
					eventName = "NoteOff";
				}
				data = NoteProcessor.processNoteEvent(message, eventName, key);
				if (eventName == "NoteOn") {
					this.keysPressed[message.data[1]] = data;
				} else {
					delete this.keysPressed[message.data[1]];
				}
				break;
			case 176:
				eventName = "Controller";
				data = NoteProcessor.processCCEvent(message);
				break;
			case 224:
				eventName = "PitchWheel";
				data = NoteProcessor.processPitchWheel(message);
				break;
			case 208:
				eventName = "Aftertouch";
				data = NoteProcessor.processMidiControlEvent(message, eventName);
				break;
			case 192:
				eventName = "ProgramChange";
				data = NoteProcessor.processMidiControlEvent(message, eventName);
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
		this.on("Controller", wrapper);
	};

	// EZ binding for key presses, bind these two handlers to key on/off. Can only be unbound with unbindALL()
	keyToggle(handlerOn, handlerOff) {
		this.on("NoteOn", handlerOn);
		this.on("NoteOff", handlerOff);
	};

	// currently broken. will bind an event to particular keypress.
	// this.onNoteName (name, handler) {
	//     let wrapper (data) {
	//         if(typeof data.note_name === "string") {
	//             if (name.length > 1) {
	//                 let dataname = new RegExp(name);
	//                 if (data.note_name.match(dataname)) {
	//                     handler(data);
	//                 }
	//             } else {
	//                 if (data.note_name === name) {
	//                     handler(data);
	//                 }
	//             }
	//         } else {
	//             data.note_name.forEach(function(notename){
	//                 if(notename === name) {
	//                     handler(data);
	//                 }
	//             })
	//         }
	//     };
	//     this.on("NoteOn", wrapper);
	// };
	// EZ binding for key values. Can only be unbound with unbindALL()
	onNoteNumber(number, handler) {
		const wrapper = data => {
			if (data.value == number) {
				handler(data);
			}
		};
		this.on("NoteOn", wrapper);
	};

	// EZ binding for key values. Can only be unbound with unbindALL()
	offNoteNumber(number, handler) {
		const wrapper = data => {
			if (data.value == number) {
				handler(data);
			}
		};
		this.on("NoteOff", wrapper);
	};

	// EZ binding for a range of key values, bind these two handlers to key value. Can only be unbound with unbindALL()
	keyToggleRange(min, max, onHandler, offHandler) {
		this.onRange(min, max, onHandler);
		this.offRange(min, max, offHandler);
	};

	onSplit(min, max, onHandler, offHandler) {
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

	offSplit(min, max, onHandler, offHandler) {
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
		window.addEventListener("keydown", (e) => this.keyboardKeyDown(e));
		window.addEventListener("keyup", (e) => this.keyboardKeyUp(e));
	};

	unBindKeyboard() {
		window.removeEventListener("keydown", (e) => this.keyboardKeyDown(e));
		window.removeEventListener("keyup", (e) => this.keyboardKeyUp(e));
	};

	keyboardKeyDown(message) {
		if (this.keyboadKeyPressed[message.keyCode] != true) {
			this.keyboadKeyPressed[message.keyCode] = true;
			let newMessage = null;
			switch (message.keyCode) {
				case 90:
					newMessage = Generate.FakeMessage("NoteOn", 60);
					break;
				case 83:
					newMessage = Generate.FakeMessage("NoteOn", 61);
					break;
				case 88:
					newMessage = Generate.FakeMessage("NoteOn", 62);
					break;
				case 68:
					newMessage = Generate.FakeMessage("NoteOn", 63);
					break;
				case 67:
					newMessage = Generate.FakeMessage("NoteOn", 64);
					break;
				case 86:
					newMessage = Generate.FakeMessage("NoteOn", 65);
					break;
				case 71:
					newMessage = Generate.FakeMessage("NoteOn", 66);
					break;
				case 66:
					newMessage = Generate.FakeMessage("NoteOn", 67);
					break;
				case 72:
					newMessage = Generate.FakeMessage("NoteOn", 68);
					break;
				case 78:
					newMessage = Generate.FakeMessage("NoteOn", 69);
					break;
				case 74:
					newMessage = Generate.FakeMessage("NoteOn", 70);
					break;
				case 77:
					newMessage = Generate.FakeMessage("NoteOn", 71);
					break;
				case 188:
					newMessage = Generate.FakeMessage("NoteOn", 72);
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
					newMessage = Generate.FakeMessage("NoteOff", 60);
					break;
				case 83:
					newMessage = Generate.FakeMessage("NoteOff", 61);
					break;
				case 88:
					newMessage = Generate.FakeMessage("NoteOff", 62);
					break;
				case 68:
					newMessage = Generate.FakeMessage("NoteOff", 63);
					break;
				case 67:
					newMessage = Generate.FakeMessage("NoteOff", 64);
					break;
				case 86:
					newMessage = Generate.FakeMessage("NoteOff", 65);
					break;
				case 71:
					newMessage = Generate.FakeMessage("NoteOff", 66);
					break;
				case 66:
					newMessage = Generate.FakeMessage("NoteOff", 67);
					break;
				case 72:
					newMessage = Generate.FakeMessage("NoteOff", 68);
					break;
				case 78:
					newMessage = Generate.FakeMessage("NoteOff", 69);
					break;
				case 74:
					newMessage = Generate.FakeMessage("NoteOff", 70);
					break;
				case 77:
					newMessage = Generate.FakeMessage("NoteOff", 71);
					break;
				case 188:
					newMessage = Generate.FakeMessage("NoteOff", 72);
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
