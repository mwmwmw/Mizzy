export default class Events {
	constructor() {
		this.listeners = {};
	}

	// take this event name, and run this handler when it occurs
	on(event, handler) {
		if (this.listeners[event] === undefined) {
			this.listeners[event] = [handler];
		} else {
			this.listeners[event].push(handler);
		}
		return handler;
	};

	// unbind this event and handler
	off(event, handler = null) {
		if (this.listeners[event]) {
			if (handler == null) {
				for (let i = this.listeners[event].length - 1; i >= 0; i--) {
					if (this.listeners[event].length === 1) {
						delete this.listeners[event];
						return true;
					} else {
						this.listeners[event].splice(i, 1);
						return true;
					}
				}
			} else {
				for (let i = 0; i < this.listeners[event].length; i++) {
					if (this.listeners[event][i] == handler) {
						this.listeners[event].splice(i, 1);
						if(this.listeners[event].length === 0) {
							delete this.listeners[event];
						}
						return true;
					}
				}
			}
		}
		return false;
	}
}
