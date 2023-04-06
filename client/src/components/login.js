import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const sha256 = require("js-sha256").sha256;

function LoginScreen() {
    const [user, setUser] = useState({ username: "", password: "" });
    const [isUser, setIsUser] = useState(false);
    const [message, setMessage] = useState("");
    const [salt, setSalt] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem("loggedIn");
        console.log(localStorage.getItem("username"));
        if (loggedIn === "true") {
            navigate("/hangman");
        }
    });

    function hash(password) {
        let hash = sha256.create();
        hash.update(password);
        return hash.hex();
    }

    function getCall(url, callback) {
        axios
            .get(`http://localhost:4000/${url}`)
            .then(callback)
            .catch(callback);
    }

    function postCall(url, data, callback) {
        axios
            .post(`http://localhost:4000/${url}`, data)
            .then(callback)
            .catch(callback);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (user.username === "") {
            setMessage("Please enter a username");
            return;
        }
        if (isUser === true && user.password === "") {
            setMessage("Please enter a password");
            return;
        }

        if (isUser === false) {
            postCall("user", user, (res) => {
                console.log(res.data);
                if (res.data.res === false) {
                    console.log("User not found");
                    setMessage("User not found");
                    return;
                }

                setSalt(res.data.salt);
                setIsUser(true);
            });
        } else if (isUser === true) {
            let pass = user.password;
            pass = `${pass}${salt}`;
            pass = hash(pass);
            console.log(`pass: ${pass}`);
            let tUser = { username: user.username, password: pass };
            postCall("login", tUser, (response) => {
                console.log(response.data);
                let data = response.data;
                if (data.res === false) {
                    localStorage.setItem("username", "");
                    localStorage.setItem("loggedIn", false);
                    console.log("Login failed");
                    setMessage("Login failed");
                    return;
                }
                console.log(user.username);
                localStorage.setItem("username", user.username);
                localStorage.setItem("loggedIn", true);
                console.log("Login successful");
                navigate("/hangman");
            });
        }
    }

    return (
        <div id="loginForm">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username"> Username: </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={user.username}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setUser({ ...user, username: e.target.value });
                            console.log(user);
                        }}
                        disabled={isUser}
                    />
                    {/* {isUser ? <PasswordBox /> : null} */}
                    <div hidden={!isUser}>
                        <label>Password:</label>
                        <input
                            type="text"
                            id="password"
                            name="password"
                            placeholder="Password"
                            onChange={(e) => {
                                setUser({ ...user, password: e.target.value });
                            }}
                        />
                    </div>
                    <button type="submit">Submit</button>
                    <div id="messages">
                        <p>{message}</p>
                    </div>
                    <div id="account">
                        <p>Don't have an account?</p>
                        <a href="/create">Create</a>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginScreen;
