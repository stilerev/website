import aws = require("aws-sdk");
import fs = require("fs");
import { sendResponse } from "./httpres";
import { Request, Response } from "express";

const BUCKET_NAME = "imagestorage"

const s3 = new aws.S3();
s3.config.signatureVersion = "v4";
s3.config.region = "eu-north-1";

export function uploadFile(req: Request, res: Response, nameOfUpload: string) {
    s3.upload({
        Bucket: BUCKET_NAME,
        Key: nameOfUpload,
        Body: fs.createReadStream(req.file.path)
    }, (err, data) => {
        if (err) console.log(err);
        if (data) {
            fs.unlinkSync(req.file.path);

            sendResponse({
                message: "Successfully uploaded file",
                status: 201
            }, res);
        }
    });
}

export function getS3Instance(): aws.S3 {
    return s3;
}