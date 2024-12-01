export const MIDI_NOTE_ON = 0x90;
export const MIDI_NOTE_OFF = 0x80;
export const MIDI_AFTERTOUCH = 0xA0;
export const MIDI_CONTROL_CHANGE = 0xB0;
export const MIDI_PROGRAM_CHANGE = 0xC0;
export const MIDI_CHANNEL_PRESSURE = 0xD0;
export const MIDI_PITCHBEND = 0xE0;

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

export const MIDI_NOTE_MAP = {
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

export const ACCIDENTALS = {
	"C": "#",
	"G": "#",
	"D": "#",
	"A": "#",
	"E": "#",
	"B": "#",
	"Cb": "b",
	"F#": "#",
	"Gb": "b",
	"C#": "#",
	"Db": "b",
	"Ab": "b",
	"Eb": "b",
	"Bb": "b",
	"F": "b"
};

export const KEY_NOTE_ARRAYS = {
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


export const INTERVALS = {
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
}

 export const getNoteSequence = (startNote, interval) => {
	const sequence = [];
	let currentNote = startNote;
	
	while (currentNote <= 127) {
		sequence.push(currentNote);
		currentNote += interval;
	}

	return sequence;
};



export const getRepeatingNoteSequence = (startNote, interval) => {
	const sequence = [];
	let currentNote = startNote;

	// Add first note
	sequence.push(currentNote);
	currentNote += interval;

	// Keep adding notes until we get back to a note that's equivalent to startNote (mod 12)
	while ((currentNote % 12) !== (startNote % 12) || currentNote === startNote) {
		sequence.push(currentNote);
		currentNote += interval;
	}

	return sequence;
};

export const getRepeatingNoteSequenceRaw = (startNote, interval) => {
	const sequence = [];
	let currentNote = startNote;

	// Keep adding notes until we reach 128
	while (currentNote <= 127) {
		sequence.push(currentNote);
		currentNote += interval;
	}

	return sequence;
};


export const hasAllValues = (arrays, startValue, endValue) => {
	// Flatten all arrays into a single array
	const flatArray = arrays.flat();
	
	// Check if each value in range exists
	for (let i = startValue; i <= endValue; i++) {
		if (!flatArray.includes(i)) {
			return false;
		}
	}

	return true;
};
const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const getMIDINoteName = (midiNoteNumber) => {
	const noteIndex = midiNoteNumber % 12;
	return noteNames[noteIndex];
};

export const hasAllNoteValues = (arrays, startValue, endValue) => {
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

export function getNoteSequenceWithNames(interval) { 

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
