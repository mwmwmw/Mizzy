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

var Events = function () {
	function Events() {
		classCallCheck(this, Events);

		this.listeners = {};
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
		value: function off(event) {
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
	}]);
	return Events;
}();

var GLOBAL_TUNE = 440;
var MIDI_14BIT_MAX_VALUE = 16384;
var MIDI_MAX_VALUE = 127;

var Convert = function () {
	function Convert() {
		classCallCheck(this, Convert);
	}

	createClass(Convert, null, [{
		key: "MIDINoteToFrequency",
		value: function MIDINoteToFrequency(midinote) {
			var tune = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : GLOBAL_TUNE;

			return tune * Math.pow(2, (midinote - 69) / 12); //
		}
	}, {
		key: "PitchWheelToPolar",
		value: function PitchWheelToPolar(raw) {
			return -(MIDI_14BIT_MAX_VALUE * 0.5 - raw);
		}
	}, {
		key: "PitchWheelToPolarRatio",
		value: function PitchWheelToPolarRatio(raw) {
			return Convert.PitchWheelToPolar(raw) / (MIDI_14BIT_MAX_VALUE * 0.5);
		}
	}, {
		key: "MidiValueToRatio",
		value: function MidiValueToRatio(value) {
			return value / MIDI_MAX_VALUE;
		}
	}, {
		key: "MidiValueToPolarRatio",
		value: function MidiValueToPolarRatio(value) {
			var halfmax = MIDI_MAX_VALUE * 0.5;
			return -(halfmax - value) / halfmax;
		}
	}]);
	return Convert;
}();

var MIDI_NOTE_ON = 0x90;
var MIDI_NOTE_OFF = 0x80;
var MIDI_AFTERTOUCH = 0xA0;
var MIDI_CONTROL_CHANGE = 0xB0;
var MIDI_PROGRAM_CHANGE = 0xC0;
var MIDI_CHANNEL_PRESSURE = 0xD0;
var MIDI_PITCHBEND = 0xE0;

var MIDI_MESSAGE_EVENT = "midimessage";

var NOTE_ON_EVENT = "NoteOn";
var NOTE_OFF_EVENT = "NoteOff";
var PITCHWHEEL_EVENT = "PitchWheel";
var CONTROLLER_EVENT = "Controller";
var PROGRAM_CHANGE_EVENT = "ProgramChange";
var AFTERTOUCH_EVENT = "Aftertouch";

var KEYBOARD_EVENT_KEY_DOWN = "keydown";
var KEYBOARD_EVENT_KEY_UP = "keyup";

var ENHARMONIC_KEYS = ["C", "G", "D", "A", "E", "B", "Cb", "F#", "Gb", "C#", "Db", "Ab", "Eb", "Bb", "F"];

