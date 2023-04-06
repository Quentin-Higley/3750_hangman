const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
    idx: {
        type: Number,
        required: true,
    },
    word: {
        type: String,
        required: true,
    },
});

const Word = mongoose.model("Word", wordSchema);
module.exports = Word;
