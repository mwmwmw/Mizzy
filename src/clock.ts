import { ClockTick, MIDIMessage } from "./types";
import { Mizzy } from "./index";

const TICK_INCREMENT = 0.25;
const DEFAULT_LOOP_LENGTH = 16;
const DEFAULT_TEMPO = 120;
const TICK_LENGTH = 0.2;

export default class Clock {
  private BPM: number;
  private tickSchedule?: ReturnType<typeof requestAnimationFrame>;
  private tick: number;
  private playing: boolean;
  private loopIndex: number;
  private startClock: number;
  private index: number;
  private looplength: number;
  private direction: number;
  private lastTick: number;
  private mizzy: Mizzy;
  private tickHandlers: { [key: number]: ((tick: ClockTick) => void)[] } = {};

  constructor(mizzy: Mizzy) {
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
    this.mizzy.onMessage((msg: any) => this.handleMIDIMessage(msg));
  }

  private handleMIDIMessage(msg: MIDIMessage): void {
    if (msg.type === 'start') {
      this.play();
    } else if (msg.type === 'stop') {
      this.stop();
    }
  }

  now(): number {
    return performance.now() / 1000;
  }

  reset(): void {
    this.index = 0;
    this.loopIndex = 0;
  }

  play(index: number = 0, loopIndex: number = 0): void {
    this.tick = 0;
    this.startClock = this.now() + 0.005;
    this.index = index;
    this.loopIndex = loopIndex;
    this.playing = true;
    this.schedule();
  }

  stop(): void {
    this.playing = false;
    if (this.tickSchedule) {
      clearTimeout(this.tickSchedule);
    }
    this.mizzy.panic();
  }

  private schedule(): void {
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

  private process(index: number, loopIndex: number, localTime: number, globalTime: number): void {
    const tick: ClockTick = {
      index,
      loopIndex,
      globalTime,
      localTime,
      lastTick: this.lastTick,
    };
    this.lastTick = globalTime;
    this.trigger(tick);
  }

  private next(): void {
    const beat = 60 / this.BPM;
    this.index++;
    this.loopIndex += this.direction;

    if (this.loopIndex > this.looplength - 1) {
      this.loopIndex = 0;
    } else if (this.loopIndex < 0) {
      this.loopIndex = this.looplength - 1;
    }

    this.tick += TICK_INCREMENT * beat;
  }

  onTick( tick: number,fn: (tick: ClockTick) => void): number {
    if (!this.tickHandlers[tick]) {
      this.tickHandlers[tick] = [];
    }
    this.tickHandlers[tick].push(fn);
    return tick;
  }

  private trigger(tick: ClockTick): void {
    if (this.tickHandlers[tick.index]) {
      this.tickHandlers[tick.index].forEach(handler => handler(tick));
    }
  }
}