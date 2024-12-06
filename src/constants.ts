import { KeyCodeMap, NoteMap, AccidentalMap, KeyNoteMap, IntervalMap } from './types';

export const GLOBAL_TUNE = 440;
export const MIDI_14BIT_MAX_VALUE = 16383;
export const MIDI_14BIT_HALF_MAX_VALUE = 8192;
export const MIDI_MAX_VALUE = 127;

export const STATUS_TYPE_MAP = {
  0x90: 'noteon',
  0x80: 'noteoff', 
  0xB0: 'cc',
  0xE0: 'pitchbend',
  0xA0: 'aftertouch',
  0xD0: 'channelpressure',
  0xC0: 'program',
  0xF0: 'sysex'
};

export const MIDI_NOTE_ON = 0x90;
export const MIDI_NOTE_OFF = 0x80;
export const MIDI_AFTERTOUCH = 0xA0;
export const MIDI_CONTROL_CHANGE = 0xB0;
export const MIDI_PROGRAM_CHANGE = 0xC0;
export const MIDI_CHANNEL_PRESSURE = 0xD0;
export const MIDI_PITCHBEND = 0xE0;
export const MIDI_SYSEX = 0xF0;
export const MIDI_SYSEX_END = 0xF7;

export const MIDI_MESSAGE_EVENT = "midimessage";

export const NOTE_ON_EVENT = "NoteOn";
export const NOTE_OFF_EVENT = "NoteOff";
export const PITCHWHEEL_EVENT = "PitchWheel";
export const CONTROLLER_EVENT = "Controller";
export const PROGRAM_CHANGE_EVENT = "ProgramChange";
export const AFTERTOUCH_EVENT = "Aftertouch";

export const KEYBOARD_EVENT_KEY_DOWN = "keydown";
export const KEYBOARD_EVENT_KEY_UP = "keyup";

export const ENHARMONIC_KEYS = ["C", "G", "D", "A", "E", "B", "Cb", "F#", "Gb", "C#", "Db", "Ab", "Eb", "Bb", "F"];


