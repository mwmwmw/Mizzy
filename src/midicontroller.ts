import { Mizzy } from "./index";
import { KEY_CODE_MAP } from "./constants";

export function pointerPositionToNote(
  e: PointerEvent,
  element: HTMLElement,
  bottom: number = 21,
  top: number = 127-18
): number {
  const rect = element.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const noteRange = top-bottom; // Piano range
  const xRatio = x / rect.width;
  return Math.floor(bottom + noteRange * xRatio); // 21 = A0
}

export function pointerPositionToXY(
  e: PointerEvent,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = rect.bottom - e.clientY;

  const xRatio = x / rect.width;
  const yRatio = y / rect.height;
  return { x: xRatio, y: yRatio };
}

export default class MIDIController {
  private mizzy: Mizzy;
  private channel: number;

  constructor(mizzy: Mizzy, channel: number = 0) {
    this.mizzy = mizzy;
    this.channel = channel;
  }
  bindKeyboard(): void {
    window.addEventListener("keydown", (e) => this.keyboardKeyDown(e));
    window.addEventListener("keyup", (e) => this.keyboardKeyUp(e));
  }

  keyboardKeyDown(event: KeyboardEvent): void {
    const note = KEY_CODE_MAP[event.code];
    if (note !== undefined) {
      this.mizzy.noteOn(note, undefined, this.channel);
    }
  }

  keyboardKeyUp(event: KeyboardEvent): void {
    const note = KEY_CODE_MAP[event.code];
    if (note !== undefined) {
      this.mizzy.noteOff(note, this.channel);
    }
  }

  bindPointer(element: HTMLElement): void {
    let isPointerDown = false;
    let lastNote: number | null = null;

    element.addEventListener("pointerdown", (e) => {
      isPointerDown = true;
      const note = pointerPositionToNote(e, element);
      lastNote = note;
      this.mizzy.noteOn(note, undefined, this.channel);
    });

    element.addEventListener("pointermove", (e) => {
      if (!isPointerDown) return;
      const note = pointerPositionToNote(e, element);
      if (note !== lastNote) {
        if (lastNote !== null) {
          this.mizzy.noteOff(lastNote, this.channel);
        }
        this.mizzy.noteOn(note, undefined, this.channel);
        lastNote = note;
      }
    });

    const endPointer = () => {
      if (isPointerDown && lastNote !== null) {
        this.mizzy.noteOff(lastNote, this.channel);
        isPointerDown = false;
        lastNote = null;
      }
    };

    element.addEventListener("pointerup", endPointer);
    element.addEventListener("pointerout", endPointer);
  }

  bindModWheel(element: HTMLElement): void {
    let isActive = false;

    const updateModWheel = (e: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const value = Math.max(
        0,
        Math.min(
          127,
          Math.floor(127 * (1 - (e.clientY - rect.top) / rect.height))
        )
      );
      this.mizzy.cc(1, value, this.channel);
    };

    element.addEventListener("pointerdown", (e) => {
      isActive = true;
      updateModWheel(e);
    });

    element.addEventListener("pointermove", (e) => {
      if (!isActive) return;
      updateModWheel(e);
    });

    const endModWheel = () => {
      isActive = false;
    };

    element.addEventListener("pointerup", endModWheel);
    element.addEventListener("pointerout", endModWheel);
  }

  bindXY(element: HTMLElement, ccX: number, ccY: number): void {
    let isActive = false;

    element.addEventListener("pointermove", (e) => {
      if (!isActive) return;
      const { x, y } = pointerPositionToXY(e, element);
      this.mizzy.cc(ccX, x, this.channel).cc(ccY, y, this.channel);
    });

    element.addEventListener("pointerup", () => {
      isActive = false;
    });
    element.addEventListener("pointerdown", () => {
      isActive = true;
    });
  }

  bindPitchBend(element: HTMLElement): void {
    let isActive = false;
    let centerY: number;

    element.addEventListener("pointerdown", (e) => {
      isActive = true;
      const rect = element.getBoundingClientRect();
      centerY = rect.top + rect.height / 2;
      updatePitchBend(e);
    });

    const updatePitchBend = (e: PointerEvent) => {
      const bendAmount = Math.max(-1, Math.min(1, (centerY - e.clientY) / 100));
      this.mizzy.pitchBend(Math.floor(8192 + bendAmount * 8191), this.channel);
    };

    element.addEventListener("pointermove", (e) => {
      if (!isActive) return;
      updatePitchBend(e);
    });

    const endPitchBend = () => {
      if (isActive) {
        this.mizzy.pitchBend(8192, this.channel);
        isActive = false;
      }
    };

    element.addEventListener("pointerup", endPitchBend);
    element.addEventListener("pointerout", endPitchBend);
  }
}
