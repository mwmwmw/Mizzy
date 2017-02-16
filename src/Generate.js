import MIDIData from "./MIDIData";

let hexString = "0123456789abcdef";

export default class Generate {

    static NoteOn (noteNumber, velocity) { new Uint8Array([MIDIData.NoteOn, noteNumber, velocity]); }
    static NoteOff (noteNumber, velocity) { new Uint8Array([MIDIData.NoteOff, noteNumber, velocity]);}
    static AfterTouch (noteNumber, value) {new Uint8Array([MIDIData.AfterTouch, noteNumber, value]);}
    static ControlChange (controller, value) {new Uint8Array([MIDIData.ControlChange,controller, value ]);}
    static ProgramChange (instrument) {new Uint8Array([MIDIData.ProgramChange, instrument]);}
    static ChannelPressure (pressure) {new Uint8Array([MIDIData.ChannelPressure, pressure]);}
    static PitchBend (value) {
        // @todo http://stackoverflow.com/questions/30911185/javascript-reading-3-bytes-buffer-as-an-integer
        var msb = 1,
            lsb = 1;
        new Uint8Array([MIDIData.ChannelPressure, msb, lsb]);
    }
}
