import { EventHandlers } from './types';

export interface CustomMIDIMessageEvent {
  data: Uint8Array;
}

export class CustomMIDIMessageEvent extends MIDIMessageEvent {
  data: Uint8Array;
  constructor(type: string, options: MIDIMessageEventInit = {}) {
      super(type);
      this.data = options.data || new Uint8Array();
  }
}

// Use type assertion to handle the potential undefined case
export const MIDIMessageEventClass: typeof CustomMIDIMessageEvent = 
  (window as any).MIDIMessageEvent || CustomMIDIMessageEvent;

export default class Events {
  protected listeners: EventHandlers;

  constructor() {
    this.listeners = {};
  }

  on(event: string, handler: Function): Function {
    if (this.listeners[event] === undefined) {
      this.listeners[event] = [handler];
    } else {
      this.listeners[event].push(handler);
    }
    return handler;
  }

  off(event: string, handler: Function | null = null): boolean {
    if (this.listeners[event]) {
      if (handler === null) {
        delete this.listeners[event];
        return true;
      }
      
      const index = this.listeners[event].indexOf(handler);
      if (index !== -1) {
        this.listeners[event].splice(index, 1);
        if (this.listeners[event].length === 0) {
          delete this.listeners[event];
        }
        return true;
      }
    }
    return false;
  }

  trigger(event: string, data?: any): void {
    if (this.listeners[event]) {
      for (let i = this.listeners[event].length - 1; i >= 0; i--) {
        if (this.listeners[event] !== undefined) {
          const handler = this.listeners[event][i];
          if (typeof handler === "function") {
            handler(data);
          } else {
            throw new Error("Event handler is not a function.");
          }
        }
      }
    }
  }
} 