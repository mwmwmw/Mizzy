import { 
    processNoteEvent,
    processCCEvent,
    processPitchWheelEvent,
    processMidiControlEvent,
    MIDIMessage
} from "./dataProcess";


import { MIDIMessageEventClass } from "./events";

import {
	MIDI_AFTERTOUCH,
	MIDI_CHANNEL_PRESSURE,
	MIDI_CONTROL_CHANGE,
	MIDI_MESSAGE_EVENT,
	MIDI_NOTE_OFF,
	MIDI_NOTE_ON,
	MIDI_PITCHBEND,
	MIDI_PROGRAM_CHANGE,
	NOTE_OFF_EVENT,
	NOTE_ON_EVENT,
	AFTERTOUCH_EVENT,
	PROGRAM_CHANGE_EVENT,
	ENHARMONIC_KEYS,
	NOTE_NAMES,

} from "./constants";

export function noteOn(noteNumber: number, velocity: number): Uint8Array {
    return new Uint8Array([MIDI_NOTE_ON, noteNumber, velocity]);
}

export function noteOff(noteNumber: number, velocity: number): Uint8Array {
    return new Uint8Array([MIDI_NOTE_OFF, noteNumber, velocity]);
}

export function afterTouch(noteNumber: number, value: number): Uint8Array {
    return new Uint8Array([MIDI_AFTERTOUCH, noteNumber, value]);
}

export function cc(controller: number, value: number): Uint8Array {
    return new Uint8Array([MIDI_CONTROL_CHANGE, controller, value]);
}

export function programChange(instrument: number): Uint8Array {
    return new Uint8Array([MIDI_PROGRAM_CHANGE, instrument]);
}

export function channelPressure(pressure: number): Uint8Array {
    return new Uint8Array([MIDI_CHANNEL_PRESSURE, pressure]);
}

export function pitchBend(value: number): Uint8Array {
    const normalized = Math.floor(((value + 1) / 2) * 16383);
    const msb = (normalized >> 7) & 0x7F;
    const lsb = normalized & 0x7F;
    return new Uint8Array([MIDI_PITCHBEND, lsb, msb]);
}

export function midiEvent(data: Uint8Array, key?: string): MIDIMessage {
    const message = new MIDIMessageEventClass(MIDI_MESSAGE_EVENT, {data});

    switch (data[0] & 0xF0) {
        case MIDI_NOTE_ON:
        case MIDI_NOTE_OFF:
            return processNoteEvent(message, key);
        case MIDI_CONTROL_CHANGE:
            return processCCEvent(message);
        case MIDI_PITCHBEND:
            return processPitchWheelEvent(message);
        case MIDI_AFTERTOUCH:
            return processMidiControlEvent(message, AFTERTOUCH_EVENT);
        case MIDI_PROGRAM_CHANGE:
            return processMidiControlEvent(message, PROGRAM_CHANGE_EVENT);
		default:
			return message;
    }
}

export function noteEvent(
    messageType: typeof NOTE_ON_EVENT | typeof NOTE_OFF_EVENT, 
    value: number, 
    velocity: number = 127, 
    key: string = ENHARMONIC_KEYS[0]
): MIDIMessage {
    let data: Uint8Array | null = null;
    
    switch (messageType) {
        case NOTE_ON_EVENT:
            data = noteOn(value, velocity);
            break;
        case NOTE_OFF_EVENT:
            data = noteOff(value, velocity);
            break;
        default:
            data = noteOn(value, velocity);
            break;
    }
    const newMessage = new MIDIMessageEventClass(MIDI_MESSAGE_EVENT, {data});
    return processNoteEvent(newMessage, key);
}

export function ccEvent(controller: number, value: number): MIDIMessage {
    const data = cc(controller, value);
    const newMessage = new MIDIMessageEventClass(MIDI_MESSAGE_EVENT, {data});
    return processCCEvent(newMessage);
}

export function pitchBendEvent(value: number): MIDIMessage {
    const data = pitchBend(value);
    const newMessage = new MIDIMessageEventClass(MIDI_MESSAGE_EVENT, {data});
    return processPitchWheelEvent(newMessage);
}


export const getRepeatingNoteSequence = (startNote: number, interval: number): number[] => {
	const sequence: number[] = [];
	let currentNote = startNote;
  
	sequence.push(currentNote);
	currentNote += interval;
  
	while ((currentNote % 12) !== (startNote % 12) || currentNote === startNote) {
	  sequence.push(currentNote);
	  currentNote += interval;
	}
  
	return sequence;
  };
  
  export const hasAllValues = (arrays: number[][], startValue: number, endValue: number): boolean => {
	const flatArray = arrays.flat();
	for (let i = startValue; i <= endValue; i++) {
	  if (!flatArray.includes(i)) {
		return false;
	  }
	}
	return true;
  };
  
  export const getMIDINoteName = (midiNoteNumber: number): string => {
	const noteIndex = midiNoteNumber % 12;
	return NOTE_NAMES[noteIndex];
};
  
  export const getNoteSequence = (startNote: number, interval: number): number[] => {
	const sequence: number[] = [];
	let currentNote = startNote;
	
	while (currentNote <= 127) {
	  sequence.push(currentNote);
	  currentNote += interval;
	}
	return sequence;
  };
  


export const getRepeatingNoteSequenceRaw = (startNote: number, interval: number): number[] => {
	const sequence: number[] = [];
	let currentNote = startNote;

	// Keep adding notes until we reach 128
	while (currentNote <= 127) {
		sequence.push(currentNote);
		currentNote += interval;
	}

	return sequence;
};


export const hasAllNoteValues = (arrays: number[][], startValue: number, endValue: number): boolean => {
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

export function getNoteSequenceWithNames(interval: number) { 

    let circles = [];
    let names = [];
    let seq = [];
    let i = 0;
    while (!hasAllValues(circles, 0, 127)) {   
        const sequence = getRepeatingNoteSequenceRaw(0+i, interval);
        console.log(sequence);
        circles.push(sequence);
        i++;
    }

    while (!hasAllNoteValues(seq, 0, 24)) {   
        const sequence = getRepeatingNoteSequence(0+i, interval);
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
