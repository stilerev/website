import "dotenv/config";

import express = require("express");
import * as crypto from "crypto";
import cookieParser = require("cookie-parser");
import path = require("path");
import fs = require("fs");
import multer = require("multer");

import { sendResponse } from "./services/httpres";
import images from "./routes/images";
import { storeAllImages } from "./routes/images";
import auth from "./middleware/auth";
import config from "./config";
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser());
app.use(images);

app.use((req, res, next) => {
    if (!req.cookies.usr) {
        res.locals.authed = false;
    }

    if (config.credentials.PASSWORD_HASH === req.cookies.usr) {
        res.locals.authed = true;
    } else {
        res.locals.authed = false;
    }

    next();
});

app.get("/", (req, res) => {
    storeAllImages().then(imgs => {
        res.render("index", {
            imgs: imgs
        });
    });
});

app.post("/login", (req, res, next) => {
    if (req.body.user === process.env.USR && req.body.password === process.env.PASSWORD) {
        sendResponse({
            message: config.messages.login.SUCCESS,
            status: 200,
            cookie: {
                key: "usr",
                value: crypto.createHash("sha512").update(req.body.user + "").update(process.env.RND + "").digest("hex")
            },
            redirect: "admin"
        }, res);
    } else {
        sendResponse({
            message: config.messages.login.FAIL,
            status: 401
        }, res);
    }
});

app.get("/admin", auth, (req, res) => {
    res.render("admin");
});