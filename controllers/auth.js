const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.send("Authentication Home Page");
});

// sign up view
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

router.post("/sign-up", async (req, res) => {
    const UserInDataBase = await User.findOne({ username: req.body.username });

    console.log(req.body);

    if (UserInDataBase) {
        return res.send("Username already exists, please choose another one.");
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Passwords do not match.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create(req.body);

    res.send("form submitted");
});

router.post("/sign-in", async (req, res) => {
    const UserInDataBase = await User.findOne({ username: req.body.username });
    if (!UserInDataBase) {
        return res.send("User not found");
    }
    const validPassword = bcrypt.compare(req.body.password, UserInDataBase.password);
    if (!validPassword) {
        return res.send("Invalid password");
    } else {
        return res.send("User signed in successfully");
    }
});

module.exports = router;
