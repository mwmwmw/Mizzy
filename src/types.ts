
// Type declaration for potentially missing global type
declare global {
  interface Window {
      MIDIMessageEvent: typeof MessageEvent;
  }
}

export interface MIDIMessage {
  data: Uint8Array;
  timeStamp?: number;
  type?: string;
  note?: number;
  velocity?: number;
  value?: number;
  controller?: number;
  channel?: number;
  key?: string;
}

export declare namespace WebMidi {
interface MIDIAccess {
  inputs: MIDIInputMap;
  outputs: MIDIOutputMap;
}

interface MIDIInputMap extends Map<string, MIDIInput> {}
interface MIDIOutputMap extends Map<string, MIDIOutput> {}

interface MIDIInput extends MIDIPort {
  onmidimessage: ((e: MIDIMessageEvent) => void) | null;
}

interface MIDIOutput extends MIDIPort {
  send(data: Uint8Array, timestamp?: number): void;
}

interface MIDIPort {
  id: string;
  manufacturer: string;
  name: string;
  type: 'input' | 'output';
  version: string;
  state: 'connected' | 'disconnected';
  connection: 'open' | 'closed' | 'pending';
}
}


export interface MIDIEvent extends Event {
  data: Uint8Array;
  timeStamp: number;
}

export interface NoteMap {
  [key: string]: number[];
}

export interface MIDIProcessedEvent extends MIDIEvent {
  enharmonics?: string[];
  note?: string;
  inKey?: boolean;
  value?: number;
  velocity?: number;
  frequency?: number;
  channel?: number;
  cc?: string | number;
  ratio?: number;
  polarRatio?: number;
  polar?: number;
}

export interface MIDIAccess {
  inputs: Map<string, MIDIInput>;
  outputs: Map<string, MIDIOutput>;
}

export interface MIDIInput extends MIDIPort {
  onmidimessage: ((event: MIDIEvent) => void) | null;
}

export interface MIDIOutput extends MIDIPort {
  send(data: Uint8Array, timestamp?: number): void;
}

export interface MIDIPort {
  id: string;
  manufacturer: string;
  name: string;
  type: "input" | "output";
  version: string;
  state: "connected" | "disconnected";
  connection: "open" | "closed" | "pending";
}

export interface EventHandlers {
  [key: string]: Function[];
}

export interface KeyToggleHandlers {
  keyDown: (data: MIDIProcessedEvent) => void;
  keyUp: (data: MIDIProcessedEvent) => void;
}

export interface ClockTick {
  index: number;
  loopIndex: number;
  globalTime: number;
  localTime: number;
  lastTick: number;
}

export interface KeyCodeMap {
  [key: string]: number;
}

// Add these interfaces at the top
export interface CCHandler {
  (data: MIDIProcessedEvent): void;
}
