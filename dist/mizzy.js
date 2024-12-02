(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.mizzy = factory());
})(this, (function () { 'use strict';

  class CustomMIDIMessageEvent extends MIDIMessageEvent {
      constructor(type, options = {}) {
          super(type);
          this.data = options.data || new Uint8Array();
      }
  }
  // Use type assertion to handle the potential undefined case
  const MIDIMessageEventClass = window.MIDIMessageEvent || CustomMIDIMessageEvent;
  class Events {
      constructor() {
          this.listeners = {};
      }
      on(event, handler) {
          if (this.listeners[event] === undefined) {
              this.listeners[event] = [handler];
          }
          else {
              this.listeners[event].push(handler);
          }
          return handler;
      }
      off(event, handler = null) {
          if (this.listeners[event]) {
              if (handler === null) {
                  delete this.listeners[event];
                  return true;
              }
              const index = this.listeners[event].indexOf(handler);
              if (index !== -1) {
                  this.listeners[event].splice(index, 1);
                  if (this.listeners[event].length === 0) {
                      delete this.listeners[event];
                  }
                  return true;
              }
          }
          return false;
      }
      trigger(event, data) {
          if (this.listeners[event]) {
              for (let i = this.listeners[event].length - 1; i >= 0; i--) {
                  if (this.listeners[event] !== undefined) {
                      const handler = this.listeners[event][i];
                      if (typeof handler === "function") {
                          handler(data);
                      }
                      else {
                          throw new Error("Event handler is not a function.");
                      }
                  }
              }
          }
      }
  }

  const GLOBAL_TUNE = 440;
  const MIDI_14BIT_MAX_VALUE = 16384;
  const MIDI_MAX_VALUE = 127;
  function midiNoteToFrequency(midinote, tune = GLOBAL_TUNE) {
      return tune * Math.pow(2, (midinote - 69) / 12);
  }
  function pitchWheelToPolar(raw) {
      return -((MIDI_14BIT_MAX_VALUE * 0.5) - raw);
  }
  function pitchWheelToPolarRatio(raw) {
      return pitchWheelToPolar(raw) / (MIDI_14BIT_MAX_VALUE * 0.5);
  }
  function midiValueToRatio(value) {
      return value / MIDI_MAX_VALUE;
  }
  function midiValueToPolarRatio(value) {
      const halfmax = (MIDI_MAX_VALUE * 0.5);
      return -(halfmax - value) / halfmax;
  }
  function midiChannel(value) {
      return (value & 0x0F) + 1;
  }

  const MIDI_NOTE_ON = 0x90;
  const MIDI_NOTE_OFF = 0x80;
  const MIDI_AFTERTOUCH = 0xA0;
  const MIDI_CONTROL_CHANGE = 0xB0;
  const MIDI_PROGRAM_CHANGE = 0xC0;
  const MIDI_PITCHBEND = 0xE0;
  const MIDI_MESSAGE_EVENT = "midimessage";
  const NOTE_ON_EVENT = "NoteOn";
  const NOTE_OFF_EVENT = "NoteOff";
  const PITCHWHEEL_EVENT = "PitchWheel";
  const CONTROLLER_EVENT = "Controller";
  const PROGRAM_CHANGE_EVENT = "ProgramChange";
  const AFTERTOUCH_EVENT = "Aftertouch";
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
  const KEY_CODE_MAP = {
      "KeyZ": 60, "KeyS": 61, "KeyX": 62, "KeyD": 63, "KeyC": 64,
      "KeyV": 65, "KeyG": 66, "KeyB": 67, "KeyH": 68, "KeyN": 69,
      "KeyJ": 70, "KeyM": 71, "Comma": 72
  };

  const PITCHWHEEL_CC = "pitchwheel";
  function processNoteEvent(message, key = ENHARMONIC_KEYS[0], transpose = 0) {
      const value = message.data[1] + transpose;
      const notes = getNoteNames(value);
      const data = {
          enharmonics: notes,
          note: findNoteInKey(notes, key),
          inKey: isNoteInKey(notes, key),
          value: value,
          velocity: message.data[2],
          frequency: midiNoteToFrequency(value),
          channel: midiChannel(message.data[0]),
      };
      return Object.assign(message, data);
  }
  function processCCEvent(message, ccNameOverride) {
      return Object.assign(message, {
          cc: message.data[1],
          value: message.data[2],
          ratio: midiValueToRatio(message.data[2]),
          polarRatio: midiValueToPolarRatio(message.data[2]),
          channel: midiChannel(message.data[0]),
      });
  }
  function processPitchWheelEvent(message) {
      const raw = message.data[1] | (message.data[2] << 7);
      return Object.assign(message, {
          cc: PITCHWHEEL_CC,
          value: raw,
          polar: pitchWheelToPolar(raw),
          polarRatio: pitchWheelToPolarRatio(raw),
          channel: midiChannel(message.data[0]),
      });
  }
  function processMidiControlEvent(message, controlName) {
      return Object.assign(message, {
          cc: controlName,
          value: message.data[1],
          ratio: midiValueToRatio(message.data[2]),
          channel: midiChannel(message.data[0]),
      });
  }
  function getNoteNames(noteNumber) {
      const noteNames = [];
      for (const note in MIDI_NOTE_MAP) {
          MIDI_NOTE_MAP[note].forEach((keynumber) => {
              if (noteNumber === keynumber) {
                  noteNames.push(note);
              }
          });
      }
      return noteNames;
  }
  function findNoteInKey(notes, key) {
      for (let i = 0; i < notes.length; i++) {
          const note = notes[i];
          if (matchNoteInKey(note, key)) {
              return note;
          }
      }
      return notes[0];
  }
  function isNoteInKey(notes, key) {
      for (let n = 0; n < notes.length; n++) {
          const note = notes[n];
          if (matchNoteInKey(note, key)) {
              return true;
          }
      }
      return false;
  }
  function matchNoteInKey(note, key) {
      for (let i = 0; i < KEY_NOTE_ARRAYS[key].length; i++) {
          const keynote = KEY_NOTE_ARRAYS[key][i];
          if (note === keynote) {
              return true;
          }
      }
      return false;
  }

  function noteOn(noteNumber, velocity) {
      return new Uint8Array([MIDI_NOTE_ON, noteNumber, velocity]);
  }
  function noteOff(noteNumber, velocity) {
      return new Uint8Array([MIDI_NOTE_OFF, noteNumber, velocity]);
  }
  function cc(controller, value) {
      return new Uint8Array([MIDI_CONTROL_CHANGE, controller, value]);
  }
  function pitchBend(value) {
      const normalized = Math.floor(((value + 1) / 2) * 16383);
      const msb = (normalized >> 7) & 0x7F;
      const lsb = normalized & 0x7F;
      return new Uint8Array([MIDI_PITCHBEND, lsb, msb]);
  }
  function noteEvent(messageType, value, velocity = 127, key = ENHARMONIC_KEYS[0]) {
      let data = null;
      switch (messageType) {
          case NOTE_ON_EVENT:
              data = noteOn(value, velocity);
              break;
          case NOTE_OFF_EVENT:
              data = noteOff(value, velocity);
              break;
          default:
              data = noteOn(value, velocity);
              break;
      }
      const newMessage = new MIDIMessageEventClass(MIDI_MESSAGE_EVENT, { data });
      return processNoteEvent(newMessage, key);
  }
  function ccEvent(controller, value) {
      const data = cc(controller, value);
      const newMessage = new MIDIMessageEventClass(MIDI_MESSAGE_EVENT, { data });
      return processCCEvent(newMessage);
  }
  function pitchBendEvent(value) {
      const data = pitchBend(value);
      const newMessage = new MIDIMessageEventClass(MIDI_MESSAGE_EVENT, { data });
      return processPitchWheelEvent(newMessage);
  }

  class MIDIEvents extends Events {
      constructor() {
          super();
          this.keysPressed = {};
          this.keyboardKeyPressed = {};
          this.boundInputs = [];
          this.boundOutputs = [];
          this.loopback = true;
          this.key = ENHARMONIC_KEYS[0];
      }
      onMIDIMessage(message, key = ENHARMONIC_KEYS[0]) {
          let eventName = null;
          let data = null;
          switch (message.data[0] & 0xF0) {
              case MIDI_NOTE_OFF:
                  eventName = NOTE_OFF_EVENT;
                  delete this.keysPressed[message.data[1].toString()];
                  data = processNoteEvent(message, key);
                  break;
              case MIDI_NOTE_ON:
                  if (message.data[2] > 0) {
                      eventName = NOTE_ON_EVENT;
                  }
                  else {
                      eventName = NOTE_OFF_EVENT;
                  }
                  data = processNoteEvent(message, key);
                  if (eventName === NOTE_ON_EVENT) {
                      this.keysPressed[message.data[1].toString()] = data;
                  }
                  else {
                      delete this.keysPressed[message.data[1].toString()];
                  }
                  break;
              case MIDI_CONTROL_CHANGE:
                  eventName = CONTROLLER_EVENT;
                  data = processCCEvent(message);
                  break;
              case MIDI_PITCHBEND:
                  eventName = PITCHWHEEL_EVENT;
                  data = processPitchWheelEvent(message);
                  break;
              case MIDI_AFTERTOUCH:
                  eventName = AFTERTOUCH_EVENT;
                  data = processMidiControlEvent(message, eventName);
                  break;
              case MIDI_PROGRAM_CHANGE:
                  eventName = PROGRAM_CHANGE_EVENT;
                  data = processMidiControlEvent(message, eventName);
                  break;
          }
          if (eventName !== null && data !== null) {
              this.trigger(eventName, data);
          }
      }
      /**
       * EZ binding for a single Control Change data. Returns an anonymous function which should be stored
       * if you want to unbind this CC later.
       */
      onCC(cc, handler, channel = null) {
          if (channel == null) {
              return this.on(CONTROLLER_EVENT, (data) => {
                  if (data.cc == cc) {
                      handler(data);
                  }
              });
          }
          else {
              return this.on(CONTROLLER_EVENT, (data) => {
                  if (data.cc == cc && data.channel == channel) {
                      handler(data);
                  }
              });
          }
      }
      /**
       * Takes the CC# and Event handler and removes the event from the listeners.
       */
      removeCC(handler) {
          return this.off(CONTROLLER_EVENT, handler);
      }
      /**
       * KeyToggle will bind to all MIDI note events and execute the keyDown handler when pressed
       * and keyUp handler when released. Returns reference to the handlers for unbinding.
       *
       * @example
       * ```typescript
       * const m = new Mizzy();
       * const toggleKeys = m.keyToggle((e) => console.log(e),(e) => console.log(e));
       * // when ready to unbind
       * m.removeKeyToggle(toggleKeys);
       * ```
       */
      keyToggle(keyDown, keyUp) {
          return {
              keyDown: this.on(NOTE_ON_EVENT, (data) => keyDown(data)),
              keyUp: this.on(NOTE_OFF_EVENT, (data) => keyUp(data))
          };
      }
      ;
      /**
       * Unbinds the keyToggle using the reference created from keyToggle()
       */
      removeKeyToggle(toggles) {
          this.off(NOTE_ON_EVENT, toggles.keyDown);
          this.off(NOTE_OFF_EVENT, toggles.keyUp);
      }
      /**
       * EZ binding for individual key values. Returns a reference to the handler created for this note.
       */
      pressNoteNumber(number, handler, channel = null) {
          if (channel == null) {
              return this.on(NOTE_ON_EVENT, (data) => {
                  if (data.value == number) {
                      handler(data);
                  }
              });
          }
          else {
              return this.on(NOTE_ON_EVENT, (data) => {
                  if (data.value == number && data.channel == channel) {
                      handler(data);
                  }
              });
          }
      }
      ;
      /**
       * Binds a handler to a specific MIDI note number that triggers when the note is pressed.
       * Returns a reference to the handler that can be used to remove the binding later.
       *
       * @param number - The MIDI note number to bind to (0-127)
       * @param handler - The callback function that will be called when the note is pressed
       * @param channel - Optional MIDI channel to filter on (0-15). If null, listens on all channels
       * @returns A reference to the bound handler that can be passed to removePressNoteNumber()
       *
       * @example
       * ```typescript
       * const m = new Mizzy();
       * const handler = m.pressNoteNumber(60, (e) => console.log('Middle C pressed!'));
       * // when ready to unbind
       * m.removePressNoteNumber(handler);
       * ```
       */
      removePressNoteNumber(handler) {
          return this.off(NOTE_ON_EVENT, handler);
      }
      // EZ binding for key values. Can only be unbound with unbindALL()
      releaseNoteNumber(number, handler, channel = null) {
          if (channel == null) {
              return this.on(NOTE_OFF_EVENT, (data) => {
                  if (data.value == number) {
                      handler(data);
                  }
              });
          }
          else {
              return this.on(NOTE_OFF_EVENT, (data) => {
                  if (data.value == number && data.channel == channel) {
                      handler(data);
                  }
              });
          }
      }
      ;
      removeReleaseNoteNumber(handler) {
          return this.off(NOTE_OFF_EVENT, handler);
      }
      /**
       * Bind keyboard splits.
       */
      keyToggleRange(min, max, onHandler, offHandler, channel = null) {
          return {
              press: this.onSplit(min, max, onHandler, channel),
              release: this.offSplit(min, max, offHandler, channel)
          };
      }
      ;
      /**
       * Bind keyboard splits with a range of MIDI note numbers.
       * This function allows you to set handlers for both note on and note off events within a specified range.
       *
       * @param min - The lower bound MIDI note number of the range (0-127)
       * @param max - The upper bound MIDI note number of the range (0-127)
       * @param onHandler - Callback function that handles note on events within the range
       * @param offHandler - Callback function that handles note off events within the range
       * @param channel - Optional MIDI channel to filter on (0-15). If null, listens on all channels
       * @returns An object containing arrays of bound handlers for both press and release events that can be passed to removeKeyToggleRange()
       *
       * @example
       * ```typescript
       * const m = new Mizzy();
       * const handlers = m.keyToggleRange(60, 72,
       *   (e) => console.log('Note pressed in range!'),
       *   (e) => console.log('Note released in range!')
       * );
       * // when ready to unbind
       * m.removeKeyToggleRange(handlers);
       * ```
       */
      onSplit(min, max, onHandler, channel = null) {
          let on = [];
          if (max > min) {
              for (let i = min; i <= max; i++) {
                  on.push(this.pressNoteNumber(i, onHandler, channel));
              }
          }
          else {
              for (let i = max; i >= min; i--) {
                  on.push(this.pressNoteNumber(i, onHandler, channel));
              }
          }
          return on;
      }
      ;
      /**
       * Binds a handler to a range of MIDI note numbers for note off events.
       */
      offSplit(min, max, offHandler, channel = null) {
          let off = [];
          if (max > min) {
              for (let i = min; i <= max; i++) {
                  off.push(this.releaseNoteNumber(i, offHandler, channel));
              }
          }
          else {
              for (let i = max; i >= min; i--) {
                  off.push(this.releaseNoteNumber(i, offHandler, channel));
              }
          }
          return off;
      }
      ;
      /**
       * Removes all bound handlers for a range of MIDI note numbers.
       */
      removeKeyToggleRange(ranges) {
          const removeOnRanges = ranges.press.every((noteHandler) => this.removePressNoteNumber(noteHandler));
          const removeOffRanges = ranges.release.every((noteHandler) => this.removeReleaseNoteNumber(noteHandler));
          return removeOffRanges && removeOnRanges;
      }
      /**
       * Removes all bound handlers for all events.
       */
      unbindAll() {
          this.unBindKeyboard();
          for (let event in this.listeners) {
              delete this.listeners[event];
          }
      }
      ;
      /**
       * Bind the computer (qwerty) keyboard to allow it to generate MIDI note on and note off messages.
       */
      bindKeyboard(channel = null) {
          window.addEventListener(KEYBOARD_EVENT_KEY_DOWN, (e) => this.keyboardKeyDown(e, channel));
          window.addEventListener(KEYBOARD_EVENT_KEY_UP, (e) => this.keyboardKeyUp(e, channel));
      }
      ;
      /**
       * Removes the keyboard event listeners.
       */
      unBindKeyboard(channel = null) {
          window.removeEventListener(KEYBOARD_EVENT_KEY_DOWN, (e) => this.keyboardKeyDown(e, channel));
          window.removeEventListener(KEYBOARD_EVENT_KEY_UP, (e) => this.keyboardKeyUp(e, channel));
      }
      ;
      /**
       * Handles the key down event from the keyboard.
       */
      keyboardKeyDown(message, channel = null) {
          if (KEY_CODE_MAP[message.code] != undefined) {
              if (this.keyboardKeyPressed[message.code] != true) {
                  this.keyboardKeyPressed[message.code] = true;
                  const newMessage = noteEvent(NOTE_ON_EVENT, KEY_CODE_MAP[message.code]);
                  if (newMessage && newMessage instanceof CustomMIDIMessageEvent) {
                      this.sendMidiMessage(newMessage, channel);
                  }
              }
          }
      }
      ;
      /**
       * Handles the key up event from the keyboard.
       */
      keyboardKeyUp(message, channel = null) {
          if (KEY_CODE_MAP[message.code] != undefined) {
              if (this.keyboardKeyPressed[message.code] == true) {
                  delete this.keyboardKeyPressed[message.code];
                  let newMessage = noteEvent(NOTE_OFF_EVENT, KEY_CODE_MAP[message.code]);
                  if (newMessage !== null) {
                      this.sendMidiMessage(newMessage, channel);
                  }
              }
          }
      }
      /**
       * Sends a MIDI message to the bound outputs.
       */
      send(messageType, value, velocity = 127, channel = null) {
          let message;
          switch (messageType) {
              case NOTE_ON_EVENT:
              case NOTE_OFF_EVENT:
                  message = noteEvent(messageType, value, velocity, this.key);
                  break;
              case CONTROLLER_EVENT:
                  message = ccEvent(value, velocity);
                  break;
              case PITCHWHEEL_EVENT:
                  message = pitchBendEvent(value);
                  break;
              default:
                  throw new Error("Unsupported MIDI message type");
          }
          this.sendMidiMessage(message, channel);
      }
      sendMidiMessage(message, channel = null) {
          if (channel != null) {
              message.data[0] = (message.data[0] & 0xF0) | ((channel - 1) & 0x0F);
          }
          this.boundOutputs.forEach((output) => {
              output.send(message.data, message.timeStamp);
          });
          if (this.loopback) {
              this.onMIDIMessage(message, this.key);
          }
      }
  }

  const TICK_INCREMENT = 0.25;
  const DEFAULT_LOOP_LENGTH = 16;
  const DEFAULT_TEMPO = 120;
  const TICK_LENGTH = 0.2;
  class Clock extends Events {
      constructor(context) {
          super();
          this.context = context || new window.AudioContext();
          this.BPM = DEFAULT_TEMPO;
          this.tick = 0;
          this.playing = false;
          this.loopIndex = 0;
          this.startClock = 0;
          this.index = 0;
          this.looplength = DEFAULT_LOOP_LENGTH;
          this.direction = 1;
          this.lastTick = 0;
      }
      reset() {
          this.index = 0;
          this.loopIndex = 0;
      }
      play(index = 0, loopIndex = 0) {
          this.tick = 0;
          this.startClock = this.context.currentTime + 0.005;
          this.index = index;
          this.loopIndex = loopIndex;
          this.playing = true;
          this.trigger("play", this.context.currentTime + 0.005);
          this.schedule();
      }
      stop() {
          this.trigger("stop");
          this.playing = false;
          if (this.tickSchedule) {
              clearTimeout(this.tickSchedule);
          }
      }
      schedule() {
          if (this.playing) {
              const playHead = this.context.currentTime - this.startClock;
              while (this.tick < playHead + TICK_LENGTH) {
                  const localPlayHead = this.tick + this.startClock;
                  this.process(this.index, this.loopIndex, localPlayHead, playHead);
                  this.next();
              }
              this.tickSchedule = setTimeout(() => this.schedule(), 0);
          }
      }
      process(index, loopIndex, localTime, globalTime) {
          const tick = {
              index,
              loopIndex,
              globalTime,
              localTime,
              lastTick: this.lastTick,
          };
          this.lastTick = globalTime;
          this.trigger("tick", tick);
      }
      next() {
          const beat = 60 / this.BPM;
          this.index++;
          this.loopIndex += this.direction;
          if (this.loopIndex > this.looplength - 1) {
              this.loopIndex = 0;
          }
          else if (this.loopIndex < 0) {
              this.loopIndex = this.looplength - 1;
          }
          this.tick += TICK_INCREMENT * beat;
      }
  }

  if (window.MIDIMessageEvent === undefined) {
      window.MIDIMessageEvent = MessageEvent;
  }
  class Mizzy extends MIDIEvents {
      constructor() {
          super();
          this.midiAccess = null;
          this.clock = new Clock();
      }
      initialize() {
          if (this.midiAccess === null) {
              if (navigator.requestMIDIAccess) {
                  return navigator.requestMIDIAccess({
                      sysex: false
                  }).then((e) => this.onMIDISuccess(e), (e) => this.onMIDIFailure(e));
              }
              else {
                  console.warn("[Mizzy] Your browser does not support Web MIDI API. You can still use the local loopback however.");
                  return new Promise((resolve) => {
                      setTimeout(function () {
                          resolve();
                      }, 50);
                  });
              }
          }
          return Promise.resolve();
      }
      get keys() {
          return ENHARMONIC_KEYS;
      }
      get type() {
          return {
              NOTE_ON_EVENT,
              NOTE_OFF_EVENT,
              PROGRAM_CHANGE_EVENT,
              CONTROLLER_EVENT,
              PITCHWHEEL_EVENT,
              AFTERTOUCH_EVENT,
          };
      }
      setKey(keyletter = "C") {
          this.key = ENHARMONIC_KEYS[ENHARMONIC_KEYS.indexOf(keyletter.toUpperCase())] || "C";
      }
      getMidiInputs() {
          return this.midiAccess?.inputs.values();
      }
      getMidiOutputs() {
          return this.midiAccess?.outputs.values();
      }
      get outputDevices() {
          const deviceArray = [];
          const devices = this.getMidiOutputs();
          if (devices) {
              for (let input = devices.next(); input && !input.done; input = devices.next()) {
                  deviceArray.push(input.value);
              }
          }
          return deviceArray;
      }
      get inputDevices() {
          const deviceArray = [];
          const devices = this.getMidiInputs();
          if (devices) {
              for (let input = devices.next(); input && !input.done; input = devices.next()) {
                  deviceArray.push(input.value);
              }
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
          const inputs = this.getMidiInputs();
          if (inputs) {
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
          const outputs = this.getMidiOutputs();
          if (outputs) {
              for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
                  this.bindToOutput(output.value);
              }
          }
      }
      onMIDIFailure(error) {
          throw error;
      }
      onMIDISuccess(midiAccessObj) {
          this.midiAccess = midiAccessObj;
      }
      panic() {
          for (let i = 0; i < 127; i++) {
              this.sendMidiMessage(noteEvent(NOTE_OFF_EVENT, i, 127));
          }
      }
  }

  return Mizzy;

}));
