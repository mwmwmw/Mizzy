const TICK_INCREMENT = 0.25;
const DEFAULT_LOOP_LENGTH = 16;
const DEFAULT_TEMPO = 120;
const TICK_LENGTH = 0.2;
export default class Clock {
    constructor(mizzy) {
        this.tickHandlers = {};
        this.mizzy = mizzy;
        this.BPM = DEFAULT_TEMPO;
        this.tick = 0;
        this.playing = false;
        this.loopIndex = 0;
        this.startClock = 0;
        this.index = 0;
        this.looplength = DEFAULT_LOOP_LENGTH;
        this.direction = 1;
        this.lastTick = 0;
        this.mizzy.onMessage((msg) => this.handleMIDIMessage(msg));
    }
    handleMIDIMessage(msg) {
        if (msg.type === 'start') {
            this.play();
        }
        else if (msg.type === 'stop') {
            this.stop();
        }
    }
    now() {
        return performance.now() / 1000;
    }
    reset() {
        this.index = 0;
        this.loopIndex = 0;
    }
    play(index = 0, loopIndex = 0) {
        this.tick = 0;
        this.startClock = this.now() + 0.005;
        this.index = index;
        this.loopIndex = loopIndex;
        this.playing = true;
        this.schedule();
    }
    stop() {
        this.playing = false;
        if (this.tickSchedule) {
            clearTimeout(this.tickSchedule);
        }
        this.mizzy.panic();
    }
    schedule() {
        if (this.playing) {
            const playHead = this.now() - this.startClock;
            while (this.tick < playHead + TICK_LENGTH) {
                const localPlayHead = this.tick + this.startClock;
                this.process(this.index, this.loopIndex, localPlayHead, playHead);
                this.next();
            }
            // Use requestAnimationFrame for better timing accuracy and performance
            this.tickSchedule = requestAnimationFrame(() => this.schedule());
        }
    }
    process(index, loopIndex, localTime, globalTime) {
        const tick = {
            index,
            loopIndex,
            globalTime,
            localTime,
            lastTick: this.lastTick,
        };
        this.lastTick = globalTime;
        this.trigger(tick);
    }
    next() {
        const beat = 60 / this.BPM;
        this.index++;
        this.loopIndex += this.direction;
        if (this.loopIndex > this.looplength - 1) {
            this.loopIndex = 0;
        }
        else if (this.loopIndex < 0) {
            this.loopIndex = this.looplength - 1;
        }
        this.tick += TICK_INCREMENT * beat;
    }
    onTick(tick, fn) {
        if (!this.tickHandlers[tick]) {
            this.tickHandlers[tick] = [];
        }
        this.tickHandlers[tick].push(fn);
        return tick;
    }
    trigger(tick) {
        if (this.tickHandlers[tick.index]) {
            this.tickHandlers[tick.index].forEach(handler => handler(tick));
        }
    }
}
//# sourceMappingURL=clock.js.map