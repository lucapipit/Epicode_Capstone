const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const postModel = require("../models/postModel");
const reviewModel = require("../models/reviewModel");
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

    const { page = 1, pageSize = 2, search = "" } = req.query;

    try {
        console.log(req.header("Authorization"));
        const postsCount = await postModel.count();

        const allPostsPaged = await postModel.find().sort({ createdAt: 'desc' })
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .populate("author")
            .populate("comments")
            .populate("reviews");
        const allPosts = await postModel.find().sort({ createdAt: 'desc' })
            .populate("author")
            .populate("comments")
            .populate("reviews");

        res.status(200).send({
            statusCode: 200,
            pageSize: pageSize,
            postsCount: postsCount,
            payload: allPosts,
            payloadPaged: allPostsPaged
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
        const reviews = await reviewModel.find({postId: id})
            .populate("author");

        /* console.log(req.header("Authorization")); */
        const singlePost = await postModel.findById(id)
            .populate("author")
            .populate("comments")
            .populate("reviews");

            console.log(reviews, singlePost);

        res.status(200).send({
            statusCode: 200,
            payload:{singlePost, reviews}
        })
    } catch (error) {
        res.status(404).send({
            statusCode: 404,
            message: "nessun zost trovato!"
        })
    }
})

//GET ALL POSTS BY CATEGORY
router.get("/filter", async (req, res) => {
    const { cardiology, immunology, radiology, biotechnology, dietology, pediatrics } = req.query;

    console.log(req.query);
    try {
        const filteredPosts = await postModel.find({ tags: { $in: [cardiology, immunology, radiology, biotechnology, dietology, pediatrics] } })
            .populate("author");
        res.status(200).send({
            statusCode: 200,
            payload: filteredPosts
        })
    } catch (error) {
        res.status(404).send({
            statusCode: 404,
            message: "nessun tost trovato!"
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
    console.log(req.body);
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
});

//UPDATE the review array inside post
router.patch("/posts/review/:id", async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const myChanges = req.body;
    const options = { new: true };

    const isValid = await postModel.findById(id);

    const updatedPost = await postModel.findByIdAndUpdate(
        id,
        { $push: myChanges },
        options
    );

    res.status(202).send({
        statusCode: 202,
        updatedPost
    })
})

module.exports = router