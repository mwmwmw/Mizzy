import { WebMidi } from "./types";

import { MIDIEvent, MIDIProcessedEvent,  CCHandler, KeyToggleHandlers } from "./types";

import Events, { CustomMIDIMessageEvent } from "./events";
import { processNoteEvent, processCCEvent, processPitchWheelEvent, processMidiControlEvent, MIDIMessage } from "./dataprocess";
import { ccEvent, noteEvent, pitchBendEvent } from "./generate";

import {
  AFTERTOUCH_EVENT,
  CONTROLLER_EVENT,
  KEYBOARD_EVENT_KEY_DOWN,
  KEYBOARD_EVENT_KEY_UP,
  NOTE_OFF_EVENT,
  NOTE_ON_EVENT,
  PITCHWHEEL_EVENT,
  PROGRAM_CHANGE_EVENT,
  MIDI_AFTERTOUCH,
  MIDI_CONTROL_CHANGE,
  MIDI_NOTE_OFF,
  MIDI_NOTE_ON,
  MIDI_PITCHBEND,
  MIDI_PROGRAM_CHANGE,
  ENHARMONIC_KEYS,
  KEY_CODE_MAP
} from "./constants";



export default class MIDIEvents extends Events {
  protected keysPressed: { [key: string | number]: MIDIProcessedEvent };
  protected keyboardKeyPressed: { [key: string]: boolean };
  protected boundOutputs: WebMidi.MIDIOutput[];
  protected boundInputs: WebMidi.MIDIInput[];
  protected loopback: boolean;
  protected key: string;

  constructor() {
    super();
    this.keysPressed = {};
    this.keyboardKeyPressed = {};
	this.boundInputs = [];
	this.boundOutputs = [];
    this.loopback = true;
    this.key = ENHARMONIC_KEYS[0];
  }

