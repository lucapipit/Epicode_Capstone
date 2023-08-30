const express = require("express");
const google = express.Router();
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
require("dotenv").config();
const authorModel = require("../models/authorModel");
const bcrypt = require("bcrypt");


google.use(
    session({
        secret: process.env.GOOGLE_SECRETKEY,
        resave: false,
        saveUninitialized: false
    })
);

google.use(passport.initialize());
google.use(passport.session());

//serializzazione e deserializzazione dell'utente

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRETKEY,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        }, (accessToken, refreshToken, profile, done) => {
            return done(null, profile)
        }
    )
)

//creazione delle rotte

google.get("/auth/google", passport.authenticate("google", { scope: ['profile', 'email'] }), (req, res) => {
    const redirectUrl = `http://localhost:3000/success?user=${encodeURIComponent(JSON.stringify(req.user))}`;
    console.log(req);
    res.redirect(redirectUrl)
});

google.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/error" }), async (req, res) => {
    const { user } = req;
    console.log(req.user);

    const isAlreadyExists = await authorModel.findOne({ "email": user._json.email });
    if (!isAlreadyExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPssw = await bcrypt.hash(user._json.given_name, salt);

        const googleUserModel = new authorModel({
            name: user._json.given_name,
            surname: user._json.family_name,
            email: user._json.email,
            password: hashedPssw,
            avatar: user._json.name,
            authorImg: user._json.picture,
            dob: new Date().toISOString().split('T')[0]
        });


        const myNewAuthor = await googleUserModel.save();
        const myAuthor = await authorModel.findOne({ "email": user._json.email });
        console.log(myAuthor);
        
        const myUser = { _id: myAuthor._id.toString(), displayName: user.displayName, authorImg: myAuthor.authorImg, provider: "Google" };
        const token = jwt.sign(myUser, process.env.JWT_SECRET);
        const redirectUrl = `http://localhost:3000/success?token=${encodeURIComponent(token)}`;
        res.redirect(redirectUrl)
    } else {
        const myAuthor = await authorModel.findOne({ "email": user._json.email });
        
        const myUser = { _id: myAuthor._id.toString(), displayName: user.displayName, authorImg: myAuthor.authorImg, provider: "Google" };
        const token = jwt.sign(myUser, process.env.JWT_SECRET);
        const redirectUrl = `http://localhost:3000/success?token=${encodeURIComponent(token)}`;
        res.redirect(redirectUrl)
    }
});

google.get("/success", (req, res) => {
    res.redirect("http://localhost:3000/")
});

module.exports = google