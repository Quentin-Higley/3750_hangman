const WordModel = require("../models/word_model.js");

exports.addWord = (req, res) => {
    WordModel.create(req.body)
        .then((word) => {
            res.send(word);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving users.",
            });
        });
};
