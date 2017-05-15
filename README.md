# Mizzy
Music oriented MIDI processing in Javascript

Mizzy provides an easy to use API for sending and recieving MIDI events through the [Web Midi API](https://webaudio.github.io/web-midi-api/).

For browsers that do not support the Web MIDI API, a local loopback is available allowing you to build fallback interfaces.

You can see a very simple setup [here](http://codepen.io/mwmwmw/pen/256209a05836723958494e4aa2ebc8c3)

### RoadMap / TODO

* Add Tests for static methods. 
* Loopback integration tests
* Find some way to do MIDI device testing / integration tests

* *0.0.4* - Make MIDI processing opt-in and chainable.

----------------------------------

# Usage

Having some knowledge of what MIDI is would be a good first start. [Here is a lengthly description on Instructables](http://www.instructables.com/id/What-is-MIDI/) that I recommend reading if you want to do anything with MIDI or use Mizzy in your application.

## Setting up an instance of Mizzy

Create a new instance of Mizzy, initialize it and then wait for the promise to resolve. When the promise resolves you can begin binding inputs and outputs, and sending and recieving events.

```
// instantiate an instance
var m = new Mizzy();

// initializing Mizzy returns a promise. When the promise is complete Mizzy is ready
m.initialize().then(/* do stuff */);
```
--------------------------------------
## Inputs and Outputs

As you know, MIDI is a network protocol with inputs and outputs. No doubt on your computer there is at least one MIDI Input and Output available.

You can bind to all available ports by calling

```
// ensure mizzy has initialized

m.bindToAllInputs();
m.bindToAllOutputs();

```

### I/O Best Practice
You can never really know which MIDI ports your user is using so it is best to allow them to select it in some kind of configuration panel.

Mizzy makes this easy to do.

#### Retrieve the ports
Get a list of all the available ports
```
// retrieve a list of inputs
var myInputDevices = m.inputDevices
```

#### Set the port
Add the port to the list of ports which will recieve/send messages.
```
// user has clicked some list associated with your input port
var listIndex = 1;

m.bindToInput(myInputDevices[listIndex];
```

The port is bound and should begin receiving events immediately. 

----------------------------------------------

## Events

Mizzy provides a very simple API for responding to midi events. There are lots of little helper functions to assist in responding to notes, control changes, pitchbend etc. 

### MIDIMessageEvent

Mizzy responds to, and sends, MIDIMessageEvents. For each MIDIMessageEvent sent/recieved Mizzy also does some extra processing on it for convenience and to enable loopback capabilities on browsers that do not implement MIDI.

#### Note Events

In addition to the standard MIDIMessageEvent parameters. Mizzy adds the following

* `enharmonics`: A list of note names associated with this note, eg, if you push D#, you'll get a list [D#, Eb]
* `note`: The name of this note in the current key
* `inKey`: Is this note in the specified key
* `value`: the MIDI note value (0-127)
* `velocity`: The velocity value of the note (0-127) _*note: as per the MIDI spec, a velocity of 0 is treated as a note off event_
* `frequency`: The frequency of the note (A440 tuning)
* `channel` : The channel this message was sent from

#### CC Events

* `cc`: the control change number that generated the event
* `value`: the control change value
* `ratio`: a ratio of the value from min to max (0 = 0, 127 = 1)
* `polarRatio`: a polar ratio where 0 = -1 and 127 = 1. Useful for things like binding controls to panning.
* `channel` : The channel this message was sent from

#### PitchWheel Events

Pitchwheel events are almost identical to CC events except they are higher in resolution. 

* `cc`: the control change number that generated the event
* `value`: the 14-bit pitchwheel value (0 - 16384)
* `ratio`: a ratio of the value from min to max (0 = 0, 16384 = 1)
* `polarRatio`: a polar ratio where 0 = -1 and 16384 = 1. Useful for things like binding controls to pitch ratios.
* `channel` : The channel this message was sent from


----------------------------------------------

## Receiving Events

### `m.keyToggle(onHandler, offHandler)`

The easiest one is `keyToggle` which will run the functions you pass in for each note on the keyboard pressed. 

```
m.keyToggle(/* key pressed function*/, /* key released function */);
```

### `onCC(ccNumber, handler, channel[optional])`

To respond to a control change message, pass in the CC number and a handler

`m.onCC(1, /* handle mod wheel */);`

### `onNoteNumber(number, handler, channel[optional])`

Respond to a single note, eg 

`m.onNoteNumber(60, handler)`  wait for the user to press middle c 
`m.offNoteNumber(60, handler)` fires when the user releases middle c 

### `keyToggleRange(minNoteNumber, maxNoteNumber, onHandler, offHandler, channel[optional])`

By far the most powerful. You can split up the ranges you want to bind keys to as well as listen to specific channels.

`
    m.keyToggleRange(60,72, onHandle, offHandle, 10); // toggle note on / off messages between note 60 and 72 on channel 10.
`

----------------------------------------------

## Sending Events

Sending events is almost as easy, but requires that you generate a MIDIEventMessage for the loopback first using `Mizzy.Generate`

```
      window.addEventListener("mousemove", (e)=> {
        var mod = Math.round((e.pageX / window.innerWidth) * 127); // get the mouse x as a value between 0 - 127
        var ModwheelMessage = Mizzy.Generate.CCEvent(1, mod);
        m.sendMidiMessage(ModWheelMessage, channel[optional]);
      });
```

## Generating MIDIMessageEvents with `Mizzy.Generate`

Use the static values on Mizzy to ensure you're sending the correct value for the message type. 

Some key concepts to know
* `NoteNumber`: Note numbers in MIDI area value between 0 - 127. The note numbers represent keys on the piano keyboard. Middle C for example is Midi Note Number 60. [Here is a handy chart outlining all the values](http://www.electronics.dit.ie/staff/tscarff/Music_technology/midi/midi_note_numbers_for_octaves.htm)
* `Velocity`: Is a number between 0 - 127
* `CCNumber`: Is a number between 0 - 127
* `CCValue`: Is a number between 0 - 127
* `PWValue`: Is a number between 0 - 16384

### `Mizzy.Generate.NoteEvent(Mizzy.NOTE_ON, NoteNumber, Velocity)`

This will return a new `NOTE_ON` event which can be passed to `m.sendMidiMessage(/* your new event */);

### `Mizzy.Generate.NoteEvent(Mizzy.NOTE_OFF, NoteNumber, Velocity)`

This will return a new `NOTE_OFF` event which can be passed to `m.sendMidiMessage(/* your new event */);

### `Mizzy.Generate.CCEvent(Mizzy.CONTROLCHANGE, CCNumber, CCValue)`

This will return a new `CONTROLCHANGE` event which can be passed to `m.sendMidiMessage(/* your new event */);

### `Mizzy.Generate.PitchBendEvent(Mizzy.PITCHWHEEL, PWValue)`

This will return a new `PITCHWHEEL` event which can be passed to `m.sendMidiMessage(/* your new event */);


Now you can listen for those using the functions outlined in Recieving Events.

----------------------------------------------

## Unbinding Events

Currently, there aren't a lot of ways to unbind events. This is because wrapper functions are added to your handlers to do things like make sure the right CC triggers the event.

### 'm.unbindAll()` 

unbindAll does just what you'd expect. It unbinds all of your event handlers. It does not unbind input and outputs from recieving events. I'll have more options for unbinding and muting in the future, but for now you'll need to nuke. 

----------------------------------------------

## Fake Midi Keyboard with `m.bindKeyboard(channel[optional])`

Mizzy has a helper function for binding your computer keyboard to an output and have it generate MIDI events. 

`m.bindKeyboard(channel[optional])`

This will create a "tracker style" midi keyboard with a layout like 

```
black keys =   s d   g h j
white keys =  z x c v b n m 
```
