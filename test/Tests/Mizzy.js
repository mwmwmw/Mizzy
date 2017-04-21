const MIDI_NOTE_ON = 0x90;
const MIDI_NOTE_OFF = 0x80;
const MIDI_AFTERTOUCH = 0xA0;
const MIDI_CONTROL_CHANGE = 0xB0;
const MIDI_PROGRAM_CHANGE = 0xC0;
const MIDI_CHANNEL_PRESSURE = 0xD0;
const MIDI_PITCHBEND = 0xE0;

describe('Mizzy Public Constants', function () {
	it("Correct Events are used for messages", function () {
		assert.equal(Mizzy.NOTE_ON, "NoteOn");
		assert.equal(Mizzy.NOTE_OFF, "NoteOff");
		assert.equal(Mizzy.CONTROLCHANGE, "Controller");
		assert.equal(Mizzy.PITCHWHEEL, "PitchWheel");
	});
});

describe('Mizzy Generate Output', function () {
	it("Correct values are assigned for note on messages", function () {
		for(var i = 0; i < 100; i++) {
			var note = Math.floor(Math.random()*127);
			var vel = Math.floor(Math.random()*127);
			var msg = Mizzy.Generate.NoteOn(note, vel);
			assert.equal(msg[0], MIDI_NOTE_ON);
			assert.equal(msg[1], note);
			assert.equal(msg[2], vel);
		}
	});
	it("Correct values are assigned for note off messages", function () {
		for(var i = 0; i < 100; i++) {
			var note = Math.floor(Math.random()*127);
			var vel = Math.floor(Math.random()*127);
			var msg = Mizzy.Generate.NoteOff(note, vel);
			assert.equal(msg[0], MIDI_NOTE_OFF);
			assert.equal(msg[1], note);
			assert.equal(msg[2], vel);
		}
	});
	it("Correct values are assigned for aftertouch messages", function () {
		for(var i = 0; i < 100; i++) {
			var note = Math.floor(Math.random()*127);
			var vel = Math.floor(Math.random()*127);
			var msg = Mizzy.Generate.AfterTouch(note, vel);
			assert.equal(msg[0], MIDI_AFTERTOUCH);
			assert.equal(msg[1], note);
			assert.equal(msg[2], vel);
		}
	});
	it("Correct values are assigned for CC messages", function () {
		for(var i = 0; i < 100; i++) {
			var note = Math.floor(Math.random()*127);
			var vel = Math.floor(Math.random()*127);
			var msg = Mizzy.Generate.AfterTouch(note, vel);
			assert.equal(msg[0], MIDI_AFTERTOUCH);
			assert.equal(msg[1], note);
			assert.equal(msg[2], vel);
		}
	});
	it("Correct values are assigned for Program Change messages", function () {
		for(var i = 0; i < 100; i++) {
			var CC = Math.floor(Math.random()*127);
			var val = Math.floor(Math.random()*127);
			var msg = Mizzy.Generate.CC(CC, val);
			assert.equal(msg[0], MIDI_CONTROL_CHANGE);
			assert.equal(msg[1], CC);
			assert.equal(msg[2], val);
		}
	});
	it("Correct values are assigned for Channel Pressure messages", function () {
		for(var i = 0; i < 100; i++) {
			var val = Math.floor(Math.random()*127);
			var msg = Mizzy.Generate.ChannelPressure(val);
			assert.equal(msg[0], MIDI_CHANNEL_PRESSURE);
			assert.equal(msg[1], val);
		}
	});
	it("Correct values are assigned for Program Change messages", function () {
		for(var i = 0; i < 100; i++) {
			var val = Math.floor(Math.random()*127);
			var msg = Mizzy.Generate.ProgramChange(val);
			assert.equal(msg[0], MIDI_PROGRAM_CHANGE);
			assert.equal(msg[1], val);
		}
	});
	it("Correct values are assigned for Pitchbend messages", function () {
		for(var i = 0; i < 100; i++) {
			var val = 16384;
			var msg = Mizzy.Generate.PitchBend(val);
			assert.equal(msg[0], MIDI_PITCHBEND);
			assert.equal(msg[1], 1);
			assert.equal(msg[2], 1);
		}
	});

});
describe('Mizzy Instances', function () {

	it("New Mizzy Instance Created", function () {
		var m = new Mizzy();
		assert(m.loopback, true);
		assert(m.key, "C");
		assert(m.listeners instanceof Object, true);
		assert(m.keysPressed instanceof Array, true);
		assert(m.boundInputs instanceof Array, true);
		assert(m.boundOutputs instanceof Array, true);
	});

	it("New Mizzy Instance Initialized", function () {
		var m = new Mizzy();
		var x = m.initialize();
			assert(x instanceof Promise, true);
	});

});