  onMIDIMessage(message: MIDIEvent, key: string = ENHARMONIC_KEYS[0]): void {
    let eventName: string | null = null;
    let data: MIDIProcessedEvent | null = null;

    switch (message.data[0] & 0xF0) {
      case MIDI_NOTE_OFF:
        eventName = NOTE_OFF_EVENT;
        delete this.keysPressed[message.data[1].toString()];
        data = processNoteEvent(message, key);
        break;
      case MIDI_NOTE_ON:
        if (message.data[2] > 0) {
          eventName = NOTE_ON_EVENT;
        } else {
          eventName = NOTE_OFF_EVENT;
        }
        data = processNoteEvent(message, key);
        if (eventName === NOTE_ON_EVENT) {
          this.keysPressed[message.data[1].toString()] = data!;
        } else {
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
	onCC(cc: number | string, handler: CCHandler, channel: number | null = null) {
		if(channel == null) {
			return this.on(CONTROLLER_EVENT, (data: MIDIProcessedEvent) => {
				if (data.cc == cc) {
					handler(data);
				}
			});
		} else {
			return this.on(CONTROLLER_EVENT, (data: MIDIProcessedEvent) => {
				if (data.cc == cc && data.channel == channel) {
					handler(data);
				}
			});
		}
	}

  /**
   * Takes the CC# and Event handler and removes the event from the listeners.
   */
	removeCC(handler: CCHandler): boolean {
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
	keyToggle(keyDown: CCHandler, keyUp: CCHandler): KeyToggleHandlers {
		return {
			keyDown: this.on(NOTE_ON_EVENT, (data: MIDIProcessedEvent) => keyDown(data)) as (data: MIDIProcessedEvent) => void,
			keyUp: this.on(NOTE_OFF_EVENT, (data: MIDIProcessedEvent) => keyUp(data)) as (data: MIDIProcessedEvent) => void
		}
	};

  /**
   * Unbinds the keyToggle using the reference created from keyToggle()
   */
	removeKeyToggle(toggles: KeyToggleHandlers): void {
		this.off(NOTE_ON_EVENT, toggles.keyDown);
		this.off(NOTE_OFF_EVENT, toggles.keyUp);
	}

  /**
   * EZ binding for individual key values. Returns a reference to the handler created for this note.
   */
	pressNoteNumber(number: number, handler: CCHandler, channel: number | null = null) {
		if(channel == null) {
			return this.on(NOTE_ON_EVENT, (data: MIDIProcessedEvent) => {
				if (data.value == number) {
					handler(data);
				}
			});
		} else {
			return this.on(NOTE_ON_EVENT, (data: MIDIProcessedEvent) => {
				if (data.value == number && data.channel == channel) {
					handler(data);
				}
			});
		}
	};
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
	removePressNoteNumber(handler: CCHandler): boolean {
		return this.off(NOTE_ON_EVENT, handler);
	}
	// EZ binding for key values. Can only be unbound with unbindALL()
	releaseNoteNumber(number: number, handler: CCHandler, channel: number | null = null) {
		if(channel == null) {
			return this.on(NOTE_OFF_EVENT, (data: MIDIProcessedEvent) => {
				if (data.value == number) {
					handler(data);
				}
			});
		} else {
			return this.on(NOTE_OFF_EVENT, (data: MIDIProcessedEvent) => {
				if (data.value == number && data.channel == channel) {
					handler(data);
				}
			});
		}
	};
	removeReleaseNoteNumber(handler: CCHandler): boolean {
		return this.off(NOTE_OFF_EVENT, handler);
	}

  /**
   * Bind keyboard splits.
   */
	keyToggleRange(
		min: number,
		max: number,
		onHandler: CCHandler,
		offHandler: CCHandler,
		channel: number | null = null
	) {
		return {
			press: this.onSplit(min, max, onHandler, channel),
			release: this.offSplit(min, max, offHandler, channel)
		}
	};

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
	onSplit(min: number, max: number, onHandler: CCHandler, channel: number | null = null) {
		let on: Function[] = [];
		if (max > min) {
			for (let i = min; i <= max; i++) {
				on.push(this.pressNoteNumber(i, onHandler, channel));
			}
		} else {
			for (let i = max; i >= min; i--) {
				on.push(this.pressNoteNumber(i, onHandler, channel));
			}
		}
		return on;
	};

	/**
	 * Binds a handler to a range of MIDI note numbers for note off events.
	 */
	offSplit(min: number, max: number, offHandler: CCHandler, channel: number | null = null) {
		let off: Function[] = [];
		if (max > min) {
			for (let i = min; i <= max; i++) {
				off.push(this.releaseNoteNumber(i, offHandler, channel));
			}
		} else {
			for (let i = max; i >= min; i--) {
				off.push(this.releaseNoteNumber(i, offHandler, channel));
			}
		}
		return off;
	};

	/**
	 * Removes all bound handlers for a range of MIDI note numbers.
	 */
	removeKeyToggleRange(ranges: { press: Function[], release: Function[] }): boolean {
		const removeOnRanges = ranges.press.every((noteHandler: Function) => 
			this.removePressNoteNumber(noteHandler as CCHandler));
		const removeOffRanges = ranges.release.every((noteHandler: Function) => 
			this.removeReleaseNoteNumber(noteHandler as CCHandler));
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
	};

  /**
   * Bind the computer (qwerty) keyboard to allow it to generate MIDI note on and note off messages.
   */
	bindKeyboard(channel: number | null = null): void {
		window.addEventListener(KEYBOARD_EVENT_KEY_DOWN, (e) => this.keyboardKeyDown(e, channel));
		window.addEventListener(KEYBOARD_EVENT_KEY_UP, (e) => this.keyboardKeyUp(e, channel));
	};

	/**
	 * Removes the keyboard event listeners.
	 */
	unBindKeyboard(channel: number | null = null): void {
		window.removeEventListener(KEYBOARD_EVENT_KEY_DOWN, (e) => this.keyboardKeyDown(e, channel));
		window.removeEventListener(KEYBOARD_EVENT_KEY_UP, (e) => this.keyboardKeyUp(e, channel));
	};

	/**
	 * Handles the key down event from the keyboard.
	 */
	keyboardKeyDown(message: KeyboardEvent, channel: number | null = null): void {
		if (KEY_CODE_MAP[message.code] != undefined) {
			if (this.keyboardKeyPressed[message.code] != true) {
				this.keyboardKeyPressed[message.code] = true;
				const newMessage = noteEvent(NOTE_ON_EVENT, KEY_CODE_MAP[message.code]);
				if (newMessage && newMessage instanceof CustomMIDIMessageEvent) {
					this.sendMidiMessage(newMessage, channel);
				}
			}
		}
	};

	/**
	 * Handles the key up event from the keyboard.
	 */
	keyboardKeyUp(message: KeyboardEvent, channel: number | null = null): void {
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
	send(messageType: string, value: number, velocity: number = 127, channel: number | null = null): void {
		let message: MIDIMessage;
		switch(messageType) {
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

	sendMidiMessage(message: MIDIMessage, channel: number | null = null): void {
		if(channel != null) {
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