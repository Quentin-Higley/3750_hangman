const HangmanScores = require("../models/hangman_scores_model");

exports.CreateHangmanScores = (req, res) => {
    // Create a HangmanScores
    console.log(req.body);
    const newScore = new HangmanScores({
        username: req.body.username,
        score: req.body.score,
        wordlength: req.body.length,
    });
    HangmanScores.create(newScore)
        .then((data) => {
            console.log(`in post route /scores \n ${data}`);
            res.send({ success: true, message: "Score added successfully" });
        })
        .catch((err) => {
            console.log(err);
            res.send({ success: false, message: "Score not added" });
        });
};

// get top 10 scores for a given word length
exports.getTopScores = (req, res) => {
    console.log(req.body);
    HangmanScores.find({ wordlength: req.body.length })
        .sort({ score: -1 })
        .limit(10)
        .then((data) => {
            console.log(data);
            res.send({ success: true, data: data });
        })
        .catch((err) => {
            console.log(err);
            res.send({ success: false, message: "Score not added" });
        });
};
