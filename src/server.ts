import "dotenv/config";

import express = require("express");
import * as crypto from "crypto";
import cookieParser = require("cookie-parser");

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
    if (!req.cookies.user) {
        res.locals.admin = false;
    }

    if (config.credentials.PASSWORD_HASH === req.cookies.user) {
        res.locals.admin = true;
    } else {
        res.locals.admin = false;
    }

    next();
});

app.get("/", (req, res) => {
    storeAllImages().then(imgs => {
        res.render("index", {
            imgs: imgs,
            title: "home"
        });
    });
});

app.post("/login", (req, res, next) => {
    if (req.body.user === process.env.USR && req.body.password === process.env.PASSWORD) {
        sendResponse({
            message: config.messages.login.SUCCESS,
            status: 200,
            cookie: {
                key: config.user.COOKIE_NAME,
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

app.post("/logout", (req, res, next) => {
    if (res.locals.admin) {
        res.clearCookie(config.user.COOKIE_NAME);
        res.redirect("/")
    }
});

app.get("/admin", auth, (req, res) => {
    storeAllImages().then(imgs => {
        res.render("admin", {
            imgs: imgs,
            title: "admin"
        });
    });
});