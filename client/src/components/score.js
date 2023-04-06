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

function ScoresScreen() {
    const [scores, setScores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("loggedIn") === false) {
            navigate("/create");
        } else {
            let wordLength = localStorage.getItem("wordLength");
            console.log(wordLength);
            postCall("scores", { length: wordLength }, (res) => {
                console.log(res.data.data);
                setScores(res.data.data);
            });
        }
    }, []);

    const Scores = () => {
        if (scores.length === 0) {
            return (
                <h1>
                    No scores yet for word length{" "}
                    {localStorage.getItem("wordLength")}
                </h1>
            );
        }
        return (
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((score) => {
                        return (
                            <tr>
                                <td>{score.username}</td>
                                <td>{score.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <h1>Scores</h1>
            <Scores />
        </div>
    );
}

export default ScoresScreen;
