import aws = require("aws-sdk");

export const BUCKET_NAME = "imagestorage"

const s3 = new aws.S3();

s3.config.signatureVersion = "v4";
s3.config.region = "eu-north-1";

export function getFileStream(fileKey: string) {
    const downloadParams = {
        Key: fileKey,
        Bucket: BUCKET_NAME
    }

    return s3.getObject(downloadParams).createReadStream();
}

export async function getFiles() {
    return s3.listObjectsV2({
        Bucket: BUCKET_NAME
    }).promise();
}

export function getMetadata(key:string){
    return s3.headObject({
        Bucket:BUCKET_NAME,
        Key:key
    }).promise();
}