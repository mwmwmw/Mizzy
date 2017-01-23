const accidentals = {
    "C"  : "#",
    "G"  : "#",
    "D"  : "#",
    "A"  : "#",
    "E"  : "#",
    "B"  : "#",
    "Cb" : "b",
    "F#" : "#",
    "Gb" : "b",
    "C#" : "#",
    "Db" : "b",
    "Ab" : "b",
    "Eb" : "b",
    "Bb" : "b",
    "F"  : "b"
};

const keynotes = {
    "C":  ["C", "D", "E", "F", "G", "A", "B"],
    "G":  ["G", "A", "B", "C", "D", "E", "F#"],
    "D":  ["D", "E", "F#", "G", "A", "B", "C#"],
    "A":  ["A", "B", "C#", "D", "E", "F#", "G#"],
    "E":  ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "B":  ["B", "C#", "D#", "E", "F#", "G#", "A#"],
    "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
    "C#": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
    "Cb": ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
    "Gb": ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
    "Db": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
    "Ab": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
    "Eb": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
    "Bb": ["Bb", "C", "D", "Eb", "F", "G", "A"],
    "F":  ["F", "G", "A", "Bb", "C", "D", "E"]
};

const keys = ["C", "G", "D", "A", "E", "B", "Cb", "F#", "Gb", "C#", "Db", "Ab", "Eb","Bb","F"];



export default class Notation {


    static get Keys () { return keys; }
    static get KeyNotes () { return keynotes; }
    static get Accidentals () {return accidentals; }


}
