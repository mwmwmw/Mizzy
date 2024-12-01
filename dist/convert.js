const GLOBAL_TUNE = 440;
const MIDI_14BIT_MAX_VALUE = 16384;
const MIDI_MAX_VALUE = 127;
export function midiNoteToFrequency(midinote, tune = GLOBAL_TUNE) {
    return tune * Math.pow(2, (midinote - 69) / 12);
}
export function frequencyToMIDINote(frequency, tune = GLOBAL_TUNE) {
    const midiNote = Math.round(12 * Math.log2(frequency / tune) + 69);
    const exactFreq = tune * Math.pow(2, (midiNote - 69) / 12);
    const cents = 1200 * Math.log2(frequency / exactFreq);
    const pitchBendValue = Math.round((cents / 100) * (MIDI_14BIT_MAX_VALUE / 24));
    const hexValue = (pitchBendValue & 0xFFFF).toString(16).padStart(4, '0').toUpperCase();
    return {
        note: midiNote,
        pitchBend: hexValue
    };
}
export function pitchWheelToPolar(raw) {
    return -((MIDI_14BIT_MAX_VALUE * 0.5) - raw);
}
export function pitchWheelToPolarRatio(raw) {
    return pitchWheelToPolar(raw) / (MIDI_14BIT_MAX_VALUE * 0.5);
}
export function midiValueToRatio(value) {
    return value / MIDI_MAX_VALUE;
}
export function midiValueToPolarRatio(value) {
    const halfmax = (MIDI_MAX_VALUE * 0.5);
    return -(halfmax - value) / halfmax;
}
export function midiChannel(value) {
    return (value & 0x0F) + 1;
}
//# sourceMappingURL=convert.js.map