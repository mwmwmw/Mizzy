import { KEYBOARD_KEY_MAP } from "./constants";
export function pointerPositionToNote(e, element, bottom = 21, top = 127 - 18) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const noteRange = top - bottom; // Piano range
    const xRatio = x / rect.width;
    return Math.floor(bottom + noteRange * xRatio); // 21 = A0
}
export function pointerPositionToXY(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = rect.bottom - e.clientY;
    const xRatio = x / rect.width;
    const yRatio = y / rect.height;
    return { x: xRatio, y: yRatio };
}
export default class MIDIController {
    constructor(mizzy, channel = 0) {
        this.mizzy = mizzy;
        this.channel = channel;
    }
    bindKeyboard() {
        window.addEventListener("keydown", (e) => this.keyboardKeyDown(e));
        window.addEventListener("keyup", (e) => this.keyboardKeyUp(e));
    }
    keyboardKeyDown(event) {
        const note = KEYBOARD_KEY_MAP[event.code];
        if (note !== undefined) {
            this.mizzy.noteOn(note, undefined, this.channel);
        }
    }
    keyboardKeyUp(event) {
        const note = KEYBOARD_KEY_MAP[event.code];
        if (note !== undefined) {
            this.mizzy.noteOff(note, this.channel);
        }
    }
    bindPointer(element) {
        let isPointerDown = false;
        let lastNote = null;
        element.addEventListener("pointerdown", (e) => {
            isPointerDown = true;
            const note = pointerPositionToNote(e, element);
            lastNote = note;
            this.mizzy.noteOn(note, undefined, this.channel);
        });
        element.addEventListener("pointermove", (e) => {
            if (!isPointerDown)
                return;
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
    bindModWheel(element) {
        let isActive = false;
        const updateModWheel = (e) => {
            const rect = element.getBoundingClientRect();
            const value = Math.max(0, Math.min(127, Math.floor(127 * (1 - (e.clientY - rect.top) / rect.height))));
            this.mizzy.cc(1, value, this.channel);
        };
        element.addEventListener("pointerdown", (e) => {
            isActive = true;
            updateModWheel(e);
        });
        element.addEventListener("pointermove", (e) => {
            if (!isActive)
                return;
            updateModWheel(e);
        });
        const endModWheel = () => {
            isActive = false;
        };
        element.addEventListener("pointerup", endModWheel);
        element.addEventListener("pointerout", endModWheel);
    }
    bindXY(element, ccX, ccY) {
        let isActive = false;
        element.addEventListener("pointermove", (e) => {
            if (!isActive)
                return;
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
    bindPitchBend(element) {
        let isActive = false;
        let centerY;
        element.addEventListener("pointerdown", (e) => {
            isActive = true;
            const rect = element.getBoundingClientRect();
            centerY = rect.top + rect.height / 2;
            updatePitchBend(e);
        });
        const updatePitchBend = (e) => {
            const bendAmount = Math.max(-1, Math.min(1, (centerY - e.clientY) / 100));
            this.mizzy.pitchBend(Math.floor(8192 + bendAmount * 8191), this.channel);
        };
        element.addEventListener("pointermove", (e) => {
            if (!isActive)
                return;
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
//# sourceMappingURL=midicontroller.js.map