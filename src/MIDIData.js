const midinotes = {
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

let noteon = 0x90;
let noteoff = 0x80;
let aftertouch = 0xA0;
let controlchange = 0xB0;
let programchange = 0xC0;
let channelpressure = 0xD0;
let pitchbend = 0xE0;

export default class MIDIData {

    static get MidiNotes () { return midinotes; }
    static get NoteOff() {return noteoff; }
    static get NoteOn() {return noteon; }
    static get AfterTouch() {return aftertouch;}
    static get ControlChange() {return controlchange;}
    static get ProgramChange() {return programchange;}
    static get ChannelPressure() {return channelpressure;}
    static get PitchBend() {return pitchbend;}
}
