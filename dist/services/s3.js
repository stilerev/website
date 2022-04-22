"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3Instance = exports.deleteFile = exports.editFile = exports.uploadFile = void 0;
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
    return s3.upload({
        Bucket: BUCKET_NAME,
        Key: name.toLowerCase(),
        Body: fs.createReadStream(req.file.path),
        Metadata: {
            "visible": "true"
        }
    }, function (err, data) {
        if (err) {
            return httpres_1.sendResponse({
                message: "" + err.message,
                status: 400
            }, res);
        }
    });
}
exports.uploadFile = uploadFile;
function editFile(res, oldName, image) {
    oldName = oldName.toLowerCase();
    image.name = image.name.toLowerCase();
    s3.copyObject({
        Bucket: BUCKET_NAME,
        CopySource: encodeURI("/" + BUCKET_NAME + "/" + oldName),
        Key: image.name,
        Metadata: {
            visible: image.visible + ""
        },
        MetadataDirective: "REPLACE"
    }, function (err, data) {
        if (err) {
            return httpres_1.sendResponse({
                message: "" + err.message,
                status: 400
            }, res);
        }
        if (data) {
            if (image.name === oldName) {
                return httpres_1.sendResponse({
                    message: "Updated file " + oldName,
                    status: 200
                }, res);
            }
            deleteFile(res, oldName).promise().then(function () {
                httpres_1.sendResponse({
                    message: config_1.default.messages.files.RENAMED.replace("%old%", oldName).replace("%new%", image.name),
                    status: 200
                }, res);
            });
        }
    });
}
exports.editFile = editFile;
function deleteFile(res, name) {
    return s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: name.toLowerCase()
    }, function (err, data) {
        if (err) {
            return httpres_1.sendResponse({
                message: "" + err.message,
                status: 400
            }, res);
        }
    });
}
exports.deleteFile = deleteFile;
function getS3Instance() {
    return s3;
}
exports.getS3Instance = getS3Instance;
