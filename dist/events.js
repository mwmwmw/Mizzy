export class CustomMIDIMessageEvent extends MIDIMessageEvent {
    constructor(type, options = {}) {
        super(type);
        this.data = options.data || new Uint8Array();
    }
}
// Use type assertion to handle the potential undefined case
export const MIDIMessageEventClass = window.MIDIMessageEvent || CustomMIDIMessageEvent;
export default class Events {
    constructor() {
        this.listeners = {};
    }
    on(event, handler) {
        if (this.listeners[event] === undefined) {
            this.listeners[event] = [handler];
        }
        else {
            this.listeners[event].push(handler);
        }
        return handler;
    }
    off(event, handler = null) {
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
    trigger(event, data) {
        if (this.listeners[event]) {
            for (let i = this.listeners[event].length - 1; i >= 0; i--) {
                if (this.listeners[event] !== undefined) {
                    const handler = this.listeners[event][i];
                    if (typeof handler === "function") {
                        handler(data);
                    }
                    else {
                        throw new Error("Event handler is not a function.");
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=events.js.map