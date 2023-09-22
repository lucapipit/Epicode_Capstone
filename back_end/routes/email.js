const express = require("express");
const { createTransport } = require("nodemailer");
const authorModel = require("../models/authorModel");

const email = express.Router();

const transporter = createTransport({
    host: "smtp.libero.it",
    port: 465 /*oppure: 25 */,
    auth: {
        user: "lucamariapipitone@libero.it",
        pass: "libIw3giihv_!"
    }
});

email.post("/mailer/welcomeMail", async (req, res) => {

    const emailOptions = {
        from: "lucamariapipitone@libero.it",
        to: req.body.email,
        text: `Benvenuto/a ${req.body.name} ${req.body.surname}. Grazie per esserti unito/a alla nostra community`,
        subject: "Welcome to the Jungle!"
    };
    const alreadyExists = await authorModel.findOne({ email: req.body.email });
    console.log(alreadyExists, req.body.email, "email.js");
    if (!alreadyExists) {
        transporter.sendMail(emailOptions, (error, info) => {
            if (error) {
                return res.status(500).send("oops email non inviata!")
            } else {
                res.send("email inviata con successo!")
            }
        });
    } else {
        return res.status(200).send("user already exists. No need welcome mail!")
    }

});

module.exports = email;