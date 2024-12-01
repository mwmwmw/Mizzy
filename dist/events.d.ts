import { EventHandlers } from './types';
export interface CustomMIDIMessageEvent {
    data: Uint8Array;
}
export declare class CustomMIDIMessageEvent extends MIDIMessageEvent {
    data: Uint8Array;
    constructor(type: string, options?: MIDIMessageEventInit);
}
export declare const MIDIMessageEventClass: typeof CustomMIDIMessageEvent;
export default class Events {
    protected listeners: EventHandlers;
    constructor();
    on(event: string, handler: Function): Function;
    off(event: string, handler?: Function | null): boolean;
    trigger(event: string, data?: any): void;
}
