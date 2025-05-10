export { GLOBAL_TUNE, MIDI_14BIT_MAX_VALUE, MIDI_14BIT_HALF_MAX_VALUE, MIDI_MAX_VALUE, STATUS_TYPE_MAP, MIDI_NOTE_ON, MIDI_NOTE_OFF, MIDI_AFTERTOUCH, MIDI_CONTROL_CHANGE, MIDI_PROGRAM_CHANGE, MIDI_CHANNEL_PRESSURE, MIDI_PITCHBEND, MIDI_SYSEX, MIDI_SYSEX_END, MIDI_MESSAGE_EVENT, NOTE_ON_EVENT, NOTE_OFF_EVENT, PITCHWHEEL_EVENT, CONTROLLER_EVENT, PROGRAM_CHANGE_EVENT, AFTERTOUCH_EVENT, KEYBOARD_EVENT_KEY_DOWN, KEYBOARD_EVENT_KEY_UP, ENHARMONIC_KEYS, MIDI_NOTE_MAP, ACCIDENTALS, KEY_NOTE_ARRAYS, INTERVALS, CHORDS, KEYBOARD_KEY_MAP, NOTE_NAMES } from './constants';
export declare class Mizzy {
    private inputs;
    private outputs;
    useInputs: Map<string, MIDIInput>;
    useOutputs: Map<string, MIDIOutput>;
    private listeners;
    private virtualLoop;
    private processors;
    addProcessor(fn: (msg: unknown) => unknown | null): this;
    removeProcessor(fn: (msg: unknown) => unknown | null): this;
    private handleMessage;
    init(): Promise<void>;
    listDevices(): {
        inputs: MIDIInput[];
        outputs: MIDIOutput[];
    };
    useInput(inputId?: string): this;
    closeInput(id: string): this;
    useOutput(id?: string): this;
    closeOutput(id: string): this;
    loopback(enable?: boolean): this;
    send(message: number[]): this;
    sendTo(outputId: string, message: number[], loopback?: boolean): this;
    onMessage(callback: (msg: unknown) => void): this;
    unmessage(callback: (msg: unknown) => void): this;
    noteOn(note: number, velocity?: number, channel?: number): this;
    noteOff(note: number, channel?: number): this;
    cc(controller: number, value: number, channel?: number): this;
    programChange(program: number, channel?: number): this;
    pitchBend(value: number, channel?: number): this;
    aftertouch(pressure: number, channel?: number): this;
    polyAftertouch(note: number, pressure: number, channel?: number): this;
    sysex(data: Uint8Array): this;
    panic(): this;
    connect(): this;
}
