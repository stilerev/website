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
var path = require("path");
var aws = require("aws-sdk");
var fs = require("fs");
var multer = require("multer");
var httpres_1 = require("./services/httpres");
var images_1 = __importDefault(require("./routes/images"));
var images_2 = require("./routes/images");
var auth_1 = __importDefault(require("./middleware/auth"));
var BUCKET_NAME = "imagestorage";
var s3 = new aws.S3();
s3.config.signatureVersion = "v4";
s3.config.region = "eu-north-1";
var upload = multer({
    dest: "uploads/"
});
var app = express();
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server started on port " + port);
});
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(images_1.default);
app.get("/", function (req, res) {
    images_2.storeAllImages().then(function (imgs) {
        res.render("index", {
            imgs: imgs
        });
    });
});
app.post("/login", function (req, res, next) {
    if (req.body.user === process.env.USR && req.body.password === process.env.PASSWORD) {
        httpres_1.sendResponse({
            message: "Logged in",
            status: 200,
            cookie: {
                key: "usr",
                value: crypto.createHash("sha512").update(req.body.user + "").update(process.env.RND + "").digest("hex")
            }
        }, res);
    }
    else {
        res.sendStatus(401);
    }
});
app.get("/admin", auth_1.default, function (req, res) {
    res.sendFile(path.join(__dirname, "../public", "admin.html"));
});
app.post("/upload/image", auth_1.default, upload.single("image"), function (req, res, next) {
    var nameOfUpload = "";
    if (!req.file) {
        httpres_1.sendResponse({
            message: "No file uploaded",
            status: 400
        }, res);
        return;
    }
    //rename file for s3 upload.
    if (req.body.name) {
        nameOfUpload = req.body.name;
        if (!path.extname(nameOfUpload)) {
            nameOfUpload += path.extname(req.file.originalname);
        }
    }
    else {
        nameOfUpload = req.file.originalname;
    }
    s3.upload({
        Bucket: BUCKET_NAME,
        Key: nameOfUpload,
        Body: fs.createReadStream(req.file.path)
    }, function (err, data) {
        if (err)
            console.log(err);
        if (data) {
            fs.unlinkSync(req.file.path);
            httpres_1.sendResponse({
                message: "Successfully uploaded file",
                status: 201
            }, res);
        }
    });
});
