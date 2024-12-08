import Clock from "./clock";
import { STATUS_TYPE_MAP } from "./constants";
import {
  afterTouch,
  cc,
  channelPressure,
  noteOff,
  noteOn,
  pitchBend,
  programChange,
  sysex,
} from "./generate";
import { MIDIMessage } from "./types";

export class Mizzy {
  private inputs: Map<string, MIDIInput> = new Map();
  private outputs: Map<string, MIDIOutput> = new Map();
  useInputs: Map<string, MIDIInput> = new Map();
  useOutputs: Map<string, MIDIOutput> = new Map();
  private listeners: Set<(msg: unknown) => void> = new Set();
  private virtualLoop: boolean = false;
  private processors: ((msg: unknown) => unknown | null)[] = [];
  private generators: (() => number[] | null)[] = [];
  private clock: Clock;

  constructor() {
    this.clock = new Clock(this);
  }

  process(fn: (msg: unknown) => unknown | null) {
    this.processors.push(fn);
    return this;
  }

  generate(fn: () => number[] | null, ticks: number[] = []) {
    this.generators.push(fn);

    ticks.forEach((tick) => {
      this.clock.onTick(tick, () => {
        this.generators.forEach((generator) => {
          const msg = generator();
          if (msg) {
            this.send(msg);
          }
        });
      });
    });

    return this;
  }

  private handleMessage(event: MIDIMessageEvent) {
    // Run through processors
    let newEvent:unknown = event;
    for (const processor of this.processors) {
      const processed = processor(event);
      if (!processed) return; // Message filtered out
      newEvent = processed;
    }

    console.log("MIDI Message", newEvent);

    // Notify listeners
    this.listeners.forEach((listener) => listener(event));
  }

  async init() {
    const access = await navigator.requestMIDIAccess();
    this.inputs = new Map(
      Array.from(access.inputs.values()).map((i) => [i.id, i])
    );
    this.outputs = new Map(
      Array.from(access.outputs.values()).map((o) => [o.id, o])
    );
  }

  // Simple device selection
  listDevices() {
    return {
      inputs: Array.from(this.inputs.values()),
      outputs: Array.from(this.outputs.values()),
    };
  }

  // Chainable interface
  useInput(inputId?: string) {
    this.useInputs.set(
      inputId ?? "",
      this.inputs.get(inputId ?? "") ?? this.inputs.values().next().value
    ).forEach((input)=>{
      input.onmidimessage = (e)=>{
        this.handleMessage(e);
      };
    });
    
    return this;
  }

  closeInput(id: string) {
    const input = this.useInputs.get(id);
    if(input){
      input.onmidimessage = null;
    }
    this.useInputs.delete(id);
    return this;
  }

  useOutput(id: string = "") {
    this.useOutputs.set(
      id,
      this.outputs.get(id) ?? this.outputs.values().next().value
    );
    return this;
  }

  closeOutput(id: string) {
    const output = this.useOutputs.get(id);
    if(output){
      output.onstatechange = null;
    }
    this.useOutputs.delete(id);
    return this;
  }

  // Enable/disable virtual loopback
  loopback(enable: boolean = true) {
    this.virtualLoop = enable;
    return this;
  }

  // Simple message sending
  send(message: number[]) {
    this.useOutputs.forEach((output) => {
      this.sendTo(output.id, message, this.virtualLoop);
    });
    return this;
  }

  // Simple message sending
  sendTo(outputId: string, message: number[], loopback: boolean = false) {
    if (loopback) {
      const event: MIDIMessageEvent = new MIDIMessageEvent("midimessage", {
        data: new Uint8Array(message),
      })
      this.handleMessage(event);
    }
    const output = this.useOutputs.get(outputId);
    if (output?.send) {
      output.send(message);
    }
    return this;
  }

  onMessage(callback: (msg: unknown) => void) {
    this.listeners.add(callback);
    return this;
  }

  noteOn(note: number, velocity = 64, channel = 0) {
    return this.send(noteOn(note, velocity, channel));
  }

  noteOff(note: number, channel = 0) {
    return this.send(noteOff(note, 0, channel));
  }

  cc(controller: number, value: number, channel = 0) {
    return this.send(cc(controller, value, channel));
  }

  programChange(program: number, channel = 0) {
    return this.send(programChange(program, channel));
  }

  pitchBend(value: number, channel = 0) {
    return this.send(pitchBend(value, channel));
  }

  aftertouch(pressure: number, channel = 0) {
    return this.send(channelPressure(pressure, channel));
  }

  polyAftertouch(note: number, pressure: number, channel = 0) {
    return this.send(afterTouch(note, pressure, channel));
  }

  sysex(data: Uint8Array) {
    return this.send(sysex(data));
  }

  panic() {
    // Send note off for every note (0-127) on every channel (0-15)
    for (let channel = 0; channel < 16; channel++) {
      for (let note = 0; note < 128; note++) {
        this.noteOff(note, channel);
      }
    }
    return this;
  }
}
