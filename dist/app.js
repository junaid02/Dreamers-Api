"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var cors = require("cors");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var multer = require("multer");
var graphqlHttp = require("express-graphql");
var schema_1 = __importDefault(require("./graphql/schema"));
var resolvers_1 = __importDefault(require("./graphql/resolvers"));
var auth_1 = __importDefault(require("./middleware/auth"));
var app = express();
var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
var fileFilter = function (req, file, cb) {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors({
    origin: "*",
}));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use(auth_1.default); //auth middleware
app.use("/graphql", graphqlHttp({
    schema: schema_1.default,
    rootValue: resolvers_1.default,
    graphiql: true,
    formatError: function (err) {
        if (!err.originalError) {
            return err;
        }
        var data = err.originalError.data;
        var message = err.message || "An error occurred.";
        var code = err.originalError.code || 500;
        return { message: message, status: code, data: data };
    },
}));
app.use(function (error, req, res, next) {
    console.log(error);
    var status = error.statusCode || 500;
    var message = error.message;
    var data = error.data;
    res.status(status).json({ message: message, data: data });
});
mongoose
    .connect("mongodb+srv://junaid:Jdboy123@cluster0.eos5w2i.mongodb.net/app")
    .then(function (result) {
    app.listen(8080);
})
    .catch(function (err) { return console.log(err); });
