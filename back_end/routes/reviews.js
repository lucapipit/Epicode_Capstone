const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const reviewModel = require("../models/reviewModel");


router.get("/reviews", async (req, res) => {
    try {
        const allReviews = await reviewModel.find();

        res.status(200).send({
            statusCode: 200,
            payload: allReviews
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "problemi con nella route get"
        })
    }
});

router.get("/reviews/:id", async (req, res) => {
    const { id } = req.body;
    try {
        await reviewModel.findById(id)
        res.status(200).send({
            statusCode: 200,
            payload
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "problemi con nella route get by id"
        })
    }
});

router.post("/reviews", async (req, res) => {
    console.log(req.body);
    try {
        const newReview = new reviewModel({
            title: req.body.title,
            text: req.body.text,
            author: req.body.author,
            postId: req.body.postId
        });

        const newRev = await newReview.save();
        if (newRev) {
            const reviewId = newRev._id;
            res.status(200).send({
                statusCode: 200,
                reviewId: reviewId
            })
        }
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "problemi nella route post"
        })
    }
});


module.exports = router