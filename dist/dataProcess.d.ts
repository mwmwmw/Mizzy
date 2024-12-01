import { CustomMIDIMessageEvent } from "./events";
export interface MIDIMessage extends CustomMIDIMessageEvent {
    data: Uint8Array;
    enharmonics?: Note[];
    note?: Note;
    inKey?: boolean;
    velocity?: number;
    frequency?: number;
    cc?: number | string;
    value?: number;
    ratio?: number;
    polarRatio?: number;
}
type Note = string;
type Key = string;
export declare function processNoteEvent(message: MIDIMessage, key?: Key, transpose?: number): MIDIMessage;
export declare function processCCEvent(message: MIDIMessage, ccNameOverride?: number | string): MIDIMessage;
export declare function processPitchWheelEvent(message: MIDIMessage): MIDIMessage;
export declare function processMidiControlEvent(message: MIDIMessage, controlName: string): MIDIMessage;
export declare function getNoteNames(noteNumber: number): Note[];
export declare function findNoteInKey(notes: Note[], key: Key): Note;
export declare function isNoteInKey(notes: Note[], key: Key): boolean;
export declare function matchNoteInKey(note: Note, key: Key): boolean;
export {};
