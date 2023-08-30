const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const authorModel = require("../models/authorModel");
const bcrypt = require("bcrypt");
const isValidAuthor = require("../middlewares/authorValidator");



router.get("/authors", async (req, res) => {

    const {page=1, pageSize=5} = req.query;
    
    try {
        const myAuthor = await authorModel.find()
            .limit(pageSize)
            .skip((page - 1)*pageSize)
            .sort({name: 1});

        res.status(200).send({
            statusCode: 200,
            author: myAuthor
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "errore nella chiamata get",
            error,
        })
    }
});

router.get("/authors/:id", async (req, res) => {
    const { id } = req.params;
    const authorExists = await authorModel.findById(id);
    if (authorExists) {
        try {
            const myAuthor = await authorModel.findById(id);
            res.status(200).send({
                statusCode: 200,
                author: myAuthor
            })
        } catch (error) {
            res.status(500).send({
                statusCode: 500,
                message: "errore nella chiamata getById",
                error
            })
        }
    }
    res.status(404).send({
        statusCode: 404,
        message: "autore non trovato"
    })

})

router.post("/authors", isValidAuthor, async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPssw = await bcrypt.hash(req.body.password, salt)

    const newAuthor = new authorModel({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPssw,
        dob: req.body.dob,
        avatar: req.body.avatar,
        authorImg: req.body.authorImg,
        role: req.body.role//metodo lungo e schematico di fornire il payload
        /* ...req.body  *///metodo ousseynou
    })

    try {
        const myNewAuthor = await newAuthor.save();

        res.status(201).send({
            statusCode: 201,
            message: "Post aggiunto con successo",
            payload: myNewAuthor,
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "errore nella chiamata post",
            error,
        })
    }
});

router.patch("/authors/:id", async (req, res) => {
    const { id } = req.params;

    const authorExists = await authorModel.findById(id);
    if (!authorExists) {
        return res.status(404).send({
            statusCode: 404,
            message: "autore non trovato",
        });
    }
    try {
        const myUpdatePayload = req.body;
        const options = { new: true };

        const authorUpdated = await authorModel.findByIdAndUpdate(
            id,
            myUpdatePayload,
            options
        );

        res.status(202).send({
            statusCode: 202,
            authorUpdated
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "errore nella chiamata post",
            error,
        })
    }

});

router.put("/author/:id", async (req, res) => {
    const { id } = req.params;
    const authorExists = authorModel.findById(id);

    if(!authorExists){
        return res.status(404).send({
            statusCode: 404,
            message: "Autore non trovato!"
        })
    }
    try {
        const authorPut = authorModel.findOneAndReplace(id);
        res.status(200).send({
            statusCode: 200,
            message: "chiamata put eseguita con successo",
            payload: authorPut
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "server internal error"
        })
    }
})

router.delete("/authors/:id", async (req, res) => {

    const { id } = req.params;
    const authorExists = await authorModel.findById(id);

    if (!authorExists) {
        return res.status(404).send({
            statusCode: 404,
            message: "autore non trovato",
        });
    }
    try {
        const authorDelete = await authorModel.findByIdAndDelete(id);
        res.status(200).send({
            statusCode: 200,
            authorDelete,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "errore nella chiamata delete",
            error,
        });
    }
});


module.exports = router