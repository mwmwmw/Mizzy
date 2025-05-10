const DEFAULT_TICK_LENGTH = 20;
export const STATES = {
    PLAYING: "PLAYING",
    WAITING_FOR_INPUT: "WAITING_FOR_INPUT",
    RECORDING: "RECORDING",
    STOPPED: "STOPPED",
};
export default class Scheduler {
    constructor(mizzy) {
        // MIDI clock timing variables
        this.ppqn = 24; // Pulses per quarter note (standard MIDI clock)
        this.clockCount = 0;
        this.clockStartTime = 0;
        this.clockTempo = 120; // Default tempo in BPM
        this.mizzy = mizzy;
        this.tickLength = DEFAULT_TICK_LENGTH;
        this.startTime = Date.now();
        this.started = false;
        this.currentTime = Date.now();
        this.waitForInput = false;
        this.loop = true;
        this.length = 1000;
        this.speed = 1;
        this.schedule = [];
        this.currentSchedule = [];
        this.state = STATES.STOPPED;
        this.state = STATES.STOPPED;
        this.playing = false;
        this.recording = false;
        this.looped = -1;
        // Listen for MIDI clock messages
        this.mizzy.onMessage((msg) => {
            // MIDI clock tick is status byte 0xF8
            if (msg?.data?.[0] === 0xF8) {
                if (this.state === STATES.PLAYING) {
                    this.clockCount++;
                    // Calculate timing based on MIDI clock
                    const quarterNote = this.ppqn;
                    const currentBeat = Math.floor(this.clockCount / quarterNote);
                    if (this.clockCount === 0) {
                        this.clockStartTime = Date.now();
                    }
                    // Update current time based on MIDI clock position
                    const msPerBeat = 60000 / this.clockTempo;
                    this.currentTime = (this.clockCount / quarterNote) * msPerBeat;
                    // Process scheduled events that should trigger at current time
                    this.currentSchedule.forEach((item, index) => {
                        if (item.timestamp <= this.currentTime) {
                            this.mizzy.send(item.data);
                            this.currentSchedule.splice(index, 1);
                        }
                    });
                }
            }
            // MIDI tempo change message
            else if (msg?.data?.[0] === 0xFF && msg?.data?.[1] === 0x51) {
                // Extract tempo from MIDI tempo message
                const microsecondsPerBeat = (msg.data[2] << 16) | (msg.data[3] << 8) | msg.data[4];
                this.clockTempo = Math.round(60000000 / microsecondsPerBeat);
            }
        });
        // Listen for MIDI clock control messages
        this.mizzy.onMessage((msg) => {
            // MIDI clock control messages are status byte 0xFA-0xFC
            if (msg?.data?.[0] >= 0xFA && msg?.data?.[0] <= 0xFC) {
                switch (msg.data[0]) {
                    case 0xFA: // Start
                        this.state = STATES.PLAYING;
                        this.playing = true;
                        this.startTime = Date.now();
                        this.play();
                        break;
                    case 0xFB: // Continue
                        this.startTime = Date.now() - this.currentTime; // Resume from last position
                        this.state = STATES.PLAYING;
                        this.playing = true;
                        this.trigger("play");
                        break;
                    case 0xFC: // Stop
                        this.state = STATES.STOPPED;
                        this.playing = false;
                        this.stop();
                        break;
                }
            }
        });
    }
    serialize() {
        let schedule = [];
        this.schedule.forEach(e => {
            schedule.push(JSON.stringify(e));
        });
        return JSON.stringify(schedule);
    }
    addToSchedule(data, timestamp = this.time) {
        if (this.waitForInput && !this.started && this.recording) {
            this.state = STATES.RECORDING;
            this.started = true;
            this.startTime = Date.now();
            timestamp = this.time;
            this.trigger("record");
        }
        let newItem = {
            timestamp: timestamp,
            data: data
        };
        this.schedule.push(newItem);
        this.trigger("added", newItem);
    }
    reset() {
        const schedule = this.schedule.slice();
        this.schedule = [];
        this.currentSchedule = [];
        this.length = 1000;
        return schedule;
    }
    record(waitForInput = true) {
        if (waitForInput) {
            this.state = STATES.WAITING_FOR_INPUT;
        }
        else {
            this.state = STATES.RECORDING;
            this.trigger("record");
        }
        ;
        this.waitForInput = waitForInput;
        this.startTime = Date.now();
        this.recording = true;
    }
    play() {
        this.state = STATES.PLAYING;
        this.looped++;
        this.playing = true;
        this.currentSchedule = this.schedule.slice();
        this.startTime = Date.now();
        this.currentTime = this.time;
        this.tick();
    }
    stop() {
        if (this.recording) {
            this.started = false;
            this.length = this.time;
            this.recording = false;
            this.trigger("endRecord", this.length);
        }
        else {
            this.trigger("end");
        }
        this.state = STATES.STOPPED;
        this.playing = false;
    }
    end() {
        this.loop ? this.play() : this.stop();
    }
    get timeRatio() {
        return (this.globalTimeToLocal(Date.now()) * this.speed) / this.length;
    }
    get time() {
        return this.timeRatio * this.length;
    }
    tick() {
        if (this.timeRatio > 1) {
            this.end();
            return;
        }
        if (this.playing)
            setTimeout(this.tick.bind(this), this.tickLength);
        const items = this.processSchedule(this.time);
        this.trigger("tick", this.timeRatio, items);
        this.removeItemsFromSchedule(items);
    }
    seek(ratio) {
        const newTime = this.length * ratio;
        this.startTime = Date.now() - newTime;
    }
    globalTimeToLocal(globalTime) {
        return globalTime - this.startTime;
    }
    localTimeToGlobal(localTime) {
        return localTime + this.startTime;
    }
    processSchedule(timestamp) {
        if (timestamp < this.length) {
            return this.getEntriesToPlay(timestamp);
        }
        return [];
    }
    getEntriesToPlay(timestamp) {
        return this.currentSchedule.filter(e => {
            return e.timestamp < timestamp + this.tickLength;
        });
    }
    removeItemsFromSchedule(items) {
        items.forEach(item => {
            let index = this.currentSchedule.findIndex(scheduleItem => {
                return item === scheduleItem;
            });
            this.currentSchedule.splice(index, 1);
        });
    }
    trigger(event, ...args) {
        // this.mizzy.send();
    }
}
//# sourceMappingURL=scheduler.js.map