import Events from "./events";
import { ClockTick } from "./types";

const TICK_INCREMENT = 0.25;
const DEFAULT_LOOP_LENGTH = 16;
const DEFAULT_TEMPO = 120;
const TICK_LENGTH = 0.2;

export default class Clock extends Events {
  private context: AudioContext;
  private BPM: number;
  private tickSchedule?: number;
  private tick: number;
  private playing: boolean;
  private loopIndex: number;
  private startClock: number;
  private index: number;
  private looplength: number;
  private direction: number;
  private lastTick: number;

  constructor(context?: AudioContext) {
    super();
    this.context = context || new window.AudioContext();
    this.BPM = DEFAULT_TEMPO;
    this.tick = 0;
    this.playing = false;
    this.loopIndex = 0;
    this.startClock = 0;
    this.index = 0;
    this.looplength = DEFAULT_LOOP_LENGTH;
    this.direction = 1;
    this.lastTick = 0;
  }

  reset(): void {
    this.index = 0;
    this.loopIndex = 0;
  }

  play(index: number = 0, loopIndex: number = 0): void {
    this.tick = 0;
    this.startClock = this.context.currentTime + 0.005;
    this.index = index;
    this.loopIndex = loopIndex;
    this.playing = true;
    this.trigger("play", this.context.currentTime + 0.005);
    this.schedule();
  }

  stop(): void {
    this.trigger("stop");
    this.playing = false;
    if (this.tickSchedule) {
      clearTimeout(this.tickSchedule);
    }
  }

  private schedule(): void {
    if (this.playing) {
      const playHead = this.context.currentTime - this.startClock;
      while (this.tick < playHead + TICK_LENGTH) {
        const localPlayHead = this.tick + this.startClock;
        this.process(this.index, this.loopIndex, localPlayHead, playHead);
        this.next();
      }
      this.tickSchedule = setTimeout(() => this.schedule(), 0);
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
    this.trigger("tick", tick);
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
} 