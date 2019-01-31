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
			var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (this.listeners[event]) {
				if (handler == null) {
					for (var i = this.listeners[event].length - 1; i >= 0; i--) {
						if (this.listeners[event].length === 1) {
							delete this.listeners[event];
							return true;
						} else {
							this.listeners[event].splice(i, 1);
							return true;
						}
					}
				} else {
					for (var _i = 0; _i < this.listeners[event].length; _i++) {
						if (this.listeners[event][_i] == handler) {
							this.listeners[event].splice(_i, 1);
							if (this.listeners[event].length === 0) {
								delete this.listeners[event];
							}
							return true;
						}
					}
				}
			}
			return false;
		}
	}, {
		key: "trigger",
		value: function trigger(event, data) {
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
	}, {
		key: "MidiChannel",
		value: function MidiChannel(value) {
			return (value & 0x0F) + 1;
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
var PROGRAM_CHANGE_EVENT$1 = "ProgramChange";
var AFTERTOUCH_EVENT$1 = "Aftertouch";

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
				"frequency": Convert.MIDINoteToFrequency(value),
				"channel": Convert.MidiChannel(message.data[0])
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
				"polarRatio": Convert.MidiValueToPolarRatio(message.data[2]),
				"channel": Convert.MidiChannel(message.data[0])
			});
		}

		// add all of our extra data to the MIDI message event.

	}, {
		key: "MidiControlEvent",
		value: function MidiControlEvent(message, controlName) {
			return Object.assign(message, {
				"cc": controlName,
				"value": message.data[1],
				"ratio": Convert.MidiValueToRatio(message.data[2]),
				"channel": Convert.MidiChannel(message.data[0])
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
				"polarRatio": Convert.PitchWheelToPolarRatio(raw),
				"channel": Convert.MidiChannel(message.data[0])
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
			var msb = 0,
			    lsb = 0;
			return new Uint8Array([MIDI_PITCHBEND, msb, lsb]);
		}
	}, {
		key: "MidiEvent",
		value: function MidiEvent(data, key) {
			var _window = window,
			    MIDIMessageEvent = _window.MIDIMessageEvent;


			var message = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, { data: data });

			switch (data[0] & 0xF0) {
				case MIDI_NOTE_ON:
					return DataProcess.NoteEvent(message, key);
				case MIDI_NOTE_OFF:
					return DataProcess.NoteEvent(message, key);
				case MIDI_CONTROL_CHANGE:
					return DataProcess.CCEvent(message);
				case MIDI_PITCHBEND:
					return DataProcess.PitchWheelEvent(message);
				case MIDI_AFTERTOUCH:
					return DataProcess.MidiControlEvent(message, AFTERTOUCH_EVENT);
				case MIDI_PROGRAM_CHANGE:
					return DataProcess.MidiControlEvent(message, PROGRAM_CHANGE_EVENT);
			}
		}
	}, {
		key: "NoteEvent",
		value: function NoteEvent(messageType, value) {
			var velocity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 127;
			var _window2 = window,
			    MIDIMessageEvent = _window2.MIDIMessageEvent;

			var data = null;
			switch (messageType) {
				case NOTE_ON_EVENT:
					data = Generate.NoteOn(value, velocity);
					break;
				case NOTE_OFF_EVENT:
					data = Generate.NoteOff(value, velocity);
					break;
			}
			var newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, { data: data });
			return DataProcess.NoteEvent(newMessage, this.key);
		}
	}, {
		key: "CCEvent",
		value: function CCEvent(cc, value) {
			var _window3 = window,
			    MIDIMessageEvent = _window3.MIDIMessageEvent;

			var data = Generate.CC(cc, value);
			var newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, { data: data });
			return DataProcess.CCEvent(newMessage);
		}
	}, {
		key: "PitchBendEvent",
		value: function PitchBendEvent(value) {
			var _window4 = window,
			    MIDIMessageEvent = _window4.MIDIMessageEvent;

			var data = Generate.PitchBend(value);
			var newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, { data: data });
			return DataProcess.CCEvent(newMessage);
		}
	}]);
	return Generate;
}();

