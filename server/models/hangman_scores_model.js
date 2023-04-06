const mongoose = require("mongoose");

const hangmanScoresSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    wordlength: {
        type: Number,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
});

const HangmanScores = mongoose.model("HangmanScores", hangmanScoresSchema);
module.exports = HangmanScores;
