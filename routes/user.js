const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const getDate = require("../utils/getDate");

router.get("/signup", (req, res) => {
    !req.user ? res.render("users/signup") : res.redirect("/");
})

router.post("/signup", catchAsync(async (req, res, next) => {
    if (!req.user) {
        try {
            const { username, password } = req.body;
            if (username.length <= 4) {
                req.flash("error", "Username must be longer than 4 characters");
                return res.redirect("/signup");
            }

            if (password.length <= 7) {
                req.flash("error", "Password must be longer than 7 characters");
                return res.redirect("/signup")
            }

            const user = new User({ username });
            const registeredUser = await User.register(user, password)
            
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash("success", "Welcome to Fitness Hub!");
                res.redirect("/");
            }) 
        }
        catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }   
    } else {
        res.redirect("/");
    }
}))

router.get("/login", (req, res) => {
    !req.user ? res.render("users/login") : res.redirect("/");
})


router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}), (req, res) => {
    const currentUser = req.user;
    const date = getDate();
    const redirectUrl = req.session.returnTo || `/diary/${date}`;
    req.flash("success", `Welcome back ${currentUser.username}!`);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully Logged Out");
    res.redirect("/");
})

module.exports = router;