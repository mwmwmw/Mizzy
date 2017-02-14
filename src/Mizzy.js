import Notation from "./Notation";
import MIDIData from "./MIDIData";
import Generate from "./Generate";

let notes = MIDIData.midinotes;

let key = "C";
let midiAccess = null;


export default class Mizzy {
    constructor () {
        if(!window.MIDIMessageEvent) {
            window.MIDIMessageEvent = function (name, params) {
                this.name = name;
                return Object.assign(this, params);
            }
        }

        this.key = key;
        this.setKey = function(keyname) {
            key = keyname;
            this.key = key;
            console.log("SET KEY", key);
        };
        this.keysPressed = [];

        // will have the midi object passed in when successfully initialized
        this.midiAccess = null;

        this.onMIDISuccess = function (midiAccessObj) {
            // just grab from all inputs by default. It's the easiest.
            midiAccess = midiAccessObj;
            const inputs = midiAccess.inputs.values();
            for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                input.value.onmidimessage = this.onMIDIMessage.bind(this);
            }
        };
        // throw an error if midi can't be initialized
        this.onMIDIFailure = error => {
            throw "No MIDI Available"
        };
        this.loopback = true;
    }


    // initialize MIZZY. Throw an alert box if the user can't use it.
    static initialize () {
        console.log(midiAccess);
        if(midiAccess === null) {
            if (navigator.requestMIDIAccess) {
                navigator.requestMIDIAccess({
                    sysex: false
                }).then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
            } else {
                alert("No MIDI support in your browser.");
            }
        }
    };

    static sendMidiMessage (message) {

        if(midiAccess !== null) {
            const outputs = midiAccess.outputs.values();
            for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
                output.value.send(message.data, message.timeStamp);
            }
        }
        if(this.loopback) {
            this.loopBackMidiMessage(message);
        }
    };
    static createMessage (messageType, value) {
        let data = null;
        switch (messageType) {
            case "NoteOn":
                data = Generate.NoteOn(value, 127);
                break;
            case "NoteOff":
                data = Generate.NoteOff(value, 127);
                break;
        }
        const newMessage = new MIDIMessageEvent("midimessage", {"data": data}) || {"data": data};
        return this.processNoteEvent(newMessage, messageType);
    };
    loopBackMidiMessage (message) {
        this.onMIDIMessage(message);
    };
};