const express = require("express");
const facebook = express.Router();
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const FacebookStrategy = require("passport-facebook");
require("dotenv").config();


facebook.use(
    session({
        secret: process.env.FACEBOOK_SECRETKEY,
        resave: false,
        saveUninitialized: false
    })
);

facebook.use(passport.initialize());
facebook.use(passport.session());

//serializzazione e deserializzazione dell'utente

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_SECRETKEY,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL
        }, (accessToken, refreshToken, profile, done) => {
            return done(null, profile)
        }
    )
)

//creazione delle rotte

facebook.get("/auth/facebook", passport.authenticate("facebook", { scope: [ 'public_profile,email' ] }), (req, res) => {
    const redirectUrl = `http://localhost:3000/success?user=${encodeURIComponent(JSON.stringify(req.user))}`;
    res.redirect(redirectUrl)
});

facebook.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/error" }), (req, res) => {
    const { user } = req;
    console.log(req.user);

    const token = jwt.sign(user, process.env.JWT_SECRET);
    const redirectUrl = `http://localhost:3000/success?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl)
});

facebook.get("/success", (req, res) => {
    res.redirect("http://localhost:3000/")
});

module.exports = facebook