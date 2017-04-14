var Mizzy = (function () {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var midinotes = {
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

var noteon = 0x90;
var noteoff = 0x80;
var aftertouch = 0xA0;
var controlchange = 0xB0;
var programchange = 0xC0;
var channelpressure = 0xD0;
var pitchbend = 0xE0;

var MIDIData = function () {
    function MIDIData() {
        classCallCheck(this, MIDIData);
    }

    createClass(MIDIData, null, [{
        key: "MidiNotes",
        get: function get$$1() {
            return midinotes;
        }
    }, {
        key: "NoteOff",
        get: function get$$1() {
            return noteoff;
        }
    }, {
        key: "NoteOn",
        get: function get$$1() {
            return noteon;
        }
    }, {
        key: "AfterTouch",
        get: function get$$1() {
            return aftertouch;
        }
    }, {
        key: "ControlChange",
        get: function get$$1() {
            return controlchange;
        }
    }, {
        key: "ProgramChange",
        get: function get$$1() {
            return programchange;
        }
    }, {
        key: "ChannelPressure",
        get: function get$$1() {
            return channelpressure;
        }
    }, {
        key: "PitchBend",
        get: function get$$1() {
            return pitchbend;
        }
    }]);
    return MIDIData;
}();

var Convert = function () {
	function Convert() {
		classCallCheck(this, Convert);
	}

	createClass(Convert, null, [{
		key: "MIDINoteToFrequency",
		value: function MIDINoteToFrequency(midinote) {
			var tune = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 440;

			return tune * Math.pow(2, (midinote - 69) / 12);
		}
	}]);
	return Convert;
}();

var accidentals = {
    "C": "#",
    "G": "#",
    "D": "#",
    "A": "#",
    "E": "#",
    "B": "#",
    "Cb": "b",
    "F#": "#",
    "Gb": "b",
    "C#": "#",
    "Db": "b",
    "Ab": "b",
    "Eb": "b",
    "Bb": "b",
    "F": "b"
};

var keynotes$1 = {
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

var keys = ["C", "G", "D", "A", "E", "B", "Cb", "F#", "Gb", "C#", "Db", "Ab", "Eb", "Bb", "F"];

var Notation = function () {
    function Notation() {
        classCallCheck(this, Notation);
    }

    createClass(Notation, null, [{
        key: "Keys",
        get: function get$$1() {
            return keys;
        }
    }, {
        key: "KeyNotes",
        get: function get$$1() {
            return keynotes$1;
        }
    }, {
        key: "Accidentals",
        get: function get$$1() {
            return accidentals;
        }
    }]);
    return Notation;
}();

var notes = MIDIData.MidiNotes;
var keynotes = Notation.KeyNotes;

var NoteProcessor = function () {
	function NoteProcessor() {
		classCallCheck(this, NoteProcessor);
	}

	createClass(NoteProcessor, null, [{
		key: "processNoteEvent",

		// add all of our extra data to the MIDI message event.
		value: function processNoteEvent(message, eventName) {
			var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "C";

			var notes = this.getNoteNames(message.data[1]);
			var data = {
				"enharmonics": notes,
				"note": NoteProcessor.findNoteInKey(notes, key),
				"inKey": NoteProcessor.isNoteInKey(notes, key),
				"value": message.data[1],
				"velocity": message.data[2],
				"frequency": Convert.MIDINoteToFrequency(message.data[1])
			};
			return Object.assign(message, data);
		}
	}, {
		key: "processCCEvent",


		// add all of our extra data to the MIDI message event.
		value: function processCCEvent(message, ccNameOverride) {
			Object.assign(message, {
				"cc": ccNameOverride || message.data[1],
				"value": message.data[2],
				"ratio": message.data[2] / 127,
				"timestamp": message.receivedTime
			});
		}

		// add all of our extra data to the MIDI message event.

	}, {
		key: "processMidiControlEvent",
		value: function processMidiControlEvent(message, controlName) {
			Object.assign(message, {
				"cc": controlName,
				"value": message.data[1],
				"ratio": message.data[1] / 127,
				"timestamp": message.receivedTime
			});
		}

		// add all of our extra data to the MIDI message event.

	}, {
		key: "processPitchWheel",
		value: function processPitchWheel(message) {
			var raw = message.data[1] | message.data[2] << 7,
			    calc = -(8192 - raw),
			    ratio = calc / 8192;
			return Object.assign(message, {
				"cc": "pitchwheel",
				"value": raw,
				"polar": calc,
				"polarRatio": ratio,
				"timestamp": message.receivedTime
			});
		}

		// process the midi message. Go through each type and add processed data
		// when done, check for any bound events and run them.

		// get a list of notes that match this noteNumber

	}, {
		key: "getNoteNames",
		value: function getNoteNames(noteNumber) {
			var noteNames = []; // create a list for the notes
			for (var note in notes) {
				// loop through the note table and push notes that match.
				notes[note].forEach(function (keynumber) {
					if (noteNumber === keynumber) {
						noteNames.push(note);
					}
				});
			}
			return noteNames;
		}
	}, {
		key: "findNoteInKey",


		// find the first note that is in the current key
		value: function findNoteInKey(notes, key) {
			// loop through the note list
			for (var i = 0; i < notes.length; i++) {
				var note = notes[i];
				if (this.matchNoteInKey(note, key)) {
					return note;
				}
			}
			return notes[0];
		}
	}, {
		key: "isNoteInKey",


		// is this note in key
		value: function isNoteInKey(notes, key) {
			for (var n = 0; n < notes.length; n++) {
				var note = notes[n];
				if (this.matchNoteInKey(note, key)) {
					return true;
				}
			}
			return false;
		}
	}, {
		key: "matchNoteInKey",
		value: function matchNoteInKey(note, key) {
			for (var i = 0; i < keynotes[key].length; i++) {
				var keynote = keynotes[key][i];
				if (note === keynote) {
					return true;
				}
			}
			return false;
		}
	}]);
	return NoteProcessor;
}();

NoteProcessor.keysPressed = [];

var Generate = function () {
	function Generate() {
		classCallCheck(this, Generate);
	}

	createClass(Generate, null, [{
		key: "NoteOn",
		value: function NoteOn(noteNumber, velocity) {
			return new Uint8Array([MIDIData.NoteOn, noteNumber, velocity]);
		}
	}, {
		key: "NoteOff",
		value: function NoteOff(noteNumber, velocity) {
			return new Uint8Array([MIDIData.NoteOff, noteNumber, velocity]);
		}
	}, {
		key: "AfterTouch",
		value: function AfterTouch(noteNumber, value) {
			return new Uint8Array([MIDIData.AfterTouch, noteNumber, value]);
		}
	}, {
		key: "ControlChange",
		value: function ControlChange(controller, value) {
			return new Uint8Array([MIDIData.ControlChange, controller, value]);
		}
	}, {
		key: "ProgramChange",
		value: function ProgramChange(instrument) {
			return new Uint8Array([MIDIData.ProgramChange, instrument]);
		}
	}, {
		key: "ChannelPressure",
		value: function ChannelPressure(pressure) {
			return new Uint8Array([MIDIData.ChannelPressure, pressure]);
		}
	}, {
		key: "PitchBend",
		value: function PitchBend(value) {
			// @todo http://stackoverflow.com/questions/30911185/javascript-reading-3-bytes-buffer-as-an-integer
			var msb = 1,
			    lsb = 1;
			return new Uint8Array([MIDIData.ChannelPressure, msb, lsb]);
		}
	}, {
		key: "FakeMessage",
		value: function FakeMessage(messageType, value) {
			var data = null;
			switch (messageType) {
				case "NoteOn":
					data = Generate.NoteOn(value, 127);
					break;
				case "NoteOff":
					data = Generate.NoteOff(value, 127);
					break;
			}
			var newMessage = new MIDIMessageEvent("midimessage", { "data": data }) || { "data": data };
			return NoteProcessor.processNoteEvent(newMessage, messageType, this.key);
		}
	}]);
	return Generate;
}();

var Events = function () {
	function Events() {
		classCallCheck(this, Events);

		this.keysPressed = [];
		this.listeners = {};
		this.keyboadKeyPressed = [];
	}

	// take this event name, and run this handler when it occurs


	createClass(Events, [{
		key: "on",
		value: function on(event, handler) {
			if (this.listeners[event] === undefined) {
				this.listeners[event] = [handler];
			} else {
				this.listeners[event].push(handler);
			}
			return handler;
		}
	}, {
		key: "off",


		// unbind this event and handler
		value: function off(event, handler) {
			if (this.listeners[event]) {
				for (var i = this.listeners[event].length - 1; i >= 0; i--) {
					if (this.listeners[event].length === 1) {
						delete this.listeners[event];
					} else {
						this.listeners[event].splice(i, 1);
						break;
					}
				}
			}
		}
	}, {
		key: "onMIDIMessage",
		value: function onMIDIMessage(message) {
			var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "C";

			var eventName = null,
			    data = null;
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
				this.executeEventHandlers(eventName, data);
			}
		}
	}, {
		key: "executeEventHandlers",


		// loop through all the bound events and execute with the newly processed data.
		value: function executeEventHandlers(event, data) {
			if (this.listeners[event]) {
				for (var i = this.listeners[event].length - 1; i >= 0; i--) {
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
	}, {
		key: "onCC",


		// EZ binding for Control Change data, just pass in the CC number and handler. Can only be unbound with unbindALL()
		value: function onCC(cc, handler) {
			var wrapper = function wrapper(data) {
				if (data.cc == cc) {
					handler(data);
				}
			};
			this.on("Controller", wrapper);
		}
	}, {
		key: "keyToggle",


		// EZ binding for key presses, bind these two handlers to key on/off. Can only be unbound with unbindALL()
		value: function keyToggle(handlerOn, handlerOff) {
			this.on("NoteOn", handlerOn);
			this.on("NoteOff", handlerOff);
		}
	}, {
		key: "onNoteNumber",


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
		value: function onNoteNumber(number, handler) {
			var wrapper = function wrapper(data) {
				if (data.value == number) {
					handler(data);
				}
			};
			this.on("NoteOn", wrapper);
		}
	}, {
		key: "offNoteNumber",


		// EZ binding for key values. Can only be unbound with unbindALL()
		value: function offNoteNumber(number, handler) {
			var wrapper = function wrapper(data) {
				if (data.value == number) {
					handler(data);
				}
			};
			this.on("NoteOff", wrapper);
		}
	}, {
		key: "keyToggleRange",


		// EZ binding for a range of key values, bind these two handlers to key value. Can only be unbound with unbindALL()
		value: function keyToggleRange(min, max, onHandler, offHandler) {
			this.onRange(min, max, onHandler);
			this.offRange(min, max, offHandler);
		}
	}, {
		key: "onSplit",
		value: function onSplit(min, max, onHandler, offHandler) {
			if (max > min) {
				for (var i = min; i <= max; i++) {
					this.onNoteNumber(i, onHandler);
				}
			} else {
				for (var _i = max; _i >= min; _i--) {
					this.onNoteNumber(_i, onHandler);
				}
			}
		}
	}, {
		key: "offSplit",
		value: function offSplit(min, max, onHandler, offHandler) {
			if (max > min) {
				for (var i = min; i <= max; i++) {
					this.offNoteNumber(i, offHandler);
				}
			} else {
				for (var _i2 = max; _i2 >= min; _i2--) {
					this.offNoteNumber(_i2, offHandler);
				}
			}
		}
	}, {
		key: "unbindAll",


		// Removes all bound events.
		value: function unbindAll() {
			this.unBindKeyboard();
			for (var event in this.listeners) {
				delete this.listeners[event];
			}
			return true;
		}
	}, {
		key: "bindKeyboard",
		value: function bindKeyboard() {
			var _this = this;

			window.addEventListener("keydown", function (e) {
				return _this.keyboardKeyDown(e);
			});
			window.addEventListener("keyup", function (e) {
				return _this.keyboardKeyUp(e);
			});
		}
	}, {
		key: "unBindKeyboard",
		value: function unBindKeyboard() {
			var _this2 = this;

			window.removeEventListener("keydown", function (e) {
				return _this2.keyboardKeyDown(e);
			});
			window.removeEventListener("keyup", function (e) {
				return _this2.keyboardKeyUp(e);
			});
		}
	}, {
		key: "keyboardKeyDown",
		value: function keyboardKeyDown(message) {
			if (this.keyboadKeyPressed[message.keyCode] != true) {
				this.keyboadKeyPressed[message.keyCode] = true;
				var newMessage = null;
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
		}
	}, {
		key: "keyboardKeyUp",
		value: function keyboardKeyUp(message) {
			if (this.keyboadKeyPressed[message.keyCode] == true) {
				delete this.keyboadKeyPressed[message.keyCode];
				var newMessage = null;
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
	}, {
		key: "sendMidiMessage",
		value: function sendMidiMessage(message) {}
	}]);
	return Events;
}();

var Mizzy = function (_Events) {
	inherits(Mizzy, _Events);

	function Mizzy() {
		classCallCheck(this, Mizzy);

		var _this = possibleConstructorReturn(this, (Mizzy.__proto__ || Object.getPrototypeOf(Mizzy)).call(this));

		_this.keysPressed = [];
		_this.midiAccess = null;
		_this.loopback = true;

		_this.boundInputs = [];
		_this.boundOutputs = [];

		_this.key = Notation.Keys[0]; // C-Major
		if (!window.MIDIMessageEvent) {
			window.MIDIMessageEvent = function (name, params) {
				_this.name = name;
				return Object.assign(_this, params);
			};
		}
		if (_this.midiAccess === null) {
			if (navigator.requestMIDIAccess) {
				navigator.requestMIDIAccess({
					sysex: false
				}).then(function (e) {
					return _this.onMIDISuccess(e);
				}, function (e) {
					return _this.onMIDIFailure(e);
				});
			} else {
				throw "Your browser has no midi support";
			}
		}
		return _this;
	}

	createClass(Mizzy, [{
		key: "setKey",
		value: function setKey(keyname) {
			this.key = keyname;
		}
	}, {
		key: "getMidiInputs",
		value: function getMidiInputs() {
			if (this.midiAccess != null) {
				return this.midiAccess.inputs.values();
			}
		}
	}, {
		key: "getMidiOutputs",
		value: function getMidiOutputs() {
			if (this.midiAccess != null) {
				return this.midiAccess.outputs.values();
			}
		}
	}, {
		key: "bindToInput",
		value: function bindToInput(input) {
			var _this2 = this;

			this.boundInputs.push(input);
			input.onmidimessage = function (e) {
				return _this2.onMIDIMessage(e);
			};
		}
	}, {
		key: "unbindInput",
		value: function unbindInput(input) {
			var index = this.boundInputs.indexOf(input);
			this.boundInputs.slice(1, index);
			input.onmidimessage = null;
		}
	}, {
		key: "bindToAllInputs",
		value: function bindToAllInputs() {
			if (this.midiAccess != null) {
				var inputs = this.getMidiInputs();
				for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
					this.bindToInput(input.value);
				}
			}
		}
	}, {
		key: "unbindAllInputs",
		value: function unbindAllInputs() {
			this.boundInputs.forEach(this.unbindInput);
		}
	}, {
		key: "bindToOutput",
		value: function bindToOutput(output) {
			this.boundOutputs.push(output);
		}
	}, {
		key: "bindToAllOutputs",
		value: function bindToAllOutputs() {
			if (this.midiAccess != null) {
				var inputs = this.getMidiOutputs();
				for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
					this.bindToOutput(input.value);
				}
			}
		}
	}, {
		key: "onMIDIFailure",
		value: function onMIDIFailure(error) {
			throw error;
		}
	}, {
		key: "onMIDISuccess",
		value: function onMIDISuccess(midiAccessObj) {
			this.midiAccess = midiAccessObj;
		}
	}, {
		key: "sendMidiMessage",
		value: function sendMidiMessage(message) {

			if (this.loopback) {
				this.loopBackMidiMessage(message);
			}

			this.boundOutputs.forEach(function (output) {
				return output.send(message.data, message.timeStamp);
			});
		}
	}, {
		key: "loopBackMidiMessage",
		value: function loopBackMidiMessage(message) {
			this.onMIDIMessage(message, this.key);
		}
	}, {
		key: "outputDevices",
		get: function get$$1() {
			var deviceArray = [];
			var devices = this.getMidiOutputs();
			for (var input = devices.next(); input && !input.done; input = devices.next()) {
				deviceArray.push(input.value);
			}
			return deviceArray;
		}
	}, {
		key: "inputDevices",
		get: function get$$1() {
			var deviceArray = [];
			var devices = this.getMidiInputs();
			for (var input = devices.next(); input && !input.done; input = devices.next()) {
				deviceArray.push(input.value);
			}
			return deviceArray;
		}
	}]);
	return Mizzy;
}(Events);

return Mizzy;

}());

//# sourceMappingURL=mizzy.map
