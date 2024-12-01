const GLOBAL_TUNE = 440;
const MIDI_14BIT_MAX_VALUE = 16384;
const MIDI_MAX_VALUE = 127;

export default class Convert {

	static MIDINoteToFrequency(midinote, tune = GLOBAL_TUNE) {
		return tune * Math.pow(2, (midinote - 69) / 12);
	}

	static FrequencyToMIDINote(frequency, tune = GLOBAL_TUNE) {
		// Calculate the MIDI note number
		const midiNote = Math.round(12 * Math.log2(frequency / tune) + 69);
		// Calculate the exact fequency for this MIDI note
		const exactFreq = tune * Math.pow(2, (midiNote - 69) / 12);
		// Calculate cents difference
		const cents = 1200 * Math.log2(frequency / exactFreq);
		// Convert cents to pitch bend value (14-bit, -8192 to +8191)
		const pitchBendValue = Math.round((cents / 100) * (MIDI_14BIT_MAX_VALUE / 24));
		// Convert to 4-digit hex
		const hexValue = (pitchBendValue & 0xFFFF).toString(16).padStart(4, '0').toUpperCase();
		return {
			note: midiNote,
			pitchBend: hexValue
		};
	}

	static PitchWheelToPolar (raw) {
		return -((MIDI_14BIT_MAX_VALUE * 0.5) - raw);
	}

	static PitchWheelToPolarRatio (raw) {
		return Convert.PitchWheelToPolar(raw) / (MIDI_14BIT_MAX_VALUE * 0.5)
	}

	static MidiValueToRatio (value) {
		return value / MIDI_MAX_VALUE;
	}

	static MidiValueToPolarRatio (value) {
		let halfmax = (MIDI_MAX_VALUE * 0.5);
		return -(halfmax - value) / halfmax;
	}

	static MidiChannel (value) {
		return (value & 0x0F) + 1;
	}

}
