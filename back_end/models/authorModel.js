const mongoose = require("mongoose");

const authorModel = new mongoose.Schema({  
    "name": {
        "type": String,
        "required": true
    },
    "surname": {
        "type": String,
        "required": true
    },
    "email": {
        "type": String,
        "required": true,
        "unique": true
    },
    "password": {
        "type": String,
        "required": true
    },
    "dob": {
        "type": String,
        "required": true
    },
    "avatar": {
        "type": String,
        "required": true
    },
    "authorImg": {
        "type": String,
        "required": false
    },
    "role": {
        "type": String,
        "enum": ["guests, member, admin"]
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model("Author", authorModel, "authors")