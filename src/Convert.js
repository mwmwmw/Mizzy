const GLOBAL_TUNE = 440;
const MIDI_14BIT_MAX_VALUE = 16384;
const MIDI_MAX_VALUE = 127;

export default class Convert {

	static MIDINoteToFrequency(midinote, tune = GLOBAL_TUNE) {
		return tune * Math.pow(2, (midinote - 69) / 12); //
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
