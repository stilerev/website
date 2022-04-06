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

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser());
app.use(images);

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
            message: "Logged in",
            status: 200,
            cookie: {
                key: "usr",
                value: crypto.createHash("sha512").update(req.body.user + "").update(process.env.RND + "").digest("hex")
            }
        }, res);
    } else {
        res.sendStatus(401);
    }
});

app.get("/admin", auth, (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "admin.html"));
});