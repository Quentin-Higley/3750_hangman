const mongoose = require("mongoose");
require("dotenv").config();

const dbURL = process.env.MONGO_DB_URL;

const configureDB = async () => {
    try {
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = configureDB;
