import { MIDIMessage } from "./types";
type Note = string;
type Key = string;
export declare function analyzeNoteEvent(message: MIDIMessage, key?: Key, transpose?: number): {
    enharmonics: string[];
    note: string;
    inKey: boolean;
    value: number;
    velocity: number;
    frequency: number;
    channel: number;
};
export declare function analyzeCCEvent(message: MIDIMessage): {
    cc: number;
    value: number;
    ratio: number;
    polarRatio: number;
    channel: number;
};
export declare function analyzePitchWheelEvent(message: MIDIMessage): {
    cc: string;
    value: number;
    polar: number;
    polarRatio: number;
    channel: number;
};
export declare function analyzeMidiControlEvent(message: MIDIMessage): {
    cc: number;
    value: number;
    ratio: number;
    channel: number;
};
export declare function getNoteNames(noteNumber: number): Note[];
export declare function findNoteInKey(notes: Note[], key: Key): Note;
export declare function isNoteInKey(notes: Note[], key: Key): boolean;
export declare function isNoteNumberInKey(noteNumbers: number[], key: Key): boolean;
export declare function matchNoteInKey(note: Note, key: Key): boolean;
export {};
