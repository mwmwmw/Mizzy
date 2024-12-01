import { KeyCodeMap, NoteMap } from './types';
export declare const MIDI_NOTE_ON = 144;
export declare const MIDI_NOTE_OFF = 128;
export declare const MIDI_AFTERTOUCH = 160;
export declare const MIDI_CONTROL_CHANGE = 176;
export declare const MIDI_PROGRAM_CHANGE = 192;
export declare const MIDI_CHANNEL_PRESSURE = 208;
export declare const MIDI_PITCHBEND = 224;
export declare const MIDI_MESSAGE_EVENT = "midimessage";
export declare const NOTE_ON_EVENT = "NoteOn";
export declare const NOTE_OFF_EVENT = "NoteOff";
export declare const PITCHWHEEL_EVENT = "PitchWheel";
export declare const CONTROLLER_EVENT = "Controller";
export declare const PROGRAM_CHANGE_EVENT = "ProgramChange";
export declare const AFTERTOUCH_EVENT = "Aftertouch";
export declare const KEYBOARD_EVENT_KEY_DOWN = "keydown";
export declare const KEYBOARD_EVENT_KEY_UP = "keyup";
export declare const ENHARMONIC_KEYS: string[];
export declare const MIDI_NOTE_MAP: NoteMap;
export interface AccidentalMap {
    [key: string]: string;
}
export declare const ACCIDENTALS: AccidentalMap;
export interface KeyNoteMap {
    [key: string]: string[];
}
export declare const KEY_NOTE_ARRAYS: KeyNoteMap;
export interface IntervalMap {
    [key: string]: number;
}
export declare const INTERVALS: IntervalMap;
export declare const KEY_CODE_MAP: KeyCodeMap;
export declare const NOTE_NAMES: string[];
