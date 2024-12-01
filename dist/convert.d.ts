interface FrequencyConversion {
    note: number;
    pitchBend: string;
}
export declare function midiNoteToFrequency(midinote: number, tune?: number): number;
export declare function frequencyToMIDINote(frequency: number, tune?: number): FrequencyConversion;
export declare function pitchWheelToPolar(raw: number): number;
export declare function pitchWheelToPolarRatio(raw: number): number;
export declare function midiValueToRatio(value: number): number;
export declare function midiValueToPolarRatio(value: number): number;
export declare function midiChannel(value: number): number;
export {};
