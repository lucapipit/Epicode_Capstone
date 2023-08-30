const mongoose = require("mongoose");

const postModel = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: false
        }
    ],
    tags: [
        {
            type: String,
            required: false
        }
    ]

}, { timestamps: true, strict: true });

module.exports = mongoose.model("Post", postModel, "posts")
