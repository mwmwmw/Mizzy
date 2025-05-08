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
