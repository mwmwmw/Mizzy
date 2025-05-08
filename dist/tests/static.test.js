import { midiNoteToFrequency, messageToBytes } from "../convert";
import { isNoteInKey, findNoteInKey } from "../process";
import { hasAllValues, getMIDINoteName, getRepeatingNoteSequence, getNoteSequence, pitchBend, getRepeatingNoteSequenceRaw, hasAllNoteValues, getNoteSequenceWithNames, getEnharmonicKeyName } from '../generate';
import { noteOn, noteOff, afterTouch, cc, programChange, channelPressure, sysex, } from '../generate';
import { MIDI_NOTE_ON, MIDI_NOTE_OFF, MIDI_AFTERTOUCH, MIDI_CONTROL_CHANGE, MIDI_PROGRAM_CHANGE, MIDI_CHANNEL_PRESSURE, MIDI_SYSEX, MIDI_SYSEX_END, MIDI_PITCHBEND, NOTE_NAMES, } from '../constants';
describe('MIDI Message Generators', () => {
    describe('noteOn', () => {
        it('should generate correct note on message', () => {
            expect(noteOn(60, 100)).toEqual([MIDI_NOTE_ON, 60, 100]);
        });
        it('should handle different channels', () => {
            expect(noteOn(60, 100, 5)).toEqual([MIDI_NOTE_ON + 5, 60, 100]);
        });
    });
    describe('noteOff', () => {
        it('should generate correct note off message', () => {
            expect(noteOff(60, 0)).toEqual([MIDI_NOTE_OFF, 60, 0]);
        });
        it('should handle different channels', () => {
            expect(noteOff(60, 0, 5)).toEqual([MIDI_NOTE_OFF + 5, 60, 0]);
        });
    });
    describe('afterTouch', () => {
        it('should generate correct aftertouch message', () => {
            expect(afterTouch(60, 100)).toEqual([MIDI_AFTERTOUCH, 60, 100]);
        });
        it('should handle different channels', () => {
            expect(afterTouch(60, 100, 5)).toEqual([MIDI_AFTERTOUCH + 5, 60, 100]);
        });
    });
    describe('cc', () => {
        it('should generate correct control change message', () => {
            expect(cc(7, 100)).toEqual([MIDI_CONTROL_CHANGE, 7, 100]);
        });
        it('should handle different channels', () => {
            expect(cc(7, 100, 5)).toEqual([MIDI_CONTROL_CHANGE + 5, 7, 100]);
        });
    });
    describe('programChange', () => {
        it('should generate correct program change message', () => {
            expect(programChange(5)).toEqual([MIDI_PROGRAM_CHANGE, 5]);
        });
        it('should handle different channels', () => {
            expect(programChange(5, 3)).toEqual([MIDI_PROGRAM_CHANGE + 3, 5]);
        });
    });
    describe('channelPressure', () => {
        it('should generate correct channel pressure message', () => {
            expect(channelPressure(100)).toEqual([MIDI_CHANNEL_PRESSURE, 100]);
        });
        it('should handle different channels', () => {
            expect(channelPressure(100, 5)).toEqual([MIDI_CHANNEL_PRESSURE + 5, 100]);
        });
    });
    describe('sysex', () => {
        it('should generate correct sysex message', () => {
            const data = new Uint8Array([1, 2, 3]);
            expect(sysex(data)).toEqual([MIDI_SYSEX, 1, 2, 3, MIDI_SYSEX_END]);
        });
    });
    describe('pitchBend', () => {
        it('should generate correct pitch bend message for center position', () => {
            expect(pitchBend(0)).toEqual([MIDI_PITCHBEND, 0x00, 0x40]); // 8192 (0x2000)
        });
        it('should generate correct pitch bend message for maximum', () => {
            expect(pitchBend(1)).toEqual([MIDI_PITCHBEND, 0x7F, 0x7F]); // 16383 (0x3FFF)
        });
        it('should generate correct pitch bend message for minimum', () => {
            expect(pitchBend(-1)).toEqual([MIDI_PITCHBEND, 0x01, 0x00]); // 0
        });
        it('should handle different channels', () => {
            expect(pitchBend(0, 5)).toEqual([MIDI_PITCHBEND + 5, 0x00, 0x40]);
        });
        it('should clamp values outside -1 to 1 range', () => {
            expect(pitchBend(1.5)).toEqual([MIDI_PITCHBEND, 0x7F, 0x7F]);
            expect(pitchBend(-1.5)).toEqual([MIDI_PITCHBEND, 0x01, 0x00]);
        });
    });
});
describe("MIDI Note Conversions", () => {
    test("midiNoteToFrequency converts correctly", () => {
        expect(midiNoteToFrequency(69, 440)).toBe(440); // A4
        expect(midiNoteToFrequency(60, 440)).toBeCloseTo(261.63); // Middle C
        expect(midiNoteToFrequency(81, 440)).toBeCloseTo(880); // A5
    });
    test("getMIDINoteName returns correct note names", () => {
        expect(getMIDINoteName(60)).toBe("C");
        expect(getMIDINoteName(69)).toBe("A");
        expect(getMIDINoteName(71)).toBe("B");
    });
});
describe("Note Sequences", () => {
    test("getRepeatingNoteSequence generates correct sequences", () => {
        // Test perfect fifth sequence starting from C
        expect(getRepeatingNoteSequence(60 - 12, 7).length).toEqual(12);
        // Test major third sequence
        expect(getRepeatingNoteSequence(60, 4).length).toEqual(3);
        expect(getRepeatingNoteSequence(60, 5).length).toEqual(12);
        expect(getRepeatingNoteSequence(60, 6).length).toEqual(2);
        expect(getRepeatingNoteSequence(345355, 6).length).toEqual(0);
    });
    test("getNoteSequence generates correct ascending sequences", () => {
        expect(getNoteSequence(60, 2)).toEqual([
            60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94,
            96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124,
            126,
        ]);
    });
});
describe("MIDI Message Conversion", () => {
    test("messageToBytes converts note on message", () => {
        const message = {
            type: "noteon",
            note: 60,
            velocity: 64,
            channel: 0,
            data: new Uint8Array([]),
        };
        expect(messageToBytes(message)).toEqual([0x90, 60, 64]);
    });
    test("messageToBytes converts control change message", () => {
        const message = {
            type: "cc",
            controller: 7,
            value: 100,
            channel: 0,
            data: new Uint8Array([]),
        };
        expect(messageToBytes(message)).toEqual([0xb0, 7, 100]);
    });
});
describe("Musical Key Functions", () => {
    test("isNoteInKey correctly identifies notes in keys", () => {
        expect(isNoteInKey(["C"], "C")).toBe(true);
        expect(isNoteInKey(["F#"], "C")).toBe(false);
    });
    test("findNoteInKey returns correct note from options", () => {
        expect(findNoteInKey(["C", "C#"], "C")).toBe("C");
        expect(findNoteInKey(["C#", "G"], "G")).toBe("G");
    });
});
describe('MIDI Note Generation Functions', () => {
    describe('getMIDINoteName', () => {
        test('returns correct note names', () => {
            expect(getMIDINoteName(60)).toBe(NOTE_NAMES[0]); // Middle C
            expect(getMIDINoteName(61)).toBe(NOTE_NAMES[1]);
            expect(getMIDINoteName(69)).toBe(NOTE_NAMES[9]); // A440
            expect(getMIDINoteName(72)).toBe(NOTE_NAMES[0]); // One octave up from middle C
        });
        test('handles notes across different octaves', () => {
            expect(getMIDINoteName(0)).toBe('C'); // Lowest C
            expect(getMIDINoteName(127)).toBe('G'); // Highest note
        });
    });
    describe('getNoteSequence', () => {
        test('generates correct sequence with positive interval', () => {
            expect(getNoteSequence(60, 2)).toEqual([60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126]);
        });
        test('handles sequence starting near upper limit', () => {
            expect(getNoteSequence(126, 2)).toEqual([126]);
        });
        test('returns empty array if start note is above 127', () => {
            expect(getNoteSequence(128, 2)).toEqual([]);
        });
    });
    describe('getRepeatingNoteSequenceRaw', () => {
        test('generates sequence up to 127', () => {
            const result = getRepeatingNoteSequenceRaw(0, 4);
            expect(result[0]).toBe(0);
            expect(result[result.length - 1]).toBeLessThanOrEqual(127);
        });
        test('maintains correct interval', () => {
            const result = getRepeatingNoteSequenceRaw(0, 3);
            for (let i = 1; i < result.length; i++) {
                expect(result[i] - result[i - 1]).toBe(3);
            }
        });
    });
    describe('hasAllValues', () => {
        test('correctly identifies when all values are present', () => {
            const arrays = [[0, 1, 2], [3, 4, 5]];
            expect(hasAllValues(arrays, 0, 5)).toBe(true);
            expect(hasAllValues(arrays, 0, 6)).toBe(false);
        });
        test('handles empty arrays', () => {
            expect(hasAllValues([], 0, 5)).toBe(false);
        });
    });
    describe('hasAllNoteValues', () => {
        test('correctly identifies when all note names are present', () => {
            const arrays = [[60, 61, 62], [63, 64, 65]]; // C, C#, D, D#, E, F
            expect(hasAllNoteValues(arrays, 60, 65)).toBe(true);
            expect(hasAllNoteValues(arrays, 60, 66)).toBe(false);
        });
        test('handles octave wrapping', () => {
            const arrays = [[60, 72]]; // Both are C notes
            expect(hasAllNoteValues(arrays, 60, 72)).toBe(false); // Missing notes in between
        });
    });
    describe('getNoteSequenceWithNames', () => {
        test('generates valid circles and names', () => {
            const result = getNoteSequenceWithNames(4);
            expect(result).toHaveProperty('circles');
            expect(result).toHaveProperty('names');
            expect(Array.isArray(result.circles)).toBe(true);
            expect(Array.isArray(result.names)).toBe(true);
        });
        test('circles contain valid MIDI note numbers', () => {
            const result = getNoteSequenceWithNames(3);
            result.circles.forEach(circle => {
                circle.forEach(note => {
                    expect(note).toBeGreaterThanOrEqual(0);
                    expect(note).toBeLessThanOrEqual(127);
                });
            });
        });
    });
    describe('getEnharmonicKeyName', () => {
        test('returns basic note names correctly', () => {
            expect(getEnharmonicKeyName(60, 'C')).toBe('C'); // Middle C
            expect(getEnharmonicKeyName(69, 'C')).toBe('A'); // A440
        });
        test('handles enharmonic equivalents based on key', () => {
            // C# vs Db (MIDI note 61)
            expect(getEnharmonicKeyName(61, 'Db')).toBe('Db');
            expect(getEnharmonicKeyName(61, 'C#')).toBe('C#');
            // F# vs Gb (MIDI note 66)
            expect(getEnharmonicKeyName(66, 'Gb')).toBe('Gb');
            expect(getEnharmonicKeyName(66, 'F#')).toBe('F#');
        });
        test('returns natural notes unchanged regardless of key', () => {
            // Natural notes should remain the same regardless of key
            expect(getEnharmonicKeyName(60, 'F#')).toBe('C'); // C remains C
            expect(getEnharmonicKeyName(64, 'Gb')).toBe('E'); // E remains E
        });
        test('falls back to first possible name for non-enharmonic keys', () => {
            // When key is not in ENHARMONIC_KEYS, should return first possible name
            expect(getEnharmonicKeyName(60, 'C')).toBe("C");
            expect(getEnharmonicKeyName(61, 'G')).toBe("C#");
            expect(getEnharmonicKeyName(63, 'A')).toBe("D#");
        });
        test('handles edge cases', () => {
            // Test with notes at the extremes
            expect(getEnharmonicKeyName(0, 'C')).toBe('C'); // Lowest C
            expect(getEnharmonicKeyName(127, 'C')).toBe('G'); // Highest G
            // Test with invalid key (should default to first possible name)
            expect(getEnharmonicKeyName(61, 'InvalidKey')).toBe("C#");
        });
    });
});
//# sourceMappingURL=static.test.js.map