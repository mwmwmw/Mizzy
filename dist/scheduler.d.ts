import { Mizzy } from ".";
interface ScheduleItem {
    timestamp: number;
    data: any;
}
export declare const STATES: {
    PLAYING: string;
    WAITING_FOR_INPUT: string;
    RECORDING: string;
    STOPPED: string;
};
export default class Scheduler {
    private mizzy;
    private tickLength;
    private startTime;
    private started;
    private currentTime;
    private waitForInput;
    private loop;
    private length;
    private speed;
    private schedule;
    private currentSchedule;
    private state;
    private playing;
    private recording;
    private looped;
    private ppqn;
    private clockCount;
    private clockStartTime;
    private clockTempo;
    constructor(mizzy: Mizzy);
    serialize(): string;
    addToSchedule(data: any, timestamp?: number): void;
    reset(): ScheduleItem[];
    record(waitForInput?: boolean): void;
    play(): void;
    stop(): void;
    end(): void;
    get timeRatio(): number;
    get time(): number;
    private tick;
    seek(ratio: number): void;
    globalTimeToLocal(globalTime: number): number;
    localTimeToGlobal(localTime: number): number;
    private processSchedule;
    private getEntriesToPlay;
    private removeItemsFromSchedule;
    private trigger;
}
export {};
