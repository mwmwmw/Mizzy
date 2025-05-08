import { MIDIMessage } from "./types";
interface FrequencyConversion {
    note: number;
    pitchBend: [number, number];
}
export declare function messageToBytes(msg: MIDIMessage): number[];
export declare function midiNoteToFrequency(midinote: number, tune?: number): number;
export declare function frequencyToMIDINote(frequency: number, tune?: number): FrequencyConversion;
export declare function pitchWheelToPolar(raw: number): number;
export declare function pitchWheelToPolarRatio(raw: number): number;
export declare function midiValueToRatio(value: number): number;
export declare function midiValueToPolarRatio(value: number): number;
export declare function midiChannel(value: number): number;
export declare function msbLsbToNumber(msb: number, lsb: number): number;
export declare function numberToLsbMsb(value: number): [number, number];
export {};
