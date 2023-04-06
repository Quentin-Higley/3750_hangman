import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function getCall(url, callback) {
    axios.get(`http://localhost:4000/${url}`).then(callback).catch(callback);
}
function postCall(url, data, callback) {
    axios
        .post(`http://localhost:4000/${url}`, data)
        .then(callback)
        .catch(callback);
}

function HangmanScreen() {
    // create words for DB
    const [length, setLength] = useState(0);
    const [guessesLeft, setGuessesLeft] = useState(0);
    const [word, setWord] = useState("");
    const [messages, setMessages] = useState("");

    const [letter, setLetter] = useState("");
    const navigate = useNavigate();
    const guessMessages = [
        "",
        "You guessed correctly!",
        "You guessed incorrectly!",
        "You have 0 guesses left. You lose!",
    ];

    useEffect(() => {
        console.log(localStorage.getItem("loggedIn"));
        console.log(localStorage.getItem("username"));
        if (
            localStorage.getItem("loggedIn") === "false" ||
            localStorage.getItem("loggedIn") === null
        ) {
            navigate("/create");
        } else {
            getCall("hangman", (res) => {
                setLength(res.data.length);
                setGuessesLeft(res.data.guessesLeft);
                // set tWord to _ for each letter
                let tWord = "";
                for (let i = 0; i < res.data.length; i++) {
                    tWord += "_";
                }
                // console.log(tWord);
                setWord(tWord);
            });
        }
    }, []);

    function handleClick(e) {
        e.preventDefault();
        if (letter.length === 0) {
            console.log("Please enter a letter");
            return;
        }
        postCall("hangman", { letter: letter }, (res) => {
            console.log(res.data);
            let tWord = word;
            if (res.data.guessesLeft.length === 0) {
                // navigate to scores screen
                navigate("/scores");
                setMessages("You have 0 guesses left. You lose!");
            } else {
                setGuessesLeft(res.data.guessesLeft);
                setMessages(guessMessages[1]);
            }

            if (res.data.index.length != 0) {
                // letter is in word
                // update word
                console.log("here");

                console.log(tWord);
                for (let i = 0; i < res.data.index.length; i++) {
                    let idx = res.data.index[i];
                    tWord = tWord.slice(0, idx) + letter + tWord.slice(idx + 1);
                }
                // console.log(tWord);
                setWord(tWord);
                setMessages(guessMessages[1]);
            }
            if (tWord.indexOf("_") === -1) {
                // navigate to scores screen
                console.log(localStorage.getItem("username"));
                postCall(
                    "score",
                    {
                        username: localStorage.getItem("username"),
                        score: guessesLeft,
                        length: length,
                    },
                    (res) => {
                        console.log(res.data);
                        localStorage.setItem("wordLength", length);
                        navigate("/scores");
                    }
                );
            }
        });
    }

    const Boxes = () => (
        <div className="boxes">
            {Array.from({ length: length }, (v, i) => (
                <div
                    key={i}
                    className="box"
                >
                    <p>{word[i]}</p>
                </div>
            ))}
        </div>
    );

    const Guesses = () => {
        return (
            <div>
                <div className="messages">
                    <p>{messages}</p>
                </div>
                <div className="guesses">
                    <p>
                        You have <span>{guessesLeft}</span> guesses left!
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="hangman">
            <button
                id="logout"
                onClick={(e) => {
                    e.preventDefault();
                    localStorage.setItem("username", "");
                    localStorage.setItem("loggedIn", false);
                    navigate("/login");
                }}
            >
                logout
            </button>
            <h1>Hangman</h1>
            <Boxes />
            <Guesses />
            <div className="guessing">
                <label htmlFor="guess">Guess a letter</label>
                <input
                    type="text"
                    name="letter"
                    id="letter"
                    maxLength={1}
                    onChange={(e) => {
                        setLetter(e.target.value.toLowerCase());
                    }}
                />
                <button
                    type="submit"
                    onClick={handleClick}
                >
                    Guess
                </button>
            </div>
        </div>
    );
}
export default HangmanScreen;
