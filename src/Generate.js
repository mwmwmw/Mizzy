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
	NOTE_ON_EVENT
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

	static ControlChange(controller, value) {
		return new Uint8Array([MIDI_CONTROL_CHANGE, controller, value]);
	}

	static ProgramChange(instrument) {
		return new Uint8Array([MIDI_PROGRAM_CHANGE, instrument]);
	}

	static ChannelPressure(pressure) {
		return new Uint8Array([MIDI_CHANNEL_PRESSURE, pressure]);
	}

	static PitchBend(value) {
		// @todo http://stackoverflow.com/questions/30911185/javascript-reading-3-bytes-buffer-as-an-integer
		var msb = 1,
			lsb = 1;
		return new Uint8Array([MIDI_PITCHBEND, msb, lsb]);
	}

	static FakeMessage(messageType, value) {
		let data = null;
		switch (messageType) {
			case NOTE_ON_EVENT:
				data = Generate.NoteOn(value, 127);
				break;
			case NOTE_OFF_EVENT:
				data = Generate.NoteOff(value, 127);
				break;
		}
		const newMessage = new MIDIMessageEvent(MIDI_MESSAGE_EVENT, {"data": data}) || {"data": data};
		return DataProcess.NoteEvent(newMessage, messageType, this.key);
	}
}
