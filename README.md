# Mizzy
Music oriented MIDI processing in Javascript

Mizzy provides an easy to use API for sending and recieving MIDI events through the [Web Midi API](https://webaudio.github.io/web-midi-api/).

For browsers that do not support the Web MIDI API, a local loopback is available allowing you to build fallback interfaces.

## Installation

npm install mizzy

## Basic Usage

```javascript
import { Mizzy } from 'mizzy';
// Initialize Mizzy
const mizzy = new Mizzy();
// Connect to MIDI devices
await mizzy.init();

// quickly connect to all available devices
mizzy.connect();

// Listen for MIDI messages
mizzy.onMessage((message) => {
  console.log('Received MIDI message:', message);
});
// Send a note-on message (middle C)
mizzy.noteOn(60, 100, 1);

// Send a note-off message
mizzy.noteOff(60, 1);

// Send a control change message
mizzy.cc(1, 100, 1);

// Send a pitch bend message
mizzy.pitchBend(60, 100, 1);

// Send a program change message
mizzy.programChange(1, 1);

// and many more. 

// You can specify which devices to use
mizzy.useInput('device-id');
mizzy.useOutput('device-id');


// Get list of available MIDI input devices
const inputs = mizzy.getInputs();
console.log('Available MIDI inputs:', inputs);
// Get list of available MIDI output devices
const outputs = mizzy.getOutputs();
console.log('Available MIDI outputs:', outputs);

```

## Processors

Mizzy no longer automatically processes MIDI messages. Instead, you can use processors to process MIDI messages.

Processors are functions that can be used to process MIDI messages. They can be used to filter, modify, or transform MIDI messages.


```javascript
// Define a processor
const processor = (msg) => {
  msg = doSomething(msg);
  return msg;
}

// Add the processor to Mizzy
mizzy.addProcessor(processor);

// Remove the processor from Mizzy
mizzy.removeProcessor(processor);
```
