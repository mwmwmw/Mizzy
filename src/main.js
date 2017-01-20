let key = "C";
let midiAccess = null;

export default function () {
    if(!window.MIDIMessageEvent) {
        window.MIDIMessageEvent = function (name, params) {
            this.name = name;
            return Object.assign(this, params);
        }
    }
    this.id = Math.floor(Math.random() * 10000);
    // standard circle of fifths
    this.keys = ["C", "G", "D", "A", "E", "B", "Cb", "F#", "Gb", "C#", "Db", "Ab", "Eb","Bb","F"];
    // note values for each key
    this.keynotes = {
        "C":  ["C", "D", "E", "F", "G", "A", "B"],
        "G":  ["G", "A", "B", "C", "D", "E", "F#"],
        "D":  ["D", "E", "F#", "G", "A", "B", "C#"],
        "A":  ["A", "B", "C#", "D", "E", "F#", "G#"],
        "E":  ["E", "F#", "G#", "A", "B", "C#", "D#"],
        "B":  ["B", "C#", "D#", "E", "F#", "G#", "A#"],
        "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
        "C#": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
        "Cb": ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
        "Gb": ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
        "Db": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
        "Ab": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
        "Eb": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
        "Bb": ["Bb", "C", "D", "Eb", "F", "G", "A"],
        "F":  ["F", "G", "A", "Bb", "C", "D", "E"]
    };
    // set a default key of C major
    this.key = key;
    this.setKey = function(keyname) {
        key = keyname;
        this.key = key;
        console.log("SET KEY", key);
    };
    // accidental preferences for each key
    this.accidentals = {
        "C"  : "#",
        "G"  : "#",
        "D"  : "#",
        "A"  : "#",
        "E"  : "#",
        "B"  : "#",
        "Cb" : "b",
        "F#" : "#",
        "Gb" : "b",
        "C#" : "#",
        "Db" : "b",
        "Ab" : "b",
        "Eb" : "b",
        "Bb" : "b",
        "F"  : "b"
    };
    // MIDI note to note name value mapping.
    this.notes =
    {
        "C": [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
        "D": [2, 14, 26, 38, 50, 62, 74, 86, 98, 110, 122],
        "E": [4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124],
        "F": [5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125],
        "G": [7, 19, 31, 43, 55, 67, 79, 91, 103, 115, 127],
        "A": [9, 21, 33, 45, 57, 69, 81, 93, 105, 117],
        "B": [11, 23, 35, 47, 59, 71, 83, 95, 107, 119],
        "C#": [1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121],
        "D#": [3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123],
        "E#": [5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125],
        "F#": [6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126],
        "G#": [8, 20, 32, 44, 56, 68, 80, 92, 104, 116],
        "A#": [10, 22, 34, 46, 58, 70, 82, 94, 106, 118],
        "B#": [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
        "Db": [1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121],
        "Eb": [3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123],
        "Fb": [4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124],
        "Gb": [6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126],
        "Ab": [8, 20, 32, 44, 56, 68, 80, 92, 104, 116],
        "Bb": [10, 22, 34, 46, 58, 70, 82, 94, 106, 118],
        "Cb": [11, 23, 35, 47, 59, 71, 83, 95, 107, 119]
    };
    // a list of keys that are currently pressed
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
    // initialize MIZZY. Throw an alert box if the user can't use it.
    this.initialize = function () {
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

    // object for listeners that will get bound to midi events
    this.listeners = {};

    // take this event name, and run this handler when it occurs
    this.on = function (event, handler) {
        if (this.listeners[event] === undefined) {
            this.listeners[event] = [handler];
        } else {
            this.listeners[event].push(handler);
        }
        return handler;
    };
    // unbind this event and handler
    this.off = function (event, handler) {
        if (this.listeners[event]) {
            for (let i = this.listeners[event].length - 1; i >= 0; i--) {
                if (this.listeners[event].length === 1) {
                    delete this.listeners[event];
                } else {
                    this.listeners[event].splice(i, 1);
                    break;
                }
            }
        }
    };
    // get a list of notes that match this noteNumber
    this.getNoteNames = function (noteNumber) {
        const notenames = []; // create a list for the notes
        for (const note in this.notes) {
            // loop through the note table and push notes that match.
            this.notes[note].forEach(keynumber => {
                if (noteNumber === keynumber) {
                    notenames.push(note);
                }
            });
        }
        return notenames;
    };
    // find the first note that is in the current key
    this.findNoteInKey = function (notes, key) {
        // loop through the note list
        for(let i = 0; i < notes.length; i++) {
            const note = notes[i];
                if(this.matchNoteInKey(note,key)) {
                    return note;
                }
        }
        return notes[0];
    };
    // is this note in key
    this.isNoteInKey = function(notes, key) {
        for(let n = 0; n < notes.length; n++) {
            const note = notes[n];
            if(this.matchNoteInKey(note, key)) {
                return true;
            }
        }
        return false;
    };

    this.matchNoteInKey = function(note, key) {
        for(let i = 0; i < this.keynotes[key].length; i++) {
            const keynote = this.keynotes[key][i];
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

    this.sendMidiMessage = function(message) {

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

    this.createMessage = function(messageType, value) {
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

    this.generateNoteOn = (noteNumber, velocity) => new Uint8Array([0x90, noteNumber, velocity]);
    this.generateNoteOff = (noteNumber, velocity) => new Uint8Array([0x80, noteNumber, velocity]);

    this.loopBackMidiMessage = function(message) {
        this.onMIDIMessage(message);
    };
    this.loopback = true;

    // add all of our extra data to the MIDI message event.
    this.processNoteEvent = function (message,messageType) {
        const notes = this.getNoteNames(message.data[1]);
        const data = {
            "enharmonics": notes,
            "note" : this.findNoteInKey(notes, this.key),
            "inKey" : this.isNoteInKey(notes, this.key),
            "value": message.data[1],
            "velocity": message.data[2],
            "frequency": 440 * Math.pow(2, (message.data[1] - 69) / 12)
        };
        switch(messageType) {
            case "NoteOn":
                this.keysPressed[message.data[1]] = data;
                break;
            case "NoteOff":
                delete this.keysPressed[message.data[1]];
                break;
        };
        return Object.assign(message, data);
    };
    // add all of our extra data to the MIDI message event.
    this.processCCEvent = (message, ccNameOverride) => Object.assign(message, {
        "cc": ccNameOverride || message.data[1],
        "value": message.data[2],
        "ratio": message.data[2] / 127,
        "timestamp": message.receivedTime
    });
    // add all of our extra data to the MIDI message event.
    this.processMidiControlEvent = (message, controlName) => Object.assign(message, {
        "cc": controlName,
        "value": message.data[1],
        "ratio": message.data[1] / 127,
        "timestamp": message.receivedTime
    });
    // add all of our extra data to the MIDI message event.
    this.processPitchWheel = message => {
        const raw = message.data[1] | (message.data[2] << 7), calc = -(8192 - raw), ratio = calc / 8192;
        return Object.assign(message, {
            "cc": "pitchwheel",
            "value": raw,
            "polar": calc,
            "polarRatio": ratio,
            "timestamp": message.receivedTime
        });
    };

    // process the midi message. Go through each type and add processed data
    // when done, check for any bound events and run them.

    this.onMIDIMessage = function (message) {
        let eventName = null, data = null;
        switch (message.data[0]) {
            case 128:
                eventName = "NoteOff";
                delete this.keysPressed[message.data[1]];
                data = this.processNoteEvent(message, eventName);
                break;
            case 144:
                if(message.data[2] > 0) {
                    eventName = "NoteOn";
                } else {
                    eventName = "NoteOff";
                }
                data = this.processNoteEvent(message, eventName);
                break;
            case 176:
                eventName = "Controller";
                data = this.processCCEvent(message);
                break;
            case 224:
                eventName = "PitchWheel";
                data = this.processPitchWheel(message);
                break;
            case 208:
                eventName = "Aftertouch";
                data = this.processMidiControlEvent(message, eventName);
                break;
            case 192:
                eventName = "ProgramChange";
                data = this.processMidiControlEvent(message, eventName);
                break;
        }
        // if there is no event name, then we don't support that event yet so do nothing.
        if (eventName !== null) {
            this.executeEventHandlers(eventName, data)
        }
    };

    // loop through all the bound events and execute with the newly processed data.
    this.executeEventHandlers = function (event, data) {
        if (this.listeners[event]) {
            for (let i = this.listeners[event].length - 1; i >= 0; i--) {
                if(this.listeners[event] !== undefined) {
                    if (typeof this.listeners[event][i] === "function" && this.listeners[event][i] ) {
                        this.listeners[event][i](data);
                    } else {
                        throw "Event handler is not a function.";
                    }
                }
            }
        }
    };

    // EZ binding for Control Change data, just pass in the CC number and handler. Can only be unbound with unbindALL()
    this.onCC = function (cc, handler) {
        const wrapper = data => {
            if (data.cc == cc) {
                handler(data);
            }
        };
        this.on("Controller", wrapper);
    };
    // EZ binding for key presses, bind these two handlers to key on/off. Can only be unbound with unbindALL()
    this.keyToggle = function (handlerOn, handlerOff) {
        this.on("NoteOn", handlerOn);
        this.on("NoteOff", handlerOff);
    };
    // currently broken. will bind an event to particular keypress.
    // this.onNoteName = function (name, handler) {
    //     var wrapper = function (data) {
    //         if(typeof data.note_name === "string") {
    //             if (name.length > 1) {
    //                 var dataname = new RegExp(name);
    //                 if (data.note_name.match(dataname)) {
    //                     handler(data);
    //                 }
    //             } else {
    //                 if (data.note_name === name) {
    //                     handler(data);
    //                 }
    //             }
    //         } else {
    //             data.note_name.forEach(function(notename){
    //                 if(notename === name) {
    //                     handler(data);
    //                 }
    //             })
    //         }
    //     };
    //     this.on("NoteOn", wrapper);
    // };
    // EZ binding for key values. Can only be unbound with unbindALL()
    this.onNoteNumber = function (number, handler) {
        const wrapper = data => {
            if (data.value == number) {
                handler(data);
            }
        };
        this.on("NoteOn", wrapper);
    };
    // EZ binding for key values. Can only be unbound with unbindALL()
    this.offNoteNumber = function (number, handler) {
        const wrapper = data => {
            if (data.value == number) {
                handler(data);
            }
        };
        this.on("NoteOff", wrapper);
    };
    // EZ binding for a range of key values, bind these two handlers to key value. Can only be unbound with unbindALL()
    this.keyToggleRange = function (min, max, onHandler, offHandler) {
        this.onRange(min,max,onHandler);
        this.offRange(min,max,offHandler);
    };
    this.onRange = function (min, max, onHandler, offHandler) {
        if (max > min) {
            for (var i = min; i <= max; i++) {
                this.onNoteNumber(i, onHandler);
            }
        } else {
            for (var i = max; i >= min; i--) {
                this.onNoteNumber(i, onHandler);
            }
        }
    };
    this.offRange = function (min, max, onHandler, offHandler) {
        if (max > min) {
            for (var i = min; i <= max; i++) {
                this.offNoteNumber(i, offHandler);
            }
        } else {
            for (var i = max; i >= min; i--) {
                this.offNoteNumber(i, offHandler);
            }
        }
    };
    // Removes all bound events.
    this.unbindAll = function () {
        const start = performance.now();
        this.unBindKeyboard();
        for (const event in this.listeners) {
            delete this.listeners[event];
        }
        return true;
        console.log(`Took:${performance.now()}`-start)
    };
    this.bindKeyboard = function () {
        window.addEventListener("keydown", this.keyboardKeyDown);
        window.addEventListener("keyup", this.keyboardKeyUp);
    };
    this.unBindKeyboard = function () {
        window.removeEventListener("keydown", this.keyboardKeyDown);
        window.removeEventListener("keyup", this.keyboardKeyUp);
    };
    this.keyboardKeyDown =message => {

        let newMessage = null;
        switch(message.keyCode) {
            case 90:
                newMessage = this.createMessage("NoteOn", 60);
                break;
            case 83:
                newMessage = this.createMessage("NoteOn", 61);
                break;
            case 88:
                newMessage = this.createMessage("NoteOn", 62);
                break;
            case 68:
                newMessage = this.createMessage("NoteOn", 63);
                break;
            case 67:
                newMessage = this.createMessage("NoteOn", 64);
                break;
            case 86:
                newMessage = this.createMessage("NoteOn", 65);
                break;
            case 71:
                newMessage = this.createMessage("NoteOn", 66);
                break;
            case 66:
                newMessage = this.createMessage("NoteOn", 67);
                break;
            case 72:
                newMessage = this.createMessage("NoteOn", 68);
                break;
            case 78:
                newMessage = this.createMessage("NoteOn", 69);
                break;
            case 74:
                newMessage = this.createMessage("NoteOn", 70);
                break;
            case 77:
                newMessage = this.createMessage("NoteOn", 71);
                break;
            case 188:
                newMessage = this.createMessage("NoteOn", 72);
                break;
        }
        if(newMessage!==null) {
            this.sendMidiMessage(newMessage);
        }

    };
    this.keyboardKeyUp = message => {
        let newMessage = null;
        switch(message.keyCode) {
            case 90:
                newMessage = this.createMessage("NoteOff", 60);
                break;
            case 83:
                newMessage = this.createMessage("NoteOff", 61);
                break;
            case 88:
                newMessage = this.createMessage("NoteOff", 62);
                break;
            case 68:
                newMessage = this.createMessage("NoteOff", 63);
                break;
            case 67:
                newMessage = this.createMessage("NoteOff", 64);
                break;
            case 86:
                newMessage = this.createMessage("NoteOff", 65);
                break;
            case 71:
                newMessage = this.createMessage("NoteOff", 66);
                break;
            case 66:
                newMessage = this.createMessage("NoteOff", 67);
                break;
            case 72:
                newMessage = this.createMessage("NoteOff", 68);
                break;
            case 78:
                newMessage = this.createMessage("NoteOff", 69);
                break;
            case 74:
                newMessage = this.createMessage("NoteOff", 70);
                break;
            case 77:
                newMessage = this.createMessage("NoteOff", 71);
                break;
            case 188:
                newMessage = this.createMessage("NoteOff", 72);
                break;
        }
        if(newMessage!==null) {
            this.sendMidiMessage(newMessage);
        }
    }
};
