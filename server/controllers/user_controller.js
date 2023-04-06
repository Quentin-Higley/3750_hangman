const UserModel = require("../models/user_model.js");

exports.findUser = (req, res) => {
    UserModel.find({ username: req.body.username })
        .then((user) => {
            // console.log(user);
            let data;
            if (user.length > 0) {
                salt = user[0].salt;
                data = { message: "User found", res: true, salt: salt };
                // console.log(data);
            } else {
                data = { message: "User not found", res: false };
            }
            res.send(data);
        })
        .catch((err) => {
            console.log("here");
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving users.",
            });
        });
};

exports.loginUser = (req, res) => {
    // validate the username and password
    console.log(req.body);
    UserModel.find({ username: req.body.username, password: req.body.password })
        .then((user) => {
            let message = "";
            if (user.length > 0) {
                console.log("Login successful");
                message = "Login successful";
                req.session.user = req.body.username;
                req.session.loggedIn = true;
            } else {
                console.log("Login failed");
                message = "Login failed";
                req.session.user = null;
                req.session.loggedIn = false;
            }
            req.session.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("session saved");
                }
            });
            res.send({ message: message, loggedIn: req.session.loggedIn });
        })
        .catch((err) => {
            console.log("here");
            console.log(err);
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving users.",
            });
        });
};

exports.createUser = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }
    console.log(req.body);
    // if the user already exists, don't create a new one
    UserModel.find({ username: req.body.username })
        .then((user) => {
            console.log(user);
            if (user.length > 0) {
                console.log("User already exists");
                res.send(false);
                return;
            }
            console.log("here");
            // Create a User
            const newUser = new UserModel({
                username: req.body.username,
                password: req.body.password,
                salt: req.body.salt,
            });
            console.log(newUser);
            // Save User in the database
            UserModel.create(newUser)
                .then((data) => {
                    req.session.user = req.body.username;
                    req.session.loggedIn = true;
                    req.session.save((err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("session saved");
                        }
                    });
                    res.send(data);
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message ||
                            "Some error occurred while creating the User.",
                    });
                });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving users.",
            });
        });
};
