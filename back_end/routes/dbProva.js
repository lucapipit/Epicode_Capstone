const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const dbProvaModel = require("../models/dbProvaModel");


router.get("/dbprova", async (req, res) => {


    const myCounts = await dbProvaModel.countDocuments({
        /* $and: [
            { eyeColor: "brown" },
            { isActive: true }
        ]
        $or: [
            { eyeColor: "brown" },
            { eyeColor: "blue" }
        ] 
        eyeColor: {$ne: "green"}*/

        eyeColor: { $nin: ["brown", "blue"] }


    });
    const allDbRecords = await dbProvaModel.find({
        eyeColor: { $nin: ["brown", "blue"] }

    });

    try {
        res.status(200).send({
            statusCode: 400,
            counts: myCounts,
            payload: allDbRecords
        })
    } catch (error) {
        res.status(402).send({
            statusCode: 404,
            message: "nessun record trovato!"
        })
    }
});

module.exports = router