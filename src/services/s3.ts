import aws = require("aws-sdk");
import fs = require("fs");
import { sendResponse } from "./httpres";
import { Request, Response } from "express";
import { config } from "dotenv";
import conf from "../config";

const BUCKET_NAME = "imagestorage"

const s3 = new aws.S3();
s3.config.signatureVersion = "v4";
s3.config.region = "eu-north-1";

//we convert all file names to lower case.

export function uploadFile(req: Request, res: Response, name: string) {
    return s3.upload({
        Bucket: BUCKET_NAME,
        Key: name.toLowerCase(),
        Body: fs.createReadStream(req.file.path),
        Metadata: {
            "visible": "true"
        }
    }, (err, data) => {
        if (err) {
            return sendResponse({
                message: `${err.message}`,
                status: 400
            }, res);
        }
    });
}

interface StoredImage {
    name: string;
    visible: boolean;
}

export function editFile(res: Response, oldName: string, image: StoredImage) {
    oldName = oldName.toLowerCase();
    image.name = image.name.toLowerCase();


    s3.copyObject({
        Bucket: BUCKET_NAME,
        CopySource: encodeURI(`/${BUCKET_NAME}/` + oldName),
        Key: image.name,
        Metadata: {
            visible: image.visible + ""
        },
        MetadataDirective: "REPLACE"
    }, (err, data) => {
        if (err) {
            return sendResponse({
                message: `${err.message}`,
                status: 400
            }, res);
        }

        if (data) {
            if (image.name === oldName) {
                return sendResponse({
                    message: `Updated file ${oldName}`,
                    status: 200
                }, res);
            }

            deleteFile(res, oldName).promise().then(() => {
                sendResponse({
                    message: conf.messages.files.RENAMED.replace("%old%", oldName).replace("%new%", image.name),
                    status: 200
                }, res);
            });
        }
    });
}

export function deleteFile(res: Response, name: string) {
    return s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: name.toLowerCase()
    }, (err, data) => {
        if (err) {
            return sendResponse({
                message: `${err.message}`,
                status: 400
            }, res);
        }
    });
}

export function getS3Instance(): aws.S3 {
    return s3;
}