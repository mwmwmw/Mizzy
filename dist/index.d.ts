import MIDIEvents from "./midievents";
import Clock from "./clock";
import { WebMidi } from "./types";
export default class Mizzy extends MIDIEvents {
    private midiAccess;
    clock: Clock;
    constructor();
    initialize(): Promise<void>;
    get keys(): string[];
    get type(): {
        NOTE_ON_EVENT: string;
        NOTE_OFF_EVENT: string;
        PROGRAM_CHANGE_EVENT: string;
        CONTROLLER_EVENT: string;
        PITCHWHEEL_EVENT: string;
        AFTERTOUCH_EVENT: string;
    };
    setKey(keyletter?: string): void;
    getMidiInputs(): Iterator<WebMidi.MIDIInput> | undefined;
    getMidiOutputs(): Iterator<WebMidi.MIDIOutput> | undefined;
    get outputDevices(): WebMidi.MIDIOutput[];
    get inputDevices(): WebMidi.MIDIInput[];
    bindToInput(input: WebMidi.MIDIInput): void;
    unbindInput(input: WebMidi.MIDIInput): void;
    bindToAllInputs(): void;
    unbindAllInputs(): void;
    bindToOutput(output: WebMidi.MIDIOutput): void;
    bindToAllOutputs(): void;
    onMIDIFailure(error: Error): void;
    onMIDISuccess(midiAccessObj: WebMidi.MIDIAccess): void;
    panic(): void;
}
