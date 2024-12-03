import { GLOBAL_TUNE, MIDI_14BIT_MAX_VALUE, MIDI_MAX_VALUE } from "./constants";

interface FrequencyConversion {
  note: number;
  pitchBend: string;
}

export function midiNoteToFrequency(midinote: number, tune: number = GLOBAL_TUNE): number {
  return tune * Math.pow(2, (midinote - 69) / 12);
}

export function frequencyToMIDINote(frequency: number, tune: number = GLOBAL_TUNE): FrequencyConversion {
  const midiNote = Math.round(12 * Math.log2(frequency / tune) + 69);
  const exactFreq = tune * Math.pow(2, (midiNote - 69) / 12);
  const cents = 1200 * Math.log2(frequency / exactFreq);
  const pitchBendValue = Math.round((cents / 100) * (MIDI_14BIT_MAX_VALUE / 24));
  const hexValue = (pitchBendValue & 0xFFFF).toString(16).padStart(4, '0').toUpperCase();
  
  return {
    note: midiNote,
    pitchBend: hexValue
  };
}

export function pitchWheelToPolar(raw: number): number {
  return -((MIDI_14BIT_MAX_VALUE * 0.5) - raw);
}

export function pitchWheelToPolarRatio(raw: number): number {
  return pitchWheelToPolar(raw) / (MIDI_14BIT_MAX_VALUE * 0.5);
}

export function midiValueToRatio(value: number): number {
  return value / MIDI_MAX_VALUE;
}

export function midiValueToPolarRatio(value: number): number {
  const halfmax = (MIDI_MAX_VALUE * 0.5);
  return -(halfmax - value) / halfmax;
}

export function midiChannel(value: number): number {
  return (value & 0x0F) + 1;
} 