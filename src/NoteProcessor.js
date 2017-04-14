import MIDIData from "./MIDIData";
import Convert from "./Convert";
import Notation from "./Notation";

let notes = MIDIData.MidiNotes;
let keynotes = Notation.KeyNotes;

export default class NoteProcessor {
	// add all of our extra data to the MIDI message event.
	static processNoteEvent(message, eventName, key = "C") {
		const notes = this.getNoteNames(message.data[1]);
		const data = {
			"enharmonics": notes,
			"note": NoteProcessor.findNoteInKey(notes, key),
			"inKey": NoteProcessor.isNoteInKey(notes, key),
			"value": message.data[1],
			"velocity": message.data[2],
			"frequency": Convert.MIDINoteToFrequency(message.data[1])
		};
		return Object.assign(message, data);
	};

	// add all of our extra data to the MIDI message event.
	static processCCEvent(message, ccNameOverride) {
		Object.assign(message, {
			"cc": ccNameOverride || message.data[1],
			"value": message.data[2],
			"ratio": message.data[2] / 127,
			"timestamp": message.receivedTime
		});
	}

	// add all of our extra data to the MIDI message event.
	static processMidiControlEvent(message, controlName) {
		Object.assign(message, {
			"cc": controlName,
			"value": message.data[1],
			"ratio": message.data[1] / 127,
			"timestamp": message.receivedTime
		});
	}

	// add all of our extra data to the MIDI message event.
	static processPitchWheel(message) {
		const raw = message.data[1] | (message.data[2] << 7), calc = -(8192 - raw), ratio = calc / 8192;
		return Object.assign(message, {
			"cc": "pitchwheel",
			"value": raw,
			"polar": calc,
			"polarRatio": ratio,
			"timestamp": message.receivedTime
		});
	}

	// process the midi message. Go through each type and add processed data
	// when done, check for any bound events and run them.

	// get a list of notes that match this noteNumber
	static getNoteNames(noteNumber) {
		let noteNames = []; // create a list for the notes
		for (var note in notes) {
			// loop through the note table and push notes that match.
			notes[note].forEach(keynumber => {
					if (noteNumber === keynumber) {
						noteNames.push(note);
					}
				}
			);
		}
		return noteNames;
	};

	// find the first note that is in the current key
	static findNoteInKey(notes, key) {
		// loop through the note list
		for (let i = 0; i < notes.length; i++) {
			var note = notes[i];
			if (this.matchNoteInKey(note, key)) {
				return note;
			}
		}
		return notes[0];
	};

	// is this note in key
	static isNoteInKey(notes, key) {
		for (let n = 0; n < notes.length; n++) {
			const note = notes[n];
			if (this.matchNoteInKey(note, key)) {
				return true;
			}
		}
		return false;
	}

	static matchNoteInKey(note, key) {
		for (let i = 0; i < keynotes[key].length; i++) {
			const keynote = keynotes[key][i];
			if (note === keynote) {
				return true;
			}
		}
		return false;
	}

}
NoteProcessor.keysPressed = [];