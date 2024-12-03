import {
  midiNoteToFrequency,
  midiChannel,
  midiValueToRatio,
  midiValueToPolarRatio,
  pitchWheelToPolar,
  pitchWheelToPolarRatio,
} from "./convert";


import { ENHARMONIC_KEYS, KEY_NOTE_ARRAYS, MIDI_NOTE_MAP } from "./constants";
import { MIDIMessage } from "./types";

const PITCHWHEEL_CC = "pitchwheel";

type Note = string;
type Key = string;

export function analyzeNoteEvent(
  message: MIDIMessage,
  key: Key = ENHARMONIC_KEYS[0],
  transpose: number = 0
) {
  const value = message.data[1] + transpose;
  const notes = getNoteNames(value);
  return {
    enharmonics: notes,
    note: findNoteInKey(notes, key),
    inKey: isNoteInKey(notes, key),
    value: value,
    velocity: message.data[2],
    frequency: midiNoteToFrequency(value),
    channel: midiChannel(message.data[0]),
  }
}

export function analyzeCCEvent(
  message: MIDIMessage,
) {
  return {
    cc: message.data[1],
    value: message.data[2],
    ratio: midiValueToRatio(message.data[2]),
    polarRatio: midiValueToPolarRatio(message.data[2]),
    channel: midiChannel(message.data[0]),
  }
}

export function analyzePitchWheelEvent(message: MIDIMessage) {
  const raw = message.data[1] | (message.data[2] << 7);
  return {
    cc: PITCHWHEEL_CC,
    value: raw,
    polar: pitchWheelToPolar(raw),
    polarRatio: pitchWheelToPolarRatio(raw),
    channel: midiChannel(message.data[0]),
  };
}

  export function analyzeMidiControlEvent(
  message: MIDIMessage,
) {
  return {
    cc: message.data[1],
    value: message.data[2],
    ratio: midiValueToRatio(message.data[2]),
    channel: midiChannel(message.data[0]),
  }
}

export function getNoteNames(noteNumber: number): Note[] {
  const noteNames: Note[] = [];
  for (const note in MIDI_NOTE_MAP) {
    MIDI_NOTE_MAP[note].forEach((keynumber) => {
      if (noteNumber === keynumber) {
        noteNames.push(note);
      }
    });
  }
  return noteNames;
}

export function findNoteInKey(notes: Note[], key: Key): Note {
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    if (matchNoteInKey(note, key)) {
      return note;
    }
  }
  return notes[0];
}

export function isNoteInKey(notes: Note[], key: Key): boolean {
  for (let n = 0; n < notes.length; n++) {
    const note = notes[n];
    if (matchNoteInKey(note, key)) {
      return true;
    }
  }
  return false;
}

export function matchNoteInKey(note: Note, key: Key): boolean {
  for (let i = 0; i < KEY_NOTE_ARRAYS[key].length; i++) {
    const keynote = KEY_NOTE_ARRAYS[key][i];
    if (note === keynote) {
      return true;
    }
  }
  return false;
}

