"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        default: "00000000000",
    },
    password: {
        type: String,
        required: true,
    },
    groups: [
        {
            type: Object,
            ref: "Group",
        },
    ],
});
module.exports = mongoose.model("User", userSchema);
