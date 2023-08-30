const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const commentModel = require("../models/commentModel");

//GET ALL
router.get("/comments", async(req, res) => {
    try {
        const allComments = await commentModel.find()
        .populate("author", "name surname avatar email")
        .populate("post", "title subtitle")
        
        res.status(200).send({
            statusCode: 200,
            payload: allComments
        })
    } catch (error) {
        res.status(404).send({
            statusCode: 404,
            message: "nessun post trovato!"
        })
    }
})

//POST a post
router.post("/comments", async(req, res) => {
    const newComment = new commentModel({
        ...req.body
    });

    const myNewComment = newComment.save();

    res.status(201).send({
        statusCode: 201,
        payload: myNewComment
    })
});

module.exports = router