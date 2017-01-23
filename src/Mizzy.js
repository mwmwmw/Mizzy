
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
        this.id = Math.floor(Math.random() * 10000);

        this.key = key;
        this.setKey = function(keyname) {
            key = keyname;
            this.key = key;
            console.log("SET KEY", key);
        };
        this.keysPressed = [];

        // will have the midi object passed in when successfully initialized
        midiAccess = null;

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


    // get a list of notes that match this noteNumber
    static getNoteNames (noteNumber) {
        let noteNames = []; // create a list for the notes
        for (var note in notes) {
            // loop through the note table and push notes that match.
            notes[note].forEach(keynumber => {
                if (noteNumber === keynumber) {
                    noteNames.push(note);
                }
            });
        }
        return noteNames;
    };
    // find the first note that is in the current key
    static findNoteInKey (notes, key) {
        // loop through the note list
        for(let i = 0; i < notes.length; i++) {
            var note = notes[i];
            if(this.matchNoteInKey(note,key)) {
                return note;
            }
        }
        return notes[0];
    };
    // is this note in key
    static isNoteInKey (notes, key) {
        for(let n = 0; n < notes.length; n++) {
            const note = notes[n];
            if(this.matchNoteInKey(note, key)) {
                return true;
            }
        }
        return false;
    };

    static matchNoteInKey (note, key) {
        for(let i = 0; i < keynotes[key].length; i++) {
            const keynote = keynotes[key][i];
            if(note === keynote) {
                return true;
            }
        }
        return false;
    };

    // this.findAccidental = function(notes, key) {
    //     // are there any enharmonic equivalents
    //     if (notes.length > 1) {
    //         // check to see if the first note has an accidental (indicates you're on a black key);
    //         if(notes[0].length > 1) {
    //             for (var i = 0; i < notes.length; i++) {
    //                 var note = notes[i];
    //                 // does this note match the note in key
    //                 if (note[note.length - 1] === this.accidentals[key]) {
    //                     return note;
    //                 }
    //             }
    //             return notes[0];
    //         } else {
    //             return notes[0];
    //         }
    //     } else {
    //         return notes[0];
    //     }
    // };

    static sendMidiMessage (message) {

        if(midiAccess !== null) {
            const outputs = midiAccess.outputs.values();
            for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
                output.value.send(message.data, message.timeStamp);
            }
        }
        if(this.loopback) {
            loopBackMidiMessage(message);
        }
    };

    static createMessage (messageType, value) {
        let data = null;
        switch (messageType) {
            case "NoteOn":
                data = this.generateNoteOn(value, 127);
                break;
            case "NoteOff":
                data = this.generateNoteOff(value, 127);
                break;
        }
        const newMessage = new MIDIMessageEvent("midimessage", {"data": data}) || {"data": data};
        return this.processNoteEvent(newMessage, messageType);
    };


    loopBackMidiMessage (message) {
        this.onMIDIMessage(message);
    };


};
/**
 * Created by Matthew on 2017-01-22.
 */