export const MIDI_NOTE_MAP: NoteMap = {
  "C": [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
  "D": [2, 14, 26, 38, 50, 62, 74, 86, 98, 110, 122],
  "E": [4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124],
  "F": [5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125],
  "G": [7, 19, 31, 43, 55, 67, 79, 91, 103, 115, 127],
  "A": [9, 21, 33, 45, 57, 69, 81, 93, 105, 117],
  "B": [11, 23, 35, 47, 59, 71, 83, 95, 107, 119],
  "C#": [1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121],
  "D#": [3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123],
  "E#": [5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125],
  "F#": [6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126],
  "G#": [8, 20, 32, 44, 56, 68, 80, 92, 104, 116],
  "A#": [10, 22, 34, 46, 58, 70, 82, 94, 106, 118],
  "B#": [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
  "Db": [1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121],
  "Eb": [3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123],
  "Fb": [4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124],
  "Gb": [6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126],
  "Ab": [8, 20, 32, 44, 56, 68, 80, 92, 104, 116],
  "Bb": [10, 22, 34, 46, 58, 70, 82, 94, 106, 118],
  "Cb": [11, 23, 35, 47, 59, 71, 83, 95, 107, 119]
};





export const ACCIDENTALS: AccidentalMap = {
  "C": "#", "G": "#", "D": "#", "A": "#", "E": "#", "B": "#",
  "Cb": "b", "F#": "#", "Gb": "b", "C#": "#", "Db": "b",
  "Ab": "b", "Eb": "b", "Bb": "b", "F": "b"
};



export const KEY_NOTE_ARRAYS: KeyNoteMap = {
  "C": ["C", "D", "E", "F", "G", "A", "B"],
  "G": ["G", "A", "B", "C", "D", "E", "F#"],
  "D": ["D", "E", "F#", "G", "A", "B", "C#"],
  "A": ["A", "B", "C#", "D", "E", "F#", "G#"],
  "E": ["E", "F#", "G#", "A", "B", "C#", "D#"],
  "B": ["B", "C#", "D#", "E", "F#", "G#", "A#"],
  "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
  "C#": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
  "Cb": ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
  "Gb": ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
  "Db": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
  "Ab": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
  "Eb": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
  "Bb": ["Bb", "C", "D", "Eb", "F", "G", "A"],
  "F": ["F", "G", "A", "Bb", "C", "D", "E"]
};



export const INTERVALS: IntervalMap = {
  ROOT: 0,
  PERFECT_UNISON: 0,
  MINOR_SECOND: 1,
  MAJOR_SECOND: 2,
  MINOR_THIRD: 3,
  MAJOR_THIRD: 4,
  PERFECT_FOURTH: 5,
  DIMINISHED_FIFTH: 6,
  PERFECT_FIFTH: 7,
  MINOR_SIXTH: 8,
  MAJOR_SIXTH: 9,
  MINOR_SEVENTH: 10,
  MAJOR_SEVENTH: 11,
  PERFECT_OCTAVE: 12,
  AUGMENTED_OCTAVE: 13,
  DOUBLE_OCTAVE: 24,
};

export interface ChordMap {
  [key: string]: number[];
}

export const CHORDS: ChordMap = {
  // Basic triads
  MAJOR: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.PERFECT_FIFTH],
  MINOR: [INTERVALS.ROOT, INTERVALS.MINOR_THIRD, INTERVALS.PERFECT_FIFTH],
  DIMINISHED: [INTERVALS.ROOT, INTERVALS.MINOR_THIRD, INTERVALS.DIMINISHED_FIFTH],
  AUGMENTED: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.MINOR_SIXTH],

  // Seventh chords
  MAJOR_SEVENTH: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MAJOR_SEVENTH],
  MINOR_SEVENTH: [INTERVALS.ROOT, INTERVALS.MINOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH],
  DOMINANT_SEVENTH: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH],
  DIMINISHED_SEVENTH: [INTERVALS.ROOT, INTERVALS.MINOR_THIRD, INTERVALS.DIMINISHED_FIFTH, INTERVALS.MAJOR_SIXTH],
  HALF_DIMINISHED_SEVENTH: [INTERVALS.ROOT, INTERVALS.MINOR_THIRD, INTERVALS.DIMINISHED_FIFTH, INTERVALS.MINOR_SEVENTH],

  // Ninth chords
  MAJOR_NINTH: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MAJOR_SEVENTH, INTERVALS.MAJOR_SECOND],
  MINOR_NINTH: [INTERVALS.ROOT, INTERVALS.MINOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH, INTERVALS.MAJOR_SECOND],
  DOMINANT_NINTH: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH, INTERVALS.MAJOR_SECOND],

  // Eleventh chords
  MAJOR_ELEVENTH: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MAJOR_SEVENTH, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FOURTH],
  MINOR_ELEVENTH: [INTERVALS.ROOT, INTERVALS.MINOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FOURTH],
  DOMINANT_ELEVENTH: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FOURTH],

  // Thirteenth chords
  MAJOR_THIRTEENTH: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MAJOR_SEVENTH, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FOURTH, INTERVALS.MAJOR_SIXTH],
  MINOR_THIRTEENTH: [INTERVALS.ROOT, INTERVALS.MINOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FOURTH, INTERVALS.MAJOR_SIXTH],
  DOMINANT_THIRTEENTH: [INTERVALS.ROOT, INTERVALS.MAJOR_THIRD, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FOURTH, INTERVALS.MAJOR_SIXTH],
  DIMINISHED_THIRTEENTH: [INTERVALS.ROOT, INTERVALS.MINOR_THIRD, INTERVALS.DIMINISHED_FIFTH, INTERVALS.MAJOR_SIXTH, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FOURTH, INTERVALS.MINOR_SIXTH],

  // Suspended chords
  SUS2: [INTERVALS.ROOT, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FIFTH],
  SUS4: [INTERVALS.ROOT, INTERVALS.PERFECT_FOURTH, INTERVALS.PERFECT_FIFTH],
  
  // Suspended seventh chords
  SUS2_SEVENTH: [INTERVALS.ROOT, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH],
  SUS4_SEVENTH: [INTERVALS.ROOT, INTERVALS.PERFECT_FOURTH, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH],
  
  // Extended suspended chords
  SUS2_NINTH: [INTERVALS.ROOT, INTERVALS.MAJOR_SECOND, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH, INTERVALS.MAJOR_SECOND],
  SUS4_NINTH: [INTERVALS.ROOT, INTERVALS.PERFECT_FOURTH, INTERVALS.PERFECT_FIFTH, INTERVALS.MINOR_SEVENTH, INTERVALS.MAJOR_SECOND]
};



export const KEYBOARD_KEY_MAP: KeyCodeMap = {
  "KeyZ": 60, "KeyS": 61, "KeyX": 62, "KeyD": 63, "KeyC": 64,
  "KeyV": 65, "KeyG": 66, "KeyB": 67, "KeyH": 68, "KeyN": 69,
  "KeyJ": 70, "KeyM": 71, "Comma": 72
};

export const NOTE_NAMES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];