var MIDI_NOTE_MAP = {
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



var KEY_NOTE_ARRAYS = {
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

var DataProcess = function () {
	function DataProcess() {
		classCallCheck(this, DataProcess);
	}

	createClass(DataProcess, null, [{
		key: "NoteEvent",

		// add all of our extra data to the MIDI message event.
		value: function NoteEvent(message) {
			var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ENHARMONIC_KEYS[0];
			var transpose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			var value = message.data[1] + transpose;
			var notes = this.getNoteNames(value);
			var data = {
				"enharmonics": notes,
				"note": DataProcess.findNoteInKey(notes, key),
				"inKey": DataProcess.isNoteInKey(notes, key),
				"value": value,
				"velocity": message.data[2],
				"frequency": Convert.MIDINoteToFrequency(value)
			};
			return Object.assign(message, data);
		}
	}, {
		key: "CCEvent",


		// add all of our extra data to the MIDI message event.
		value: function CCEvent(message, ccNameOverride) {
			return Object.assign(message, {
				"cc": ccNameOverride || message.data[1],
				"value": message.data[2],
				"ratio": Convert.MidiValueToRatio(message.data[2]),
				"polarRatio": Convert.MidiValueToPolarRatio(message.data[2])
			});
		}

		// add all of our extra data to the MIDI message event.

	}, {
		key: "MidiControlEvent",
		value: function MidiControlEvent(message, controlName) {
			return Object.assign(message, {
				"cc": controlName,
				"value": message.data[1],
				"ratio": Convert.MidiValueToRatio(message.data[2])
			});
		}

		// add all of our extra data to the MIDI message event.

	}, {
		key: "PitchWheelEvent",
		value: function PitchWheelEvent(message) {
			var raw = message.data[1] | message.data[2] << 7;
			return Object.assign(message, {
				"cc": "pitchwheel",
				"value": raw,
				"polar": Convert.PitchWheelToPolar(raw),
				"polarRatio": Convert.PitchWheelToPolarRatio(raw)
			});
		}

		// process the midi message. Go through each type and add processed data
		// when done, check for any bound events and run them.

		// get a list of notes that match this noteNumber

	}, {
		key: "getNoteNames",
		value: function getNoteNames(noteNumber) {
			var noteNames = []; // create a list for the notes
			for (var note in MIDI_NOTE_MAP) {
				// loop through the note table and push notes that match.
				MIDI_NOTE_MAP[note].forEach(function (keynumber) {
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
				if (DataProcess.matchNoteInKey(note, key)) {
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
			for (var i = 0; i < KEY_NOTE_ARRAYS[key].length; i++) {
				var keynote = KEY_NOTE_ARRAYS[key][i];
				if (note === keynote) {
					return true;
				}
			}
			return false;
		}
	}]);
	return DataProcess;
}();

var Generate = function () {
	function Generate() {
		classCallCheck(this, Generate);
	}

	createClass(Generate, null, [{
		key: "NoteOn",
		value: function NoteOn(noteNumber, velocity) {
			return new Uint8Array([MIDI_NOTE_ON, noteNumber, velocity]);
		}
	}, {
		key: "NoteOff",
		value: function NoteOff(noteNumber, velocity) {
			return new Uint8Array([MIDI_NOTE_OFF, noteNumber, velocity]);
		}
	}, {
		key: "AfterTouch",
		value: function AfterTouch(noteNumber, value) {
			return new Uint8Array([MIDI_AFTERTOUCH, noteNumber, value]);
		}
	}, {
		key: "CC",
		value: function CC(controller, value) {
			return new Uint8Array([MIDI_CONTROL_CHANGE, controller, value]);
		}
	}, {
		key: "ProgramChange",
		value: function ProgramChange(instrument) {
			return new Uint8Array([MIDI_PROGRAM_CHANGE, instrument]);
		}
	}, {
		key: "ChannelPressure",
		value: function ChannelPressure(pressure) {
			return new Uint8Array([MIDI_CHANNEL_PRESSURE, pressure]);
		}
	}, {
		key: "PitchBend",
		value: function PitchBend(value) {
			// @todo http://stackoverflow.com/questions/30911185/javascript-reading-3-bytes-buffer-as-an-integer
			var msb = 1,
			    lsb = 1;
			return new Uint8Array([MIDI_PITCHBEND, msb, lsb]);
		}
	}, {
		key: "NoteEvent",
		value: function NoteEvent(messageType, value) {
			var data = null;
			switch (messageType) {
				case NOTE_ON_EVENT:
					data = Generate.NoteOn(value, 127);
					break;
				case NOTE_OFF_EVENT:
					data = Generate.NoteOff(value, 127);
					break;
			}
			var newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, { "data": data }) || { "data": data };
			return DataProcess.NoteEvent(newMessage, this.key);
		}
	}, {
		key: "CCEvent",
		value: function CCEvent(cc, value) {
			var data = Generate.CC(cc, value);
			var newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, { "data": data });
			return DataProcess.CCEvent(newMessage);
		}
	}, {
		key: "PitchBendEvent",
		value: function PitchBendEvent(value) {
			var data = Generate.PitchBend(value);
			var newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, { "data": data });
			return DataProcess.CCEvent(newMessage);
		}
	}]);
	return Generate;
}();

var MIDIEvents = function (_Events) {
	inherits(MIDIEvents, _Events);

	function MIDIEvents() {
		classCallCheck(this, MIDIEvents);

		var _this = possibleConstructorReturn(this, (MIDIEvents.__proto__ || Object.getPrototypeOf(MIDIEvents)).call(this));

		_this.keysPressed = [];
		_this.keyboadKeyPressed = [];
		return _this;
	}

	createClass(MIDIEvents, [{
		key: "onMIDIMessage",
		value: function onMIDIMessage(message) {
			var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ENHARMONIC_KEYS[0];

			var eventName = null,
			    data = null;
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
			this.on(CONTROLLER_EVENT, wrapper);
		}
	}, {
		key: "keyToggle",


		// EZ binding for key presses, bind these two handlers to key on/off. Can only be unbound with unbindALL()
		value: function keyToggle(handlerOn, handlerOff) {
			this.on(NOTE_ON_EVENT, handlerOn);
			this.on(NOTE_OFF_EVENT, handlerOff);
		}
	}, {
		key: "onNoteNumber",


		// EZ binding for key values. Can only be unbound with unbindALL()
		value: function onNoteNumber(number, handler) {
			var wrapper = function wrapper(data) {
				if (data.value == number) {
					handler(data);
				}
			};
			this.on(NOTE_ON_EVENT, wrapper);
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
			this.on(NOTE_OFF_EVENT, wrapper);
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
			var _this2 = this;

			window.addEventListener(KEYBOARD_EVENT_KEY_DOWN, function (e) {
				return _this2.keyboardKeyDown(e);
			});
			window.addEventListener(KEYBOARD_EVENT_KEY_UP, function (e) {
				return _this2.keyboardKeyUp(e);
			});
		}
	}, {
		key: "unBindKeyboard",
		value: function unBindKeyboard() {
			var _this3 = this;

			window.removeEventListener(KEYBOARD_EVENT_KEY_DOWN, function (e) {
				return _this3.keyboardKeyDown(e);
			});
			window.removeEventListener(KEYBOARD_EVENT_KEY_UP, function (e) {
				return _this3.keyboardKeyUp(e);
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
		}
	}, {
		key: "keyboardKeyUp",
		value: function keyboardKeyUp(message) {
			if (this.keyboadKeyPressed[message.keyCode] == true) {
				delete this.keyboadKeyPressed[message.keyCode];
				var newMessage = null;
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
	}, {
		key: "sendMidiMessage",
		value: function sendMidiMessage(message) {}
	}]);
	return MIDIEvents;
}(Events);

var Mizzy = function (_MIDIEvents) {
	inherits(Mizzy, _MIDIEvents);
	createClass(Mizzy, null, [{
		key: "Generate",
		get: function get$$1() {
			return Generate;
		}
	}]);

	function Mizzy() {
		classCallCheck(this, Mizzy);

		var _this = possibleConstructorReturn(this, (Mizzy.__proto__ || Object.getPrototypeOf(Mizzy)).call(this));

		_this.keysPressed = [];
		_this.midiAccess = null;
		_this.loopback = true;

		_this.boundInputs = [];
		_this.boundOutputs = [];

		_this.key = ENHARMONIC_KEYS[0]; // C-Major
		if (!window.MIDIMessageEvent) {
			window.MIDIMessageEvent = function (name, params) {
				_this.name = name;
				return Object.assign(_this, params);
			};
		}

		return _this;
	}

	createClass(Mizzy, [{
		key: "initialize",
		value: function initialize() {
			var _this2 = this;

			if (this.midiAccess === null) {
				if (navigator.requestMIDIAccess) {
					return navigator.requestMIDIAccess({
						sysex: false
					}).then(function (e) {
						return _this2.onMIDISuccess(e);
					}, function (e) {
						return _this2.onMIDIFailure(e);
					});
				} else {
					console.warn("[Mizzy] Your browser does not support Web MIDI API. You can still use the local loopback however.");
					return new Promise(function (resolve, reject) {
						setTimeout(function () {
							resolve();
						}, 50);
					});
				}
			}
		}
	}, {
		key: "setKey",
		value: function setKey() {
			var keyletter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "C";

			this.key = ENHARMONIC_KEYS[ENHARMONIC_KEYS.indexOf(keyletter.toUpperCase())] || "C";
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
			var _this3 = this;

			this.boundInputs.push(input);
			input.onmidimessage = function (e) {
				return _this3.onMIDIMessage(e, _this3.key);
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
				var outputs = this.getMidiOutputs();
				for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
					this.bindToOutput(output.value);
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
			this.boundOutputs.forEach(function (output) {
				output.send(message.data, message.timeStamp);
			});
			if (this.loopback) {
				this.onMIDIMessage(message, this.key);
			}
		}
	}, {
		key: "keys",
		get: function get$$1() {
			return ENHARMONIC_KEYS;
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
}(MIDIEvents);

module.exports = Mizzy;

//# sourceMappingURL=mizzy.cjs.map
