import { GLOBAL_TUNE, MIDI_14BIT_MAX_VALUE, MIDI_MAX_VALUE } from "./constants";
import { noteOn, noteOff, cc, pitchBend, afterTouch, channelPressure, programChange, sysex } from "./generate";
export function messageToBytes(msg) {
    // Convert structured message back to bytes
    switch (msg.type) {
        case "noteon":
            return noteOn(msg.note ?? 60, msg.velocity ?? 64, msg.channel ?? 0);
        case "noteoff":
            return noteOff(msg.note ?? 60, msg.velocity ?? 64, msg.channel ?? 0);
        case "cc":
            return cc(msg.controller ?? 0, msg.value ?? 0, msg.channel ?? 0);
        case "pitchbend":
            return pitchBend(msg.value ?? 0, msg.channel ?? 0);
        case "aftertouch":
            return afterTouch(msg.note ?? 60, msg.value ?? 0, msg.channel ?? 0);
        case "channelpressure":
            return channelPressure(msg.value ?? 0, msg.channel ?? 0);
        case "program":
            return programChange(msg.value ?? 0, msg.channel ?? 0);
        case "sysex":
            return sysex(msg.data);
        default:
            return sysex(new Uint8Array([]));
    }
}
export function midiNoteToFrequency(midinote, tune = GLOBAL_TUNE) {
    return tune * Math.pow(2, (midinote - 69) / 12);
}
export function frequencyToMIDINote(frequency, tune = GLOBAL_TUNE) {
    const midiNote = Math.round(12 * Math.log2(frequency / tune) + 69);
    const exactFreq = midiNoteToFrequency(midiNote, tune);
    const cents = 1200 * Math.log2(frequency / exactFreq);
    const pitchBendValue = Math.round((cents / 100) * (MIDI_14BIT_MAX_VALUE / 24));
    const [lsb, msb] = numberToLsbMsb(pitchBendValue);
    return {
        note: midiNote,
        pitchBend: [lsb, msb]
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
export function msbLsbToNumber(msb, lsb) {
    return (msb << 7) | lsb;
}
export function numberToLsbMsb(value) {
    const msb = (value >> 7) & 0x7F;
    const lsb = value & 0x7F;
    return [lsb, msb];
}
//# sourceMappingURL=convert.js.map