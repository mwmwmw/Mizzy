import DataProcess from "./DataProcess";
import {
	MIDI_AFTERTOUCH,
	MIDI_CHANNEL_PRESSURE,
	MIDI_CONTROL_CHANGE,
	MIDI_MESSAGE_EVENT,
	MIDI_NOTE_OFF,
	MIDI_NOTE_ON,
	MIDI_PITCHBEND,
	MIDI_PROGRAM_CHANGE,
	NOTE_OFF_EVENT,
	NOTE_ON_EVENT,
	CONTROLLER_EVENT,
	PITCHWHEEL_EVENT
} from "./Constants";

export default class Generate {

	static NoteOn(noteNumber, velocity) {
		return new Uint8Array([MIDI_NOTE_ON, noteNumber, velocity]);
	}

	static NoteOff(noteNumber, velocity) {
		return new Uint8Array([MIDI_NOTE_OFF, noteNumber, velocity]);
	}

	static AfterTouch(noteNumber, value) {
		return new Uint8Array([MIDI_AFTERTOUCH, noteNumber, value]);
	}

	static CC(controller, value) {
		return new Uint8Array([MIDI_CONTROL_CHANGE, controller, value]);
	}

	static ProgramChange(instrument) {
		return new Uint8Array([MIDI_PROGRAM_CHANGE, instrument]);
	}

	static ChannelPressure(pressure) {
		return new Uint8Array([MIDI_CHANNEL_PRESSURE, pressure]);
	}

	static PitchBend(value) {
		var msb = 0,
			lsb = 0;
		return new Uint8Array([MIDI_PITCHBEND, msb, lsb]);
	}

	static MidiEvent (data, key) {

		const message = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, {"data": data}) || {"data": data};

		switch (data[0] & 0xF0) {
			case MIDI_NOTE_ON:
				return DataProcess.NoteEvent(message, key);
				break;
			case MIDI_NOTE_OFF:
				return DataProcess.NoteEvent(message, key);
				break;
			case MIDI_CONTROL_CHANGE:
				return DataProcess.CCEvent(message);
				break;
			case MIDI_PITCHBEND:
				return DataProcess.PitchWheelEvent(message);
				break;
			case MIDI_AFTERTOUCH:
				return DataProcess.MidiControlEvent(message, AFTERTOUCH_EVENT);
				break;
			case MIDI_PROGRAM_CHANGE:
				return DataProcess.MidiControlEvent(message, PROGRAM_CHANGE_EVENT);
				break;
		}

	}

	static NoteEvent(messageType, value, velocity = 127) {
		let data = null;
		switch (messageType) {
			case NOTE_ON_EVENT:
				data = Generate.NoteOn(value, velocity);
				break;
			case NOTE_OFF_EVENT:
				data = Generate.NoteOff(value, velocity);
				break;
		}
		const newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, {"data": data}) || {"data": data};
		return DataProcess.NoteEvent(newMessage, this.key);
	}

	static CCEvent(cc, value) {
		let data = Generate.CC(cc, value);
		const newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, {"data": data});
		return DataProcess.CCEvent(newMessage);
	}

	static PitchBendEvent(value) {
		let data = Generate.PitchBend(value);
		const newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, {"data": data});
		return DataProcess.CCEvent(newMessage);
	}
}
