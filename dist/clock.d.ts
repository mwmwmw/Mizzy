import Events from "./events";
export default class Clock extends Events {
    private context;
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
    constructor(context?: AudioContext);
    reset(): void;
    play(index?: number, loopIndex?: number): void;
    stop(): void;
    private schedule;
    private process;
    private next;
}
