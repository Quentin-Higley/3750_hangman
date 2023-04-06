import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const sha256 = require("js-sha256").sha256;

// Create a new account
function CreateScreen() {
    const [user, setUser] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [isUser, setIsUser] = useState(false);

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function genSalt(length) {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }

    function createHashSalt(string) {
        let salt = genSalt(128);
        let pass = string;
        pass = `${pass}${salt}`;
        let hash = sha256.create();
        hash.update(pass);
        pass = hash.hex();

        const data = {
            salt: salt,
            password: pass,
        };
        return data;
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

        if (user.password !== user.confirmPassword) {
            console.log("Passwords do not match");
            setMessage("Passwords do not match");
            return;
        }

        if (user.username === "") {
            console.log("Username cannot be empty");
            setMessage("Username cannot be empty");
            return;
        }

        if (user.password === "") {
            console.log("Password cannot be empty");
            setMessage("Password cannot be empty");
            return;
        }

        if (user.confirmPassword === "") {
            console.log("Password cannot be empty");
            setMessage("Password cannot be empty");
            return;
        }

        // Check if username already exists
        postCall("user", user, (response) => {
            let data = response.data;
            if (data.res === true) {
                setMessage("Username already exists");
                return;
            }
            const { salt, password } = createHashSalt(user.password);
            console.log(`salt: ${salt}`);
            console.log(`password: ${password}`);
            const newUser = {
                username: user.username,
                password: password,
                salt: salt,
            };
            postCall("create", newUser, (response) => {
                setMessage("Account created");
                localStorage.setItem("username", user.username);
                localStorage.setItem("loggedIn", true);
                navigate("/hangman");
            });
        });
    }

    return (
        <div id="createAccount">
            <div id="createForm">
                <h1>Create New Account</h1>
                <form
                    id="createForm"
                    onSubmit={handleSubmit}
                >
                    <div id="textboxes">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            onChange={(e) => {
                                setUser({ ...user, username: e.target.value });
                            }}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="text"
                            name="password"
                            id="password"
                            onChange={(e) => {
                                setUser({ ...user, password: e.target.value });
                            }}
                        />
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="text"
                            name="confirmPassword"
                            id="confirmPassword"
                            onChange={(e) => {
                                setUser({
                                    ...user,
                                    confirmPassword: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div id="messages">
                        <p>{message}</p>
                    </div>
                    <button type="submit">Create</button>
                    <div id="account">
                        <p>Already have an account?</p>
                        <a href="/login">Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateScreen;
