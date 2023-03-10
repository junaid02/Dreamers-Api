"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const graphqlHttp = require("express-graphql");
const schema_1 = __importDefault(require("./graphql/schema"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const auth_1 = __importDefault(require("./middleware/auth"));
const app = (0, express_1.default)();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
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
app.use("/images", express_1.default.static(path.join(__dirname, "images")));
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use((req, res, next) => {
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
    formatError(err) {
        if (!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || "An error occurred.";
        const code = err.originalError.code || 500;
        return { message: message, status: code, data: data };
    },
}));
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});
mongoose
    .connect("mongodb+srv://junaid:Jdboy123@cluster0.eos5w2i.mongodb.net/app")
    .then((result) => {
    app.listen(8080);
})
    .catch((err) => console.log(err));