/**
 * MIDIEvents - contains all the functionality for binding and removing MIDI events
 */
var KEY_CODE_MAP = {
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

var MIDIEvents = function (_Events) {
	inherits(MIDIEvents, _Events);

	function MIDIEvents() {
		classCallCheck(this, MIDIEvents);

		var _this = possibleConstructorReturn(this, (MIDIEvents.__proto__ || Object.getPrototypeOf(MIDIEvents)).call(this));

		_this.keysPressed = [];
		_this.keyboardKeyPressed = [];
		return _this;
	}

	/**
  * onMIDIMessage handles all incoming midi messages, processes them and then routes them to the correct event handler.
  * @param message
  * @param key
  */


	createClass(MIDIEvents, [{
		key: "onMIDIMessage",
		value: function onMIDIMessage(message) {
			var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ENHARMONIC_KEYS[0];

			var eventName = null,
			    data = null;
			switch (message.data[0] & 0xF0) {
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
		}
	}, {
		key: "onCC",


		/**
   * EZ binding for a single Control Change data, just pass in the CC number and handler. This returns an anonymous function which you should store a reference to if you want to unbind this CC later.
   * @param cc
   * @param handler
   * @returns {Function}
   */
		value: function onCC(cc, handler) {
			var channel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			if (channel == null) {
				return this.on(CONTROLLER_EVENT, function (data) {
					if (data.cc == cc) {
						handler(data);
					}
				});
			} else {
				return this.on(CONTROLLER_EVENT, function (data) {
					if (data.cc == cc && data.channel == channel) {
						handler(data);
					}
				});
			}
		}

		/**
   * Takes the CC# and Event handler and removes the event from the listeners.
   * @param handler
   * @returns {Boolean}
   */

	}, {
		key: "removeCC",
		value: function removeCC(handler) {
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

	}, {
		key: "keyToggle",
		value: function keyToggle(keyDown, keyUp) {
			return {
				keyDown: this.on(NOTE_ON_EVENT, keyDown),
				keyUp: this.on(NOTE_OFF_EVENT, keyUp)
			};
		}
	}, {
		key: "removeKeyToggle",


		/**
   * This will unbind the keyToggle. Pass in the reference created when you called `keyToggle()`
   * @param toggles
   */
		value: function removeKeyToggle(toggles) {
			this.off(NOTE_ON_EVENT, toggles.keyDown);
			this.off(NOTE_OFF_EVENT, toggles.keyUp);
		}

		/**
   * EZ binding for individual key values. Pass in the note number you want to wait for (ie 60 = middle c) and the handler for it. This function will return a reference to the handler created for this note.
   * @param number
   * @param handler
   * @returns {Function}
   */

	}, {
		key: "pressNoteNumber",
		value: function pressNoteNumber(number, handler) {
			var channel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			if (channel == null) {
				return this.on(NOTE_ON_EVENT, function (data) {
					if (data.value == number) {
						handler(data);
					}
				});
			} else {
				return this.on(NOTE_ON_EVENT, function (data) {
					if (data.value == number && data.channel == channel) {
						handler(data);
					}
				});
			}
		}
	}, {
		key: "removePressNoteNumber",
		value: function removePressNoteNumber(handler) {
			return this.off(NOTE_ON_EVENT, handler);
		}
		// EZ binding for key values. Can only be unbound with unbindALL()

	}, {
		key: "releaseNoteNumber",
		value: function releaseNoteNumber(number, handler) {
			var channel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			if (channel == null) {
				return this.on(NOTE_OFF_EVENT, function (data) {
					if (data.value == number) {
						handler(data);
					}
				});
			} else {
				return this.on(NOTE_OFF_EVENT, function (data) {
					if (data.value == number && data.channel == channel) {
						handler(data);
					}
				});
			}
		}
	}, {
		key: "removeReleaseNoteNumber",
		value: function removeReleaseNoteNumber(handler) {
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

	}, {
		key: "keyToggleRange",
		value: function keyToggleRange(min, max, onHandler, offHandler) {
			var channel = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

			return {
				press: this.onSplit(min, max, onHandler, channel),
				release: this.offSplit(min, max, offHandler, channel)
			};
		}
	}, {
		key: "onSplit",
		value: function onSplit(min, max, onHandler) {
			var channel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			var on = [];
			if (max > min) {
				for (var i = min; i <= max; i++) {
					on.push(this.pressNoteNumber(i, onHandler, channel));
				}
			} else {
				for (var _i = max; _i >= min; _i--) {
					on.push(this.pressNoteNumber(_i, onHandler, channel));
				}
			}
			return on;
		}
	}, {
		key: "offSplit",
		value: function offSplit(min, max, offHandler) {
			var channel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			var off = [];
			if (max > min) {
				for (var i = min; i <= max; i++) {
					off.push(this.releaseNoteNumber(i, offHandler, channel));
				}
			} else {
				for (var _i2 = max; _i2 >= min; _i2--) {
					off.push(this.releaseNoteNumber(_i2, offHandler, channel));
				}
			}
			return off;
		}
	}, {
		key: "removeKeyToggleRange",
		value: function removeKeyToggleRange(ranges) {
			var _this2 = this;

			var removeOnRanges = ranges.press.forEach(function (noteHandler) {
				return _this2.removePressNoteNumber(noteHandler);
			});
			var removeOffRanges = ranges.release.forEach(function (noteHandler) {
				return _this2.removeReleaseNoteNumber(noteHandler);
			});
			return removeOffRanges == true && removeOnRanges == true;
		}

		/**
   * Removes all bound handlers for all events. Great for when you know you need to lose all the events.
   * @returns {boolean}
   */

	}, {
		key: "unbindAll",
		value: function unbindAll() {
			this.unBindKeyboard();
			for (var event in this.listeners) {
				delete this.listeners[event];
			}
			return true;
		}
	}, {
		key: "bindKeyboard",


		/**
   * Bind the computer (qwerty) keyboard to allow it to generate MIDI note on and note off messages.
   */
		value: function bindKeyboard() {
			var _this3 = this;

			var channel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			window.addEventListener(KEYBOARD_EVENT_KEY_DOWN, function (e) {
				return _this3.keyboardKeyDown(e, channel);
			});
			window.addEventListener(KEYBOARD_EVENT_KEY_UP, function (e) {
				return _this3.keyboardKeyUp(e, channel);
			});
		}
	}, {
		key: "unBindKeyboard",
		value: function unBindKeyboard() {
			var _this4 = this;

			var channel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			window.removeEventListener(KEYBOARD_EVENT_KEY_DOWN, function (e) {
				return _this4.keyboardKeyDown(e, channel);
			});
			window.removeEventListener(KEYBOARD_EVENT_KEY_UP, function (e) {
				return _this4.keyboardKeyUp(e, channel);
			});
		}
	}, {
		key: "keyboardKeyDown",
		value: function keyboardKeyDown(message) {
			var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (KEY_CODE_MAP[message.keyCode] != undefined) {
				if (this.keyboardKeyPressed[message.keyCode] != true) {
					this.keyboardKeyPressed[message.keyCode] = true;
					var newMessage = Generate.NoteEvent(NOTE_ON_EVENT, KEY_CODE_MAP[message.keyCode]);
					if (newMessage !== null) {
						this.sendMidiMessage(newMessage, channel);
					}
				}
			}
		}
	}, {
		key: "keyboardKeyUp",
		value: function keyboardKeyUp(message) {
			var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (KEY_CODE_MAP[message.keyCode] != undefined) {
				if (this.keyboardKeyPressed[message.keyCode] == true) {
					delete this.keyboardKeyPressed[message.keyCode];
					var newMessage = Generate.NoteEvent(NOTE_OFF_EVENT, KEY_CODE_MAP[message.keyCode]);
					if (newMessage !== null) {
						this.sendMidiMessage(newMessage, channel);
					}
				}
			}
		}
	}, {
		key: "sendMidiMessage",
		value: function sendMidiMessage(message) {
			var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (channel != null) {
				message.data[0] = message.data[0] | parseInt(channel - 1, 16);
			}
			this.boundOutputs.forEach(function (output) {
				output.send(message.data, message.timeStamp);
			});
			if (this.loopback) {
				this.onMIDIMessage(message, this.key);
			}
		}
	}]);
	return MIDIEvents;
}(Events);

var TICK_INCREMENT = 0.25;
var DEFAULT_LOOP_LENGTH = 16;
var DEFAULT_TEMPO = 120;
var TICK_LENGTH = 0.2;

var Clock = function (_Events) {
	inherits(Clock, _Events);

	function Clock(context) {
		classCallCheck(this, Clock);

		var _this = possibleConstructorReturn(this, (Clock.__proto__ || Object.getPrototypeOf(Clock)).call(this));

		_this.context = context || new AudioContext();

		_this.BPM = DEFAULT_TEMPO;
		_this.tickSchedule;
		_this.tick = 0;
		_this.playing = false;
		_this.loopIndex = 0;
		_this.startClock = 0;
		_this.index = 0;
		_this.looplength = DEFAULT_LOOP_LENGTH;
		_this.direction = 1;
		_this.lastTick = 0;
		return _this;
	}

	createClass(Clock, [{
		key: "reset",
		value: function reset() {
			this.index = 0;
			this.loopIndex = 0;
		}
	}, {
		key: "play",
		value: function play() {
			var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var loopIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			this.tick = 0;
			this.startClock = this.context.currentTime + 0.005;
			this.index = index;
			this.loopIndex = loopIndex;
			this.playing = true;
			this.trigger("play", this.context.currentTime + 0.005);
			this.schedule();
		}
	}, {
		key: "stop",
		value: function stop() {
			this.trigger("stop");
			this.playing = false;
		}
	}, {
		key: "schedule",
		value: function schedule() {
			var _this2 = this;

			if (this.playing) {
				var playHead = this.context.currentTime - this.startClock;
				while (this.tick < playHead + TICK_LENGTH) {
					var localPlayHead = this.tick + this.startClock;
					this.process(this.index, this.loopIndex, this.tick, playHead);
					this.next();
				}
				this.tickSchedule = setTimeout(function () {
					return _this2.schedule();
				}, 0);
			}
		}
	}, {
		key: "process",
		value: function process(index, loopIndex, localTime, globalTime) {
			var tick = {
				index: index, loopIndex: loopIndex, globalTime: globalTime
			};
			this.trigger("tick", tick);
		}
	}, {
		key: "next",
		value: function next() {
			var beat = 60 / this.BPM;
			this.index++;
			this.loopIndex += this.direction;

			if (this.loopIndex > this.looplength - 1) {
				this.loopIndex = 0;
			} else if (this.loopIndex < 0) {
				this.loopIndex = this.looplength - 1;
			}

			this.tick += TICK_INCREMENT * beat;
		}
	}]);
	return Clock;
}(Events);

if (window.MIDIMessageEvent === undefined) {
	window.MIDIMessageEvent = MessageEvent;
}

var Mizzy = function (_MIDIEvents) {
	inherits(Mizzy, _MIDIEvents);
	createClass(Mizzy, null, [{
		key: "Generate",
		get: function get$$1() {
			return Generate;
		}
	}, {
		key: "Clock",
		get: function get$$1() {
			return Clock;
		}
	}, {
		key: "NOTE_ON",
		get: function get$$1() {
			return NOTE_ON_EVENT;
		}
	}, {
		key: "NOTE_OFF",
		get: function get$$1() {
			return NOTE_OFF_EVENT;
		}
	}, {
		key: "CONTROLCHANGE",
		get: function get$$1() {
			return CONTROLLER_EVENT;
		}
	}, {
		key: "PITCHWHEEL",
		get: function get$$1() {
			return PITCHWHEEL_EVENT;
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

		_this.clock = new Clock();

		_this.key = ENHARMONIC_KEYS[0]; // C-Major

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
		key: "panic",
		value: function panic() {
			for (var i = 0; i < 127; i++) {
				this.sendMidiMessage(Generate.MidiEvent(Mizzy.Generate.NoteOff(i, 127), this.key));
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
