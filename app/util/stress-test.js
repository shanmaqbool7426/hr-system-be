const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
var { MONGO_DB_URI } = require("./config")
mongoose.connect(MONGO_DB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.info("Database Connected successfully");
});
const User = require("../models/user")

const Seed = async () => {
    let index = 0
    while (index < 5001) {
        await User.create({
            firstName: `User ${index}`,
            lastName: '',
            email: `user${index}@zaffre.com`,
            company: '662a8832a1c3b321206ba538',
        })
        index++
    }

    console.info("Database is seeded");
    process.exit()
}

Seed()