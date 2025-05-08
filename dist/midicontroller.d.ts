import { Mizzy } from "./index";
export declare function pointerPositionToNote(e: PointerEvent, element: HTMLElement, bottom?: number, top?: number): number;
export declare function pointerPositionToXY(e: PointerEvent, element: HTMLElement): {
    x: number;
    y: number;
};
export default class MIDIController {
    private mizzy;
    private channel;
    constructor(mizzy: Mizzy, channel?: number);
    bindKeyboard(): void;
    keyboardKeyDown(event: KeyboardEvent): void;
    keyboardKeyUp(event: KeyboardEvent): void;
    bindPointer(element: HTMLElement): void;
    bindModWheel(element: HTMLElement): void;
    bindXY(element: HTMLElement, ccX: number, ccY: number): void;
    bindPitchBend(element: HTMLElement): void;
}
