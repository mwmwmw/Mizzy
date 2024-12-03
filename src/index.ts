import Clock from "./clock"
import { STATUS_TYPE_MAP } from "./constants"
import { afterTouch, cc, channelPressure, noteOff, noteOn, pitchBend, programChange, sysex } from "./generate"
import { MIDIMessage } from "./types"

export class Mizzy {
  private inputs: Map<string, MIDIInput> = new Map()
  private outputs: Map<string, MIDIOutput> = new Map()
  private useInputs: Map<string, MIDIInput> = new Map()
  private useOutputs: Map<string, MIDIOutput> = new Map()
  private listeners: Set<(msg: MIDIMessage) => void> = new Set()
  private virtualLoop: boolean = false
  private processors: ((msg: MIDIMessage) => MIDIMessage | null)[] = []
  private generators: (() => MIDIMessage | null)[] = []
  private clock: Clock

  constructor() {
    this.clock = new Clock(this);
  }

  process(fn: (msg: MIDIMessage) => MIDIMessage | null) {
    this.processors.push(fn)
    return this
  }

  generate(fn: () => MIDIMessage | null, tick : number = 0) {
    this.generators.push(fn)
    
    this.clock.onTick(tick,() => {
        this.generators.forEach(generator => {
          const msg = generator();
          if (msg) {
            this.send(this.messageToBytes(msg))
          }
        })
    })
    
    return this
  }

  private handleMessage(rawMessage: number[]) {
    let status = rawMessage[0] & 0xF0;
    let msg: MIDIMessage = {
      data: new Uint8Array(rawMessage),
      type: STATUS_TYPE_MAP[status as keyof typeof STATUS_TYPE_MAP],
      channel: rawMessage[0] & 0x0F,
      note: rawMessage[1],
      velocity: rawMessage[2],
      value: rawMessage[2],
      controller: rawMessage[1]
    }
    
    // Run through processors
    for (const processor of this.processors) {
      const processed = processor(msg)
      if (!processed) return // Message filtered out
      msg = processed
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(msg))
  }

  // Helper to convert MIDIMessage to byte array
  private messageToBytes(msg: MIDIMessage): number[] {
    // Convert structured message back to bytes
    switch (msg.type) {
      case 'noteon':
        return noteOn(msg.note ?? 60, msg.velocity ?? 64, msg.channel ?? 0);
      case 'noteoff':
        return noteOff(msg.note ?? 60, msg.velocity ?? 64, msg.channel ?? 0);
      case 'cc':
        return cc(msg.controller ?? 0, msg.value ?? 0, msg.channel ?? 0 );
      case 'pitchbend':
        return pitchBend(msg.value ?? 0, msg.channel ?? 0);
      case 'aftertouch':
        return afterTouch(msg.note ?? 60, msg.value ?? 0, msg.channel ?? 0);
      case 'channelpressure': 
        return channelPressure(msg.value ?? 0, msg.channel ?? 0);
      case 'program':
        return programChange(msg.value ?? 0, msg.channel ?? 0);
      case 'sysex':
        return sysex(msg.data)
      default:
        throw new Error(`Unknown message type: ${msg.type}`)
    }
  }

  // Simple device selection
  async listDevices() {
    const access = await navigator.requestMIDIAccess();
    return {
      inputs: Array.from(access.inputs.values()).map(i => ({ id: i.id, name: i.name })),
      outputs: Array.from(access.outputs.values()).map(o => ({ id: o.id, name: o.name }))
    }
  }

  // Chainable interface
  use(inputId?: string) {
    this.useInputs.set(inputId ?? '', this.inputs.get(inputId ?? '') ?? this.inputs.values().next().value)
    return this
  }

  output(outputId?: string) {
    this.useOutputs.set(outputId ?? '', this.outputs.get(outputId ?? '') ?? this.outputs.values().next().value)
    return this
  }

  // Enable/disable virtual loopback
  loopback(enable: boolean = true) {
    this.virtualLoop = enable
    return this
  }

  // Simple message sending
  send(message: number[]) {
    if (this.virtualLoop) {
      this.handleMessage(message)
    }
    // Send to selected output(s)
    return this
  }
  // Easy message handling
  onMessage(callback: (msg: MIDIMessage) => void) {
    this.listeners.add(callback)
    return this
  }

  noteOn(note: number, velocity = 64, channel = 0) {
    return this.send(noteOn(note, velocity, channel))
  }

  noteOff(note: number, channel = 0) {
    return this.send(noteOff(note, 0, channel))
  }

  cc(controller: number, value: number, channel = 0) {
    return this.send(cc(controller, value, channel))
  }

  programChange(program: number, channel = 0) {
    return this.send(programChange(program, channel))
  }

  pitchBend(value: number, channel = 0) {
    return this.send(pitchBend(value, channel))
  }

  aftertouch(pressure: number, channel = 0) {
    return this.send(channelPressure(pressure, channel))
  }

  polyAftertouch(note: number, pressure: number, channel = 0) {
    return this.send(afterTouch(note, pressure, channel))
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