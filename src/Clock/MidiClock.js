import Clock from "./Clock";

export default class BeatClock extends Clock {

	constructor(mizzyInstance, context) {
		super(context || new AudioContext());
		this.mizzy = mizzyInstance;
		this._notes = {};

	}

	addNote(index, message) {
		if(this._notes[index] == undefined) {
			this._notes[index] = [message];
		} else {
			this._notes[index].push(message);
		}
	}

	removeNote(index, message) {

	}

	sendNotes(index) {

	}

	process (index, loopIndex, localTime, globalTime) {
		console.log(index, loopIndex)
		if(this._notes[loopIndex] != undefined) {
			this._notes[loopIndex].forEach((message)=> {
				//message.timeStamp = this.context.currentTime;
				this.mizzy.sendMidiMessage(message);
			});
		}
	}

}
