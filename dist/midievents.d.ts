import { WebMidi } from "./types";
import { MIDIEvent, MIDIProcessedEvent, CCHandler, KeyToggleHandlers } from "./types";
import Events, { CustomMIDIMessageEvent } from "./events";
export default class MIDIEvents extends Events {
    protected keysPressed: {
        [key: string | number]: MIDIProcessedEvent;
    };
    protected keyboardKeyPressed: {
        [key: string]: boolean;
    };
    protected boundOutputs: WebMidi.MIDIOutput[];
    protected boundInputs: WebMidi.MIDIInput[];
    protected loopback: boolean;
    protected key: string;
    constructor();
    onMIDIMessage(message: MIDIEvent, key?: string): void;
    /**
     * EZ binding for a single Control Change data. Returns an anonymous function which should be stored
     * if you want to unbind this CC later.
     */
    onCC(cc: number | string, handler: CCHandler, channel?: number | null): Function;
    /**
     * Takes the CC# and Event handler and removes the event from the listeners.
     */
    removeCC(handler: CCHandler): boolean;
    /**
     * KeyToggle will bind to all MIDI note events and execute the keyDown handler when pressed
     * and keyUp handler when released. Returns reference to the handlers for unbinding.
     *
     * @example
     * ```typescript
     * const m = new Mizzy();
     * const toggleKeys = m.keyToggle((e) => console.log(e),(e) => console.log(e));
     * // when ready to unbind
     * m.removeKeyToggle(toggleKeys);
     * ```
     */
    keyToggle(keyDown: CCHandler, keyUp: CCHandler): KeyToggleHandlers;
    /**
     * Unbinds the keyToggle using the reference created from keyToggle()
     */
    removeKeyToggle(toggles: KeyToggleHandlers): void;
    /**
     * EZ binding for individual key values. Returns a reference to the handler created for this note.
     */
    pressNoteNumber(number: number, handler: CCHandler, channel?: number | null): Function;
    /**
     * Binds a handler to a specific MIDI note number that triggers when the note is pressed.
     * Returns a reference to the handler that can be used to remove the binding later.
     *
     * @param number - The MIDI note number to bind to (0-127)
     * @param handler - The callback function that will be called when the note is pressed
     * @param channel - Optional MIDI channel to filter on (0-15). If null, listens on all channels
     * @returns A reference to the bound handler that can be passed to removePressNoteNumber()
     *
     * @example
     * ```typescript
     * const m = new Mizzy();
     * const handler = m.pressNoteNumber(60, (e) => console.log('Middle C pressed!'));
     * // when ready to unbind
     * m.removePressNoteNumber(handler);
     * ```
     */
    removePressNoteNumber(handler: CCHandler): boolean;
    releaseNoteNumber(number: number, handler: CCHandler, channel?: number | null): Function;
    removeReleaseNoteNumber(handler: CCHandler): boolean;
    /**
     * Bind keyboard splits.
     */
    keyToggleRange(min: number, max: number, onHandler: CCHandler, offHandler: CCHandler, channel?: number | null): {
        press: Function[];
        release: Function[];
    };
    /**
     * Bind keyboard splits with a range of MIDI note numbers.
     * This function allows you to set handlers for both note on and note off events within a specified range.
     *
     * @param min - The lower bound MIDI note number of the range (0-127)
     * @param max - The upper bound MIDI note number of the range (0-127)
     * @param onHandler - Callback function that handles note on events within the range
     * @param offHandler - Callback function that handles note off events within the range
     * @param channel - Optional MIDI channel to filter on (0-15). If null, listens on all channels
     * @returns An object containing arrays of bound handlers for both press and release events that can be passed to removeKeyToggleRange()
     *
     * @example
     * ```typescript
     * const m = new Mizzy();
     * const handlers = m.keyToggleRange(60, 72,
     *   (e) => console.log('Note pressed in range!'),
     *   (e) => console.log('Note released in range!')
     * );
     * // when ready to unbind
     * m.removeKeyToggleRange(handlers);
     * ```
     */
    onSplit(min: number, max: number, onHandler: CCHandler, channel?: number | null): Function[];
    /**
     * Binds a handler to a range of MIDI note numbers for note off events.
     */
    offSplit(min: number, max: number, offHandler: CCHandler, channel?: number | null): Function[];
    /**
     * Removes all bound handlers for a range of MIDI note numbers.
     */
    removeKeyToggleRange(ranges: {
        press: Function[];
        release: Function[];
    }): boolean;
    /**
     * Removes all bound handlers for all events.
     */
    unbindAll(): void;
    /**
     * Bind the computer (qwerty) keyboard to allow it to generate MIDI note on and note off messages.
     */
    bindKeyboard(channel?: number | null): void;
    /**
     * Removes the keyboard event listeners.
     */
    unBindKeyboard(channel?: number | null): void;
    /**
     * Handles the key down event from the keyboard.
     */
    keyboardKeyDown(message: KeyboardEvent, channel?: number | null): void;
    /**
     * Handles the key up event from the keyboard.
     */
    keyboardKeyUp(message: KeyboardEvent, channel?: number | null): void;
    /**
     * Sends a MIDI message to the bound outputs.
     */
    sendMidiMessage(message: CustomMIDIMessageEvent, channel?: number | null): void;
}
