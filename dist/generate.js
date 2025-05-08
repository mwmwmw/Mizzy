import { MIDI_AFTERTOUCH, MIDI_CHANNEL_PRESSURE, MIDI_CONTROL_CHANGE, MIDI_NOTE_OFF, MIDI_NOTE_ON, MIDI_PITCHBEND, MIDI_PROGRAM_CHANGE, NOTE_NAMES, MIDI_SYSEX, MIDI_SYSEX_END, ENHARMONIC_KEYS, ACCIDENTALS, MIDI_NOTE_MAP, CHORDS, } from "./constants";
import { isNoteNumberInKey } from "./process";
export function noteOn(noteNumber, velocity, channel = 0) {
    return [MIDI_NOTE_ON + channel, noteNumber, velocity];
}
export function noteOff(noteNumber, velocity, channel = 0) {
    return [MIDI_NOTE_OFF + channel, noteNumber, velocity];
}
export function afterTouch(noteNumber, value, channel = 0) {
    return [MIDI_AFTERTOUCH + channel, noteNumber, value];
}
export function cc(controller, value, channel = 0) {
    return [MIDI_CONTROL_CHANGE + channel, controller, value];
}
export function programChange(instrument, channel = 0) {
    return [MIDI_PROGRAM_CHANGE + channel, instrument];
}
export function channelPressure(pressure, channel = 0) {
    return [MIDI_CHANNEL_PRESSURE + channel, pressure];
}
export function sysex(data) {
    return [MIDI_SYSEX, ...data, MIDI_SYSEX_END];
}
export function pitchBend(value, channel = 0) {
    // Clamp input value between -1 and 1
    value = Math.max(-1, Math.min(1, value));
    // Convert from [-1, 1] to [0, 16383] with 8192 as center
    const normalized = Math.round(8192 + (value * 8191));
    // Split into MSB and LSB (7 bits each)
    const msb = (normalized >> 7) & 0x7F;
    const lsb = normalized & 0x7F;
    return [MIDI_PITCHBEND + channel, lsb, msb];
}
export const getRepeatingNoteSequence = (startNote, interval) => {
    if (interval === 0)
        return [];
    if (startNote > 127)
        return [];
    const sequence = [];
    let currentNote = startNote;
    sequence.push(currentNote);
    currentNote += interval;
    while (currentNote <= 127) {
        sequence.push(currentNote);
        currentNote += interval;
        if (currentNote > startNote && (currentNote % 12) === (startNote % 12)) {
            break;
        }
    }
    return sequence;
};
export const hasAllValues = (arrays, startValue, endValue) => {
    const flatArray = arrays.flat();
    for (let i = startValue; i <= endValue; i++) {
        if (!flatArray.includes(i)) {
            return false;
        }
    }
    return true;
};
export const getMIDINoteName = (midiNoteNumber) => {
    const noteIndex = midiNoteNumber % 12;
    return NOTE_NAMES[noteIndex];
};
export function getEnharmonicKeyName(midiNote, key) {
    // Get note name from MIDI note number (0-11)
    const noteIndex = midiNote;
    // Get all possible note names for this index from MIDI_NOTE_MAP
    const possibleNames = Object.entries(MIDI_NOTE_MAP).filter(([_, values]) => values.includes(noteIndex)).map(([name]) => name);
    // If the key is in ENHARMONIC_KEYS, prefer accidentals matching that key's convention
    if (ENHARMONIC_KEYS.includes(key)) {
        const keyAccidental = ACCIDENTALS[key];
        const matchingName = possibleNames.find(name => name.includes(keyAccidental) || name.length === 1);
        if (matchingName)
            return matchingName;
    }
    // Default to first possible name if no match found
    return possibleNames[0];
}
export const getNoteSequence = (startNote, interval) => {
    const sequence = [];
    let currentNote = startNote;
    while (currentNote <= 127) {
        sequence.push(currentNote);
        currentNote += interval;
    }
    return sequence;
};
export const getRepeatingNoteSequenceRaw = (startNote, interval) => {
    const sequence = [];
    let currentNote = startNote;
    // Keep adding notes until we reach 128
    while (currentNote <= 127) {
        sequence.push(currentNote);
        currentNote += interval;
    }
    return sequence;
};
export const hasAllNoteValues = (arrays, startValue, endValue) => {
    // Flatten all arrays into a single array and convert to note names
    const flatArray = arrays.flat().map(getMIDINoteName);
    // Get note names for range
    const expectedNotes = [];
    for (let i = startValue; i <= endValue; i++) {
        expectedNotes.push(getMIDINoteName(i));
    }
    // Check if each note name exists
    for (const noteName of expectedNotes) {
        if (!flatArray.includes(noteName)) {
            return false;
        }
    }
    return true;
};
export function getNoteSequenceWithNames(interval) {
    let circles = [];
    let names = [];
    let seq = [];
    let i = 0;
    while (!hasAllValues(circles, 0, 127)) {
        const sequence = getRepeatingNoteSequenceRaw(0 + i, interval);
        circles.push(sequence);
        i++;
    }
    while (!hasAllNoteValues(seq, 0, 24)) {
        const sequence = getRepeatingNoteSequence(0 + i, interval);
        const nameSequence = sequence.map(getMIDINoteName);
        seq.push(sequence);
        names.push(nameSequence);
        i++;
    }
    return {
        circles,
        names
    };
}
export function getChordsForNote(note, key) {
    const suggestions = [];
    const noteInKey = note % 12; // Normalize to single octave
    // Check each chord definition
    for (const [chordName, intervals] of Object.entries(CHORDS)) {
        // For each interval in the chord, check if it could be the root
        intervals.forEach((interval) => {
            const potentialRoot = (noteInKey - interval + 12) % 12;
            // If this note could be part of this chord, add it to suggestions
            if (isNoteNumberInKey([potentialRoot], key)) {
                suggestions.push({
                    name: `${NOTE_NAMES[potentialRoot]} ${chordName}`,
                    intervals: intervals
                });
            }
        });
    }
    return suggestions;
}
//# sourceMappingURL=generate.js.map