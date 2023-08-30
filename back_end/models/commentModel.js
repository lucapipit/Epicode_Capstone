const mongoose = require("mongoose");

const commentModel = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
});

module.exports = mongoose.model("Comment", commentModel, "comments")