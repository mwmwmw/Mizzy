var MIDIData = Mizzy.MIDIData;

describe('MIDI Data', function () {
	it("Correct bytes are used for messages", function () {
		assert.equal(MIDIData.NoteOn, 0x90);
		assert.equal(MIDIData.NoteOff, 0x80);
		assert.equal(MIDIData.AfterTouch, 0xA0);
		assert.equal(MIDIData.ControlChange, 0xB0);
		assert.equal(MIDIData.ProgramChange, 0xC0);
		assert.equal(MIDIData.ChannelPressure, 0xD0);
		assert.equal(MIDIData.PitchBend, 0xE0);
	});
})