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

			for (let i = this.listeners[event].length - 1; i >= 0; i--) {
				if (this.listeners[event].length === 1) {
					if(handler == null) {
						delete this.listeners[event];
					} else {
						if(this.listeners[event] == handler) {
							delete this.listeners[event];
						}
					}
				} else {
					this.listeners[event].splice(i, 1);
					break;
				}
			}

		}
	};
}
