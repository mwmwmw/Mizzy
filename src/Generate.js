import MIDIData from "./MIDIData";
import NoteProcessor from "./NoteProcessor";

let hexString = "0123456789abcdef";

export default class Generate {

    static NoteOn (noteNumber, velocity) { return new Uint8Array([MIDIData.NoteOn, noteNumber, velocity]); }
    static NoteOff (noteNumber, velocity) { return new Uint8Array([MIDIData.NoteOff, noteNumber, velocity]);}
    static AfterTouch (noteNumber, value) { return new Uint8Array([MIDIData.AfterTouch, noteNumber, value]);}
    static ControlChange (controller, value) { return new Uint8Array([MIDIData.ControlChange,controller, value ]);}
    static ProgramChange (instrument) { return new Uint8Array([MIDIData.ProgramChange, instrument]);}
    static ChannelPressure (pressure) { return new Uint8Array([MIDIData.ChannelPressure, pressure]);}
    static PitchBend (value) {
        // @todo http://stackoverflow.com/questions/30911185/javascript-reading-3-bytes-buffer-as-an-integer
        var msb = 1,
            lsb = 1;
	    return new Uint8Array([MIDIData.ChannelPressure, msb, lsb]);
    }

	static FakeMessage(messageType, value) {
		let data = null;
		switch (messageType) {
			case "NoteOn":
				data = Generate.NoteOn(value, 127);
				break;
			case "NoteOff":
				data = Generate.NoteOff(value, 127);
				break;
		}
		const newMessage = new MIDIMessageEvent("midimessage", {"data": data}) || {"data": data};
		return NoteProcessor.processNoteEvent(newMessage, messageType, this.key);
	}

}