(function (root) {

	// Store setTimeout reference so promise-polyfill will be unaffected by
	// other code modifying setTimeout (like sinon.useFakeTimers())
	var setTimeoutFunc = setTimeout;

	function noop() {}

	// Polyfill for Function.prototype.bind
	function bind(fn, thisArg) {
		return function () {
			fn.apply(thisArg, arguments);
		};
	}

	function Promise(fn) {
		if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
		if (typeof fn !== 'function') throw new TypeError('not a function');
		this._state = 0;
		this._handled = false;
		this._value = undefined;
		this._deferreds = [];

		doResolve(fn, this);
	}

	function handle(self, deferred) {
		while (self._state === 3) {
			self = self._value;
		}
		if (self._state === 0) {
			self._deferreds.push(deferred);
			return;
		}
		self._handled = true;
		Promise._immediateFn(function () {
			var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
			if (cb === null) {
				(self._state === 1 ? resolve : reject)(deferred.promise, self._value);
				return;
			}
			var ret;
			try {
				ret = cb(self._value);
			} catch (e) {
				reject(deferred.promise, e);
				return;
			}
			resolve(deferred.promise, ret);
		});
	}

	function resolve(self, newValue) {
		try {
			// Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
			if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
			if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
				var then = newValue.then;
				if (newValue instanceof Promise) {
					self._state = 3;
					self._value = newValue;
					finale(self);
					return;
				} else if (typeof then === 'function') {
					doResolve(bind(then, newValue), self);
					return;
				}
			}
			self._state = 1;
			self._value = newValue;
			finale(self);
		} catch (e) {
			reject(self, e);
		}
	}

	function reject(self, newValue) {
		self._state = 2;
		self._value = newValue;
		finale(self);
	}

	function finale(self) {
		if (self._state === 2 && self._deferreds.length === 0) {
			Promise._immediateFn(function() {
				if (!self._handled) {
					Promise._unhandledRejectionFn(self._value);
				}
			});
		}

		for (var i = 0, len = self._deferreds.length; i < len; i++) {
			handle(self, self._deferreds[i]);
		}
		self._deferreds = null;
	}

	function Handler(onFulfilled, onRejected, promise) {
		this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		this.onRejected = typeof onRejected === 'function' ? onRejected : null;
		this.promise = promise;
	}

	/**
	 * Take a potentially misbehaving resolver function and make sure
	 * onFulfilled and onRejected are only called once.
	 *
	 * Makes no guarantees about asynchrony.
	 */
	function doResolve(fn, self) {
		var done = false;
		try {
			fn(function (value) {
				if (done) return;
				done = true;
				resolve(self, value);
			}, function (reason) {
				if (done) return;
				done = true;
				reject(self, reason);
			});
		} catch (ex) {
			if (done) return;
			done = true;
			reject(self, ex);
		}
	}

	Promise.prototype['catch'] = function (onRejected) {
		return this.then(null, onRejected);
	};

	Promise.prototype.then = function (onFulfilled, onRejected) {
		var prom = new (this.constructor)(noop);

		handle(this, new Handler(onFulfilled, onRejected, prom));
		return prom;
	};

	Promise.all = function (arr) {
		var args = Array.prototype.slice.call(arr);

		return new Promise(function (resolve, reject) {
			if (args.length === 0) return resolve([]);
			var remaining = args.length;

			function res(i, val) {
				try {
					if (val && (typeof val === 'object' || typeof val === 'function')) {
						var then = val.then;
						if (typeof then === 'function') {
							then.call(val, function (val) {
								res(i, val);
							}, reject);
							return;
						}
					}
					args[i] = val;
					if (--remaining === 0) {
						resolve(args);
					}
				} catch (ex) {
					reject(ex);
				}
			}

			for (var i = 0; i < args.length; i++) {
				res(i, args[i]);
			}
		});
	};

	Promise.resolve = function (value) {
		if (value && typeof value === 'object' && value.constructor === Promise) {
			return value;
		}

		return new Promise(function (resolve) {
			resolve(value);
		});
	};

	Promise.reject = function (value) {
		return new Promise(function (resolve, reject) {
			reject(value);
		});
	};

	Promise.race = function (values) {
		return new Promise(function (resolve, reject) {
			for (var i = 0, len = values.length; i < len; i++) {
				values[i].then(resolve, reject);
			}
		});
	};

	// Use polyfill for setImmediate for performance gains
	Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
		function (fn) {
			setTimeoutFunc(fn, 0);
		};

	Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
		if (typeof console !== 'undefined' && console) {
			console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
		}
	};

	/**
	 * Set the immediate function to execute callbacks
	 * @param fn {function} Function to execute
	 * @deprecated
	 */
	Promise._setImmediateFn = function _setImmediateFn(fn) {
		Promise._immediateFn = fn;
	};

	/**
	 * Change the function to execute on unhandled rejection
	 * @param {function} fn Function to execute on unhandled rejection
	 * @deprecated
	 */
	Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
		Promise._unhandledRejectionFn = fn;
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Promise;
	} else if (!root.Promise) {
		root.Promise = Promise;
	}

})(this);