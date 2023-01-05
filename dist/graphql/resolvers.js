"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");
const Group = require("../models/group");
const jwt = require("jsonwebtoken");
const resolvers = {
    hello() {
        return {
            text: "hello",
            views: 123,
        };
    },
    createUser: async function ({ userInput }, req) {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: "E-Mail is invalid." });
        }
        if (validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: "Password too short!" });
        }
        if (errors.length > 0) {
            const error = new Error("Invalid input.");
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            const error = new Error("User exists already!");
            throw error;
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const groupName = userInput.group[0].name;
        const group = await Group.findOne({ name: groupName });
        const user = new User({
            email: userInput.email,
            firstName: userInput.firstName,
            lastName: userInput.lastName,
            phoneNumber: userInput.phoneNumber,
            password: hashedPw,
            groups: group,
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
    login: async function ({ email, password, group }) {
        const user = await User.findOne({ email: email }).populate("groups");
        if (!user) {
            const error = new Error("User not found.");
            error.code = 401;
            throw error;
        }
        //  check for admin user
        if (!!group && (group === null || group === void 0 ? void 0 : group.name) === "admin") {
            const isAdmin = user === null || user === void 0 ? void 0 : user.groups.find((group) => group.name === "admin");
            //if user is not admin
            if (!!!isAdmin) {
                const error = new Error("Authentication Failed");
                error.code = 401;
                throw error;
            }
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Password is incorrect.");
            error.code = 401;
            throw error;
        }
        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email,
        }, "somesupersecretsecret", { expiresIn: "1h" });
        return { token: token, userId: user._id.toString() };
    },
};
exports.default = resolvers;
