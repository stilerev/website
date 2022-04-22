"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express = require("express");
var crypto = __importStar(require("crypto"));
var cookieParser = require("cookie-parser");
var httpres_1 = require("./services/httpres");
var images_1 = __importDefault(require("./routes/images"));
var images_2 = require("./routes/images");
var auth_1 = __importDefault(require("./middleware/auth"));
var config_1 = __importDefault(require("./config"));
var app = express();
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server started on port " + port);
});
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(images_1.default);
app.use(function (req, res, next) {
    if (!req.cookies.user) {
        res.locals.admin = false;
    }
    if (config_1.default.credentials.PASSWORD_HASH === req.cookies.user) {
        res.locals.admin = true;
    }
    else {
        res.locals.admin = false;
    }
    next();
});
app.get("/", function (req, res) {
    images_2.storeAllImages().then(function (imgs) {
        res.render("index", {
            imgs: imgs
        });
    });
    res.sendStatus(200);
});
app.post("/login", function (req, res, next) {
    if (req.body.user === process.env.USR && req.body.password === process.env.PASSWORD) {
        httpres_1.sendResponse({
            message: config_1.default.messages.login.SUCCESS,
            status: 200,
            cookie: {
                key: config_1.default.user.COOKIE_NAME,
                value: crypto.createHash("sha512").update(req.body.user + "").update(process.env.RND + "").digest("hex")
            },
            redirect: "admin"
        }, res);
    }
    else {
        httpres_1.sendResponse({
            message: config_1.default.messages.login.FAIL,
            status: 401
        }, res);
    }
});
app.post("/logout", function (req, res, next) {
    if (res.locals.admin) {
        res.clearCookie(config_1.default.user.COOKIE_NAME);
        res.redirect("/");
    }
});
app.get("/admin", auth_1.default, function (req, res) {
    images_2.storeAllImages().then(function (imgs) {
        res.render("admin", {
            imgs: imgs
        });
    });
});
