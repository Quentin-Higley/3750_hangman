// requirements
const express = require("express");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const configureDatabase = require("./db/db.js");
const {
    findUser,
    loginUser,
    createUser,
    updateUser,
} = require("./controllers/user_controller.js");
const WordModel = require("./models/word_model.js");
const UserModel = require("./models/user_model.js");
const {
    CreateHangmanScores,
    getTopScores,
} = require("./controllers/score_controller.js");

// load environment variables
const app = express();
app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
    })
);
app.use(bodyParser.json());

var store = new MongoDBStore({
    uri: "mongodb+srv://QuentinHigley:iqeNLaKLjpOLKpzh@cluster0.vcxpdkn.mongodb.net/?retryWrites=true&w=majority",
    databaseName: "sessions",
    collection: "mySessions",
});

store.on("error", (error) => {
    console.log("Error connecting to session store");
    console.log(error);
});

app.use(
    session({
        secret: "keyboard cat",
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);

configureDatabase();

// Hangman BS

// Hangman class
class HangmanGame {
    constructor() {
        this.word = "";
        this.guesses = [];
        this.totalGuesses = 6;
        this.correctGuesses = [];
        this.incorrectGuesses = [];
        this.won = false;
        this.lost = false;
    }

    // set the word
    setWord(word) {
        this.word = word;
    }

    guess(letter) {
        // Check if the letter has already been guessed
        if (this.guesses.includes(letter)) {
            console.log("You already guessed that letter");
            return;
        }
        // Add the letter to the guesses array
        // this.guesses.push(letter);
        // Check if the letter is in the word
        if (this.word.includes(letter)) {
            console.log("Correct guess!");
            // this.correctGuesses.push(letter);
            // Check if the player has won
            if (this.correctGuesses.length === this.word.length) {
                this.won = true;
            }
            // get the indecies of the letter in the word
            let indecies = [];
            for (let i = 0; i < this.word.length; i++) {
                if (this.word[i] === letter) {
                    indecies.push(i);
                }
            }
            return indecies;
            // If the letter is not in the word
        } else {
            this.incorrectGuesses.push(letter);
            // Check if the player has lost
            if (this.incorrectGuesses.length === this.totalGuesses) {
                this.lost = true;
            }
        }
    }
}

const game = new HangmanGame();

// get a random word using getRandomWord
function getRandomWord(game, callback) {
    WordModel.aggregate([{ $sample: { size: 1 } }])
        .then((word) => {
            callback(game, word);
        })
        .catch((err) => {});
}

// hangman routes

// guess a letter
app.post("/hangman", (req, res) => {
    console.log(req.body);
    let indecies = game.guess(req.body.letter);
    let guessesLeft = game.totalGuesses - game.incorrectGuesses.length;
    res.send({ index: indecies, guessesLeft: guessesLeft });
});

// get word length
app.get("/hangman", (req, res) => {
    let wordLength = game.word.length;
    let guessesLeft = game.totalGuesses - game.incorrectGuesses.length;
    res.send({ length: wordLength, guessesLeft: guessesLeft });
});

// get a random word
getRandomWord(game, (game, word) => {
    game.setWord(word[0].word);
    console.log(word[0].word);
    console.log(game.word);
});

// score BS
app.post("/score", CreateHangmanScores);
app.post("/scores", getTopScores);

// User BS

// user routes
// create a user
app.post("/create", createUser);

// login a user and redirect to the hangman page
app.post("/login", loginUser);

// get a user's salt
app.post("/user", findUser);

app.get("/login", (req, res) => {
    res.send(req.session.loggedIn);
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.send("logged out");
});

// start the server
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
