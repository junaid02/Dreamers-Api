"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
            type: Schema.Types.ObjectId,
            ref: "Group",
        },
    ],
});
module.exports = mongoose_1.default.model("User", userSchema);
