import NoteProcessor from "./NoteProcessor";
const listeners = {};

export default class Events {
	// take this event name, and run this handler when it occurs
	static on(event, handler) {
		if (listeners[event] === undefined) {
			listeners[event] = [handler];
		} else {
			listeners[event].push(handler);
		}
		return handler;
	};

	// unbind this event and handler
	static off(event, handler) {
		if (listeners[event]) {
			for (let i = listeners[event].length - 1; i >= 0; i--) {
				if (listeners[event].length === 1) {
					delete listeners[event];
				} else {
					listeners[event].splice(i, 1);
					break;
				}
			}
		}
	};

	static onMIDIMessage = function (message) {
		let eventName = null, data = null;
		switch (message.data[0]) {
			case 128:
				eventName = "NoteOff";
				delete this.keysPressed[message.data[1]];
				data = NoteProcessor.processNoteEvent(message, eventName);
				break;
			case 144:
				if (message.data[2] > 0) {
					eventName = "NoteOn";
				} else {
					eventName = "NoteOff";
				}
				data = NoteProcessor.processNoteEvent(message, eventName);
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
			Events.executeEventHandlers(eventName, data)
		}
	};

	// loop through all the bound events and execute with the newly processed data.
	static executeEventHandlers = function (event, data) {
		if (listeners[event]) {
			for (let i = listeners[event].length - 1; i >= 0; i--) {
				if (listeners[event] !== undefined) {
					if (typeof listeners[event][i] === "function" && listeners[event][i]) {
						listeners[event][i](data);
					} else {
						throw "Event handler is not a function.";
					}
				}
			}
		}
	};

	// EZ binding for Control Change data, just pass in the CC number and handler. Can only be unbound with unbindALL()
	static onCC = function (cc, handler) {
		const wrapper = data => {
			if (data.cc == cc) {
				handler(data);
			}
		};
		this.on("Controller", wrapper);
	};
	// EZ binding for key presses, bind these two handlers to key on/off. Can only be unbound with unbindALL()
	static keyToggle = function (handlerOn, handlerOff) {
		this.on("NoteOn", handlerOn);
		this.on("NoteOff", handlerOff);
	};
	// currently broken. will bind an event to particular keypress.
	// this.onNoteName = function (name, handler) {
	//     let wrapper = function (data) {
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
	static onNoteNumber = function (number, handler) {
		const wrapper = data => {
			if (data.value == number) {
				handler(data);
			}
		};
		this.on("NoteOn", wrapper);
	};
	// EZ binding for key values. Can only be unbound with unbindALL()
	static offNoteNumber = function (number, handler) {
		const wrapper = data => {
			if (data.value == number) {
				handler(data);
			}
		};
		this.on("NoteOff", wrapper);
	};
	// EZ binding for a range of key values, bind these two handlers to key value. Can only be unbound with unbindALL()
	static keyToggleRange = function (min, max, onHandler, offHandler) {
		this.onRange(min, max, onHandler);
		this.offRange(min, max, offHandler);
	};
	static onRange = function (min, max, onHandler, offHandler) {
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
	static offRange = function (min, max, onHandler, offHandler) {
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
	static unbindAll = function () {
		this.unBindKeyboard();
		for (const event in listeners) {
			delete listeners[event];
		}
		return true;
	};
	static bindKeyboard = function () {
		window.addEventListener("keydown", this.keyboardKeyDown);
		window.addEventListener("keyup", this.keyboardKeyUp);
	};
	static unBindKeyboard = function () {
		window.removeEventListener("keydown", this.keyboardKeyDown);
		window.removeEventListener("keyup", this.keyboardKeyUp);
	};
	static keyboardKeyDown = message => {
		let newMessage = null;
		switch (message.keyCode) {
			case 90:
				newMessage = this.createMessage("NoteOn", 60);
				break;
			case 83:
				newMessage = this.createMessage("NoteOn", 61);
				break;
			case 88:
				newMessage = this.createMessage("NoteOn", 62);
				break;
			case 68:
				newMessage = this.createMessage("NoteOn", 63);
				break;
			case 67:
				newMessage = this.createMessage("NoteOn", 64);
				break;
			case 86:
				newMessage = this.createMessage("NoteOn", 65);
				break;
			case 71:
				newMessage = this.createMessage("NoteOn", 66);
				break;
			case 66:
				newMessage = this.createMessage("NoteOn", 67);
				break;
			case 72:
				newMessage = this.createMessage("NoteOn", 68);
				break;
			case 78:
				newMessage = this.createMessage("NoteOn", 69);
				break;
			case 74:
				newMessage = this.createMessage("NoteOn", 70);
				break;
			case 77:
				newMessage = this.createMessage("NoteOn", 71);
				break;
			case 188:
				newMessage = this.createMessage("NoteOn", 72);
				break;
		}
		if (newMessage !== null) {
			Events.sendMidiMessage(newMessage);
		}

	};
	static keyboardKeyUp = message => {
		let newMessage = null;
		switch (message.keyCode) {
			case 90:
				newMessage = this.createMessage("NoteOff", 60);
				break;
			case 83:
				newMessage = this.createMessage("NoteOff", 61);
				break;
			case 88:
				newMessage = this.createMessage("NoteOff", 62);
				break;
			case 68:
				newMessage = this.createMessage("NoteOff", 63);
				break;
			case 67:
				newMessage = this.createMessage("NoteOff", 64);
				break;
			case 86:
				newMessage = this.createMessage("NoteOff", 65);
				break;
			case 71:
				newMessage = this.createMessage("NoteOff", 66);
				break;
			case 66:
				newMessage = this.createMessage("NoteOff", 67);
				break;
			case 72:
				newMessage = this.createMessage("NoteOff", 68);
				break;
			case 78:
				newMessage = this.createMessage("NoteOff", 69);
				break;
			case 74:
				newMessage = this.createMessage("NoteOff", 70);
				break;
			case 77:
				newMessage = this.createMessage("NoteOff", 71);
				break;
			case 188:
				newMessage = this.createMessage("NoteOff", 72);
				break;
		}
		if (newMessage !== null) {
			this.sendMidiMessage(newMessage);
		}
	}

}
