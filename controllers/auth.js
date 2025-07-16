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
        return res.send("Username already exists, please choose another one. <a href=\"/auth/sign-up\">Try again</a>");
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Passwords do not match. <a href=\"/auth/sign-up\">Try again</a>");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
        username: req.body.username,
        password: hashedPassword
    });

    // Set session for the new user (automatically sign them in)
    req.session.user = {
        username: newUser.username,
    };
    
    req.session.save(() => {
        res.redirect("/");
    });
});

router.post("/sign-in", async (req, res) => {
    const UserInDataBase = await User.findOne({ username: req.body.username });
    if (!UserInDataBase) {
        return res.send("User not found <a href=\"/auth/sign-in\">Try again</a>");
    }
    const validPassword = await bcrypt.compare(req.body.password, UserInDataBase.password);
    if (!validPassword) {
        return res.send('Invalid password. <a href="/auth/sign-in">Try again</a>');
    } else {
        // Set session for signed in user
        req.session.user = {
            username: UserInDataBase.username,
        };
        
        req.session.save(() => {
            res.redirect("/");
        });
    }
});

// Sign out route
router.get("/sign-out", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect("/");
    });
});

module.exports = router;
