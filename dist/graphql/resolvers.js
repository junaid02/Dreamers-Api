"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var bcrypt = require("bcryptjs");
var validator = require("validator");
var User = require("../models/user");
var Group = require("../models/group");
var jwt = require("jsonwebtoken");
module.exports = {
    hello: function () {
        return {
            text: "hello",
            views: 123,
        };
    },
    createUser: function (_a, req) {
        var userInput = _a.userInput;
        return __awaiter(this, void 0, void 0, function () {
            var errors, error, existingUser, error, hashedPw, groupName, group, user, createdUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        errors = [];
                        if (!validator.isEmail(userInput.email)) {
                            errors.push({ message: "E-Mail is invalid." });
                        }
                        if (validator.isEmpty(userInput.password) ||
                            !validator.isLength(userInput.password, { min: 5 })) {
                            errors.push({ message: "Password too short!" });
                        }
                        if (errors.length > 0) {
                            error = new Error("Invalid input.");
                            error.data = errors;
                            error.code = 422;
                            throw error;
                        }
                        return [4 /*yield*/, User.findOne({ email: userInput.email })];
                    case 1:
                        existingUser = _b.sent();
                        if (existingUser) {
                            error = new Error("User exists already!");
                            throw error;
                        }
                        return [4 /*yield*/, bcrypt.hash(userInput.password, 12)];
                    case 2:
                        hashedPw = _b.sent();
                        groupName = userInput.group[0].name;
                        return [4 /*yield*/, Group.findOne({ name: groupName })];
                    case 3:
                        group = _b.sent();
                        user = new User({
                            email: userInput.email,
                            firstName: userInput.firstName,
                            lastName: userInput.lastName,
                            phoneNumber: userInput.phoneNumber,
                            password: hashedPw,
                            groups: group,
                        });
                        return [4 /*yield*/, user.save()];
                    case 4:
                        createdUser = _b.sent();
                        return [2 /*return*/, __assign(__assign({}, createdUser._doc), { _id: createdUser._id.toString() })];
                }
            });
        });
    },
    login: function (_a) {
        var email = _a.email, password = _a.password, group = _a.group;
        return __awaiter(this, void 0, void 0, function () {
            var user, error, isAdmin, error, isEqual, error, token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, User.findOne({ email: email }).populate("groups")];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            error = new Error("User not found.");
                            error.code = 401;
                            throw error;
                        }
                        //  check for admin user
                        if (!!group && (group === null || group === void 0 ? void 0 : group.name) === "admin") {
                            isAdmin = user === null || user === void 0 ? void 0 : user.groups.find(function (group) { return group.name === "admin"; });
                            //if user is not admin
                            if (!!!isAdmin) {
                                error = new Error("Authentication Failed");
                                error.code = 401;
                                throw error;
                            }
                        }
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 2:
                        isEqual = _b.sent();
                        if (!isEqual) {
                            error = new Error("Password is incorrect.");
                            error.code = 401;
                            throw error;
                        }
                        token = jwt.sign({
                            userId: user._id.toString(),
                            email: user.email,
                        }, "somesupersecretsecret", { expiresIn: "1h" });
                        return [2 /*return*/, { token: token, userId: user._id.toString() }];
                }
            });
        });
    },
};
