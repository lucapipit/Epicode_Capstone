const express = require("express");
const login = express.Router();
const bcrypt = require("bcrypt");
const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");


login.post("/login", async (req, res) => {
    console.log(req.body.password);
    const user = await authorModel.findOne({"email": req.body.email});

    if(!user){
        res.status(404).send({
            statusCode: 404,
            message: "email o password sono errati"
        });
        return
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword){
        res.status(400).send({
            statusCode: 400,
            message: "email o password sono errati"
        });
        return
    };

    //generazione token
    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        surname: user.surname,
        authorImg: user.authorImg,
        /* email: user.email,
        dob: user.dob, */
        avatar: user.avatar
    }, process.env.JWT_SECRET, {expiresIn: "3h"});

    
    res.header("Authorization", token).status(200).send({
        statusCode: 200,
        token,
        message: "Login effettuato con successo!",
        payload: `${user.name} ${user.surname}`
    })

})

module.exports = login