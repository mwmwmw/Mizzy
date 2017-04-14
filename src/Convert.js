export default class Convert {

	static MIDINoteToFrequency(midinote, tune = 440) {
		return tune * Math.pow(2, (midinote - 69) / 12)
	}


}
