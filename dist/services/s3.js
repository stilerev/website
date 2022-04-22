"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3Instance = exports.deleteFile = exports.uploadFile = void 0;
var aws = require("aws-sdk");
var fs = require("fs");
var httpres_1 = require("./httpres");
var config_1 = __importDefault(require("../config"));
var BUCKET_NAME = "imagestorage";
var s3 = new aws.S3();
s3.config.signatureVersion = "v4";
s3.config.region = "eu-north-1";
//we convert all file names to lower case.
function uploadFile(req, res, name) {
    s3.upload({
        Bucket: BUCKET_NAME,
        Key: name.toLowerCase(),
        Body: fs.createReadStream(req.file.path)
    }, function (err, data) {
        if (err) {
            return httpres_1.sendResponse({
                message: "" + err.message,
                status: 400
            }, res);
        }
        if (data) {
            fs.unlinkSync(req.file.path);
            httpres_1.sendResponse({
                message: config_1.default.messages.files.UPLOADED.replace("%file%", name.toLowerCase()),
                status: 201
            }, res);
        }
    });
}
exports.uploadFile = uploadFile;
function deleteFile(res, name) {
    s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: name.toLowerCase()
    }, function (err, data) {
        if (err) {
            return httpres_1.sendResponse({
                message: "" + err.message,
                status: 400
            }, res);
        }
        if (data) {
            httpres_1.sendResponse({
                message: config_1.default.messages.files.DELETED.replace("%file%", name.toLowerCase()),
                status: 200
            }, res);
        }
    });
}
exports.deleteFile = deleteFile;
function getS3Instance() {
    return s3;
}
exports.getS3Instance = getS3Instance;
