import MIDIEvents from "./midievents";
import { ENHARMONIC_KEYS, NOTE_OFF_EVENT } from "./constants";
import { noteEvent } from "./generate";
import Clock from "./clock";
if (window.MIDIMessageEvent === undefined) {
    window.MIDIMessageEvent = MessageEvent;
}
export default class Mizzy extends MIDIEvents {
    constructor() {
        super();
        this.midiAccess = null;
        this.clock = new Clock();
    }
    initialize() {
        if (this.midiAccess === null) {
            if (navigator.requestMIDIAccess) {
                return navigator.requestMIDIAccess({
                    sysex: false
                }).then((e) => this.onMIDISuccess(e), (e) => this.onMIDIFailure(e));
            }
            else {
                console.warn("[Mizzy] Your browser does not support Web MIDI API. You can still use the local loopback however.");
                return new Promise((resolve) => {
                    setTimeout(function () {
                        resolve();
                    }, 50);
                });
            }
        }
        return Promise.resolve();
    }
    get keys() {
        return ENHARMONIC_KEYS;
    }
    setKey(keyletter = "C") {
        this.key = ENHARMONIC_KEYS[ENHARMONIC_KEYS.indexOf(keyletter.toUpperCase())] || "C";
    }
    getMidiInputs() {
        return this.midiAccess?.inputs.values();
    }
    getMidiOutputs() {
        return this.midiAccess?.outputs.values();
    }
    get outputDevices() {
        const deviceArray = [];
        const devices = this.getMidiOutputs();
        if (devices) {
            for (let input = devices.next(); input && !input.done; input = devices.next()) {
                deviceArray.push(input.value);
            }
        }
        return deviceArray;
    }
    get inputDevices() {
        const deviceArray = [];
        const devices = this.getMidiInputs();
        if (devices) {
            for (let input = devices.next(); input && !input.done; input = devices.next()) {
                deviceArray.push(input.value);
            }
        }
        return deviceArray;
    }
    bindToInput(input) {
        this.boundInputs.push(input);
        input.onmidimessage = (e) => this.onMIDIMessage(e, this.key);
    }
    unbindInput(input) {
        var index = this.boundInputs.indexOf(input);
        this.boundInputs.slice(1, index);
        input.onmidimessage = null;
    }
    bindToAllInputs() {
        const inputs = this.getMidiInputs();
        if (inputs) {
            for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                this.bindToInput(input.value);
            }
        }
    }
    unbindAllInputs() {
        this.boundInputs.forEach(this.unbindInput);
    }
    bindToOutput(output) {
        this.boundOutputs.push(output);
    }
    bindToAllOutputs() {
        const outputs = this.getMidiOutputs();
        if (outputs) {
            for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
                this.bindToOutput(output.value);
            }
        }
    }
    onMIDIFailure(error) {
        throw error;
    }
    onMIDISuccess(midiAccessObj) {
        this.midiAccess = midiAccessObj;
    }
    panic() {
        for (let i = 0; i < 127; i++) {
            this.sendMidiMessage(noteEvent(NOTE_OFF_EVENT, i, 127));
        }
    }
}
//# sourceMappingURL=index.js.map