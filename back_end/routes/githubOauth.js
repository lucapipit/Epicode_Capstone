const express = require("express");
const github = express.Router();
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const GithubStragegy = require("passport-github2");
require("dotenv").config();
const authorModel = require("../models/authorModel");


github.use(
    session({
        secret: process.env.GITHUB_SECRETKEY,
        resave: false,
        saveUninitialized: false
    })
);

github.use(passport.initialize());
github.use(passport.session());

//serializzazione e deserializzazione dell'utente

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use(
    new GithubStragegy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_SECRETKEY,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        }, (accessToken, refreshToken, profile, done) => {
            return done(null, profile)
        }
    )
)

//creazione delle rotte

github.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {
    const redirectUrl = `http://localhost:3000/success?user=${encodeURIComponent(JSON.stringify(req.user))}`;
    res.redirect(redirectUrl)
});

github.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/" }), (req, res) => {
    const { user } = req;
    /* console.log(req.user); */
    const myUser = {displayName: user.username, provider: "GitHub"};
    console.log(myUser);
    const token = jwt.sign(myUser, process.env.JWT_SECRET);
    const redirectUrl = `http://localhost:3000/success?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl)
});

github.get("/success", (req, res) => {
    res.redirect("http://localhost:3000/")
});

module.exports = github