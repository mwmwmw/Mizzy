import Convert from "./Convert";
import {ENHARMONIC_KEYS, KEY_NOTE_ARRAYS, MIDI_NOTE_MAP} from "./Constants";

export default class DataProcess {
	// add all of our extra data to the MIDI message event.
	static NoteEvent(message, key = ENHARMONIC_KEYS[0], transpose = 0) {
		const value = message.data[1] + transpose;
		const notes = this.getNoteNames(value);
		const data = {
			"enharmonics": notes,
			"note": DataProcess.findNoteInKey(notes, key),
			"inKey": DataProcess.isNoteInKey(notes, key),
			"value": value,
			"velocity": message.data[2],
			"frequency": Convert.MIDINoteToFrequency(value),
			"channel" : Convert.MidiChannel(message.data[0])
		};
		return Object.assign(message, data);
	};

	// add all of our extra data to the MIDI message event.
	static CCEvent(message, ccNameOverride) {
		return Object.assign(message, {
			"cc": ccNameOverride || message.data[1],
			"value": message.data[2],
			"ratio": Convert.MidiValueToRatio(message.data[2]),
			"polarRatio":Convert.MidiValueToPolarRatio(message.data[2]),
			"channel" : Convert.MidiChannel(message.data[0])
		});
	}

	// add all of our extra data to the MIDI message event.
	static MidiControlEvent(message, controlName) {
		return Object.assign(message, {
			"cc": controlName,
			"value": message.data[1],
			"ratio": Convert.MidiValueToRatio(message.data[2]),
			"channel" : Convert.MidiChannel(message.data[0])
		});
	}

	// add all of our extra data to the MIDI message event.
	static PitchWheelEvent(message) {
		const raw = message.data[1] | (message.data[2] << 7);
		return Object.assign(message, {
			"cc": "pitchwheel",
			"value": raw,
			"polar": Convert.PitchWheelToPolar(raw),
			"polarRatio": Convert.PitchWheelToPolarRatio(raw),
			"channel" : Convert.MidiChannel(message.data[0])
		});
	}

	// process the midi message. Go through each type and add processed data
	// when done, check for any bound events and run them.

	// get a list of notes that match this noteNumber
	static getNoteNames(noteNumber) {
		let noteNames = []; // create a list for the notes
		for (var note in MIDI_NOTE_MAP) {
			// loop through the note table and push notes that match.
			MIDI_NOTE_MAP[note].forEach(keynumber => {
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
			if (DataProcess.matchNoteInKey(note, key)) {
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
		for (let i = 0; i < KEY_NOTE_ARRAYS[key].length; i++) {
			const keynote = KEY_NOTE_ARRAYS[key][i];
			if (note === keynote) {
				return true;
			}
		}
		return false;
	}
}