import { ChordSuggestion } from "./types";
export declare function noteOn(noteNumber: number, velocity: number, channel?: number): number[];
export declare function noteOff(noteNumber: number, velocity: number, channel?: number): number[];
export declare function afterTouch(noteNumber: number, value: number, channel?: number): number[];
export declare function cc(controller: number, value: number, channel?: number): number[];
export declare function programChange(instrument: number, channel?: number): number[];
export declare function channelPressure(pressure: number, channel?: number): number[];
export declare function sysex(data: Uint8Array): number[];
export declare function pitchBend(value: number, channel?: number): number[];
export declare const getRepeatingNoteSequence: (startNote: number, interval: number) => number[];
export declare const hasAllValues: (arrays: number[][], startValue: number, endValue: number) => boolean;
export declare const getMIDINoteName: (midiNoteNumber: number) => string;
export declare function getEnharmonicKeyName(midiNote: number, key: string): string;
export declare const getNoteSequence: (startNote: number, interval: number) => number[];
export declare const getRepeatingNoteSequenceRaw: (startNote: number, interval: number) => number[];
export declare const hasAllNoteValues: (arrays: number[][], startValue: number, endValue: number) => boolean;
export declare function getNoteSequenceWithNames(interval: number): {
    circles: number[][];
    names: string[][];
};
export declare function getChordsForNote(note: number, key: string): ChordSuggestion[];
