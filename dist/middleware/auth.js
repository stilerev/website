"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config"));
function default_1(req, res, next) {
    if (config_1.default.credentials.PASSWORD_HASH !== req.cookies.user) {
        //Cannot use sendResponse due to redirecting and sending json data at the same time.
        res.set("Content-Type", "text/html");
        return res.status(403).send("<!DOCTYPE html><html><head><meta http-equiv='refresh' content='0; url=/'></head></html>");
    }
    next();
}
exports.default = default_1;
