const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const postModel = require("../models/postModel");
//multer e cloudinary imports
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const crypto = require("crypto");
const verifyToken = require("../middlewares/verifyToken");

//multer
const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomUUID();//${new Date().toISOString()}-
        const fileExt = file.originalname.split(".").pop();
        cb(null, `${uniqueSuffix}.${fileExt}`)
    }
});

const uploads = multer({ storage: internalStorage });


router.post("/posts/internalUpload", uploads.single("img"), async (req, res) => {
    try {
        res.status(200).json({ img: req.file.filename })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "there are problems!!!"
        })
    }
})



//GET ALL
router.get("/posts", async (req, res) => {
    try {
        console.log(req.header("Authorization"));
        const allPosts = await postModel.find().sort({ createdAt: 'desc' })
            .populate("author")
            .populate("comments")

        res.status(200).send({
            statusCode: 200,
            payload: allPosts
        })
    } catch (error) {
        res.status(404).send({
            statusCode: 404,
            message: "nessun post trovato!"
        })
    }
})

//GET ALL BY ID
router.get("/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        console.log(req.header("Authorization"));
        const singlePost = await postModel.findById(id)
            .populate("author")
            .populate("comments")

        res.status(200).send({
            statusCode: 200,
            payload: singlePost
        })
    } catch (error) {
        res.status(404).send({
            statusCode: 404,
            message: "nessun post trovato!"
        })
    }
})


//POST a post
router.post("/posts", async (req, res) => {
    console.log(req.body);
    const newPost = new postModel({
        title: req.body.title,
        subtitle: req.body.subtitle,
        text: req.body.text,
        img: req.body.img,
        author: req.body.author,
        tags: req.body.tags
    });

    const myNewPost = newPost.save();

    res.status(201).send({
        statusCode: 201,
        payload: myNewPost
    })
});

//UPDATE a post
router.patch("/posts/:id", async (req, res) => {
    const { id } = req.params;

    const myChanges = req.body;
    const options = { new: true };

    const isValid = await postModel.findById(id);
    
    const updatedPost = await postModel.findByIdAndUpdate(
        id,
        myChanges,
        options
    );

    res.status(202).send({
        statusCode: 202,
        updatedPost
    })
})

module.exports = router