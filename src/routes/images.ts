import { Router } from "express";
import { getFileStream, getFiles } from "../services/awsfiles";
import { sendResponse } from "../services/httpres";
import { uploadFile, deleteFile } from "../services/s3";
import auth from "../middleware/auth";

import path = require("path");
import multer = require("multer");
import config from "../config";

const upload = multer({
    dest: "uploads/"
});

const router = Router();

router.get("/image/:name", (req, res) => {
    const readStream = getFileStream(req.params.name);
    res.setHeader("Cache-Control", "max-age=" + 365 * 24 * 60 * 60);
    res.removeHeader("Pragma");
    res.removeHeader("Expires");
    readStream.pipe(res);
});

router.post("/image/:name", auth, upload.single("image"), (req, res) => {
    let nameOfUpload = req.params.name.toLowerCase();

    if (!req.file) {

        sendResponse({
            message: config.messages.files.NO_FILE,
            status: 400
        }, res);
        return;
    }

    //rename file for s3 upload.
    if (req.params.name) {
        nameOfUpload = req.params.name;
        if (!path.extname(nameOfUpload)) {
            nameOfUpload += path.extname(req.file.originalname);
        }
    } else {
        nameOfUpload = req.file.originalname;
    }

    uploadFile(req, res, nameOfUpload);
});

router.delete("/image/:name", auth, (req, res) => {
    deleteFile(res, req.params.name);
});

let arr = [];

export async function storeAllImages() {
    arr = [];
    return getFiles().then(res => {
        for (let i = 0; i < res.KeyCount; i++) {
            arr.push(res.Contents[i].Key);
        }
        return arr;
    });
}

export default router;