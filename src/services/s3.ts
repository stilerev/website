import aws = require("aws-sdk");
import fs = require("fs");
import { sendResponse } from "./httpres";
import { Request, Response } from "express";

const BUCKET_NAME = "imagestorage"

const s3 = new aws.S3();
s3.config.signatureVersion = "v4";
s3.config.region = "eu-north-1";

//we convert all file names to lower case.

export function uploadFile(req: Request, res: Response, name: string) {
    s3.upload({
        Bucket: BUCKET_NAME,
        Key: name.toLowerCase(),
        Body: fs.createReadStream(req.file.path)
    }, (err, data) => {
        if (err) {
            return sendResponse({
                message: `${err.message}`,
                status: 400
            }, res);
        }
        if (data) {
            fs.unlinkSync(req.file.path);

            sendResponse({
                message: `Uploaded file ${name.toLowerCase()}`,
                status: 201
            }, res);
        }
    });
}

export function deleteFile(req: Request, res: Response, name: string) {
    s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: name.toLowerCase()
    }, (err, data) => {
        if (err) {
            return sendResponse({
                message: `${err.message}`,
                status: 400
            }, res);
        }

        if (data) {
            sendResponse({
                message: `Deleted file ${name.toLowerCase()}`,
                status: 200
            }, res);
        }
    });
}

export function getS3Instance(): aws.S3 {
    return s3;
}