"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
function default_1(req, res, next) {
    var hash = crypto_1.default.createHash("sha512").update(process.env.USR + "").update(process.env.RND + "").digest("hex");
    if (hash !== req.cookies.usr) {
        //Cannot use sendResponse due to redirecting and sending json data at the same time.
        res.set("Content-Type", "text/html");
        return res.status(403).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/"></head></html>');
    }
    next();
}
exports.default = default_1;
