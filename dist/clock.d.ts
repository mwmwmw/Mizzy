import { ClockTick } from "./types";
import { Mizzy } from "./index";
export default class Clock {
    private BPM;
    private tickSchedule?;
    private tick;
    private playing;
    private loopIndex;
    private startClock;
    private index;
    private looplength;
    private direction;
    private lastTick;
    private mizzy;
    private tickHandlers;
    constructor(mizzy: Mizzy);
    private handleMIDIMessage;
    now(): number;
    reset(): void;
    play(index?: number, loopIndex?: number): void;
    stop(): void;
    private schedule;
    private process;
    private next;
    onTick(tick: number, fn: (tick: ClockTick) => void): number;
    private trigger;
}
