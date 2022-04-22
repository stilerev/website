import { Router } from "express";
import { getFileStream, getFiles, getMetadata } from "../services/awsfiles";
import { sendResponse } from "../services/httpres";
import { uploadFile, deleteFile, editFile } from "../services/s3";
import fs from "fs";
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

router.patch("/image/:name", auth, (req, res) => {
    editFile(res, req.params.name, {
        name: req.body.newname,
        visible: req.body.visible
    });
})

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

    uploadFile(req, res, nameOfUpload).promise().then(val => {
        if (val) {
            fs.unlinkSync(req.file.path);

            sendResponse({
                message: config.messages.files.UPLOADED.replace("%file%", val.Key),
                status: 201
            }, res);
        }
    })
});

router.delete("/image/:name", auth, (req, res) => {
    deleteFile(res, req.params.name).promise().then(() => {

        sendResponse({
            message: config.messages.files.DELETED.replace("%file%", req.params.name.toLowerCase()),
            status: 200
        }, res);
    });
});

interface StoredImage {
    name: string;
    visible: boolean;
}

let arr: StoredImage[] = [];

export async function storeAllImages() {
    arr = [];
    return getFiles().then(async res => {
        for (let i = 0; i < res.KeyCount; i++) {
            let val = await getMetadata(res.Contents[i].Key);
            arr.push({
                name: res.Contents[i].Key,
                visible: (val.Metadata.visible === "true")
            });
        }
        return arr;
    });
}

export default router;