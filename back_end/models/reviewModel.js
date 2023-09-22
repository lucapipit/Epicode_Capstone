const mongoose = require("mongoose");

const reviewModel = new mongoose.Schema({
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
        required: false
    },
    postId: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    }


}, { timestamps: true, strict: true });

module.exports = mongoose.model("Review", reviewModel, "reviews")
