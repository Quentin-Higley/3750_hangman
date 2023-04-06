import React, { useEffect } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoginScreen from "./components/login";
import HangmanScreen from "./components/hangman";
import CreateScreen from "./components/create";
import ScoresScreen from "./components/score";

const Redirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "true") {
            navigate("/hangman");
        } else {
            navigate("/create");
        }
    });

    return null;
};

function App() {
    axios.defaults.withCredentials = true;
    return (
        <Routes>
            <Route
                path="/"
                element={<Redirect />}
            />
            <Route
                path="/login"
                element={<LoginScreen />}
            />
            <Route
                path="/create"
                element={<CreateScreen />}
            />
            <Route
                path="/hangman"
                element={<HangmanScreen />}
            />
            <Route
                path="/scores"
                element={<ScoresScreen />}
            />
        </Routes>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
