import Events from "../Events";

const TICK_INCREMENT = 0.25;
const DEFAULT_LOOP_LENGTH = 16;
const DEFAULT_TEMPO = 120;
const TICK_LENGTH = 0.2;

export default class Clock extends Events{

	constructor (context) {
		super();
		this.context = context || new AudioContext();

		this.BPM = DEFAULT_TEMPO;
		this.tickSchedule;
		this.tick = 0;
		this.playing = false;
		this.loopIndex = 0;
		this.startClock = 0;
		this.index = 0;
		this.looplength = DEFAULT_LOOP_LENGTH;
		this.direction = 1;
		this.lastTick = 0;
	}

	reset () {

	}

	play (sync = this.context.currentTime + 0.005, index = 0, loopIndex = 0) {
		this.startClock = sync;
		this.index = index;
		this.loopIndex = loopIndex;
		this.playing = true;
		this.schedule();
	}

	stop() {
		this.playing = false;
	}

	schedule () {
		if(this.playing) {
			var playHead = this.context.currentTime - this.startClock;
			while (this.tick < playHead + TICK_LENGTH) {
				var localPlayHead = this.tick + this.startClock;
				this.process(this.index, this.loopIndex, this.tick, playHead);
				this.next();
			}
			this.tickSchedule = setTimeout(() => this.schedule(), 0);
		}
	}

	process (index, loopIndex, localTime, globalTime) {
		let tick = {
			index, loopIndex, globalTime
		}
		this.trigger("tick", tick);
	}

	next () {
		var beat = 60 / this.BPM;
		this.index++;
		this.loopIndex += this.direction;

		if(this.loopIndex > this.looplength-1) {
			this.loopIndex = 0;
		} else if(this.loopIndex < 0) {
			this.loopIndex = this.looplength-1;
		}

		this.tick += TICK_INCREMENT * beat;
	}

}